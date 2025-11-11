/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Window backgrounds
        'raycast-bg-start': '#1C1C1E',
        'raycast-bg-end': '#2C2C2E',
        'raycast-bg': 'rgba(28, 28, 30, 0.85)',

        // Component backgrounds
        'raycast-search-bg': '#242428',
        'raycast-list-bg': '#2A2A2D',

        // Interactive states
        'raycast-hover': 'rgba(255, 255, 255, 0.06)',
        'raycast-hover-subtle': 'rgba(255, 255, 255, 0.05)',
        'raycast-selected': 'rgba(255, 255, 255, 0.08)',

        // Borders and separators
        'raycast-border': 'rgba(255, 255, 255, 0.1)',
        'raycast-border-subtle': 'rgba(255, 255, 255, 0.08)',
        'raycast-border-selected': 'rgba(255, 255, 255, 0.12)',

        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#8E8E93',
        'text-tertiary': '#636366',

        // Accent colors
        'priority-high': '#FF3B30',
        'priority-medium': '#FF9500',
        'priority-low': '#007AFF',
        'success': '#34C759',
        'link': '#007AFF',

        // Legacy colors (for backward compatibility)
        'apple-blue': '#007AFF',
        'apple-purple': '#5856D6',

        // Light theme (for future use)
        'raycast-bg-light': 'rgba(255, 255, 255, 0.8)',
        'raycast-search-light': 'rgba(255, 255, 255, 0.5)',
        'raycast-hover-light': 'rgba(0, 0, 0, 0.03)',
      },
      backdropBlur: {
        'raycast': '40px',
      },
      borderRadius: {
        'window': '16px',
        'search': '10px',
        'button': '8px',
        'item': '6px',
        'small': '4px',
        'raycast': '14px', // legacy
      },
      fontSize: {
        'title-large': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'title': ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'body': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '14px', fontWeight: '400' }],
        'metadata': ['11px', { lineHeight: '14px', fontWeight: '400' }],
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
      },
      letterSpacing: {
        'caps': '0.5px',
      },
      boxShadow: {
        'window': '0 0 0 0.5px rgba(255, 255, 255, 0.1) inset, 0 20px 60px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)',
        'selected': '0 0 0 1px rgba(255, 255, 255, 0.12) inset',
      },
      transitionDuration: {
        '150': '150ms',
      },
      transitionTimingFunction: {
        'raycast': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-in',
        'slide-in-right': 'slideInRight 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
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
