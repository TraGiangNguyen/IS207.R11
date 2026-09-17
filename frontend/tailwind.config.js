/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beauty: {
          50: '#f0fdf9',
          100: '#caf8e4',
          200: '#a4f4d2',
          300: '#5ed9ba',
          400: '#23bf9d',
          500: '#088178', // Primary Teal from Sellzy
          600: '#056d6e',
          700: '#04535c',
          800: '#033d45',
          900: '#02292f',
        },
        gold: {
          400: '#ffe16a',
          500: '#ffc107', // Accent Warning Gold from Sellzy
          600: '#d97706',
          700: '#b78103',
        },
        surface: {
          card: 'rgba(255, 255, 255, 0.9)',
          dark: '#0f172a',
          glass: 'rgba(255, 255, 255, 0.25)',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        brand: ['Urbanist', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
