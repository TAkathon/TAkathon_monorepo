# TAkathon Copilot Instructions

## 📊 Current Project Status (March 2026)

### ✅ Completed

- **Docker Infrastructure**: Full containerization with multi-stage builds
  - PostgreSQL 16 container with healthchecks and initialization scripts
  - Core Gateway (Express + Prisma 7 with adapter pattern)
  - All 4 Next.js frontends (landing-page, student-portal, organizer-dashboard, sponsor-panel)
  - AI Engine (FastAPI stub with profiles)
  - All services orchestrated via `docker-compose up -d`
- **Build Pipeline**: esbuild bundling for core-gateway, Next.js standalone mode for frontends
- **CI Pipeline**: GitHub Actions workflow with tsc type-checks (all apps) + Nx build matrix for all frontend/backend apps
- **Database**: Prisma schema defined with all tables (users, profiles, hackathons, teams, skills)
  - PostgreSQL 16 Alpine container with volume persistence
  - Complete seed data with 36 skills, 8 users, 2 hackathons, teams, and sponsorships
  - Management scripts (PowerShell & Bash) and npm commands for all operations
  - Comprehensive documentation in `database/README.md`
- **TypeScript Configuration**: Workspace-wide path aliases in `tsconfig.base.json`; `*.tsbuildinfo` excluded from git
- **Authentication Foundation**: JWT-based auth routes (`/api/v1/auth/*`) with access/refresh tokens
- **Route Protection**: Next.js `middleware.ts` in student-portal, organizer-dashboard, and sponsor-panel enforces role-based access using httpOnly cookie checks — unauthenticated users are redirected to `/login`
- **RBAC Middleware**: `requireStudent`, `requireOrganizer`, `requireSponsor` guards in `middleware/rbac.ts`
- **Student API**: Complete implementation (`/api/v1/students/*`) — profile, hackathons browse/register/withdraw, teams CRUD + invite/join/leave, AI matching stub
- **Organizer API**: Complete implementation (`/api/v1/organizers/*`) — profile, hackathon CRUD + publish/cancel/start/complete lifecycle, participant management, analytics + CSV export
- **Sponsor API**: Complete implementation (`/api/v1/sponsors/*`) — profile, hackathon browsing + sponsorship, team search/details/favorites
- **Shared API**: Public hackathon listings + skills taxonomy (`/api/v1/hackathons`, `/api/v1/skills`)
- **Security Foundations (Phase 1)** — branch `feature/security-foundations` (merged into `dev`):
  - JWT tokens issued as httpOnly cookies ONLY (never in response body)
  - `requireAuth` reads from `req.cookies.accessToken` (not Authorization header)
  - Rate limiting: `express-rate-limit` — 10 req/15 min on `/auth/login` and `/auth/register`
  - ENV guard at startup: exits in production if `DATABASE_URL`, `JWT_ACCESS_SECRET`, or `JWT_REFRESH_SECRET` are missing
  - Prisma migrate deploy (baseline migration committed, `db push --accept-data-loss` removed)
  - 32 security tests: `token.spec.ts` (13 tests) + `auth.spec.ts` (19 tests) in `apps/core-gateway/test/`
- **Phase 2 Core Data Flows** — branch `feature/phase2-core-data-flows` (merged into `dev`):
  - **Typed Shared API Client** — `libs/shared/api/src/` now exports domain modules:
    - `organizerApi` — `listMyHackathons`, `getMyHackathon`, `createHackathon`, `updateHackathon`, `publishHackathon`, `startHackathon`, `completeHackathon`, `cancelHackathon`, `getParticipants`
    - `studentApi` — `getMyProfile`, `updateMyProfile`, `addSkill`, `removeSkill`, `browseHackathons`, `getHackathon`, `getMyHackathons`, `registerForHackathon`, `withdrawFromHackathon`
    - `teamApi` — `getMyTeams`, `getTeam`, `createTeam`, `updateTeam`, `disbandTeam`, `leaveTeam`, `sendInvitation`
    - `invitationApi` — `getMyInvitations`, `acceptInvitation`, `rejectInvitation`
    - `hackathonApi` — `listPublicHackathons`, `getPublicHackathon`, `listSkills`
  - **Backend additions**: explicit `POST /:id/start`, `POST /:id/complete`, `PATCH /:id` on organizer hackathons router
  - **Frontend refactored**: all organizer-dashboard and student-portal pages use typed domain API functions (no bare `api.get/post`)
  - Lifecycle action buttons (Publish / Start / Complete / Cancel) in organizer hackathons page
