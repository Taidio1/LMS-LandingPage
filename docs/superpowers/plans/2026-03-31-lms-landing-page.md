# LMS Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Astro landing page for an LMS platform — 10 sections, smooth scroll-reveal animations, sticky-scroll Features section, animated counters, pricing toggle, FAQ accordion, mobile-responsive with swipe carousel.

**Architecture:** Static Astro site. Each section is a self-contained `.astro` component with scoped `<style>`. CSS custom properties live in `src/styles/global.css` imported by `BaseLayout.astro`. All interactivity is vanilla JS in component `<script>` tags (bundled by Vite) plus a shared `src/scripts/animations.ts` for scroll-reveal and counters.

**Tech Stack:** Astro 4.x, Vanilla CSS + CSS custom properties, Vanilla JS, Google Fonts (Inter 400/500/600/700/800), zero external JS libraries.

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Astro project manifest |
| `astro.config.mjs` | Astro config (static output) |
| `public/favicon.svg` | Site favicon |
| `src/styles/global.css` | CSS variables, reset, `.container`, `.reveal` utilities |
| `src/scripts/animations.ts` | Scroll-reveal observer + animated counter logic |
| `src/layouts/BaseLayout.astro` | HTML shell, fonts, global CSS import, global script |
| `src/components/ui/Button.astro` | Button (primary / ghost / outline variants) |
| `src/components/ui/Badge.astro` | Pill badge |
| `src/components/layout/Navbar.astro` | Sticky navbar + mobile hamburger drawer |
| `src/components/layout/Footer.astro` | Dark footer, 4-column layout |
| `src/components/sections/Hero.astro` | 2-col hero, CSS-built dashboard mockup, floating badges |
| `src/components/sections/SocialProofBar.astro` | Logo strip + animated counters |
| `src/components/sections/Features.astro` | Sticky-scroll: 4 feature blocks + switching mockup |
| `src/components/sections/ForBusinessLearners.astro` | 2-card B2B / B2C section |
| `src/components/sections/Testimonials.astro` | 3-col grid + mobile swipe carousel |
| `src/components/sections/Pricing.astro` | 3 plans + monthly/yearly toggle |
| `src/components/sections/FAQ.astro` | Accordion |
| `src/components/sections/FinalCTA.astro` | Blue CTA with SVG dot-pattern |
| `src/pages/index.astro` | Page assembly |

---

## Task 1 — Project Initialization

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `public/favicon.svg`
- Create: `src/pages/index.astro` (minimal stub)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "lms-landing-page",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.15.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({});
```

- [ ] **Step 3: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#2563EB"/>
  <path d="M8 22L16 10l8 12H8z" fill="white"/>
</svg>
```

- [ ] **Step 4: Create `src/pages/index.astro` (minimal stub)**

```astro
---
---
<html lang="pl">
  <head><meta charset="UTF-8" /><title>LMS</title></head>
  <body><h1>LMS Landing Page</h1></body>
</html>
```

- [ ] **Step 5: Install dependencies and verify**

```bash
cd E:/LMS-LandingPage && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Run dev server**

```bash
npm run dev
```

Expected: `🚀 astro dev server running at http://localhost:4321/` — page shows "LMS Landing Page".

- [ ] **Step 7: Init git and commit**

```bash
git init
git add package.json astro.config.mjs public/favicon.svg src/pages/index.astro package-lock.json
git commit -m "feat: initialize Astro project"
```

---

## Task 2 — Global CSS + Animations Script + BaseLayout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/scripts/animations.ts`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* ── Variables ───────────────────────────────── */
:root {
  --bg-primary:         #FAFAFB;
  --bg-surface:         #FFFFFF;
  --bg-accent-light:    #EFF6FF;
  --brand-accent:       #2563EB;
  --brand-accent-hover: #1D4ED8;
  --text-primary:       #0F172A;
  --text-secondary:     #64748B;
  --border-subtle:      #E2E8F0;
  --shadow-soft:        0 10px 30px -5px rgba(15,23,42,0.04);
  --shadow-hover:       0 20px 40px -10px rgba(15,23,42,0.08);
  --transition:         all 0.3s cubic-bezier(0.4,0,0.2,1);
  --radius:             16px;
  --radius-btn:         8px;
  --max-w:              1200px;
}

/* ── Reset ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

/* ── Layout ──────────────────────────────────── */
.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 24px;
}

section { padding: 96px 0; }
@media (max-width: 768px) { section { padding: 64px 0; } }

/* ── Scroll Reveal ───────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1),
              transform 0.6s cubic-bezier(0.4,0,0.2,1);
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }
.reveal-d4 { transition-delay: 0.4s; }

/* ── Section Labels ──────────────────────────── */
.section-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-accent);
  margin-bottom: 12px;
}

.section-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 560px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-header .section-subtitle {
  margin: 0 auto;
}
```

- [ ] **Step 2: Create `src/scripts/animations.ts`**

```typescript
// ── Scroll Reveal ─────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// ── Animated Counters ─────────────────────────
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function animateCounter(el: HTMLElement): void {
  const target = parseInt(el.dataset.target ?? '0', 10);
  const display = el.dataset.display ?? String(target);
  const duration = 1800;
  const startTime = performance.now();

  function tick(now: number): void {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOutQuad(progress) * target);
    el.textContent = value.toLocaleString('pl-PL');
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = display;
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target as HTMLElement);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll<HTMLElement>('.counter').forEach((el) => {
  counterObserver.observe(el);
});
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = '[Nazwa Platformy] — Nowoczesna platforma edukacyjna',
  description = 'Platforma LMS do zarządzania kursami i szkoleniami dla firm i pracowników.',
} = Astro.props;
---

<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <slot />
    <script>
      import '../scripts/animations.ts';
    </script>
  </body>
</html>
```

- [ ] **Step 4: Update `src/pages/index.astro` to use BaseLayout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <h1 style="padding:100px 24px;font-size:48px;">Layout works ✓</h1>
</BaseLayout>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: `dist/` created with no TypeScript or CSS errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/scripts/animations.ts src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: global CSS, animations script, base layout"
```

---

## Task 3 — UI Components (Button, Badge)

**Files:**
- Create: `src/components/ui/Button.astro`
- Create: `src/components/ui/Badge.astro`

- [ ] **Step 1: Create `src/components/ui/Button.astro`**

