# TAkathon Architecture Documentation

## Overview

TAkathon is a **modular monolith** Nx monorepo designed for scalable hackathon team formation with AI-powered matching capabilities.

## Architecture Principles

- **Modular Monolith**: Clear separation of concerns with potential for future service extraction
- **Student-Driven Team Building**: Students create teams, invite friends, and request AI suggestions for open spots
- **Nx Workspace**: Leverages Nx for build optimization, dependency management, and scalability
- **Type-Safe**: Full TypeScript coverage with shared type definitions

## System Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Apps                          │
│  (student-portal, organizer-dashboard, sponsor-panel)   │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST
┌────────────────┴────────────────────────────────────────┐
│              Core Gateway (Node.js/NestJS)              │
│        Auth │ DB Access │ Chat │ API Routing            │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───┴─────────────┐  ┌───────┴──────────┐
│  AI Engine      │  │   PostgreSQL     │
│  (FastAPI)      │  │    Database      │
│  Matching       │  │                  │
│  Coaching       │  │                  │
└─────────────────┘  └──────────────────┘
```

## Apps Structure

### 1. **student-portal** (Next.js)
Frontend for hackathon participants.

**Key Features:**
- User registration and profile management
- Hackathon browsing and registration
- Team creation and friend invitations
- AI teammate match requests and reviews
- Team management dashboard

### 2. **organizer-dashboard** (Next.js)
Frontend for hackathon organizers.

**Key Features:**
- Hackathon creation and management
- Participant overview
- Team distribution analytics
- Data export capabilities

### 3. **sponsor-panel** (Next.js)
Frontend for corporate scouts and sponsors.

**Key Features:**
- Hackathon browsing
- Team project viewing
- Talent discovery

### 4. **core-gateway** (Node.js/NestJS)
Central backend service handling authentication, database operations, and business logic.

**Responsibilities:**
- **Auth**: JWT-based authentication and authorization
- **Database**: SQLAlchemy ORM with PostgreSQL
- **API**: RESTful endpoints for all client operations
- **Chat**: Real-time team communication (future)

### 5. **ai-engine** (FastAPI/Python)
Python service for AI-powered matching and coaching.

**Responsibilities:**
- **Matching Engine**: Teammate recommendation algorithm
- **Scoring**: Skill complementarity, experience balance
- **Validation**: Team composition validation
- **Coaching** (future): LLM-powered hackathon assistance

## Shared Libraries

### libs/shared/ui
Reusable React/Tailwind components shared across all frontends.

**Components:**
- buttons, inputs, cards
- modals, dropdowns
- layouts, navigation

### libs/shared/types
TypeScript type definitions shared between frontend and backend.

**Includes:**
- Domain models (User, Hackathon, Team)
- API request/response types
- Enums and constants

### libs/shared/utils
Common utility functions.

**Includes:**
- Validators (email, URL, password)
- Formatters (date, percentage)
- Constants (app config, limits)

### libs/python/ai-logic
Shared Python utilities for AI services.

**Includes:**
- Embedding utilities
- Prompt templates
- ML preprocessing helpers

## Data Flow

### Team Formation Flow (Student-Driven)

```
1. Student creates team
   → POST /api/v1/teams
   → core-gateway creates team record
   → Student is captain

2. Student invites friends
   → POST /api/v1/teams/{id}/invite
   → core-gateway creates invitations
   → Invitees receive notifications

3. Student requests AI matches for open spots
   → POST /api/v1/matching/suggest
   → core-gateway → ai-engine
   → AI engine scores candidates based on:
     - Skill gaps in current team
     - Experience level balance
     - Availability overlap
   → Returns ranked suggestions

4. Student reviews matches and sends invites
   → POST /api/v1/teams/{id}/invite (to AI suggestions)

5. Invitees accept/reject
   → PATCH /api/v1/invitations/{id}
   → Team membership updated
```

## Matching Engine (V1 Algorithm)

**Located**: `apps/ai-engine/app/matching/`

**Design Principle**: Deterministic and replaceable (designed for future ML swap)

### Scoring Criteria

1. **Skill Complementarity** (40%)
   - Fill gaps in team's skill set
   - Avoid redundancy
   - Balance frontend/backend/design/PM

2. **Experience Level Balance** (30%)
   - Mix of skill proficiencies
   - Avoid all-beginners or all-experts

3. **Availability Overlap** (30%)
   - Time zone compatibility
   - Commitment level match

### Candidate Scoring

```python
def score_candidate(team, candidate):
    skill_score = calculate_skill_fit(team.skills, candidate.skills)
    experience_score = calculate_experience_balance(team, candidate)
    availability_score = calculate_availability_overlap(team, candidate)
    
    total = (
        skill_score * 0.4 +
        experience_score * 0.3 +
        availability_score * 0.3
    )
    
    return total, generate_reasons(skill_score, experience_score)
