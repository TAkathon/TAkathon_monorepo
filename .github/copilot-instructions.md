# TAkathon Copilot Instructions

> Every statement below is an actionable imperative — not documentation.
> For detailed docs, see `docs/`. For task-specific scaffolding, see `.github/prompts/`.

---

## 🔀 Prompt Selection & Task Routing System

When a user describes a task, select the correct `.github/prompts/` file using the decision table below.
**Always match the most specific prompt first.** If multiple match, use the Cascade rule.

### Decision Table

| Priority | Trigger Condition                                                                                             | Prompt File                                                                                                            | What It Scaffolds                         |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1        | Task mentions "schema", "Prisma model", "migration", "database field/column", or edits `prisma/schema.prisma` | `db-schema-change.prompt.md`                                                                                           | Full-stack schema propagation (8 steps)   |
| 2        | Task mentions "route", "endpoint", "API handler", or edits `apps/core-gateway/src/routes/`                    | `new-gateway-route.prompt.md`                                                                                          | Express route + service pair              |
| 3        | Task mentions "API function", "client function", "shared API", or edits `libs/shared/api/src/`                | `new-shared-api-function.prompt.md`                                                                                    | Typed Axios wrapper in shared API lib     |
| 4        | Task mentions "page", "dashboard", "UI", "portal view", or edits `apps/*/src/app/dashboard/`                  | `new-dashboard-page.prompt.md`                                                                                         | Next.js dashboard page (client component) |
| 5        | Task spans 2+ layers (e.g., "add a new field and show it in the dashboard")                                   | **Cascade** in this order: `db-schema-change` → `new-gateway-route` → `new-shared-api-function` → `new-dashboard-page` | Full-stack feature                        |
| —        | None of the above (bug fix, refactor, config, docs)                                                           | No prompt — use general rules from this file                                                                           | Ad-hoc work                               |

### Cascade Rule for Multi-Layer Tasks

Execute prompts **top-down** (database → backend → shared API → frontend).
Never implement the frontend before the API function exists.
Never implement the API function before the route exists.
Never implement the route before the schema supports it.

### Routing Examples

| User Request                                              | Matched Prompt(s)         |
| --------------------------------------------------------- | ------------------------- |
| "Add a team description field to the schema"              | `db-schema-change`        |
| "Create GET /organizers/hackathons/:id/leaderboard"       | `new-gateway-route`       |
| "Add a getLeaderboard function to the shared API"         | `new-shared-api-function` |
| "Build the hackathon leaderboard page"                    | `new-dashboard-page`      |
| "Add a budget field to sponsors and show it in the panel" | Cascade all 4 prompts     |
| "Fix the login redirect loop"                             | No prompt (general rules) |

---

## 🚨 Critical Rules (Non-Negotiable)

These rules override all other context. Violating any one produces broken code.

| #   | Rule                                                                                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JWT = httpOnly cookies ONLY.** Never use `Authorization: Bearer` in runtime code, docs, or tests. Access token = `req.cookies.accessToken`. Axios client uses `withCredentials: true`. |
| 2   | **AI matching mount = `/api/v1/students/matching`** (NOT `/students/teams`). Correct paths: `GET /api/v1/students/matching/:teamId/matches`, `POST .../matches/:userId`.                 |
| 3   | **Student skills endpoints**: `POST /api/v1/students/skills`, `DELETE /api/v1/students/skills/:id`. Public skills: `GET /api/v1/skills`.                                                 |
| 4   | **`getMyTeams()` returns nested shape.** Always flatten: `rawTeams.map(m => ({ ...(m.team ?? m), myRole: m.role ?? m.myRole, members: (m.team?.members ?? m.members) \|\| [] }))`        |
| 5   | **Profile skills shape**: `{ id, skillId, skillName, category, proficiencyLevel, yearsOfExperience }` — NO nested `skill: { name }`. Access name as `s.skillName`.                       |
| 6   | **After profile save**, always re-call `getMyProfile()` to re-sync local state from DB.                                                                                                  |
| 7   | **DashboardLayout must NOT redirect to `/login`** — only `middleware.ts` does that. On mount, call `GET /auth/me` to hydrate Zustand.                                                    |
| 8   | **Login page**: verify `/api/v1/auth/me` before trusting Zustand `isAuthenticated`. Clear store on 4xx.                                                                                  |
| 9   | **Tailwind opacity**: multiples of 5 only (`bg-white/10`, not `bg-white/8`).                                                                                                             |
| 10  | **`select option` dark theme**: apply via `globals.css` (`select option { background-color: #1A0A00; color: #fff; }`). Browser ignores Tailwind on `<option>`.                           |
| 11  | **Docker rebuild**: always `docker compose build --no-cache <service>` after source changes. Never trust cached layers.                                                                  |
| 12  | **Express entry point**: `apps/core-gateway/src/index.ts` — NOT `src/main.ts` (empty NestJS scaffold).                                                                                   |
| 13  | **Prisma 7 adapter pattern**: `const pool = new Pool({ connectionString }); const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });` Import from `src/lib/prisma.ts`.          |
| 14  | **AI matching fallback** must return `MatchResult` shape: `{ suggestions: [...], totalCandidates: N }` with `score` in 0–1 range.                                                        |

