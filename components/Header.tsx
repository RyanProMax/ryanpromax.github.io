'use client';

import { usePathname, useParams } from 'next/navigation';
import { Asterisk } from 'lucide-react';
import headerNavLinks from '@/data/headerNavLinks';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import Link from './Link';
import MobileNav from './MobileNav';
import SearchButton from './SearchButton';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeSwitch from './ThemeSwitch';
import SlidingNav from './SlidingNav';

export default function Header({
  availablePaths,
  assetPrefix,
}: {
  availablePaths: string[];
  assetPrefix: string;
}) {
  const pathname = usePathname();
  const { locale = DEFAULT_LOCALE } = useParams();
  const language = locale as Locale;
  const links = headerNavLinks[language] || headerNavLinks[DEFAULT_LOCALE];

  return (
    <header className="site-header">
      <Link href={`/${language}`} className="site-identity" aria-label="Ryan — Home">
        RYAN <Asterisk size={18} strokeWidth={1.5} aria-hidden="true" />
      </Link>
      <div className="site-header-actions">
        <SlidingNav
          className="desktop-navigation"
          aria-label={language === Locale.ZH ? '主导航' : 'Main navigation'}
        >
          {links
            .filter((link) => link.href !== '/')
            .map((link) => {
              const href = `/${language}${link.href}`;
              return (
                <Link
                  key={link.href}
                  href={href}
                  aria-current={
                    pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined
                  }
                >
                  {link.title}
                </Link>
              );
            })}
        </SlidingNav>
        <MobileNav />
        <SearchButton assetPrefix={assetPrefix} />
        <ThemeSwitch />
        <LocaleSwitcher availablePaths={availablePaths} />
      </div>
    </header>
  );
}
