import type { ServiceKey } from '@/lib/pricing';

export type ServiceDisplay = {
  key: ServiceKey;
  title: string;
  description: string;
  iconName: 'Wind' | 'Fan' | 'SprayCan' | 'Stethoscope' | 'ShieldCheck';
};

export const SERVICE_DISPLAY: Record<ServiceKey, ServiceDisplay> = {
  grease: {
    key: 'grease',
    title: 'Чистка вентиляции от жира',
    description: 'Для кухонь общепита. Удаляем жировые отложения до металла по протоколу СЭС.',
    iconName: 'Wind',
  },
  dust: {
    key: 'dust',
    title: 'Чистка вентиляции от пыли',
    description: 'Для офисов и складов. Восстанавливаем воздухообмен, убираем аллергены.',
    iconName: 'Wind',
  },
  hood: {
    key: 'hood',
    title: 'Чистка вытяжек и зонтов',
    description: 'Профессиональная мойка зонтов пищеблока с разбором и сборкой.',
    iconName: 'Fan',
  },
  disinfect: {
    key: 'disinfect',
    title: 'Дезинфекция воздуховодов',
    description: 'Противомикробная обработка после чистки. Для производства и медицинских объектов.',
    iconName: 'SprayCan',
  },
  diag: {
    key: 'diag',
    title: 'Диагностика / видеоинспекция',
    description: 'Видеоконтроль каналов перед чисткой. Отчёт с фото и состоянием системы.',
    iconName: 'Stethoscope',
  },
};
