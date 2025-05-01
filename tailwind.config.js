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
          DEFAULT: '#6d28d9',
          light: '#a87aff',
          dark: '#5b21b6',
        },
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
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',
        slideIn: 'slideIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};