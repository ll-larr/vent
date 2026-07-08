# Перенос кастомного курсора в `cleanvent-nextjs`

Курсор из `Vent - Apple Style.html` маленькая точка + кольцо с лагом, режим `mix-blend-mode difference` (автоматически инвертируется над тёмным и светлым), реагирует на `hover` и на magnetic-кнопки.

## Что копировать

 Из `cursor-port`             Куда в проект                                                 
---------------------------------------------------------------------------------------------
 `CustomCursor.tsx`            `srccomponentsCustomCursorCustomCursor.tsx`                
 `useMagnet.ts`                `srclibuseMagnet.ts`                                        
 `cursor.css` (содержимое)     в конец `srcappglobals.css` (можно в свой `@layer utilities`)

## Шаги

### 1. Подключить компонент в `srcapplayout.tsx`

```tsx
import CustomCursor from '@componentsCustomCursorCustomCursor';

export default function RootLayout({ children } { children React.ReactNode }) {
  return (
    html lang=ru className={`${fraunces.variable} ${interTight.variable} ${jetMono.variable}`}
      body className=font-sans bg-bg text-ink antialiased
        CustomCursor 
        {children}
        script type=applicationld+json dangerouslySetInnerHTML={jsonLdScript(localBusinessSchema())} 
      body
    html
  );
}
```

Компонент сам решает рендериться ли (проверяет `hover hover` и `prefers-reduced-motion`). На мобайле и при reduced-motion возвращает невидимые div'ы и не вешает слушатели.

### 2. Добавить CSS

Скопируй содержимое `cursor.css` в конец `srcappglobals.css`. CSS-переменная `--color-accent` уже есть в `@theme` — кольцо подхватит её автоматически.

### 3. (Опционально) Сделать кнопки магнитными

Подойдёт для главного CTA, кнопок в hero и итоговой формы. Пример с существующим стилем `.btn.lime`

```tsx
'use client';

import { useMagnet } from '@libuseMagnet';

export function HeroCta() {
  const ref = useMagnetHTMLAnchorElement({ strength 0.22 });

  return (
    a
      ref={ref}
      href=#contact
      data-magnet
      className=btn lime relative overflow-hidden isolate inline-flex items-center gap-2 px-6 py-4 rounded-full bg-ink text-bg font-mono text-[11px] uppercase tracking-[.18em] transition-transform
    
      span className=fill absolute inset-0 bg-accent scale-0 rounded-[inherit]
            style={{ transformOrigin 'var(--mx, 50%) var(--my, 50%)' }} 
      span className=label relative z-[2]Оставить заявкуspan
      span className=arrow relative z-[2]→span
    a
  );
}
```

Для совсем огромных кнопок (как final CTA) — `strength 0.35`. Для тонких ссылок в навигации — `0.12–0.15`.

`data-magnet` на элементе нужен, чтобы кольцо курсора расширилось в `.is-hover`. Магнетизм при этом включается отдельно через сам hook.

### 4. Проверка

- Открой `localhost3000`, наведи мышь — должен появиться курсор-точка + кольцо.
- Наведи на ссылку — кольцо растёт до 56px и красится в лайм.
- Наведи на magnetic-кнопку — кнопка тянется к курсору, кольцо растёт до 78px.
- Наведи на кнопку или инпут — нативный курсор WindowsmacOS (рука, текстовый I-beam, grab) НЕ должен проступать поверх кастомного. Если проступает — см. ниже про `!important`.
- Открой DevTools, включи toggle device toolbar (mobile) → курсор исчезает, нативный возвращается.
- В DevTools → Rendering → Emulate CSS prefers-reduced-motion → курсор тоже исчезает.

## Почему в CSS стоит `` + `!important` (важно)

Кастомный курсор скрывает нативный через `cursor none`. Но почти все интерактивные элементы в этом проекте ставят свой `cursor` — либо через Tailwind-утилиты (`cursor-pointer`, `cursor-text`, `cursor-grab`), либо в component-css (`button { cursor pointer }`, range thumb с `cursor grab` и т.д.).

Эти декларации по специфичности выигрывают у `html.has-custom-cursor body { cursor none }`. Результат — кастомный курсор есть, а поверх него вылезает нативная рука  I-beam  grab. Это та самая бага, которая всплыла в `Vent - Bento Modern.html` и была починена в обоих местах.

Поэтому в `cursor.css` стоит

```css
html.has-custom-cursor,
html.has-custom-cursor ,
html.has-custom-cursor before,
html.has-custom-cursor after {
  cursor none !important;
}
```

Селектор `` + `!important` — самый надёжный способ перекрыть всё, что добавит и Tailwind, и shadcn, и кастомные стили. Это безопасно потому что

1. Правило ограничено классом `.has-custom-cursor`, который ставит только компонент `CustomCursor.tsx` и только если устройство поддерживает hover и пользователь не включил reduced-motion.
2. На мобайле, на touch-планшетах и при `prefers-reduced-motion reduce` класс не появляется — все нативные `cursor pointer  text  grab` возвращаются к работе как раньше.
3. Никаких других побочек — мы не трогаем сам стиль элементов, только курсор поверх них.

НЕ убирай `!important` — без него регрессия с «нативный курсор поверх кастомного» вернётся. И НЕ ослабляй селектор до `html.has-custom-cursor body` и т.п. — конкретные `cursor` в Tailwind-утилитах добавляются позже в каскаде и перебьют такое правило.

## Замечания

- z-index 9999 — поверх вашего хедера (у которого z = 50). Если есть что-то выше — поднимите.
- mix-blend-mode difference делает курсор автоматически контрастным к любому фону.
  На цветных секциях (как hero `.bg-brand` или ink-плитки) он становится тёмным; на кремовом — почти белым.
- Если хедер `data-magnet`-кнопкой пересекается с курсором — `useMagnet` чистит свой `transform`
  на размонтировании, чтобы кнопка не зависала в смещённом состоянии.
- В Tailwind v4 цвета доступны через `var(--color-accent)`. CSS компонента использует
  именно эту переменную с фолбэком `#c8ff3e`, так что если ты переименуешь токен —
  поправь и в `cursor.css`.

## Один файл для копи-пасты

Если копировать по одному лень — вот в каком порядке оно компилируется
1. `CustomCursor.tsx` → `srccomponentsCustomCursorCustomCursor.tsx`
2. `useMagnet.ts` → `srclibuseMagnet.ts`
3. `cursor.css` блок → в конец `srcappglobals.css`
4. В `layout.tsx` добавить импорт + `CustomCursor ` первым ребёнком `body`

Всё.
