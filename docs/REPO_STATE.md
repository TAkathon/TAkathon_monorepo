# TAkathon Monorepo — Repository State

**Last Updated**: March 4, 2026
**Version**: 1.0.0
**Branch**: `dev` (active development)
**Overall Status**: Phase 4 Complete — V1 Polish done (~95%)

---

## 📁 Repository Structure

```
TAkathon_monorepo/
├── apps/
│   ├── core-gateway/          ✅ Express + Prisma 7, esbuild-bundled, Dockerized
│   │   ├── src/index.ts          ✅ Entry point — all route mounts live here
│   │   ├── src/routes/
│   │   │   ├── auth.ts           ✅ JWT auth (httpOnly cookies only)
│   │   │   ├── students/         ✅ profile, hackathons, teams, matching, skills
│   │   │   ├── organizers/       ✅ profile, hackathons CRUD + lifecycle, participants, analytics
│   │   │   ├── sponsors/         ✅ profile, hackathons, teams, favorites
│   │   │   └── shared/           ✅ public hackathons, skills taxonomy
│   │   ├── src/services/         ✅ all role-specific + matching services
│   │   ├── src/middleware/
│   │   │   ├── auth.ts           ✅ requireAuth reads req.cookies.accessToken
│   │   │   └── rbac.ts           ✅ requireStudent / requireOrganizer / requireSponsor
│   │   └── src/lib/prisma.ts     ✅ Prisma 7 adapter pattern (PrismaPg + Pool)
│   │
│   ├── ai-engine/             ✅ FastAPI V1 — always on, no profile flag needed
│   │   ├── app/matching/
│   │   │   ├── scoring.py        ✅ skill_complementarity, experience_balance, availability_overlap
│   │   │   ├── engine.py         ✅ orchestrates scorers, generates explanations
│   │   │   └── validators.py     ✅ Pydantic v2 MatchRequest / MatchResponse
│   │   └── tests/                ✅ 27 pytest tests
│   │
│   ├── student-portal/        ✅ Next.js 15 — full API integration
│   │   └── src/app/dashboard/
│   │       ├── page.tsx          ✅ live stats from API
│   │       ├── profile/          ✅ skills inline add/remove (dropdown, no page reload)
│   │       ├── hackathons/       ✅ browse with isRegistered + isInTeam flags
│   │       ├── teams/            ✅ create, leave, disband, AI matching modal
│   │       │   └── [id]/
│   │       │       ├── messages/ ✅ placeholder chat ("Coming Soon" — WebSockets V2)
│   │       │       └── project/  ✅ milestone tracker, tech stack, submission links (demo data)
│   │       ├── notifications/    ✅ list, mark-read, delete; paginated
│   │       └── settings/         ✅ availability: timezone, hours/week, slot toggles
│   │
│   ├── organizer-dashboard/   ✅ Next.js 15 — hackathons list, detail, participants, teams, notifications, settings
│   │   └── src/app/
│   │       ├── page.tsx          ✅ live stats + skeleton loading
│   │       ├── hackathons/
│   │       │   ├── page.tsx      ✅ hackathon list with lifecycle buttons
│   │       │   ├── [id]/page.tsx ✅ hackathon detail — participants, teams, stats
│   │       │   └── create/page.tsx ✅ create hackathon form
│   │       ├── notifications/    ✅ list, mark-read, delete; paginated
│   │       └── settings/         ✅ organizer profile settings
│   ├── sponsor-panel/         ✅ Next.js 15 — dashboard, opportunities, requests, profile, notifications
│   │   └── src/app/dashboard/
│   │       ├── page.tsx          ✅ live stats + skeleton loading
│   │       ├── opportunities/    ✅ browse + sponsor hackathons
│   │       ├── notifications/    ✅ list, mark-read, delete; paginated
│   │       └── sponsored/
│   │           ├── page.tsx      ✅ list of sponsored hackathons
│   │           └── [id]/page.tsx ✅ sponsored hackathon detail
│   └── landing-page/          ✅ Next.js 15 — home, login, signup wired to /api/v1/auth/*
│
├── libs/shared/
│   ├── api/src/               ✅ Typed domain API modules
│   │   ├── client.ts          ✅ Axios + withCredentials + auto-refresh interceptors
│   │   ├── student.ts         ✅ studentApi, teamApi, invitationApi
│   │   ├── organizer.ts       ✅ organizerApi
│   │   ├── hackathon.ts       ✅ hackathonApi (public)
│   │   ├── matching.ts        ✅ matchingApi — suggestTeammates, inviteMatch
│   │   ├── notifications.ts   ✅ notificationsApi — getNotifications, markAsRead, deleteNotification
│   │   └── index.ts           ✅ barrel export
│   ├── types/src/             ✅ UserRole enum (STUDENT, ORGANIZER, SPONSOR), domain models
│   ├── utils/src/             ✅ Zustand authStore, authRedirect, AvailabilitySlot types
│   └── ui/src/                ✅ Skeleton (12 primitives), Breadcrumbs, AvatarMenu, Button, Input, Card
│
├── prisma/
│   ├── schema.prisma          ✅ 21 models, 9 enums — Notification, StudentSettings, OrganizerSettings added
│   └── seed.ts                ✅ 36 skills, 8 users, 2 hackathons, 1 team, 2 sponsorships
│
└── docker-compose.yml         ✅ 7 services, all with healthchecks
```

