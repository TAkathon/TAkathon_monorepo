---
mode: "agent"
description: "Scaffold a new Express route + service in core-gateway following project conventions"
---

# New Gateway Route

Create a new Express route+service pair in `apps/core-gateway/src/` following the established Route-Middleware-Service pattern.

## Context files to read first

#file:apps/core-gateway/src/index.ts
#file:apps/core-gateway/src/routes/students/profile.ts
#file:apps/core-gateway/src/services/students/profile.service.ts
#file:apps/core-gateway/src/middleware/auth.ts
#file:apps/core-gateway/src/middleware/rbac.ts
#file:apps/core-gateway/src/lib/prisma.ts

## What to create

**Route**: `apps/core-gateway/src/routes/<role>/<feature>.ts`
**Service**: `apps/core-gateway/src/services/<role>/<feature>.service.ts`

## Rules (non-negotiable)

1. **Auth**: every handler must go through `requireAuth` then the correct role guard (`requireStudent` / `requireOrganizer` / `requireSponsor`).
2. **Validation**: use `zod` to parse `req.body` / `req.query` at the top of each handler. Return `422` on failure.
3. **Response shape**: always `{ success: true, data: ... }` or `{ success: false, error: "CODE", message: "..." }`.
4. **No JWT in response body** — tokens live in httpOnly cookies only.
5. **Service is pure**: no `req`/`res` in services — only plain data in, plain data out via Prisma.
6. **Register the route** in `src/index.ts` at the correct mount path and document the path in a comment.
7. **Prisma 7** adapter pattern is already initialised in `src/lib/prisma.ts` — import `prisma` from there.

## Describe your new route

Describe below what the route should do (role, resource, HTTP verb, business logic):

<!-- Example: "An organizer route GET /organizers/hackathons/:id/leaderboard that returns teams ranked by submission score." -->
