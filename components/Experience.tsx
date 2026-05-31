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
      title: '🧑‍💻​Head of Game & AI Coding Directions at Douyin Live Studio',
      details: () => {
        return (
          <ul className="[&>li]:my-2 [&>li]:pl-0">
            <li>
              <strong>Lead Core Feature Development and Iteration</strong>: Responsible for the
              design and optimization of key modules such as{' '}
              <a
                href="https://developer.open-douyin.com/docs/resource/zh-CN/interaction/introduction/live-play/1"
                rel="noopener noreferrer"
                target="_blank"
              >
                Bullet‐screen Gameplay
              </a>{' '}
              ,{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/dual"
                rel="noopener noreferrer"
                target="_blank"
              >
                Bullet‐screen Gameplay
              </a>{' '}
              ,{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/72891"
                rel="noopener noreferrer"
                target="_blank"
              >
                Game-linking
              </a>{' '}
              to enhance user experience.
            </li>
            <li>
              <strong>Establish Stability Metrics Framework</strong>: Develop and refine key
              performance indicators for{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/game"
                rel="noopener noreferrer"
                target="_blank"
              >
                PC game capture
              </a>{' '}
              and{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/mirror"
                rel="noopener noreferrer"
                target="_blank"
              >
                mobile-screen casting
              </a>{' '}
              functionalities to ensure high system availability.
            </li>
            <li>
              <strong>Drive AI Friendly & Harness Engineering</strong>: Lead main-repository
              improvements around agent-ready context, collaboration conventions, validation loops,
              and task orchestration to make AI-assisted development more reliable and repeatable.
            </li>
          </ul>
        );
      },
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
      details: () => {
        return (
          <ul className="[&>li]:my-2 [&>li]:pl-0">
            <li>
              <strong>主导核心功能开发与迭代</strong>：负责{' '}
              <a
                href="https://developer.open-douyin.com/docs/resource/zh-CN/interaction/introduction/live-play/1"
                rel="noopener noreferrer"
                target="_blank"
              >
                弹幕玩法
              </a>
              、{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/dual"
                rel="noopener noreferrer"
                target="_blank"
              >
                双屏直播
              </a>{' '}
              、{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/72891"
                rel="noopener noreferrer"
                target="_blank"
              >
                游戏连屏
              </a>{' '}
              等关键模块的设计与优化，提升用户体验。
            </li>
            <li>
              <strong>稳定性指标体系构建</strong>
              ：建立并完善{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/game"
                rel="noopener noreferrer"
                target="_blank"
              >
                PC 游戏采集
              </a>{' '}
              与{' '}
              <a
                href="https://streamingtool.douyin.com/docs/guide/mirror"
                rel="noopener noreferrer"
                target="_blank"
              >
                手机投屏
              </a>{' '}
              等功能的关键性能指标，确保系统高可用性。
            </li>
            <li>
              <strong>AI Friendly & Harness 工程建设</strong>
              ：负责主仓库面向 AI 协作的上下文组织、协作规范、验证闭环与任务编排能力建设，提升 AI
              辅助研发的稳定性、可恢复性与可重复执行能力。
            </li>
          </ul>
        );
      },
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
