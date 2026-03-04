import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export class StudentSettingsService {
  /**
   * Verify current password, then hash + persist the new one.
   * Returns true on success; throws descriptive errors otherwise.
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw Object.assign(new Error("User not found"), { status: 404 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error("Current password is incorrect"), {
        status: 400,
        code: "WRONG_PASSWORD",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  /**
   * Hard-delete the user record (Prisma cascades handle related rows).
   * Verifies password + "DELETE" confirmation text before proceeding.
   */
  static async deleteAccount(userId: string, password: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw Object.assign(new Error("User not found"), { status: 404 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error("Password is incorrect"), {
        status: 400,
        code: "WRONG_PASSWORD",
      });
    }

    // Delete in dependency order to avoid FK violations on DBs without cascade
    await prisma.$transaction(async (tx: any) => {
      // Remove team memberships
      await tx.teamMember.deleteMany({ where: { userId } });
      // Remove invitations sent or received
      await tx.teamInvitation.deleteMany({
        where: { OR: [{ senderId: userId }, { inviteeId: userId }] },
      });
      // Remove hackathon participations
      await tx.hackathonParticipant.deleteMany({ where: { userId } });
      // Remove user skills
      await tx.userSkill.deleteMany({ where: { userId } });
      // Remove student profile
      await tx.studentProfile.deleteMany({ where: { userId } });
      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