```astro
---
interface Props {
  variant?: 'primary' | 'ghost' | 'outline' | 'white';
  href?: string;
  type?: 'button' | 'submit';
  class?: string;
}
const { variant = 'primary', href, type = 'button', class: cls = '' } = Astro.props;
---

{href ? (
  <a href={href} class={`btn btn--${variant} ${cls}`}><slot /></a>
) : (
  <button type={type} class={`btn btn--${variant} ${cls}`}><slot /></button>
)}

<style>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: var(--radius-btn);
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  text-decoration: none;
}

.btn--primary {
  background: var(--brand-accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(37,99,235,0.25);
}
.btn--primary:hover {
  background: var(--brand-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37,99,235,0.35);
}

.btn--ghost {
  background: transparent;
  color: var(--brand-accent);
  border: 1.5px solid var(--border-subtle);
}
.btn--ghost:hover {
  background: var(--bg-accent-light);
  border-color: #BFDBFE;
  transform: translateY(-2px);
}

.btn--outline {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-subtle);
}
.btn--outline:hover {
  border-color: var(--brand-accent);
  color: var(--brand-accent);
  transform: translateY(-2px);
}

.btn--white {
  background: #fff;
  color: var(--brand-accent);
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}
.btn--white:hover {
  background: #F8FAFC;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.16);
}
</style>
```

- [ ] **Step 2: Create `src/components/ui/Badge.astro`**

```astro
---
interface Props {
  class?: string;
}
const { class: cls = '' } = Astro.props;
---

<span class={`badge ${cls}`}><slot /></span>

<style>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg-accent-light);
  color: var(--brand-accent);
  border: 1px solid #BFDBFE;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.astro src/components/ui/Badge.astro
git commit -m "feat: Button and Badge UI components"
```

---

## Task 4 — Navbar

**Files:**
- Create: `src/components/layout/Navbar.astro`

- [ ] **Step 1: Create `src/components/layout/Navbar.astro`**

```astro
---
import Button from '../ui/Button.astro';
---

<header class="navbar" id="navbar">
  <div class="container navbar__inner">
    <!-- Logo -->
    <a href="/" class="navbar__logo" aria-label="[Nazwa Platformy] — Strona główna">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#2563EB"/>
        <path d="M8 22L16 10l8 12H8z" fill="white"/>
      </svg>
      <span class="navbar__brand">[Nazwa Platformy]</span>
    </a>

    <!-- Desktop nav -->
    <nav class="navbar__nav" aria-label="Główna nawigacja">
      <a href="#features" class="navbar__link">Funkcje</a>
      <a href="#pricing" class="navbar__link">Cennik</a>
      <a href="#business" class="navbar__link">Dla firm</a>
      <a href="#faq" class="navbar__link">FAQ</a>
    </nav>

    <!-- Desktop CTAs -->
    <div class="navbar__actions">
      <Button variant="outline" href="#login">Zaloguj się</Button>
      <Button variant="primary" href="#signup">Rozpocznij za darmo</Button>
    </div>

    <!-- Hamburger -->
    <button class="navbar__hamburger" id="hamburger" aria-label="Otwórz menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- Mobile drawer -->
<div class="mobile-drawer" id="mobileDrawer" role="dialog" aria-label="Menu mobilne">
  <nav class="mobile-drawer__nav">
    <a href="#features" class="mobile-drawer__link">Funkcje</a>
    <a href="#pricing" class="mobile-drawer__link">Cennik</a>
    <a href="#business" class="mobile-drawer__link">Dla firm</a>
    <a href="#faq" class="mobile-drawer__link">FAQ</a>
  </nav>
  <div class="mobile-drawer__actions">
    <Button variant="outline" href="#login" class="w-full">Zaloguj się</Button>
    <Button variant="primary" href="#signup" class="w-full">Rozpocznij za darmo</Button>
  </div>
</div>
<div class="drawer-overlay" id="drawerOverlay"></div>

<style>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  transition: box-shadow 0.3s ease;
}
.navbar.scrolled {
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.9);
}
.navbar__inner {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 68px;
}
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  text-decoration: none;
}
.navbar__brand {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.navbar__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.navbar__link {
  padding: 8px 14px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 6px;
  transition: var(--transition);
  text-decoration: none;
}
.navbar__link:hover {
  color: var(--text-primary);
  background: var(--bg-primary);
}
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
}
.navbar__hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}
.navbar__hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.navbar__hamburger.open span:nth-child(2) { opacity: 0; }
.navbar__hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile drawer */
.mobile-drawer {
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-subtle);
  padding: 24px;
  z-index: 99;
  transform: translateY(-110%);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: var(--shadow-hover);
}
.mobile-drawer.open { transform: translateY(0); }
.mobile-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}
.mobile-drawer__link {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  border-radius: 8px;
  transition: var(--transition);
}
.mobile-drawer__link:hover { background: var(--bg-primary); }
.mobile-drawer__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.3);
  z-index: 98;
  backdrop-filter: blur(2px);
}
.drawer-overlay.open { display: block; }

@media (max-width: 768px) {
  .navbar__nav, .navbar__actions { display: none; }
  .navbar__hamburger { display: flex; }
}
</style>

<script>
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobileDrawer');
const overlay = document.getElementById('drawerOverlay');

// Scrolled state
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile drawer toggle
function toggleDrawer(open: boolean) {
  hamburger?.classList.toggle('open', open);
  drawer?.classList.toggle('open', open);
  overlay?.classList.toggle('open', open);
  hamburger?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = drawer?.classList.contains('open') ?? false;
  toggleDrawer(!isOpen);
});

overlay?.addEventListener('click', () => toggleDrawer(false));

// Close drawer on nav link click
drawer?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleDrawer(false));
});
</script>
```

- [ ] **Step 2: Add Navbar to index.astro and verify**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/layout/Navbar.astro';
---
<BaseLayout>
  <Navbar />
  <main style="padding:200px 24px;text-align:center;">Navbar test ✓</main>
</BaseLayout>
```

- [ ] **Step 3: Run dev server and manually verify**

```bash
npm run dev
```

Expected: Sticky navbar with logo, nav links, and two CTA buttons visible. On mobile (<768px), hamburger icon shows and clicking it opens the drawer.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.astro src/pages/index.astro
git commit -m "feat: sticky navbar with mobile drawer"
```

---

## Task 5 — Footer

**Files:**
- Create: `src/components/layout/Footer.astro`

