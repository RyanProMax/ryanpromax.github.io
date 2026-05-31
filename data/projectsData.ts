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
      role: 'Head of Game & AI Coding directions',
      focus: 'Game live streaming, interaction experience, desktop engineering',
      impact:
        'Responsible for core game-streaming capabilities and main-repository AI Friendly & Harness engineering.',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `An Electron-React boilerplate with TypeScript & Rspack, supporting persistent storage, 
      local logging, incremental updates, and more.`,
      role: 'Creator',
      focus: 'Electron, React, TypeScript, Rspack',
      impact:
        'A reusable desktop application starter that packages common engineering capabilities for faster product iteration.',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
    {
      title: 'AI Friendly & Harness Engineering',
      description: `A main-repository engineering practice for AI-assisted development, covering context organization, agent collaboration conventions, validation loops, and task orchestration.`,
      role: 'Direction owner',
      focus: 'AI4SE, agent workflow, validation loops',
      impact:
        'Improves the stability, recoverability, and repeatability of AI-assisted development in a large front-end repository.',
      href: '/en/blog/ai-coding-practice',
    },
  ],
  [Locale.ZH]: [
    {
      title: '抖音直播伴侣',
      description: `支持娱乐、游戏、电商等多种直播类型，提供一键开播、实时音视频处理、美颜滤镜和评论管理等功能，助力主播高效打造高质量直播内容。`,
      role: '游戏方向 / AI Coding 方向负责人',
      focus: '游戏直播、互动体验、桌面端工程',
      impact: '负责游戏直播核心能力建设，并推进主仓库 AI Friendly & Harness 工程实践。',
      imgSrc: '/static/images/webcast-mate.png',
      href: 'https://streamingtool.douyin.com/',
    },
    {
      title: 'Electron React Rspack',
      description: `基于 TypeScript 和 Rspack 的 Electron-React 脚手架模板，支持持久化存储、本地日志记录、增量更新等功能，适用于构建跨平台桌面应用。`,
      role: '创建者',
      focus: 'Electron、React、TypeScript、Rspack',
      impact: '沉淀桌面应用常见工程能力，降低跨平台产品从 0 到 1 的启动成本。',
      imgSrc: '/static/images/electron-react-rspack.png',
      href: 'https://github.com/RyanProMax/electron-react-rspack',
    },
    {
      title: 'AI Friendly & Harness 工程',
      description: `面向 AI 辅助研发的主仓库工程实践，覆盖上下文组织、Agent 协作规范、验证闭环和任务编排。`,
      role: '方向负责人',
      focus: 'AI4SE、Agent 工作流、验证闭环',
      impact: '提升大型前端仓库中 AI 辅助研发的稳定性、可恢复性与可重复执行能力。',
      href: '/zh/blog/ai-coding-practice',
    },
  ],
};

export default projectsData;

export const Description = {
  [Locale.EN]: `Selected projects and engineering practices that represent my work.`,
  [Locale.ZH]: `一些能代表我工作方向的产品、项目与工程实践。`,
};
