# TAkathon — Code Audit

**Last Updated**: March 3, 2026
**Status**: Phase 3 issues have been fully resolved. All Phase 1-2 findings closed.

This document tracks code quality findings, when they were fixed, and what the fix was.

---

## ✅ Resolved Issues

### Issue #1 — Duplicate Export in Shared API Barrel

**Found**: Phase 2
**Fixed**: Phase 2 (refactor of `libs/shared/api/src/index.ts`)
**Status**: ✅ RESOLVED

**Original problem**: Multiple `export *` statements in the barrel file caused TypeScript duplicate identifier errors when domain modules exported types with the same name (e.g. `HackathonData` in both `hackathon.ts` and `organizer.ts`).

**Fix**: Used named re-exports for conflicting symbols. Barrel now uses explicit `export { ... } from "..."` for each domain module.

---

### Issue #2 — `UserRole.SPONSOR` Missing from Shared Types

**Found**: Phase 2
**Fixed**: Phase 2 (commit on `feature/phase2-core-data-flows`)
**Status**: ✅ RESOLVED

**Original problem**: `UserRole` enum in `libs/shared/types/src/` only had `STUDENT` and `ORGANIZER`. The `authRedirect()` utility function had no case for `SPONSOR`, causing sponsors to be redirected to the wrong dashboard after login.

**Fix**: Added `SPONSOR = "SPONSOR"` to the `UserRole` enum. Updated `authRedirect()` in `libs/shared/utils/src/lib/authUtils.ts` to handle all three roles.

---

### Issue #3 — Ambiguous NestJS vs Express Entry Points

**Found**: Phase 2 (code review)
**Fixed**: Phase 2 (disambiguation comments added)
**Status**: ✅ RESOLVED (documented, files kept for reference)

**Original problem**: The repo contained both NestJS scaffold files (`src/main.ts`, `src/app/app.module.ts`) and the real Express entry point (`src/index.ts`). This caused confusion about which file the server actually starts from.

**Fix**:
- Empty NestJS files annotated with disambiguation comments explaining they are unused scaffolding
- All documentation updated to reference `src/index.ts` as the Express entry point
- `project.json` build target confirmed to use `src/index.ts`

**Note**: The NestJS scaffold files can be safely deleted in a future cleanup PR (they are not imported anywhere).

---

### Issue #4 — CORS Blocked Dev Origins

**Found**: Phase 1
**Fixed**: Phase 2 (commit on `feature/security-foundations`)
**Status**: ✅ RESOLVED

**Original problem**: `CORS_ORIGINS` env var was required for CORS configuration. In development with no `.env`, all cross-origin requests from frontend apps (`:3001-:3003`) were blocked.

**Fix**: Dev fallback in `src/index.ts` — when `NODE_ENV !== "production"` and `CORS_ORIGINS` is not set, the gateway defaults to allowing `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`, `http://localhost:3003`.

**Production note**: `CORS_ORIGINS` must be set explicitly in production — no fallback.

---

### Issue #5 — Inconsistent API Response Shape

**Found**: Phase 2 (audit of all route handlers)
**Fixed**: Phase 3 (partial — `ResponseHandler` used in most routes)
**Status**: 🟡 PARTIALLY RESOLVED — audit still in progress for Phase 4

**Original problem**: Some route handlers returned `{ data: ... }`, others returned plain objects, others used `ResponseHandler.success()`. Frontend had to guess the shape.

