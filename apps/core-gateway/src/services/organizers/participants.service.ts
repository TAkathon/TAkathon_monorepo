import { prisma } from "../../lib/prisma";

export class OrganizerParticipantService {
  /**
   * Verify the organizer owns this hackathon (reusable helper)
   */
  private static async verifyOwnership(organizerId: string, hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      select: { id: true, organizerId: true },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.organizerId !== organizerId) return { error: "NOT_OWNER" as const };
    return { data: hackathon };
  }

  /**
   * List participants for a hackathon
   */
  static async listParticipants(
    organizerId: string,
    hackathonId: string,
    params: { status?: string; page?: number; perPage?: number },
  ) {
    const ownership = await this.verifyOwnership(organizerId, hackathonId);
    if ("error" in ownership) return ownership;

    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const skip = (page - 1) * perPage;

    const where: any = { hackathonId };
    if (params.status) where.status = params.status;

    const [participants, total] = await Promise.all([
      prisma.hackathonParticipant.findMany({
        where,
        skip,
        take: perPage,
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
        orderBy: { registeredAt: "asc" },
      }),
      prisma.hackathonParticipant.count({ where }),
    ]);

    return {
      data: participants.map((p) => ({
        participantId: p.id,
        status: p.status,
        registeredAt: p.registeredAt,
        teamId: p.teamId,
        user: p.user,
      })),
      meta: { page, perPage, total, hasMore: skip + perPage < total },
    };
  }

  /**
   * List teams for a hackathon
   */
  static async listTeams(
    organizerId: string,
    hackathonId: string,
    params: { status?: string; page?: number; perPage?: number },
  ) {
    const ownership = await this.verifyOwnership(organizerId, hackathonId);
    if ("error" in ownership) return ownership;

    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const skip = (page - 1) * perPage;

    const where: any = { hackathonId };
    if (params.status) where.status = params.status;

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: perPage,
        include: {
          creator: {
            select: { id: true, fullName: true, username: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, fullName: true, username: true, avatarUrl: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      data: teams.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        status: t.status,
        maxSize: t.maxSize,
        currentSize: t.currentSize,
        isPublic: t.isPublic,
        projectIdea: t.projectIdea,
        creator: t.creator,
        members: t.members.map((m) => ({
          id: m.id,
          role: m.role,
          joinedAt: m.joinedAt,
          user: m.user,
        })),
        createdAt: t.createdAt,
      })),
      meta: { page, perPage, total, hasMore: skip + perPage < total },
    };
  }

  /**
   * Get a single team's detailed view (organizer perspective)
   */
  static async getTeamDetail(organizerId: string, hackathonId: string, teamId: string) {
    const ownership = await this.verifyOwnership(organizerId, hackathonId);
    if ("error" in ownership) return ownership;

    const team = await prisma.team.findFirst({
      where: { id: teamId, hackathonId },
      include: {
        creator: {
          select: { id: true, fullName: true, username: true, email: true },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        invitations: {
          where: { status: "pending" },
          select: { id: true, inviteeId: true, status: true, createdAt: true, expiresAt: true },
        },
      },
    });

    if (!team) return { error: "TEAM_NOT_FOUND" as const };

    return {
      data: {
        id: team.id,
        name: team.name,
        description: team.description,
        status: team.status,
        maxSize: team.maxSize,
        currentSize: team.currentSize,
        isPublic: team.isPublic,
        projectIdea: team.projectIdea,
        creator: team.creator,
        members: team.members.map((m) => ({
          id: m.id,
          role: m.role,
          joinedAt: m.joinedAt,
          user: m.user,
        })),
        pendingInvitations: team.invitations,
        openSpots: team.maxSize - team.currentSize,
        createdAt: team.createdAt,
      },
    };
  }
}
