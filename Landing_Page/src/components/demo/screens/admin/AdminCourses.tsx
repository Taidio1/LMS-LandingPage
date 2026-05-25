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
