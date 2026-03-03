# TAkathon — Naming Conventions

**Last Updated**: March 3, 2026
**Scope**: All code in this monorepo (TypeScript, Python, CSS, SQL, Git)

Consistent naming reduces cognitive load and makes code searchable. When in doubt, follow these conventions before reaching for a creative alternative.

---

## TypeScript / JavaScript

### Files

| Type                        | Convention     | Examples                                      |
|-----------------------------|----------------|-----------------------------------------------|
| Next.js pages               | `page.tsx`     | `app/dashboard/page.tsx`                      |
| Next.js layouts             | `layout.tsx`   | `app/dashboard/layout.tsx`                    |
| Next.js middleware          | `middleware.ts` | `src/middleware.ts`                          |
| React components (file)     | PascalCase     | `DashboardLayout.tsx`, `MatchModal.tsx`       |
| Utility / helper modules    | camelCase      | `authUtils.ts`, `formatDate.ts`              |
| API route modules           | camelCase      | `hackathon.ts`, `matching.ts`, `profile.ts`  |
| Service files               | camelCase + `.service.ts` | `matching.service.ts`, `team.service.ts` |
| Test files                  | `*.spec.ts`    | `auth.spec.ts`, `token.spec.ts`              |
| Type definition files       | camelCase      | `index.ts`, `models.ts`                      |

### Variables and Functions

```typescript
// Variables — camelCase
const teamData = await teamApi.getMyTeams();
const isLoading = false;
const openSpots = team.maxSize - team.members.length;

// Functions — camelCase, verb-first
function fetchTeamData() { ... }
function handleCreateTeam() { ... }
function formatHackathonDate(date: string) { ... }
async function suggestTeammates(teamId: string) { ... }

// Event handlers — always "handle" prefix
const handleAddSkill = () => { ... };
const handleLeaveTeam = () => { ... };
const handleInviteMatch = (userId: string) => { ... };
const handleFormSubmit = (e: React.FormEvent) => { ... };
```

### State Variables (React)

```typescript
// Value + setter pattern: noun for value, "set" prefix for setter
const [teams, setTeams] = useState<Team[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [submitting, setSubmitting] = useState(false);
const [showModal, setShowModal] = useState(false);
const [selectedSkill, setSelectedSkill] = useState<string>("");

// Form state — single object for related fields
const [form, setForm] = useState({ name: "", description: "", maxSize: 4 });
```

### Types and Interfaces

```typescript
// PascalCase for all types and interfaces
interface TeamData { ... }
interface MatchSuggestion { ... }
interface HackathonOption { ... }
type UserRole = "STUDENT" | "ORGANIZER" | "SPONSOR";  // or enum
type AvailabilitySlot = "weekday_morning" | "weekday_afternoon" | ...;
```

### Enums

```typescript
// PascalCase name, SCREAMING_SNAKE_CASE values (matching DB/Prisma convention)
enum UserRole {
  STUDENT = "STUDENT",
  ORGANIZER = "ORGANIZER",
  SPONSOR = "SPONSOR",
}

enum HackathonStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
```

### React Hooks

```typescript
// Custom hooks: "use" prefix + PascalCase noun describing what it manages
const { user, isAuthenticated, login, logout } = useAuthStore();   // Zustand hook
function useTeamData(teamId: string) { ... }
function useHackathonList() { ... }
function useMatchSuggestions(teamId: string) { ... }
```

### API Module Exports (Shared API Library)

```typescript
// Domain prefix + "Api" suffix
export const studentApi = { ... };
export const teamApi = { ... };
export const invitationApi = { ... };
export const organizerApi = { ... };
export const hackathonApi = { ... };
export const matchingApi = { ... };
```

### Loading / Error / Status States

Use these exact names for consistency across all pages:

```typescript
loading      // boolean — fetching data
submitting   // boolean — form submission in progress
error        // string | null — error message to display
creating     // boolean — create operation in progress
inviting     // boolean — sending invitation
deleting     // boolean — delete in progress
```

---

## CSS / Tailwind

### CSS Classes (Global / Component-specific)

| Element             | Convention    | Examples                  |
|---------------------|---------------|---------------------------|
| Utility classes     | kebab-case    | `.glass`, `.btn-primary`  |
| Custom components   | kebab-case    | `.input-field`, `.card-header` |
| State modifiers     | kebab-case    | `.is-loading`, `.is-active` |

### Standard Design System Classes

Always use these — do not invent one-off alternatives:

```css
.glass          /* glassmorphism card */
.btn-primary    /* orange primary button */
.btn-secondary  /* secondary/ghost button */
.input-field    /* standard form input */
```

### Tailwind Rules

- Only use opacity values that are multiples of 5: `/5`, `/10`, `/15`, `/20` ... NOT `/8`, `/12`, `/18`
- Extend `tailwind.config.js` if you need non-standard values — don't silently use invalid values
- `select option` elements: NEVER use Tailwind classes — use global CSS in `globals.css`:
  ```css
  select option { background-color: #1A0A00; color: #fff; }
  ```

