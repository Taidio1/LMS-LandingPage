import { useState } from 'react';
import styles from '../../demo.module.css';
import { ALL_LEARNERS, type Learner } from '../../mock-data';

export function filterLearners(learners: Learner[], search: string): Learner[] {
  if (!search) return learners;
  const q = search.toLowerCase();
  return learners.filter(
    l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
  );
}

export function AdminLearners() {
  const [search, setSearch] = useState('');
  const visible = filterLearners(ALL_LEARNERS, search);

  return (
    <div>
      <h1 className={styles.pageTitle}>Learners</h1>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Courses</th>
                <th>Completion</th>
                <th>Status</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={styles.avatarSmall} style={{ background: l.color }}>{l.initials}</div>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{l.email}</td>
                  <td>{l.courses}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className={styles.progressBar} style={{ width: 60 }}>
                        <div className={styles.progressFill} style={{ width: `${l.completion}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{l.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusDot} ${l.status === 'Active' ? styles.statusDotActive : styles.statusDotInactive}`} />
                    <span style={{ fontSize: 12, color: l.status === 'Active' ? '#16A34A' : '#94A3B8' }}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: 12 }}>{l.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
