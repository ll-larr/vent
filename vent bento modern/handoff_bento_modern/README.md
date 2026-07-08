# Handoff: Vent — Bento Modern (lending page redesign)

## Overview

Полный редизайн главной страницы Vent (промышленная чистка вентиляции, общепит/офис/производство) в стиле **bento-modern** — модульная сетка из плиток разных размеров, плотная типографика, минимум воды. Сохраняет все токены и копирайт из существующего Next.js-проекта.

## About the Design Files

Файлы в этом архиве — **дизайн-референс в HTML/CSS/JS**, не продакшен-код для копирования один-в-один. Это прототип, который показывает финальный вид, layout, интеракции и копирайт. Задача — **перенести эти решения в существующий Next.js-репозиторий `Vent/cleanvent-nextjs`** (App Router, React 18, TypeScript, Tailwind CSS, shadcn/ui), сохранив его архитектуру и паттерны.

Не нужно:
- Менять стек или добавлять зависимости (всё уже есть).
- Копировать инлайн `<style>` из HTML — переносите в Tailwind-классы или `src/app/globals.css`.
- Дублировать данные — они уже в `src/data/*.ts` (`services.ts`, `cases.ts`, `venues.ts`, `reviews.ts`, `packages.ts`).

## Fidelity

**High-fidelity.** Все цвета, шрифты, отступы, радиусы, интеракции в HTML — финальные. Bento-сетка построена на 12 колонок с `gap: 12px` и `border-radius` 16–28px в зависимости от размера плитки. Скриншоты не приложены — открывайте `Vent - Bento Modern.html` в браузере, чтобы видеть итог.

## Стек таргета (уже настроен)

- Next.js 14 App Router, React 18, TypeScript
- Tailwind CSS 4 (`tailwind.config.ts`), все токены уже совпадают
- Шрифты через `next/font` в `src/app/layout.tsx`: Fraunces (display), Inter Tight (sans), JetBrains Mono (mono)
- React Hook Form + Zod на форме заявки
- `googleapis` для отправки в Google Sheets через `/api/submit`
- Vitest для тестов (есть `pricing.test.ts`)

## Дизайн-токены (уже в `tailwind.config.ts`)

| Токен | Значение |
|---|---|
| `bg` | `#f6f3ec` (кремовый фон) |
| `ink` | `#141312` (основной чёрный) |
| `brand` | `#1e5c32` (тёмно-зелёный) |
| `brand-dark` | `#0f3d22` |
| `accent` | `#c8ff3e` (лайм) |
| `surface` | `#ffffff` |
| `stone` | `#f4f4f2` |
| `line` | `rgba(20,19,18,0.08)` |
| `radius-card` | 16px |
| `radius-xl2` | 24px (большие плитки) |

В HTML использован дополнительный `--line-2: rgba(20,19,18,.14)` — добавьте в `globals.css`.

## Карта секций → React-компонентов

Файл `Vent - Bento Modern.html` собран как один большой лендинг. Маппинг к существующим компонентам в `src/components/`:

| Секция HTML | React-компонент | Что менять |
|---|---|---|
| Top bar (sticky pill nav) | `Header/Header.tsx` | Полная переработка: pill-форма, контакты в центре справа, активная ссылка подсвечивается лаймом по IntersectionObserver |
| Hero bento (8 плиток) | `Hero/Hero.tsx` | Полная переработка — см. ниже |
| Services bento (feature + 2 cards + photo + 3 flat + Included) | `Services/Services.tsx` | Полная переработка — добавить плитку «Без скрытых доплат» |
| Cases (full-bleed compare slider) | `Cases/Cases.tsx` | Переписать: фото на весь блок, glass-панель снизу, auto-anim бегунка |
| BigVenues (4 фото-плитки + intro) | `BigVenues/BigVenues.tsx` | Добавить hover-popup с цитатой и сроками |
| HowWeWork (4 step tile + popup на hover) | `HowWeWork/HowWeWork.tsx` | Добавить popup с детализацией + auto-demo первой карточки через 0.5s после появления секции |
| TrustSection | `TrustSection/TrustSection.tsx` | Большая цитата + 2 stat + лицензии + 2 вторичные цитаты, поменять `10 лет → 5 лет` |
| Calculator (full) | `Calculator/Calculator.tsx` | Переделать поле площади на slider (`<input type=range>`) + поле зонтов на stepper (`− 3 шт +`) |
| Contact form | `ContactSection/ContactSection.tsx` + `ContactForm/ContactForm.tsx` | Маска телефона `+7 999 888 77 66`, ссылка на политику ведёт на `privacy.html` |
| Footer | `Footer/Footer.tsx` | bento-стиль, год `2014 → 2021`, убрать ОГРН |

Новый файл `privacy.html` → перенести в `src/app/privacy/page.tsx` (страница уже существует — заменить содержимое).

## Hero bento — структура (12 колонок)

