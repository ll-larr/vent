import { NextRequest, NextResponse } from 'next/server';
import { submitSchema } from '@/lib/schemas';
import { appendRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = submitSchema.parse(body);

    const timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const row = [
      timestamp,
      data.name,
      data.phone,
      data.objectType,
      data.services.join(', ') || '—',
      data.comment || '—',
      data.area ? `${data.area} м²` : '—',
    ];

    await appendRow(row);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Submit error:', err);
    if (err instanceof Error && err.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
