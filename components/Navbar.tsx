"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                NetPayScale UK
              </span>
              <span className="text-[10px] text-text-muted hidden sm:inline leading-none">
                Agenda for Change 2026/27 Circular
              </span>
            </div>
          </Link>
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full bg-surface-muted font-medium text-xs text-text-muted border border-border-subtle">
            2026/27 AfC
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <a
            href="/#calculator"
            className="px-3 py-1.5 transition-all duration-150 bg-nhs-blue text-white font-semibold text-sm rounded-lg shadow-xs active:scale-95"
          >
            Pay Calculator
          </a>
          <a
            href="/#comparator-section"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            Scenario Comparator
          </a>
          <a
            href="/#esr-payslip-print"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            Official ESR Payslip
          </a>
          <a
            href="/#bands-overview"
            className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            Band Directory
          </a>
          <a
            href="/#hcas-guide"
            className="hidden xl:inline-block px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text-ink hover:bg-surface-muted transition-all duration-150 active:scale-95"
          >
            London Weighting
          </a>
        </nav>

        {/* Right Metadata & Mobile Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-surface-muted text-xs text-text-body border border-border-subtle font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cash-emerald pulse-glow-dot" />
            <span className="whitespace-nowrap font-sans font-medium text-text-ink">Tax Year 2026/27</span>
            <span className="text-zinc-300">•</span>
            <span className="whitespace-nowrap text-text-muted">England &amp; Wales</span>
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
        <div className="lg:hidden border-t border-border-subtle bg-white px-4 py-3 space-y-1 shadow-lg transition-all duration-200">
          <a
            className="block px-3 py-2 rounded-lg bg-nhs-blue text-white font-semibold text-sm"
            href="/#calculator"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pay Calculator
          </a>
          <a
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/#comparator-section"
            onClick={() => setMobileMenuOpen(false)}
          >
            Scenario Comparator
          </a>
          <a
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/#esr-payslip-print"
            onClick={() => setMobileMenuOpen(false)}
          >
            Official ESR Payslip
          </a>
          <a
            className="block px-3 py-2 rounded-lg text-text-body hover:bg-surface-muted font-medium text-sm"
            href="/#bands-overview"
            onClick={() => setMobileMenuOpen(false)}
          >
            AfC Band Directory
          </a>
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
