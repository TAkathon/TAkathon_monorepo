# TAkathon

> Hackathon Team Builder - AI-powered platform for forming balanced hackathon teams

TAkathon helps students create teams, invite friends, and find compatible teammates using AI matching. Organizers can create hackathons and manage participants efficiently.

---

## 🌿 Development Branch Structure (Gitflow)

- Student authentication (JWT-based)
- Skill-based student profiles
- Student-led team creation
- Invite friends to team
- AI-powered teammate matching (fill open spots)
- Hackathon creation (organizer role)
- Organizer dashboard with participant/team overview

---

## 🏗 Architecture

The system follows a modular monolith architecture with clear separation of concerns.

**Team Formation Flow**: Students create teams → Invite friends → Request AI teammate suggestions for open spots

Frontend (Next.js)
        ↓
REST API (FastAPI)
        ↓
Service Layer
        ↓
Matching Engine (AI-powered teammate suggestions)
        ↓
PostgreSQL Database

### 📐 Design & User Flows

Interactive FigJam diagrams documenting system flows:

- **[App Navigation Flow](https://www.figma.com/online-whiteboard/create-diagram/f254f5a6-4574-49aa-a39c-cfbcf96e11e3?utm_source=other&utm_content=edit_in_figjam)** - Complete navigation structure for student and organizer roles
- **[Authentication & Onboarding Flow](https://www.figma.com/online-whiteboard/create-diagram/5c7fe26b-5ed0-4b77-8f78-4da95c10d8f0?utm_source=other&utm_content=edit_in_figjam)** - Registration and login flows for both user types
- **[Team Generation Workflow](https://www.figma.com/online-whiteboard/create-diagram/59e0efc1-fad3-4661-b02f-a5d7d7842330?utm_source=other&utm_content=edit_in_figjam)** - Detailed matching engine process from participant review to team export
- **[Student Journey: Profile to Team](https://www.figma.com/online-whiteboard/create-diagram/685cee4a-2e87-4d3a-807b-ba85a7900bf1?utm_source=other&utm_content=edit_in_figjam)** - Complete student experience from profile setup to team collaboration

### 🚀 Get Started with Development

The AI-powered teammate matching system helps students find compatible team members using:

- Skill compatibility scoring
- Experience level balance
- Team role fit analysis
- Availability matching

**How it works**: Students create teams and invite friends. For open spots, they can request AI-matched suggestions of compatible participants.

Once on `dev`, check:
- `SETUP.md` - Complete setup guide and quick start
- `README.md` - Full project documentation
- `.github/copilot-instructions.md` - Architecture and development guidelines

---

## 🛠 Getting Started

### Prerequisites
- **Node.js**: v18 or later
- **npm**: v9 or later
- **Nx**: Installed globally (`npm install -g nx`) or use `npx nx`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/TAkathon/TAkathon_monorepo.git
   cd TAkathon_monorepo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

#### Using Nx (Recommended)
Nx allows you to manage the entire monorepo efficiently.
- **Run Student Portal**: `npx nx dev student-portal`
- **Run Organizer Dashboard**: `npx nx dev organizer-dashboard`
- **Build All**: `npx nx run-many -t build`
- **Lint All**: `npx nx run-many -t lint`

#### Using npm
You can also run individual apps using standard npm scripts from their respective directories.
- **Student Portal**:
  ```bash
  cd apps/student-portal
  npm run dev
  ```
- **Organizer Dashboard**:
  ```bash
  cd apps/organizer-dashboard
  npm run dev
  ```

### Environment Variables
Create a `.env` file in the root directory (or in specific app directories if needed) based on the provided `.env.example` files.

---

## 🛠 Tech Stack

**What TAkathon does:**
- Students create teams and invite friends
- AI suggests compatible teammates for open spots
- Organizers create hackathons and view team distribution
- Skill-based matching ensures balanced teams

**Tech Stack:**
- Frontend: Next.js 14 + TailwindCSS
- Backend: FastAPI + PostgreSQL
- Matching: AI-powered recommendation engine

**Architecture:** Modular monolith with clear separation (Frontend → API → Service Layer → Matching Engine → Database)

---

## 📐 Design Resources

- users
- skills
- user_skills
- hackathons
- hackathon_participants
- teams (student-created, has captain/creator)
- team_members
- team_invitations (pending invites and join requests)

---

## 📁 Project Structure

```
/backend
  /app
    /api          # Route handlers
    /models       # SQLAlchemy models
    /services     # Business logic
    /matching     # AI teammate recommendation engine
  /alembic        # Database migrations
  /tests
  requirements.txt

/frontend
  /app            # Next.js 14 App Router
  /components     # React components
  /lib            # Utilities, API client
  package.json

/docker-compose.yml
```

---

## 🔐 Roles

### Student
- Create profile with skills and experience levels
- Join hackathons
- Create teams and invite friends
- Request AI teammate suggestions for open spots
- Manage team composition

### Organizer
- Create and manage hackathons
- View registered participants
- View all teams and participant distribution
- Export team data

---

## 📝 License

See LICENSE file for details.

---

**Ready to code?** → Switch to the `dev` branch to get started!
