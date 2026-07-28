/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Professional blue
        secondary: '#475569', // Slate gray
        success: '#10b981', // Green
        warning: '#f59e0b', // Amber
        danger: '#ef4444', // Red
      }
    },
  },
  plugins: [],
}