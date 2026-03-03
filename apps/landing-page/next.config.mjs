import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizeCss: false,
    },
    output: "standalone",
    outputFileTracingRoot: path.resolve(__dirname, "../.."),
    transpilePackages: [
        "@takathon/shared/ui",
        "@takathon/shared/utils",
        "@takathon/shared/types",
        "@takathon/shared/api",
    ],
};

export default nextConfig;
