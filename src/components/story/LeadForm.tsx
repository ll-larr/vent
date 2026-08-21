'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OBJECT_LABELS, useCalculator, type ObjectKey } from '@/lib/calculator-context';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_TELEGRAM_HREF,
  CONTACT_WHATSAPP_HREF,
} from '@/lib/site';

/* Right half of section 07.

   The button is disabled until name, phone and the personal-data consent are
   all there, and it says which of them is missing — that is a specified state,
   not decoration. The calculator's package, volume and services ride along in
   the payload so the sheet shows what the visitor was looking at. */

const FIELD_LABEL = 'mono-label text-[10px] text-ink/50';
const UNDERLINE = 'border-b border-ink/[.18]';

// Ticket id shown to the user and written to the first sheet column: VNT-MMDD-XXXX
function generateTicket(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VNT-${mm}${dd}-${rand}`;
}

/** 10 digits, grouped 3 3 2 2. Leading 7/8 from a pasted number is dropped. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
    .filter(Boolean)
    .join(' ');
}

const SOCIAL_BUTTON =
  'grid h-[50px] w-[50px] place-items-center rounded-pill border border-ink/[.16] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-accent';

export function LeadForm() {
  const { state, dispatch } = useCalculator();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [pdn, setPdn] = useState(false);
  const [news, setNews] = useState(false);
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const phoneDigits = phone.replace(/\D/g, '');
  const ready = pdn && name.trim().length > 1 && phoneDigits.length >= 10;

  async function submit() {
    if (!ready || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket: generateTicket(),
          name: name.trim(),
          phone: `+7${phoneDigits}`,
          objectName: OBJECT_LABELS[state.objectKey],
          packageKey: state.packageKey,
          areaM2: state.areaM2,
          lmValue: state.lmValue,
          unit: state.unit,
          counts: state.counts,
          services: state.services,
          comment: note.trim(),
          website,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setError('Не отправилось. Попробуйте ещё раз или позвоните нам.');
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setSent(false);
    setName('');
    setPhone('');
    setNote('');
    setPdn(false);
    setError('');
  }

  const column =
    'flex min-w-0 flex-col justify-center bg-surface px-[clamp(22px,3vw,56px)] pb-[clamp(40px,5.5vh,66px)] pl-[clamp(22px,3vw,48px)] pt-[clamp(48px,6.5vh,80px)] min-[900px]:border-l min-[900px]:border-ink/[.08]';

  if (sent) {
    return (
      <div className={column}>
        <div className="flex max-w-[560px] flex-col gap-[18px]">
          <span className="grid h-12 w-12 place-items-center rounded-pill bg-accent text-[22px] text-ink">
            ✓
          </span>
          <h3 className="font-display text-[clamp(30px,3.6vw,56px)] font-light leading-none tracking-[-.03em]">
            Заявка у нас.
          </h3>
          <p className="max-w-[40ch] text-[17px] leading-[1.6] text-ink/70">
            Следующий шаг — звонок: уточним объём и договоримся, когда приехать на осмотр.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mono-label cursor-pointer self-start border-b border-brand/50 pb-[3px] text-[10.5px] text-brand"
          >
            отправить ещё одну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={column}>
      <form
        className="flex w-full max-w-[560px] flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div className="mono-label flex items-center gap-[11px] text-[11px] text-ink/50">
          <span aria-hidden="true" className="h-px w-5 bg-brand" />
          заявка
        </div>
        <h2 className="font-display text-[clamp(30px,3.4vw,54px)] font-light leading-none tracking-[-.032em]">
          Оставьте номер.
        </h2>
        <p className="max-w-[44ch] text-[clamp(15px,1.1vw,17px)] leading-[1.55] text-ink/70">
          Позвоним, уточним объём и договоримся об осмотре. На осмотре назовём цену, которая
          дальше не меняется.
        </p>

        <label className="mt-1 flex flex-col gap-1.5">
          <span className={FIELD_LABEL}>как к вам обращаться</span>
          <input
            type="text"
            data-form-name=""
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            autoComplete="name"
            className={`${UNDERLINE} py-2.5 text-[17px] outline-none`}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={FIELD_LABEL}>телефон</span>
          <span className={`${UNDERLINE} flex items-baseline gap-2 py-2.5`}>
            <span className="text-[17px] text-ink/50">+7</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="999 888 77 66"
              autoComplete="tel"
              inputMode="numeric"
              className="min-w-0 flex-[1_1_auto] text-[17px] outline-none"
            />
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span className={FIELD_LABEL}>объект</span>
          <div className="flex flex-wrap gap-[7px]">
            {(Object.keys(OBJECT_LABELS) as ObjectKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={state.objectKey === key}
                onClick={() => dispatch({ type: 'SET_OBJECT', key })}
                className={`mono-label cursor-pointer rounded-pill border border-ink/[.14] px-[15px] py-2.5 text-[10.5px] tracking-[.1em] transition-colors duration-300 ${
                  state.objectKey === key ? 'bg-ink text-bg' : 'bg-bg text-ink'
                }`}
              >
                {OBJECT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Label and textarea share one underlined block, as in the reference. */}
        <label className={`${UNDERLINE} block pb-2.5`}>
          <span className={`${FIELD_LABEL} mb-1.5 block`}>что нужно сделать — коротко</span>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Например: кухня 140 м², четыре зонта, дымит на линии"
            className="block w-full resize-none font-sans text-[16px] leading-[1.5] outline-none"
          />
        </label>

        <label className="flex cursor-pointer items-start gap-[11px] pt-1">
          <input
            type="checkbox"
            checked={pdn}
            onChange={(e) => setPdn(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] flex-[0_0_auto] cursor-pointer accent-brand"
          />
          <span className="text-[13px] leading-[1.5] text-ink/70">
            Согласен на обработку персональных данных в соответствии с{' '}
            <Link href="/privacy" className="border-b border-brand/40">
              политикой
            </Link>{' '}
            и{' '}
            <Link href="/privacy" className="border-b border-brand/40">
              офертой
            </Link>
            .
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-[11px]">
          <input
            type="checkbox"
            checked={news}
            onChange={(e) => setNews(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] flex-[0_0_auto] cursor-pointer accent-brand"
          />
          <span className="text-[13px] leading-[1.5] text-ink/55">
            Хочу получать напоминания о сроках чистки и информационные письма. Не обязательно.
          </span>
        </label>

        {/* Honeypot — real people never see it, bots fill it and get a no-op. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={!ready || sending}
          className={`mt-1 inline-flex items-center justify-center gap-2.5 rounded-pill px-6 py-[17px] text-[15px] font-medium transition-[background-color,color,opacity] duration-[350ms] ${
            ready
              ? 'cursor-pointer bg-ink text-bg hover:bg-accent hover:text-ink'
              : 'cursor-not-allowed bg-ink/10 text-ink/40 opacity-70'
          }`}
        >
          {sending
            ? 'Отправляем…'
            : ready
              ? 'Отправить заявку'
              : 'Заполните имя, телефон и согласие'}{' '}
          <span aria-hidden="true">→</span>
        </button>

        {error && (
          <p role="alert" className="text-[13px] leading-[1.5] text-brand">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-[clamp(16px,2vw,28px)] border-t border-ink/10 pt-3.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <a
              href={CONTACT_PHONE_HREF}
              className="font-display text-[clamp(22px,2.2vw,32px)] font-light leading-[1.2] tracking-[-.025em] text-ink transition-colors duration-300 hover:text-brand"
            >
              {CONTACT_PHONE}
            </a>
            <a
              href={CONTACT_EMAIL_HREF}
              className="font-display text-[clamp(22px,2.2vw,32px)] font-light leading-[1.2] tracking-[-.025em] text-ink transition-colors duration-300 hover:text-brand"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="flex flex-[0_0_auto] flex-col gap-2.5">
            <a
              href={CONTACT_TELEGRAM_HREF}
              aria-label="Написать в Telegram"
              title="Telegram"
              target="_blank"
              rel="noopener noreferrer"
              className={SOCIAL_BUTTON}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M21.9 4.3 18.7 19c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.3 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L6.4 12.7 1.6 11.2c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.4 1.8Z" />
              </svg>
            </a>
            <a
              href={CONTACT_WHATSAPP_HREF}
              aria-label="Написать в WhatsApp"
              title="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className={SOCIAL_BUTTON}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.8-1.7-.9-.2-.1-.4-.1-.6.1-.2.3-.6.9-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.9-.6 3.1.5 1.4 1.4 2.6 2.5 3.6a9 9 0 0 0 3.5 2c1.6.5 2.5.4 3.2.2.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3Z" />
              </svg>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LeadForm;
