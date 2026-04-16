# Ascent LMS — Redesign Implementation Plan (Bold Gradient SaaS)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Ascent LMS landing page from a generic template aesthetic to a bold, gradient-forward SaaS design that communicates premium + dynamic.

**Architecture:** All changes confined to existing Astro component files and `global.css`. No new files or dependencies. Task 1 must complete first (provides CSS variables used everywhere). Tasks 2–13 are otherwise independent.

**Tech Stack:** Astro, Vanilla CSS (custom properties), Vanilla JS (Intersection Observer)

---

## File Map

| File | Change |
|------|--------|
| `src/styles/global.css` | New gradient variables, `.gradient-text` utility |
| `src/components/ui/Button.astro` | Add `gradient` variant |
| `src/components/ui/Badge.astro` | Gradient border treatment |
| `src/components/layout/Navbar.astro` | Ascent logo, frosted glass, gradient CTA |
| `src/components/layout/Footer.astro` | Ascent logo + brand name |
| `src/components/sections/Hero.astro` | Gradient blobs, gradient H1, rich mockup |
| `src/components/sections/SocialProofBar.astro` | Gradient numbers, styled logo chips |
| `src/components/sections/Features.astro` | 2×2 card grid, remove sticky scroll |
| `src/components/sections/ForBusinessLearners.astro` | Gradient border on Business card |
| `src/components/sections/Testimonials.astro` | Star ratings, left border accent, tinted bg |
| `src/components/sections/Pricing.astro` | Gradient Pro card with white text |
| `src/components/sections/FAQ.astro` | Chevron icon, gradient text on open |
| `src/components/sections/FinalCTA.astro` | Gradient background, glow orbs |

---

### Task 1: Design System Foundation

**Files:**
- Modify: `src/styles/global.css`

- [x] **Step 1: Replace entire `src/styles/global.css`**

```css
/* ── Variables ───────────────────────────────── */
:root {
  --gradient-start:      #7C3AED;
  --gradient-mid:        #4F46E5;
  --gradient-end:        #2563EB;
  --gradient-brand:      linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%);
  --gradient-brand-text: linear-gradient(135deg, #7C3AED, #2563EB);

  --bg-primary:          #F8FAFF;
  --bg-surface:          #FFFFFF;
  --bg-accent-light:     #EFF6FF;
  --bg-tinted:           #F0F4FF;

  --brand-accent:        #4F46E5;
  --brand-accent-hover:  #4338CA;

  --text-primary:        #0F172A;
  --text-secondary:      #64748B;

  --border-subtle:       #E2E8F0;
  --border-brand:        rgba(99,102,241,0.3);

  --shadow-soft:         0 10px 30px -5px rgba(79,70,229,0.08);
  --shadow-hover:        0 20px 40px -10px rgba(79,70,229,0.15);
  --shadow-glow:         0 0 40px rgba(124,58,237,0.2);

  --transition:          all 0.3s cubic-bezier(0.4,0,0.2,1);
  --radius:              16px;
  --radius-btn:          10px;
  --max-w:               1200px;
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

/* ── Gradient Text ───────────────────────────── */
.gradient-text {
  background: var(--gradient-brand-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

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
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
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
.section-header .section-subtitle { margin: 0 auto; }
```

- [x] **Step 2: Verify**

Run: `npm run dev` — page loads, no build errors, background is slightly blue-tinted.

