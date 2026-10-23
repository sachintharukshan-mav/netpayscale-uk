import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://netpayscale.co.uk"),
  title: {
    default: "NetPayScale UK (NHS Edition) | 2026/27 NHS Salary & Pension Calculator",
    template: "%s | NetPayScale UK",
  },
  description:
    "Official 2026/2027 UK NHS Salary & Pension Calculator. Accurately calculate take-home pay, Agenda for Change pay steps, London Weighting (HCAS), unsocial hours enhancements, and NHS pension deductions.",
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
  openGraph: {
    title: "NetPayScale UK (NHS Edition) | 2026/27 NHS Pay & Pension Calculator",
    description:
      "Instant take-home pay calculation for 1.3M+ NHS healthcare staff. Includes 3.3% pay uplift, HCAS London weighting, and 2015 CARE Pension tiers.",
    url: "https://netpayscale.co.uk",
    siteName: "NetPayScale UK",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NetPayScale UK | NHS Salary & Pension Calculator (2026/27)",
    description:
      "Calculate your exact NHS net monthly take-home deposit after tax, pension, and London weighting.",
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
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NetPayScale UK (NHS Edition)",
    url: "https://netpayscale.co.uk",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://netpayscale.co.uk/calculator/{search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#005EB8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-[#005EB8]/20 selection:text-[#005EB8]">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
