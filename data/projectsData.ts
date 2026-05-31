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
      description: `Support various live streams including
      entertainment, gaming, and e-commerce. It offers one-click streaming start, real-time audio/video 
      processing, beauty filters, and comment management, helping hosts create high-quality broadcasts effortlessly.`,
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `An Electron-React boilerplate with TypeScript & Rspack, supporting persistent storage, 
      local logging, incremental updates, and more.`,
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
  [Locale.ZH]: [
    {
      title: '抖音直播伴侣',
      description: `支持娱乐、游戏、电商等多种直播类型，提供一键开播、实时音视频处理、美颜滤镜和评论管理等功能，助力主播高效打造高质量直播内容。`,
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `基于 TypeScript 和 Rspack 的 Electron-React 脚手架模板，支持持久化存储、本地日志记录、增量更新等功能，适用于构建跨平台桌面应用。`,
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
  ],
};

export default projectsData;

export const Description = {
  [Locale.EN]: `Here are some of things I've built.`,
  [Locale.ZH]: `这是我（参与）开发的一些作品。`,
};
