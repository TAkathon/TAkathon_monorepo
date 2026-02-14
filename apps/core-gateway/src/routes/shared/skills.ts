import { Router } from "express";
import { SkillService } from "../../services/shared/skill.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

/**
 * GET /api/v1/skills
 * List all skills (public, no auth required)
 */
router.get("/", async (req, res) => {
  const { category, search } = req.query;
  const skills = await SkillService.listSkills({
    category: category as string,
    search: search as string,
  });
  return ResponseHandler.success(res, skills);
});

/**
 * GET /api/v1/skills/categories
 * List skill categories with counts
 */
router.get("/categories", async (_req, res) => {
  const categories = await SkillService.getCategories();
  return ResponseHandler.success(res, categories);
});

/**
 * GET /api/v1/skills/:id
 * Get skill detail
 */
router.get("/:id", async (req, res) => {
  const skill = await SkillService.getSkillDetail(req.params.id);
  if (!skill) {
    return ResponseHandler.error(res, "NOT_FOUND", "Skill not found", 404);
  }
  return ResponseHandler.success(res, skill);
});

export default router;
