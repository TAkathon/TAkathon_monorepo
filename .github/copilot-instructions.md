# TAkathon Copilot Instructions

## ⚠️ Git Workflow (Gitflow) - CRITICAL

**This project follows Gitflow branching strategy. Always follow these rules:**

### Branch Structure
- **`main`** - Production-ready code only (stable releases, minimal files)
- **`dev`** - **Main development branch** (all active development happens here)
- **`feature/*`** - Feature branches (branch from `dev`, merge back to `dev`)
- **`hotfix/*`** - Emergency fixes (branch from `main`, merge to both `main` and `dev`)
- **`release/*`** - Release preparation (branch from `dev`, merge to `main` and `dev`)

### Workflow Rules
1. **NEVER commit directly to `main`** - Only merge from `release/*` or `hotfix/*`
2. **All development happens on `dev`** - Switch to `dev` branch for coding
3. **Create feature branches**: `git checkout -b feature/feature-name dev`
4. **Merge features to `dev`**: Create PR from `feature/*` → `dev`
5. **Releases**: Create `release/*` from `dev`, test, then merge to `main` and `dev`

### Commit Message Convention
```
<type>: <subject>

<optional body>
```

**Types**: 
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance, config, setup
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Testing
- `perf:` - Performance

**Examples**:
```bash
git commit -m "feat: add student team creation endpoint"
git commit -m "fix: resolve JWT token expiration"
git commit -m "chore: update dependencies"
```

### 🚀 Get Started

**To start development:**
```bash
git checkout dev
```

All project architecture, code, and documentation are on the `dev` branch.

## Quick Project Overview

TAkathon is a hackathon team builder where:
- Students create teams, invite friends, or use AI to find compatible teammates
- Organizers create hackathons and manage participants
- AI matching engine suggests compatible teammates based on skills

**Tech Stack**: Next.js 14 + FastAPI + PostgreSQL  
**Architecture**: Modular monolith (frontend + backend + matching engine)

---

**For complete architecture details, setup instructions, and development:**  
👉 **Switch to the `dev` branch**
