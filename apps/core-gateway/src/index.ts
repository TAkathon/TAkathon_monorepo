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
import { requestLogger, logStartup } from "./middleware/logger";
import { ResponseHandler } from "./utils/response";

dotenv.config({ path: path.resolve(process.cwd(), "apps/core-gateway/.env") });

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      if (CORS_ORIGINS.length === 0 || CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/students", studentProfileRouter);
app.use("/api/v1/students/hackathons", studentHackathonsRouter);
app.use("/api/v1/students/teams", studentTeamsRouter);
app.use("/api/v1/students/teams", studentMatchingRouter);
app.use("/api/v1/organizers", organizerProfileRouter);
app.use("/api/v1/organizers/hackathons", organizerHackathonsRouter);
app.use("/api/v1/organizers/hackathons", organizerParticipantsRouter);

app.listen(PORT);
logStartup(PORT, CORS_ORIGINS);
