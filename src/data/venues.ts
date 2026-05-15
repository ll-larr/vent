export type Venue = { id: string; name: string; src: string; alt: string };

export const VENUES: Venue[] = [
  { id: 'gazprom',  name: 'Газпром Арена', src: '/images/trust-gazprom.jpg',  alt: 'Газпром Арена — стадион' },
  { id: 'miratorg', name: 'Мираторг',      src: '/images/trust-miratorg.jpg', alt: 'Мираторг — производство' },
  { id: 'multon',   name: 'Мультон',       src: '/images/trust-multon.jpg',   alt: 'Мультон — производство' },
  { id: 'ska',      name: 'СКА',           src: '/images/trust-ska.jpg',      alt: 'СКА — ледовая арена' },
];
