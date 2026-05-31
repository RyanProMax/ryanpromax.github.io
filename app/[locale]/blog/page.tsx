import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import { allBlogs } from 'contentlayer/generated';
import { genPageMetadata } from 'app/[locale]/seo';
import ListLayout from '@/layouts/ListLayoutWithTags';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { Metadata } from 'next';

const POSTS_PER_PAGE = 5;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale = DEFAULT_LOCALE } = await params;
  return genPageMetadata({ title: locale === Locale.ZH ? '全部文章' : 'Blog', locale });
}

export default async function BlogPage({ params }) {
  const { locale = DEFAULT_LOCALE } = await params;
  // filter specified language posts
  const posts = allCoreContent(sortPosts(allBlogs)).filter(
    (p) => (p.language || DEFAULT_LOCALE) === locale
  );
  const pageNumber = 1;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber);
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={locale === Locale.ZH ? '全部文章' : 'All Posts'}
      locale={locale}
    />
  );
}
