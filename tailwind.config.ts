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
          hover: '#2d7d46',
          light: '#eef5ef',
          muted: '#5a6b5e',
        },
        bg: '#f7faf7',
      },
      fontFamily: {
        sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: {
        content: '1120px',
      },
      borderRadius: {
        pill: '980px',
        card: '20px',
      },
      backgroundImage: {
        hero: 'linear-gradient(160deg, #0f2d1a 0%, #1e5c32 60%, #163d24 100%)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
