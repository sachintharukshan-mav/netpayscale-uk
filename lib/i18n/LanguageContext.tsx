"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode, LanguageInfo, TranslationDictionary } from "./types";
import { AVAILABLE_LANGUAGES, TRANSLATIONS } from "./translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  currentLanguage: LanguageInfo;
  availableLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "netpayscale_user_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        if (saved === "ar") {
          document.documentElement.dir = "rtl";
        } else {
          document.documentElement.dir = "ltr";
        }
      }
    } catch {
      // Ignore localStorage access failures
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    if (!TRANSLATIONS[newLang]) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
      if (newLang === "ar") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    } catch {
      // Ignore
    }
  };

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const value = dict[key];
    if (value) return value;
    const enValue = TRANSLATIONS.en[key];
    if (enValue) return enValue;
    return fallback || String(key);
  };

  const currentLanguage =
    AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components rendering outside LanguageProvider
    return {
      language: "en" as LanguageCode,
      setLanguage: () => {},
      t: (key: keyof TranslationDictionary, fallback?: string) =>
        TRANSLATIONS.en[key] || fallback || String(key),
      currentLanguage: AVAILABLE_LANGUAGES[0],
      availableLanguages: AVAILABLE_LANGUAGES,
    };
  }
  return context;
}