- [ ] **Step 1: Create `src/components/layout/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container footer__inner">
    <!-- Column 1: Brand -->
    <div class="footer__col footer__col--brand">
      <a href="/" class="footer__logo" aria-label="[Nazwa Platformy]">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563EB"/>
          <path d="M8 22L16 10l8 12H8z" fill="white"/>
        </svg>
        <span>[Nazwa Platformy]</span>
      </a>
      <p class="footer__desc">Nowoczesna platforma LMS do zarządzania szkoleniami i rozwojem pracowników w firmach każdej wielkości.</p>
      <div class="footer__social">
        <!-- LinkedIn -->
        <a href="#" class="footer__social-link" aria-label="LinkedIn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="currentColor"/></svg>
        </a>
        <!-- Twitter/X -->
        <a href="#" class="footer__social-link" aria-label="Twitter / X">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <!-- YouTube -->
        <a href="#" class="footer__social-link" aria-label="YouTube">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
        </a>
      </div>
    </div>

    <!-- Column 2: Produkt -->
    <div class="footer__col">
      <h4 class="footer__heading">Produkt</h4>
      <ul class="footer__links">
        <li><a href="#features">Funkcje</a></li>
        <li><a href="#pricing">Cennik</a></li>
        <li><a href="#">Integracje</a></li>
        <li><a href="#">Changelog</a></li>
        <li><a href="#">Status systemu</a></li>
      </ul>
    </div>

    <!-- Column 3: Firma -->
    <div class="footer__col">
      <h4 class="footer__heading">Firma</h4>
      <ul class="footer__links">
        <li><a href="#">O nas</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Kariera</a></li>
        <li><a href="#">Partnerzy</a></li>
        <li><a href="#">Kontakt</a></li>
      </ul>
    </div>

    <!-- Column 4: Zasoby -->
    <div class="footer__col">
      <h4 class="footer__heading">Zasoby</h4>
      <ul class="footer__links">
        <li><a href="#">Dokumentacja</a></li>
        <li><a href="#">API</a></li>
        <li><a href="#">Centrum pomocy</a></li>
        <li><a href="#">Społeczność</a></li>
        <li><a href="#">Webinary</a></li>
      </ul>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="footer__bottom">
    <div class="container footer__bottom-inner">
      <p>© {year} [Nazwa Platformy]. Wszelkie prawa zastrzeżone.</p>
      <div class="footer__legal">
        <a href="#">Polityka prywatności</a>
        <a href="#">Regulamin</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  </div>
</footer>

<style>
.footer {
  background: #0F172A;
  color: #94A3B8;
  padding-top: 72px;
}
.footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 64px;
}
.footer__col--brand { padding-right: 32px; }
.footer__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 16px;
  text-decoration: none;
}
.footer__desc {
  font-size: 14px;
  line-height: 1.7;
  color: #64748B;
  margin-bottom: 24px;
}
.footer__social {
  display: flex;
  gap: 12px;
}
.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  color: #94A3B8;
  transition: var(--transition);
}
.footer__social-link:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.footer__heading {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.footer__links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer__links a {
  font-size: 14px;
  color: #64748B;
  transition: color 0.2s ease;
}
.footer__links a:hover { color: #fff; }
.footer__bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 24px 0;
}
.footer__bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}
.footer__legal {
  display: flex;
  gap: 24px;
}
.footer__legal a {
  color: #475569;
  transition: color 0.2s;
}
.footer__legal a:hover { color: #94A3B8; }

@media (max-width: 1024px) {
  .footer__inner { grid-template-columns: 1fr 1fr; gap: 40px; }
  .footer__col--brand { grid-column: 1 / -1; padding-right: 0; }
}
@media (max-width: 640px) {
  .footer__inner { grid-template-columns: 1fr; gap: 32px; }
  .footer__bottom-inner { flex-direction: column; gap: 12px; text-align: center; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: dark footer with 4-column layout"
```

---

## Task 6 — Hero Section

**Files:**
- Create: `src/components/sections/Hero.astro`

- [ ] **Step 1: Create `src/components/sections/Hero.astro`**

```astro
---
import Button from '../ui/Button.astro';
import Badge from '../ui/Badge.astro';
---

<section class="hero">
  <div class="container hero__inner">
    <!-- Left: text -->
    <div class="hero__content">
      <Badge class="reveal">✦ Platforma edukacyjna dla firm i nie tylko</Badge>
      <h1 class="hero__title reveal reveal-d1">
        Ucz szybciej.<br />
        Rośnij pewniej.
      </h1>
      <p class="hero__subtitle reveal reveal-d2">
        Nowoczesny LMS, który łączy tworzenie kursów, zarządzanie zespołem i analitykę postępów w jednym miejscu. Bez zbędnej złożoności.
      </p>
      <div class="hero__cta reveal reveal-d3">
        <Button variant="primary" href="#signup">Wypróbuj za darmo</Button>
        <Button variant="ghost" href="#demo">Zobacz demo →</Button>
      </div>
      <div class="hero__trust reveal reveal-d4">
        <div class="hero__avatars" aria-hidden="true">
          <span class="avatar" style="background:#7C3AED;">AK</span>
          <span class="avatar" style="background:#0891B2;">MB</span>
          <span class="avatar" style="background:#059669;">PW</span>
          <span class="avatar" style="background:#DC2626;">KN</span>
        </div>
        <span>Dołącz do <strong>1 200+ firm</strong>, które już uczą z [Nazwa]</span>
      </div>
    </div>

    <!-- Right: dashboard mockup -->
    <div class="hero__mockup reveal reveal-d2">
      <!-- Floating badges -->
      <div class="hero__float hero__float--1" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#059669" stroke-width="2"/></svg>
        Kurs ukończony!
      </div>
      <div class="hero__float hero__float--2" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 4 4-6 4 10" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        +24% wydajność
      </div>

      <!-- Browser chrome -->
      <div class="browser">
        <div class="browser__bar">
          <span class="browser__dot" style="background:#FF5F57;"></span>
          <span class="browser__dot" style="background:#FEBC2E;"></span>
          <span class="browser__dot" style="background:#28C840;"></span>
          <div class="browser__url">app.nazwa-platformy.pl/dashboard</div>
        </div>
        <div class="browser__content">
          <!-- Dashboard mockup UI -->
          <div class="dash">
            <div class="dash__sidebar">
              <div class="dash__menu-item dash__menu-item--active"></div>
              <div class="dash__menu-item"></div>
              <div class="dash__menu-item"></div>
              <div class="dash__menu-item"></div>
              <div class="dash__menu-item"></div>
            </div>
            <div class="dash__main">
              <div class="dash__header">
                <div class="dash__title-block"></div>
                <div class="dash__badge-block"></div>
              </div>
              <div class="dash__stats">
                <div class="dash__stat">
                  <div class="dash__stat-num" style="background:#EFF6FF;"></div>
                  <div class="dash__stat-label"></div>
                </div>
                <div class="dash__stat">
                  <div class="dash__stat-num" style="background:#F0FDF4;"></div>
                  <div class="dash__stat-label"></div>
                </div>
                <div class="dash__stat">
                  <div class="dash__stat-num" style="background:#FFF7ED;"></div>
                  <div class="dash__stat-label"></div>
                </div>
              </div>
              <div class="dash__progress-section">
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#EFF6FF;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-title"></div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:72%;background:#2563EB;"></div></div>
                  </div>
                  <span class="dash__pct">72%</span>
                </div>
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#F0FDF4;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-title"></div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:45%;background:#059669;"></div></div>
                  </div>
                  <span class="dash__pct">45%</span>
                </div>
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#FFF7ED;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-title"></div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:89%;background:#F59E0B;"></div></div>
                  </div>
                  <span class="dash__pct">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero {
  background: var(--bg-primary);
  padding: 80px 0 96px;
  overflow: hidden;
  position: relative;
}
.hero::before {
  content: '';
  position: absolute;
  right: -100px;
  top: -100px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%);
  pointer-events: none;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.hero__content { max-width: 560px; }

.hero__title {
  font-size: clamp(44px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.07;
  color: var(--text-primary);
  margin: 16px 0 20px;
}
.hero__subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 480px;
}
.hero__cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.hero__trust {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}
.hero__trust strong { color: var(--text-primary); }
.hero__avatars {
  display: flex;
  margin-right: 4px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  margin-right: -8px;
  flex-shrink: 0;
}

/* Mockup */
.hero__mockup {
  position: relative;
}
.browser {
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-hover), 0 0 0 1px rgba(15,23,42,0.04);
  overflow: hidden;
  transform: rotate(-1.5deg);
}
.browser__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #F1F5F9;
  border-bottom: 1px solid var(--border-subtle);
}
.browser__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.browser__url {
  flex: 1;
  height: 20px;
  background: var(--bg-surface);
  border-radius: 4px;
  margin-left: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.browser__content { padding: 0; }

/* Dashboard layout */
.dash { display: flex; height: 320px; }
.dash__sidebar {
  width: 48px;
  background: #F8FAFC;
  border-right: 1px solid var(--border-subtle);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dash__menu-item {
  height: 28px;
  border-radius: 6px;
  background: var(--border-subtle);
}
.dash__menu-item--active { background: #BFDBFE; }
.dash__main { flex: 1; padding: 16px; overflow: hidden; }
.dash__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.dash__title-block {
  height: 16px;
  width: 120px;
  background: var(--text-primary);
  border-radius: 4px;
  opacity: 0.8;
}
.dash__badge-block {
  height: 22px;
  width: 60px;
  background: #BFDBFE;
  border-radius: 999px;
}
.dash__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.dash__stat {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}
.dash__stat-num {
  height: 20px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.dash__stat-label {
  height: 8px;
  background: var(--border-subtle);
  border-radius: 4px;
  width: 70%;
}
.dash__progress-section { display: flex; flex-direction: column; gap: 10px; }
.dash__row { display: flex; align-items: center; gap: 10px; }
.dash__row-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
}
.dash__row-body { flex: 1; }
.dash__row-title {
  height: 8px;
  background: var(--border-subtle);
  border-radius: 4px;
  margin-bottom: 6px;
  width: 60%;
}
.dash__progress-bar {
  height: 6px;
  background: #F1F5F9;
  border-radius: 999px;
  overflow: hidden;
}
.dash__progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1s ease;
}
.dash__pct {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
  width: 30px;
  text-align: right;
}

/* Floating badges */
.hero__float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--shadow-soft);
  white-space: nowrap;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}
.hero__float--1 {
  top: -16px;
  right: -16px;
  animation-delay: 0s;
}
.hero__float--2 {
  bottom: 40px;
  left: -24px;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 1024px) {
  .hero__inner { grid-template-columns: 1fr; gap: 48px; }
  .hero__content { max-width: 100%; }
  .hero__float--2 { left: 8px; }
}
@media (max-width: 640px) {
  .hero { padding: 60px 0 72px; }
  .hero__cta { flex-direction: column; }
  .hero__float--1, .hero__float--2 { display: none; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat: Hero section with CSS dashboard mockup and floating badges"
```

