/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        appareo: "Appareo, cursive",
        yan: "Yantramanav, serif",
        steelfish: "Steelfish, serif",
      },
      animation: {
        blob: "blob 12s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            backgroundPosition: "left",
          },
          "50%": {
            backgroundPosition: "right",
          },
          "100%": {
            backgroundPosition: "left",
          },
        },
      },
    },
  },
  plugins: [],
};
