# Features Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic 2×2 card grid in `Features.astro` with an asymmetric bento layout featuring real LMS UI previews, per-card hover glow, and scroll-triggered animations.

**Architecture:** Single component rewrite (`Features.astro`) plus i18n copy updates. All animation logic is self-contained in the component's `<script>` block — the global `animations.ts` handles only the base `.reveal` fade-in. No new files are created.

**Tech Stack:** Astro 4, CSS custom properties, `IntersectionObserver`, `requestAnimationFrame`, `color-mix()` (CSS Level 5 — supported Chrome 111+, Firefox 113+, Safari 16.2+)

---

## File Map

| File | Change |
|---|---|
| `src/i18n/en.ts` | Add `features.titleLine2`, update `features.title`, `features.subtitle`, `items[2]` |
| `src/i18n/pl.ts` | Same keys in Polish |
| `src/i18n/de.ts` | Same keys in German |
| `src/components/sections/Features.astro` | Full rewrite: bento layout, UI previews, hover accent CSS var, animation `<script>` |

---

## Task 1: Update i18n — all three locale files

**Files:**
- Modify: `src/i18n/en.ts`
- Modify: `src/i18n/pl.ts`
- Modify: `src/i18n/de.ts`

Adding `titleLine2` to the `features` object means it becomes part of the `Translations` type automatically (the type is inferred from the `en` object). All three files must be updated together or TypeScript will error.

- [ ] **Step 1: Update `src/i18n/en.ts` — replace the `features` block**

Find the current `features:` block and replace it with:

```ts
  features: {
    label: 'Why Ascent',
    title: 'Built for organizations.',
    titleLine2: 'Not for per-seat billing.',
    subtitle: 'One platform. Unlimited learners. Your brand. No surprises on your invoice.',
    items: [
      {
        title: 'No per-user fees — ever',
        desc: 'Flat monthly rate regardless of how many people train. Add 10 or 10,000 learners — your invoice stays the same.',
      },
      {
        title: 'Full white-label',
        desc: 'Your brand, domain, colors. Learners see you — not us. Custom emails, custom login, fully branded.',
      },
      {
        title: 'Live in days',
        desc: 'We handle the technical setup so you can focus on content. Import SCORM, upload videos, go live fast.',
      },
      {
        title: 'Enterprise quality',
        desc: 'SSO (SAML, OAuth), advanced analytics, compliance reporting, and SCORM 2004. Built for teams that take training seriously.',
      },
    ],
  },
```

- [ ] **Step 2: Update `src/i18n/pl.ts` — replace the `features` block**

```ts
  features: {
    label: 'Dlaczego Ascent',
    title: 'Platforma dla organizacji.',
    titleLine2: 'Bez opłat za użytkownika.',
    subtitle: 'Jedna platforma. Nieograniczeni kursanci. Twoja marka. Zero niespodzianek na fakturze.',
    items: [
      {
        title: 'Bez opłat za użytkownika — zawsze',
        desc: 'Stała miesięczna opłata niezależnie od liczby szkolonych. Dodaj 10 lub 10 000 kursantów — faktura pozostaje taka sama.',
      },
      {
        title: 'Pełny white-label',
        desc: 'Twoja marka, domena, kolory. Kursanci widzą Ciebie — nie nas. Własne e-maile, własne logowanie, pełna personalizacja.',
      },
      {
        title: 'Uruchom w dni',
        desc: 'Zajmujemy się konfiguracją techniczną, abyś mógł skupić się na treści. Importuj SCORM, przesyłaj filmy, startuj szybko.',
      },
      {
        title: 'Jakość enterprise',
        desc: 'SSO (SAML, OAuth), zaawansowana analityka, raportowanie zgodności i SCORM 2004. Zbudowane dla organizacji traktujących szkolenia poważnie.',
      },
    ],
  },
```

- [ ] **Step 3: Update `src/i18n/de.ts` — replace the `features` block**

