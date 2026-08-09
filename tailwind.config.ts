import type { Config } from 'tailwindcss';

// Tailwind v4 reads the design tokens from `@theme` in src/app/globals.css —
// colours, fonts and the single radius all live there. Redeclaring any of them
// here would create a second source of truth, so this file carries nothing but
// the content globs.
const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
};

export default config;
