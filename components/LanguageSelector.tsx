"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageCode } from "@/lib/i18n/types";
import { Globe, Check, ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "header" | "footer" | "mobile";
}

export function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "footer") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          Language / Wika / भाषा / Idioma
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {availableLanguages.map((l) => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isSelected
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="truncate">{l.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="py-2 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#005EB8]" />
          Choose Language / Pumili ng Wika
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {availableLanguages.map((l) => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#005EB8] text-white shadow-xs"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">{l.flag}</span>
                  <span className="truncate">{l.name}</span>
                </span>
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header Dropdown variant (Desktop & Compact)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select website language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-muted hover:bg-zinc-200 border border-border-subtle text-xs font-medium text-text-ink transition-all active:scale-95"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline font-semibold">{currentLanguage.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200 ring-1 ring-black/5 z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              NHS Community Languages
            </span>
            <span className="text-[10px] text-slate-400">
              Instant translation for UK &amp; overseas healthcare staff
            </span>
          </div>

          <div className="py-1 max-h-80 overflow-y-auto space-y-0.5">
            {availableLanguages.map((l) => {
              const isSelected = l.code === language;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs ${
                    isSelected
                      ? "bg-blue-50 text-[#005EB8] font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{l.flag}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 leading-tight truncate">
                        {l.nativeName}
                        {l.nativeName !== l.name && (
                          <span className="text-slate-400 font-normal ml-1">({l.name})</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {l.community}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-[#005EB8] text-white shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-xl mt-1 text-[10px] text-slate-500 text-center">
            Supported across all 514 calculators &amp; band hubs
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
