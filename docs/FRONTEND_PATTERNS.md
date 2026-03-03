# TAkathon — Frontend Patterns

**Last Updated**: March 3, 2026
**Scope**: All Next.js apps (student-portal, organizer-dashboard, sponsor-panel, landing-page)

This guide codifies the patterns we use for page structure, data fetching, auth, forms, and UI interactions. Follow these patterns to keep all dashboards consistent and predictable.

---

## Page Structure

Every `page.tsx` follows this order:

```typescript
"use client";

// 1. React + framework imports
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// 2. Third-party imports
import { Loader2, Plus, AlertCircle } from "lucide-react";

// 3. Shared library imports
import { teamApi, matchingApi } from "@takathon/shared/api";
import { useAuthStore } from "@takathon/shared/utils";
import type { Team, MatchSuggestion } from "@takathon/shared/types";

// 4. Local imports
import { DashboardLayout } from "@/components/DashboardLayout";

// 5. Page-local interfaces (not exported unless truly shared)
interface TeamWithRole extends Team {
  myRole: "captain" | "member";
}

// 6. Sub-components (small, defined in same file for locality)
function TeamCard({ team }: { team: TeamWithRole }) {
  return <div className="glass p-4">...</div>;
}

// 7. Page component — always named, always default exported
export default function TeamsPage() {
  // a. State declarations
  // b. Hooks (useRouter, useParams, useAuthStore, etc.)
  // c. Effects
  // d. Handlers
  // e. JSX return
}
```

---

## Authentication Patterns

### Login Page — Verify Session Before Redirecting

**Never trust Zustand `isAuthenticated` alone.** Always verify via `/auth/me`:

```typescript
// apps/landing-page/src/app/login/page.tsx
const { isAuthenticated, user, login, logout } = useAuthStore();
const apiUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;

useEffect(() => {
  if (!isAuthenticated) return;
  (async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/me`, { credentials: "include" });
      if (res.ok) {
        router.push(authRedirect(user?.role));
      } else {
        logout(); // stale store — clear it, stay on login
      }
    } catch {
      logout();
    }
  })();
}, [isAuthenticated]);
```

### DashboardLayout — Hydrate Zustand, Never Redirect

```typescript
// Apps that use DashboardLayout
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, login, _hasHydrated } = useAuthStore();

  // Hydrate Zustand from existing cookie (needed after cross-origin redirect)
  // Do NOT redirect here — middleware.ts handles route protection
  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated && user) return;
    api.get("/api/v1/auth/me")
      .then(res => login({ ...res.data.data }))
      .catch(() => {}); // 401 → interceptor in api client handles redirect
  }, [_hasHydrated]);

  return (
    <div className="flex h-screen bg-[#1A0A00]">
      {/* sidebar, topbar, children */}
    </div>
  );
}
```

### Route Protection (middleware.ts)

```typescript
// src/middleware.ts in each protected app
import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Data Fetching Pattern

All pages use this pattern for initial data load:

```typescript
const [data, setData] = useState<SomeType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchData();
}, []);

async function fetchData() {
  try {
    setLoading(true);
    setError(null);
    const result = await someApi.getSomeData();
    setData(result.data);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to load data.");
  } finally {
    setLoading(false);
  }
}

// In JSX:
if (loading) return <div className="flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
if (error) return <div className="text-red-400 flex items-center gap-2"><AlertCircle size={16} />{error}</div>;
```

---

## Team Data Flatten Pattern

`getMyTeams()` returns a **nested** membership shape. ALWAYS flatten before using:

```typescript
const raw = await teamApi.getMyTeams();
const teams = (raw.data as any[]).map((m: any) => ({
  ...(m.team ?? m),
  myRole: m.role ?? m.myRole,
  members: (m.team?.members ?? m.members) || [],
}));
```

Do not access `team.name` directly on the raw response — it will be `undefined`.

---

## Form State Pattern

Use a single form object for related fields. Avoid individual `useState` per field:

```typescript
const [form, setForm] = useState({
  name: "",
  description: "",
  maxSize: 4,
});

// Generic change handler
const handleChange = (field: string, value: string | number) => {
  setForm(prev => ({ ...prev, [field]: value }));
};

// Form submit
const [submitting, setSubmitting] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.name.trim()) return; // basic client-side check
  try {
    setSubmitting(true);
    await teamApi.createTeam(form);
    // success — refetch or navigate
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to create team.");
  } finally {
    setSubmitting(false);
  }
};
```

---

## Button States

Always disable buttons during async operations. Always show a loading indicator:

```typescript
<button
  onClick={handleCreateTeam}
  disabled={submitting || !form.name.trim()}
  className="btn-primary flex items-center gap-2 disabled:opacity-50"
>
  {submitting ? (
    <><Loader2 size={16} className="animate-spin" /> Creating...</>
  ) : (
    <><Plus size={16} /> Create Team</>
  )}
</button>
```

```typescript
// For delete / destructive actions
<button
  onClick={handleDisband}
  disabled={deleting}
  className="btn-secondary text-red-400 border-red-400/30 disabled:opacity-50"
>
  {deleting ? <Loader2 size={14} className="animate-spin" /> : "Disband Team"}
</button>
```

