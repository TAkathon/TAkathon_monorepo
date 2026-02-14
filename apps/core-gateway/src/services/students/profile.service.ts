import { prisma } from "../../lib/prisma";

export class StudentProfileService {
  /**
   * Get student profile with user data and skills
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!user || user.role !== "student") return null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      githubUrl: user.githubUrl,
      linkedinUrl: user.linkedinUrl,
      portfolioUrl: user.portfolioUrl,
      university: user.studentProfile?.university ?? null,
      degree: user.studentProfile?.degree ?? null,
      graduationYear: user.studentProfile?.graduationYear ?? null,
      resumeUrl: user.studentProfile?.resumeUrl ?? null,
      skills: user.skills.map((us) => ({
        id: us.id,
        skillId: us.skillId,
        skillName: us.skill.name,
        category: us.skill.category,
        proficiencyLevel: us.proficiencyLevel,
        yearsOfExperience: us.yearsOfExperience,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update student profile (user fields + student-specific fields)
   */
  static async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      bio?: string;
      avatarUrl?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      university?: string;
      degree?: string;
      graduationYear?: number;
      resumeUrl?: string;
    },
  ) {
    const { university, degree, graduationYear, resumeUrl, ...userData } = data;

    // Update user fields
    await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    // Upsert student profile fields
    const studentProfileData: Record<string, unknown> = {};
    if (university !== undefined) studentProfileData.university = university;
    if (degree !== undefined) studentProfileData.degree = degree;
    if (graduationYear !== undefined) studentProfileData.graduationYear = graduationYear;
    if (resumeUrl !== undefined) studentProfileData.resumeUrl = resumeUrl;

    if (Object.keys(studentProfileData).length > 0) {
      await prisma.studentProfile.upsert({
        where: { userId },
        create: { userId, ...studentProfileData } as any,
        update: studentProfileData,
      });
    }

    return StudentProfileService.getProfile(userId);
  }

  /**
   * Add a skill to the student's profile
   */
  static async addSkill(
    userId: string,
    data: {
      skillId: string;
      proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
      yearsOfExperience?: number;
    },
  ) {
    // Verify skill exists
    const skill = await prisma.skill.findUnique({ where: { id: data.skillId } });
    if (!skill) return { error: "SKILL_NOT_FOUND" as const };

    // Check if user already has this skill
    const existing = await prisma.userSkill.findUnique({
      where: { userId_skillId: { userId, skillId: data.skillId } },
    });
    if (existing) return { error: "SKILL_ALREADY_EXISTS" as const };

    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId: data.skillId,
        proficiencyLevel: data.proficiencyLevel as any,
        yearsOfExperience: data.yearsOfExperience,
      },
      include: { skill: true },
    });

    return {
      data: {
        id: userSkill.id,
        skillId: userSkill.skillId,
        skillName: userSkill.skill.name,
        category: userSkill.skill.category,
        proficiencyLevel: userSkill.proficiencyLevel,
        yearsOfExperience: userSkill.yearsOfExperience,
      },
    };
  }

  /**
   * Remove a skill from the student's profile
   */
  static async removeSkill(userId: string, userSkillId: string) {
    const userSkill = await prisma.userSkill.findUnique({
      where: { id: userSkillId },
    });

    if (!userSkill || userSkill.userId !== userId) {
      return { error: "SKILL_NOT_FOUND" as const };
    }

    await prisma.userSkill.delete({ where: { id: userSkillId } });
    return { success: true };
  }
}