- **Phase 3 AI Matching Engine (V1)** — branch `feature/phase3-ai-matching` (in progress, branched from `dev`):
  - **AI Engine (FastAPI)** — `apps/ai-engine/app/matching/`:
    - `scoring.py` — three pure deterministic scorers: `skill_complementarity` (40%), `experience_balance` (30%), `availability_overlap` (30% — neutral 0.5 until schema has availability field)
    - `engine.py` — `suggest(team_skills, candidates, open_spots, limit)` orchestrates scorers, applies weights, generates human-readable explanations, returns sorted suggestions
    - `validators.py` — Pydantic v2 request/response models (`MatchRequest`, `MatchResponse`, `MatchSuggestion`)
    - `main.py` — `POST /api/v1/matching/recommend` FastAPI endpoint
  - **27 pytest tests**: `tests/test_scoring.py` (individual scorer unit tests) + `tests/test_matching.py` (engine integration tests)
  - **Core Gateway**: `StudentMatchingService.getMatches()` fetches team + candidate data from Prisma, calls AI engine at `AI_ENGINE_URL`, falls back to local `basicScoring()` if engine unreachable
    - Route: `GET /api/v1/students/teams/:id/matches` + `POST /api/v1/students/teams/:id/matches/:userId` (invite)
  - **Shared API**: `matchingApi` module (`libs/shared/api/src/matching.ts`) — `suggestTeammates(teamId, limit)`, `inviteMatch(teamId, userId)` + exported types `MatchSuggestion`, `MatchResult`
  - **Student Portal**: "Find Teammates" button on forming teams with open spots → AI matching modal with ranked candidates, score badge, breakdown (skill/exp/avail %), explanation, Invite button
  - **Docker**: AI engine now starts by default (removed `profiles: [ai]`); `AI_ENGINE_URL=http://ai-engine:8001` injected into core-gateway
  - **Scoring notes**: proficiency map `beginner→1, intermediate→2, advanced→3, expert→4`; experience balance targets mean=2.5 (centre of scale)
- **Availability Feature** — committed `f3f4c3d` on `feature/phase3-ai-matching`:
  - `prisma/schema.prisma`: `availability Json? @map("availability") @db.JsonB` added to `StudentProfile` (db push applied)
  - **Availability data shape**: `{ timezone: "UTC+1", hoursPerWeek: 20, preferredSlots: ["weekday_evening", "weekend_morning"] }`
  - **Valid slot keys** (6): `weekday_morning`, `weekday_afternoon`, `weekday_evening`, `weekend_morning`, `weekend_afternoon`, `weekend_evening`
  - `scoring.py`: real `availability_overlap` — Jaccard slot similarity (70%) + hours compatibility (30%); returns neutral 0.5 when either side has no data
  - `validators.py`: `AvailabilityEntry` Pydantic model; `availability` on `CandidateProfile`; `teamAvailability: list[AvailabilityEntry]` on `MatchRequest`
  - `engine.py` / `main.py`: `team_availability` threaded through to scorer
  - `matching.service.ts`: collects `teamAvailability` from DB team members' `studentProfile.availability`
  - `profile.service.ts` / `profile.ts` route: get + update availability with Zod validation
  - `libs/shared/api`: `AvailabilitySlot` type + `AvailabilityData` interface exported from barrel
  - `settings/page.tsx`: Availability section — timezone dropdown (UTC offsets), hours/week input, 6 slot toggle buttons, Save → `studentApi.updateMyProfile({ availability: ... })`
