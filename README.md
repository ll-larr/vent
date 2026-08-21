# vent.team — промышленная чистка вентиляции

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
| `NEXT_PUBLIC_SITE_URL` | Канонический URL сайта (метаданные, sitemap, JSON-LD). По умолчанию `https://vent.team` |

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

`ПРАЙС-ЛИСТ.md` — источник цен, 42 позиции. PDF в `public/files/vent-pricelist-2026.pdf`
собирается скриптом:

```bash
pip install reportlab
python scripts/build-pricelist.py
```

Скрипт печатает A4 на системных шрифтах (Georgia под заголовки — так же, как кириллица ведёт
себя на сайте; Segoe UI и Consolas вместо Inter Tight и JetBrains Mono, которые лежат в .woff2 и
reportlab их не читает). Ссылка на PDF — кнопка «прайс · pdf» в секции 07.

При правке цен обновлять три места вместе: `ПРАЙС-ЛИСТ.md`, `scripts/build-pricelist.py` и
`src/lib/pricing.ts` — в последнем только позиции, которые считает калькулятор.

## Деплой

Vercel, scope `vent-team`, проект `vent-final`. Проект **не подключён к GitHub** — push и
мерж прод не обновляют. Выкатка только из рабочего каталога:

```bash
npx vercel --prod
```

Что не должно уезжать на прод — в `.vercelignore`.

### Домены

Боевой домен — `vent.team`. Канонический адрес по умолчанию задан в `src/lib/site.ts`;
переменная `NEXT_PUBLIC_SITE_URL` в Production переопределяет его и нужна только на время
переездов. `www.vent.team`, обе формы `vent-clean.ru` и `vent-final.vercel.app` уходят на
апекс 301-м — список в `next.config.js`.

**reg.ru здесь только регистратор и DNS, не хостинг.** Оба домена делегированы на
`ns1.reg.ru` / `ns2.reg.ru`, зоны правятся в панели reg.ru. Хостинг — Vercel.

Состояние зон на 21.08.2026:

| Домен | A-запись | Что отдаёт |
|---|---|---|
| `vent.team` | `76.76.21.21` (апекс Vercel) | сайт, 200 |
| `www.vent.team` | `76.76.21.21` | 308 на апекс |
| `vent-clean.ru` | нет | не резолвится |

`vent.team` и `www.vent.team` добавлены в домены проекта `vent-final`; NS остаются на reg.ru,
Vercel обслуживает домен по A-записи, делегировать зону на `ns1.vercel-dns.com` не требуется.

`vent-clean.ru` числится в проекте, но A-записи в зоне нет — 301 на `vent.team` из
`next.config.js` не сработает, пока в панели reg.ru не появится `A @ 76.76.21.21`. Домен
почти наверняка никогда не был живым, так что это страховка, а не срочность.

MX ни на одном домене нет — почта `hello@vent.team` и `privacy@vent.team` из
`src/lib/site.ts` и страницы политики пока не работает.
