import styles from '../../demo.module.css';
import { REPORTS_STATS, COMPLETION_TREND, DEPARTMENT_BREAKDOWN } from '../../mock-data';

export function AdminReports() {
  const minVal = Math.min(...COMPLETION_TREND.map(d => d.value));
  const maxVal = Math.max(...COMPLETION_TREND.map(d => d.value));
  const range  = maxVal - minVal || 1;
  const chartW = 400;
  const chartH = 120;
  const padL = 40; const padR = 20; const padT = 15; const padB = 25;
  const usableW = chartW - padL - padR;
  const usableH = chartH - padT - padB;

  const pts = COMPLETION_TREND.map((d, i) => {
    const x = padL + (i / (COMPLETION_TREND.length - 1)) * usableW;
    const y = padT + ((maxVal - d.value) / range) * usableH;
    return { x, y, ...d };
  });

  const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div>
      <h1 className={styles.pageTitle}>Reports</h1>

      <div className={styles.kpiGrid} style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        {REPORTS_STATS.map(s => (
          <div key={s.label} className={styles.kpiCard}>
            <div className={styles.kpiValue}>{s.value}</div>
            <div className={styles.kpiLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div className={styles.chartBox} style={{ marginBottom: 0 }}>
          <p className={styles.chartTitle}>Completion trend (last 4 weeks)</p>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.chartSvg}>
            {[0, 0.5, 1].map(t => {
              const y = padT + t * usableH;
              return <line key={t} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#F1F5F9" strokeWidth={1} />;
            })}

            <path
              d={`M ${pts[0].x},${pts[0].y} ${pts.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} L ${pts[pts.length-1].x},${padT+usableH} L ${pts[0].x},${padT+usableH} Z`}
              fill="url(#lineGrad)"
              opacity={0.15}
            />

            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <polyline
              points={pointsStr}
              fill="none"
              stroke="#4F46E5"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {pts.map(p => (
              <g key={p.week}>
                <circle cx={p.x} cy={p.y} r={4} fill="#4F46E5" />
                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={10} fill="#4F46E5" fontWeight={700}>
                  {p.value}%
                </text>
                <text x={p.x} y={chartH - 5} textAnchor="middle" fontSize={10} fill="#94A3B8">
                  {p.week}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className={styles.chartBox} style={{ marginBottom: 0 }}>
          <p className={styles.chartTitle}>Learners by department</p>
          <svg viewBox="0 0 300 120" className={styles.chartSvg}>
            {(() => {
              const depts = DEPARTMENT_BREAKDOWN;
              const maxLearners = Math.max(...depts.map(d => d.learners));
              const barW = 36;
              const step = 61;
              const padLb = 10; const padTb = 10; const padBb = 30;
              const usableHb = 80;
              return depts.map((d, i) => {
                const bh = (d.learners / maxLearners) * usableHb;
                const x = padLb + i * step;
                const isMax = d.learners === maxLearners;
                return (
                  <g key={d.dept}>
                    <rect x={x} y={padTb + usableHb - bh} width={barW} height={bh} rx={4}
                      fill={isMax ? '#7C3AED' : '#EDE9FE'} />
                    <text x={x + barW / 2} y={padTb + usableHb - bh - 4} textAnchor="middle"
                      fontSize={9} fill={isMax ? '#7C3AED' : '#94A3B8'} fontWeight={700}>
                      {d.learners}
                    </text>
                    <text x={x + barW / 2} y={120 - 6} textAnchor="middle" fontSize={8} fill="#94A3B8">
                      {d.dept.length > 5 ? d.dept.slice(0, 5) + '.' : d.dept}
                    </text>
                  </g>
                );
              });
            })()}
          </svg>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.chartTitle}>Department Breakdown</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Learners</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENT_BREAKDOWN.map(d => (
                <tr key={d.dept}>
                  <td style={{ fontWeight: 600 }}>{d.dept}</td>
                  <td>{d.learners}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.progressBar} style={{ width: 100 }}>
                        <div className={styles.progressFill} style={{ width: `${d.completion}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{d.completion}%</span>
                    </div>
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
