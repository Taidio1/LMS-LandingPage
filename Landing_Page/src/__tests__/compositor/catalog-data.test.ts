import { describe, it, expect } from 'vitest';
import { MODULES, UI_BLOCKS } from '../../components/compositor/catalog-data';

describe('catalog-data', () => {
  it('exports 9 modules', () => {
    expect(MODULES).toHaveLength(9);
  });

  it('exports 12 UI blocks', () => {
    expect(UI_BLOCKS).toHaveLength(12);
  });

  it('has 5 learner modules', () => {
    expect(MODULES.filter(m => m.role === 'learner')).toHaveLength(5);
  });

  it('has 4 admin modules', () => {
    expect(MODULES.filter(m => m.role === 'admin')).toHaveLength(4);
  });

  it('all module IDs are unique', () => {
    const ids = MODULES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all UI block IDs are unique', () => {
    const ids = UI_BLOCKS.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all modules have required fields', () => {
    MODULES.forEach(m => {
      expect(m.id).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.icon).toBeTruthy();
      expect(['learner', 'admin']).toContain(m.role);
    });
  });

  it('all UI blocks have uiGroup', () => {
    UI_BLOCKS.forEach(b => {
      expect(['data', 'content', 'navigation']).toContain(b.uiGroup);
    });
  });
});
