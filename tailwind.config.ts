import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        mist: '#FBFBF9',
        sand: '#F7F5F0',
        lavender: '#F4F2EB',
        'soft-purple': '#EFECE4',
        primary: {
          DEFAULT: '#1B4332', // Deep botanical luxury emerald
          hover: '#143527',
          deep: '#0D241A',
          light: '#EBF4F0',
          glow: 'rgba(27, 67, 50, 0.15)',
        },
        brand: {
          emerald: '#1B4332',
          gold: '#C59B27',
          charcoal: '#141219',
          cream: '#F9F8F5',
        },
        gold: {
          50: '#FDFBF4',
          100: '#FAF5E6',
          400: '#D8B146',
          500: '#C59B27',
          600: '#A47E19',
        },
        ink: {
          DEFAULT: '#141219',
          soft: '#26242E',
          light: '#4B4855',
        },
        muted: {
          DEFAULT: '#6E6B78',
          light: '#9E9AA6',
          border: '#E8E5DF',
        },
        'star-gold': '#C59B27',
        emerald: {
          50: '#F0F7F4',
          100: '#DDEEE7',
          500: '#1B4332',
          600: '#143527',
        },
        ruby: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 2px 10px rgba(20, 18, 25, 0.06)',
        'glow-md': '0 8px 30px rgba(20, 18, 25, 0.08)',
        'glow-lg': '0 20px 45px rgba(20, 18, 25, 0.10)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'float': '0 14px 35px rgba(20, 18, 25, 0.09)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'blob-pulse': 'blob 8s infinite ease-in-out',
        'float-slow': 'float 6s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)' },
          '33%': { transform: 'scale(1.08) translate(15px, -20px)' },
          '66%': { transform: 'scale(0.95) translate(-10px, 15px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
