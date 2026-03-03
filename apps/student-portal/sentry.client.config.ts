/**
 * Sentry client-side SDK initialisation for the Student Portal.
 *
 * This file is automatically imported by the Sentry Next.js SDK when
 * withSentryConfig is used in next.config.mjs. It runs once in the browser.
 *
 * Set NEXT_PUBLIC_SENTRY_DSN in your environment to enable reporting.
 * Without a DSN events are silently dropped — safe for local development.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",
  // Capture 10% of page loads for performance monitoring.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
  // Show error dialog to users in production — comment out if you prefer silent.
  // replaysOnErrorSampleRate: 1.0,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
