import styles from '../../demo.module.css';
import {
  ADMIN_KPI, WEEKLY_COMPLETIONS, TOP_COURSES, ADMIN_ACTIVITY,
} from '../../mock-data';

export function AdminDashboard() {
  const maxVal = Math.max(...WEEKLY_COMPLETIONS.map(d => d.value));

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.kpiGrid}>
        {ADMIN_KPI.map(k => (
          <div key={k.label} className={styles.kpiCard}>
            <div className={styles.kpiValue}>{k.value}</div>
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiDelta}>{k.delta}</div>
          </div>
        ))}
      </div>

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
