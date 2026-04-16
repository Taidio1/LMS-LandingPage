# LMS Demo App — Expanded Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the LMS demo from two full-page views into a multi-tab app with role-aware navigation, rich Learner screens (Dashboard, My Courses, Progress), and rich Admin screens (Dashboard, Courses editor, Learners table).

**Architecture:** State-based tab navigation via `NavigationContext` (no React Router). Each role has 3 tabs. `TabBar` renders below the sticky header and switches based on role. `App.tsx` becomes a thin view router.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, @tanstack/react-query, lucide-react

---

### Task 1: Expand mockData.ts

**Files:**
- Modify: `src/services/mockData.ts`

- [ ] Replace the entire contents of `src/services/mockData.ts`:

```typescript
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  content: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Learner {
  id: number;
  name: string;
  progress: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
  enrolledCourse: string;
}

export const MOCK_COURSES: Course[] = [
  {
    id: 'odysseio-advantage',
    title: 'The Odysseio Advantage',
    description: 'Learn why our bespoke LMS approach is the future of enterprise learning.',
    lessons: [
      { id: 'l1-1', title: 'Why Individual LMS?', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '5:20' },
      { id: 'l1-2', title: 'Security & Scalability', type: 'pdf', content: 'LMS_Technical_Specs.pdf', duration: '15 min read' },
      { id: 'l1-3', title: 'Your Brand, Your Rules', type: 'text', content: 'Deep dive into white-label capabilities...', duration: '10 min read' },
    ],
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    description: 'Enterprise-grade security practices and regulatory compliance frameworks.',
    lessons: [
      { id: 'l2-1', title: 'Data Privacy Fundamentals', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '8:10' },
      { id: 'l2-2', title: 'GDPR in Practice', type: 'pdf', content: 'GDPR_Guide.pdf', duration: '20 min read' },
      { id: 'l2-3', title: 'ISO 27001 Overview', type: 'text', content: 'Overview of the ISO 27001 standard...', duration: '12 min read' },
      { id: 'l2-4', title: 'Incident Response', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '6:45' },
    ],
  },
  {
    id: 'branding-platform',
    title: 'Branding Your Platform',
    description: 'Design and deploy a fully branded LMS experience that matches your identity.',
    lessons: [
      { id: 'l3-1', title: 'Brand Identity in LMS', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '7:30' },
      { id: 'l3-2', title: 'Custom Themes & CSS', type: 'text', content: 'Theming guide content...', duration: '15 min read' },
      { id: 'l3-3', title: 'White-Label Checklist', type: 'pdf', content: 'WL_Checklist.pdf', duration: '10 min read' },
    ],
  },
];

export const MOCK_COURSE = MOCK_COURSES[0];

export const MOCK_LEARNERS: Learner[] = [
  { id: 1, name: 'Alex Johnson',    progress: 100, lastActive: '30m ago', status: 'Active',   enrolledCourse: 'The Odysseio Advantage' },
  { id: 2, name: 'Sarah Chen',      progress: 85,  lastActive: '2h ago',  status: 'Active',   enrolledCourse: 'Security & Compliance' },
  { id: 3, name: 'Mike Williams',   progress: 72,  lastActive: '4h ago',  status: 'Active',   enrolledCourse: 'Branding Your Platform' },
  { id: 4, name: 'Emma Davis',      progress: 60,  lastActive: '1d ago',  status: 'Active',   enrolledCourse: 'The Odysseio Advantage' },
  { id: 5, name: 'James Brown',     progress: 45,  lastActive: '2d ago',  status: 'Active',   enrolledCourse: 'Security & Compliance' },
  { id: 6, name: 'Olivia Taylor',   progress: 30,  lastActive: '3d ago',  status: 'Inactive', enrolledCourse: 'Branding Your Platform' },
  { id: 7, name: 'Daniel Martinez', progress: 15,  lastActive: '4d ago',  status: 'Inactive', enrolledCourse: 'Security & Compliance' },
  { id: 8, name: 'Sophie Anderson', progress: 10,  lastActive: '5d ago',  status: 'Inactive', enrolledCourse: 'The Odysseio Advantage' },
];

export const WEEKLY_ACTIVITY = [
  { day: 'Mon', count: 3 },
  { day: 'Tue', count: 5 },
  { day: 'Wed', count: 2 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 1 },
  { day: 'Sun', count: 6 },
];

export const fetchUserActivity = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_LEARNERS.slice(0, 3).map(l => ({
    id: l.id, name: l.name, progress: l.progress, lastActive: l.lastActive,
  }));
};
```

