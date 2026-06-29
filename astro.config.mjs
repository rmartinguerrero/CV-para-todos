import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'it', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  output: 'static',

  site: 'https://cv.raulmguerrero.com',
});
