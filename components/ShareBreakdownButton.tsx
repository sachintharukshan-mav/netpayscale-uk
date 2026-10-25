"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

interface ShareBreakdownButtonProps {
  shareText: string;
  url?: string;
  variant?: "dark" | "light";
  label?: string;
}

export function ShareBreakdownButton({
  shareText,
  url = "https://netpayscale.uk/",
  variant = "dark",
  label = "Share Calculation with Colleagues",
}: ShareBreakdownButtonProps) {
  const [copied, setCopied] = useState(false);

  const fullMessage = shareText.includes("https://")
    ? shareText
    : `${shareText}\n\nCalculate yours: ${url}`;

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = fullMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isDark = variant === "dark";

  return (
    <div
      data-share-widget="whatsapp-copy-breakdown"
      className={`print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl p-3.5 border transition-all ${
        isDark
          ? "bg-white/5 border-white/15 text-white"
          : "bg-slate-50 border-slate-200/90 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-bold">
        <Share2 className={`w-4 h-4 shrink-0 ${isDark ? "text-emerald-400" : "text-[#005EB8]"}`} />
        <span className={isDark ? "text-slate-200" : "text-slate-700"}>{label}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share calculation to WhatsApp"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
          <span>Share to WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy calculation breakdown to clipboard"
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs border active:scale-95 transition-all cursor-pointer ${
            copied
              ? "bg-emerald-600 text-white border-emerald-500"
              : isDark
              ? "bg-white/10 hover:bg-white/15 text-white border-white/20"
              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied Breakdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Breakdown</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ShareBreakdownButton;
