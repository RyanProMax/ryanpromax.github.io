'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Button } from '@headlessui/react';
import { DEFAULT_LOCALE, Locale, SupportedLanguages } from '@/locales/config';

export default function LocaleSwitcher() {
  const { locale = DEFAULT_LOCALE } = useParams();
  const nextLocale = locale === Locale.EN ? Locale.ZH : Locale.EN;

  const parseCurrentPath = () => {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const localeIndex = segments.findIndex((segment) =>
      SupportedLanguages.includes(segment as Locale)
    );

    if (localeIndex === -1) {
      return {
        basePath: '',
        pathnameWithoutLocale: pathname || '/',
      };
    }

    const baseSegments = segments.slice(0, localeIndex);
    const pathSegments = segments.slice(localeIndex + 1);
    return {
      basePath: baseSegments.length ? `/${baseSegments.join('/')}` : '',
      pathnameWithoutLocale: pathSegments.length ? `/${pathSegments.join('/')}` : '/',
    };
  };

  const handleLanguageSwitch = () => {
    try {
      localStorage.setItem('preferred-locale', nextLocale);
      document.cookie = `preferred-locale=${nextLocale}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=lax`;

      const { basePath, pathnameWithoutLocale } = parseCurrentPath();
      const pathSuffix = pathnameWithoutLocale === '/' ? '' : pathnameWithoutLocale;
      const targetPath = `${basePath}/${nextLocale}${pathSuffix}${window.location.search}${window.location.hash}`;
      window.location.assign(targetPath);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  };

  return (
    <Button
      onClick={handleLanguageSwitch}
      className={clsx(
        'inline-flex items-center px-1.5 py-0.5',
        'rounded-md',
        'cursor-pointer',
        'text-sm/6 font-semibold',
        'hover:border-primary-600 dark:hover:border-primary-400 border border-black dark:border-white',
        'hover:text-primary-600 dark:hover:text-primary-400 text-black dark:text-white',
        'bg-transparent'
      )}
    >
      {nextLocale.toUpperCase()}
    </Button>
  );
}
