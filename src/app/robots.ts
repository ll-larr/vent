import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // /privacy is noindex via page metadata — it must stay crawlable, otherwise
    // the crawler never reads the noindex directive it's blocked from fetching.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
