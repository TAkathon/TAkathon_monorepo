import type { UserRole } from "./authStore";
import { getLandingUrl, getStudentUrl, getOrganizerUrl, getSponsorUrl } from "./urls";

export function getRedirectUrl(role: UserRole): string {
  if (role === "student") return `${getStudentUrl()}/`;
  if (role === "organizer") return `${getOrganizerUrl()}/`;
  if (role === "sponsor") return `${getSponsorUrl()}/dashboard`;
  return `${getLandingUrl()}/login`;
}
