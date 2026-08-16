import { allAuthors, type Authors } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';
import type { Metadata } from 'next';

import EditorialResume, { type ResumeLocalization } from '@/components/EditorialResume';
import { EXPERIENCES } from '@/components/Experience';
import { getNavLinkData } from '@/data/headerNavLinks';
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
    title: getNavLinkData(locale, '/about')?.title || 'About',
    description: author.summary,
    locale,
  });
}

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
