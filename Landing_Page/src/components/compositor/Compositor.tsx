import { useState } from 'react';
import { CatalogPanel } from './CatalogPanel';
import { PreviewCanvas } from './PreviewCanvas';
import { ContactForm } from './ContactForm';
import { LEARNER_MODULE_IDS, ADMIN_MODULE_IDS, BASE_TEMPLATE_UI_BLOCK_IDS } from './catalog-data';
import styles from './compositor.module.css';

export function Compositor() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [selectedUIBlocks, setSelectedUIBlocks] = useState<Set<string>>(new Set(BASE_TEMPLATE_UI_BLOCK_IDS));
  const [previewRole, setPreviewRole] = useState<'learner' | 'admin'>('admin');

  const toggleModule = (id: string) => {
    setSelectedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (LEARNER_MODULE_IDS.includes(id)) setPreviewRole('learner');
    else if (ADMIN_MODULE_IDS.includes(id)) setPreviewRole('admin');
  };

  const toggleUIBlock = (id: string) => {
    setSelectedUIBlocks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalSelected = selectedModules.size + selectedUIBlocks.size;

  return (
    <div className={styles.compositor}>
      <div className={styles.catalog}>
        <CatalogPanel
          selectedModules={selectedModules}
          selectedUIBlocks={selectedUIBlocks}
          onToggleModule={toggleModule}
          onToggleUIBlock={toggleUIBlock}
          totalSelected={totalSelected}
        />
      </div>
      <div className={styles.canvas}>
        <PreviewCanvas
          selectedModules={selectedModules}
          selectedUIBlocks={selectedUIBlocks}
          previewRole={previewRole}
          onRoleChange={setPreviewRole}
        />
        {totalSelected > 0 && (
          <ContactForm
            selectedModules={selectedModules}
            selectedUIBlocks={selectedUIBlocks}
          />
        )}
      </div>
    </div>
  );
}
