# TAkathon Monorepo - Repository State Summary

**Last Updated**: February 14, 2026  
**Version**: 1.0.0  
**Status**: Development Phase - Infrastructure Complete, Backend API In Progress

---

## 📁 Repository Structure

```
TAkathon_monorepo/
├── apps/
│   ├── core-gateway/          ✅ Express + Prisma 7, Dockerized
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   └── auth.ts    ✅ JWT auth complete
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── lib/prisma.ts  ✅ Prisma adapter pattern
│   │   └── Dockerfile         ✅ Multi-stage build
│   ├── student-portal/        ✅ Next.js 15, Dockerized
│   ├── organizer-dashboard/   ✅ Next.js 15, Dockerized
│   ├── sponsor-panel/         ✅ Next.js 15, Dockerized
│   ├── landing-page/          ✅ Next.js 15, Dockerized
│   └── ai-engine/             ✅ FastAPI stub, Dockerized
├── libs/
│   ├── shared/
│   │   ├── types/             ✅ TypeScript definitions
│   │   ├── ui/                🟡 Partial - needs components
│   │   ├── utils/             🟡 Partial - needs utilities
│   │   └── api/               ⬜ Empty - needs API client
│   └── python/
│       └── ai-logic/          ⬜ Empty - needs AI utilities
├── prisma/
│   ├── schema.prisma          ✅ Complete schema
│   └── seed.ts                ⬜ Empty - needs seed data
├── docs/
│   ├── architecture.md        ✅ Complete
│   ├── api-specification.md   🟡 Partial - needs API docs
│   └── DEVELOPMENT_ROADMAP.md ✅ Just created
├── docker-compose.yml         ✅ All services configured
└── tsconfig.base.json         ✅ Path aliases configured
```

**Legend**: ✅ Complete | 🟡 Partial | ⬜ Not Started

---

## 🔧 Technology Stack

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| **Frontend** | Next.js | 15.5.12 | ✅ Running |
| **Backend** | Express | 4.x | ✅ Running |
| **ORM** | Prisma | 7.4.0 | ✅ Configured |
| **Database** | PostgreSQL | 16 | ✅ Running |
| **AI Service** | FastAPI | 0.109.2 | ✅ Stub |
| **Build Tool** | esbuild | 0.27.3 | ✅ Configured |
| **Monorepo** | Nx | 20.4.4 | ✅ Configured |
| **Runtime** | Node.js | 22 | ✅ Alpine |
| **Container** | Docker | Latest | ✅ All services |
| **Styling** | Tailwind CSS | 3.x | ✅ Configured |

---

## 🌐 Service Ports

| Service | Port | Status | URL |
|---------|------|--------|-----|
| Landing Page | 3000 | ✅ Running | http://localhost:3000 |
| Student Portal | 3001 | ✅ Running | http://localhost:3001 |
| Organizer Dashboard | 3002 | ✅ Running | http://localhost:3002 |
| Sponsor Panel | 3003 | ✅ Running | http://localhost:3003 |
| Core Gateway (API) | 8000 | ✅ Running | http://localhost:8000 |
| AI Engine | 8001 | ✅ Running (profile) | http://localhost:8001 |
| PostgreSQL | 5432 | ✅ Running | localhost:5432 |

**Database Credentials**:
- Host: `localhost`
- Port: `5432`
- Database: `takathon`
- Username: `postgres`
- Password: `postgrespassword`

---

## 📊 Database Schema

### Tables (Prisma Schema)
```
users                    ✅ Defined
├── student_profiles     ✅ Defined
├── organizer_profiles   ✅ Defined
└── sponsor_profiles     ✅ Defined

skills                   ✅ Defined
user_skills              ✅ Defined (many-to-many)

hackathons               ✅ Defined
hackathon_participants   ✅ Defined

teams                    ✅ Defined
team_members             ✅ Defined
team_invitations         ✅ Defined

applications             ✅ Defined
sponsorships             ✅ Defined
```