- [x] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: design system — gradient variables, gradient-text utility, Ascent palette"
```

---

### Task 2: Button — Gradient Variant

**Files:**
- Modify: `src/components/ui/Button.astro`

- [x] **Step 1: Replace `src/components/ui/Button.astro`**

```astro
---
interface Props {
  variant?: 'primary' | 'ghost' | 'outline' | 'white' | 'gradient';
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
  box-shadow: 0 4px 14px rgba(79,70,229,0.3);
}
.btn--primary:hover {
  background: var(--brand-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79,70,229,0.4);
}
.btn--gradient {
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: 0 4px 20px rgba(79,70,229,0.35);
}
.btn--gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(79,70,229,0.45);
}
.btn--ghost {
  background: transparent;
  color: var(--brand-accent);
  border: 1.5px solid var(--border-subtle);
}
.btn--ghost:hover {
  background: var(--bg-accent-light);
  border-color: rgba(99,102,241,0.4);
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

- [x] **Step 2: Verify** — `npm run dev`, all existing buttons render, no regressions.

- [x] **Step 3: Commit**

```bash
git add src/components/ui/Button.astro
git commit -m "feat: button — add gradient variant"
```

---

### Task 3: Badge — Gradient Border

**Files:**
- Modify: `src/components/ui/Badge.astro`

- [x] **Step 1: Read current `src/components/ui/Badge.astro`, then replace with**

```astro
---
const { class: cls = '' } = Astro.props;
---
<span class={`badge ${cls}`}><slot /></span>

<style>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-accent);
  background: linear-gradient(white, white) padding-box,
              var(--gradient-brand) border-box;
  border: 1.5px solid transparent;
  border-radius: 999px;
  letter-spacing: 0.01em;
}
</style>
```

- [x] **Step 2: Verify** — Hero badge shows gradient border (purple→blue outline).

- [x] **Step 3: Commit**

```bash
git add src/components/ui/Badge.astro
git commit -m "feat: badge — gradient border treatment"
```

---

### Task 4: Navbar — Ascent Brand + Frosted Glass

**Files:**
- Modify: `src/components/layout/Navbar.astro`

- [x] **Step 1: Replace `src/components/layout/Navbar.astro`**

```astro
---
import Button from '../ui/Button.astro';
---

<header class="navbar" id="navbar">
  <div class="container navbar__inner">
    <a href="/" class="navbar__logo" aria-label="Ascent — Strona główna">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="nav-logo-g" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#7C3AED"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#nav-logo-g)"/>
        <path d="M8 22l8-12 8 12" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M8 17l8-12 8 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <span class="navbar__brand">Ascent</span>
    </a>

    <nav class="navbar__nav" aria-label="Główna nawigacja">
      <a href="#features" class="navbar__link">Funkcje</a>
      <a href="#pricing" class="navbar__link">Cennik</a>
      <a href="#business" class="navbar__link">Dla firm</a>
      <a href="#faq" class="navbar__link">FAQ</a>
    </nav>

    <div class="navbar__actions">
      <Button variant="outline" href="#login">Zaloguj się</Button>
      <Button variant="gradient" href="#signup">Rozpocznij za darmo</Button>
    </div>

    <button class="navbar__hamburger" id="hamburger" aria-label="Otwórz menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="mobile-drawer" id="mobileDrawer" role="dialog" aria-label="Menu mobilne">
  <nav class="mobile-drawer__nav">
    <a href="#features" class="mobile-drawer__link">Funkcje</a>
    <a href="#pricing" class="mobile-drawer__link">Cennik</a>
    <a href="#business" class="mobile-drawer__link">Dla firm</a>
    <a href="#faq" class="mobile-drawer__link">FAQ</a>
  </nav>
  <div class="mobile-drawer__actions">
    <Button variant="outline" href="#login" class="w-full">Zaloguj się</Button>
    <Button variant="gradient" href="#signup" class="w-full">Rozpocznij za darmo</Button>
  </div>
</div>
<div class="drawer-overlay" id="drawerOverlay"></div>

<style>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248,250,255,0);
  border-bottom: 1px solid transparent;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.navbar.scrolled {
  background: rgba(248,250,255,0.88);
  border-bottom-color: var(--border-subtle);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(79,70,229,0.06);
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
}
.navbar__brand {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
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
  position: relative;
}
.navbar__link:hover { color: var(--text-primary); }
.navbar__link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: var(--gradient-brand);
  border-radius: 999px;
  transform: scaleX(0);
  transition: transform 0.25s ease;
}
.navbar__link:hover::after { transform: scaleX(1); }
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
.mobile-drawer__actions { display: flex; flex-direction: column; gap: 10px; }
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

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

function toggleDrawer(open: boolean) {
  hamburger?.classList.toggle('open', open);
  drawer?.classList.toggle('open', open);
  overlay?.classList.toggle('open', open);
  hamburger?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  toggleDrawer(!(drawer?.classList.contains('open') ?? false));
});
overlay?.addEventListener('click', () => toggleDrawer(false));
drawer?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleDrawer(false));
});
</script>
```

- [x] **Step 2: Verify** — Navbar shows "Ascent" with double-chevron SVG logo. Starts transparent, frosted glass on scroll. "Rozpocznij za darmo" is gradient. Nav links show gradient underline on hover.

- [x] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.astro
git commit -m "feat: navbar — Ascent brand, frosted glass, gradient CTA, gradient link hover"
```

---

### Task 5: Hero — Gradient Blobs + Rich Mockup

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [x] **Step 1: Replace `src/components/sections/Hero.astro`**

```astro
---
import Button from '../ui/Button.astro';
import Badge from '../ui/Badge.astro';
---

<section class="hero">
  <div class="hero__blob hero__blob--1" aria-hidden="true"></div>
  <div class="hero__blob hero__blob--2" aria-hidden="true"></div>

  <div class="container hero__inner">
    <div class="hero__content">
      <Badge class="reveal">✦ Platforma edukacyjna dla firm i nie tylko</Badge>
      <h1 class="hero__title reveal reveal-d1">
        Ucz szybciej.<br />
        <span class="gradient-text">Rośnij pewniej.</span>
      </h1>
      <p class="hero__subtitle reveal reveal-d2">
        Nowoczesny LMS, który łączy tworzenie kursów, zarządzanie zespołem i analitykę postępów w jednym miejscu. Bez zbędnej złożoności.
      </p>
      <div class="hero__cta reveal reveal-d3">
        <Button variant="gradient" href="#signup">Wypróbuj za darmo</Button>
        <Button variant="ghost" href="#demo">Zobacz demo →</Button>
      </div>
      <div class="hero__trust reveal reveal-d4">
        <div class="hero__avatars" aria-hidden="true">
          <span class="avatar" style="background:#7C3AED;">AK</span>
          <span class="avatar" style="background:#4F46E5;">MB</span>
          <span class="avatar" style="background:#059669;">PW</span>
          <span class="avatar" style="background:#0891B2;">KN</span>
        </div>
        <span>Dołącz do <strong>1 200+ firm</strong>, które już uczą z Ascent</span>
      </div>
    </div>

    <div class="hero__mockup reveal reveal-d2">
      <div class="hero__float hero__float--1" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#059669" stroke-width="2"/></svg>
        Kurs ukończony!
      </div>
      <div class="hero__float hero__float--2" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 4 4-6 4 10" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        +24% wydajność
      </div>

      <div class="browser">
        <div class="browser__bar">
          <span class="browser__dot" style="background:#FF5F57;"></span>
          <span class="browser__dot" style="background:#FEBC2E;"></span>
          <span class="browser__dot" style="background:#28C840;"></span>
          <div class="browser__url">app.ascent.pl/dashboard</div>
        </div>
        <div class="browser__content">
          <div class="dash">
            <div class="dash__sidebar">
              <div class="dash__logo-mark"></div>
              <div class="dash__menu-item dash__menu-item--active">
                <div class="dash__menu-icon dash__menu-icon--active"></div>
                <span>Dashboard</span>
              </div>
              <div class="dash__menu-item">
                <div class="dash__menu-icon"></div>
                <span>Kursy</span>
              </div>
              <div class="dash__menu-item">
                <div class="dash__menu-icon"></div>
                <span>Zespół</span>
              </div>
              <div class="dash__menu-item">
                <div class="dash__menu-icon"></div>
                <span>Raporty</span>
              </div>
            </div>
            <div class="dash__main">
              <div class="dash__header">
                <div>
                  <div class="dash__greeting">Dzień dobry, Anna 👋</div>
                  <div class="dash__date">Poniedziałek, 31 marca 2026</div>
                </div>
                <div class="dash__avatar-small">AN</div>
              </div>
              <div class="dash__stats">
                <div class="dash__stat dash__stat--blue">
                  <div class="dash__stat-num">847</div>
                  <div class="dash__stat-label">Kursantów</div>
                </div>
                <div class="dash__stat dash__stat--green">
                  <div class="dash__stat-num">23</div>
                  <div class="dash__stat-label">Kursy</div>
                </div>
                <div class="dash__stat dash__stat--purple">
                  <div class="dash__stat-num">94%</div>
                  <div class="dash__stat-label">Ukończeń</div>
                </div>
              </div>
              <div class="dash__section-title">Aktywne kursy</div>
              <div class="dash__progress-section">
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#EEF2FF;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-name">Onboarding 2024</div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:72%;background:linear-gradient(90deg,#4F46E5,#2563EB);"></div></div>
                  </div>
                  <span class="dash__pct">72%</span>
                </div>
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#F0FDF4;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-name">Excel dla HR</div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:45%;background:linear-gradient(90deg,#059669,#10B981);"></div></div>
                  </div>
                  <span class="dash__pct">45%</span>
                </div>
                <div class="dash__row">
                  <div class="dash__row-icon" style="background:#FFFBEB;"></div>
                  <div class="dash__row-body">
                    <div class="dash__row-name">Compliance Q1</div>
                    <div class="dash__progress-bar"><div class="dash__progress-fill" style="width:89%;background:linear-gradient(90deg,#D97706,#F59E0B);"></div></div>
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
.hero__blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}
.hero__blob--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%);
  top: -150px;
  left: -150px;
}
.hero__blob--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  position: relative;
  z-index: 1;
}
.hero__content { max-width: 560px; }
.hero__title {
  font-size: clamp(48px, 6.5vw, 80px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.05;
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
.hero__cta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
.hero__trust {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}
.hero__trust strong { color: var(--text-primary); }
.hero__avatars { display: flex; margin-right: 4px; }
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
.hero__mockup { position: relative; }
.browser {
  background: var(--bg-surface);
  border-radius: 14px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-hover), 0 0 0 1px rgba(79,70,229,0.06);
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
.browser__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
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
.dash { display: flex; min-height: 340px; }
.dash__sidebar {
  width: 100px;
  background: #F8FAFF;
  border-right: 1px solid var(--border-subtle);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dash__logo-mark {
  width: 24px;
  height: 24px;
  background: var(--gradient-brand);
  border-radius: 6px;
  margin: 4px 4px 12px;
}
.dash__menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
}
.dash__menu-item--active { background: #EEF2FF; color: #4F46E5; font-weight: 600; }
.dash__menu-icon {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: var(--border-subtle);
  flex-shrink: 0;
}
.dash__menu-icon--active { background: #4F46E5; }
.dash__main { flex: 1; padding: 14px; overflow: hidden; }
.dash__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.dash__greeting { font-size: 12px; font-weight: 700; color: var(--text-primary); }
.dash__date { font-size: 10px; color: var(--text-secondary); margin-top: 2px; }
.dash__avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dash__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}
.dash__stat {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
}
.dash__stat--blue { background: #EEF2FF; }
.dash__stat--green { background: #F0FDF4; }
.dash__stat--purple { background: #F5F3FF; }
.dash__stat-num {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 2px;
}
.dash__stat-label { font-size: 9px; color: var(--text-secondary); font-weight: 500; }
.dash__section-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.dash__progress-section { display: flex; flex-direction: column; gap: 8px; }
.dash__row { display: flex; align-items: center; gap: 8px; }
.dash__row-icon { width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0; }
.dash__row-body { flex: 1; }
.dash__row-name { font-size: 10px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.dash__progress-bar { height: 5px; background: #F1F5F9; border-radius: 999px; overflow: hidden; }
.dash__progress-fill { height: 100%; border-radius: 999px; }
.dash__pct { font-size: 10px; font-weight: 700; color: var(--text-secondary); flex-shrink: 0; width: 26px; text-align: right; }
.hero__float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--shadow-hover);
  white-space: nowrap;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}
.hero__float--1 { top: -18px; right: -18px; animation-delay: 0s; }
.hero__float--2 { bottom: 48px; left: -28px; animation-delay: 1.5s; }
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
  .dash__sidebar { width: 70px; }
  .dash__menu-item span { display: none; }
}
</style>
```

- [x] **Step 2: Verify** — Large gradient blobs behind hero. "Rośnij pewniej." in gradient text. Dashboard shows sidebar with labels, stat cards (847, 23, 94%), named course rows with gradient progress bars.

- [x] **Step 3: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat: hero — gradient blobs, gradient H1, rich dashboard mockup, Ascent brand"
```

---

### Task 6: SocialProofBar — Gradient Numbers + Styled Chips

**Files:**
- Modify: `src/components/sections/SocialProofBar.astro`

- [x] **Step 1: Replace `src/components/sections/SocialProofBar.astro`**

```astro
---
const logos = [
  { name: 'TechFlow',  initials: 'TF', bg: '#EEF2FF', color: '#4F46E5' },
  { name: 'Nexora',    initials: 'NX', bg: '#F0FDF4', color: '#059669' },
  { name: 'Buildify',  initials: 'BF', bg: '#FFF7ED', color: '#D97706' },
  { name: 'Skyline',   initials: 'SK', bg: '#F5F3FF', color: '#7C3AED' },
  { name: 'Acme Corp', initials: 'AC', bg: '#EFF6FF', color: '#2563EB' },
];
const counters = [
  { target: 12000, display: '12 000+', label: 'Użytkowników' },
  { target: 500,   display: '500+',    label: 'Kursów' },
  { target: 98,    display: '98%',     label: 'Wskaźnik ukończeń' },
];
---

<div class="social-proof">
  <div class="container social-proof__inner">
    <div class="social-proof__logos">
      <span class="social-proof__label">Zaufały nam:</span>
      {logos.map(logo => (
        <div class="logo-chip" title={logo.name} aria-label={logo.name} style={`background:${logo.bg};`}>
          <span class="logo-chip__initials" style={`color:${logo.color};`}>{logo.initials}</span>
          <span class="logo-chip__name">{logo.name}</span>
        </div>
      ))}
    </div>
    <div class="social-proof__divider" aria-hidden="true"></div>
    <div class="social-proof__stats">
      {counters.map(c => (
        <div class="stat-item">
          <span class="stat-item__num counter gradient-text" data-target={c.target} data-display={c.display}>{c.display}</span>
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
.social-proof__logos { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.social-proof__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-right: 4px;
}
.logo-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: opacity 0.2s;
}
.logo-chip:hover { opacity: 0.8; }
.logo-chip__initials { font-size: 12px; font-weight: 800; }
.logo-chip__name { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.social-proof__divider {
  width: 1px;
  height: 40px;
  background: var(--border-subtle);
  flex-shrink: 0;
}
.social-proof__stats { display: flex; align-items: center; gap: 40px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-item__num {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.stat-item__label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
@media (max-width: 1024px) { .social-proof__divider { display: none; } }
@media (max-width: 768px) {
  .social-proof__inner { flex-direction: column; align-items: flex-start; }
  .social-proof__stats { gap: 24px; }
  .stat-item__num { font-size: 24px; }
}
</style>
```

- [x] **Step 2: Verify** — Logo chips show colored initials (TF, NX…). Numbers (12 000+, 500+, 98%) in gradient text.

- [x] **Step 3: Commit**

```bash
git add src/components/sections/SocialProofBar.astro
git commit -m "feat: social proof — gradient counter numbers, styled logo chips"
```

---

### Task 7: Features — 2×2 Card Grid

**Files:**
- Modify: `src/components/sections/Features.astro`

- [x] **Step 1: Replace `src/components/sections/Features.astro`**

```astro
---
const features = [
  {
    iconBg: 'linear-gradient(135deg,#7C3AED,#4F46E5)',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    title: 'Tworzenie kursów bez kodu',
    desc: 'Drag & drop builder z obsługą wideo, quizów, zadań i materiałów PDF. Kurs gotowy w godziny, nie tygodnie.',
    previewBg: '#EEF2FF', previewAccent: '#4F46E5',
  },
  {
    iconBg: 'linear-gradient(135deg,#059669,#10B981)',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 4 4-6 4 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'Analityka postępów w czasie rzeczywistym',
    desc: 'Dashboard z danymi o ukończeniach, wynikach quizów i zaangażowaniu kursantów — dla każdego menedżera.',
    previewBg: '#F0FDF4', previewAccent: '#059669',
  },
  {
    iconBg: 'linear-gradient(135deg,#D97706,#F59E0B)',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 15l-4 4 1-5-4-3 5-1 2-5 2 5 5 1-4 3 1 5-4-4z" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`,
    title: 'Certyfikaty i odznaki',
    desc: 'Automatyczne generowanie certyfikatów PDF po ukończeniu kursu. Odznaki motywujące do dalszej nauki.',
    previewBg: '#FFFBEB', previewAccent: '#D97706',
  },
  {
    iconBg: 'linear-gradient(135deg,#0891B2,#06B6D4)',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" stroke="white" stroke-width="2"/><circle cx="19" cy="5" r="2" stroke="white" stroke-width="2"/><circle cx="19" cy="19" r="2" stroke="white" stroke-width="2"/><path d="M7 12h5m2-5l-2 3m2 5l-2-3" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    title: 'Integracje z Twoimi narzędziami',
    desc: 'SSO (SAML, OAuth), Slack, Zapier, REST API — Ascent wpasowuje się w Twój stack bez friction.',
    previewBg: '#ECFEFF', previewAccent: '#0891B2',
  },
];
---

<section class="features" id="features">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Jak to działa</span>
      <h2 class="section-title">Wszystko, czego potrzebujesz</h2>
      <p class="section-subtitle">Cztery filary skutecznej nauki w organizacji.</p>
    </div>
    <div class="features__grid">
      {features.map((f, i) => (
        <div class={`feature-card reveal reveal-d${(i % 2) + 1}`}>
          <div class="feature-card__icon" style={`background:${f.iconBg};`} set:html={f.icon} />
          <h3 class="feature-card__title">{f.title}</h3>
          <p class="feature-card__desc">{f.desc}</p>
          <div class="feature-card__preview" style={`background:${f.previewBg};`}>
            <div class="preview__bar" style={`background:${f.previewAccent};opacity:0.2;`}></div>
            <div class="preview__lines">
              <div class="preview__line" style={`background:${f.previewAccent};opacity:0.25;width:70%;`}></div>
              <div class="preview__line" style={`background:${f.previewAccent};opacity:0.18;width:50%;`}></div>
              <div class="preview__line" style={`background:${f.previewAccent};opacity:0.12;width:85%;`}></div>
            </div>
            <div class="preview__blocks">
              <div class="preview__block" style={`background:${f.previewAccent};opacity:0.15;`}></div>
              <div class="preview__block" style={`background:${f.previewAccent};opacity:0.2;`}></div>
              <div class="preview__block" style={`background:${f.previewAccent};opacity:0.12;`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
.features { background: var(--bg-primary); }
.features__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.feature-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: var(--transition);
  overflow: hidden;
}
.feature-card:hover {
  border-color: var(--border-brand);
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}
.feature-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.feature-card__title { font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.3; }
.feature-card__desc { font-size: 15px; color: var(--text-secondary); line-height: 1.65; }
.feature-card__preview {
  margin: 4px -32px -32px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100px;
}
.preview__bar { height: 24px; border-radius: 6px; }
.preview__lines { display: flex; flex-direction: column; gap: 6px; }
.preview__line { height: 8px; border-radius: 4px; }
.preview__blocks { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview__block { height: 36px; border-radius: 8px; }
@media (max-width: 768px) { .features__grid { grid-template-columns: 1fr; } }
</style>
```

- [x] **Step 2: Verify** — 4 feature cards in 2×2 grid. Gradient icons (purple, green, amber, teal). Tinted preview at bottom of each card. No sticky scroll behavior.

- [x] **Step 3: Commit**

```bash
git add src/components/sections/Features.astro
git commit -m "feat: features — 2x2 card grid, gradient icons, remove sticky scroll"
```

---

### Task 8: ForBusinessLearners — Gradient Border

**Files:**
- Modify: `src/components/sections/ForBusinessLearners.astro`

- [x] **Step 1: Replace `src/components/sections/ForBusinessLearners.astro`**

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
      <!-- Business: gradient border wrapper -->
      <div class="fbl__card--business reveal">
        <div class="fbl__card-inner">
          <div class="fbl__card-header">
            <span class="fbl__card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M9 21V7l6-4v18" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <div>
              <h3 class="fbl__card-title">Dla firm i organizacji</h3>
              <p class="fbl__card-sub">Skalowalne szkolenia dla całego zespołu</p>
            </div>
          </div>
          <ul class="fbl__list">
            {business.map(item => (
              <li class="fbl__list-item">
                <svg class="fbl__check" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {item}
              </li>
            ))}
          </ul>
          <a href="#contact" class="fbl__cta fbl__cta--gradient">Porozmawiaj z nami →</a>
        </div>
      </div>

      <!-- Learners: plain card -->
      <div class="fbl__card--learners reveal reveal-d2">
        <div class="fbl__card-header">
          <span class="fbl__card-icon fbl__card-icon--green">
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
.fbl__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

/* Gradient border: gradient wrapper + white inner */
.fbl__card--business {
  background: var(--gradient-brand);
  border-radius: calc(var(--radius) + 2px);
  padding: 2px;
  transition: var(--transition);
}
.fbl__card--business:hover { box-shadow: var(--shadow-glow); transform: translateY(-4px); }
.fbl__card-inner {
  background: #F5F3FF;
  border-radius: var(--radius);
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: 100%;
}

.fbl__card--learners {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  transition: var(--transition);
}
.fbl__card--learners:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); }

.fbl__card-header { display: flex; align-items: flex-start; gap: 16px; }
.fbl__card-icon {
  width: 56px;
  height: 56px;
  background: #fff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-soft);
}
.fbl__card-title { font-size: 22px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 4px; }
.fbl__card-sub { font-size: 14px; color: var(--text-secondary); }
.fbl__list { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.fbl__list-item { display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--text-primary); }
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
}
.fbl__cta--gradient {
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: 0 4px 20px rgba(79,70,229,0.35);
}
.fbl__cta--gradient:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,70,229,0.45); }
.fbl__cta--outline {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-subtle);
}
.fbl__cta--outline:hover { border-color: var(--brand-accent); color: var(--brand-accent); transform: translateY(-2px); }

@media (max-width: 768px) {
  .fbl__grid { grid-template-columns: 1fr; }
  .fbl__card--learners { padding: 28px; }
  .fbl__card-inner { padding: 28px; }
}
</style>
```

- [x] **Step 2: Verify** — Business card has gradient border (purple→blue glow on edges) with light purple inner. Business CTA is gradient. Learners card is plain white.

- [x] **Step 3: Commit**

```bash
git add src/components/sections/ForBusinessLearners.astro
git commit -m "feat: for-business — gradient border wrapper, gradient CTA"
```

---

### Task 9: Testimonials — Stars + Left Accent + Tinted Bg

**Files:**
- Modify: `src/components/sections/Testimonials.astro`

- [x] **Step 1: Replace `src/components/sections/Testimonials.astro`**

```astro
---
const testimonials = [
  {
    text: 'Wdrożenie Ascent zmniejszyło czas onboardingu nowych pracowników o 40%. Kurs można zbudować w ciągu jednego popołudnia i od razu przypisać całemu działowi.',
    name: 'Agnieszka Kowalska', role: 'Head of HR', company: 'TechFlow S.A.',
    initials: 'AK', color: '#7C3AED',
  },
  {
    text: 'Nareszcie mamy pełny wgląd w postępy szkoleń compliance. Raporty generują się jednym kliknięciem, a certyfikaty trafiają do pracowników automatycznie.',
    name: 'Marek Bąk', role: 'Chief People Officer', company: 'Nexora Group',
    initials: 'MB', color: '#0891B2',
  },
  {
    text: 'Jako twórca kursów cenię sobie prostotę buildera. Przeniosłem swój program mentoringowy na Ascent i w ciągu tygodnia miałem pierwszych płacących kursantów.',
    name: 'Piotr Wierzbicki', role: 'Business Coach', company: 'PW Academy',
    initials: 'PW', color: '#059669',
  },
];
---

<section class="testimonials">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Opinie</span>
      <h2 class="section-title">Co mówią nasi użytkownicy</h2>
      <p class="section-subtitle">Firmy i twórcy kursów, którzy już uczą z Ascent.</p>
    </div>
    <div class="testimonials__carousel" id="testimonialsCarousel">
      <div class="testimonials__track" id="testimonialsTrack">
        {testimonials.map((t, i) => (
          <div class={`testimonials__card reveal reveal-d${i + 1}`}>
            <div class="testimonials__stars" aria-label="Ocena: 5 gwiazdek">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <p class="testimonials__text">{t.text}</p>
            <div class="testimonials__author">
              <span class="testimonials__avatar" style={`background:${t.color};`} aria-hidden="true">{t.initials}</span>
              <div>
                <div class="testimonials__name">{t.name}</div>
                <div class="testimonials__role">{t.role} · {t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div class="testimonials__dots" id="testimonialsDots" aria-label="Nawigacja karuzeli">
      {testimonials.map((_, i) => (
        <button class={`testimonials__dot${i === 0 ? ' active' : ''}`} data-index={i} aria-label={`Opinia ${i + 1}`}></button>
      ))}
    </div>
  </div>
</section>

<style>
.testimonials { background: var(--bg-tinted); }
.testimonials__carousel { overflow: hidden; width: 100%; }
.testimonials__track { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.testimonials__card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-left: 4px solid #7C3AED;
  border-radius: var(--radius);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: var(--transition);
}
.testimonials__card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.testimonials__stars { color: #F59E0B; font-size: 17px; letter-spacing: 1px; }
.testimonials__text { font-size: 15px; color: var(--text-primary); line-height: 1.75; flex: 1; }
.testimonials__author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle);
}
.testimonials__avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.testimonials__name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.testimonials__role { font-size: 13px; color: var(--text-secondary); }
.testimonials__dots { display: none; justify-content: center; gap: 8px; margin-top: 24px; }
.testimonials__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--border-subtle); border: none; cursor: pointer;
  transition: var(--transition); padding: 0;
}
.testimonials__dot.active { background: var(--brand-accent); transform: scale(1.3); }
@media (max-width: 768px) {
  .testimonials__track { display: flex; will-change: transform; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
  .testimonials__card { width: 100%; min-width: 100%; flex: 0 0 100%; box-sizing: border-box; flex-shrink: 0; }
  .testimonials__dots { display: flex; }
}
</style>

<script>
const carousel = document.getElementById('testimonialsCarousel');
const track = document.getElementById('testimonialsTrack');
const cards = track?.querySelectorAll<HTMLElement>('.testimonials__card');
const dots = document.querySelectorAll<HTMLButtonElement>('.testimonials__dot');
let current = 0;
let startX = 0;
function isMobile() { return window.innerWidth <= 768; }
function updateCardWidths() {
  if (!carousel || !cards) return;
  if (isMobile()) { const w = carousel.offsetWidth; cards.forEach(c => { c.style.width = w + 'px'; }); }
  else { cards.forEach(c => { c.style.width = ''; }); }
}
function goTo(index: number) {
  if (!track || !carousel) return;
  current = index;
  if (isMobile()) { track.style.transform = `translateX(-${index * carousel.offsetWidth}px)`; }
  else { track.style.transform = ''; }
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}
dots.forEach(dot => { dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index ?? '0'))); });
updateCardWidths();
window.addEventListener('resize', () => { updateCardWidths(); if (!isMobile()) { if (track) track.style.transform = ''; } else goTo(current); });
track?.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', (e) => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(diff > 0 ? Math.min(current + 1, dots.length - 1) : Math.max(current - 1, 0));
});
</script>
```

- [x] **Step 2: Verify** — Tinted blue-ish section background. Gold stars (★★★★★) on each card. Purple left border on each card. Text says "Ascent".

- [x] **Step 3: Commit**

```bash
git add src/components/sections/Testimonials.astro
git commit -m "feat: testimonials — star ratings, purple left border, tinted bg, Ascent brand"
```

---

### Task 10: Pricing — Gradient Pro Card

**Files:**
- Modify: `src/components/sections/Pricing.astro`

- [x] **Step 1: Replace `src/components/sections/Pricing.astro`**

```astro
---
const plans = [
  {
    name: 'Basic', desc: 'Dla małych zespołów i indywidualnych twórców',
    priceMonthly: 49, priceYearly: 39,
    cta: 'Zacznij za darmo', ctaHref: '#signup', featured: false,
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
    name: 'Pro', desc: 'Dla rosnących firm z pełnymi potrzebami szkoleniowymi',
    priceMonthly: 149, priceYearly: 119,
    cta: 'Wybierz Pro', ctaHref: '#signup-pro', featured: true,
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
    name: 'Enterprise', desc: 'Dla dużych organizacji z niestandardowymi wymaganiami',
    priceMonthly: null, priceYearly: null,
    cta: 'Zapytaj o ofertę', ctaHref: '#contact', featured: false,
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
    <div class="pricing__toggle reveal" id="pricingToggleWrap">
      <span class="pricing__toggle-label">Miesięcznie</span>
      <button class="pricing__toggle-btn" id="pricingToggle" role="switch" aria-checked="false" aria-label="Przełącz rozliczenie roczne">
        <span class="pricing__toggle-thumb"></span>
      </button>
      <span class="pricing__toggle-label">Rocznie <span class="pricing__save-badge">Oszczędź 20%</span></span>
    </div>
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
                <span class="pricing__amount" data-monthly={plan.priceMonthly} data-yearly={plan.priceYearly}>{plan.priceMonthly}</span>
                <span class="pricing__period">/miesiąc</span>
              </>
            ) : (
              <span class="pricing__custom">Skontaktuj się</span>
            )}
          </div>
          <a href={plan.ctaHref} class={`pricing__cta${plan.featured ? ' pricing__cta--white' : ' pricing__cta--outline'}`}>{plan.cta}</a>
          <ul class="pricing__features">
            {plan.features.map(f => (
              <li class={`pricing__feature${f.included ? '' : ' pricing__feature--disabled'}`}>
                {f.included ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={plan.featured ? 'rgba(255,255,255,0.9)' : '#4F46E5'} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={plan.featured ? 'rgba(255,255,255,0.3)' : '#CBD5E1'} stroke-width="2" stroke-linecap="round"/></svg>
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
.pricing__toggle { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 48px; }
.pricing__toggle-label { font-size: 15px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
.pricing__save-badge { background: #DCFCE7; color: #166534; font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
.pricing__toggle-btn { width: 48px; height: 26px; background: var(--border-subtle); border-radius: 999px; position: relative; transition: background 0.3s ease; flex-shrink: 0; }
.pricing__toggle-btn[aria-checked="true"] { background: var(--gradient-brand); }
.pricing__toggle-thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.15); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
.pricing__toggle-btn[aria-checked="true"] .pricing__toggle-thumb { transform: translateX(22px); }
.pricing__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing__card { background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius); padding: 32px; position: relative; transition: var(--transition); }
.pricing__card:not(.pricing__card--featured):hover { border-color: var(--border-brand); box-shadow: var(--shadow-hover); }
.pricing__card--featured { background: var(--gradient-brand); border: none; transform: scale(1.03); box-shadow: var(--shadow-glow); }
.pricing__card--featured .pricing__plan-name,
.pricing__card--featured .pricing__amount,
.pricing__card--featured .pricing__custom { color: #fff; }
.pricing__card--featured .pricing__plan-desc,
.pricing__card--featured .pricing__currency { color: rgba(255,255,255,0.75); }
.pricing__card--featured .pricing__period { color: rgba(255,255,255,0.6); }
.pricing__card--featured .pricing__feature { color: rgba(255,255,255,0.9); }
.pricing__card--featured .pricing__feature--disabled { color: rgba(255,255,255,0.35); }
.pricing__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #fff; color: #4F46E5; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 999px; white-space: nowrap; box-shadow: 0 2px 8px rgba(79,70,229,0.2); }
.pricing__plan-name { font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; letter-spacing: -0.02em; }
.pricing__plan-desc { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5; min-height: 42px; }
.pricing__price { display: flex; align-items: flex-end; gap: 4px; margin-bottom: 24px; }
.pricing__currency { font-size: 20px; font-weight: 600; color: var(--text-secondary); line-height: 1.8; }
.pricing__amount { font-size: 48px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; line-height: 1; }
.pricing__period { font-size: 14px; color: var(--text-secondary); margin-bottom: 6px; }
.pricing__custom { font-size: 28px; font-weight: 700; color: var(--text-primary); }
.pricing__cta { display: block; text-align: center; padding: 13px 20px; border-radius: var(--radius-btn); font-size: 15px; font-weight: 600; transition: var(--transition); margin-bottom: 28px; text-decoration: none; }
.pricing__cta--white { background: #fff; color: #4F46E5; box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
.pricing__cta--white:hover { background: #F5F3FF; transform: translateY(-2px); }
.pricing__cta--outline { background: transparent; color: var(--text-primary); border: 1.5px solid var(--border-subtle); }
.pricing__cta--outline:hover { border-color: var(--brand-accent); color: var(--brand-accent); transform: translateY(-2px); }
.pricing__features { display: flex; flex-direction: column; gap: 11px; }
.pricing__feature { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--text-primary); }
.pricing__feature svg { flex-shrink: 0; }
.pricing__feature--disabled { color: var(--text-secondary); }
@media (max-width: 1024px) { .pricing__grid { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; } .pricing__card--featured { transform: none; } }
</style>

<script>
const toggle = document.getElementById('pricingToggle');
const amounts = document.querySelectorAll<HTMLElement>('.pricing__amount');
let isYearly = false;
toggle?.addEventListener('click', () => {
  isYearly = !isYearly;
  toggle.setAttribute('aria-checked', String(isYearly));
  amounts.forEach(el => {
    el.textContent = String(isYearly ? parseInt(el.dataset.yearly ?? '0') : parseInt(el.dataset.monthly ?? '0'));
  });
});
</script>
```

- [x] **Step 2: Verify** — Pro card has gradient background (purple→blue), white text, white CTA button with indigo text. "Najpopularniejszy" badge is white with indigo text. Check marks in Pro are white.

- [x] **Step 3: Commit**

```bash
git add src/components/sections/Pricing.astro
git commit -m "feat: pricing — gradient Pro card with white text and CTA"
```

---

### Task 11: FAQ — Chevron + Gradient Active Text

**Files:**
- Modify: `src/components/sections/FAQ.astro`

- [x] **Step 1: Replace `src/components/sections/FAQ.astro`**

```astro
---
const items = [
  { q: 'Jak długo trwa darmowy okres próbny?', a: 'Oferujemy 14-dniowy bezpłatny okres próbny na planie Pro bez podawania karty kredytowej. Po jego zakończeniu możesz wybrać plan lub przejść na bezpłatny Basic.' },
  { q: 'Czy mogę importować kursy z innych platform?', a: 'Tak — obsługujemy import plików SCORM 1.2 i 2004. Możesz też przenieść materiały wideo i PDF bezpośrednio przez panel administracyjny.' },
  { q: 'Jakie integracje są dostępne?', a: 'Integrujemy się z popularnymi narzędziami HR (BambooHR, Workday), komunikatorami (Slack, Teams), narzędziami automatyzacji (Zapier, Make) oraz obsługujemy SSO przez SAML i OAuth2.' },
  { q: 'Czy platforma działa w języku polskim?', a: 'Tak, interfejs platformy jest w pełni dostępny w języku polskim. Obsługujemy również angielski, niemiecki i inne języki — możliwość wybrania przez kursanta.' },
  { q: 'Jak wygląda wsparcie techniczne?', a: 'Plan Basic obejmuje wsparcie e-mail w dni robocze. Plan Pro dodaje czat na żywo. Plan Enterprise oferuje dedykowanego opiekuna konta i wsparcie 24/7.' },
  { q: 'Czy mogę używać własnej domeny?', a: 'Tak, od planu Pro wzwyż możesz skonfigurować własną domenę (np. nauka.twojaFirma.pl) i pełne white-labeling — logo, kolory, e-maile z Twojej domeny.' },
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
            <span class="faq__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
          <div class={`faq__answer${i === 0 ? ' open' : ''}`} id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-btn-${i}`}>
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
.faq { background: var(--bg-surface); }
.faq__list { max-width: 720px; margin: 0 auto; }
.faq__item { border-bottom: 1px solid var(--border-subtle); }
.faq__item:first-child { border-top: 1px solid var(--border-subtle); }
.faq__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
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
.faq__question.open {
  background: var(--gradient-brand-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.faq__icon {
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  display: flex;
  align-items: center;
  /* prevent gradient from clipping icon */
  -webkit-text-fill-color: initial;
  background: none;
}
.faq__question.open .faq__icon { transform: rotate(180deg); color: var(--brand-accent); }
.faq__answer { overflow: hidden; max-height: 0; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1); }
.faq__answer.open { max-height: 500px; }
.faq__answer p { padding-bottom: 20px; font-size: 15px; color: var(--text-secondary); line-height: 1.75; }
</style>

<script>
document.querySelectorAll<HTMLButtonElement>('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.classList.contains('open');
    const answerId = btn.getAttribute('aria-controls');
    const answer = answerId ? document.getElementById(answerId) : null;
    document.querySelectorAll('.faq__question').forEach(b => { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); });
    document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));
    if (!isOpen && answer) { btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); answer.classList.add('open'); }
  });
});
</script>
```

- [x] **Step 2: Verify** — Chevron SVG icon rotates 180° on open. Open question text is gradient purple→blue. Icon stays its own color (not clipped by gradient).

- [x] **Step 3: Commit**

```bash
git add src/components/sections/FAQ.astro
git commit -m "feat: FAQ — chevron icon, gradient text on open question"
```

---

### Task 12: FinalCTA — Gradient Background + Glow

**Files:**
- Modify: `src/components/sections/FinalCTA.astro`

- [x] **Step 1: Replace `src/components/sections/FinalCTA.astro`**

```astro
---
import Button from '../ui/Button.astro';
---

