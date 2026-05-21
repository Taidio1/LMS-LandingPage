import { describe, expect, it } from 'vitest';
import { getContactHref, getDemoHref, getNavSectionHref } from '../../utils/nav-links';

describe('getNavSectionHref', () => {
  it('keeps section links local on the matching language landing page', () => {
    expect(getNavSectionHref('en', '/', 'features')).toBe('#features');
    expect(getNavSectionHref('pl', '/pl/', 'pricing')).toBe('#pricing');
    expect(getNavSectionHref('de', '/de/', 'faq')).toBe('#faq');
  });

  it('points section links back to the language landing page from nested routes', () => {
    expect(getNavSectionHref('en', '/demo/', 'features')).toBe('/#features');
    expect(getNavSectionHref('pl', '/pl/demo/', 'business')).toBe('/pl/#business');
    expect(getNavSectionHref('de', '/de/demo/', 'signup')).toBe('/de/#signup');
  });

  it('returns localized contact routes', () => {
    expect(getContactHref('en')).toBe('/contact/');
    expect(getContactHref('pl')).toBe('/pl/contact/');
    expect(getContactHref('de')).toBe('/de/contact/');
  });

  it('returns localized demo routes', () => {
    expect(getDemoHref('en')).toBe('/demo/');
    expect(getDemoHref('pl')).toBe('/pl/demo/');
    expect(getDemoHref('de')).toBe('/de/demo/');
  });
});