- **Frontend-Backend Integration** (V1 complete):
  - student-portal: dashboard, profile, teams, hackathons, settings pages — live API data via shared Axios + Zustand
  - organizer-dashboard: hackathons list + create, participants, teams, settings pages
  - sponsor-panel: dashboard, budget, opportunities, requests, profile pages
  - landing-page: home, login, signup flows wired to `/api/v1/auth/*`
- **UX Improvements**: DashboardLayout renders shell immediately without full-screen hydration spinner; 401 refresh failure auto-redirects to login
- **Shared Libraries**:
  - `@takathon/shared/api` — Axios client with JWT auto-refresh interceptors + global 401 → login redirect
  - `@takathon/shared/utils` — Zustand auth store (`useAuthStore`) with `UserRole` enum-based auth redirect
  - `@takathon/shared/types` — Full `UserRole` enum (STUDENT, ORGANIZER, SPONSOR), domain models
- **Codebase Audit & Bug Fixes**:
  - CORS dev fallback: localhost ports 3000-3003 allowed by default in dev when `CORS_ORIGINS` unset
  - `UserRole.SPONSOR` added to shared types enum; `UserRole` enum used consistently in `authRedirect`
  - Empty NestJS scaffold files (`main.ts`, `app.module.ts`, `app.controller.ts`) annotated with disambiguation comments — Express entry at `src/index.ts`
  - Organizer router sub-paths documented and confirmed non-conflicting
  - Full audit report in `docs/code-audit.md`

### 🚧 In Progress / Remaining for V1

- **Frontend polish**: Error states, loading skeletons, form validation feedback
- **End-to-end testing**: Auth flows, team creation, hackathon registration

### ⛔ Out of Scope for V1

- AI coaching / chatbot features (Phase 4+)

### ✅ Recent Operational Notes

- **Nx graph timeouts**: Use `NX_PLUGIN_NO_TIMEOUTS=true` and `NX_DAEMON=false` for stable graph generation on Windows.
- **Nx JS plugin config**: `nx.json` disables lockfile and source file analysis for stability.
- **Core Gateway dev**: Requires Prisma client generated (`npx prisma generate`) and JWT secrets available.
- **CORS in dev**: `CORS_ORIGINS` is optional in development — gateway defaults to `localhost:3000-3003`. Set explicitly in production.
- **Docker rebuilds**: Frontend changes require `docker compose up --build` (cached `up` can show old assets).
- **Docker Hub access**: If builds fail on `node:22-alpine`, check Docker Desktop proxy/DNS or network.
- **Database setup**: PostgreSQL runs in Docker on port 5432, use `npm run db:start` to initialize, `npm run db:seed` populates test data.
- **Prisma adapter pattern**: Prisma 7 requires `@prisma/adapter-pg` with `Pool` for connection management.
- **Test credentials**: alice.student@university.edu / password123 (all test users have same password).
- **Express entry point**: `apps/core-gateway/src/index.ts` — ignore empty NestJS scaffold files in `src/app/` and `src/main.ts`.
- **AI Engine**: Now starts by default with `docker compose up` (no `--profile ai` needed). Port 8001. Gateway env var `AI_ENGINE_URL=http://ai-engine:8001` (Docker) or `http://localhost:8001` (local dev). Falls back to local `basicScoring()` if engine is unreachable.
- **AI matching tests**: Run with `cd apps/ai-engine && python -m pytest tests/ -v` (requires `pip install fastapi pydantic uvicorn` in the ai-engine venv).

### 📋 V1 Completion — Next Steps (Priority Order)

1. **Frontend Polish & Error Handling**
   - Add proper loading skeletons to all dashboard pages
   - Show user-friendly error messages on API failures (toast notifications)
   - Add form validation feedback (inline errors on login/signup/profile forms)
   - Ensure responsive layout passes on mobile (375px breakpoint)

2. **Organizer Dashboard — Missing Pages**
   - Create hack create/edit form page (`/dashboard/hackathons/new`, `/dashboard/hackathons/[id]/edit`)
   - Wire CSV export button to `GET /api/v1/organizers/hackathons/:id/export`

