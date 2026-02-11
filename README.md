# TAkathon

> Hackathon Team Builder - AI-powered platform for forming balanced hackathon teams

TAkathon helps students create teams, invite friends, and find compatible teammates using AI matching. Organizers can create hackathons and manage participants efficiently.

---

## 🌿 Development Branch Structure (Gitflow)

This repository follows **Gitflow** branching strategy:

- **`main`** - Production-ready stable releases (you are here)
- **`dev`** - Active development branch (all features and architecture)
- **`feature/*`** - Feature branches
- **`hotfix/*`** - Emergency fixes
- **`release/*`** - Release preparation

### 🚀 Get Started with Development

**All project code, setup instructions, and documentation are on the `dev` branch:**

```bash
git checkout dev
```

Once on `dev`, check:
- `SETUP.md` - Complete setup guide and quick start
- `README.md` - Full project documentation
- `.github/copilot-instructions.md` - Architecture and development guidelines

---

## Quick Overview

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

Interactive FigJam user flow diagrams:

- [App Navigation Flow](https://www.figma.com/online-whiteboard/create-diagram/f254f5a6-4574-49aa-a39c-cfbcf96e11e3?utm_source=other&utm_content=edit_in_figjam)
- [Authentication & Onboarding](https://www.figma.com/online-whiteboard/create-diagram/5c7fe26b-5ed0-4b77-8f78-4da95c10d8f0?utm_source=other&utm_content=edit_in_figjam)
- [Team Generation Workflow](https://www.figma.com/online-whiteboard/create-diagram/59e0efc1-fad3-4661-b02f-a5d7d7842330?utm_source=other&utm_content=edit_in_figjam)
- [Student Journey](https://www.figma.com/online-whiteboard/create-diagram/685cee4a-2e87-4d3a-807b-ba85a7900bf1?utm_source=other&utm_content=edit_in_figjam)

---

## 📝 License

See LICENSE file for details.

---

**Ready to code?** → Switch to the `dev` branch to get started!
