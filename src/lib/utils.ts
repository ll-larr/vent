/**
 * Russian plural agreement: plural(5, ['материал', 'материала', 'материалов']).
 * Forms are [one, few, many] — 1 материал, 2 материала, 5 материалов.
 */
export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const tail = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (tail > 1 && tail < 5) return forms[1];
  if (tail === 1) return forms[0];
  return forms[2];
}
