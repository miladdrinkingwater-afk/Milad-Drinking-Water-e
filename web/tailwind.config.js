/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        milad: {
          navy: '#0A2540',
          dark: '#061A2E',
          heading: '#0F172A',
          primary: '#0284C7',
          deep: '#0369A1',
          accent: '#00A8E8',
          light: '#38BDF8',
          ice: '#E0F2FE',
          pale: '#F0F9FF',
          bsti: '#10B981',
          slate: '#475569',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 37, 64, 0.08)',
        'elevated': '0 20px 40px -15px rgba(2, 132, 199, 0.12)',
        'card': '0 4px 20px -2px rgba(10, 37, 64, 0.05)',
      }
    },
  },
  plugins: [],
}
