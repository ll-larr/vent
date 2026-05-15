import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { localBusinessSchema, jsonLdScript } from '@/lib/schema';
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
  metadataBase: new URL('https://cleanvent.ru'),
  title: {
    default: 'Vent — промышленная чистка вентиляции для общепита, офисов и складов',
    template: '%s · Vent',
  },
  description:
    'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов. По протоколу МЧС и СЭС. Расчёт онлайн.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://cleanvent.ru',
    siteName: 'Vent',
    title: 'Vent — промышленная чистка вентиляции',
    description:
      'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${fraunces.variable} ${interTight.variable} ${jetMono.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localBusinessSchema())} />
      </body>
    </html>
  );
}
