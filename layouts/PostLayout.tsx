import { ReactNode } from 'react';
import { CoreContent } from 'pliny/utils/contentlayer';
import { formatDate } from 'pliny/utils/formatDate';
import type { Blog, Authors } from 'contentlayer/generated';
import Link from '@/components/Link';
import Comments from '@/components/Comments';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getDateLocale } from '@/locales/utils';

interface LayoutProps {
  content: CoreContent<Blog>;
  authorDetails?: CoreContent<Authors>[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
}

export default function PostLayout({
  content,
  authorDetails = [],
  next,
  prev,
  children,
}: LayoutProps) {
  const { filePath, date, title, tags, language = DEFAULT_LOCALE } = content;
  const isChinese = language === Locale.ZH;
  return (
    <article className="reading-page">
      <ScrollTopAndComment />
      <header className="reading-header">
        <Link href={`/${language}/blog`} className="editorial-back">
          ← {isChinese ? '全部文章' : 'All posts'}
        </Link>
        <div className="reading-meta">
          <time dateTime={date}>{formatDate(date, getDateLocale(language))}</time>
          <span>{isChinese ? '工程笔记' : 'Engineering notes'}</span>
        </div>
        <h1>{title}</h1>
        <div className="reading-byline">
          <div>
            {authorDetails.map((author) => (
              <span className="reading-author" key={author.name}>
                {author.avatar && <Image src={author.avatar} width={28} height={28} alt="" />}
                {author.name}
              </span>
            ))}
          </div>
          <div className="entry-tags">
            {tags?.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
      </header>
      <div className="prose prose-invert reading-content">{children}</div>
      <div className="reading-comments" id="comment">
        <Comments slug={content.slug} />
      </div>
      <footer className="reading-footer">
        <Link href={`${siteMetadata.siteRepo}/blob/main/data/${filePath}`}>
          {isChinese ? '在 GitHub 查看原文' : 'View source on GitHub'} ↗
        </Link>
        {(prev || next) && (
          <nav className="related-posts" aria-label={isChinese ? '继续阅读' : 'Continue reading'}>
            <div>
              {prev && (
                <Link href={`/${prev.path}`}>
                  <span>{isChinese ? '上一篇' : 'Previous'} ←</span>
                  {prev.title}
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link href={`/${next.path}`}>
                  <span>{isChinese ? '下一篇' : 'Next'} →</span>
                  {next.title}
                </Link>
              )}
            </div>
          </nav>
        )}
      </footer>
    </article>
  );
}
