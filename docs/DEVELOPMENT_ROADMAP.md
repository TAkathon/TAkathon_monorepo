# TAkathon Development Roadmap

## 📍 Current State (February 2026)

### Infrastructure ✅

- [x] Docker containerization complete
- [x] PostgreSQL 16 running with healthchecks
- [x] Core Gateway containerized (Express + Prisma 7)
- [x] All 4 frontends containerized (Next.js standalone mode)
- [x] AI Engine stub running (FastAPI)
- [x] `docker-compose up -d` fully functional

### Backend Status ✅

- [x] Express server running on port 8000
- [x] Prisma 7 with adapter pattern configured
- [x] Database schema complete (users, profiles, hackathons, teams, skills)
- [x] Authentication endpoints (`/api/v1/auth/*`)
  - [x] POST `/auth/register` - User registration
  - [x] POST `/auth/login` - Login with JWT
  - [x] POST `/auth/refresh` - Token refresh
  - [x] POST `/auth/logout` - Logout
- [x] RBAC middleware (`requireStudent`, `requireOrganizer`, `requireSponsor`)
- [x] Student endpoints (`/api/v1/students/*`) - **COMPLETE**
- [x] Organizer endpoints (`/api/v1/organizers/*`) - **COMPLETE**
- [x] Sponsor endpoints (`/api/v1/sponsors/*`) - **COMPLETE**
- [x] Shared endpoints (`/api/v1/hackathons`, `/api/v1/skills`) - **COMPLETE**

### Frontend Status 🟡

- [x] Landing page running on port 3000
- [x] Student portal running on port 3001
- [x] Organizer dashboard running on port 3002
- [x] Sponsor panel running on port 3003
- [x] Tailwind CSS + Glassmorphism design configured
- [ ] Auth integration - **NOT STARTED**
- [ ] API integration - **NOT STARTED**
- [ ] State management (Zustand) - **NOT STARTED**

### Database Status ✅

- [x] Prisma schema complete
- [x] Database running in Docker
- [x] Schema synced via `prisma db push`
- [x] Seed data — 36 skills, 8 users, 2 hackathons, teams, sponsorships
- [ ] Production migrations - **NOT STARTED**

---

## 🎯 Phase 1: Backend API Development (Current Focus)

### 1.1 Create RBAC Middleware

**Priority**: HIGH  
**Estimated Time**: 2-3 hours

**Tasks**:

- [ ] Create `apps/core-gateway/src/middleware/rbac.ts`
- [ ] Implement role extraction from JWT
- [ ] Create role guards: `requireStudent()`, `requireOrganizer()`, `requireSponsor()`
- [ ] Add role validation middleware

**File**: `apps/core-gateway/src/middleware/rbac.ts`

```typescript
// Extract role from JWT and validate
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // From JWT
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

export const requireStudent = requireRole(["student"]);
export const requireOrganizer = requireRole(["organizer"]);
export const requireSponsor = requireRole(["sponsor"]);
```

---

### 1.2 Student Routes ✅

- [x] `GET/PUT /api/v1/students/profile` - Profile management + skills
- [x] `GET /api/v1/students/hackathons` + `/:id` - Browse hackathons
- [x] `POST /api/v1/students/hackathons/:id/register` - Register
- [x] `DELETE /api/v1/students/hackathons/:id/withdraw` - Withdraw
- [x] `GET/POST /api/v1/students/teams` - List / create team
- [x] `PUT/DELETE /api/v1/students/teams/:id` - Update / delete team
- [x] `POST /api/v1/students/teams/:id/invite` - Invite teammate
- [x] `POST /api/v1/students/teams/:id/join` - Join via invite
- [x] `DELETE /api/v1/students/teams/:id/leave` - Leave team
- [x] `GET /api/v1/students/teams/:id/matches` - AI teammate recommendations

### 1.3 Organizer Routes ✅

