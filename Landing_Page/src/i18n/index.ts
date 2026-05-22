export type Lang = 'en' | 'pl' | 'de';
export const defaultLang: Lang = 'en';
export const languages: Lang[] = ['en', 'pl', 'de'];

export const languageRoutes: Record<Lang, string> = {
  en: '/',
  pl: '/pl/',
  de: '/de/',
};

export const contactRoutes: Record<Lang, string> = {
  en: '/contact/',
  pl: '/pl/contact/',
  de: '/de/contact/',
};

export const docsRoutes: Record<Lang, string> = {
  en: '/docs/',
  pl: '/pl/docs/',
  de: '/docs/',
};

export const languageLabels: Record<Lang, string> = {
  en: 'EN',
  pl: 'PL',
  de: 'DE',
};
