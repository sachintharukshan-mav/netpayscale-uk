const fs = require("fs");
const path = require("path");

const rolesByBand = [
  // Band 2
  {
    band: "Band 2",
    roles: [
      { name: "Healthcare Assistant", slug: "healthcare-assistant", step: "Single Point" },
      { name: "Clinical Support Worker", slug: "clinical-support-worker", step: "Single Point" },
      { name: "Phlebotomist", slug: "phlebotomist", step: "Single Point" },
    ],
  },
  // Band 3
  {
    band: "Band 3",
    roles: [
      { name: "Senior Healthcare Assistant", slug: "senior-healthcare-assistant", step: "Entry" },
      { name: "Emergency Care Assistant", slug: "emergency-care-assistant", step: "Entry" },
      { name: "Pharmacy Assistant", slug: "pharmacy-assistant", step: "Entry" },
    ],
  },
  // Band 4
  {
    band: "Band 4",
    roles: [
      { name: "Nursing Associate", slug: "nursing-associate", step: "Entry" },
      { name: "Assistant Practitioner", slug: "assistant-practitioner", step: "Entry" },
      { name: "Pharmacy Technician", slug: "pharmacy-technician", step: "Entry" },
    ],
  },
  // Band 5
  {
    band: "Band 5",
    roles: [
      { name: "Staff Nurse (RN)", slug: "nurse", step: "Entry" },
      { name: "Newly Qualified Paramedic", slug: "paramedic", step: "Entry" },
      { name: "Physiotherapist", slug: "physiotherapist", step: "Entry" },
      { name: "Radiographer", slug: "radiographer", step: "Entry" },
      { name: "Occupational Therapist", slug: "occupational-therapist", step: "Entry" },
      { name: "Midwife", slug: "midwife", step: "Entry" },
    ],
  },
  // Band 6
  {
    band: "Band 6",
    roles: [
      { name: "Junior Sister / Charge Nurse", slug: "sister-charge-nurse", step: "After 2 years" },
      { name: "Senior Paramedic", slug: "senior-paramedic", step: "Entry" },
      { name: "Specialist Physiotherapist", slug: "specialist-physiotherapist", step: "Entry" },
      { name: "Specialist Radiographer", slug: "specialist-radiographer", step: "Entry" },
      { name: "Specialist Midwife", slug: "specialist-midwife", step: "Entry" },
    ],
  },
  // Band 7
  {
    band: "Band 7",
    roles: [
      { name: "Ward Manager / Sister", slug: "ward-manager", step: "Entry" },
      { name: "Advanced Clinical Practitioner (ACP)", slug: "acp", step: "Entry" },
      { name: "Advanced Paramedic", slug: "advanced-paramedic", step: "Entry" },
      { name: "Lead Clinical Pharmacist", slug: "pharmacist", step: "Entry" },
      { name: "Clinical Team Leader", slug: "clinical-manager", step: "Entry" },
    ],
  },
  // Band 8a
  {
    band: "Band 8a",
    roles: [
      { name: "Matron", slug: "matron", step: "Entry" },
      { name: "Advanced Nurse Consultant", slug: "nurse-consultant", step: "Entry" },
      { name: "Principal Clinical Psychologist", slug: "psychologist", step: "Entry" },
      { name: "Operational Service Manager", slug: "service-manager", step: "Entry" },
    ],
  },
  // Band 8b
  {
    band: "Band 8b",
    roles: [
      { name: "Senior Matron", slug: "senior-matron", step: "Entry" },
      { name: "Consultant Clinical Psychologist", slug: "consultant-psychologist", step: "Entry" },
      { name: "Head of Clinical Services", slug: "head-of-service", step: "Entry" },
    ],
  },
  // Band 8c
  {
    band: "Band 8c",
    roles: [
      { name: "Head of Nursing", slug: "head-of-nursing", step: "Entry" },
      { name: "Associate Director of Operations", slug: "associate-director", step: "Entry" },
      { name: "Consultant Clinical Scientist", slug: "consultant-scientist", step: "Entry" },
    ],
  },
  // Band 8d
  {
    band: "Band 8d",
    roles: [
      { name: "Deputy Director of Nursing", slug: "deputy-director-nursing", step: "Entry" },
      { name: "Director of Operations", slug: "director-of-operations", step: "Entry" },
      { name: "Chief Pharmacist", slug: "chief-pharmacist", step: "Entry" },
    ],
  },
  // Band 9
  {
    band: "Band 9",
    roles: [
      { name: "Director of Nursing", slug: "director-of-nursing", step: "Entry" },
      { name: "Chief Operating Officer (COO)", slug: "chief-operating-officer", step: "Entry" },
      { name: "National Clinical Specialist Advisor", slug: "clinical-director", step: "Entry" },
    ],
  },
];

