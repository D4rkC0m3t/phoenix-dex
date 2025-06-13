/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New color palette
        'orange': '#FF5F00',
        'orange-light': '#FF7F33',
        'orange-dark': '#E55500',

        'maroon': '#B20600',
        'maroon-light': '#D10700',
        'maroon-dark': '#8F0500',

        'dark-blue': '#00092C',
        'dark-blue-light': '#000C45',
        'dark-blue-dark': '#000620',

        'grey': '#EEEEEE',
        'grey-light': '#FFFFFF',
        'grey-dark': '#DDDDDD',

        // Legacy colors (keeping for backward compatibility)
        'ethereum-purple': '#636890',
        'dark-space-gray': '#1A1A1A',
        'safety-green': '#00FF88',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'proto-mono': ['"Space Mono"', 'monospace'], // Keeping the class name for compatibility
        'aeonik': ['Aeonik', 'Inter', 'sans-serif'],
        'diatype': ['Diatype', 'Inter', 'sans-serif'],
        'gt-alpina': ['"GT Alpina"', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'maroon-glow': 'maroonGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 95, 0, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 95, 0, 0.6)' },
        },
        maroonGlow: {
          '0%': { boxShadow: '0 0 5px rgba(178, 6, 0, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(178, 6, 0, 0.6)' },
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [],
}