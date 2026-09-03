import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {},
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru",
          "style-src 'self' 'unsafe-inline'",
          // Синтаксис хоста в CSP — не тот же, что в `remotePatterns` ниже:
          // `**.userapi.com` браузер считает невалидным источником и молча
          // выбрасывает всю запись. В CSP одна звёздочка и так закрывает
          // любую глубину поддоменов.
          "img-src 'self' data: blob: https://*.userapi.com https://*.vk-cdn.net https://*.okcdn.ru https://avatars.mds.yandex.net https://mc.yandex.ru",
          "media-src 'self' blob:",
          "font-src 'self'",
          // Метрика ходит на свой домен ещё и вебсокетом (`wss://mc.yandex.ru/solid.ws`)
          // и подгружает синхронизирующий iframe с `mc.yandex.ru` — без этих двух
          // источников браузер резал их на каждой странице.
          "connect-src 'self' https://api.vk.com https://mc.yandex.ru wss://mc.yandex.ru",
          "frame-src https://yandex.ru https://mc.yandex.ru",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2|woff)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    qualities: [60, 75],
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
      {
        protocol: "https",
        hostname: "avatars.mds.yandex.net",
      },
    ],
  },
};

export default nextConfig;
