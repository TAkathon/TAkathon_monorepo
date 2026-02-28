import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { requireSponsor } from "../../middleware/rbac";
import { SponsorTeamService } from "../../services/sponsors/team.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireSponsor);

/**
 * GET /api/v1/sponsors/teams/search
 * Search teams across all hackathons
 */
router.get("/search", async (req: any, res) => {
  const { search, skillCategory, page, limit } = req.query;
  const result = await SponsorTeamService.searchTeams({
    search: search as string,
    skillCategory: skillCategory as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/sponsors/teams/:id
 * Get team project details (for talent discovery)
 */
router.get("/:id", async (req: any, res) => {
  const team = await SponsorTeamService.getTeamDetail(req.params.id);
  if (!team) {
    return ResponseHandler.error(res, "NOT_FOUND", "Team not found", 404);
  }
  return ResponseHandler.success(res, team);
});

/**
 * GET /api/v1/sponsors/hackathons/:id/teams
 * View teams for a hackathon (mounted on hackathons router)
 */

export default router;
