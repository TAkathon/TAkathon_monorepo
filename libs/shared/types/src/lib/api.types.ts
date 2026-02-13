// API request/response types

import { UserRole, ProficiencyLevel } from './user.types';
import { HackathonStatus } from './hackathon.types';
import { TeamStatus, InvitationStatus } from './team.types';

// Common API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// Auth endpoints
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
}

// Student profile endpoints
export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface AddSkillRequest {
  skillId: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience?: number;
}

// Hackathon endpoints
export interface CreateHackathonRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location?: string;
  isVirtual: boolean;
  maxParticipants?: number;
  maxTeamSize: number;
  minTeamSize: number;
  requiredSkills?: string[];
  prizePool?: string;
  rules?: string;
}

export interface UpdateHackathonRequest extends Partial<CreateHackathonRequest> {
  status?: HackathonStatus;
}

export interface JoinHackathonRequest {
  hackathonId: string;
}

// Team endpoints
export interface CreateTeamRequest {
  hackathonId: string;
  name: string;
  description?: string;
  maxSize: number;
  isPublic: boolean;
  projectIdea?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  status?: TeamStatus;
  projectIdea?: string;
}

export interface InviteToTeamRequest {
  userId: string;
  message?: string;
}

export interface RespondToInvitationRequest {
  invitationId: string;
  accept: boolean;
}

// Matching endpoints
export interface GetMatchSuggestionsRequest {
  teamId: string;
  limit?: number;
}

export interface GetMatchSuggestionsResponse {
  suggestions: Array<{
    candidateId: string;
    username: string;
    avatarUrl?: string;
    score: number;
    reasons: string[];
    skills: Array<{
      name: string;
      proficiency: ProficiencyLevel;
    }>;
  }>;
}
