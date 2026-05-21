import { describe, expect, it } from 'vitest';
import { getNavSectionHref } from '../../utils/nav-links';

describe('getNavSectionHref', () => {
  it('keeps section links local on the matching language landing page', () => {
    expect(getNavSectionHref('en', '/', 'features')).toBe('#features');
    expect(getNavSectionHref('pl', '/pl/', 'pricing')).toBe('#pricing');
    expect(getNavSectionHref('de', '/de/', 'faq')).toBe('#faq');
  });

  it('points section links back to the language landing page from nested routes', () => {
    expect(getNavSectionHref('en', '/demo/', 'features')).toBe('/#features');
    expect(getNavSectionHref('pl', '/pl/demo/', 'business')).toBe('/pl/#business');
    expect(getNavSectionHref('de', '/demo/', 'signup')).toBe('/de/#signup');
  });
});
