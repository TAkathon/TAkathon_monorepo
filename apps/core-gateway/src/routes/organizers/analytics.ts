import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireOrganizer } from "../../middleware/rbac";
import { OrganizerAnalyticsService } from "../../services/organizers/analytics.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireOrganizer);

/**
 * GET /api/v1/organizers/hackathons/:id/analytics
 * Get hackathon analytics
 */
router.get("/:id/analytics", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await OrganizerAnalyticsService.getAnalytics(req.user.sub, parsed.data);

  if ("error" in result) {
    const statusMap: Record<string, number> = { NOT_OWNER: 403, HACKATHON_NOT_FOUND: 404 };
    return ResponseHandler.error(res, result.error, result.error, statusMap[result.error] ?? 400);
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * GET /api/v1/organizers/hackathons/:id/export
 * Export hackathon data
 */
router.get("/:id/export", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await OrganizerAnalyticsService.exportData(req.user.sub, parsed.data);

  if ("error" in result) {
    const statusMap: Record<string, number> = { NOT_OWNER: 403, HACKATHON_NOT_FOUND: 404 };
    return ResponseHandler.error(res, result.error, result.error, statusMap[result.error] ?? 400);
  }

  return ResponseHandler.success(res, result.data);
});

export default router;