---

## Python (AI Engine)

```python
# Files — snake_case
engine.py, scoring.py, validators.py, test_matching.py

# Functions — snake_case
def skill_complementarity(team_skills, candidate_skills): ...
def experience_balance(team_proficiencies, candidate_proficiency): ...
def suggest(team_skills, candidates, open_spots, limit): ...

# Pydantic classes — PascalCase
class MatchRequest(BaseModel): ...
class MatchSuggestion(BaseModel): ...
class AvailabilityEntry(BaseModel): ...

# Constants — SCREAMING_SNAKE_CASE
SKILL_WEIGHT = 0.40
EXPERIENCE_WEIGHT = 0.30
AVAILABILITY_WEIGHT = 0.30
PROFICIENCY_MAP = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
```

---

## Database / Prisma

### SQL / Database (snake_case)

```sql
-- Tables
user_skills, hackathon_participants, team_members, team_invitations

-- Columns
created_at, updated_at, graduation_year, hours_per_week

-- Foreign keys
user_id, hackathon_id, team_id, sponsor_id
```

### Prisma Models (PascalCase)

```prisma
model HackathonParticipant { ... }
model TeamMember { ... }
model TeamInvitation { ... }
model UserSkill { ... }
```

Relation fields in Prisma: camelCase

```prisma
model Team {
  members   TeamMember[]
  hackathon Hackathon    @relation(fields: [hackathonId], ...)
}
```

---

## Environment Variables

SCREAMING_SNAKE_CASE for all environment variables:

```env
DATABASE_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
NEXT_PUBLIC_GATEWAY_URL=...
AI_ENGINE_URL=...
CORS_ORIGINS=...
NODE_ENV=...
ACCESS_TTL=...
REFRESH_TTL=...
```

**`NEXT_PUBLIC_` prefix**: required for Next.js variables that need to be available in the browser bundle. All other `NEXT_*` variables are server-only.

---

## Git

### Branch Names

```
feature/phase4-polish
feature/organizer-create-form
fix/matching-url-mismatch
fix/login-redirect-loop
chore/cleanup-nestjs-scaffold
hotfix/cors-production
docs/update-api-spec
```

Format: `<type>/<kebab-case-description>`
Types: `feature/`, `fix/`, `chore/`, `hotfix/`, `docs/`, `test/`

### Commit Messages

Follow Conventional Commits. See `COMMIT_CONVENTIONS.md` for full specification.

```
feat(student): add availability slot toggle to settings page
fix(gateway): correct matching route URL in shared API client
chore(docs): update REPO_STATE to reflect Phase 3 completion
test(ai-engine): add pytest coverage for availability_overlap scorer
```

**Scopes**: `student`, `organizer`, `sponsor`, `gateway`, `ai-engine`, `shared`, `docker`, `db`, `docs`, `ci`

---

## API Routes

```
# kebab-case path segments
/api/v1/students/matching/:teamId/matches     ✅
/api/v1/students/matching/:teamId/matches     ✅
/api/v1/organizers/hackathons/:id/export      ✅

# Do NOT use camelCase or snake_case in URLs
/api/v1/students/matchingTeam              ✗ camelCase
/api/v1/students/team_members              ✗ snake_case
```

HTTP Methods: use semantically correct verbs
- `GET` — retrieve data
- `POST` — create resource or trigger action
- `PUT` — replace resource (full update)
- `PATCH` — partial update
- `DELETE` — remove resource

---

## Docker

```yaml
# Service names: kebab-case (in docker-compose.yml)
services:
  core-gateway:
  ai-engine:
  student-portal:
  organizer-dashboard:

# Container names: project-service pattern
container_name: takathon-gateway
container_name: takathon-ai
container_name: takathon-student

# Volume names: project-description pattern
takathon-pgdata:
```

---

## Summary Quick Reference

| Thing                     | Convention             |
|---------------------------|------------------------|
| TypeScript files          | camelCase.ts           |
| React component files     | PascalCase.tsx         |
| Python files              | snake_case.py          |
| CSS classes               | kebab-case             |
| Variables / functions     | camelCase              |
| Types / interfaces        | PascalCase             |
| Enum values               | SCREAMING_SNAKE_CASE   |
| DB tables / columns       | snake_case             |
| Prisma models             | PascalCase             |
| Environment variables     | SCREAMING_SNAKE_CASE   |
| Git branches              | type/kebab-case        |
| API URL path segments     | kebab-case             |
| Docker services           | kebab-case             |
| Event handlers            | handleXxx              |
| Custom React hooks        | useXxx                 |
| API module objects        | domainApi              |
| Loading state variable    | `loading`              |
| Error state variable      | `error`                |
