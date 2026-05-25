import { useState } from 'react';
import { ComponentCard } from './ComponentCard';
import { MODULES, UI_BLOCKS } from './catalog-data';
import styles from './compositor.module.css';

type Tab = 'modules' | 'ui-blocks';

interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
  onToggleModule: (id: string) => void;
  onToggleUIBlock: (id: string) => void;
  totalSelected: number;
}

export function CatalogPanel({ selectedModules, selectedUIBlocks, onToggleModule, onToggleUIBlock, totalSelected }: Props) {
  const [tab, setTab] = useState<Tab>('modules');

  const learnerModules = MODULES.filter(m => m.role === 'learner');
  const adminModules = MODULES.filter(m => m.role === 'admin');
  const dataBlocks = UI_BLOCKS.filter(b => b.uiGroup === 'data');
  const contentBlocks = UI_BLOCKS.filter(b => b.uiGroup === 'content');
  const navBlocks = UI_BLOCKS.filter(b => b.uiGroup === 'navigation');

  return (
    <div className={styles.catalogPanel}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'modules' ? styles.tabActive : ''}`} onClick={() => setTab('modules')}>
          Moduły
        </button>
        <button className={`${styles.tab} ${tab === 'ui-blocks' ? styles.tabActive : ''}`} onClick={() => setTab('ui-blocks')}>
          UI Bloki
        </button>
      </div>

      <div className={styles.catalogContent}>
        {tab === 'modules' && (
          <>
            <p className={styles.groupLabel}>Rola: Learner</p>
            <div className={styles.cardGrid}>
              {learnerModules.map(c => (
                <ComponentCard key={c.id} component={c} isSelected={selectedModules.has(c.id)} onToggle={onToggleModule} />
              ))}
            </div>
            <p className={styles.groupLabel}>Rola: Admin</p>
            <div className={styles.cardGrid}>
              {adminModules.map(c => (
                <ComponentCard key={c.id} component={c} isSelected={selectedModules.has(c.id)} onToggle={onToggleModule} />
              ))}
            </div>
          </>
        )}

        {tab === 'ui-blocks' && (
          <>
            <p className={styles.groupLabel}>Dane i statystyki</p>
            <div className={styles.cardGrid}>
              {dataBlocks.map(c => (
                <ComponentCard key={c.id} component={c} isSelected={selectedUIBlocks.has(c.id)} onToggle={onToggleUIBlock} />
              ))}
            </div>
            <p className={styles.groupLabel}>Treść i nauka</p>
            <div className={styles.cardGrid}>
              {contentBlocks.map(c => (
                <ComponentCard key={c.id} component={c} isSelected={selectedUIBlocks.has(c.id)} onToggle={onToggleUIBlock} />
              ))}
            </div>
            <p className={styles.groupLabel}>Nawigacja i layout</p>
            <div className={styles.cardGrid}>
              {navBlocks.map(c => (
                <ComponentCard key={c.id} component={c} isSelected={selectedUIBlocks.has(c.id)} onToggle={onToggleUIBlock} />
              ))}
            </div>
          </>
        )}
      </div>

      {totalSelected > 0 && (
        <div className={styles.selectionBadge}>
          {totalSelected} {totalSelected === 1 ? 'komponent wybrany' : 'komponenty wybrane'}
        </div>
      )}
    </div>
  );
}
