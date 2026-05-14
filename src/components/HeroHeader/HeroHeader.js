import Link from 'next/link';
import { navLinks, LogoSvg } from '@/lib/nav';
import './style.scss';

export default function HeroHeader() {
  return (
    <div className="hero-header">
      <Link href="/" className="hero-header__logo"><LogoSvg /><span>Clean Vent</span></Link>
      <div className="hero-header__nav">
        {navLinks.map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </div>
      <div className="hero-header__right">
        <a href="tel:+74951234567" className="hero-header__phone">+7 (495) 123-45-67</a>
        <Link href="/contacts" className="hero-header__cta">Заказать звонок</Link>
      </div>
    </div>
  );
}
