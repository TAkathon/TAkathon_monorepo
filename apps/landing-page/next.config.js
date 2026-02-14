/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizeCss: false,
    },
    output: "standalone",
    outputFileTracingRoot: path.resolve(__dirname, "../.."),
};

module.exports = nextConfig;
