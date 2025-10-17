// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#D9CFC0',         // Warm beige
        sectionBg: '#A5A091',          // Muted sage gray-green
        accent: '#E6B8A2',             // Soft blush pink
        textPrimary: '#4E4B44',        // Deep taupe gray
        highlight: '#F9F5F0',          // Creamy off-white
        button: '#BFA78A',             // Warm sand brown
      },
    },
  },
  plugins: [],
};