- [x] `GET/PUT /api/v1/organizers/profile`
- [x] `GET/POST /api/v1/organizers/hackathons` - List / create
- [x] `GET/PUT /api/v1/organizers/hackathons/:id` - Detail / update
- [x] `POST /api/v1/organizers/hackathons/:id/publish` - Draft → registration_open
- [x] `POST /api/v1/organizers/hackathons/:id/start` - Start event
- [x] `POST /api/v1/organizers/hackathons/:id/complete` - Complete event
- [x] `DELETE /api/v1/organizers/hackathons/:id` - Cancel hackathon
- [x] `GET /api/v1/organizers/hackathons/:id/participants` - View participants
- [x] `POST /api/v1/organizers/hackathons/:id/participants/accept` - Bulk accept
- [x] `GET /api/v1/organizers/hackathons/:id/teams` - View teams
- [x] `GET /api/v1/organizers/hackathons/:id/analytics` - Stats
- [x] `GET /api/v1/organizers/hackathons/:id/export` - CSV export

### 1.4 Sponsor Routes ✅

- [x] `GET/PUT /api/v1/sponsors/profile`
- [x] `GET /api/v1/sponsors/hackathons` + `/:id` - Browse hackathons
- [x] `POST /api/v1/sponsors/hackathons/:id/sponsor` - Sponsor event
- [x] `DELETE /api/v1/sponsors/hackathons/:id/unsponsor` - Remove sponsorship
- [x] `GET /api/v1/sponsors/hackathons/:id/teams` - Browse teams
- [x] `GET /api/v1/sponsors/teams/:id` - Team project details
- [x] `POST /api/v1/sponsors/teams/:id/favorite` - Bookmark team
- [x] `DELETE /api/v1/sponsors/teams/:id/unfavorite` - Remove bookmark
- [x] `GET /api/v1/sponsors/favorites` - Get bookmarked teams

### 1.5 Shared Routes ✅

- [x] `GET /api/v1/hackathons` - Public hackathon listings (paginated)
- [x] `GET /api/v1/hackathons/:id` - Public hackathon details
- [x] `GET /api/v1/skills` - Get all skills
- [x] `GET /api/v1/skills/categories` - Get skill categories

---

## 🎯 Phase 2: Database Seeding ✅ COMPLETE

### 2.1 Seed Data

- [x] `prisma/seed.ts` — 36 skills, 8 users (4 students, 2 organizers, 2 sponsors)
- [x] 2 hackathons, 6 participants, 1 team (Code Warriors), 2 sponsorships
- [x] Test credentials: `alice.student@university.edu` / `password123` (all users same password)
- [x] `npm run db:seed` command wired up

---

## 🎯 Phase 3: Frontend Integration 🟡 (Current Focus)

### 3.1 Shared API Client

**Priority**: HIGH

**Tasks**:

- [ ] Create `libs/shared/api/src/client.ts` - Axios client with interceptors
- [ ] Implement auto-refresh on 401
- [ ] Add request/response logging
- [ ] Create type-safe API methods

