import { describe, it, expect } from 'vitest';
import { parseInline, stripInline, inlineHrefs } from './inline-link';
import { ARTICLES } from '@/data/articles';
import { SERVICE_PAGES } from '@/data/service-pages';
import { serviceUrl, articleUrl } from './content';

describe('parseInline', () => {
  it('leaves text without markup as a single run', () => {
    expect(parseInline('Жир в вытяжке — расходник процесса.')).toEqual([
      { text: 'Жир в вытяжке — расходник процесса.' },
    ]);
  });

  it('splits a link out of the surrounding text', () => {
    expect(parseInline('где [копится жир](/uslugi/chistka-ot-zhira) в канале')).toEqual([
      { text: 'где ' },
      { text: 'копится жир', href: '/uslugi/chistka-ot-zhira' },
      { text: ' в канале' },
    ]);
  });

  it('handles a link at the very start and very end', () => {
    expect(parseInline('[раз](/a) и [два](/b)')).toEqual([
      { text: 'раз', href: '/a' },
      { text: ' и ' },
      { text: 'два', href: '/b' },
    ]);
  });

  // The regex only matches hrefs starting with "/", so these never become
  // links — asserted here because the guard is the security-relevant half.
  it.each([
    'нажмите [сюда](javascript:alert(1))',
    'нажмите [сюда](//evil.tld/x)',
    'нажмите [сюда](https://evil.tld)',
  ])('does not linkify %s', (input) => {
    expect(inlineHrefs(input)).toEqual([]);
  });
});

describe('stripInline', () => {
  it('returns the original sentence character for character', () => {
    const original = 'Метод очистки: механическая щёткой, с отсосом и фильтрацией, с химией.';
    const marked = 'Метод очистки: [механическая щёткой, с отсосом и фильтрацией](/uslugi/x), с химией.';
    expect(stripInline(marked)).toBe(original);
  });

  it('is a no-op on unmarked text', () => {
    expect(stripInline('обычный абзац')).toBe('обычный абзац');
  });
});

/* The whole point of the markup is internal links that resolve. A slug typo
   would otherwise ship as a 404 that nothing in the build complains about. */
describe('article body links', () => {
  const known = new Set([
    ...SERVICE_PAGES.map((page) => serviceUrl(page.slug)),
    ...ARTICLES.map((article) => articleUrl(article.slug)),
    '/uslugi',
    '/blog',
    '/calculator',
    '/contacts',
  ]);

  const found = ARTICLES.flatMap((article) =>
    article.blocks.flatMap((block) => {
      if (block.t === 'p' || block.t === 'h' || block.t === 'quote' || block.t === 'note') {
        return inlineHrefs(block.v).map((href) => ({ slug: article.slug, href }));
      }
      if (block.t === 'list') {
        return block.items.flatMap((item) =>
          inlineHrefs(item).map((href) => ({ slug: article.slug, href })),
        );
      }
      return [];
    }),
  );

  it('point at pages that exist', () => {
    const broken = found.filter((link) => !known.has(link.href));
    expect(broken).toEqual([]);
  });

  // The audit asked for 2–3 contextual links per article; fewer and the
  // commercial pages are back to being fed by the footer alone.
  it.each(ARTICLES.map((article) => article.slug))('%s links out at least twice', (slug) => {
    expect(found.filter((link) => link.slug === slug).length).toBeGreaterThanOrEqual(2);
  });
});
