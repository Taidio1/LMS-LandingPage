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

type Screen = 'login' | 'app';
type Role = 'admin' | 'learner';

interface Props {
  homeHref?: string;
}

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

export function Demo({ homeHref = '/' }: Props) {
  const [screen, setScreen]           = useState<Screen>('login');
  const [role, setRole]               = useState<Role>('admin');
  const [page, setPage]               = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setPage('dashboard');
    setScreen('app');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, left: 0 });
  };

  const exit = () => {
    setScreen('login');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, left: 0 });
  };

  if (screen === 'login') return <LoginScreen homeHref={homeHref} onLogin={login} />;

  const nav = role === 'admin' ? ADMIN_NAV : LEARNER_NAV;

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
            {role === 'admin' ? '⚙️' : '🎓'}
          </div>
          <span className={styles.headerName}>{role === 'admin' ? 'Admin' : 'Learner'}</span>
        </div>
        <button className={styles.exitBtn} onClick={exit}>← Exit demo</button>
        <a className={styles.siteBackBtn} href={homeHref}>Back to site</a>
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
