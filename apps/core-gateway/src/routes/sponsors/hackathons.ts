import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireSponsor } from "../../middleware/rbac";
import { SponsorHackathonService } from "../../services/sponsors/hackathon.service";
import { SponsorTeamService } from "../../services/sponsors/team.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireSponsor);

/**
 * GET /api/v1/sponsors/hackathons
 * Browse hackathons available for sponsorship
 */
router.get("/", async (req: any, res) => {
  const { page, limit, search, status } = req.query;
  const result = await SponsorHackathonService.listHackathons({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    status: status as string,
  });
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/sponsors/hackathons/sponsorships
 * My sponsorships across all hackathons
 */
router.get("/sponsorships", async (req: any, res) => {
  const { status, page, limit } = req.query;
  const result = await SponsorHackathonService.mySponsorships(req.user.sub, {
    status: status as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/sponsors/hackathons/sponsorships/:sponsorshipId
 * Get sponsorship detail
 */
router.get("/sponsorships/:sponsorshipId", async (req: any, res) => {
  const sponsorship = await SponsorHackathonService.getSponsorshipDetail(
    req.user.sub,
    req.params.sponsorshipId,
  );
  if (!sponsorship) {
    return ResponseHandler.error(
      res,
      "NOT_FOUND",
      "Sponsorship not found",
      404,
    );
  }
  return ResponseHandler.success(res, sponsorship);
});

/**
 * GET /api/v1/sponsors/hackathons/:id
 * View hackathon detail
 */
router.get("/:id", async (req: any, res) => {
  const hackathon = await SponsorHackathonService.getHackathonDetail(
    req.params.id,
  );
  if (!hackathon) {
    return ResponseHandler.error(res, "NOT_FOUND", "Hackathon not found", 404);
  }
  return ResponseHandler.success(res, hackathon);
});

/**
 * POST /api/v1/sponsors/hackathons/:id/sponsor
 * Create a sponsorship for a hackathon
 */
const sponsorSchema = z.object({
  tier: z.enum(["platinum", "gold", "silver", "bronze", "other"]),
  amount: z.number().positive(),
});

router.post("/:id/sponsor", async (req: any, res) => {
  const parsed = sponsorSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(
      res,
      "VALIDATION_ERROR",
      "Invalid payload",
      400,
      parsed.error.format(),
    );
  }

  const result = await SponsorHackathonService.createSponsorship(
    req.user.sub,
    req.params.id,
    parsed.data,
  );

  if ("error" in result) {
    const status = result.error === "HACKATHON_NOT_FOUND" ? 404 : 409;
    return ResponseHandler.error(res, result.error, result.message, status);
  }

  return ResponseHandler.success(res, result.sponsorship, 201);
});

/**
 * POST /api/v1/sponsors/hackathons/sponsorships/:sponsorshipId/cancel
 * Cancel a pending sponsorship
 */
router.post("/sponsorships/:sponsorshipId/cancel", async (req: any, res) => {
  const result = await SponsorHackathonService.cancelSponsorship(
    req.user.sub,
    req.params.sponsorshipId,
  );

  if ("error" in result) {
    const status = result.error === "NOT_FOUND" ? 404 : 409;
    return ResponseHandler.error(res, result.error, result.message, status);
  }

  return ResponseHandler.success(res, result.sponsorship);
});

/**
 * GET /api/v1/sponsors/hackathons/:id/teams
 * View teams for a specific hackathon
 */
router.get("/:id/teams", async (req: any, res) => {
  const { page, limit, status } = req.query;
  const result = await SponsorTeamService.listTeams(req.params.id, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    status: status as string,
  });

  if ("error" in result) {
    return ResponseHandler.error(res, result.error, result.message, 404);
  }

  return ResponseHandler.success(res, result);
});

export default router;
