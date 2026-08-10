import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono, Fraunces } from 'next/font/google';
import localFont from 'next/font/local';
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

// Marggraff Kursiv Zarte (Schriftguß AG, 1929) — used for the "clean" half of
// the wordmark and nothing else. Subset to Basic Latin and repacked as woff2,
// which takes the shipped file from 324 KB to 21 KB. The source .ttf is not in
// the repo; regenerate with:
//   python -m fontTools.subset "<source>.ttf" \
//     --output-file=src/fonts/marggraff-kursiv-zarte.woff2 \
//     --flavor=woff2 --unicodes=U+0020-007E --layout-features=kern,liga,calt
const marggraff = localFont({
  src: '../fonts/marggraff-kursiv-zarte.woff2',
  display: 'swap',
  variable: '--font-marggraff',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Keep under ~60 chars — longer titles get truncated in the SERP.
    default: 'Промышленная чистка вентиляции в Москве — Vent Clean',
    template: '%s · Vent Clean',
  },
  description:
    'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов. По протоколу МЧС и СЭС. Расчёт онлайн.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Vent Clean',
    title: 'Vent Clean — промышленная чистка вентиляции',
    description:
      'Промышленная чистка вентканалов, вытяжек и зонтов для общепита, офисов и складов.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${interTight.variable} ${jetMono.variable} ${fraunces.variable} ${marggraff.variable}`}
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
