/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",       // Customize these colors as needed
          "secondary": "#9333ea",
          "accent": "#fbbf24",
          "neutral": "#3d4451",
          "base-100": "#ffffff",      // Light background
        },
      },
    ],
  },
  plugins: [
    require("daisyui")
  ],
}