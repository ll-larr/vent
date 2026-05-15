export type Review = {
  id: string;
  industry: 'restaurant' | 'warehouse' | 'production';
  industryLabel: string;
  initials: string;
  name: string;
  roleLine: string; // "управляющая · сеть кофеен «Молочный путь»"
  quote: string;
  emphasized?: string; // word/phrase to wrap in <em>
  metric: string;
};

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    industry: 'restaurant',
    industryLabel: 'отзыв 01 · общепит',
    initials: 'АГ',
    name: 'Анна Городничук',
    roleLine: 'управляющая · сеть кофеен «Молочный путь»',
    quote:
      'У нас 6 точек в Москве, каждая со своей кухонной вытяжкой. До Vent инспекция СЭС каждый раз была событием. Теперь по графику раз в полгода — спокойно и без скрытых сюрпризов в актах.',
    emphasized: 'событием',
    metric: '6 точек / 6 мес',
  },
  {
    id: 'r2',
    industry: 'warehouse',
    industryLabel: 'отзыв 02 · склад / логистика',
    initials: 'ДМ',
    name: 'Дмитрий Маслов',
    roleLine: 'главный инженер · СК «Север-Логистик»',
    quote:
      'Холодный склад 8 000 м² — приточно-вытяжная система годами без серьёзной чистки. Почистили всё за 5 ночных смен, не остановили склад ни на час. Видеоотчёт по каждой ветке — это редкость.',
    emphasized: '5 ночных смен',
    metric: '8 000 м² / 5 смен',
  },
  {
    id: 'r3',
    industry: 'production',
    industryLabel: 'отзыв 03 · производство',
    initials: 'ЕС',
    name: 'Елена Соколова',
    roleLine: 'директор по качеству · фабрика «Аркадия»',
    quote:
      'Готовились к аудиту FSSC 22000 — нужен был протокол по вентиляции и подтверждённая дезинфекция. Vent сделали за 4 дня под ключ, протокол прошёл аудит без вопросов.',
    emphasized: 'FSSC 22000',
    metric: 'FSSC 22000 / 4 дня',
  },
];
