import type { Metadata } from "next";
import { Suspense } from "react";
import { EmbedCalculatorClient } from "@/components/EmbedCalculatorClient";

export const metadata: Metadata = {
  title: "NHS Salary Calculator 2026/27 (Embed Widget) | NetPayScale UK",
  description:
    "Official 2026/27 NHS Agenda for Change take-home pay calculator widget. Provided by NetPayScale UK.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://netpayscale.uk/",
  },
};

export default function EmbedCalculatorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 bg-transparent">
      <Suspense
        fallback={
          <div className="w-full max-w-2xl h-[480px] bg-white rounded-2xl border border-slate-200 animate-pulse flex items-center justify-center text-slate-400 text-sm">
            Loading NHS Salary Calculator 2026/27...
          </div>
        }
      >
        <EmbedCalculatorClient />
      </Suspense>
    </div>
  );
}
