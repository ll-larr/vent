import type { ServiceKey } from './pricing';

export type ServicePageMeta = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  serviceKey?: ServiceKey;
};

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
};

/* Article body blocks. The renderer switches on `t`; anything not in this
   union simply cannot be authored. `h` blocks are the ones that get an
   anchor (#h1, #h2 …) and appear in the table of contents. */
export type ArticleBlock =
  | { t: 'p'; v: string }
  | { t: 'h'; v: string }
  | { t: 'quote'; v: string }
  | { t: 'note'; v: string }
  | { t: 'list'; items: string[] }
  | { t: 'img'; src: string; cap: string }
  | { t: 'pair'; src: string; src2: string; cap: string };

export type Article = ArticleMeta & {
  /** Mono kicker above the headline: нормативы, общепит, документы… */
  tag: string;
  /** Display date, DD.MM.YYYY — `datePublished` stays the machine-readable one. */
  date: string;
  /** Reading time, e.g. "6 мин". */
  read: string;
  lead: string;
  hero: string;
  heroCap: string;
  heroAlt: string;
  blocks: ArticleBlock[];
  /** Rendered under the body and emitted as FAQPage structured data. */
  faq: Array<{ q: string; a: string }>;
};

// The entries live in src/data next to the other content tables (venues,
// cases, reviews); this module stays the single import point for anything
// that iterates them — hub pages, sitemap, footer.
export { SERVICE_PAGES } from '@/data/service-pages';
export { ARTICLES } from '@/data/articles';

export const serviceUrl = (slug: string): string => `/uslugi/${slug}`;
export const articleUrl = (slug: string): string => `/blog/${slug}`;
