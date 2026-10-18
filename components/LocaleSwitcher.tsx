'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from './Link';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

export default function LocaleSwitcher({ availablePaths }: { availablePaths: string[] }) {
  const router = useRouter();
  const { locale = DEFAULT_LOCALE } = useParams();
  const pathname = usePathname();
  const nextLocale = locale === Locale.EN ? Locale.ZH : Locale.EN;
  const candidate = pathname.replace(/^\/(en|zh)(?=\/|$)/, `/${nextLocale}`);
  const normalized = candidate.replace(/\/$/, '');
  const target = availablePaths.includes(normalized) ? candidate : `/${nextLocale}/blog`;
  return (
    <Link
      href={target}
      className="locale-switch"
      lang={nextLocale}
      aria-label={nextLocale === Locale.ZH ? '切换到中文' : 'Switch to English'}
      onClick={(event) => {
        if (window.location.search || window.location.hash) {
          event.preventDefault();
          router.push(`${target}${window.location.search}${window.location.hash}`);
        }
        try {
          localStorage.setItem('preferred-locale', nextLocale);
          document.cookie = `preferred-locale=${nextLocale}; max-age=31536000; path=/; samesite=lax`;
        } catch {
          /* Navigation still works when browser storage is unavailable. */
        }
      }}
    >
      {nextLocale === Locale.ZH ? '中' : 'EN'}
    </Link>
  );
}
