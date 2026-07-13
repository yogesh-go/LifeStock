/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a14',
        secondary: '#12121f',
        card: '#1a1a2e',
        cyan: '#00d4ff',
        green: '#00ff88',
        red: '#ff4444',
        gold: '#ffd700',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}