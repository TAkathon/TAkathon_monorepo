Use this prompt verbatim for the coding agent:

You are operating inside the monorepo at:
 c:\Users\talel\Desktop\TAKATHON_monorepo\TAkathon_monorepo

Goal:
1) Verify that each of the listed changes is actually implemented across the runtime code, tests, and docs (not only instructions).
2) Identify any mismatches, stale comments, or regressions.
3) Propose and, if instructed, implement concrete optimizations and fixes with precise file edits.

Scope to verify

A) Authentication model
- Both accessToken and refreshToken are httpOnly cookies. No Authorization: Bearer header path is used anywhere in runtime.
- Clients send cookies automatically (withCredentials: true).
- Server sets cookies with consistent options (httpOnly: true, sameSite: lax/strict, secure as appropriate).
- Tests reflect cookie-only model.
Files/paths to check:
- apps/core-gateway/src/routes/auth.ts
- apps/core-gateway/src/middleware/auth.ts
- apps/core-gateway/test/auth.spec.ts
- libs/shared/api/src/client.ts
- apps/*/*/src/middleware.ts (student-portal, sponsor-panel, organizer-dashboard)
- Docs: docs/api-specification.md (remove any “token in response body”), docs/REPO_STATE.md, docs/architecture.md

B) AI matching routes
- Mount path: /api/v1/students/matching
- Endpoints:
  - GET /api/v1/students/matching/:id/matches
  - POST /api/v1/students/matching/:id/matches/:userId
- Ensure internal router paths and comments match the mount.
Files/paths to check:
- apps/core-gateway/src/index.ts (mount)
- apps/core-gateway/src/routes/students/matching.ts (handlers and comments)
- libs/shared/api/src/matching.ts (client paths and header comments)
- Docs: docs/REPO_STATE.md, docs/DEVELOPMENT_ROADMAP.md, docs/api-specification.md

C) Student Skills URLs
- POST /api/v1/students/skills
- DELETE /api/v1/students/skills/:id
- GET /api/v1/skills (public list)
Files/paths:
- apps/core-gateway/src/routes/students/profile.ts
- apps/core-gateway/src/routes/shared/skills.ts
- libs/shared/api/src/student.ts
- docs/api-specification.md

D) getMyTeams flattening
- getMyTeams() should return a flattened, canonical TeamSummary shape (no nested structures that require per-page flattening).
- All consumers should rely on this canonical shape.
Files/paths:
- libs/shared/api/src/team.ts
- libs/shared/types/src/lib/team.types.ts
- Consumers in apps/student-portal/src/app/dashboard/**/*.tsx (especially dashboard/page.tsx and teams/page.tsx)

E) isRegistered and isInTeam flags
- Server sets isRegistered and isInTeam for hackathons.
- UI respects them and does not silently block actions; shows disabled state/tooltips and toasts on API errors.
Files/paths:
- apps/core-gateway/src/services/students/hackathon.service.ts
- apps/student-portal/src/app/dashboard/hackathons/page.tsx

F) Tailwind opacity classes
- No invalid tailwind opacity syntaxes like “/8” lingering.
- Consider lint rule to prevent regression.
Files/paths:
- apps/*/*/src/**/*.tsx, **/*.css
- Root eslint config and any Tailwind lint plugin integration

G) Select option dark theme
- Global CSS to style select option in dark backgrounds applied in each Next app or via shared UI baseline.
Files/paths:
- apps/student-portal/src/app/globals.css
- apps/sponsor-panel/src/app/globals.css
- apps/organizer-dashboard/src/app/globals.css
- Consider centralization via libs/shared/ui if duplication becomes an issue

H) Known Bugs & Pitfalls (must be reflected in code or be addressed with plans)
1. Login page infinite refresh loop
   - Avoid client-side redirect loops. Prefer server-side redirect or single-fire guarded client redirect.
   - File: apps/landing-page/src/app/login/page.tsx
2. DashboardLayout auth redirect loop
   - Guard store hydration and redirects (mounted ref, stable deps, avoid redirect while loading).
   - File: apps/student-portal/src/components/DashboardLayout.tsx
3. Docker layer cache “fixes not running”
   - Dockerfile stage ordering, .dockerignore, and guidance for build --no-cache. Optionally add ARG CACHE_BUST.
   - Files: apps/*/Dockerfile, .dockerignore, docs/docker-setup.md
