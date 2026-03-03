# TAkathon API Specification

**Last Updated**: March 3, 2026
**Base URL**: `http://localhost:8000` (development)
**Version**: v1

---

## Authentication

All communication uses **httpOnly cookies**. There is no `Authorization: Bearer` header.

### Cookie Names

| Cookie          | Lifetime | Description                     |
|-----------------|----------|---------------------------------|
| `accessToken`   | 15 min   | JWT — used for all API calls    |
| `refreshToken`  | 7 days   | JWT — used to refresh access    |

### Client Requirements

- All fetch/XHR requests must include `credentials: "include"`
- Axios clients must have `withCredentials: true`
- On 401 response: POST `/api/v1/auth/refresh` then retry original request
- On refresh failure: redirect user to `/login`

### Response Shape

All endpoints return:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "ERROR_CODE", "message": "Human-readable message" }
```

---

## Auth Endpoints

`/api/v1/auth/*` — No authentication required

### `POST /api/v1/auth/register`

**Rate Limited**: 10 req / 15 min

```json
// Request
{
  "email": "alice@example.com",
  "password": "password123",
  "firstName": "Alice",
  "lastName": "Smith",
  "role": "STUDENT"  // STUDENT | ORGANIZER | SPONSOR
}

// Response 201 — sets accessToken + refreshToken cookies
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "STUDENT" }
  }
}
```

---

### `POST /api/v1/auth/login`

**Rate Limited**: 10 req / 15 min

```json
// Request
{ "email": "alice@example.com", "password": "password123" }

// Response 200 — sets accessToken + refreshToken cookies
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "STUDENT", "firstName": "Alice" }
  }
}
```

---

### `POST /api/v1/auth/refresh`

Rotates the `accessToken` cookie using the `refreshToken` cookie.

```
// Response 200 — sets new accessToken cookie
{ "success": true, "data": {} }

// Response 401 — refreshToken expired or invalid
{ "success": false, "error": "INVALID_REFRESH_TOKEN" }
```

---

### `POST /api/v1/auth/logout`

Clears both cookies.

```
// Response 200
{ "success": true, "data": {} }
```

---

### `GET /api/v1/auth/me`

Returns the currently authenticated user. Use this to verify a session is live (not just the Zustand store).

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "...",
    "email": "alice@example.com",
    "role": "STUDENT",
    "firstName": "Alice",
    "lastName": "Smith"
  }
}

// Response 401 — no valid cookie
{ "success": false, "error": "UNAUTHORIZED" }
```

---

## Student Endpoints

`/api/v1/students/*` — Requires `STUDENT` role

### Profile

#### `GET /api/v1/students/profile`

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "...",
    "bio": "Full-stack developer",
    "university": "MIT",
    "graduationYear": 2026,
    "skills": [
      { "id": "skill-id", "name": "JavaScript", "category": "...", "proficiency": "ADVANCED" }
    ],
    "availability": {
      "timezone": "UTC+1",
      "hoursPerWeek": 20,
      "preferredSlots": ["weekday_evening", "weekend_morning"]
    }
  }
}
```

#### `PUT /api/v1/students/profile`

```json
// Request (all fields optional)
{
  "bio": "...",
  "university": "...",
  "graduationYear": 2026,
  "availability": {
    "timezone": "UTC+0",
    "hoursPerWeek": 15,
    "preferredSlots": ["weekday_morning", "weekend_afternoon"]
  }
}
```

---

### Skills

#### `POST /api/v1/students/skills`

```json
// Request
{ "skillId": "skill-uuid", "proficiency": "INTERMEDIATE" }

// Response 200
{ "success": true, "data": { "id": "...", "skillId": "...", "proficiency": "INTERMEDIATE" } }
```

#### `DELETE /api/v1/students/skills/:userSkillId`

```
// Response 200
{ "success": true, "data": {} }
```

---

### Hackathons

#### `GET /api/v1/students/hackathons`

Returns public hackathons with per-hackathon flags for the current student.

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Spring Innovation",
      "status": "PUBLISHED",
      "registrationDeadline": "2026-03-15T00:00:00Z",
      "isRegistered": true,
      "isInTeam": false
    }
  ]
}
```

**`isInTeam: true`** blocks withdrawal — UI should show "In Team — leave team to withdraw" instead of a Withdraw button.

#### `POST /api/v1/students/hackathons/:id/register`

```
// Response 200
{ "success": true, "data": { "participantId": "..." } }

// Response 409 — already registered
{ "success": false, "error": "ALREADY_REGISTERED" }
```

#### `DELETE /api/v1/students/hackathons/:id/withdraw`

```
// Response 200
{ "success": true, "data": {} }

// Response 400 — student is in a team for this hackathon
{ "success": false, "error": "IN_TEAM", "message": "Leave your team before withdrawing." }
```

---

### Teams

> ⚠️ **Response shape is nested** — see Issue #11 in `docs/code-audit.md` for the flatten pattern.

#### `GET /api/v1/students/teams`

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "membershipId": "...",
      "role": "captain",
      "joinedAt": "2026-02-01T00:00:00Z",
      "team": {
        "id": "...",
        "name": "Code Warriors",
        "hackathonId": "...",
        "status": "forming",
        "maxSize": 4,
        "openSpots": 2,
        "members": [
          { "userId": "...", "firstName": "Alice", "role": "captain" }
        ]
      }
    }
  ]
}
```

#### `GET /api/v1/students/teams/:id`

Returns single team (same nested structure, unwrapped).

#### `POST /api/v1/students/teams`

```json
// Request
{
  "name": "Team Name",
  "hackathonId": "hackathon-uuid",
  "description": "Optional description",
  "maxSize": 4
}
```

#### `POST /api/v1/students/teams/:id/invite`

```json
// Request
{ "userId": "user-uuid-to-invite" }
```

#### `DELETE /api/v1/students/teams/:id/leave`

Non-captain leaves team.

#### `DELETE /api/v1/students/teams/:id`

Captain disbands team (only when `status === "forming"`).

---

### AI Matching

> ⚠️ **Route**: `/api/v1/students/matching/:teamId/matches` — NOT `/students/teams/:teamId/matches`

#### `GET /api/v1/students/matching/:teamId/matches`

Returns AI-ranked teammate suggestions for the given team.

```json
// Request query params (optional)
?limit=10

// Response 200
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "userId": "...",
        "firstName": "Bob",
        "score": 0.87,
        "breakdown": {
          "skillScore": 0.9,
          "experienceScore": 0.8,
          "availabilityScore": 0.6
        },
        "explanation": "Bob brings React and Node.js skills your team lacks...",
        "skills": [ { "name": "React", "proficiency": "ADVANCED" } ]
      }
    ],
    "fallback": false
  }
}
```

`fallback: true` means the AI engine was unreachable and the gateway used local `basicScoring()`.

#### `POST /api/v1/students/matching/:teamId/matches/:userId`

Sends a team invitation to the matched user.

```
// Response 200
{ "success": true, "data": { "invitationId": "..." } }
```

---

## Organizer Endpoints

`/api/v1/organizers/*` — Requires `ORGANIZER` role

### Hackathons

#### Lifecycle Transitions

```
DRAFT → [publish] → PUBLISHED → [start] → ACTIVE → [complete] → COMPLETED
                 ↘ [cancel] → CANCELLED        ↘ [cancel] → CANCELLED
```

```
POST /api/v1/organizers/hackathons/:id/publish   → DRAFT → PUBLISHED
POST /api/v1/organizers/hackathons/:id/start     → PUBLISHED → ACTIVE
POST /api/v1/organizers/hackathons/:id/complete  → ACTIVE → COMPLETED
POST /api/v1/organizers/hackathons/:id/cancel    → any → CANCELLED
```

#### `GET /api/v1/organizers/hackathons/:id/export`

Returns CSV of all participants. `Content-Type: text/csv`, `Content-Disposition: attachment; filename=participants-{id}.csv`.

---

## Sponsor Endpoints

`/api/v1/sponsors/*` — Requires `SPONSOR` role

Standard CRUD for profile, hackathon browsing, sponsoring events, viewing teams and projects. See `docs/architecture.md` for the full endpoint table.

---

## Public / Shared Endpoints

No authentication required.

### `GET /api/v1/hackathons`

Public list of PUBLISHED hackathons.

### `GET /api/v1/hackathons/:id`

Single hackathon detail (must be PUBLISHED).

### `GET /api/v1/skills`

Full skill taxonomy (36 skills in 8 categories).

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "JavaScript",
      "category": "Frontend",
      "description": "..."
    }
  ]
}
```

### `GET /api/v1/health`

```json
{ "status": "ok", "timestamp": "2026-03-03T..." }
```

---

## Error Codes Reference

| Code                  | Status | Description                                  |
|-----------------------|--------|----------------------------------------------|
| `UNAUTHORIZED`        | 401    | No valid session / cookie                    |
| `FORBIDDEN`           | 403    | Wrong role for this endpoint                 |
| `NOT_FOUND`           | 404    | Resource not found                           |
| `ALREADY_REGISTERED`  | 409    | Student already registered for hackathon     |
| `IN_TEAM`             | 400    | Cannot withdraw while in a team              |
| `INVALID_REFRESH_TOKEN` | 401  | Refresh token expired or tampered            |
| `VALIDATION_ERROR`    | 422    | Zod validation failed (see `details` field)  |
| `RATE_LIMITED`        | 429    | Too many requests (auth endpoints)           |
| `INTERNAL_ERROR`      | 500    | Unexpected server error                     |

---

## Availability Slots Reference

Valid values for `studentProfile.availability.preferredSlots`:

| Slot Key              | Description                |
|-----------------------|----------------------------|
| `weekday_morning`     | Mon–Fri, 6am–12pm          |
| `weekday_afternoon`   | Mon–Fri, 12pm–6pm          |
| `weekday_evening`     | Mon–Fri, 6pm–midnight      |
| `weekend_morning`     | Sat–Sun, 6am–12pm          |
| `weekend_afternoon`   | Sat–Sun, 12pm–6pm          |
| `weekend_evening`     | Sat–Sun, 6pm–midnight      |
