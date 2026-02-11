// Application constants

export const APP_CONFIG = {
  APP_NAME: 'TAkathon',
  APP_DESCRIPTION: 'AI-powered hackathon team formation platform',
  APP_VERSION: '1.0.0',
} as const;

export const AUTH_CONFIG = {
  JWT_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d',
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

export const TEAM_CONFIG = {
  DEFAULT_MAX_TEAM_SIZE: 5,
  DEFAULT_MIN_TEAM_SIZE: 2,
  MAX_TEAM_SIZE_LIMIT: 10,
  INVITATION_EXPIRY_DAYS: 7,
} as const;

export const HACKATHON_CONFIG = {
  MIN_DURATION_HOURS: 12,
  MAX_DURATION_DAYS: 7,
  REGISTRATION_ADVANCE_MIN_DAYS: 1,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const SKILL_CATEGORIES = [
  'frontend',
  'backend',
  'design',
  'data_science',
  'mobile',
  'devops',
  'product_management',
  'other',
] as const;

export const PROFICIENCY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const;

export const USER_ROLES = ['student', 'organizer'] as const;

export const HACKATHON_STATUSES = [
  'draft',
  'registration_open',
  'registration_closed',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const TEAM_STATUSES = ['forming', 'complete', 'disbanded'] as const;

export const INVITATION_STATUSES = [
  'pending',
  'accepted',
  'rejected',
  'expired',
] as const;

export const PARTICIPANT_STATUSES = [
  'registered',
  'in_team',
  'withdrawn',
] as const;

export const MATCHING_CONFIG = {
  MIN_MATCH_SCORE: 0.6,
  MAX_SUGGESTIONS: 10,
  SKILL_WEIGHT: 0.4,
  EXPERIENCE_WEIGHT: 0.3,
  AVAILABILITY_WEIGHT: 0.3,
} as const;
