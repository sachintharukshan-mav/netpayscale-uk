"use client";

import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consent = localStorage.getItem("nhs_cookie_consent");
    if (!consent) {
      // Delay display slightly to avoid jarring LCP layout shifts
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("nhs_cookie_consent", "accepted");
    // Update Google Consent Mode v2 if present
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("nhs_cookie_consent", "declined");
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">🍪</span>
        <div className="space-y-1 text-xs text-zinc-600 leading-relaxed">
          <h4 className="font-bold text-zinc-950 font-sans text-xs">
            Privacy &amp; Cookie Consent
          </h4>
          <p>
            We use essential cookies to maintain your calculator session and analytics to measure usage. We partner with vetted financial services and ad networks under UK GDPR regulations.
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={handleDecline}
          className="rounded-lg px-3 py-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          Reject Non-Essential
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-lg bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-800 shadow-xs transition-colors cursor-pointer"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
