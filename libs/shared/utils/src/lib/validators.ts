// Validation utilities

import { AUTH_CONFIG, TEAM_CONFIG } from './constants';

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  GITHUB_URL: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
  LINKEDIN_URL: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/,
};

export const isValidEmail = (email: string): boolean => {
  return REGEX_PATTERNS.EMAIL.test(email);
};

export const isValidUsername = (username: string): boolean => {
  if (
    username.length < AUTH_CONFIG.USERNAME_MIN_LENGTH ||
    username.length > AUTH_CONFIG.USERNAME_MAX_LENGTH
  ) {
    return false;
  }
  return REGEX_PATTERNS.USERNAME.test(username);
};

export const isValidPassword = (password: string): boolean => {
  if (
    password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH ||
    password.length > AUTH_CONFIG.PASSWORD_MAX_LENGTH
  ) {
    return false;
  }
  // At least one uppercase, one lowercase, one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
};

export const isValidUrl = (url: string): boolean => {
  return REGEX_PATTERNS.URL.test(url);
};

export const isValidGithubUrl = (url: string): boolean => {
  return REGEX_PATTERNS.GITHUB_URL.test(url);
};

export const isValidLinkedInUrl = (url: string): boolean => {
  return REGEX_PATTERNS.LINKEDIN_URL.test(url);
};

export const isValidTeamSize = (size: number): boolean => {
  return (
    size >= TEAM_CONFIG.DEFAULT_MIN_TEAM_SIZE &&
    size <= TEAM_CONFIG.MAX_TEAM_SIZE_LIMIT
  );
};

export const isValidDateRange = (startDate: Date, endDate: Date): boolean => {
  return endDate > startDate;
};

export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequiredFields = (
  data: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(
    (field) => !data[field] || data[field] === ''
  );
  return {
    valid: missingFields.length === 0,
    missingFields,
  };
};
