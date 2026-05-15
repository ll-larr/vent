export type CaseStudy = {
  id: string;
  badge: string;        // "кейс 01 · жир"
  category: string;     // venueType meta line ("Общепит · 220 м²")
  title: string;        // headline
  description: string;
  footTags: string[];   // expand-row chips
  beforeSrc: string;
  afterSrc: string;
};

export const CASES: CaseStudy[] = [
  {
    id: 'grease2',
    badge: 'кейс 01 · жир',
    category: 'Сеть кафе · 150 м²',
    title: 'Плановая чистка раз в полгода',
    description: 'Регулярное обслуживание кухонной вытяжки. Один день, без остановки точки.',
    footTags: ['каждые 6 мес', 'смена 8 ч'],
    beforeSrc: '/images/compare-grease2-before.jpg',
    afterSrc: '/images/compare-grease2-after.jpg',
  },
  {
    id: 'grease1',
    badge: 'кейс 02 · жир',
    category: 'Общепит · 220 м² · БЦ Москва-Сити',
    title: 'Ресторан в БЦ — три года жира',
    description:
      'Чистка вытяжных зонтов и воздуховодов от жира после трёх лет без обслуживания. Разобрали, почистили и собрали обратно за две ночные смены.',
    footTags: ['2 ночные смены', 'протокол СЭС', 'видеоотчёт'],
    beforeSrc: '/images/compare-grease1-before.jpg',
    afterSrc: '/images/compare-grease1-after.jpg',
  },
  {
    id: 'dust',
    badge: 'кейс 03 · пыль',
    category: 'Офис · 480 м² · БЦ',
    title: 'Пыль за пять лет',
    description:
      'Чистка приточно-вытяжных каналов после 5 лет эксплуатации без обслуживания.',
    footTags: ['3 ночи', 'дезинфекция'],
    beforeSrc: '/images/compare-dust-before.jpg',
    afterSrc: '/images/compare-dust-after.jpg',
  },
];
