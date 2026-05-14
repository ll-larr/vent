import HeroHeader from '@/components/HeroHeader/HeroHeader';
import './style.scss';

export default function PageHero({ children }) {
  return (
    <div className="page-hero">
      <HeroHeader />
      <div className="page-hero__content">
        {children}
      </div>
    </div>
  );
}
