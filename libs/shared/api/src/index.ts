export * from "./client";
export { default } from "./client";

// Typed domain API modules — use these instead of direct axios calls
export * as organizerApi from "./organizer";
export * as studentApi from "./student";
export * as hackathonApi from "./hackathon";
export * as teamApi from "./team";
export * as invitationApi from "./invitation";
