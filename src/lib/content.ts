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
  h1: string;
  description: string;
  datePublished: string;
  dateModified?: string;
};

// The entries live in src/data next to the other content tables (venues,
// cases, reviews); this module stays the single import point for anything
// that iterates them — hub pages, sitemap, footer.
export { SERVICE_PAGES } from '@/data/service-pages';
export { ARTICLES } from '@/data/articles';

export const serviceUrl = (slug: string): string => `/uslugi/${slug}`;
export const articleUrl = (slug: string): string => `/blog/${slug}`;
