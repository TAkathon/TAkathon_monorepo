import { prisma } from "../../lib/prisma";

export class OrganizerHackathonService {
  /**
   * List hackathons created by this organizer
   */
  static async myHackathons(organizerId: string) {
    const hackathons = await prisma.hackathon.findMany({
      where: { organizerId },
      include: {
        _count: {
          select: { participants: true, teams: true, sponsorships: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return hackathons.map((h) => ({
      id: h.id,
      title: h.title,
      status: h.status,
      startDate: h.startDate,
      endDate: h.endDate,
      registrationDeadline: h.registrationDeadline,
      location: h.location,
      isVirtual: h.isVirtual,
      maxParticipants: h.maxParticipants,
      participantCount: h._count.participants,
      teamCount: h._count.teams,
      sponsorCount: h._count.sponsorships,
      createdAt: h.createdAt,
    }));
  }

  /**
   * Create a new hackathon
   */
  static async createHackathon(
    organizerId: string,
    data: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      registrationDeadline: string;
      location?: string;
      isVirtual?: boolean;
      maxParticipants?: number;
      maxTeamSize?: number;
      minTeamSize?: number;
      requiredSkills?: string[];
      prizePool?: string;
      rules?: string;
      bannerUrl?: string;
      websiteUrl?: string;
    },
  ) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const registrationDeadline = new Date(data.registrationDeadline);

    // Validate dates
    if (endDate <= startDate) {
      return {
        error: "INVALID_DATES" as const,
        message: "End date must be after start date",
      };
    }
    if (registrationDeadline > startDate) {
      return {
        error: "INVALID_DATES" as const,
        message: "Registration deadline must be before start date",
      };
    }

    const minTeamSize = data.minTeamSize ?? 2;
    const maxTeamSize = data.maxTeamSize ?? 5;
    if (maxTeamSize < minTeamSize) {
      return {
        error: "INVALID_TEAM_SIZE" as const,
        message: "Max team size must be >= min team size",
      };
    }

    const hackathon = await prisma.hackathon.create({
      data: {
        title: data.title,
        description: data.description,
        organizerId,
        startDate,
        endDate,
        registrationDeadline,
        location: data.location,
        isVirtual: data.isVirtual ?? false,
        maxParticipants: data.maxParticipants,
        maxTeamSize,
        minTeamSize,
        requiredSkills: data.requiredSkills ?? [],
        prizePool: data.prizePool,
        rules: data.rules,
        bannerUrl: data.bannerUrl,
        websiteUrl: data.websiteUrl,
        status: "draft",
      },
    });

    return { data: hackathon };
  }

  /**
   * Update a hackathon (organizer only)
   */
  static async updateHackathon(
    organizerId: string,
    hackathonId: string,
    data: {
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      registrationDeadline?: string;
      location?: string;
      isVirtual?: boolean;
      maxParticipants?: number;
      maxTeamSize?: number;
      minTeamSize?: number;
      requiredSkills?: string[];
      prizePool?: string;
      rules?: string;
      bannerUrl?: string;
      websiteUrl?: string;
    },
  ) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.organizerId !== organizerId)
      return { error: "NOT_OWNER" as const };

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.registrationDeadline)
      updateData.registrationDeadline = new Date(data.registrationDeadline);

    const updated = await prisma.hackathon.update({
      where: { id: hackathonId },
      data: updateData,
    });

    return { data: updated };
  }

  /**
   * Publish a hackathon (change status from draft to registration_open)
   */
  static async publishHackathon(organizerId: string, hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.organizerId !== organizerId)
      return { error: "NOT_OWNER" as const };
    if (hackathon.status !== "draft") {
      return {
        error: "INVALID_STATUS" as const,
        message: "Can only publish draft hackathons",
      };
    }

    const updated = await prisma.hackathon.update({
      where: { id: hackathonId },
      data: { status: "registration_open" },
    });

    return { data: updated };
  }

  /**
   * Update hackathon status (e.g., close registration, start, complete)
   */
  static async updateStatus(
    organizerId: string,
    hackathonId: string,
    newStatus: string,
  ) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (hackathon.organizerId !== organizerId)
      return { error: "NOT_OWNER" as const };

    // Valid state transitions
    const transitions: Record<string, string[]> = {
      draft: ["registration_open", "cancelled"],
      registration_open: ["registration_closed", "cancelled"],
      registration_closed: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
    };

    const allowed = transitions[hackathon.status] ?? [];
    if (!allowed.includes(newStatus)) {
      return {
        error: "INVALID_TRANSITION" as const,
        message: `Cannot transition from ${hackathon.status} to ${newStatus}`,
      };
    }

    const updated = await prisma.hackathon.update({
      where: { id: hackathonId },
      data: { status: newStatus as any },
    });

    return { data: updated };
  }

  /**
   * Cancel a hackathon
   */
  static async cancelHackathon(organizerId: string, hackathonId: string) {
    return OrganizerHackathonService.updateStatus(
      organizerId,
      hackathonId,
      "cancelled",
    );
  }

  /**
   * Get hackathon detail (for organizer view with full info)
   */
  static async getHackathonDetail(organizerId: string, hackathonId: string) {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: {
        _count: {
          select: {
            participants: true,
            teams: true,
            sponsorships: true,
            applications: true,
          },
        },
      },
    });
    if (!hackathon) return null;
    if (hackathon.organizerId !== organizerId) return null;

    return {
      ...hackathon,
      participantCount: hackathon._count.participants,
      teamCount: hackathon._count.teams,
      sponsorCount: hackathon._count.sponsorships,
      applicationCount: hackathon._count.applications,
    };
  }
}
