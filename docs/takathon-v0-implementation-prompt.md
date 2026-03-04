# TAkathon V0 — QA-to-Implementation Master Prompt
> Generated from manual QA session — March 2026
> Every branch below is self-contained, follows the cascade rule, and respects all critical rules in `.github/COPILOT_INSTRUCTIONS.md`.
> Branch from `dev`. Never commit directly to `main`.

---

## Branch Execution Order

Execute branches in this sequence — each one unblocks the next.

| # | Branch | Scope | Prompt Type |
|---|--------|-------|-------------|
| 1 | `fix/student-create-team` | Student portal — team creation | gateway-route + dashboard-page |
| 2 | `fix/student-hackathon-status-ux` | Student portal — disabled hackathon states | dashboard-page |
| 3 | `fix/student-profile-save` | Student portal — profile form persistence | gateway-route + dashboard-page |
| 4 | `fix/student-settings-security` | Student portal — settings security buttons | gateway-route + dashboard-page |
| 5 | `fix/organizer-create-hackathon` | Organizer — hackathon creation | gateway-route + dashboard-page |
| 6 | `fix/organizer-hackathon-view` | Organizer — view hackathon 404 | dashboard-page |
| 7 | `fix/organizer-participants-teams` | Organizer — participants/teams crash | gateway-route + dashboard-page |
| 8 | `feature/organizer-leaderboard-analytics` | Organizer — leaderboard + analytics pages | db-schema-change → gateway-route → shared-api → dashboard-page |
| 9 | `fix/organizer-settings` | Organizer — settings buttons | gateway-route + dashboard-page |
| 10 | `fix/sponsor-confirmation-ux` | Sponsor — confirm sponsorship UX | dashboard-page |
| 11 | `feature/notifications-system` | All portals — notification bell + page | db-schema-change → gateway-route → shared-api → dashboard-page |
| 12 | `feature/sponsor-hackathon-monitor` | Sponsor — hackathon analytics + leaderboard | gateway-route → shared-api → dashboard-page |
| 13 | `feature/profile-avatar-menu` | All portals — top-right avatar dropdown | dashboard-page |
| 14 | `feature/general-ux-improvements` | All portals — polish, empty states, toasts | dashboard-page |

---

---

## Branch 1 — `fix/student-create-team`

### Problem
"Create Team" button in the student portal does nothing when clicked. No error, no modal, no navigation.

### Root Cause Investigation
Open `apps/student-portal/src/app/dashboard/teams/page.tsx`.
Check: is the button's `onClick` wired? Is the API call using `teamApi.createTeam()`?
Check: does `POST /api/v1/students/teams` exist in `apps/core-gateway/src/routes/students/teams.ts`?
Check: is the route registered in `apps/core-gateway/src/index.ts`?

### Cascade Prompt

**Step 1 — Verify/implement the gateway route** (`new-gateway-route`):

```
File: apps/core-gateway/src/routes/students/teams.ts
Mount: POST /api/v1/students/teams
Auth chain: requireAuth → requireStudent
Zod schema:
  body: {
    name: z.string().min(2).max(50),
    hackathonId: z.string().cuid(),
    description: z.string().max(300).optional()
  }
Service call: teamsService.createTeam(studentProfileId, body)
Success: 201 { success: true, data: { team } }
Errors:
  - 400 if student already has a team in this hackathon
  - 400 if hackathon is not in "active" or "published" status
  - 422 on Zod failure
```

**Step 2 — Verify/implement the service** (`apps/core-gateway/src/services/students/teams.service.ts`):

```
createTeam(studentProfileId, { name, hackathonId, description }):
  1. Verify hackathon exists and status is PUBLISHED or ACTIVE
  2. Check student is not already in a team for this hackathon
  3. prisma.team.create({
       data: {
         name, hackathonId, description,
         members: { create: { studentProfileId, role: "LEADER" } }
       },
       include: { members: { include: { studentProfile: true } } }
     })
  4. Return created team with members
```

**Step 3 — Implement the frontend** (`new-dashboard-page`):

```
File: apps/student-portal/src/app/dashboard/teams/page.tsx
Add "Create Team" modal (not a new page — inline modal):
  Fields: Team Name (required), Hackathon (select from student's registered hackathons), Description (optional)
  On submit: call teamApi.createTeam({ name, hackathonId, description })
  On success: toast "Team created!", close modal, refresh team list
  On error: show inline error message inside modal
  Button state: disabled + <Loader2 animate-spin /> during submission
  Empty state: if student has no registered hackathons, show "Register for a hackathon first" with CTA link
```

