import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Topbar } from '@/components/story/Topbar';
import { StoryFooter } from '@/components/story/StoryFooter';
import { SectionLabel } from '@/components/story/SectionLabel';
import { ARTICLES, articleUrl } from '@/lib/content';
import { plural } from '@/lib/utils';
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Статьи о чистке вентиляции',
  description:
    'Разборы по периодичности чистки вентиляции, документам и требованиям надзора: что спрашивают перед проверкой Роспотребнадзора и пожнадзора.',
  alternates: { canonical: '/blog' },
};

const [lead, ...rest] = ARTICLES;

const META_ROW = 'mono-label flex gap-3.5 text-[10px] text-ink/45';

export default function BlogPage() {
  return (
    <>
      <Topbar variant="solid" activeArticles />

      <main id="main">
        <section className="border-b border-ink/[.12] px-[clamp(22px,3vw,56px)] pb-[clamp(24px,3.5vh,40px)] pt-[clamp(40px,7vh,84px)]">
          <SectionLabel className="mb-4">
            статьи · {ARTICLES.length} {plural(ARTICLES.length, ['материал', 'материала', 'материалов'])}
          </SectionLabel>
          <div className="flex flex-wrap items-end justify-between gap-[clamp(20px,3vw,48px)]">
            <h1 className="flex-[1_1_480px] font-display text-[clamp(38px,6.4vw,104px)] font-light leading-[.92] tracking-[-.038em]">
              Что спрашивают
              <br />
              перед проверкой.
            </h1>
            <p className="flex-[0_1_38ch] text-[clamp(15px,1.1vw,18px)] leading-[1.6] text-ink/[.66]">
              Разборы по периодичности, документам и требованиям надзора — так, как это выглядит
              на практике, без пересказа нормативов ради объёма.
            </p>
          </div>
        </section>

        <section className="px-[clamp(22px,3vw,56px)] pb-[clamp(48px,7vh,88px)] pt-[clamp(26px,4vh,48px)]">
          <Link
            href={articleUrl(lead.slug)}
            className="grid grid-cols-1 items-center gap-[clamp(18px,3vw,52px)] border-b border-ink/[.14] pb-[clamp(26px,4vh,44px)] text-ink min-[900px]:grid-cols-[1.05fr_1fr]"
          >
            <span className="relative block overflow-hidden bg-black-deep aspect-[16/10]">
              <Image
                src={lead.hero}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 55vw"
                className="object-cover"
              />
              <span className="mono-label absolute left-3.5 top-3.5 rounded-pill bg-accent px-[13px] py-[7px] text-[9.5px] tracking-[.16em] text-ink">
                читают чаще всего
              </span>
            </span>
            <span className="block min-w-0">
              <span className={`${META_ROW} mb-3`}>
                {lead.date}
                <span>{lead.read}</span>
              </span>
              <span className="mb-3 block font-display text-[clamp(28px,3.6vw,58px)] font-light leading-[1.02] tracking-[-.032em]">
                {lead.title}
              </span>
              <span className="block max-w-[60ch] text-[clamp(15px,1.1vw,17.5px)] leading-[1.6] text-ink/[.66]">
                {lead.description}
              </span>
              <span className="mono-label mt-[18px] inline-flex items-center gap-[9px] border-b border-brand/40 pb-1 text-[10.5px] text-brand">
                читать <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>

          <div className="mt-[clamp(26px,4vh,44px)] grid grid-cols-[repeat(auto-fit,minmax(268px,1fr))] gap-px bg-ink/[.14]">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={articleUrl(article.slug)}
                className="flex flex-col gap-3.5 bg-bg p-[clamp(18px,2vw,28px)] text-ink transition-colors duration-[350ms] hover:bg-surface"
              >
                <span className="relative block overflow-hidden bg-black-deep aspect-[16/10]">
                  <Image
                    src={article.hero}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 320px"
                    className="object-cover"
                  />
                </span>
                <span className={META_ROW}>
                  {article.date}
                  <span>{article.read}</span>
                </span>
                <span className="block font-display text-[clamp(20px,1.8vw,28px)] font-normal leading-[1.12] tracking-[-.022em]">
                  {article.title}
                </span>
                <span className="block text-[15px] leading-[1.55] text-ink/[.62]">
                  {article.description}
                </span>
                <span className="mono-label mt-auto inline-flex items-center gap-2 text-[10px] text-brand">
                  читать <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-6 bg-ink px-[clamp(22px,3vw,56px)] py-[clamp(40px,6vh,72px)] text-bg">
          <div className="min-w-0">
            <h2 className="mb-2.5 font-display text-[clamp(28px,3.6vw,56px)] font-light leading-none tracking-[-.032em]">
              Проще спросить инженера.
            </h2>
            <p className="max-w-[80ch] text-[clamp(15px,1.1vw,17px)] leading-[1.6] text-bg/70">
              Назовём периодичность и стоимость для вашего объекта после осмотра.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#07"
              className="inline-flex items-center gap-2.5 rounded-pill bg-accent px-6 py-[15px] text-[14.5px] font-medium text-ink transition-colors duration-[350ms] hover:bg-bg"
            >
              Рассчитать стоимость <span aria-hidden="true">→</span>
            </Link>
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center gap-2.5 rounded-pill border border-bg/[.24] px-[22px] py-3.5 text-[14.5px] transition-colors duration-[350ms] hover:border-accent hover:text-accent"
            >
              {CONTACT_PHONE}
            </a>
          </div>
        </section>
      </main>

      <StoryFooter variant="compact" />
    </>
  );
}
