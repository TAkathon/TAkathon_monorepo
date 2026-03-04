import { prisma } from "../../lib/prisma";
import { NotificationService } from "../shared/notifications.service";

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
            select: {
              id: true,
              fullName: true,
              organization: true,
              avatarUrl: true,
            },
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
          select: {
            id: true,
            fullName: true,
            organization: true,
            avatarUrl: true,
          },
        },
        sponsorships: {
          select: {
            id: true,
            tier: true,
            amount: true,
            status: true,
            sponsor: {
              select: {
                id: true,
                fullName: true,
                organization: true,
                avatarUrl: true,
              },
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
      return {
        error: "HACKATHON_NOT_FOUND",
        message: "Hackathon not found or not available",
      };
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
      return {
        error: "ALREADY_SPONSORING",
        message: "You already have an active sponsorship for this hackathon",
      };
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

    // Notify the hackathon organizer about the new sponsorship request
    if (hackathon.organizerId) {
      const sponsorUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, organization: true },
      });
      const name =
        sponsorUser?.organization || sponsorUser?.fullName || "A sponsor";
      NotificationService.createNotification(
        hackathon.organizerId,
        "SPONSORSHIP_REQUEST_RECEIVED",
        "New Sponsorship Request",
        `${name} wants to sponsor ${sponsorship.hackathon.title} (${data.tier} tier)`,
        `/hackathons/${hackathonId}`,
        { sponsorshipId: sponsorship.id, hackathonId, tier: data.tier },
      ).catch(() => {});
    }

    return { sponsorship };
  }

  /**
   * Get all sponsorships for the current sponsor
   */
  static async mySponsorships(
    userId: string,
    params: { status?: string; page?: number; limit?: number },
  ) {
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
              select: {
                id: true,
                fullName: true,
                organization: true,
                avatarUrl: true,
              },
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
   * Get hackathon overview for a sponsor — stats, top skills, leaderboard, university breakdown.
   * Only accessible if the sponsor has an APPROVED (or paid) sponsorship for this hackathon.
   */
  static async getHackathonOverview(userId: string, hackathonId: string) {
    // Verify sponsorship exists with approved/paid status
    const sponsorship = await prisma.sponsorship.findFirst({
      where: {
        sponsorId: userId,
        hackathonId,
        status: { in: ["approved", "paid"] },
      },
    });

    if (!sponsorship) {
      return {
        error: "NOT_FOUND",
        message: "No approved sponsorship found for this hackathon",
      };
    }

    // Fetch hackathon with organizer
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        organizer: {
          select: {
            id: true,
            fullName: true,
            organization: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    if (!hackathon) {
      return { error: "NOT_FOUND", message: "Hackathon not found" };
    }

    // Get participant + team counts
    const [totalParticipants, totalTeams] = await Promise.all([
      prisma.hackathonParticipant.count({ where: { hackathonId } }),
      prisma.team.count({ where: { hackathonId } }),
    ]);

    // Get participant user IDs for skill + university analysis
    const participantUserIds = await prisma.hackathonParticipant.findMany({
      where: { hackathonId },
      select: { userId: true },
    });
    const userIds = participantUserIds.map((p: any) => p.userId);

    let topSkills: { name: string; count: number }[] = [];
    let universityBreakdown: { university: string; count: number }[] = [];

    if (userIds.length > 0) {
      // Skill distribution across participants
      const skillCounts = await prisma.userSkill.groupBy({
        by: ["skillId"],
        where: { userId: { in: userIds } },
        _count: { skillId: true },
        orderBy: { _count: { skillId: "desc" } },
        take: 10,
      });

      if (skillCounts.length > 0) {
        const skills = await prisma.skill.findMany({
          where: { id: { in: skillCounts.map((s: any) => s.skillId) } },
          select: { id: true, name: true },
        });
        const skillMap = new Map(skills.map((s: any) => [s.id, s.name]));
        topSkills = skillCounts.map((s: any) => ({
          name: skillMap.get(s.skillId) || "Unknown",
          count: s._count.skillId,
        }));
      }

      // University breakdown from student profiles
      const profiles = await prisma.studentProfile.findMany({
        where: { userId: { in: userIds } },
        select: { university: true },
      });
      const uniMap = new Map<string, number>();
      for (const p of profiles) {
        const uni = (p as any).university || "Not specified";
        uniMap.set(uni, (uniMap.get(uni) || 0) + 1);
      }
      universityBreakdown = Array.from(uniMap.entries())
        .map(([university, count]) => ({ university, count }))
        .sort((a, b) => b.count - a.count);
    }

    // Leaderboard — only visible when hackathon is completed
    let leaderboard: {
      rank: number;
      teamName: string;
      projectIdea: string | null;
      memberCount: number;
    }[] = [];
    if (hackathon.status === "completed") {
      const teams = await prisma.team.findMany({
        where: { hackathonId, status: { not: "disbanded" } },
        select: { name: true, projectIdea: true, currentSize: true },
        orderBy: { currentSize: "desc" },
        take: 5,
      });
      leaderboard = teams.map((t: any, idx: number) => ({
        rank: idx + 1,
        teamName: t.name,
        projectIdea: t.projectIdea,
        memberCount: t.currentSize,
      }));
    }

    return {
      data: {
        hackathon: {
          id: hackathon.id,
          title: hackathon.title,
          status: hackathon.status,
          startDate: hackathon.startDate,
          endDate: hackathon.endDate,
          location: hackathon.location,
          isVirtual: hackathon.isVirtual,
          organizer: hackathon.organizer,
        },
        mySponsorship: {
          id: sponsorship.id,
          tier: sponsorship.tier,
          amount: Number(sponsorship.amount),
          status: sponsorship.status,
          createdAt: sponsorship.createdAt,
        },
        stats: { totalParticipants, totalTeams, topSkills },
        leaderboard,
        universityBreakdown,
      },
    };
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
      return {
        error: "CANNOT_CANCEL",
        message: "Only pending sponsorships can be cancelled",
      };
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