---

## Task 7 — Social Proof Bar

**Files:**
- Create: `src/components/sections/SocialProofBar.astro`

- [ ] **Step 1: Create `src/components/sections/SocialProofBar.astro`**

```astro
---
const logos = [
  'Acme Corp', 'TechFlow', 'Nexora', 'Buildify', 'Skyline'
];

const counters = [
  { target: 12000, display: '12 000+', label: 'Użytkowników' },
  { target: 500,   display: '500+',    label: 'Kursów' },
  { target: 98,    display: '98%',     label: 'Wskaźnik ukończeń' },
];
---

<div class="social-proof">
  <div class="container social-proof__inner">
    <!-- Logos -->
    <div class="social-proof__logos">
      <span class="social-proof__label">Zaufały nam:</span>
      {logos.map(name => (
        <div class="logo-placeholder" title={name} aria-label={name}>
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="8" width="80" height="8" rx="4" fill="#CBD5E1"/>
          </svg>
        </div>
      ))}
    </div>

    <!-- Counters -->
    <div class="social-proof__stats">
      {counters.map(c => (
        <div class="stat-item">
          <span
            class="stat-item__num counter"
            data-target={c.target}
            data-display={c.display}
          >0</span>
          <span class="stat-item__label">{c.label}</span>
        </div>
      ))}
    </div>
  </div>
</div>

<style>
.social-proof {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding: 28px 0;
}
.social-proof__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}
.social-proof__logos {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}
.social-proof__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}
.logo-placeholder {
  opacity: 0.35;
  transition: opacity 0.2s;
}
.logo-placeholder:hover { opacity: 0.6; }
.social-proof__stats {
  display: flex;
  align-items: center;
  gap: 40px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-item__num {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.stat-item__label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .social-proof__inner { flex-direction: column; align-items: flex-start; }
  .social-proof__stats { gap: 24px; }
  .stat-item__num { font-size: 24px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/SocialProofBar.astro
git commit -m "feat: social proof bar with logo strip and animated counters"
```

---

## Task 8 — Features Section (Sticky Scroll)

**Files:**
- Create: `src/components/sections/Features.astro`

- [ ] **Step 1: Create `src/components/sections/Features.astro`**

```astro
---
const features = [
  {
    id: 'builder',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#2563EB" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>`,
    title: 'Tworzenie kursów bez kodu',
    desc: 'Drag & drop builder z obsługą wideo, quizów, zadań i materiałów PDF. Kurs gotowy w godziny, nie tygodnie.',
  },
  {
    id: 'analytics',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 4 4-6 4 10" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'Śledzenie postępów w czasie rzeczywistym',
    desc: 'Dashboard analityczny z danymi o ukończeniach, wynikach quizów i zaangażowaniu kursantów — dla każdego zespołu.',
  },
  {
    id: 'certs',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 15l-4 4 1-5-4-3 5-1 2-5 2 5 5 1-4 3 1 5-4-4z" stroke="#2563EB" stroke-width="2" stroke-linejoin="round"/></svg>`,
    title: 'Certyfikaty i odznaki',
    desc: 'Automatyczne generowanie certyfikatów PDF po ukończeniu kursu. Odznaki motywujące do nauki dalej.',
  },
  {
    id: 'integrations',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" stroke="#2563EB" stroke-width="2"/><circle cx="19" cy="5" r="2" stroke="#2563EB" stroke-width="2"/><circle cx="19" cy="19" r="2" stroke="#2563EB" stroke-width="2"/><path d="M7 12h5m2-5l-2 3m2 5l-2-3" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>`,
    title: 'Integracje z Twoimi narzędziami',
    desc: 'SSO (SAML, OAuth), Slack, Zapier, REST API — [Nazwa] wpasowuje się w Twój stack bez friction.',
  },
];

