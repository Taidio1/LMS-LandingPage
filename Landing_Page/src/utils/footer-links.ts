import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { pl } from '../i18n/pl';
import type { Lang } from '../i18n/index';
import {
  getContactHref,
  getDemoHref,
  getDocsHref,
  getNavSectionHref,
} from './nav-links';

type FooterLink = {
  label: string;
  href: string;
};

type FooterLinkGroups = {
  product: FooterLink[];
  company: FooterLink[];
  resources: FooterLink[];
};

function getTranslations(lang: Lang) {
  return lang === 'de' ? de : lang === 'pl' ? pl : en;
}

export function getFooterLinkGroups(lang: Lang, pathname: string): FooterLinkGroups {
  const t = getTranslations(lang);
  const docsHref = getDocsHref(lang);

  return {
    product: [
      {
        label: t.footer.productLinks[0],
        href: getNavSectionHref(lang, pathname, 'features'),
      },
      {
        label: t.footer.productLinks[1],
        href: getNavSectionHref(lang, pathname, 'pricing'),
      },
      {
        label: t.footer.productLinks[2],
        href: `${docsHref}#sso-setup`,
      },
    ],
    company: [
      {
        label: t.footer.companyLinks[4],
        href: getContactHref(lang),
      },
    ],
    resources: [
      {
        label: t.footer.resourceLinks[0],
        href: docsHref,
      },
      {
        label: t.nav.liveDemo,
        href: getDemoHref(lang),
      },
      {
        label: t.nav.cta,
        href: getContactHref(lang),
      },
    ],
  };
}
