import { Locale } from '@/locales/config';

export interface Experience {
  org: string;
  url: string;
  logo: string;
  start: string;
  end: string;
  title: string;
  highlights?: string[];
}

export const EXPERIENCES: Record<Locale, Experience[]> = {
  [Locale.EN]: [
    {
      org: 'ByteDance',
      url: 'https://www.bytedance.com/',
      logo: '/static/images/timeline/bytedance.svg',
      start: 'Jul 2021',
      end: 'PRESENT',
      title: '🧑‍💻​Owner of Game & AI Coding Directions at Douyin Live Studio',
      highlights: [
        'Lead Core Feature Development and Iteration: Responsible for the design and optimization of key modules such as bullet-screen gameplay, dual-screen streaming, and game-linking to enhance user experience.',
        'Establish Stability Metrics Framework: Develop and refine key performance indicators for PC game capture and mobile-screen casting functionalities to ensure high system availability.',
        'Drive AI Friendly & Harness Engineering: Lead main-repository improvements around agent-ready context, collaboration conventions, validation loops, and task orchestration to make AI-assisted development more reliable and repeatable.',
      ],
    },
    {
      org: 'GainerTech Co., Ltd.',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.png',
      start: 'Jun 2020',
      end: 'Jul 2021',
      title: '🧑‍💻Front-end Group Lead',
      highlights: ['Led the front-end team and delivery across desktop and web projects.'],
    },
    {
      org: 'China Unicom',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: 'Jul 2016',
      end: 'May 2020',
      title: '🧑‍💻Front-end Engineer',
      highlights: ['Built operations tooling and front-end systems for China Unicom.'],
    },
    {
      org: 'Sun Yat-sen University',
      url: 'https://www.sysu.edu.cn/',
      logo: '/static/images/timeline/SYSU.png',
      start: 'Sep 2012',
      end: 'Jun 2016',
      title: '🧑‍🎓BEng | Microelectronics',
      highlights: ['Studied microelectronics and received a Bachelor of Engineering.'],
    },
  ],
  [Locale.ZH]: [
    {
      org: '字节跳动',
      url: 'https://www.bytedance.com/',
      logo: '/static/images/timeline/bytedance.svg',
      start: '2021/07',
      end: '至今',
      title: '🧑‍💻抖音直播伴侣 - 游戏方向 / AI Coding 方向负责人',
      highlights: [
        '主导核心功能开发与迭代：负责弹幕玩法、双屏直播、游戏连屏等关键模块的设计与优化，提升用户体验。',
        '稳定性指标体系构建：建立并完善 PC 游戏采集与手机投屏等功能的关键性能指标，确保系统高可用性。',
        'AI Friendly & Harness 工程建设：负责主仓库面向 AI 协作的上下文组织、协作规范、验证闭环与任务编排能力建设，提升 AI 辅助研发的稳定性、可恢复性与可重复执行能力。',
      ],
    },
    {
      org: '深圳汇锦',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.png',
      start: '2020/06',
      end: '2021/07',
      title: '🧑‍💻前端组长',
      highlights: ['负责前端团队管理，以及桌面端与 Web 项目的研发交付。'],
    },
    {
      org: '中国联通',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: '2016/07',
      end: '2020/05',
      title: '🧑‍💻运维工程师 & 前端开发',
      highlights: ['负责中国联通运维工具与前端系统建设。'],
    },
    {
      org: '中山大学',
      url: 'https://www.sysu.edu.cn/',
      logo: '/static/images/timeline/SYSU.png',
      start: '2012/09',
      end: '2016/06',
      title: '🧑‍🎓本科 | 微电子学',
      highlights: ['就读微电子学专业，获工学学士学位。'],
    },
  ],
};
