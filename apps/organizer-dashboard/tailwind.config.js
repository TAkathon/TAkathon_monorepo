/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5C00",
          dark: "#CC4A00",
          light: "#FF8A3D",
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FECCAA",
          300: "#FCA974",
          400: "#FF8A3D",
          500: "#FF5C00",
          600: "#CC4A00",
          700: "#993800",
          800: "#662500",
          900: "#331300",
        },
        dark: {
          DEFAULT: "#050505",
          50: "#0a0a0a",
          100: "#121212",
          200: "#1a1a1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        archivo: ["Archivo Black", "sans-serif"],
        display: ["Inter", "sans-serif"],
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
        "dust-move": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-200px)" },
        },
        draw: {
          "0%": { strokeDashoffset: "2000" },
          "50%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "0" },
        },
        drawArrow: {
          to: { strokeDashoffset: "0" },
        },
        mascotFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out infinite 2s",
        "float-fast": "float 4s ease-in-out infinite 1s",
        glow: "glow 3s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        sparkle: "sparkle 3s ease-in-out infinite",
        "draw-line": "draw-line 2s ease-out forwards",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "dust-move": "dust-move 30s linear infinite",
        draw: "draw 5s ease-out forwards infinite",
        "draw-arrow": "drawArrow 2s ease-out forwards infinite",
        "mascot-float": "mascotFloat 5s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 92, 0, 0.4), 0 0 60px rgba(255, 92, 0, 0.2)",
        "glow-lg":
          "0 0 30px rgba(255, 92, 0, 0.5), 0 0 80px rgba(255, 92, 0, 0.3)",
        "glow-white":
          "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 92, 0, 0.3)",
        "button-bevel": "0px 4px 0px 0px #CC5500",
        "button-bevel-active": "0px 2px 0px 0px #CC5500",
        "hard-shadow": "8px 8px 0px #1a1a1a",
        "hard-shadow-hover": "12px 12px 0px #1a1a1a",
        "hard-shadow-primary": "6px 6px 0px #FF5C00",
        "hard-shadow-primary-hover": "10px 10px 0px #FF5C00",
      },
    },
  },
  plugins: [],
};
