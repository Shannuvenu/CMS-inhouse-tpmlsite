import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://printersmysore.com"; // swap for your real deployed domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await prisma.jobOpening.findMany({
    where: { status: "OPEN" },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/brands`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/team`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/careers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE_URL}/careers/${job.slug}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...jobRoutes];
}