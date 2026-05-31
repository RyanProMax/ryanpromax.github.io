import Link from '@/components/Link';
import Tag from '@/components/Tag';
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
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
