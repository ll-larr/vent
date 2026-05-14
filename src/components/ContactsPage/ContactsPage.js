import Link from 'next/link';
import PageHero from '@/components/PageHero/PageHero';
import './style.scss';

const contacts = [
  { href:'tel:+74951234567', label:'Телефон', value:'+7 (495) 123-45-67', icon:<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"/> },
  { href:'tel:+79269876543', label:'Телефон 2', value:'+7 (926) 987-65-43', icon:<><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></> },
  { href:'mailto:info@cleanvent.ru', label:'Эл. почта', value:'info@cleanvent.ru', icon:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
  { href:'https://t.me/cleanvent_bot', label:'Telegram', value:'Заявка в Telegram', icon:<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>, ext:true },
  { label:'Режим работы', value:'Пн–Вс: 08:00–22:00', icon:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
];

export default function ContactsPage() {
  return (
    <main>
      <PageHero>
        <div style={{textAlign:'center',maxWidth:700,margin:'0 auto'}}>
          <h1 style={{fontSize:'clamp(36px,5vw,56px)',fontWeight:700,color:'#f5f5f7',letterSpacing:'-0.04em',marginBottom:16,opacity:0,animation:'fadeUp .8s .3s forwards'}}>Свяжитесь <span className="accent-line">с нами</span></h1>
          <p style={{fontSize:17,color:'#8b95a8',lineHeight:1.6,opacity:0,animation:'fadeUp .8s .5s forwards'}}>Ответим за 15 минут. Рассчитаем стоимость и подберём удобное время.</p>
        </div>
      </PageHero>
      <section className="contacts-body">
        <div className="contacts-body__inner">
          <div className="contacts-info">
            {contacts.map(c => {
              const Tag = c.href ? 'a' : 'div';
              const props = c.href ? { href: c.href, ...(c.ext ? {target:'_blank',rel:'noopener'} : {}) } : {};
              return <Tag key={c.label} className="contacts-info__card" {...props}>
                <div className="contacts-info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg></div>
                <div><div className="contacts-info__label">{c.label}</div><div className="contacts-info__value">{c.value}</div></div>
              </Tag>;
            })}
          </div>
          <div className="contacts-form-wrap">
            <h3>Оставить заявку</h3>
            <div className="contacts-form">
              <div className="contacts-form__field"><label>Имя</label><input type="text" placeholder="Ваше имя"/></div>
              <div className="contacts-form__field"><label>Телефон</label><input type="tel" placeholder="+7 (___) ___-__-__"/></div>
              <div className="contacts-form__field"><label>Сообщение</label><textarea placeholder="Опишите задачу или объект"/></div>
              <button className="contacts-form__submit">Отправить</button>
              <p className="contacts-form__disc">Нажимая «Отправить», подтверждаю ознакомление с <Link href="/privacy">политикой конфиденциальности</Link> и согласие на обработку данных.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
