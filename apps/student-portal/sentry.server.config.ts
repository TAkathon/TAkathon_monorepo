/**
 * Sentry server-side SDK initialisation for the Student Portal.
 * Runs in the Node.js runtime (API routes, server components, route handlers).
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
