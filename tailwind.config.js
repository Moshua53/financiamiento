/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        fintech: {
          bg: '#020617',         // Deep slate black
          surface: '#0B1120',    // Dark card surface
          card: '#0E162B',       // Elevated card surface
          border: '#1E293B',     // Subtle slate border
          borderLight: '#334155',// Hover border
          accent: '#22C55E',     // Emerald primary solvency
          accentHover: '#16A34A',
          accentLight: 'rgba(34, 197, 94, 0.12)',
          blue: '#3B82F6',       // Trust blue
          indigo: '#6366F1',     // Modern tech
          gold: '#F59E0B',       // Warning / interest
          rose: '#EF4444',       // Danger / risk
        }
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(34, 197, 94, 0.15)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.2)',
      }
    },
  },
  plugins: [],
}