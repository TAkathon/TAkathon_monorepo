# TAkathon — System Architecture

**Last Updated**: March 3, 2026

---

## Overview

TAkathon is a hackathon team formation platform built as a Nx monorepo. It helps students find teammates, organizers manage events, and sponsors discover talent.

**Core data flow**:

```
Browser (Next.js) → Core Gateway (Express) → PostgreSQL
                                           → AI Engine (FastAPI)
```

All authentication is managed at the gateway. The AI engine is stateless (receives data from gateway, returns recommendations).

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Clients                          │
│                                                                  │
│  ┌─────────────┐ ┌──────────────────┐ ┌──────────────────────┐  │
│  │ landing-page│ │  student-portal  │ │ organizer-dashboard  │  │
│  │ :3000       │ │  :3001           │ │ :3002                │  │
│  └──────┬──────┘ └────────┬─────────┘ └──────────┬───────────┘  │
│         │                 │                       │              │
│         │          ┌──────┴───────┐               │              │
│         │          │ sponsor-panel│               │              │
│         │          │ :3003        │               │              │
│         │          └──────┬───────┘               │              │
└─────────┼─────────────────┼───────────────────────┼─────────────┘
          │  httpOnly cookies (withCredentials: true)│
          └─────────────────┬───────────────────────┘
                            ▼
              ┌─────────────────────────┐
              │  Core Gateway (Express) │   :8000
              │  apps/core-gateway/     │
              │  src/index.ts           │
              │                         │
              │  ┌──────────────────┐   │
              │  │  Auth Routes     │   │
              │  │  /api/v1/auth/*  │   │
              │  └──────────────────┘   │
              │  ┌──────────────────┐   │
              │  │  Student Routes  │   │
              │  │  /api/v1/students│   │
              │  └──────────────────┘   │
              │  ┌──────────────────┐   │
              │  │ Organizer Routes │   │
              │  │ /api/v1/organiz. │   │
              │  └──────────────────┘   │
              │  ┌──────────────────┐   │
              │  │  Sponsor Routes  │   │
              │  │  /api/v1/sponsors│   │
              │  └──────────────────┘   │
              └─────────┬───────────────┘
                        │
           ┌────────────┼────────────┐
           ▼                         ▼
┌─────────────────┐     ┌────────────────────────┐
│  PostgreSQL 16  │     │  AI Engine (FastAPI)   │
│  :5432          │     │  :8001                 │
│  via Prisma 7   │     │  /api/v1/matching/     │
│  (PrismaPg)     │     │  recommend             │
└─────────────────┘     └────────────────────────┘
```

---

## Application Layer (Next.js 15)

### Apps

| App                    | Port | Audience   | Key Features                              |
|------------------------|------|------------|-------------------------------------------|
| `landing-page`         | 3000 | Public     | Home, login, signup                       |
| `student-portal`       | 3001 | Students   | Teams, hackathons, AI matching, settings  |
| `organizer-dashboard`  | 3002 | Organizers | Hackathon CRUD, participants, analytics   |
| `sponsor-panel`        | 3003 | Sponsors   | Opportunities, team browsing, budgeting   |

### Design System

- **Theme**: Dark mode only — base `#1A0A00`
- **Primary color**: `#D94C1A` (orange/rust)
- **Pattern**: Glassmorphism via `.glass` CSS class
- **Standard classes**: `.btn-primary`, `.btn-secondary`, `.input-field`, `.glass`
- **Icons**: Lucide React

> ⚠️ `select option` elements ignore Tailwind dark mode classes. Use global CSS: `select option { background-color: #1A0A00; color: #fff; }`

### Route Protection

Each app (except `landing-page`) has `src/middleware.ts` that reads the `accessToken` httpOnly cookie. If absent, redirects to `/login`.

```typescript
// apps/student-portal/src/middleware.ts — pattern
export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
```

`DashboardLayout` does **not** redirect. It hydrates Zustand from `GET /auth/me` on mount to restore user state after cross-origin navigation (where `localStorage` is empty on the new origin).

---

## API Gateway (Express)

**Location**: `apps/core-gateway/src/`
**Entry point**: `src/index.ts` — all route mounts defined here

> ⚠️ **Not NestJS**. There are empty NestJS scaffold files (`src/main.ts`, `src/app/`) — ignore them. The real Express server is at `src/index.ts`.

### Middleware Stack (in order)

```
cors()           → allows all Next.js origins (dev: localhost:3000-3003)
express.json()   → body parser
cookieParser()   → parses httpOnly cookies
rateLimiter      → applied per-route (auth only)
requireAuth      → reads req.cookies.accessToken, verifies JWT
requireRole      → checks user.role matches route segment
```

### Route Organization

```
/api/v1/auth/*                 → auth.ts (public)
/api/v1/students/*             → students/profile.ts, hackathons.ts, teams.ts
/api/v1/students/matching/*    → students/matching.ts  ← mounted BEFORE /teams
/api/v1/students/skills        → students/profile.ts
/api/v1/organizers/*           → organizers/profile.ts, hackathons.ts
/api/v1/sponsors/*             → sponsors/profile.ts, hackathons.ts, teams.ts
/api/v1/hackathons/*           → shared/hackathons.ts (public)
/api/v1/skills                 → shared/skills.ts (public)
/api/v1/health                 → health check
```

> ⚠️ **Route mount order matters**: The matching router (`/api/v1/students/matching`) must be mounted before the teams router in `index.ts` to avoid path conflicts.

### Authentication Flow

```
1. Client: POST /auth/login { email, password }
2. Gateway: validates, signs JWT tokens, calls res.cookie("accessToken", ..., { httpOnly: true, secure: true })
3. Client: subsequent requests carry cookies automatically
4. Gateway middleware: reads req.cookies.accessToken → verifies → attaches req.user
5. On expiry: Axios interceptor → POST /auth/refresh → gateway rotates accessToken cookie
6. On refresh failure: interceptor redirects to /login
```

### Database Access

Prisma 7 requires the adapter pattern (not direct instantiation):

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

---

## AI Engine (FastAPI)

**Location**: `apps/ai-engine/`
**Port**: 8001
**Status**: V1 complete — deterministic scoring, no ML yet

### Key Design Principles

- **Stateless**: receives all data from core-gateway; never connects to the database
- **Deterministic**: same inputs always produce same output (designed for ML swap in V2)
- **Resilient**: core-gateway has `basicScoring()` fallback if AI engine is unreachable

### Service Responsibilities

```
Core Gateway                           AI Engine
     │                                      │
     │  POST /api/v1/matching/recommend      │
     │  { teamSkills, candidates,            │
     │    openSpots, teamAvailability }      │
     │ ──────────────────────────────────►  │
     │                                      │ scoring.py
     │                                      │   skill_complementarity (40%)
     │                                      │   experience_balance (30%)
     │                                      │   availability_overlap (30%)
     │                                      │ engine.py
     │                                      │   combine scores, generate explanations
     │ ◄──────────────────────────────────  │
     │  { suggestions: [                    │
     │      { userId, score, breakdown,     │
     │        explanation }                 │
     │    ], fallback: false }              │
```

### Scoring Algorithm

| Scorer                  | Weight | Notes                                      |
|-------------------------|--------|--------------------------------------------|
| `skill_complementarity` | 40%    | Skills unique to candidate / team skill gaps |
| `experience_balance`    | 30%    | Target: mean proficiency = 2.5 (scale 1–4) |
| `availability_overlap`  | 30%    | Jaccard slot similarity (70%) + hours compat (30%) |

**Proficiency map**: `beginner→1`, `intermediate→2`, `advanced→3`, `expert→4`  
**Availability neutral**: returns 0.5 if either side has no availability data

### Testing

```bash
cd apps/ai-engine
python -m pytest tests/ -v
```

---

## Database (PostgreSQL 16)

**Location**: Docker container `takathon-db` / connection via Prisma at `prisma/schema.prisma`

### Schema Overview

```
users ─┬─ student_profiles ── user_skills ── skills
       ├─ organizer_profiles
       └─ sponsor_profiles

hackathons ── hackathon_participants
           └─ teams ── team_members
                    └─ team_invitations
                    └─ team_sponsorships
```

### Key Schema Decisions

- `StudentProfile.availability` is `Json? @db.JsonB` — flexible shape, not normalized
- `UserSkill` has a `proficiency` enum (BEGINNER / INTERMEDIATE / ADVANCED / EXPERT)
- `TeamInvitation` has `status` enum (PENDING / ACCEPTED / DECLINED)
- `Hackathon` has full lifecycle: (DRAFT / PUBLISHED / ACTIVE / COMPLETED / CANCELLED)

### Migrations

- **Development**: `npx prisma db push` (schema sync, no migration files)
- **Production**: `npx prisma migrate deploy` (applies committed migration files)

---

## Shared Libraries (`libs/shared/`)

### `@takathon/shared/api`

Axios client + typed domain API modules. Always use these in frontend — never raw `fetch` or `axios.get()`.

```typescript
import { studentApi, teamApi, matchingApi, organizerApi, hackathonApi } from "@takathon/shared/api";

// Examples
const profile = await studentApi.getMyProfile();
const teams = await teamApi.getMyTeams();           // returns nested shape — must flatten
const suggestions = await matchingApi.suggestTeammates(teamId, 10);
```

**Axios client config** (`client.ts`):
- `baseURL` = `NEXT_PUBLIC_GATEWAY_URL` (e.g. `http://localhost:8000`)
- `withCredentials: true` — sends httpOnly cookies cross-origin
- Response interceptor: on 401 → `POST /auth/refresh` → retry; on failure → `window.location = "/login"`

### `@takathon/shared/utils`

```typescript
import { useAuthStore } from "@takathon/shared/utils";
import { authRedirect } from "@takathon/shared/utils";

const { user, isAuthenticated, login, logout } = useAuthStore();
// authRedirect(role) → "/dashboard" on login-page origin; role-specific path on portal origin
```

### `@takathon/shared/types`

```typescript
import { UserRole, Team, Hackathon, MatchSuggestion } from "@takathon/shared/types";

enum UserRole { STUDENT = "STUDENT", ORGANIZER = "ORGANIZER", SPONSOR = "SPONSOR" }
```

### `@takathon/shared/ui`

Basic reusable React components (partial). Prefer building page-specific components inline for now.

---

## Service Communication

| From                | To              | Protocol    | Auth                    |
|---------------------|-----------------|-------------|-------------------------|
| Browser             | Core Gateway    | HTTPS/REST  | httpOnly cookies        |
| Core Gateway        | PostgreSQL      | TCP/Prisma  | `DATABASE_URL` env var  |
| Core Gateway        | AI Engine       | HTTP/REST   | Internal network only   |
| AI Engine           | (nothing)       | —           | Stateless computation   |

---

## Build & Deployment Architecture

### Development (Docker Compose)

All 7 services run in Docker. Frontend apps use Next.js dev server with hot reload via volume mounts.

### Production Build

- **Core Gateway**: esbuild bundles `src/index.ts` → single `dist/index.js`
- **Next.js Apps**: `output: "standalone"` mode — self-contained Node.js server
- **AI Engine**: uvicorn in production mode

### Nx Build Commands

```bash
nx build core-gateway  # esbuild output → dist/apps/core-gateway/
nx build student-portal # Next.js standalone → dist/apps/student-portal/
nx affected:build       # only changed apps
```

---

## Security Architecture

| Concern            | Implementation                                          |
|--------------------|----------------------------------------------------------|
| Auth tokens        | httpOnly cookies (XSS-safe, CSRF needs SameSite)       |
| Cookie settings    | `httpOnly: true`, `secure: true` (prod), `SameSite: Lax` |
| Rate limiting      | `express-rate-limit` on `/auth/login` and `/register`  |
| Input validation   | Zod schemas on all gateway route handlers              |
| Role enforcement   | RBAC middleware after `requireAuth`                    |
| Secrets            | ENV vars only; startup guard exits if missing in prod  |
| CORS               | Allowlist of Next.js origins (`CORS_ORIGINS` env var)  |

---

*See `docs/REPO_STATE.md` for current implementation status. See `docs/docker-setup.md` for running locally.*
