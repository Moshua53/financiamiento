/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        finance: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        institutional: {
          bg: '#F8FAFC',
          darkBg: '#0A0D12',
          surface: '#FFFFFF',
          darkSurface: '#12161F',
          border: '#E2E8F0',
          darkBorder: '#1E293B',
          muted: '#64748B',
        },
        entrepreneur: {
          forest: '#0F766E',
          salvia: '#059669',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
        financier: {
          navy: '#1D4ED8',
          cobalt: '#2563EB',
          light: '#EFF6FF',
          border: '#BFDBFE',
        },
        risk: {
          lowBg: '#ECFDF5',
          lowText: '#065F46',
          lowBorder: '#A7F3D0',
          midBg: '#FFFBEB',
          midText: '#92400E',
          midBorder: '#FDE68A',
          highBg: '#FFF1F2',
          highText: '#9F1239',
          highBorder: '#FECDD3',
        }
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}