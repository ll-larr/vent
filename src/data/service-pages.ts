import type { ServicePageMeta } from '@/lib/content';

// Registry consumed by the /uslugi hub page and (eventually) sitemap wiring.
// title/description are metadata copy; h1 is the visible on-page heading —
// kept as plain strings here so they can drive <title>/<meta> without JSX.
export const SERVICE_PAGES: ServicePageMeta[] = [
  {
    slug: 'chistka-ot-zhira',
    title: 'Очистка вентиляции от жира в ресторане — Москва',
    h1: 'Очистка вентиляции от жира в ресторане',
    description:
      'Очистка вентиляции от жира в ресторане: удаляем нагар из воздуховодов и зонтов, снижаем риск возгорания на кухне. Цена от 300 ₽/пог.м, Москва и область.',
    serviceKey: 'grease',
  },
  {
    slug: 'chistka-ot-pyli',
    title: 'Чистка воздуховодов в Москве от пыли',
    h1: 'Чистка воздуховодов от пыли в Москве',
    description:
      'Чистка воздуховодов от пыли для офисов, складов и производств в Москве и области: восстанавливаем воздухообмен, убираем аллергены. Цена от 100 ₽/пог.м.',
    serviceKey: 'dust',
  },
  {
    slug: 'dezinfekciya',
    title: 'Дезинфекция систем вентиляции — Москва',
    h1: 'Дезинфекция систем вентиляции',
    description:
      'Дезинфекция и противомикробная обработка воздуховодов после чистки в Москве и области. Для общепита, офисов и производств. Цена от 30 ₽/пог.м, с протоколом.',
    serviceKey: 'disinfect',
  },
  {
    slug: 'vytyazhki-i-zonty',
    title: 'Чистка вытяжки в ресторане: цена — Москва',
    h1: 'Чистка вытяжки в ресторане',
    description:
      'Чистка вытяжек и зонтов пищеблоков в Москве и области: разбор, мойка в ванне, сборка без повреждения металла. Цена от 2 000 ₽ за зонт, без остановки кухни.',
    serviceKey: 'hood',
  },
  {
    slug: 'videoinspekciya',
    title: 'Видеоинспекция вентиляционных каналов',
    h1: 'Видеоинспекция вентиляционных каналов',
    description:
      'Видеоинспекция вентиляционных каналов эндоскопом и тепловизором в Москве и области: находим засоры, повреждения и негерметичные стыки. Цена 4 500 ₽, с отчётом.',
    serviceKey: 'diag',
  },
];

export default SERVICE_PAGES;
