# Handoff: Vent — обновления UI (кнопки, hero CTA, прайс-карточка, порядок секций, success-state формы, плитка сроков)

## Overview
Пакет с правками, которые нужно перенести в продакшен-кодбейз сайта **Vent** (чистка вентиляции). Все изменения сделаны на эталонном HTML-прототипе `Vent - Bento Modern.html` (включён в этот пакет) — это **дизайн-референс**, а не production-код. Задача — повторить визуал и поведение этого референса в существующем фронтенд-стеке проекта (React/Next/Vue/etc.), используя его паттерны и токены дизайн-системы.

## Fidelity
**High-fidelity.** Все значения (цвета, размеры, тайминги, easing) финальные. Воспроизводить пиксель-в-пиксель.

## Design tokens (на всякий случай — для сверки)
```
--bg:        #f6f3ec   /* cream — основной фон */
--ink:       #141312   /* near-black — текст и dark surfaces */
--brand:     #1e5c32   /* deep green — акценты */
--accent:    #c8ff3e   /* lime — primary CTA */
--surface:   #ffffff
--stone:     #f4f4f2
--line-2:    rgba(20,19,18,.12)
--r-chip:    999px     /* CTA pill radius */
--r-tile-lg: (большой радиус плиток bento — взять из текущего проекта)

font-family --display : дисплейный (используется в заголовках)
font-family --mono    : моно (используется в caps-метках)
font-family --sans    : основной body
```

---

## Правка 1 — Унифицированная система кнопок (главное)

Раньше hover-стили были разрозненные (slide-in оверлеи, shadow-glow, padding-shift). Свели всё к **трём типам** с одинаковым crossfade (`background/color/border-color` за `350ms ease`) и сдвигом стрелки на `4px`.

### Type A — `.btn.lime` (lime → cream)
- **Default**: `background: var(--accent)`, `color: var(--ink)`, `border: 1px solid transparent`
- **Hover**:  `background: var(--bg)`, `color: var(--ink)`, `border-color: transparent`
- **Применение**: главные CTA на тёмных секциях; topbar CTA; hero «оставить заявку»; «скачать прайс-лист»; «Рассчитать» в svc-included и calc-card; «Позвонить сейчас» в success-state

### Type B — `.btn.ghost` на светлом + `.svc-card .more` (светлый → тёмный с лаймом)
- **Default**: `background: transparent`, `color: var(--ink)`, `border: 1px solid var(--line-2)`
- **Hover**:  `background: var(--ink)`, `color: var(--accent)`, `border-color: var(--ink)`
- **Применение**: вторичные кнопки на светлом фоне; ссылка «в расчёт» в карточках услуг

### Type C — `.btn` дефолт (ink → ink + лайм-обводка/текст)
- **Default**: `background: var(--ink)`, `color: var(--bg)`, `border: 1px solid transparent`
- **Hover**:  `background: var(--ink)`, `color: var(--accent)`, `border-color: var(--accent)`
- **Применение**: «Полный расчёт» в мини-калькуляторе hero; «Отправить заявку» в форме; «Рассчитать»/«Оставить заявку» по умолчанию

### Type C variant — `.btn.ghost` на ТЁМНОМ фоне (svc-included, calc-card, success-state)
- **Default**: `background: transparent`, `color: var(--bg)`, `border: 1px solid rgba(246,243,236,.22)`
- **Hover**:  `background: transparent`, `color: var(--accent)`, `border-color: var(--accent)`
- Это вариация Type C — фон не меняется, только подсвечиваются обводка и текст лаймом.

### Anatomy & общие правила для всех типов
- `padding: 12px 18px`; `border-radius: var(--r-chip)` (999px — pill)
- `font-weight: 500`, `font-size: 14px`, `gap: 10px`
- В hover-состоянии стрелка `.arrow` сдвигается: `transform: translateX(4px)` (`transition: transform .35s cubic-bezier(.65,0,.35,1)`)
- `transition: background .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease`
- **Никаких** дополнительных box-shadow свечений, slide-in `::before` оверлеев, padding-сдвигов — это устаревшее поведение, его нужно удалить.

