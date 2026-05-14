export interface NavLink {
  href: string;
  label: string;
  anchor?: boolean;
}

export const navLinks: NavLink[] = [
  { href: '#services', label: 'Услуги', anchor: true },
  { href: '#portfolio', label: 'Портфолио', anchor: true },
  { href: '#about', label: 'О компании', anchor: true },
  { href: '#promos', label: 'Акции', anchor: true },
  { href: '#calculator', label: 'Цены', anchor: true },
  { href: '#contacts', label: 'Контакты', anchor: true },
];

export const LogoSvg = () => (
  <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M14 6C14 6 18 10 18 14C18 18 14 22 14 22C14 22 10 18 10 14C10 10 14 6 14 6Z"
      fill="currentColor"
      opacity="0.2"
    />
    <path
      d="M6 14C6 14 10 10 14 10C18 10 22 14 22 14C22 14 18 18 14 18C10 18 6 14 6 14Z"
      fill="currentColor"
      opacity="0.2"
    />
    <circle cx="14" cy="14" r="3" fill="currentColor" />
  </svg>
);
