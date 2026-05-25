import { useState } from 'react';
import styles from '../../demo.module.css';
import { CERTIFICATES_EARNED, CERTIFICATES_IN_PROGRESS } from '../../mock-data';

interface Props {
  onNavigate: (page: string) => void;
}

export function LearnerCertificates({ onNavigate }: Props) {
  const [toast, setToast] = useState('');

  const showToast = () => {
    setToast('PDF download available in the full version.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Certificates</h1>

      <p className={styles.sectionTitle}>Earned</p>
      <div className={styles.certGrid}>
        {CERTIFICATES_EARNED.map(c => (
          <div key={c.title} className={`${styles.certCard} ${styles.certCardGold}`}>
            <div className={styles.certIcon}>🏅</div>
            <div className={styles.certTitle}>{c.title}</div>
            <div className={styles.certDate}>Issued: {c.issued}</div>
            <button className={styles.certBtn} onClick={showToast}>
              Download PDF
            </button>
          </div>
        ))}
      </div>

      <p className={styles.sectionTitle}>In Progress — Earn your next certificate</p>
      <div className={styles.inProgressCerts}>
        {CERTIFICATES_IN_PROGRESS.map(c => (
          <div key={c.title} className={styles.inProgressCertCard}>
            <div className={styles.inProgressCertInfo}>
              <div className={styles.inProgressCertTitle}>{c.title}</div>
              <div className={styles.inProgressCertProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${c.progress}%` }} />
                </div>
                <span className={styles.inProgressCertPct}>{c.progress}%</span>
              </div>
            </div>
            <button className={styles.continueSmallBtn} onClick={() => onNavigate('my-courses')}>
              Continue →
            </button>
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
