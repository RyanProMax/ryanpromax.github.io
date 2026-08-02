import { allAuthors, type Authors } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';
import { EXPERIENCES } from '@/components/Experience';
import ImmersiveResume, { type ResumeLocalization } from '@/components/ImmersiveResume';
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
            company: author.company,
            summary: author.summary,
            email: author.email,
            github: author.github,
            linkedin: author.linkedin,
            twitter: author.twitter,
            bluesky: author.bluesky,
          },
        },
      ];
    })
  ) as Record<Locale, ResumeLocalization>;

  return (
    <ImmersiveResume
      assetPrefix={process.env.BASE_PATH || ''}
      initialLocale={locale}
      localizations={localizations}
    />
  );
}
