import type { Metadata } from 'next';
import Link from 'next/link';
import { Topbar } from '@/components/story/Topbar';
import { ArrowRight } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных',
  description:
    'Какие данные собирает Vent Clean через форму заявки, для чего, как хранит и сколько. Документ в соответствии с 152-ФЗ РФ.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacy' },
};

const SECTIONS: Array<{ n: string; title: string; body: React.ReactNode }> = [
  {
    n: '01',
    title: 'Какие данные мы собираем',
    body: (
      <>
        <p>
          Через форму заявки на сайте и в мессенджерах мы получаем только то, что нужно, чтобы
          перезвонить и подготовить расчёт:
        </p>
        <BulletList
          items={[
            'Имя или то, как к вам обращаться.',
            'Номер телефона.',
            'Тип объекта и площадь, если вы их указали.',
            'Комментарий к заявке.',
            'Технические данные браузера: IP, user-agent, страница, с которой пришла заявка — для защиты от спама и аналитики.',
          ]}
        />
        <p>
          Мы не запрашиваем паспортные данные, ИНН или банковские реквизиты — для расчёта и
          выезда инженера они не нужны.
        </p>
      </>
    ),
  },
  {
    n: '02',
    title: 'Для чего мы их используем',
    body: (
      <>
        <BulletList
          items={[
            'Связаться с вами по поводу заявки — звонок, мессенджер или e-mail.',
            'Подготовить ориентировочный расчёт стоимости и согласовать выезд инженера.',
            'Заключить и исполнить договор на оказание услуг.',
            'Хранить историю обращений на случай повторных заявок и обслуживания по графику.',
            'Улучшать сайт и форму заявки на основе обезличенной статистики.',
          ]}
        />
        <p>
          Мы не используем ваш номер для холодных продаж сторонним сервисам и не передаём его
          рекламным площадкам.
        </p>
      </>
    ),
  },
  {
    n: '03',
    title: 'Как мы храним и передаём',
    body: (
      <>
        <p>
          Заявки попадают в защищённую таблицу Google Sheets, доступ к которой имеет только команда
          Vent Clean. Резервные копии хранятся на серверах в РФ. Данные передаются по защищённому
          соединению.
        </p>
        <p>Мы передаём данные третьим лицам только в трёх случаях:</p>
        <BulletList
          items={[
            'Если вы стали клиентом — реквизиты заносятся в бухгалтерскую систему для оформления договора и счёта.',
            'По обоснованному требованию государственных органов в порядке, установленном законом.',
            'Подрядчикам, которые выполняют конкретную задачу (например, доставка SMS-уведомления) — на основании договора о конфиденциальности.',
          ]}
        />
      </>
    ),
  },
  {
    n: '04',
    title: 'Сроки хранения',
    body: (
      <>
        <BulletList
          items={[
            'Активные заявки и контакты — 3 года с момента последнего обращения.',
            'Документы по заключённым договорам — 5 лет, согласно требованиям бухгалтерского учёта.',
            'Технические логи и аналитика — 12 месяцев в обезличенном виде.',
          ]}
        />
        <p>По истечении срока данные удаляются или анонимизируются.</p>
      </>
    ),
  },
  {
    n: '05',
    title: 'Ваши права',
    body: (
      <>
        <p>В любой момент вы можете:</p>
        <BulletList
          items={[
            'Запросить, какие именно данные о вас мы храним.',
            'Попросить нас исправить неточные данные.',
            'Отозвать согласие — мы удалим вашу заявку и контакт в течение 10 рабочих дней.',
          ]}
        />
        <p>
          Запросы принимаются по адресу{' '}
          <a
            href="mailto:privacy@vent-clean.ru"
            className="text-brand border-b border-current hover:text-ink transition-colors"
          >
            privacy@vent-clean.ru
          </a>
          . Ответим в течение 10 рабочих дней, обычно — за день.
        </p>
      </>
    ),
  },
  {
    n: '06',
    title: 'Cookies и аналитика',
    body: (
      <p>
        На сайте работают только функциональные cookies (запоминают согласие на cookies, тему
        интерфейса) и обезличенная веб-аналитика.
      </p>
    ),
  },
  {
    n: '07',
    title: 'Согласие',
    body: (
      <p>
        Отправляя форму заявки на сайте, вы подтверждаете, что прочитали этот документ и согласны
        с обработкой ваших персональных данных в указанных целях и объёме. Согласие действует до
        его отзыва.
      </p>
    ),
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none p-0 m-0 mb-3.5 flex flex-col gap-2">
      {items.map((it) => (
        <li key={it} className="relative pl-[22px] max-w-[70ch]">
          <span
            className="absolute left-1 top-[.65em] w-1.5 h-1.5 rounded-full bg-brand"
            aria-hidden="true"
          />
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Topbar variant="solid" />
      <main id="main" className="bg-bg text-ink min-h-screen">
        <div className="max-w-[880px] mx-auto px-6 pt-20 pb-24">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-ink/50">
            <span className="w-[18px] h-px bg-brand inline-block" />
            Документ / приложение к оферте
          </div>
          <h1 className="font-display font-light text-[clamp(40px,5.5vw,76px)] leading-[.98] tracking-[-.025em] mt-3.5 mb-4.5">
            Согласие на обработку <em className="italic text-brand">персональных данных.</em>
          </h1>
          <p className="text-[17px] text-ink/70 max-w-[60ch] mb-14 leading-[1.55]">
            Этот документ описывает, какие данные мы собираем через форму заявки на сайте, зачем
            они нам и сколько мы их храним. Коротко и по делу, без скрытых пунктов мелким шрифтом.
          </p>

          {SECTIONS.map((s) => (
            <section key={s.n} className="mt-14 first:mt-0">
              <h2 className="font-display font-normal text-[clamp(22px,2.4vw,30px)] tracking-[-.015em] leading-[1.15] mb-3.5">
                <span className="font-mono text-[12px] tracking-[.14em] text-brand mr-3 align-middle">
                  {s.n}
                </span>
                {s.title}
              </h2>
              <div className="[&_p]:max-w-[70ch] [&_p]:mb-3.5 [&_p:last-child]:mb-0">{s.body}</div>
            </section>
          ))}

          <div className="mt-16 px-6 py-5 bg-ink text-bg rounded-[18px] grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <h3 className="font-display font-normal text-[22px] tracking-[-.012em] mb-1.5 leading-[1.2]">
                Вопросы по обработке <em className="italic text-accent">данных?</em>
              </h3>
              <p className="text-[13.5px] text-bg/65 m-0">
                Напишите на privacy@vent-clean.ru или позвоните в офис — ответим тем же днём.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-ink font-medium text-[14px] hover:bg-bg transition-colors whitespace-nowrap justify-self-start sm:justify-self-end"
            >
              Связаться
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-ink text-bg py-8 font-mono text-[10.5px] uppercase tracking-[.12em] text-bg/50">
        <div className="max-w-[880px] mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <span>
              Оператор: <b className="text-accent font-medium">ООО «Вент»</b>
            </span>
            <span>
              Редакция: <b className="text-accent font-medium">15.05.2026</b>
            </span>
            <span>
              Контакт: <b className="text-accent font-medium">privacy@vent-clean.ru</b>
            </span>
          </div>
          <div>
            © 2021–2026 Vent Clean ·{' '}
            <Link
              href="/privacy"
              className="text-bg/70 border-b border-bg/[.15] hover:text-accent hover:border-accent"
            >
              политика
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
