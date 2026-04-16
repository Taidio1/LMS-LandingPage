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
