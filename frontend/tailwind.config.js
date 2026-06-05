/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zyricon: {
          bg: 'var(--bg)',
          sidebar: 'var(--sidebar)',
          card: 'var(--card)',
          purple: 'var(--primary)',
          purpleLight: 'var(--primary-light)',
          purpleDark: 'var(--primary-dark)',
          text: 'var(--text)',
          textMuted: 'var(--text-muted)',
          border: 'var(--border)',
        },
        buddy: {
          lime: '#D9FF00',
          purple: '#B1A1FF',
          pink: '#FFB1D1',
          black: '#050505',
          dark: '#121212',
        },
        primary: {
          light: '#6D28D9',
          dark: '#7C3AED',
        },
        accent: {
          light: '#0D9488',
          dark: '#14B8A6',
        },
        background: {
          light: '#F5F3FF',
          dark: '#0F0F1A',
        },
        sidebar: {
          light: '#EDE9FE',
          dark: '#1A1A2E',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E1B33',
        },
        border: {
          light: '#DDD6FE',
          dark: '#2D2B55',
        },
        text: {
          primary: {
            light: '#1E1B4B',
            dark: '#E2E8F0',
          },
          muted: {
            light: '#6B7280',
            dark: '#94A3B8',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
