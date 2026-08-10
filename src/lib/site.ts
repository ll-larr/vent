// Single source of truth for site-wide identity constants.
// NEXT_PUBLIC_SITE_URL lets staging/preview deploys override the canonical URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vent-clean.ru';
export const SITE_HOST = new URL(SITE_URL).host;

export const CONTACT_PHONE = '+7 (495) 120-04-04';
export const CONTACT_PHONE_TEL = '+74951200404';
export const CONTACT_PHONE_HREF = 'tel:+74951200404';
export const CONTACT_EMAIL = 'hello@vent-clean.ru';
export const CONTACT_EMAIL_HREF = 'mailto:hello@vent-clean.ru';
// Placeholder handles carried over from the design handoff — swap both for the
// real accounts before launch.
export const CONTACT_TELEGRAM_HREF = 'https://t.me/vent';
export const CONTACT_WHATSAPP_HREF = 'https://wa.me/74951200404';

export const FOUNDED_YEAR = 2021;
