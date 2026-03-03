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
    dsn:
      process.env.SENTRY_DSN ??
      "https://7c44a3b58b32cb6be8ccd472de537884@o4510981856296960.ingest.de.sentry.io/4510981862260816",
    environment:
      process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
    // Capture 20% of transactions in production; 100% locally for easy verification.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    // Attach the release tag to each event for source-map unwinding.
    release: process.env.SENTRY_RELEASE,
    // Automatically instrument Express, pg, http, etc.
    integrations: [Sentry.httpIntegration()],
  });
}

export { Sentry };