4. AI matching route mount mismatch
   - Ensure all comments/docs match /students/matching as above.
5. getMyTeams nested shape must be flattened
   - Centralize in libs/shared/api/src/team.ts; update types and refactor consumers.
6. Skill add/remove URL mismatch
   - Confirm aligned as above.
7. isInTeam blocks withdraw silently
   - Improve UI affordances and error handling.
8. Tailwind invalid opacity classes
   - Ensure none and enforce linting.
9. select option ignores dark background
   - Ensure global CSS present and optionally centralized.
10. AI agent fails to fetch suggestions
   - Verify the matching client (libs/shared/api/src/matching.ts) and server handlers (apps/core-gateway/src/routes/students/matching.ts) are wired, reachable, and return expected payloads.
   - Confirm gateway-to-AI engine integration if applicable; check service layer, environment variables, and error propagation.
   - Add tests or mock integration to reproduce and fix.
11. Profile updates reset after page refresh (state not persisted)
   - Ensure profile updates call the correct endpoints and that server persists changes.
   - After update, re-fetch canonical data on page load (SSR or useEffect) and avoid relying solely on local UI state/Zustand.
   - Verify middleware and cookie-based auth don’t block the fetch after refresh.

What to produce

1) A verification report:
- For each scope item (A–H and items 10–11), list:
  - Verified OK, or
  - Issues found: file + line or snippet + exact mismatch description.

2) A precise patch plan with file-by-file diffs to fix issues:
- Do not just describe; prepare exact minimal edits.
- For comments/docs mismatches, update the documentation blocks and code comments to match the real endpoints and behavior.
- For getMyTeams flattening, implement flattening in libs/shared/api/src/team.ts, update types in libs/shared/types/src/lib/team.types.ts, and simplify consumers. Include migration notes if any fields change.
- For isInTeam UX, update apps/student-portal/src/app/dashboard/hackathons/page.tsx logic to disable/hide actions with tooltip and toast on error.
- For Tailwind linting, add eslint-plugin-tailwindcss to root config, wire in CI if applicable.
- For Docker, reorder COPY/INSTALL steps and update docs with cache-busting guidance.
- For AI suggestions failure, trace the request path end-to-end (client → gateway route → service layer → external AI engine), fix mount/path/params and error handling, and add a regression test.
- For profile persistence on refresh, ensure server write succeeds, invalidate/revalidate caches as needed, and re-fetch profile data on mount/SSR.

3) Optimizations to implement now
- Centralize API route constants in a single shared module (e.g., libs/shared/api/src/routes.ts) referenced by client code and used to generate comments/docs.
- Unify cookie options in a single constant used wherever cookies are set.
- Add a lightweight e2e test for matching endpoint to assert no Authorization header is needed and cookies suffice.
- Add a state rehydration strategy for profile (SSR data fetch or post-update re-fetch) to avoid stale UI after reload.

Execution constraints and guidelines
- Use repository-aware search and targeted file reads to confirm current state.
- When modifying files, keep changes minimal and cohesive; preserve formatting and import ordering.
- Update code comments, docs, and tests together to avoid drift.
- Do not introduce breaking API changes without updating all consumers in the monorepo.
- After preparing the patch plan, present a short “apply order” to minimize conflicts:
  1) Types and shared API changes
  2) Gateway route/comment/doc alignment
  3) Matching flow fixes (client/gateway/AI integration) and tests
  4) Profile persistence fixes (client SSR/rehydration)
  5) UI changes (hackathons page, DashboardLayout, login redirect)
  6) Lint/CI and Docker improvements
  7) Docs final sweep

Acceptance criteria
- No references to Authorization: Bearer in runtime or docs.
- All matching paths consistently use /api/v1/students/matching/:id/matches for GET and POST :userId for invites across server, client, comments, and docs.
- getMyTeams returns flattened shape; all consumers compile and run without local flatten hacks.
- isRegistered/isInTeam UX blocks are explicit and not silent.
- No invalid Tailwind opacity classes; lint configured to prevent future ones.
- Select option dark theme handled globally or via shared baseline.
- Dockerfiles improved; docs explain cache-busting.
- AI teammate suggestions flow works end-to-end; failing request path is fixed and covered by tests.
- Profile updates are persisted and reflected after page refresh via SSR or re-fetch; no stale state on reload.
- The “Known Bugs & Pitfalls” list each has either a confirmed code fix or documented mitigation/notes pointing to the exact changed files.
