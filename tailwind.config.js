/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Copied verbatim from the LeadForge app's tailwind.config.js so this
      // standalone page matches the product's actual design system rather
      // than approximating it.
      colors: {
        primary: {
          50: 'rgb(var(--c-primary-50) / <alpha-value>)',
          100: 'rgb(var(--c-primary-100) / <alpha-value>)',
          200: '#c7d7fe',
          300: '#a5bcfc',
          400: '#8098f9',
          500: '#6172f3',
          600: '#4a5ae8',
          700: 'rgb(var(--c-primary-700) / <alpha-value>)',
          800: '#3037a4',
          900: '#2c3382',
        },
        gray: {
          50: 'rgb(var(--c-gray-50) / <alpha-value>)',
          100: 'rgb(var(--c-gray-100) / <alpha-value>)',
          200: 'rgb(var(--c-gray-200) / <alpha-value>)',
          300: 'rgb(var(--c-gray-300) / <alpha-value>)',
          400: 'rgb(var(--c-gray-400) / <alpha-value>)',
          500: 'rgb(var(--c-gray-500) / <alpha-value>)',
          600: 'rgb(var(--c-gray-600) / <alpha-value>)',
          700: 'rgb(var(--c-gray-700) / <alpha-value>)',
          800: 'rgb(var(--c-gray-800) / <alpha-value>)',
          900: 'rgb(var(--c-gray-900) / <alpha-value>)',
        },
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto',
               'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
        lift: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.05)',
        button: '0 1px 2px 0 rgb(15 23 42 / 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
