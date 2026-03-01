# Codebase Audit — Issues and Fix Recommendations

Date: 2026-03-01

This document summarizes identified syntax errors, logic issues, and inconsistencies across the repository, along with actionable recommendations to fix them.

## Summary of Key Risks
- Build break in student-portal due to duplicate default exports in a single file.
- Inconsistent user roles between shared types and the core gateway token verification.
- Mixed stack signals in core-gateway (Nest skeleton vs Express app) causing confusion and potential tooling drift.
- CORS configuration blocks typical browser origins unless configured, hindering local development.
- Potential inconsistency in API response shape if not standardized on a common handler.
- Frontend logic relies on string literals where shared enums exist, risking drift.
- Missing or undocumented environment variables for token TTLs.
- Referenced routers may be missing/incomplete, risking runtime import failures.

---

## Findings and Recommendations

### 1) Critical: Duplicate default export in student-portal dashboard
- Location: `apps/student-portal/src/app/dashboard/page.tsx`
- Issue:
  - The file declares `export default function DashboardPage()` twice. This is a syntax error and will fail to compile.
  - The second block includes demo/mock data and reuses identifiers (e.g., `stats`) defined earlier, creating scope confusion.
- Impact: Build fails; or if partially resolved by tooling, undefined behavior at runtime.
- Recommendation:
  - Keep the data-driven implementation and remove the second `DashboardPage` and associated mock data.
  - Alternatively, move mock/demo into a separate component/file and choose via a feature flag.
  - Ensure any referenced variables are in the correct scope of the single, final `DashboardPage` export.

### 2) Inconsistent user roles between backend and shared types
- Files:
  - Backend: `apps/core-gateway/src/services/token.ts`
  - Shared types: `libs/shared/types/src/lib/user.types.ts`
- Issue:
  - Token verification allows roles: `student`, `organizer`, `sponsor`.
  - Shared `UserRole` enum only defines `STUDENT` and `ORGANIZER`; `SPONSOR` is missing.
- Impact:
  - Type mismatches in TypeScript when trying to represent a sponsor user.
  - Potential logic gaps in RBAC and UI that reference `UserRole`.
- Recommendation:
  - Add `SPONSOR = 'sponsor'` to `UserRole`.
  - Audit authorization checks and UI role-based logic to include sponsor where appropriate.

### 3) Mixed framework signals in core-gateway (Nest skeleton vs Express)
- Files present but empty: `apps/core-gateway/src/app/app.module.ts`, `apps/core-gateway/src/app/app.controller.ts`, `apps/core-gateway/src/main.ts`.
- Actual runtime entrypoint: `apps/core-gateway/src/index.ts` (Express app).
- Issue:
  - The project appears to have Nest scaffolding but the service is implemented in Express.
- Impact:
  - Confusion for contributors, toolchain drift (nx/IDE may assume Nest), potential dead imports later.
- Recommendation:
  - Decide on the framework. If sticking with Express (current code), remove the empty Nest files or add a clear comment indicating they are intentionally unused.
  - Ensure package scripts and CI start the Express entry (`src/index.ts`).

### 4) CORS configuration blocks normal browser origins by default
- File: `apps/core-gateway/src/index.ts`
- Issue:
  - If `CORS_ORIGINS` env var is unset, requests with `Origin` are rejected ("CORS not configured"). Only requests without `Origin` (e.g., curl) are allowed.
- Impact:
  - Local development from Next.js frontends (which send an Origin) will be blocked unless CORS is explicitly configured.
- Recommendation:
  - In non-production, allow common localhost origins if `CORS_ORIGINS` is empty (e.g., `http://localhost:3000`, `http://localhost:4200`).
  - Alternatively, if empty and non-prod, allow all origins with a prominent console warning.
  - Document CORS_ORIGINS usage in `.env.example`.

### 5) Response shape standardization
- File: `apps/core-gateway/src/utils/response.ts`
- Issue:
  - A standardized `ResponseHandler` exists, returning `{ success, data | error }` following `@takathon/shared/types`.
  - Risk is inconsistency if some route handlers bypass it and use `res.json` directly with ad-hoc shapes.
- Impact:
  - Clients receive inconsistent API payloads, complicating frontends and SDKs.
- Recommendation:
  - Adopt `ResponseHandler` across all route handlers. Grep for `res.json` and update to use `ResponseHandler.success/error`.
  - Optionally add an ESLint rule or code review checklist item to enforce response consistency.

