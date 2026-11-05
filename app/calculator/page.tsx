import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllPseoEntries, getAllRoleHubs } from "@/lib/pseo-matrix";
import nhsData from "@/data/nhs_afc_2026.json";
import { formatCurrency } from "@/lib/formatters";
import AdPlaceholder from "@/components/AdPlaceholder";

const canonicalUrl = "https://netpayscale.uk/calculator/";

export const metadata: Metadata = {
  title: "NHS Salary by Location & Trust 2026/27: 490 Regional Take-Home Pay Guides | NetPayScale UK",
  description:
    "Browse 2026/27 NHS Agenda for Change take-home pay calculators across 490 UK cities, health boards, and NHS trusts. Accurately models Bands 2–9, London Weighting (HCAS), Scotland S1257L tax, and Section 2 unsocial hours.",
  alternates: {
    canonical: canonicalUrl,
    types: {
      "text/markdown": "https://netpayscale.uk/calculator.md",
    },
  },
  other: {
    "ai-summary":
      "Comprehensive regional directory of 490 NHS Agenda for Change pay and pension calculators across all UK major cities, trust regions, London Weighting zones, and devolved nations for 2026/27.",
  },
  openGraph: {
    title: "NHS Salary by Location & Trust 2026/27: 490 Regional Pay Guides",
    description:
      "Explore 490 localized NHS take-home pay calculators. Verified 2026/27 pay points, HCAS London weighting, and pension deductions.",
    url: canonicalUrl,
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
};

export default function RegionalDirectoryPage() {
  const allEntries = getAllPseoEntries();
  const roleHubs = getAllRoleHubs();

  // Group entries by region
  const regionMap = new Map<string, typeof allEntries>();
  for (const entry of allEntries) {
    const rName = entry.regionName || "National Standard";
    if (!regionMap.has(rName)) {
      regionMap.set(rName, []);
    }
    regionMap.get(rName)!.push(entry);
  }

  const sortedRegions = Array.from(regionMap.keys()).sort();

  return (
    <div className="min-h-screen bg-bg-page pb-16">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-nhs-blue transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-950 font-semibold">Regional Directory</span>
          </nav>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-nhs-blue/10 text-nhs-blue text-xs font-bold uppercase tracking-wider">
            All 490 Regional NHS Guides
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 tracking-tight">
            NHS Regional Salary Calculators &amp; Pay Directory (2026/27)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
            Direct access to all 490 localized Agenda for Change salary models. Compare base salary, London Weighting (HCAS), Scottish income tax codes, and unsocial hours uplifts for your specific clinical role and hospital trust location.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <AdPlaceholder slotId="calculator-dir-top" format="leaderboard" />

        {/* Quick Role Links */}
        <div className="rounded-xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-zinc-950">
            Browse by Clinical Job Role (41 Roles)
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {roleHubs.map((hub) => (
              <Link
                key={hub.roleSlug}
                href={`/roles/${hub.roleSlug}/`}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 hover:bg-nhs-blue hover:text-white text-zinc-700 transition-colors"
              >
                {hub.roleName} ({hub.band})
              </Link>
            ))}
          </div>
        </div>

        {/* Grouped by UK Region */}
        <div className="space-y-8">
          {sortedRegions.map((regionName) => {
            const list = regionMap.get(regionName) || [];
            return (
              <section
                key={regionName}
                id={regionName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2">
                    <span className="material-symbols-outlined text-nhs-blue text-[20px]">location_on</span>
                    {regionName} ({list.length} Calculators)
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">
                    2026/27 AfC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {list.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/calculator/${item.slug}/`}
                      className="group flex flex-col justify-between p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-nhs-blue hover:shadow-2xs transition-all text-xs"
                    >
                      <div className="font-semibold text-zinc-900 group-hover:text-nhs-blue leading-snug">
                        {item.roleName}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100/80 text-[11px] font-mono text-zinc-500">
                        <span className="font-bold text-zinc-700">{item.band}</span>
                        <span className="text-nhs-blue font-semibold group-hover:underline">View Pay →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
