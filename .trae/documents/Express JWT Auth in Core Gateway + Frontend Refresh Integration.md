## Overview
- Implement an Express-based Node.js backend in apps/core-gateway providing JWT auth and refresh.
- Wire the landing-page login/signup to these endpoints and integrate a shared Axios client with automatic refresh for student-portal, sponsor-panel, and organizer-dashboard.
- Keep existing client-side guards; make auth state and refresh flow align with them.

## Backend (Express @ apps/core-gateway)
- Structure: src/index.ts (server bootstrap), src/routes/auth.ts, src/middleware/auth.ts, src/services/token.ts, src/services/user.ts, src/types.
- Dependencies: express, cors, cookie-parser, jsonwebtoken, bcryptjs, dotenv, zod; dev: ts-node-dev.
- Env: .env with JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TTL=15m, REFRESH_TTL=7d, CORS_ORIGINS (landing/student/sponsor/organizer).
- CORS: enable credentials and allow origins; set cookies with SameSite=Lax; use cookie-parser; set withCredentials clients.
- Endpoints (baseURL: http://localhost:8000, prefix: /api/v1):
  - POST /auth/register: create user (in-memory store for now), hash password, return { user, accessToken, refreshToken } and set httpOnly refresh cookie.
  - POST /auth/login: validate creds, return { user, accessToken, refreshToken } and set httpOnly refresh cookie.
  - POST /auth/refresh: read refresh cookie, verify, issue new access token; return { accessToken }.
  - POST /auth/logout: clear refresh cookie; client clears auth store.
  - GET /me: protected by Bearer access token; returns user.
- Middleware:
  - requireAuth: verifies Authorization: Bearer <accessToken>; attaches req.user; used by protected routes.
- Data: start with in-memory users keyed by email; include id, email, fullName, role. Prepare later DB integration.
- API contract: align with shared types [api.types.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/types/src/lib/api.types.ts) and docs [api-specification.md](file:///d:/Takathon/TAkathon_monorepo/docs/api-specification.md#L85-L116).

## Shared Types Update
- Extend UserRole to include sponsor, matching UI and apps: update [user.types.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/types/src/lib/user.types.ts) to add SPONSOR = 'sponsor'.
- Keep AuthResponse shape: { user, accessToken, refreshToken } consistent.

## Frontend Integration
- Create shared client in libs/shared/api:
  - Axios instance with baseURL from NEXT_PUBLIC_API_URL and withCredentials: true.
  - Request interceptor: attach Authorization: Bearer <accessToken> from useAuthStore if present.
  - Response interceptor: on 401, call POST /api/v1/auth/refresh; if success, update store.accessToken and retry; if fail, logout and redirect to landing login.
- Landing Page:
  - Replace local api.ts calls to use shared client; keep endpoints /api/v1/auth/login and /api/v1/auth/register.
  - On success: set useAuthStore with user and isAuthenticated=true; persist accessToken in store; redirect via getRedirectUrl.
- Student Portal, Sponsor Panel, Organizer Dashboard:
  - Import shared client; use it for any API calls.
  - No changes to guards; they already redirect based on isAuthenticated and role.

## Refresh Flow
- Access tokens short-lived (e.g., 15m), refresh cookie httpOnly (7d).
- Axios sends cookies due to withCredentials; refresh endpoint does not require Authorization header.
- When refresh succeeds, keep isAuthenticated true; when it fails, clear auth store and let guards redirect to landing login.

## Config
- Env vars in .env for backend; ensure NEXT_PUBLIC_API_URL points to http://localhost:8000 for local dev.
- CORS allow origins from shared utils URLs [urls.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/utils/src/lib/urls.ts), credentials enabled.

## Verification
- Backend unit tests for token service (sign/verify), and auth routes with supertest.
- Manual flow: start backend on :8000, run landing-page, perform signup/login, confirm redirect to role app, access protected route /me.
- Expiry test: force 401 by using an expired token and observe automatic refresh; if refresh cookie removed (logout), verify guards redirect.

## Deliverables
- New files in apps/core-gateway: src/index.ts, src/routes/auth.ts, src/middleware/auth.ts, src/services/token.ts, src/services/user.ts, .env.example.
- New shared client: libs/shared/api/src/client.ts (+ index.ts export).
- Updated types: add sponsor in [user.types.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/types/src/lib/user.types.ts).
- Updated landing-page to use shared client and set store tokens; minimal wiring in other apps to import shared client when needed.

## Notes
- Keep Authorization header format: Bearer <accessToken>.
- Preserve existing guards and redirect utilities [authStore.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/utils/src/lib/authStore.ts), [authRedirect.ts](file:///d:/Takathon/TAkathon_monorepo/libs/shared/utils/src/lib/authRedirect.ts).
- Future: swap in a real database and user repository without changing the API surface.