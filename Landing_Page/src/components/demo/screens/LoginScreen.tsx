import styles from '../demo.module.css';
import type { Lang } from '../../../i18n/index';
import { en } from '../../../i18n/en';
import { pl } from '../../../i18n/pl';
import { de } from '../../../i18n/de';

interface Props {
  lang?: Lang;
  homeHref?: string;
  onLogin: (role: 'admin' | 'learner') => void;
}

export function LoginScreen({ lang = 'en', homeHref = '/', onLogin }: Props) {
  const t = lang === 'de' ? de : lang === 'pl' ? pl : en;

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
        {t.demo.back}
      </a>

      <div className={styles.loginWrap}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>{t.demo.title}</h1>
          
          <div className={styles.loginMainInfo}>
            <p>{t.demo.infoText1}</p>
            <p>{t.demo.infoText2}</p>
          </div>

          <div className={styles.loginNoticeBox}>
            <p className={styles.loginNoticeText}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'text-bottom', opacity: 0.7 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              {t.demo.infoText3}
            </p>
            <p className={styles.loginNoticeText}>
              {t.demo.infoText4}
            </p>
          </div>
        </div>

        <div className={styles.accountCards}>
          <div className={styles.accountCard}>
            <div className={styles.accountAvatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className={styles.accountName}>Admin</p>
            <span className={styles.accountRole}>{t.demo.adminRole}</span>
            <button className={styles.accountBtn} onClick={() => onLogin('admin')}>
              {t.demo.loginAdmin}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </div>

          <div className={styles.accountCard}>
            <div className={styles.accountAvatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <p className={styles.accountName}>Trainee</p>
            <span className={styles.accountRole}>{t.demo.traineeRole}</span>
            <button className={styles.accountBtn} onClick={() => onLogin('learner')}>
              {t.demo.loginTrainee}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
