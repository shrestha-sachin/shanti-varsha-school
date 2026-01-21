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
        'gold': '#06b6d4',       // Vibrant cyan/teal accent
        'gold-light': '#22d3ee', // Lighter cyan for hover
        'gold-dark': '#0891b2', // Darker cyan
      },
    },
  },
  plugins: [],
}