```ts
  features: {
    label: 'Warum Ascent',
    title: 'Eine Plattform für Organisationen.',
    titleLine2: 'Keine Kosten pro Nutzer.',
    subtitle: 'Eine Plattform. Unbegrenzte Lernende. Ihre Marke. Keine Überraschungen auf der Rechnung.',
    items: [
      {
        title: 'Keine Gebühren pro Nutzer — niemals',
        desc: 'Monatliche Pauschalgebühr, egal wie viele Personen Sie schulen. Fügen Sie 10 oder 10.000 Lernende hinzu — Ihre Rechnung bleibt gleich.',
      },
      {
        title: 'Vollständiges White-Label',
        desc: 'Ihre Marke, Domain, Farben. Lernende sehen Sie — nicht uns. Eigene E-Mails, eigene Anmeldung, vollständiges Branding.',
      },
      {
        title: 'Live in Tagen',
        desc: 'Wir kümmern uns um die technische Einrichtung, damit Sie sich auf Inhalte konzentrieren können. SCORM importieren, Videos hochladen, schnell live gehen.',
      },
      {
        title: 'Enterprise-Qualität',
        desc: 'SSO (SAML, OAuth), erweiterte Analysen, Compliance-Reporting und SCORM 2004. Für Organisationen, die Schulungen ernst nehmen.',
      },
    ],
  },
```

- [ ] **Step 4: Verify TypeScript types compile**

```bash
cd Landing_Page && npx astro check
```

Expected: 0 errors. If `titleLine2` is missing from any locale file, TypeScript will report "Property 'titleLine2' is missing in type ...".

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en.ts src/i18n/pl.ts src/i18n/de.ts
git commit -m "feat: update features section i18n copy + add titleLine2 key"
```

---

## Task 2: Rewrite `Features.astro` — full component

**Files:**
- Modify: `src/components/sections/Features.astro` (complete replacement)

The component has three parts: frontmatter (data), template (HTML), `<style>`, `<script>`. Write them in order.

- [ ] **Step 1: Replace the entire file content**

```astro
---
import type { Lang } from '../../i18n/index';
import { en } from '../../i18n/en';
import { pl } from '../../i18n/pl';
import { de } from '../../i18n/de';

interface Props { lang?: Lang; }
const { lang = 'en' } = Astro.props;
const t = (lang === 'de' ? de : lang === 'pl' ? pl : en).features;

