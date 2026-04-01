# German Language + Dropdown Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add German (DE) as a third language and replace the single-link language button in Navbar with a CSS dropdown supporting EN / PL / DE.

**Architecture:** Extend `src/i18n/index.ts` with a `'de'` lang variant plus shared `languageRoutes` and `languageLabels` maps, add a `de.ts` translation file, create a `/de/` page, and rewrite the Navbar language switcher as a click-toggled CSS dropdown. The `langSwitch`/`langSwitchHref` keys are removed from translation files — the Navbar now reads routes from the shared maps.

**Tech Stack:** Astro 4, TypeScript, vanilla CSS + JS (no external libraries)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/i18n/index.ts` | Add `'de'` to Lang, add `languageRoutes` and `languageLabels` maps |
| Create | `src/i18n/de.ts` | Full German translations |
| Modify | `src/i18n/en.ts` | Remove `langSwitch`, `langSwitchHref` from `nav` |
| Modify | `src/i18n/pl.ts` | Remove `langSwitch`, `langSwitchHref` from `nav` |
| Create | `src/pages/de/index.astro` | German page route |
| Modify | `src/components/layout/Navbar.astro` | Dropdown UI, updated translation lookup |

---

### Task 1: Extend `src/i18n/index.ts`

**Files:**
- Modify: `src/i18n/index.ts`

- [ ] **Step 1: Replace the file contents**

```typescript
export type Lang = 'en' | 'pl' | 'de';
export const defaultLang: Lang = 'en';
export const languages: Lang[] = ['en', 'pl', 'de'];

export const languageRoutes: Record<Lang, string> = {
  en: '/',
  pl: '/pl/',
  de: '/de/',
};

export const languageLabels: Record<Lang, string> = {
  en: 'EN',
  pl: 'PL',
  de: 'DE',
};
```

- [ ] **Step 2: Verify TypeScript accepts the change**

Run: `npx astro check`
Expected: No errors from `index.ts` itself. (Errors from `en.ts`/`pl.ts` about `langSwitch` are expected at this stage — they will be fixed in Task 3.)

- [ ] **Step 3: Commit**

```bash
git add src/i18n/index.ts
git commit -m "feat(i18n): extend Lang to include 'de', add languageRoutes and languageLabels"
```

---

### Task 2: Remove `langSwitch`/`langSwitchHref` from translation files

> **Must run before Task 3** — removing these keys from `en.ts` changes `type Translations = typeof en`, which determines what `de.ts` must contain.

**Files:**
- Modify: `src/i18n/en.ts`
- Modify: `src/i18n/pl.ts`

- [ ] **Step 1: Remove `langSwitch` and `langSwitchHref` from `en.ts` nav section**

In `src/i18n/en.ts`, replace the `nav` block (lines 6–15) with:

```typescript
  nav: {
    features: 'Features',
    pricing: 'Pricing',
    business: 'For Business',
    faq: 'FAQ',
    login: 'Log in',
    cta: 'Get started',
  },
```

The `export type Translations = typeof en` at the bottom of the file automatically propagates this change.

- [ ] **Step 2: Remove `langSwitch` and `langSwitchHref` from `pl.ts` nav section**

In `src/i18n/pl.ts`, replace the `nav` block (lines 8–17) with:

```typescript
  nav: {
    features: 'Funkcje',
    pricing: 'Cennik',
    business: 'Dla firm',
    faq: 'FAQ',
    login: 'Zaloguj się',
    cta: 'Zacznij teraz',
  },
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/en.ts src/i18n/pl.ts
git commit -m "refactor(i18n): remove langSwitch/langSwitchHref keys from nav translations"
```

---

### Task 3: Create German translation file

**Files:**
- Create: `src/i18n/de.ts`

- [ ] **Step 1: Create the file with full German translations**

```typescript
import type { Translations } from './en';

