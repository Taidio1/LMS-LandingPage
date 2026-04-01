# German Language + Dropdown Switcher — Design Spec

**Date:** 2026-04-01  
**Status:** Approved

## Goal

Add German (DE) as a third language to the Ascent LMS landing page and replace the single-link language button with a CSS dropdown supporting EN / PL / DE.

## Scope

- New German translation file and `/de/` route
- Dropdown language switcher in Navbar (desktop + mobile drawer)
- Remove per-language `langSwitch`/`langSwitchHref` keys from translation files

## Changes

### `src/i18n/index.ts`

- Extend `Lang` type: `'en' | 'pl' | 'de'`
- Add `languageRoutes: Record<Lang, string>` → `{ en: '/', pl: '/pl/', de: '/de/' }`
- Add `languageLabels: Record<Lang, string>` → `{ en: 'EN', pl: 'PL', de: 'DE' }`

### `src/i18n/de.ts`

- Full German translation of all sections matching the `Translations` type from `en.ts`
- Export as `de: Translations`

### `src/pages/de/index.astro`

- Mirror of `src/pages/pl/index.astro` with `lang="de"` prop passed to all components

### `src/components/layout/Navbar.astro`

- Replace `.navbar__lang-btn` (single `<a>`) with a dropdown:
  - Button shows globe icon + current language label (e.g. "EN")
  - On click: opens a list of all languages with their routes
  - Current language marked with a checkmark (✓), others are plain links
  - CSS-only open/close via a toggle class on click (no external JS library)
  - Mobile drawer: same dropdown or inline stacked links for DE/PL/EN
- Navbar imports `languageRoutes` and `languageLabels` from `i18n/index.ts`
- Translation lookup extended: `lang === 'de' ? de : lang === 'pl' ? pl : en`

### `src/i18n/en.ts` and `src/i18n/pl.ts`

- Remove `langSwitch` and `langSwitchHref` from the `nav` section
- Update `Translations` type accordingly

## Dropdown Behavior

- Clicking the button toggles a `dropdown--open` class
- Clicking outside closes the dropdown (document click listener)
- Current lang is not a link (or styled as disabled), others are `<a href="...">` tags
- ARIA: button has `aria-haspopup="listbox"`, `aria-expanded`, list has `role="listbox"`

## Out of Scope

- Language detection / auto-redirect based on browser locale
- Persisting language preference in localStorage
- Translating URL slugs (anchors remain in English)
