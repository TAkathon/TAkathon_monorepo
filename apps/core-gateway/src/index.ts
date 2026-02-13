import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import authRouter from "./routes/auth";

dotenv.config({ path: path.resolve(process.cwd(), "apps/core-gateway/.env") });

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (CORS_ORIGINS.length === 0 || CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true, service: "core-gateway" });
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT);
