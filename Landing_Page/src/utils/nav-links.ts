import { languageRoutes, type Lang } from '../i18n/index';

export type NavSectionId = 'features' | 'pricing' | 'business' | 'faq' | 'login' | 'signup';

function normalizePath(pathname: string) {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getNavSectionHref(lang: Lang, pathname: string, sectionId: NavSectionId) {
  const route = languageRoutes[lang];
  const isLanguageHome = normalizePath(pathname) === route;

  return isLanguageHome ? `#${sectionId}` : `${route}#${sectionId}`;
}
