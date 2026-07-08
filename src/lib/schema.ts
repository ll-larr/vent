import { SITE_URL, CONTACT_PHONE, CONTACT_EMAIL } from './site';

export type JsonLd = Record<string, unknown>;

export function localBusinessSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vent',
    description: 'Промышленная чистка вентиляции для бизнеса',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: 'Москва и Подмосковье',
      addressCountry: 'RU',
    },
    areaServed: 'Москва и Московская область',
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

export function serviceSchema(name: string, priceRange: string, description?: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description ?? name,
    provider: { '@type': 'LocalBusiness', name: 'Vent' },
    areaServed: 'Москва и Московская область',
    offers: { '@type': 'Offer', priceCurrency: 'RUB', priceRange },
  };
}

export function jsonLdScript(data: JsonLd | JsonLd[]): { __html: string } {
  // Escape `<` so a literal "</script>" inside any value can't break out of the
  // JSON-LD script tag (defence in depth — current data is static).
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
