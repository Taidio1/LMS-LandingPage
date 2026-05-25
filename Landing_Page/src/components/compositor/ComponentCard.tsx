import type { ComponentDef } from './catalog-data';
import styles from './compositor.module.css';

interface Props {
  component: ComponentDef;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function ComponentCard({ component, isSelected, onToggle }: Props) {
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onToggle(component.id)}
      aria-pressed={isSelected}
    >
      <span className={styles.cardIcon}>{component.icon}</span>
      <span className={styles.cardName}>{component.name}</span>
      <span className={styles.cardDesc}>{component.description}</span>
      {isSelected && <span className={styles.cardCheck}>✓</span>}
    </button>
  );
}
