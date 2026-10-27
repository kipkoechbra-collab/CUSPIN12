/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede7',
          200: '#c5dcce',
          300: '#9bc2ad',
          400: '#6ea487',
          500: '#488567',
          600: '#346b51',
          700: '#2a5542',
          800: '#234436',
          900: '#173F35', // Primary brand color
          950: '#0d251f',
        },
        cream: {
          50: '#fdfbf7',
          100: '#F6F0E4', // Primary background color
          200: '#ede2ce',
          300: '#e3d2b5',
          400: '#d7be98',
          500: '#c9a67a',
        },
        gold: {
          300: '#ecd992',
          400: '#dfbd69',
          500: '#D4AF37', // Gold accent
          600: '#c5a059',
          700: '#9e7b39',
        },
        charcoal: {
          800: '#2a2d34',
          900: '#1c1e24',
          950: '#121418',
        },
        festive: {
          red: '#9B1B30',
          wine: '#781d2c',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(23, 63, 53, 0.12)',
        'warm-lg': '0 20px 40px -15px rgba(23, 63, 53, 0.18)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
