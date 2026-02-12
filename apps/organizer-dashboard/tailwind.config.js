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
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
