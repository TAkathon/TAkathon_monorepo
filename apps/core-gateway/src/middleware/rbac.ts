import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response";

/**
 * RBAC (Role-Based Access Control) middleware for core-gateway.
 *
 * Usage:
 *   router.get("/profile", requireAuth, requireStudent, handler);
 *   router.post("/hackathons", requireAuth, requireOrganizer, handler);
 *   router.get("/teams", requireAuth, requireSponsor, handler);
 *   router.get("/resource", requireAuth, requireRole("student", "organizer"), handler);
 *
 * Assumes `requireAuth` has already run and set `req.user` with { sub, email, role }.
 */

/** Extend Express Request to include the authenticated user payload */
export interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

/**
 * Generic role guard factory.
 * Accepts one or more allowed roles and returns middleware that checks `req.user.role`.
 * Returns 403 FORBIDDEN if the user's role is not in the allowed list.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return ResponseHandler.error(
        res,
        "UNAUTHENTICATED",
        "Authentication required before role check",
        401,
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return ResponseHandler.error(
        res,
        "FORBIDDEN",
        `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
        403,
      );
    }

    next();
  };
}

/** Guard: only students can access */
export const requireStudent = requireRole("student");

/** Guard: only organizers can access */
export const requireOrganizer = requireRole("organizer");

/** Guard: only sponsors can access */
export const requireSponsor = requireRole("sponsor");

/** Guard: students or organizers can access */
export const requireStudentOrOrganizer = requireRole("student", "organizer");

/** Guard: any authenticated user can access (no specific role required) */
export const requireAnyRole = requireRole("student", "organizer", "sponsor");
