import Link from 'next/link';
import './style.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__name">Clean Vent</span>
          <p>Профессиональная чистка и дезинфекция систем вентиляции</p>
        </div>
        <div className="footer__col">
          <h4>Услуги</h4>
          <Link href="/services">Очистка вентиляции</Link>
          <Link href="/services">Зачистка резервуаров</Link>
          <Link href="/services">Дезинфекция</Link>
          <Link href="/services">Видеодиагностика</Link>
        </div>
        <div className="footer__col">
          <h4>Компания</h4>
          <Link href="/trust">О нас</Link>
          <Link href="/trust">Сертификаты</Link>
          <Link href="/prices">Цены</Link>
        </div>
        <div className="footer__col">
          <h4>Контакты</h4>
          <a href="tel:+74951234567">+7 (495) 123-45-67</a>
          <a href="mailto:info@cleanvent.ru">info@cleanvent.ru</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>&copy; 2026 Clean Vent. Все права защищены.</span>
        <Link href="/privacy">Политика конфиденциальности</Link>
      </div>
    </footer>
  );
}
