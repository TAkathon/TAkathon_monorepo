import api from "./client";

// ── Auth ────────────────────────────────────────────────────

export const authService = {
  register: (data: {
    email: string;
    username: string;
    fullName: string;
    password: string;
    role: string;
  }) => api.post("/api/v1/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/v1/auth/login", data),

  refresh: () => api.post("/api/v1/auth/refresh"),

  logout: () => api.post("/api/v1/auth/logout"),

  me: () => api.get("/api/v1/auth/me"),
};

// ── Students ────────────────────────────────────────────────

export const studentService = {
  // Profile
  getProfile: () => api.get("/api/v1/students/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/v1/students/profile", data),
  addSkill: (data: {
    skillId: string;
    proficiencyLevel: string;
    yearsOfExperience?: number;
  }) => api.post("/api/v1/students/skills", data),
  removeSkill: (id: string) => api.delete(`/api/v1/students/skills/${id}`),

  // Hackathons
  listHackathons: (params?: Record<string, string | number>) =>
    api.get("/api/v1/students/hackathons", { params }),
  getHackathon: (id: string) => api.get(`/api/v1/students/hackathons/${id}`),
  myHackathons: () => api.get("/api/v1/students/hackathons/mine"),
  registerForHackathon: (id: string) =>
    api.post(`/api/v1/students/hackathons/${id}/register`),
  withdrawFromHackathon: (id: string) =>
    api.post(`/api/v1/students/hackathons/${id}/withdraw`),

  // Teams
  myTeams: () => api.get("/api/v1/students/teams"),
  getTeam: (id: string) => api.get(`/api/v1/students/teams/${id}`),
  createTeam: (data: Record<string, unknown>) =>
    api.post("/api/v1/students/teams", data),
  updateTeam: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/v1/students/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/api/v1/students/teams/${id}`),
  inviteToTeam: (id: string, data: { inviteeId: string; message?: string }) =>
    api.post(`/api/v1/students/teams/${id}/invite`, data),
  myInvitations: () => api.get("/api/v1/students/teams/invitations"),
  respondToInvitation: (id: string, data: { response: "accept" | "reject" }) =>
    api.post(`/api/v1/students/teams/invitations/${id}/respond`, data),
  leaveTeam: (id: string) => api.post(`/api/v1/students/teams/${id}/leave`),

  // AI Matching
  getMatches: (teamId: string, limit?: number) =>
    api.get(`/api/v1/students/teams/${teamId}/matches`, { params: { limit } }),
  inviteMatch: (teamId: string, userId: string) =>
    api.post(`/api/v1/students/teams/${teamId}/matches/${userId}`),
};

// ── Organizers ──────────────────────────────────────────────

export const organizerService = {
  // Profile
  getProfile: () => api.get("/api/v1/organizers/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/v1/organizers/profile", data),

  // Hackathons
  myHackathons: () => api.get("/api/v1/organizers/hackathons"),
  getHackathon: (id: string) => api.get(`/api/v1/organizers/hackathons/${id}`),
  createHackathon: (data: Record<string, unknown>) =>
    api.post("/api/v1/organizers/hackathons", data),
  updateHackathon: (id: string, data: Record<string, unknown>) =>
    api.put(`/api/v1/organizers/hackathons/${id}`, data),
  publishHackathon: (id: string) =>
    api.post(`/api/v1/organizers/hackathons/${id}/publish`),
  updateHackathonStatus: (id: string, data: { status: string }) =>
    api.post(`/api/v1/organizers/hackathons/${id}/status`, data),
  cancelHackathon: (id: string) =>
    api.post(`/api/v1/organizers/hackathons/${id}/cancel`),

  // Participants & Teams
  listParticipants: (
    hackathonId: string,
    params?: Record<string, string | number>,
  ) =>
    api.get(`/api/v1/organizers/hackathons/${hackathonId}/participants`, {
      params,
    }),
  listTeams: (hackathonId: string, params?: Record<string, string | number>) =>
    api.get(`/api/v1/organizers/hackathons/${hackathonId}/teams`, { params }),
  getTeamDetail: (hackathonId: string, teamId: string) =>
    api.get(`/api/v1/organizers/hackathons/${hackathonId}/teams/${teamId}`),

  // Analytics
  getAnalytics: (hackathonId: string) =>
    api.get(`/api/v1/organizers/hackathons/${hackathonId}/analytics`),
  exportData: (hackathonId: string) =>
    api.get(`/api/v1/organizers/hackathons/${hackathonId}/export`),
};

// ── Sponsors ────────────────────────────────────────────────

export const sponsorService = {
  // Profile
  getProfile: () => api.get("/api/v1/sponsors/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.put("/api/v1/sponsors/profile", data),

  // Hackathons
  listHackathons: (params?: Record<string, string | number>) =>
    api.get("/api/v1/sponsors/hackathons", { params }),
  getHackathon: (id: string) => api.get(`/api/v1/sponsors/hackathons/${id}`),

  // Sponsorships
  mySponsorships: (params?: Record<string, string | number>) =>
    api.get("/api/v1/sponsors/hackathons/sponsorships", { params }),
  getSponsorshipDetail: (id: string) =>
    api.get(`/api/v1/sponsors/hackathons/sponsorships/${id}`),
  createSponsorship: (
    hackathonId: string,
    data: { tier: string; amount: number },
  ) => api.post(`/api/v1/sponsors/hackathons/${hackathonId}/sponsor`, data),
  cancelSponsorship: (id: string) =>
    api.post(`/api/v1/sponsors/hackathons/sponsorships/${id}/cancel`),

  // Teams
  listTeamsForHackathon: (
    hackathonId: string,
    params?: Record<string, string | number>,
  ) => api.get(`/api/v1/sponsors/hackathons/${hackathonId}/teams`, { params }),
  getTeamDetail: (id: string) => api.get(`/api/v1/sponsors/teams/${id}`),
  searchTeams: (params?: Record<string, string | number>) =>
    api.get("/api/v1/sponsors/teams/search", { params }),
};

// ── Shared / Public ─────────────────────────────────────────

export const publicService = {
  listHackathons: (params?: Record<string, string | number>) =>
    api.get("/api/v1/hackathons", { params }),
  getHackathon: (id: string) => api.get(`/api/v1/hackathons/${id}`),

  listSkills: (params?: Record<string, string>) =>
    api.get("/api/v1/skills", { params }),
  getSkillCategories: () => api.get("/api/v1/skills/categories"),
  getSkill: (id: string) => api.get(`/api/v1/skills/${id}`),
};
