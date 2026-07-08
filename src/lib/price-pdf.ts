// Personalised price-estimate PDF, generated client-side from calculator state.
// jsPDF + the PT Sans TTFs are loaded lazily (only when the user clicks download)
// so they never weigh on the initial bundle. PT Sans ships Cyrillic + the ₽ glyph.
import {
  computePrice,
  formatPrice,
  PACKAGES,
  SERVICES,
} from './pricing';
import type { CalcState } from './calculator-context';
import { CONTACT_PHONE, CONTACT_EMAIL, SITE_HOST } from './site';

const BRAND: [number, number, number] = [30, 92, 50];
const INK: [number, number, number] = [20, 19, 18];
const GREY: [number, number, number] = [120, 120, 118];
const LIME: [number, number, number] = [200, 255, 62];
const CREAM: [number, number, number] = [246, 243, 236];
const LINE: [number, number, number] = [214, 212, 206];

// Chunked base64 — String.fromCharCode.apply on the whole 450 KB array overflows.
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFont(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Не удалось загрузить шрифт: ${url}`);
  return toBase64(await res.arrayBuffer());
}

export async function downloadPriceEstimate(state: CalcState): Promise<void> {
  const [{ jsPDF }, regular, bold] = await Promise.all([
    import('jspdf'),
    loadFont('/fonts/PTSans-Regular.ttf'),
    loadFont('/fonts/PTSans-Bold.ttf'),
  ]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.addFileToVFS('PTSans-Regular.ttf', regular);
  doc.addFont('PTSans-Regular.ttf', 'PTSans', 'normal');
  doc.addFileToVFS('PTSans-Bold.ttf', bold);
  doc.addFont('PTSans-Bold.ttf', 'PTSans', 'bold');
  doc.setFont('PTSans', 'normal');

  const L = 18;
  const R = 192;
  const pkg = PACKAGES[state.packageKey];
  const coef = pkg.m2ToLm;
  const lm = Math.round(state.areaM2 * coef);
  const { totalMin, breakdown } = computePrice(
    state.services,
    state.areaM2,
    state.packageKey,
    state.hoodCount,
  );
  const dateStr = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // ---- Header --------------------------------------------------------------
  doc.setFont('PTSans', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...BRAND);
  doc.text('VENT', L, 24);

  doc.setFont('PTSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text('ПРЕДВАРИТЕЛЬНЫЙ РАСЧЁТ', R, 20, { align: 'right' });
  doc.text(dateStr, R, 25, { align: 'right' });

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(L, 30, R, 30);

  // ---- Parameters ----------------------------------------------------------
  let y = 42;
  doc.setFont('PTSans', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND);
  doc.text('Параметры объекта', L, y);

  const params: [string, string][] = [
    ['Тип объекта', pkg.label],
    ['Площадь', `${state.areaM2} м²`],
    ['Воздуховоды (оценка)', `~ ${lm} пог.м`],
  ];
  if (state.services.includes('hood')) {
    params.push(['Зонты / вытяжки', `${state.hoodCount} шт`]);
  }

  y += 8;
  doc.setFontSize(10.5);
  for (const [label, value] of params) {
    doc.setFont('PTSans', 'normal');
    doc.setTextColor(...GREY);
    doc.text(label, L, y);
    doc.setFont('PTSans', 'bold');
    doc.setTextColor(...INK);
    doc.text(value, L + 50, y);
    y += 7;
  }

  // ---- Services table ------------------------------------------------------
  y += 6;
  doc.setFont('PTSans', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND);
  doc.text('Выбранные услуги', L, y);

  y += 7;
  doc.setFont('PTSans', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text('УСЛУГА', L, y);
  doc.text('КОЛ-ВО', L + 95, y);
  doc.text('СТОИМОСТЬ', R, y, { align: 'right' });
  y += 2;
  doc.setDrawColor(...LINE);
  doc.line(L, y, R, y);
  y += 6;

  if (breakdown.length === 0) {
    doc.setFontSize(10.5);
    doc.setTextColor(...GREY);
    doc.text('Услуги не выбраны', L, y);
    y += 8;
  } else {
    for (const line of breakdown) {
      const svc = SERVICES[line.key];
      const qty =
        svc.kind === 'linear'
          ? `${lm} пог.м`
          : svc.kind === 'unit'
            ? `${state.hoodCount} шт`
            : '—';

      doc.setFont('PTSans', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      doc.text(svc.label, L, y);

      doc.setFontSize(9.5);
      doc.setTextColor(...GREY);
      doc.text(qty, L + 95, y);

      doc.setFont('PTSans', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
      doc.text(`от ${formatPrice(line.amount)}`, R, y, { align: 'right' });

      y += 5;
      doc.setDrawColor(...LINE);
      doc.setLineDashPattern([0.6, 0.8], 0);
      doc.line(L, y, R, y);
      doc.setLineDashPattern([], 0);
      y += 6;
    }
  }

  // ---- Total ---------------------------------------------------------------
  y += 4;
  doc.setFillColor(...INK);
  doc.roundedRect(L, y, R - L, 24, 3, 3, 'F');
  doc.setFont('PTSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...CREAM);
  doc.text('ИТОГО · ДО ВЫЕЗДА ИНЖЕНЕРА', L + 8, y + 9);
  doc.setFont('PTSans', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...LIME);
  doc.text(`от ${formatPrice(totalMin)}`, R - 8, y + 16, { align: 'right' });
  y += 32;

  // ---- Disclaimer + footer -------------------------------------------------
  doc.setFont('PTSans', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const disclaimer = doc.splitTextToSize(
    'Расчёт предварительный. Точная цена фиксируется после видеоосмотра объекта и не меняется.',
    R - L,
  );
  doc.text(disclaimer, L, y);

  doc.setDrawColor(...LINE);
  doc.line(L, 281, R, 281);
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(CONTACT_PHONE, L, 287);
  doc.setTextColor(...GREY);
  doc.text(`${CONTACT_EMAIL}   ·   ${SITE_HOST}`, R, 287, { align: 'right' });

  doc.save('Vent-raschet.pdf');
}
