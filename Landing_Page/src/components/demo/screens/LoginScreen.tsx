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
          <p className={styles.loginSubtitle}>Choose an account to explore the platform</p>
        </div>
        <div className={styles.accountCards}>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#7C3AED' }}>SM</div>
            <p className={styles.accountName}>Sarah Mitchell</p>
            <span className={styles.accountRole}>Platform Administrator</span>
            <button className={styles.accountBtn} onClick={() => onLogin('admin')}>
              Log in as Sarah →
            </button>
          </div>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar} style={{ background: '#2563EB' }}>JP</div>
            <p className={styles.accountName}>James Porter</p>
            <span className={styles.accountRole}>Learner</span>
            <button className={styles.accountBtn} onClick={() => onLogin('learner')}>
              Log in as James →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