---

## 🏗️ Architecture Rules

| Constraint             | Rule                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Monorepo               | Nx workspace. Apps import from `libs/` — never from other apps.                                                                                              |
| Single Gateway         | All API requests go through `apps/core-gateway` (Express). No direct DB access from frontends.                                                               |
| AI Engine              | Stateless. Receives data from gateway via JSON. Never accesses the database.                                                                                 |
| Shared auth utils risk | `@takathon/shared/utils` auth redirect/store logic is shared by all portals. Any change requires regression testing in student, organizer, and sponsor apps. |
| Data flow              | `Browser → Core Gateway → [PostgreSQL \| AI Engine]`.                                                                                                        |
| Route structure        | `/api/v1/<role>/<resource>`. Roles: `students`, `organizers`, `sponsors`. Public: `auth`, `hackathons`, `skills`.                                            |
| Matching router        | Mounted at `/api/v1/students/matching` in `index.ts` — BEFORE the teams router to avoid path conflicts.                                                      |

### Service Ports

| Service             | Port | Container          |
| ------------------- | ---- | ------------------ |
| landing-page        | 3000 | takathon-landing   |
| student-portal      | 3001 | takathon-student   |
| organizer-dashboard | 3002 | takathon-organizer |
| sponsor-panel       | 3003 | takathon-sponsor   |
| core-gateway        | 8000 | takathon-gateway   |
| ai-engine           | 8001 | takathon-ai        |
| PostgreSQL          | 5432 | takathon-db        |

---

## 🧱 Layer Separation

### Frontend Layer (Next.js 15, App Router)

→ Cross-ref: `.github/prompts/new-dashboard-page.prompt.md`

- Use `"use client"` for all dashboard pages.
- Wrap in `DashboardLayout` — it does NOT redirect, only hydrates Zustand from `GET /auth/me`.
- Data fetch via typed modules from `@takathon/shared/api` — never raw `fetch` or bare `axios`.
- State: Zustand for auth only (`useAuthStore`). Don't over-cache — fetch fresh from API.
- Route protection: `middleware.ts` reads httpOnly cookie → redirects to `/login` if absent.
- Import types: `@takathon/shared/types`. Import components: `@takathon/shared/ui`.

### Backend Layer (Express + Prisma 7)

→ Cross-ref: `.github/prompts/new-gateway-route.prompt.md`

- Route-Middleware-Service pattern. Services are pure functions (no `req`/`res`).
- Auth chain: `requireAuth` → role guard (`requireStudent` / `requireOrganizer` / `requireSponsor`).
- Validation: Zod schemas on every handler. Return `422` on validation failure.
- Response shape: always `{ success: true, data: ... }` or `{ success: false, error: "CODE", message: "..." }`.
- Prisma client: import from `src/lib/prisma.ts` (adapter pattern already set up).
- Register new routes in `src/index.ts` and document the mount path in a comment.

### AI Engine Layer (FastAPI + Python 3.11+)

- Stateless computation only — receives all data from gateway via POST body.
- Scoring weights: `skill_complementarity` (40%), `experience_balance` (30%), `availability_overlap` (30%).
- Proficiency map: `beginner→1, intermediate→2, advanced→3, expert→4`.
- Gateway fallback: if AI engine is down, use local `basicScoring()` and set `fallback: true`.
- Fallback contract is mandatory: return `MatchResult` shape `{ suggestions: [...], totalCandidates: N }`.
- Fallback scoring contract is mandatory: `score` must stay in `0–1` range with populated `scoreBreakdown` and explanation fields.
- Tests: `cd apps/ai-engine && python -m pytest tests/ -v`.

### Shared Libraries Layer

→ Cross-ref: `.github/prompts/new-shared-api-function.prompt.md`

