import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { SERVICE_PAGES, ARTICLES, serviceUrl, articleUrl } from '@/lib/content';

// Real edit dates, bumped by hand when a page's content actually changes.
// `new Date()` here would stamp every URL as "modified now" on each build, and
// search engines learn to ignore a lastmod that always says today.
const LAST_MODIFIED = {
  home: '2026-08-04',
  calculator: '2026-08-04',
  contacts: '2026-08-04',
  content: '2026-08-05',
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    { url: `${base}/`,           lastModified: LAST_MODIFIED.home,       changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculator`, lastModified: LAST_MODIFIED.calculator, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contacts`,   lastModified: LAST_MODIFIED.contacts,   changeFrequency: 'monthly', priority: 0.6 },

    { url: `${base}/uslugi`, lastModified: LAST_MODIFIED.content, changeFrequency: 'monthly', priority: 0.9 },
    ...SERVICE_PAGES.map((page) => ({
      url: `${base}${serviceUrl(page.slug)}`,
      lastModified: LAST_MODIFIED.content,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    { url: `${base}/blog`, lastModified: LAST_MODIFIED.content, changeFrequency: 'weekly', priority: 0.6 },
    ...ARTICLES.map((article) => ({
      url: `${base}${articleUrl(article.slug)}`,
      lastModified: article.dateModified ?? article.datePublished,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
