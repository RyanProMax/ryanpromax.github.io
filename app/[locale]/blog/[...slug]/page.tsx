import 'css/prism.css';
import 'katex/dist/katex.css';

import PageTitle from '@/components/PageTitle';
import { components } from '@/components/MDXComponents';
import { MDXLayoutRenderer } from 'pliny/mdx-components';
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer';
import { allBlogs, allAuthors } from 'contentlayer/generated';
import type { Authors, Blog } from 'contentlayer/generated';
import PostLayout from '@/layouts/PostLayout';
import { Metadata } from 'next';
import siteMetadata from '@/data/siteMetadata';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getOpenGraphLocale } from '@/locales/utils';

const findPost = (post: Blog, slug: string, locale: Locale) =>
  post.slug === slug && (post.language || DEFAULT_LOCALE) === locale;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { slug: _slug, locale = DEFAULT_LOCALE } = await params;
  const slug = decodeURI(_slug.join('/'));
  const post = allBlogs.find((p) => findPost(p, slug, locale));
  const authorList = post?.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find(
      (p) => p.slug.includes(author) && (p.locale || DEFAULT_LOCALE) === locale
    );
    return coreContent(authorResults as Authors);
  });
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  let imageList = [siteMetadata.socialBanner];
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    };
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: getOpenGraphLocale(locale),
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    locale: p.language || DEFAULT_LOCALE,
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }));
};

export default async function Page(props: { params: Promise<{ slug: string[]; locale: string }> }) {
  const { slug: _slug, locale = DEFAULT_LOCALE } = await props.params;
  const slug = decodeURI(_slug.join('/'));
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs)).filter(
    (p) => (p.language || DEFAULT_LOCALE) === locale
  );
  const postIndex = sortedCoreContents.findIndex((p) =>
    findPost(p as Blog, slug, locale as Locale)
  );
  if (postIndex === -1) {
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allBlogs.find((p) => findPost(p, slug, locale as Locale)) as Blog;
  const authorList = post?.authors || [locale !== DEFAULT_LOCALE ? `default.${locale}` : 'default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find(
      (p) => p.slug.includes(author) && (p.locale || DEFAULT_LOCALE) === locale
    );
    return coreContent(authorResults as Authors);
  });
  const mainContent = coreContent(post);
  const jsonLd = post.structuredData;
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout
        toc={post.toc}
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </PostLayout>
    </>
  );
}