// Mockup panels: colored block layouts that simulate each feature view
const panels = {
  builder: { color1: '#EFF6FF', color2: '#BFDBFE', label: 'Edytor kursu' },
  analytics: { color1: '#F0FDF4', color2: '#BBF7D0', label: 'Analityka postępów' },
  certs: { color1: '#FFF7ED', color2: '#FED7AA', label: 'Generator certyfikatów' },
  integrations: { color1: '#F5F3FF', color2: '#DDD6FE', label: 'Centrum integracji' },
};
---

<section class="features" id="features">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Jak to działa</span>
      <h2 class="section-title">Wszystko, czego potrzebujesz</h2>
      <p class="section-subtitle">Cztery filary skutecznej nauki w organizacji.</p>
    </div>

    <div class="features__layout">
      <!-- Left: scrollable feature blocks -->
      <div class="features__list">
        {features.map((f, i) => (
          <div class="feature-block reveal" data-feature={f.id}>
            <div class="feature-block__icon" set:html={f.icon} />
            <div>
              <h3 class="feature-block__title">{f.title}</h3>
              <p class="feature-block__desc">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <!-- Right: sticky mockup -->
      <div class="features__sticky-wrap">
        <div class="features__mockup" id="featuresMockup">
          {Object.entries(panels).map(([id, p]) => (
            <div class="features__panel" data-panel={id}>
              <div class="panel-browser">
                <div class="panel-browser__bar">
                  <span style={`background:#FF5F57;width:10px;height:10px;border-radius:50%;display:inline-block;`}></span>
                  <span style={`background:#FEBC2E;width:10px;height:10px;border-radius:50%;display:inline-block;margin:0 4px;`}></span>
                  <span style={`background:#28C840;width:10px;height:10px;border-radius:50%;display:inline-block;`}></span>
                  <div class="panel-browser__url">{p.label}</div>
                </div>
                <div class="panel-browser__content" style={`background:${p.color1};`}>
                  <div class="panel-demo">
                    <div class="panel-demo__header" style={`background:${p.color2};`}></div>
                    <div class="panel-demo__body">
                      <div class="panel-demo__block" style={`background:${p.color2};opacity:0.7;width:60%;`}></div>
                      <div class="panel-demo__block" style={`background:${p.color2};opacity:0.5;width:80%;`}></div>
                      <div class="panel-demo__block" style={`background:${p.color2};opacity:0.4;width:45%;`}></div>
                      <div class="panel-demo__grid">
                        <div style={`background:${p.color2};height:80px;border-radius:8px;`}></div>
                        <div style={`background:${p.color2};height:80px;border-radius:8px;opacity:0.7;`}></div>
                        <div style={`background:${p.color2};height:80px;border-radius:8px;opacity:0.5;`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.features__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.features__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feature-block {
  display: flex;
  gap: 20px;
  padding: 28px 24px;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: var(--transition);
  cursor: default;
}
.feature-block.active {
  background: var(--bg-surface);
  border-color: var(--border-subtle);
  box-shadow: var(--shadow-soft);
}
.feature-block__icon {
  width: 48px;
  height: 48px;
  background: var(--bg-accent-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.feature-block__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.feature-block__desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* Sticky mockup */
.features__sticky-wrap {
  position: sticky;
  top: 100px;
}
.features__mockup {
  position: relative;
  width: 100%;
}
.features__panel {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.features__panel.active {
  opacity: 1;
  position: relative;
  pointer-events: auto;
}

/* Panel browser */
.panel-browser {
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  box-shadow: var(--shadow-hover);
}
.panel-browser__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: #F1F5F9;
  border-bottom: 1px solid var(--border-subtle);
}
.panel-browser__url {
  flex: 1;
  height: 20px;
  background: var(--bg-surface);
  border-radius: 4px;
  margin-left: 8px;
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.panel-browser__content { min-height: 320px; }
.panel-demo { padding: 20px; height: 100%; }
.panel-demo__header {
  height: 36px;
  border-radius: 8px;
  margin-bottom: 16px;
}
.panel-demo__body { display: flex; flex-direction: column; gap: 10px; }
.panel-demo__block {
  height: 12px;
  border-radius: 6px;
}
.panel-demo__grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 10px;
  margin-top: 8px;
}

@media (max-width: 1024px) {
  .features__layout { grid-template-columns: 1fr; gap: 40px; }
  .features__sticky-wrap { position: static; }
  .features__panel { position: relative !important; opacity: 1 !important; }
  .features__panel + .features__panel { margin-top: 16px; display: none; }
  .features__panel:first-child { display: block; }
}
</style>

<script>
const blocks = document.querySelectorAll<HTMLElement>('.feature-block');
const panels = document.querySelectorAll<HTMLElement>('.features__panel');

function setActive(id: string) {
  blocks.forEach(b => b.classList.toggle('active', b.dataset.feature === id));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === id));
}

// Set first as default
if (blocks.length > 0) setActive(blocks[0].dataset.feature ?? '');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive((entry.target as HTMLElement).dataset.feature ?? '');
      }
    });
  },
  { threshold: 0.6, rootMargin: '-10% 0px -30% 0px' }
);

blocks.forEach(b => observer.observe(b));
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Features.astro
git commit -m "feat: Features section with sticky scroll and switching mockup"
```

---

## Task 9 — For Business / For Learners

**Files:**
- Create: `src/components/sections/ForBusinessLearners.astro`

- [ ] **Step 1: Create `src/components/sections/ForBusinessLearners.astro`**

```astro
---
const business = [
  'Zarządzanie zespołami i uprawnieniami',
  'Raportowanie zgodności (compliance)',
  'White-label i własna domena',
  'Onboarding nowych pracowników',
  'Integracja z HR i SSO',
  'Dedykowany opiekun konta',
];

const learners = [
  'Nauka w swoim tempie, z każdego urządzenia',
  'Certyfikaty uznawane przez pracodawców',
  'Interaktywne quizy i zadania praktyczne',
  'Śledzenie własnych postępów',
  'Dostęp offline do materiałów',
  'Społeczność i forum kursantów',
];
---

<section class="fbl" id="business">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Dla każdego</span>
      <h2 class="section-title">Rozwiązanie dopasowane do Ciebie</h2>
      <p class="section-subtitle">Niezależnie od tego, czy zarządzasz szkoleniami firmowymi, czy uczysz się samodzielnie.</p>
    </div>

    <div class="fbl__grid">
      <!-- Business card -->
      <div class="fbl__card fbl__card--business reveal">
        <div class="fbl__card-header">
          <span class="fbl__card-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M9 21V7l6-4v18" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <div>
            <h3 class="fbl__card-title">Dla firm i organizacji</h3>
            <p class="fbl__card-sub">Skalowalne szkolenia dla całego zespołu</p>
          </div>
        </div>
        <ul class="fbl__list">
          {business.map(item => (
            <li class="fbl__list-item">
              <svg class="fbl__check" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {item}
            </li>
          ))}
        </ul>
        <a href="#contact" class="fbl__cta fbl__cta--primary">Porozmawiaj z nami →</a>
      </div>

      <!-- Learners card -->
      <div class="fbl__card fbl__card--learners reveal reveal-d2">
        <div class="fbl__card-header">
          <span class="fbl__card-icon fbl__card-icon--green" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <div>
            <h3 class="fbl__card-title">Dla uczących się</h3>
            <p class="fbl__card-sub">Rozwijaj swoje umiejętności we własnym tempie</p>
          </div>
        </div>
        <ul class="fbl__list">
          {learners.map(item => (
            <li class="fbl__list-item">
              <svg class="fbl__check fbl__check--green" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {item}
            </li>
          ))}
        </ul>
        <a href="#signup" class="fbl__cta fbl__cta--outline">Zacznij naukę →</a>
      </div>
    </div>
  </div>
</section>

<style>
.fbl { background: var(--bg-surface); }
.fbl__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.fbl__card {
  border-radius: var(--radius);
  padding: 36px;
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 28px;
  transition: var(--transition);
}
.fbl__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.fbl__card--business {
  background: var(--bg-accent-light);
  border-color: #BFDBFE;
}
.fbl__card--learners {
  background: var(--bg-surface);
}
.fbl__card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.fbl__card-icon {
  width: 52px;
  height: 52px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-soft);
}
.fbl__card-icon--green { /* inherits base styles */ }
.fbl__card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}
.fbl__card-sub {
  font-size: 14px;
  color: var(--text-secondary);
}
.fbl__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.fbl__list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--text-primary);
}
.fbl__check { flex-shrink: 0; }
.fbl__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 24px;
  border-radius: var(--radius-btn);
  font-size: 15px;
  font-weight: 600;
  transition: var(--transition);
  text-decoration: none;
  text-align: center;
}
.fbl__cta--primary {
  background: var(--brand-accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(37,99,235,0.25);
}
.fbl__cta--primary:hover {
  background: var(--brand-accent-hover);
  transform: translateY(-2px);
}
.fbl__cta--outline {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-subtle);
}
.fbl__cta--outline:hover {
  border-color: var(--brand-accent);
  color: var(--brand-accent);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .fbl__grid { grid-template-columns: 1fr; }
  .fbl__card { padding: 28px; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ForBusinessLearners.astro
git commit -m "feat: For Business / For Learners two-card section"
```

---

## Task 10 — Testimonials

**Files:**
- Create: `src/components/sections/Testimonials.astro`

- [ ] **Step 1: Create `src/components/sections/Testimonials.astro`**

```astro
---
const testimonials = [
  {
    text: 'Wdrożenie [Nazwa Platformy] zmniejszyło czas onboardingu nowych pracowników o 40%. Kurs można zbudować w ciągu jednego popołudnia i od razu przypisać całemu działowi.',
    name: 'Agnieszka Kowalska',
    role: 'Head of HR',
    company: 'TechFlow S.A.',
    initials: 'AK',
    color: '#7C3AED',
  },
  {
    text: 'Nareszcie mamy pełny wgląd w postępy szkoleń compliance. Raporty generują się jednym kliknięciem, a certyfikaty trafiają do pracowników automatycznie.',
    name: 'Marek Bąk',
    role: 'Chief People Officer',
    company: 'Nexora Group',
    initials: 'MB',
    color: '#0891B2',
  },
  {
    text: 'Jako twórca kursów cenię sobie prostotę buildera. Przeniosłem swój program mentoringowy na [Nazwa] i w ciągu tygodnia miałem pierwszych płacących kursantów.',
    name: 'Piotr Wierzbicki',
    role: 'Business Coach',
    company: 'PW Academy',
    initials: 'PW',
    color: '#059669',
  },
];
---

<section class="testimonials">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Opinie</span>
      <h2 class="section-title">Co mówią nasi użytkownicy</h2>
      <p class="section-subtitle">Firmy i twórcy kursów, którzy już uczą z [Nazwa].</p>
    </div>

    <!-- Desktop grid / Mobile carousel wrapper -->
    <div class="testimonials__carousel" id="testimonialsCarousel">
      <div class="testimonials__track" id="testimonialsTrack">
        {testimonials.map((t, i) => (
          <div class={`testimonials__card reveal reveal-d${i + 1}`}>
            <span class="testimonials__quote" aria-hidden="true">"</span>
            <p class="testimonials__text">{t.text}</p>
            <div class="testimonials__author">
              <span
                class="testimonials__avatar"
                style={`background:${t.color};`}
                aria-hidden="true"
              >{t.initials}</span>
              <div>
                <div class="testimonials__name">{t.name}</div>
                <div class="testimonials__role">{t.role} · {t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <!-- Mobile dots -->
    <div class="testimonials__dots" id="testimonialsDots" aria-label="Nawigacja karuzeli">
      {testimonials.map((_, i) => (
        <button
          class={`testimonials__dot${i === 0 ? ' active' : ''}`}
          data-index={i}
          aria-label={`Opinia ${i + 1}`}
        ></button>
      ))}
    </div>
  </div>
</section>

<style>
.testimonials { background: var(--bg-primary); }
.testimonials__carousel { overflow: hidden; }
.testimonials__track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.testimonials__card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: var(--transition);
}
.testimonials__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.testimonials__quote {
  font-size: 64px;
  line-height: 1;
  color: var(--brand-accent);
  opacity: 0.15;
  font-family: Georgia, serif;
  display: block;
  margin-bottom: -20px;
}
.testimonials__text {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.75;
  flex: 1;
}
.testimonials__author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}
.testimonials__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.testimonials__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.testimonials__role {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Mobile dots — hidden on desktop */
.testimonials__dots {
  display: none;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}
.testimonials__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-subtle);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
}
.testimonials__dot.active {
  background: var(--brand-accent);
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .testimonials__track {
    display: flex;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .testimonials__card {
    min-width: 100%;
    flex-shrink: 0;
  }
  .testimonials__dots { display: flex; }
}
</style>

<script>
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll<HTMLButtonElement>('.testimonials__dot');
let current = 0;
let startX = 0;

function goTo(index: number) {
  if (!track) return;
  current = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index ?? '0')));
});

