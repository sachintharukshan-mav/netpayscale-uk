"use client";

import React, { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Monitor,
  Palette,
  Layers,
  MapPin,
  ExternalLink,
} from "lucide-react";
import nhsData from "@/data/nhs_afc_2026.json";

export function EmbedGeneratorClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedBand, setSelectedBand] = useState<string>("band-5");
  const [selectedRegion, setSelectedRegion] = useState<string>("standard");
  const [widthMode, setWidthMode] = useState<"responsive" | "fixed">("responsive");
  const [copied, setCopied] = useState<boolean>(false);

  // Construct iframe embed URL
  const queryParts: string[] = [];
  if (selectedBand !== "band-5") queryParts.push(`band=${selectedBand}`);
  if (theme === "dark") queryParts.push(`theme=dark`);
  if (selectedRegion !== "standard") queryParts.push(`region=${selectedRegion}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const embedUrl = `https://netpayscale.uk/embed/calculator/${queryString}`;

  // Generated HTML Snippet
  const embedCode = `<!-- NetPayScale UK 2026/27 NHS Salary Calculator Embed -->
<iframe
  src="${embedUrl}"
  width="${widthMode === "responsive" ? "100%" : "600"}"
  height="580"
  style="border: 1px solid #e2e8f0; border-radius: 16px; max-width: 640px; width: 100%; display: block; margin: 0 auto; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);"
  title="NHS Salary & Pension Calculator 2026/27"
  loading="lazy"
></iframe>
<div style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; margin-top: 8px; color: #64748b;">
  Free NHS payroll data provided by <a href="https://netpayscale.uk/" target="_blank" rel="noopener" style="color: #005EB8; font-weight: 600; text-decoration: underline;">NetPayScale UK</a> (2026/27 Agenda for Change)
</div>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Panel & Code Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customizer Settings (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#005EB8]" />
              Customize Your Widget
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust styling and pre-selected defaults for your audience.
            </p>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  theme === "light"
                    ? "bg-blue-50 border-[#005EB8] text-[#005EB8]"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white border border-slate-300" />
                Light (Clean)
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
                Dark (Night Shift)
              </button>
            </div>
          </div>

          {/* Default Band Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Default Pay Band
            </label>
            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs font-semibold border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8]"
            >
              {nhsData.bands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.band} ({b.typicalRoles.slice(0, 2).join(", ")})
                </option>
              ))}
            </select>
          </div>

          {/* Default Region Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Default Location
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs font-semibold border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#005EB8]"
            >
              <option value="standard">Outside London (National Standard)</option>
              <option value="inner">Inner London (+20% HCAS)</option>
              <option value="outer">Outer London (+15% HCAS)</option>
              <option value="fringe">Fringe Zone (+5% HCAS)</option>
            </select>
          </div>

          {/* Width Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sizing Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWidthMode("responsive")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  widthMode === "responsive"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Responsive (100%)
              </button>
              <button
                type="button"
                onClick={() => setWidthMode("fixed")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  widthMode === "fixed"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Fixed (600px)
              </button>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-[#005EB8] hover:bg-blue-700 text-white active:scale-[0.99]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                HTML Embed Code Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Embed Code (1-Click)
              </>
            )}
          </button>
        </div>

        {/* Right Column: Code Snippet & Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* HTML Code Box */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                HTML Embed Snippet
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950/80 rounded-xl leading-relaxed whitespace-pre-wrap">
              {embedCode}
            </pre>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Paste into WordPress, Squarespace, Ghost, or any custom HTML page.</span>
              <span className="text-emerald-400 font-bold">Zero Dependencies</span>
            </div>
          </div>

          {/* Live Preview Frame */}
          <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Widget Preview
              </span>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener"
                className="text-[#005EB8] hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                Open in new tab
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-center">
              <iframe
                src={`/embed/calculator/${queryString}`}
                width="100%"
                height="560"
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  maxWidth: widthMode === "fixed" ? "600px" : "640px",
                  backgroundColor: theme === "dark" ? "#020617" : "#ffffff",
                }}
                title="NHS Salary & Pension Calculator 2026/27 Live Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
