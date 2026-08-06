import type { ArticleMeta } from '@/lib/content';

// Regulatory-content block (5 articles): the cheapest-competition semantics on
// the site — a venue owner searches these right before an inspection, and the
// same pages are what AI answers / Yandex snippets tend to cite.
// Keep title/description here in sync with the matching page.tsx metadata —
// duplicated on purpose (static `metadata` exports can't import a shared
// object without losing type inference), not derived.
export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'periodichnost-chistki-ventilyacii',
    title: 'Периодичность чистки вентиляции по СанПиН',
    h1: 'Периодичность чистки вентиляции по СанПиН',
    description:
      'Как часто нужно чистить вентиляцию по СанПиН и требованиям пожарной безопасности: таблица периодичности по типу объекта и от чего зависит график чисток.',
    datePublished: '2026-08-05',
  },
  {
    slug: 'kak-chasto-chistit-ventilyaciyu-v-restorane',
    title: 'Как часто чистить вентиляцию в ресторане',
    h1: 'Как часто чистить вентиляцию в ресторане',
    description:
      'От чего зависит интервал чистки вытяжки в ресторане, какие признаки говорят, что пора чистить раньше графика, и как встроить это в работу кухни ресторана.',
    datePublished: '2026-08-05',
  },
  {
    slug: 'akt-ochistki-ventilyacii',
    title: 'Акт очистки вентиляции: что в нём должно быть',
    h1: 'Акт очистки вентиляции',
    description:
      'Что такое акт очистки вентиляции, какие пункты в нём обязательны, кто его подписывает и почему этот документ важен при проверке Роспотребнадзора или МЧС.',
    datePublished: '2026-08-05',
  },
  {
    slug: 'shtrafy-za-gryaznuyu-ventilyaciyu',
    title: 'Штраф за грязную вентиляцию: чем рискует бизнес',
    h1: 'Штраф за грязную вентиляцию',
    description:
      'Какие требования нарушает грязная вентиляция, кто именно проверяет объект — Роспотребнадзор или пожнадзор, и чем это грозит бизнесу общепита при проверке.',
    datePublished: '2026-08-05',
  },
  {
    slug: 'trebovaniya-hassp-k-ventilyacii',
    title: 'Требования ХАССП к вентиляции',
    h1: 'Требования ХАССП к вентиляции',
    description:
      'Как вентиляция вписывается в систему ХАССП: что нужно фиксировать, какие документы держать под рукой и как это связано с графиком чистки и дезинфекции.',
    datePublished: '2026-08-05',
  },
];
