'use client';

import Link from '@/components/Link';
import { useParams } from 'next/navigation';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

export default function NotFound() {
  const { locale = DEFAULT_LOCALE } = useParams();
  const chinese = locale === Locale.ZH;
  return (
    <div className="editorial-page-heading">
      <p className="editorial-eyebrow">404 / {chinese ? '页面不存在' : 'Page not found'}</p>
      <h1>{chinese ? '走到了空白处。' : 'A blank page.'}</h1>
      <p>
        {chinese
          ? '这个地址没有内容，回首页继续探索吧。'
          : 'There’s nothing at this address. Head home to keep exploring.'}
      </p>
      <Link href={`/${locale}`} className="project-link">
        ← {chinese ? '返回首页' : 'Back home'}
      </Link>
    </div>
  );
}
