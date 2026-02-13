# TAkathon API Specification

**Base URL**: `/api/v1`  
**Version**: 1.0.0  
**Authentication**: JWT Bearer Token (except auth endpoints)

## Table of Contents

- [Authentication](#authentication)
- [Students](#students)
- [Organizers](#organizers)
- [Hackathons](#hackathons)
- [Teams](#teams)
- [Matching](#matching)
- [Skills](#skills)

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Authentication

### Register User
**POST** `/auth/register`

**Public**: Yes

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "username": "johndoe",
  "fullName": "John Doe",
  "role": "student"
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "username": "johndoe",
      "role": "student"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Login
**POST** `/auth/login`

**Public**: Yes

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123"
}
```

**Response** `200 OK`: Same as register

### Refresh Token
**POST** `/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh-token"
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

### Logout
**POST** `/auth/logout`

**Auth Required**: Yes

**Response** `200 OK`:
```json
{
  "success": true,
  "data": null
}
```

---

## Students

### Get My Profile
**GET** `/students/profile`

**Auth Required**: Yes (Student only)

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "bio": "Full-stack developer",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "skills": [
      {
        "skillId": "uuid",
        "name": "React",
        "category": "frontend",
        "proficiencyLevel": "advanced",
        "yearsOfExperience": 2
      }
    ],
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

### Update Profile
**PUT** `/students/profile`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "fullName": "John Doe",
  "bio": "Full-stack developer passionate about AI",
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

**Response** `200 OK`: Updated profile

### Add Skill
**POST** `/students/skills`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "skillId": "uuid",
  "proficiencyLevel": "advanced",
  "yearsOfExperience": 2
}
```

**Response** `201 Created`

### Remove Skill
**DELETE** `/students/skills/{skillId}`

**Auth Required**: Yes (Student only)

**Response** `204 No Content`

---

## Hackathons

### Create Hackathon
**POST** `/hackathons`

**Auth Required**: Yes (Organizer only)

**Request Body**:
```json
{
  "title": "AI Innovation Hackathon 2026",
  "description": "48-hour hackathon focused on AI solutions",
  "startDate": "2026-03-15T09:00:00Z",
  "endDate": "2026-03-17T18:00:00Z",
  "registrationDeadline": "2026-03-10T23:59:59Z",
  "location": "San Francisco, CA",
  "isVirtual": false,
  "maxParticipants": 200,
  "maxTeamSize": 5,
  "minTeamSize": 2,
  "requiredSkills": ["uuid1", "uuid2"],
  "prizePool": "$50,000"
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI Innovation Hackathon 2026",
    "status": "draft",
    ...
  }
}
```

### List Hackathons
**GET** `/hackathons?status=registration_open&page=1&perPage=20`

**Public**: Yes

**Query Parameters**:
- `status` - Filter by status (optional)
- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 20, max: 100)

**Response** `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "AI Innovation Hackathon 2026",
      "description": "...",
      "startDate": "2026-03-15T09:00:00Z",
      "status": "registration_open",
      "participantCount": 87,
      "teamCount": 18
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 45,
    "hasMore": true
  }
}
```

### Get Hackathon Details
**GET** `/hackathons/{id}`

**Public**: Yes

**Response** `200 OK`: Full hackathon object with stats

### Update Hackathon
**PUT** `/hackathons/{id}`

**Auth Required**: Yes (Organizer, owner only)

**Request Body**: Partial hackathon object

**Response** `200 OK`: Updated hackathon

### Join Hackathon
**POST** `/hackathons/{id}/join`

**Auth Required**: Yes (Student only)

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "participantId": "uuid",
    "hackathonId": "uuid",
    "userId": "uuid",
    "status": "registered",
    "registeredAt": "2026-02-11T14:00:00Z"
  }
}
```

### Leave Hackathon
**DELETE** `/hackathons/{id}/leave`

**Auth Required**: Yes (Student only)

**Response** `204 No Content`

### Get Hackathon Participants
**GET** `/hackathons/{id}/participants`

**Auth Required**: Yes (Organizer, owner only)

**Response** `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "username": "johndoe",
        "fullName": "John Doe"
      },
      "status": "in_team",
      "teamId": "uuid",
      "teamName": "Code Warriors"
    }
  ]
}
```

### Get Hackathon Teams
**GET** `/hackathons/{id}/teams`

**Auth Required**: Yes (Organizer, owner only)

**Response** `200 OK`: Array of teams with members

### Get Hackathon Stats
**GET** `/hackathons/{id}/stats`

**Auth Required**: Yes (Organizer, owner only)

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "totalParticipants": 150,
    "totalTeams": 32,
    "participantsWithoutTeam": 12,
    "averageTeamSize": 4.3,
    "skillDistribution": {
      "frontend": 45,
      "backend": 52,
      "design": 23
    }
  }
}
```

---

## Teams

### Create Team
**POST** `/teams`

**Auth Required**: Yes (Student only)

**Request Body**:
```json
{
  "hackathonId": "uuid",
  "name": "Code Warriors",
  "description": "Building an AI-powered task manager",
  "maxSize": 5,
  "isPublic": true,
  "projectIdea": "AI task prioritization app"
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Code Warriors",
    "hackathonId": "uuid",
    "creatorId": "uuid",
    "status": "forming",
    "currentSize": 1,
    "maxSize": 5,
    "members": [
      {
        "userId": "uuid",
        "username": "johndoe",
        "role": "captain"
      }
    ]
  }
}
```

### Get My Teams
**GET** `/teams/my`

**Auth Required**: Yes (Student only)

**Response** `200 OK`: Array of teams user is in

### Get Team Details
**GET** `/teams/{id}`

**Auth Required**: Yes

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Code Warriors",
    "hackathonId": "uuid",
    "status": "forming",
    "currentSize": 3,
    "maxSize": 5,
    "openSpots": 2,
    "members": [
      {
        "userId": "uuid",
        "username": "johndoe",
        "fullName": "John Doe",
        "role": "captain",
        "skills": ["React", "Node.js"]
      }
    ],
    "skillCoverage": {
      "frontend": 2,
      "backend": 1,
      "design": 0
    }
  }
}
```