```
┌────────────────────────────────────┬───────────────────┐
│  H-HEADLINE (cream, span 8 × 3)    │  H-PROMO (brand,  │
│  «Чистим то, что никто             │   span 4 × 2)     │
│   не видит.»                       │  «Видеоинспекция  │
│  + lede + meta                     │   до. Протокол    │
│                                    │   СЭС после.»     │
│                                    ├─────────┬─────────┤
│                                    │ STAT 1  │ STAT 2  │
│                                    │ 200+    │ 4–6 дн  │
│                                    │ (ink)   │ (lime)  │
├──────────────────────────┬─────────┴─────────┴─────────┤
│  H-MINI-CALC             │  H-LICENSES (surface)       │
│  (surface, span 7 × 2)   │  МЧС · СЭС · СРО · ГОСТ     │
│  пакет / м² / зонты      ├─────────────────────────────┤
│  / результат / CTA       │  H-STATUS (ink)             │
│                          │  «Ответ — 15 мин…»          │
└──────────────────────────┴─────────────────────────────┘
```

Mini-calc уже в проекте (`Calculator/MiniCalculator.tsx`) — стилизуйте под bento, но логика остаётся.

## Services bento — структура

```
┌───────────────────────────────────┬─────────────────┐
│ SVC-FEATURE (brand, span 7 × 3)   │ SVC-CARD «Пыль» │
│ «Чистка от жира до металла»       │ (white, span 5) │
│ + price tag 300 ₽/пог.м           ├─────────────────┤
│                                   │ SVC-PHOTO       │
│                                   │ (ink, span 5)   │
│                                   │ service-vent.jpg│
├─────────────────┬─────────────────┴─────────────────┤
│ SVC-CARD        │ SVC-INCLUDED (ink, span 7 × 2)    │
│ «Зонты»         │ «Без скрытых доплат и сюрпризов.» │
│ (white, span 5) │ 5-row checklist + 2 CTA           │
├─────────────────┴───────────┬─────────────┬─────────┘
│ SVC-FLAT «Дезинфекция»      │ SVC-FLAT    │ SVC-FLAT
│ (white, span 4)             │ «Диагностика│ «Договор»
│                             │ »(white,span4)│(ink,span4)
└─────────────────────────────┴─────────────┴─────────┘
```

## Cases — full-bleed compare slider

Ключевые отличия от текущего:
- Фото на весь блок плитки (без `aspect-[4/3]`), `min-height: 460px`.
- Glass-панель снизу `position: absolute; left/right/bottom: 18px` с `backdrop-filter: blur(14px)`.
- Внутри панели: всегда видны `ven` + `h4`; на hover плитки — раскрывается `case-expand` (CSS grid trick `grid-template-rows: 0fr → 1fr`).
- Бегунок «До/После» — **автоматически анимируется** 30%↔70% по cubic ease (4.8s ping-pong), пауза на mouseenter, пользователь берёт управление при hover (без клика).
- Бейдж «кейс 01 · жир» в **левом верхнем** углу, «До»/«После» tags в правом верхнем; tag.before переехал на `top: 60px` чтобы не перекрываться с case-corner.
- Сетка плиток: 1 big (span 12), 2 medium (span 6 + span 6).

## Calculator (full) — изменения логики

`src/lib/pricing.ts` **не трогать** — формула верна. Меняется только UI:
- Поле площади → `.calc-slider`: `<input type="range" min="20" max="3000">` + кастомный `value-wrap` с пунктиром снизу и pill-кнопками 80/220/500/1500.
- Поле зонтов → `.calc-stepper`: `− value шт +`, ширина инпута `field-sizing: content`, `min-width: 24px`.
- Кнопка калькулятора в карточках сервисов получает `data-calc-jump="<svc-key>"` и предвыбирает пакет + соответствующую услугу при клике (см. JS-обработчик внизу HTML).

## Hover-popup паттерн

Используется в двух местах: **HowWeWork** и **BigVenues**. CSS:
```css
.popup {
  position: absolute; inset: 0; z-index: 3;
  background: var(--ink); color: var(--bg);
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity .3s ease, transform .35s cubic-bezier(.16,1,.3,1);
}
.parent:hover .popup,
.parent[data-hint="open"] .popup { opacity: 1; transform: translateY(0); pointer-events: auto; }
.parent:hover > .static-content,
.parent[data-hint="open"] > .static-content { opacity: 0; }
```

Для HowWeWork: первая карточка автоматически раскрывает popup через **0.5s** после появления секции (IntersectionObserver, threshold 0.3), держит **0.5s**, закрывает. Если пользователь успел навести курсор — авто-демо отменяется.

## Phone mask

```ts
// +7 prefix снаружи инпута, пользователь печатает только 10 цифр.
// Формат: 999 888 77 66 (4 группы: 3-3-2-2).
// Лидирующая 7 или 8 в пасте срезается автоматически.
// Полный номер хранится в data-fullNumber: +79998887766
```
Реализация в `<script>` внизу HTML. Перенести в `ContactForm.tsx` как `useEffect` или React Hook Form `Controller` с custom onChange.

## Адаптив

