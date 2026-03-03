# TAkathon — Environment Variables Reference

**Last Updated**: March 3, 2026

This file documents every environment variable used across all services. Copy `.env.example` to `.env` at the repo root to get started.

---

## How to Configure

All variables live in a single `.env` file at the repo root. Docker Compose loads this via `env_file: .env` in `docker-compose.yml`. Next.js apps in Docker receive variables via Docker Compose environment injection.

For local development (outside Docker), each app reads `.env` from its app directory, or the root `.env` via Nx env file resolution.

---

## Core Gateway Variables

| Variable            | Required | Default (dev)          | Description                                                |
|---------------------|----------|------------------------|------------------------------------------------------------|
| `DATABASE_URL`      | ✅ Always | —                      | PostgreSQL connection string. **Startup guard exits if missing in production.** |
| `JWT_ACCESS_SECRET` | ✅ Always | —                      | Secret for signing access tokens (min 32 chars in production). **Startup guard.** |
| `JWT_REFRESH_SECRET`| ✅ Always | —                      | Secret for signing refresh tokens (min 32 chars, must differ from access). **Startup guard.** |
| `PORT`              | No       | `8000`                 | Port the Express server listens on.                        |
| `NODE_ENV`          | No       | `development`          | Set to `production` to enable startup guard and disable dev fallbacks. |
| `ACCESS_TTL`        | No       | `900`                  | Access token lifetime in seconds (default: 15 min).        |
| `REFRESH_TTL`       | No       | `604800`               | Refresh token lifetime in seconds (default: 7 days).       |
| `CORS_ORIGINS`      | Prod only| `localhost:3000-3003`  | Comma-separated list of allowed CORS origins. In dev, defaults to all localhost portals. **Must be set explicitly in production.** |
| `AI_ENGINE_URL`     | No       | `http://localhost:8001`| Internal URL of the AI engine. In Docker: `http://ai-engine:8001`. |

### Example (development)

```env
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/takathon?schema=public
JWT_ACCESS_SECRET=dev-access-secret-change-in-production-min32chars
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-min32chars
PORT=8000
NODE_ENV=development
ACCESS_TTL=900
REFRESH_TTL=604800
AI_ENGINE_URL=http://localhost:8001
# CORS_ORIGINS not needed in dev — defaults to localhost:3000-3003
```

### Example (Docker Compose — set in docker-compose.yml or .env)

```env
DATABASE_URL=postgresql://postgres:postgrespassword@postgres:5432/takathon?schema=public
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
AI_ENGINE_URL=http://ai-engine:8001
```

> Note: In Docker, `@localhost` becomes `@postgres` (the container service name).

---

## Frontend App Variables (All Next.js Apps)

| Variable                  | Required | Description                                                    |
|---------------------------|----------|----------------------------------------------------------------|
| `NEXT_PUBLIC_GATEWAY_URL` | ✅       | Full URL of the Core Gateway API. Used in Axios client baseURL. Prefixed with `NEXT_PUBLIC_` to be available in browser bundles. |

### Values by Environment

| Environment | Value                          |
|-------------|--------------------------------|
| Development | `http://localhost:8000`        |
| Docker      | `http://localhost:8000` (browser calls go through Docker port mapping) |
| Production  | `https://api.yourdomain.com`   |

### Per-App Port (Docker / production only)

```env
# landing-page
PORT=3000

# student-portal
PORT=3001

# organizer-dashboard
PORT=3002

# sponsor-panel
PORT=3003
```

---

## AI Engine Variables

| Variable | Required | Default | Description                |
|----------|----------|---------|----------------------------|
| `PORT`   | No       | `8001`  | Port uvicorn listens on.   |

The AI engine is stateless — it requires no database connection or JWT secrets.

---

## PostgreSQL Container Variables

Set in `docker-compose.yml` for the `postgres` service:

| Variable              | Value                  |
|-----------------------|------------------------|
| `POSTGRES_DB`         | `takathon`             |
| `POSTGRES_USER`       | `postgres`             |
| `POSTGRES_PASSWORD`   | `postgrespassword`     |

> In production, use a managed database (Render PostgreSQL, DigitalOcean Managed PostgreSQL). Do not expose port 5432 publicly.

---

## Production ENV Checklist

These MUST be set before deploying to production:

```
[ ] DATABASE_URL          → managed DB internal connection string (with ?sslmode=require)
[ ] JWT_ACCESS_SECRET     → strong random string, min 32 chars
[ ] JWT_REFRESH_SECRET    → different strong random string, min 32 chars
[ ] NODE_ENV=production   → activates startup guard
[ ] CORS_ORIGINS          → your actual production domain(s)
[ ] AI_ENGINE_URL         → internal URL of AI engine in your platform
[ ] NEXT_PUBLIC_GATEWAY_URL → https://api.yourdomain.com (for all frontend apps)
```

### Generating Secure Secrets

```bash
# Linux / macOS
openssl rand -base64 48

# Windows PowerShell
[System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48) | ForEach-Object { [System.Convert]::ToBase64String($_) }

# Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Use a different secret for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

---

## Startup Guard Behaviour

The core-gateway `src/index.ts` includes this check:

```typescript
if (process.env.NODE_ENV === "production") {
  const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`FATAL: Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }
}
```

If any required variable is missing in production, the server exits immediately instead of running in a broken state.

---

## Security Notes

1. Never commit `.env` files to git. The `.gitignore` excludes `.env` and all `*.env.local`.
2. Use your deployment platform's secret manager (Render Environment Variables, DigitalOcean App Variables) rather than `.env` files on servers.
3. JWT secrets should be at least 32 random bytes (256 bits) — longer is better.
4. `NEXT_PUBLIC_*` variables are embedded in the browser bundle — never put secrets in `NEXT_PUBLIC_*` variables.
5. `DATABASE_URL` with SSL in production: append `?sslmode=require` to the connection string.

---

## Quick Dev Setup

```powershell
# Copy example
Copy-Item .env.example .env

# Minimum for local dev (edit .env with these values):
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/takathon?schema=public
JWT_ACCESS_SECRET=dev-only-secret-please-change
JWT_REFRESH_SECRET=dev-only-refresh-secret-please-change
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
```

Then:

```powershell
docker compose up -d
npm run db:generate
npm run db:seed
```

See `docs/docker-setup.md` for the full local setup guide.
