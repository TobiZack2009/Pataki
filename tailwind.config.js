/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        md: {
          primary: '#6750A4',
          'on-primary': '#FFFFFF',
          'secondary-container': '#E8DEF8',
          'on-secondary-container': '#1D192B',
          tertiary: '#7D5260',
          'on-tertiary': '#FFFFFF',
          surface: '#FFFBFE',
          'on-surface': '#1C1B1F',
          'surface-container': '#F3EDF7',
          'surface-container-low': '#E7E0EC',
          'on-surface-variant': '#49454F',
          outline: '#79747E',
        }
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'md-xs': '8px',
        'md-s': '12px',
        'md-m': '16px',
        'md-l': '24px',
        'md-xl': '28px',
        'md-2xl': '32px',
        'md-3xl': '48px',
      },
      transitionTimingFunction: {
        'md-standard': 'cubic-bezier(0.2, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}
