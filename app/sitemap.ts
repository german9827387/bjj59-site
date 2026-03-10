import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bjj59.ru";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/bjj`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/mma`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/boxing`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/grappling`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/offer`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/consent`, lastModified: new Date(), priority: 0.3 },
  ];
}
