---
name: lms-demo-app
description: Full interactive LMS demo page replacing the compositor/builder — simulates Admin and Learner POVs with login screen, sidebar navigation, and 4 screens per role
metadata:
  type: spec
---

# LMS Demo App — Design Spec

## Overview

Replace the existing `/demo/` page (compositor/builder tool) with a fully interactive simulation of the OnboardingToGo LMS application. Users arrive at a login screen, choose a role (Admin or Learner), and navigate a realistic multi-screen dashboard experience.

**Routes affected:** `/demo/` · `/pl/demo/` · `/de/demo/`  
**Language:** English (all three routes render the same EN content)

---

## Architecture

### File structure

```
Landing_Page/src/components/demo/
├── Demo.tsx                         # Root component, owns all state
├── demo.module.css                  # All styles
├── screens/
│   ├── LoginScreen.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminCourses.tsx
│   │   ├── AdminLearners.tsx
│   │   └── AdminReports.tsx
│   └── learner/
│       ├── LearnerDashboard.tsx
│       ├── LearnerCourses.tsx
│       ├── LearnerProgress.tsx
│       └── LearnerCertificates.tsx
```

`DemoPage.astro` renders `<Demo client:load />` — all compositor files are deleted.

### State machine (React useState)

```ts
type Screen = 'login' | 'app';
type Role   = 'admin' | 'learner';
type AdminPage   = 'dashboard' | 'courses' | 'learners' | 'reports';
type LearnerPage = 'dashboard' | 'my-courses' | 'progress' | 'certificates';

// Demo.tsx owns:
const [screen, setScreen] = useState<Screen>('login');
const [role,   setRole]   = useState<Role>('admin');
const [page,   setPage]   = useState<string>('dashboard');
```

