"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function HeroStatsTicker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
      {/* Card 1: Band 5 Benchmark */}
      <div className="group rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>Band 5 Entry Take-Home</span>
          <span className="font-mono text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            +3.3% Uplift
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums">
          £2,040.21<span className="text-sm font-medium text-zinc-500"> / mo</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>From £2,672.75 gross</span>
          <span className="text-zinc-700 font-medium font-mono">76p in £1 kept</span>
        </div>
      </div>

      {/* Card 2: Promotion Step-Up Value */}
      <div className="group rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>Band 5 → Band 6 Jump</span>
          <span className="font-mono text-zinc-900 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded">
            Career Step-Up
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums">
          +£7,886<span className="text-sm font-medium text-zinc-500"> / year</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>From £32,073 to £39,959</span>
          <span className="text-emerald-700 font-medium font-mono">+24.6% gross</span>
        </div>
      </div>

      {/* Card 3: Band 7 Clinical Lead */}
      <div className="group rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>Band 7 Starting Salary</span>
          <span className="font-mono text-zinc-900 font-semibold bg-zinc-100 px-1.5 py-0.5 rounded">
            Ward Lead / ACP
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums">
          £49,387<span className="text-sm font-medium text-zinc-500"> / year</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>£25.26/hr base rate</span>
          <span className="text-zinc-700 font-medium font-mono">Top: £56,515</span>
        </div>
      </div>

      {/* Card 4: Inner London Weighting */}
      <div className="group rounded-xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-all hover:border-zinc-300">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>London Weighting (HCAS)</span>
          <span className="font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
            +20% Inner
          </span>
        </div>
        <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight tabular-nums">
          Up to £8,746<span className="text-sm font-medium text-zinc-500"> / yr</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Minimum payment £5,794</span>
          <span className="text-zinc-700 font-medium font-mono">Pensionable</span>
        </div>
      </div>
    </div>
  );
}
