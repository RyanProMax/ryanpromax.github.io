import { allAuthors, type Authors } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';
import type { Metadata } from 'next';

import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale = DEFAULT_LOCALE } = await params;
  const author = allAuthors.find(
    (entry) => entry.slug.includes('default') && entry.locale === locale
  ) as Authors;

  return genPageMetadata({
    title: 'Ryan',
    description: author.summary,
    locale,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}`,
      languages: {
        en: `${siteMetadata.siteUrl}/en`,
        zh: `${siteMetadata.siteUrl}/zh`,
        'x-default': `${siteMetadata.siteUrl}/en`,
      },
    },
  });
}

export { generateStaticParams } from '@/locales/generateStaticParams';

export default function Page() {
  // SiteShell renders the homepage without remounting it when the locale changes.
  return null;
}
