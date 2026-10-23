import { MetadataRoute } from "next";
import { getAllPseoEntries } from "@/lib/pseo-matrix";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://netpayscale.co.uk";
  const pseoEntries = getAllPseoEntries();
  const buildDate = new Date("2026-04-01T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const programmaticRoutes: MetadataRoute.Sitemap = pseoEntries.map((entry) => ({
    url: `${baseUrl}/calculator/${entry.slug}/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...programmaticRoutes];
}
