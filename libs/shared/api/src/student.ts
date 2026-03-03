/**
 * Typed API functions for the Student role.
 * All frontend student pages MUST use these functions instead of bare axios calls.
 */

import api from "./client";
import type { ApiResponse } from "@takathon/shared/types";

// ─── Response types ───────────────────────────────────────────────────────────

export type AvailabilitySlot =
  | "weekday_morning"
  | "weekday_afternoon"
  | "weekday_evening"
  | "weekend_morning"
  | "weekend_afternoon"
  | "weekend_evening";

export interface AvailabilityData {
  timezone: string;
  hoursPerWeek: number;
  preferredSlots: AvailabilitySlot[];
}

export interface StudentProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  studentProfile?: {
    university?: string;
    degree?: string;
    graduationYear?: number;
    resumeUrl?: string;
  };
  availability?: AvailabilityData | null;
  skills: Array<{
    id: string;
    skillId: string;
    proficiencyLevel: string;
    yearsOfExperience?: number;
    skill: { id: string; name: string; category: string };
  }>;
}

export interface StudentHackathonSummary {
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
  requiredSkills: string[];
  participantCount: number;
  isRegistered?: boolean;
}

export interface RegistrationResult {
  id: string;
  hackathonId: string;
  userId: string;
  status: string;
  registeredAt: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
  availability?: AvailabilityData | null;
}

export interface AddSkillInput {
  skillId: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** Get the authenticated student's full profile */
export async function getMyProfile(): Promise<StudentProfile> {
  const res = await api.get<ApiResponse<StudentProfile>>(
    "/api/v1/students/profile"
  );
  return res.data.data!;
}

/** Update the authenticated student's profile */
export async function updateMyProfile(
  data: UpdateProfileInput
): Promise<StudentProfile> {
  const res = await api.put<ApiResponse<StudentProfile>>(
    "/api/v1/students/profile",
    data
  );
  return res.data.data!;
}

/** Add a skill to the student's profile */
export async function addSkill(data: AddSkillInput): Promise<void> {
  await api.post("/api/v1/students/skills", data);
}

/** Remove a skill from the student's profile */
export async function removeSkill(skillId: string): Promise<void> {
  await api.delete(`/api/v1/students/skills/${skillId}`);
}

// ─── Hackathons ───────────────────────────────────────────────────────────────

/** Browse all published hackathons */
export async function browseHackathons(params?: {
  status?: string;
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<StudentHackathonSummary[]> {
  const res = await api.get<ApiResponse<StudentHackathonSummary[]>>(
    "/api/v1/students/hackathons",
    { params }
  );
  return res.data.data ?? [];
}

/** Get single hackathon detail (student view) */
export async function getHackathon(id: string): Promise<StudentHackathonSummary> {
  const res = await api.get<ApiResponse<StudentHackathonSummary>>(
    `/api/v1/students/hackathons/${id}`
  );
  return res.data.data!;
}

/** List hackathons the student is registered for */
export async function getMyHackathons(): Promise<StudentHackathonSummary[]> {
  const res = await api.get<ApiResponse<StudentHackathonSummary[]>>(
    "/api/v1/students/hackathons/mine"
  );
  return res.data.data ?? [];
}

/** Register for a hackathon */
export async function registerForHackathon(hackathonId: string): Promise<RegistrationResult> {
  const res = await api.post<ApiResponse<RegistrationResult>>(
    `/api/v1/students/hackathons/${hackathonId}/register`
  );
  return res.data.data!;
}

/** Withdraw from a hackathon */
export async function withdrawFromHackathon(hackathonId: string): Promise<void> {
  await api.post(`/api/v1/students/hackathons/${hackathonId}/withdraw`);
}
