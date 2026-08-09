import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Topbar } from '@/components/story/Topbar';
import { ProgressBar } from '@/components/story/ProgressBar';
import { StoryEngine } from '@/components/story/StoryEngine';
import { StoryFooter } from '@/components/story/StoryFooter';
import { SectionLabel } from '@/components/story/SectionLabel';
import { ArticleBody, articleHeadings } from '@/components/story/ArticleBody';
import { FaqList } from '@/components/story/FaqList';
import { StoryCta } from '@/components/story/StoryCta';
import { ARTICLES, articleUrl } from '@/lib/content';
import { articleSchema, faqSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

/* One template for all five materials. The prototype picked the article from
   ?slug=; here it is a real route, and the URL stays /blog/<slug> — those are
   the indexed addresses and the redesign is not worth losing them over. */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: articleUrl(article.slug) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const headings = articleHeadings(article.blocks);
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  const jsonLd = jsonLdScript([
    articleSchema({
      title: article.title,
      description: article.description,
      slug: articleUrl(article.slug),
      datePublished: article.datePublished,
      dateModified: article.dateModified,
    }),
    faqSchema(article.faq),
    breadcrumbSchema([
      { name: 'Главная', url: `${SITE_URL}/` },
      { name: 'Статьи', url: `${SITE_URL}/blog` },
      { name: article.title, url: `${SITE_URL}${articleUrl(article.slug)}` },
    ]),
  ]);

  return (
    <>
      <ProgressBar />
      <Topbar variant="solid" activeArticles />

      <article>
        <div className="mx-auto max-w-[1180px] px-[clamp(22px,3vw,56px)] pb-[clamp(20px,3vh,34px)] pt-[clamp(28px,5vh,64px)]">
          <Link
            href="/blog"
            className="mono-label mb-[clamp(18px,3vh,30px)] inline-flex items-center gap-[9px] text-[10.5px] text-ink/55 transition-colors duration-300 hover:text-ink"
          >
            <span aria-hidden="true">←</span> все статьи
          </Link>
          <div className="mono-label mb-3.5 flex gap-4 text-[10.5px] text-ink/45">
            <span className="text-brand">{article.tag}</span>
            {article.date}
            <span>{article.read}</span>
          </div>
          <h1 className="mb-[clamp(14px,2vh,22px)] max-w-[20ch] font-display text-[clamp(34px,5.4vw,86px)] font-light leading-[.96] tracking-[-.036em]">
            {article.title}
          </h1>
          <p className="max-w-[56ch] text-[clamp(17px,1.5vw,24px)] leading-[1.5] text-ink/[.72]">
            {article.lead}
          </p>
        </div>

        <div className="relative w-full overflow-hidden bg-black-deep aspect-[4/3] min-[900px]:aspect-[21/8]">
          <Image
            src={article.hero}
            alt={article.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <span className="mono-label absolute bottom-[clamp(14px,2vh,26px)] left-[clamp(16px,3vw,40px)] rounded-pill bg-black-deep/55 px-3 py-[7px] text-[9.5px] text-bg/80">
            {article.heroCap}
          </span>
        </div>

        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-[clamp(24px,5vw,84px)] px-[clamp(22px,3vw,56px)] pb-[clamp(40px,6vh,80px)] pt-[clamp(30px,5vh,64px)] min-[900px]:grid-cols-[230px_1fr]">
          <aside className="min-w-0">
            <div className="flex flex-col gap-4 min-[900px]:sticky min-[900px]:top-[86px]">
              <div className="mono-label border-b border-ink/[.14] pb-2.5 text-[10px] text-ink/45">
                в этой статье
              </div>
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className="text-[14.5px] leading-[1.45] text-ink/60 transition-colors duration-300 hover:text-ink"
                >
                  {h.text}
                </a>
              ))}
              <div className="mt-1.5 flex flex-col gap-2.5 border-t border-ink/[.14] pt-4">
                <span className="mono-label text-[10px] text-ink/45">нужен расчёт?</span>
                <Link
                  href="/#07"
                  className="inline-flex items-center justify-center gap-[9px] rounded-pill bg-ink px-[18px] py-[13px] text-[14px] font-medium text-bg transition-colors duration-[350ms] hover:bg-accent hover:text-ink"
                >
                  Калькулятор <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <ArticleBody blocks={article.blocks} />
            <FaqList items={article.faq} />
          </div>
        </div>
      </article>

      <StoryCta
        heading="Посчитать для своего объекта."
        text="Калькулятор даёт вилку за минуту. Точную сумму инженер называет на осмотре — и дальше она не меняется."
      />

      <section className="px-[clamp(22px,3vw,56px)] pb-[clamp(44px,6vh,80px)] pt-[clamp(36px,5.5vh,68px)]">
        <SectionLabel className="mb-[clamp(16px,2.5vh,26px)]">читайте также</SectionLabel>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px bg-ink/[.14]">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={articleUrl(item.slug)}
              className="flex flex-col gap-3 bg-bg p-[clamp(16px,1.8vw,24px)] text-ink transition-colors duration-[350ms] hover:bg-surface"
            >
              <span className="relative block overflow-hidden bg-black-deep aspect-[16/9]">
                <Image src={item.hero} alt="" fill sizes="(max-width: 900px) 100vw, 360px" className="object-cover" />
              </span>
              <span className="mono-label text-[10px] text-ink/45">{item.read}</span>
              <span className="block font-display text-[clamp(19px,1.7vw,26px)] font-normal leading-[1.14] tracking-[-.022em]">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <StoryFooter variant="compact" />
      <StoryEngine />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