| Library | Import Path              | Purpose                                                                                             |
| ------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| Types   | `@takathon/shared/types` | UserRole, domain models, API request/response types                                                 |
| API     | `@takathon/shared/api`   | Typed Axios client + domain API modules (studentApi, teamApi, organizerApi, notificationsApi, etc.) |
| Utils   | `@takathon/shared/utils` | Zustand auth store (`useAuthStore`), `authRedirect`, URL helpers                                    |
| UI      | `@takathon/shared/ui`    | `Skeleton`, `Breadcrumbs`, `AvatarMenu`, `Button`, `Input`, `Card` components                       |

**New UI component usage**:

```tsx
// Skeleton loading
import { SkeletonStatCard, SkeletonHackathonList } from "@takathon/shared/ui";
if (loading) return <SkeletonHackathonList />;

// Breadcrumbs on detail pages
import { Breadcrumbs } from "@takathon/shared/ui";
<Breadcrumbs
  items={[{ label: "Hackathons", href: "/hackathons" }, { label: title }]}
  showBack
/>;

// Notifications API
import { notificationsApi } from "@takathon/shared/api";
const { notifications } = await notificationsApi.getNotifications();
await notificationsApi.markAsRead(id);
await notificationsApi.deleteNotification(id);
```

---

## 🔐 Auth & Security Rules

| Rule           | Detail                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Token storage  | httpOnly cookies only (`accessToken`, `refreshToken`). Never in response body / localStorage / JS.    |
| `requireAuth`  | Reads `req.cookies.accessToken`. NOT `Authorization` header.                                          |
| Axios client   | `withCredentials: true`. Browser sends cookies automatically.                                         |
| Auto-refresh   | On 401 → `POST /api/v1/auth/refresh` → retry. On failure → clear Zustand → redirect to `/login`.      |
| Session verify | Always `GET /api/v1/auth/me` with `credentials: "include"` to confirm cookie is live.                 |
| Rate limiting  | Implemented: 10 req/15 min on `/auth/login` and `/auth/register` via `express-rate-limit`.            |
| Startup guard  | In production, gateway exits if `DATABASE_URL`, `JWT_ACCESS_SECRET`, or `JWT_REFRESH_SECRET` missing. |

---

## 📡 Shared API Rules

**Client**: `libs/shared/api/src/client.ts` — Axios with `baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`.

### URL Path Rules (All paths include `/api/v1/` prefix)

| Category             | Path Pattern                                | Methods                                                  |
| -------------------- | ------------------------------------------- | -------------------------------------------------------- |
| Student profile      | `/api/v1/students/profile`                  | `GET`, `PUT`                                             |
| Student skills       | `/api/v1/students/skills`                   | `POST`, `DELETE /:id`                                    |
| Student hackathons   | `/api/v1/students/hackathons`               | `GET`, `POST /:id/register`, `POST /:id/withdraw`        |
| Student teams        | `/api/v1/students/teams`                    | `GET`, `POST`, `DELETE /:id`, `POST /:id/invite`         |
| AI matching          | `/api/v1/students/matching/:teamId/matches` | `GET`, `POST /:userId`                                   |
| Student settings     | `/api/v1/students/settings`                 | `GET`, `PUT`                                             |
| Organizer hackathons | `/api/v1/organizers/hackathons`             | Full CRUD + `POST /:id/publish\|start\|complete\|cancel` |
| Organizer settings   | `/api/v1/organizers/settings`               | `GET`, `PUT`                                             |
| Notifications        | `/api/v1/notifications`                     | `GET`, `PUT /:id/read`, `DELETE /:id`                    |
| Sponsor              | `/api/v1/sponsors/*`                        | Profile, hackathons, teams, favorites                    |
| Public hackathons    | `/api/v1/hackathons`                        | `GET`, `GET /:id`                                        |
| Public skills        | `/api/v1/skills`                            | `GET`                                                    |
| Auth                 | `/api/v1/auth/*`                            | `POST login\|register\|refresh\|logout`, `GET me`        |

### API Module Rules

- Every function must have an explicit TypeScript return type from `@takathon/shared/types`.
- All paths must include the `/api/v1/` prefix (the `baseURL` does NOT include it).
- Export every new function from `libs/shared/api/src/index.ts` barrel.
- Never use raw `axios` or `fetch` in pages — always use typed domain modules.

---

## 🐳 Docker Rules

