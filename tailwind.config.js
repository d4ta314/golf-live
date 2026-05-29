/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        golf: {
          900: '#050505',
          800: '#0A0A0A',
          700: '#0F0F0F',
          600: '#1F1F1F',
          500: '#2A2A2A',
        },
        gold: {
          DEFAULT: '#10F0A0',
          light: '#5AF7C2',
          dark: '#0A8A5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-live': 'pulseLive 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'score-flash': 'scoreFlash 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLive: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scoreFlash: {
          '0%': { backgroundColor: 'rgba(16, 240, 160, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
}
