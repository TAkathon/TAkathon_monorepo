# TAkathon

TAkathon is a Hackathon Team Builder, a SaaS platform that helps students form balanced hackathon teams based on skills and availability while giving organizers a structured overview of participants and teams.

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

### 📐 Design & User Flows

Interactive FigJam diagrams documenting system flows:

- **[App Navigation Flow](https://www.figma.com/online-whiteboard/create-diagram/f254f5a6-4574-49aa-a39c-cfbcf96e11e3?utm_source=other&utm_content=edit_in_figjam)** - Complete navigation structure for student and organizer roles
- **[Authentication & Onboarding Flow](https://www.figma.com/online-whiteboard/create-diagram/5c7fe26b-5ed0-4b77-8f78-4da95c10d8f0?utm_source=other&utm_content=edit_in_figjam)** - Registration and login flows for both user types
- **[Team Generation Workflow](https://www.figma.com/online-whiteboard/create-diagram/59e0efc1-fad3-4661-b02f-a5d7d7842330?utm_source=other&utm_content=edit_in_figjam)** - Detailed matching engine process from participant review to team export
- **[Student Journey: Profile to Team](https://www.figma.com/online-whiteboard/create-diagram/685cee4a-2e87-4d3a-807b-ba85a7900bf1?utm_source=other&utm_content=edit_in_figjam)** - Complete student experience from profile setup to team collaboration

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
