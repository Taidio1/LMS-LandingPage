import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '../../..');

function readProjectFile(path: string) {
  return readFileSync(resolve(root, path), 'utf-8');
}

describe('demo shell pages', () => {
  const demoPages = [
    'src/pages/demo/index.astro',
    'src/pages/pl/demo/index.astro',
    'src/pages/de/demo/index.astro',
  ];

  it.each(demoPages)('renders %s without the marketing navbar and footer', (pagePath) => {
    const page = readProjectFile(pagePath);

    expect(page).not.toContain('components/layout/Navbar.astro');
    expect(page).not.toContain('components/layout/Footer.astro');
    expect(page).not.toContain('<Navbar');
    expect(page).not.toContain('<Footer');
    expect(page).toContain('<DemoPage');
  });

  it('keeps an explicit landing-page return action inside the demo app', () => {
    const demo = readProjectFile('src/components/demo/Demo.tsx');
    const demoPage = readProjectFile('src/components/sections/DemoPage.astro');

    expect(demo).toContain('homeHref');
    expect(demo).toContain('Back to site');
    expect(demoPage).toContain('languageRoutes[lang]');
    expect(demoPage).toContain('homeHref={homeHref}');
  });
});
