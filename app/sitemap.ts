import { MetadataRoute } from "next";
import nhsData from "@/data/nhs_afc_2026.json";
import { getAllPseoEntries } from "@/lib/pseo-matrix";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://netpayscale.uk";
  const pseoEntries = getAllPseoEntries();
  const buildDate = new Date("2026-04-01T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: buildDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pension-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sick-pay-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/maternity-pay-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/annual-leave-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/bank-shift-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/pay-rise-backpay-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/promotion-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/redundancy-pay-calculator/`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const bandHubRoutes: MetadataRoute.Sitemap = nhsData.bands.map((band) => ({
    url: `${baseUrl}/bands/${band.slug}/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const programmaticRoutes: MetadataRoute.Sitemap = pseoEntries.map((entry) => ({
    url: `${baseUrl}/calculator/${entry.slug}/`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...bandHubRoutes, ...programmaticRoutes];
}
