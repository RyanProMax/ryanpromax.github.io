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
    <div>
      <header className="editorial-page-heading">
        <p className="editorial-eyebrow">{locale === Locale.ZH ? '精选作品' : 'Selected work'}</p>
        <h1>{title}</h1>
        <p>{desc}</p>
      </header>
      <div className="projects-grid">
        {projectsData[locale].map((project) => (
          <Card key={project.title} {...project} labels={labels} />
        ))}
      </div>
    </div>
  );
}
