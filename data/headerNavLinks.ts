import { Locale } from '@/locales/config';

const headerNavLinks = {
  [Locale.EN]: [
    { href: '/', title: 'Home' },
    { href: '/blog', title: 'Blog' },
    { href: '/projects', title: 'Projects' },
    { href: '/life', title: 'Life' },
    // { href: '/travel', title: 'Travel' },
  ],
  [Locale.ZH]: [
    { href: '/', title: '首页' },
    { href: '/blog', title: '文章' },
    { href: '/projects', title: '作品' },
    { href: '/life', title: '生活' },
    // { href: '/travel', title: '旅行' },
  ],
};

export default headerNavLinks;

export const getNavLinkData = (locale: Locale, href: string) => {
  return headerNavLinks[locale].find((link) => link.href === href);
};
