import api from "./client";
import type { ApiResponse } from "@takathon/shared/types";

export type SponsorshipTier =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "other";

export interface SponsorHackathonItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  isVirtual?: boolean;
  maxParticipants?: number | null;
  prizePool?: string | null;
  websiteUrl?: string | null;
  requiredSkills?: string[];
  organizer?: {
    id: string;
    fullName: string;
    organization?: string;
    avatarUrl?: string;
  };
  _count?: { participants?: number; teams?: number; sponsorships?: number };
}

export interface CreateSponsorshipInput {
  tier: SponsorshipTier;
  amount: number;
}

export interface SponsorshipSummary {
  id: string;
  status: string;
  tier: SponsorshipTier;
  amount: number;
  hackathon?: {
    id: string;
    title: string;
    startDate?: string | null;
    endDate?: string | null;
  };
}

export async function listSponsorHackathons(): Promise<SponsorHackathonItem[]> {
  const response = await api.get<ApiResponse<any>>(
    "/api/v1/sponsors/hackathons",
  );
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return data as SponsorHackathonItem[];
  }
  return (data?.hackathons ?? []) as SponsorHackathonItem[];
}

export async function createSponsorship(
  hackathonId: string,
  payload: CreateSponsorshipInput,
): Promise<SponsorshipSummary> {
  const response = await api.post<ApiResponse<SponsorshipSummary>>(
    `/api/v1/sponsors/hackathons/${hackathonId}/sponsor`,
    payload,
  );
  return response.data.data as SponsorshipSummary;
}

export async function listMySponsorships(): Promise<SponsorshipSummary[]> {
  const response = await api.get<ApiResponse<any>>(
    "/api/v1/sponsors/hackathons/sponsorships",
  );
  const data = response.data?.data;
  if (Array.isArray(data)) {
    return data as SponsorshipSummary[];
  }
  return (data?.sponsorships ?? []) as SponsorshipSummary[];
}

export async function cancelSponsorship(
  sponsorshipId: string,
): Promise<SponsorshipSummary> {
  const response = await api.post<ApiResponse<SponsorshipSummary>>(
    `/api/v1/sponsors/hackathons/sponsorships/${sponsorshipId}/cancel`,
  );
  return response.data.data as SponsorshipSummary;
}
