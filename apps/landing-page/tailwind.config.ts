import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D94C1A",
          dark: "#AF3D15",
          light: "#F4845F",
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FECCAA",
          300: "#FCA974",
          400: "#F4845F",
          500: "#D94C1A",
          600: "#AF3D15",
          700: "#8C3010",
          800: "#6A240C",
          900: "#481808",
        },
        dark: {
          DEFAULT: "#1A0A00",
          50: "#2D0F00",
          100: "#3D1500",
          200: "#4D1B00",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          50: "#FFFCF7",
          100: "#FFF8F0",
          200: "#FFF0E0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "magnetic-pull": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        sparkle: "sparkle 3s ease-in-out infinite",
        "draw-line": "draw-line 2s ease-out forwards",
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at center, #AF3D15 0%, transparent 70%)",
        "dark-gradient":
          "linear-gradient(180deg, #1A0A00 0%, #2D0F00 50%, #1A0A00 100%)",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(217, 76, 26, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(244, 132, 95, 0.1) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(217, 76, 26, 0.4), 0 0 60px rgba(217, 76, 26, 0.2)",
        "glow-lg":
          "0 0 30px rgba(217, 76, 26, 0.5), 0 0 80px rgba(217, 76, 26, 0.3)",
        "glow-white":
          "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(217, 76, 26, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
