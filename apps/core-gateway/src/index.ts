import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./routes/auth";
import studentProfileRouter from "./routes/students/profile";
import studentHackathonsRouter from "./routes/students/hackathons";
import studentTeamsRouter from "./routes/students/teams";
import studentMatchingRouter from "./routes/students/matching";
import organizerProfileRouter from "./routes/organizers/profile";
import organizerHackathonsRouter from "./routes/organizers/hackathons";
import organizerParticipantsRouter from "./routes/organizers/participants";
import organizerAnalyticsRouter from "./routes/organizers/analytics";
import sponsorProfileRouter from "./routes/sponsors/profile";
import sponsorHackathonsRouter from "./routes/sponsors/hackathons";
import sponsorTeamsRouter from "./routes/sponsors/teams";
import sharedHackathonsRouter from "./routes/shared/hackathons";
import sharedSkillsRouter from "./routes/shared/skills";
import { requestLogger, logStartup } from "./middleware/logger";
import { ResponseHandler } from "./utils/response";

dotenv.config({ path: path.resolve(process.cwd(), "apps/core-gateway/.env") });

// ─── Critical ENV var guard ───────────────────────────────────────────────────
// These variables must never be undefined at startup. In production a missing
// secret is always a deployment misconfiguration and should prevent the server
// from starting rather than silently falling back to a weak default.
const REQUIRED_ENV: Record<string, string> = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const missingVars = Object.entries(REQUIRED_ENV)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingVars.length > 0) {
  if (IS_PRODUCTION) {
    console.error(`[startup] FATAL: Missing required environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  } else {
    console.warn(`[startup] WARNING: Missing env vars (using insecure dev defaults): ${missingVars.join(", ")}`);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

// Default dev origins when CORS_ORIGINS env var is not set
const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:4200",
];

const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// In dev mode, fall back to DEV_ORIGINS if CORS_ORIGINS is not configured
const allowedOrigins = CORS_ORIGINS.length > 0 ? CORS_ORIGINS : IS_PRODUCTION ? [] : DEV_ORIGINS;

if (!IS_PRODUCTION && CORS_ORIGINS.length === 0) {
  console.warn("[CORS] CORS_ORIGINS not set — allowing default localhost origins for development:", DEV_ORIGINS.join(", "));
}

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow server-to-server requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        return callback(new Error("CORS not configured — set CORS_ORIGINS env var"), false);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin '${origin}' not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get("/", (_req, res) => {
  ResponseHandler.success(res, {
    message: "Welcome to TAkathon Core Gateway API",
    version: "1.0.0",
    health: "/api/v1/health",
  });
});

app.get("/api/v1/health", (_req, res) => {
  ResponseHandler.success(res, { ok: true, service: "core-gateway" });
});

// --- Auth ---
app.use("/api/v1/auth", authRouter);

// --- Student routes ---
app.use("/api/v1/students", studentProfileRouter);
app.use("/api/v1/students/hackathons", studentHackathonsRouter);
app.use("/api/v1/students/teams", studentTeamsRouter);
app.use("/api/v1/students/matching", studentMatchingRouter);

// --- Organizer routes ---
app.use("/api/v1/organizers", organizerProfileRouter);
// NOTE: Three routers share the same base path intentionally.
// Each defines unique sub-paths:
//   organizerHackathonsRouter   → /, /:id, /:id/publish, /:id/cancel, etc.
//   organizerParticipantsRouter → /:id/participants, /:id/teams, /:id/teams/:teamId
//   organizerAnalyticsRouter    → /:id/analytics, /:id/export
app.use("/api/v1/organizers/hackathons", organizerHackathonsRouter);
app.use("/api/v1/organizers/hackathons", organizerParticipantsRouter);
app.use("/api/v1/organizers/hackathons", organizerAnalyticsRouter);

// --- Sponsor routes ---
app.use("/api/v1/sponsors", sponsorProfileRouter);
app.use("/api/v1/sponsors/hackathons", sponsorHackathonsRouter);
app.use("/api/v1/sponsors/teams", sponsorTeamsRouter);

// --- Shared/public routes ---
app.use("/api/v1/hackathons", sharedHackathonsRouter);
app.use("/api/v1/skills", sharedSkillsRouter);

app.listen(PORT);
logStartup(PORT, allowedOrigins);
