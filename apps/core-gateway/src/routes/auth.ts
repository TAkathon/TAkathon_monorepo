import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/token";
import { createUser, findUserByEmail, toPublicUser, validatePassword } from "../services/user";
import { requireAuth } from "../middleware/auth";

const router = Router();

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["student", "organizer", "sponsor"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload" } });
  }
  const { email, password, fullName, role } = parsed.data;

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, error: { code: "USER_EXISTS", message: "Email already registered" } });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ email, fullName, role, passwordHash });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: !!(process.env.COOKIE_SECURE === "true"),
    maxAge: parseDurationToMs(process.env.REFRESH_TTL || "7d"),
    path: "/",
  });

  return res.json({
    success: true,
    data: {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    },
  });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload" } });
  }
  const { email, password } = parsed.data;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }

  const ok = await validatePassword(user, password);
  if (!ok) {
    return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
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

  return res.json({
    success: true,
    data: {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    },
  });
});

router.post("/refresh", (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, error: { code: "NO_REFRESH", message: "Missing refresh token" } });
  }
  const payload = verifyRefreshToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: { code: "INVALID_REFRESH", message: "Invalid refresh token" } });
  }
  const user = findUserByEmail(payload.email);
  if (!user) {
    return res.status(401).json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } });
  }
  const accessToken = signAccessToken(user);
  return res.json({ success: true, data: { accessToken } });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { path: "/" });
  return res.json({ success: true });
});

router.get("/me", requireAuth, (req, res) => {
  const payload = (req as any).user as { email: string };
  const user = findUserByEmail(payload.email);
  if (!user) {
    return res.status(404).json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found" } });
  }
  return res.json({ success: true, data: { user: toPublicUser(user) } });
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