const regions = [
  {
    id: "inner-london",
    name: "Inner London",
    headline: "Inner London NHS Trusts (Barts Health, Guy's & St Thomas', UCLH, King's College Hospital)",
    hcasZone: "inner-london",
  },
  {
    id: "outer-london",
    name: "Outer London",
    headline: "Outer London NHS Trusts (Croydon Health, Kingston Hospital, Barking Havering and Redbridge)",
    hcasZone: "outer-london",
  },
  {
    id: "fringe",
    name: "Fringe Border",
    headline: "Fringe NHS Trusts (Dartford and Gravesham, Slough, Epsom, West Essex)",
    hcasZone: "fringe",
  },
  {
    id: "birmingham",
    name: "Birmingham & Solihull",
    headline: "University Hospitals Birmingham NHS Foundation Trust (QEHB, Heartlands, Good Hope)",
    hcasZone: "standard",
  },
  {
    id: "manchester",
    name: "Greater Manchester",
    headline: "Manchester University NHS Foundation Trust (MFT) & Northern Care Alliance",
    hcasZone: "standard",
  },
  {
    id: "leeds",
    name: "Leeds & West Yorkshire",
    headline: "Leeds Teaching Hospitals NHS Trust (LGI & St James's)",
    hcasZone: "standard",
  },
  {
    id: "newcastle",
    name: "Newcastle & North East",
    headline: "The Newcastle upon Tyne Hospitals NHS Foundation Trust (Freeman & RVI)",
    hcasZone: "standard",
  },
  {
    id: "bristol",
    name: "Bristol & Severn",
    headline: "University Hospitals Bristol and Weston NHS Foundation Trust",
    hcasZone: "standard",
  },
  {
    id: "liverpool",
    name: "Liverpool & Merseyside",
    headline: "Liverpool University Hospitals NHS Foundation Trust (Royal Liverpool & Aintree)",
    hcasZone: "standard",
  },
  {
    id: "sheffield",
    name: "Sheffield & South Yorkshire",
    headline: "Sheffield Teaching Hospitals NHS Foundation Trust (Northern General & Hallamshire)",
    hcasZone: "standard",
  },
  {
    id: "southampton",
    name: "Southampton & Hampshire",
    headline: "University Hospital Southampton NHS Foundation Trust",
    hcasZone: "standard",
  },
  {
    id: "nottingham",
    name: "Nottingham & East Midlands",
    headline: "Nottingham University Hospitals NHS Trust (QMC & City Hospital)",
    hcasZone: "standard",
  },
  {
    id: "scotland",
    name: "Scotland",
    headline: "NHS Scotland Health Boards & Scottish Ambulance Service (SAS)",
    hcasZone: "standard",
  },
  {
    id: "wales",
    name: "Wales",
    headline: "Cardiff and Vale University Health Board & NHS Wales Trusts",
    hcasZone: "standard",
  },
  {
    id: "northern-ireland",
    name: "Northern Ireland",
    headline: "Belfast Health and Social Care Trust & HSC Northern Ireland",
    hcasZone: "standard",
  },
];

const generatedEntries = [];
const seenSlugs = new Set();

// Matrix distribution logic:
// Core clinical bands (5, 6, 7) paired across all regions
// Specialized and senior bands (2, 3, 4, 8a, 8b, 8c, 8d, 9) paired across strategic high-volume regions
for (const bandItem of rolesByBand) {
  for (const role of bandItem.roles) {
    const bandSlugPart = bandItem.band.toLowerCase().replace(/\s+/g, "-");
    
    // Choose regions: Bands 5, 6, 7 cover almost all regions, others cover top 8-10 regions
    const isCoreClinical = ["Band 5", "Band 6", "Band 7"].includes(bandItem.band);
    const targetRegions = isCoreClinical 
      ? regions 
      : regions.filter((_, idx) => idx % 2 === 0 || idx < 4);

    for (const region of targetRegions) {
      const slug = `${bandSlugPart}-${role.slug}-salary-${region.id}`;
      
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);

        const hcasText =
          region.hcasZone === "inner-london"
            ? "including 20% Inner London HCAS weighting"
            : region.hcasZone === "outer-london"
            ? "including 15% Outer London HCAS weighting"
            : region.hcasZone === "fringe"
            ? "including 5% Fringe weighting"
            : "under UK national Agenda for Change pay scales";

        const description = `Official 2026/27 NHS ${bandItem.band} ${role.name} salary and take-home pay in ${region.name} (${hcasText}). Accurate breakdown of monthly net pay, pension deductions, income tax, and shift uplifts.`;

        generatedEntries.push({
          slug,
          band: bandItem.band,
          roleName: role.name,
          roleSlug: role.slug,
          regionId: region.id,
          regionName: region.name,
          regionHeadline: region.headline,
          step: role.step,
          hcasZone: region.hcasZone,
          description,
        });
      }
    }
  }
}

console.log(`Generated ${generatedEntries.length} programmatic SEO entries.`);

const outputPath = path.join(__dirname, "../data/pseo_cities_roles.json");
fs.writeFileSync(outputPath, JSON.stringify(generatedEntries, null, 2), "utf-8");
console.log(`Successfully saved to ${outputPath}`);
