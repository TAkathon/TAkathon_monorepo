import { Request, Response, NextFunction } from "express";

function maskSensitive(input: any) {
  if (!input || typeof input !== "object") return undefined;
  const sensitive = new Set(["password", "accessToken", "refreshToken"]);
  const out: Record<string, any> = {};
  for (const key of Object.keys(input)) {
    out[key] = sensitive.has(key) ? "***" : input[key];
  }
  return out;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const origin = req.headers.origin || "";
  const ip = req.ip || req.socket.remoteAddress || "";
  const body = maskSensitive(req.body);
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const contentLength = res.getHeader("content-length") || "-";
    console.log(
      `[gateway] ${method} ${url} ${status} ${duration}ms len=${contentLength} origin=${origin} ip=${ip}` +
        (body ? ` body=${JSON.stringify(body)}` : "")
    );
  });
  next();
}

export function logStartup(port: number, origins: string[]) {
  const list = origins.length ? origins.join(", ") : "*";
  console.log(`[gateway] listening on http://localhost:${port}`);
  console.log(`[gateway] cors origins: ${list}`);
}
