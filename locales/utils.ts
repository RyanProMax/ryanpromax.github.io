import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from './config';

export const getDateLocale = (locale: Locale | string = DEFAULT_LOCALE) =>
  locale === Locale.ZH ? 'zh-CN' : siteMetadata.locale;

export const getOpenGraphLocale = (locale: Locale | string = DEFAULT_LOCALE) =>
  locale === Locale.ZH ? 'zh_CN' : 'en_US';

export const getSiteDescription = (locale: Locale | string = DEFAULT_LOCALE) =>
  siteMetadata.descriptions?.[locale] || siteMetadata.description;
