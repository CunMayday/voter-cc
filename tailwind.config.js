/**
 * Version: 2
 * Updated Tailwind config with Purdue University official colors
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purdue': {
          'gold': '#C28E0E',        // Campus Gold - Primary gold
          'athletic-gold': '#CEB888', // Athletic Gold - Secondary
          'black': '#000000',        // Purdue Black
          'gray': '#9D968D',         // Supporting gray
          'dark-gray': '#373A36',    // Secondary text
        }
      }
    },
  },
  plugins: [],
}
