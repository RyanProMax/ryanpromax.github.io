'use client';

import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import type { ResumeLocalization } from './EditorialResume';
import Header from './Header';
import Footer from './Footer';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

const EditorialResume = dynamic(() => import('./EditorialResume'));

export default function SiteShell({
  children,
  availablePaths,
  localizations,
  assetPrefix,
}: {
  children: React.ReactNode;
  availablePaths: string[];
  localizations: Record<Locale, ResumeLocalization>;
  assetPrefix: string;
}) {
  const { locale = DEFAULT_LOCALE } = useParams<{ locale: Locale }>();
  const pathname = usePathname();
  const isHome = pathname.replace(/\/$/, '') === `/${locale}`;

  return (
    <div className="site-shell font-sans">
      <Header availablePaths={availablePaths} assetPrefix={assetPrefix} />
      <main className="site-main">
        {/* Keep the résumé outside the changing [locale] segment to preserve its state. */}
        {isHome && (
          <EditorialResume
            assetPrefix={assetPrefix}
            locale={locale}
            localizations={localizations}
          />
        )}
        {children}
      </main>
      <Footer assetPrefix={assetPrefix} />
    </div>
  );
}
