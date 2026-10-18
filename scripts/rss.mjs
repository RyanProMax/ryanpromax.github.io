import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { escape } from 'pliny/utils/htmlEscaper.js';
import siteMetadata from '../data/siteMetadata.js';
import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { sortPosts } from 'pliny/utils/contentlayer.js';

const Locale = {
  EN: 'en',
  ZH: 'zh',
};

const DEFAULT_LOCALE = Locale.EN;

const outputFolder = process.env.EXPORT ? 'out' : 'public';

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.language || DEFAULT_LOCALE}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.language || DEFAULT_LOCALE}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`;

const generateRss = (config, posts, language = DEFAULT_LOCALE, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/${language}/blog</link>
      <description>${escape(config.descriptions?.[language] || config.description)}</description>
      <language>${language === Locale.ZH ? 'zh-CN' : 'en-US'}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${language}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`;

async function generateRSS(config, allBlogs, language = DEFAULT_LOCALE, page = 'feed.xml') {
  const publishPosts = allBlogs.filter(
    (post) => post.draft !== true && (post.language || DEFAULT_LOCALE) === language
  );
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts), language);
    const rssPath = `./${outputFolder}/${language}`;
    mkdirSync(rssPath, { recursive: true });
    writeFileSync(path.join(rssPath, page), rss);
  }
}

const rss = () => {
  Object.values(Locale).forEach((locale) => generateRSS(siteMetadata, allBlogs, locale));
  console.log('RSS feed generated...');
};

export default rss;
