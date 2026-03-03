/**
 * Typed API functions for AI Teammate Matching (student role).
 *
 * The gateway exposes these on:
 *   GET  /api/v1/students/teams/:teamId/matches          → suggestTeammates
 *   POST /api/v1/students/teams/:teamId/matches/:userId  → inviteMatch
 */

import api from "./client";

// ─── Response types ───────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  skill: number;
  experience: number;
  availability: number;
}

export interface MatchSuggestion {
  candidateId: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  /** Composite score in [0.0, 1.0] — higher is better */
  score: number;
  scoreBreakdown: ScoreBreakdown;
  /** Human-readable explanation of the score */
  explanation: string;
  skills: Array<{ name: string; proficiency: string }>;
  /** Skills the candidate has that the team does not */
  complementarySkills: string[];
}

export interface MatchResult {
  suggestions: MatchSuggestion[];
  totalCandidates: number;
  /** True when the AI engine was unavailable and the gateway used local scoring */
  fallback?: boolean;
}

// ─── API calls ───────────────────────────────────────────────────────────────

/**
 * Fetch AI-powered teammate suggestions for a team.
 *
 * @param teamId  UUID of the team to find candidates for.
 * @param limit   Maximum number of suggestions to return (default 5).
 */
export async function suggestTeammates(
  teamId: string,
  limit = 5,
): Promise<MatchResult> {
  const resp = await api.get(`/students/teams/${teamId}/matches`, {
    params: { limit },
  });
  // Gateway wraps in { success, data }
  return resp.data.data as MatchResult;
}

/**
 * Invite a candidate discovered through AI matching.
 *
 * @param teamId  UUID of the team.
 * @param userId  UUID of the candidate to invite.
 */
export async function inviteMatch(
  teamId: string,
  userId: string,
): Promise<{ id: string; status: string }> {
  const resp = await api.post(`/students/teams/${teamId}/matches/${userId}`);
  return resp.data.data;
}