---

## Modal Pattern

```typescript
const [showModal, setShowModal] = useState(false);

// Trigger
<button onClick={() => setShowModal(true)}>Open Modal</button>

// Modal
{showModal && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}   // click outside to close
  >
    <div
      className="glass max-w-md w-full mx-4 p-6"
      onClick={e => e.stopPropagation()}   // prevent close when clicking inside
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Modal Title</h2>
        <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white">
          ✕
        </button>
      </div>
      {/* modal content */}
    </div>
  </div>
)}
```

---

## Dynamic Route Pages

For pages at `/dashboard/teams/[id]/...`:

```typescript
"use client";
import { useParams, useRouter } from "next/navigation";

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();  // typed
  const router = useRouter();

  // Navigate to sub-page
  const goToMessages = () => router.push(`/dashboard/teams/${id}/messages`);
}
```

---

## Hackathon Registration UI

`isInTeam: true` should block withdrawal with an explanatory badge (not a clickable button):

```typescript
{hackathon.isInTeam ? (
  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
    In Team — leave team to withdraw
  </span>
) : hackathon.isRegistered ? (
  <button onClick={() => handleWithdraw(hackathon.id)} className="btn-secondary text-sm">
    Withdraw
  </button>
) : (
  <button onClick={() => handleRegister(hackathon.id)} className="btn-primary text-sm">
    Join Now
  </button>
)}
```

---

## AI Matching Modal

"Find Teammates" button appears on teams where `status === "forming"` and `openSpots > 0`:

```typescript
{team.status === "forming" && openSpots > 0 && (
  <button onClick={() => { setSelectedTeamId(team.id); setShowMatchModal(true); }}>
    Find Teammates
  </button>
)}
```

Inside the modal, load suggestions on open:

```typescript
useEffect(() => {
  if (!showMatchModal || !selectedTeamId) return;
  (async () => {
    try {
      setLoadingMatches(true);
      const result = await matchingApi.suggestTeammates(selectedTeamId, 10);
      setSuggestions(result.data.suggestions);
      setIsFallback(result.data.fallback ?? false);
    } catch {
      setMatchError("Failed to fetch suggestions.");
    } finally {
      setLoadingMatches(false);
    }
  })();
}, [showMatchModal, selectedTeamId]);
```

---

## CSS / Tailwind Rules

### Dark Theme Inputs

```typescript
// Standard input field with dark theme
<input
  type="text"
  className="input-field w-full"
  placeholder="Team name"
/>

// Select — must also style options globally in globals.css
<select className="input-field w-full">
  <option value="">Select...</option>
  <option value="UTC+0">UTC+0</option>
</select>
// globals.css: select option { background-color: #1A0A00; color: #fff; }
```

### Tailwind Opacity Constraint

Valid: `/5`, `/10`, `/15`, `/20`, `/25`, `/30`, `/40`, `/50`, `/60`, `/70`, `/80`, `/90`, `/100`
Invalid: `/8`, `/12`, `/18`, `/22` — these silently produce no style in default Tailwind config.

```typescript
// ✅ Correct
<div className="hover:bg-white/10 border border-white/20">

// ✗ Wrong (no effect)
<div className="hover:bg-white/8 border border-white/12">
```

---

## DashboardLayout Usage

Wrap all dashboard page content. Do not put auth logic inside it — only layout structure:

```typescript
// Every dashboard page:
export default function SomePage() {
  return (
    <DashboardLayout>
      {/* page content */}
    </DashboardLayout>
  );
}
```

---

## Error Display Patterns

```typescript
// Inline error below a form field
{fieldError && (
  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
    <AlertCircle size={14} />
    {fieldError}
  </p>
)}

// Page-level error (data fetch failed)
{error && (
  <div className="glass border border-red-500/20 p-4 text-red-400 flex items-center gap-2">
    <AlertCircle size={16} />
    {error}
    <button onClick={fetchData} className="ml-auto text-sm underline">Retry</button>
  </div>
)}
```

---

## Empty States

Always show a helpful empty state rather than a blank area:

```typescript
{teams.length === 0 && !loading && (
  <div className="text-center py-12 text-white/40">
    <Users size={48} className="mx-auto mb-4 opacity-40" />
    <p className="text-lg">No teams yet</p>
    <p className="text-sm mt-2">Create a team to start your hackathon journey.</p>
    <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
      Create Team
    </button>
  </div>
)}
```

---

## Placeholder / Coming Soon Sections

For V1 pages that are not fully implemented (like team messages, project details):

```typescript
{/* "Coming Soon" badge */}
<div className="flex items-center gap-2 mb-4">
  <h1 className="text-2xl font-bold text-white">Team Messages</h1>
  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
    Coming Soon
  </span>
</div>

{/* "Demo Data" badge */}
<span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
  Demo Data
</span>
```

---

*For naming standards see `docs/NAMING_CONVENTIONS.md`. For API details see `docs/api-specification.md`.*
