import { Locale } from '@/locales/config';

interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
}

const projectsData: Record<Locale, Project[]> = {
  [Locale.EN]: [
    {
      title: 'Douyin Live Studio',
      description: 'A desktop app for game and entertainment live streaming on Douyin.',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description:
        'An Electron starter with React, TypeScript and Rspack, including local storage, logging and automatic updates.',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
  [Locale.ZH]: [
    {
      title: '抖音直播伴侣',
      description: '面向抖音主播的桌面直播工具，支持游戏与娱乐直播。',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description:
        '基于 React、TypeScript 和 Rspack 的 Electron 应用模板，集成本地存储、日志与自动更新。',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
};

export default projectsData;

export const Description = {
  [Locale.EN]: `Selected projects and engineering practices that represent my work.`,
  [Locale.ZH]: `一些能代表我工作方向的产品、项目与工程实践。`,
};
