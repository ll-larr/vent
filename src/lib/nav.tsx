export interface NavLink {
  href: string;
  label: string;
  anchor?: boolean;
}

export const navLinks: NavLink[] = [
  { href: '/#services',   label: 'Услуги',   anchor: true },
  { href: '/#cases',      label: 'Кейсы',    anchor: true },
  { href: '/#venues',     label: 'Объекты',  anchor: true },
  { href: '/#process',    label: 'Процесс',  anchor: true },
  { href: '/#calculator', label: 'Цены',     anchor: true },
  { href: '/#contact',    label: 'Контакты', anchor: true },
];

/** Extract section id from a nav href (e.g. "/#services" → "services"). */
export const navHrefToId = (href: string): string => href.split('#')[1] ?? '';

export const CONTACT_PHONE = '+7 (495) 120-04-04';
export const CONTACT_PHONE_HREF = 'tel:+74951200404';
export const CONTACT_EMAIL = 'hello@vent.team';
export const CONTACT_EMAIL_HREF = 'mailto:hello@vent.team';

export const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="13" stroke="#c8ff3e" strokeWidth="1.5" />
    <circle cx="14" cy="14" r="3" fill="#c8ff3e" />
  </svg>
);

export const LogoWord = () => (
  <span className="font-display font-normal text-[22px] tracking-[-.02em]">
    vent<i className="not-italic text-accent">.</i>
  </span>
);
