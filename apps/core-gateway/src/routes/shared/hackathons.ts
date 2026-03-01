import { Router } from "express";
import { SharedHackathonService } from "../../services/shared/hackathon.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

/**
 * GET /api/v1/hackathons
 * Public hackathon listing (no auth required)
 */
router.get("/", async (req, res) => {
  const { page, limit, search, status } = req.query;
  const result = await SharedHackathonService.listPublicHackathons({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    status: status as string,
  });
  return ResponseHandler.success(res, result);
});

/**
 * GET /api/v1/hackathons/:id
 * Public hackathon detail (no auth required)
 */
router.get("/:id", async (req, res) => {
  const hackathon = await SharedHackathonService.getPublicHackathonDetail(req.params.id);
  if (!hackathon) {
    return ResponseHandler.error(res, "NOT_FOUND", "Hackathon not found", 404);
  }
  return ResponseHandler.success(res, hackathon);
});

export default router;
