import type { MetadataRoute } from "next";

const BASE_URL = "https://printersmysore.com"; // same domain as sitemap.ts

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}