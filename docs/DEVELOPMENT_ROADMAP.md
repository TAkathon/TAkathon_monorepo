# TAkathon Development Roadmap

## 📍 Current State (February 2026)

### Infrastructure ✅
- [x] Docker containerization complete
- [x] PostgreSQL 16 running with healthchecks
- [x] Core Gateway containerized (Express + Prisma 7)
- [x] All 4 frontends containerized (Next.js standalone mode)
- [x] AI Engine stub running (FastAPI)
- [x] `docker-compose up -d` fully functional

### Backend Status 🟡
- [x] Express server running on port 8000
- [x] Prisma 7 with adapter pattern configured
- [x] Database schema complete (users, profiles, hackathons, teams, skills)
- [x] Authentication endpoints (`/api/v1/auth/*`)
  - [x] POST `/auth/register` - User registration
  - [x] POST `/auth/login` - Login with JWT
  - [x] POST `/auth/refresh` - Token refresh
  - [x] POST `/auth/logout` - Logout
- [ ] Student endpoints (`/api/v1/students/*`) - **NOT STARTED**
- [ ] Organizer endpoints (`/api/v1/organizers/*`) - **NOT STARTED**
- [ ] Sponsor endpoints (`/api/v1/sponsors/*`) - **NOT STARTED**
- [ ] Shared endpoints (hackathons, teams, skills) - **NOT STARTED**
- [ ] RBAC middleware - **NOT STARTED**

### Frontend Status 🟡
- [x] Landing page running on port 3000
- [x] Student portal running on port 3001
- [x] Organizer dashboard running on port 3002
- [x] Sponsor panel running on port 3003
- [x] Tailwind CSS + Glassmorphism design configured
- [ ] Auth integration - **NOT STARTED**
- [ ] API integration - **NOT STARTED**
- [ ] State management (Zustand) - **NOT STARTED**

### Database Status 🟡
- [x] Prisma schema complete
- [x] Database running in Docker
- [x] Schema synced via `prisma db push`
- [ ] Seed data - **NOT STARTED**
- [ ] Migrations - **NOT STARTED**

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
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

export const requireStudent = requireRole(['student']);
export const requireOrganizer = requireRole(['organizer']);
export const requireSponsor = requireRole(['sponsor']);
```

---

### 1.2 Student Routes Implementation
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

**Directory Structure**:
```
apps/core-gateway/src/
  /routes/students/
    index.ts          # Router setup
    profile.ts        # Profile management
    hackathons.ts     # Hackathon browsing/registration
    teams.ts          # Team management
    matching.ts       # AI teammate recommendations
  /services/students/
    profile.service.ts
    hackathon.service.ts
    team.service.ts
    matching.service.ts
```

**Endpoints to Implement**:

#### Profile Management
- [ ] `GET /api/v1/students/profile` - Get student profile
- [ ] `PUT /api/v1/students/profile` - Update profile
- [ ] `POST /api/v1/students/skills` - Add skills
- [ ] `DELETE /api/v1/students/skills/:id` - Remove skill

#### Hackathon Operations
- [ ] `GET /api/v1/students/hackathons` - Browse hackathons
- [ ] `GET /api/v1/students/hackathons/:id` - Get hackathon details
- [ ] `POST /api/v1/students/hackathons/:id/register` - Register for hackathon
- [ ] `DELETE /api/v1/students/hackathons/:id/withdraw` - Withdraw from hackathon
- [ ] `GET /api/v1/students/hackathons/:id/participants` - View participants

#### Team Management
- [ ] `GET /api/v1/students/teams` - Get my teams
- [ ] `POST /api/v1/students/teams` - Create team
- [ ] `PUT /api/v1/students/teams/:id` - Update team
- [ ] `DELETE /api/v1/students/teams/:id` - Delete team
- [ ] `POST /api/v1/students/teams/:id/invite` - Invite teammate
- [ ] `POST /api/v1/students/teams/:id/join` - Join team (via invite)
- [ ] `DELETE /api/v1/students/teams/:id/leave` - Leave team

#### AI Matching
- [ ] `GET /api/v1/students/teams/:id/matches` - Get AI teammate recommendations
- [ ] `POST /api/v1/students/teams/:id/matches/:userId` - Request match

---

### 1.3 Organizer Routes Implementation
**Priority**: HIGH  
**Estimated Time**: 6-8 hours

**Directory Structure**:
```
apps/core-gateway/src/
  /routes/organizers/
    index.ts
    profile.ts
    hackathons.ts
    analytics.ts
  /services/organizers/
    profile.service.ts
    hackathon.service.ts
    analytics.service.ts
