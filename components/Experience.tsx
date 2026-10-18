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
      title: 'Front-end Engineer, Douyin Live Companion',
      highlights: [
        'Develop Electron client features for multi-screen streaming, game capture, beauty effects, and interactive gameplay.',
        'Improve performance and reliability across screen casting, capture, and native SDK integrations.',
        'Lead cloud device orchestration and Agent + MCP-driven end-to-end testing for real desktop clients.',
      ],
    },
    {
      org: 'GainerTech Co., Ltd.',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.avif',
      start: 'Jun 2020',
      end: 'Jul 2021',
      title: '🧑‍💻Front-end Group Lead',
      highlights: [
        'Developed and maintained front-end systems, with ongoing iteration and performance optimization.',
      ],
    },
    {
      org: 'China Unicom',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: 'Jul 2016',
      end: 'May 2020',
      title: '🧑‍💻Operations Engineer & Front-end Developer',
      highlights: [
        'Maintained wireless and metro network equipment before transitioning to front-end development in 2019.',
      ],
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
      title: '抖音直播伴侣 — 前端开发',
      highlights: [
        '负责 Electron 客户端的多屏直播、游戏采集、美颜特效与小玩法开发。',
        '围绕投屏、采集与原生 SDK 接入，持续优化客户端性能与稳定性。',
        '主导云端设备调度与 Agent + MCP 端到端测试，让自动化验证覆盖真实客户端。',
      ],
    },
    {
      org: '深圳汇锦',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.avif',
      start: '2020/06',
      end: '2021/07',
      title: '🧑‍💻前端组长',
      highlights: ['负责各系统的前端开发、维护迭代与性能优化。'],
    },
    {
      org: '中国联通',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: '2016/07',
      end: '2020/05',
      title: '🧑‍💻运维工程师 & 前端开发',
      highlights: ['先后从事无线网与城域网设备维护，并于 2019 年转向前端开发。'],
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
