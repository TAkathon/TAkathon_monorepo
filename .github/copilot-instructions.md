# TAkathon Copilot Instructions

## 📊 Current Project Status (Feb 2026)

### ✅ Completed
- **Docker Infrastructure**: Full containerization with multi-stage builds
  - PostgreSQL 16 container with healthchecks
  - Core Gateway (Express + Prisma 7 with adapter pattern)
  - All 4 Next.js frontends (landing-page, student-portal, organizer-dashboard, sponsor-panel)
  - AI Engine (FastAPI stub with profiles)
  - All services orchestrated via `docker-compose up -d`
- **Build Pipeline**: esbuild bundling for core-gateway, Next.js standalone mode for frontends
- **Database**: Prisma schema defined with all tables (users, profiles, hackathons, teams, skills)
- **TypeScript Configuration**: Workspace-wide path aliases in `tsconfig.base.json`
- **Authentication Foundation**: JWT-based auth routes (`/api/v1/auth/*`) with access/refresh tokens

### 🚧 In Progress
- **Backend API Implementation**: Only auth routes exist; need role-specific endpoints
- **Frontend-Backend Integration**: Frontends not yet connected to APIs
- **Database Seeding**: No seed data for development/testing

### 📋 Next Steps (Priority Order)
1. **Backend API Development** (Current Focus)
   - Implement student-specific routes (`/api/v1/students/*`)
   - Implement organizer-specific routes (`/api/v1/organizers/*`)
   - Implement sponsor-specific routes (`/api/v1/sponsors/*`)
   - Shared routes for hackathons, teams, skills
2. **Frontend Integration**
   - Connect student-portal to student API endpoints
   - Connect organizer-dashboard to organizer endpoints
   - Connect sponsor-panel to sponsor endpoints
   - Implement auth flows in all frontends
3. **AI Matching Engine**
   - Complete FastAPI matching implementation
   - Integrate with core-gateway via HTTP proxy
4. **Testing & Validation**
   - Seed database with realistic test data
   - E2E tests for critical user flows
5. **Deployment**
   - CI/CD pipeline setup
   - Production environment configuration

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
import { Button } from '@takathon/shared/ui';
import { User, Team } from '@takathon/shared/types';
import { validateEmail } from '@takathon/shared/utils';
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
