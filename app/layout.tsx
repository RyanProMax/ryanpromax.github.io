import 'css/tailwind.css';
import 'css/editorial-site.css';
import 'pliny/search/algolia.css';
import 'remark-github-blockquote-alert/alert.css';

import { Space_Grotesk } from 'next/font/google';
import { Analytics, type AnalyticsConfig } from 'pliny/analytics';
import { allAuthors, allBlogs, type Authors } from 'contentlayer/generated';
import type { ResumeLocalization } from '@/components/EditorialResume';
import { EXPERIENCES } from '@/components/Experience';
import LocaleDocument from '@/components/LocaleDocument';
import SectionContainer from '@/components/SectionContainer';
import SiteShell from '@/components/SiteShell';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale, SupportedLanguages } from '@/locales/config';
import { ThemeProviders } from './theme-providers';

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || '';
  const availablePaths = SupportedLanguages.flatMap((language) => {
    const posts = allBlogs.filter(
      (post) => !post.draft && (post.language || DEFAULT_LOCALE) === language
    );
    return [
      `/${language}`,
      `/${language}/blog`,
      `/${language}/projects`,
      ...posts.map((post) => `/${language}/blog/${post.slug}`),
      ...Array.from(
        { length: Math.ceil(posts.length / 5) },
        (_, i) => `/${language}/blog/page/${i + 1}`
      ),
    ];
  });
  const localizations = Object.fromEntries(
    SupportedLanguages.map((locale) => {
      const author = allAuthors.find(
        (entry) => entry.slug.includes('default') && entry.locale === locale
      ) as Authors;

      return [
        locale,
        {
          experiences: EXPERIENCES[locale],
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
    <LocaleDocument className={`${space_grotesk.variable} scroll-smooth`}>
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <body className="editorial-site antialiased">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SiteShell
              availablePaths={availablePaths}
              localizations={localizations}
              assetPrefix={basePath}
            >
              {children}
            </SiteShell>
          </SectionContainer>
        </ThemeProviders>
      </body>
    </LocaleDocument>
  );
}
