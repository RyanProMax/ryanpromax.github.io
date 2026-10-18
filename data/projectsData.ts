import { Locale } from '@/locales/config';

interface Project {
  title: string;
  description: string;
  role?: string;
  focus?: string;
  impact?: string;
  href?: string;
  imgSrc?: string;
}

const projectsData: Record<Locale, Project[]> = {
  [Locale.EN]: [
    {
      title: 'Douyin Live Studio',
      description: 'A desktop app for game and entertainment live streaming on Douyin.',
      role: 'Owner of Game & AI Coding directions',
      focus: 'Game live streaming, interaction experience, desktop engineering',
      impact:
        'Responsible for core game-streaming capabilities and main-repository AI Friendly & E2E engineering.',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description:
        'An Electron starter with React, TypeScript and Rspack, including local storage, logging and automatic updates.',
      role: 'Owner',
      focus: 'Electron, React, TypeScript, Rspack',
      impact: 'Includes application packaging, light and dark themes, and automated releases.',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
  [Locale.ZH]: [
    {
      title: '抖音直播伴侣',
      description: '面向抖音主播的桌面直播工具，支持游戏与娱乐直播。',
      role: '游戏方向 / AI Coding 方向负责人',
      focus: '游戏直播、互动体验、桌面端工程',
      impact: '负责游戏直播核心能力建设，并推进主仓库 AI Friendly & E2E 工程实践。',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description:
        '基于 React、TypeScript 和 Rspack 的 Electron 应用模板，集成本地存储、日志与自动更新。',
      role: 'Owner',
      focus: 'Electron、React、TypeScript、Rspack',
      impact: '提供应用打包、明暗主题与自动化发布配置。',
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
