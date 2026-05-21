# Live Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `/demo` page to `Landing_Page/` where potential clients browse 21 LMS components, compose their application via a live visual preview, and submit a contact request with their selected configuration via EmailJS.

**Architecture:** Astro page shell (`src/pages/demo/index.astro`) wrapping a single React island (`Compositor`). The island owns all state: catalog tabs, selection sets, role preview, and contact form. Left panel = catalog, right panel = preview canvas + form.

**Tech Stack:** Astro 4, @astrojs/react, React 18, @emailjs/browser, Vitest + @testing-library/react (new), CSS Modules (new, scoped to compositor components).

---

## File Map

**New files:**
```
Landing_Page/
  vitest.config.ts
  tsconfig.json
  src/
    test/
      setup.ts
    pages/
      demo/
        index.astro
    components/
      compositor/
        catalog-data.ts
        compositor.module.css
        Compositor.tsx
        CatalogPanel.tsx
        ComponentCard.tsx
        PreviewCanvas.tsx
        ContactForm.tsx
        preview/
          LearnerPreview.tsx
          AdminPreview.tsx
    __tests__/
      compositor/
        catalog-data.test.ts
        ComponentCard.test.tsx
        CatalogPanel.test.tsx
        LearnerPreview.test.tsx
        AdminPreview.test.tsx
        PreviewCanvas.test.tsx
        ContactForm.test.tsx
        Compositor.test.tsx
```

**Modified files:**
```
Landing_Page/
  package.json                        ← add react, @astrojs/react, emailjs, vitest, testing-library
  astro.config.mjs                    ← add react() integration
  src/i18n/en.ts                      ← add nav.demo key
  src/i18n/pl.ts                      ← add nav.demo key
  src/i18n/de.ts                      ← add nav.demo key
  src/components/layout/Navbar.astro  ← add Demo link
  src/components/sections/Hero.astro  ← change ctaSecondary href to /demo
```

---

### Task 1: Install dependencies, configure Astro React integration and Vitest

**Files:**
- Modify: `Landing_Page/package.json`
- Modify: `Landing_Page/astro.config.mjs`
- Create: `Landing_Page/tsconfig.json`
- Create: `Landing_Page/vitest.config.ts`
- Create: `Landing_Page/src/test/setup.ts`

- [ ] **Step 1: Install runtime dependencies**

Run in `Landing_Page/`:
```bash
npm install @astrojs/react@^3 react@^18 react-dom@^18 @emailjs/browser@^4
```
Expected: packages added to `package.json` dependencies.

- [ ] **Step 2: Install dev dependencies**

Run in `Landing_Page/`:
```bash
npm install -D @types/react@^18 @types/react-dom@^18 @vitejs/plugin-react@^4 vitest@^2 @testing-library/react@^16 @testing-library/user-event@^14 @testing-library/jest-dom@^6 jsdom@^25
```
Expected: packages added to `package.json` devDependencies.

- [ ] **Step 3: Add test script to package.json**

`Landing_Page/package.json` — add `"test": "vitest run"` and `"test:watch": "vitest"` to scripts:
```json
{
  "name": "lms-landing-page",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@astrojs/react": "^3",
    "@emailjs/browser": "^4",
    "astro": "^4.15.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@testing-library/jest-dom": "^6",
    "@testing-library/react": "^16",
    "@testing-library/user-event": "^14",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4",
    "jsdom": "^25",
    "typescript": "^5.9.3",
    "vitest": "^2"
  }
}
```

- [ ] **Step 4: Configure Astro with React integration**

`Landing_Page/astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

- [ ] **Step 5: Create tsconfig.json**

`Landing_Page/tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 6: Create Vitest config**

`Landing_Page/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 7: Create test setup file**

`Landing_Page/src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 8: Verify dev server still starts**

Run: `npm run dev` in `Landing_Page/` — verify it starts on `http://localhost:4321`, then terminate.
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add Landing_Page/package.json Landing_Page/astro.config.mjs Landing_Page/tsconfig.json Landing_Page/vitest.config.ts Landing_Page/src/test/setup.ts Landing_Page/package-lock.json
git commit -m "chore: add @astrojs/react, emailjs, vitest to Landing_Page"
```

---

### Task 2: Catalog data — component definitions

**Files:**
- Create: `Landing_Page/src/components/compositor/catalog-data.ts`
- Create: `Landing_Page/src/__tests__/compositor/catalog-data.test.ts`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/catalog-data.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test` in `Landing_Page/`
Expected: FAIL — "Cannot find module '../../components/compositor/catalog-data'"

- [ ] **Step 3: Create catalog-data.ts**

`Landing_Page/src/components/compositor/catalog-data.ts`:
```ts
export type ComponentRole = 'learner' | 'admin';
export type ComponentType = 'module' | 'ui-block';
export type UIBlockGroup = 'data' | 'content' | 'navigation';

export interface ComponentDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ComponentType;
  role?: ComponentRole;
  uiGroup?: UIBlockGroup;
}

export const MODULES: ComponentDef[] = [
  { id: 'learner-dashboard', name: 'Learner Dashboard', description: 'Welcome banner, progress summary, recent activity', icon: '🏠', type: 'module', role: 'learner' },
  { id: 'my-courses', name: 'Moje Kursy', description: 'Course grid + embedded video player', icon: '📚', type: 'module', role: 'learner' },
  { id: 'progress', name: 'Postępy', description: 'Progress bars, weekly chart, achievement badges', icon: '📈', type: 'module', role: 'learner' },
  { id: 'certificates', name: 'Certyfikaty', description: 'Certificate generation and display', icon: '🏆', type: 'module', role: 'learner' },
  { id: 'gamification', name: 'Gamifikacja', description: 'XP points, levels, leaderboard', icon: '🎮', type: 'module', role: 'learner' },
  { id: 'admin-dashboard', name: 'Admin Dashboard', description: 'KPI stats, completion trend chart, top learners', icon: '📊', type: 'module', role: 'admin' },
  { id: 'courses-manager', name: 'Manager Kursów', description: 'Course list + side-panel editor', icon: '🗂️', type: 'module', role: 'admin' },
  { id: 'learners-table', name: 'Zarządzanie Learnerami', description: 'Filterable table with learner status', icon: '👥', type: 'module', role: 'admin' },
  { id: 'notifications', name: 'Powiadomienia', description: 'Alert and notification system', icon: '🔔', type: 'module', role: 'admin' },
];

export const UI_BLOCKS: ComponentDef[] = [
  { id: 'stat-cards', name: 'Stat Cards', description: 'Key metric cards with icons and values', icon: '📋', type: 'ui-block', uiGroup: 'data' },
  { id: 'bar-chart', name: 'Bar Chart', description: 'Weekly activity bar chart', icon: '📊', type: 'ui-block', uiGroup: 'data' },
  { id: 'progress-bars', name: 'Progress Bars', description: 'Course completion progress bars', icon: '▶️', type: 'ui-block', uiGroup: 'data' },
  { id: 'data-table', name: 'Data Table', description: 'Sortable and filterable data table', icon: '🗃️', type: 'ui-block', uiGroup: 'data' },
  { id: 'course-cards', name: 'Course Cards', description: 'Visual course cards with thumbnail and metadata', icon: '🃏', type: 'ui-block', uiGroup: 'content' },
  { id: 'video-player', name: 'Video Player', description: 'Embedded video player with controls', icon: '🎬', type: 'ui-block', uiGroup: 'content' },
  { id: 'quiz-block', name: 'Quiz Block', description: 'Multiple choice question interface', icon: '❓', type: 'ui-block', uiGroup: 'content' },
  { id: 'activity-feed', name: 'Activity Feed', description: 'Recent learner activity list', icon: '🗒️', type: 'ui-block', uiGroup: 'content' },
  { id: 'sidebar-nav', name: 'Sidebar Nav', description: 'Collapsible sidebar navigation', icon: '☰', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'tab-bar', name: 'Tab Bar', description: 'Horizontal tab navigation', icon: '📑', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'header-role-badge', name: 'Header + Role Badge', description: 'App header with user role indicator', icon: '🎭', type: 'ui-block', uiGroup: 'navigation' },
  { id: 'breadcrumbs', name: 'Breadcrumbs', description: 'Navigation path indicator', icon: '🧭', type: 'ui-block', uiGroup: 'navigation' },
];

export const LEARNER_MODULE_IDS = MODULES.filter(m => m.role === 'learner').map(m => m.id);
export const ADMIN_MODULE_IDS = MODULES.filter(m => m.role === 'admin').map(m => m.id);
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: 8 passing tests.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/catalog-data.ts Landing_Page/src/__tests__/compositor/catalog-data.test.ts
git commit -m "feat: add compositor catalog-data with 9 modules and 12 UI blocks"
```