3. **Student Portal — Missing Pages**
   - Hackathons list page with register/withdraw actions (`/dashboard/hackathons`)
   - Team detail page with member list and invite flow (`/dashboard/teams/[id]`)

4. **Sponsor Panel — Missing Pages**
   - Team detail modal/page with project info (`/dashboard/teams/[id]`)
   - Confirmation flow for sponsorship submission

5. **Auth & Session Hardening**
   - Redirect unauthenticated users from protected routes to `/login`
   - Implement token refresh on app load (check session validity on mount)
   - Handle 401 globally → clear store → redirect to login

6. **Response Standardization (Core Gateway)**
   - Audit all route handlers: replace ad-hoc `res.json(...)` calls with `ResponseHandler.success/error`
   - Enforce consistent `{ success, data | error }` shape across all endpoints

7. **E2E Testing**
   - Auth flow: register → login → dashboard redirect
   - Team creation flow: create team → invite member → accept invite
   - Hackathon registration flow: browse → register → appear in dashboard

8. **Deployment Prep**
   - Write `apps/core-gateway/.env.production.example` and `apps/*/next.config.prod.mjs`
   - Set up GitHub Actions CI: lint → type-check → test → build
   - Document Render/DigitalOcean deployment steps in `docs/deployment.md`

---

## ⚠️ Git Workflow (Gitflow) - CRITICAL

This is a **modular monolith Nx monorepo** for hackathon team formation with:

- **Frontend Apps**: Three Next.js apps (student-portal, organizer-dashboard, sponsor-panel)
- **Core Gateway**: Express/Node.js backend (Auth, Database, API routing)
- **AI Engine**: FastAPI/Python service (Matching algorithms, AI coaching)
- **Shared Libraries**: TypeScript types, UI components, utilities, shared API client
- **Database**: PostgreSQL with centralized schema and migrations

Data flow: `Next.js Apps → Core Gateway (Express) → [AI Engine (FastAPI) | PostgreSQL]`

## Frontend Development Guidelines

### Design System

- **Theme**: Dark mode by default (`#1A0A00`).
- **Primary Color**: `#D94C1A` (Orange/Rust).
- **UI Pattern**: Glassmorphism (defined in `globals.css`).
- **Component Library**: Lucide React for icons, Tailwind CSS for styling.

### App Structure (Next.js 15)

- Use **App Router** (`src/app`).
- Shared layout components in `src/components/` (e.g., `DashboardLayout`).
- Pages follow a consistent layout: Sidebar, Top bar (search/notifications), Main content area.

### Design Consistency

- **Glassmorphism**: Use the `.glass` class for cards and panels.
- **Buttons**: Use `.btn-primary` and `.btn-secondary` for consistency.
- **Inputs**: Use `.input-field` for form elements.
- **Responsive**: All dashboards must be mobile-friendly (use `md:` or `lg:` for grid/flex layouts).

### Core Concept

### Workflow Rules

1. **NEVER commit directly to `main`** - Only merge from `release/*` or `hotfix/*`
2. **All development happens on `dev`** - Switch to `dev` branch for coding
3. **Create feature branches**: `git checkout -b feature/feature-name dev`
4. **Merge features to `dev`**: Create PR from `feature/*` → `dev`
5. **Releases**: Create `release/*` from `dev`, test, then merge to `main` and `dev`

## 🏗️ Backend Architecture Strategy

### Role-Based API Organization

While we maintain a **single Core Gateway** service, the API is organized by user role with clear separation of concerns:

**Structure**:

```
apps/core-gateway/src/
  /routes
    /students       # Student-specific endpoints
    /organizers     # Organizer-specific endpoints
    /sponsors       # Sponsor-specific endpoints
    /shared         # Common endpoints (hackathons, skills)
    auth.ts         # Authentication
  /services
    /students       # Student business logic
    /organizers     # Organizer business logic
    /sponsors       # Sponsor business logic
    /shared         # Shared services (teams, hackathons)
  /middleware
    auth.ts         # JWT validation
    rbac.ts         # Role-based access control
```

