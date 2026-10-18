import { MetadataRoute } from 'next';
import { allBlogs } from 'contentlayer/generated';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, SupportedLanguages } from '@/locales/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl;
  const routes = SupportedLanguages.flatMap((locale) =>
    ['', '/blog', '/projects', '/tags'].map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
    }))
  );
  const posts = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.language || DEFAULT_LOCALE}/blog/${post.slug}`,
      lastModified: post.lastmod || post.date,
    }));
  return [{ url: siteUrl }, ...routes, ...posts];
}
