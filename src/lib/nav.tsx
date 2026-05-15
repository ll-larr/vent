export interface NavLink {
  href: string;
  label: string;
  anchor?: boolean;
}

export const navLinks: NavLink[] = [
  { href: '#services',   label: 'Услуги',   anchor: true },
  { href: '#cases',      label: 'Кейсы',    anchor: true },
  { href: '#calculator', label: 'Цены',     anchor: true },
  { href: '#trust',      label: 'О нас',    anchor: true },
  { href: '#contact',    label: 'Контакты', anchor: true },
];

export const LogoSvg = () => (
  <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14" cy="14" r="3" fill="currentColor" />
  </svg>
);