### 6) Frontend uses string literals where shared enums exist
- File: `apps/student-portal/src/app/dashboard/page.tsx`
- Issue:
  - Status comparisons use string literals such as `"forming"` and `"complete"` instead of `TeamStatus.FORMING/COMPLETE` from shared types.
- Impact:
  - Increases risk of typos and drift from shared contract.
- Recommendation:
  - Import `TeamStatus` from `@takathon/shared/types` and use the enum values.

### 7) JWT TTL environment variable naming/documentation
- File: `apps/core-gateway/src/services/token.ts`
- Issue:
  - Code uses `ACCESS_TTL` and `REFRESH_TTL` env vars but they may not be documented in `.env.example`.
- Impact:
  - Confusion during setup; inconsistent TTLs across environments.
- Recommendation:
  - Add `ACCESS_TTL=15m` and `REFRESH_TTL=7d` to `apps/core-gateway/.env.example` with comments.

### 8) Referenced routers might be missing or incomplete
- File: `apps/core-gateway/src/index.ts`
- Issue:
  - References many routers: students (profile, hackathons, teams, matching), organizers (profile, hackathons, participants, analytics), sponsors (profile, hackathons, teams), shared (hackathons, skills).
  - Ensure these router files actually exist and export an `Express.Router` with routes mounted relative to the base path used.
- Impact:
  - Runtime module not found/import errors if any file is absent.
- Recommendation:
  - Verify presence of each router file and add a minimal stub if not yet implemented (e.g., `GET /` returns empty list with `ResponseHandler.success`).

### 9) Organizer routers mounted on the same base
- File: `apps/core-gateway/src/index.ts`
- Observation:
  - Multiple routers mounted at the same base path `"/api/v1/organizers/hackathons"` for `organizerHackathonsRouter`, `organizerParticipantsRouter`, and `organizerAnalyticsRouter`.
- Impact:
  - This can be correct if each router defines unique subpaths (e.g., `/participants`, `/analytics`), but it can also be a sign of accidental duplication.
- Recommendation:
  - Confirm each router's internal paths. If they already include `/participants` and `/analytics`, keep as-is. Otherwise, adjust base paths to `"/api/v1/organizers/participants"` and `"/api/v1/organizers/analytics"` for clarity.

### 10) JWT secrets configuration
- File: `apps/core-gateway/src/services/token.ts`
- Observation:
  - Uses dev defaults but enforces presence of secrets in production. Good practice.
- Recommendation:
  - Ensure deployment pipeline sets `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` and rotate them periodically.

### 11) Python AI engine (cursory)
- Path: `apps/ai-engine`
- Observation:
  - Not fully reviewed here. Ensure tests (`apps/ai-engine/tests`) pass in CI and that package/module imports match `pyproject.toml` configuration. Pin dependencies appropriately.
- Recommendation:
  - Run tests, add type checking (mypy/pyright) if not already, and ensure version locks are compatible with runtime.

---

## Quick Fix Plan (Actionable Steps)
1. Fix `student-portal` dashboard file:
   - Remove the second `export default` and mock sections, or split into separate file.
   - Import `TeamStatus` from `@takathon/shared/types` and replace string literals.
2. Update shared user roles:
   - Add `SPONSOR` to `libs/shared/types/src/lib/user.types.ts`.
3. Clarify core-gateway framework:
   - Remove empty Nest files or add a header comment making it explicit Express is used. Ensure scripts target `src/index.ts`.
4. Improve CORS DX:
   - In development, allow `http://localhost:3000` (and other local ports as needed) when `CORS_ORIGINS` is empty, or allow all with a warning. Document in `.env.example`.
5. Standardize responses:
   - Replace ad-hoc `res.json` calls in routers with `ResponseHandler.success/error`.
6. Document JWT TTLs:
   - Add `ACCESS_TTL` and `REFRESH_TTL` into `apps/core-gateway/.env.example`.
7. Verify router existence:
   - Ensure all referenced router modules exist; add stubs where necessary.

---

## References (for maintainers)
- Shared API types: `libs/shared/types/src/lib/api.types.ts`
- User types: `libs/shared/types/src/lib/user.types.ts`
- Team types: `libs/shared/types/src/lib/team.types.ts`
- Core gateway entry: `apps/core-gateway/src/index.ts`
- Token service: `apps/core-gateway/src/services/token.ts`
- Student dashboard: `apps/student-portal/src/app/dashboard/page.tsx`
