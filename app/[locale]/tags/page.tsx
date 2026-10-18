import Link from '@/components/Link';
import { slug } from 'github-slugger';
import tagData from 'app/tag-data.json';
import { genPageMetadata } from 'app/[locale]/seo';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getNavLinkData } from '@/data/headerNavLinks';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale = DEFAULT_LOCALE } = await params;
  return genPageMetadata({
    title: getNavLinkData(locale, '/tags')?.title || 'Tags',
    description: locale === Locale.ZH ? '文章标签' : 'Things I blog about',
    locale,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale = DEFAULT_LOCALE } = await params;
  const tagCounts = (tagData as Record<Locale, Record<string, number>>)[locale];
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);
  const title = getNavLinkData(locale, '/tags')?.title || 'Tags';

  return (
    <div className="topics-page">
      <header className="editorial-page-heading">
        <p className="editorial-eyebrow">{locale === Locale.ZH ? '索引' : 'Index'}</p>
        <h1>{title}</h1>
        <p>
          {locale === Locale.ZH
            ? '沿着一个主题，继续探索。'
            : 'Follow a thread. Explore a little further.'}
        </p>
      </header>
      <div className="topic-index">
        {sortedTags.map((tag, index) => (
          <Link key={tag} href={`/${locale}/tags/${slug(tag)}`}>
            <span className="topic-number">{String(index + 1).padStart(2, '0')}</span>
            <span>{tag}</span>
            <span className="topic-count">{tagCounts[tag]} ↗</span>
          </Link>
        ))}
        {tagKeys.length === 0 && <p>{locale === Locale.ZH ? '暂无标签' : 'No tags yet.'}</p>}
      </div>
    </div>
  );
}
