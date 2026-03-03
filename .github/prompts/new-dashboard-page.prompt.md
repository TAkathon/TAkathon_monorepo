---
mode: "agent"
description: "Scaffold a new Next.js dashboard page following TAkathon UI/UX and data-fetching patterns"
---

# New Dashboard Page

Scaffold a new `page.tsx` for one of the three portals (student-portal, organizer-dashboard, sponsor-panel).

## Context files to read first

#file:docs/FRONTEND_PATTERNS.md
#file:docs/NAMING_CONVENTIONS.md
#file:apps/student-portal/src/app/dashboard/teams/page.tsx
#file:apps/student-portal/src/components/DashboardLayout.tsx
#file:libs/shared/api/src/index.ts

## Rules (non-negotiable)

1. **`"use client"`** at the top — all dashboard pages are client components.
2. **DashboardLayout** wraps all content. It does NOT redirect; only `middleware.ts` does.
3. **Data fetching**: use the typed domain API modules from `@takathon/shared/api` — never raw `fetch` or bare `axios`.
4. **Loading state**: show `<Loader2 className="animate-spin" />` while fetching; show inline error with retry button on failure.
5. **Empty state**: always render a helpful message + CTA when the list is empty.
6. **Buttons**: use `.btn-primary` / `.btn-secondary`. Always `disabled` + spinner during async ops.
7. **Tailwind opacity**: only multiples of 5 (`/10`, `/20`, not `/8`, `/12`).
8. **`select option` dark theme**: never Tailwind classes on `<option>` — must be in `globals.css`.
9. **Team data**: `getMyTeams()` returns a nested shape — always flatten (see `FRONTEND_PATTERNS.md`).
10. **File location**: `apps/<portal>/src/app/dashboard/<feature>/page.tsx`.

## Describe your new page

<!-- App: student-portal | organizer-dashboard | sponsor-panel -->
<!-- Route: /dashboard/<feature> -->
<!-- Purpose: what data it shows and what actions are available -->
