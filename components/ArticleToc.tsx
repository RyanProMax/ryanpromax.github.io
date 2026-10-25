'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocHeading {
  value: string;
  url: string;
  depth: number;
}

function getHeadingId(url: string) {
  try {
    return decodeURIComponent(url.slice(1));
  } catch {
    return '';
  }
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
  const selectedAnchor = useRef<{ id: string; reached: boolean } | null>(null);

  useEffect(() => {
    const elements = headings
      .filter((heading) => heading.depth >= 2 && heading.depth <= 3)
      .map((heading) => document.getElementById(getHeadingId(heading.url)))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = elements[0]
        ? parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0
        : 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset + 1) break;
        current = element;
      }
      // The final headings may never reach the top offset on a short last section.
      if (maxScroll > 0 && window.scrollY >= maxScroll - 2) {
        current = elements[elements.length - 1];
      }
      const selected = selectedAnchor.current;
      const target = selected && elements.find((element) => element.id === selected.id);
      if (selected && target) {
        const destination = Math.min(
          maxScroll,
          Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset)
        );
        const reached = Math.abs(window.scrollY - destination) <= 2;
        if (selected.reached && !reached) {
          selectedAnchor.current = null;
        } else {
          // Keep the clicked heading selected during smooth scrolling and at a shared end position.
          selected.reached = reached;
          current = target;
        }
      }
      setActive(current?.id ?? '');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const selectHash = () => {
      const id = getHeadingId(window.location.hash);
      selectedAnchor.current = elements.some((element) => element.id === id)
        ? { id, reached: false }
        : null;
      schedule();
    };
    const interruptScroll = () => {
      if (selectedAnchor.current && !selectedAnchor.current.reached) {
        selectedAnchor.current = null;
        schedule();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Enter'].includes(
          event.key
        )
      ) {
        interruptScroll();
      }
    };
    selectHash();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', selectHash);
    window.addEventListener('wheel', interruptScroll, { passive: true });
    window.addEventListener('touchstart', interruptScroll, { passive: true });
    window.addEventListener('pointerdown', interruptScroll);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', selectHash);
      window.removeEventListener('wheel', interruptScroll);
      window.removeEventListener('touchstart', interruptScroll);
      window.removeEventListener('pointerdown', interruptScroll);
      window.removeEventListener('keydown', onKeyDown);
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
              aria-current={active === getHeadingId(heading.url) ? 'location' : undefined}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const id = getHeadingId(heading.url);
                selectedAnchor.current = { id, reached: false };
                setActive(id);
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
