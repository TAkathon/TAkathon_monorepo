import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireStudent } from "../../middleware/rbac";
import { StudentMatchingService } from "../../services/students/matching.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireStudent);

/**
 * GET /api/v1/students/teams/:id/matches
 * Get AI teammate recommendations for a team
 */
router.get("/:id/matches", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const limit = req.query.limit ? Number(req.query.limit) : 5;

  const result = await StudentMatchingService.getMatches(req.user.sub, parsed.data, limit);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      NOT_A_MEMBER: { message: "You must be a member of this team", status: 403 },
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      TEAM_FULL: { message: "Team is already full", status: 400 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * POST /api/v1/students/teams/:id/matches/:userId
 * Invite a matched candidate to the team
 */
router.post("/:id/matches/:userId", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const teamIdParsed = idSchema.safeParse(req.params.id);
  const userIdParsed = idSchema.safeParse(req.params.userId);

  if (!teamIdParsed.success || !userIdParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid ID(s)", 400);
  }

  const result = await StudentMatchingService.inviteMatch(
    req.user.sub,
    teamIdParsed.data,
    userIdParsed.data,
  );

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      TEAM_NOT_FORMING: { message: "Team is not in forming status", status: 400 },
      TEAM_FULL: { message: "Team is full", status: 400 },
      NOT_A_MEMBER: { message: "You must be a team member", status: 403 },
      CANDIDATE_NOT_FOUND: { message: "Candidate not found", status: 404 },
      CANDIDATE_NOT_AVAILABLE: { message: "Candidate is not available", status: 400 },
      ALREADY_INVITED: { message: "Already invited this candidate", status: 409 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data, 201);
});

export default router;
