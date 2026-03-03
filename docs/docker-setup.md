# TAkathon — Docker Setup Guide

**Last Updated**: March 3, 2026

---

## Prerequisites

- Docker Desktop 4.x+ (running)
- Docker Compose v2
- Node.js 22+ (only needed for local development outside Docker)

---

## Quick Start

```powershell
# 1. Clone and navigate to the repo
git clone <repo-url>
cd TAkathon_monorepo

# 2. Copy environment file
Copy-Item .env.example .env

# 3. Start all services
docker compose up -d

# 4. Seed the database (first time only)
docker compose exec core-gateway npx ts-node prisma/seed.ts
# OR use npm script if running outside Docker:
npm run db:seed

# 5. Open apps
Start-Process "http://localhost:3000"  # Landing page
Start-Process "http://localhost:3001"  # Student portal
Start-Process "http://localhost:3002"  # Organizer dashboard
Start-Process "http://localhost:3003"  # Sponsor panel
```

---

## Services

The platform runs 7 Docker services defined in `docker-compose.yml`:

| Service Name          | Container           | Port | Description              |
|-----------------------|---------------------|------|--------------------------|
| `postgres`            | `takathon-db`       | 5432 | PostgreSQL 16 database   |
| `core-gateway`        | `takathon-gateway`  | 8000 | Express API gateway      |
| `ai-engine`           | `takathon-ai`       | 8001 | FastAPI matching engine  |
| `landing-page`        | `takathon-landing`  | 3000 | Public site + login      |
| `student-portal`      | `takathon-student`  | 3001 | Student dashboard        |
| `organizer-dashboard` | `takathon-organizer`| 3002 | Organizer dashboard      |
| `sponsor-panel`       | `takathon-sponsor`  | 3003 | Sponsor dashboard        |

> **AI Engine**: Starts by default. No `--profile ai` flag needed or supported.

### Service Start Order

Docker Compose `depends_on` + healthchecks enforce this order:

```
postgres (healthy) → core-gateway + ai-engine → frontend apps
```

---

## Common Commands

### Start / Stop

```powershell
# Start all services in background
docker compose up -d

# Start specific service
docker compose up -d core-gateway

# Stop all services (preserves volumes)
docker compose down

# Stop and remove volumes (wipes database!)
docker compose down -v
```

### Logs

```powershell
# Stream all logs
docker compose logs -f

# Logs for one service
docker compose logs -f core-gateway

# Last 50 lines
docker compose logs --tail 50 ai-engine
```

### Status

```powershell
# Check all container states
docker compose ps

# Detailed container inspect
docker inspect takathon-gateway
```

---

## ⚠️ Rebuilding After Source Changes

Docker caches build layers. If you commit a fix and the container still shows old behavior, the image is using a cached layer.

**Always use `--no-cache` when source files change**:

```powershell
# Rebuild one service (safe, targeted)
docker compose build --no-cache core-gateway
docker compose up -d core-gateway

# Rebuild multiple services
docker compose build --no-cache student-portal core-gateway
docker compose up -d student-portal core-gateway

# Rebuild all (slow, use when uncertain)
docker compose build --no-cache
docker compose up -d
```

**Symptoms of stale cache**:
- Bug you just fixed is still visible in the browser
- Log lines show old code paths
- TypeScript changes not reflected at runtime

---

## Database Management

### First-Time Setup

```powershell
# Generate Prisma Client (required after schema changes)
npm run db:generate

# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### Ongoing Operations

```powershell
# Open Prisma Studio GUI (visual DB browser)
npm run db:studio

# Open raw psql shell
docker compose exec postgres psql -U postgres -d takathon

# Reset database entirely (destroys all data)
npm run db:reset
```

### Prisma Commands Inside Container

```powershell
# Run migrations (production style)
docker compose exec core-gateway npx prisma migrate deploy

# Push schema (dev only — no migration files created)
docker compose exec core-gateway npx prisma db push
```

---

## Environment Variables

Each service reads from the `.env` file at the repo root (via `env_file: .env` in `docker-compose.yml`).

### Required Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/takathon?schema=public

# JWT (required in production — startup guard exits if missing)
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Token Lifetimes (optional — defaults used if absent)
ACCESS_TTL=900          # 15 minutes in seconds
REFRESH_TTL=604800      # 7 days in seconds

# CORS (optional in dev — defaults to localhost:3000-3003)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003

# AI Engine URL (injected into core-gateway)
AI_ENGINE_URL=http://ai-engine:8001
```

### Frontend Variables

```env
# Each Next.js app needs this to know where the API is
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
```

See `docs/ENVIRONMENT_VARIABLES.md` for the full reference.

---

## Dockerfile Architecture

### Core Gateway (`apps/core-gateway/Dockerfile`)

Multi-stage build:
1. **Build stage**: esbuild bundles `src/index.ts` → `dist/index.js`
2. **Runtime stage**: `node:22-alpine` + only `dist/` + production `node_modules`

### Next.js Apps (`apps/*/Dockerfile`)

Multi-stage build:
1. **Build stage**: `next build` with `output: "standalone"`
2. **Runtime stage**: minimal alpine image with standalone output

### AI Engine (`apps/ai-engine/Dockerfile`)

Single stage: `python:3.11-slim` + `requirements.txt` + uvicorn server

---

## Troubleshooting

### Container won't start

```powershell
# Check if port is already in use
netstat -an | findstr "8000\|5432\|3001"

# Check health status
docker compose ps
docker inspect takathon-db --format="{{.State.Health.Status}}"

# Full error details
docker compose logs --tail 100 core-gateway
```

### Database connection refused

```powershell
# Check postgres is healthy before gateway starts
docker compose ps postgres
# Should show: "healthy"

# Trigger restart order manually
docker compose restart core-gateway
```

### "Cannot find module" errors in gateway

```powershell
# Prisma client not generated
docker compose exec core-gateway npx prisma generate
docker compose restart core-gateway
```

### Next.js shows 500 / blank page

```powershell
# Check NEXT_PUBLIC_GATEWAY_URL is set in .env
# Check core-gateway is running and healthy
docker compose ps
curl http://localhost:8000/api/v1/health
```

### AI Engine unreachable (gateway falls back to basicScoring)

```powershell
docker compose logs ai-engine
curl http://localhost:8001/api/v1/health
# If unhealthy, rebuild:
docker compose build --no-cache ai-engine
docker compose up -d ai-engine
```

### Docker Desktop not finding `node:22-alpine`

- Check Docker Desktop is running with internet access
- Try: `docker pull node:22-alpine` manually
- Check proxy/DNS settings in Docker Desktop preferences

---

## Production Deployment

See `docs/deployment.md` for the complete production deployment guide.

Key differences from dev:
- Use `docker compose -f docker-compose.prod.yml` (to be created)
- Set `NODE_ENV=production` — startup guard enforces required env vars
- Use `npx prisma migrate deploy` (not `db:push`)
- TLS termination via reverse proxy (Nginx / Render)
- `DATABASE_URL` with SSL + connection pooler (PgBouncer recommended)
- Set `CORS_ORIGINS` explicitly (no dev fallback in production)
