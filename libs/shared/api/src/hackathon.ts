/**
 * Typed API functions for public Hackathon endpoints (no role required).
 * Use these for the landing page, public browse, etc.
 */

import api from "./client";
import type { ApiResponse } from "@takathon/shared/types";

export interface PublicHackathon {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  maxTeamSize: number;
  minTeamSize: number;
  requiredSkills: string[];
  prizePool?: string;
  participantCount: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

/** List all published hackathons (public — no auth required) */
export async function listPublicHackathons(params?: {
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<PublicHackathon[]> {
  const res = await api.get<ApiResponse<PublicHackathon[]>>(
    "/api/v1/hackathons",
    { params }
  );
  return res.data.data ?? [];
}

/** Get single published hackathon detail (public) */
export async function getPublicHackathon(id: string): Promise<PublicHackathon> {
  const res = await api.get<ApiResponse<PublicHackathon>>(
    `/api/v1/hackathons/${id}`
  );
  return res.data.data!;
}

/** Get all available skills (taxonomy) */
export async function listSkills(): Promise<Skill[]> {
  const res = await api.get<ApiResponse<Skill[]>>("/api/v1/skills");
  return res.data.data ?? [];
}
