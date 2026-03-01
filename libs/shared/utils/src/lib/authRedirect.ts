import { UserRole } from "@takathon/shared/types";
import { getLandingUrl, getStudentUrl, getOrganizerUrl, getSponsorUrl } from "./urls";

export function getRedirectUrl(role: UserRole): string {
  if (role === UserRole.STUDENT) return `${getStudentUrl()}/dashboard`;
  if (role === UserRole.ORGANIZER) return `${getOrganizerUrl()}/`;
  if (role === UserRole.SPONSOR) return `${getSponsorUrl()}/dashboard`;
  return `${getLandingUrl()}/login`;
}
