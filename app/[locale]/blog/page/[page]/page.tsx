import ListLayout from '@/layouts/ListLayoutWithTags';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import { allBlogs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () => {
  return Object.values(Locale).flatMap((locale) => {
    const postCount = allBlogs.filter(
      (post) => (post.language || DEFAULT_LOCALE) === locale
    ).length;
    const totalPages = Math.ceil(postCount / POSTS_PER_PAGE);

    return Array.from({ length: totalPages }, (_, i) => ({
      locale,
      page: (i + 1).toString(),
    }));
  });
};

export default async function Page({
  params,
}: {
  params: Promise<{ page: string; locale: Locale }>;
}) {
  const { page, locale = DEFAULT_LOCALE } = await params;
  const posts = allCoreContent(sortPosts(allBlogs)).filter(
    (p) => (p.language || DEFAULT_LOCALE) === locale
  );
  const pageNumber = parseInt(page as string);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
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
