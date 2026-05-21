# Features Section Redesign — "Why Ascent"

**Date:** 2026-05-21  
**File:** `src/components/sections/Features.astro`  
**Status:** Approved for implementation

---

## Problem

The current Features section is visually weak: a uniform 2×2 grid of identical cards with abstract placeholder decorations at the bottom. No meaningful animations, no real UI previews, generic copy. Feels like a template, not a finished product page.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Layout | Bento Grid (asymmetric) | Creates visual hierarchy; highlights the most important value prop |
| Card content | Mini UI previews | Shows the real product, not decoration |
| Section theme | Light (consistent with rest of page) | Keeps visual flow; white background with shadow/border cards |
| Section title | New copy (see below) | Current title is generic; new one anchors on the key differentiator |

---

## Layout — Bento Grid

```
[ Card 1 — large (2 cols) ]  [ Card 2 — small (1 col) ]
[ Card 3 — small (1 col) ]   [ Card 4 — wide (2 cols)  ]
```

Grid: `grid-template-columns: repeat(3, 1fr)`, `gap: 16px`.

- **Card 1 (large):** `grid-column: span 2` — "No per-user fees"
- **Card 2 (small):** `grid-column: span 1` — "Full white-label"
- **Card 3 (small):** `grid-column: span 1` — "Live in days"
- **Card 4 (wide):** `grid-column: span 2` — "Enterprise quality"

Responsive: below 768px all cards collapse to `grid-column: span 3` (full width, stacked).

---

## Copy

### Section header

| Key | EN |
|---|---|
| `features.label` | `Why Ascent` (unchanged) |
| `features.title` | `Built for organizations. Not for per-seat billing.` |
| `features.subtitle` | `One platform. Unlimited learners. Your brand. No surprises on your invoice.` |

### Cards

| # | Title | Description |
|---|---|---|
| 1 | No per-user fees — ever | Flat monthly rate regardless of how many people train. Add 10 or 10,000 learners — your invoice stays the same. |
| 2 | Full white-label | Your brand, domain, colors. Learners see you — not us. Custom emails, custom login, fully branded. |
| 3 | Live in days | We handle the technical setup so you can focus on content. Import SCORM, upload videos, go live fast. |
| 4 | Enterprise quality | SSO (SAML, OAuth), advanced analytics, compliance reporting, and SCORM 2004. Built for teams that take training seriously. |

Same copy must be updated in `src/i18n/pl.ts` and `src/i18n/de.ts`.

---

## UI Previews (per card)

Each card has a `.feature-card__preview` block rendered below the description. These replace the current abstract colored bars.

### Card 1 — Billing UI
- Label: "Monthly cost" + amount `$100` in purple (large, bold)
- Badge: "✓ 10,000 learners" (green pill)
- Animated fill bar (purple gradient) — animates width 0→100% on scroll entry
- Row of 4 "learner" dots in purple tint + an `+∞` overflow dot

### Card 2 — Brand customization UI
- A mini nav bar with logo dot + brand color swatches
- 4 color swatches + 1 empty "add" swatch with dashed border
- Light gradient background (`#fdf4ff → #eff6ff`)

### Card 3 — Setup progress UI
- 4 step rows (step number circle + label bar)
- Steps 1 & 2: green (done), Step 3: purple (active), Step 4: gray (todo)
- Step circles animate sequentially on scroll entry (stagger 0.15s each)

### Card 4 — Analytics UI
- Stat line: "98%" completion + "↑ 12% vs last quarter" in green
- 5-bar chart where bars animate height from 0 on scroll entry

---

## Animations

All implemented via a new `<script>` block inside `Features.astro`. The existing `.reveal` class from `animations.ts` handles the base fade-in reveal. Card-specific animations (counter, fill bar, steps, chart bars) are standalone `IntersectionObserver` instances scoped to the component — `animations.ts` is not modified.

| Animation | Trigger | Details |
|---|---|---|
| Card reveal | Scroll into viewport | `fade-up` + `opacity 0→1`, stagger 0.1s per card (cards 1–4 in order) |
| Hover glow | `mouseenter` | `border-color` → card's accent color, `box-shadow` with accent color, `translateY(-3px)` |
| Billing bar fill | Card enters viewport | `width: 0 → 100%` over 600ms, `ease-out` |
| Learner counter | Card enters viewport | Count animates `0 → 10,000` over 1200ms using `requestAnimationFrame` |
| Setup steps | Card enters viewport | Each step circle fades in sequentially with 150ms stagger |
| Analytics bars | Card enters viewport | Each bar animates `height: 0 → target%` with 80ms stagger, ease-out |

All animations use the `IntersectionObserver` with `{ threshold: 0.3 }`. Animations fire once (`observer.unobserve` after trigger).

---

## Styles

Changes are scoped to `Features.astro <style>`. No global CSS changes needed.

Key additions to current styles:
- `.features__bento` replaces `.features__grid` — new grid definition
- `.feature-card.large` / `.feature-card.wide` — span overrides
- `.feature-card__preview` — remove current abstract-block styles, add card-specific preview styles
- `.feature-card:hover` — add `border-color` transition using CSS variable `--card-accent`
- Each card gets `style="--card-accent: #7C3AED"` (etc.) inline so hover glow adapts per card

---

## i18n

Changes required in all three locale files (`en.ts`, `pl.ts`, `de.ts`):
- `features.title` — new string
- `features.subtitle` — new string  
- `features.items[2].title` — "Live in days" (was "Live in days, not months")
- `features.items[2].desc` — shortened

No new translation keys needed. All keys remain the same shape.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/sections/Features.astro` | Full rewrite: bento layout, UI previews, per-card hover accent, animation JS |
| `src/i18n/en.ts` | Update `features.title`, `features.subtitle`, `items[2]` copy |
| `src/i18n/pl.ts` | Same keys updated in Polish |
| `src/i18n/de.ts` | Same keys updated in German |

No new files. No changes to `BaseLayout.astro`, `animations.ts`, or `global.css`.