| Rule                              | Detail                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rebuild after source changes      | Always `docker compose build --no-cache <service>` then `docker compose up -d <service>`.                                                                |
| Never trust cached layers         | `docker compose up -d` (no `--build`) uses the old image. Always rebuild.                                                                                |
| Frontend env var                  | `NEXT_PUBLIC_API_URL=http://localhost:8000` in `docker-compose.yml`. No `/api/v1` suffix — API modules include it.                                       |
| Gateway startup migrations        | `apps/core-gateway/entrypoint.sh` must run `prisma migrate deploy` on startup. Never revert startup behavior to `prisma db push` / `--accept-data-loss`. |
| AI Engine env var                 | `AI_ENGINE_URL=http://ai-engine:8001` injected into gateway container. Local dev: `http://localhost:8001`.                                               |
| DB in Docker                      | `postgres:16-alpine` on port 5432. Logs: `docker logs takathon-db`.                                                                                      |
| Build failure on `node:22-alpine` | Check Docker Desktop proxy/DNS or network settings.                                                                                                      |
| NODE_ENV in builds                | Do NOT set `NODE_ENV="development"` in `.env`. Next.js builds require `NODE_ENV=production`.                                                             |

---

## 🎨 Design System

| Property           | Value                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Theme              | Dark mode only. Base: `#1A0A00`.                                                                                               |
| Primary color      | `#D94C1A` (Orange/Rust).                                                                                                       |
| UI pattern         | Glassmorphism (`.glass` class in `globals.css`).                                                                               |
| Buttons            | `.btn-primary`, `.btn-secondary`. Always `disabled` + spinner during async.                                                    |
| Inputs             | `.input-field` class.                                                                                                          |
| Native select note | `select option` dark styling is a browser limitation workaround in `globals.css`, not the preferred long-term theming pattern. |
| Icons              | Lucide React.                                                                                                                  |
| Responsive         | `md:` / `lg:` breakpoints. Mobile-friendly at 375px.                                                                           |
| Loading            | `<Loader2 className="animate-spin" />` from lucide-react.                                                                      |
| Empty states       | Always show helpful message + CTA when a list is empty.                                                                        |

---

## 🐛 Known Bugs & Pitfalls (Compact)

Never repeat these mistakes. Full code examples in `docs/FRONTEND_PATTERNS.md`.

| #   | Bug                                    | Rule                                                                                              |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Login infinite redirect loop           | Never trust Zustand `isAuthenticated` alone. Always verify via `GET /auth/me` before redirecting. |
| 2   | DashboardLayout redirect loop          | Layout only hydrates Zustand. `middleware.ts` handles all auth redirects.                         |
| 3   | Docker cache hides committed fixes     | Always `--no-cache` rebuild after source changes.                                                 |
| 4   | AI matching route 404                  | Mount is `/students/matching`, NOT `/students/teams`. Open `index.ts` to verify.                  |
| 5   | Teams show empty/undefined fields      | `getMyTeams()` returns nested `{ team: {...} }` — must flatten before rendering.                  |
| 6   | Skill add/remove 404                   | URL is `/students/skills`, NOT `/students/profile/skills`.                                        |
| 7   | Withdraw blocked silently when in team | Show "In Team — leave team to withdraw" badge when `isInTeam: true`.                              |
| 8   | Tailwind opacity values invalid        | Only multiples of 5: `/10`, `/20`. Never `/8`, `/12`.                                             |
| 9   | `<option>` ignores dark theme          | Use `globals.css` (`select option { background: #1A0A00; }`), not Tailwind classes.               |
| 10  | NODE_ENV breaks Next.js builds         | Never set `NODE_ENV="development"` in `.env`. Nx builds need `NODE_ENV=production`.               |

---

## 🔧 Development Workflow

### Docker (Preferred)

```bash
docker compose up -d                          # Start all 7 services
docker compose logs -f                        # Follow logs
docker compose build --no-cache <service>     # Rebuild after source changes
docker compose up -d <service>                # Restart rebuilt service
docker compose down                           # Stop all
```

### Local (Nx)

```bash
nx serve student-portal          # Dev server on :3001
nx serve core-gateway            # Dev server on :8000
nx build <app>                   # Production build
nx test <app>                    # Run tests
nx affected:build                # Build only changed apps
```

> **Build Note**: Nx build requires `NODE_ENV=production`. On Windows: `$env:NODE_ENV="production"; npx nx build <app>`.
> Use `NX_PLUGIN_NO_TIMEOUTS=true` and `NX_DAEMON=false` for stable graph generation on Windows.

### Database

```bash
npm run db:start       # Start PostgreSQL container
npm run db:generate    # Generate Prisma Client (after schema changes)
npm run db:push        # DEV ONLY — never use on staging/prod
npx prisma migrate deploy  # Required for staging/prod database changes
npm run db:seed        # Populate test data
npm run db:studio      # Open Prisma Studio GUI
npm run db:reset       # Full reset + restart
```

- Connection: `postgresql://postgres:postgrespassword@localhost:5432/takathon?schema=public`
- For detailed DB docs, see `database/README.md`.

