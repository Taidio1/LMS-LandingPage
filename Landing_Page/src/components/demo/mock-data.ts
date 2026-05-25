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
