# Vent — промышленная чистка вентиляции

Лендинг на Next.js (App Router) с онлайн-калькулятором стоимости, PDF-экспортом расчёта и формой заявки, пишущей лиды в Google Sheets.

**Стек:** Next.js, React, TypeScript, Tailwind CSS 4, React Hook Form + Zod, googleapis, jsPDF, Vitest.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполнить значения (см. ниже)
npm run dev                  # http://localhost:3000
```

## Переменные окружения (`.env.local`)

| Переменная | Что это |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email сервисного аккаунта Google Cloud |
| `GOOGLE_PRIVATE_KEY` | Приватный ключ сервисного аккаунта (с `\n` внутри кавычек) |
| `GOOGLE_SHEET_ID` | ID таблицы, куда падают заявки (из URL таблицы) |
| `GOOGLE_SHEET_RANGE` | Вкладка и диапазон, по умолчанию `Sheet1!A:J`. Для русскоязычной таблицы — `Лист1!A:J` |
| `NEXT_PUBLIC_SITE_URL` | Канонический URL сайта (метаданные, sitemap, JSON-LD) |

Сервисному аккаунту нужно выдать доступ «Редактор» на таблицу (кнопка «Поделиться» → email аккаунта).

## Команды

```bash
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск production-сборки
npm test         # unit-тесты (движок цен)
npx tsc --noEmit # проверка типов
```

## Структура

- `src/app/` — страницы: `/`, `/calculator`, `/contacts`, `/privacy`, API-роут `/api/submit`, SEO-роуты (robots, sitemap, OG-image)
- `src/components/` — секции лендинга, по каталогу на компонент
- `src/lib/` — движок цен (`pricing.ts`), состояние калькулятора, Zod-схемы, интеграция Google Sheets, PDF-генератор, хуки анимаций, константы сайта (`site.ts`)
- `src/data/` — статический контент (кейсы, отзывы, объекты)
