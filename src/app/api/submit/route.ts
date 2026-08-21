import { NextRequest, NextResponse } from 'next/server';
import { submitSchema } from '@/lib/schemas';
import { appendRow } from '@/lib/sheets';
import { PACKAGES, SERVICES, computeEstimate, formatPrice, type UnitCounts } from '@/lib/pricing';
import { rateLimitOk } from '@/lib/rate-limit';

const MAX_BODY_BYTES = 10_000;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';
    if (!rateLimitOk(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const contentLength = Number(req.headers.get('content-length') ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await req.json();

    // Honeypot tripped — pretend success so bots get no validation signal,
    // and nothing is written to the sheet.
    if (typeof body?.website === 'string' && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const data = parsed.data;

    const timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Recomputed server-side rather than trusted from the client — the sheet
    // is the sales team's source of truth for what was quoted.
    // Only counters for services actually in the catalog reach the estimator.
    const counts: UnitCounts = {};
    for (const [key, value] of Object.entries(data.counts)) {
      if (key in SERVICES) counts[key as keyof typeof SERVICES] = value;
    }

    const { total } = computeEstimate(
      data.services,
      { unit: data.unit, areaM2: data.areaM2, lmValue: data.lmValue },
      data.packageKey,
      counts,
    );

    const row = [
      data.ticket,
      timestamp,
      data.name,
      data.phone,
      data.objectName,
      PACKAGES[data.packageKey].label,
      data.unit === 'lm' ? `${data.lmValue} пог.м` : `${data.areaM2} м²`,
      data.services.map((s) => SERVICES[s].label).join(', ') || '—',
      data.comment || '—',
      `от ${formatPrice(total)}`,
    ];

    await appendRow(row);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
