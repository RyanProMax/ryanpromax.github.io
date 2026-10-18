'use client';

import { usePathname } from 'next/navigation';
import { slug } from 'github-slugger';
import { formatDate } from 'pliny/utils/formatDate';
import { CoreContent } from 'pliny/utils/contentlayer';
import type { Blog } from 'contentlayer/generated';
import Link from '@/components/Link';
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

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  locale,
}: ListLayoutProps) {
  const pathname = usePathname();
  const tagCounts = (tagData as Record<Locale, Record<string, number>>)[locale] || {};
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;
  const isChinese = locale === Locale.ZH;
  const basePath = pathname.replace(/\/page\/\d+\/?$/, '').replace(/\/$/, '');
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  return (
    <div className="journal-page">
      <header className="editorial-page-heading">
        <p className="editorial-eyebrow">
          {isChinese ? '笔记与思考' : 'Notes & ideas'} / {String(posts.length).padStart(2, '0')}
        </p>
        <h1>{title}</h1>
        <p>
          {isChinese
            ? '关于桌面端工程、游戏直播与 AI4SE 的实践记录。'
            : 'Field notes on desktop engineering, game live streaming, and AI4SE.'}
        </p>
      </header>
      <div className="journal-grid">
        <aside className="journal-topics" aria-label={isChinese ? '按标签浏览' : 'Browse by topic'}>
          <p className="editorial-eyebrow">{isChinese ? '主题' : 'Topics'}</p>
          <nav>
            <Link
              href={`/${locale}/blog`}
              aria-current={pathname.includes('/blog') ? 'page' : undefined}
            >
              {isChinese ? '全部文章' : 'All posts'}
            </Link>
            {sortedTags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/tags/${slug(tag)}`}
                aria-current={
                  decodeURI(pathname).includes(`/tags/${slug(tag)}`) ? 'page' : undefined
                }
              >
                {tag}
                <span>{tagCounts[tag]}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <div className="journal-list">
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
          {totalPages > 1 && (
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
