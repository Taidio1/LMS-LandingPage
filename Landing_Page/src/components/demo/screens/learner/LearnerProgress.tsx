import styles from '../../demo.module.css';
import { LEARNER_COURSES, WEEKLY_ACTIVITY } from '../../mock-data';

const PROGRESS_PCT = 64;
const CIRCUMFERENCE = 2 * Math.PI * 50;

export function LearnerProgress() {
  const dashOffset = CIRCUMFERENCE * (1 - PROGRESS_PCT / 100);
  const maxActivity = Math.max(...WEEKLY_ACTIVITY.map(d => d.value));

  return (
    <div>
      <h1 className={styles.pageTitle}>Progress</h1>

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
