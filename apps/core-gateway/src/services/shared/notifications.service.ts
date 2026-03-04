import { prisma } from "../../lib/prisma";

export class NotificationService {
  /**
   * Create a notification for a user.
   * Called from other services whenever a relevant event occurs.
   */
  static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    actionUrl?: string,
    metadata?: Record<string, unknown>,
  ) {
    return (prisma as any).notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl,
        metadata: metadata ?? undefined,
      },
    });
  }

  /**
   * Get paginated notifications for a user.
   */
  static async getUserNotifications(
    userId: string,
    params: { page?: number; limit?: number; unreadOnly?: boolean },
  ) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (params.unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      (prisma as any).notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      (prisma as any).notification.count({ where }),
      (prisma as any).notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount, page, limit };
  }

  /**
   * Get unread count for a user (lightweight query for the bell badge).
   */
  static async getUnreadCount(userId: string) {
    const count = await (prisma as any).notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  /**
   * Mark a single notification as read.
   */
  static async markAsRead(userId: string, notificationId: string) {
    const notification = await (prisma as any).notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) return { error: "NOT_FOUND" as const };

    const updated = await (prisma as any).notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { data: updated };
  }

  /**
   * Mark all notifications as read for a user.
   */
  static async markAllAsRead(userId: string) {
    const result = await (prisma as any).notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { count: result.count };
  }

  /**
   * Delete a single notification.
   */
  static async deleteNotification(userId: string, notificationId: string) {
    const notification = await (prisma as any).notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!notification) return { error: "NOT_FOUND" as const };

    await (prisma as any).notification.delete({
      where: { id: notificationId },
    });
    return { success: true };
  }
}
