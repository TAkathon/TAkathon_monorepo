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
  if (!token) {
    return NextResponse.redirect(`${LANDING_URL}/login`);
  }

  const role = decodeJwtRole(token);
  if (role !== "student") {
    return NextResponse.redirect(`${LANDING_URL}/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
