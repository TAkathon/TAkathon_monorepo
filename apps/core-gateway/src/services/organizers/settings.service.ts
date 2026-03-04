import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export class OrganizerSettingsService {
  /**
   * Verify current password, then hash + persist the new one.
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
   * Hard-delete the organizer — cancels DRAFT/PUBLISHED hackathons, then cascade-deletes.
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

    await prisma.$transaction(async (tx: any) => {
      // Cancel all DRAFT or registration_open hackathons owned by this organizer
      await tx.hackathon.updateMany({
        where: {
          organizerId: userId,
          status: { in: ["draft", "registration_open"] },
        },
        data: { status: "cancelled" },
      });

      // Remove organizer profile
      await tx.organizerProfile.deleteMany({ where: { userId } });

      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
