import { prisma } from "../../lib/prisma";

export class StudentTeamService {
  /**
   * List teams the student is a member of
   */
  static async myTeams(userId: string) {
    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            hackathon: {
              select: { id: true, title: true, status: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, fullName: true, username: true, avatarUrl: true },
                },
              },
            },
            _count: { select: { invitations: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return memberships.map((m) => ({
      membershipId: m.id,
      role: m.role,
      joinedAt: m.joinedAt,
      team: {
        id: m.team.id,
        name: m.team.name,
        description: m.team.description,
        status: m.team.status,
        maxSize: m.team.maxSize,
        currentSize: m.team.currentSize,
        isPublic: m.team.isPublic,
        projectIdea: m.team.projectIdea,
        hackathon: m.team.hackathon,
        members: m.team.members.map((tm) => ({
          id: tm.id,
          role: tm.role,
          joinedAt: tm.joinedAt,
          user: tm.user,
        })),
        pendingInvitations: m.team._count.invitations,
      },
    }));
  }

  /**
   * Create a new team for a hackathon
   */
  static async createTeam(
    userId: string,
    data: {
      hackathonId: string;
      name: string;
      description?: string;
      maxSize?: number;
      isPublic?: boolean;
      projectIdea?: string;
    },
  ) {
    // Verify hackathon exists and is active
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: data.hackathonId },
    });
    if (!hackathon) return { error: "HACKATHON_NOT_FOUND" as const };
    if (!["registration_open", "in_progress"].includes(hackathon.status)) {
      return { error: "HACKATHON_NOT_ACTIVE" as const };
    }

    // Verify student is registered for this hackathon
    const participant = await prisma.hackathonParticipant.findUnique({
      where: { hackathonId_userId: { hackathonId: data.hackathonId, userId } },
    });
    if (!participant || participant.status === "withdrawn") {
      return { error: "NOT_REGISTERED" as const };
    }

    // Check if student already has a team in this hackathon
    if (participant.status === "in_team") {
      return { error: "ALREADY_IN_TEAM" as const };
    }

    const maxSize = data.maxSize ?? hackathon.maxTeamSize;
    if (maxSize < hackathon.minTeamSize || maxSize > hackathon.maxTeamSize) {
      return { error: "INVALID_TEAM_SIZE" as const };
    }

    // Create team + add creator as captain in a transaction
    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: data.name,
          hackathonId: data.hackathonId,
          creatorId: userId,
          description: data.description,
          maxSize,
          isPublic: data.isPublic ?? true,
          projectIdea: data.projectIdea,
          currentSize: 1,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId,
          role: "captain",
        },
      });

      // Update participant status
      await tx.hackathonParticipant.update({
        where: { id: participant.id },
        data: { status: "in_team", teamId: newTeam.id },
      });

      return newTeam;
    });

    return { data: team };
  }

  /**
   * Update a team (captain only)
   */
  static async updateTeam(
    userId: string,
    teamId: string,
    data: {
      name?: string;
      description?: string;
      projectIdea?: string;
      isPublic?: boolean;
    },
  ) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };

    // Check if user is the captain
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership || membership.role !== "captain") {
      return { error: "NOT_CAPTAIN" as const };
    }

    const updated = await prisma.team.update({
      where: { id: teamId },
      data,
    });

    return { data: updated };
  }

  /**
   * Delete/disband a team (captain only, team must be in forming status)
   */
  static async deleteTeam(userId: string, teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };
    if (team.creatorId !== userId) return { error: "NOT_CAPTAIN" as const };
    if (team.status !== "forming") return { error: "TEAM_NOT_FORMING" as const };

    await prisma.$transaction(async (tx) => {
      // Reset all members' participant status
      for (const member of team.members) {
        await tx.hackathonParticipant.updateMany({
          where: { userId: member.userId, hackathonId: team.hackathonId },
          data: { status: "registered", teamId: null },
        });
      }

      // Delete all invitations
      await tx.teamInvitation.deleteMany({ where: { teamId } });

      // Delete all members
      await tx.teamMember.deleteMany({ where: { teamId } });

      // Delete team
      await tx.team.delete({ where: { id: teamId } });
    });

    return { success: true };
  }

  /**
   * Invite a user to join the team (captain/members can invite)
   */
  static async inviteToTeam(
    inviterId: string,
    teamId: string,
    data: { userId: string; message?: string },
  ) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };
    if (team.status !== "forming") return { error: "TEAM_NOT_FORMING" as const };
    if (team.currentSize >= team.maxSize) return { error: "TEAM_FULL" as const };

    // Check inviter is a member
    const inviterMembership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: inviterId } },
    });
    if (!inviterMembership) return { error: "NOT_A_MEMBER" as const };

    // Check invitee exists and is a student
    const invitee = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!invitee || invitee.role !== "student") return { error: "INVITEE_NOT_FOUND" as const };

    // Check invitee is registered for this hackathon
    const inviteeParticipant = await prisma.hackathonParticipant.findUnique({
      where: { hackathonId_userId: { hackathonId: team.hackathonId, userId: data.userId } },
    });
    if (!inviteeParticipant || inviteeParticipant.status === "withdrawn") {
      return { error: "INVITEE_NOT_REGISTERED" as const };
    }
    if (inviteeParticipant.status === "in_team") {
      return { error: "INVITEE_ALREADY_IN_TEAM" as const };
    }

    // Check for existing pending invitation
    const existing = await prisma.teamInvitation.findFirst({
      where: { teamId, inviteeId: data.userId, status: "pending" },
    });
    if (existing) return { error: "ALREADY_INVITED" as const };

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        inviterId,
        inviteeId: data.userId,
        message: data.message,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { data: invitation };
  }

  /**
   * List invitations for the student (received)
   */
  static async myInvitations(userId: string) {
    const invitations = await prisma.teamInvitation.findMany({
      where: { inviteeId: userId, status: "pending" },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            hackathonId: true,
            currentSize: true,
            maxSize: true,
            hackathon: { select: { id: true, title: true } },
          },
        },
        inviter: {
          select: { id: true, fullName: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      message: inv.message,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      team: inv.team,
      inviter: inv.inviter,
    }));
  }

  /**
   * Respond to a team invitation (accept/reject)
   */
  static async respondToInvitation(
    userId: string,
    invitationId: string,
    accept: boolean,
  ) {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: { team: true },
    });

    if (!invitation || invitation.inviteeId !== userId) {
      return { error: "INVITATION_NOT_FOUND" as const };
    }
    if (invitation.status !== "pending") {
      return { error: "INVITATION_NOT_PENDING" as const };
    }
    if (invitation.expiresAt < new Date()) {
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: "expired" },
      });
      return { error: "INVITATION_EXPIRED" as const };
    }

    if (!accept) {
      const rejected = await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: "rejected", respondedAt: new Date() },
      });
      return { data: rejected };
    }

    // Accept: check team still has room
    const team = invitation.team;
    if (team.currentSize >= team.maxSize) {
      return { error: "TEAM_FULL" as const };
    }

    // Check user is not already in a team for this hackathon
    const participant = await prisma.hackathonParticipant.findUnique({
      where: {
        hackathonId_userId: { hackathonId: team.hackathonId, userId },
      },
    });
    if (participant?.status === "in_team") {
      return { error: "ALREADY_IN_TEAM" as const };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Accept invitation
      const accepted = await tx.teamInvitation.update({
        where: { id: invitationId },
        data: { status: "accepted", respondedAt: new Date() },
      });

      // Add member
      await tx.teamMember.create({
        data: { teamId: team.id, userId, role: "member" },
      });

      // Update team size
      await tx.team.update({
        where: { id: team.id },
        data: { currentSize: { increment: 1 } },
      });

      // Update participant
      if (participant) {
        await tx.hackathonParticipant.update({
          where: { id: participant.id },
          data: { status: "in_team", teamId: team.id },
        });
      }

      return accepted;
    });

    return { data: result };
  }

  /**
   * Leave a team
   */
  static async leaveTeam(userId: string, teamId: string) {
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership) return { error: "NOT_A_MEMBER" as const };

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "TEAM_NOT_FOUND" as const };

    // Captain cannot leave (must disband or transfer captaincy)
    if (membership.role === "captain") {
      return { error: "CAPTAIN_CANNOT_LEAVE" as const };
    }

    await prisma.$transaction(async (tx) => {
      // Remove member
      await tx.teamMember.delete({
        where: { teamId_userId: { teamId, userId } },
      });

      // Decrement team size
      await tx.team.update({
        where: { id: teamId },
        data: { currentSize: { decrement: 1 } },
      });

      // Reset participant status
      await tx.hackathonParticipant.updateMany({
        where: { userId, hackathonId: team.hackathonId },
        data: { status: "registered", teamId: null },
      });
    });

    return { success: true };
  }

  /**
   * Get a team's details (for a registered participant)
   */
  static async getTeamDetail(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        hackathon: {
          select: { id: true, title: true, status: true },
        },
        members: {
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
        },
        creator: {
          select: { id: true, fullName: true, username: true },
        },
      },
    });

    if (!team) return null;

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      status: team.status,
      maxSize: team.maxSize,
      currentSize: team.currentSize,
      isPublic: team.isPublic,
      projectIdea: team.projectIdea,
      hackathon: team.hackathon,
      creator: team.creator,
      members: team.members.map((m) => ({
        id: m.id,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user,
      })),
      openSpots: team.maxSize - team.currentSize,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
