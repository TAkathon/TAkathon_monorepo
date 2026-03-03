import path from "node:path";
import { fileURLToPath } from "node:url";
import { withSentryConfig } from "@sentry/nextjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  transpilePackages: [
    "@takathon/shared/ui",
    "@takathon/shared/utils",
    "@takathon/shared/types",
    "@takathon/shared/api",
  ],
};

export default withSentryConfig(nextConfig, {
  // Suppress build output when SENTRY_AUTH_TOKEN is not configured.
  silent: true,
  // Upload a broader set of source maps for cleaner stack traces in Sentry.
  // Requires SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT to be set.
  widenClientFileUpload: true,
  // Don't expose source maps in the browser bundle.
  hideSourceMaps: true,
  // Tree-shake Sentry SDK logger calls to reduce bundle size.
  disableLogger: true,
});
