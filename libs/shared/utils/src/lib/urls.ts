export function getLandingUrl() {
  return process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";
}

export function getStudentUrl() {
  return process.env.NEXT_PUBLIC_STUDENT_URL || "http://localhost:3001";
}

export function getOrganizerUrl() {
  return process.env.NEXT_PUBLIC_ORGANIZER_URL || "http://localhost:3002";
}

export function getSponsorUrl() {
  return process.env.NEXT_PUBLIC_SPONSOR_URL || "http://localhost:3003";
}
