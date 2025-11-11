/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raycast-bg': 'rgba(28, 28, 30, 0.88)',
        'raycast-border': 'rgba(255, 255, 255, 0.08)',
        'raycast-hover': 'rgba(255, 255, 255, 0.05)',
        'raycast-selected': 'rgba(0, 122, 255, 0.15)',
        'apple-blue': '#007AFF',
        'apple-purple': '#5856D6',
      },
      backdropBlur: {
        'raycast': '40px',
      },
      borderRadius: {
        'raycast': '14px',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(680px)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
