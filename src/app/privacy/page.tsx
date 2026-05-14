import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Clean Vent',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-24 px-6 max-w-content mx-auto">
        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>

        <div className="prose prose-neutral max-w-none text-brand-muted space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности описывает, как Clean Vent (далее — «Компания»)
              собирает, использует и защищает информацию, которую вы предоставляете при использовании сайта.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">2. Какие данные мы собираем</h2>
            <p>
              При заполнении формы заявки мы собираем: имя, номер телефона, тип объекта, выбранные услуги
              и комментарий. Эти данные необходимы исключительно для обработки вашего обращения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">3. Использование данных</h2>
            <p>
              Полученные данные используются только для связи с вами по вопросу вашей заявки.
              Мы не передаём ваши данные третьим лицам и не используем их в маркетинговых целях
              без вашего согласия.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">4. Хранение данных</h2>
            <p>
              Данные хранятся в защищённой таблице Google Sheets, доступной только сотрудникам компании.
              Срок хранения — не более 3 лет с момента получения заявки.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">5. Ваши права</h2>
            <p>
              Вы вправе запросить удаление ваших данных, направив письмо на{' '}
              <a href="mailto:info@cleanvent.ru" className="text-brand underline">info@cleanvent.ru</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-brand mb-2">6. Контакты</h2>
            <p>
              По вопросам конфиденциальности:{' '}
              <a href="mailto:info@cleanvent.ru" className="text-brand underline">info@cleanvent.ru</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
