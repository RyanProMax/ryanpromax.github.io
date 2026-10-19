'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { slug } from 'github-slugger';
import { formatDate } from 'pliny/utils/formatDate';
import { CoreContent } from 'pliny/utils/contentlayer';
import type { Blog } from 'contentlayer/generated';
import Link from '@/components/Link';
import SlidingNav from '@/components/SlidingNav';
import Tag from '@/components/Tag';
import tagData from 'app/tag-data.json';
import { Locale } from '@/locales/config';
import { getDateLocale } from '@/locales/utils';

interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: { totalPages: number; currentPage: number };
  locale: Locale;
}

function PostList({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  locale,
  selectedTag = '',
}: ListLayoutProps & { selectedTag?: string }) {
  const pathname = usePathname();
  const tagCounts = (tagData as Record<Locale, Record<string, number>>)[locale] || {};
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  const activeTag = selectedTag && sortedTags.includes(selectedTag) ? selectedTag : '';
  const displayPosts = activeTag
    ? posts.filter((post) => post.tags?.some((tag) => slug(tag) === activeTag))
    : initialDisplayPosts.length > 0
      ? initialDisplayPosts
      : posts;
  const isChinese = locale === Locale.ZH;
  const basePath = pathname.replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '');
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  return (
    <div className="journal-page">
      <header className="editorial-page-heading">
        <h1>{title}</h1>
        <p className="journal-description">
          {isChinese
            ? '关于桌面端工程、游戏直播与 AI4SE 的实践记录。'
            : 'Field notes on desktop engineering, game live streaming, and AI4SE.'}
        </p>
      </header>
      <div className="journal-grid">
        <aside className="journal-topics" aria-label={isChinese ? '按标签浏览' : 'Browse by topic'}>
          <p className="editorial-eyebrow">{isChinese ? '主题' : 'Topics'}</p>
          <SlidingNav aria-label={isChinese ? '文章主题' : 'Post topics'}>
            <Link
              href={`/${locale}/blog`}
              aria-current={!activeTag ? 'page' : undefined}
              scroll={false}
            >
              {isChinese ? '全部文章' : 'All posts'}
            </Link>
            {sortedTags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                scroll={false}
                aria-current={activeTag === tag ? 'page' : undefined}
              >
                {tag}
                <span>{tagCounts[tag]}</span>
              </Link>
            ))}
          </SlidingNav>
        </aside>
        <div className="journal-list">
          {activeTag && (
            <p className="journal-filter-status" role="status">
              {activeTag} · {displayPosts.length} {isChinese ? '篇文章' : 'posts'}
              <Link href={`/${locale}/blog`} scroll={false}>
                {isChinese ? '清除筛选' : 'Clear filter'} ×
              </Link>
            </p>
          )}
          <ul>
            {displayPosts.map(({ path, date, title: postTitle, summary, tags }) => (
              <li key={path}>
                <article className="journal-entry">
                  <time dateTime={date}>{formatDate(date, getDateLocale(locale))}</time>
                  <h2>
                    <Link href={`/${path}`}>{postTitle}</Link>
                  </h2>
                  <p>{summary}</p>
                  <div className="entry-tags">
                    {tags?.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ul>
          {!activeTag && totalPages > 1 && (
            <nav className="journal-pagination" aria-label={isChinese ? '文章分页' : 'Pagination'}>
              {currentPage > 1 ? (
                <Link
                  href={currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`}
                  rel="prev"
                >
                  ← {isChinese ? '上一页' : 'Previous'}
                </Link>
              ) : (
                <span />
              )}
              <span>
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link href={`${basePath}/page/${currentPage + 1}`} rel="next">
                  {isChinese ? '下一页' : 'Next'} →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function FilteredPostList(props: ListLayoutProps) {
  const searchParams = useSearchParams();
  return <PostList {...props} selectedTag={searchParams.get('tag') || ''} />;
}

export default function ListLayoutWithTags(props: ListLayoutProps) {
  return (
    <Suspense fallback={<PostList {...props} />}>
      <FilteredPostList {...props} />
    </Suspense>
  );
}
