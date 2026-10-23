import pseoData from "@/data/pseo_cities_roles.json";

export interface PseoEntry {
  slug: string;
  band: string;
  roleName: string;
  roleSlug: string;
  regionId: string;
  regionName: string;
  regionHeadline: string;
  step: string;
  hcasZone: "inner-london" | "outer-london" | "fringe" | "standard";
  description: string;
}

const BAND_ORDER = [
  "Band 2",
  "Band 3",
  "Band 4",
  "Band 5",
  "Band 6",
  "Band 7",
  "Band 8a",
  "Band 8b",
  "Band 8c",
  "Band 8d",
  "Band 9",
];

export function getAllPseoEntries(): PseoEntry[] {
  return pseoData as PseoEntry[];
}

export function getPseoEntryBySlug(slug: string): PseoEntry | undefined {
  return (pseoData as PseoEntry[]).find((entry) => entry.slug === slug);
}

/**
 * Builds a complete 2-axis internal cross-linking mesh for any pSEO entry:
 * 1. sameRoleOtherRegions: Identical Band + Role across all other UK regions/HCAS zones.
 * 2. sameRegionOtherRoles: All other Bands & clinical roles within the exact same UK region,
 *    ordered by Agenda for Change band progression (Band 2 -> Band 9) with adjacent promotion bands highlighted.
 */
export function getRelatedPseoEntries(current: PseoEntry): {
  sameRoleOtherRegions: PseoEntry[];
  sameRegionOtherRoles: PseoEntry[];
  adjacentPromotionRoles: PseoEntry[];
} {
  const all = getAllPseoEntries();
  const currentBandIdx = BAND_ORDER.indexOf(current.band);

  const sameRoleOtherRegions = all.filter(
    (e) =>
      e.slug !== current.slug &&
      e.roleSlug === current.roleSlug &&
      e.band === current.band
  );

  const sameRegionOtherRoles = all
    .filter((e) => e.slug !== current.slug && e.regionId === current.regionId)
    .sort((a, b) => BAND_ORDER.indexOf(a.band) - BAND_ORDER.indexOf(b.band));

  const adjacentPromotionRoles = sameRegionOtherRoles.filter((e) => {
    const idx = BAND_ORDER.indexOf(e.band);
    return (
      currentBandIdx !== -1 &&
      idx !== -1 &&
      Math.abs(idx - currentBandIdx) === 1
    );
  });

  return {
    sameRoleOtherRegions,
    sameRegionOtherRoles,
    adjacentPromotionRoles,
  };
}

export function getRegionalEditorial(entry: PseoEntry) {
  const isLondon = entry.hcasZone === "inner-london" || entry.hcasZone === "outer-london";
  const isFringe = entry.hcasZone === "fringe";
  const isScotland = entry.regionId === "scotland";

  return {
    hcasExplanation: isLondon
      ? `As this post is situated within ${entry.regionName}, your salary includes the statutory High Cost Area Supplement (HCAS). Under Agenda for Change Annex 9, staff working in ${entry.hcasZone === "inner-london" ? "Inner London receive a 20% allowance (minimum £5,794, maximum £8,746)" : "Outer London receive a 15% allowance (minimum £4,870, maximum £6,137)"}. This supplement is pensionable under NHS pension regulations.`
      : isFringe
      ? `This post falls within the London Fringe boundary (Fringe zone), entitling staff to a 5% High Cost Area Supplement (minimum £1,346, maximum £2,270). This helps offset elevated living and commuting expenses in regions bordering Greater London.`
      : isScotland
      ? `In NHS Scotland, Agenda for Change salaries follow Scottish national agreements. Scottish taxpayers fall under the Scottish Parliament's devolved income tax bands (Starter 19%, Basic 20%, Intermediate 21%, Higher 42%, Advanced 45%, and Top 48%).`
      : `Staff in ${entry.regionName} are paid under the standard UK Agenda for Change national pay scales without London Weighting. Living expenses and housing costs in this region are significantly lower than Greater London, providing favorable real-terms purchasing power.`,
    careerProgression: `For a ${entry.roleName} in ${entry.band}, annual pay progression occurs through experience step-points. Newly qualified practitioners start at the entry point and progress upon completing designated years of service, subject to local statutory appraisal and competency sign-offs.`,
    pensionContext: `All NHS employees are contractually enrolled into the 2015 NHS Pension Scheme (Career Average Revalued Earnings - CARE). Employee contribution rates range from 5.2% up to 12.5% based on actual earnings. Contributions are deducted before Income Tax under Net Pay arrangements, providing automatic 20% to 40% tax relief at source.`,
  };
}
