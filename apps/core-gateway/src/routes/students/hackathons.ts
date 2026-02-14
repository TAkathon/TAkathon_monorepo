import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireStudent } from "../../middleware/rbac";
import { StudentHackathonService } from "../../services/students/hackathon.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

// All routes require authentication + student role
router.use(requireAuth, requireStudent);

/**
 * GET /api/v1/students/hackathons
 * Browse available hackathons
 */
router.get("/", async (req: any, res) => {
  const { status, search, page, perPage } = req.query;
  const result = await StudentHackathonService.listHackathons({
    status: status as string | undefined,
    search: search as string | undefined,
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
  });
  return ResponseHandler.success(res, result.data, 200);
});

/**
 * GET /api/v1/students/hackathons/mine
 * List hackathons the student is registered for
 */
router.get("/mine", async (req: any, res) => {
  const result = await StudentHackathonService.myHackathons(req.user.sub);
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/students/hackathons/:id
 * Get hackathon detail
 */
router.get("/:id", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const hackathon = await StudentHackathonService.getHackathonDetail(parsed.data);
  if (!hackathon) {
    return ResponseHandler.error(res, "NOT_FOUND", "Hackathon not found", 404);
  }
  return ResponseHandler.success(res, hackathon);
});

/**
 * POST /api/v1/students/hackathons/:id/register
 * Register for a hackathon
 */
router.post("/:id/register", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await StudentHackathonService.register(req.user.sub, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      HACKATHON_NOT_FOUND: { message: "Hackathon not found", status: 404 },
      REGISTRATION_CLOSED: { message: "Registration is closed", status: 400 },
      REGISTRATION_DEADLINE_PASSED: { message: "Registration deadline has passed", status: 400 },
      HACKATHON_FULL: { message: "Hackathon has reached max participants", status: 400 },
      ALREADY_REGISTERED: { message: "Already registered for this hackathon", status: 409 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data, 201);
});

/**
 * POST /api/v1/students/hackathons/:id/withdraw
 * Withdraw from a hackathon
 */
router.post("/:id/withdraw", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const result = await StudentHackathonService.withdraw(req.user.sub, parsed.data);

  if ("error" in result) {
    const errorMap: Record<string, { message: string; status: number }> = {
      NOT_REGISTERED: { message: "Not registered for this hackathon", status: 404 },
      IN_TEAM: { message: "Leave your team before withdrawing", status: 400 },
    };
    const err = errorMap[result.error] ?? { message: result.error, status: 400 };
    return ResponseHandler.error(res, result.error, err.message, err.status);
  }

  return ResponseHandler.success(res, result.data);
});

/**
 * GET /api/v1/students/hackathons/:id/participants
 * List participants in a hackathon
 */
router.get("/:id/participants", async (req: any, res) => {
  const idSchema = z.string().uuid();
  const parsed = idSchema.safeParse(req.params.id);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid hackathon ID", 400);
  }

  const { page, perPage } = req.query;
  const result = await StudentHackathonService.listParticipants(parsed.data, {
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
  });

  if (!result) {
    return ResponseHandler.error(res, "NOT_FOUND", "Hackathon not found", 404);
  }

  return ResponseHandler.success(res, result.data);
});

export default router;
