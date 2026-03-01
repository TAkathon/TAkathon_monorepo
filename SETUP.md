# TAkathon Development Setup

## Project Structure Created ✅

```
TAkathon_monorepo/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── api/                 # Route handlers
│   │   ├── models/              # SQLAlchemy models
│   │   ├── services/            # Business logic
│   │   └── matching/            # AI teammate matching engine
│   │       ├── engine.py
│   │       ├── scoring.py
│   │       └── validators.py
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # Backend tests
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── lib/
│   │   ├── api.ts               # Axios API client
│   │   ├── store.ts             # Zustand state management
│   │   └── utils.ts             # Utility functions
│   ├── package.json
│   ├── tailwind.config.js       # TailwindCSS config with design tokens
│   ├── tsconfig.json
│   ├── Dockerfile.dev
│   └── .env.local               # Frontend environment variables
│
├── docker-compose.yml           # Full stack orchestration
├── .gitignore
└── README.md
```

## Quick Start

### Option 1: Docker (Recommended)

Start the complete stack (PostgreSQL + Gateway + Frontends):

```bash
docker-compose up
```

- Landing page: http://localhost:3000
- Student portal: http://localhost:3001
- Organizer dashboard: http://localhost:3002
- Sponsor panel: http://localhost:3003
- Gateway API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Postgres: localhost:5432

### Option 2: Local Development

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Make sure PostgreSQL is running, then run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

Backend will run on http://localhost:8000

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Dependencies are already installed! ✅

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## What's Already Configured

### Backend ✅
- FastAPI application structure
- CORS middleware configured
- Basic health check endpoint
- Matching engine skeleton with scoring/validation modules
- Alembic for database migrations
- pytest for testing
- Environment variables configured

### Frontend ✅
- Next.js 14 with App Router
- TailwindCSS with custom design tokens:
  - Primary color: Indigo (#4F46E5)
  - Success: Emerald (#10B981)
  - Custom spacing system
- Axios API client with interceptors
- Zustand state management for auth
- Base UI components (Button, Card, Input)
- TypeScript configured
- Landing page with hero section

### Docker ✅
- PostgreSQL 16 container
- Backend container with hot-reload
- Frontend container with hot-reload
- Health checks configured
- Volume mounts for development

## Next Steps

### 1. Database Setup

Create your database models in `backend/app/models/`:
- User model
- Skill model
- Team model
- Hackathon model

Then generate migration:
```bash
cd backend
alembic revision --autogenerate -m "Initial tables"
alembic upgrade head
```

### 2. API Endpoints

Create route handlers in `backend/app/api/`:
- `auth.py` - Login/register endpoints
- `students.py` - Student operations
- `teams.py` - Team creation and invites
- `matching.py` - AI teammate recommendations
- `hackathons.py` - Hackathon management

### 3. Frontend Pages

Create pages in `frontend/app/`:
- `auth/login/page.tsx`
- `auth/register/page.tsx`
- `dashboard/page.tsx`
- `hackathons/page.tsx`
- `teams/page.tsx`

### 4. Implement Matching Algorithm

Complete the matching engine in `backend/app/matching/`:
- Skill complementarity scoring
- Experience balance calculation
- Team constraints validation

## Available Commands

### Backend
```bash
# Run development server
uvicorn app.main:app --reload

# Run tests
pytest

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Format code
black app/

# Lint
flake8 app/
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

### Docker
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs -f [service-name]
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key (generate with `openssl rand -hex 32`)
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration
- `FRONTEND_URL` - For CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Design System

TailwindCSS is configured with your design tokens:

**Colors:**
- Primary: `text-primary`, `bg-primary`
- Success: `text-success`, `bg-success`
- Warning: `text-warning`, `bg-warning`
- Error: `text-error`, `bg-error`

**Components:**
Pre-built components in `components/ui/`:
- Button (primary, secondary, ghost variants)
- Card (with hover effects)
- Input (with label, error, helper text)

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Database connection issues:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `createdb takathon`

**Frontend API errors:**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

## Ready to Code! 🚀

Everything is set up and ready. Start building your hackathon team formation platform!
