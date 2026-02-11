# TAkathon Copilot Instructions

## Architecture Overview

This is a **modular monolith** for hackathon team formation with:
- **Frontend**: Next.js app (React, TailwindCSS, Axios)
- **Backend**: FastAPI REST API (SQLAlchemy, PostgreSQL, Alembic, JWT)
- **Matching Engine**: Deterministic scoring algorithm (designed for future ML replacement)

Data flow: `Next.js → FastAPI → Service Layer → Matching Engine → PostgreSQL`

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
- `teams` - Generated teams
- `team_members` - Team assignments

### User Roles
- **Student**: Profile creation, skill setting, hackathon joining, team viewing
- **Organizer**: Hackathon creation, participant management, team generation/export

## Critical Patterns

### Matching Engine (V1 Algorithm)
Internal module at `backend/app/matching/` (NOT separate package yet). Current scoring criteria:
1. Skill coverage across team
2. Experience level balance
3. Team size constraints (enforced)
4. Distribution fairness

**Key principle**: Deterministic and replaceable - designed for future ML swap but kept internal until reuse justifies extraction. Avoid tight coupling to FastAPI routes.

### Authentication
JWT-based system. All API routes require role-based access control:
- Public routes: registration, login
- Student routes: profile, join hackathon, view own team
- Organizer routes: create hackathon, generate teams, view all participants

### API Design
RESTful conventions:
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/students/*` - Student operations
- `/api/v1/organizers/*` - Organizer operations
- `/api/v1/hackathons/*` - Event management
- `/api/v1/teams/*` - Team queries

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
- **Integration**: End-to-end team generation with sample participant data
- **Priority**: Auth flows, team generation, role-based access control

## Deployment

Target platforms: Render or DigitalOcean
- Docker-based deployment
- GitHub Actions for CI (linting, tests)
- Environment variables for secrets (DB URL, JWT secret)

## Future Considerations

The matching engine is V1 (rule-based) and lives in `backend/app/matching/`. Design interfaces to allow:
- Swapping in ML-based scoring (replace scoring.py)
- A/B testing different algorithms
- Performance metrics collection for comparison
- Extraction to separate package only when reused across multiple platforms
