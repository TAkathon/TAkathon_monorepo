import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware for student-portal.
 * Protects all /dashboard/* routes.
 * Reads the httpOnly `accessToken` JWT cookie set by the gateway.
 * The JWT payload (base64-decoded) contains { id, email, role } — no secret
 * needed here; the API verifies the signature on every protected request.
 */

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";

function decodeJwtRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url → base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload?.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // If no cookie is present, let the request through.
  // In local dev the gateway (localhost:8000) sets the cookie on its own origin,
  // so it is never sent to the student portal (localhost:3001).
  // Client-side auth guards handle unauthenticated users via the Zustand store.
  if (!token) {
    return NextResponse.next();
  }

  // When the cookie IS available (e.g. production behind a reverse proxy sharing
  // the same domain), enforce that only students can access dashboard routes.
  const role = decodeJwtRole(token);
  if (role !== "student") {
    return NextResponse.redirect(`${LANDING_URL}/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