const cards = [
  {
    accent: '#7C3AED',
    gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
    size: 'large',
    preview: 'billing',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/><path d="M9 12h6M12 9v6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    accent: '#059669',
    gradient: 'linear-gradient(135deg,#059669,#10B981)',
    size: '',
    preview: 'brand',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="white" stroke-width="2"/></svg>`,
  },
  {
    accent: '#D97706',
    gradient: 'linear-gradient(135deg,#D97706,#F59E0B)',
    size: '',
    preview: 'setup',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    accent: '#0891B2',
    gradient: 'linear-gradient(135deg,#0891B2,#06B6D4)',
    size: 'wide',
    preview: 'analytics',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
] as const;

const setupSteps = [
  { state: 'done',   width: '55%' },
  { state: 'done',   width: '70%' },
  { state: 'active', width: '40%' },
  { state: 'todo',   width: '60%' },
] as const;

const barHeights = [60, 75, 50, 85, 98];
---

<section class="features" id="features">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">{t.label}</span>
      <h2 class="section-title">
        {t.title}<br />
        <span class="gradient-text">{t.titleLine2}</span>
      </h2>
      <p class="section-subtitle">{t.subtitle}</p>
    </div>

    <div class="features__bento">
      {cards.map((card, i) => (
        <div
          class={`feature-card reveal reveal-d${(i % 2) + 1}${card.size ? ' ' + card.size : ''}`}
          style={`--card-accent:${card.accent};`}
        >
          <div class="card-body">
            <div class="feature-card__icon" style={`background:${card.gradient};`} set:html={card.icon} />
            <h3 class="feature-card__title">{t.items[i].title}</h3>
            <p class="feature-card__desc">{t.items[i].desc}</p>
          </div>

          {card.preview === 'billing' && (
            <div class="feature-card__preview preview-billing">
              <div class="pb-header">
                <div>
                  <div class="pb-label">Monthly cost</div>
                  <div class="pb-amount">$100</div>
                </div>
                <span class="pb-badge">
                  ✓ <span class="learner-counter" data-target="10000">10,000</span> learners
                </span>
              </div>
              <div class="pb-bar"><div class="pb-bar-fill"></div></div>
              <div class="pb-label">Active learners this month</div>
              <div class="pb-users">
                <div class="pb-user"><span class="pb-dot"></span></div>
                <div class="pb-user"><span class="pb-dot"></span></div>
                <div class="pb-user"><span class="pb-dot"></span></div>
                <div class="pb-user pb-user-overflow">+∞</div>
              </div>
            </div>
          )}

          {card.preview === 'brand' && (
            <div class="feature-card__preview preview-brand">
              <div class="brand-bar">
                <span class="brand-logo-dot"></span>
                <span class="brand-logo-text"></span>
              </div>
              <div class="brand-colors">
                {['#7C3AED','#059669','#F59E0B','#0891B2'].map(c => (
                  <span class="brand-swatch" style={`background:${c};`}></span>
                ))}
                <span class="brand-swatch brand-swatch-add"></span>
              </div>
            </div>
          )}

          {card.preview === 'setup' && (
            <div class="feature-card__preview preview-setup">
              {setupSteps.map((step, si) => (
                <div class="setup-step" data-step-index={si}>
                  <div class={`step-num step-${step.state}`}>
                    {step.state === 'done' ? '✓' : si + 1}
                  </div>
                  <div class={`step-label step-label-${step.state}`} style={`width:${step.width};`}></div>
                </div>
              ))}
            </div>
          )}

          {card.preview === 'analytics' && (
            <div class="feature-card__preview preview-analytics">
              <div class="analytics-header">
                <div>
                  <div class="analytics-stat-num">98%</div>
                  <div class="analytics-stat-label">Completion rate</div>
                </div>
                <div class="analytics-right">
                  <div class="analytics-delta">↑ 12%</div>
                  <div class="analytics-stat-label">vs last quarter</div>
                </div>
              </div>
              <div class="analytics-bars">
                {barHeights.map((h) => (
                  <div class="analytics-bar" data-height={h}></div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  function animateOnEntry(el: Element, callback: () => void, threshold = 0.3): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
  }

  // Billing card: fill bar + learner counter
  const billingPreview = document.querySelector<HTMLElement>('.preview-billing');
  if (billingPreview) {
    const barFill = billingPreview.querySelector<HTMLElement>('.pb-bar-fill');
    const counter = billingPreview.querySelector<HTMLElement>('.learner-counter');

    animateOnEntry(billingPreview, () => {
      if (barFill) {
        barFill.style.transition = 'width 0.6s ease-out';
        requestAnimationFrame(() => { barFill.style.width = '100%'; });
      }
      if (counter) {
        const target = parseInt(counter.dataset.target ?? '0', 10);
        const duration = 1200;
        const start = performance.now();
        function tick(now: number): void {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          counter!.textContent = Math.round(eased * target).toLocaleString();
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }

  // Setup card: sequential step reveal
  const setupPreview = document.querySelector<HTMLElement>('.preview-setup');
  if (setupPreview) {
    const steps = Array.from(setupPreview.querySelectorAll<HTMLElement>('.setup-step'));
    steps.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateX(-8px)';
    });

    animateOnEntry(setupPreview, () => {
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          step.style.opacity = '1';
          step.style.transform = 'none';
        }, i * 150);
      });
    });
  }

  // Analytics card: bar chart grow
  const analyticsPreview = document.querySelector<HTMLElement>('.preview-analytics');
  if (analyticsPreview) {
    const bars = Array.from(analyticsPreview.querySelectorAll<HTMLElement>('.analytics-bar'));
    bars.forEach(b => { b.style.height = '0'; });

    animateOnEntry(analyticsPreview, () => {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          const h = bar.dataset.height ?? '60';
          bar.style.transition = 'height 0.4s ease-out';
          bar.style.height = `${h}%`;
        }, i * 80);
      });
    });
  }
</script>

<style>
  .features { background: var(--bg-primary); }

  /* Header */
  .section-title {
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.15;
  }

  /* Bento grid */
  .features__bento {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .feature-card.large { grid-column: span 2; }
  .feature-card.wide  { grid-column: span 2; }

  /* Card base */
  .feature-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .feature-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--card-accent) 18%, transparent);
    border-color: color-mix(in srgb, var(--card-accent) 38%, transparent);
  }
  .card-body {
    padding: 28px 28px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .feature-card__icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .feature-card__title {
    font-size: 18px; font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em; line-height: 1.3;
  }
  .feature-card__desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  /* Billing preview */
  .preview-billing {
    padding: 16px 28px 20px;
    background: #fafafa;
    border-top: 1px solid var(--border-subtle);
    display: flex; flex-direction: column; gap: 10px;
  }
  .pb-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .pb-label {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: #9ca3af; margin-bottom: 2px;
  }
  .pb-amount { font-size: 28px; font-weight: 800; color: var(--card-accent); line-height: 1; }
  .pb-badge {
    font-size: 11px; font-weight: 600;
    background: #dcfce7; color: #16a34a;
    padding: 4px 10px; border-radius: 99px;
    white-space: nowrap;
  }
  .pb-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
  .pb-bar-fill {
    height: 100%; width: 0;
    background: linear-gradient(90deg, #7C3AED, #4F46E5);
    border-radius: 3px;
  }
  .pb-users { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .pb-user {
    height: 26px;
    background: color-mix(in srgb, var(--card-accent) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--card-accent) 22%, transparent);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
  }
  .pb-dot { width: 8px; height: 8px; background: var(--card-accent); border-radius: 50%; }
  .pb-user-overflow {
    font-size: 11px; font-weight: 700; color: #9ca3af;
    background: #f3f4f6; border-color: #e5e7eb;
  }

  /* Brand preview */
  .preview-brand {
    padding: 14px 28px 20px;
    background: linear-gradient(135deg, #fdf4ff, #eff6ff);
    border-top: 1px solid var(--border-subtle);
    display: flex; flex-direction: column; gap: 10px;
  }
  .brand-bar {
    height: 30px;
    background: linear-gradient(135deg, #7C3AED, #4F46E5);
    border-radius: 7px;
    display: flex; align-items: center;
    padding: 0 10px; gap: 8px;
  }
  .brand-logo-dot {
    width: 14px; height: 14px;
    background: #fff; border-radius: 4px;
    opacity: 0.9; flex-shrink: 0;
  }
  .brand-logo-text { height: 6px; background: #ffffff70; border-radius: 3px; width: 44px; }
  .brand-colors { display: flex; gap: 6px; }
  .brand-swatch { width: 22px; height: 22px; border-radius: 6px; display: inline-block; }
  .brand-swatch-add { background: transparent; border: 1.5px dashed #d1d5db; }

  /* Setup preview */
  .preview-setup {
    padding: 14px 28px 20px;
    background: #fafafa;
    border-top: 1px solid var(--border-subtle);
    display: flex; flex-direction: column; gap: 8px;
  }
  .setup-step { display: flex; align-items: center; gap: 10px; }
  .step-num {
    width: 20px; height: 20px; border-radius: 50%;
    font-size: 9px; font-weight: 700; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .step-done   { background: #059669; color: #fff; }
  .step-active { background: #7C3AED; color: #fff; }
  .step-todo   { background: #e5e7eb; color: #9ca3af; }
  .step-label  { height: 7px; border-radius: 3px; }
  .step-label-done   { background: #059669; }
  .step-label-active { background: #7C3AED; }
  .step-label-todo   { background: #e5e7eb; }

  /* Analytics preview */
  .preview-analytics {
    padding: 14px 28px 20px;
    background: #fafafa;
    border-top: 1px solid var(--border-subtle);
    display: flex; flex-direction: column; gap: 10px;
  }
  .analytics-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .analytics-stat-num  { font-size: 22px; font-weight: 800; color: #0891B2; line-height: 1; }
  .analytics-stat-label { font-size: 10px; color: #9ca3af; margin-top: 2px; }
  .analytics-delta { font-size: 14px; font-weight: 700; color: #059669; }
  .analytics-right { text-align: right; }
  .analytics-bars {
    display: flex; align-items: flex-end;
    gap: 6px; height: 44px;
  }
  .analytics-bar {
    flex: 1; height: 0;
    border-radius: 3px 3px 0 0;
    background: color-mix(in srgb, #0891B2 55%, transparent);
    border: 1px solid color-mix(in srgb, #0891B2 75%, transparent);
  }
  .analytics-bar:last-child { background: #0891B2; border-color: #0891B2; }

  /* Responsive */
  @media (max-width: 768px) {
    .features__bento { grid-template-columns: 1fr; }
    .feature-card.large,
    .feature-card.wide { grid-column: span 1; }
  }
</style>
```

- [ ] **Step 2: Start dev server and verify visually**

```bash
cd Landing_Page && npm run dev
```

Open `http://localhost:4321` in a browser. Check:
- Bento grid renders: large card (2 col) top-left, small cards top-right and bottom-left, wide card (2 col) bottom-right
- Each card has its correct UI preview (billing/brand/setup/analytics)
- Hover on any card → `translateY(-3px)` + colored border glow matching that card's accent color
- Scroll down past the section → billing bar fills, counter counts to 10,000, setup steps reveal sequentially, analytics bars grow
- At 768px viewport width → all cards stack full-width

- [ ] **Step 3: Check all three language routes**

Open in browser:
- `http://localhost:4321/` — English: title "Built for organizations." + gradient "Not for per-seat billing."
- `http://localhost:4321/pl/` — Polish: "Platforma dla organizacji." + "Bez opłat za użytkownika."
- `http://localhost:4321/de/` — German: "Eine Plattform für Organisationen." + "Keine Kosten pro Nutzer."

All three should render the same layout. Only text differs.

- [ ] **Step 4: Run type check**

```bash
cd Landing_Page && npx astro check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Features.astro
git commit -m "feat: redesign Features section — bento grid, UI previews, animations"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Bento grid layout (2fr+1fr columns, large + wide cards) → Task 2 template
- ✅ Mini UI previews per card (billing, brand, setup, analytics) → Task 2 template
- ✅ Hover glow with per-card accent color via `--card-accent` → Task 2 `<style>`
- ✅ Scroll-reveal stagger → existing `.reveal.reveal-d1/d2` classes (handled by `animations.ts`)
- ✅ Billing bar fill animation → Task 2 `<script>` `billingPreview` block
- ✅ Learner counter `0 → 10,000` → Task 2 `<script>` `counter` block
- ✅ Setup steps sequential reveal → Task 2 `<script>` `setupPreview` block
- ✅ Analytics bar chart grow → Task 2 `<script>` `analyticsPreview` block
- ✅ New copy in EN/PL/DE → Task 1
- ✅ `titleLine2` gradient span → Task 2 template `<span class="gradient-text">`
- ✅ Responsive mobile (stacked) → Task 2 `<style>` `@media`
- ✅ `animations.ts` not modified → confirmed, no task touches it

**No placeholders found.**

**Type consistency:** `preview-billing`, `preview-brand`, `preview-setup`, `preview-analytics` class names are consistent between template and `<style>`. `pb-bar-fill`, `learner-counter`, `setup-step`, `analytics-bar` are consistent between template and `<script>`.
