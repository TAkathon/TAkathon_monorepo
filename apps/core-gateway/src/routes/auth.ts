import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/token";
import { UserService } from "../services/user";
import { requireAuth } from "../middleware/auth";
import { ResponseHandler } from "../utils/response";
import { UserRole, AuthResponse } from "@takathon/shared/types";

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }
  const { email, password, fullName, role } = parsed.data;

  const existing = await UserService.findByEmail(email);
  if (existing) {
    return ResponseHandler.error(res, "USER_EXISTS", "Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserService.createUser({ email, fullName, role, passwordHash });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: !!(process.env.COOKIE_SECURE === "true"),
    maxAge: parseDurationToMs(process.env.REFRESH_TTL || "7d"),
    path: "/",
  });

  return ResponseHandler.success<AuthResponse>(res, {
    user: UserService.toPublicUser(user),
    accessToken,
    refreshToken,
  }, 201);
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return ResponseHandler.error(res, "VALIDATION_ERROR", "Invalid payload", 400, parsed.error.format());
  }
  const { email, password } = parsed.data;

  const user = await UserService.findByEmail(email);
  if (!user) {
    return ResponseHandler.error(res, "INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const ok = await UserService.validatePassword(user, password);
  if (!ok) {
    return ResponseHandler.error(res, "INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: !!(process.env.COOKIE_SECURE === "true"),
    maxAge: parseDurationToMs(process.env.REFRESH_TTL || "7d"),
    path: "/",
  });

  return ResponseHandler.success<AuthResponse>(res, {
    user: UserService.toPublicUser(user),
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return ResponseHandler.error(res, "NO_REFRESH", "Missing refresh token", 401);
  }

  try {
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return ResponseHandler.error(res, "INVALID_REFRESH", "Invalid refresh token", 401);
    }
    const user = await UserService.findByEmail(payload.email);
    if (!user) {
      return ResponseHandler.error(res, "USER_NOT_FOUND", "User not found", 401);
    }

    const accessToken = signAccessToken(user);
    return ResponseHandler.success(res, { accessToken });
  } catch (err) {
    return ResponseHandler.error(res, "INVALID_REFRESH", "Invalid or expired refresh token", 401);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { path: "/" });
  return ResponseHandler.success(res, { message: "Logged out" });
});

router.get("/me", requireAuth, async (req: any, res) => {
  const user = await UserService.findByEmail(req.user.email);
  if (!user) {
    return ResponseHandler.error(res, "USER_NOT_FOUND", "User not found", 404);
  }
  return ResponseHandler.success(res, UserService.toPublicUser(user));
});

function parseDurationToMs(value: string): number {
  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

export default router;
