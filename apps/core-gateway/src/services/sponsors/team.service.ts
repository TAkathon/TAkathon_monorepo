import { prisma } from "../../lib/prisma";

export class SponsorTeamService {
  /**
   * View teams for a specific hackathon (sponsor perspective)
   */
  static async listTeams(
    hackathonId: string,
    params: { page?: number; limit?: number; status?: string },
  ) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    // Verify hackathon exists and is not draft
    const hackathon = await prisma.hackathon.findFirst({
      where: { id: hackathonId, status: { not: "draft" } },
      select: { id: true, title: true },
    });

    if (!hackathon) {
      return { error: "NOT_FOUND", message: "Hackathon not found" };
    }

    const where: any = { hackathonId };
    if (params.status) {
      where.status = params.status;
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                  skills: {
                    include: {
                      skill: { select: { id: true, name: true, category: true } },
                    },
                  },
                },
              },
            },
          },
          _count: { select: { members: true } },
        },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      hackathon,
      teams,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get detailed team info (sponsor perspective: project details, members, skills)
   */
  static async getTeamDetail(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        hackathon: {
          select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            githubUrl: true,
            linkedinUrl: true,
            portfolioUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                bio: true,
                githubUrl: true,
                linkedinUrl: true,
                portfolioUrl: true,
                skills: {
                  include: {
                    skill: { select: { id: true, name: true, category: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) return null;

    // Aggregate team skills for the sponsor
    const skillMap = new Map<string, { skill: any; members: string[]; maxProficiency: string }>();
    for (const member of team.members) {
      for (const us of (member.user as any).skills || []) {
        const key = us.skill.id;
        if (!skillMap.has(key)) {
          skillMap.set(key, { skill: us.skill, members: [], maxProficiency: us.proficiencyLevel });
        }
        const entry = skillMap.get(key)!;
        entry.members.push(member.user.fullName);
      }
    }

    return {
      ...team,
      teamSkills: Array.from(skillMap.values()),
    };
  }

  /**
   * Search teams across hackathons by skill or keyword
   */
  static async searchTeams(params: {
    search?: string;
    skillCategory?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      hackathon: { status: { not: "draft" } },
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { projectIdea: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          hackathon: {
            select: { id: true, title: true, status: true, startDate: true, endDate: true },
          },
          creator: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
          _count: { select: { members: true } },
        },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      teams,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
