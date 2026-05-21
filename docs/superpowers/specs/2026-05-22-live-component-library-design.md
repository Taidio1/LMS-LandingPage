# Live Component Library — Design Spec

**Date:** 2026-05-22  
**Project:** LMS-LandingPage / Landing_Page (Astro)  
**Scope:** New `/demo` page replacing the existing LMS_Odysseio_app demo

---

## Overview

A new `/demo` page on the Ascent landing site where potential clients can browse available LMS modules and UI components, compose their own application by selecting what they want, see a live visual preview of their configuration, and submit a contact request with that configuration attached.

The goal is a sales tool: the client self-qualifies by picking their components, then submits a request — the Ascent team receives an email with the full configuration.

---

## Architecture

**Location:** `Landing_Page/src/pages/demo/index.astro` (new page, EN only in v1)

**Approach:** Astro page shell + a single React Island (`<Compositor client:load />`) that owns the entire interactive experience.

The Astro shell provides the standard `BaseLayout`, `Navbar`, and `Footer`. The `Compositor` island is a full-width, full-height section between them — it manages all state and renders the two-panel UI.

**Why one island:** The catalog, selection state, preview canvas, and contact form are tightly coupled through shared state (which components are selected). Splitting across multiple islands would require custom event buses or URL-encoded state, adding complexity with no benefit.

**Tech stack additions to `Landing_Page`:**
- `@astrojs/react` integration
- `react` + `react-dom`
- `EmailJS` (`@emailjs/browser`) for form submission (no backend required)

The existing `LMS_Odysseio_app` is not reused. All component UI is written fresh inside the new island.

---

## Page Layout

Two-panel layout, side by side on desktop, stacked on mobile:

