/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: "#2d5a3d",
        "stone-light": "#4a7c59",
        "stone-lighter": "#6b8e6b",
        "stone-dark": "#1a3322",
        "breathing-green": "#68d391",
        "breathing-blue": "#4299e1",
        "breathing-pink": "#ed64a6",
        "breathing-gold": "#f6ad55",
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        "breathe-slow": "breathe 8s ease-in-out infinite",
        "breathe-fast": "breathe 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "scale(1.03)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      screens: {
        xs: "475px",
      },
      boxShadow: {
        "breathing-green": "0 0 40px rgba(104, 211, 145, 0.4)",
        "breathing-blue": "0 0 40px rgba(66, 153, 225, 0.4)",
        "breathing-pink": "0 0 40px rgba(237, 100, 166, 0.4)",
      },
    },
  },
  plugins: [],
};