// Touch swipe
track?.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

track?.addEventListener('touchend', (e) => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    const next = diff > 0
      ? Math.min(current + 1, dots.length - 1)
      : Math.max(current - 1, 0);
    goTo(next);
  }
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Testimonials.astro
git commit -m "feat: Testimonials grid with mobile swipe carousel"
```

---

## Task 11 — Pricing

**Files:**
- Create: `src/components/sections/Pricing.astro`

- [ ] **Step 1: Create `src/components/sections/Pricing.astro`**

```astro
---
const plans = [
  {
    name: 'Basic',
    desc: 'Dla małych zespołów i indywidualnych twórców',
    priceMonthly: 49,
    priceYearly: 39,
    cta: 'Zacznij za darmo',
    ctaHref: '#signup',
    featured: false,
    features: [
      { label: 'Do 25 użytkowników', included: true },
      { label: '10 kursów', included: true },
      { label: 'Podstawowa analityka', included: true },
      { label: 'Certyfikaty', included: false },
      { label: 'White-label', included: false },
      { label: 'SSO / Integracje API', included: false },
      { label: 'Dedykowany opiekun', included: false },
    ],
  },
  {
    name: 'Pro',
    desc: 'Dla rosnących firm z pełnymi potrzebami szkoleniowymi',
    priceMonthly: 149,
    priceYearly: 119,
    cta: 'Wybierz Pro',
    ctaHref: '#signup-pro',
    featured: true,
    features: [
      { label: 'Do 250 użytkowników', included: true },
      { label: 'Nieograniczone kursy', included: true },
      { label: 'Zaawansowana analityka', included: true },
      { label: 'Certyfikaty PDF', included: true },
      { label: 'White-label', included: true },
      { label: 'SSO / Integracje API', included: true },
      { label: 'Dedykowany opiekun', included: false },
    ],
  },
  {
    name: 'Enterprise',
    desc: 'Dla dużych organizacji z niestandardowymi wymaganiami',
    priceMonthly: null,
    priceYearly: null,
    cta: 'Zapytaj o ofertę',
    ctaHref: '#contact',
    featured: false,
    features: [
      { label: 'Nieograniczeni użytkownicy', included: true },
      { label: 'Nieograniczone kursy', included: true },
      { label: 'Analityka enterprise', included: true },
      { label: 'Certyfikaty PDF', included: true },
      { label: 'White-label + własna domena', included: true },
      { label: 'SSO / Integracje API', included: true },
      { label: 'Dedykowany opiekun 24/7', included: true },
    ],
  },
];
---

