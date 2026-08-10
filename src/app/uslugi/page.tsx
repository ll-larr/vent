import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage/ContentPage';
import { Prose } from '@/components/Prose/Prose';
import { serviceUrl } from '@/lib/content';
import { SERVICES, formatPrice, type ServiceKey } from '@/lib/pricing';
import { SERVICE_PAGES } from '@/data/service-pages';
import { Droplets, Wind, Container, Eye, ArrowRight } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Услуги по чистке и обслуживанию вентиляции',
  description:
    'Четыре услуги по обслуживанию вентиляции для бизнеса: чистка каналов от жира и от пыли, мойка вытяжек и зонтов, видеоинспекция каналов. Москва и область.',
  alternates: { canonical: '/uslugi' },
};

// Card copy lives here (not in ServicePageMeta) — it's hub-page-specific and
// shorter than the meta description each service page already carries.
const CARD_COPY: Record<string, { label: string; blurb: string; Icon: LucideIcon }> = {
  'chistka-ot-zhira': {
    label: 'Чистка от жира',
    blurb: 'Для кухонь общепита. Убираем нагар, который повышает риск возгорания вытяжной системы.',
    Icon: Droplets,
  },
  'chistka-ot-pyli': {
    label: 'Чистка от пыли',
    blurb: 'Для офисов, складов и производств. Восстанавливаем воздухообмен и снимаем нагрузку с вентустановки.',
    Icon: Wind,
  },
  'vytyazhki-i-zonty': {
    label: 'Вытяжки и зонты',
    blurb: 'Разбор, мойка в ванне и сборка зонтов пищеблока без повреждения металла.',
    Icon: Container,
  },
  videoinspekciya: {
    label: 'Видеоинспекция',
    blurb: 'Эндоскоп и тепловизор без демонтажа коробов. Фиксированная цена, отчёт с фото.',
    Icon: Eye,
  },
};

// Derives a short price teaser straight from pricing.ts so card copy can't
// drift from the numbers on the service page itself.
function priceTeaser(key: ServiceKey): string {
  const s = SERVICES[key];
  if (s.kind === 'linear') {
    return s.min === s.max ? `${formatPrice(s.min)}/пог.м` : `от ${formatPrice(s.min)}/пог.м`;
  }
  if (s.kind === 'unit') return `от ${formatPrice(s.price)}/шт`;
  return formatPrice(s.price);
}

export default function UslugiPage() {
  return (
    <ContentPage
      breadcrumbs={[{ name: 'Услуги', href: '/uslugi' }]}
      eyebrow="услуги · /uslugi"
      title={
        <>
          Услуги по чистке <em className="italic text-brand">вентиляции.</em>
        </>
      }
      lead="Пять направлений для общепита, офисов, складов и производств: от жировой вентиляции ресторанной кухни до диагностики каналов перед капитальным ремонтом. У каждой услуги — отдельная страница с ценами и ответами на частые вопросы."
    >
      <Prose>
        <p>
          Vent.team обслуживает вентиляцию заведений общепита, офисов, складов и производств в Москве и
          области — работаем по этому направлению с 2021 года. Ниже — четыре услуги: механическая
          чистка каналов от жира и от пыли, мойка вытяжек и зонтов пищеблоков и видеодиагностика
          перед началом работ. У каждой — своя методика, цена и
          страница с подробностями: состав работ, таблица цен и ответы на частые вопросы.
        </p>
        <p>
          Услуги пересекаются в зависимости от типа объекта. На кухне общепита обычно сочетают
          чистку каналов от жира и мойку зонтов — это две разные работы с отдельной ценой, но их
          удобно заказать одним выездом бригады. В офисе, на складе или на производстве чаще нужна
          только чистка от пыли. Если состояние вентиляции неизвестно — например, объект только
          что взяли в аренду, — начать разумно с видеоинспекции: она показывает, что происходит
          внутри каналов, и по её итогам понятно, какая из остальных услуг нужна и в каком
          объёме.
        </p>
        <p>
          Работаем ночью и в нерабочее время, поэтому чистка не останавливает работу кухни, офиса
          или склада, а по итогам вы получаете фотографии «до/после», повторный осмотр каналов и
          протокол выполненных работ.
        </p>
      </Prose>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 mb-4">
        {SERVICE_PAGES.map((svc) => {
          const copy = CARD_COPY[svc.slug];
          return (
            <Link
              key={svc.slug}
              href={serviceUrl(svc.slug)}
              className="group bg-surface rounded-[22px] p-6 shadow-card flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="w-9 h-9 rounded-[10px] border border-line-2 grid place-items-center text-ink">
                  <copy.Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brand">
                  {svc.serviceKey && priceTeaser(svc.serviceKey)}
                </span>
              </div>
              <div>
                <h3 className="font-display font-normal text-[22px] leading-[1.1] tracking-[-.012em]">
                  {copy.label}
                </h3>
                <p className="text-[13.5px] text-ink/65 leading-[1.55] mt-2">{copy.blurb}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em] text-ink group-hover:text-brand transition-colors">
                подробнее
                <ArrowRight size={12} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>

      <Prose className="mt-10">
        <h2>Какие услуги нужны вашему объекту</h2>
        <p>
          Набор работ определяется не размером помещения, а тем, что оседает внутри каналов. На
          кухне это полимеризованный жир, в офисе — пыль и продукты износа фильтров, на пищевом
          производстве — то и другое плюс требования к микробиологии. Ориентир по типовым объектам:
        </p>
        <table>
          <thead>
            <tr>
              <th>Тип объекта</th>
              <th>Базовые работы</th>
              <th>Добавляют по ситуации</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ресторан, кафе, столовая</td>
              <td>Чистка от жира, мойка зонтов</td>
              <td>Видеоинспекция перед плановой чисткой</td>
            </tr>
            <tr>
              <td>Офис, бизнес-центр</td>
              <td>Чистка от пыли</td>
              <td>Видеоинспекция после залива или ремонта</td>
            </tr>
            <tr>
              <td>Склад, логистика</td>
              <td>Чистка от пыли</td>
              <td>Видеоинспекция протяжённых трасс</td>
            </tr>
            <tr>
              <td>Пищевое производство</td>
              <td>Чистка от пыли</td>
              <td>Чистка от жира на участках термообработки</td>
            </tr>
            <tr>
              <td>Объект неизвестного состояния</td>
              <td>Видеоинспекция</td>
              <td>Остальное — по результатам осмотра</td>
            </tr>
          </tbody>
        </table>
        <p>
          Периодичность зависит от нагрузки на систему: подробный разбор сроков — в материале{' '}
          <Link href="/blog/periodichnost-chistki-ventilyacii">
            периодичность чистки вентиляции по СанПиН
          </Link>
          , а практика для кухни — в статье{' '}
          <Link href="/blog/kak-chasto-chistit-ventilyaciyu-v-restorane">
            как часто чистить вентиляцию в ресторане
          </Link>
          .
        </p>

        <h2>Как заказать</h2>
        <p>
          Порядок одинаковый для всех пяти услуг: заявка, бесплатный видеоосмотр каналов, расчёт с
          фиксированной суммой, выезд бригады. Цена после осмотра не меняется — объём работ к тому
          моменту уже известен, а не оценён на глаз.
        </p>
        <p>
          Не уверены, какая услуга нужна вашему объекту? Посчитайте ориентировочный бюджет в{' '}
          <Link href="/calculator">калькуляторе стоимости</Link> или{' '}
          <Link href="/contacts">свяжитесь с нами</Link> — поможем определить состав работ на
          бесплатном видеоосмотре.
        </p>
      </Prose>
    </ContentPage>
  );
}
