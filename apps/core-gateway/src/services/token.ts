import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@takathon/shared/types";
import { StoredUser } from "./user";

type TokenPayload = {
  id: string;
  email: string;
  role: UserRole;
};

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret_123456789";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_123456789";
const ACCESS_TTL = (process.env.ACCESS_TTL || "15m") as SignOptions["expiresIn"];
const REFRESH_TTL = (process.env.REFRESH_TTL || "7d") as SignOptions["expiresIn"];

function buildPayload(user: StoredUser): TokenPayload {
  return { id: user.id, email: user.email, role: user.role };
}

function verifyToken(token: string, secret: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") return null;
    const { id, email, role } = decoded as Record<string, unknown>;
    if (typeof id !== "string" || typeof email !== "string" || typeof role !== "string") return null;
    if (role !== "student" && role !== "organizer" && role !== "sponsor") return null;
    return { id, email, role: role as UserRole };
  } catch {
    return null;
  }
}

export function signAccessToken(user: StoredUser): string {
  return jwt.sign(buildPayload(user), ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(user: StoredUser): string {
  return jwt.sign(buildPayload(user), REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  return verifyToken(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  return verifyToken(token, REFRESH_SECRET);
}
