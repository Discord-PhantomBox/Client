import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        horror: {
          50: '#0a0a0a',
          100: '#1a1a1a',
          200: '#2a2a2a',
          300: '#3a3a3a',
          400: '#4a4a4a',
          500: '#5a5a5a',
          600: '#6a6a6a',
          700: '#7a7a7a',
          800: '#8a8a8a',
          900: '#9a9a9a',
        },
        blood: {
          50: '#1a0000',
          100: '#2a0000',
          200: '#3a0000',
          300: '#4a0000',
          400: '#5a0000',
          500: '#8b0000',
          600: '#a00000',
          700: '#b50000',
          800: '#ca0000',
          900: '#df0000',
        },
        shadow: {
          50: '#000000',
          100: '#0a0a0a',
          200: '#1a1a1a',
          300: '#2a2a2a',
          400: '#3a3a3a',
          500: '#4a4a4a',
          600: '#5a5a5a',
          700: '#6a6a6a',
          800: '#7a7a7a',
          900: '#8a8a8a',
        },
        eerie: {
          50: '#001a1a',
          100: '#002a2a',
          200: '#003a3a',
          300: '#004a4a',
          400: '#005a5a',
          500: '#006666',
          600: '#007272',
          700: '#007e7e',
          800: '#008a8a',
          900: '#009696',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'shake': 'shake 0.5s ease-in-out infinite',
        'shadow-pulse': 'shadow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 0, 0, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        'shadow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 0, 0, 1)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)' },
        }
      },
    },
  },
  plugins: [],
}

export default config 