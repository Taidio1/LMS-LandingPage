# LMS Demo App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compositor/builder at `/demo/` with a fully interactive LMS simulation — login screen, Admin and Learner POVs, 4 navigable screens each, inline SVG charts, client-side search.

**Architecture:** Single React island (`<Demo client:load />`) mounted by `DemoPage.astro`. All state (screen, role, active page, sidebar open) lives in `Demo.tsx`. Each of the 8 screens is an isolated component that receives only what it needs. All mock data is in one file (`mock-data.ts`).

**Tech Stack:** Astro 4, React 18, CSS Modules, Vitest + React Testing Library, inline SVG charts (no charting library)

---

## File Map

| Action | Path |
|--------|------|
| Delete | `src/components/compositor/` (entire dir, 9 files) |
| Rewrite | `src/components/sections/DemoPage.astro` |
| Create | `src/components/demo/mock-data.ts` |
| Create | `src/components/demo/demo.module.css` |
| Create | `src/components/demo/Demo.tsx` |
| Create | `src/components/demo/screens/LoginScreen.tsx` |
| Create | `src/components/demo/screens/admin/AdminDashboard.tsx` |
| Create | `src/components/demo/screens/admin/AdminCourses.tsx` |
| Create | `src/components/demo/screens/admin/AdminLearners.tsx` |
| Create | `src/components/demo/screens/admin/AdminReports.tsx` |
| Create | `src/components/demo/screens/learner/LearnerDashboard.tsx` |
| Create | `src/components/demo/screens/learner/LearnerCourses.tsx` |
| Create | `src/components/demo/screens/learner/LearnerProgress.tsx` |
| Create | `src/components/demo/screens/learner/LearnerCertificates.tsx` |
| Create | `src/__tests__/demo/filter-utils.test.ts` |

---

## Task 1: Cleanup + DemoPage.astro + mock-data.ts

**Files:**
- Delete: `src/components/compositor/` (entire directory)
- Rewrite: `src/components/sections/DemoPage.astro`
- Create: `src/components/demo/mock-data.ts`

- [ ] **Step 1: Delete compositor directory**

```bash
cd Landing_Page
Remove-Item -Recurse -Force src/components/compositor
```

- [ ] **Step 2: Rewrite DemoPage.astro**

Replace the entire contents of `src/components/sections/DemoPage.astro`:

```astro
---
import { Demo } from '../demo/Demo';
---

<Demo client:load />
```

- [ ] **Step 3: Create mock-data.ts**

Create `src/components/demo/mock-data.ts`:

