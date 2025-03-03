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

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6d28d9',
        secondary: '#5b21b6',
        success: '#059669',
        danger: '#dc2626',
        light: '#ede9fe',
        dark: '#1e1b4b',
      },
      borderRadius: {
        'custom': '12px',
      },
    },
  },
  plugins: [],
};