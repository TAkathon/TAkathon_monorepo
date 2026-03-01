import { prisma } from "../../lib/prisma";

export class SkillService {
  /**
   * List all skills, optionally filtered by category
   */
  static async listSkills(params: { category?: string; search?: string }) {
    const where: any = {};

    if (params.category) {
      where.category = params.category;
    }

    if (params.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        _count: { select: { userSkills: true } },
      },
    });

    return skills;
  }

  /**
   * Get skill categories with counts
   */
  static async getCategories() {
    const skills = await prisma.skill.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    return skills.map((s) => ({
      category: s.category,
      count: s._count.id,
    }));
  }

  /**
   * Get a single skill detail with usage stats
   */
  static async getSkillDetail(skillId: string) {
    return prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        _count: { select: { userSkills: true } },
      },
    });
  }
}
