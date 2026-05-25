interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

const has = (set: Set<string>, ...ids: string[]) => ids.some(id => set.has(id));

export function AdminPreview({ selectedModules, selectedUIBlocks }: Props) {
  const showHeader = has(selectedUIBlocks, 'header-role-badge') || has(selectedModules, 'admin-dashboard');
  const showBreadcrumbs = has(selectedUIBlocks, 'breadcrumbs');
  const showSidebar = has(selectedUIBlocks, 'sidebar-nav');
  const showTabBar = has(selectedUIBlocks, 'tab-bar');
  const showStats = has(selectedUIBlocks, 'stat-cards') || has(selectedModules, 'admin-dashboard');
  const showChart = has(selectedUIBlocks, 'bar-chart') || has(selectedModules, 'admin-dashboard');
  const showTable = has(selectedUIBlocks, 'data-table') || has(selectedModules, 'learners-table');
  const showCourseManager = has(selectedModules, 'courses-manager');
  const showNotifications = has(selectedModules, 'notifications');
  const showProgressBars = has(selectedUIBlocks, 'progress-bars');
  const showActivityFeed = has(selectedUIBlocks, 'activity-feed');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', background: '#F8FAFF', borderRadius: '8px', overflow: 'hidden' }}>
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#4F46E5 50%,#2563EB 100%)', color: '#fff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '12px' }}>OnBoardToGo LMS</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '2px 6px', fontSize: '9px' }}>Admin</span>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div style={{ padding: '4px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '9px' }}>
          Home / Admin / Dashboard
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {showSidebar && (
          <div style={{ width: '80px', background: '#fff', borderRight: '1px solid #E2E8F0', padding: '8px 6px', flexShrink: 0 }}>
            {['📊 Panel', '🗂️ Kursy', '👥 Learnerzy', '🔔 Notif'].map(item => (
              <div key={item} style={{ padding: '4px 3px', borderRadius: '4px', marginBottom: '2px', color: '#64748B', fontSize: '9px' }}>{item}</div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          {showTabBar && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', borderBottom: '2px solid #E2E8F0' }}>
              {['Dashboard', 'Kursy', 'Learnerzy'].map((tab, i) => (
                <div key={tab} style={{ padding: '3px 8px', fontSize: '9px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#4F46E5' : '#64748B', borderBottom: i === 0 ? '2px solid #4F46E5' : 'none', marginBottom: '-2px' }}>{tab}</div>
              ))}
            </div>
          )}

          {has(selectedModules, 'admin-dashboard') && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Admin Dashboard</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>Metryki platformy w czasie rzeczywistym</div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '5px', marginBottom: '8px' }}>
              {[
                { label: 'Learnerzy', value: '248', icon: '👥', delta: '+12%' },
                { label: 'Ukończenia', value: '68%', icon: '📊', delta: '+4%' },
                { label: 'Aktywni', value: '32', icon: '▶️', delta: '+8%' },
                { label: 'Zaangażowanie', value: '+12%', icon: '✅', delta: '+3%' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px' }}>{s.icon}</span>
                    <span style={{ fontSize: '7px', color: '#16A34A', background: '#F0FDF4', borderRadius: '8px', padding: '1px 3px' }}>{s.delta}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: '7px', color: '#64748B' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showChart && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '6px', color: '#0F172A' }}>Trend ukończeń</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
                {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg,#7C3AED,#2563EB)', borderRadius: '2px 2px 0 0', height: `${h * 0.5}%` }} />
                    <div style={{ fontSize: '7px', color: '#94A3B8' }}>{['Pn','Wt','Sr','Cz','Pt','Sb','Nd'][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showCourseManager && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🗂️ Manager Kursów</div>
              {['React Basics', 'UX Design Fundamentals', 'Skuteczna Komunikacja'].map(c => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #F1F5F9', fontSize: '9px' }}>
                  <span style={{ color: '#0F172A' }}>{c}</span>
                  <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '1px 5px', borderRadius: '4px', fontSize: '8px' }}>Edytuj</span>
                </div>
              ))}
            </div>
          )}

          {showTable && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px', overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>👥 Learnerzy</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    {['Imię', 'Kurs', 'Postęp', 'Status'].map(h => (
                      <th key={h} style={{ padding: '3px 4px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Anna K.', course: 'React', pct: 75, status: 'Aktywny' },
                    { name: 'Piotr W.', course: 'UX', pct: 40, status: 'Nieaktywny' },
                    { name: 'Maria L.', course: 'Komun.', pct: 90, status: 'Aktywny' },
                  ].map(r => (
                    <tr key={r.name}>
                      <td style={{ padding: '3px 4px', color: '#0F172A', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '3px 4px', color: '#64748B' }}>{r.course}</td>
                      <td style={{ padding: '3px 4px' }}>
                        <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px', width: '40px' }}>
                          <div style={{ width: `${r.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '3px 4px' }}>
                        <span style={{ background: r.status === 'Aktywny' ? '#F0FDF4' : '#FEF2F2', color: r.status === 'Aktywny' ? '#16A34A' : '#DC2626', borderRadius: '8px', padding: '1px 5px', fontSize: '7px' }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showProgressBars && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Top kursy</div>
              {[{ name: 'React Basics', pct: 85 }, { name: 'UX Design', pct: 68 }, { name: 'Komunikacja', pct: 92 }].map(c => (
                <div key={c.name} style={{ marginBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                    <span style={{ color: '#0F172A' }}>{c.name}</span>
                    <span style={{ color: '#4F46E5', fontWeight: 600 }}>{c.pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {showActivityFeed && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Aktywność</div>
              {[{ text: 'Anna K. ukończyła: React Module 5', time: '1h temu' }, { text: 'Nowy learner: Tomasz B.', time: '3h temu' }].map(a => (
                <div key={a.text} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '9px' }}>🔔</span>
                  <div>
                    <div style={{ fontSize: '9px', color: '#0F172A' }}>{a.text}</div>
                    <div style={{ fontSize: '8px', color: '#94A3B8' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNotifications && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🔔 Powiadomienia</div>
              {[
                { text: '3 learnery nie logowały się od 7 dni', type: 'warning' },
                { text: 'Kurs "React" przekroczył 100 zapisanych', type: 'info' },
              ].map(n => (
                <div key={n.text} style={{ background: n.type === 'warning' ? '#FFFBEB' : '#EFF6FF', borderRadius: '4px', padding: '4px 6px', marginBottom: '3px', fontSize: '9px', color: n.type === 'warning' ? '#92400E' : '#1D4ED8' }}>
                  {n.type === 'warning' ? '⚠️' : 'ℹ️'} {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
