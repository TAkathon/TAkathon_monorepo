import { prisma } from "../../lib/prisma";

export class OrganizerAnalyticsService {
  /**
   * Verify the organizer owns this hackathon
   */
  private static async verifyOwnership(organizerId: string, hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      select: { id: true, organizerId: true, title: true },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.organizerId !== organizerId) return { error: "NOT_OWNER" as const };
    return { data: hackathon };
  }

  /**
   * Get hackathon analytics/stats
   */
  static async getAnalytics(organizerId: string, hackathonId: string) {
    const ownership = await this.verifyOwnership(organizerId, hackathonId);
    if ("error" in ownership) return ownership;

    const [
      totalParticipants,
      registeredCount,
      inTeamCount,
      withdrawnCount,
      totalTeams,
      formingTeams,
      completeTeams,
      totalSponsors,
    ] = await Promise.all([
      prisma.hackathonParticipant.count({ where: { hackathonId } }),
      prisma.hackathonParticipant.count({ where: { hackathonId, status: "registered" } }),
      prisma.hackathonParticipant.count({ where: { hackathonId, status: "in_team" } }),
      prisma.hackathonParticipant.count({ where: { hackathonId, status: "withdrawn" } }),
      prisma.team.count({ where: { hackathonId } }),
      prisma.team.count({ where: { hackathonId, status: "forming" } }),
      prisma.team.count({ where: { hackathonId, status: "complete" } }),
      prisma.sponsorship.count({ where: { hackathonId } }),
    ]);

    // Compute average team size
    const teams = await prisma.team.findMany({
      where: { hackathonId },
      select: { currentSize: true },
    });
    const averageTeamSize =
      teams.length > 0
        ? Math.round((teams.reduce((sum, t) => sum + t.currentSize, 0) / teams.length) * 100) / 100
        : 0;

    // Get skill distribution across participants
    const participantUserIds = await prisma.hackathonParticipant.findMany({
      where: { hackathonId, status: { not: "withdrawn" } },
      select: { userId: true },
    });
    const userIds = participantUserIds.map((p) => p.userId);

    const skills = await prisma.userSkill.findMany({
      where: { userId: { in: userIds } },
      include: { skill: { select: { name: true, category: true } } },
    });

    const skillDistribution: Record<string, number> = {};
    const categoryDistribution: Record<string, number> = {};
    for (const us of skills) {
      skillDistribution[us.skill.name] = (skillDistribution[us.skill.name] ?? 0) + 1;
      categoryDistribution[us.skill.category] = (categoryDistribution[us.skill.category] ?? 0) + 1;
    }

    return {
      data: {
        hackathonId,
        participants: {
          total: totalParticipants,
          registered: registeredCount,
          inTeam: inTeamCount,
          withdrawn: withdrawnCount,
        },
        teams: {
          total: totalTeams,
          forming: formingTeams,
          complete: completeTeams,
          averageSize: averageTeamSize,
        },
        sponsors: {
          total: totalSponsors,
        },
        participantsWithoutTeam: registeredCount,
        skillDistribution,
        categoryDistribution,
      },
    };
  }

  /**
   * Export hackathon data as JSON (participants, teams, stats)
   */
  static async exportData(organizerId: string, hackathonId: string) {
    const ownership = await this.verifyOwnership(organizerId, hackathonId);
    if ("error" in ownership) return ownership;

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
        teams: {
          include: {
            creator: {
              select: { id: true, fullName: true, username: true, email: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, fullName: true, username: true, email: true },
                },
              },
            },
          },
        },
        sponsorships: {
          include: {
            sponsor: {
              select: { id: true, fullName: true, email: true, organization: true },
            },
          },
        },
      },
    });

    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };

    return {
      data: {
        hackathon: {
          id: hackathon.id,
          title: hackathon.title,
          description: hackathon.description,
          status: hackathon.status,
          startDate: hackathon.startDate,
          endDate: hackathon.endDate,
          registrationDeadline: hackathon.registrationDeadline,
          location: hackathon.location,
          isVirtual: hackathon.isVirtual,
        },
        participants: hackathon.participants.map((p) => ({
          participantId: p.id,
          status: p.status,
          registeredAt: p.registeredAt,
          teamId: p.teamId,
          user: p.user,
        })),
        teams: hackathon.teams.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          status: t.status,
          currentSize: t.currentSize,
          maxSize: t.maxSize,
          projectIdea: t.projectIdea,
          creator: t.creator,
          members: t.members.map((m) => ({
            role: m.role,
            joinedAt: m.joinedAt,
            user: m.user,
          })),
        })),
        sponsorships: hackathon.sponsorships.map((s) => ({
          id: s.id,
          tier: s.tier,
          amount: s.amount,
          status: s.status,
          sponsor: s.sponsor,
        })),
        exportedAt: new Date().toISOString(),
      },
    };
  }
}
