'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { DEFAULT_LOCALE } from '@/locales/config';

// Read route params here so both exported HTML and client navigation have the right lang.
export default function LocaleDocument({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { locale = DEFAULT_LOCALE } = useParams<{ locale?: string }>();

  useEffect(() => {
    // Persist the committed URL, never a link that was only prefetched.
    try {
      localStorage.setItem('preferred-locale', locale);
    } catch {
      /* Navigation still works when browser storage is unavailable. */
    }
    document.cookie = `preferred-locale=${locale}; max-age=31536000; path=/; samesite=lax`;
  }, [locale]);

  return (
    <html
      lang={locale}
      className={className}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {children}
    </html>
  );
}
