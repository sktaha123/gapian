/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        background: "#05070B",
        secondary: "#0B1220",
        surface: "#111827",

        text: "#F8FAFC",
        muted: "#94A3B8",

        border: "rgba(255,255,255,0.06)",

        accent: "#3B82F6",
        accentSoft: "#7DA2FF"
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"]
      },

      boxShadow: {
        glow: "0 0 40px rgba(59,130,246,0.12)"
      },

      backdropBlur: {
        xs: "2px"
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },

  plugins: []
};