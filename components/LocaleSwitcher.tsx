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
  const equivalent = availablePaths.includes(normalized);
  const target = equivalent ? candidate : `/${nextLocale}/blog`;
  return (
    <Link
      href={target}
      replace
      scroll={false}
      className="locale-switch"
      lang={nextLocale}
      hrefLang={nextLocale}
      aria-label={nextLocale === Locale.ZH ? '切换到中文' : 'Switch to English'}
      onNavigate={(event) => {
        // Translated headings have different IDs, so do not carry article fragments.
        if (equivalent && window.location.search) {
          event.preventDefault();
          router.replace(`${target}${window.location.search}`, { scroll: false });
        }
      }}
    >
      {nextLocale === Locale.ZH ? '中' : 'EN'}
    </Link>
  );
}
