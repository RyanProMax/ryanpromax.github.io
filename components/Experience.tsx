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
        'Lead the Game and AI Coding directions for Douyin Live Studio.',
        'Build bullet-screen gameplay, dual-screen streaming, game-linking, PC game capture, and mobile-screen casting.',
        'Advance AI Friendly and E2E engineering across the main repository.',
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
        '负责抖音直播伴侣游戏方向与 AI Coding 方向。',
        '建设弹幕玩法、双屏直播、游戏连屏、PC 游戏采集与手机投屏等关键能力。',
        '推进主仓库 AI Friendly 与 E2E 工程建设。',
      ],
    },
    {
      org: '汇锦科技',
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