### Enums
- `UserRole`: student, organizer, sponsor
- `SkillCategory`: frontend, backend, design, data_science, mobile, devops, product_management, other
- `ProficiencyLevel`: beginner, intermediate, advanced, expert
- `HackathonStatus`: draft, registration_open, registration_closed, in_progress, completed, cancelled
- `ParticipantStatus`: registered, in_team, withdrawn

---

## 🔐 Authentication System

**Status**: ✅ Complete  
**Type**: JWT-based with refresh tokens

### Implemented Endpoints
- ✅ `POST /api/v1/auth/register` - User registration
- ✅ `POST /api/v1/auth/login` - Login (returns access + refresh tokens)
- ✅ `POST /api/v1/auth/refresh` - Refresh access token
- ✅ `POST /api/v1/auth/logout` - Logout

### Token Strategy
- **Access Token**: 15min expiry, in response body
- **Refresh Token**: 7 day expiry, httpOnly cookie
- **Validation**: JWT middleware on protected routes

---

## 🚧 API Endpoints Status

### Implemented ✅
```
GET  /                      - Welcome message
GET  /api/v1/health         - Health check
POST /api/v1/auth/register  - User registration
POST /api/v1/auth/login     - Login
POST /api/v1/auth/refresh   - Token refresh
POST /api/v1/auth/logout    - Logout
```

### To Implement ⬜

**Student Routes** (`/api/v1/students/*`):
- Profile: GET, PUT
- Hackathons: GET (browse), GET /:id, POST /:id/register, DELETE /:id/withdraw
- Teams: GET (my teams), POST (create), PUT /:id, DELETE /:id, POST /:id/invite
- Matching: GET /teams/:id/matches

**Organizer Routes** (`/api/v1/organizers/*`):
- Profile: GET, PUT
- Hackathons: POST (create), GET (my events), PUT /:id, DELETE /:id
- Participants: GET /hackathons/:id/participants, GET /hackathons/:id/teams
- Analytics: GET /hackathons/:id/analytics, GET /hackathons/:id/export

**Sponsor Routes** (`/api/v1/sponsors/*`):
- Profile: GET, PUT
- Hackathons: GET (browse), POST /:id/sponsor
- Teams: GET /hackathons/:id/teams, GET /teams/:id, POST /teams/:id/favorite

**Shared Routes** (`/api/v1/*`):
- Hackathons: GET /hackathons (public listings)
- Skills: GET /skills, GET /skills/categories

---

## 🐳 Docker Status

