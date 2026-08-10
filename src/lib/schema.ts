import { SITE_URL, CONTACT_PHONE, CONTACT_EMAIL } from './site';

export type JsonLd = Record<string, unknown>;

// Moscow city centre. Service radius is 100 km — stated as a GeoCircle so the
// coverage area is machine-readable instead of a prose string search engines
// have to guess at.
const SERVICE_RADIUS_METRES = 100_000;

const MOSCOW_CENTRE = {
  '@type': 'GeoCoordinates',
  latitude: 55.7558,
  longitude: 37.6173,
} as const;

const AREA_SERVED = {
  '@type': 'GeoCircle',
  geoMidpoint: MOSCOW_CENTRE,
  geoRadius: SERVICE_RADIUS_METRES,
} as const;

export function localBusinessSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Vent Clean',
    description: 'Промышленная чистка вентиляции для бизнеса',
    image: `${SITE_URL}/opengraph-image`,
    priceRange: '₽₽',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: 'Москва',
      addressCountry: 'RU',
      // TODO: streetAddress + postalCode — required before the business can
      // rank in Maps / the local pack.
    },
    geo: MOSCOW_CENTRE,
    areaServed: AREA_SERVED,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    url: SITE_URL,
  };
}

/**
 * Site-level identity. Ties every page to one WebSite node and one publisher,
 * which is what disambiguates the brand for search engines and AI answers when
 * the domain itself carries no history yet.
 */
export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Vent Clean',
    inLanguage: 'ru-RU',
    description:
      'Промышленная чистка вентиляции, вытяжек и зонтов для общепита, офисов и складов. Москва и область.',
    publisher: { '@id': `${SITE_URL}/#business` },
  };
}

export function serviceSchema(name: string, priceRange: string, description?: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description ?? name,
    provider: { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business` },
    areaServed: AREA_SERVED,
    offers: { '@type': 'Offer', priceCurrency: 'RUB', priceRange },
  };
}

export function jsonLdScript(data: JsonLd | JsonLd[]): { __html: string } {
  // Escape `<` so a literal "</script>" inside any value can't break out of the
  // JSON-LD script tag (defence in depth — current data is static).
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}

// `items[].url` is a site-relative path (e.g. "/uslugi/foo") — kept relative
// so callers can pass hrefs straight from nav data without string surgery.
export function breadcrumbSchema(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

// `slug` is the site-relative path (e.g. from articleUrl()/serviceUrl() in
// content.ts), not the bare article id — it's what mainEntityOfPage needs.
export function articleSchema(opts: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}): JsonLd {
  const url = `${SITE_URL}${opts.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business` },
    publisher: { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
