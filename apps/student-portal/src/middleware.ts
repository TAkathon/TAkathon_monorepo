import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware for student-portal.
 * Protects all /dashboard/* routes.
 * Redirects unauthenticated or wrong-role users to the landing page login.
 */

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";

export function middleware(request: NextRequest) {
  try {
    const raw = request.cookies.get("auth-storage")?.value;
    if (!raw) {
      return NextResponse.redirect(`${LANDING_URL}/login`);
    }

    const parsed = JSON.parse(decodeURIComponent(raw));
    const state = parsed?.state;

    if (!state?.isAuthenticated || !state?.user) {
      return NextResponse.redirect(`${LANDING_URL}/login`);
    }

    // Ensure the logged-in user is a student
    if (state.user.role !== "student") {
      return NextResponse.redirect(`${LANDING_URL}/login`);
    }
  } catch {
    return NextResponse.redirect(`${LANDING_URL}/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
