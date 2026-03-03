import type { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Structured JSON logger
// All log lines are newline-delimited JSON (NDJSON) so log aggregators
// (Datadog, Loki, CloudWatch Logs Insights) can parse them without regex.
// Each access-log line includes: ts, service, method, route, url,
// statusCode, latencyMs, userId, role, ip.
// ---------------------------------------------------------------------------

function writeLog(obj: Record<string, unknown>): void {
  // Use process.stdout.write to avoid the implicit newline + prefix that
  // console.log adds, which can break JSON parsing in some log pipelines.
  process.stdout.write(JSON.stringify(obj) + "\n");
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const latencyMs = Date.now() - start;
    // req.user is attached by requireAuth middleware (may be absent for public routes)
    const user = (req as any).user as
      | { userId?: string; role?: string }
      | undefined;

    writeLog({
      ts: new Date().toISOString(),
      service: "core-gateway",
      method: req.method,
      // req.route.path is the pattern (e.g. "/profile") — more useful than the
      // full URL for dashboards/alerts. Fall back to req.path if route not matched.
      route: (req.route as { path?: string } | undefined)?.path ?? req.path,
      url: req.originalUrl,
      statusCode: res.statusCode,
      latencyMs,
      userId: user?.userId ?? null,
      role: user?.role ?? null,
      ip: req.ip ?? req.socket.remoteAddress ?? null,
    });
  });

  next();
}

export function logStartup(port: number, corsOrigins: string[]): void {
  const origins = corsOrigins.length > 0 ? corsOrigins.join(", ") : "all";
  writeLog({
    ts: new Date().toISOString(),
    service: "core-gateway",
    event: "startup",
    port,
    corsOrigins: origins,
    nodeEnv: process.env.NODE_ENV ?? "development",
  });
}