### Особенные «пилюли» (не `.btn`, но визуально кнопки) — приводить к Type A
- `.h-status .now-cta` в hero (надпись «оставить заявку» в чёрном тайле) — Type A: `padding: 10px 16px 10px 18px`, `font-family: var(--mono)`, `font-size: 10.5px`, `font-weight: 600`, `letter-spacing: .14em`, `text-transform: uppercase`
- `.svc-feature .pl-cta` («скачать прайс-лист» в карточке прайса) — Type A: `padding: 14px 20px 14px 22px`, `font-family: var(--mono)`, `font-size: 11px`, `font-weight: 600`, `letter-spacing: .14em`, `text-transform: uppercase`. Внутри есть `.pl-ext` (бейдж «PDF») — на hover `background: rgba(20,19,18,.08)`, `color: var(--ink)`.

---

## Правка 2 — Hero CTA «оставить заявку»
В hero-плитке `.h-status` (тёмный тайл с «сейчас в работе») нижняя надпись «оставить заявку» **переделана из текстовой ссылки в полноценную кнопку Type A** — залитая лаймовая пилюля с чёрным текстом. См. anatomy в Правке 1 → «Особенные пилюли».

Markup (для справки):
```html
<a class="now-cta" href="#contact">
  оставить заявку <span class="arrow">→</span>
</a>
```

---

## Правка 3 — Карточка 01 в Services: «Полный прайс на чистку и обслуживание»
**Что было:** карточка `.svc-feature` показывала только одну услугу «Чистка от жира» с ценой 300₽/пог.м и CTA «Рассчитать».

**Что стало:** карточка-прайс-лист всех услуг с превью первых 4 строк + ссылкой на PDF.

