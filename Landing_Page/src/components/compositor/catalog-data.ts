export type ComponentRole = 'learner' | 'admin';
export type ComponentType = 'module' | 'ui-block';
export type UIBlockGroup = 'data' | 'content' | 'navigation';

export interface ComponentDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ComponentType;
  role?: ComponentRole;
  uiGroup?: UIBlockGroup;
}

export const MODULES: ComponentDef[] = [
  { id: 'learner-dashboard', name: 'Learner Dashboard', description: 'Welcome banner, progress summary, recent activity', icon: '🏠', type: 'module', role: 'learner' },
  { id: 'my-courses', name: 'Moje Kursy', description: 'Course grid + embedded video player', icon: '📚', type: 'module', role: 'learner' },
  { id: 'progress', name: 'Postępy', description: 'Progress bars, weekly chart, achievement badges', icon: '📈', type: 'module', role: 'learner' },
  { id: 'certificates', name: 'Certyfikaty', description: 'Certificate generation and display', icon: '🏆', type: 'module', role: 'learner' },
  { id: 'gamification', name: 'Gamifikacja', description: 'XP points, levels, leaderboard', icon: '🎮', type: 'module', role: 'learner' },
  { id: 'admin-dashboard', name: 'Admin Dashboard', description: 'KPI stats, completion trend chart, top learners', icon: '📊', type: 'module', role: 'admin' },
  { id: 'courses-manager', name: 'Manager Kursów', description: 'Course list + side-panel editor', icon: '🗂️', type: 'module', role: 'admin' },
  { id: 'learners-table', name: 'Zarządzanie Learnerami', description: 'Filterable table with learner status', icon: '👥', type: 'module', role: 'admin' },
  { id: 'notifications', name: 'Powiadomienia', description: 'Alert and notification system', icon: '🔔', type: 'module', role: 'admin' },
];

export const UI_BLOCKS: ComponentDef[] = [
  { id: 'stat-cards', name: 'Stat Cards', description: 'Key metric cards with icons and values', icon: '📋', type: 'ui-block', uiGroup: 'data' },
  { id: 'bar-chart', name: 'Bar Chart', description: 'Weekly activity bar chart', icon: '📊', type: 'ui-block', uiGroup: 'data' },
  { id: 'progress-bars', name: 'Progress Bars', description: 'Course completion progress bars', icon: '▶️', type: 'ui-block', uiGroup: 'data' },
  { id: 'data-table', name: 'Data Table', description: 'Sortable and filterable data table', icon: '🗃️', type: 'ui-block', uiGroup: 'data' },
  { id: 'course-cards', name: 'Course Cards', description: 'Visual course cards with thumbnail and metadata', icon: '🃏', type: 'ui-block', uiGroup: 'content' },
  { id: 'video-player', name: 'Video Player', description: 'Embedded video player with controls', icon: '🎬', type: 'ui-block', uiGroup: 'content' },
  { id: 'quiz-block', name: 'Quiz Block', description: 'Multiple choice question interface', icon: '❓', type: 'ui-block', uiGroup: 'content' },
  { id: 'activity-feed', name: 'Activity Feed', description: 'Recent learner activity list', icon: '🗒️', type: 'ui-block', uiGroup: 'content' },
  { id: 'sidebar-nav', name: 'Sidebar Nav', description: 'Collapsible sidebar navigation', icon: '☰', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'tab-bar', name: 'Tab Bar', description: 'Horizontal tab navigation', icon: '📑', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'header-role-badge', name: 'Header + Role Badge', description: 'App header with user role indicator', icon: '🎭', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'breadcrumbs', name: 'Breadcrumbs', description: 'Navigation path indicator', icon: '🧭', type: 'ui-block', uiGroup: 'navigation' },
];

export const LEARNER_MODULE_IDS = MODULES.filter(m => m.role === 'learner').map(m => m.id);
export const ADMIN_MODULE_IDS = MODULES.filter(m => m.role === 'admin').map(m => m.id);