```

## Database Schema

See `database/schema.sql` for complete PostgreSQL schema.

### Core Tables

- **users**: Student and organizer accounts
- **skills**: Skill taxonomy
- **user_skills**: Many-to-many with proficiency levels
- **hackathons**: Event metadata
- **hackathon_participants**: Registration data
- **teams**: Student-created teams
- **team_members**: Team membership
- **team_invitations**: Pending invites and requests

### Key Relationships

```
users (1) ─── (∞) hackathon_participants ─── (1) hackathons
                        │
                        │ (∞)
                        │
teams (1) ─── (∞) team_members ─── (1) users
  │
  └─── (∞) team_invitations
```

## Authentication & Authorization

### JWT-Based Auth

- **Access Token**: 7 days expiry
- **Refresh Token**: 30 days expiry
- **Storage**: httpOnly cookies (frontend)

### Role-Based Access Control (RBAC)

**Student Routes:**
- `POST /api/v1/students/profile`
- `POST /api/v1/teams`
- `POST /api/v1/teams/{id}/invite`
- `GET /api/v1/matching/suggest`

**Organizer Routes:**
- `POST /api/v1/hackathons`
- `GET /api/v1/hackathons/{id}/participants`
- `GET /api/v1/hackathons/{id}/teams`

## API Conventions

### RESTful Endpoints

```
/api/v1/auth/*           - Authentication
/api/v1/students/*       - Student operations
/api/v1/organizers/*     - Organizer operations
/api/v1/hackathons/*     - Hackathon management
/api/v1/teams/*          - Team CRUD and invitations
/api/v1/matching/*       - AI teammate suggestions
/api/v1/skills/*         - Skill taxonomy
```

### Response Format

```typescript
{
  "success": boolean,
  "data": T,
  "error": {
    "code": string,
    "message": string,
    "details": object
  },
  "meta": {
    "page": number,
    "total": number
  }
}
```

## Development Workflow

### Nx Commands

```bash
# Build specific app
nx build student-portal

# Run app in dev mode
nx serve student-portal

# Run tests
nx test ai-engine

# Lint
nx lint shared-types

# Dependency graph
nx graph

# Affected apps (for CI)
nx affected:build
```

### Local Development

```bash
# Start all services
docker-compose up

# Core gateway
cd apps/core-gateway && npm run dev

# AI engine
cd apps/ai-engine && uvicorn app.main:app --reload

# Frontend
cd apps/student-portal && npm run dev
```

## Deployment Strategy

### Containerization

Each app has its own Dockerfile:
- `apps/student-portal/Dockerfile`
- `apps/core-gateway/Dockerfile`
- `apps/ai-engine/Dockerfile`

### Target Platforms

- **Render** or **DigitalOcean** for production
- **Vercel** for Next.js frontends (optional)

### CI/CD Pipeline

GitHub Actions:
1. Lint and test on PR
2. Build Docker images on merge to main
3. Deploy to staging/production

## Future Considerations

### Microservices Extraction

The matching engine is designed for extraction:
- Clear input/output interfaces (JSON)
- No tight coupling to core-gateway
- Separate when: multiple platforms need matching

### ML Replacement

V1 is rule-based. Future ML improvements:
- Replace `scoring.py` with ML model
- A/B test different algorithms
- Collect metrics: match acceptance rate, team success

### Scalability

- Horizontal scaling of core-gateway
- Separate database reads/writes
- Caching layer (Redis) for API responses
- CDN for static assets

## Security Considerations

- Input validation on all endpoints
- SQL injection prevention (ORM usage)
- Rate limiting on auth endpoints
- CORS configuration for frontend domains
- Secrets management (environment variables)

## Monitoring & Observability

- Structured logging (JSON format)
- Error tracking (Sentry)
- Performance metrics (API latency)
- User analytics (team formation success rate)

---

**Last Updated**: February 11, 2026  
**Version**: 1.0.0