В HTML breakpoints: `1100px` (планшет) и `640px` (мобайл). При переносе в Tailwind:
- `1100px` → `lg:` (1024) или `xl:` (1280) — выбрать по гриду
- `640px` → `sm:`

Основные правила свёртки:

| Десктоп | Tablet (≤1100px) | Mobile (≤640px) |
|---|---|---|
| 12-кол bento | span 6 или 12 для всех плиток | span 12 для всех |
| Hero: headline 8 + промо 4 | headline 12, промо 6, mini-calc 12, status 12 | всё в столбец |
| Cases: 1×big + 2×6 | все span 6 | все span 12 |
| Services: 7+5, 5+5+7, 4+4+4 | 12, 6+6, 6+6 | всё 12 |
| Topbar: logo + nav + contacts + CTA | logo + CTA (nav и contacts скрыты) | logo + CTA |
| Form-grid 2 кол | 2 кол | 1 кол |

Меню на мобайле сейчас просто скрывается — нужно добавить **бургер + drawer** в `Header.tsx`.

## Точные правки текстов (то что было изменено в течение итерации)

- ✗ «бесплатный выезд» / «выезд бесплатно» → ✓ «осмотр специалиста / инженера»
- ✗ «10 лет работы» → ✓ «5 лет работы» (это везде, и в `TrustSection`, и в `H-STAT-1`)
- ✗ «4 дн средний срок» → ✓ «4–6 дн»
- ✗ «© 2014–2026 Vent · ОГРН 1147796123456» → ✓ «© 2021–2026 Vent»
- ✗ «с 2014 года» → ✓ «с 2021 года»
- ✗ «отправляя форму, соглашаетесь на обработку данных» → ✓ «Отправляя форму, вы соглашаетесь на [обработку персональных данных](privacy.html) в соответствии с офертой.»
- ✗ «база ↗ мск / спб / казань / новосибирск» → ✓ «база ↗ мск / спб / казань / екатеринбург»
- ✗ «политика · оферта» (в футере) → ✓ «Политика конфиденциальности» (ведёт на `privacy.html`)
- ✗ «В рабочее время — за 15 минут» → ✓ «В рабочее время — за 30 минут»
- В hero status: «Ответ на заявку — 15 мин, осмотр специалиста — с эндоскопом»
- Кейс «01 · жир» — текст «Ресторан в БЦ — три года жира» (220 м²) теперь второй; первый — «Плановая чистка раз в полгода» (150 м²)
- Process step popups: убрана упоминание «кухни», «зонтов» в общих описаниях

## Анимации (микро-моушн)

| Где | Что | Длительность / easing |
|---|---|---|
| Hero CTA «Оставить заявку» | wipe-fill ink → lime текст | 0.45s cubic-bezier(.65,0,.35,1) |
| `.btn.lime` | wipe-fill ink, стрелка translateX(4) | 0.45s |
| Compare slider | auto ping-pong 28→72% | 4.8s sine, пауза на hover |
| HowWeWork popup | translateY(8) → 0 + opacity | 0.3s ease + 0.35s cubic-bezier(.16,1,.3,1) |
| HowWeWork auto-demo | первая карточка через 0.5s после видимости | держится 0.5s |
| Counters (200+, 5) | 0 → target, ease-out cubic | 1.1s |
| Compare-grip | dashed ring spin | 9s linear infinite |
| Live dot | pulse | 1.6s ease-in-out infinite |
| Slider thumb | inset 7px brand на ободке, scale 1.08 на hover | 0.15s |

`prefers-reduced-motion` уже учтён в `globals.css` — не ломайте.

## Что НЕ переносится из HTML

- Маркер «● сейчас на объекте · 04:12 МСК» был в первой версии — заменён на «осмотр инженера». Не возвращайте.
- Длинные генератор-описания «Молочный путь, москва-сити» — это плейсхолдеры, дальше менять под реальные данные.
- Бейдж «01» декоративный поверх большого кейса — был удалён по запросу пользователя, не возвращайте.

## Контракты API (без изменений)

`POST /api/submit` уже принимает `{ name, phone, area, services, message, source }`. Добавлять поля не нужно — форма заявки и калькулятор уже совместимы.

## Файлы в архиве

- `Vent - Bento Modern.html` — основной макет (≈2400 строк)
- `privacy.html` — страница политики конфиденциальности
- `images/` — все фото-ассеты, уже скопированы из `public/images/` исходного проекта
- `README.md` — этот файл

## Тестирование

После переноса в Next.js:
1. `npx tsc --noEmit` — типы
2. `npm run test` — vitest пройдёт (pricing.test.ts уже есть)
3. Прогнать responsive на 375 / 768 / 1024 / 1440 (Chrome DevTools)
4. Lighthouse — Accessibility ≥ 95 (alt-теги на фото объектов уже есть, aria-label на форме телефона тоже)
5. Проверить отправку формы на staging Google Sheets

## Деплой

Vercel (рекомендованный): подключите репозиторий, добавьте env-переменные:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (с литеральными `\n`)
- `GOOGLE_SHEET_ID`