**Legend**: ✅ Complete | 🟡 Partial | ⬜ Not Started

---

## 🔧 Technology Stack

| Layer          | Technology                    | Version   | Status                             |
| -------------- | ----------------------------- | --------- | ---------------------------------- |
| **Frontend**   | Next.js                       | 15.5.12   | ✅ Running — App Router            |
| **Backend**    | Express                       | 4.x       | ✅ Running — NOT NestJS            |
| **ORM**        | Prisma                        | 7.4.0     | ✅ Adapter pattern required        |
| **DB Adapter** | @prisma/adapter-pg            | 7.4.0     | ✅ PrismaPg + pg.Pool              |
| **Database**   | PostgreSQL                    | 16-alpine | ✅ Volume-persisted                |
| **AI Service** | FastAPI + Python              | 3.11+     | ✅ V1 deterministic matching       |
| **Build Tool** | esbuild                       | 0.27.3    | ✅ Bundles core-gateway            |
| **Monorepo**   | Nx                            | 20.4.4    | ✅ Build cache + graph             |
| **State**      | Zustand                       | 4.5+      | ✅ Auth store only (minimal)       |
| **HTTP**       | Axios                         | 1.6+      | ✅ Shared client + interceptors    |
| **Styling**    | Tailwind CSS                  | 3.x       | ✅ Glassmorphism design system     |
| **Validation** | Zod (gateway) + Pydantic (AI) | —         | ✅ Schema validation all routes    |
| **Auth**       | JWT (httpOnly cookies only)   | —         | ✅ No bearer token / response body |

---

## 🌐 Service Ports

| Service             | Port | Docker Container     | Dev URL               |
| ------------------- | ---- | -------------------- | --------------------- |
| Landing Page        | 3000 | `takathon-landing`   | http://localhost:3000 |
| Student Portal      | 3001 | `takathon-student`   | http://localhost:3001 |
| Organizer Dashboard | 3002 | `takathon-organizer` | http://localhost:3002 |
| Sponsor Panel       | 3003 | `takathon-sponsor`   | http://localhost:3003 |
| Core Gateway (API)  | 8000 | `takathon-gateway`   | http://localhost:8000 |
| AI Engine           | 8001 | `takathon-ai`        | http://localhost:8001 |
| PostgreSQL          | 5432 | `takathon-db`        | localhost:5432        |

> **AI Engine**: Starts by default with `docker compose up`. No `--profile ai` flag required.

---

## 🔐 Authentication System

**Status**: ✅ Security Phase Complete

### Token Strategy (IMPORTANT — common source of confusion)

| Token         | Storage         | Lifetime | Cookie Name    |
| ------------- | --------------- | -------- | -------------- |
| Access Token  | httpOnly cookie | 15 min   | `accessToken`  |
| Refresh Token | httpOnly cookie | 7 days   | `refreshToken` |

**Tokens are NEVER**:

- Returned in response body
- Stored in `localStorage` or `sessionStorage`
- Sent via `Authorization: Bearer` header

**How it works**:

