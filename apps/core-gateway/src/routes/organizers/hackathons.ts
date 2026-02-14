import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireOrganizer } from "../../middleware/rbac";
import { OrganizerHackathonService } from "../../services/organizers/hackathon.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

router.use(requireAuth, requireOrganizer);

/**
 * GET /api/v1/organizers/hackathons
 * List hackathons created by the organizer
 */
router.get("/", async (req: any, res) => {
  const result = await OrganizerHackathonService.myHackathons(req.user.sub);
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/organizers/hackathons/:id
 * Get hackathon detail (organizer view)
 */
router.get("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const hackathon = await OrganizerHackathonService.getHackathonDetail(req.user.sub, parsed.data);
  if (!hackathon) {
    return ResponseHandler.error(res, "NOT_FOUND", "Hackathon not found", 404);
  }
  return ResponseHandler.success(res, hackathon);
});

/**
 * POST /api/v1/organizers/hackathons
 * Create a new hackathon
 */
const createHackathonSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  registrationDeadline: z.string().datetime(),
  location: z.string().max(500).optional(),
  isVirtual: z.boolean().optional(),
  maxParticipants: z.number().int().min(2).optional(),
  maxTeamSize: z.number().int().min(1).max(20).optional(),
  minTeamSize: z.number().int().min(1).max(20).optional(),
  requiredSkills: z.array(z.string()).optional(),
  prizePool: z.string().max(500).optional(),
  rules: z.string().optional(),
  bannerUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
});

router.post("/", async (req: any, res) => {
  const parsed = createHackathonSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await OrganizerHackathonService.createHackathon(req.user.sub, parsed.data);

  if ("error" in result) {
    return ResponseHandler.error(res, result.error, (result as any).message || result.error, 400);
  }

  return ResponseHandler.success(res, result.data, 201);
});

/**
 * PUT /api/v1/organizers/hackathons/:id
 * Update a hackathon
 */
const updateHackathonSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  registrationDeadline: z.string().datetime().optional(),
  location: z.string().max(500).optional(),
  isVirtual: z.boolean().optional(),
  maxParticipants: z.number().int().min(2).optional(),
  maxTeamSize: z.number().int().min(1).max(20).optional(),
  minTeamSize: z.number().int().min(1).max(20).optional(),
  requiredSkills: z.array(z.string()).optional(),
  prizePool: z.string().max(500).optional(),
  rules: z.string().optional(),
  bannerUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
});

router.put("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const idParsed = idSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const parsed = updateHackathonSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await OrganizerHackathonService.updateHackathon(req.user.sub, idParsed.data, parsed.data);

  if ("error" in result) {
    const statusMap: Record<string, number> = { NOT_OWNER: 403, HACKATHON_NOT_FOUND: 404 };
    return ResponseHandler.error(
      res,
      result.error,
      (result as any).message || result.error,
      statusMap[result.error] ?? 400,
    );
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * POST /api/v1/organizers/hackathons/:id/publish
 * Publish a hackathon (draft → registration_open)
 */
router.post("/:id/publish", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await OrganizerHackathonService.publishHackathon(req.user.sub, parsed.data);

  if ("error" in result) {
    const statusMap: Record<string, number> = {
      NOT_OWNER: 403,
      HACKATHON_NOT_FOUND: 404,
      INVALID_STATUS: 400,
    };
    return ResponseHandler.error(
      res,
      result.error,
      (result as any).message || result.error,
      statusMap[result.error] ?? 400,
    );
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * POST /api/v1/organizers/hackathons/:id/status
 * Update hackathon status
 */
const statusSchema = z.object({
  status: z.enum([
    "registration_open",
    "registration_closed",
    "in_progress",
    "completed",
    "cancelled",
  ]),
});

router.post("/:id/status", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const idParsed = idSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const result = await OrganizerHackathonService.updateStatus(
    req.user.sub,
    idParsed.data,
    parsed.data.status,
  );

  if ("error" in result) {
    const statusMap: Record<string, number> = {
      NOT_OWNER: 403,
      HACKATHON_NOT_FOUND: 404,
      INVALID_TRANSITION: 400,
    };
    return ResponseHandler.error(
      res,
      result.error,
      (result as any).message || result.error,
      statusMap[result.error] ?? 400,
    );
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * POST /api/v1/organizers/hackathons/:id/cancel
 * Cancel a hackathon
 */
router.post("/:id/cancel", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await OrganizerHackathonService.cancelHackathon(req.user.sub, parsed.data);

  if ("error" in result) {
    const statusMap: Record<string, number> = {
      NOT_OWNER: 403,
      HACKATHON_NOT_FOUND: 404,
    };
    return ResponseHandler.error(
      res,
      result.error,
      (result as any).message || result.error,
      statusMap[result.error] ?? 400,
    );
  }

  return ResponseHandler.success(res, result.data);
});

export default router;