### Services Running
```bash
$ docker-compose ps

NAME                 STATUS                  PORTS
takathon-db          Up (healthy)            5432:5432
takathon-gateway     Up (healthy)            8000:8000
takathon-landing     Up                      3000:3000
takathon-student     Up                      3001:3001
takathon-organizer   Up                      3002:3002
takathon-sponsor     Up                      3003:3003
takathon-ai          Up (profile: ai)        8001:8001
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Start with AI engine
docker-compose --profile ai up -d

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f core-gateway

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 📦 Dependencies

### Core Gateway (Node.js)
```json
{
  "express": "^4.18.2",
  "prisma": "^7.4.0",
  "@prisma/client": "^7.4.0",
  "@prisma/adapter-pg": "^7.4.0",
  "pg": "^8.11.3",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "zod": "^3.22.4",
  "cors": "^2.8.5",
  "cookie-parser": "^1.4.6",
  "dotenv": "^16.0.3"
}
```

### Frontend (Next.js)
```json
{
  "next": "15.5.12",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.263.1",
  "zustand": "^4.5.0",
  "axios": "^1.6.0"
}
```

### AI Engine (Python)
```txt
fastapi==0.109.2
uvicorn==0.27.1
pydantic==2.5.3
```

---

## 🏗️ Build Configuration

### TypeScript Path Aliases
```json
// tsconfig.base.json
{
  "paths": {
    "@takathon/shared/types": ["libs/shared/types/src/index.ts"],
    "@takathon/shared/ui": ["libs/shared/ui/src/index.ts"],
    "@takathon/shared/utils": ["libs/shared/utils/src/index.ts"],
    "@takathon/shared/api": ["libs/shared/api/src/index.ts"]
  }
}
```

### Core Gateway Build
- **Type Check**: `tsc --noEmit`
- **Bundler**: `esbuild` (bundles to single file)
- **Output**: `dist/index.js` (2.0 MB)
- **Externals**: `@prisma/client`, `@prisma/adapter-pg`, `pg`

### Frontend Build
- **Mode**: `standalone` (Next.js)
- **Output**: `.next/standalone` + `.next/static`
- **Server**: `apps/{app}/server.js`

---

## 🔍 Current Gaps

### High Priority ⚠️
1. **No role-specific API routes** - Only auth exists
2. **No RBAC middleware** - No role validation
3. **No seed data** - Empty database
4. **No frontend-backend integration** - Frontends are static

### Medium Priority
1. AI matching engine incomplete - Stub only
2. No shared API client library
3. No state management in frontends
4. No test coverage

### Low Priority
1. No CI/CD pipeline
2. No production deployment
3. No monitoring/logging
4. No API documentation (Swagger)

---

## 📝 Environment Variables

### Core Gateway (.env)
```bash
DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/takathon?schema=public
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
JWT_ACCESS_SECRET=dev_access_secret_123456789
JWT_REFRESH_SECRET=dev_refresh_secret_123456789
ACCESS_TTL=15m
REFRESH_TTL=7d
```

### Frontends (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🎯 Immediate Next Steps (Priority Order)

1. **Create RBAC Middleware** (2-3 hours)
   - File: `apps/core-gateway/src/middleware/rbac.ts`
   - Implement `requireStudent()`, `requireOrganizer()`, `requireSponsor()`

2. **Implement Student Routes** (6-8 hours)
   - Directory: `apps/core-gateway/src/routes/students/`
   - Start with profile management

3. **Create Database Seed Script** (3-4 hours)
   - File: `prisma/seed.ts`
   - Add 50 students, 5 organizers, 3 sponsors, 10 hackathons

4. **Implement Organizer Routes** (6-8 hours)
   - Directory: `apps/core-gateway/src/routes/organizers/`
   - Focus on hackathon management

5. **Implement Sponsor Routes** (4-6 hours)
   - Directory: `apps/core-gateway/src/routes/sponsors/`

6. **Frontend Auth Integration** (4-6 hours)
   - Create `libs/shared/api/src/client.ts`
   - Add Zustand auth store

---

## 📚 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `.github/copilot-instructions.md` | Development guidelines | ✅ Updated |
| `docs/DEVELOPMENT_ROADMAP.md` | Detailed roadmap | ✅ Just created |
| `docs/REPO_STATE.md` | This file | ✅ Current |
| `prisma/schema.prisma` | Database schema | ✅ Complete |
| `docker-compose.yml` | Service orchestration | ✅ Complete |
| `tsconfig.base.json` | TypeScript config | ✅ Complete |
| `apps/core-gateway/src/index.ts` | API server entry | ✅ Basic setup |
| `apps/core-gateway/src/routes/auth.ts` | Auth routes | ✅ Complete |
| `prisma/seed.ts` | Database seeding | ⬜ Empty |

---

## 🤝 Contributing

See `DEVELOPMENT_ROADMAP.md` for detailed implementation tasks and `copilot-instructions.md` for coding guidelines.

**Current Branch**: `dev`  
**Workflow**: Feature branches → PR to `dev` → Test → Merge to `main`

---

## 📞 Quick Commands Cheatsheet

```bash
# Docker
docker-compose up -d              # Start all services
docker-compose ps                 # Check service status
docker-compose logs -f gateway    # View gateway logs
docker-compose down               # Stop all services

# Database
npx prisma db push                # Sync schema to DB
npx prisma db seed                # Seed database
npx prisma studio                 # Open Prisma Studio GUI

# Development
nx serve core-gateway             # Start backend locally
nx serve student-portal           # Start frontend locally
nx build core-gateway             # Build backend
nx graph                          # View dependency graph

# Testing
nx test core-gateway              # Run backend tests
nx lint core-gateway              # Lint backend code

# Database Access (DBeaver/psql)
Host: localhost
Port: 5432
Database: takathon
User: postgres
Password: postgrespassword
```

---

**End of Summary** - See `DEVELOPMENT_ROADMAP.md` for detailed next steps.
