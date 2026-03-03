import { prisma } from "../../lib/prisma";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8001";

export class StudentMatchingService {
  /**
   * Get AI-powered teammate suggestions for a team.
   * Fetches team data and candidates from the database,
   * then calls the AI engine for scoring.
   */
  static async getMatches(userId: string, teamId: string, limit = 5) {
    // Verify user is a member of this team
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership) return { error: "NOT_A_MEMBER" as const };

    // Get team with members and their skills
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              include: {
                skills: { include: { skill: true } },
              },
            },
          },
        },
        hackathon: true,
      },
    });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };
    if (team.currentSize >= team.maxSize)
      return { error: "TEAM_FULL" as const };

    // Get candidate participants (registered but not in a team)
    const candidates = await prisma.hackathonParticipant.findMany({
      where: {
        hackathonId: team.hackathonId,
        status: "registered",
        userId: { notIn: team.members.map((m) => m.userId) },
      },
      include: {
        user: {
          include: {
            skills: { include: { skill: true } },
            studentProfile: true,
          },
        },
      },
    });

    if (candidates.length === 0) {
      return { data: { suggestions: [], message: "No available candidates" } };
    }

    // Build payload for AI engine
    const teamSkills = team.members.flatMap((m) =>
      m.user.skills.map((us) => ({
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiencyLevel,
      })),
    );

    // Collect team member availability for the overlap scorer
    const teamAvailability = team.members
      .map((m) => (m.user as any).studentProfile?.availability)
      .filter(Boolean);

    const candidateProfiles = candidates.map((c) => ({
      userId: c.user.id,
      username: c.user.username,
      fullName: c.user.fullName,
      avatarUrl: c.user.avatarUrl,
      availability: (c.user as any).studentProfile?.availability ?? null,
      skills: c.user.skills.map((us) => ({
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiencyLevel,
        yearsOfExperience: us.yearsOfExperience,
      })),
    }));

    try {
      // Call AI engine
      const response = await fetch(
        `${AI_ENGINE_URL}/api/v1/matching/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamSkills,
            teamAvailability,
            candidates: candidateProfiles,
            openSpots: team.maxSize - team.currentSize,
            limit,
          }),
        },
      );

      if (response.ok) {
        const aiResult = await response.json();
        return { data: aiResult };
      }

      // AI engine unavailable — fall back to basic scoring
      const fallbackSuggestions = StudentMatchingService.basicScoring(
        teamSkills,
        candidateProfiles,
        limit,
      );
      return {
        data: {
          suggestions: fallbackSuggestions,
          totalCandidates: candidateProfiles.length,
          fallback: true,
        },
      };
    } catch {
      // AI engine unreachable — use basic fallback
      const fallbackSuggestions = StudentMatchingService.basicScoring(
        teamSkills,
        candidateProfiles,
        limit,
      );
      return {
        data: {
          suggestions: fallbackSuggestions,
          totalCandidates: candidateProfiles.length,
          fallback: true,
        },
      };
    }
  }

  /**
   * Simple deterministic fallback scoring when AI engine is unavailable.
   * Ranks candidates by skill complementarity (how many skills they have that the team doesn't).
   * Returns the same MatchResult shape as the AI engine (score in [0, 1], scoreBreakdown, explanation).
   */
  static basicScoring(
    teamSkills: Array<{ name: string; category: string; proficiency: string }>,
    candidates: Array<{
      userId: string;
      username: string;
      fullName: string;
      avatarUrl?: string | null;
      skills: Array<{ name: string; category: string; proficiency: string }>;
    }>,
    limit: number,
  ) {
    const teamSkillNames = new Set(teamSkills.map((s) => s.name));
    const MAX_RAW_SCORE = 15; // max per candidate (10 new skill + 5 new category)

    const scored = candidates.map((candidate) => {
      let rawScore = 0;
      const complementarySkills: string[] = [];
      const commonSkills: string[] = [];

      for (const skill of candidate.skills) {
        if (!teamSkillNames.has(skill.name)) {
          complementarySkills.push(skill.name);
          rawScore += 10;
        } else {
          commonSkills.push(skill.name);
          rawScore += 2;
        }
      }

      // Normalise to [0, 1] — cap at expected max to avoid > 1 for large skill sets
      const maxPossible = Math.max(candidate.skills.length * MAX_RAW_SCORE, 1);
      const skillScore = Math.min(rawScore / maxPossible, 1.0);
      // Fallback has no experience/availability data — use neutral 0.5
      const experienceScore = 0.5;
      const availabilityScore = 0.5;
      const overallScore = parseFloat(
        (
          skillScore * 0.4 +
          experienceScore * 0.3 +
          availabilityScore * 0.3
        ).toFixed(3),
      );

      const parts: string[] = [];
      if (complementarySkills.length > 0) {
        const sample = complementarySkills.slice(0, 3).join(", ");
        const extra = complementarySkills.length > 3 ? " and more" : "";
        parts.push(`brings new skills: ${sample}${extra}`);
      } else {
        parts.push("skill set overlaps with the team");
      }
      const explanation = parts.join("; ");

      return {
        candidateId: candidate.userId,
        username: candidate.username,
        fullName: candidate.fullName,
        avatarUrl: candidate.avatarUrl ?? null,
        score: overallScore,
        scoreBreakdown: {
          skill: parseFloat(skillScore.toFixed(3)),
          experience: experienceScore,
          availability: availabilityScore,
        },
        explanation,
        skills: candidate.skills.map((s) => ({
          name: s.name,
          proficiency: s.proficiency,
        })),
        complementarySkills,
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Send an invitation based on a match suggestion
   */
  static async inviteMatch(
    inviterId: string,
    teamId: string,
    candidateUserId: string,
  ) {
    // Reuse the team service invite logic through direct Prisma call
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };
    if (team.status !== "forming")
      return { error: "TEAM_NOT_FORMING" as const };
    if (team.currentSize >= team.maxSize)
      return { error: "TEAM_FULL" as const };

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: inviterId } },
    });
    if (!membership) return { error: "NOT_A_MEMBER" as const };

    // Verify candidate is valid
    const candidate = await prisma.user.findUnique({
      where: { id: candidateUserId },
    });
    if (!candidate || candidate.role !== "student")
      return { error: "CANDIDATE_NOT_FOUND" as const };

    const participant = await prisma.hackathonParticipant.findUnique({
      where: {
        hackathonId_userId: {
          hackathonId: team.hackathonId,
          userId: candidateUserId,
        },
      },
    });
    if (!participant || participant.status !== "registered") {
      return { error: "CANDIDATE_NOT_AVAILABLE" as const };
    }

    // Check existing invitation
    const existing = await prisma.teamInvitation.findFirst({
      where: { teamId, inviteeId: candidateUserId, status: "pending" },
    });
    if (existing) return { error: "ALREADY_INVITED" as const };

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        inviterId,
        inviteeId: candidateUserId,
        message:
          "You were suggested as a great match for this team by our AI matching system!",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { data: invitation };
  }
}
