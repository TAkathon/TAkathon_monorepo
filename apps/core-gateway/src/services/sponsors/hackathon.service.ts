import { prisma } from "../../lib/prisma";

export class SponsorHackathonService {
  /**
   * Browse hackathons available for sponsorship (non-draft)
   */
  static async listHackathons(params: {
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
        include: {
          organizer: {
            select: { id: true, fullName: true, organization: true, avatarUrl: true },
          },
          _count: {
            select: { participants: true, teams: true, sponsorships: true },
          },
        },
      }),
      prisma.hackathon.count({ where }),
    ]);

    return {
      hackathons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get hackathon detail for sponsors
   */
  static async getHackathonDetail(hackathonId: string) {
    const hackathon = await prisma.hackathon.findFirst({
      where: { id: hackathonId, status: { not: "draft" } },
      include: {
        organizer: {
          select: { id: true, fullName: true, organization: true, avatarUrl: true },
        },
        sponsorships: {
          select: {
            id: true,
            tier: true,
            amount: true,
            status: true,
            sponsor: {
              select: { id: true, fullName: true, organization: true, avatarUrl: true },
            },
          },
          where: { status: { in: ["approved", "paid"] } },
        },
        _count: {
          select: { participants: true, teams: true, sponsorships: true },
        },
      },
    });

    return hackathon;
  }

  /**
   * Create a sponsorship request for a hackathon
   */
  static async createSponsorship(
    userId: string,
    hackathonId: string,
    data: { tier: string; amount: number },
  ) {
    // Verify hackathon exists and is not draft or cancelled
    const hackathon = await prisma.hackathon.findFirst({
      where: { id: hackathonId, status: { notIn: ["draft", "cancelled"] } },
    });

    if (!hackathon) {
      return { error: "HACKATHON_NOT_FOUND", message: "Hackathon not found or not available" };
    }

    // Check for existing sponsorship
    const existing = await prisma.sponsorship.findFirst({
      where: {
        sponsorId: userId,
        hackathonId,
        status: { in: ["pending", "approved", "paid"] },
      },
    });

    if (existing) {
      return { error: "ALREADY_SPONSORING", message: "You already have an active sponsorship for this hackathon" };
    }

    const sponsorship = await prisma.sponsorship.create({
      data: {
        sponsorId: userId,
        hackathonId,
        tier: data.tier as any,
        amount: data.amount,
        status: "pending",
      },
      include: {
        hackathon: {
          select: { id: true, title: true, startDate: true, endDate: true },
        },
      },
    });

    return { sponsorship };
  }

  /**
   * Get all sponsorships for the current sponsor
   */
  static async mySponsorships(userId: string, params: { status?: string; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { sponsorId: userId };
    if (params.status) {
      where.status = params.status;
    }

    const [sponsorships, total] = await Promise.all([
      prisma.sponsorship.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          hackathon: {
            select: {
              id: true,
              title: true,
              status: true,
              startDate: true,
              endDate: true,
              organizer: {
                select: { id: true, fullName: true, organization: true },
              },
              _count: {
                select: { participants: true, teams: true },
              },
            },
          },
        },
      }),
      prisma.sponsorship.count({ where }),
    ]);

    return {
      sponsorships,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get a specific sponsorship detail
   */
  static async getSponsorshipDetail(userId: string, sponsorshipId: string) {
    const sponsorship = await prisma.sponsorship.findFirst({
      where: { id: sponsorshipId, sponsorId: userId },
      include: {
        hackathon: {
          include: {
            organizer: {
              select: { id: true, fullName: true, organization: true, avatarUrl: true },
            },
            _count: {
              select: { participants: true, teams: true, sponsorships: true },
            },
          },
        },
      },
    });

    return sponsorship;
  }

  /**
   * Cancel a pending sponsorship
   */
  static async cancelSponsorship(userId: string, sponsorshipId: string) {
    const sponsorship = await prisma.sponsorship.findFirst({
      where: { id: sponsorshipId, sponsorId: userId },
    });

    if (!sponsorship) {
      return { error: "NOT_FOUND", message: "Sponsorship not found" };
    }

    if (sponsorship.status !== "pending") {
      return { error: "CANNOT_CANCEL", message: "Only pending sponsorships can be cancelled" };
    }

    const updated = await prisma.sponsorship.update({
      where: { id: sponsorshipId },
      data: { status: "rejected" },
      include: {
        hackathon: {
          select: { id: true, title: true },
        },
      },
    });

    return { sponsorship: updated };
  }
}
