// Single source of truth for site-wide identity constants.
// NEXT_PUBLIC_SITE_URL lets staging/preview deploys override the canonical URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vent.team';
export const SITE_HOST = new URL(SITE_URL).host;

export const CONTACT_PHONE = '+7 (495) 120-04-04';
export const CONTACT_PHONE_TEL = '+74951200404';
export const CONTACT_PHONE_HREF = 'tel:+74951200404';
export const CONTACT_EMAIL = 'hello@vent.team';
export const CONTACT_EMAIL_HREF = 'mailto:hello@vent.team';

export const FOUNDED_YEAR = 2021;
