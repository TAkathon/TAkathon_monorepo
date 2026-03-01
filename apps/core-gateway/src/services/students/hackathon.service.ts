import { prisma } from "../../lib/prisma";

export class StudentHackathonService {
  /**
   * Browse/list hackathons with optional filters (for students)
   */
  static async listHackathons(params: {
    status?: string;
    search?: string;
    page?: number;
    perPage?: number;
  }) {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 10;
    const skip = (page - 1) * perPage;

    const where: any = {};

    // Students only see non-draft hackathons
    if (params.status) {
      where.status = params.status;
    } else {
      where.status = { not: "draft" };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [hackathons, total] = await Promise.all([
      prisma.hackathon.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { startDate: "asc" },
        include: {
          organizer: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: { participants: true, teams: true },
          },
        },
      }),
      prisma.hackathon.count({ where }),
    ]);

    return {
      data: hackathons.map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description,
        status: h.status,
        startDate: h.startDate,
        endDate: h.endDate,
        registrationDeadline: h.registrationDeadline,
        location: h.location,
        isVirtual: h.isVirtual,
        maxParticipants: h.maxParticipants,
        maxTeamSize: h.maxTeamSize,
        minTeamSize: h.minTeamSize,
        prizePool: h.prizePool,
        bannerUrl: h.bannerUrl,
        organizer: h.organizer,
        participantCount: h._count.participants,
        teamCount: h._count.teams,
      })),
      meta: {
        page,
        perPage,
        total,
        hasMore: skip + perPage < total,
      },
    };
  }

  /**
   * Get hackathon detail
   */
  static async getHackathonDetail(hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        organizer: {
          select: { id: true, fullName: true, username: true, avatarUrl: true },
        },
        _count: {
          select: { participants: true, teams: true },
        },
      },
    });

    if (!hackathon || hackathon.status === "draft") return null;

    return {
      ...hackathon,
      organizer: hackathon.organizer,
      participantCount: hackathon._count.participants,
      teamCount: hackathon._count.teams,
    };
  }

  /**
   * Register for a hackathon
   */
  static async register(userId: string, hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.status !== "registration_open") {
      return { error: "REGISTRATION_CLOSED" as const };
    }

    if (hackathon.registrationDeadline < new Date()) {
      return { error: "REGISTRATION_DEADLINE_PASSED" as const };
    }

    // Check max participants
    if (hackathon.maxParticipants) {
      const count = await prisma.hackathonParticipant.count({
        where: { hackathonId },
      });
      if (count >= hackathon.maxParticipants) {
        return { error: "HACKATHON_FULL" as const };
      }
    }

    // Check if already registered
    const existing = await prisma.hackathonParticipant.findUnique({
      where: { hackathonId_userId: { hackathonId, userId } },
    });
    if (existing) {
      if (existing.status === "withdrawn") {
        // Re-register
        const updated = await prisma.hackathonParticipant.update({
          where: { id: existing.id },
          data: { status: "registered", registeredAt: new Date() },
        });
        return { data: updated };
      }
      return { error: "ALREADY_REGISTERED" as const };
    }

    const participant = await prisma.hackathonParticipant.create({
      data: {
        hackathonId,
        userId,
        status: "registered",
      },
    });

    return { data: participant };
  }

  /**
   * Withdraw from a hackathon
   */
  static async withdraw(userId: string, hackathonId: string) {
    const participant = await prisma.hackathonParticipant.findUnique({
      where: { hackathonId_userId: { hackathonId, userId } },
    });

    if (!participant || participant.status === "withdrawn") {
      return { error: "NOT_REGISTERED" as const };
    }

    // If in a team, prevent withdrawal (they should leave team first)
    if (participant.status === "in_team") {
      return { error: "IN_TEAM" as const };
    }

    const updated = await prisma.hackathonParticipant.update({
      where: { id: participant.id },
      data: { status: "withdrawn" },
    });

    return { data: updated };
  }

  /**
   * List hackathons the student is registered for
   */
  static async myHackathons(userId: string) {
    const participations = await prisma.hackathonParticipant.findMany({
      where: { userId, status: { not: "withdrawn" } },
      include: {
        hackathon: {
          include: {
            organizer: {
              select: { id: true, fullName: true, username: true },
            },
            _count: {
              select: { participants: true, teams: true },
            },
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return participations.map((p) => ({
      participantId: p.id,
      status: p.status,
      registeredAt: p.registeredAt,
      teamId: p.teamId,
      hackathon: {
        id: p.hackathon.id,
        title: p.hackathon.title,
        status: p.hackathon.status,
        startDate: p.hackathon.startDate,
        endDate: p.hackathon.endDate,
        organizer: p.hackathon.organizer,
        participantCount: p.hackathon._count.participants,
        teamCount: p.hackathon._count.teams,
      },
    }));
  }

  /**
   * List participants in a hackathon (for students to see fellow participants)
   */
  static async listParticipants(
    hackathonId: string,
    params: { page?: number; perPage?: number },
  ) {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const skip = (page - 1) * perPage;

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) return null;

    const [participants, total] = await Promise.all([
      prisma.hackathonParticipant.findMany({
        where: { hackathonId, status: { not: "withdrawn" } },
        skip,
        take: perPage,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
        orderBy: { registeredAt: "asc" },
      }),
      prisma.hackathonParticipant.count({
        where: { hackathonId, status: { not: "withdrawn" } },
      }),
    ]);

    return {
      data: participants.map((p) => ({
        participantId: p.id,
        status: p.status,
        registeredAt: p.registeredAt,
        user: p.user,
      })),
      meta: { page, perPage, total, hasMore: skip + perPage < total },
    };
  }
}
