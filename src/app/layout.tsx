import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono, Fraunces } from 'next/font/google';
import { localBusinessSchema, websiteSchema, jsonLdScript } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';
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

// Fraunces has no Cyrillic subset — Google only ships latin, latin-ext and
// vietnamese for it, so Russian headings have always fallen back to Georgia.
// That makes the old external <link> to fonts.googleapis.com a render-blocking
// request on the critical path for Latin glyphs only (the wordmark, prices,
// counters). Self-hosting via next/font keeps the same look and drops two
// cross-origin round trips before the LCP heading can paint.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  weight: 'variable',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Keep under ~60 chars — longer titles get truncated in the SERP.
    default: 'Промышленная чистка вентиляции в Москве — vent.team',
    template: '%s · vent.team',
  },
  description:
    'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов. По протоколу МЧС и СЭС. Расчёт онлайн.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'vent.team',
    title: 'vent.team — промышленная чистка вентиляции',
    description:
      'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${interTight.variable} ${jetMono.variable} ${fraunces.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased">
        <CustomCursor />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript([localBusinessSchema(), websiteSchema()])}
        />
      </body>
    </html>
  );
}
