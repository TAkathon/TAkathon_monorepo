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
  org: "personal-94z",
  project: "takathon",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
