import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();
  return [
    { url: `${base}/`,           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contacts`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
