import { slug } from 'github-slugger';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import ListLayout from '@/layouts/ListLayoutWithTags';
import { allBlogs } from 'contentlayer/generated';
import tagData from 'app/tag-data.json';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () => {
  const data = tagData as Record<Locale, Record<string, number>>;
  return Object.keys(data).flatMap((locale) =>
    Object.keys(data[locale]).flatMap((tag) => {
      const postCount = data[locale][tag];
      const totalPages = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
      return Array.from({ length: totalPages }, (_, i) => ({
        locale,
        tag: encodeURI(tag),
        page: (i + 1).toString(),
      }));
    })
  );
};

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string; page: string; locale: Locale }>;
}) {
  const { tag: _tag, page, locale = DEFAULT_LOCALE } = await params;
  const tag = decodeURI(_tag);
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);
  const pageNumber = parseInt(page);
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

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound();
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
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
