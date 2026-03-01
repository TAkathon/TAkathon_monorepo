import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware for organizer-dashboard.
 * Protects all routes except Next.js internals and _next static assets.
 * Redirects unauthenticated or wrong-role users to the landing page login.
 */

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";

// Public paths that should never be protected (Next.js internals)
const PUBLIC_PATH_PREFIXES = ["/_next", "/favicon.ico", "/api/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip protection for Next.js internals
  if (PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

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

    // Ensure the logged-in user is an organizer
    if (state.user.role !== "organizer") {
      return NextResponse.redirect(`${LANDING_URL}/login`);
    }
  } catch {
    return NextResponse.redirect(`${LANDING_URL}/login`);
  }

  return NextResponse.next();
}

export const config = {
  // Protect every route on this app
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
