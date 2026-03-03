export * from "./client";
export { default } from "./client";

// Typed domain API modules — use these instead of direct axios calls
export * as organizerApi from "./organizer";
export * as studentApi from "./student";
export * as hackathonApi from "./hackathon";
export * as teamApi from "./team";
export * as invitationApi from "./invitation";
export * as matchingApi from "./matching";

// Re-export matching types for convenience
export type { MatchSuggestion, MatchResult, ScoreBreakdown } from "./matching";

// Re-export student types
export type { AvailabilityData, AvailabilitySlot, StudentHackathonSummary } from "./student";

// Re-export organizer types
export type { OrganizerHackathonSummary } from "./organizer";
