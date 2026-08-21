import type { Metadata } from 'next';
import Link from 'next/link';
import { Topbar } from '@/components/story/Topbar';
import { StoryFooter } from '@/components/story/StoryFooter';
import { CalculatorSection } from '@/components/story/CalculatorSection';
import { FaqList } from '@/components/story/FaqList';
import { SectionLabel } from '@/components/story/SectionLabel';
import { Prose } from '@/components/Prose/Prose';
import { CalculatorProvider } from '@/lib/calculator-context';
import { faqSchema, jsonLdScript } from '@/lib/schema';
import { PACKAGES, SERVICES, formatPrice } from '@/lib/pricing';

export const metadata: Metadata = {
  // Root layout template appends "· vent.team" — keep the page title bare.
  title: 'Калькулятор стоимости чистки вентиляции',
  description:
    'Рассчитайте онлайн стоимость промышленной чистки вентиляции и вытяжек для общепита, офиса или производства. Цены от 85 ₽/пог.м.',
  alternates: { canonical: '/calculator' },
};

/* Every price on this page comes off the catalog — the tier tables already did,
   and the prose now does too, so a rate change in pricing.ts cannot leave a
   stale number in the copy. */
const greaseMin = SERVICES.grease.kind === 'linear' ? SERVICES.grease.min : 0;
const dustMin = SERVICES.dust.kind === 'linear' ? SERVICES.dust.min : 0;
const diagPrice = formatPrice(SERVICES.diag.kind === 'fixed' ? SERVICES.diag.price : 0);
const hoodPrice = formatPrice(SERVICES.hood.kind === 'unit' ? SERVICES.hood.price : 0);

