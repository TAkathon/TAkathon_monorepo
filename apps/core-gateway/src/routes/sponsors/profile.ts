import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireSponsor } from "../../middleware/rbac";
import { SponsorProfileService } from "../../services/sponsors/profile.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireSponsor);

/**
 * GET /api/v1/sponsors/profile
 */
router.get("/profile", async (req: any, res) => {
  const profile = await SponsorProfileService.getProfile(req.user.sub);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Sponsor profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

/**
 * PUT /api/v1/sponsors/profile
 */
const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  organization: z.string().max(255).optional(),
  organizationWebsite: z.string().url().optional(),
  companyName: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
});

router.put("/profile", async (req: any, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }
  const profile = await SponsorProfileService.updateProfile(req.user.sub, parsed.data);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Sponsor profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

export default router;
