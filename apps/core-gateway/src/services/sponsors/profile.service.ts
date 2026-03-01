import { prisma } from "../../lib/prisma";

export class SponsorProfileService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sponsorProfile: true,
        _count: { select: { sponsorships: true } },
      },
    });

    if (!user || user.role !== "sponsor") return null;

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
      companyName: user.sponsorProfile?.companyName ?? null,
      industry: user.sponsorProfile?.industry ?? null,
      websiteUrl: user.sponsorProfile?.websiteUrl ?? null,
      logoUrl: user.sponsorProfile?.logoUrl ?? null,
      sponsorshipCount: user._count.sponsorships,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      bio?: string;
      avatarUrl?: string;
      organization?: string;
      organizationWebsite?: string;
      companyName?: string;
      industry?: string;
      websiteUrl?: string;
      logoUrl?: string;
    },
  ) {
    const { companyName, industry, websiteUrl, logoUrl, ...userData } = data;

    await prisma.user.update({ where: { id: userId }, data: userData });

    const profileData: Record<string, unknown> = {};
    if (companyName !== undefined) profileData.companyName = companyName;
    if (industry !== undefined) profileData.industry = industry;
    if (websiteUrl !== undefined) profileData.websiteUrl = websiteUrl;
    if (logoUrl !== undefined) profileData.logoUrl = logoUrl;

    if (Object.keys(profileData).length > 0) {
      await prisma.sponsorProfile.upsert({
        where: { userId },
        create: { userId, companyName: companyName ?? "Unknown", ...profileData },
        update: profileData,
      });
    }

    return SponsorProfileService.getProfile(userId);
  }
}
