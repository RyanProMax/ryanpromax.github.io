import { Metadata } from 'next';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getOpenGraphLocale, getSiteDescription } from '@/locales/utils';

interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  locale?: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function genPageMetadata({
  title,
  description,
  image,
  locale = DEFAULT_LOCALE,
  ...rest
}: PageSEOProps): Metadata {
  const pageDescription = description || getSiteDescription(locale);

  return {
    title,
    description: pageDescription,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: pageDescription,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: getOpenGraphLocale(locale),
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: pageDescription,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  };
}
