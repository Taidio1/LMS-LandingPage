import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://onboardtogo.com',
  // Strony pozostają statyczne (prerender); tryb hybrid jest potrzebny
  // tylko dla serwerowego endpointu POST /api/contact (wysyłka maili SMTP).
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          pl: 'pl-PL',
          de: 'de-DE',
        },
      },
    }),
  ],
});