**API Endpoints by Role**:

- **Students** (`/api/v1/students/*`):
  - `GET /profile` - Get student profile
  - `PUT /profile` - Update profile
  - `GET /hackathons` - Browse hackathons
  - `POST /hackathons/:id/register` - Register for hackathon
  - `GET /teams` - My teams
  - `POST /teams` - Create team
  - `POST /teams/:id/invite` - Invite teammates
  - `GET /teams/:id/matches` - AI teammate recommendations
- **Organizers** (`/api/v1/organizers/*`):
  - `GET /profile` - Get organizer profile
  - `POST /hackathons` - Create hackathon
  - `GET /hackathons/:id/participants` - View participants
  - `GET /hackathons/:id/teams` - View teams
  - `GET /hackathons/:id/analytics` - Event analytics
  - `GET /hackathons/:id/export` - Export data
- **Sponsors** (`/api/v1/sponsors/*`):
  - `GET /profile` - Get sponsor profile
  - `GET /hackathons` - Browse hackathons
  - `POST /hackathons/:id/sponsor` - Sponsor event
  - `GET /hackathons/:id/teams` - View teams
  - `GET /teams/:id/details` - Team project details
  - `POST /teams/:id/favorite` - Bookmark team

- **Shared** (`/api/v1/*`):
  - `/auth/*` - Authentication (all roles)
  - `/skills` - Skill taxonomy (all roles)
  - `/hackathons` - Public hackathon listings

**Why Single Gateway?**:

- Simplified deployment and authentication
- Shared Prisma client connection pool
- Easier cross-role operations (e.g., team formation)
- Reduced infrastructure complexity
- Role separation achieved via route organization and RBAC middleware

Nx monorepo with workspace management, build caching, and dependency graph:

```
/apps
  /student-portal          # Next.js app for students
    /src/app              # App Router
    /src/components
    /src/lib
  /organizer-dashboard     # Next.js app for organizers
  /sponsor-panel           # Next.js app for sponsors
  /core-gateway            # Express backend
    /src/routes           # Route handlers (auth, users, etc.)
    /src/middleware       # Auth and logging middleware
    /src/services         # Business logic (token, user services)
  /ai-engine               # FastAPI Python service
    /app
      /matching           # Team matching algorithms
        engine.py
        scoring.py
        validators.py
      /coaching           # AI coaching (future)
      /api                # FastAPI routes
      /models             # Data models
      /services           # Business logic
    /tests
/libs
  /shared
    /types                # TypeScript type definitions
    /ui                   # Shared React components
    /utils                # Common utilities
  /python
    /ai-logic             # Shared AI utilities
      /src
        embeddings.py
        prompts.py
        utils.py
/database
  schema.sql              # PostgreSQL schema
  /migrations             # Database migrations
/prisma                   # Prisma ORM
  schema.prisma           # Prisma schema
  seed.ts                 # Database seeding
/docs
  architecture.md
  api-specification.md
/nx.json
/workspace.json
/docker-compose.yml
```

## Core Domain Models

### Database Tables

Located in `database/schema.sql` and `prisma/schema.prisma`:

- `users` - Student/organizer/sponsor accounts
- `student_profiles`, `organizer_profiles`, `sponsor_profiles` - Role details
- `skills` - Skill taxonomy
- `user_skills` - Many-to-many with proficiency levels
- `hackathons` - Event metadata
- `hackathon_participants` - Registration data
- `teams` - Student-created teams (with creator/captain)
- `team_members` - Team membership
- `team_invitations` - Pending invites and join requests
- `applications` - Team applications
- `sponsorships` - Sponsor contributions

### User Roles

- **Student**: Profile creation, skill setting, hackathon joining, team creation, inviting friends, requesting AI teammate matches
- **Organizer**: Hackathon creation, participant viewing, team overview, data export
- **Sponsor**: Hackathon browsing, team project viewing, talent discovery

## Critical Patterns

