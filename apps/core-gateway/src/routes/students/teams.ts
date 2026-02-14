import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireStudent } from "../../middleware/rbac";
import { StudentTeamService } from "../../services/students/team.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireStudent);

/**
 * GET /api/v1/students/teams
 * List teams the student is a member of
 */
router.get("/", async (req: any, res) => {
  const teams = await StudentTeamService.myTeams(req.user.sub);
  return ResponseHandler.success(res, teams);
});

/**
 * GET /api/v1/students/teams/invitations
 * List pending invitations for the student
 */
router.get("/invitations", async (req: any, res) => {
  const invitations = await StudentTeamService.myInvitations(req.user.sub);
  return ResponseHandler.success(res, invitations);
});

/**
 * GET /api/v1/students/teams/:id
 * Get team detail
 */
router.get("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const team = await StudentTeamService.getTeamDetail(parsed.data);
  if (!team) {
    return ResponseHandler.error(res, "NOT_FOUND", "Team not found", 404);
  }
  return ResponseHandler.success(res, team);
});

/**
 * POST /api/v1/students/teams
 * Create a new team
 */
const createTeamSchema = z.object({
  hackathonId: z.string().uuid(),
  name: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  maxSize: z.number().int().min(2).max(10).optional(),
  isPublic: z.boolean().optional(),
  projectIdea: z.string().max(2000).optional(),
});

router.post("/", async (req: any, res) => {
  const parsed = createTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await StudentTeamService.createTeam(req.user.sub, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      HACKATHON_NOT_FOUND: { message: "Hackathon not found", status: 404 },
      HACKATHON_NOT_ACTIVE: { message: "Hackathon is not active", status: 400 },
      NOT_REGISTERED: { message: "You must be registered for this hackathon", status: 400 },
      ALREADY_IN_TEAM: { message: "You are already in a team for this hackathon", status: 409 },
      INVALID_TEAM_SIZE: { message: "Team size is out of allowed range", status: 400 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data, 201);
});

/**
 * PUT /api/v1/students/teams/:id
 * Update team (captain only)
 */
const updateTeamSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional(),
  projectIdea: z.string().max(2000).optional(),
  isPublic: z.boolean().optional(),
});

router.put("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const idParsed = idSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const parsed = updateTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await StudentTeamService.updateTeam(req.user.sub, idParsed.data, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      NOT_CAPTAIN: { message: "Only the captain can update the team", status: 403 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * DELETE /api/v1/students/teams/:id
 * Delete/disband team (captain only)
 */
router.delete("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const result = await StudentTeamService.deleteTeam(req.user.sub, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      NOT_CAPTAIN: { message: "Only the captain can delete the team", status: 403 },
      TEAM_NOT_FORMING: { message: "Can only disband teams in forming status", status: 400 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, { message: "Team disbanded" });
});

/**
 * POST /api/v1/students/teams/:id/invite
 * Invite a user to join the team
 */
const inviteSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().max(500).optional(),
});

router.post("/:id/invite", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const idParsed = idSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await StudentTeamService.inviteToTeam(req.user.sub, idParsed.data, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      TEAM_NOT_FORMING: { message: "Team is not in forming status", status: 400 },
      TEAM_FULL: { message: "Team is full", status: 400 },
      NOT_A_MEMBER: { message: "You must be a team member to invite", status: 403 },
      INVITEE_NOT_FOUND: { message: "User not found or not a student", status: 404 },
      INVITEE_NOT_REGISTERED: { message: "User is not registered for this hackathon", status: 400 },
      INVITEE_ALREADY_IN_TEAM: { message: "User is already in a team", status: 409 },
      ALREADY_INVITED: { message: "User already has a pending invitation", status: 409 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data, 201);
});

/**
 * POST /api/v1/students/teams/invitations/:id/respond
 * Accept or reject a team invitation
 */
const respondSchema = z.object({
  accept: z.boolean(),
});

router.post("/invitations/:id/respond", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const idParsed = idSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid invitation ID", 400);
  }

  const parsed = respondSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await StudentTeamService.respondToInvitation(
    req.user.sub,
    idParsed.data,
    parsed.data.accept,
  );

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      INVITATION_NOT_FOUND: { message: "Invitation not found", status: 404 },
      INVITATION_NOT_PENDING: { message: "Invitation is no longer pending", status: 400 },
      INVITATION_EXPIRED: { message: "Invitation has expired", status: 400 },
      TEAM_FULL: { message: "Team is now full", status: 400 },
      ALREADY_IN_TEAM: { message: "You are already in a team for this hackathon", status: 409 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * POST /api/v1/students/teams/:id/leave
 * Leave a team
 */
router.post("/:id/leave", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid team ID", 400);
  }

  const result = await StudentTeamService.leaveTeam(req.user.sub, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      NOT_A_MEMBER: { message: "You are not a member of this team", status: 404 },
      TEAM_NOT_FOUND: { message: "Team not found", status: 404 },
      CAPTAIN_CANNOT_LEAVE: { message: "Captain cannot leave. Transfer captaincy or disband.", status: 400 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, { message: "Left team successfully" });
});

export default router;
