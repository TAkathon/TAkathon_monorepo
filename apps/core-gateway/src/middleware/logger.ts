import type { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    console.log(`[core-gateway] ${method} ${url} ${status} ${duration}ms`);
  });
  next();
}

export function logStartup(port: number, corsOrigins: string[]) {
  const origins = corsOrigins.length > 0 ? corsOrigins.join(", ") : "all";
  console.log(`[core-gateway] listening on ${port} (cors: ${origins})`);
}
