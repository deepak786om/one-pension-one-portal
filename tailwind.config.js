/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F8FD",
        foreground: "#13294B",
        primary: {
          DEFAULT: "#1B3A6B",
          light: "#2E5AA8",
          foreground: "#FFFFFF",
        },
        saffron: {
          DEFAULT: "#E98A1E",
          light: "#F4A63C",
          foreground: "#241500",
        },
        success: {
          DEFAULT: "#1B9C57",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#EEF3FA",
          foreground: "#5B6B85",
        },
        border: "#E1E8F2",
        card: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        elegant: "0 18px 44px -20px rgba(16,33,64,0.38)",
        card: "0 1px 2px rgba(16,33,64,0.06)",
        glow: "0 12px 30px -12px rgba(233,138,30,0.55)",
        soft: "0 8px 24px -14px rgba(16,33,64,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, (i / 100).toString()])),
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        floatSlow: {
          "0%,100%": { transform: "translate(0px,0px)" },
          "50%": { transform: "translate(10px,-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(27,156,87,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(27,156,87,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(27,156,87,0)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        floatSlow: "floatSlow 12s ease-in-out infinite",
        pulseRing: "pulseRing 2s infinite",
      },
    },
  },
  plugins: [],
};
