/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff9fb',
          100: '#d6f1f7',
          200: '#ade9f3',
          300: '#76dfeb',
          400: '#3ad4e2',
          500: '#06b6d4', // cyan-500
          600: '#059bb4',
          700: '#04788f',
          800: '#035c70',
          900: '#024557',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // emerald-500
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      spacing: {
        // Base unit: 0.25rem (4px)
        '0': '0',
        '0.25': '0.25rem',
        '0.5': '0.5rem',
        '0.75': '0.75rem',
        '1': '1rem',
        '1.25': '1.25rem',
        '1.5': '1.5rem',
        '2': '2rem',
        '2.5': '2.5rem',
        '3': '3rem',
        '3.5': '3.5rem',
        '4': '4rem',
        '5': '5rem',
        '6': '6rem',
        '7': '7rem',
        '8': '8rem',
        '10': '10rem',
        '12': '12rem',
        '16': '16rem',
        '20': '20rem',
        '24': '24rem',
        '32': '32rem',
        '40': '40rem',
        '48': '48rem',
        '56': '56rem',
        '64': '64rem',
      },
      fontSize: {
        // Typography system
        'h1': ['2.5rem', { lineHeight: '1.2' }], // 40px
        'h2': ['2rem', { lineHeight: '1.3' }],   // 32px
        'h3': ['1.5rem', { lineHeight: '1.4' }], // 24px
        'h4': ['1.25rem', { lineHeight: '1.5' }], // 20px
        'base': ['1rem', { lineHeight: '1.7' }], // 16px
        'sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
      },
      animation: {
        // Animation durations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'instant': 'fadeIn 0.1s ease-in-out', // 100ms - Micro-interactions
        'quick': 'fadeIn 0.2s ease-in-out',   // 200ms - Hover states
        'standard': 'fadeIn 0.3s ease-in-out', // 300ms - Component transitions
        'slow': 'fadeIn 0.4s ease-in-out',    // 400ms - Page transitions
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      // Easing functions
      transitionTimingFunction: {
        'emphasized': 'cubic-bezier(0.2, 0.8, 0.2, 1)', // More expressive motion
        'decelerated': 'cubic-bezier(0, 0, 0.2, 1)', // Starting motion
        'accelerated': 'cubic-bezier(0.4, 0, 1, 1)', // Ending motion
      },
      screens: {
        // Responsive breakpoints
        'mobile': {'max': '768px'},
        'tablet': {'min': '768px', 'max': '1024px'},
        'desktop': {'min': '1024px'},
      },
    },
  },
  plugins: [],
};