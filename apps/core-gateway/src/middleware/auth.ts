import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token";
import { ResponseHandler } from "../utils/response";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string") {
    return ResponseHandler.error(res, "NO_AUTH", "Missing Authorization header", 401);
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return ResponseHandler.error(res, "BAD_AUTH", "Invalid Authorization format", 401);
  }
  const payload = verifyAccessToken(parts[1]);
  if (!payload) {
    return ResponseHandler.error(res, "INVALID_TOKEN", "Invalid or expired token", 401);
  }
  (req as any).user = payload;
  next();
}

