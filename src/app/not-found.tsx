import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-5">
      <div className="max-w-xl text-center">
        <div className="font-mono text-[11px] uppercase tracking-[.18em] text-brand mb-4">
          ошибка 404
        </div>
        <h1 className="font-display font-light text-[clamp(48px,8vw,96px)] leading-none tracking-[-.025em]">
          Страница <em className="italic text-brand">не найдена.</em>
        </h1>
        <p className="text-ink/60 text-[15px] mt-6 leading-[1.55]">
          Возможно, ссылка устарела или страница переехала.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 bg-ink text-bg px-6 py-3.5 rounded-full font-medium text-[14px] hover:bg-brand transition-colors"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