1. Login → gateway sets both cookies via `res.cookie()`
2. All subsequent requests include cookies automatically (`withCredentials: true`)
3. `requireAuth` middleware reads `req.cookies.accessToken`
4. On 401 → Axios interceptor calls `POST /auth/refresh` → new `accessToken` cookie set
5. If refresh fails → interceptor redirects browser to `/login`

### Rate Limiting

- `/auth/login`: 10 requests / 15 minutes
- `/auth/register`: 10 requests / 15 minutes
- `express-rate-limit` middleware

### Route Guards

- **Backend**: `requireAuth` → then `requireStudent` / `requireOrganizer` / `requireSponsor`
- **Frontend**: `middleware.ts` in each Next.js app (reads httpOnly cookie, redirects to `/login` if absent)
- **`DashboardLayout`**: does NOT redirect — only hydrates Zustand from `/auth/me` on mount

---

## 🚀 API Endpoints Status

### Students (`/api/v1/students/*`)

| Method | Path                          | Status | Notes                                                |
| ------ | ----------------------------- | ------ | ---------------------------------------------------- |
| GET    | /profile                      | ✅     | includes skills array                                |
| PUT    | /profile                      | ✅     | accepts `availability` JsonB                         |
| GET    | /hackathons                   | ✅     | returns `isRegistered`, `isInTeam` per hackathon     |
| POST   | /hackathons/:id/register      | ✅     |                                                      |
| DELETE | /hackathons/:id/withdraw      | ✅     | blocked if `isInTeam`                                |
| GET    | /teams                        | ✅     | **nested shape — must flatten** (see Known Pitfalls) |
| GET    | /teams/:id                    | ✅     |                                                      |
| POST   | /teams                        | ✅     |                                                      |
| POST   | /teams/:id/invite             | ✅     |                                                      |
| DELETE | /teams/:id/leave              | ✅     | non-captain members                                  |
| DELETE | /teams/:id                    | ✅     | captain only, forming status                         |
| GET    | /matching/:id/matches         | ✅     | ← AI suggestions (mounted at /students/matching)     |
| POST   | /matching/:id/matches/:userId | ✅     | ← invite matched user                                |
| POST   | /skills                       | ✅     | add skill (NOT /profile/skills)                      |
| DELETE | /skills/:id                   | ✅     | remove by userSkill ID                               |
| GET    | /settings                     | ✅     | student settings (notifications, privacy)            |
| PUT    | /settings                     | ✅     |                                                      |

### Organizers (`/api/v1/organizers/*`) — ✅ All implemented

Hackathon CRUD + lifecycle + settings. `GET/PUT /settings` added in Phase 4.

### Notifications (`/api/v1/notifications`) — ✅ All implemented

`GET` list (paginated), `PUT /:id/read` mark as read, `DELETE /:id` delete. Shared across all roles.

### Sponsors (`/api/v1/sponsors/*`) — ✅ All implemented

Browse hackathons, sponsor events, view teams, project details, bookmark teams.

### Shared / Public — ✅ All implemented

`GET /api/v1/hackathons`, `GET /api/v1/hackathons/:id`, `GET /api/v1/skills`, `GET /api/v1/health`

---

## 🤖 AI Matching Engine (V1)

**Status**: ✅ Complete — deterministic, tested, fallback-safe

**Route mount in `index.ts`**: `/api/v1/students/matching` (separate from `/api/v1/students/teams`)

| Scorer                  | Weight | Algorithm                                          |
| ----------------------- | ------ | -------------------------------------------------- |
| `skill_complementarity` | 40%    | unique new skills / team open skill slots          |
| `experience_balance`    | 30%    | targets mean proficiency of 2.5 (scale 1–4)        |
| `availability_overlap`  | 30%    | Jaccard slot similarity (70%) + hours compat (30%) |

**Proficiency map**: `beginner→1`, `intermediate→2`, `advanced→3`, `expert→4`

**Fallback**: If AI engine unreachable, `core-gateway` uses local `basicScoring()` (skill complementarity only). Returns `fallback: true` flag to frontend.

---

## 🐳 Docker Services

