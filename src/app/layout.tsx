import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
});

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700'],
});

const jetMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Vent — промышленная чистка вентиляции для общепита, офисов и складов',
  description: 'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов. По протоколу МЧС и СЭС.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fraunces.variable} ${interTight.variable} ${jetMono.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
