import { allAuthors, type Authors } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';

import EditorialResume, { type ResumeLocalization } from '@/components/EditorialResume';
import { EXPERIENCES } from '@/components/Experience';
import { DEFAULT_LOCALE, Locale, SupportedLanguages } from '@/locales/config';

export const metadata = genPageMetadata({ title: 'About' });

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
            name: author.name,
            occupation: author.occupation,
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
