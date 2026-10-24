import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getOpenGraphLocale, getSiteDescription } from '@/locales/utils';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale = DEFAULT_LOCALE } = await params;
  const description = getSiteDescription(locale);

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s - ${siteMetadata.author}`,
    },
    description,
    openGraph: {
      title: siteMetadata.title,
      description,
      url: './',
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: getOpenGraphLocale(locale),
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/${locale}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: siteMetadata.title,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
  };
}

export { generateStaticParams } from '@/locales/generateStaticParams';

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
