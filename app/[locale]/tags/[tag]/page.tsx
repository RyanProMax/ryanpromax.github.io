import { slug } from 'github-slugger';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayoutWithTags';
import { allBlogs } from 'contentlayer/generated';
import tagData from 'app/tag-data.json';
import { genPageMetadata } from 'app/[locale]/seo';
import { Metadata } from 'next';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

const POSTS_PER_PAGE = 5;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; locale: Locale }>;
}): Promise<Metadata> {
  const { tag: _tag, locale } = await params;
  const tag = decodeURI(_tag);
  return genPageMetadata({
    title: tag,
    description:
      locale === Locale.ZH
        ? `${siteMetadata.title} 中与 ${tag} 相关的文章`
        : `${siteMetadata.title} ${tag} tagged content`,
    locale,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/${locale}/tags/${tag}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const data = tagData as Record<Locale, Record<string, number>>;
  return Object.keys(data).flatMap((locale) =>
    Object.keys(data[locale]).map((tag) => ({
      locale,
      tag: encodeURI(tag),
    }))
  );
};

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string; locale: Locale }>;
}) {
  const { tag: _tag, locale = DEFAULT_LOCALE } = await params;
  const tag = decodeURI(_tag);
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.tags &&
          post.tags.map((t) => slug(t)).includes(tag) &&
          (post.language || DEFAULT_LOCALE) === locale
      )
    )
  );
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  };

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      locale={locale}
    />
  );
}
