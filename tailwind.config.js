/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        luxe: {
          ivory: "#FFFDF8",
          cream: "#F8F1E7",
          beige: "#EFE2D3",
          sand: "#E6D3BE",
          brown: "#8B5E3C",
          royal: "#5C3824",
          espresso: "#2B1A12",
          gold: "#B08A62",
        },
      },
    },
  },

  plugins: [],
};
