import { prisma } from "../../lib/prisma";

export class SharedHackathonService {
  /**
   * Public hackathon listing (no auth required)
   * Only shows non-draft hackathons
   */
  static async listPublicHackathons(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      status: { not: "draft" },
    };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { location: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    const [hackathons, total] = await Promise.all([
      prisma.hackathon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
          registrationDeadline: true,
          location: true,
          isVirtual: true,
          maxParticipants: true,
          maxTeamSize: true,
          minTeamSize: true,
          prizePool: true,
          bannerUrl: true,
          websiteUrl: true,
          createdAt: true,
          organizer: {
            select: { id: true, fullName: true, organization: true, avatarUrl: true },
          },
          _count: {
            select: { participants: true, teams: true },
          },
        },
      }),
      prisma.hackathon.count({ where }),
    ]);

    return {
      hackathons,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Public hackathon detail
   */
  static async getPublicHackathonDetail(hackathonId: string) {
    return prisma.hackathon.findFirst({
      where: { id: hackathonId, status: { not: "draft" } },
      include: {
        organizer: {
          select: { id: true, fullName: true, organization: true, avatarUrl: true },
        },
        _count: {
          select: { participants: true, teams: true, sponsorships: true },
        },
      },
    });
  }
}
