import Link from 'next/link';
import type { Metadata } from 'next';
import { Topbar } from '@/components/story/Topbar';
import { StoryFooter } from '@/components/story/StoryFooter';
import { ARTICLES, articleUrl } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false },
};

// A dead end is a bad place to leave a visitor who was looking for a price or
// a document, so the page offers the three routes they were most likely after.
const WAYS_OUT = [
  { label: 'Калькулятор', href: '/#07' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'Статьи', href: '/blog' },
];

export default function NotFound() {
  return (
    <>
      <Topbar variant="solid" />
      <main
        id="main"
        className="bg-bg px-[clamp(22px,3vw,56px)] pb-[clamp(48px,7vh,88px)] pt-[clamp(40px,7vh,84px)] text-ink"
      >
        <div className="mono-label mb-3.5 flex items-center gap-[11px] text-[11px] text-ink/50">
          <span aria-hidden="true" className="h-px w-5 bg-brand" />
          ошибка 404
        </div>
        <h1 className="max-w-[16ch] font-display text-[clamp(38px,6.4vw,104px)] font-light leading-[.92] tracking-[-.038em]">
          Страница <span className="italic text-brand">не найдена.</span>
        </h1>
        <p className="mt-5 max-w-[44ch] text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-ink/[.66]">
          Возможно, ссылка устарела или страница переехала. Вот куда идти дальше.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {WAYS_OUT.map((way) => (
            <Link
              key={way.href}
              href={way.href}
              className="mono-label rounded-pill border border-ink/[.14] bg-surface px-4 py-[11px] text-[10.5px] tracking-[.1em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg"
            >
              {way.label}
            </Link>
          ))}
        </div>

        <div className="mt-[clamp(32px,5vh,56px)] border-t border-ink/[.14] pt-6">
          <div className="mono-label mb-4 text-[10px] text-ink/45">разборы перед проверкой</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px bg-ink/[.14]">
            {ARTICLES.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={articleUrl(article.slug)}
                className="flex flex-col gap-2 bg-bg p-[clamp(16px,1.8vw,24px)] text-ink transition-colors duration-[350ms] hover:bg-surface"
              >
                <span className="mono-label text-[10px] text-ink/45">{article.read}</span>
                <span className="font-display text-[clamp(19px,1.7vw,26px)] font-normal leading-[1.14] tracking-[-.022em]">
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <StoryFooter variant="compact" />
    </>
  );
}
