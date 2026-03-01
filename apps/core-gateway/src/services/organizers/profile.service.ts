import { prisma } from "../../lib/prisma";

export class OrganizerProfileService {
  /**
   * Get organizer profile with user data
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organizerProfile: true,
        _count: {
          select: { organizedHackathons: true },
        },
      },
    });

    if (!user || user.role !== "organizer") return null;

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
      organization: user.organization,
      organizationWebsite: user.organizationWebsite,
      organizationName: user.organizerProfile?.organizationName ?? null,
      position: user.organizerProfile?.position ?? null,
      hackathonCount: user._count.organizedHackathons,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update organizer profile
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
      organization?: string;
      organizationWebsite?: string;
      organizationName?: string;
      position?: string;
    },
  ) {
    const { organizationName, position, ...userData } = data;

    await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    const profileData: Record<string, unknown> = {};
    if (organizationName !== undefined) profileData.organizationName = organizationName;
    if (position !== undefined) profileData.position = position;

    if (Object.keys(profileData).length > 0) {
      await prisma.organizerProfile.upsert({
        where: { userId },
        create: {
          userId,
          organizationName: organizationName ?? "Unknown",
          ...profileData,
        },
        update: profileData,
      });
    }

    return OrganizerProfileService.getProfile(userId);
  }
}