### Git Workflow

- **Never commit directly to `main`**. Only merge from `release/*` or `hotfix/*`.
- Branch from `dev`: `feature/`, `fix/`, `chore/`, `docs/`.
- Conventional commits (see `COMMIT_CONVENTIONS.md`).
- Every merge to `dev` or `main` via Pull Request.

---

## 📋 Implementation Order (Full-Stack Features)

When implementing a feature that touches multiple layers, always follow this order:

1. **Schema** → `prisma/schema.prisma` → `npm run db:generate` → `npm run db:push` (dev only) / `npx prisma migrate deploy` (staging/prod)
2. **Service** → `apps/core-gateway/src/services/<role>/<feature>.service.ts`
3. **Route** → `apps/core-gateway/src/routes/<role>/<feature>.ts` → register in `src/index.ts`
4. **Shared Types** → `libs/shared/types/src/` → add TypeScript interfaces
5. **Shared API** → `libs/shared/api/src/<module>.ts` → export from barrel
6. **Frontend Page** → `apps/<portal>/src/app/dashboard/<feature>/page.tsx`
7. **Build Verify** → `$env:NODE_ENV="production"; npx nx build <app>`

---

## 📊 Project Status (V1 — March 2026)

**Phase**: V1 Complete (~95% complete) — Phase 4 Polish done
**Branch**: `dev` (active development)

For full details, see these docs:

| Document                 | Path                            | Content                        |
| ------------------------ | ------------------------------- | ------------------------------ |
| Implementation inventory | `docs/REPO_STATE.md`            | What's built, per-file status  |
| Architecture diagrams    | `docs/architecture.md`          | System diagrams, data flow     |
| API reference            | `docs/api-specification.md`     | Full endpoint documentation    |
| Frontend patterns        | `docs/FRONTEND_PATTERNS.md`     | UI patterns with code examples |
| Naming standards         | `docs/NAMING_CONVENTIONS.md`    | Naming across all layers       |
| Environment variables    | `docs/ENVIRONMENT_VARIABLES.md` | All env vars documented        |
| Development roadmap      | `docs/DEVELOPMENT_ROADMAP.md`   | Remaining tasks and priorities |

### Test Credentials

All seed users share password: `password123`

- **Students**: alice/bob/carol/david.student@university.edu
- **Organizers**: emma/frank.organizer@company.com
- **Sponsors**: grace/henry.sponsor@corp.com

### V1 Remaining Work

1. ~~Loading skeletons, toast notifications~~ ✅ Done
2. Organizer: hackathon `[id]/edit` form page, CSV export wiring
3. E2E testing (auth, teams, hackathons)
4. Deployment documentation (Render/DigitalOcean)

### New in Phase 4 (March 4, 2026)

- **Notifications system**: `GET/PUT /api/v1/notifications` — Prisma `Notification` model, service, route, API module (`libs/shared/api/src/notifications.ts`), page in all 3 portals
- **Student settings**: `GET/PUT /api/v1/students/settings` — `StudentSettings` model, service (`settings.service.ts`), route (`routes/students/settings.ts`)
- **Organizer settings**: `GET/PUT /api/v1/organizers/settings` — `OrganizerSettings` model, service, route
- **Shared UI components** added to `libs/shared/ui`:
  - `Skeleton` — 12 skeleton primitives (`SkeletonStatCard`, `SkeletonHackathonCard`, `SkeletonTeamCard`, `SkeletonNotificationRow`, `SkeletonTable`, etc.)
  - `Breadcrumbs` — `<Breadcrumbs items={BreadcrumbItem[]} showBack? />` for nested page navigation
  - `AvatarMenu` — user dropdown with role badge and logout action
- **New frontend pages**:
  - `student-portal`: `dashboard/notifications/page.tsx`
  - `organizer-dashboard`: `notifications/page.tsx`, `hackathons/[id]/page.tsx`
  - `sponsor-panel`: `dashboard/notifications/page.tsx`, `dashboard/sponsored/[id]/page.tsx`
- **UX polish on all pages**: skeleton loading states, `sonner` toast feedback, empty states with CTAs, textarea char counts, password visibility toggles
- **Navigation improvements**: sidebar `startsWith` active state (child routes highlight parent), breadcrumbs on all detail pages
- **Accessibility**: `aria-label` on all icon-only buttons across all 3 portals

### Out of Scope for V1

- Real-time messaging (WebSockets)
- Editable project details with DB persistence
- AI coaching / chatbot (Phase 4+)
- ML-based matching (V2: replaces deterministic scorer)
