import { LearnerPreview } from './preview/LearnerPreview';
import { AdminPreview } from './preview/AdminPreview';
import styles from './compositor.module.css';

interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
  previewRole: 'learner' | 'admin';
  onRoleChange: (role: 'learner' | 'admin') => void;
}

export function PreviewCanvas({ selectedModules, selectedUIBlocks, previewRole, onRoleChange }: Props) {
  const isEmpty = selectedModules.size === 0 && selectedUIBlocks.size === 0;

  return (
    <div className={styles.previewCanvas}>
      <div className={styles.roleSwitcher}>
        <button
          className={`${styles.rolePill} ${previewRole === 'learner' ? styles.rolePillActive : ''}`}
          onClick={() => onRoleChange('learner')}
        >
          Learner
        </button>
        <button
          className={`${styles.rolePill} ${previewRole === 'admin' ? styles.rolePillActive : ''}`}
          onClick={() => onRoleChange('admin')}
        >
          Admin
        </button>
      </div>

      <div className={styles.previewFrame}>
        {isEmpty ? (
          <div className={styles.emptyState}>
            <p>← Wybierz komponenty z katalogu, aby zobaczyć podgląd</p>
          </div>
        ) : previewRole === 'learner' ? (
          <LearnerPreview selectedModules={selectedModules} selectedUIBlocks={selectedUIBlocks} />
        ) : (
          <AdminPreview selectedModules={selectedModules} selectedUIBlocks={selectedUIBlocks} />
        )}
      </div>
    </div>
  );
}
