"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is the 2026/2027 NHS Agenda for Change pay increase?",
    answer:
      "The official 2026/27 NHS Agenda for Change pay award delivers a 3.3% consolidated uplift across all standard pay bands (Bands 2 through 9), establishing a new national starting wage of £25,272 (£12.92/hour) for Band 2 healthcare assistants and clinical support staff.",
  },
  {
    question: "How is High Cost Area Supplement (HCAS / London Weighting) calculated?",
    answer:
      "Under Section 4 and Annex 9 of the Agenda for Change handbook, staff employed by NHS Trusts in London receive a geographic weighting supplement: Inner London receives 20% of basic salary (minimum £5,794, maximum £8,746); Outer London receives 15% (minimum £4,870, maximum £6,137); and the London Fringe zone receives 5% (minimum £1,346, maximum £2,270). HCAS is fully pensionable.",
  },
  {
    question: "How do NHS unsocial hours enhancements (Section 2) work?",
    answer:
      "NHS Agenda for Change Section 2 rules mandate enhancements for working nights, weekends, and public bank holidays. For Bands 4 through 9, nights (8pm-6am) and all day Saturday receive a +30% basic hourly rate uplift, while Sundays and Public Holidays pay +60%. For lower pay bands (Bands 2 and 3), unsocial enhancements are elevated to +44% for nights/Saturdays and +88% for Sundays and Bank Holidays.",
  },
  {
    question: "How does the NHS Pension Scheme reduce my income tax bill?",
    answer:
      "Contributions to the 2015 NHS Pension Scheme operate on a 'Net Pay Arrangement'. This means your contribution (ranging between 5.2% and 12.5% depending on your earnings tier) is deducted directly from your gross pay before Income Tax is calculated. If you are a 20% basic rate taxpayer, every £100 contributed only reduces your net pay by £80; for a 40% higher rate taxpayer, a £100 contribution only costs £60 in take-home pay.",
  },
  {
    question: "What is the £100,000 Personal Allowance taper trap for Band 8d and Band 9?",
    answer:
      "Under UK tax law, the standard £12,570 Personal Allowance is reduced by £1 for every £2 of adjusted net income exceeding £100,000, creating an effective marginal income tax rate of 60% (plus 2% National Insurance) on earnings between £100,000 and £125,140. High-earning NHS staff (Bands 8c, 8d, and 9) can mitigate this penalty by increasing NHS Additional Voluntary Contributions (AVCs) or electric vehicle salary sacrifice leasing.",
  },
  {
    question: "How is National Insurance calculated for NHS employees in 2026/27?",
    answer:
      "For the 2026/27 tax year, Class 1 Employee National Insurance is charged at 8% on gross earnings between the Primary Threshold (£12,570 per year / £1,047.50 per month) and the Upper Earnings Limit (£50,270 per year / £4,189.17 per month). Any gross earnings above £50,270 are subject to a reduced 2% NI rate.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate structured FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="w-full space-y-4 pt-6">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-5 w-5 text-[#005EB8]" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions (NHS Pay, Tax & Pension)
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <span className="text-sm">{faq.question}</span>
                <span className="ml-4 shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-850/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