### Acceptance Criteria
- [ ] Student can open create-team modal
- [ ] Selecting hackathon only shows hackathons the student is registered for
- [ ] Team appears in list immediately after creation
- [ ] Student who creates team is automatically listed as LEADER in members
- [ ] Creating a second team for the same hackathon shows a clear error

---

---

## Branch 2 — `fix/student-hackathon-status-ux`

### Problem
Some hackathon cards show disabled buttons with no explanation. Users don't know if the hackathon is full, ended, cancelled, or if they've already registered.

### Cascade Prompt

**Prompt type**: `new-dashboard-page` only — no schema or route changes needed.

**File**: `apps/student-portal/src/app/dashboard/hackathons/page.tsx` (and any `HackathonCard` component)

**Logic to implement per status**:

```typescript
// Derive button state from hackathon data
type HackathonButtonState =
  | { action: "register";    label: "Register Now";         disabled: false }
  | { action: "withdraw";    label: "Withdraw";             disabled: false }
  | { action: "full";        label: "Hackathon Full";       disabled: true;  reason: "This hackathon has reached its maximum number of participants." }
  | { action: "ended";       label: "Registration Closed";  disabled: true;  reason: "Registration for this hackathon has closed." }
  | { action: "cancelled";   label: "Cancelled";            disabled: true;  reason: "This hackathon was cancelled by the organizer." }
  | { action: "in_progress"; label: "Hackathon In Progress";disabled: true;  reason: "This hackathon is currently running. Registration is closed." }
  | { action: "completed";   label: "Completed";            disabled: true;  reason: "This hackathon has ended." }
  | { action: "team_locked"; label: "Withdraw Unavailable"; disabled: true;  reason: "You are currently in a team. Leave your team to withdraw from this hackathon." }

function getHackathonButtonState(hackathon, studentStatus): HackathonButtonState
```

**UI requirements**:
- Disabled buttons must show a tooltip or an inline `<p>` reason text below the button
- Use an icon to communicate status at a glance:
  - `<Clock />` — registration closed / in progress
  - `<XCircle />` — cancelled
  - `<CheckCircle2 />` — registered / completed
  - `<Users />` — full
- Status badge on hackathon card (top-right corner): "Open", "Full", "In Progress", "Ended", "Cancelled" — color-coded using design system colors
- Cancelled hackathons should appear at the bottom of the list, visually dimmed (`opacity-50`)

