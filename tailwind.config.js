/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        assam: {
          green: '#006400',
          darkgreen: '#004d00',
          gold: '#c99700',
          red: '#c0262d'
        }
      }
    },
  },
  plugins: [],
}
