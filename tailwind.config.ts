import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: "#005EB8",
          darkblue: "#003087",
          brightblue: "#0072CE",
          lightblue: "#41B6E6",
          aqua: "#00A9CE",
          darkpink: "#7C2855",
          darkred: "#8A1538",
        },
        "nhs-blue": "#005EB8",
        "nhs-navy": "#003087",
        "cash-emerald": "#059669",
        "pension-indigo": "#4F46E5",
        "tax-rose": "#E11D48",
        "ni-amber": "#D97706",
        "loan-pink": "#DB2777",
        "bg-page": "#FAFAFA",
        "text-ink": "#09090B",
        "text-muted": "#71717A",
        "text-body": "#27272A",
        "border-subtle": "#E4E4E7",
        "border-strong": "#D4D4D8",
        "surface-card": "#FFFFFF",
        "surface-muted": "#F4F4F5",
        "surface-container": "#ecedf6",
        slate: {
          850: "#151e2e",
          950: "#090d16",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
