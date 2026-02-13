// Using require to avoid type friction with jsonwebtoken v9 typings
const jwt: any = require("jsonwebtoken");
import { StoredUser } from "./user";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
const ACCESS_TTL = process.env.ACCESS_TTL || "15m";
const REFRESH_TTL = process.env.REFRESH_TTL || "7d";

export function signAccessToken(user: StoredUser): string {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(user: StoredUser): string {
  return jwt.sign({ sub: user.id, email: user.email }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as any;
    return { sub: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { sub: string; email: string } | null {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as any;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
