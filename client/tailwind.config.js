/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070b12',
          surface: '#0d1522',
          card: '#121d2f',
          cardHover: '#18263e',
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: 'rgba(255, 255, 255, 0.16)',
          teal: '#006067',
          tealLight: '#00838f',
          cyan: '#00e5ff',
          textMuted: '#94a3b8',
          textLight: '#e2e8f0',
        }
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(0, 229, 255, 0.25)',
        'glow-subtle': '0 10px 30px -10px rgba(0, 96, 103, 0.3)',
      }
    },
  },
  plugins: [],
}
