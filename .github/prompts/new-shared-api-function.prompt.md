---
mode: "agent"
description: "Add a new shared API client function in libs/shared/api following existing patterns"
---

# New Shared API Function

Add a typed API function to `libs/shared/api/src/` so all frontends can call it without duplicating fetch logic.

## Context files to read first

#file:libs/shared/api/src/index.ts
#file:libs/shared/api/src/client.ts
#file:libs/shared/api/src/student.ts
#file:libs/shared/api/src/matching.ts
#file:libs/shared/types/src/index.ts

## Rules

1. **No raw `axios` calls in pages** — always go through the typed module functions.
2. **Return type**: every function must have an explicit TypeScript return type derived from `@takathon/shared/types`.
3. **Module placement**: add to the correct domain file (`student.ts`, `organizer.ts`, `hackathon.ts`, `matching.ts`). Create a new file only for entirely new domains.
4. **URL correctness** (common pitfalls):
   - Skills: `POST /api/v1/students/skills`, `DELETE /api/v1/students/skills/:id`
   - AI matching: `GET /api/v1/students/matching/:teamId/matches` (NOT `/students/teams/`)
   - Public skills: `GET /api/v1/skills`
5. **Export from barrel**: add the new function to `libs/shared/api/src/index.ts`.
6. **Credentials**: the Axios `client` already has `withCredentials: true` — never override this.

## Describe the new function

<!-- Which module? What HTTP method + URL? What does it send and what does it return? -->
