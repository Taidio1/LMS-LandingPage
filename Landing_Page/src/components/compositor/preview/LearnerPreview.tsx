interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

const has = (set: Set<string>, ...ids: string[]) => ids.some(id => set.has(id));

export function LearnerPreview({ selectedModules, selectedUIBlocks }: Props) {
  const showHeader = has(selectedUIBlocks, 'header-role-badge') || has(selectedModules, 'learner-dashboard');
  const showBreadcrumbs = has(selectedUIBlocks, 'breadcrumbs');
  const showSidebar = has(selectedUIBlocks, 'sidebar-nav');
  const showTabBar = has(selectedUIBlocks, 'tab-bar');
  const showStats = has(selectedUIBlocks, 'stat-cards') || has(selectedModules, 'learner-dashboard');
  const showCourses = has(selectedUIBlocks, 'course-cards') || has(selectedModules, 'my-courses');
  const showVideo = has(selectedUIBlocks, 'video-player');
  const showQuiz = has(selectedUIBlocks, 'quiz-block');
  const showProgress = has(selectedUIBlocks, 'progress-bars') || has(selectedModules, 'progress');
  const showActivity = has(selectedUIBlocks, 'activity-feed') || has(selectedModules, 'learner-dashboard');
  const showCerts = has(selectedModules, 'certificates');
  const showGamification = has(selectedModules, 'gamification');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', background: '#F8FAFF', borderRadius: '8px', overflow: 'hidden' }}>
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#4F46E5 50%,#2563EB 100%)', color: '#fff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '12px' }}>Ascent LMS</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '2px 6px', fontSize: '9px' }}>Learner</span>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div style={{ padding: '4px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '9px' }}>
          Home / Dashboard / Kursy
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {showSidebar && (
          <div style={{ width: '80px', background: '#fff', borderRight: '1px solid #E2E8F0', padding: '8px 6px', flexShrink: 0 }}>
            {['🏠 Home', '📚 Kursy', '📈 Postępy', '🏆 Certy'].map(item => (
              <div key={item} style={{ padding: '4px 3px', borderRadius: '4px', marginBottom: '2px', color: '#64748B', fontSize: '9px' }}>{item}</div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          {showTabBar && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', borderBottom: '2px solid #E2E8F0' }}>
              {['Dashboard', 'Kursy', 'Postępy'].map((tab, i) => (
                <div key={tab} style={{ padding: '3px 8px', fontSize: '9px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#4F46E5' : '#64748B', borderBottom: i === 0 ? '2px solid #4F46E5' : 'none', marginBottom: '-2px' }}>{tab}</div>
              ))}
            </div>
          )}

          {has(selectedModules, 'learner-dashboard') && (
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', borderRadius: '8px', padding: '10px 12px', color: '#fff', marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', opacity: 0.8 }}>Witaj z powrotem,</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Alex Johnson</div>
              <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Świetny postęp! Kontynuuj naukę.</div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '8px' }}>
              {[{ label: 'Kursy', value: '5', icon: '📚' }, { label: 'Lekcje', value: '18', icon: '✅' }, { label: 'Postęp', value: '72%', icon: '📈' }].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: '8px', color: '#64748B' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showCourses && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '4px', color: '#0F172A' }}>Moje kursy</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                {[{ title: 'React Basics', pct: 40 }, { title: 'UX Design', pct: 75 }].map(c => (
                  <div key={c.title} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '28px', background: 'linear-gradient(135deg,#7C3AED,#2563EB)' }} />
                    <div style={{ padding: '4px 6px' }}>
                      <div style={{ fontWeight: 600, fontSize: '9px', color: '#0F172A' }}>{c.title}</div>
                      <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '3px', marginTop: '3px' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showVideo && (
            <div style={{ background: '#0F172A', borderRadius: '6px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px' }}>▶</div>
            </div>
          )}

          {showQuiz && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '9px', marginBottom: '4px', color: '#0F172A' }}>❓ Quiz: Module 3</div>
              {['Odpowiedź A', 'Odpowiedź B', 'Odpowiedź C'].map(opt => (
                <div key={opt} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '3px 6px', marginBottom: '2px', fontSize: '9px', color: '#475569' }}>{opt}</div>
              ))}
            </div>
          )}

          {showProgress && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '6px', color: '#0F172A' }}>Postępy kursów</div>
              {[{ name: 'React Basics', pct: 40 }, { name: 'UX Design', pct: 75 }, { name: 'Komunikacja', pct: 90 }].map(c => (
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

          {showActivity && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Ostatnia aktywność</div>
              {[{ text: 'Ukończono: Lekcja 5 — React Hooks', time: '2h temu' }, { text: 'Zaliczono: Quiz Module 2', time: '1d temu' }].map(a => (
                <div key={a.text} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '9px', color: '#0F172A' }}>{a.text}</div>
                    <div style={{ fontSize: '8px', color: '#94A3B8' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCerts && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🏆 Certyfikaty</div>
              <div style={{ border: '1px dashed #4F46E5', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px' }}>🏅</div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#4F46E5' }}>UX Design Fundamentals</div>
                <div style={{ fontSize: '8px', color: '#64748B', marginTop: '1px' }}>Wydano: 12.04.2026</div>
              </div>
            </div>
          )}

          {showGamification && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🎮 Gamifikacja</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                <div style={{ background: '#EEF2FF', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontWeight: 600, color: '#4F46E5' }}>XP: 1,240</div>
                <div style={{ background: '#F0FDF4', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontWeight: 600, color: '#16A34A' }}>Poziom 8</div>
              </div>
              {['🥇 Anna K. — 2100 XP', '🥈 Ty — 1240 XP', '🥉 Piotr W. — 980 XP'].map(r => (
                <div key={r} style={{ fontSize: '9px', color: '#0F172A', marginBottom: '2px' }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