### App shell (when screen === 'app')

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo · Nav label · User avatar · Exit demo │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  Main content area                       │
│ (4 links)│  (active screen component)               │
└──────────┴──────────────────────────────────────────┘
```

- Sidebar width: 200px, collapses to icon-only on mobile
- Header height: 52px
- "← Exit demo" resets state to `screen: 'login'`

---

## Login Screen

Full-viewport, brand gradient background (`var(--gradient-brand)`).

**Layout:**
- Center-aligned card container (max-width 480px)
- OnboardingToGo logo + "Interactive Demo" label at top
- Subtitle: "Choose an account to explore the platform"
- Two account cards side by side:

| Card | Avatar | Name | Role label |
|------|--------|------|------------|
| Admin | "SM" (purple) | Sarah Mitchell | Platform Administrator |
| Learner | "JP" (blue) | James Porter | Learner |

Each card: avatar + name + role badge + "Log in as [Name] →" button.  
Clicking a card: sets `role`, sets `page: 'dashboard'`, sets `screen: 'app'`.

---

## Admin Screens

### Sidebar navigation (Admin)
- Dashboard
- Courses
- Learners
- Reports

### Admin — Dashboard

**KPI row (4 cards):**
| Metric | Value | Delta |
|--------|-------|-------|
| Active Learners | 248 | +12 this week |
| Courses | 32 | 3 new |
| Avg. Completion | 76% | +4% vs last month |
| Avg. Score | 84% | +2% vs last month |

**Bar chart:** "Completions this week" — 7 bars (Mon–Sun), values: [14, 22, 18, 31, 27, 9, 6].

**Top Courses table (5 rows):**
| Course | Enrolled | Completion | Status |
|--------|----------|------------|--------|
| Onboarding 2024 | 124 | 89% | Active |
| Excel for HR | 87 | 72% | Active |
| Compliance Q1 | 203 | 94% | Active |
| Leadership Basics | 45 | 61% | Active |
| Product Training | 31 | 38% | Draft |

**Recent Activity feed (5 items):**
- Anna K. completed "Onboarding 2024" · 2h ago
- New learner registered: Tom B. · 3h ago
- Mark W. scored 98% on "Compliance Q1" · 5h ago
- Course "Leadership Basics" published · 1d ago
- 12 certificates issued this week · 1d ago

### Admin — Courses

- Search bar + filter tabs: All / Active / Draft
- List of 8 courses, each row:
  - Gradient color swatch (thumbnail)
  - Title + category tag
  - Enrolled count
  - Completion progress bar + %
  - Status badge (Active = green, Draft = grey)
  - "Edit" button

**Mock courses:**
Onboarding 2024, Excel for HR, Compliance Q1, Leadership Basics, Product Training, Safety & Health, Communication Skills, Data Literacy

### Admin — Learners

- Search bar above table
- Table columns: Name (avatar + name), Email, Courses, Completion, Status, Last seen
- 10 rows of mock learners
- Status: Active (green dot) / Inactive (grey dot)

**Sample rows:**
Anna Kowalska · anna.k@corp.com · 4 courses · 89% · Active · Today  
James Porter · j.porter@corp.com · 3 courses · 72% · Active · Yesterday  
Maria Lopez · m.lopez@corp.com · 5 courses · 91% · Active · Today  
Tom Brennan · t.brennan@corp.com · 2 courses · 38% · Inactive · 5d ago  
Sara Chen · s.chen@corp.com · 4 courses · 65% · Active · 2d ago  
(+ 5 more)

### Admin — Reports

**Stat cards (3):**
| Metric | Value |
|--------|-------|
| Completions this month | 312 |
| New learners this month | 28 |
| Avg. time per course | 2h 14m |

**Line chart:** "Completion trend" — 4 weeks of data: [68, 74, 71, 82] (weekly completion %).

**Department Breakdown table:**
| Department | Learners | Completion |
|------------|----------|------------|
| Engineering | 54 | 81% |
| HR | 23 | 94% |
| Sales | 67 | 71% |
| Operations | 38 | 88% |
| Finance | 29 | 76% |

---

## Learner Screens

### Sidebar navigation (Learner)
- Dashboard
- My Courses
- Progress
- Certificates

### Learner — Dashboard

**Welcome banner:** "Good morning, James 👋" + today's date + "You're on a 5-day streak 🔥"

**Continue Learning card:** Last active course ("Onboarding 2024"), progress bar at 72%, "Continue →" button.

**Stat chips (3):**
| Metric | Value |
|--------|-------|
| Courses Enrolled | 5 |
| Completed | 2 |
| XP Points | 1,240 |

**Recent Activity feed (4 items):**
- Completed: Lesson 8 — Compliance Q1 · 1h ago
- Earned badge: "Fast Learner" · 1d ago
- Started: Leadership Basics · 2d ago
- Certificate issued: Excel for HR · 3d ago

### Learner — My Courses

Grid 2×3 (6 course cards). Each card:
- Gradient thumbnail (different gradient per course)
- Course title
- Progress bar + % complete
- CTA button: "Continue →" (in progress), "Start →" (not started), "✓ Completed" (done)

**Courses:**
| Title | Progress | Status |
|-------|----------|--------|
| Onboarding 2024 | 72% | In Progress |
| Excel for HR | 100% | Completed |
| Compliance Q1 | 45% | In Progress |
| Leadership Basics | 10% | In Progress |
| Communication Skills | 0% | Not Started |
| Data Literacy | 0% | Not Started |

### Learner — Progress

**Overall progress ring:** Large circular progress indicator showing 64% (courses completed / enrolled, weighted by progress).

**Per-course progress bars (6 bars):** One per enrolled course, showing % and course name.

**This week activity:** Mini bar chart — 7 days, minutes spent: [0, 45, 30, 60, 20, 0, 15].

**Streak & XP:**
- 🔥 5-day streak
- XP: 1,240 · Level 8
- Next level at 1,500 XP — progress bar showing 240/500 to next level

### Learner — Certificates

**Earned (1 certificate):**
Decorative card with gradient border, course name, issue date, "Download PDF" button (no-op — shows toast "PDF download coming soon").

| Certificate | Issued |
|-------------|--------|
| Excel for HR | April 14, 2026 |

**In Progress — Earn your next certificate:**
3 cards for courses with completion < 100%, each showing remaining % and "Continue →" button that navigates to My Courses.

---

## Interaction Details

- **Charts:** Rendered as inline SVG — no external chart library. Simple bar and line charts built with SVG `<rect>` and `<polyline>`.
- **Search (Courses/Learners):** Client-side filter on mock data array — no real API call.
- **"Download PDF" button:** Shows an inline toast notification "PDF download available in the full version."
- **"Edit" button (Courses):** Shows inline toast "Course editor available in the full version."
- **Mobile:** Sidebar collapses; hamburger icon toggles it as an overlay drawer.

---

## Styling

- Inherits CSS variables from `global.css` (`--gradient-brand`, `--text-primary`, etc.)
- Component styles in `demo.module.css`
- Charts: pure SVG, no library dependency
- Colour coding: Admin accent = purple (`#7C3AED`), Learner accent = blue (`#2563EB`)
- Status badges: Active = `#F0FDF4` bg / `#16A34A` text, Draft/Inactive = `#F8FAFF` bg / `#64748B` text

---

## What Is Deleted

All compositor files are removed as part of this change:
- `src/components/compositor/` (entire directory — 9 files)
- These are replaced by `src/components/demo/`
- `DemoPage.astro` is rewritten (no longer imports Compositor)
