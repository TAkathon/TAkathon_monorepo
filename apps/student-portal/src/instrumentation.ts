/**
 * Next.js instrumentation hook — loads Sentry server-side SDK during startup.
 * This file is picked up automatically by Next.js 15 (stable, no flag needed).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
}
