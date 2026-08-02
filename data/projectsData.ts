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
      description: `Support various live streams including
      entertainment, gaming, and e-commerce. It offers one-click streaming start, real-time audio/video 
      processing, beauty filters, and comment management, helping hosts create high-quality broadcasts effortlessly.`,
      role: 'Owner of Game & AI Coding directions',
      focus: 'Game live streaming, interaction experience, desktop engineering',
      impact:
        'Responsible for core game-streaming capabilities and main-repository AI Friendly & E2E engineering.',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `An Electron-React boilerplate with TypeScript & Rspack, supporting persistent storage, 
      local logging, incremental updates, and more.`,
      role: 'Owner',
      focus: 'Electron, React, TypeScript, Rspack',
      impact:
        'A reusable desktop application starter that packages common engineering capabilities for faster product iteration.',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
  [Locale.ZH]: [
    {
      title: '抖音直播伴侣',
      description: `支持娱乐、游戏、电商等多种直播类型，提供一键开播、实时音视频处理、美颜滤镜和评论管理等功能，助力主播高效打造高质量直播内容。`,
      role: '游戏方向 / AI Coding 方向负责人',
      focus: '游戏直播、互动体验、桌面端工程',
      impact: '负责游戏直播核心能力建设，并推进主仓库 AI Friendly & E2E 工程实践。',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `基于 TypeScript 和 Rspack 的 Electron-React 脚手架模板，支持持久化存储、本地日志记录、增量更新等功能，适用于构建跨平台桌面应用。`,
      role: 'Owner',
      focus: 'Electron、React、TypeScript、Rspack',
      impact: '沉淀桌面应用常见工程能力，降低跨平台产品从 0 到 1 的启动成本。',
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