```ts
export const ADMIN_USER = { name: 'Sarah Mitchell', initials: 'SM', role: 'Platform Administrator' };
export const LEARNER_USER = { name: 'James Porter', initials: 'JP', role: 'Learner' };

export const ADMIN_KPI = [
  { label: 'Active Learners', value: '248', delta: '+12 this week' },
  { label: 'Courses', value: '32', delta: '3 new' },
  { label: 'Avg. Completion', value: '76%', delta: '+4% vs last month' },
  { label: 'Avg. Score', value: '84%', delta: '+2% vs last month' },
];

export const WEEKLY_COMPLETIONS = [
  { day: 'Mon', value: 14 },
  { day: 'Tue', value: 22 },
  { day: 'Wed', value: 18 },
  { day: 'Thu', value: 31 },
  { day: 'Fri', value: 27 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 6 },
];

export const TOP_COURSES = [
  { title: 'Onboarding 2024', enrolled: 124, completion: 89, status: 'Active' },
  { title: 'Excel for HR', enrolled: 87, completion: 72, status: 'Active' },
  { title: 'Compliance Q1', enrolled: 203, completion: 94, status: 'Active' },
  { title: 'Leadership Basics', enrolled: 45, completion: 61, status: 'Active' },
  { title: 'Product Training', enrolled: 31, completion: 38, status: 'Draft' },
];

export const ADMIN_ACTIVITY = [
  { text: 'Anna K. completed "Onboarding 2024"', time: '2h ago' },
  { text: 'New learner registered: Tom B.', time: '3h ago' },
  { text: 'Mark W. scored 98% on "Compliance Q1"', time: '5h ago' },
  { text: 'Course "Leadership Basics" published', time: '1d ago' },
  { text: '12 certificates issued this week', time: '1d ago' },
];

export interface Course {
  id: string;
  title: string;
  category: string;
  enrolled: number;
  completion: number;
  status: 'Active' | 'Draft';
  gradient: string;
}

export const ALL_COURSES: Course[] = [
  { id: 'onboarding-2024', title: 'Onboarding 2024', category: 'HR', enrolled: 124, completion: 89, status: 'Active', gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)' },
  { id: 'excel-for-hr', title: 'Excel for HR', category: 'Tools', enrolled: 87, completion: 72, status: 'Active', gradient: 'linear-gradient(135deg,#059669,#10B981)' },
  { id: 'compliance-q1', title: 'Compliance Q1', category: 'Legal', enrolled: 203, completion: 94, status: 'Active', gradient: 'linear-gradient(135deg,#D97706,#F59E0B)' },
  { id: 'leadership-basics', title: 'Leadership Basics', category: 'Management', enrolled: 45, completion: 61, status: 'Active', gradient: 'linear-gradient(135deg,#0891B2,#06B6D4)' },
  { id: 'product-training', title: 'Product Training', category: 'Product', enrolled: 31, completion: 38, status: 'Draft', gradient: 'linear-gradient(135deg,#DC2626,#EF4444)' },
  { id: 'safety-health', title: 'Safety & Health', category: 'Compliance', enrolled: 178, completion: 82, status: 'Active', gradient: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
  { id: 'communication-skills', title: 'Communication Skills', category: 'Soft Skills', enrolled: 92, completion: 55, status: 'Active', gradient: 'linear-gradient(135deg,#2563EB,#4F46E5)' },
  { id: 'data-literacy', title: 'Data Literacy', category: 'Analytics', enrolled: 64, completion: 43, status: 'Draft', gradient: 'linear-gradient(135deg,#059669,#2563EB)' },
];

export interface Learner {
  id: string;
  name: string;
  initials: string;
  email: string;
  courses: number;
  completion: number;
  status: 'Active' | 'Inactive';
  lastSeen: string;
  color: string;
}

export const ALL_LEARNERS: Learner[] = [
  { id: '1', name: 'Anna Kowalska', initials: 'AK', email: 'anna.k@corp.com', courses: 4, completion: 89, status: 'Active', lastSeen: 'Today', color: '#7C3AED' },
  { id: '2', name: 'James Porter', initials: 'JP', email: 'j.porter@corp.com', courses: 3, completion: 72, status: 'Active', lastSeen: 'Yesterday', color: '#2563EB' },
  { id: '3', name: 'Maria Lopez', initials: 'ML', email: 'm.lopez@corp.com', courses: 5, completion: 91, status: 'Active', lastSeen: 'Today', color: '#059669' },
  { id: '4', name: 'Tom Brennan', initials: 'TB', email: 't.brennan@corp.com', courses: 2, completion: 38, status: 'Inactive', lastSeen: '5d ago', color: '#DC2626' },
  { id: '5', name: 'Sara Chen', initials: 'SC', email: 's.chen@corp.com', courses: 4, completion: 65, status: 'Active', lastSeen: '2d ago', color: '#0891B2' },
  { id: '6', name: 'Lucas Müller', initials: 'LM', email: 'l.muller@corp.com', courses: 3, completion: 77, status: 'Active', lastSeen: 'Today', color: '#7C3AED' },
  { id: '7', name: 'Sofia Nowak', initials: 'SN', email: 's.nowak@corp.com', courses: 5, completion: 84, status: 'Active', lastSeen: '1d ago', color: '#059669' },
  { id: '8', name: 'Daniel Park', initials: 'DP', email: 'd.park@corp.com', courses: 2, completion: 20, status: 'Inactive', lastSeen: '10d ago', color: '#D97706' },
  { id: '9', name: 'Emma Wilson', initials: 'EW', email: 'e.wilson@corp.com', courses: 4, completion: 93, status: 'Active', lastSeen: 'Today', color: '#EC4899' },
  { id: '10', name: 'Piotr Wiśniewski', initials: 'PW', email: 'p.wisniewski@corp.com', courses: 3, completion: 58, status: 'Active', lastSeen: '3d ago', color: '#0891B2' },
];

export const REPORTS_STATS = [
  { label: 'Completions this month', value: '312' },
  { label: 'New learners this month', value: '28' },
  { label: 'Avg. time per course', value: '2h 14m' },
];

export const COMPLETION_TREND = [
  { week: 'Wk 1', value: 68 },
  { week: 'Wk 2', value: 74 },
  { week: 'Wk 3', value: 71 },
  { week: 'Wk 4', value: 82 },
];

export const DEPARTMENT_BREAKDOWN = [
  { dept: 'Engineering', learners: 54, completion: 81 },
  { dept: 'HR', learners: 23, completion: 94 },
  { dept: 'Sales', learners: 67, completion: 71 },
  { dept: 'Operations', learners: 38, completion: 88 },
  { dept: 'Finance', learners: 29, completion: 76 },
];

export interface LearnerCourse {
  id: string;
  title: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started';
  gradient: string;
}

export const LEARNER_COURSES: LearnerCourse[] = [
  { id: 'onboarding-2024', title: 'Onboarding 2024', progress: 72, status: 'in-progress', gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)' },
  { id: 'excel-for-hr', title: 'Excel for HR', progress: 100, status: 'completed', gradient: 'linear-gradient(135deg,#059669,#10B981)' },
  { id: 'compliance-q1', title: 'Compliance Q1', progress: 45, status: 'in-progress', gradient: 'linear-gradient(135deg,#D97706,#F59E0B)' },
  { id: 'leadership-basics', title: 'Leadership Basics', progress: 10, status: 'in-progress', gradient: 'linear-gradient(135deg,#0891B2,#06B6D4)' },
  { id: 'communication-skills', title: 'Communication Skills', progress: 0, status: 'not-started', gradient: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
  { id: 'data-literacy', title: 'Data Literacy', progress: 0, status: 'not-started', gradient: 'linear-gradient(135deg,#059669,#2563EB)' },
];

export const LEARNER_ACTIVITY = [
  { text: 'Completed: Lesson 8 — Compliance Q1', time: '1h ago' },
  { text: 'Earned badge: "Fast Learner"', time: '1d ago' },
  { text: 'Started: Leadership Basics', time: '2d ago' },
  { text: 'Certificate issued: Excel for HR', time: '3d ago' },
];

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 60 },
  { day: 'Fri', value: 20 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 15 },
];

export const CERTIFICATES_EARNED = [
  { title: 'Excel for HR', issued: 'April 14, 2026' },
];

export const CERTIFICATES_IN_PROGRESS = [
  { title: 'Onboarding 2024', progress: 72 },
  { title: 'Compliance Q1', progress: 45 },
  { title: 'Leadership Basics', progress: 10 },
];
```

- [ ] **Step 4: Build to catch import errors**

```bash
cd Landing_Page && npm run build
```

Expected: build succeeds (DemoPage.astro imports Demo which doesn't exist yet — this will fail; that's expected, continue to Task 2).

Actually skip build until Task 3 is done. Just verify the files exist:

```bash
ls src/components/demo/
ls src/components/sections/DemoPage.astro
```

Expected: `mock-data.ts` visible, `DemoPage.astro` present.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/DemoPage.astro src/components/demo/mock-data.ts
git commit -m "feat: scaffold demo — replace compositor with mock-data and stub DemoPage"
```

---

## Task 2: demo.module.css

**Files:**
- Create: `src/components/demo/demo.module.css`

- [ ] **Step 1: Create the full CSS module**

Create `src/components/demo/demo.module.css`:

```css
/* ─── Login ─────────────────────────────────────────────── */
.loginBg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.loginWrap {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.loginHeader { text-align: center; }

.loginBadge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.loginTitle {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.loginSubtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.75);
  margin: 0;
}

.accountCards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.accountCard {
  background: #fff;
  border-radius: 16px;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.14);
}

.accountAvatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.accountName {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.accountRole {
  font-size: 11px;
  font-weight: 600;
  color: #64748B;
  background: #F8FAFF;
  border: 1px solid #E2E8F0;
  border-radius: 999px;
  padding: 3px 10px;
}

.accountBtn {
  width: 100%;
  padding: 11px 16px;
  background: linear-gradient(135deg, #7C3AED, #2563EB);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: inherit;
}

.accountBtn:hover { opacity: 0.88; }

/* ─── App Shell ──────────────────────────────────────────── */
.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #F8FAFF;
  font-family: inherit;
}

.header {
  height: 52px;
  background: #fff;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  z-index: 20;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #0F172A;
  padding: 4px;
  line-height: 1;
  flex-shrink: 0;
}

.headerBrand {
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.headerMode {
  font-size: 11px;
  font-weight: 600;
  color: #7C3AED;
  background: #F5F3FF;
  border-radius: 999px;
  padding: 2px 8px;
  flex-shrink: 0;
}

.headerSpacer { flex: 1; }

.headerUser {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.headerAvatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.headerName {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
}

.exitBtn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
  flex-shrink: 0;
}

.exitBtn:hover { color: #0F172A; border-color: #94A3B8; }

.shellBody {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebarOverlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.3);
  z-index: 15;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #E2E8F0;
  padding: 12px 10px;
  overflow-y: auto;
  z-index: 16;
}

.navLink {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  font-family: inherit;
  margin-bottom: 2px;
}

.navLink:hover { background: #F8FAFF; color: #0F172A; }

.navLinkActive {
  background: #EEF2FF;
  color: #4F46E5;
  font-weight: 600;
}

.navLinkActive:hover { background: #EEF2FF; }

.navIcon { font-size: 14px; flex-shrink: 0; }

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* ─── Shared ─────────────────────────────────────────────── */
.pageTitle {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
}

.sectionTitle {
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 20px 0 10px;
}

.card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.badgeActive { background: #F0FDF4; color: #16A34A; }
.badgeDraft  { background: #F8FAFF; color: #64748B; }
.badgeInProgress { background: #EEF2FF; color: #4F46E5; }
.badgeCompleted  { background: #F0FDF4; color: #16A34A; }
.badgeNotStarted { background: #F8FAFF; color: #64748B; }

.progressBar {
  height: 6px;
  background: #F1F5F9;
  border-radius: 999px;
  overflow: hidden;
  flex: 1;
}

.progressFill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #7C3AED, #2563EB);
  transition: width 0.3s ease;
}

.tableWrap { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #E2E8F0;
  white-space: nowrap;
}

.table td {
  padding: 10px 12px;
  color: #0F172A;
  border-bottom: 1px solid #F1F5F9;
  white-space: nowrap;
}

.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #F8FAFF; }

.avatarSmall {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  vertical-align: middle;
  margin-right: 8px;
}

.statusDot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;
}

.statusDotActive  { background: #16A34A; }
.statusDotInactive { background: #94A3B8; }

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #0F172A;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  animation: toastIn 0.2s ease;
  max-width: 320px;
}

@keyframes toastIn {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* ─── KPI grid ───────────────────────────────────────────── */
.kpiGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.kpiCard {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
}

.kpiValue {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;
}

.kpiLabel {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 6px;
}

.kpiDelta {
  font-size: 11px;
  font-weight: 600;
  color: #16A34A;
}

/* ─── Charts ─────────────────────────────────────────────── */
.chartBox {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.chartTitle {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 12px;
}

.chartSvg { width: 100%; overflow: visible; }

/* ─── Two-column layout ──────────────────────────────────── */
.twoCol {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

/* ─── Search + filter ────────────────────────────────────── */
.searchRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.searchInput {
  flex: 1;
  min-width: 160px;
  padding: 8px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  color: #0F172A;
  background: #fff;
  font-family: inherit;
  transition: border-color 0.15s;
}

.searchInput:focus { outline: none; border-color: #4F46E5; }

.filterTabs {
  display: flex;
  background: #F1F5F9;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.filterTab {
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.filterTabActive {
  background: #fff;
  color: #0F172A;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

/* ─── Course list (admin) ────────────────────────────────── */
.courseList { display: flex; flex-direction: column; gap: 8px; }

.courseRow {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.courseThumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
}

.courseInfo { flex: 1; min-width: 0; }

.courseRowTitle {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.courseCategory {
  font-size: 10px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.courseEnrolled {
  font-size: 12px;
  color: #64748B;
  white-space: nowrap;
  flex-shrink: 0;
}

.courseProgressWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 120px;
  flex-shrink: 0;
}

.coursePct {
  font-size: 12px;
  font-weight: 700;
  color: #0F172A;
  width: 30px;
  text-align: right;
  flex-shrink: 0;
}

.editBtn {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #4F46E5;
  background: #EEF2FF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: inherit;
  flex-shrink: 0;
}

.editBtn:hover { opacity: 0.8; }

/* ─── Activity feed ──────────────────────────────────────── */
.activityFeed { display: flex; flex-direction: column; gap: 10px; }

.activityItem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.activityDot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4F46E5;
  margin-top: 5px;
  flex-shrink: 0;
}

.activityText { font-size: 12px; color: #0F172A; line-height: 1.4; }
.activityTime { font-size: 11px; color: #94A3B8; margin-top: 1px; }

/* ─── Learner course grid ────────────────────────────────── */
.courseGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.courseCard {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
}

.courseThumbnail {
  height: 80px;
  width: 100%;
}

.courseCardBody { padding: 12px; }

.courseCardTitle {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 10px;
  line-height: 1.3;
}

.courseCardProgressRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.courseCardPct {
  font-size: 11px;
  font-weight: 700;
  color: #0F172A;
  flex-shrink: 0;
}

.courseCardBtn {
  width: 100%;
  padding: 7px 0;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.courseCardBtn:hover { opacity: 0.85; }

.btnContinue { background: linear-gradient(135deg,#7C3AED,#2563EB); color: #fff; }
.btnStart    { background: #F1F5F9; color: #0F172A; }
.btnDone     { background: #F0FDF4; color: #16A34A; cursor: default; }

/* ─── Stat chips ─────────────────────────────────────────── */
.statChips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.statChip {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 100px;
}

.statChipValue {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1;
}

.statChipLabel { font-size: 11px; color: #64748B; font-weight: 500; }

/* ─── Continue card ──────────────────────────────────────── */
.continueCard {
  background: linear-gradient(135deg,#7C3AED,#4F46E5,#2563EB);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.continueCardInfo { flex: 1; }
.continueLabel { font-size: 11px; font-weight: 600; opacity: 0.75; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.continueTitle { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
.continueProgressRow { display: flex; align-items: center; gap: 10px; }

.continueProgressBar {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.25);
  border-radius: 999px;
  overflow: hidden;
}

.continueProgressFill {
  height: 100%;
  background: #fff;
  border-radius: 999px;
}

.continuePct { font-size: 12px; font-weight: 700; }

.continueBtn {
  padding: 10px 18px;
  background: #fff;
  color: #4F46E5;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.continueBtn:hover { opacity: 0.9; }

/* ─── Progress ring ──────────────────────────────────────── */
.progressRingSection {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.progressRingWrap { position: relative; flex-shrink: 0; }

.progressRingSvg { width: 120px; height: 120px; }

.progressRingText {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.progressRingPct {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1;
}

.progressRingLabel { font-size: 10px; color: #64748B; font-weight: 500; }

.progressRingInfo { flex: 1; }

.streakRow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.streakBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #C2410C;
}

.xpBar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.xpLabel { font-size: 11px; color: #64748B; }

.xpProgress {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ─── Certificates ───────────────────────────────────────── */
.certGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }

.certCard {
  background: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px;
  background-clip: padding-box;
  position: relative;
  box-shadow: inset 0 0 0 2px #E2E8F0;
}

.certCardGold {
  box-shadow:
    inset 0 0 0 2px transparent,
    0 0 0 2px #D97706;
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(135deg, #F59E0B, #D97706) border-box;
  border: 2px solid transparent;
}

.certIcon { font-size: 28px; margin-bottom: 8px; }
.certTitle { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
.certDate  { font-size: 11px; color: #64748B; margin-bottom: 12px; }

.certBtn {
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #D97706;
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.certBtn:hover { opacity: 0.8; }

.inProgressCerts { display: flex; flex-direction: column; gap: 10px; }

.inProgressCertCard {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.inProgressCertInfo { flex: 1; }
.inProgressCertTitle { font-size: 13px; font-weight: 600; color: #0F172A; margin-bottom: 6px; }

.inProgressCertProgress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inProgressCertPct { font-size: 11px; font-weight: 700; color: #64748B; flex-shrink: 0; }

.continueSmallBtn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #4F46E5;
  background: #EEF2FF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.continueSmallBtn:hover { opacity: 0.8; }

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .hamburger { display: block; }

  .headerName { display: none; }

  .sidebar {
    position: fixed;
    top: 52px;
    left: 0;
    bottom: 0;
    width: 220px;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    z-index: 16;
    box-shadow: 4px 0 16px rgba(0,0,0,0.08);
  }

  .sidebarOpen {
    transform: translateX(0);
  }

  .sidebarOverlay { display: block; top: 52px; }

  .kpiGrid { grid-template-columns: repeat(2, 1fr); }

  .twoCol { grid-template-columns: 1fr; }

  .courseGrid { grid-template-columns: repeat(2, 1fr); }

  .certGrid { grid-template-columns: 1fr; }

  .accountCards { grid-template-columns: 1fr; }

  .courseProgressWrap { display: none; }

  .content { padding: 16px; }
}

@media (max-width: 480px) {
  .courseGrid { grid-template-columns: 1fr; }
  .kpiGrid { grid-template-columns: 1fr 1fr; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/demo.module.css
git commit -m "feat: add demo.module.css — full stylesheet for LMS demo app"
```

---

## Task 3: Demo.tsx + LoginScreen.tsx

**Files:**
- Create: `src/components/demo/Demo.tsx`
- Create: `src/components/demo/screens/LoginScreen.tsx`

- [ ] **Step 1: Create LoginScreen.tsx**

Create `src/components/demo/screens/LoginScreen.tsx`:

```tsx
import styles from '../demo.module.css';

interface Props {
  onLogin: (role: 'admin' | 'learner') => void;
}

export function LoginScreen({ onLogin }: Props) {
  return (
    <div className={styles.loginBg}>
      <div className={styles.loginWrap}>
        <div className={styles.loginHeader}>
          <div className={styles.loginBadge}>Interactive Demo</div>
          <h1 className={styles.loginTitle}>OnboardingToGo LMS</h1>
          <p className={styles.loginSubtitle}>Choose an account to explore the platform</p>
        </div>
        <div className={styles.accountCards}>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#7C3AED' }}>SM</div>
            <p className={styles.accountName}>Sarah Mitchell</p>
            <span className={styles.accountRole}>Platform Administrator</span>
            <button className={styles.accountBtn} onClick={() => onLogin('admin')}>
              Log in as Sarah →
            </button>
          </div>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#2563EB' }}>JP</div>
            <p className={styles.accountName}>James Porter</p>
            <span className={styles.accountRole}>Learner</span>
            <button className={styles.accountBtn} onClick={() => onLogin('learner')}>
              Log in as James →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Demo.tsx**

Create `src/components/demo/Demo.tsx`:

```tsx
import { useState } from 'react';
import styles from './demo.module.css';
import { LoginScreen } from './screens/LoginScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { AdminCourses } from './screens/admin/AdminCourses';
import { AdminLearners } from './screens/admin/AdminLearners';
import { AdminReports } from './screens/admin/AdminReports';
import { LearnerDashboard } from './screens/learner/LearnerDashboard';
import { LearnerCourses } from './screens/learner/LearnerCourses';
import { LearnerProgress } from './screens/learner/LearnerProgress';
import { LearnerCertificates } from './screens/learner/LearnerCertificates';
import { ADMIN_USER, LEARNER_USER } from './mock-data';

type Screen = 'login' | 'app';
type Role = 'admin' | 'learner';

const ADMIN_NAV = [
  { id: 'dashboard',  label: 'Dashboard', icon: '📊' },
  { id: 'courses',    label: 'Courses',   icon: '📚' },
  { id: 'learners',   label: 'Learners',  icon: '👥' },
  { id: 'reports',    label: 'Reports',   icon: '📈' },
];

const LEARNER_NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '🏠' },
  { id: 'my-courses',   label: 'My Courses',   icon: '📚' },
  { id: 'progress',     label: 'Progress',     icon: '📈' },
  { id: 'certificates', label: 'Certificates', icon: '🏆' },
];

export function Demo() {
  const [screen, setScreen]       = useState<Screen>('login');
  const [role, setRole]           = useState<Role>('admin');
  const [page, setPage]           = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setPage('dashboard');
    setScreen('app');
    setSidebarOpen(false);
  };

  const exit = () => {
    setScreen('login');
    setSidebarOpen(false);
  };

  if (screen === 'login') return <LoginScreen onLogin={login} />;

  const user = role === 'admin' ? ADMIN_USER : LEARNER_USER;
  const nav  = role === 'admin' ? ADMIN_NAV  : LEARNER_NAV;

  const renderPage = () => {
    if (role === 'admin') {
      switch (page) {
        case 'courses':  return <AdminCourses />;
        case 'learners': return <AdminLearners />;
        case 'reports':  return <AdminReports />;
        default:         return <AdminDashboard />;
      }
    }
    switch (page) {
      case 'my-courses':   return <LearnerCourses />;
      case 'progress':     return <LearnerProgress />;
      case 'certificates': return <LearnerCertificates onNavigate={setPage} />;
      default:             return <LearnerDashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <span className={styles.headerBrand}>OnboardingToGo</span>
        <span className={styles.headerMode}>{role === 'admin' ? 'Admin' : 'Learner'} Demo</span>
        <div className={styles.headerSpacer} />
        <div className={styles.headerUser}>
          <div
            className={styles.headerAvatar}
            style={{ background: role === 'admin' ? '#7C3AED' : '#2563EB' }}
          >
            {user.initials}
          </div>
          <span className={styles.headerName}>{user.name}</span>
        </div>
        <button className={styles.exitBtn} onClick={exit}>← Exit demo</button>
      </header>

      <div className={styles.shellBody}>
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <nav>
            {nav.map(item => (
              <button
                key={item.id}
                className={`${styles.navLink} ${page === item.id ? styles.navLinkActive : ''}`}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className={styles.content}>{renderPage()}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build — verify the shell compiles (screens don't exist yet, expected errors)**

```bash
cd Landing_Page && npm run build 2>&1 | head -30
```

Expected errors: "Cannot find module './screens/admin/AdminDashboard'" etc. — that's fine. Continue.

- [ ] **Step 4: Commit**

```bash
git add src/components/demo/Demo.tsx src/components/demo/screens/LoginScreen.tsx
git commit -m "feat: add Demo shell and LoginScreen"
```

---

## Task 4: AdminDashboard.tsx

**Files:**
- Create: `src/components/demo/screens/admin/AdminDashboard.tsx`

The bar chart uses inline SVG. Values `[14,22,18,31,27,9,6]`, max=31. viewBox `0 0 420 110`. Each bar: width=40, gap=18 → 7×40+6×18=388. Bars start at x=16. Bar height = `(value/31)*80`. y = `90 - barHeight`.

- [ ] **Step 1: Create AdminDashboard.tsx**

```tsx
import styles from '../../demo.module.css';
import {
  ADMIN_KPI, WEEKLY_COMPLETIONS, TOP_COURSES, ADMIN_ACTIVITY,
} from '../../mock-data';

export function AdminDashboard() {
  const maxVal = Math.max(...WEEKLY_COMPLETIONS.map(d => d.value));

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* KPI row */}
      <div className={styles.kpiGrid}>
        {ADMIN_KPI.map(k => (
          <div key={k.label} className={styles.kpiCard}>
            <div className={styles.kpiValue}>{k.value}</div>
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiDelta}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className={styles.twoCol}>
        <div className={styles.chartBox}>
          <p className={styles.chartTitle}>Completions this week</p>
          <svg viewBox="0 0 420 110" className={styles.chartSvg}>
            {WEEKLY_COMPLETIONS.map((d, i) => {
              const bh = (d.value / maxVal) * 80;
              const x  = 16 + i * 58;
              return (
                <g key={d.day}>
                  <rect
                    x={x} y={90 - bh} width={40} height={bh}
                    rx={4}
                    fill={d.value === maxVal ? '#4F46E5' : '#E0E7FF'}
                  />
                  <text x={x + 20} y={106} textAnchor="middle" fontSize={10} fill="#94A3B8">
                    {d.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className={styles.chartBox}>
          <p className={styles.chartTitle}>Recent Activity</p>
          <div className={styles.activityFeed}>
            {ADMIN_ACTIVITY.map(a => (
              <div key={a.text} className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div>
                  <div className={styles.activityText}>{a.text}</div>
                  <div className={styles.activityTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses table */}
      <div className={styles.card}>
        <p className={styles.chartTitle}>Top Courses</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Enrolled</th>
                <th>Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TOP_COURSES.map(c => (
                <tr key={c.title}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>{c.enrolled}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.progressBar} style={{ width: 80 }}>
                        <div className={styles.progressFill} style={{ width: `${c.completion}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{c.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${c.status === 'Active' ? styles.badgeActive : styles.badgeDraft}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/admin/AdminDashboard.tsx
git commit -m "feat: add AdminDashboard screen"
```

---

## Task 5: AdminCourses.tsx (with tested filter logic)

**Files:**
- Create: `src/components/demo/screens/admin/AdminCourses.tsx`
- Create: `src/__tests__/demo/filter-utils.test.ts`

The filter logic is a pure function — test it before wiring to the component.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/demo/filter-utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { filterCourses } from '../../components/demo/screens/admin/AdminCourses';
import { ALL_COURSES } from '../../components/demo/mock-data';

describe('filterCourses', () => {
  it('returns all courses when search is empty and tab is All', () => {
    expect(filterCourses(ALL_COURSES, '', 'All')).toHaveLength(ALL_COURSES.length);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterCourses(ALL_COURSES, 'excel', 'All');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Excel for HR');
  });

  it('filters by status tab', () => {
    const drafts = filterCourses(ALL_COURSES, '', 'Draft');
    expect(drafts.every(c => c.status === 'Draft')).toBe(true);
  });

  it('combines search and tab filter', () => {
    const result = filterCourses(ALL_COURSES, 'onboarding', 'Active');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Onboarding 2024');
  });

  it('returns empty when no match', () => {
    expect(filterCourses(ALL_COURSES, 'zzznomatch', 'All')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd Landing_Page && npm test -- filter-utils 2>&1 | tail -10
```

Expected: FAIL — "filterCourses is not exported"

- [ ] **Step 3: Create AdminCourses.tsx with exported filterCourses**

```tsx
import { useState } from 'react';
import styles from '../../demo.module.css';
import { ALL_COURSES, type Course } from '../../mock-data';

type Tab = 'All' | 'Active' | 'Draft';

export function filterCourses(courses: Course[], search: string, tab: Tab): Course[] {
  return courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'All' || c.status === tab;
    return matchesSearch && matchesTab;
  });
}

export function AdminCourses() {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState<Tab>('All');
  const [toast, setToast]   = useState('');

  const visible = filterCourses(ALL_COURSES, search, tab);

  const showToast = () => {
    setToast('Course editor available in the full version.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Courses</h1>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search courses…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filterTabs}>
          {(['All', 'Active', 'Draft'] as Tab[]).map(t => (
            <button
              key={t}
              className={`${styles.filterTab} ${tab === t ? styles.filterTabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.courseList}>
        {visible.map(c => (
          <div key={c.id} className={styles.courseRow}>
            <div className={styles.courseThumb} style={{ background: c.gradient }} />
            <div className={styles.courseInfo}>
              <div className={styles.courseRowTitle}>{c.title}</div>
              <div className={styles.courseCategory}>{c.category}</div>
            </div>
            <div className={styles.courseEnrolled}>{c.enrolled} enrolled</div>
            <div className={styles.courseProgressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${c.completion}%` }} />
              </div>
              <span className={styles.coursePct}>{c.completion}%</span>
            </div>
            <span className={`${styles.badge} ${c.status === 'Active' ? styles.badgeActive : styles.badgeDraft}`}>
              {c.status}
            </span>
            <button className={styles.editBtn} onClick={showToast}>Edit</button>
          </div>
        ))}
        {visible.length === 0 && (
          <p style={{ color: '#94A3B8', fontSize: 13, padding: '20px 0' }}>No courses match your search.</p>
        )}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
cd Landing_Page && npm test -- filter-utils 2>&1 | tail -10
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/demo/screens/admin/AdminCourses.tsx src/__tests__/demo/filter-utils.test.ts
git commit -m "feat: add AdminCourses with tested filter logic"
```

---

## Task 6: AdminLearners.tsx (with tested filter)

**Files:**
- Create: `src/components/demo/screens/admin/AdminLearners.tsx`
- Modify: `src/__tests__/demo/filter-utils.test.ts` (add learner filter tests)

- [ ] **Step 1: Add failing tests for filterLearners**

Append to `src/__tests__/demo/filter-utils.test.ts`:

```ts
import { filterLearners } from '../../components/demo/screens/admin/AdminLearners';
import { ALL_LEARNERS } from '../../components/demo/mock-data';

describe('filterLearners', () => {
  it('returns all when search is empty', () => {
    expect(filterLearners(ALL_LEARNERS, '')).toHaveLength(ALL_LEARNERS.length);
  });

  it('filters by name case-insensitive', () => {
    const result = filterLearners(ALL_LEARNERS, 'anna');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Anna Kowalska');
  });

  it('filters by email', () => {
    const result = filterLearners(ALL_LEARNERS, 'j.porter');
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('j.porter@corp.com');
  });

  it('returns empty when no match', () => {
    expect(filterLearners(ALL_LEARNERS, 'zzznobody')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL on new tests**

```bash
cd Landing_Page && npm test -- filter-utils 2>&1 | tail -15
```

Expected: 5 pass, 4 fail.

- [ ] **Step 3: Create AdminLearners.tsx**

```tsx
import { useState } from 'react';
import styles from '../../demo.module.css';
import { ALL_LEARNERS, type Learner } from '../../mock-data';

export function filterLearners(learners: Learner[], search: string): Learner[] {
  if (!search) return learners;
  const q = search.toLowerCase();
  return learners.filter(
    l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
  );
}

export function AdminLearners() {
  const [search, setSearch] = useState('');
  const visible = filterLearners(ALL_LEARNERS, search);

  return (
    <div>
      <h1 className={styles.pageTitle}>Learners</h1>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Courses</th>
                <th>Completion</th>
                <th>Status</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={styles.avatarSmall} style={{ background: l.color }}>{l.initials}</div>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{l.email}</td>
                  <td>{l.courses}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.progressBar} style={{ width: 60 }}>
                        <div className={styles.progressFill} style={{ width: `${l.completion}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{l.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.statusDot + ' ' + (l.status === 'Active' ? styles.statusDotActive : styles.statusDotInactive)} />
                    <span style={{ fontSize: 12, color: l.status === 'Active' ? '#16A34A' : '#94A3B8' }}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: 12 }}>{l.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run all tests — expect 9 pass**

```bash
cd Landing_Page && npm test -- filter-utils 2>&1 | tail -10
```

Expected: 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/demo/screens/admin/AdminLearners.tsx src/__tests__/demo/filter-utils.test.ts
git commit -m "feat: add AdminLearners with tested filter logic"
```

---

## Task 7: AdminReports.tsx

**Files:**
- Create: `src/components/demo/screens/admin/AdminReports.tsx`

Line chart: 4 points `[68,74,71,82]`. viewBox `0 0 400 120`. x=[40,160,280,380]. y uses formula `15 + (82−v)/14*80`. Points: `40,95 160,61 280,78 380,15`.

- [ ] **Step 1: Create AdminReports.tsx**

```tsx
import styles from '../../demo.module.css';
import { REPORTS_STATS, COMPLETION_TREND, DEPARTMENT_BREAKDOWN } from '../../mock-data';

export function AdminReports() {
  const minVal = Math.min(...COMPLETION_TREND.map(d => d.value));
  const maxVal = Math.max(...COMPLETION_TREND.map(d => d.value));
  const range  = maxVal - minVal || 1;
  const chartW = 400;
  const chartH = 120;
  const padL = 40; const padR = 20; const padT = 15; const padB = 25;
  const usableW = chartW - padL - padR;
  const usableH = chartH - padT - padB;

  const pts = COMPLETION_TREND.map((d, i) => {
    const x = padL + (i / (COMPLETION_TREND.length - 1)) * usableW;
    const y = padT + ((maxVal - d.value) / range) * usableH;
    return { x, y, ...d };
  });

  const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div>
      <h1 className={styles.pageTitle}>Reports</h1>

      {/* Stat cards */}
      <div className={styles.kpiGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        {REPORTS_STATS.map(s => (
          <div key={s.label} className={styles.kpiCard}>
            <div className={styles.kpiValue}>{s.value}</div>
            <div className={styles.kpiLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className={styles.chartBox}>
        <p className={styles.chartTitle}>Completion trend (last 4 weeks)</p>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.chartSvg}>
          {/* Grid lines */}
          {[0, 0.5, 1].map(t => {
            const y = padT + t * usableH;
            return <line key={t} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#F1F5F9" strokeWidth={1} />;
          })}

          {/* Area fill */}
          <path
            d={`M ${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} L ${pts[pts.length-1].x},${padT+usableH} L ${pts[0].x},${padT+usableH} Z`}
            fill="url(#lineGrad)"
            opacity={0.15}
          />

          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Line */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="#4F46E5"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots + labels */}
          {pts.map(p => (
            <g key={p.week}>
              <circle cx={p.x} cy={p.y} r={4} fill="#4F46E5" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={10} fill="#4F46E5" fontWeight={700}>
                {p.value}%
              </text>
              <text x={p.x} y={chartH - 5} textAnchor="middle" fontSize={10} fill="#94A3B8">
                {p.week}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Department table */}
      <div className={styles.card}>
        <p className={styles.chartTitle}>Department Breakdown</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Learners</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENT_BREAKDOWN.map(d => (
                <tr key={d.dept}>
                  <td style={{ fontWeight: 600 }}>{d.dept}</td>
                  <td>{d.learners}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.progressBar} style={{ width: 100 }}>
                        <div className={styles.progressFill} style={{ width: `${d.completion}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{d.completion}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/admin/AdminReports.tsx
git commit -m "feat: add AdminReports with SVG line chart"
```

---

## Task 8: LearnerDashboard.tsx

**Files:**
- Create: `src/components/demo/screens/learner/LearnerDashboard.tsx`

- [ ] **Step 1: Create LearnerDashboard.tsx**

```tsx
import styles from '../../demo.module.css';
import { LEARNER_COURSES, LEARNER_ACTIVITY } from '../../mock-data';

interface Props {
  onNavigate: (page: string) => void;
}

export function LearnerDashboard({ onNavigate }: Props) {
  const continueCourse = LEARNER_COURSES.find(c => c.status === 'in-progress')!;

  const chips = [
    { label: 'Courses Enrolled', value: '5' },
    { label: 'Completed', value: '2' },
    { label: 'XP Points', value: '1,240' },
  ];

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Continue learning */}
      <div className={styles.continueCard}>
        <div className={styles.continueCardInfo}>
          <div className={styles.continueLabel}>Continue learning</div>
          <div className={styles.continueTitle}>{continueCourse.title}</div>
          <div className={styles.continueProgressRow}>
            <div className={styles.continueProgressBar}>
              <div
                className={styles.continueProgressFill}
                style={{ width: `${continueCourse.progress}%` }}
              />
            </div>
            <span className={styles.continuePct}>{continueCourse.progress}%</span>
          </div>
        </div>
        <button className={styles.continueBtn} onClick={() => onNavigate('my-courses')}>
          Continue →
        </button>
      </div>

      {/* Stat chips */}
      <div className={styles.statChips}>
        {chips.map(c => (
          <div key={c.label} className={styles.statChip}>
            <div className={styles.statChipValue}>{c.value}</div>
            <div className={styles.statChipLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className={styles.card}>
        <p className={styles.chartTitle}>Recent Activity</p>
        <div className={styles.activityFeed}>
          {LEARNER_ACTIVITY.map(a => (
            <div key={a.text} className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div>
                <div className={styles.activityText}>{a.text}</div>
                <div className={styles.activityTime}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/learner/LearnerDashboard.tsx
git commit -m "feat: add LearnerDashboard screen"
```

---

## Task 9: LearnerCourses.tsx

**Files:**
- Create: `src/components/demo/screens/learner/LearnerCourses.tsx`

- [ ] **Step 1: Create LearnerCourses.tsx**

```tsx
import styles from '../../demo.module.css';
import { LEARNER_COURSES } from '../../mock-data';

export function LearnerCourses() {
  return (
    <div>
      <h1 className={styles.pageTitle}>My Courses</h1>

      <div className={styles.courseGrid}>
        {LEARNER_COURSES.map(c => {
          const isCompleted  = c.status === 'completed';
          const isInProgress = c.status === 'in-progress';

          return (
            <div key={c.id} className={styles.courseCard}>
              <div className={styles.courseThumbnail} style={{ background: c.gradient }} />
              <div className={styles.courseCardBody}>
                <p className={styles.courseCardTitle}>{c.title}</p>
                <div className={styles.courseCardProgressRow}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className={styles.courseCardPct}>{c.progress}%</span>
                </div>
                <button
                  className={`${styles.courseCardBtn} ${
                    isCompleted  ? styles.btnDone :
                    isInProgress ? styles.btnContinue :
                    styles.btnStart
                  }`}
                  disabled={isCompleted}
                >
                  {isCompleted ? '✓ Completed' : isInProgress ? 'Continue →' : 'Start →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/learner/LearnerCourses.tsx
git commit -m "feat: add LearnerCourses screen"
```

---

## Task 10: LearnerProgress.tsx

**Files:**
- Create: `src/components/demo/screens/learner/LearnerProgress.tsx`

Progress ring: r=50, cx=cy=60, circumference=314.16. At 64%: dashoffset=314.16×0.36=113.1. Ring starts from top via `transform="rotate(-90 60 60)"`.

Weekly bar chart uses same pattern as AdminDashboard: viewBox `0 0 420 110`, 7 bars.

- [ ] **Step 1: Create LearnerProgress.tsx**

```tsx
import styles from '../../demo.module.css';
import { LEARNER_COURSES, WEEKLY_ACTIVITY } from '../../mock-data';

const PROGRESS_PCT = 64;
const CIRCUMFERENCE = 2 * Math.PI * 50; // 314.16

export function LearnerProgress() {
  const dashOffset = CIRCUMFERENCE * (1 - PROGRESS_PCT / 100);
  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.value));

  return (
    <div>
      <h1 className={styles.pageTitle}>Progress</h1>

      {/* Progress ring */}
      <div className={styles.progressRingSection}>
        <div className={styles.progressRingWrap}>
          <svg viewBox="0 0 120 120" className={styles.progressRingSvg}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth={10} />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.progressRingText}>
            <span className={styles.progressRingPct}>{PROGRESS_PCT}%</span>
            <span className={styles.progressRingLabel}>overall</span>
          </div>
        </div>

        <div className={styles.progressRingInfo}>
          <div className={styles.streakRow}>
            <span className={styles.streakBadge}>🔥 5-day streak</span>
          </div>
          <div className={styles.xpBar}>
            <span className={styles.xpLabel}>XP: 1,240 · Level 8 · Next level at 1,500</span>
            <div className={styles.xpProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '48%' }} />
              </div>
              <span style={{ fontSize: 11, color: '#64748B', flexShrink: 0 }}>240 / 500 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-course progress */}
      <div className={styles.card} style={{ marginBottom: 20 }}>
        <p className={styles.chartTitle}>Course Progress</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LEARNER_COURSES.map(c => (
            <div key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{c.title}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5' }}>{c.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly activity chart */}
      <div className={styles.chartBox}>
        <p className={styles.chartTitle}>This week's activity (minutes)</p>
        <svg viewBox="0 0 420 110" className={styles.chartSvg}>
          {WEEKLY_ACTIVITY.map((d, i) => {
            const bh = maxActivity > 0 ? (d.value / maxActivity) * 80 : 0;
            const x  = 16 + i * 58;
            return (
              <g key={d.day}>
                <rect
                  x={x} y={90 - bh} width={40} height={bh}
                  rx={4}
                  fill={d.value === maxActivity ? '#2563EB' : '#DBEAFE'}
                />
                <text x={x + 20} y={106} textAnchor="middle" fontSize={10} fill="#94A3B8">
                  {d.day}
                </text>
                {d.value > 0 && (
                  <text x={x + 20} y={90 - bh - 4} textAnchor="middle" fontSize={9} fill="#64748B">
                    {d.value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/learner/LearnerProgress.tsx
git commit -m "feat: add LearnerProgress with SVG ring and activity chart"
```

---

## Task 11: LearnerCertificates.tsx

**Files:**
- Create: `src/components/demo/screens/learner/LearnerCertificates.tsx`

- [ ] **Step 1: Create LearnerCertificates.tsx**

```tsx
import { useState } from 'react';
import styles from '../../demo.module.css';
import { CERTIFICATES_EARNED, CERTIFICATES_IN_PROGRESS } from '../../mock-data';

interface Props {
  onNavigate: (page: string) => void;
}

export function LearnerCertificates({ onNavigate }: Props) {
  const [toast, setToast] = useState('');

  const showToast = () => {
    setToast('PDF download available in the full version.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Certificates</h1>

      <p className={styles.sectionTitle}>Earned</p>
      <div className={styles.certGrid}>
        {CERTIFICATES_EARNED.map(c => (
          <div key={c.title} className={`${styles.certCard} ${styles.certCardGold}`}>
            <div className={styles.certIcon}>🏅</div>
            <div className={styles.certTitle}>{c.title}</div>
            <div className={styles.certDate}>Issued: {c.issued}</div>
            <button className={styles.certBtn} onClick={showToast}>
              Download PDF
            </button>
          </div>
        ))}
      </div>

      <p className={styles.sectionTitle}>In Progress — Earn your next certificate</p>
      <div className={styles.inProgressCerts}>
        {CERTIFICATES_IN_PROGRESS.map(c => (
          <div key={c.title} className={styles.inProgressCertCard}>
            <div className={styles.inProgressCertInfo}>
              <div className={styles.inProgressCertTitle}>{c.title}</div>
              <div className={styles.inProgressCertProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
                </div>
                <span className={styles.inProgressCertPct}>{c.progress}%</span>
              </div>
            </div>
            <button className={styles.continueSmallBtn} onClick={() => onNavigate('my-courses')}>
              Continue →
            </button>
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo/screens/learner/LearnerCertificates.tsx
git commit -m "feat: add LearnerCertificates screen"
```

---

## Task 12: Full build verify + run all tests

**Files:** None created — verification only.

- [ ] **Step 1: Run all tests**

```bash
cd Landing_Page && npm test 2>&1 | tail -20
```

Expected: all tests pass (9 filter-utils tests + any pre-existing navigation tests).

- [ ] **Step 2: Build**

```bash
cd Landing_Page && npm run build 2>&1 | tail -20
```

Expected: `11 page(s) built` with no errors. Routes `/demo/`, `/pl/demo/`, `/de/demo/` present in output.

- [ ] **Step 3: Start dev server and manually verify**

```bash
cd Landing_Page && npm run dev
```

Open `http://localhost:4321/demo/` and check:
- Login screen shows with two account cards
- Clicking "Log in as Sarah" → Admin dashboard with KPI cards, bar chart, tables
- All 4 Admin nav links work (Dashboard, Courses, Learners, Reports)
- Courses page: search filters results in real time; filter tabs work
- Learners page: search filters results in real time
- Reports page: line chart and department table visible
- Clicking "Log in as James" → Learner dashboard with continue card, stat chips
- All 4 Learner nav links work
- Certificates: "Download PDF" shows toast; "Continue →" navigates to My Courses
- "Exit demo" returns to login screen
- Mobile: hamburger visible at ≤768px, sidebar slides in/out

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete LMS demo app — interactive Admin+Learner simulation with 8 screens"
```
