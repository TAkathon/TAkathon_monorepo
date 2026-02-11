# TAkathon Copilot Instructions

## Architecture Overview

This is a **modular monolith** for hackathon team formation with:
- **Frontend**: Next.js app (React, TailwindCSS, Axios)
- **Backend**: FastAPI REST API (SQLAlchemy, PostgreSQL, Alembic, JWT)
- **Matching Engine**: AI-powered teammate recommendation system (designed for future ML replacement)

Data flow: `Next.js → FastAPI → Service Layer → Matching Engine → PostgreSQL`

**Core Concept**: Students create and manage their own teams. They can invite friends directly or use AI matchmaking to find compatible teammates for open spots.

## Project Structure

Monorepo WITHOUT npm workspaces (backend=Python, frontend=Node, no shared packages):
```
/backend
  /app
    /api          # Route handlers
    /models       # SQLAlchemy models
    /services     # Business logic
    /matching     # Team generation engine (internal module)
      engine.py
      scoring.py
      validators.py
  /alembic        # Database migrations
  /tests
  requirements.txt
/frontend
  /app            # Next.js 14 App Router
    layout.tsx
    page.tsx
    /dashboard
    /hackathons
  /components
  /lib            # Utilities, API client
  package.json
/docker-compose.yml
/README.md
```

## Core Domain Models

### Database Tables
- `users` - Student/organizer accounts
- `skills` - Skill taxonomy
- `user_skills` - Many-to-many with proficiency levels
- `hackathons` - Event metadata
- `hackathon_participants` - Registration data
- `teams` - Student-created teams (with creator/captain)
- `team_members` - Team membership and invitations
- `team_invitations` - Pending invites and join requests

### User Roles
- **Student**: Profile creation, skill setting, hackathon joining, team creation, inviting friends, requesting AI teammate matches
- **Organizer**: Hackathon creation, participant viewing, team overview, data export

## Critical Patterns

### Matching Engine (V1 Algorithm)
Internal module at `backend/app/matching/` (NOT separate package yet). Used for **AI teammate recommendations** when students need to fill open team spots.

Scoring criteria for candidate matches:
1. Skill complementarity (fill gaps in team's skill set)
2. Experience level balance
3. Availability overlap
4. Role fit (frontend/backend/design/PM)

**Key principle**: Deterministic and replaceable - designed for future ML swap but kept internal until reuse justifies extraction. Avoid tight coupling to FastAPI routes.

**Usage flow**: Student creates team → invites friends → requests AI suggestions for remaining spots → reviews matches → sends invites

### Authentication
JWT-based system. All API routes require role-based access control:
- Public routes: registration, login
- Student routes: profile, join hackathon, create team, invite members, request AI matches, manage team
- Organizer routes: create hackathon, view participants, view all teams, export data

### API Design
RESTful conventions:
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/students/*` - Student profile operations
- `/api/v1/organizers/*` - Organizer operations
- `/api/v1/hackathons/*` - Event management
- `/api/v1/teams/*` - Team creation, invitations, management
- `/api/v1/matching/*` - AI teammate recommendations

## Development Workflows

### Backend (FastAPI)
- **ORM**: Use SQLAlchemy declarative models
- **Migrations**: Alembic for schema changes
- **Validation**: Pydantic models for request/response
- **Database**: PostgreSQL (avoid SQLite except local dev)

### Frontend (Next.js 14+ App Router)
- **Routing**: App Router (`app/` directory) - use layouts, server components, modern routing
- **Styling**: TailwindCSS (utility-first approach)
- **API calls**: Axios with centralized configuration in `lib/`
- **State**: Zustand for auth state, user profile, current hackathon - fetch everything else from API (avoid over-caching)

### Docker
Use Docker Compose for local development with:
- Backend service (FastAPI)
- Frontend service (Next.js dev server)
- PostgreSQL container
- Volume mounts for hot-reload

## Key Conventions

1. **Monorepo coordination**: Keep frontend/backend separate (no workspaces) - sync API contracts manually
2. **Service boundaries**: `backend/app/matching/` has clear input/output schemas (JSON)
3. **Database migrations**: Always generate Alembic migrations for schema changes
4. **JWT handling**: Store in httpOnly cookies (frontend) and validate on every protected route (backend)
5. **Error responses**: Standardize API error format (status code, message, details)
6. **State management**: Use Zustand minimally - fetch from API, don't over-cache

## Testing Strategy

Strategic coverage (not 90% blanket coverage):
- **Backend**: pytest for API endpoints and matching algorithm logic
- **Frontend**: Jest/React Testing Library for critical user flows
- **Integration**: End-to-end team creation and AI matching with sample participant data
- **Priority**: Auth flows, team creation/invitations, AI matching recommendations, role-based access control

## Deployment

Target platforms: Render or DigitalOcean
- Docker-based deployment
- GitHub Actions for CI (linting, tests)
- Environment variables for secrets (DB URL, JWT secret)

## Future Considerations

The matching engine is V1 (rule-based) and lives in `backend/app/matching/`. Design interfaces to allow:
- Swapping in ML-based scoring (replace scoring.py) for better teammate recommendations
- A/B testing different matching algorithms
- Performance metrics collection (match acceptance rate, team success)
- Extraction to separate package only when reused across multiple platforms

**Important**: Matching is opt-in and student-driven, not mandatory bulk team generation by organizers
