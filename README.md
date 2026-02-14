# TAkathon

> Hackathon Team Builder - AI-powered platform for forming balanced hackathon teams

TAkathon helps students create teams, invite friends, and find compatible teammates using AI matching. Organizers can create hackathons and manage participants efficiently.

---

## 🚀 Quick Start (Docker)

The easiest way to run the entire stack (Frontend, Backend, Database, AI Engine) is using Docker.

### Prerequisites
- Docker & Docker Compose installed

### Run the App
```bash
docker compose up --build
```

This will start:
- **Core Gateway API**: http://localhost:8000
- **AI Engine**: http://localhost:8001
- **Landing Page**: http://localhost:3000
- **Student Portal**: http://localhost:3001
- **Organizer Dashboard**: http://localhost:3002
- **Sponsor Panel**: http://localhost:3003
- **PostgreSQL Database**: localhost:5432 (internal)

---

## 🛠 Local Development

### Prerequisites
- Node.js v18+
- Python 3.11+
- PostgreSQL 14+
- Nx CLI (`npm install -g nx`)

### 1. Database Setup
Ensure PostgreSQL is running locally.

```bash
# Update .env in apps/core-gateway with your credentials
DATABASE_URL="postgresql://user:password@localhost:5432/takathon?schema=public"

# Run migrations & seed data
npx prisma migrate dev
npx prisma db seed
```

### 2. Start Services (Nx)

```bash
# Start Core Gateway (Express + Prisma)
npx nx dev core-gateway

# Start AI Engine (FastAPI)
# (Navigate to apps/ai-engine and run with uvicorn)

# Start Frontends
npx nx dev landing-page
npx nx dev student-portal
npx nx dev organizer-dashboard
npx nx dev sponsor-panel
```

---

## 🏗 Architecture

The system follows a modular monolith architecture with clear separation of concerns.

**Flow**: Next.js Apps → Core Gateway (Express) → Postgres DB & AI Engine

- **Core Gateway**: Central API for auth, users, teams, and hackathons.
- **AI Engine**: Python service for skill matching and team recommendations.
- **Shared Libs**: UI components, types, and API clients shared across apps.

---

## 📝 License

See LICENSE file for details.
