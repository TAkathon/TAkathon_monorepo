import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireOrganizer } from "../../middleware/rbac";
import { OrganizerProfileService } from "../../services/organizers/profile.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireOrganizer);

/**
 * GET /api/v1/organizers/profile
 * Get the authenticated organizer's profile
 */
router.get("/profile", async (req: any, res) => {
  const profile = await OrganizerProfileService.getProfile(req.user.sub);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Organizer profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

/**
 * PUT /api/v1/organizers/profile
 * Update the authenticated organizer's profile
 */
const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  organization: z.string().max(255).optional(),
  organizationWebsite: z.string().url().optional(),
  organizationName: z.string().max(255).optional(),
  position: z.string().max(255).optional(),
});

router.put("/profile", async (req: any, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const profile = await OrganizerProfileService.updateProfile(req.user.sub, parsed.data);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Organizer profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

export default router;
