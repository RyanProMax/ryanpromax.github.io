import projectsData, { Description } from '@/data/projectsData';
import Card from '@/components/Card';
import { genPageMetadata } from 'app/[locale]/seo';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';
import { getNavLinkData } from '@/data/headerNavLinks';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale = DEFAULT_LOCALE } = await params;
  return genPageMetadata({
    title: getNavLinkData(locale, '/projects')?.title || 'Projects',
    description: Description[locale],
    locale,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale = DEFAULT_LOCALE } = await params;
  const title = getNavLinkData(locale, '/projects')?.title || 'Projects';
  const desc = Description[locale];
  const labels =
    locale === Locale.ZH
      ? { role: '角色', focus: '方向', impact: '成果', learnMore: '查看详情' }
      : { role: 'Role', focus: 'Focus', impact: 'Impact', learnMore: 'Learn more' };

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData[locale].map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                role={d.role}
                focus={d.focus}
                impact={d.impact}
                imgSrc={d.imgSrc}
                href={d.href}
                labels={labels}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