```

**Endpoints to Implement**:

#### Profile Management
- [ ] `GET /api/v1/organizers/profile` - Get organizer profile
- [ ] `PUT /api/v1/organizers/profile` - Update profile

#### Hackathon Management
- [ ] `POST /api/v1/organizers/hackathons` - Create hackathon
- [ ] `GET /api/v1/organizers/hackathons` - Get my hackathons
- [ ] `GET /api/v1/organizers/hackathons/:id` - Get hackathon details
- [ ] `PUT /api/v1/organizers/hackathons/:id` - Update hackathon
- [ ] `DELETE /api/v1/organizers/hackathons/:id` - Cancel hackathon
- [ ] `POST /api/v1/organizers/hackathons/:id/publish` - Publish hackathon

#### Participant Management
- [ ] `GET /api/v1/organizers/hackathons/:id/participants` - View all participants
- [ ] `GET /api/v1/organizers/hackathons/:id/teams` - View all teams
- [ ] `GET /api/v1/organizers/hackathons/:id/teams/:teamId` - Team details

#### Analytics & Export
- [ ] `GET /api/v1/organizers/hackathons/:id/analytics` - Event analytics
  - Total participants
  - Team formation rate
  - Skill distribution
  - Registration timeline
- [ ] `GET /api/v1/organizers/hackathons/:id/export` - Export data (CSV/JSON)

---

### 1.4 Sponsor Routes Implementation
**Priority**: MEDIUM  
**Estimated Time**: 4-6 hours

**Directory Structure**:
```
apps/core-gateway/src/
  /routes/sponsors/
    index.ts
    profile.ts
    hackathons.ts
    teams.ts
  /services/sponsors/
    profile.service.ts
    hackathon.service.ts
    team.service.ts
```

**Endpoints to Implement**:

#### Profile Management
- [ ] `GET /api/v1/sponsors/profile` - Get sponsor profile
- [ ] `PUT /api/v1/sponsors/profile` - Update profile

#### Hackathon Operations
- [ ] `GET /api/v1/sponsors/hackathons` - Browse hackathons
- [ ] `GET /api/v1/sponsors/hackathons/:id` - Get hackathon details
- [ ] `POST /api/v1/sponsors/hackathons/:id/sponsor` - Sponsor event
- [ ] `DELETE /api/v1/sponsors/hackathons/:id/unsponsor` - Remove sponsorship

#### Team Discovery
- [ ] `GET /api/v1/sponsors/hackathons/:id/teams` - Browse teams
- [ ] `GET /api/v1/sponsors/teams/:id` - Team project details
- [ ] `POST /api/v1/sponsors/teams/:id/favorite` - Bookmark team
- [ ] `DELETE /api/v1/sponsors/teams/:id/unfavorite` - Remove bookmark
- [ ] `GET /api/v1/sponsors/favorites` - Get bookmarked teams

---

### 1.5 Shared Routes Implementation
**Priority**: HIGH  
**Estimated Time**: 3-4 hours

**Directory Structure**:
```
apps/core-gateway/src/
  /routes/shared/
    hackathons.ts     # Public hackathon listings
    skills.ts         # Skill taxonomy
    search.ts         # Global search
