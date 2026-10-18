import { allAuthors, type Authors } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';
import type { Metadata } from 'next';

import EditorialResume, { type ResumeLocalization } from '@/components/EditorialResume';
import { EXPERIENCES } from '@/components/Experience';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale, SupportedLanguages } from '@/locales/config';

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

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale = DEFAULT_LOCALE } = await params;
  const localizations = Object.fromEntries(
    SupportedLanguages.map((currentLocale) => {
      const author = allAuthors.find(
        (entry) => entry.slug.includes('default') && entry.locale === currentLocale
      ) as Authors;

      return [
        currentLocale,
        {
          experiences: EXPERIENCES[currentLocale],
          profile: {
            email: author.email,
            github: author.github,
            name: author.name,
            occupation: author.occupation,
            summary: author.summary,
          },
        },
      ];
    })
  ) as Record<Locale, ResumeLocalization>;

  return (
    <EditorialResume
      assetPrefix={process.env.BASE_PATH || ''}
      initialLocale={locale}
      localizations={localizations}
    />
  );
}
