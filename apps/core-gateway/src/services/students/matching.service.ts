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
    if (team.currentSize >= team.maxSize) return { error: "TEAM_FULL" as const };

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

    const candidateProfiles = candidates.map((c) => ({
      userId: c.user.id,
      username: c.user.username,
      fullName: c.user.fullName,
      avatarUrl: c.user.avatarUrl,
      skills: c.user.skills.map((us) => ({
        name: us.skill.name,
        category: us.skill.category,
        proficiency: us.proficiencyLevel,
        yearsOfExperience: us.yearsOfExperience,
      })),
    }));

    try {
      // Call AI engine
      const response = await fetch(`${AI_ENGINE_URL}/api/v1/matching/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSkills,
          candidates: candidateProfiles,
          openSpots: team.maxSize - team.currentSize,
          limit,
        }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        return { data: aiResult };
      }

      // AI engine unavailable — fall back to basic scoring
      return {
        data: {
          suggestions: StudentMatchingService.basicScoring(teamSkills, candidateProfiles, limit),
          fallback: true,
        },
      };
    } catch {
      // AI engine unreachable — use basic fallback
      return {
        data: {
          suggestions: StudentMatchingService.basicScoring(teamSkills, candidateProfiles, limit),
          fallback: true,
        },
      };
    }
  }

  /**
   * Simple deterministic fallback scoring when AI engine is unavailable.
   * Ranks candidates by skill complementarity (how many skills they have that the team doesn't).
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
    const teamCategories = new Set(teamSkills.map((s) => s.category));

    const scored = candidates.map((candidate) => {
      let score = 0;
      const reasons: string[] = [];
      const complementarySkills: string[] = [];
      const commonSkills: string[] = [];

      for (const skill of candidate.skills) {
        if (!teamSkillNames.has(skill.name)) {
          complementarySkills.push(skill.name);
          score += 10; // New skill
          if (!teamCategories.has(skill.category)) {
            score += 5; // New category
          }
        } else {
          commonSkills.push(skill.name);
          score += 2; // Shared skill (less valuable but still relevant)
        }
      }

      if (complementarySkills.length > 0) {
        reasons.push(`Brings ${complementarySkills.length} complementary skill(s)`);
      }
      if (commonSkills.length > 0) {
        reasons.push(`Shares ${commonSkills.length} skill(s) with team`);
      }

      return {
        candidateId: candidate.userId,
        username: candidate.username,
        fullName: candidate.fullName,
        avatarUrl: candidate.avatarUrl,
        score: Math.min(score, 100),
        reasons,
        skills: candidate.skills.map((s) => ({
          name: s.name,
          proficiency: s.proficiency,
        })),
        complementarySkills,
        commonSkills,
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
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
    if (team.status !== "forming") return { error: "TEAM_NOT_FORMING" as const };
    if (team.currentSize >= team.maxSize) return { error: "TEAM_FULL" as const };

    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: inviterId } },
    });
    if (!membership) return { error: "NOT_A_MEMBER" as const };

    // Verify candidate is valid
    const candidate = await prisma.user.findUnique({ where: { id: candidateUserId } });
    if (!candidate || candidate.role !== "student") return { error: "CANDIDATE_NOT_FOUND" as const };

    const participant = await prisma.hackathonParticipant.findUnique({
      where: { hackathonId_userId: { hackathonId: team.hackathonId, userId: candidateUserId } },
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
        message: "You were suggested as a great match for this team by our AI matching system!",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { data: invitation };
  }
}
