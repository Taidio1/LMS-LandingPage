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