- [ ] Run type check (1 expected error in App.tsx about old imports — ignore for now):

```bash
cd LMS_Odysseio_app && npx tsc --noEmit
```

- [ ] Commit:

```bash
git add src/services/mockData.ts
git commit -m "feat: expand mock data to 3 courses, 8 learners, weekly activity"
```

---

### Task 2: Create NavigationContext.tsx

**Files:**
- Create: `src/context/NavigationContext.tsx`

- [ ] Create `src/context/NavigationContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRole } from './RoleContext';

export const LEARNER_TABS = ['Dashboard', 'My Courses', 'Progress'] as const;
export const ADMIN_TABS = ['Dashboard', 'Courses', 'Learners'] as const;

export type LearnerTab = typeof LEARNER_TABS[number];
export type AdminTab = typeof ADMIN_TABS[number];
export type ActiveTab = LearnerTab | AdminTab;

interface NavigationContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  tabs: readonly string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');

  useEffect(() => {
    setActiveTab('Dashboard');
  }, [role]);

  const tabs = role === 'LEARNER' ? LEARNER_TABS : ADMIN_TABS;

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab, tabs }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
```

- [ ] Commit:

```bash
git add src/context/NavigationContext.tsx
git commit -m "feat: add NavigationContext for role-aware tab state"
```

---

### Task 3: Create TabBar.tsx + wire providers + simplify App.tsx

**Files:**
- Create: `src/components/shared/TabBar.tsx`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/components/shared/TabBar.tsx`:

```tsx
import { useRole } from '../../context/RoleContext';
import { useNavigation, ActiveTab } from '../../context/NavigationContext';

export const TabBar = () => {
  const { role } = useRole();
  const { activeTab, setActiveTab, tabs } = useNavigation();

  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-40">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ActiveTab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-400 italic pr-2">
          {role === 'LEARNER' ? 'Learner view' : 'Admin view'}
        </span>
      </div>
    </div>
  );
};
```

- [ ] Update `src/main.tsx` to wrap with `NavigationProvider` (must be inside `RoleProvider`):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { RoleProvider } from './context/RoleContext.tsx'
import { NavigationProvider } from './context/NavigationContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </RoleProvider>
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] Replace `src/App.tsx` with a thin router (delete old `LearnerView` and `AdminView`):

```tsx
import { useRole } from './context/RoleContext';
import { useNavigation } from './context/NavigationContext';
import { Header } from './components/shared/Header';
import { TabBar } from './components/shared/TabBar';

const Placeholder = ({ name }: { name: string }) => (
  <div className="p-12 text-center text-slate-400 text-lg">{name} — coming soon</div>
);

function App() {
  const { role } = useRole();
  const { activeTab } = useNavigation();

  const renderView = () => {
    if (role === 'LEARNER') {
      if (activeTab === 'My Courses') return <Placeholder name="My Courses" />;
      if (activeTab === 'Progress') return <Placeholder name="Progress" />;
      return <Placeholder name="Learner Dashboard" />;
    }
    if (activeTab === 'Courses') return <Placeholder name="Courses" />;
    if (activeTab === 'Learners') return <Placeholder name="Learners" />;
    return <Placeholder name="Admin Dashboard" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <TabBar />
      <main className="container mx-auto">{renderView()}</main>
    </div>
  );
}

