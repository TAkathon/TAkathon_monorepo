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
        mascotFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "mascot-float": "mascotFloat 5s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 92, 0, 0.4), 0 0 60px rgba(255, 92, 0, 0.2)",
        "glow-lg":
          "0 0 30px rgba(255, 92, 0, 0.5), 0 0 80px rgba(255, 92, 0, 0.3)",
        "button-bevel": "0px 4px 0px 0px #CC5500",
        "button-bevel-active": "0px 2px 0px 0px #CC5500",
      },
    },
  },
  plugins: [],
};
