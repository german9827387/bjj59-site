import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bjj59.ru";
  return [
    { url: baseUrl, lastModified: new Date("2026-03-17"), priority: 1 },
    { url: `${baseUrl}/bjj`, lastModified: new Date("2026-03-17"), priority: 0.9 },
    { url: `${baseUrl}/mma`, lastModified: new Date("2026-03-17"), priority: 0.9 },
    { url: `${baseUrl}/boxing`, lastModified: new Date("2026-03-17"), priority: 0.9 },
    { url: `${baseUrl}/grappling`, lastModified: new Date("2026-03-17"), priority: 0.9 },
    { url: `${baseUrl}/muaythai`, lastModified: new Date("2026-03-17"), priority: 0.9 },
    { url: `${baseUrl}/schedule`, lastModified: new Date("2026-03-17"), priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date("2025-01-01"), priority: 0.3 },
    { url: `${baseUrl}/offer`, lastModified: new Date("2025-01-01"), priority: 0.3 },
    { url: `${baseUrl}/consent`, lastModified: new Date("2025-01-01"), priority: 0.3 },
  ];
}
