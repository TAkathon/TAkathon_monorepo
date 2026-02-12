/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizeCss: false,
    },
};

module.exports = nextConfig;
