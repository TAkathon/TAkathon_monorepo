import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireStudent } from "../../middleware/rbac";
import { StudentProfileService } from "../../services/students/profile.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

// All student routes require authentication + student role
router.use(requireAuth, requireStudent);

/**
 * GET /api/v1/students/profile
 * Get the authenticated student's profile
 */
router.get("/profile", async (req: any, res) => {
  const profile = await StudentProfileService.getProfile(req.user.id);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Student profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

/**
 * PUT /api/v1/students/profile
 * Update the authenticated student's profile
 */
const availabilitySchema = z
  .object({
    timezone: z.string().min(1),
    hoursPerWeek: z.number().int().min(1).max(80),
    preferredSlots: z
      .array(
        z.enum([
          "weekday_morning",
          "weekday_afternoon",
          "weekday_evening",
          "weekend_morning",
          "weekend_afternoon",
          "weekend_evening",
        ])
      )
      .min(1),
  })
  .nullable()
  .optional();

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  university: z.string().max(255).optional(),
  degree: z.string().max(255).optional(),
  graduationYear: z.number().int().min(2000).max(2040).optional(),
  resumeUrl: z.string().url().optional(),
  availability: availabilitySchema,
});

router.put("/profile", async (req: any, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  const profile = await StudentProfileService.updateProfile(req.user.id, parsed.data);
  if (!profile) {
    return ResponseHandler.error(res, "PROFILE_NOT_FOUND", "Student profile not found", 404);
  }
  return ResponseHandler.success(res, profile);
});

/**
 * POST /api/v1/students/skills
 * Add a skill to the student's profile
 */
const addSkillSchema = z.object({
  skillId: z.string().uuid(),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  yearsOfExperience: z.number().int().min(0).max(50).optional(),
});

router.post("/skills", async (req: any, res) => {
  const parsed = addSkillSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }

  // Ensure parsed.data has the correct type structure
  const skillData: { skillId: string; proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert"; yearsOfExperience?: number } = {
    skillId: parsed.data.skillId,
    proficiencyLevel: parsed.data.proficiencyLevel,
    yearsOfExperience: parsed.data.yearsOfExperience
  };

  const result = await StudentProfileService.addSkill(req.user.id, skillData);

  if ("error" in result) {
    if (result.error === "SKILL_NOT_FOUND") {
      return ResponseHandler.error(res, "SKILL_NOT_FOUND", "Skill not found", 404);
    }
    if (result.error === "SKILL_ALREADY_EXISTS") {
      return ResponseHandler.error(res, "SKILL_ALREADY_EXISTS", "You already have this skill", 409);
    }
  }

  return ResponseHandler.success(res, result.data, 201);
});

/**
 * DELETE /api/v1/students/skills/:id
 * Remove a skill from the student's profile
 */
router.delete("/skills/:id", async (req: any, res) => {
  const result = await StudentProfileService.removeSkill(req.user.id, req.params.id);

  if ("error" in result) {
    return ResponseHandler.error(res, "SKILL_NOT_FOUND", "Skill not found or not yours", 404);
  }

  return ResponseHandler.success(res, { message: "Skill removed" });
});

export default router;