// The calculator widget itself is also embedded on the homepage, so this route
// needs substance of its own — otherwise it's a duplicate section on a second
// URL, which is exactly what search engines drop from the index.
const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: 'Почему калькулятор показывает вилку, а не точную сумму?',
    a: `Пока мы не увидели объект, неизвестна реальная длина трасс, степень загрязнения и наличие ревизионных лючков. Калькулятор считает по нижней границе тарифа: ${SERVICES.grease.label.toLowerCase()} — от ${greaseMin} ₽/пог.м, чистка от пыли — от ${dustMin} ₽/пог.м. После видеоосмотра объекта (${diagPrice}) цена фиксируется в договоре и дальше не меняется.`,
  },
  {
    q: 'Как площадь помещения превращается в погонные метры воздуховодов?',
    a: `По усреднённым коэффициентам, накопленным на объектах: общепит — ${PACKAGES.restaurant.m2ToLm} пог.м на м², офис — ${PACKAGES.office.m2ToLm}, производство и склад — ${PACKAGES.warehouse.m2ToLm}. У общепита коэффициент выше: кухонная вытяжная сеть плотнее и разветвлённее, чем приточка в офисе.`,
  },
  {
    q: 'От чего цена за погонный метр отличается в полтора раза?',
    a: 'От сечения канала и типа загрязнения. Труба до 500 мм считается по нижнему тарифу, короб больше 500×300 мм — по верхнему: это больше площади внутренней поверхности и другой инструмент. Жир снимается тяжелее пыли, поэтому кухонные трассы всегда дороже офисных.',
  },
  {
    q: 'Что входит в стоимость, а что оплачивается отдельно?',
    a: `В работы входят выезд бригады, расходники, укрытие оборудования и мебели, вынос снятых отложений и фотоотчёт до/после. Отдельно считаются диагностика с видеоинспекцией (${diagPrice}) и монтаж ревизионных лючков, если их нет и вскрывать канал больше негде.`,
  },
  {
    q: 'Расчёт из калькулятора обязывает к чему-нибудь?',
    a: 'Нет. Это ориентир по бюджету, чтобы понимать порядок цифр до разговора. Обязательства появляются только после договора.',
  },
];

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <Topbar variant="solid" />
      <main id="main" className="bg-bg">
        <div className="mx-auto max-w-[1180px] px-[clamp(22px,3vw,56px)] pb-[clamp(24px,4vh,44px)] pt-[clamp(28px,5vh,64px)]">
          <SectionLabel className="mb-3.5">калькулятор</SectionLabel>
          <h1 className="max-w-[20ch] font-display text-[clamp(34px,5.4vw,86px)] font-light leading-[.96] tracking-[-.036em]">
            Стоимость чистки <span className="italic text-brand">вентиляции.</span>
          </h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(17px,1.5vw,24px)] leading-[1.5] text-ink/[.72]">
            Выберите тип объекта, скорректируйте список услуг и укажите площадь. Точная стоимость
            определяется после видеоосмотра объекта.
          </p>
        </div>
        <CalculatorSection />

        <section className="mx-auto max-w-[1180px] px-[clamp(22px,3vw,56px)] py-[clamp(40px,6vh,80px)]">
          <Prose>
            <h2>Как устроен расчёт</h2>
            <p>
              Калькулятор решает одну задачу — дать порядок цифр до того, как на объект приедет
              инженер. Внутри нет магии: площадь помещения переводится в примерную длину
              воздуховодов по коэффициенту типа объекта, затем длина умножается на тариф выбранных
              работ.
            </p>
            <p>
              Коэффициенты взяты из практики обмеров, а не из головы. У общепита он самый высокий —{' '}
              {PACKAGES.restaurant.m2ToLm} погонных метра на квадратный метр площади: над каждой
              линией плиты стоит свой зонт, сеть короткими участками расходится по кухне и уходит на
              кровлю. В офисе — {PACKAGES.office.m2ToLm}: приточно-вытяжная система идёт длинными
              прямыми магистралями. На складе и производстве — {PACKAGES.warehouse.m2ToLm}: объём
              большой, а трасс относительно немного.
            </p>

            <h2>Что меняет цену на объекте</h2>
            <p>
              Тариф за погонный метр не один. Он зависит от сечения канала и от того, что внутри:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Сечение канала</th>
                  <th>Жир (общепит)</th>
                  <th>Пыль (офис, склад)</th>
                </tr>
              </thead>
              <tbody>
                {(SERVICES.grease.kind === 'linear' ? SERVICES.grease.diameterTiers ?? [] : []).map(
                  (tier, i) => {
                    const dustTiers =
                      SERVICES.dust.kind === 'linear' ? SERVICES.dust.diameterTiers ?? [] : [];
                    return (
                      <tr key={tier.code}>
                        <td>{tier.label}</td>
                        <td>{tier.rate} ₽/пог.м</td>
                        <td>{dustTiers[i] ? `${dustTiers[i].rate} ₽/пог.м` : 'по запросу'}</td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
            <p>
              Разница между нижним и верхним тарифом — это в первую очередь площадь внутренней
              поверхности, которую нужно физически отмыть, и инструмент, которым до неё дотягиваются.
              Жир снимается тяжелее пыли: он полимеризуется на стенках и требует химии и щёточных
              машин, поэтому кухонные трассы дороже офисных примерно втрое.
            </p>
            <p>
              Отдельно считаются работы, которые не измеряются метрами: чистка зонта пищеблока — от{' '}
              {hoodPrice} за штуку и выездная диагностика с видеоинспекцией — {diagPrice}.
            </p>

            <h2>Почему точную сумму называют только после осмотра</h2>
            <p>
              Две кухни одинаковой площади дают разный чек. Решают вещи, которые видно только на
              месте: сколько лет систему не обслуживали, есть ли ревизионные лючки или канал придётся
              вскрывать, проходит ли трасса через подвесной потолок, работает ли заведение
              круглосуточно — тогда бригада выходит ночью.
            </p>
            <p>
              Поэтому порядок такой: калькулятор даёт ориентир,{' '}
              <Link href="/uslugi/videoinspekciya">видеоосмотр каналов</Link> за {diagPrice}{' '}
              показывает фактическое состояние, и уже после него сумма фиксируется в договоре.
              Дальше она не растёт — «нашли ещё грязь, доплатите» у нас не бывает.
            </p>

            <h2>Если нужно точнее прямо сейчас</h2>
            <p>
              Соберите три цифры: площадь помещения, тип объекта и количество вытяжных зонтов. С ними
              инженер назовёт вилку по телефону, не выезжая. Что именно входит в каждую работу,
              подробно разобрано на страницах услуг —{' '}
              <Link href="/uslugi/chistka-ot-zhira">чистка от жира</Link>,{' '}
              <Link href="/uslugi/chistka-ot-pyli">чистка от пыли</Link> и{' '}
              <Link href="/uslugi/videoinspekciya">видеоинспекция каналов</Link>.
            </p>
          </Prose>

          <div className="mt-14 max-w-[70ch]">
            <h2 className="mb-4 font-display text-[clamp(26px,2.9vw,44px)] font-light leading-[1.06] tracking-[-.03em]">
              Частые вопросы про расчёт
            </h2>
            <FaqList items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
      <StoryFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(FAQ_ITEMS))} />
    </CalculatorProvider>
  );
}
