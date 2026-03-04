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
  createdAt?: string;
  hackathon?: {
    id: string;
    title: string;
    status?: string;
    startDate?: string | null;
    endDate?: string | null;
    organizer?: { id: string; fullName: string; organization?: string };
    _count?: { participants?: number; teams?: number };
  };
}

export interface HackathonOverview {
  hackathon: {
    id: string;
    title: string;
    status: string;
    startDate: string | null;
    endDate: string | null;
    location: string | null;
    isVirtual: boolean;
    organizer: {
      id: string;
      fullName: string;
      organization?: string;
      avatarUrl?: string;
      email?: string;
    };
  };
  mySponsorship: {
    id: string;
    tier: SponsorshipTier;
    amount: number;
    status: string;
    createdAt: string;
  };
  stats: {
    totalParticipants: number;
    totalTeams: number;
    topSkills: { name: string; count: number }[];
  };
  leaderboard: {
    rank: number;
    teamName: string;
    projectIdea: string | null;
    memberCount: number;
  }[];
  universityBreakdown: { university: string; count: number }[];
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

export async function getHackathonOverview(
  hackathonId: string,
): Promise<HackathonOverview> {
  const response = await api.get<ApiResponse<HackathonOverview>>(
    `/api/v1/sponsors/hackathons/${hackathonId}/overview`,
  );
  return response.data.data as HackathonOverview;
}

export async function listMySponsorshipsDetailed(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  sponsorships: SponsorshipSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const response = await api.get<ApiResponse<any>>(
    `/api/v1/sponsors/hackathons/sponsorships?${query.toString()}`,
  );
  const data = response.data?.data;
  return {
    sponsorships: (data?.sponsorships ??
      (Array.isArray(data) ? data : [])) as SponsorshipSummary[],
    pagination: data?.pagination ?? {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  };
}
