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
          bg:     "#F9F9FA",
          surface: "#FFFFFF",
          elevated: "#FFFFFF",
          overlay: "#FFFFFF",
        },
        accent: {
          purple: "#FF4F00",
          blue:   "#FF7A33",
          pink:   "#FF4F00",
          green:  "#10B981",
        },
        border: {
          subtle:  "rgba(0,0,0,0.06)",
          default: "rgba(0,0,0,0.12)",
          strong:  "rgba(0,0,0,0.20)",
        },
        text: {
          primary:   "#1A1A1A",
          secondary: "#555555",
          muted:     "#888888",
        },
      },
      boxShadow: {
        'layer-1': '0px 8px 32px rgba(0, 0, 0, 0.08), inset 0px 1px 0px rgba(255,255,255,0.6)',
        'layer-2': '0px 16px 48px rgba(0, 0, 0, 0.12), inset 0px 1px 0px rgba(255,255,255,0.6)',
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
