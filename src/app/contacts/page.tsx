import type { Metadata } from 'next';
import Link from 'next/link';
import { Topbar } from '@/components/story/Topbar';
import { StoryFooter } from '@/components/story/StoryFooter';
import { StoryCta } from '@/components/story/StoryCta';
import { Prose } from '@/components/Prose/Prose';
import { Phone, Mail, MapPinned, Clock } from '@/lib/icons';
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site';
import { SERVICES, formatPrice } from '@/lib/pricing';

// Цена осмотра берётся из каталога, чтобы не разойтись с калькулятором.
const diagPrice = formatPrice(SERVICES.diag.kind === 'fixed' ? SERVICES.diag.price : 0);

export const metadata: Metadata = {
  // Root layout template appends "· Vent Clean" — keep the page title bare.
  title: 'Контакты',
  description:
    'Телефон, почта и часы работы Vent Clean: промышленная чистка вентиляции для бизнеса в Москве и области в радиусе 100 км. Осмотр объекта перед расчётом.',
  alternates: { canonical: '/contacts' },
};

export default function ContactsPage() {
  return (
    <>
      <Topbar variant="solid" />
      <main id="main" className="bg-bg pt-[clamp(20px,3vh,40px)]">
        <section className="px-5 md:px-[5vw] py-12">
          <div className="max-w-5xl mx-auto">
            <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3">
              /contacts
            </div>
            <h1 className="font-display font-light text-[clamp(40px,6vw,84px)] leading-none tracking-[-.025em] mb-12">
              Свяжитесь <em className="italic text-brand">с нами.</em>
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Phone size={13} strokeWidth={1.5} />
                  Телефон
                </div>
                <a href={CONTACT_PHONE_HREF} className="font-display text-[28px] hover:text-brand transition-colors">
                  {CONTACT_PHONE}
                </a>
                <p className="text-[13px] text-ink/55 mt-2">Перезваниваем в течение 2 часов в рабочее время.</p>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Mail size={13} strokeWidth={1.5} />
                  Email
                </div>
                <a href={CONTACT_EMAIL_HREF} className="font-display text-[28px] hover:text-brand transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <MapPinned size={13} strokeWidth={1.5} />
                  География
                </div>
                <div className="font-display text-[22px]">Москва и область</div>
                <p className="text-[13px] text-ink/55 mt-2">Радиус 100 км от МКАД.</p>
              </div>

              <div className="bg-surface rounded-2xl p-7 shadow-card">
                <div className="font-mono text-[11px] uppercase tracking-[.15em] text-ink/50 mb-3 flex items-center gap-2">
                  <Clock size={13} strokeWidth={1.5} />
                  Часы работы
                </div>
                <div className="font-display text-[22px]">Пн–Пт · 9:00–20:00</div>
                <p className="text-[13px] text-ink/55 mt-2">Сб–Вс — по предварительной договорённости.</p>
              </div>
            </div>
            <Prose className="mt-14">
              <h2>Как проходит первый контакт</h2>
              <p>
                Позвоните или оставьте заявку — инженер перезванивает в течение двух часов в рабочее
                время и задаёт четыре вопроса: тип объекта, площадь, когда вентиляцию обслуживали в
                последний раз и есть ли ревизионные лючки. Этого достаточно, чтобы назвать вилку
                стоимости по телефону, не выезжая.
              </p>
              <p>
                Дальше — видеоосмотр каналов на объекте, {diagPrice} отдельной строкой. Он занимает
                от получаса до двух часов в зависимости от разветвлённости системы, кухню или офис
                при этом не останавливаем. По итогам осмотра вы получаете запись из каналов и
                коммерческое предложение с фиксированной суммой, которая после подписания договора
                уже не растёт.
              </p>

              <h2>География выездов</h2>
              <p>
                Работаем в Москве и области в радиусе примерно 100 км от МКАД — это все города
                ближнего Подмосковья и большая часть дальнего. Выезд бригады в пределах этой зоны в
                стоимость работ уже включён, отдельной строкой транспорт не считается.
              </p>

              <h2>Что подготовить к осмотру</h2>
              <ul>
                <li>Доступ к вентиляционным шахтам и, по возможности, на кровлю.</li>
                <li>Схему вентиляции, если она сохранилась после монтажа или ремонта.</li>
                <li>Контакт технического специалиста или управляющего объектом.</li>
                <li>Понимание, в какие часы бригада может работать без помех для заведения.</li>
              </ul>
              <p>
                Ничего из этого не обязательно: если схемы нет и никто не помнит, когда систему
                чистили в последний раз, состояние каналов покажет{' '}
                <Link href="/uslugi/videoinspekciya">видеоинспекция</Link>. Ориентировочный бюджет
                можно прикинуть заранее в <Link href="/calculator">калькуляторе</Link>, а состав
                работ по типам объектов разобран в разделе <Link href="/uslugi">услуг</Link>.
              </p>
            </Prose>
          </div>
        </section>

        <StoryCta
          heading="Посчитать для своего объекта."
          text="Калькулятор даёт вилку за минуту. Точную сумму инженер называет на осмотре — и дальше она не меняется."
        />
      </main>
      <StoryFooter />
    </>
  );
}