**File**: `libs/shared/api/src/client.ts`

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Auto-refresh interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await apiClient.post("/auth/refresh");
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  },
);
```

---

### 3.2 Auth Store (Zustand)

**Priority**: HIGH

**Tasks**:

- [ ] Wire `libs/shared/utils/src/lib/authStore.ts` into each frontend
- [ ] Implement login/logout/register actions
- [ ] Persist user state across page refreshes
- [ ] Token management (access token in memory, refresh via cookie)

---

### 3.3 Student Portal Integration

**Priority**: HIGH

**Tasks**:

- [ ] Login/Register pages connected to `/api/v1/auth/*`
- [ ] Profile management UI → `GET/PUT /api/v1/students/profile`
- [ ] Hackathon browsing → `GET /api/v1/students/hackathons`
- [ ] Team creation/management → `/api/v1/students/teams/*`
- [ ] AI teammate recommendations UI → `GET /api/v1/students/teams/:id/matches`

---

### 3.4 Organizer Dashboard Integration

**Priority**: HIGH

**Tasks**:

- [ ] Login/Register pages connected to `/api/v1/auth/*`
- [ ] Hackathon creation/edit UI → `/api/v1/organizers/hackathons`
- [ ] Participant management → `/api/v1/organizers/hackathons/:id/participants`
- [ ] Team overview → `/api/v1/organizers/hackathons/:id/teams`
- [ ] Analytics dashboard → `/api/v1/organizers/hackathons/:id/analytics`

---

### 3.5 Sponsor Panel Integration

**Priority**: MEDIUM

**Tasks**:

- [ ] Login/Register pages connected to `/api/v1/auth/*`
- [ ] Hackathon browsing → `/api/v1/sponsors/hackathons`
- [ ] Team discovery UI → `/api/v1/sponsors/hackathons/:id/teams`
- [ ] Bookmarking → `POST/DELETE /api/v1/sponsors/teams/:id/favorite`

---

## 🎯 Phase 4: AI Matching Engine

### 4.1 Complete FastAPI Implementation

**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours

**Tasks**:

- [ ] Implement scoring algorithms in `apps/ai-engine/app/matching/scoring.py`
- [ ] Create recommendation endpoint
- [ ] Add validators
- [ ] Integration with core-gateway

---

## 🎯 Phase 5: Testing

### 5.1 Backend Testing

- [ ] Unit tests for services (Jest)
- [ ] Integration tests for API endpoints
- [ ] E2E auth flow tests

### 5.2 Frontend Testing

- [ ] Component tests (React Testing Library)
- [ ] User flow tests (Playwright)

---

## 🎯 Phase 6: Deployment

### 6.1 CI/CD Pipeline

- [ ] GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Docker image builds

### 6.2 Production Deployment

- [ ] Environment configuration
- [ ] Database migrations
- [ ] Deploy to Render/DigitalOcean

---

## 📝 Development Guidelines

### Code Organization

```
apps/core-gateway/src/
  /routes/{role}/
    index.ts          # Route registration
    {feature}.ts      # Feature-specific routes
  /services/{role}/
    {feature}.service.ts  # Business logic
  /validators/
    {feature}.validator.ts  # Zod schemas
```

### Naming Conventions

- **Routes**: Plural, kebab-case (`/students/hackathons`)
- **Services**: PascalCase, suffix with `Service` (`HackathonService`)
- **Validators**: PascalCase, suffix with `Schema` (`CreateTeamSchema`)

### Error Handling

```typescript
import { ResponseHandler } from "@/utils/response";

try {
  const result = await service.doSomething();
  ResponseHandler.success(res, result);
} catch (error) {
  ResponseHandler.error(res, error.message, 400);
}
```

### Validation Pattern

```typescript
import { z } from "zod";

const CreateTeamSchema = z.object({
  name: z.string().min(3).max(50),
  hackathonId: z.string().uuid(),
  maxMembers: z.number().min(2).max(10),
});

// In route
const validated = CreateTeamSchema.parse(req.body);
```

---

## 🚀 Quick Start Commands

```bash
# Start all services
docker-compose up -d

# Start fresh (rebuild)
docker-compose up -d --build

# View logs
docker-compose logs -f core-gateway

# Stop all services
docker-compose down

# Database operations
npx prisma db push        # Sync schema
npx prisma db seed        # Seed data
npx prisma studio         # GUI browser

# Development (local)
nx serve core-gateway     # Backend dev server
nx serve student-portal   # Frontend dev server

# Connect to database
# DBeaver: localhost:5432, takathon, postgres/postgrespassword
```

---

## 📊 Progress Tracking

**Overall Progress**: ~60% Complete

| Component            | Status         | Progress |
| -------------------- | -------------- | -------- |
| Infrastructure       | ✅ Complete    | 100%     |
| Database Schema      | ✅ Complete    | 100%     |
| Seed Data            | ✅ Complete    | 100%     |
| Auth System          | ✅ Complete    | 100%     |
| RBAC Middleware      | ✅ Complete    | 100%     |
| Student API          | ✅ Complete    | 100%     |
| Organizer API        | ✅ Complete    | 100%     |
| Sponsor API          | ✅ Complete    | 100%     |
| Shared API           | ✅ Complete    | 100%     |
| Frontend Auth        | ⬜ Not Started | 0%       |
| Frontend Integration | ⬜ Not Started | 0%       |
| AI Matching          | 🟡 Partial     | 30%      |
| Testing              | ⬜ Not Started | 0%       |
| Deployment           | ⬜ Not Started | 0%       |

**Next Immediate Tasks** (in order):

1. Connect frontends to backend APIs (student-portal first)
2. Wire Zustand auth store into all three dashboards
3. Implement AI matching scoring logic in `apps/ai-engine/app/matching/scoring.py`
4. E2E tests for auth + team creation flows
5. CI/CD pipeline with GitHub Actions
