# Vent.team — промышленная чистка вентиляции

Сайт компании: главная-скролл-история из восьми секций с калькулятором и формой заявки,
раздел статей, страницы услуг, калькулятор, контакты и политика.

**Стек:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4,
React Hook Form + Zod, googleapis, Vitest.

## Запуск

```bash
npm install
cp .env.example .env.local   # заполнить значения (см. ниже)
npm run dev                  # http://localhost:3000
```

```bash
npm run build      # продакшен-сборка
npx tsc --noEmit   # только проверка типов
npm test           # vitest: расчёт цены и схема заявки
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

## Структура

```
src/app                 маршруты: / (история), /blog, /blog/[slug], /calculator,
                        /contacts, /privacy, /uslugi (+4 страницы услуг), /api/submit
src/components/story    секции истории и общая обвязка (топбар, футер, CTA, аккордеон)
src/lib                 движок скролла, расчёт цены, состояние калькулятора, схемы, интеграции
src/data                контент: статьи, тексты секций, реестр страниц услуг
```

Архитектура и правила, которые легко нарушить незаметно, — в [CLAUDE.md](CLAUDE.md).
Расхождения с дизайн-макетом и открытые хвосты — в [AUDIT.md](AUDIT.md).

## Дизайн-макет

`design_handoff_vent_landing/README.md` — спецификация (источник истины),
`design/*.dc.html` — рабочие прототипы. Папка `design/img/` в гите не хранится:
это побайтные копии `public/images/`. Чтобы открыть прототипы с картинками:

```bash
cp public/images/*.jpg design_handoff_vent_landing/design/img/
```

## Прайс-лист

`ПРАЙС-ЛИСТ.md` — источник. PDF в `public/files/vent-pricelist-2026.pdf` собирается из него
печатью HTML в headless Chrome; при правке цен обновлять оба файла вместе с
`src/lib/pricing.ts`.

## Деплой

Vercel, scope `vent-team`, проект `vent-final`. Проект **не подключён к GitHub** — push и
мерж прод не обновляют. Выкатка только из рабочего каталога:

```bash
npx vercel --prod
```

Что не должно уезжать на прод — в `.vercelignore`.
