import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'Munchr Partner Dashboard',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,
};
