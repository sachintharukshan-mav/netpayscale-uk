import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://netpayscale.uk"),
  title: {
    default: "NetPayScale UK (NHS Edition) | 2026/27 NHS Salary & Pension Calculator",
    template: "%s | NetPayScale UK",
  },
  description:
    "Official 2026/2027 UK NHS Salary & Pension Calculator. Accurately calculate take-home pay, Agenda for Change pay steps, London Weighting (HCAS), unsocial hours enhancements, and NHS pension deductions.",
  alternates: {
    canonical: "https://netpayscale.uk/",
    types: {
      "text/markdown": "https://netpayscale.uk/index.md",
    },
  },
  other: {
    "ai-summary":
      "Official 2026/27 UK NHS Salary & Pension Calculator for 1.3M+ Agenda for Change healthcare staff. Computes net take-home pay, 3.3% AfC pay steps, London Weighting (HCAS), NHS 2015 CARE Pension tiers, Section 2 unsocial hours, Maternity Pay (OMP/SMP), Sick Pay, and Annual Leave.",
  },
  keywords: [
    "NHS salary calculator",
    "NHS pay scale 2026",
    "Agenda for Change 2026/27",
    "NHS take home pay",
    "London Weighting NHS",
    "HCAS calculator",
    "NHS pension contribution calculator",
    "Band 5 nurse salary London",
    "Band 6 paramedic salary",
    "NHS pay rise 2026",
  ],
  authors: [{ name: "NetPayScale UK" }],
  creator: "NetPayScale UK",
  publisher: "NetPayScale UK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "NetPayScale UK (NHS Edition) | 2026/27 NHS Pay & Pension Calculator",
    description:
      "Instant take-home pay calculation for 1.3M+ NHS healthcare staff. Includes 3.3% pay uplift, HCAS London weighting, and 2015 CARE Pension tiers.",
    url: "https://netpayscale.uk/",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://netpayscale.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "NetPayScale UK — 2026/27 NHS Salary & Pension Take-Home Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NetPayScale UK | NHS Salary & Pension Calculator (2026/27)",
    description:
      "Calculate your exact NHS net monthly take-home deposit after tax, pension, and London weighting.",
    images: ["https://netpayscale.uk/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://netpayscale.uk/#organization",
        name: "NetPayScale UK (NHS Edition)",
        url: "https://netpayscale.uk/",
        logo: "https://netpayscale.uk/icon-512.png",
        description:
          "Official 2026/27 UK NHS Salary & Pension Calculator for 1.3M+ Agenda for Change healthcare staff. Computes net take-home pay, 3.3% AfC pay steps, London Weighting (HCAS), NHS 2015 CARE Pension tiers, Section 2 unsocial hours, Maternity Pay (OMP/SMP), Sick Pay, and Annual Leave.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "editorial@netpayscale.uk",
          contactType: "editorial & payroll verification",
          url: "https://netpayscale.uk/contact/",
        },
      },
      {
        "@type": "WebSite",
        name: "NetPayScale UK (NHS Edition)",
        url: "https://netpayscale.uk/",
        description:
          "Official 2026/2027 UK NHS Salary & Pension Calculator for 1.3M+ Agenda for Change staff.",
        publisher: {
          "@id": "https://netpayscale.uk/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://netpayscale.uk/?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        name: "NHS Salary & Pension Calculator",
        url: "https://netpayscale.uk/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "GBP",
        },
        featureList: [
          "Agenda for Change 2026/27 Pay Scale Verification (+3.3%)",
          "High Cost Area Supplement (HCAS London Weighting)",
          "Section 2 Unsocial Hours & Night Shift Uplift Calculation",
          "NHS 2015 Scheme CARE Pension Tier Deductions",
          "HMRC PAYE Income Tax & Class 1 NIC Calculations",
          "Official Electronic Staff Record (ESR) Payslip Simulation",
        ],
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#005EB8" />
        <link rel="describedby" href="https://netpayscale.uk/llms.txt" type="text/plain" />
        <link rel="describedby" href="https://netpayscale.uk/ai.txt" type="text/plain" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-[#005EB8]/20 selection:text-[#005EB8]">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
