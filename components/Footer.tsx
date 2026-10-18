'use client';

import { useParams } from 'next/navigation';
import Link from './Link';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE } from '@/locales/config';

export default function Footer() {
  const { locale = DEFAULT_LOCALE } = useParams();
  return (
    <footer className="site-footer">
      <Link href={`/${locale}`}>© {new Date().getFullYear()} Ryan</Link>
      <div>
        <Link href={siteMetadata.github}>GitHub ↗</Link>
        <Link href={`mailto:${siteMetadata.email}`}>Email ↗</Link>
        <Link href={`/${locale}/feed.xml`}>RSS ↗</Link>
      </div>
    </footer>
  );
}
