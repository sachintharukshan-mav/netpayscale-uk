import { MetadataRoute } from "next";
import { getAllPseoEntries } from "@/lib/pseo-matrix";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://netpayscale.co.uk";
  const pseoEntries = getAllPseoEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const programmaticRoutes: MetadataRoute.Sitemap = pseoEntries.map((entry) => ({
    url: `${baseUrl}/calculator/${entry.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...programmaticRoutes];
}
