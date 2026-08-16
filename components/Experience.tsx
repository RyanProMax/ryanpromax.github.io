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
      title: 'Engineering Lead, Game Experiences & AI-assisted Development',
      highlights: [
        'Led the design and iteration of bullet-screen gameplay, dual-screen streaming, and cross-device game interactions.',
        'Built stability metrics for PC game capture and mobile screen casting to make quality visible and actionable.',
        'Improved repository context, collaboration conventions, validation loops, and task orchestration for more reliable AI-assisted development.',
      ],
    },
    {
      org: 'GainerTech Co., Ltd.',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.avif',
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
      logo: '/static/images/timeline/SYSU.avif',
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
      title: '抖音直播伴侣 — 游戏体验与 AI 辅助研发负责人',
      highlights: [
        '主导弹幕玩法、双屏直播、游戏连屏等核心能力的设计与迭代，持续改善直播互动体验。',
        '建立 PC 游戏采集与手机投屏的稳定性指标体系，让质量问题可观察、可定位。',
        '推进主仓库的上下文组织、协作规范、验证闭环与任务编排建设，提高 AI 辅助研发的稳定性与可重复性。',
      ],
    },
    {
      org: '深圳汇锦',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.avif',
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
      logo: '/static/images/timeline/SYSU.avif',
      start: '2012/09',
      end: '2016/06',
      title: '🧑‍🎓本科 | 微电子学',
      highlights: ['就读微电子学专业，获工学学士学位。'],
    },
  ],
};
