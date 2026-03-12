import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.userapi.com",
      },
      {
        protocol: "https",
        hostname: "**.vk-cdn.net",
      },
      {
        protocol: "https",
        hostname: "**.okcdn.ru",
      },
    ],
  },
  compress: true,
};

export default nextConfig;
