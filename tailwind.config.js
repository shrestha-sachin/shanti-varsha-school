/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0d47a1',      // Deep blue - primary color
        'navy-dark': '#0a3d91',  // Darker navy for hover states
        'gold': '#ff6f00',       // Vibrant orange-gold accent
        'gold-light': '#ff8f00', // Lighter gold for hover
        'gold-dark': '#e65100', // Darker gold
      },
    },
  },
  plugins: [],
}
