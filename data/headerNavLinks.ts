import { Locale } from '@/locales/config';

const headerNavLinks = {
  [Locale.EN]: [
    { href: '/', title: 'Home' },
    { href: '/blog', title: 'Blog' },
    { href: '/tags', title: 'Tags' },
    { href: '/projects', title: 'Projects' },
  ],
  [Locale.ZH]: [
    { href: '/', title: '首页' },
    { href: '/blog', title: '文章' },
    { href: '/tags', title: '标签' },
    { href: '/projects', title: '作品' },
  ],
};

export default headerNavLinks;

export const getNavLinkData = (locale: Locale, href: string) => {
  return headerNavLinks[locale].find((link) => link.href === href);
};
