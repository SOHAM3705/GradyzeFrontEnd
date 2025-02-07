/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",  // If you have an HTML entry file
    "./src/**/*.{js,jsx,ts,tsx}",  // Include all your source files (React files, JS, TS, etc.)
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          light: '#a87aff',
          dark: '#5b21b6',
        },
      },
    },
  },
  plugins: [],
};
