import type { Metadata } from "next";
import Link from "next/link";
import { EmbedGeneratorClient } from "@/components/EmbedGeneratorClient";
import { ShareBreakdownButton } from "@/components/ShareBreakdownButton";
import {
  Code,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Embed NHS Salary Calculator 2026/27 (Free Website Widget) | NetPayScale UK",
  description:
    "Embed the official 2026/27 NHS Agenda for Change (+3.3%) salary, net take-home pay, and pension calculator on your website or trust intranet for free. Fully responsive, zero dependencies, and instant 1-click HTML code.",
  alternates: {
    canonical: "https://netpayscale.uk/embed/",
    types: {
      "text/markdown": "https://netpayscale.uk/embed.md",
    },
  },
  other: {
    "ai-summary":
      "Free embeddable 2026/27 UK NHS Salary & Pension Calculator widget for nursing blogs, NHS Trust intranets, unions (RCN/Unison), and healthcare recruitment agencies. Computes net take-home pay, 3.3% AfC uplifts, HCAS London weighting, and 2015 CARE pension tiers in a responsive iframe.",
  },
  openGraph: {
    title:
      "Embed Free NHS Salary & Pension Calculator Widget (2026/27) | NetPayScale UK",
    description:
      "Add an official 2026/27 NHS take-home pay calculator to your healthcare website in 60 seconds. Free, responsive, zero-maintenance.",
    url: "https://netpayscale.uk/embed/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "Embed NHS Salary Calculator Widget 2026/27",
      },
    ],
  },
};

export default function EmbedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "NHS Salary Calculator",
            item: "https://netpayscale.uk/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Embed Calculator Widget",
            item: "https://netpayscale.uk/embed/",
          },
        ],
      },
      {
        "@type": "WebApplication",
        name: "NHS Salary Calculator Embed Widget",
        url: "https://netpayscale.uk/embed/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires HTML5 iframe support.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the NetPayScale UK NHS salary calculator embed free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, the NetPayScale UK calculator widget is 100% free to embed on any public website, nursing blog, NHS Trust intranet, union site, or healthcare recruitment platform without requiring an API key or account registration.",
            },
          },
          {
            "@type": "Question",
            name: "How do I embed the calculator on WordPress or Squarespace?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Simply copy the generated 1-click HTML snippet from our generator and paste it into a 'Custom HTML' or 'Code' block on WordPress, Squarespace, Ghost, Wix, or your custom CMS.",
            },
          },
          {
            "@type": "Question",
            name: "Will embedding this widget slow down my website?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The widget is served via Cloudflare's global edge network (sub-50ms latency) and loads in an isolated iframe with loading='lazy', ensuring zero impact on your core web vitals, speed score, or page performance.",
            },
          },
          {
            "@type": "Question",
            name: "Can I customize the default pay band or theme?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Our visual customizer allows you to pre-select any Agenda for Change pay band (e.g. Band 5 for nursing sites), toggle between Light and Dark Night Shift themes, and configure London Weighting defaults.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-[#005EB8] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Embed Calculator</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#005EB8] border border-blue-200 mb-4">
              <Code className="w-3.5 h-3.5" />
              Webmaster &amp; Publisher Toolkit · 100% Free
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Embed the Official NHS Salary Calculator on Your Website
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Equip your nursing blog, NHS trust intranet, union branch, or recruitment agency with an interactive, verified <strong>2026/27 Agenda for Change (+3.3%)</strong> net take-home pay calculator.
            </p>
          </div>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005EB8] block mb-1">
                Zero Cost Forever
              </span>
              <div className="text-xl font-black text-slate-900">
                100% Free Access
              </div>
              <p className="text-xs text-slate-600 mt-1">
                No subscription, no API key required, and zero licensing fees.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                Always Up-to-Date
              </span>
              <div className="text-xl font-black text-emerald-900">
                Automatic Sync
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Updated automatically when new AfC pay awards or pension rates pass.
              </p>
            </div>

            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 block mb-1">
                Lighting Fast
              </span>
              <div className="text-xl font-black text-purple-900">
                Sub-50ms Edge
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Cached on Cloudflare Pages global edge; zero impact on page speed.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
                Full Customization
              </span>
              <div className="text-xl font-black text-amber-900">
                Light &amp; Dark Themes
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Pre-configure default pay bands (B2 to B9) and London weighting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <EmbedGeneratorClient />
      </section>

      {/* Integration Guide Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#005EB8]" />
              Who Uses the NetPayScale UK Embed Widget?
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Trusted by clinical communicators, recruitment consultancies, and staff representatives across the UK.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#005EB8] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Nursing &amp; Healthcare Blogs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide valuable salary benchmarks on career advice articles, student nurse qualification guides, and Band 5 to Band 6 promotion tips.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                NHS Staff Intranets &amp; Unions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                RCN and Unison branch pages, hospital staff intranet portals, and wellness hubs offering instant net pay calculations.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Healthcare Recruiters &amp; Agencies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Help overseas and domestic candidates see their exact take-home pay after pension and tax on live job listing pages.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <ShareBreakdownButton
              variant="light"
              label="Share Embed Widget Generator with Colleague / Webmaster"
              url="https://netpayscale.uk/embed/"
              shareText={`🛠️ Free 2026/27 NHS Salary Calculator Website Embed:\n• Clean interactive widget for blogs, intranets & recruitment portals\n• Computes net take-home pay, 3.3% AfC uplifts, London weighting & pension tiers\n• 1-Click HTML code: https://netpayscale.uk/embed/`}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#005EB8]" />
              Frequently Asked Questions About Embedding
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Is the NetPayScale UK calculator widget free to embed?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Yes, completely free. You do not need to register, configure an API key, or pay any licensing fees. We maintain the servers, edge caches, and statutory tax updates at zero cost to you.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                How do I add this to WordPress?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                In WordPress Gutenberg editor, add a <strong>Custom HTML block</strong>, paste the copied snippet, and click Update. In Classic Editor, switch to the 'Text' tab and paste the snippet directly.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Will this slow down my website or affect Core Web Vitals?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                No. The iframe code includes <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">loading=&quot;lazy&quot;</code> and is hosted across Cloudflare's global edge network. Your page renders immediately, and the widget loads asynchronously without blocking your main JavaScript thread.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Can I customize which band is selected by default?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Yes! Simply use the dropdown in our customizer above to select Band 2, 3, 4, 5, 6, 7, 8a, 8b, 8c, 8d, or 9. The generated iframe code will automatically set that band as the active view for your users.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