| Container            | Image Built From                      | Depends On        |
| -------------------- | ------------------------------------- | ----------------- |
| `takathon-db`        | `postgres:16-alpine`                  | —                 |
| `takathon-gateway`   | `apps/core-gateway/Dockerfile`        | db (healthy)      |
| `takathon-ai`        | `apps/ai-engine/Dockerfile`           | db (healthy)      |
| `takathon-landing`   | `apps/landing-page/Dockerfile`        | gateway (healthy) |
| `takathon-student`   | `apps/student-portal/Dockerfile`      | gateway (healthy) |
| `takathon-organizer` | `apps/organizer-dashboard/Dockerfile` | gateway (healthy) |
| `takathon-sponsor`   | `apps/sponsor-panel/Dockerfile`       | gateway (healthy) |

### Critical Docker Commands

```powershell
# Start all services
docker compose up -d

# Rebuild after source changes (ALWAYS use --no-cache)
docker compose build --no-cache <service>
docker compose up -d <service>

# View logs
docker compose logs -f core-gateway

# Stop all
docker compose down
```

> ⚠️ **Cache Trap**: `docker compose build` reuses layers from before your source change. Always use `--no-cache` when debugging container behavior after a commit.

---

## 🧪 Seed / Test Data

All seed users share password: `password123`

| Role      | Email                        | Data                        |
| --------- | ---------------------------- | --------------------------- |
| Student   | alice.student@university.edu | captain of "Code Warriors"  |
| Student   | bob.student@university.edu   | member of "Code Warriors"   |
| Student   | carol.student@university.edu | registered participant      |
| Student   | david.student@university.edu | registered participant      |
| Organizer | emma.organizer@company.com   | created "Spring Innovation" |
| Organizer | frank.organizer@company.com  |                             |
| Sponsor   | grace.sponsor@corp.com       | Microsoft sponsorship       |
| Sponsor   | henry.sponsor@corp.com       | Google sponsorship          |

---

## ⚠️ Known Pitfalls (Do Not Repeat)

See `.github/copilot-instructions.md` **"Known Bugs & Pitfalls"** section for full detail with code fixes for:

1. Login page infinite refresh loop — verify `/auth/me` before trusting Zustand store
2. DashboardLayout auth redirect loop — middleware guards, layout only hydrates
3. Docker layer cache — always `--no-cache` after source change
4. AI matching route mount mismatch — `/students/matching/:id` NOT `/students/teams/:id`
5. `getMyTeams()` nested response shape — must flatten on frontend
6. Skill add/remove URL — `/students/skills` NOT `/students/profile/skills`
7. `isInTeam` blocks withdraw silently — frontend shows contextual badge
8. Tailwind opacity classes — only multiples of 5 valid
9. `select option` dark mode — requires global CSS, not Tailwind classes

---

## 🎯 V1 Remaining Work

| Priority | Item                                              | Owner    |
| -------- | ------------------------------------------------- | -------- |
| High     | Organizer: `[id]/edit` hackathon edit form page   | Frontend |
| Medium   | CSV export button wired (organizer)               | Frontend |
| Medium   | E2E tests: auth flow, team creation, registration | QA       |
| Low      | Mobile responsive audit (375px)                   | Frontend |
| Low      | Deployment guide (Render/DigitalOcean)            | DevOps   |

### Completed in Phase 4 (March 4, 2026)

- ✅ Loading skeletons on all dashboard pages (student, organizer, sponsor)
- ✅ Toast notifications (`sonner`) for API success/error feedback
- ✅ Empty states with CTAs on all list pages
- ✅ Form UX: textarea char counts, password visibility toggles
- ✅ Sidebar `startsWith` active highlighting for child/nested routes
- ✅ Breadcrumbs on all detail pages (`Breadcrumbs` shared component)
- ✅ Accessibility: `aria-label` on all icon-only buttons across all portals
- ✅ Notifications system: backend + API module + page in all 3 portals
- ✅ Student settings backend route + service (`StudentSettings` model)
- ✅ Organizer settings backend route + service (`OrganizerSettings` model)
- ✅ Organizer hackathon detail page (`hackathons/[id]/page.tsx`)
- ✅ Sponsor sponsored-hackathon detail page (`sponsored/[id]/page.tsx`)

### Out of Scope for V1

- Real-time team messaging (WebSockets + DB messages schema)
- Editable project details with DB persistence
- AI coaching / chatbot (Phase 4+)
- ML-based matching (replaces current deterministic scorer)

---

_For architecture details see `docs/architecture.md`. For coding standards see `docs/NAMING_CONVENTIONS.md`._