### Update Team
**PUT** `/teams/{id}`

**Auth Required**: Yes (Team captain only)

**Request Body**:
```json
{
  "name": "AI Warriors",
  "description": "Updated description",
  "projectIdea": "Refined project idea"
}
```

**Response** `200 OK`: Updated team

### Invite to Team
**POST** `/teams/{id}/invite`

**Auth Required**: Yes (Team member)

**Request Body**:
```json
{
  "userId": "uuid",
  "message": "Would love to have you on our team!"
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "invitationId": "uuid",
    "teamId": "uuid",
    "inviteeId": "uuid",
    "status": "pending",
    "expiresAt": "2026-02-18T14:00:00Z"
  }
}
```

### Get Team Invitations
**GET** `/teams/invitations/received`

**Auth Required**: Yes (Student only)

**Response** `200 OK`: Array of pending invitations

### Respond to Invitation
**PATCH** `/teams/invitations/{id}`

**Auth Required**: Yes (Student, invitee only)

**Request Body**:
```json
{
  "accept": true
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "invitationId": "uuid",
    "status": "accepted",
    "teamId": "uuid"
  }
}
```

### Leave Team
**DELETE** `/teams/{id}/leave`

**Auth Required**: Yes (Team member, not captain)

**Response** `204 No Content`

### Remove Team Member
**DELETE** `/teams/{id}/members/{userId}`

**Auth Required**: Yes (Team captain only)

**Response** `204 No Content`

---

## Matching

### Get Teammate Suggestions
**POST** `/matching/suggest`

**Auth Required**: Yes (Team captain only)

**Request Body**:
```json
{
  "teamId": "uuid",
  "limit": 10
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "candidateId": "uuid",
        "username": "janedoe",
        "fullName": "Jane Doe",
        "avatarUrl": "https://...",
        "score": 0.89,
        "reasons": [
          "Fills frontend skill gap",
          "Advanced React experience",
          "Good team size balance"
        ],
        "skills": [
          {
            "name": "React",
            "proficiency": "expert",
            "category": "frontend"
          }
        ],
        "skillGaps": ["frontend", "design"],
        "commonSkills": ["JavaScript"]
      }
    ]
  }
}
```

---

## Skills

### List All Skills
**GET** `/skills?category=frontend`

**Public**: Yes

**Query Parameters**:
- `category` - Filter by category (optional)

**Response** `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "React",
      "category": "frontend",
      "description": "JavaScript library for building UIs"
    }
  ]
}
```

### Search Skills
**GET** `/skills/search?q=react`

**Public**: Yes

**Response** `200 OK`: Array of matching skills

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Standard endpoints**: 100 requests per minute
- **Search/List endpoints**: 50 requests per minute

---

## Versioning

API version is specified in the URL path (`/api/v1`). Breaking changes will increment the version number.

---

**Last Updated**: February 11, 2026
