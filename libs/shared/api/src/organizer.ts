/**
 * Typed API functions for the Organizer role.
 * All frontend organizer pages MUST use these functions instead of bare axios calls.
 */

import api from "./client";
import type {
  Hackathon,
  HackathonParticipant,
  ApiResponse,
} from "@takathon/shared/types";

// ─── Input types ─────────────────────────────────────────────────────────────

export interface CreateHackathonInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location?: string;
  isVirtual?: boolean;
  maxParticipants?: number;
  maxTeamSize?: number;
  minTeamSize?: number;
  requiredSkills?: string[];
  prizePool?: string;
  rules?: string;
  bannerUrl?: string;
  websiteUrl?: string;
}

export type UpdateHackathonInput = Partial<CreateHackathonInput>;

// ─── Response types ───────────────────────────────────────────────────────────

export interface OrganizerHackathonSummary {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  participantCount: number;
  teamCount: number;
  sponsorCount: number;
  createdAt: string;
}

export interface ParticipantDetail {
  id: string;
  userId: string;
  status: string;
  registeredAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    skills: Array<{ name: string; proficiencyLevel: string }>;
  };
  team?: { id: string; name: string; currentSize: number };
}

// ─── Exported API functions ───────────────────────────────────────────────────

/** List all hackathons created by the authenticated organizer */
export async function listMyHackathons(): Promise<OrganizerHackathonSummary[]> {
  const res = await api.get<ApiResponse<OrganizerHackathonSummary[]>>(
    "/api/v1/organizers/hackathons"
  );
  return res.data.data ?? [];
}

/** Get full hackathon details (organizer view) */
export async function getMyHackathon(id: string): Promise<Hackathon> {
  const res = await api.get<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}`
  );
  return res.data.data!;
}

/** Create a new hackathon */
export async function createHackathon(
  data: CreateHackathonInput
): Promise<Hackathon> {
  const res = await api.post<ApiResponse<Hackathon>>(
    "/api/v1/organizers/hackathons",
    data
  );
  return res.data.data!;
}

/** Update an existing hackathon (must still be in a mutable state) */
export async function updateHackathon(
  id: string,
  data: UpdateHackathonInput
): Promise<Hackathon> {
  const res = await api.patch<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}`,
    data
  );
  return res.data.data!;
}

/** Publish a hackathon — transitions status from draft → registration_open */
export async function publishHackathon(id: string): Promise<Hackathon> {
  const res = await api.post<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}/publish`
  );
  return res.data.data!;
}

/** Start a hackathon — transitions status to in_progress */
export async function startHackathon(id: string): Promise<Hackathon> {
  const res = await api.post<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}/start`
  );
  return res.data.data!;
}

/** Complete a hackathon — transitions status to completed */
export async function completeHackathon(id: string): Promise<Hackathon> {
  const res = await api.post<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}/complete`
  );
  return res.data.data!;
}

/** Cancel a hackathon */
export async function cancelHackathon(id: string): Promise<Hackathon> {
  const res = await api.post<ApiResponse<Hackathon>>(
    `/api/v1/organizers/hackathons/${id}/cancel`
  );
  return res.data.data!;
}

/** Get the full participant list for a hackathon */
export async function getParticipants(
  hackathonId: string
): Promise<ParticipantDetail[]> {
  const res = await api.get<ApiResponse<ParticipantDetail[]>>(
    `/api/v1/organizers/hackathons/${hackathonId}/participants`
  );
  return res.data.data ?? [];
}
