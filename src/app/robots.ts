import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/privacy', '/api/'] },
    sitemap: 'https://cleanvent.ru/sitemap.xml',
  };
}
