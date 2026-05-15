/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        black: {
          50: '#161B22',
          100: '#111318',
          200: '#0F1724',
          300: '#0B0B0F',
          400: '#050505'
        },
        blue: {
          50: '#7AB6FF',
          100: '#4B8DFF',
          200: '#2D7DFF',
          300: '#1B4DCC',
          400: '#123B8C'
        },
        gray: {
          50: '#D9DEE7',
          100: '#A0A7B4',
          200: '#6E7685',
          300: '#3A4352',
          400: '#202635'
        },
        white: {
          50: '#FFFFFF',
          100: '#F5F7FA'
        },
        background: "#050505",
        surface: "#0B0B0F",
        surfaceHover: "#111318",
        border: "#202635",
        text: "#FFFFFF",
        muted: "#A0A7B4",
        accent: "#2D7DFF",
        accentHover: "#4B8DFF",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["DM Sans", "Inter", "sans-serif"]
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

      screens: {
        xs: '480px'
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)"
      }
    }
  },

  plugins: []
};