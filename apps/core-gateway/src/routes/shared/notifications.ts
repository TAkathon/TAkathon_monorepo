import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { NotificationService } from "../../services/shared/notifications.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

// All notification routes require authentication (any role)
router.use(requireAuth);

/**
 * GET /api/v1/notifications
 * Returns paginated notifications for the current user.
 * Query: ?page=1&limit=20&unreadOnly=false
 */
router.get("/", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const unreadOnly = req.query.unreadOnly === "true";

    const result = await NotificationService.getUserNotifications(userId, {
      page,
      limit,
      unreadOnly,
    });

    ResponseHandler.success(res, result);
  } catch (err: any) {
    ResponseHandler.error(res, "INTERNAL_ERROR", err.message, 500);
  }
});

/**
 * GET /api/v1/notifications/unread-count
 * Lightweight endpoint for the notification bell badge.
 */
router.get("/unread-count", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const result = await NotificationService.getUnreadCount(userId);
    ResponseHandler.success(res, result);
  } catch (err: any) {
    ResponseHandler.error(res, "INTERNAL_ERROR", err.message, 500);
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Marks a single notification as read.
 */
router.patch("/:id/read", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await NotificationService.markAsRead(userId, id);
    if ("error" in result) {
      return ResponseHandler.error(
        res,
        result.error ?? "NOT_FOUND",
        "Notification not found",
        404,
      );
    }
    ResponseHandler.success(res, result.data);
  } catch (err: any) {
    ResponseHandler.error(res, "INTERNAL_ERROR", err.message, 500);
  }
});

/**
 * PATCH /api/v1/notifications/read-all
 * Marks all notifications as read for the current user.
 */
router.patch("/read-all", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const result = await NotificationService.markAllAsRead(userId);
    ResponseHandler.success(res, result);
  } catch (err: any) {
    ResponseHandler.error(res, "INTERNAL_ERROR", err.message, 500);
  }
});

/**
 * DELETE /api/v1/notifications/:id
 * Deletes a notification.
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await NotificationService.deleteNotification(userId, id);
    if ("error" in result) {
      return ResponseHandler.error(
        res,
        result.error ?? "NOT_FOUND",
        "Notification not found",
        404,
      );
    }
    ResponseHandler.success(res, { deleted: true });
  } catch (err: any) {
    ResponseHandler.error(res, "INTERNAL_ERROR", err.message, 500);
  }
});

export default router;