---

### Task 3: compositor.module.css — shared styles for all compositor components

**Files:**
- Create: `Landing_Page/src/components/compositor/compositor.module.css`

- [ ] **Step 1: Create CSS module**

`Landing_Page/src/components/compositor/compositor.module.css`:
```css
/* Layout */
.compositor {
  display: flex;
  min-height: 600px;
  background: #F8FAFF;
}

.catalog {
  width: 38%;
  flex-shrink: 0;
  border-right: 1px solid #E2E8F0;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.canvas {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Catalog Panel */
.catalogPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #E2E8F0;
  padding: 0 16px;
  flex-shrink: 0;
}

.tab {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}

.tab:hover { color: #0F172A; }

.tabActive {
  color: #4F46E5;
  border-bottom-color: #4F46E5;
  font-weight: 600;
}

.catalogContent {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.groupLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94A3B8;
  margin: 12px 0 6px;
}

.groupLabel:first-child { margin-top: 0; }

.cardGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.selectionBadge {
  padding: 12px 16px;
  background: #EEF2FF;
  color: #4F46E5;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  border-top: 1px solid #E0E7FF;
  flex-shrink: 0;
}

/* Component Card */
.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  position: relative;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.card:hover {
  border-color: #A5B4FC;
  box-shadow: 0 1px 4px rgba(79, 70, 229, 0.08);
}

.cardSelected {
  border-color: #4F46E5;
  background: #EEF2FF;
  box-shadow: 0 1px 4px rgba(79, 70, 229, 0.12);
}

.cardIcon { font-size: 18px; margin-bottom: 2px; }

.cardName {
  font-size: 11px;
  font-weight: 600;
  color: #0F172A;
  line-height: 1.3;
}

.cardDesc {
  font-size: 9px;
  color: #64748B;
  line-height: 1.3;
}

.cardCheck {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #4F46E5;
  color: #fff;
  border-radius: 50%;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Preview Canvas */
.previewCanvas {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin-bottom: 24px;
}

.roleSwitcher {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFF;
}

.rolePill {
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid #E2E8F0;
  background: #fff;
  color: #64748B;
  transition: all 0.15s;
}

.rolePill:hover { border-color: #A5B4FC; color: #4F46E5; }

.rolePillActive {
  background: #4F46E5;
  border-color: #4F46E5;
  color: #fff;
}

.previewFrame {
  padding: 16px;
  min-height: 300px;
}

.emptyState {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  color: #94A3B8;
  font-size: 14px;
  text-align: center;
}

/* Contact Form */
.contactForm {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 24px;
}

.formTitle {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 20px;
}

.formRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.formField {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.formField:last-child { margin-bottom: 0; }

.formField label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.formField input,
.formField select,
.formField textarea {
  padding: 8px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #0F172A;
  background: #fff;
  transition: border-color 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.formField input:focus,
.formField select:focus,
.formField textarea:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
}

.inputError { border-color: #EF4444 !important; }

.configReadOnly {
  background: #F8FAFF !important;
  color: #475569 !important;
  resize: none;
}

.errorMsg {
  font-size: 12px;
  color: #EF4444;
}

.submitBtn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 8px;
}

.submitBtn:hover:not(:disabled) { opacity: 0.9; }

.submitBtn:disabled { opacity: 0.7; cursor: not-allowed; }

.formSuccess {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #D1FAE5;
  padding: 32px;
  text-align: center;
}

.formSuccess h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 12px 0 8px;
}

.formSuccess p { color: #64748B; font-size: 15px; }

/* Responsive */
@media (max-width: 768px) {
  .compositor { flex-direction: column; }
  .catalog { width: 100%; border-right: none; border-bottom: 1px solid #E2E8F0; }
  .cardGrid { grid-template-columns: repeat(3, 1fr); }
  .formRow { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Commit**

```bash
git add Landing_Page/src/components/compositor/compositor.module.css
git commit -m "feat: add compositor shared CSS module"
```

---

### Task 4: ComponentCard

**Files:**
- Create: `Landing_Page/src/components/compositor/ComponentCard.tsx`
- Create: `Landing_Page/src/__tests__/compositor/ComponentCard.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/ComponentCard.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentCard } from '../../components/compositor/ComponentCard';
import { MODULES } from '../../components/compositor/catalog-data';

const card = MODULES[0]; // learner-dashboard

