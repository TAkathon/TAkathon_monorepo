import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string") {
    return res.status(401).json({ success: false, error: { code: "NO_AUTH", message: "Missing Authorization header" } });
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ success: false, error: { code: "BAD_AUTH", message: "Invalid Authorization format" } });
  }
  const payload = verifyAccessToken(parts[1]);
  if (!payload) {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired token" } });
  }
  (req as any).user = payload;
  next();
}

