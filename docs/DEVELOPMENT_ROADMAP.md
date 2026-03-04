# TAkathon — Development Roadmap

**Last Updated**: March 4, 2026
**Current Phase**: Phase 4 Complete → V1 Polish done

---

## Phase Summary

| Phase | Name                    | Status      | Branch (merged to `dev`)              |
| ----- | ----------------------- | ----------- | ------------------------------------- |
| 1     | Security Foundations    | ✅ Complete | `feature/security-foundations`        |
| 2     | Core Data Flows         | ✅ Complete | `feature/phase2-core-data-flows`      |
| 3     | AI Matching Engine + UX | ✅ Complete | `feature/phase3-ai-matching` (PR #26) |
| 4     | V1 Polish & CI          | ✅ Complete | `dev` (direct commits)                |
| 5     | V2 Features             | ⬜ Future   | —                                     |

---

## ✅ Phase 1 — Security Foundations

**Completed**: February 2026
**Branch**: `feature/security-foundations` → merged to `dev`

### Deliverables

- [x] JWT access token issued as `httpOnly` cookie (`accessToken`) — NOT in response body
- [x] JWT refresh token issued as `httpOnly` cookie (`refreshToken`)
- [x] `requireAuth` middleware reads from `req.cookies.accessToken` (not Authorization header)
- [x] Rate limiting: `express-rate-limit` — 10 req/15 min on `/auth/login` and `/auth/register`
- [x] ENV guard at startup: exits in production if `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` missing
- [x] Prisma migrate deploy baseline committed (`db push --accept-data-loss` removed)
- [x] 32 security tests: `token.spec.ts` (13 tests) + `auth.spec.ts` (19 tests)
- [x] RBAC middleware: `requireStudent`, `requireOrganizer`, `requireSponsor`
- [x] Route protection: `middleware.ts` in student-portal, organizer-dashboard, sponsor-panel enforces httpOnly cookie check

---

## ✅ Phase 2 — Core Data Flows

**Completed**: February 2026
**Branch**: `feature/phase2-core-data-flows` → merged to `dev`

### Deliverables

- [x] **Typed Shared API Client** (`libs/shared/api/src/`):
  - [x] `organizerApi` — full hackathon CRUD + lifecycle (publish/start/complete/cancel)
  - [x] `studentApi` — profile, hackathon browse/register/withdraw
  - [x] `teamApi` — CRUD + invite/join/leave/disband
  - [x] `invitationApi` — list/accept/reject invitations
  - [x] `hackathonApi` — public listings + single hackathon
- [x] Axios client with `withCredentials: true` + JWT auto-refresh interceptors + global 401 redirect
- [x] **Backend additions**: `POST /:id/start`, `POST /:id/complete`, `PATCH /:id` on organizer hackathons router
- [x] **Frontend refactored**: all pages use typed domain API functions (no bare `api.get/post`)
- [x] Organizer hackathon lifecycle action buttons (Publish / Start / Complete / Cancel)
- [x] Student portal dashboard, profile, hackathons, teams pages wired to live API
- [x] Organizer dashboard hackathons list, participants, teams, settings wired to live API
- [x] Sponsor panel dashboard, opportunities, requests, profile wired to live API

---

## ✅ Phase 3 — AI Matching Engine + UX Polish

**Completed**: March 2026
**Branch**: `feature/phase3-ai-matching` → merged to `dev` (PR #26)

### Sub-deliverables

#### 3a — AI Matching Engine (FastAPI)

- [x] `apps/ai-engine/app/matching/scoring.py` — three pure deterministic scorers:
  - `skill_complementarity` (40%) — unique skill coverage
  - `experience_balance` (30%) — targets mean proficiency 2.5 on 1–4 scale
  - `availability_overlap` (30%) — Jaccard slot similarity + hours compatibility
- [x] `apps/ai-engine/app/matching/engine.py` — orchestrates scorers, generates explanations, returns ranked suggestions
- [x] `apps/ai-engine/app/matching/validators.py` — Pydantic v2: `MatchRequest`, `MatchResponse`, `MatchSuggestion`, `AvailabilityEntry`
- [x] `apps/ai-engine/app/main.py` — FastAPI endpoint: `POST /api/v1/matching/recommend`
- [x] 27 pytest tests: `test_scoring.py` + `test_matching.py`

#### 3b — Availability Feature

- [x] `StudentProfile.availability Json? @db.JsonB` added to Prisma schema
- [x] Availability shape: `{ timezone, hoursPerWeek, preferredSlots: string[] }`
- [x] 6 valid slot keys: `weekday_morning/afternoon/evening`, `weekend_morning/afternoon/evening`
- [x] `scoring.py` real `availability_overlap`: Jaccard (70%) + hours compat (30%); neutral 0.5 if no data
- [x] `profile.service.ts`: get + update availability with Zod validation
- [x] `libs/shared/api`: `AvailabilitySlot` type + `AvailabilityData` interface exported from barrel
- [x] `settings/page.tsx`: Availability section — timezone dropdown, hours/week input, 6 slot toggle buttons

#### 3c — Core Gateway Integration

- [x] `StudentMatchingService.getMatches()` — fetches team + candidates from Prisma, calls AI engine, falls back to `basicScoring()`
- [x] Routes: `GET /api/v1/students/matching/:id/matches` + `POST /api/v1/students/matching/:id/matches/:userId`
- [x] AI engine starts by default (`profiles: [ai]` removed from docker-compose)
- [x] `AI_ENGINE_URL=http://ai-engine:8001` injected into core-gateway container

#### 3d — Shared API Client

- [x] `libs/shared/api/src/matching.ts` — `matchingApi`: `suggestTeammates(teamId, limit)`, `inviteMatch(teamId, userId)`
- [x] `MatchSuggestion`, `MatchResult` types exported from barrel

#### 3e — Student Portal UX

- [x] "Find Teammates" button on forming teams with open spots
- [x] AI matching modal: ranked candidates, score badge, breakdown (skill/exp/avail %), explanation, Invite button
- [x] `teams/[id]/messages/page.tsx` — placeholder chat UI (demo messages, input disabled, "Coming Soon" badge)
- [x] `teams/[id]/project/page.tsx` — milestone tracker, tech stack, submission links (demo data, "Demo Data" badge)
- [x] Team Chat + Project Details buttons navigate via `router.push()`

#### 3f — Bug Fixes

- [x] Login infinite refresh loop fixed (verify `/auth/me` before trusting Zustand store)
- [x] `DashboardLayout` auth loop removed (layout hydrates from `/auth/me`, not redirects)
- [x] Team API response flatten: `getMyTeams()` nested shape documented + flattened on frontend
- [x] Skill add/remove URL corrected: `/students/skills` (not `/students/profile/skills`)
- [x] AI matching URL corrected: `/students/matching/:teamId/matches`
- [x] Profile skills: replaced `window.prompt()` with inline dropdown form
- [x] Hackathon `isRegistered` + `isInTeam` flags added to `listHackathons()` response
- [x] Leave/Disband team: non-captain sees Leave, captain sees Disband (forming status only)
- [x] `select option` dark theme: global CSS in all three apps' `globals.css`

---

## ✅ Phase 4 — V1 Polish & Deployment Ready

**Completed**: March 4, 2026
**Branch**: `dev` (direct commits)

### Frontend Polish

- [x] Loading skeletons on all dashboard pages (student, organizer, sponsor) — 12 skeleton primitives in `libs/shared/ui`
- [x] Toast notifications (`sonner`) for API success/error feedback on all async actions
- [x] Empty states with CTAs on all list pages
- [x] Form UX: textarea char counts (`maxLength` + counter), password visibility toggles
- [x] Sidebar active state: `startsWith` matching for child/nested routes
- [x] Breadcrumbs on all detail/nested pages — shared `<Breadcrumbs>` component
- [x] Accessibility: `aria-label` on all icon-only buttons across all 3 portals

### New Pages

- [x] `student-portal/dashboard/notifications/page.tsx` — list, mark-read, delete, paginated
- [x] `organizer-dashboard/notifications/page.tsx` — same features
- [x] `organizer-dashboard/hackathons/[id]/page.tsx` — hackathon detail with participants + teams
- [x] `sponsor-panel/dashboard/notifications/page.tsx` — same features
- [x] `sponsor-panel/dashboard/sponsored/[id]/page.tsx` — sponsored hackathon detail

### New Backend

- [x] `Notification` Prisma model + `notifications.service.ts` + `routes/shared/notifications.ts` — `GET/PUT /:id/read/DELETE /:id`
- [x] `StudentSettings` Prisma model + `settings.service.ts` + `routes/students/settings.ts` — `GET/PUT /api/v1/students/settings`
- [x] `OrganizerSettings` Prisma model + `settings.service.ts` + `routes/organizers/settings.ts` — `GET/PUT /api/v1/organizers/settings`

### New Shared Library

- [x] `libs/shared/api/src/notifications.ts` — `notificationsApi`: `getNotifications`, `markAsRead`, `deleteNotification`
- [x] `libs/shared/ui`: `Skeleton` (12 primitives), `Breadcrumbs`, `AvatarMenu`

### Remaining for V1 (future)

- [ ] Organizer hackathon edit form page (`hackathons/[id]/edit`)
- [ ] CSV export button wired on organizer detail page
- [ ] E2E tests: register, login, team creation, hackathon registration
- [ ] Deployment guide (Render/DigitalOcean)
- [ ] Mobile responsive audit (375px)

---

## ⬜ Phase 5 — V2 Features

**Status**: Out of Scope for V1
**Target**: Post-launch

### Real-Time Features

- [ ] WebSocket backend (Socket.io or native `ws`) for team messaging
- [ ] Database schema for `Message` model (team_id, user_id, content, created_at)
- [ ] Real-time chat in `teams/[id]/messages/` replacing placeholder

### Project Management

- [ ] Editable project details with DB persistence (`projectIdea`, `techStack`, `submissionUrl`)
- [ ] Full CRUD API: `PATCH /api/v1/teams/:id/project`
- [ ] Milestone tracking with status (not just demo data)

### AI Enhancements (Phase 4+)

- [ ] ML-based scoring (replace deterministic scorers in `scoring.py`)
  - Embeddings for skill semantic similarity
  - Team success prediction model
- [ ] A/B testing framework for matching algorithms
- [ ] Match acceptance rate tracking + feedback loop
- [ ] AI coaching / chatbot for hackathon tips

### Platform Expansion

- [ ] Admin dashboard for platform management
- [ ] Hackathon results and leaderboard
- [ ] Portfolio showcasing past hackathon projects
- [ ] Integration with GitHub for automatic portfolio building

---

## 🔀 Git Workflow Reference

```
main          ← production (merge via release/* or hotfix/*)
  ↑
dev           ← integration branch (all feature/* merge here)
  ↑
feature/*     ← individual feature work
fix/*         ← bug fixes
chore/*       ← tooling, docs, config
hotfix/*      ← emergency production fixes (branch from main)
```

**Rules**:

1. Never commit directly to `main` or `dev`
2. Always create a feature/fix/chore branch from `dev`
3. All merges via Pull Request only
4. Squash merge for features; merge commit for hotfixes

---

_See `docs/REPO_STATE.md` for current implementation status and `docs/NAMING_CONVENTIONS.md` for coding standards._
