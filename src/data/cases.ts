export type CaseStudy = {
  id: string;
  title: string;
  venueType: string;
  beforeSrc: string;
  afterSrc: string;
  description: string;
};

export const CASES: CaseStudy[] = [
  {
    id: 'grease1',
    title: 'Ресторан в БЦ',
    venueType: 'Общепит · 220 м²',
    beforeSrc: '/images/compare-grease1-before.jpg',
    afterSrc:  '/images/compare-grease1-after.jpg',
    description: 'Чистка вытяжных зонтов и воздуховодов от жира после 3 лет без обслуживания.',
  },
  {
    id: 'grease2',
    title: 'Сеть кафе',
    venueType: 'Общепит · 150 м²',
    beforeSrc: '/images/compare-grease2-before.jpg',
    afterSrc:  '/images/compare-grease2-after.jpg',
    description: 'Плановая полугодовая чистка кухонной вытяжной системы.',
  },
  {
    id: 'dust',
    title: 'Офис в БЦ',
    venueType: 'Офис · 480 м²',
    beforeSrc: '/images/compare-dust-before.jpg',
    afterSrc:  '/images/compare-dust-after.jpg',
    description: 'Чистка вентканалов от пыли после 5 лет эксплуатации.',
  },
];
