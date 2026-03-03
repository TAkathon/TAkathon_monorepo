/**
 * Typed API functions for Team operations (student role).
 */

import api from "./client";
import type { ApiResponse } from "@takathon/shared/types";

// ─── Response types ───────────────────────────────────────────────────────────

export interface TeamSummary {
  id: string;
  name: string;
  hackathonId: string;
  hackathon?: { id: string; title: string; status: string };
  description?: string;
  status: "forming" | "complete" | "disbanded";
  maxSize: number;
  currentSize: number;
  isPublic: boolean;
  projectIdea?: string;
  createdAt: string;
  role?: "captain" | "member";
  members?: TeamMemberInfo[];
}

export interface TeamMemberInfo {
  id: string;
  userId: string;
  role: "captain" | "member";
  joinedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    skills?: Array<{ name: string; proficiencyLevel: string }>;
  };
}

// ─── Input types ─────────────────────────────────────────────────────────────

export interface CreateTeamInput {
  hackathonId: string;
  name: string;
  description?: string;
  maxSize?: number;
  isPublic?: boolean;
  projectIdea?: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
  projectIdea?: string;
  isPublic?: boolean;
}

// ─── Exported API functions ───────────────────────────────────────────────────

/** List all teams the student belongs to */
export async function getMyTeams(): Promise<TeamSummary[]> {
  const res = await api.get<ApiResponse<TeamSummary[]>>("/api/v1/students/teams");
  return res.data.data ?? [];
}

/** Get detailed info about a single team */
export async function getTeam(teamId: string): Promise<TeamSummary> {
  const res = await api.get<ApiResponse<TeamSummary>>(
    `/api/v1/students/teams/${teamId}`
  );
  return res.data.data!;
}

/** Create a new team for a hackathon */
export async function createTeam(data: CreateTeamInput): Promise<TeamSummary> {
  const res = await api.post<ApiResponse<TeamSummary>>(
    "/api/v1/students/teams",
    data
  );
  return res.data.data!;
}

/** Update team details (captain only) */
export async function updateTeam(
  teamId: string,
  data: UpdateTeamInput
): Promise<TeamSummary> {
  const res = await api.put<ApiResponse<TeamSummary>>(
    `/api/v1/students/teams/${teamId}`,
    data
  );
  return res.data.data!;
}

/** Disband a team (captain only) */
export async function disbandTeam(teamId: string): Promise<void> {
  await api.delete(`/api/v1/students/teams/${teamId}`);
}

/** Leave a team (non-captain members) */
export async function leaveTeam(teamId: string): Promise<void> {
  await api.post(`/api/v1/students/teams/${teamId}/leave`);
}

/** Send an invitation to another student */
export async function sendInvitation(
  teamId: string,
  data: { userId: string; message?: string }
): Promise<void> {
  await api.post(`/api/v1/students/teams/${teamId}/invite`, data);
}