describe('ComponentCard', () => {
  it('renders name and description', () => {
    render(<ComponentCard component={card} isSelected={false} onToggle={() => {}} />);
    expect(screen.getByText(card.name)).toBeInTheDocument();
    expect(screen.getByText(card.description)).toBeInTheDocument();
  });

  it('shows checkmark when selected', () => {
    render(<ComponentCard component={card} isSelected={true} onToggle={() => {}} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('hides checkmark when not selected', () => {
    render(<ComponentCard component={card} isSelected={false} onToggle={() => {}} />);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('calls onToggle with component id on click', () => {
    const onToggle = vi.fn();
    render(<ComponentCard component={card} isSelected={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(card.id);
  });

  it('sets aria-pressed true when selected', () => {
    render(<ComponentCard component={card} isSelected={true} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed false when not selected', () => {
    render(<ComponentCard component={card} isSelected={false} onToggle={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/ComponentCard'"

- [ ] **Step 3: Implement ComponentCard**

`Landing_Page/src/components/compositor/ComponentCard.tsx`:
```tsx
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
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/ComponentCard.tsx Landing_Page/src/__tests__/compositor/ComponentCard.test.tsx
git commit -m "feat: add ComponentCard with toggle selection"
```

---

### Task 5: CatalogPanel

**Files:**
- Create: `Landing_Page/src/components/compositor/CatalogPanel.tsx`
- Create: `Landing_Page/src/__tests__/compositor/CatalogPanel.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/CatalogPanel.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogPanel } from '../../components/compositor/CatalogPanel';

const defaultProps = {
  selectedModules: new Set<string>(),
  selectedUIBlocks: new Set<string>(),
  onToggleModule: vi.fn(),
  onToggleUIBlock: vi.fn(),
  totalSelected: 0,
};

describe('CatalogPanel', () => {
  it('shows Moduły tab by default with role groups', () => {
    render(<CatalogPanel {...defaultProps} />);
    expect(screen.getByText('Rola: Learner')).toBeInTheDocument();
    expect(screen.getByText('Rola: Admin')).toBeInTheDocument();
  });

  it('switches to UI Bloki tab on click', () => {
    render(<CatalogPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('UI Bloki'));
    expect(screen.getByText('Dane i statystyki')).toBeInTheDocument();
    expect(screen.getByText('Treść i nauka')).toBeInTheDocument();
    expect(screen.getByText('Nawigacja i layout')).toBeInTheDocument();
  });

  it('hides selection badge when nothing selected', () => {
    render(<CatalogPanel {...defaultProps} totalSelected={0} />);
    expect(screen.queryByText(/wybrany|wybrane/)).not.toBeInTheDocument();
  });

  it('shows singular badge for 1 selection', () => {
    render(<CatalogPanel {...defaultProps} totalSelected={1} />);
    expect(screen.getByText('1 komponent wybrany')).toBeInTheDocument();
  });

  it('shows plural badge for 3 selections', () => {
    render(<CatalogPanel {...defaultProps} totalSelected={3} />);
    expect(screen.getByText('3 komponenty wybrane')).toBeInTheDocument();
  });

  it('renders all 9 modules on Moduły tab', () => {
    render(<CatalogPanel {...defaultProps} />);
    expect(screen.getByText('Learner Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Gamifikacja')).toBeInTheDocument();
    expect(screen.getByText('Powiadomienia')).toBeInTheDocument();
  });

  it('renders all 12 UI blocks on UI Bloki tab', () => {
    render(<CatalogPanel {...defaultProps} />);
    fireEvent.click(screen.getByText('UI Bloki'));
    expect(screen.getByText('Stat Cards')).toBeInTheDocument();
    expect(screen.getByText('Quiz Block')).toBeInTheDocument();
    expect(screen.getByText('Breadcrumbs')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/CatalogPanel'"

- [ ] **Step 3: Implement CatalogPanel**

`Landing_Page/src/components/compositor/CatalogPanel.tsx`:
```tsx
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
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/CatalogPanel.tsx Landing_Page/src/__tests__/compositor/CatalogPanel.test.tsx
git commit -m "feat: add CatalogPanel with module/UI block tabs"
```

---

### Task 6: LearnerPreview

**Files:**
- Create: `Landing_Page/src/components/compositor/preview/LearnerPreview.tsx`
- Create: `Landing_Page/src/__tests__/compositor/LearnerPreview.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/LearnerPreview.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LearnerPreview } from '../../components/compositor/preview/LearnerPreview';

describe('LearnerPreview', () => {
  it('renders without errors when nothing selected', () => {
    render(<LearnerPreview selectedModules={new Set()} selectedUIBlocks={new Set()} />);
    expect(screen.queryByText('Ascent LMS')).not.toBeInTheDocument();
  });

  it('shows app header when header-role-badge selected', () => {
    render(<LearnerPreview selectedModules={new Set()} selectedUIBlocks={new Set(['header-role-badge'])} />);
    expect(screen.getByText('Ascent LMS')).toBeInTheDocument();
    expect(screen.getByText('Learner')).toBeInTheDocument();
  });

  it('shows header when learner-dashboard selected (implicit header)', () => {
    render(<LearnerPreview selectedModules={new Set(['learner-dashboard'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Ascent LMS')).toBeInTheDocument();
  });

  it('shows welcome banner when learner-dashboard selected', () => {
    render(<LearnerPreview selectedModules={new Set(['learner-dashboard'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
  });

  it('shows stat cards when stat-cards UI block selected', () => {
    render(<LearnerPreview selectedModules={new Set()} selectedUIBlocks={new Set(['stat-cards'])} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('shows course cards when my-courses selected', () => {
    render(<LearnerPreview selectedModules={new Set(['my-courses'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Moje kursy')).toBeInTheDocument();
  });

  it('shows progress bars when progress module selected', () => {
    render(<LearnerPreview selectedModules={new Set(['progress'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Postępy kursów')).toBeInTheDocument();
  });

  it('shows certificates when certificates module selected', () => {
    render(<LearnerPreview selectedModules={new Set(['certificates'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText(/Certyfikaty/)).toBeInTheDocument();
  });

  it('shows gamification when gamification module selected', () => {
    render(<LearnerPreview selectedModules={new Set(['gamification'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText(/Gamifikacja/)).toBeInTheDocument();
  });

  it('shows sidebar when sidebar-nav selected', () => {
    render(<LearnerPreview selectedModules={new Set()} selectedUIBlocks={new Set(['sidebar-nav'])} />);
    expect(screen.getByText(/Home/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/preview/LearnerPreview'"

- [ ] **Step 3: Implement LearnerPreview**

`Landing_Page/src/components/compositor/preview/LearnerPreview.tsx`:
```tsx
interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

const has = (set: Set<string>, ...ids: string[]) => ids.some(id => set.has(id));

export function LearnerPreview({ selectedModules, selectedUIBlocks }: Props) {
  const showHeader = has(selectedUIBlocks, 'header-role-badge') || has(selectedModules, 'learner-dashboard');
  const showBreadcrumbs = has(selectedUIBlocks, 'breadcrumbs');
  const showSidebar = has(selectedUIBlocks, 'sidebar-nav');
  const showTabBar = has(selectedUIBlocks, 'tab-bar');
  const showStats = has(selectedUIBlocks, 'stat-cards') || has(selectedModules, 'learner-dashboard');
  const showCourses = has(selectedUIBlocks, 'course-cards') || has(selectedModules, 'my-courses');
  const showVideo = has(selectedUIBlocks, 'video-player');
  const showQuiz = has(selectedUIBlocks, 'quiz-block');
  const showProgress = has(selectedUIBlocks, 'progress-bars') || has(selectedModules, 'progress');
  const showActivity = has(selectedUIBlocks, 'activity-feed') || has(selectedModules, 'learner-dashboard');
  const showCerts = has(selectedModules, 'certificates');
  const showGamification = has(selectedModules, 'gamification');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', background: '#F8FAFF', borderRadius: '8px', overflow: 'hidden' }}>
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#4F46E5 50%,#2563EB 100%)', color: '#fff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '12px' }}>Ascent LMS</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '2px 6px', fontSize: '9px' }}>Learner</span>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div style={{ padding: '4px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '9px' }}>
          Home / Dashboard / Kursy
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {showSidebar && (
          <div style={{ width: '80px', background: '#fff', borderRight: '1px solid #E2E8F0', padding: '8px 6px', flexShrink: 0 }}>
            {['🏠 Home', '📚 Kursy', '📈 Postępy', '🏆 Certy'].map(item => (
              <div key={item} style={{ padding: '4px 3px', borderRadius: '4px', marginBottom: '2px', color: '#64748B', fontSize: '9px' }}>{item}</div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          {showTabBar && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', borderBottom: '2px solid #E2E8F0' }}>
              {['Dashboard', 'Kursy', 'Postępy'].map((tab, i) => (
                <div key={tab} style={{ padding: '3px 8px', fontSize: '9px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#4F46E5' : '#64748B', borderBottom: i === 0 ? '2px solid #4F46E5' : 'none', marginBottom: '-2px' }}>{tab}</div>
              ))}
            </div>
          )}

          {has(selectedModules, 'learner-dashboard') && (
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', borderRadius: '8px', padding: '10px 12px', color: '#fff', marginBottom: '8px' }}>
              <div style={{ fontSize: '9px', opacity: 0.8 }}>Witaj z powrotem,</div>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>Alex Johnson</div>
              <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Świetny postęp! Kontynuuj naukę.</div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginBottom: '8px' }}>
              {[{ label: 'Kursy', value: '5', icon: '📚' }, { label: 'Lekcje', value: '18', icon: '✅' }, { label: 'Postęp', value: '72%', icon: '📈' }].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: '8px', color: '#64748B' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showCourses && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '4px', color: '#0F172A' }}>Moje kursy</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                {[{ title: 'React Basics', pct: 40 }, { title: 'UX Design', pct: 75 }].map(c => (
                  <div key={c.title} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '28px', background: 'linear-gradient(135deg,#7C3AED,#2563EB)' }} />
                    <div style={{ padding: '4px 6px' }}>
                      <div style={{ fontWeight: 600, fontSize: '9px', color: '#0F172A' }}>{c.title}</div>
                      <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '3px', marginTop: '3px' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showVideo && (
            <div style={{ background: '#0F172A', borderRadius: '6px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px' }}>▶</div>
            </div>
          )}

          {showQuiz && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '9px', marginBottom: '4px', color: '#0F172A' }}>❓ Quiz: Module 3</div>
              {['Odpowiedź A', 'Odpowiedź B', 'Odpowiedź C'].map(opt => (
                <div key={opt} style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '3px 6px', marginBottom: '2px', fontSize: '9px', color: '#475569' }}>{opt}</div>
              ))}
            </div>
          )}

          {showProgress && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '6px', color: '#0F172A' }}>Postępy kursów</div>
              {[{ name: 'React Basics', pct: 40 }, { name: 'UX Design', pct: 75 }, { name: 'Komunikacja', pct: 90 }].map(c => (
                <div key={c.name} style={{ marginBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                    <span style={{ color: '#0F172A' }}>{c.name}</span>
                    <span style={{ color: '#4F46E5', fontWeight: 600 }}>{c.pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {showActivity && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Ostatnia aktywność</div>
              {[{ text: 'Ukończono: Lekcja 5 — React Hooks', time: '2h temu' }, { text: 'Zaliczono: Quiz Module 2', time: '1d temu' }].map(a => (
                <div key={a.text} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '9px', color: '#0F172A' }}>{a.text}</div>
                    <div style={{ fontSize: '8px', color: '#94A3B8' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCerts && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🏆 Certyfikaty</div>
              <div style={{ border: '1px dashed #4F46E5', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px' }}>🏅</div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#4F46E5' }}>UX Design Fundamentals</div>
                <div style={{ fontSize: '8px', color: '#64748B', marginTop: '1px' }}>Wydano: 12.04.2026</div>
              </div>
            </div>
          )}

          {showGamification && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🎮 Gamifikacja</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                <div style={{ background: '#EEF2FF', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontWeight: 600, color: '#4F46E5' }}>XP: 1,240</div>
                <div style={{ background: '#F0FDF4', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontWeight: 600, color: '#16A34A' }}>Poziom 8</div>
              </div>
              {['🥇 Anna K. — 2100 XP', '🥈 Ty — 1240 XP', '🥉 Piotr W. — 980 XP'].map(r => (
                <div key={r} style={{ fontSize: '9px', color: '#0F172A', marginBottom: '2px' }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/preview/LearnerPreview.tsx Landing_Page/src/__tests__/compositor/LearnerPreview.test.tsx
git commit -m "feat: add LearnerPreview mock layout with conditional zones"
```

---

### Task 7: AdminPreview

**Files:**
- Create: `Landing_Page/src/components/compositor/preview/AdminPreview.tsx`
- Create: `Landing_Page/src/__tests__/compositor/AdminPreview.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/AdminPreview.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminPreview } from '../../components/compositor/preview/AdminPreview';

describe('AdminPreview', () => {
  it('renders without errors when nothing selected', () => {
    render(<AdminPreview selectedModules={new Set()} selectedUIBlocks={new Set()} />);
    expect(screen.queryByText('Ascent LMS')).not.toBeInTheDocument();
  });

  it('shows header when admin-dashboard selected', () => {
    render(<AdminPreview selectedModules={new Set(['admin-dashboard'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Ascent LMS')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows stat cards when stat-cards UI block selected', () => {
    render(<AdminPreview selectedModules={new Set()} selectedUIBlocks={new Set(['stat-cards'])} />);
    expect(screen.getByText('248')).toBeInTheDocument();
  });

  it('shows bar chart when bar-chart selected', () => {
    render(<AdminPreview selectedModules={new Set()} selectedUIBlocks={new Set(['bar-chart'])} />);
    expect(screen.getByText('Trend ukończeń')).toBeInTheDocument();
  });

  it('shows learners table when learners-table module selected', () => {
    render(<AdminPreview selectedModules={new Set(['learners-table'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText('Anna K.')).toBeInTheDocument();
  });

  it('shows courses manager when courses-manager selected', () => {
    render(<AdminPreview selectedModules={new Set(['courses-manager'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText(/Manager Kursów/)).toBeInTheDocument();
  });

  it('shows notifications when notifications module selected', () => {
    render(<AdminPreview selectedModules={new Set(['notifications'])} selectedUIBlocks={new Set()} />);
    expect(screen.getByText(/Powiadomienia/)).toBeInTheDocument();
  });

  it('shows sidebar when sidebar-nav selected', () => {
    render(<AdminPreview selectedModules={new Set()} selectedUIBlocks={new Set(['sidebar-nav'])} />);
    expect(screen.getByText(/Panel/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/preview/AdminPreview'"

- [ ] **Step 3: Implement AdminPreview**

`Landing_Page/src/components/compositor/preview/AdminPreview.tsx`:
```tsx
interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

const has = (set: Set<string>, ...ids: string[]) => ids.some(id => set.has(id));

export function AdminPreview({ selectedModules, selectedUIBlocks }: Props) {
  const showHeader = has(selectedUIBlocks, 'header-role-badge') || has(selectedModules, 'admin-dashboard');
  const showBreadcrumbs = has(selectedUIBlocks, 'breadcrumbs');
  const showSidebar = has(selectedUIBlocks, 'sidebar-nav');
  const showTabBar = has(selectedUIBlocks, 'tab-bar');
  const showStats = has(selectedUIBlocks, 'stat-cards') || has(selectedModules, 'admin-dashboard');
  const showChart = has(selectedUIBlocks, 'bar-chart') || has(selectedModules, 'admin-dashboard');
  const showTable = has(selectedUIBlocks, 'data-table') || has(selectedModules, 'learners-table');
  const showCourseManager = has(selectedModules, 'courses-manager');
  const showNotifications = has(selectedModules, 'notifications');
  const showProgressBars = has(selectedUIBlocks, 'progress-bars');
  const showActivityFeed = has(selectedUIBlocks, 'activity-feed');

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', background: '#F8FAFF', borderRadius: '8px', overflow: 'hidden' }}>
      {showHeader && (
        <div style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#4F46E5 50%,#2563EB 100%)', color: '#fff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '12px' }}>Ascent LMS</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '2px 6px', fontSize: '9px' }}>Admin</span>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>
      )}

      {showBreadcrumbs && (
        <div style={{ padding: '4px 12px', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '9px' }}>
          Home / Admin / Dashboard
        </div>
      )}

      <div style={{ display: 'flex' }}>
        {showSidebar && (
          <div style={{ width: '80px', background: '#fff', borderRight: '1px solid #E2E8F0', padding: '8px 6px', flexShrink: 0 }}>
            {['📊 Panel', '🗂️ Kursy', '👥 Learnerzy', '🔔 Notif'].map(item => (
              <div key={item} style={{ padding: '4px 3px', borderRadius: '4px', marginBottom: '2px', color: '#64748B', fontSize: '9px' }}>{item}</div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, padding: '10px 12px', overflow: 'hidden' }}>
          {showTabBar && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', borderBottom: '2px solid #E2E8F0' }}>
              {['Dashboard', 'Kursy', 'Learnerzy'].map((tab, i) => (
                <div key={tab} style={{ padding: '3px 8px', fontSize: '9px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#4F46E5' : '#64748B', borderBottom: i === 0 ? '2px solid #4F46E5' : 'none', marginBottom: '-2px' }}>{tab}</div>
              ))}
            </div>
          )}

          {has(selectedModules, 'admin-dashboard') && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Admin Dashboard</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>Metryki platformy w czasie rzeczywistym</div>
            </div>
          )}

          {showStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '5px', marginBottom: '8px' }}>
              {[
                { label: 'Learnerzy', value: '248', icon: '👥', delta: '+12%' },
                { label: 'Ukończenia', value: '68%', icon: '📊', delta: '+4%' },
                { label: 'Aktywni', value: '32', icon: '▶️', delta: '+8%' },
                { label: 'Zaangażowanie', value: '+12%', icon: '✅', delta: '+3%' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px' }}>{s.icon}</span>
                    <span style={{ fontSize: '7px', color: '#16A34A', background: '#F0FDF4', borderRadius: '8px', padding: '1px 3px' }}>{s.delta}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '11px', color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: '7px', color: '#64748B' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {showChart && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '6px', color: '#0F172A' }}>Trend ukończeń</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
                {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg,#7C3AED,#2563EB)', borderRadius: '2px 2px 0 0', height: `${h * 0.5}%` }} />
                    <div style={{ fontSize: '7px', color: '#94A3B8' }}>{['Pn','Wt','Sr','Cz','Pt','Sb','Nd'][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showCourseManager && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🗂️ Manager Kursów</div>
              {['React Basics', 'UX Design Fundamentals', 'Skuteczna Komunikacja'].map(c => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #F1F5F9', fontSize: '9px' }}>
                  <span style={{ color: '#0F172A' }}>{c}</span>
                  <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '1px 5px', borderRadius: '4px', fontSize: '8px' }}>Edytuj</span>
                </div>
              ))}
            </div>
          )}

          {showTable && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px', overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>👥 Learnerzy</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    {['Imię', 'Kurs', 'Postęp', 'Status'].map(h => (
                      <th key={h} style={{ padding: '3px 4px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Anna K.', course: 'React', pct: 75, status: 'Aktywny' },
                    { name: 'Piotr W.', course: 'UX', pct: 40, status: 'Nieaktywny' },
                    { name: 'Maria L.', course: 'Komun.', pct: 90, status: 'Aktywny' },
                  ].map(r => (
                    <tr key={r.name}>
                      <td style={{ padding: '3px 4px', color: '#0F172A', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '3px 4px', color: '#64748B' }}>{r.course}</td>
                      <td style={{ padding: '3px 4px' }}>
                        <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px', width: '40px' }}>
                          <div style={{ width: `${r.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                        </div>
                      </td>
                      <td style={{ padding: '3px 4px' }}>
                        <span style={{ background: r.status === 'Aktywny' ? '#F0FDF4' : '#FEF2F2', color: r.status === 'Aktywny' ? '#16A34A' : '#DC2626', borderRadius: '8px', padding: '1px 5px', fontSize: '7px' }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showProgressBars && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Top kursy</div>
              {[{ name: 'React Basics', pct: 85 }, { name: 'UX Design', pct: 68 }, { name: 'Komunikacja', pct: 92 }].map(c => (
                <div key={c.name} style={{ marginBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
                    <span style={{ color: '#0F172A' }}>{c.name}</span>
                    <span style={{ color: '#4F46E5', fontWeight: 600 }}>{c.pct}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: 'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {showActivityFeed && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>Aktywność</div>
              {[{ text: 'Anna K. ukończyła: React Module 5', time: '1h temu' }, { text: 'Nowy learner: Tomasz B.', time: '3h temu' }].map(a => (
                <div key={a.text} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '9px' }}>🔔</span>
                  <div>
                    <div style={{ fontSize: '9px', color: '#0F172A' }}>{a.text}</div>
                    <div style={{ fontSize: '8px', color: '#94A3B8' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNotifications && (
            <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0', padding: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '10px', marginBottom: '5px', color: '#0F172A' }}>🔔 Powiadomienia</div>
              {[
                { text: '3 learnery nie logowały się od 7 dni', type: 'warning' },
                { text: 'Kurs "React" przekroczył 100 zapisanych', type: 'info' },
              ].map(n => (
                <div key={n.text} style={{ background: n.type === 'warning' ? '#FFFBEB' : '#EFF6FF', borderRadius: '4px', padding: '4px 6px', marginBottom: '3px', fontSize: '9px', color: n.type === 'warning' ? '#92400E' : '#1D4ED8' }}>
                  {n.type === 'warning' ? '⚠️' : 'ℹ️'} {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/preview/AdminPreview.tsx Landing_Page/src/__tests__/compositor/AdminPreview.test.tsx
git commit -m "feat: add AdminPreview mock layout with conditional zones"
```

---

### Task 8: PreviewCanvas

**Files:**
- Create: `Landing_Page/src/components/compositor/PreviewCanvas.tsx`
- Create: `Landing_Page/src/__tests__/compositor/PreviewCanvas.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/PreviewCanvas.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewCanvas } from '../../components/compositor/PreviewCanvas';

const defaultProps = {
  selectedModules: new Set<string>(),
  selectedUIBlocks: new Set<string>(),
  previewRole: 'learner' as const,
  onRoleChange: vi.fn(),
};

describe('PreviewCanvas', () => {
  it('shows empty state when nothing selected', () => {
    render(<PreviewCanvas {...defaultProps} />);
    expect(screen.getByText(/Wybierz komponenty/)).toBeInTheDocument();
  });

  it('hides empty state when module selected', () => {
    render(<PreviewCanvas {...defaultProps} selectedModules={new Set(['learner-dashboard'])} />);
    expect(screen.queryByText(/Wybierz komponenty/)).not.toBeInTheDocument();
  });

  it('shows learner role as active by default', () => {
    render(<PreviewCanvas {...defaultProps} />);
    expect(screen.getByText('Learner')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('calls onRoleChange with admin when Admin pill clicked', () => {
    const onRoleChange = vi.fn();
    render(<PreviewCanvas {...defaultProps} onRoleChange={onRoleChange} />);
    fireEvent.click(screen.getByText('Admin'));
    expect(onRoleChange).toHaveBeenCalledWith('admin');
  });

  it('calls onRoleChange with learner when Learner pill clicked', () => {
    const onRoleChange = vi.fn();
    render(<PreviewCanvas {...defaultProps} previewRole="admin" onRoleChange={onRoleChange} />);
    fireEvent.click(screen.getByText('Learner'));
    expect(onRoleChange).toHaveBeenCalledWith('learner');
  });

  it('renders LearnerPreview when previewRole is learner and has selection', () => {
    render(<PreviewCanvas {...defaultProps} selectedModules={new Set(['learner-dashboard'])} />);
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
  });

  it('renders AdminPreview when previewRole is admin and has selection', () => {
    render(<PreviewCanvas {...defaultProps} previewRole="admin" selectedModules={new Set(['admin-dashboard'])} />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/PreviewCanvas'"

- [ ] **Step 3: Implement PreviewCanvas**

`Landing_Page/src/components/compositor/PreviewCanvas.tsx`:
```tsx
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
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/PreviewCanvas.tsx Landing_Page/src/__tests__/compositor/PreviewCanvas.test.tsx
git commit -m "feat: add PreviewCanvas with role switcher and conditional preview"
```

---

### Task 9: ContactForm

**Files:**
- Create: `Landing_Page/src/components/compositor/ContactForm.tsx`
- Create: `Landing_Page/src/__tests__/compositor/ContactForm.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/ContactForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@emailjs/browser', () => ({
  default: { sendForm: vi.fn() },
}));

import emailjs from '@emailjs/browser';
import { ContactForm } from '../../components/compositor/ContactForm';

const defaultProps = {
  selectedModules: new Set(['learner-dashboard']),
  selectedUIBlocks: new Set(['stat-cards']),
};

describe('ContactForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all required fields', () => {
    render(<ContactForm {...defaultProps} />);
    expect(screen.getByLabelText(/Imię i nazwisko/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email firmowy/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nazwa firmy/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Liczba użytkowników/)).toBeInTheDocument();
  });

  it('shows selected configuration as read-only textarea', () => {
    render(<ContactForm {...defaultProps} />);
    const configField = screen.getByDisplayValue(/Learner Dashboard/);
    expect(configField).toHaveAttribute('readonly');
  });

  it('shows 4 validation errors on empty submit', async () => {
    render(<ContactForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Wyślij/ }));
    await waitFor(() => {
      expect(screen.getAllByText('Wymagane')).toHaveLength(4);
    });
  });

  it('shows email format error for invalid email', async () => {
    render(<ContactForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Email firmowy/), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij/ }));
    await waitFor(() => {
      expect(screen.getByText('Niepoprawny email')).toBeInTheDocument();
    });
  });

  it('calls emailjs.sendForm on valid form submit', async () => {
    (emailjs.sendForm as ReturnType<typeof vi.fn>).mockResolvedValue({});
    render(<ContactForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), { target: { value: 'Jan Kowalski' } });
    fireEvent.change(screen.getByLabelText(/Email firmowy/), { target: { value: 'jan@firma.com' } });
    fireEvent.change(screen.getByLabelText(/Nazwa firmy/), { target: { value: 'Firma SA' } });
    fireEvent.change(screen.getByLabelText(/Liczba użytkowników/), { target: { value: '50-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij/ }));
    await waitFor(() => expect(emailjs.sendForm).toHaveBeenCalled());
  });

  it('shows success message after successful submission', async () => {
    (emailjs.sendForm as ReturnType<typeof vi.fn>).mockResolvedValue({});
    render(<ContactForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), { target: { value: 'Jan Kowalski' } });
    fireEvent.change(screen.getByLabelText(/Email firmowy/), { target: { value: 'jan@firma.com' } });
    fireEvent.change(screen.getByLabelText(/Nazwa firmy/), { target: { value: 'Firma SA' } });
    fireEvent.change(screen.getByLabelText(/Liczba użytkowników/), { target: { value: '50-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij/ }));
    await waitFor(() => expect(screen.getByText('Dziękujemy!')).toBeInTheDocument());
  });

  it('shows error message when emailjs throws', async () => {
    (emailjs.sendForm as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network'));
    render(<ContactForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Imię i nazwisko/), { target: { value: 'Jan Kowalski' } });
    fireEvent.change(screen.getByLabelText(/Email firmowy/), { target: { value: 'jan@firma.com' } });
    fireEvent.change(screen.getByLabelText(/Nazwa firmy/), { target: { value: 'Firma SA' } });
    fireEvent.change(screen.getByLabelText(/Liczba użytkowników/), { target: { value: '50-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij/ }));
    await waitFor(() => expect(screen.getByText(/Błąd wysyłki/)).toBeInTheDocument());
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/ContactForm'"

- [ ] **Step 3: Implement ContactForm**

`Landing_Page/src/components/compositor/ContactForm.tsx`:
```tsx
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { MODULES, UI_BLOCKS } from './catalog-data';
import styles from './compositor.module.css';

interface Props {
  selectedModules: Set<string>;
  selectedUIBlocks: Set<string>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ selectedModules, selectedUIBlocks }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedModuleNames = MODULES.filter(m => selectedModules.has(m.id)).map(m => m.name);
  const selectedBlockNames = UI_BLOCKS.filter(b => selectedUIBlocks.has(b.id)).map(b => b.name);
  const configText = [
    selectedModuleNames.length ? `Moduły: ${selectedModuleNames.join(', ')}` : '',
    selectedBlockNames.length ? `UI Bloki: ${selectedBlockNames.join(', ')}` : '',
  ].filter(Boolean).join('\n');

  const validate = (data: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.get('name')) errs.name = 'Wymagane';
    if (!data.get('email')) errs.email = 'Wymagane';
    else if (!/\S+@\S+\.\S+/.test(data.get('email') as string)) errs.email = 'Niepoprawny email';
    if (!data.get('company')) errs.company = 'Wymagane';
    if (!data.get('users')) errs.users = 'Wymagane';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');
    try {
      await emailjs.sendForm(
        import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
        import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
      );
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formSuccess}>
        <div style={{ fontSize: '2rem' }}>🎉</div>
        <h3>Dziękujemy!</h3>
        <p>Odezwiemy się w ciągu 24h z Twoją spersonalizowaną konfiguracją.</p>
      </div>
    );
  }

  return (
    <div className={styles.contactForm}>
      <h3 className={styles.formTitle}>Zamów demo z Twoją konfiguracją</h3>
      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="cf-name">Imię i nazwisko *</label>
            <input id="cf-name" name="name" type="text" className={errors.name ? styles.inputError : ''} />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>
          <div className={styles.formField}>
            <label htmlFor="cf-email">Email firmowy *</label>
            <input id="cf-email" name="email" type="email" className={errors.email ? styles.inputError : ''} />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="cf-company">Nazwa firmy *</label>
            <input id="cf-company" name="company" type="text" className={errors.company ? styles.inputError : ''} />
            {errors.company && <span className={styles.errorMsg}>{errors.company}</span>}
          </div>
          <div className={styles.formField}>
            <label htmlFor="cf-users">Liczba użytkowników *</label>
            <select id="cf-users" name="users" defaultValue="" className={errors.users ? styles.inputError : ''}>
              <option value="" disabled>Wybierz...</option>
              <option value="1-50">1–50</option>
              <option value="50-200">50–200</option>
              <option value="200-1000">200–1 000</option>
              <option value="1000+">1 000+</option>
            </select>
            {errors.users && <span className={styles.errorMsg}>{errors.users}</span>}
          </div>
        </div>
        <div className={styles.formField}>
          <label htmlFor="cf-message">Wiadomość (opcjonalnie)</label>
          <textarea id="cf-message" name="message" rows={3} />
        </div>
        <div className={styles.formField}>
          <label>Twoja konfiguracja</label>
          <textarea name="configuration" readOnly value={configText} className={styles.configReadOnly} rows={3} />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Wysyłanie...' : 'Wyślij konfigurację →'}
        </button>
        {status === 'error' && (
          <p className={styles.errorMsg} style={{ marginTop: '8px', textAlign: 'center' }}>
            Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.
          </p>
        )}
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/ContactForm.tsx Landing_Page/src/__tests__/compositor/ContactForm.test.tsx
git commit -m "feat: add ContactForm with EmailJS integration and validation"
```

---

### Task 10: Compositor — root React island

**Files:**
- Create: `Landing_Page/src/components/compositor/Compositor.tsx`
- Create: `Landing_Page/src/__tests__/compositor/Compositor.test.tsx`

- [ ] **Step 1: Write failing tests**

`Landing_Page/src/__tests__/compositor/Compositor.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('@emailjs/browser', () => ({
  default: { sendForm: vi.fn() },
}));

import { Compositor } from '../../components/compositor/Compositor';

describe('Compositor', () => {
  it('renders catalog tabs and role switcher', () => {
    render(<Compositor />);
    expect(screen.getByText('Moduły')).toBeInTheDocument();
    expect(screen.getByText('UI Bloki')).toBeInTheDocument();
    expect(screen.getByText('Learner')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows empty state initially', () => {
    render(<Compositor />);
    expect(screen.getByText(/Wybierz komponenty/)).toBeInTheDocument();
  });

  it('hides contact form when nothing selected', () => {
    render(<Compositor />);
    expect(screen.queryByText('Zamów demo z Twoją konfiguracją')).not.toBeInTheDocument();
  });

  it('shows contact form after selecting a component', () => {
    render(<Compositor />);
    const cards = screen.getAllByRole('button', { name: /Learner Dashboard/ });
    fireEvent.click(cards[0]);
    expect(screen.getByText('Zamów demo z Twoją konfiguracją')).toBeInTheDocument();
  });

  it('shows selection badge after selecting 1 module', () => {
    render(<Compositor />);
    const allButtons = screen.getAllByRole('button');
    const moduleCards = allButtons.filter(b => b.getAttribute('aria-pressed') !== null);
    fireEvent.click(moduleCards[0]);
    expect(screen.getByText('1 komponent wybrany')).toBeInTheDocument();
  });

  it('auto-switches to admin preview when admin module selected', () => {
    render(<Compositor />);
    const allButtons = screen.getAllByRole('button');
    const adminDashBtn = allButtons.find(b => b.textContent?.includes('Admin Dashboard'));
    expect(adminDashBtn).toBeDefined();
    fireEvent.click(adminDashBtn!);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('deselects a module on second click', () => {
    render(<Compositor />);
    const cards = screen.getAllByRole('button', { name: /Learner Dashboard/ });
    fireEvent.click(cards[0]);
    expect(screen.getByText('1 komponent wybrany')).toBeInTheDocument();
    fireEvent.click(cards[0]);
    expect(screen.queryByText(/wybrany|wybrane/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — "Cannot find module '../../components/compositor/Compositor'"

- [ ] **Step 3: Implement Compositor**

`Landing_Page/src/components/compositor/Compositor.tsx`:
```tsx
import { useState } from 'react';
import { CatalogPanel } from './CatalogPanel';
import { PreviewCanvas } from './PreviewCanvas';
import { ContactForm } from './ContactForm';
import { LEARNER_MODULE_IDS, ADMIN_MODULE_IDS } from './catalog-data';
import styles from './compositor.module.css';

export function Compositor() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [selectedUIBlocks, setSelectedUIBlocks] = useState<Set<string>>(new Set());
  const [previewRole, setPreviewRole] = useState<'learner' | 'admin'>('learner');

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
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add Landing_Page/src/components/compositor/Compositor.tsx Landing_Page/src/__tests__/compositor/Compositor.test.tsx
git commit -m "feat: add Compositor root island with state management"
```

---

### Task 11: Astro page shell + navigation updates

**Files:**
- Create: `Landing_Page/src/pages/demo/index.astro`
- Modify: `Landing_Page/src/i18n/en.ts` (add `nav.demo`)
- Modify: `Landing_Page/src/i18n/pl.ts` (add `nav.demo`)
- Modify: `Landing_Page/src/i18n/de.ts` (add `nav.demo`)
- Modify: `Landing_Page/src/components/layout/Navbar.astro` (add Demo link)
- Modify: `Landing_Page/src/components/sections/Hero.astro` (change ctaSecondary href)

- [ ] **Step 1: Add `demo` key to all three i18n files**

In `Landing_Page/src/i18n/en.ts` — add `demo: 'Demo'` to `nav`:
```ts
nav: {
  features: 'Features',
  pricing: 'Pricing',
  business: 'For Business',
  faq: 'FAQ',
  demo: 'Demo',
  login: 'Log in',
  cta: 'Get started',
},
```

In `Landing_Page/src/i18n/pl.ts` — add `demo: 'Demo'` to `nav`:
```ts
nav: {
  features: 'Funkcje',
  pricing: 'Cennik',
  business: 'Dla firm',
  faq: 'FAQ',
  demo: 'Demo',
  login: 'Zaloguj się',
  cta: 'Zacznij teraz',
},
```

In `Landing_Page/src/i18n/de.ts` — add `demo: 'Demo'` to `nav` after `faq`:
```ts
nav: {
  features: 'Funktionen',
  pricing: 'Preise',
  business: 'Für Unternehmen',
  faq: 'FAQ',
  demo: 'Demo',
  login: 'Anmelden',
  cta: 'Jetzt starten',
},
```

- [ ] **Step 2: Add Demo link to Navbar**

In `Landing_Page/src/components/layout/Navbar.astro`, find `<nav class="navbar__nav"...>` block and add the Demo link after the FAQ link:

Find:
```astro
      <a href="#faq" class="navbar__link">{t.faq}</a>
```

Replace with:
```astro
      <a href="#faq" class="navbar__link">{t.faq}</a>
      <a href="/demo" class="navbar__link navbar__link--demo">{t.demo}</a>
```

Also add in the mobile drawer (find the `#faq` mobile link and add after it):
```astro
    <a href="/demo" class="mobile-drawer__link">{t.demo}</a>
```

- [ ] **Step 3: Update Hero ctaSecondary to link to /demo**

In `Landing_Page/src/components/sections/Hero.astro`, find:
```astro
        <Button variant="ghost" href="#demo">{t.ctaSecondary}</Button>
```
Replace with:
```astro
        <Button variant="ghost" href="/demo">{t.ctaSecondary}</Button>
```

- [ ] **Step 4: Create the Astro demo page**

Create `Landing_Page/src/pages/demo/index.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Navbar from '../../components/layout/Navbar.astro';
import Footer from '../../components/layout/Footer.astro';
import { Compositor } from '../../components/compositor/Compositor';

const lang = 'en' as const;
---

<BaseLayout lang={lang}>
  <Navbar lang={lang} />
  <main>
    <section style="padding: 48px 0 24px;">
      <div class="container">
        <p class="section-label reveal">Component Library</p>
        <h1 style="font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: var(--text-primary); margin: 8px 0 12px; line-height: 1.15;">
          Build your LMS, <span class="gradient-text">your way</span>
        </h1>
        <p style="font-size: 1.0625rem; color: var(--text-secondary); line-height: 1.65; max-width: 560px;">
          Browse available modules and UI components. Select what you need, preview your application live, and request a personalised demo.
        </p>
      </div>
    </section>
    <div style="padding-bottom: 64px;">
      <Compositor client:load />
    </div>
  </main>
  <Footer lang={lang} />
</BaseLayout>
```

- [ ] **Step 5: Verify build passes**

Run in `Landing_Page/`: `npm run build`
Expected: build completes with no TypeScript or Astro errors. `dist/demo/index.html` exists.

- [ ] **Step 6: Verify dev server loads /demo**

Run `npm run dev`, open `http://localhost:4321/demo`.
Expected: page loads, compositor renders, catalog shows modules, clicking a card updates selection badge, preview canvas shows empty state initially.

- [ ] **Step 7: Commit**

```bash
git add Landing_Page/src/pages/demo/index.astro Landing_Page/src/i18n/en.ts Landing_Page/src/i18n/pl.ts Landing_Page/src/i18n/de.ts Landing_Page/src/components/layout/Navbar.astro Landing_Page/src/components/sections/Hero.astro
git commit -m "feat: add /demo page with Compositor island and nav Demo link"
```

---

### Task 12: EmailJS configuration

**Files:**
- Create: `Landing_Page/.env` (not committed — add to .gitignore)
- Create: `Landing_Page/.env.example`

- [ ] **Step 1: Create EmailJS account and service**

1. Go to https://www.emailjs.com and sign up with `kkacper15@gmail.com`.
2. Dashboard → Email Services → Add New Service → Gmail → follow OAuth flow.
3. Note your **Service ID** (e.g. `service_abc123`).

- [ ] **Step 2: Create EmailJS email template**

1. Dashboard → Email Templates → Create New Template.
2. Set **Subject**: `New demo request from {{company}}`
3. Set **Body**:
   ```
   Name: {{name}}
   Email: {{email}}
   Company: {{company}}
   Users: {{users}}

   Configuration:
   {{configuration}}

   Message:
   {{message}}
   ```
4. Note your **Template ID** (e.g. `template_xyz789`).
5. Note your **Public Key** from Account → API Keys.

- [ ] **Step 3: Add `.env` to .gitignore**

Check `Landing_Page/.gitignore`. If it doesn't already exclude `.env`, add:
```
.env
```

- [ ] **Step 4: Create .env with credentials**

`Landing_Page/.env`:
```
PUBLIC_EMAILJS_SERVICE_ID=service_REPLACE_ME
PUBLIC_EMAILJS_TEMPLATE_ID=template_REPLACE_ME
PUBLIC_EMAILJS_PUBLIC_KEY=REPLACE_ME
```

Replace the values with those from Step 1 and Step 2.

- [ ] **Step 5: Create .env.example**

`Landing_Page/.env.example`:
```
PUBLIC_EMAILJS_SERVICE_ID=service_REPLACE_ME
PUBLIC_EMAILJS_TEMPLATE_ID=template_REPLACE_ME
PUBLIC_EMAILJS_PUBLIC_KEY=REPLACE_ME
```

- [ ] **Step 6: Verify form submission end-to-end**

1. Run `npm run dev`.
2. Open `http://localhost:4321/demo`.
3. Select any 2 components.
4. Fill in the contact form with test data.
5. Click "Wyślij konfigurację →".
6. Verify success state appears in the UI.
7. Check `kkacper15@gmail.com` inbox — email should arrive with the selected configuration.

- [ ] **Step 7: Commit**

```bash
git add Landing_Page/.env.example Landing_Page/.gitignore
git commit -m "chore: add EmailJS env config template"
```
