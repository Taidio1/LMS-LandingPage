import { describe, expect, it } from 'vitest';
import { getContactHref, getDocsHref, getNavSectionHref } from '../../utils/nav-links';

describe('getNavSectionHref', () => {
  it('keeps section links local on the matching language landing page', () => {
    expect(getNavSectionHref('en', '/', 'features')).toBe('#features');
    expect(getNavSectionHref('pl', '/pl/', 'pricing')).toBe('#pricing');
    expect(getNavSectionHref('de', '/de/', 'faq')).toBe('#faq');
  });

  it('points section links back to the language landing page from nested routes', () => {
    expect(getNavSectionHref('en', '/docs/', 'features')).toBe('/#features');
    expect(getNavSectionHref('pl', '/pl/docs/', 'business')).toBe('/pl/#business');
    expect(getNavSectionHref('de', '/de/', 'signup')).toBe('#signup');
  });

  it('returns localized contact routes', () => {
    expect(getContactHref('en')).toBe('/contact/');
    expect(getContactHref('pl')).toBe('/pl/contact/');
    expect(getContactHref('de')).toBe('/de/contact/');
  });

  it('returns localized docs routes', () => {
    expect(getDocsHref('en')).toBe('/docs/');
    expect(getDocsHref('pl')).toBe('/pl/docs/');
    expect(getDocsHref('de')).toBe('/docs/');
  });
});
