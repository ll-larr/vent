import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { localBusinessSchema, jsonLdScript } from '@/lib/schema';
import CustomCursor from '@/components/CustomCursor/CustomCursor';
import './globals.css';

// Inter Tight via next/font (Cyrillic supported, ships only weights we use).
const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['400', '500', '600'],
});

// JetBrains Mono — Cyrillic isn't a published subset in next/font types but Latin
// covers the small mono captions we use (mostly numbers + Latin labels).
const jetMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
});

// Fraunces is loaded via <link> so we can request the full opsz + ital +
// Cyrillic subset matching the bento reference exactly. next/font for Fraunces
// doesn't expose the Cyrillic subset in v14.2 types.
const FRAUNCES_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500' +
  '&display=swap';

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
    <html lang="ru" className={`${interTight.variable} ${jetMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FRAUNCES_HREF} />
      </head>
      <body className="font-sans bg-bg text-ink antialiased">
        <CustomCursor />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localBusinessSchema())} />
      </body>
    </html>
  );
}