### Acceptance Criteria
- [ ] Every disabled button has a human-readable explanation
- [ ] Status badge visible on all cards
- [ ] Cancelled hackathons are visually de-emphasized
- [ ] "In team — leave team to withdraw" message shown correctly (respects Known Bug #7)

---

---

## Branch 3 — `fix/student-profile-save`

### Problem
On the student profile page, skills save correctly but `university` and `major` inputs do not persist after save. The values revert on refresh.

### Root Cause Investigation
Open `apps/core-gateway/src/services/students/profile.service.ts`.
Check: does `updateProfile()` include `university` and `major` in the Prisma `update` call?
Check: does the frontend send these fields in the PUT body?
Check: does the Zod schema on `PUT /api/v1/students/profile` include these fields?

### Cascade Prompt

**Step 1 — Gateway route check** (`new-gateway-route`):

```
File: apps/core-gateway/src/routes/students/profile.ts
Route: PUT /api/v1/students/profile
Zod schema must include:
  university: z.string().max(100).optional(),
  major: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  availabilityHours: z.number().int().min(0).max(168).optional()
```

**Step 2 — Service fix**:

```
File: apps/core-gateway/src/services/students/profile.service.ts
updateProfile(studentProfileId, data):
  prisma.studentProfile.update({
    where: { id: studentProfileId },
    data: {
      university: data.university,   // ← must be explicitly mapped
      major: data.major,             // ← must be explicitly mapped
      bio: data.bio,
      githubUrl: data.githubUrl,
      linkedinUrl: data.linkedinUrl,
      availabilityHours: data.availabilityHours
    }
  })
```

**Step 3 — Frontend fix** (`new-dashboard-page`):

```
File: apps/student-portal/src/app/dashboard/profile/page.tsx
After save: always re-call getMyProfile() to re-sync local state (Critical Rule #6)
Controlled inputs: university and major must be in useState and included in PUT body
Show toast: "Profile saved successfully" on success
Show inline error: if 422 returned, display field-level errors
```

### Acceptance Criteria
- [ ] University and major persist after save and page refresh
- [ ] All profile fields included in PUT request body
- [ ] `getMyProfile()` called after every successful save
- [ ] Form shows loading state during submission

---

---

## Branch 4 — `fix/student-settings-security`

### Problem
In the student settings page, the security section buttons (Change Password, Enable 2FA, Delete Account, etc.) are present in the UI but do nothing when clicked.

### Cascade Prompt

**Step 1 — Gateway routes** (`new-gateway-route`):

```
Mount all under: /api/v1/students/settings
Auth chain: requireAuth → requireStudent

POST /api/v1/students/settings/change-password
  Zod: { currentPassword: z.string(), newPassword: z.string().min(8) }
  Service: verify currentPassword with bcrypt.compare → hash new → update user.passwordHash
  Success: 200 { success: true, message: "Password updated" }
  Error 400: "Current password is incorrect"

POST /api/v1/students/settings/delete-account
  Zod: { password: z.string(), confirmText: z.literal("DELETE") }
  Service: verify password → soft-delete or hard-delete user record + cascade
  On success: clear auth cookies → 200
  Note: Add "are you sure" double-confirmation in frontend, not just backend
```

**Step 2 — Frontend** (`new-dashboard-page`):

```
File: apps/student-portal/src/app/dashboard/settings/page.tsx

Change Password section:
  Three fields: Current Password, New Password, Confirm New Password
  Client-side validation: new === confirm before submitting
  On success: toast "Password changed. Please log in again." → call logout → redirect /login

Delete Account section:
  Two-step: first button opens confirmation modal
  Modal requires typing "DELETE" to confirm (matches Zod literal on backend)
  On success: clear store → redirect to landing page
  Style: red danger zone styling, separated from other settings

2FA section (placeholder):
  Show "Coming Soon" badge — do not wire up yet
  Do not show non-functional buttons; replace with informational text
```

### Acceptance Criteria
- [ ] Change password works end-to-end
- [ ] Wrong current password shows clear error
- [ ] Delete account requires typing "DELETE" and correct password
- [ ] After deletion user is logged out and redirected
- [ ] 2FA shows "coming soon" instead of broken button

---

---

## Branch 5 — `fix/organizer-create-hackathon`

### Problem
"Create Hackathon" button in the organizer dashboard does nothing when clicked.

### Cascade Prompt

**Step 1 — Gateway route** (`new-gateway-route`):

```
File: apps/core-gateway/src/routes/organizers/hackathons.ts
Route: POST /api/v1/organizers/hackathons
Auth chain: requireAuth → requireOrganizer
Zod schema:
  {
    title: z.string().min(3).max(100),
    description: z.string().max(2000),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    registrationDeadline: z.string().datetime(),
    location: z.string().max(200),
    isVirtual: z.boolean().default(false),
    maxParticipants: z.number().int().min(2).max(10000),
    maxTeamSize: z.number().int().min(1).max(10),
    minTeamSize: z.number().int().min(1).max(10),
    prizesDescription: z.string().max(1000).optional(),
    requiredSkillIds: z.array(z.string().cuid()).optional(),
    theme: z.string().max(200).optional()
  }
Refinements:
  - endDate must be after startDate
  - registrationDeadline must be before startDate
  - minTeamSize <= maxTeamSize
Service: hackathonService.createHackathon(organizerProfileId, data)
Success: 201 { success: true, data: { hackathon } }
Initial status: DRAFT (not published)
```

**Step 2 — Frontend page** (`new-dashboard-page`):

```
Route: apps/organizer-dashboard/src/app/dashboard/hackathons/create/page.tsx
Button "Create Hackathon" in hackathons list → navigates to /dashboard/hackathons/create

Multi-step form (3 steps, progress indicator at top):
  Step 1 — Basic Info: title, description, theme, prizes
  Step 2 — Logistics: dates (date pickers), location, virtual toggle, participant limits, team size limits
  Step 3 — Skills & Review: multi-select skill tags from GET /api/v1/skills, preview card, submit

On submit: call organizerApi.createHackathon(formData)
On success: toast "Hackathon created as Draft" → redirect to /dashboard/hackathons/:id
On error: show field-level validation errors, scroll to first error

Dates: use native <input type="datetime-local"> styled with .input-field class
Required skill multi-select: checkbox list with category grouping (fetch from /api/v1/skills)
```

### Acceptance Criteria
- [ ] Organizer can create a hackathon through 3-step form
- [ ] Created hackathon appears in list with DRAFT status badge
- [ ] Date validation prevents invalid ranges
- [ ] Skill tags selectable from predefined list
- [ ] After creation, redirect to hackathon detail page

---

---

## Branch 6 — `fix/organizer-hackathon-view`

### Problem
"View My Hackathon" button navigates to a 404 page.

### Root Cause Investigation
Check: what URL does the button link to? Is it `/dashboard/hackathons/[id]`?
Check: does `apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/page.tsx` exist?
Check: does `GET /api/v1/organizers/hackathons/:id` exist in the gateway?

### Cascade Prompt

**Step 1 — Gateway route** (if missing):

```
GET /api/v1/organizers/hackathons/:id
Auth chain: requireAuth → requireOrganizer
Service: verify hackathon.organizerProfileId === req.organizerProfileId
Return: full hackathon with { participants count, teams count, sponsorships, status, dates }
```

**Step 2 — Frontend page** (`new-dashboard-page`):

```
File: apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/page.tsx
Sections on this page:
  1. Header: title, status badge, dates, edit button (→ /hackathons/:id/edit)
  2. Quick stats row: Total Participants | Total Teams | Sponsorships | Days Until Start
  3. Lifecycle action buttons (contextual by status):
     DRAFT    → [Publish]
     PUBLISHED → [Start] [Cancel]
     ACTIVE   → [Complete] [Cancel]
     COMPLETED/CANCELLED → read-only banner
  4. Tabs: Overview | Participants | Teams (these tabs replace the broken sidebar navigation)
     Each tab loads lazily — do not load all data at once

Lifecycle buttons:
  POST /api/v1/organizers/hackathons/:id/publish
  POST /api/v1/organizers/hackathons/:id/start
  POST /api/v1/organizers/hackathons/:id/complete
  POST /api/v1/organizers/hackathons/:id/cancel
  Each requires a confirmation dialog before firing
```

### Acceptance Criteria
- [ ] Navigating to a hackathon no longer 404s
- [ ] Lifecycle buttons shown based on current status
- [ ] Confirmation required before status transitions
- [ ] Quick stats show real counts from database

---

---

## Branch 7 — `fix/organizer-participants-teams`

### Problem
Participants and Teams sidebar buttons navigate to an application error page (React render crash or missing page).

### Root Cause Investigation
Check browser console for the exact error. Likely causes:
- Page exists but API call returns unexpected shape → component crashes on undefined access
- Page does not exist at all (missing route)
- `getMyTeams()` nested shape not flattened (Known Bug #5)

### Cascade Prompt

**Step 1 — Gateway routes** (verify these exist):

```
GET /api/v1/organizers/hackathons/:id/participants
  Returns: paginated list of { studentProfile, registrationDate, status, teamId? }
  Query params: ?page=1&limit=20&status=REGISTERED|WITHDRAWN

GET /api/v1/organizers/hackathons/:id/teams
  Returns: list of { team, leader, members[], size, status }
  Include: member names, skills summary per team
```

**Step 2 — Frontend pages** (`new-dashboard-page`):

```
File: apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/participants/page.tsx
  Table columns: Name | University | Major | Skills | Registered Date | Team | Status
  Search bar: filter by name or university
  Pagination: 20 per page
  Export button: GET /api/v1/organizers/hackathons/:id/export → download CSV
  Empty state: "No participants yet. Share your hackathon link to get registrations."

File: apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/teams/page.tsx
  Card grid layout per team:
    Team name | Leader name | Member count / max size
    Member chips (avatar + name)
    Skills coverage chips
  Empty state: "No teams formed yet."
  Click team card → expand to show full member list inline
```

### Acceptance Criteria
- [ ] Participants page renders without crash
- [ ] Teams page renders without crash
- [ ] Real data from API — not mock data
- [ ] Pagination works on participants
- [ ] CSV export triggers file download

---

---

## Branch 8 — `feature/organizer-leaderboard-analytics`

### Problem
Leaderboard and Analytics sidebar buttons show "Currently Unavailable". Need to determine if DB data exists and implement if not.

### Cascade Prompt (full cascade — all 4 layers)

**Step 1 — Schema** (`db-schema-change`):

```prisma
// Add to schema.prisma if not present:
model HackathonSubmission {
  id               String          @id @default(cuid())
  teamId           String
  hackathonId      String
  projectName      String
  projectUrl       String?
  demoUrl          String?
  description      String?
  score            Float?          // Set by organizer during judging
  rank             Int?            // Computed after all scores entered
  submittedAt      DateTime        @default(now())
  team             Team            @relation(fields: [teamId], references: [id])
  hackathon        Hackathon       @relation(fields: [hackathonId], references: [id])
  @@unique([teamId, hackathonId])
}
```

Run: `npm run db:generate` then commit migration.

**Step 2 — Gateway routes** (`new-gateway-route`):

```
GET /api/v1/organizers/hackathons/:id/leaderboard
  Returns: ranked list of { rank, teamName, projectName, score, members[] }
  Sorted by score DESC, then submittedAt ASC for tiebreak
  If no submissions: return { leaderboard: [], message: "No submissions yet" }

GET /api/v1/organizers/hackathons/:id/analytics
  Returns:
    {
      totalParticipants: number,
      totalTeams: number,
      averageTeamSize: number,
      registrationsByDay: { date, count }[],      // for line chart
      skillDistribution: { skill, count }[],       // for bar chart
      participantsByUniversity: { uni, count }[],  // for pie chart
      teamFormationRate: number,                   // % of participants in a team
      sponsorshipTotal: number,
      statusCounts: { REGISTERED, WITHDRAWN, WAITLISTED }
    }

POST /api/v1/organizers/hackathons/:id/submissions/:submissionId/score
  Body: { score: z.number().min(0).max(100) }
  Updates submission.score, recomputes all ranks for this hackathon
```

**Step 3 — Frontend pages** (`new-dashboard-page`):

```
File: apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/leaderboard/page.tsx
  Top 3 podium display (gold/silver/bronze styling)
  Full ranked table below: Rank | Team | Project | Score | Members
  Score input per row (only for COMPLETED hackathons) — inline editable
  "Scores not final" banner shown when hackathon is still ACTIVE
  Empty state: "Leaderboard will appear once teams submit their projects"

File: apps/organizer-dashboard/src/app/dashboard/hackathons/[id]/analytics/page.tsx
  Use recharts (already in dependencies)
  Row 1 — Stat cards: Participants | Teams | Team Formation Rate | Sponsorship Total
  Row 2 — Line chart: Registrations over time (registrationsByDay)
  Row 3 left — Bar chart: Top 10 skills (skillDistribution)
  Row 3 right — Pie chart: Participants by university (top 5 + "Other")
  Empty state per chart if data insufficient (< 2 data points)
  "Analytics update in real-time" note
```

### Acceptance Criteria
- [ ] Analytics page shows real DB data (no mock)
- [ ] Charts render correctly with recharts
- [ ] Leaderboard shows "no submissions" state gracefully
- [ ] Organizer can score submissions on completed hackathons
- [ ] Ranks auto-update when scores are entered

---

---

## Branch 9 — `fix/organizer-settings`

### Problem
All buttons in the organizer settings page (profile update, password change, etc.) do not work.

### Cascade Prompt

**Gateway routes** (`new-gateway-route`):

```
PUT /api/v1/organizers/settings/profile
  Zod: { organizationName, website, bio, logoUrl }
  Service: update organizerProfile fields
  Success: 200 { success: true, data: { profile } }

POST /api/v1/organizers/settings/change-password
  Same logic as student change-password route
  Zod: { currentPassword, newPassword: z.string().min(8) }

POST /api/v1/organizers/settings/delete-account
  Zod: { password, confirmText: z.literal("DELETE") }
  Cascade: cancel all DRAFT/PUBLISHED hackathons, then delete account
```

**Frontend** (`new-dashboard-page`):

```
File: apps/organizer-dashboard/src/app/dashboard/settings/page.tsx
Tabs: Organization Profile | Security
  Organization Profile tab:
    Fields: Organization Name, Website URL, Bio, Logo URL (with preview)
    On save: PUT /api/v1/organizers/settings/profile
    On success: toast + re-fetch profile

  Security tab:
    Change password section (same pattern as student)
    Danger zone: delete account with warning
      "Deleting your account will cancel all your draft and published hackathons."
      Requires typing "DELETE" + password
```

### Acceptance Criteria
- [ ] Organizer can update organization profile
- [ ] Password change works end-to-end
- [ ] Delete account shows appropriate warning about hackathons
- [ ] All buttons show loading state during async operations

---

---

## Branch 10 — `fix/sponsor-confirmation-ux`

### Problem
"Confirm Sponsorship Request" button is active even for hackathons where the sponsor is already approved. Need clear state communication and ensure request correctly reaches organizer.

### Cascade Prompt

**Gateway route check** (`new-gateway-route`):

```
POST /api/v1/sponsors/sponsorships
  Verify: sponsorship does not already exist for this sponsor + hackathon combination
  If duplicate: return 409 { error: "ALREADY_SPONSORED", message: "You already have an active sponsorship for this hackathon" }
  Status flow: PENDING → (organizer approves) → APPROVED | (organizer rejects) → REJECTED

GET /api/v1/sponsors/sponsorships
  Return each sponsorship with status field: PENDING | APPROVED | REJECTED
```

**Frontend** (`new-dashboard-page`):

```
File: apps/sponsor-panel/src/app/dashboard/opportunities/page.tsx (or equivalent)

Per hackathon card, show sponsorship button state based on existing sponsorship:

No sponsorship → [Sponsor This Hackathon] button (active, opens modal)
Status PENDING  → [Request Pending] badge (amber, disabled)
                  Text: "Your sponsorship request is under review by the organizer."
Status APPROVED → [Sponsoring ✓] badge (green, disabled)
                  Text: "Your sponsorship has been approved. You are an official sponsor."
Status REJECTED → [Request Declined] badge (red)
                  Text: "Your request was not approved." + [Submit New Request] link

Sponsorship request modal:
  Fields: Budget Range (select: <$1k / $1k-5k / $5k-20k / $20k+), Message to organizer (textarea), Visibility preferences
  On submit: POST /api/v1/sponsors/sponsorships
  On 409: close modal, show toast "You have already submitted a request for this hackathon"
```

### Acceptance Criteria
- [ ] Already-approved sponsors cannot re-submit (button disabled with explanation)
- [ ] Pending state clearly communicated
- [ ] Rejected sponsors can submit a new request
- [ ] Request correctly creates a PENDING sponsorship that organizer can see

---

---

## Branch 11 — `feature/notifications-system`

### Problem
Notification bell (top-right) and profile avatar button do nothing in all three portals. No notification system exists.

### Cascade Prompt (full cascade)

**Step 1 — Schema** (`db-schema-change`):

```prisma
model Notification {
  id          String           @id @default(cuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  isRead      Boolean          @default(false)
  actionUrl   String?          // deep-link to relevant page
  metadata    Json?            // flexible payload per type
  createdAt   DateTime         @default(now())
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, isRead])
}

enum NotificationType {
  // Student
  TEAM_INVITATION_RECEIVED
  TEAM_INVITATION_ACCEPTED
  TEAM_INVITATION_REJECTED
  HACKATHON_REGISTRATION_CONFIRMED
  HACKATHON_CANCELLED
  HACKATHON_STARTING_SOON
  // Organizer
  SPONSORSHIP_REQUEST_RECEIVED
  TEAM_JOIN_REQUEST_RECEIVED          // if organizer controls team approval
  // Sponsor
  SPONSORSHIP_REQUEST_APPROVED
  SPONSORSHIP_REQUEST_REJECTED
  // General
  SYSTEM_ANNOUNCEMENT
}
```

Run: `npm run db:generate` then commit migration.

**Step 2 — Notification service** (shared, used by all route services):

```
File: apps/core-gateway/src/services/shared/notifications.service.ts

createNotification(userId, type, title, message, actionUrl?, metadata?):
  prisma.notification.create({ data: { userId, type, title, message, actionUrl, metadata } })

// Call this from within existing services whenever relevant events occur:
// e.g., after team invitation → createNotification(invitedUserId, TEAM_INVITATION_RECEIVED, ...)
// e.g., after organizer approves sponsorship → createNotification(sponsorUserId, SPONSORSHIP_REQUEST_APPROVED, ...)

Trigger points to add notifications:
  - teamsService.inviteMember() → notify invited student (TEAM_INVITATION_RECEIVED)
  - teamsService.acceptInvitation() → notify team leader (TEAM_INVITATION_ACCEPTED)
  - teamsService.rejectInvitation() → notify team leader (TEAM_INVITATION_REJECTED)
  - sponsorshipsService.createRequest() → notify organizer (SPONSORSHIP_REQUEST_RECEIVED)
  - sponsorshipsService.approveRequest() → notify sponsor (SPONSORSHIP_REQUEST_APPROVED)
  - sponsorshipsService.rejectRequest() → notify sponsor (SPONSORSHIP_REQUEST_REJECTED)
  - hackathonService.cancel() → notify all registered participants (HACKATHON_CANCELLED)
```

**Step 3 — Gateway routes** (`new-gateway-route`):

```
GET /api/v1/notifications
  Auth: requireAuth (any role)
  Query: ?page=1&limit=20&unreadOnly=false
  Returns: { notifications: Notification[], unreadCount: number, total: number }

PATCH /api/v1/notifications/:id/read
  Marks single notification as read

PATCH /api/v1/notifications/read-all
  Marks all user notifications as read

DELETE /api/v1/notifications/:id
  Deletes a notification
```

**Step 4 — Shared API** (`new-shared-api-function`):

```
File: libs/shared/api/src/notifications.ts

getNotifications(params): Promise<PaginatedNotifications>
markAsRead(id): Promise<void>
markAllAsRead(): Promise<void>
deleteNotification(id): Promise<void>
getUnreadCount(): Promise<{ count: number }>

Export from libs/shared/api/src/index.ts
```

**Step 5 — Frontend (all three portals)** (`new-dashboard-page`):

```
Component: libs/shared/ui/src/NotificationBell.tsx (shared across all portals)
  - Bell icon with unread count badge (red dot if > 0)
  - On click: dropdown panel showing latest 5 notifications
    Each item: icon (by type) | title | message preview | time ago | unread dot
    "Mark all as read" button at top of dropdown
    "View all notifications" link → /dashboard/notifications
  - Poll for unread count every 60 seconds (simple interval, not WebSocket)

Page: apps/[portal]/src/app/dashboard/notifications/page.tsx (in all 3 portals)
  Full paginated list of all notifications
  Filter tabs: All | Unread
  Each row: icon | title | full message | timestamp | read/unread state | delete button
  Click row → navigate to actionUrl + mark as read

Notification content per type:
  TEAM_INVITATION_RECEIVED  → "You've been invited to join [Team Name] for [Hackathon]" → /dashboard/teams
  TEAM_INVITATION_ACCEPTED  → "[Student] accepted your invitation to [Team Name]" → /dashboard/teams
  TEAM_INVITATION_REJECTED  → "[Student] declined your invitation to [Team Name]" → /dashboard/teams
  SPONSORSHIP_REQUEST_RECEIVED → "[Company] wants to sponsor [Hackathon] — Review request" → /dashboard/hackathons/:id
  SPONSORSHIP_REQUEST_APPROVED → "Your sponsorship for [Hackathon] has been approved!" → /dashboard/opportunities
  SPONSORSHIP_REQUEST_REJECTED → "Your sponsorship request for [Hackathon] was not approved" → /dashboard/opportunities
  HACKATHON_CANCELLED          → "[Hackathon] has been cancelled by the organizer" → /dashboard/hackathons
```

### Acceptance Criteria
- [ ] Bell shows unread count badge
- [ ] Dropdown shows latest 5 notifications
- [ ] Full notifications page works in all 3 portals
- [ ] Notifications created automatically on relevant events
- [ ] Mark as read works (single + all)
- [ ] Organizer sees sponsorship requests in notifications
- [ ] Sponsor sees approval/rejection in notifications
- [ ] Student sees team invitations in notifications

---

---

## Branch 12 — `feature/sponsor-hackathon-monitor`

### Problem
Sponsors have no way to monitor hackathons they sponsor — no analytics, no leaderboard visibility, no participant insights.

### Cascade Prompt

**Gateway routes** (`new-gateway-route`):

```
GET /api/v1/sponsors/hackathons/:id/overview
  Auth: requireAuth → requireSponsor
  Verify: sponsorship exists and status = APPROVED
  Returns:
    {
      hackathon: { title, status, dates, location },
      mySponsorship: { budget, tier, approvedAt },
      stats: { totalParticipants, totalTeams, topSkills[] },
      leaderboard: top 5 teams [{ rank, teamName, projectName, score? }]
    }
  Note: score only visible after hackathon COMPLETED
```

**Frontend** (`new-dashboard-page`):

```
File: apps/sponsor-panel/src/app/dashboard/sponsored/[id]/page.tsx
  Route accessible from: sponsor dashboard "My Sponsorships" → click hackathon

Sections:
  1. Header: hackathon title | status badge | my sponsorship tier badge
  2. Key stats row: Total Participants | Total Teams | Top Skill | Days Until Event
  3. Top Skills bar chart (recharts) — what skills this hackathon is attracting
     This is valuable for sponsors — they can see talent pool composition
  4. Leaderboard preview (top 5):
     If ACTIVE/PUBLISHED: "Leaderboard will be revealed after the hackathon ends"
     If COMPLETED: show ranked table with team name + project
  5. Participant University breakdown (pie chart) — geographic/academic reach
  6. My Sponsorship details card:
     Budget committed | Status | Approved date | Organizer contact

File: apps/sponsor-panel/src/app/dashboard/sponsored/page.tsx
  List of all approved sponsorships
  Each card: hackathon name | dates | status | my budget | [View Details] button
  Empty state: "Your approved sponsorships will appear here"
```

### Acceptance Criteria
- [ ] Only sponsors with APPROVED status can view hackathon details
- [ ] Stats are real data from database
- [ ] Charts render correctly
- [ ] Leaderboard hidden until hackathon COMPLETED
- [ ] Sponsors can navigate to this from their dashboard

---

---

## Branch 13 — `feature/profile-avatar-menu`

### Problem
Profile avatar / logo button in top-right of all three portals does nothing when clicked.

### Cascade Prompt

**Frontend only** (`new-dashboard-page`):

```
Component: libs/shared/ui/src/AvatarMenu.tsx (shared across all portals)

Dropdown contents:
  [Avatar / initials] [Display Name]  [Role badge]
  ─────────────────────────────────────
  View Profile → /dashboard/profile
  Settings     → /dashboard/settings
  ─────────────────────────────────────
  Sign Out     → POST /api/v1/auth/logout → clear Zustand → redirect /login

Avatar display logic:
  If user has avatarUrl: show <img>
  Else: show initials circle (first letter of firstName + lastName)
  Background color: deterministic from userId hash (always same color per user)

Sign Out behavior:
  Call POST /api/v1/auth/logout (clears httpOnly cookies server-side)
  Then: useAuthStore.getState().clearAuth()
  Then: router.push("/login")
  Show loading spinner on "Sign Out" item during async call

Integrate into: DashboardLayout navbar (top-right, next to NotificationBell)
Apply to all 3 portals by updating their DashboardLayout import
```

### Acceptance Criteria
- [ ] Avatar dropdown opens on click in all 3 portals
- [ ] Sign out clears cookies AND Zustand state
- [ ] Navigates to correct profile/settings pages per portal
- [ ] Avatar shows initials when no image set

---

---

## Branch 14 — `feature/general-ux-improvements`

### Problem
Various UX gaps that make the app feel unpolished: no loading skeletons, missing toast notifications, no empty states in several views.

### Implementation Checklist

This branch applies polish across all portals. No new routes needed.

**Toast notifications** — add to every async action that doesn't already have one:
```
Success toasts (green): "Saved", "Created", "Sent", "Registered", "Withdrawn"
Error toasts (red): Show error.message from API response, fallback to "Something went wrong"
Info toasts (blue): "Invitation sent", "Request submitted"
Toast duration: 4000ms, top-right position
Use existing toast library or add react-hot-toast (lightweight, no extra config)
```

**Loading skeletons** — replace spinner-only loading with skeletons on:
```
Hackathon list cards → pulse skeleton matching card shape
Team member list → row skeleton (avatar circle + two lines)
Profile page → section skeletons
Notifications dropdown → 3 skeleton rows while loading
Stats numbers → animated number counter on mount
```

**Empty states** — every list must have one:
```
No hackathons found → "No hackathons match your search" + clear filter button
No teams → "You haven't joined or created a team yet" + CTA
No notifications → Bell icon + "You're all caught up!"
No participants → Organizer-specific message with share link
No sponsors → "No sponsorships yet — share your hackathon to attract sponsors"
```

**Form improvements**:
```
All forms: show character count on textarea fields (max chars remaining)
All forms: prevent double-submission (disable button after first click until response)
Date fields: show "X days from now" helper text beneath date inputs
Password fields: show/hide toggle (eye icon)
```

**Navigation improvements**:
```
Breadcrumbs on deep pages: Dashboard > Hackathons > [Hackathon Name] > Participants
Active sidebar item highlighted based on current route (not just hardcoded)
Back button on detail pages (browser history.back())
```

**Accessibility basics**:
```
All icon-only buttons must have aria-label
All form inputs must have associated <label>
Focus ring visible on keyboard navigation (Tailwind focus-visible:ring-2)
```

---

---

## General Implementation Rules for All Branches

These apply to every branch above. Non-negotiable.

```
1. JWT = httpOnly cookies ONLY. Never Authorization header. (Critical Rule #1)
2. Always re-call getMyProfile() after profile mutations. (Critical Rule #6)
3. DashboardLayout does NOT redirect — only middleware.ts does. (Critical Rule #7)
4. Tailwind opacity: multiples of 5 only. (Critical Rule #9)
5. select option dark theme via globals.css only. (Critical Rule #10)
6. Docker rebuild: always --no-cache after source changes. (Critical Rule #11)
7. Express entry: apps/core-gateway/src/index.ts NOT src/main.ts. (Critical Rule #12)
8. Response shape: always { success: true, data } or { success: false, error, message }.
9. Every new route registered in src/index.ts with a comment showing the mount path.
10. Never commit directly to main. Branch from dev. PR to merge.
11. Conventional commits: fix: / feat: / chore: / docs:
12. db:push is DEV ONLY. Production uses prisma migrate deploy.
```

## PR Checklist (applies to every branch)

Before opening a PR:
- [ ] `nx build <app>` passes (with NODE_ENV=production)
- [ ] `nx test <app>` passes
- [ ] Docker rebuild tested: `docker compose build --no-cache <service>`
- [ ] No raw `fetch` or bare `axios` in frontend pages
- [ ] No token values in API response bodies
- [ ] All new buttons have disabled + loading state during async
- [ ] All new lists have an empty state
- [ ] No console.log statements committed
- [ ] ResponseHandler used for all gateway responses
