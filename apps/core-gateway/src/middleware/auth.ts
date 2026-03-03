import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token";
import { ResponseHandler } from "../utils/response";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Primary: read access token from the httpOnly cookie
  const token: string | undefined = req.cookies?.accessToken;

  if (!token) {
    return ResponseHandler.error(res, "NO_AUTH", "Missing authentication token", 401);
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return ResponseHandler.error(res, "INVALID_TOKEN", "Invalid or expired token", 401);
  }

  (req as any).user = payload;
  next();
}
