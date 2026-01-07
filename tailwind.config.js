/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apex: {
          bg: '#09090b', 
          panel: '#18181b', 
          border: '#27272a',
          carb: '#06b6d4', // Cyan
          protein: '#ef4444', // Red
          fat: '#eab308', // Yellow
          papaya: '#ff8000', // Orange
          navy: '#1e3a8a', // Blue
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'carbon-fiber': "radial-gradient(black 15%, transparent 16%), radial-gradient(black 15%, transparent 16%)",
        'checkered': "conic-gradient(#333 90deg, transparent 90deg 180deg, #333 180deg 270deg, transparent 270deg)",
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.4)',
        'neon-orange': '0 0 15px rgba(255, 128, 0, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'f1-flash': 'f1Flash 1s infinite',
      },
      keyframes: {
        f1Flash: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #ef4444' },
          '50%': { opacity: '0.4', boxShadow: '0 0 5px #ef4444' },
        }
      }
    }
  },
  plugins: [],
}