### Matching Engine (V1 Algorithm)

Located at `apps/ai-engine/app/matching/` (FastAPI service). Used for **AI teammate recommendations** when students need to fill open team spots.

**Architecture**:

- Client → Core Gateway (Express) → AI Engine (FastAPI)
- Core Gateway handles auth, validation, and data fetching
- AI Engine focuses solely on scoring and recommendation logic

Scoring criteria for candidate matches:

1. Skill complementarity (40%) - Fill gaps in team's skill set
2. Experience level balance (30%) - Mix of proficiencies
3. Availability overlap (30%) - Time zone and commitment match

**Key principle**: Deterministic and replaceable - designed for future ML swap. Clean service boundaries with JSON input/output schemas.

**Usage flow**: Student creates team → invites friends → requests AI suggestions for remaining spots → reviews matches → sends invites

### Service Communication

- **Frontend → Core Gateway**: REST API with JWT auth
- **Core Gateway → AI Engine**: Internal HTTP calls (FastAPI endpoints)
- **Core Gateway → Database**: Direct PostgreSQL access via Prisma ORM
- All business logic and validation in Core Gateway
- AI Engine stateless (no database access, pure computation)

### Authentication

JWT-based system via Core Gateway (Express).

- **Access Tokens**: Short-lived, passed via `Authorization: Bearer <token>` header.
- **Refresh Tokens**: Long-lived, stored in `httpOnly` cookies for security.
- **Auto-Refresh**: Shared Axios client (`libs/shared/api`) handles 401 errors by attempting a token refresh.

All API routes require role-based access control:

- Public routes: `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`
- Protected routes: `/api/v1/me`, `/api/v1/students/*`, etc.

### API Design

RESTful conventions (Core Gateway serves all):

- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/students/*` - Student profile operations
- `/api/v1/organizers/*` - Organizer operations
- `/api/v1/hackathons/*` - Event management
- `/api/v1/teams/*` - Team creation, invitations, management
- `/api/v1/matching/*` - AI teammate recommendations (proxied to ai-engine)
- `/api/v1/skills/*` - Skill taxonomy

## Development Workflows

### Docker (Preferred)

Use Docker Compose for a consistent dev environment:

```bash
docker compose up --build
```

This starts: Postgres, Core Gateway, AI Engine, and all Frontends.

### Local (Nx)

Use Nx for all build, test, and dev operations:

```bash
# Serve apps in dev mode
nx serve student-portal
nx serve core-gateway
nx serve ai-engine

# Build apps
nx build student-portal
nx build organizer-dashboard
nx build core-gateway

# Run tests
nx test ai-engine
nx test shared-types

# Lint code
nx lint student-portal

# View dependency graph
nx graph

# Run affected (CI optimization)
nx affected:build
nx affected:test
```

### Git & Merge Workflow

- **Branching**: Always create a feature branch (`feat/`), bugfix branch (`fix/`), or chore branch (`chore/`) from `dev`.
- **Pull Requests**: Every merge into the `dev` or `main` branch **must** be performed via a Pull Request (PR). Direct merges or pushes to these branches are prohibited.
- **Commit Messages**: Follow conventional commits (see `COMMIT_CONVENTIONS.md`).

## 🗄️ Database Management

### Quick Start

```bash
# Start PostgreSQL container
npm run db:start

# Generate Prisma Client (required after schema changes)
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Seed database with test data
npm run db:seed

# Open Prisma Studio GUI
npm run db:studio
```

### Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: takathon
- **User**: postgres
- **Password**: postgrespassword
- **Connection String**: `postgresql://postgres:postgrespassword@localhost:5432/takathon?schema=public`

### Available Commands

**NPM Scripts** (use these for most operations):

```bash
npm run db:start       # Start PostgreSQL container
npm run db:stop        # Stop PostgreSQL container
npm run db:reset       # Stop, remove, and restart fresh database
npm run db:seed        # Populate database with test data
npm run db:studio      # Open Prisma Studio GUI
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema to database (dev only)
npm run db:migrate     # Run migrations (production)
npm run db:status      # Check container status
npm run db:shell       # Open psql shell
```

**Management Scripts** (PowerShell/Bash CLIs):

```powershell
# PowerShell (Windows)
.\tools\scripts\db.ps1 start
.\tools\scripts\db.ps1 seed
.\tools\scripts\db.ps1 backup
.\tools\scripts\db.ps1 restore backup-2024-02-15.sql

# Bash (Linux/Mac)
./tools/scripts/db.sh start
./tools/scripts/db.sh seed
./tools/scripts/db.sh backup
./tools/scripts/db.sh restore backup-2024-02-15.sql
```

### Schema Management

**Source of Truth**: `prisma/schema.prisma` (354 lines, 18 models, 9 enums)

**Schema Workflow**:

1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma Client
3. Development: `npm run db:push` to sync schema
4. Production: `npx prisma migrate dev --name <migration-name>` to create migration

**Key Models**:

- `User` - Base user account (STUDENT, ORGANIZER, SPONSOR)
- `StudentProfile`, `OrganizerProfile`, `SponsorProfile` - Role-specific data
- `Skill` - Skill taxonomy (36 predefined skills)
- `UserSkill` - Many-to-many with proficiency levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `Hackathon` - Event metadata with registration periods
- `HackathonParticipant` - Student registrations
- `Team` - Student-created teams (with creator/captain)
- `TeamMember` - Team membership
- `TeamInvitation` - Pending invites (PENDING, ACCEPTED, DECLINED)
- `Sponsorship` - Sponsor contributions

### Seed Data

Located in `prisma/seed.ts` (300+ lines), creates:

- **36 Skills**: JavaScript, Python, React, Node.js, TypeScript, Docker, etc.
- **8 Users**: 4 students (Alice, Bob, Carol, David), 2 organizers (Emma, Frank), 2 sponsors (Grace, Henry)
- **16 User-Skill Assignments**: Students have 4 skills each with varying proficiencies
- **2 Hackathons**: "Spring Innovation Challenge" and "AI & ML Hackathon 2024"
- **6 Hackathon Participants**: All students registered for events
- **1 Team**: "Code Warriors" with Alice (captain) and Bob
- **2 Sponsorships**: Microsoft and Google sponsoring events

**Test Credentials** (all users have same password):

```
Email: alice.student@university.edu
Password: password123

Email: bob.student@university.edu
Password: password123

(etc. for all 8 users)
```

### Database Architecture

**Adapter Pattern** (Prisma 7+ requirement):

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

**Why Adapter?**: Prisma 7 uses driver adapters for connection pooling and edge environment support.

### Troubleshooting

**Container won't start**:
- Check Docker Desktop is running
- Verify port 5432 isn't in use: `netstat -an | findstr 5432`
- Check logs: `docker logs takathon-db`

**Seed fails with "PrismaClientInitializationError"**:
- Ensure `@prisma/adapter-pg` and `pg` are installed
- Verify `DATABASE_URL` in `.env`
- Run `npm run db:generate` first

**Schema out of sync**:
- Development: `npm run db:push` (overwrites database)
- Production: `npx prisma migrate deploy` (applies migrations)

**Connection refused**:
- Check container is running: `npm run db:status`
- Wait for healthcheck: container may still be initializing

### Backup & Restore

```powershell
# Create backup
.\tools\scripts\db.ps1 backup

# Restore from backup
.\tools\scripts\db.ps1 restore backup-2024-02-15.sql

# List backups
ls database/backups/
```

Backups stored in `database/backups/` as timestamped SQL dumps.

### Production Considerations

- Use migrations (`prisma migrate deploy`) instead of `prisma db push`
- Set up connection pooling (e.g., PgBouncer)
- Enable SSL for database connections
- Use environment-specific `.env` files
- Implement backup automation
- Monitor query performance with Prisma logging

For detailed documentation, see [database/README.md](../database/README.md).

### Backend (Core Gateway - Express)

- **Framework**: Express with TypeScript
- **Auth**: JWT with `jsonwebtoken`, password hashing with `bcryptjs`
- **Validation**: `zod` for request payload validation
- **Architecture**: Route-Middleware-Service pattern
- **Database**: PostgreSQL accessed via **Prisma ORM**
- **ORM**: Prisma for schema management, migrations, and type-safe queries

### AI Engine (FastAPI)

- **Framework**: FastAPI with Python 3.11+
- **Models**: Pydantic for request/response
- **Purpose**: Stateless computation service
- **No database access**: Receives data from core-gateway
- **Testing**: pytest for matching logic

### Frontend (Next.js 15+ App Router)

- **Routing**: App Router (`app/` directory) - use layouts, server components
- **Styling**: TailwindCSS (utility-first approach)
- **Shared components**: Import from `@takathon/shared/ui`
- **Shared types**: Import from `@takathon/shared/types`
- **API calls**: Shared Axios client in `@takathon/shared/api` with withCredentials and auto-refresh interceptors
- **State**: Zustand for auth state (`useAuthStore`) - handles token persistence and user info

### Shared Libraries

- **libs/shared/types**: TypeScript type definitions (user, team, hackathon models)
- **libs/shared/ui**: Reusable React/Tailwind components (buttons, inputs, modals)
- **libs/shared/utils**: Common utilities (validators, formatters, constants)
- **libs/python/ai-logic**: Shared Python utilities (embeddings, prompts)

Import shared code:

```typescript
// In Next.js apps
import { Button } from "@takathon/shared/ui";
import { User, Team } from "@takathon/shared/types";
import { validateEmail } from "@takathon/shared/utils";
```

### Docker

Use Docker Compose for local development with:

- Core Gateway service (NestJS)
- AI Engine service (FastAPI)
- Frontend services (Next.js dev servers)
- PostgreSQL container
- Volume mounts for hot-reload

## Key Conventions

1. **Nx Monorepo**: Use Nx commands exclusively for build/test/serve operations
2. **Shared Libraries**: Maximize code reuse through `libs/shared/*` - avoid duplication across apps
3. **Service boundaries**: AI Engine has clean input/output schemas (JSON) - no database access
4. **Database migrations**: Core Gateway owns database schema - use ORM migrations (Prisma)
5. **JWT handling**: Store in httpOnly cookies (frontend) and validate on every protected route (backend)
6. **Error responses**: Standardize API error format (status code, message, details)
7. **State management**: Use Zustand minimally - fetch from API, don't over-cache
8. **Type safety**: Use shared types from `@takathon/shared/types` for API contracts
9. **Component reuse**: Build UI components in `libs/shared/ui` for use across all frontends
10. **Nx constraints**: Respect module boundaries - apps can import from libs but not other apps

## Testing Strategy

Strategic coverage (not 90% blanket coverage):

- **Core Gateway**: NestJS testing framework for API endpoints and business logic
- **AI Engine**: pytest for matching algorithm logic and scoring functions
- **Frontend**: Jest/React Testing Library for critical user flows
- **Shared Libraries**: Unit tests for utilities and validators in `libs/shared/utils`
- **Integration**: End-to-end team creation and AI matching with sample participant data
- **Priority**: Auth flows, team creation/invitations, AI matching recommendations, role-based access control

Use Nx to run tests:

```bash
# Test specific app
nx test ai-engine

# Test all affected by changes
nx affected:test

# Test shared library
nx test shared-utils
```

## Deployment

Target platforms: Render or DigitalOcean

- Docker-based deployment
- GitHub Actions for CI (linting, tests)
- Environment variables for secrets (DB URL, JWT secret)

## Future Considerations

The matching engine is V1 (rule-based) and lives in `apps/ai-engine/app/matching/`. Design interfaces to allow:

- Swapping in ML-based scoring (replace scoring.py) for better teammate recommendations
- A/B testing different matching algorithms
- Performance metrics collection (match acceptance rate, team success)
- Extraction to separate package only when reused across multiple platforms

**Important**: Matching is opt-in and student-driven, not mandatory bulk team generation by organizers
