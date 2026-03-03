/**
 * Sentry SDK initialisation for the Core Gateway (Express / Node.js).
 *
 * This module must be imported **before** any other application code in
 * index.ts so that Sentry can instrument all subsequent require/import
 * calls (automatic instrumentation for Express, Prisma, HTTP, etc.).
 *
 * DSN is read from the SENTRY_DSN environment variable.
 * If the variable is absent the SDK is initialised without a DSN and
 * events are silently dropped — safe for local development.
 *
 * Production checklist:
 *   1. Create a project at https://sentry.io (free tier works)
 *   2. Copy your DSN from Settings → Projects → Client Keys
 *   3. Add SENTRY_DSN=https://... to your production environment variables
 *   4. Optionally set SENTRY_ENVIRONMENT (defaults to NODE_ENV)
 */

import * as Sentry from "@sentry/node";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN, // undefined → events dropped locally
    environment:
      process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
    // Capture 20 % of transactions for performance monitoring.
    // Lower this in high-traffic production to reduce quota usage.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 0,
    // Attach the release tag to each event for source-map unwinding.
    release: process.env.SENTRY_RELEASE,
    // Enable only when DSN is explicitly configured so local dev is noise-free.
    enabled: !!process.env.SENTRY_DSN,
    // Automatically instrument Express, pg, http, etc.
    integrations: [Sentry.httpIntegration()],
  });
}

export { Sentry };
