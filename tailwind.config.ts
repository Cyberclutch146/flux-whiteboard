import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        canvas: {
          bg:     "#0a0a0f",
          surface: "#111118",
          elevated: "#16161f",
          overlay: "#1c1c28",
        },
        accent: {
          purple: "#7c6aff",
          blue:   "#5b9fff",
          pink:   "#ff6a9b",
          green:  "#4ade80",
        },
        border: {
          subtle:  "rgba(255,255,255,0.07)",
          default: "rgba(255,255,255,0.12)",
          strong:  "rgba(255,255,255,0.20)",
        },
        text: {
          primary:   "#e8e8f0",
          secondary: "#9898b0",
          muted:     "#55556a",
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in":   "fade-in 0.2s ease",
        "slide-in-right": "slide-in-right 0.25s ease",
        "shimmer":   "shimmer 1.5s infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(74,222,128,0.5)" },
          "50%":     { opacity: "0.8", boxShadow: "0 0 0 4px rgba(74,222,128,0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)", opacity: "1" },
        },
        "shimmer": {
          from: { transform: "translateX(-100%)" },
          to:   { transform: "translateX(100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