<section class="final-cta">
  <svg class="final-cta__pattern" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <pattern id="cta-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="white"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#cta-dots)"/>
  </svg>
  <div class="final-cta__orb final-cta__orb--1" aria-hidden="true"></div>
  <div class="final-cta__orb final-cta__orb--2" aria-hidden="true"></div>

  <div class="container final-cta__inner">
    <h2 class="final-cta__title reveal">Gotowy, żeby zacząć?</h2>
    <p class="final-cta__sub reveal reveal-d1">Dołącz do ponad 1 200 firm, które zaufały Ascent i zmień sposób, w jaki Twój zespół się uczy.</p>
    <div class="final-cta__actions reveal reveal-d2">
      <Button variant="white" href="#signup">Rozpocznij za darmo</Button>
      <a href="#contact" class="final-cta__link">Porozmawiaj z nami →</a>
    </div>
    <p class="final-cta__note reveal reveal-d3">Bez karty kredytowej · 14 dni za darmo · Anuluj kiedy chcesz</p>
  </div>
</section>

<style>
.final-cta {
  background: var(--gradient-brand);
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  text-align: center;
}
.final-cta__pattern { position: absolute; inset: 0; opacity: 0.06; pointer-events: none; }
.final-cta__orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(60px); }
.final-cta__orb--1 { width: 400px; height: 400px; background: rgba(255,255,255,0.1); top: -100px; left: -80px; }
.final-cta__orb--2 { width: 300px; height: 300px; background: rgba(255,255,255,0.08); bottom: -80px; right: -60px; }
.final-cta__inner { position: relative; z-index: 1; }
.final-cta__title { font-size: clamp(36px, 5vw, 56px); font-weight: 900; letter-spacing: -0.03em; color: #fff; margin-bottom: 20px; line-height: 1.1; }
.final-cta__sub { font-size: 18px; color: rgba(255,255,255,0.85); max-width: 520px; margin: 0 auto 40px; line-height: 1.65; }
.final-cta__actions { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.final-cta__link { color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 600; transition: color 0.2s; }
.final-cta__link:hover { color: #fff; }
.final-cta__note { font-size: 13px; color: rgba(255,255,255,0.6); }
@media (max-width: 640px) { .final-cta { padding: 80px 0; } .final-cta__actions { flex-direction: column; align-items: center; } }
</style>
```

- [x] **Step 2: Verify** — Gradient background (purple→blue). Two subtle white glow orbs in corners. Dot pattern overlay. Text says "Ascent".

- [x] **Step 3: Commit**

```bash
git add src/components/sections/FinalCTA.astro
git commit -m "feat: final CTA — gradient background, glow orbs, Ascent brand"
```

---

### Task 13: Footer — Ascent Logo + Brand Name

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [x] **Step 1: In `src/components/layout/Footer.astro`, replace the logo SVG and brand references**

Replace:
```html
<svg width="28" height="28" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#2563EB"/>
  <path d="M8 22L16 10l8 12H8z" fill="white"/>
</svg>
<span>[Nazwa Platformy]</span>
```

With:
```html
<svg width="28" height="28" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.15)"/>
  <path d="M8 22l8-12 8 12" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M8 17l8-12 8 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
<span>Ascent</span>
```

Replace `aria-label="[Nazwa Platformy]"` → `aria-label="Ascent"`.

Replace `© {year} [Nazwa Platformy]. Wszelkie prawa zastrzeżone.` → `© {year} Ascent. Wszelkie prawa zastrzeżone.`

- [x] **Step 2: Verify** — Footer shows "Ascent" with double-chevron logo on dark background. Copyright reads "© 2026 Ascent."

- [x] **Step 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: footer — Ascent logo and brand name"
```

---

## Self-Review

**Spec coverage:** All 13 spec items covered across 13 tasks. ✅

**Placeholder scan:** No TBDs. All file paths explicit. All code blocks complete. ✅

**Type consistency:**
- `variant="gradient"` defined in Task 2, used in Tasks 4, 5 ✅
- `--gradient-brand` defined in Task 1, used in Tasks 4, 7, 8, 10, 12 ✅
- `.gradient-text` defined in Task 1, used in Tasks 5, 6, 11 ✅
- `--bg-tinted` defined in Task 1, used in Task 9 ✅
- `--shadow-glow` defined in Task 1, used in Tasks 8, 10 ✅
