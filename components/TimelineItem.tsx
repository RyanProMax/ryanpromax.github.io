import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';

import Link from '@/components/Link';
import Image from '@/components/Image';

import type { Experience } from './Experience';

export const TimelineItem = ({ exp, last }: { exp: Experience; last?: boolean }) => {
  const { org, url, logo, start, end, title, details: Details } = exp;

  const MainContent = (
    <div className="flex flex-col">
      <div className="line-clamp-1 text-xs text-gray-500 tabular-nums dark:text-gray-400">
        <span>{start}</span> – <span>{end}</span>
      </div>
      <Link
        href={url}
        className="line-clamp-1 w-fit font-semibold text-gray-900 no-underline hover:text-gray-900 dark:text-white dark:hover:text-white"
      >
        {org}
      </Link>
      <div className="flex items-center gap-1 pt-1 text-sm text-gray-700 dark:text-gray-200">
        <span>{title}</span>
      </div>
    </div>
  );

  return (
    <div
      className={clsx(
        'group/timeline-item',
        'relative -mx-3 flex flex-row items-start gap-3 rounded-lg p-3',
        Details && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800',
        !last && [
          'before:-z-1',
          'before:absolute before:top-10 before:left-[35px]',
          'before:h-full before:w-px',
          'before:bg-gray-300 dark:before:bg-gray-500',
        ]
      )}
    >
      <Image
        src={logo}
        alt={org}
        className="!m-0 h-12 w-12 shrink-0 rounded-md bg-white object-contain dark:bg-gray-950"
        width={200}
        height={200}
      />
      {Details ? (
        <details className={clsx(['group relative w-full !bg-inherit'])}>
          <summary className="pr-10 marker:content-none">
            <div
              className={clsx([
                'absolute top-1 right-1',
                'transition-transform duration-300 ease-in-out',
                'text-gray-600 dark:text-gray-500',
              ])}
            >
              <Plus size={18} className={clsx(['group-open:hidden'])} />
              <Minus size={18} className={clsx(['hidden', 'group-open:block'])} />
            </div>
            {MainContent}
          </summary>
          <div className="pt-1 text-base">
            <Details />
          </div>
        </details>
      ) : (
        MainContent
      )}
    </div>
  );
};
