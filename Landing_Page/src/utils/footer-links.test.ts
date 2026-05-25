import { describe, expect, it } from 'vitest';
import { getFooterLinkGroups } from './footer-links';

describe('footer links', () => {
  it('uses localized routes and real destinations for Polish footer links', () => {
    const groups = getFooterLinkGroups('pl', '/pl/docs/');
    const allLinks = Object.values(groups).flat();

    expect(groups.product.map((link) => link.href)).toEqual([
      '/pl/#features',
      '/pl/#pricing',
      '/pl/docs/#sso-setup',
    ]);
    expect(groups.resources[0]).toEqual({
      label: 'Dokumentacja',
      href: '/pl/docs/',
    });
    expect(allLinks.every((link) => link.href && link.href !== '#')).toBe(true);
  });

  it('uses the existing English docs route for German documentation links', () => {
    const groups = getFooterLinkGroups('de', '/de/');

    expect(groups.resources[0]).toEqual({
      label: 'Dokumentation',
      href: '/docs/',
    });
  });
});
