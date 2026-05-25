import styles from '../demo.module.css';

interface Props {
  onLogin: (role: 'admin' | 'learner') => void;
}

export function LoginScreen({ onLogin }: Props) {
  return (
    <div className={styles.loginBg}>
      <div className={styles.loginWrap}>
        <div className={styles.loginHeader}>
          <div className={styles.loginBadge}>Interactive Demo</div>
          <h1 className={styles.loginTitle}>OnboardingToGo LMS</h1>
          <p className={styles.loginSubtitle}>Choose a role to explore the platform</p>
        </div>
        <div className={styles.accountCards}>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#7C3AED' }}>⚙️</div>
            <p className={styles.accountName}>Admin</p>
            <span className={styles.accountRole}>Platform Administrator</span>
            <button className={styles.accountBtn} onClick={() => onLogin('admin')}>
              Log in as Admin →
            </button>
          </div>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#2563EB' }}>🎓</div>
            <p className={styles.accountName}>Learner</p>
            <span className={styles.accountRole}>Course Participant</span>
            <button className={styles.accountBtn} onClick={() => onLogin('learner')}>
              Log in as Learner →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
