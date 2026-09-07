import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // SIMPUS Primary Colors - Updated 2026-03-31
      colors: {
        // Primary color palette - Main teal/cyan for healthcare
        'primary': {
          50: '#f0f9fc',
          100: '#e1f3f8',
          200: '#c3e8f1',
          300: '#a4dce8',
          400: '#7bc9de',
          500: '#0c96b5', // Main brand color
          600: '#0a7a94',
          700: '#085d73',
          800: '#064152',
          900: '#042c36',
          950: '#021a1e',
        },
        // Secondary color palette - Deep blue for accents
        'secondary': {
          50: '#f0f5fb',
          100: '#e1ecf7',
          200: '#c3d8f0',
          300: '#a4c4e8',
          400: '#7ba5dc',
          500: '#1077bd', // Secondary accent color
          600: '#0d5c96',
          700: '#0a4470',
          800: '#072d4a',
          900: '#051a2f',
          950: '#030f1b',
        },
        // Success - green for positive actions
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#052e16',
        },
        // Warning - amber for alerts
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Danger - red for destructive actions
        'danger': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#431407',
        },
        // Neutral - grayscale
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
        display: ['var(--font-playfair)', 'serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-600) 100%)',
      },
      boxShadow: {
        'primary': '0 4px 6px -1px rgba(12, 150, 181, 0.1), 0 2px 4px -1px rgba(12, 150, 181, 0.06)',
        'primary-lg': '0 20px 25px -5px rgba(12, 150, 181, 0.1), 0 10px 10px -5px rgba(12, 150, 181, 0.04)',
      },
    },
  },
  plugins: [],
}

export default config