```
┌─────────────────────────────────────────────────────────┐
│  Navbar                                                  │
├───────────────────────┬─────────────────────────────────┤
│  LEFT: Catalog        │  RIGHT: Live Preview Canvas     │
│  ┌─────────────────┐  │  ┌───────────────────────────┐  │
│  │ [Moduły] [Bloki]│  │  │  [Learner] [Admin]        │  │
│  │                 │  │  │                           │  │
│  │  Component      │  │  │  Full-page mock LMS app   │  │
│  │  cards grid     │  │  │  updates as components    │  │
│  │  (selectable)   │  │  │  are selected             │  │
│  │                 │  │  │                           │  │
│  └─────────────────┘  │  │  ─────────────────────    │  │
│                       │  │  Contact form (appears    │  │
│                       │  │  after ≥1 selection)      │  │
│                       │  └───────────────────────────┘  │
├───────────────────────┴─────────────────────────────────┤
│  Footer                                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Component Catalog

The left panel has two tabs: **Moduły** and **UI Bloki**.

### Tab 1: Moduły funkcjonalne (9 total)

**Learner role (5):**
| ID | Name | Description |
|----|------|-------------|
| `learner-dashboard` | Learner Dashboard | Welcome banner, progress summary, recent activity |
| `my-courses` | Moje Kursy | Course grid + embedded video player |
| `progress` | Postępy | Progress bars, weekly chart, achievement badges |
| `certificates` | Certyfikaty | Certificate generation and display |
| `gamification` | Gamifikacja | XP points, levels, leaderboard |

**Admin role (4):**
| ID | Name | Description |
|----|------|-------------|
| `admin-dashboard` | Admin Dashboard | KPI stats, completion trend chart, top learners |
| `courses-manager` | Manager Kursów | Course list + side-panel editor |
| `learners-table` | Zarządzanie Learnerami | Filterable table with learner status |
| `notifications` | Powiadomienia | Alert and notification system |

### Tab 2: UI Bloki (12 total)

**Dane i statystyki (4):**
`stat-cards`, `bar-chart`, `progress-bars`, `data-table`

**Treść i nauka (4):**
`course-cards`, `video-player`, `quiz-block`, `activity-feed`

**Nawigacja i layout (4):**
`sidebar-nav`, `tab-bar`, `header-role-badge`, `breadcrumbs`

### Component card anatomy

Each component is rendered as a card with: icon, name, short description, and a selected/unselected toggle state. Clicking toggles selection. Selected cards get a brand-color border and checkmark indicator.

---

## Selection State

Managed in React state within `Compositor`:

```typescript
interface CompositorState {
  selectedModules: Set<string>;     // component IDs from modules tab
  selectedUIBlocks: Set<string>;    // component IDs from ui-blocks tab
  previewRole: 'learner' | 'admin';
}
```

Total selection count shown in a sticky badge at the bottom of the left panel ("X komponentów wybranych").

---

## Live Preview Canvas

The right panel renders a full-page visual mockup of an LMS application that updates in real-time as the user selects components.

**Role switcher:** Two pills at the top of the canvas — "Learner" and "Admin". Switching role changes which portion of the preview is shown. Selecting a Learner module auto-switches the preview to Learner view, and vice versa for Admin modules. Selecting a UI Block does not change the active role.

**Rendering logic:** The canvas is a fixed-structure mock layout. Each "zone" in the layout corresponds to component IDs. If the component is selected, that zone renders its visual mockup. If not selected, that zone is hidden (not shown as a placeholder — the layout simply omits it). This ensures the preview always looks like a coherent, real app rather than a skeleton with holes.

**UI Blocks in the canvas:** UI Blocks are role-agnostic — each block maps to a zone that exists in both `LearnerPreview` and `AdminPreview`. They appear within the currently active role view. If no modules are selected but UI blocks are, the canvas shows a neutral app frame (header + nav only) with the selected UI block zones visible inside it. This allows clients to explore UI blocks independently of modules.

**Visual fidelity:** CSS-only mockups using the same brand tokens as the landing page (`--gradient-brand`, etc.). Not interactive — this is a visual preview, not a functional demo.

**Animations:** Zones fade in/out with a 200ms CSS transition when components are toggled.

---

## Contact Form

Appears below the canvas once at least one component has been selected. Slides in with a smooth CSS transition.

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Imię i nazwisko | text | yes |
| Email firmowy | email | yes |
| Nazwa firmy | text | yes |
| Liczba użytkowników | select: 1–50 / 50–200 / 200–1000 / 1000+ | yes |
| Wiadomość | textarea | no |
| Twoja konfiguracja | read-only text block | auto |

The "Twoja konfiguracja" field is auto-populated with a formatted list of selected module and UI block names. It is displayed to the user (so they know what they're sending) but is not editable.

**Submission:** EmailJS (`@emailjs/browser`). On submit, sends an email to `kkacper15@gmail.com` containing all form fields plus the full selected configuration. No backend required.

**After submission:** The form is replaced inline with a success state ("Dziękujemy! Odezwiemy się w ciągu 24h."). No page redirect.

**Validation:** Client-side only — required fields highlighted on submit attempt if empty.

---

## Navigation & Discovery

- The landing page `Navbar` gains a "Demo" link pointing to `/demo`
- The Hero section CTA "Zobacz demo" (or equivalent) links to `/demo`
- The `/demo` page is EN-only in v1; PL and DE can be added later following the existing i18n pattern

---

## File Structure

New files within `Landing_Page/`:

```
src/
  pages/
    demo/
      index.astro              ← Astro shell, loads Compositor island
  components/
    compositor/
      Compositor.tsx           ← Root React island (state owner)
      CatalogPanel.tsx         ← Left panel: tabs + component cards
      ComponentCard.tsx        ← Single selectable card
      PreviewCanvas.tsx        ← Right panel: role switcher + mock layout
      preview/
        LearnerPreview.tsx     ← Learner role mock layout
        AdminPreview.tsx       ← Admin role mock layout
      ContactForm.tsx          ← Form + EmailJS integration
      catalog-data.ts          ← Static component definitions (IDs, names, descriptions)
```

---

## Out of Scope (v1)

- Shareable configuration links (URL-encoded state)
- PL / DE translations of the `/demo` page
- Actual interactive components in the preview (clicks, real data)
- User accounts or saved configurations
- Analytics tracking of which components are most selected
