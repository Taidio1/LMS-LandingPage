import styles from '../demo.module.css';

interface Props {
  homeHref?: string;
  onLogin: (role: 'admin' | 'learner') => void;
}

export function LoginScreen({ homeHref = '/', onLogin }: Props) {
  return (
    <div className={styles.loginBg}>
      {/* Background Decorations */}
      <div className={styles.bgCircleTop}></div>
      <div className={styles.bgCircleBottom}></div>
      <div className={styles.bgLines}>
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 200C300 150 700 350 1000 300M0 500C300 450 700 650 1000 600" stroke="#3e52e8" strokeOpacity="0.05" strokeWidth="2" />
        </svg>
      </div>

      <a className={styles.loginBackBtn} href={homeHref}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Wróć do strony
      </a>

      <div className={styles.loginWrap}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Witamy w demo OnboardingToGo</h1>
          
          <div className={styles.loginInfoBox}>
            <p className={styles.loginInfoText}>
              <b>Welcome to OnboardingToGo demo.</b>
            </p>
            <p className={styles.loginInfoText}>
              Here you will find your login screen, but we will skip it for now for the seamless demo experience.
            </p>
            <p className={styles.loginInfoText}>
              As a Platform user, you can login as <b>Admin</b> and as a <b>Trainee</b>. Check each of those, and learn about our platform capabilities.
            </p>
            <p className={styles.loginInfoText}>
              <i>Remember, this all can be customized just for you, with your branding, and if needed, custom functionality.</i>
            </p>
            <p className={styles.loginInfoText}>
              Test it and reach out to us to discuss.
            </p>
          </div>
        </div>

        <div className={styles.accountCards}>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className={styles.accountName}>Admin</p>
            <span className={styles.accountRole}>Platform Administrator</span>
            <button className={styles.accountBtn} onClick={() => onLogin('admin')}>
              Zaloguj jako Admin
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </div>

          <div className={styles.accountCard}>
            <div className={styles.accountAvatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <p className={styles.accountName}>Trainee</p>
            <span className={styles.accountRole}>Course Participant</span>
            <button className={styles.accountBtn} onClick={() => onLogin('learner')}>
              Zaloguj jako Stażysta
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
