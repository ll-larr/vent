import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Calculator } from '@/components/Calculator/Calculator';
import { ContactSection } from '@/components/ContactSection/ContactSection';
import { Prose } from '@/components/Prose/Prose';
import { Faq } from '@/components/Faq/Faq';
import { CalculatorProvider } from '@/lib/calculator-context';
import { faqSchema, jsonLdScript } from '@/lib/schema';
import { PACKAGES, SERVICES } from '@/lib/pricing';

export const metadata: Metadata = {
  // Root layout template appends "· Vent.team" — keep the page title bare.
  title: 'Калькулятор стоимости чистки вентиляции',
  description:
    'Рассчитайте онлайн стоимость промышленной чистки вентиляции и вытяжек для общепита, офиса или производства. Цены от 100 ₽/пог.м.',
  alternates: { canonical: '/calculator' },
};

// The calculator widget itself is also embedded on the homepage, so this route
// needs substance of its own — otherwise it's a duplicate section on a second
// URL, which is exactly what search engines drop from the index.
const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: 'Почему калькулятор показывает вилку, а не точную сумму?',
    a: `Пока мы не увидели объект, неизвестна реальная длина трасс, степень загрязнения и наличие ревизионных лючков. Калькулятор считает по нижней границе тарифа: ${SERVICES.grease.label.toLowerCase()} — от 300 ₽/пог.м, чистка от пыли — от 100 ₽/пог.м. После бесплатного видеоосмотра цена фиксируется в договоре и дальше не меняется.`,
  },
  {
    q: 'Как площадь помещения превращается в погонные метры воздуховодов?',
    a: `По усреднённым коэффициентам, накопленным на объектах: общепит — ${PACKAGES.restaurant.m2ToLm} пог.м на м², офис — ${PACKAGES.office.m2ToLm}, производство и склад — ${PACKAGES.warehouse.m2ToLm}. У общепита коэффициент выше: кухонная вытяжная сеть плотнее и разветвлённее, чем приточка в офисе.`,
  },
  {
    q: 'От чего цена за погонный метр отличается в полтора раза?',
    a: 'От сечения канала и типа загрязнения. Труба до 600 мм считается по нижнему тарифу, короб больше 600×400 мм — по верхнему: это больше площади внутренней поверхности и другой инструмент. Жир снимается тяжелее пыли, поэтому кухонные трассы всегда дороже офисных.',
  },
  {
    q: 'Что входит в стоимость, а что оплачивается отдельно?',
    a: `В работы входят выезд бригады, расходники, укрытие оборудования и мебели, вынос снятых отложений и фотоотчёт до/после. Отдельно считаются диагностика с видеоинспекцией (${SERVICES.diag.kind === 'fixed' ? SERVICES.diag.price : 4500} ₽) и монтаж ревизионных лючков, если их нет и вскрывать канал больше негде.`,
  },
  {
    q: 'Расчёт из калькулятора обязывает к чему-нибудь?',
    a: 'Нет. Это ориентир по бюджету, чтобы понимать порядок цифр до разговора. Обязательства появляются только после договора.',
  },
];

export default function CalculatorPage() {
  return (
    <CalculatorProvider>
      <Header />
      <main id="main" className="pt-32 bg-bg">
        <div className="px-5 md:px-[5vw] max-w-7xl mx-auto mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-4">
            калькулятор · /calculator
          </div>
          <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em] max-w-3xl">
            Стоимость чистки <em className="italic text-brand">вентиляции.</em>
          </h1>
          <p className="text-ink/65 text-[16px] mt-6 max-w-2xl">
            Выберите тип объекта, скорректируйте список услуг и укажите площадь. Точная стоимость определяется
            после бесплатного осмотра.
          </p>
        </div>
        <Calculator />

        <section className="px-5 md:px-[5vw] max-w-7xl mx-auto py-16">
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
                        <td>{dustTiers[i] ? `${dustTiers[i].rate} ₽/пог.м` : '—'}</td>
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
              {SERVICES.hood.kind === 'unit' ? SERVICES.hood.price.toLocaleString('ru-RU') : '2 000'}{' '}
              ₽ за штуку, дезинфекция воздуховодов — от 30 ₽/пог.м поверх основной чистки.
            </p>

            <h2>Почему точную сумму называют только после осмотра</h2>
            <p>
              Две кухни одинаковой площади дают разный чек. Решают вещи, которые видно только на
              месте: сколько лет систему не обслуживали, есть ли ревизионные лючки или канал придётся
              вскрывать, проходит ли трасса через подвесной потолок, работает ли заведение
              круглосуточно — тогда бригада выходит ночью.
            </p>
            <p>
              Поэтому порядок такой: калькулятор даёт ориентир, затем бесплатный{' '}
              <Link href="/uslugi/videoinspekciya">видеоосмотр каналов</Link> показывает фактическое
              состояние, и уже после него сумма фиксируется в договоре. Дальше она не растёт — «нашли
              ещё грязь, доплатите» у нас не бывает.
            </p>

            <h2>Если нужно точнее прямо сейчас</h2>
            <p>
              Соберите три цифры: площадь помещения, тип объекта и количество вытяжных зонтов. С ними
              инженер назовёт вилку по телефону, не выезжая. Что именно входит в каждую работу,
              подробно разобрано на страницах услуг —{' '}
              <Link href="/uslugi/chistka-ot-zhira">чистка от жира</Link>,{' '}
              <Link href="/uslugi/chistka-ot-pyli">чистка от пыли</Link> и{' '}
              <Link href="/uslugi/dezinfekciya">дезинфекция воздуховодов</Link>.
            </p>
          </Prose>

          <div className="mt-14 max-w-[70ch]">
            <Faq heading="Частые вопросы про расчёт" items={FAQ_ITEMS} />
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(FAQ_ITEMS))} />
    </CalculatorProvider>
  );
}
