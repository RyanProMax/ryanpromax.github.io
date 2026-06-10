import { JSX } from 'react';
import { TimelineItem } from '@/components/TimelineItem';
import { Locale } from '@/locales/config';

export interface Experience {
  org: string;
  url: string;
  logo: string;
  start: string;
  end: string;
  title: string;
  details?: () => JSX.Element;
}

export const Timeline = ({ locale }: { locale: Locale }) => {
  const e = EXPERIENCES[locale];

  return (
    <ul className="m-0 list-none p-0">
      {e.map((experience, idx) => (
        <li key={experience.url} className="m-0 p-0">
          <TimelineItem exp={experience} last={idx === e.length - 1} />
        </li>
      ))}
    </ul>
  );
};

export const EXPERIENCES: Record<Locale, Experience[]> = {
  [Locale.EN]: [
    {
      org: 'ByteDance',
      url: 'https://www.bytedance.com/',
      logo: '/static/images/timeline/bytedance.svg',
      start: 'Jul 2021',
      end: 'PRESENT',
      title: '🧑‍💻​Owner of Game & AI Coding Directions at Douyin Live Studio',
    },
    {
      org: 'GainerTech Co., Ltd.',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.png',
      start: 'Jun 2020',
      end: 'Jul 2021',
      title: '🧑‍💻Front-end Group Lead',
    },
    {
      org: 'China Unicom',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: 'Jul 2016',
      end: 'May 2020',
      title: '🧑‍💻Front-end Engineer',
    },
    {
      org: 'Sun Yat-sen University',
      url: 'https://www.sysu.edu.cn/',
      logo: '/static/images/timeline/SYSU.png',
      start: 'Sep 2012',
      end: 'Jun 2016',
      title: '🧑‍🎓BEng | Microelectronics',
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
    },
    {
      org: '深圳汇锦科技股份有限公司',
      url: 'http://www.gainer-tech.com/',
      logo: '/static/images/timeline/gainer.png',
      start: '2020/06',
      end: '2021/07',
      title: '🧑‍💻前端组长',
    },
    {
      org: '中国联通',
      url: 'https://www.chinaunicom.com.cn/',
      logo: '/static/images/timeline/china-unicom.svg',
      start: '2016/07',
      end: '2020/05',
      title: '🧑‍💻运维工程师 & 前端开发',
    },
    {
      org: '中山大学',
      url: 'https://www.sysu.edu.cn/',
      logo: '/static/images/timeline/SYSU.png',
      start: '2012/09',
      end: '2016/06',
      title: '🧑‍🎓本科 | 微电子学',
    },
  ],
};
