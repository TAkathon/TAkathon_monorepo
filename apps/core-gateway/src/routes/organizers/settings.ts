import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { requireOrganizer } from "../../middleware/rbac";
import { OrganizerSettingsService } from "../../services/organizers/settings.service";
import { ResponseHandler } from "../../utils/response";

const router = Router();

// All settings routes require authentication + organizer role
router.use(requireAuth, requireOrganizer);

/**
 * POST /api/v1/organizers/settings/change-password
 * Verify current password → hash new → update
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

router.post("/change-password", async (req: any, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(
      res,
      "VALIDATION_ERROR",
      parsed.error.errors.map((e) => e.message).join(", "),
      422,
    );
  }

  try {
    await OrganizerSettingsService.changePassword(
      req.user.sub,
      parsed.data.currentPassword,
      parsed.data.newPassword,
    );
    return ResponseHandler.success(res, { message: "Password updated" });
  } catch (err: any) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_ERROR";
    return ResponseHandler.error(res, code, err.message, status);
  }
});

/**
 * POST /api/v1/organizers/settings/delete-account
 * Verify password + "DELETE" confirmation → cancel hackathons → delete user → clear cookies
 */
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmText: z.literal("DELETE", {
    errorMap: () => ({ message: 'You must type "DELETE" to confirm' }),
  }),
});

router.post("/delete-account", async (req: any, res) => {
  const parsed = deleteAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(
      res,
      "VALIDATION_ERROR",
      parsed.error.errors.map((e) => e.message).join(", "),
      422,
    );
  }

  try {
    await OrganizerSettingsService.deleteAccount(
      req.user.sub,
      parsed.data.password,
    );

    // Clear auth cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });

    return ResponseHandler.success(res, { message: "Account deleted" });
  } catch (err: any) {
    const status = err.status ?? 500;
    const code = err.code ?? "INTERNAL_ERROR";
    return ResponseHandler.error(res, code, err.message, status);
  }
});

export default router;