**Standard shape**:
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "ERROR_CODE", "message": "Human-readable message" }
```

**Current state**: `ResponseHandler` is used in most routes. A full audit to enforce it everywhere is tracked in Phase 4 work.

---

### Issue #6 — String Literals vs Enums (Role Checks)

**Found**: Phase 1
**Fixed**: Phase 2
**Status**: ✅ RESOLVED

**Original problem**: Some RBAC middleware and service files compared `user.role === "student"` (lowercase string) instead of `user.role === UserRole.STUDENT` (enum). This meant Prisma values (stored as uppercase `STUDENT`) never matched.

**Fix**: All role comparisons updated to use `UserRole` enum from `@takathon/shared/types`. Prisma schema uses uppercase enum values matching the TypeScript enum.

---

### Issue #7 — JWT TTL Env Vars Not Documented

**Found**: Phase 1
**Fixed**: Phase 1
**Status**: ✅ RESOLVED

**Original problem**: `ACCESS_TTL` and `REFRESH_TTL` env vars existed in the token service but were not listed in `.env.example` or docs.

**Fix**: Added to `.env.example` with defaults (900 / 604800). Added to `docs/ENVIRONMENT_VARIABLES.md`.

---

### Issue #8 — Login Page Infinite Refresh Loop

**Found**: Phase 3 (integration testing)
**Fixed**: Phase 3 (`apps/landing-page/src/app/login/page.tsx`)
**Status**: ✅ RESOLVED

**Original problem**: The login page trusted `isAuthenticated` from Zustand (`localStorage`) to decide whether to redirect. After a session expired, the Zustand store still had `isAuthenticated: true`. Login page redirected to dashboard → middleware redirected back to login → infinite loop.

**Fix**: Login page now calls `GET /auth/me` with `credentials: "include"` before trusting the store. If `/auth/me` returns 4xx, it calls `logout()` to clear the stale store.

```typescript
// Correct pattern
useEffect(() => {
  if (!isAuthenticated) return;
  (async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, { credentials: "include" });
      if (res.ok) router.push(authRedirect(user?.role));
      else logout();
    } catch { logout(); }
  })();
}, [isAuthenticated]);
```

---

### Issue #9 — DashboardLayout Auth Redirect Loop

**Found**: Phase 3
**Fixed**: Phase 3 (all portal `DashboardLayout` components)
**Status**: ✅ RESOLVED

**Original problem**: `DashboardLayout` had `if (!isAuthenticated) router.push("/login")`. After cross-origin redirect (landing :3000 → student :3001), `localStorage` is empty on the new origin so `isAuthenticated = false` → redirect back to login → loop.

**Fix**: `DashboardLayout` no longer redirects. `middleware.ts` handles auth guarding at the Edge. `DashboardLayout` only hydrates Zustand from `/auth/me` on mount.

---

### Issue #10 — AI Matching Route Mount Mismatch

**Found**: Phase 3 (API integration testing)
**Fixed**: Phase 3 (`libs/shared/api/src/matching.ts`)
**Status**: ✅ RESOLVED

**Original problem**: Matching router mounted at `/api/v1/students/matching` in `index.ts`. Shared API client called `/students/teams/:id/matches` — a path that routes to the teams router which has no `/:id/matches` sub-route → 404.

**Correct paths**:
- `GET /api/v1/students/matching/:teamId/matches`
- `POST /api/v1/students/matching/:teamId/matches/:userId`

---

### Issue #11 — `getMyTeams()` Returns Nested Shape (Not Flat Array)

**Found**: Phase 3 (teams page UI)
**Fixed**: Phase 3 (teams pages in all frontends)
**Status**: ✅ RESOLVED

**Original problem**: `GET /api/v1/students/teams` returns membership records with a nested team object:
```json
[{ "membershipId": "...", "role": "captain", "joinedAt": "...", "team": { "id": "...", "name": "..." } }]
```
Frontend templates accessed `team.name` directly → `undefined`.

**Fix** (flatten pattern, applied wherever `getMyTeams()` result is used):
```typescript
const teams = (rawTeams as any[]).map((m: any) => ({
  ...(m.team ?? m),
  myRole: m.role ?? m.myRole,
  members: (m.team?.members ?? m.members) || [],
}));
```

---

### Issue #12 — Skill Add/Remove URL Mismatch

**Found**: Phase 3
**Fixed**: Phase 3 (`libs/shared/api/src/student.ts`)
**Status**: ✅ RESOLVED

**Original problem**: Client called `/api/v1/students/profile/skills` → 404. Actual route is `/api/v1/students/skills`.

**Fix**: `addSkill()` calls `POST /api/v1/students/skills`, `removeSkill(id)` calls `DELETE /api/v1/students/skills/:id`.

---

### Issue #13 — `window.prompt()` Used for Skill Input

**Found**: Phase 3 (UX review)
**Fixed**: Phase 3 (`apps/student-portal/src/app/dashboard/profile/page.tsx`)
**Status**: ✅ RESOLVED

**Fix**: Replaced `window.prompt()` with an inline dropdown form. Skill is added immediately on change without page reload.

---

## 🟡 Open / Tracked Items

### Audit #1 — ResponseHandler Not Universal

**Status**: 🟡 Tracked for Phase 4
**Priority**: Medium

Some route handlers in `apps/core-gateway/src/routes/` still return ad-hoc JSON shapes. Target: every handler uses `ResponseHandler.success(res, data)` or `ResponseHandler.error(res, code, message)`.

**Action**: Audit all route files; replace bare `res.json({...})` calls.

---

### Audit #2 — Empty NestJS Scaffold Files

**Status**: 🟡 Low Priority (documented, harmless)
**Files**: `apps/core-gateway/src/main.ts`, `apps/core-gateway/src/app/app.module.ts`, `apps/core-gateway/src/app/app.controller.ts`

**Action**: Delete in a separate `chore/` branch after confirming nothing depends on them.

---

### Audit #3 — Shared UI Library Incomplete

**Status**: 🟡 Phase 4+
**Priority**: Low

`libs/shared/ui/src/` has minimal components. Reusable components (skeletons, toasts, modal wrapper, button variants) are duplicated across apps.

**Action**: Extract common loading/error components to shared UI.

---

*For current architecture decisions see `docs/architecture.md`. For pitfall reference see `.github/copilot-instructions.md`.*