<section class="pricing" id="pricing">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Cennik</span>
      <h2 class="section-title">Przejrzyste ceny</h2>
      <p class="section-subtitle">Zacznij za darmo. Skaluj kiedy jesteś gotowy.</p>
    </div>

    <!-- Toggle -->
    <div class="pricing__toggle reveal" id="pricingToggleWrap">
      <span class="pricing__toggle-label">Miesięcznie</span>
      <button class="pricing__toggle-btn" id="pricingToggle" role="switch" aria-checked="false" aria-label="Przełącz rozliczenie roczne">
        <span class="pricing__toggle-thumb"></span>
      </button>
      <span class="pricing__toggle-label">
        Rocznie
        <span class="pricing__save-badge">Oszczędź 20%</span>
      </span>
    </div>

    <!-- Plans grid -->
    <div class="pricing__grid reveal">
      {plans.map(plan => (
        <div class={`pricing__card${plan.featured ? ' pricing__card--featured' : ''}`}>
          {plan.featured && <span class="pricing__badge">Najpopularniejszy</span>}
          <h3 class="pricing__plan-name">{plan.name}</h3>
          <p class="pricing__plan-desc">{plan.desc}</p>
          <div class="pricing__price">
            {plan.priceMonthly !== null ? (
              <>
                <span class="pricing__currency">zł</span>
                <span class="pricing__amount" data-monthly={plan.priceMonthly} data-yearly={plan.priceYearly}>
                  {plan.priceMonthly}
                </span>
                <span class="pricing__period">/miesiąc</span>
              </>
            ) : (
              <span class="pricing__custom">Skontaktuj się</span>
            )}
          </div>
          <a href={plan.ctaHref} class={`pricing__cta${plan.featured ? ' pricing__cta--primary' : ' pricing__cta--outline'}`}>
            {plan.cta}
          </a>
          <ul class="pricing__features">
            {plan.features.map(f => (
              <li class={`pricing__feature${f.included ? '' : ' pricing__feature--disabled'}`}>
                {f.included ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round"/></svg>
                )}
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
.pricing { background: var(--bg-surface); }

.pricing__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 48px;
}
.pricing__toggle-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.pricing__save-badge {
  background: #DCFCE7;
  color: #166534;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}
.pricing__toggle-btn {
  width: 48px;
  height: 26px;
  background: var(--border-subtle);
  border-radius: 999px;
  position: relative;
  transition: background 0.3s ease;
  flex-shrink: 0;
}
.pricing__toggle-btn[aria-checked="true"] { background: var(--brand-accent); }
.pricing__toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.pricing__toggle-btn[aria-checked="true"] .pricing__toggle-thumb {
  transform: translateX(22px);
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}
.pricing__card {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 32px;
  position: relative;
  transition: var(--transition);
}
.pricing__card:hover { box-shadow: var(--shadow-hover); }
.pricing__card--featured {
  background: var(--bg-surface);
  border: 2px solid var(--brand-accent);
  transform: scale(1.03);
  box-shadow: var(--shadow-hover);
}
.pricing__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand-accent);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 999px;
  white-space: nowrap;
}
.pricing__plan-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.pricing__plan-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
  min-height: 42px;
}
.pricing__price {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: 24px;
}
.pricing__currency {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  line-height: 1.8;
}
.pricing__amount {
  font-size: 48px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1;
}
.pricing__period {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.pricing__custom {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}
.pricing__cta {
  display: block;
  text-align: center;
  padding: 13px 20px;
  border-radius: var(--radius-btn);
  font-size: 15px;
  font-weight: 600;
  transition: var(--transition);
  margin-bottom: 28px;
  text-decoration: none;
}
.pricing__cta--primary {
  background: var(--brand-accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(37,99,235,0.25);
}
.pricing__cta--primary:hover {
  background: var(--brand-accent-hover);
  transform: translateY(-2px);
}
.pricing__cta--outline {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-subtle);
}
.pricing__cta--outline:hover {
  border-color: var(--brand-accent);
  color: var(--brand-accent);
  transform: translateY(-2px);
}
.pricing__features { display: flex; flex-direction: column; gap: 11px; }
.pricing__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-primary);
}
.pricing__feature svg { flex-shrink: 0; }
.pricing__feature--disabled { color: var(--text-secondary); }

@media (max-width: 1024px) {
  .pricing__grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
  .pricing__card--featured { transform: none; }
}
</style>

<script>
const toggle = document.getElementById('pricingToggle');
const amounts = document.querySelectorAll<HTMLElement>('.pricing__amount');
let isYearly = false;

toggle?.addEventListener('click', () => {
  isYearly = !isYearly;
  toggle.setAttribute('aria-checked', String(isYearly));
  amounts.forEach(el => {
    const val = isYearly
      ? parseInt(el.dataset.yearly ?? '0')
      : parseInt(el.dataset.monthly ?? '0');
    el.textContent = String(val);
  });
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Pricing.astro
git commit -m "feat: Pricing section with 3 plans and monthly/yearly toggle"
```

---

## Task 12 — FAQ

**Files:**
- Create: `src/components/sections/FAQ.astro`

- [ ] **Step 1: Create `src/components/sections/FAQ.astro`**

```astro
---
const items = [
  {
    q: 'Jak długo trwa darmowy okres próbny?',
    a: 'Oferujemy 14-dniowy bezpłatny okres próbny na planie Pro bez podawania karty kredytowej. Po jego zakończeniu możesz wybrać plan lub przejść na bezpłatny Basic.',
  },
  {
    q: 'Czy mogę importować kursy z innych platform?',
    a: 'Tak — obsługujemy import plików SCORM 1.2 i 2004. Możesz też przenieść materiały wideo i PDF bezpośrednio przez panel administracyjny.',
  },
  {
    q: 'Jakie integracje są dostępne?',
    a: 'Integrujemy się z popularnymi narzędziami HR (BambooHR, Workday), komunikatorami (Slack, Teams), narzędziami automatyzacji (Zapier, Make) oraz obsługujemy SSO przez SAML i OAuth2.',
  },
  {
    q: 'Czy platforma działa w języku polskim?',
    a: 'Tak, interfejs platformy jest w pełni dostępny w języku polskim. Obsługujemy również angielski, niemiecki i inne języki — możliwość wybrania przez kursanta.',
  },
  {
    q: 'Jak wygląda wsparcie techniczne?',
    a: 'Plan Basic obejmuje wsparcie e-mail w dni robocze. Plan Pro dodaje czat na żywo. Plan Enterprise oferuje dedykowanego opiekuna konta i wsparcie 24/7.',
  },
  {
    q: 'Czy mogę używać własnej domeny?',
    a: 'Tak, od planu Pro wzwyż możesz skonfigurować własną domenę (np. nauka.twojaFirma.pl) i pełne white-labeling — logo, kolory, e-maile z Twojej domeny.',
  },
];
---

<section class="faq" id="faq">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">FAQ</span>
      <h2 class="section-title">Najczęstsze pytania</h2>
    </div>

    <div class="faq__list reveal" role="list">
      {items.map((item, i) => (
        <div class="faq__item" role="listitem">
          <button
            class={`faq__question${i === 0 ? ' open' : ''}`}
            aria-expanded={i === 0 ? 'true' : 'false'}
            aria-controls={`faq-answer-${i}`}
            id={`faq-btn-${i}`}
          >
            {item.q}
            <span class="faq__icon" aria-hidden="true">+</span>
          </button>
          <div
            class={`faq__answer${i === 0 ? ' open' : ''}`}
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-btn-${i}`}
          >
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
.faq { background: var(--bg-primary); }
.faq__list {
  max-width: 720px;
  margin: 0 auto;
}
.faq__item {
  border-bottom: 1px solid var(--border-subtle);
}
.faq__item:first-child { border-top: 1px solid var(--border-subtle); }
.faq__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}
.faq__question:hover { color: var(--brand-accent); }
.faq__question.open { color: var(--brand-accent); }
.faq__icon {
  font-size: 22px;
  font-weight: 400;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  line-height: 1;
}
.faq__question.open .faq__icon { transform: rotate(45deg); }
.faq__answer {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
}
.faq__answer.open { max-height: 500px; }
.faq__answer p {
  padding-bottom: 20px;
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.75;
}
</style>

<script>
document.querySelectorAll<HTMLButtonElement>('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('open');
    const answerId = btn.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;

    // Close all
    document.querySelectorAll('.faq__question').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));

    // Open clicked (if it was closed)
    if (!isOpen && answer) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/FAQ.astro
git commit -m "feat: FAQ accordion section"
```

---

## Task 13 — Final CTA

**Files:**
- Create: `src/components/sections/FinalCTA.astro`

- [ ] **Step 1: Create `src/components/sections/FinalCTA.astro`**

```astro
---
import Button from '../ui/Button.astro';
---

<section class="final-cta">
  <!-- SVG dot pattern -->
  <svg class="final-cta__pattern" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="white"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)"/>
  </svg>

  <div class="container final-cta__inner">
    <h2 class="final-cta__title reveal">Gotowy, żeby zacząć?</h2>
    <p class="final-cta__sub reveal reveal-d1">
      Dołącz do ponad 1 200 firm, które zaufały [Nazwa] i zmień sposób, w jaki Twój zespół się uczy.
    </p>
    <div class="final-cta__actions reveal reveal-d2">
      <Button variant="white" href="#signup">Rozpocznij za darmo</Button>
      <a href="#contact" class="final-cta__link">Porozmawiaj z nami →</a>
    </div>
    <p class="final-cta__note reveal reveal-d3">Bez karty kredytowej · 14 dni za darmo · Anuluj kiedy chcesz</p>
  </div>
</section>

<style>
.final-cta {
  background: var(--brand-accent);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.final-cta__pattern {
  position: absolute;
  inset: 0;
  opacity: 0.07;
  pointer-events: none;
}
.final-cta__inner { position: relative; z-index: 1; }
.final-cta__title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.1;
}
.final-cta__sub {
  font-size: 18px;
  color: rgba(255,255,255,0.85);
  max-width: 520px;
  margin: 0 auto 40px;
  line-height: 1.65;
}
.final-cta__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.final-cta__link {
  color: rgba(255,255,255,0.9);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.final-cta__link:hover { color: #fff; }
.final-cta__note {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

@media (max-width: 640px) {
  .final-cta { padding: 80px 0; }
  .final-cta__actions { flex-direction: column; align-items: center; }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/FinalCTA.astro
git commit -m "feat: Final CTA blue section with dot pattern"
```

---

## Task 14 — Page Assembly (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` with full page assembly**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/layout/Navbar.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import SocialProofBar from '../components/sections/SocialProofBar.astro';
import Features from '../components/sections/Features.astro';
import ForBusinessLearners from '../components/sections/ForBusinessLearners.astro';
import Testimonials from '../components/sections/Testimonials.astro';
import Pricing from '../components/sections/Pricing.astro';
import FAQ from '../components/sections/FAQ.astro';
import FinalCTA from '../components/sections/FinalCTA.astro';
---

<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <SocialProofBar />
    <Features />
    <ForBusinessLearners />
    <Testimonials />
    <Pricing />
    <FAQ />
    <FinalCTA />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Run dev server and manually verify all sections render**

```bash
npm run dev
```

Expected: Full landing page visible at `http://localhost:4321/` with all 10 sections.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble full landing page in index.astro"
```

---

## Task 15 — Build Verification

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors, no CSS errors. Output in `dist/`.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Expected: Page loads at `http://localhost:4321/` identical to dev build.

- [ ] **Step 3: Manual checklist**

Verify the following in the browser:
- [ ] Navbar is sticky; backdrop-blur appears on scroll
- [ ] Hamburger icon appears at ≤768px; drawer opens/closes correctly
- [ ] Hero floating badges animate (`float` keyframes)
- [ ] Social Proof counters animate when scrolled into view
- [ ] Features sticky mockup switches correctly on scroll
- [ ] Pricing toggle switches between monthly/yearly prices
- [ ] FAQ accordion opens/closes; first item defaults open
- [ ] Testimonials carousel is swipeable on mobile (DevTools touch simulation)
- [ ] Scroll reveal (`.reveal`) fires for all sections
- [ ] Footer renders correctly; social links are clickable

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete LMS landing page — all sections, animations, mobile responsive"
```
