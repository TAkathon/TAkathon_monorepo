import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireOrganizer } from "../../middleware/rbac";
import { OrganizerParticipantService } from "../../services/organizers/participants.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireOrganizer);

/**
 * GET /api/v1/organizers/hackathons/:id/participants
 * List participants in a hackathon
 */
router.get("/:id/participants", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const { status, page, perPage } = req.query;
  const result = await OrganizerParticipantService.listParticipants(req.user.sub, parsed.data, {
    status: status as string | undefined,
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
  });

  if ("error" in result) {
    const statusMap: Record<string, number> = { NOT_OWNER: 403, HACKATHON_NOT_FOUND: 404 };
    return ResponseHandler.error(res, result.error, result.error, statusMap[result.error] ?? 400);
  }

  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/organizers/hackathons/:id/teams
 * List teams in a hackathon
 */
router.get("/:id/teams", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const { status, page, perPage } = req.query;
  const result = await OrganizerParticipantService.listTeams(req.user.sub, parsed.data, {
    status: status as string | undefined,
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
  });

  if ("error" in result) {
    const statusMap: Record<string, number> = { NOT_OWNER: 403, HACKATHON_NOT_FOUND: 404 };
    return ResponseHandler.error(res, result.error, result.error, statusMap[result.error] ?? 400);
  }

  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/organizers/hackathons/:id/teams/:teamId
 * Get team detail (organizer view)
 */
router.get("/:id/teams/:teamId", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const hackathonIdParsed = idSchema.safeParse(req.params.id);
  const teamIdParsed = idSchema.safeParse(req.params.teamId);
  if (!hackathonIdParsed.success || !teamIdParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid ID(s)", 400);
  }

  const result = await OrganizerParticipantService.getTeamDetail(
    req.user.sub,
    hackathonIdParsed.data,
    teamIdParsed.data,
  );

  if ("error" in result) {
    const statusMap: Record<string, number> = {
      NOT_OWNER: 403,
      HACKATHON_NOT_FOUND: 404,
      TEAM_NOT_FOUND: 404,
    };
    return ResponseHandler.error(res, result.error, result.error, statusMap[result.error] ?? 400);
  }

  return ResponseHandler.success(res, result.data);
});

export default router;
