import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e5c32',
          hover:   '#2d7d46',
          dark:    '#0f3d22',
          accent:  '#22c55e',
          light:   '#eef5ef',
          muted:   '#5a6b5e',
        },
        ink:   '#111827',
        stone: '#f4f4f2',
        bg:    '#f7faf7',
      },
      fontFamily: {
        sans:    ['Onest', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      maxWidth: {
        content: '1120px',
      },
      borderRadius: {
        pill: '980px',
        card: '16px',
        xl2: '24px',
      },
      backgroundImage: {
        hero: 'linear-gradient(160deg, #0a2414 0%, #1e5c32 55%, #0f3d22 100%)',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        lifted:  '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        float:   '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        'brand-glow': '0 0 0 4px rgba(30,92,50,0.15)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'scale-in':   'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right':'slideRight 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer:      'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
