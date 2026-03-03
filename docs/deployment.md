# TAkathon — Deployment Guide

**Last Updated**: March 3, 2026
**Target Platforms**: Render (recommended) or DigitalOcean

---

## Pre-Deployment Checklist

- [ ] All environment variables configured (see `docs/ENVIRONMENT_VARIABLES.md`)
- [ ] Database migrations committed (not `db:push`)
- [ ] `NODE_ENV=production` set for core-gateway
- [ ] `CORS_ORIGINS` set to production domain(s) — no dev fallback in production
- [ ] JWT secrets are strong, unique, and stored in platform secret manager
- [ ] Docker images build successfully locally with `docker compose build`

---

## Architecture for Production

```
Internet → Reverse Proxy (Nginx / Render routing)
              ↓
    ┌─────────────────────────────┐
    │       Docker Services        │
    │                             │
    │  landing-page  :3000        │
    │  student-portal :3001       │
    │  organizer-dashboard :3002  │
    │  sponsor-panel :3003        │
    │  core-gateway  :8000        │
    │  ai-engine     :8001        │
    └────────────┬────────────────┘
                 ↓
         PostgreSQL (managed)
```

For lowest cost, deploy all services on a single Render account using individual Web Services.

---

## Option A — Render (Recommended)

### 1. Database

Create a **Render PostgreSQL** database:
1. Go to Render Dashboard → New → PostgreSQL
2. Note the **Internal Connection String** (use this for `DATABASE_URL` in other Render services)
3. Note the **External Connection String** (use for local dev against production DB if needed)

### 2. Core Gateway

1. New → Web Service → Connect to your GitHub repo
2. **Root Directory**: `apps/core-gateway`
3. **Build Command**:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npx esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js
   ```
4. **Start Command**: `node dist/index.js`
5. **Environment Variables**:
   ```
   DATABASE_URL=<Render internal connection string>
   JWT_ACCESS_SECRET=<strong random string, min 32 chars>
   JWT_REFRESH_SECRET=<different strong random string, min 32 chars>
   NODE_ENV=production
   PORT=8000
   AI_ENGINE_URL=<Render internal URL of ai-engine service>
   CORS_ORIGINS=https://yourdomain.com,https://student.yourdomain.com,...
   ```

> ⚠️ The startup guard in `src/index.ts` will exit if `DATABASE_URL`, `JWT_ACCESS_SECRET`, or `JWT_REFRESH_SECRET` are missing in production.

### 3. AI Engine

1. New → Web Service → same repo
2. **Root Directory**: `apps/ai-engine`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8001`
5. **Runtime**: Python 3
6. **Environment Variables**: `PORT=8001`

### 4. Frontend Apps

Repeat for each Next.js app (`landing-page`, `student-portal`, `organizer-dashboard`, `sponsor-panel`):

1. New → Web Service → same repo
2. **Root Directory**: `apps/<app-name>`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `node .next/standalone/server.js` (standalone output)
5. **Environment Variables**:
   ```
   NEXT_PUBLIC_GATEWAY_URL=https://<your-gateway-render-url>
   NODE_ENV=production
   PORT=<3000|3001|3002|3003>
   ```

---

## Option B — DigitalOcean App Platform

Similar to Render — use **App Platform** multi-service deployment:

1. Create a new App → connect GitHub repo
2. Add components for each service (same build/start commands as Render)
3. Add a managed PostgreSQL database
4. Wire `DATABASE_URL` as a secret env var to core-gateway
5. Use internal service URLs for `AI_ENGINE_URL` and `NEXT_PUBLIC_GATEWAY_URL`

DigitalOcean managed databases provide automatic backups and connection pooling (PgBouncer) — recommended over self-managed Postgres.

---

## Option C — VPS with Docker Compose

For a single-VPS deployment (e.g. DigitalOcean Droplet):

### Setup

```bash
# Install Docker + Compose
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin

# Clone repo
git clone <repo-url> /opt/takathon
cd /opt/takathon

# Copy and configure .env
cp .env.example .env
nano .env  # set all production values

# Build and start
docker compose build --no-cache
docker compose up -d

# Run migrations (first time)
docker compose exec core-gateway npx prisma migrate deploy
```

### Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cookie_flags accessToken SameSite=None Secure;
        proxy_cookie_flags refreshToken SameSite=None Secure;
    }
}

server {
    listen 443 ssl;
    server_name student.yourdomain.com;
    location / { proxy_pass http://localhost:3001; }
}
# Repeat for each app...
```

> Use `certbot --nginx` for automatic Let's Encrypt TLS certificates.

---

## Database Migrations (Production)

**Never use `db:push` in production** — it may cause data loss.

```bash
# Generate migration from schema changes
npx prisma migrate dev --name describe_your_change

# Apply committed migrations to production DB
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

Commit migration files (`prisma/migrations/`) to git so `migrate deploy` can run on the production server.

---

## Environment Variables Summary

See `docs/ENVIRONMENT_VARIABLES.md` for the full reference.

### Minimum required in production:

| Variable           | Service        | Notes                          |
|--------------------|----------------|--------------------------------|
| `DATABASE_URL`     | core-gateway   | Startup guard — required       |
| `JWT_ACCESS_SECRET`| core-gateway   | Startup guard — required       |
| `JWT_REFRESH_SECRET`| core-gateway  | Startup guard — required       |
| `CORS_ORIGINS`     | core-gateway   | No dev fallback in production  |
| `NEXT_PUBLIC_GATEWAY_URL` | All apps | API base URL                |

---

## Health Checks

After deployment, verify:

```bash
curl https://api.yourdomain.com/api/v1/health
# → { "status": "ok" }

curl https://api-ai.yourdomain.com/api/v1/health
# → { "status": "ok" }
```

---

## Rollback Procedure

```bash
# On Render: click "Rollback" on the Deploy page of each service

# On VPS:
git checkout <last-good-commit>
docker compose build --no-cache
docker compose up -d

# If DB migration needs rollback (only for last migration):
npx prisma migrate diff --shadow-database-url $DATABASE_URL --script > rollback.sql
psql $DATABASE_URL < rollback.sql
```

---

## Monitoring

Recommended for production:

- **Logs**: Render/DigitalOcean built-in log streaming, or Papertrail / Logtail
- **Uptime**: UptimeRobot pinging `/api/v1/health` (free tier is sufficient)
- **DB**: Render PostgreSQL metrics dashboard or pg_stat_activity queries
- **Errors**: Sentry (add `@sentry/node` to core-gateway and `@sentry/nextjs` to apps)

---

*See `docs/ENVIRONMENT_VARIABLES.md` for all env var definitions and `docs/docker-setup.md` for local development setup.*