export default App;
```

- [ ] Run type check — expect 0 errors:

```bash
npx tsc --noEmit
```

- [ ] Start dev server and verify tab bar renders and switches on role change:

```bash
npm run dev
```

Open http://localhost:5173. Header → tab bar with "Dashboard / My Courses / Progress". Switch role → tabs change to "Dashboard / Courses / Learners".

- [ ] Commit:

```bash
git add src/components/shared/TabBar.tsx src/main.tsx src/App.tsx
git commit -m "feat: add TabBar, wire NavigationProvider, simplify App.tsx"
```

---

### Task 4: LearnerDashboard.tsx

**Files:**
- Create: `src/views/learner/LearnerDashboard.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/learner/LearnerDashboard.tsx`:

```tsx
import { BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';
import { MOCK_COURSES } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';
import { useNavigation, ActiveTab } from '../../context/NavigationContext';

export const LearnerDashboard = () => {
  const { completedLessons } = useProgress();
  const { setActiveTab } = useNavigation();

  const totalLessons = MOCK_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const lastCourse = MOCK_COURSES[0];
  const lastCourseDone = completedLessons.filter(id => lastCourse.lessons.some(l => l.id === id)).length;
  const lastCourseProgress = Math.round((lastCourseDone / lastCourse.lessons.length) * 100);

  const stats = [
    { label: 'Courses Enrolled', value: MOCK_COURSES.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Lessons Completed', value: completedLessons.length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Overall Progress', value: `${overallProgress}%`, icon: TrendingUp, color: 'text-[#4F46E5]' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="bg-brand-gradient rounded-3xl p-8 text-white">
        <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
        <h1 className="text-3xl font-bold mb-2">Alex Johnson</h1>
        <p className="text-white/80">You're making great progress. Keep it up!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Continue Learning</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{lastCourse.title}</h4>
            <p className="text-sm text-slate-500 mt-1">{lastCourse.description}</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{lastCourseProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${lastCourseProgress}%` }} />
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('My Courses' as ActiveTab)}
            className="shrink-0 bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Resume →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        {completedLessons.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet — start a lesson in My Courses!</p>
        ) : (
          <div className="space-y-3">
            {[...completedLessons].reverse().slice(0, 5).map((lessonId, i) => {
              const course = MOCK_COURSES.find(c => c.lessons.some(l => l.id === lessonId));
              const lesson = course?.lessons.find(l => l.id === lessonId);
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{lesson?.title}</span>
                  <span className="text-slate-400 text-xs ml-auto">{course?.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
```

- [ ] In `src/App.tsx`, add import and replace the learner Dashboard placeholder:

```tsx
// Add at top:
import { LearnerDashboard } from './views/learner/LearnerDashboard';

// Replace:
// return <Placeholder name="Learner Dashboard" />;
return <LearnerDashboard />;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Verify in browser: Learner → Dashboard shows welcome banner, 3 stat cards, continue learning card, recent activity list.

- [ ] Commit:

```bash
git add src/views/learner/LearnerDashboard.tsx src/App.tsx
git commit -m "feat: add LearnerDashboard view"
```

---

### Task 5: MyCourses.tsx

**Files:**
- Create: `src/views/learner/MyCourses.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/learner/MyCourses.tsx`:

```tsx
import { useState } from 'react';
import { CheckCircle2, PlayCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_COURSES, Course, Lesson } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';

const CoursePlayer = ({ course, onBack }: { course: Course; onBack: () => void }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.lessons[0]);
  const { toggleLesson, isCompleted, completedLessons } = useProgress();

  const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
  const progressPercent = Math.round((done / course.lessons.length) * 100);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <div className="w-full md:w-80 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to My Courses
        </button>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{course.title}</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Your Progress</span>
            <span className="font-semibold text-[#4F46E5]">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-sm">Course Content</div>
          <div className="divide-y divide-slate-100">
            {course.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 ${activeLesson.id === lesson.id ? 'bg-indigo-50' : ''}`}
              >
                {isCompleted(lesson.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <PlayCircle className={`w-5 h-5 shrink-0 ${activeLesson.id === lesson.id ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeLesson.id === lesson.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{lesson.title}</p>
                  <p className="text-xs text-slate-500">{lesson.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            {activeLesson.type === 'video' ? (
              <iframe src={activeLesson.content} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="text-center p-12">
                <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h4 className="text-white text-xl font-bold">{activeLesson.title}</h4>
                <p className="text-slate-400 mt-2">Document Preview Mode</p>
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
              <p className="text-slate-500 mt-1">Module: {course.title}</p>
            </div>
            <button
              onClick={() => toggleLesson(activeLesson.id)}
              className={`flex items-center gap-2 px-8 h-12 rounded-xl font-semibold text-white shadow-lg transition-colors ${isCompleted(activeLesson.id) ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-gradient hover:opacity-90'}`}
            >
              {isCompleted(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { completedLessons } = useProgress();

  if (selectedCourse) return <CoursePlayer course={selectedCourse} onBack={() => setSelectedCourse(null)} />;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => {
          const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
          const progress = Math.round((done / course.lessons.length) * 100);
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-slate-600" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-1">{course.description}</p>
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{done} / {course.lessons.length} lessons</span>
                    <span className="font-semibold text-[#4F46E5]">{progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full bg-brand-gradient text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Continue'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] In `src/App.tsx`, add import and replace the My Courses placeholder:

```tsx
import { MyCourses } from './views/learner/MyCourses';
// Replace: if (activeTab === 'My Courses') return <Placeholder name="My Courses" />;
if (activeTab === 'My Courses') return <MyCourses />;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Verify in browser: 3 course cards with progress bars. Click a card → player with lesson sidebar. Mark as Complete → checkmark. Back button → returns to grid.

- [ ] Commit:

```bash
git add src/views/learner/MyCourses.tsx src/App.tsx
git commit -m "feat: add MyCourses view with course grid and embedded player"
```

---

### Task 6: Progress.tsx

**Files:**
- Create: `src/views/learner/Progress.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/learner/Progress.tsx`:

```tsx
import { Award, Star, Zap } from 'lucide-react';
import { MOCK_COURSES, WEEKLY_ACTIVITY } from '../../services/mockData';
import { useProgress } from '../../hooks/useProgress';

const BADGES = [
  { icon: Zap,   label: 'First Lesson',    desc: 'Complete your first lesson',  unlocked: (done: number) => done >= 1 },
  { icon: Star,  label: 'Halfway There',   desc: 'Reach 50% overall progress',  unlocked: (done: number, total: number) => total > 0 && done / total >= 0.5 },
  { icon: Award, label: 'Course Complete', desc: 'Finish an entire course',      unlocked: (_d: number, _t: number, hasFull: boolean) => hasFull },
];

export const Progress = () => {
  const { completedLessons } = useProgress();
  const totalLessons = MOCK_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const hasFullCourse = MOCK_COURSES.some(c => c.lessons.every(l => completedLessons.includes(l.id)));
  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.count));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Progress</h2>
        <p className="text-slate-500 mt-1">Track your learning journey</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="text-center shrink-0">
          <p className="text-6xl font-bold text-[#4F46E5]">{overallPercent}%</p>
          <p className="text-sm text-slate-500 mt-2">Overall Completion</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gradient transition-all duration-700" style={{ width: `${overallPercent}%` }} />
          </div>
          <p className="text-sm text-slate-500">{completedLessons.length} of {totalLessons} lessons completed</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Course Breakdown</h3>
        <div className="space-y-6">
          {MOCK_COURSES.map((course) => {
            const done = completedLessons.filter(id => course.lessons.some(l => l.id === id)).length;
            const pct = Math.round((done / course.lessons.length) * 100);
            return (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{course.title}</span>
                  <span className="text-slate-500">{done} / {course.lessons.length} lessons · <span className="font-semibold text-[#4F46E5]">{pct}%</span></span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const unlocked = badge.unlocked(completedLessons.length, totalLessons, hasFullCourse);
            return (
              <div key={badge.label} className={`rounded-xl p-4 flex items-center gap-4 border transition-opacity ${unlocked ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${unlocked ? 'bg-brand-gradient' : 'bg-slate-200'}`}>
                  <badge.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{badge.label}</p>
                  <p className="text-xs text-slate-500">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Weekly Activity</h3>
        <div className="flex items-end gap-3 h-32">
          {WEEKLY_ACTIVITY.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-brand-gradient rounded-t-md" style={{ height: `${(day.count / maxActivity) * 100}%` }} />
              <span className="text-xs text-slate-500">{day.day}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Lessons completed per day (mock data)</p>
      </div>
    </div>
  );
};
```

- [ ] In `src/App.tsx`:

```tsx
import { Progress } from './views/learner/Progress';
// Replace: if (activeTab === 'Progress') return <Placeholder name="Progress" />;
if (activeTab === 'Progress') return <Progress />;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Verify in browser: Learner → Progress shows overall %, 3 course bars, 3 badges (unlocked by completing lessons), 7-bar weekly chart.

- [ ] Commit:

```bash
git add src/views/learner/Progress.tsx src/App.tsx
git commit -m "feat: add Progress view with bars, badges, and weekly chart"
```

---

### Task 7: AdminDashboard.tsx

**Files:**
- Create: `src/views/admin/AdminDashboard.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/admin/AdminDashboard.tsx`:

```tsx
import { Users, BarChart3, PlayCircle, CheckCircle2 } from 'lucide-react';
import { MOCK_COURSES, MOCK_LEARNERS, WEEKLY_ACTIVITY } from '../../services/mockData';

const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.count));

export const AdminDashboard = () => {
  const avgCompletion = Math.round(MOCK_LEARNERS.reduce((s, l) => s + l.progress, 0) / MOCK_LEARNERS.length);
  const activeSessions = MOCK_LEARNERS.filter(l => l.status === 'Active').length;

  const stats = [
    { label: 'Total Learners', value: MOCK_LEARNERS.length, icon: Users, color: 'text-blue-600' },
    { label: 'Avg. Completion', value: `${avgCompletion}%`, icon: BarChart3, color: 'text-[#4F46E5]' },
    { label: 'Active Sessions', value: activeSessions, icon: PlayCircle, color: 'text-green-600' },
    { label: 'Engagement Rate', value: '+12%', icon: CheckCircle2, color: 'text-purple-600' },
  ];

  const topCourses = MOCK_COURSES.map(course => {
    const enrollees = MOCK_LEARNERS.filter(l => l.enrolledCourse === course.title);
    const avg = enrollees.length > 0 ? Math.round(enrollees.reduce((s, l) => s + l.progress, 0) / enrollees.length) : 0;
    return { ...course, avgCompletion: avg, learnerCount: enrollees.length };
  }).sort((a, b) => b.avgCompletion - a.avgCompletion);

  const topLearners = [...MOCK_LEARNERS].sort((a, b) => b.progress - a.progress).slice(0, 3);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">Real-time engagement metrics for your platform.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+4.5%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg mb-6">Completion Trend</h3>
          <div className="flex items-end gap-3 h-32">
            {WEEKLY_ACTIVITY.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-brand-gradient rounded-t-md" style={{ height: `${(day.count / maxActivity) * 100}%` }} />
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Top Courses</h3>
          <div className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700 truncate mr-2">{course.title}</span>
                  <span className="shrink-0 text-[#4F46E5] font-semibold">{course.avgCompletion}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient" style={{ width: `${course.avgCompletion}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{course.learnerCount} learners</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-6">Most Active Learners</h3>
        <div className="space-y-4">
          {topLearners.map((learner) => (
            <div key={learner.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[#4F46E5] shrink-0">
                {learner.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700">{learner.name}</span>
                  <span className="text-xs text-slate-400">{learner.lastActive}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient" style={{ width: `${learner.progress}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700 w-10 text-right">{learner.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

- [ ] In `src/App.tsx`:

```tsx
import { AdminDashboard } from './views/admin/AdminDashboard';
// Replace: return <Placeholder name="Admin Dashboard" />;
return <AdminDashboard />;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Verify in browser: Admin → Dashboard shows 4 stat cards, bar chart, top courses, most active learners.

- [ ] Commit:

```bash
git add src/views/admin/AdminDashboard.tsx src/App.tsx
git commit -m "feat: add AdminDashboard view with stats, chart, and highlights"
```

---

### Task 8: CoursesManager.tsx

**Files:**
- Create: `src/views/admin/CoursesManager.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/admin/CoursesManager.tsx`:

```tsx
import { useState } from 'react';
import { PlayCircle, FileText, AlignJustify, Plus } from 'lucide-react';
import { MOCK_COURSES, Course, Lesson } from '../../services/mockData';

const lessonIcon = (type: Lesson['type']) => {
  if (type === 'video') return <PlayCircle className="w-4 h-4 text-[#4F46E5]" />;
  if (type === 'pdf') return <FileText className="w-4 h-4 text-orange-500" />;
  return <FileText className="w-4 h-4 text-slate-400" />;
};

const completionMap: Record<string, number> = {
  'The Odysseio Advantage': 74,
  'Security & Compliance': 58,
  'Branding Your Platform': 41,
};

export const CoursesManager = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(MOCK_COURSES[0]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Courses</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex" style={{ minHeight: '600px' }}>
        {/* Left panel */}
        <div className="w-72 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Courses</p>
          </div>
          <div className="flex-1 divide-y divide-slate-100">
            {MOCK_COURSES.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left p-4 transition-colors hover:bg-slate-50 ${selectedCourse.id === course.id ? 'bg-indigo-50 border-r-2 border-[#4F46E5]' : ''}`}
              >
                <p className={`text-sm font-semibold ${selectedCourse.id === course.id ? 'text-[#4F46E5]' : 'text-slate-700'}`}>{course.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{course.lessons.length} lessons · {completionMap[course.title] ?? 0}% avg</p>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-400 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
              <Plus className="w-4 h-4" /> New Course
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 space-y-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edit Course</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                key={selectedCourse.id + '-title'}
                type="text"
                defaultValue={selectedCourse.title}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                key={selectedCourse.id + '-desc'}
                defaultValue={selectedCourse.description}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] resize-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Lessons</p>
              <span className="text-xs text-slate-400">Drag to reorder</span>
            </div>
            <div className="space-y-2">
              {selectedCourse.lessons.map((lesson, i) => (
                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 group cursor-grab">
                  <AlignJustify className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400 w-5 shrink-0">{i + 1}.</span>
                  {lessonIcon(lesson.type)}
                  <span className="flex-1 text-sm font-medium text-slate-700">{lesson.title}</span>
                  <span className="text-xs text-slate-400 shrink-0">{lesson.duration}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button className="bg-brand-gradient text-white px-8 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] In `src/App.tsx`:

```tsx
import { CoursesManager } from './views/admin/CoursesManager';
// Replace: if (activeTab === 'Courses') return <Placeholder name="Courses" />;
if (activeTab === 'Courses') return <CoursesManager />;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Verify in browser: Admin → Courses shows left panel with 3 courses, right panel with editable title/description fields, lessons list with drag handles and type icons, Save/New Course/Add Lesson buttons.

- [ ] Commit:

```bash
git add src/views/admin/CoursesManager.tsx src/App.tsx
git commit -m "feat: add CoursesManager view with list and side-panel editor"
```

---

### Task 9: LearnersTable.tsx + final App.tsx cleanup

**Files:**
- Create: `src/views/admin/LearnersTable.tsx`
- Modify: `src/App.tsx`

- [ ] Create `src/views/admin/LearnersTable.tsx`:

```tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { MOCK_LEARNERS } from '../../services/mockData';

export const LearnersTable = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_LEARNERS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Learners</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search learners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Learner', 'Enrolled Course', 'Progress', 'Last Active', 'Status'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((learner) => (
              <tr key={learner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[#4F46E5] text-sm shrink-0">
                      {learner.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{learner.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{learner.enrolledCourse}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gradient" style={{ width: `${learner.progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-10 text-right">{learner.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{learner.lastActive}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${learner.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {learner.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">No learners match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

- [ ] Replace `src/App.tsx` entirely with the final version (no more `Placeholder`):

```tsx
import { useRole } from './context/RoleContext';
import { useNavigation } from './context/NavigationContext';
import { Header } from './components/shared/Header';
import { TabBar } from './components/shared/TabBar';
import { LearnerDashboard } from './views/learner/LearnerDashboard';
import { MyCourses } from './views/learner/MyCourses';
import { Progress } from './views/learner/Progress';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { CoursesManager } from './views/admin/CoursesManager';
import { LearnersTable } from './views/admin/LearnersTable';

function App() {
  const { role } = useRole();
  const { activeTab } = useNavigation();

  const renderView = () => {
    if (role === 'LEARNER') {
      if (activeTab === 'My Courses') return <MyCourses />;
      if (activeTab === 'Progress') return <Progress />;
      return <LearnerDashboard />;
    }
    if (activeTab === 'Courses') return <CoursesManager />;
    if (activeTab === 'Learners') return <LearnersTable />;
    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <TabBar />
      <main className="container mx-auto">{renderView()}</main>
    </div>
  );
}

export default App;
```

- [ ] Run `npx tsc --noEmit` — expect 0 errors.

- [ ] Start dev server, verify all 6 tabs work:
  - Learner: Dashboard, My Courses (grid + player), Progress (bars + badges + chart)
  - Admin: Dashboard, Courses (list + editor), Learners (table + search)
  - Switch role → tab bar changes, resets to Dashboard

- [ ] Commit:

```bash
git add src/views/admin/LearnersTable.tsx src/App.tsx
git commit -m "feat: add LearnersTable view and finalize App.tsx router"
```

---

*All 9 tasks complete — 6 fully-featured screens, role-aware navigation, no new dependencies.*
