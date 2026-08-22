import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.bjj59.ru";
  const now = new Date();
  const legal = new Date("2025-01-01");
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/bjj`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/mma`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/boxing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/grappling`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/muaythai`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/schedule`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: legal, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/offer`, lastModified: legal, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/consent`, lastModified: legal, changeFrequency: "yearly", priority: 0.2 },
  ];
}
