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

      <div className={styles.statChips}>
        {chips.map(c => (
          <div key={c.label} className={styles.statChip}>
            <div className={styles.statChipValue}>{c.value}</div>
            <div className={styles.statChipLabel}>{c.label}</div>
          </div>
        ))}
      </div>

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
