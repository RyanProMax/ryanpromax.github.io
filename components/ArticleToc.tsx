'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocHeading {
  value: string;
  url: string;
  depth: number;
}

export default function ArticleToc({
  headings,
  chinese,
}: {
  headings: TocHeading[];
  chinese: boolean;
}) {
  const entries = headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
  const [active, setActive] = useState('');
  const mobile = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const elements = headings
      .filter((heading) => heading.depth >= 2 && heading.depth <= 3)
      .map((heading) => document.getElementById(decodeURIComponent(heading.url.slice(1))))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top > 140) break;
        current = element;
      }
      setActive(current ? `#${current.id}` : '');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [headings]);

  if (entries.length < 2) return null;
  const label = chinese ? '本文目录' : 'On this page';
  const links = (compact = false) => (
    <nav aria-label={label}>
      <ol>
        {entries.map((heading) => (
          <li key={heading.url} className={heading.depth === 3 ? 'toc-subheading' : undefined}>
            <a
              href={heading.url}
              aria-current={active === heading.url ? 'location' : undefined}
              onClick={() => {
                if (compact && mobile.current) mobile.current.open = false;
              }}
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
  return (
    <>
      <aside className="article-toc">
        <p>{label}</p>
        {links()}
      </aside>
      <details className="article-toc-mobile" ref={mobile}>
        <summary>{label}</summary>
        {links(true)}
      </details>
    </>
  );
}
