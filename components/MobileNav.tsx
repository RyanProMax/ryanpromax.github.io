'use client';

import { BookOpen, Layers } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import Link from './Link';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import SlidingNav from './SlidingNav';

// Like antfu.me's mobile navigation, keep primary destinations one tap away.
export default function MobileNav() {
  const { locale = DEFAULT_LOCALE } = useParams();
  const pathname = usePathname();
  const chinese = locale === Locale.ZH;
  return (
    <SlidingNav className="mobile-navigation" aria-label={chinese ? '主导航' : 'Main navigation'}>
      {[
        { path: 'blog', label: chinese ? '文章' : 'Blog', Icon: BookOpen },
        { path: 'projects', label: chinese ? '作品' : 'Projects', Icon: Layers },
      ].map(({ path, label, Icon }) => (
        <Link
          key={path}
          href={`/${locale}/${path}`}
          title={label}
          aria-label={label}
          aria-current={
            pathname === `/${locale}/${path}` || pathname.startsWith(`/${locale}/${path}/`)
              ? 'page'
              : undefined
          }
        >
          <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ))}
    </SlidingNav>
  );
}
