"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-border-subtle shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-11 items-center justify-center rounded bg-nhs-blue text-white shadow-xs group-hover:scale-105 transition-transform duration-150">
              <span className="font-extrabold text-sm tracking-tight">NHS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg text-text-ink tracking-tight font-bold">
                {t("siteTitle", "NetPayScale UK")}
              </span>
              <span className="text-[10px] text-text-muted hidden sm:inline leading-none">
                {t("circularTitle", "Agenda for Change 2026/27 Circular")}
              </span>
            </div>
          </Link>
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full bg-surface-muted font-medium text-xs text-text-muted border border-border-subtle">
            2026/27 AfC
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 transition-all duration-150 bg-nhs-blue text-white font-semibold text-sm rounded-lg shadow-xs active:scale-95"
          >
            {t("payCalculator", "Pay Calculator")}
          </Link>
          <Link
            href="/bands/band-5/"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("bandHubs", "Band 5–9 Hubs")}
          </Link>
          <Link
            href="/pension-calculator/"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("pension", "Pension")}
          </Link>
          <Link
            href="/maternity-pay-calculator/"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("maternityPay", "Maternity Pay")}
          </Link>
          <Link
            href="/annual-leave-calculator/"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("annualLeave", "Annual Leave")}
          </Link>
          <Link
            href="/bank-shift-calculator/"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("bankShift", "Bank & Overtime")}
          </Link>
          <Link
            href="/sick-pay-calculator/"
            className="hidden xl:inline-block px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("sickPay", "Sick Pay")}
          </Link>
          <Link
            href="/pay-rise-backpay-calculator/"
            className="hidden xl:inline-block px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("backPay", "Back Pay")}
          </Link>
          <Link
            href="/promotion-calculator/"
            className="hidden 2xl:inline-block px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            {t("promotion", "Promotion")}
          </Link>
        </nav>

        {/* Right Metadata & Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector variant="header" />

          <div className="hidden md:flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-surface-muted text-xs text-text-body border border-border-subtle font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cash-emerald pulse-glow-dot" />
            <span className="whitespace-nowrap font-sans font-medium text-text-ink">{t("taxYearLabel", "Tax Year 2026/27")}</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap text-text-muted">{t("ukWide", "UK Wide")}</span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            className="lg:hidden w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center text-text-ink hover:bg-zinc-200 active:scale-90 transition-all duration-150"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-white px-4 py-3 space-y-2 shadow-lg transition-all duration-200">
          <LanguageSelector variant="mobile" />

          <Link
            className="block px-3 py-2 rounded-lg bg-nhs-blue text-white font-semibold text-sm"
            href="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            2026/27 NHS Salary Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/bands/band-5/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Band 2–9 Salary Hubs
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/pension-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Pension Calculator (2015 CARE Scheme)
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/sick-pay-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Sick Pay &amp; Half-Pay Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/maternity-pay-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Maternity Pay Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/annual-leave-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Annual Leave &amp; Bank Holiday Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/bank-shift-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Bank Shift &amp; Overtime Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/unsocial-hours-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Unsocial Hours &amp; Night Pay Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/pay-rise-backpay-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS 3.3% Pay Rise &amp; Back-Pay Arrears Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/promotion-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Band Promotion Pay Comparator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/redundancy-pay-calculator/"
            onClick={() => setMobileMenuOpen(false)}
          >
            NHS Redundancy &amp; MARS Severance Calculator
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/international/"
            onClick={() => setMobileMenuOpen(false)}
          >
            International Recruits &amp; Visa Pay Guide
          </Link>
          <Link
            className="block px-3 py-2 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-semibold text-sm flex items-center justify-between"
            href="/embed/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Embed Free Calculator Widget</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">1-Click</span>
          </Link>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cash-emerald pulse-glow-dot" />
              2026/27 AfC (+3.3%)
            </span>
            <span>Annex 2 &amp; 3</span>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

