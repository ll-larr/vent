import Link from 'next/link';
import HeroHeader from '@/components/HeroHeader/HeroHeader';
import './style.scss';

export default function HomeHero() {
  return (
    <section className="home-hero" id="hero">
      <div className="home-hero__grid" />
      <HeroHeader />
      <div className="home-hero__content">
        <h1>Чистая вентиляция —<br /><span className="home-hero__gradient">здоровый воздух</span></h1>
        <p>Полный комплекс услуг по очистке и дезинфекции систем вентиляции и кондиционирования для бизнеса и дома</p>
        <div className="home-hero__actions">
          <Link href="/contacts" className="btn-primary">Вызвать специалиста</Link>
          <Link href="/services" className="btn-secondary">Узнать больше</Link>
        </div>
      </div>
      <div className="home-hero__scroll"><div className="home-hero__scroll-dot" /></div>
    </section>
  );
}