### Анатомия `.svc-feature.is-pricelist`
- Фон: `var(--brand)` (#1e5c32) с лёгким lime-gradient оверлеем сверху: `linear-gradient(180deg, rgba(200,255,62,.04), transparent 30%)`
- `padding: 26px 28px`, `border-radius: var(--r-tile-lg)`, `min-height: 380px`
- Слева сверху: meta `00 / прайс · все услуги одним документом` + справа `обновлено 05.2026` с лаймовой точкой-индикатором
- Заголовок (font-display, weight 300, clamp(32px, 3.8vw, 52px), max-width 14ch): «Полный прайс _на чистку_<br/>и обслуживание.» — `_em_` подсвечен лаймом
- Параграф-описание (15px, 78% opacity, max-width 46ch)
- **Таблица превью услуг** `.pl-rows` (grid):
  - Хедер: верхняя граница `1px solid rgba(246,243,236,.12)`
  - Каждая строка `.pl-row`: `grid-template-columns: 24px 1fr auto`, `padding: 11px 0`, dashed bottom border `rgba(246,243,236,.12)`
  - Колонки: индекс (mono, 10.5px, 42% opacity) · название услуги (display, 18px, cream) + подпись `<small>` (sans, 12px, 55% opacity) · цена (mono, 13px, цифра-`<b>` в display 18px с лаймовым цветом)
  - 4 строки: `01 Чистка от жира · от 300₽/пог.м`, `02 Чистка от пыли · от 100₽/пог.м`, `03 Зонты и вытяжки · от 1 000₽/шт`, `04 Дезинфекция · от 40₽/м²`
  - 5-я строка `.pl-row.pl-more` (mono, 11px, caps, 50% opacity, без bottom-border): `+10  монтаж, ремонт, паспорт ВТЗ, аварийный выезд…  в PDF`
- **Подвал** `.pl-foot`: слева — иконка PDF (`.pl-doc-meta`: «Прайс_Vent_05·2026», «6 страниц · 412 КБ»), справа — CTA `.pl-cta` (Type A, см. выше) с текстом «скачать прайс-лист», badge `PDF`, иконкой стрелки-download
- Иконка `.pl-ico`: 44×56px, `border-radius: 6px`, `border: 1px solid rgba(246,243,236,.18)`, с псевдо-уголком сверху-справа (загиб листа)
- CTA ведёт на `files/vent-pricelist-2026.pdf` с атрибутом `download`

---

## Правка 4 — Порядок секций
В исходной вёрстке порядок был: `Hero → Services → Cases → Venues → Process → Trust → Calculator → Contact`.

**Новый порядок:** `Hero → Services → **Calculator** → Cases → Venues → Process → Trust → Contact`.

То есть **секция `#calculator` переносится** из конца лендинга (перед `#contact`) и вставляется **сразу после `#services`**, перед `#cases`. Это весь блок `<section id="calculator" class="calc-wrap">…</section>`.

---

## Правка 5 — Success-state контактной формы (НОВОЕ)

### Проблема, которую решаем
В проде после отправки формы пользователю показывался ломаный схлопнутый блок «Заявка принята» — без стилей, в узкой колонке. Нужен полноценный success-state, который занимает место формы и держит вижуальный язык сайта.

### Поведение
1. Пользователь заполняет форму «Заявка на выезд» и нажимает submit.
2. Форма (`.ct-form`) **полностью скрывается**, на её место (та же ячейка bento — `grid-column: span 7; grid-row: span 3`) появляется success-карточка (`.ct-success`) с slide-up анимацией (`translateY(14px) → 0`, opacity 0 → 1, длительность 0.55s, easing `cubic-bezier(.2,.7,.2,1)`).
3. **Важно:** оба блока должны корректно реагировать на `hidden` — добавить в CSS `.ct-success[hidden]{ display: none !important; } .ct-form[hidden]{ display: none !important; }`. Без этого `display: flex` перебивает HTML-атрибут `hidden` и видны оба блока одновременно.
4. На success-карточке есть кнопка «Отправить ещё одну» (Type C ghost на тёмном фоне) — она сбрасывает форму через `form.reset()`, регенерит ticket-номер и возвращает форму обратно (всё это без перезагрузки страницы).

### Анатомия `.ct-success`
- **Размеры/сетка:** `grid-column: span 7; grid-row: span 3` (как у `.ct-form`); `min-height: 460px`; `padding: 32px 34px`; `border-radius: var(--r-tile-lg)`
- **Фон:** `var(--brand)` (тёмно-зелёный) + ::after декоративный radial-gradient в правом нижнем углу: `radial-gradient(closest-side, rgba(200,255,62,.16), transparent 70%)`, размер 60% ширины, aspect-ratio 1, позиция `inset: auto -25% -55% auto`
- **Текст:** `color: var(--bg)`
- **Структура:** flex column, `justify-content: space-between`, `gap: 24px`

#### 1) Верхняя meta-строка
- `display: inline-flex; align-items: center; gap: 10px`
- Шрифт `var(--mono)`, `font-size: 10.5px`, `letter-spacing: .14em`, `text-transform: uppercase`, `color: rgba(246,243,236,.65)`
- Содержимое: дэш-палочка (`width: 22px; height: 1px; background: rgba(246,243,236,.4)`) + текст «заявка №`<номер>` · принята»

#### 2) Шапка `.body-head`
- Flex row, `gap: 18px`, `align-items: center`, `flex-wrap: wrap`
- **Иконка-чекмарк** `.badge-check`:
  - 56×56 круг, `background: var(--accent)`, `color: var(--ink)`, `box-shadow: 0 0 0 8px rgba(200,255,62,.12)`
  - Внутри SVG-галочка 26×26, `stroke-width: 2.4`, `stroke-linecap: round`
  - Анимация появления `ct-check-pop`: `scale(.4) opacity(0) → scale(1.12) → scale(1)`, длительность 0.6s, easing `cubic-bezier(.2,.8,.2,1)`, задержка 0.15s
- **Заголовок h3:** `font-family: var(--display)`, `font-weight: 300`, `font-size: clamp(38px, 4.4vw, 56px)`, `line-height: 1`, `letter-spacing: -.022em`. Текст «Заявка _принята._», `<em>` лаймом, не italic стилем — просто цветом.

#### 3) Параграф-описание
- `color: rgba(246,243,236,.78)`, `font-size: 15px`, `line-height: 1.55`, `max-width: 48ch`
- Текст: «В рабочее время свяжемся за **30 минут**. После — на следующее утро. Если срочно — позвоните `<a>+7 (495) 120-04-04</a>`.»
- В тексте: «30 минут» — `color: var(--bg); font-weight: 500`; ссылка на телефон — `color: var(--accent); border-bottom: 1px solid rgba(200,255,62,.4)`

#### 4) Список «что дальше» `.next-list`
- Grid, `border-top: 1px solid rgba(246,243,236,.14)`
- Каждая строка `.next-row`: `grid-template-columns: 36px 1fr auto`, `gap: 14px`, `padding: 14px 0`, dashed bottom border `rgba(246,243,236,.14)`
- Колонки:
  - `.n` (mono, 10.5px, letter-spacing .14em, 42% opacity) — индекс «01», «02», «03»
  - `.label` (display, 400, 17px, cream) + внутри `<small>` (sans, 12.5px, 60% opacity, margin-top 3px) — название шага + описание
  - `.when` (mono, 10.5px, caps, lime) — время «~ 30 мин», «в течение дня», «1–3 дня»
- **3 шага:**
  - `01 Звонок инженера — уточним адрес, объект и удобное окно для выезда — ~ 30 мин`
  - `02 Видеоосмотр и КП — фиксируем состояние воздуховодов, считаем точную цену — в течение дня`
  - `03 Договор и выезд — бригада на объекте в согласованную дату, оплата по факту — 1–3 дня`

#### 5) Подвал `.foot`
- Flex row, `justify-content: space-between`, `align-items: end`, `gap: 18px`, `flex-wrap: wrap`
- **Слева** `.ref` — номер заявки:
  - meta-надпись (mono, 10.5px, caps, 55% opacity): «номер заявки»
  - Большой номер (mono, 13px, letter-spacing .08em, `font-variant-numeric: tabular-nums`, `font-weight: 500`, cream): «VNT-MMDD-XXXX»
- **Справа** `.ctas` — две кнопки:
  - **«Позвонить сейчас»** — Type A (lime → cream), `<a href="tel:+74951200404">`, со SVG-иконкой телефона
  - **«Отправить ещё одну»** — Type C ghost на тёмном фоне (прозрачный → лайм-обводка + лайм-текст), `<button type="button" onclick="resetContactForm()">`

#### 6) Responsive (≤ 920px)
- `grid-column: span 12`, `padding: 26px 22px`
- `.next-row`: `grid-template-columns: 28px 1fr`, `.when` падает в `grid-column: 2 / 3` под лейблом

---

## Правка 6 — Номер заявки в первой колонке Excel (НОВОЕ)

Номер заявки `VNT-MMDD-XXXX` (где MMDD — текущий день, XXXX — рандомные 4 цифры) должен **передаваться на бэкенд первым полем формы**, чтобы в Excel/Google Sheets/CRM он попадал в первую колонку.

### Реализация
1. В разметке формы **первым** элементом (до всех видимых полей) стоит:
   ```html
   <input type="hidden" name="ticket" id="ct-ticket" value="" />
   ```
2. Номер **генерится на загрузке страницы** (а не на submit), чтобы он точно был в FormData при отправке. Функция:
   ```js
   function generateTicket(){
     const now = new Date();
     const dd = String(now.getDate()).padStart(2, '0');
     const mm = String(now.getMonth() + 1).padStart(2, '0');
     const rand = Math.floor(1000 + Math.random() * 9000);
     return `VNT-${mm}${dd}-${rand}`;
   }
   ```
3. **Тот же номер** показывается пользователю в success-блоке (поля `#ct-ref-inline` и `#ct-ref-big`).
4. После нажатия «Отправить ещё одну» — генерится **новый** номер для следующей заявки.

### Что должен сделать бэкенд
Поле `ticket` приходит первым в `FormData`. Бэкенд (или интеграция с Google Sheets / Excel / 1С) должен **записывать его в первую колонку** строки заявки. Если сейчас бэкенд складывает поля в порядке их получения — порядок уже правильный, ничего менять не надо. Если бэкенд маппит поля по именам — добавить колонку `ticket` первой.

### Где сейчас формируется submission в прототипе
В обработчике `handleContactSubmit` стоит `event.preventDefault()` и нет реальной отправки — потому что это дизайн-референс. **В production-коде:** заменить заглушку на реальный submission (fetch/XHR/SDK Google Sheets — что у вас сейчас работает), и сразу после успешного ответа сервера — показывать `.ct-success`. Пример:
```js
async function handleContactSubmit(event){
  event.preventDefault();
  const form = event.currentTarget;
  const fd = new FormData(form);                 // ticket уже внутри, первым полем
  try {
    await fetch('/api/lead', { method: 'POST', body: fd });
    showSuccessState(form, fd.get('ticket'));
  } catch (err) {
    // show error toast / inline error
  }
}
```

---

---

## Правка 7 — Плитка сроков в hero `.h-stat-2` (НОВОЕ)

### Проблема
Раньше лаймовая статистическая плитка в hero показывала «4–6 дн · средний срок под ключ». Это вводило в заблуждение — некоторые заявки делаются за 3 часа (срочный выезд), некоторые требуют 3–4 дней (полный цикл под ключ). Один усреднённый срок терял эту нюанс.

### Что сделано
Плитка теперь обыгрывает **диапазон** значений вместо одного числа.

### Анатомия
- **Размеры/положение:** без изменений — `grid-column: span 2`, `min-height: 96px`, lime фон (`var(--accent)`), тот же `border-radius: var(--r-tile-lg)`
- **Большое число `.num`:**
  - `display: inline-flex; align-items: baseline; gap: 6px; white-space: nowrap`
  - `font-family: var(--display); font-weight: 300; line-height: .95`
  - `font-size: clamp(34px, 3.4vw, 44px)` (уменьшено с 56px — строка длиннее)
  - `letter-spacing: -0.03em`, `color: var(--ink)`
- **Единицы измерения `<small>` внутри числа:**
  - `font-size: 0.55em` (относительно родителя)
  - `letter-spacing: 0`, `font-weight: 300`
- **Стрелка `.sep`:**
  - `font-family: var(--display); font-size: 0.75em; font-weight: 300; letter-spacing: 0`
  - `color: var(--ink)` (та же чернота, что у чисел — равноправный элемент композиции)
  - `align-self: center; padding: 0 4px`
- **Подпись `.lab`:** `font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: rgba(20,19,18,.65)`

### Markup
```html
<div class="h-stat-2">
  <div class="num">3<small>ч</small><span class="sep">→</span>4<small>дн</small></div>
  <div class="lab">от срочного выезда до под&nbsp;ключ</div>
</div>
```

### Контент
- **Число:** `3ч → 4дн` (срочный выезд — нижняя граница; под ключ — верхняя)
- **Подпись:** «от срочного выезда до под ключ» либо «в зависимости от объекта и услуг» (формулировку согласовать с заказчиком)

---

## Файлы в пакете
- `Vent - Bento Modern.html` — итоговый HTML-референс со всеми правками (откройте в браузере, чтобы свериться с поведением hover, layout-ом и success-state)
- `PROMPT_FOR_CLAUDE_CODE.md` — готовый промпт, который можно скопировать в Claude Code

## Что НЕ делаем
- Не копируем сам HTML 1:1 — используем компонентную модель текущего проекта
- Не плодим новые кнопочные классы под каждый случай — все CTA должны попадать в один из 3 типов (A/B/C)
- Не возвращаем устаревшие эффекты: slide-in оверлеи через `::before scaleX`, padding-shift на hover, разноцветные shadow-glow — это всё было удалено намеренно
- Не оставляем форму и success-блок видимыми одновременно — обязательно правило `[hidden]{ display: none !important; }` для обоих
