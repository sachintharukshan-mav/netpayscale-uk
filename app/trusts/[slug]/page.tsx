import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import trustsData from "@/data/nhs_trusts.json";
import nhsData from "@/data/nhs_afc_2026.json";
import { calculateNHSPay } from "@/lib/calculator";
import { formatCurrency, formatHourlyRate } from "@/lib/formatters";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import { MagneticBentoContainer } from "@/components/MagneticBento";
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Briefcase,
  HelpCircle,
  Landmark,
} from "lucide-react";

export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return trustsData.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trust = trustsData.find((t) => t.id === slug);

  if (!trust) {
    return { title: "NHS Trust Pay Scales | NetPayScale UK" };
  }

  const title = `${trust.name} Salary 2026/27: Pay Bands & Monthly Take-Home`;
  const description = `Official 2026/27 Agenda for Change salary scale for ${trust.name} (${trust.code}). Starting Band 5 pay: £${trust.band5StartingGross.toLocaleString("en-GB")}/yr (£${trust.band5StartingNetMonthly.toLocaleString("en-GB")}/mo net) with ${trust.hcasRate}. Hospital sites: ${trust.majorHospitals.slice(0, 3).join(", ")}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://netpayscale.uk/trusts/${trust.id}/`,
      types: {
        "text/markdown": `https://netpayscale.uk/trusts/${trust.id}.md`,
      },
    },
    other: {
      "ai-summary": `2026/27 NHS Agenda for Change pay scale for ${trust.name} (${trust.code}). Starting Band 5 earns £${trust.band5StartingGross}/yr gross (£${trust.band5StartingNetMonthly}/mo net) under ${trust.hcasRate}. Features pay step breakdown for Bands 2 to 8a, unsocial hours rates, and hospital site allocations.`,
    },
    openGraph: {
      title,
      description,
      url: `https://netpayscale.uk/trusts/${trust.id}/`,
      siteName: "NetPayScale UK",
      locale: "en_GB",
      type: "website",
    },
  };
}

