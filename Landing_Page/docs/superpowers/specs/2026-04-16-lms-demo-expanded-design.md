# LMS Demo App — Expanded Navigation Design

**Date:** 2026-04-16  
**Project:** `LMS_Odysseio_app/`  
**Status:** Approved

---

## Overview

Expand the existing two-view LMS demo (Learner / Admin) into a multi-tab application. Navigation changes based on role. All content is in English. No routing library — state-based tab navigation only.

---

## Architecture

**Pattern:** State-based navigation via `NavigationContext`. No React Router. Active tab stored per role.

**New files:**
```
src/
  context/
    NavigationContext.tsx       ← new: activeTab state, setActiveTab, tab config per role
  views/
    learner/
      LearnerDashboard.tsx
      MyCourses.tsx             ← course grid + embedded course player
      Progress.tsx
    admin/
      AdminDashboard.tsx
      CoursesManager.tsx        ← list + side panel editor
      LearnersTable.tsx
  components/shared/
    TabBar.tsx                  ← new: role-aware top tab bar
  services/
    mockData.ts                 ← expanded (3 courses, 8 learners)
```

**Modified:**
- `App.tsx` — simplified: renders `<TabBar />` + active view component
- `src/components/shared/Header.tsx` — unchanged

---

## Tab Bar

- Renders immediately below the sticky header
- Tabs are role-aware: shows Learner tabs when `role === 'LEARNER'`, Admin tabs when `role === 'ADMIN'`
- Active tab indicated by bottom border + color highlight
- Switching roles resets `activeTab` to the first tab of the new role
- Small role label on the right side ("Learner view" / "Admin view") for demo clarity

---

## Learner Tabs

### Dashboard
- Welcome banner with user name ("Alex")
- "Continue Learning" card: last active course, resume button, progress %
- Quick stats row: Courses Enrolled, Lessons Completed, Overall Progress %
- Recent activity list (last 5 lesson completions with timestamps)

### My Courses
- Default view: grid of enrolled course cards (3 mock courses)
  - Each card: title, thumbnail placeholder, progress bar, lesson count, "Continue" button
- Click "Continue" or a course card → replaces the grid with the course player (back button returns to grid)
- Course player: lesson sidebar (left) + video/content area (right), "Mark as Complete" button
- This is the existing player from `App.tsx`, moved here and extended

### Progress
- Large overall completion % stat (e.g. "67%")
- Per-course progress bars with lesson counts (e.g. "4 / 6 lessons")
- Achievement badges row: 3 mock badges ("First Lesson", "Halfway There", "Course Complete")
- Weekly activity section: 7-day bar chart (CSS-only, no chart library) showing lessons completed per day

---

## Admin Tabs

### Dashboard
- 4 stat cards: Total Learners, Avg. Completion, Active Sessions, Engagement Rate (refined from existing)
- Completion trend: simple 7-bar CSS bar chart (Mon–Sun)
- Top Courses list: 3 courses ranked by completion %
- Most Active Learners list: top 3 learners with name + progress bar

### Courses
- **Left panel** (fixed width ~280px): course list with titles, lesson count, completion %; "+ New Course" button at bottom
- **Right panel**: edit form for selected course
  - Editable fields: Title (text input), Description (textarea) — visual only, no state changes needed
  - Lessons list: each lesson shows type icon, title, duration; drag handle icon (decorative)
  - "+ Add Lesson" button (mockup, no real action)
  - "Save Changes" button (mockup)
- Default: first course selected on load

### Learners
- Search input (filters by name, visual only)
- Table columns: Avatar, Name, Enrolled Course, Progress (bar + %), Last Active, Status badge
- 8 mock learners with varied progress (10%–100%) and statuses (Active / Inactive)
- Status badge: green "Active" / gray "Inactive"
- No pagination needed (8 rows fits one screen)

---

## Mock Data Expansion

Expand `mockData.ts`:

**3 courses:**
1. "The Odysseio Advantage" — 3 lessons (existing)
2. "Security & Compliance" — 4 lessons
3. "Branding Your Platform" — 3 lessons

**8 learners:**
- Mix of progress levels: 2 at 100%, 2 at 60–80%, 2 at 30–50%, 2 at 10–20%
- Mix of statuses: 5 Active, 3 Inactive
- Last active: ranges from "30m ago" to "5d ago"

---

## Constraints

- No new npm dependencies (no chart library, no DnD library)
- All charts: pure CSS/HTML bar charts
- Drag-and-drop in course editor: decorative only (icons, cursor style)
- All data: static mock — no real state mutations needed
- Styling: follow existing Tailwind + CSS variable conventions (`--brand-accent`, `bg-brand-gradient`, etc.)