export const de: Translations = {
  meta: {
    title: 'Ascent — White-Label-Trainingsplattform',
    description: 'White-Label-LMS. In wenigen Tagen eingerichtet. Schulen Sie Ihr gesamtes Team ohne steigende Kosten.',
  },
  nav: {
    features: 'Funktionen',
    pricing: 'Preise',
    business: 'Für Unternehmen',
    faq: 'FAQ',
    login: 'Anmelden',
    cta: 'Jetzt starten',
  },
  hero: {
    badge: '✦ White-Label-LMS für Unternehmen',
    title1: 'White-Label-Trainingsplattform.',
    title2: 'In wenigen Tagen eingerichtet.',
    subtitle: 'Schulen Sie Ihr gesamtes Team ohne steigende Kosten.',
    ctaPrimary: 'Jetzt starten',
    ctaSecondary: 'Demo ansehen →',
    trust: 'Vertraut von über <strong>1.200 Unternehmen</strong>, die mit Ascent schulen',
    usps: ['Keine Gebühren pro Nutzer', 'White-Label', 'Schnelle Einrichtung', 'Enterprise-Qualität'],
    floatComplete: 'Kurs abgeschlossen!',
    floatStat: '+24 % Produktivität',
    dashGreeting: 'Guten Morgen, Anna 👋',
    dashDate: 'Dienstag, 1. April 2026',
    dashCourses: 'Kurse',
    dashLearners: 'Lernende',
    dashCompleted: 'Abschlüsse',
    dashActiveCourses: 'Aktive Kurse',
  },
  socialProof: {
    trusted: 'Vertraut von:',
    stats: [
      { display: '12.000+', label: 'Lernende' },
      { display: '500+', label: 'Kurse' },
      { display: '98 %', label: 'Abschlussquote' },
    ],
  },
  features: {
    label: 'Warum Ascent',
    title: 'Alles, was Sie für Schulungen brauchen',
    subtitle: 'Vier Säulen effektiven organisationalen Lernens.',
    items: [
      {
        title: 'Keine Gebühren pro Nutzer — niemals',
        desc: 'Eine monatliche Pauschalgebühr, egal wie viele Personen Sie schulen. Fügen Sie 10 oder 10.000 Lernende hinzu — Ihre Rechnung bleibt gleich.',
      },
      {
        title: 'Vollständiges White-Label',
        desc: 'Ihre Marke, Ihre Domain, Ihre Farben. Lernende sehen Ihr Unternehmen — nicht unseres. Eigene E-Mails, eigene Anmeldung, vollständig gebrandmarkt.',
      },
      {
        title: 'Live in Tagen, nicht Monaten',
        desc: 'Wir kümmern uns um die technische Einrichtung, damit Sie sich auf Inhalte konzentrieren können. SCORM importieren, Videos hochladen und schneller live gehen als jede Alternative.',
      },
      {
        title: 'Enterprise-Qualität',
        desc: 'SSO (SAML, OAuth), erweiterte Analysen, Compliance-Reporting und SCORM 2004 — entwickelt für Organisationen, die Schulungen ernst nehmen.',
      },
    ],
  },
  forBusiness: {
    label: 'Für alle',
    title: 'Entwickelt für Ihre Organisation',
    subtitle: 'Ob Sie unternehmensweite Schulungen verwalten oder Kurse für Kunden erstellen.',
    business: {
      title: 'Für Unternehmen & Organisationen',
      sub: 'Skalierbare Schulungen für Ihr gesamtes Team',
      items: [
        'Unbegrenzte Nutzer — keine Gebühren pro Sitz',
        'Vollständiges White-Label & eigene Domain',
        'Teamverwaltung & Berechtigungen',
        'Compliance-Reporting & Audit-Logs',
        'Onboarding-Workflows',
        'HR- & SSO-Integrationen',
      ],
      cta: 'Sprechen Sie mit uns →',
    },
    learners: {
      title: 'Für Lernende',
      sub: 'Lernen Sie in Ihrem eigenen Tempo, auf jedem Gerät',
      items: [
        'Selbstgesteuertes Lernen auf jedem Gerät',
        'Vom Arbeitgeber anerkannte Zertifikate',
        'Interaktive Quizze & Aufgaben',
        'Eigenen Fortschritt verfolgen',
        'Offline-Zugang zu Materialien',
        'Community & Diskussionsforen',
      ],
      cta: 'Jetzt lernen →',
    },
  },
  testimonials: {
    label: 'Referenzen',
    title: 'Geliebt von Schulungsteams',
  },
  pricing: {
    label: 'Preise',
    title: 'Einmalige Einrichtung. Keine Gebühren pro Nutzer. Niemals.',
    subtitle: 'Einfache, planbare Preise, die mit Ihrer Organisation skalieren — nicht mit Ihrer Mitarbeiterzahl.',
    setup: 'einmalige Einrichtung',
    monthly: '/Monat',
    addOnLabel: 'Add-on',
    currency: '$',
    plans: [
      {
        name: 'Plattform',
        desc: 'Alles, was Sie brauchen, um Ihr Team im großen Maßstab zu schulen.',
        setupFee: 3000,
        monthlyFee: 100,
        featured: false,
        cta: 'Jetzt starten',
        ctaHref: '#signup',
        features: [
          'Unbegrenzte Nutzer',
          'Unbegrenzte Kurse',
          'Einfaches White-Label (Ihr Logo & Farben)',
          'SCORM 1.2 & 2004 Unterstützung',
          'Analysen & Fortschrittsverfolgung',
          'Zertifikate',
          'E-Mail-Support',
        ],
        addOn: null,
      },
      {
        name: 'Plattform + Marke',
        desc: 'Vollständige Markenanpassung für ein nahtloses Lernerlebnis.',
        setupFee: 3000,
        monthlyFee: 1100,
        featured: true,
        cta: 'Jetzt starten',
        ctaHref: '#signup-brand',
        features: [
          'Alles in Plattform',
          'Eigene Domain (lernen.ihrUnternehmen.de)',
          'Gebrandmarkte E-Mails von Ihrer Domain',
          'Eigene Login-Seite & CSS',
          'Prioritätssupport',
          'SSO (SAML, OAuth)',
          'Dediziertes Onboarding',
        ],
        addOn: 'Markenanpassung: $1.000/Monat',
      },
      {
        name: 'Individuell',
        desc: 'Maßgeschneiderte Entwicklung und Integrationen für Enterprise-Anforderungen.',
        setupFee: null,
        monthlyFee: null,
        featured: false,
        cta: 'Kontakt aufnehmen',
        ctaHref: '#contact',
        features: [
          'Alles in Plattform + Marke',
          'Individuelle Funktionsentwicklung',
          'Individuelle Integrationen & API',
          'Erweiterte Analysen & BI',
          'SLA & 24/7-Support',
          'Dedizierter Account-Manager',
          'White-Glove-Onboarding',
        ],
        addOn: null,
      },
    ],
    note: 'Alle Pläne beinhalten unbegrenzte Nutzer. Keine Gebühren pro Sitz. Niemals.',
    customDev: 'Individuelle Entwicklungsoptionen verfügbar — kontaktieren Sie uns.',
  },
  faq: {
    label: 'FAQ',
    title: 'Häufig gestellte Fragen',
    items: [
      {
        q: 'Was umfasst die Einrichtungsgebühr?',
        a: 'Die einmalige Einrichtungsgebühr von 3.000 $ umfasst Plattformkonfiguration, White-Label-Branding-Einrichtung, Unterstützung bei der Inhaltsmigration und eine praktische Onboarding-Sitzung. Sie sind in wenigen Tagen live und schulen.',
      },
      {
        q: 'Gibt es wirklich keine Gebühren pro Nutzer?',
        a: 'Keine. Niemals. Zahlen Sie $100/Monat pauschal, egal ob Sie 10 oder 10.000 Lernende haben. Ihre Schulungskosten wachsen nicht mit Ihrem Team.',
      },
      {
        q: 'Was ist in der Markenanpassung enthalten?',
        a: 'Das Marken-Add-on ($1.000/Monat) umfasst eine eigene Domain (z.B. lernen.ihrUnternehmen.de), gebrandmarkte E-Mails von Ihrer eigenen Domain, eine vollständig angepasste Login-Seite, eigenes CSS und SSO-Integration.',
      },
      {
        q: 'Kann ich Kurse von anderen Plattformen importieren?',
        a: 'Ja — wir unterstützen SCORM 1.2- und 2004-Import. Sie können auch Video- und PDF-Materialien direkt über das Admin-Panel migrieren.',
      },
      {
        q: 'Welche Sprachen unterstützt die Plattform?',
        a: 'Die Lernoberfläche unterstützt Englisch, Polnisch, Deutsch und mehr. Lernende können ihre bevorzugte Sprache wählen. Das Admin-Panel ist auf Englisch und Polnisch verfügbar.',
      },
      {
        q: 'Welche Integrationen sind verfügbar?',
        a: 'Wir integrieren uns mit gängigen HR-Tools (BambooHR, Workday), Kommunikationsplattformen (Slack, Teams), Automatisierungstools (Zapier, Make) und unterstützen SSO über SAML und OAuth2.',
      },
    ],
  },
  finalCta: {
    title: 'Bereit anzufangen?',
    sub: 'Schließen Sie sich über 1.200 Unternehmen an, die mit Ascent schulen — eine Pauschalgebühr, unbegrenzte Lernende.',
    cta: 'Jetzt starten',
    link: 'Sprechen Sie mit uns →',
    note: 'Keine Kreditkarte · $3.000 Einrichtung · Keine Gebühren pro Nutzer',
  },
  footer: {
    desc: 'White-Label-Trainingsplattform für Organisationen jeder Größe. In wenigen Tagen eingerichtet, im großen Maßstab schulen ohne steigende Kosten.',
    product: 'Produkt',
    company: 'Unternehmen',
    resources: 'Ressourcen',
    productLinks: ['Funktionen', 'Preise', 'Integrationen', 'Changelog', 'Systemstatus'],
    companyLinks: ['Über uns', 'Blog', 'Karriere', 'Partner', 'Kontakt'],
    resourceLinks: ['Dokumentation', 'API', 'Hilfezentrum', 'Community', 'Webinare'],
    copyright: 'Alle Rechte vorbehalten.',
    privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen',
    cookies: 'Cookies',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/de.ts
git commit -m "feat(i18n): add German (DE) translations"
```

---

### Task 4: Create German page route

**Files:**
- Create: `src/pages/de/index.astro`

- [ ] **Step 1: Create the file**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navbar from '../../components/layout/Navbar.astro';
import Footer from '../../components/layout/Footer.astro';
import Hero from '../../components/sections/Hero.astro';
import SocialProofBar from '../../components/sections/SocialProofBar.astro';
import Features from '../../components/sections/Features.astro';
import ForBusinessLearners from '../../components/sections/ForBusinessLearners.astro';
import Testimonials from '../../components/sections/Testimonials.astro';
import Pricing from '../../components/sections/Pricing.astro';
import FAQ from '../../components/sections/FAQ.astro';
import FinalCTA from '../../components/sections/FinalCTA.astro';

const lang = 'de' as const;
---

<BaseLayout lang={lang}>
  <Navbar lang={lang} />
  <main>
    <Hero lang={lang} />
    <SocialProofBar lang={lang} />
    <Features lang={lang} />
    <ForBusinessLearners lang={lang} />
    <Testimonials />
    <Pricing lang={lang} />
    <FAQ lang={lang} />
    <FinalCTA lang={lang} />
  </main>
  <Footer lang={lang} />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/de/index.astro
git commit -m "feat: add /de/ page route for German language"
```

---

### Task 5: Rewrite Navbar with language dropdown

**Files:**
- Modify: `src/components/layout/Navbar.astro`

- [ ] **Step 1: Replace the frontmatter section (lines 1–9)**

```astro
---
import Button from '../ui/Button.astro';
import type { Lang } from '../../i18n/index';
import { languageRoutes, languageLabels, languages } from '../../i18n/index';
import { en } from '../../i18n/en';
import { pl } from '../../i18n/pl';
import { de } from '../../i18n/de';

interface Props { lang?: Lang; }
const { lang = 'en' } = Astro.props;
const t = (lang === 'de' ? de : lang === 'pl' ? pl : en).nav;
---
```

- [ ] **Step 2: Replace the desktop language button (lines 37–43) with a dropdown**

Find this block:
```astro
      <a href={t.langSwitchHref} class="navbar__lang-btn" aria-label="Switch language">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
        </svg>
        {t.langSwitch}
      </a>
```

Replace with:
```astro
      <div class="lang-dropdown" id="langDropdown">
        <button class="navbar__lang-btn" id="langDropdownBtn" aria-haspopup="listbox" aria-expanded="false" aria-label="Switch language">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          {languageLabels[lang]}
          <svg class="lang-dropdown__arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <ul class="lang-dropdown__menu" role="listbox">
          {languages.map((l) => (
            <li role="option" aria-selected={l === lang}>
              {l === lang
                ? <span class="lang-dropdown__item lang-dropdown__item--active">{l === lang ? '✓ ' : ''}{languageLabels[l]}</span>
                : <a href={languageRoutes[l]} class="lang-dropdown__item">{languageLabels[l]}</a>
              }
            </li>
          ))}
        </ul>
      </div>
```

- [ ] **Step 3: Replace the mobile drawer language link (line 60)**

Find:
```astro
    <a href={t.langSwitchHref} class="mobile-drawer__link">🌐 {t.langSwitch}</a>
```

Replace with:
```astro
    {languages.filter(l => l !== lang).map((l) => (
      <a href={languageRoutes[l]} class="mobile-drawer__link">🌐 {languageLabels[l]}</a>
    ))}
```

- [ ] **Step 4: Add dropdown CSS to the `<style>` block**

Inside the existing `<style>` tag, add after the `.navbar__lang-btn:hover` rule:

```css
.lang-dropdown { position: relative; }
.lang-dropdown__arrow { transition: transform 0.2s ease; flex-shrink: 0; }
.lang-dropdown.open .lang-dropdown__arrow { transform: rotate(180deg); }
.lang-dropdown__menu {
  display: none;
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--bg-surface);
  border: 1.5px solid var(--border-subtle);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15,23,42,0.12);
  min-width: 80px;
  overflow: hidden;
  list-style: none; margin: 0; padding: 4px;
  z-index: 200;
}
.lang-dropdown.open .lang-dropdown__menu { display: block; }
.lang-dropdown__item {
  display: block; width: 100%;
  padding: 8px 14px; font-size: 13px; font-weight: 600;
  color: var(--text-secondary);
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
}
a.lang-dropdown__item:hover {
  color: var(--text-primary);
  background: rgba(37,99,235,0.06);
}
.lang-dropdown__item--active {
  color: var(--text-primary);
  cursor: default;
}
```

- [ ] **Step 5: Add dropdown JS to the `<script>` block**

Inside the existing `<script>` tag, add after the `overlay?.addEventListener` block:

```typescript
const langDropdown = document.getElementById('langDropdown');
const langBtn = document.getElementById('langDropdownBtn');

langBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langDropdown?.classList.contains('open') ?? false;
  langDropdown?.classList.toggle('open', !isOpen);
  langBtn.setAttribute('aria-expanded', String(!isOpen));
});

document.addEventListener('click', () => {
  langDropdown?.classList.remove('open');
  langBtn?.setAttribute('aria-expanded', 'false');
});
```

- [ ] **Step 6: Verify build**

Run: `npx astro build`
Expected: Build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Navbar.astro src/i18n/de.ts
git commit -m "feat: replace language button with EN/PL/DE dropdown in Navbar"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run dev server and verify**

Run: `npx astro dev`

Check manually:
- `http://localhost:4321/` — EN page, dropdown shows EN (✓), PL, DE
- `http://localhost:4321/pl/` — PL page, dropdown shows EN, PL (✓), DE
- `http://localhost:4321/de/` — DE page, dropdown shows EN, PL, DE (✓)
- Clicking a language link navigates to the correct page
- Dropdown closes on outside click
- Mobile hamburger menu shows links to non-current languages

- [ ] **Step 2: Final commit if any tweaks were made**

```bash
git add -p
git commit -m "fix: navbar dropdown polish after testing"
```
