import Link from '@/components/Link';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { Locale } from '@/locales/config';
import { formatDate } from 'pliny/utils/formatDate';
// import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5;

const HOME_COPY = {
  [Locale.EN]: {
    topics: ['Frontend Engineering', 'Desktop Apps', 'AI Coding'],
    description: 'Notes on Electron, game live-streaming, AI Coding, and AI4SE practice.',
    primaryAction: 'View projects',
    secondaryAction: 'About me',
    latestTitle: 'Latest Writing',
    readMore: 'Read more',
    allPosts: 'All posts',
  },
  [Locale.ZH]: {
    topics: ['前端工程', '桌面应用', 'AI Coding'],
    description: '记录 Electron、游戏直播、AI Coding 与 AI4SE 方向的实践和思考。',
    primaryAction: '查看作品',
    secondaryAction: '关于我',
    latestTitle: '最新文章',
    readMore: '阅读全文',
    allPosts: '全部文章',
  },
};

export default function Home({ posts, locale }) {
  const copy = HOME_COPY[locale] || HOME_COPY[Locale.EN];
  const localizedPath = (path) => `/${locale}${path}`;

  return (
    <>
      <div className="space-y-14">
        <section className="pt-6 pb-2">
          <div className="max-w-3xl">
            <h1 className="sr-only">{siteMetadata.headerTitle}</h1>
            <div className="flex flex-wrap gap-2">
              {copy.topics.map((item) => (
                <span
                  key={item}
                  className="text-primary-600 dark:text-primary-400 rounded-md border border-gray-200 px-3 py-1 text-sm leading-6 font-semibold dark:border-gray-800"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              {copy.description}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={localizedPath('/projects')}
              className="bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 rounded-md px-4 py-2 text-sm font-semibold text-white transition"
            >
              {copy.primaryAction}
            </Link>
            <Link
              href={localizedPath('/about')}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-gray-500 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-500"
            >
              {copy.secondaryAction}
            </Link>
          </div>
        </section>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-2 pb-8 md:space-y-5">
            <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 dark:text-gray-100">
              {copy.latestTitle}
            </h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { path, date, title, summary, tags } = post;
              return (
                <li key={path} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                                {title}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/${path}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`${copy.readMore}: "${title}"`}
                          >
                            {copy.readMore} &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href={localizedPath('/blog')}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            {copy.allPosts} &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  );
}
