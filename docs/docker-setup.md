# Docker Setup and Runtime Guide

This document explains how the Docker-based stack works, how to start it, and how to access each service.

## Overview

The stack is orchestrated by [docker-compose.yml](file:///c:/Users/talel/TAkathon_monorepo/docker-compose.yml). It brings up 8 services:

- PostgreSQL database
- Core Gateway API (NestJS)
- AI Engine (FastAPI)
- 4 Next.js frontends (Landing, Student, Organizer, Sponsor)

All services share a Docker network called `takathon-net`.

## Services and Ports

- Core Gateway API: http://localhost:8000
- AI Engine: http://localhost:8001
- Landing Page: http://localhost:3000
- Student Portal: http://localhost:3001
- Organizer Dashboard: http://localhost:3002
- Sponsor Panel: http://localhost:3003
- PostgreSQL: localhost:5432 (container name: `takathon-db`)

## How the Docker Build Works

Each service has its own Dockerfile:

- [apps/core-gateway/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/core-gateway/Dockerfile)
- [apps/ai-engine/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/ai-engine/Dockerfile)
- [apps/landing-page/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/landing-page/Dockerfile)
- [apps/student-portal/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/student-portal/Dockerfile)
- [apps/organizer-dashboard/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/organizer-dashboard/Dockerfile)
- [apps/sponsor-panel/Dockerfile](file:///c:/Users/talel/TAkathon_monorepo/apps/sponsor-panel/Dockerfile)

Next.js apps use a multi-stage build:
1) Builder stage compiles the app with Nx
2) Runner stage serves the standalone Next.js output

The AI engine uses a Python image and runs FastAPI with Uvicorn.

## Start the Full Stack (Docker)

From the repo root:

```powershell
docker compose up -d --build
```

To stop everything:

```powershell
docker compose down
```

To rebuild just one service:

```powershell
docker compose up -d --build sponsor-panel
```

To view logs:

```powershell
docker compose logs -f sponsor-panel
```

## Health Checks

PostgreSQL has a health check that ensures it is ready before the API starts.

You can also check:

- Core Gateway health (example): http://localhost:8000
- AI Engine health: http://localhost:8001/health

## Environment Variables

These are injected by Docker Compose:

- Core Gateway:
  - DATABASE_URL
  - PORT
  - JWT secrets
  - CORS origins

- Frontends:
  - NEXT_PUBLIC_API_URL (points to the Core Gateway)

If you change them, update [docker-compose.yml](file:///c:/Users/talel/TAkathon_monorepo/docker-compose.yml).

## Start Individual Apps Without Docker (Dev Mode)

You can run apps via Nx locally:

```powershell
npx nx serve landing-page
npx nx serve student-portal
npx nx serve organizer-dashboard
npx nx serve sponsor-panel
npx nx serve core-gateway
```

AI Engine locally:

```powershell
cd apps\ai-engine
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Preview All Apps

Once Docker is running:

- Landing Page → http://localhost:3000
- Student Portal → http://localhost:3001
- Organizer Dashboard → http://localhost:3002
- Sponsor Panel → http://localhost:3003
- Core Gateway API → http://localhost:8000
- AI Engine → http://localhost:8001