export default async function TrustDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const trust = trustsData.find((t) => t.id === slug);

  if (!trust) {
    notFound();
  }

  const hcasZone = trust.hcasZone as "inner-london" | "outer-london" | "fringe" | "standard";

  // Calculate full pay scale for Bands 2 to 8a at this trust
  const targetBands = ["Band 2", "Band 3", "Band 4", "Band 5", "Band 6", "Band 7", "Band 8a"];
  const trustBandRows = targetBands.map((bandName) => {
    const bandObj = nhsData.bands.find((b) => b.band === bandName);
    if (!bandObj) return null;

    const entryPoint = calculateNHSPay({
      band: bandName,
      stepIndex: 0,
      hcasZone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });

    const topIndex = bandObj.points.length - 1;
    const topPoint = calculateNHSPay({
      band: bandName,
      stepIndex: topIndex,
      hcasZone,
      nightHoursPerWeek: 0,
      sundayHoursPerWeek: 0,
      pensionOptedOut: false,
      isScottishTax: false,
      studentLoan: "none",
    });

    return {
      band: bandName,
      slug: bandObj.slug,
      typicalRole: bandObj.typicalRoles[0],
      entry: {
        baseGross: entryPoint.baseSalary.annual,
        hcas: entryPoint.hcasAmount.annual,
        totalGross: entryPoint.grossPay.annual,
        monthlyNet: entryPoint.netPay.monthly,
        hourly: entryPoint.hourlyRate,
      },
      top: {
        baseGross: topPoint.baseSalary.annual,
        hcas: topPoint.hcasAmount.annual,
        totalGross: topPoint.grossPay.annual,
        monthlyNet: topPoint.netPay.monthly,
        hourly: topPoint.hourlyRate,
        years: bandObj.points[topIndex].yearsExperience,
      },
    };
  }).filter(Boolean);

  // Sibling trusts in the same region for contextual cross-linking
  const siblingTrusts = trustsData
    .filter((t) => t.id !== trust.id && (t.region === trust.region || t.hcasZone === trust.hcasZone))
    .slice(0, 4);

  // Structured JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "NHS Hospital Trusts",
            item: "https://netpayscale.uk/trusts/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: trust.shortName,
            item: `https://netpayscale.uk/trusts/${trust.id}/`,
          },
        ],
      },
      {
        "@type": "MedicalOrganization",
        "@id": `https://netpayscale.uk/trusts/${trust.id}/#organization`,
        name: trust.name,
        alternateName: trust.shortName,
        identifier: trust.code,
        areaServed: trust.city,
        parentOrganization: {
          "@type": "Organization",
          name: "National Health Service (NHS)",
          url: "https://www.nhs.uk/",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the London Weighting (HCAS) allowance at ${trust.shortName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Staff at ${trust.name} are in the ${trust.hcasRate} zone. This High Cost Area Supplement is paid on top of basic Agenda for Change salary up to statutory caps.`,
            },
          },
          {
            "@type": "Question",
            name: `How much does a newly qualified Band 5 nurse earn at ${trust.shortName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `A newly qualified Band 5 nurse starting at ${trust.name} in 2026/27 earns £${trust.band5StartingGross.toLocaleString("en-GB")} gross per year, which yields approximately £${trust.band5StartingNetMonthly.toLocaleString("en-GB")} net take-home pay per month after PAYE tax, National Insurance, and 8.3% NHS Pension deductions.`,
            },
          },
          {
            "@type": "Question",
            name: `Which hospitals are operated by ${trust.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${trust.name} operates major clinical sites including ${trust.majorHospitals.join(", ")}.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[#005EB8] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/trusts/" className="hover:text-[#005EB8] transition-colors shrink-0">
              NHS Trusts Directory
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate shrink-0">
              {trust.shortName}
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Header Hero Section */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#005EB8] text-white">
              ODS: {trust.code}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              <MapPin className="w-3 h-3" />
              {trust.region}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              2026/27 Agenda for Change (+3.3%) Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {trust.name}
            <span className="block text-lg sm:text-2xl font-bold text-[#005EB8] mt-1.5">
              Salary Scales, London Weighting &amp; Monthly Take-Home Pay (2026/27)
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Official Agenda for Change pay bands, High Cost Area Supplement (HCAS) weighting, and estimated net monthly pay for clinical and non-clinical healthcare staff across {trust.shortName}.
          </p>
        </div>

        {/* Position 0 Executive Answer Box (Targeting Google Featured Snippets) */}
        <section className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 border-2 border-[#005EB8]/30 rounded-2xl p-5 sm:p-7 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005EB8]">
            <Sparkles className="w-4 h-4" />
            <span>2026/27 Verified Pay Summary · {trust.shortName}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
            Under the 2026/27 NHS Agenda for Change pay deal (+3.3%), healthcare staff at <strong>{trust.name}</strong> receive <strong>{trust.hcasRate}</strong>. A newly qualified Band 5 nurse starts at <strong>£{trust.band5StartingGross.toLocaleString("en-GB")}/year gross</strong> (approx. <strong>£{trust.band5StartingNetMonthly.toLocaleString("en-GB")} net/month</strong> in take-home pay after PAYE tax, National Insurance, and 8.3% NHS CARE pension deductions).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              HMRC &amp; NHSBSA Audited
            </span>
            <span>•</span>
            <span>Locations: {trust.city}</span>
          </div>
        </section>

        {/* Key Metrics Bento Grid */}
        <MagneticBentoContainer variant="2xl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bento-card bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Allowance Zone
              </span>
              <div className="text-sm font-bold text-slate-900 leading-snug">
                {trust.hcasRate}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
              High Cost Area Supplement
            </div>
          </div>

          <div className="bento-card bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Band 5 Starting Take-Home
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                ~{formatCurrency(trust.band5StartingNetMonthly)}/mo
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
              {formatCurrency(trust.band5StartingGross)}/yr gross
            </div>
          </div>

          <div className="bento-card bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Clinical Workforce
              </span>
              <div className="text-xl font-black text-slate-900">
                {trust.staffCount}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
              ODS Code: {trust.code}
            </div>
          </div>

          <div className="bento-card bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Hospital Sites
              </span>
              <div className="text-xl font-black text-slate-900">
                {trust.majorHospitals.length} Campuses
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 truncate">
              {trust.majorHospitals[0]}
            </div>
          </div>
        </MagneticBentoContainer>

        {/* Trust Pay Scale Table (Bands 2 to 8a) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#005EB8]" />
                2026/27 Pay Scales at {trust.shortName} (Bands 2–8a)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Basic Agenda for Change pay plus {trust.hcasRate} showing entry and top spine points.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/70 self-start sm:self-auto font-semibold">
              +3.3% AfC Uplift Applied
            </span>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-sans font-semibold text-slate-600">
                  <th className="py-3 px-4">Pay Band</th>
                  <th className="py-3 px-4">Spine Point</th>
                  <th className="py-3 px-4">Basic Gross</th>
                  <th className="py-3 px-4">HCAS Allowance</th>
                  <th className="py-3 px-4 font-bold text-slate-900">Total Gross</th>
                  <th className="py-3 px-4 font-bold text-emerald-700">Estimated Net/Mo</th>
                  <th className="py-3 px-4">Hourly Rate</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                {trustBandRows.map((row) => {
                  if (!row) return null;
                  return (
                    <React.Fragment key={row.band}>
                      {/* Entry Point Row */}
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <Link
                            href={`/bands/${row.slug}/`}
                            className="text-[#005EB8] hover:underline"
                          >
                            {row.band}
                          </Link>
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {row.typicalRole}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                          Entry (Step 0)
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {formatCurrency(row.entry.baseGross)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          +{formatCurrency(row.entry.hcas)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {formatCurrency(row.entry.totalGross)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          ~{formatCurrency(row.entry.monthlyNet)}/mo
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {formatHourlyRate(row.entry.hourly)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/?band=${encodeURIComponent(row.band)}&hcas=${hcasZone}`}
                            className="rounded-md bg-slate-100 hover:bg-[#005EB8] hover:text-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors inline-block"
                          >
                            Calculate →
                          </Link>
                        </td>
                      </tr>

                      {/* Top Point Row */}
                      <tr className="hover:bg-slate-50/70 transition-colors bg-slate-50/30">
                        <td className="py-2.5 px-4 font-medium text-slate-500 text-[11px]">
                          ↳ Top of {row.band}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono text-xs">
                          Top ({row.top.years > 0 ? `${row.top.years} yrs` : "Single point"})
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-700">
                          {formatCurrency(row.top.baseGross)}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">
                          +{formatCurrency(row.top.hcas)}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {formatCurrency(row.top.totalGross)}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                          ~{formatCurrency(row.top.monthlyNet)}/mo
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">
                          {formatHourlyRate(row.top.hourly)}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <Link
                            href={`/?band=${encodeURIComponent(row.band)}&hcas=${hcasZone}`}
                            className="rounded-md bg-slate-100 hover:bg-[#005EB8] hover:text-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors inline-block"
                          >
                            Calculate →
                          </Link>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            *Net pay calculations assume standard 2026/27 PAYE personal allowance (1257L tax code), standard National Insurance, and 2015 NHS CARE Pension scheme member contribution tiers. Excludes student loan deductions and overtime.
          </p>
        </section>

        {/* Hospital Campuses & Sites */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#005EB8]" />
              Hospital Sites &amp; Clinical Facilities ({trust.majorHospitals.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agenda for Change staff at any of the following {trust.shortName} facilities receive the {trust.hcasRate} allowance:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {trust.majorHospitals.map((hospital) => (
              <div
                key={hospital}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#005EB8] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {hospital}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {trust.shortName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Calculator Callout */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Custom Pay &amp; Shift Modeler
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Model Your Exact Take-Home Pay at {trust.shortName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Add night shifts (+30% / +44%), Sunday shifts (+60% / +88%), student loans (Plan 1, 2, 4, 5, Postgraduate), or part-time contracted hours to see your exact monthly ESR bank deposit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href={`/?band=Band+5&hcas=${hcasZone}`}
                className="px-5 py-3 rounded-xl bg-[#005EB8] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md text-center"
              >
                Launch Calculator for {trust.shortName} →
              </Link>
            </div>
          </div>
        </section>

        {/* Share Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white">
          <div>
            <div className="text-sm font-bold text-slate-900">
              Share {trust.shortName} Pay Scales with Colleagues
            </div>
            <div className="text-xs text-slate-500">
              Instant summary formatted for ward WhatsApp groups and staff rooms
            </div>
          </div>
          <ShareBreakdownButton
            shareText={`🏥 ${trust.name} 2026/27 Pay Scales:\n• Allowance: ${trust.hcasRate}\n• Starting Band 5 Take-Home: ~${formatCurrency(trust.band5StartingNetMonthly)}/mo (${formatCurrency(trust.band5StartingGross)}/yr gross)\n• Hospital Campuses: ${trust.majorHospitals.slice(0, 3).join(", ")}`}
            url={`https://netpayscale.uk/trusts/${trust.id}/`}
            variant="light"
            label="Share Trust Pay Breakdown"
          />
        </div>

        {/* Sibling Trusts in Same Region */}
        {siblingTrusts.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Other NHS Trusts in {trust.region}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare pay scales and London weighting allowances across nearby healthcare trusts
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {siblingTrusts.map((sibling) => (
                <Link
                  key={sibling.id}
                  href={`/trusts/${sibling.id}/`}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#005EB8] hover:shadow-xs transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      ODS: {sibling.code}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mt-2 group-hover:text-[#005EB8] transition-colors leading-snug">
                      {sibling.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {sibling.hcasRate}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#005EB8]">
                    <span>View Pay Scale</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sibling Calculator Tools Bento */}
        <section className="pt-4 border-t border-slate-200">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Specialist NHS Agenda for Change Calculators
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore specialized tools for promotion traps, night shifts, pensions, and maternity leave
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/promotion-calculator/"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#005EB8] transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#005EB8]">
                ⚡ Band 5 → 6 Promotion &amp; Pension Trap Tool
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Calculate the real take-home gain and pension bracket traps when moving from Band 5 to Band 6.
              </p>
            </Link>

            <Link
              href="/unsocial-hours-calculator/"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#005EB8] transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#005EB8]">
                🌙 Section 2 Unsocial Hours &amp; Night Shift Calculator
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Model your weekly shift rota and see how much cash you actually keep from night shifts.
              </p>
            </Link>

            <Link
              href="/pension-calculator/"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#005EB8] transition-all group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#005EB8]">
                🏦 NHS 2015 CARE Pension &amp; Lump Sum Calculator
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Calculate your 1/54th retirement pension accrual, tax relief savings, and lump sum commutation.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
