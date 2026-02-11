# Hackathon Team Builder

Hackathon Team Builder is a SaaS platform that helps students form balanced hackathon teams based on skills and availability while giving organizers a structured overview of participants and teams.

The platform transforms chaotic team formation into a structured, efficient process.

---

## 🚀 Core Features (MVP)

- Student authentication (JWT-based)
- Skill-based student profiles
- Hackathon creation (organizer role)
- Join hackathon flow
- Rule-based team auto-generation
- Organizer dashboard with team overview

---

## 🏗 Architecture

The system follows a modular monolith architecture with clear separation of concerns.

Frontend (Next.js)
        ↓
REST API (FastAPI)
        ↓
Service Layer
        ↓
Matching Engine
        ↓
PostgreSQL Database

---

## 🧠 Matching Engine (V1)

The team generation system uses a deterministic scoring algorithm to:

- Ensure skill coverage across teams
- Balance experience levels
- Enforce team size constraints
- Avoid uneven distributions

This module is designed to be replaceable with an ML-based system in future versions.

---

## 🛠 Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT Authentication

### Frontend
- Next.js
- TailwindCSS
- Axios

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI)
- Cloud deployment (Render / DigitalOcean)

---

## 📦 Database Design (Core Tables)

- users
- skills
- user_skills
- hackathons
- hackathon_participants
- teams
- team_members

---

## 🔐 Roles

### Student
- Create profile
- Set skill levels
- Join hackathons
- View assigned team

### Organizer
- Create hackathon
- View participants
- Generate teams
- View/export teams

---

## 📈 Future Expansion

- ML-based compatibility scoring
- Public student profiles
- Hackathon performance tracking
- Company access to top teams
- Portfolio generation

---

## 🎯 Vision

Start narrow. Solve team formation.
Expand into a structured hackathon ecosystem.