```

**Endpoints to Implement**:
- [ ] `GET /api/v1/hackathons` - Public hackathon listings (paginated)
- [ ] `GET /api/v1/hackathons/:id` - Public hackathon details
- [ ] `GET /api/v1/skills` - Get all skills
- [ ] `GET /api/v1/skills/categories` - Get skill categories
- [ ] `GET /api/v1/search` - Global search (hackathons, users, teams)

---

## 🎯 Phase 2: Database Seeding

### 2.1 Create Seed Data
**Priority**: HIGH  
**Estimated Time**: 3-4 hours

**Tasks**:
- [ ] Update `prisma/seed.ts` with realistic test data
  - [ ] 50 student profiles with skills
  - [ ] 5 organizer profiles
  - [ ] 3 sponsor profiles
  - [ ] 10 hackathons (various statuses)
  - [ ] 20 teams with members
  - [ ] 30+ skills across categories
  - [ ] Team invitations (pending/accepted)
- [ ] Run `npx prisma db seed`
- [ ] Verify seed data in DBeaver

**File**: `prisma/seed.ts`
```typescript
import { PrismaClient, UserRole, SkillCategory, ProficiencyLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create skills
  const skills = await prisma.skill.createMany({ data: [...] });
  
  // Create test students
  for (let i = 1; i <= 50; i++) {
    await prisma.user.create({
      data: {
        email: `student${i}@test.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        student_profile: { create: { ... } },
      },
    });
  }
  
  // Create organizers, sponsors, hackathons, teams...
}
```

---

## 🎯 Phase 3: Frontend Integration

### 3.1 Shared API Client
**Priority**: HIGH  
**Estimated Time**: 2-3 hours

**Tasks**:
- [ ] Create `libs/shared/api/src/client.ts` - Axios client with interceptors
- [ ] Implement auto-refresh on 401
- [ ] Add request/response logging
- [ ] Create type-safe API methods

**File**: `libs/shared/api/src/client.ts`
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});

// Auto-refresh interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await apiClient.post('/auth/refresh');
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

### 3.2 Auth Store (Zustand)
**Priority**: HIGH  
**Estimated Time**: 2 hours

**Tasks**:
- [ ] Create `libs/shared/stores/src/auth.store.ts`
- [ ] Implement login/logout/register actions
- [ ] Persist user state
- [ ] Token management

---

### 3.3 Student Portal Integration
**Priority**: HIGH  
**Estimated Time**: 8-12 hours

**Tasks**:
- [ ] Login/Register pages
- [ ] Profile management UI
- [ ] Hackathon browsing
- [ ] Team creation/management
- [ ] AI teammate recommendations UI

---

### 3.4 Organizer Dashboard Integration
**Priority**: HIGH  
**Estimated Time**: 8-12 hours

**Tasks**:
- [ ] Login/Register pages
- [ ] Hackathon creation UI
- [ ] Participant management
- [ ] Team overview
- [ ] Analytics dashboard

---

### 3.5 Sponsor Panel Integration
**Priority**: MEDIUM  
**Estimated Time**: 6-8 hours

**Tasks**:
- [ ] Login/Register pages
- [ ] Hackathon browsing
- [ ] Team discovery UI
- [ ] Bookmarking system

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
import { ResponseHandler } from '@/utils/response';

try {
  const result = await service.doSomething();
  ResponseHandler.success(res, result);
} catch (error) {
  ResponseHandler.error(res, error.message, 400);
}
```

### Validation Pattern
```typescript
import { z } from 'zod';

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

**Overall Progress**: ~25% Complete

| Component | Status | Progress |
|-----------|--------|----------|
| Infrastructure | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| Auth System | ✅ Complete | 100% |
| Student API | ⬜ Not Started | 0% |
| Organizer API | ⬜ Not Started | 0% |
| Sponsor API | ⬜ Not Started | 0% |
| Frontend Auth | ⬜ Not Started | 0% |
| Frontend Integration | ⬜ Not Started | 0% |
| AI Matching | 🟡 Partial | 30% |
| Testing | ⬜ Not Started | 0% |
| Deployment | ⬜ Not Started | 0% |

**Next Immediate Tasks** (in order):
1. ✅ Update copilot instructions with current status
2. Create RBAC middleware (`rbac.ts`)
3. Implement student routes (start with profile)
4. Create seed data script
5. Test student endpoints with Postman/Thunder Client
