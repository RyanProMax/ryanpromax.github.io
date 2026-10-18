'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { slug } from 'github-slugger';
import { DEFAULT_LOCALE } from '@/locales/config';

export default function Tag({ text }: { text: string }) {
  const { locale = DEFAULT_LOCALE } = useParams();
  return (
    <Link href={`/${locale}/blog?tag=${encodeURIComponent(slug(text))}`} className="editorial-tag">
      {text.split(' ').join('-')}
    </Link>
  );
}
