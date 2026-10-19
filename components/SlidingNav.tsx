'use client';

import { useLayoutEffect, useRef, type ComponentPropsWithoutRef } from 'react';

/** A single underline follows the selected link, including across wrapped rows. */
export default function SlidingNav({
  children,
  className = '',
  ...props
}: ComponentPropsWithoutRef<'nav'>) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    let disposed = false;
    let readyFrame = 0;
    const update = () => {
      if (disposed) return;
      const active = nav.querySelector<HTMLElement>('a[aria-current]:not([aria-current="false"])');
      if (!active || !active.getClientRects().length) {
        indicator.style.opacity = '0';
        return;
      }

      const bounds = nav.getBoundingClientRect();
      const link = active.getBoundingClientRect();
      const x = link.left - bounds.left + nav.scrollLeft - nav.clientLeft;
      const y = link.bottom - bounds.top + nav.scrollTop - nav.clientTop - 2;
      indicator.style.width = `${link.width}px`;
      indicator.style.transform = `translate(${x}px, ${y}px)`;
      indicator.style.opacity = '1';

      // Place the initial underline without animating in from the origin.
      if (!nav.hasAttribute('data-indicator-ready') && !readyFrame) {
        readyFrame = requestAnimationFrame(() => {
          nav.setAttribute('data-indicator-ready', '');
        });
      }
    };

    const resize = new ResizeObserver(update);
    const observeLinks = () => {
      resize.disconnect();
      resize.observe(nav);
      nav.querySelectorAll('a').forEach((link) => resize.observe(link));
      update();
    };
    const changes = new MutationObserver(observeLinks);
    changes.observe(nav, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-current'],
    });
    observeLinks();
    window.addEventListener('resize', update);
    document.fonts.addEventListener('loadingdone', update);
    void document.fonts.ready.then(update);

    return () => {
      disposed = true;
      cancelAnimationFrame(readyFrame);
      resize.disconnect();
      changes.disconnect();
      window.removeEventListener('resize', update);
      document.fonts.removeEventListener('loadingdone', update);
      nav.removeAttribute('data-indicator-ready');
    };
  }, []);

  return (
    <nav {...props} className={`sliding-nav ${className}`} ref={navRef}>
      {children}
      <span className="sliding-nav-indicator" aria-hidden="true" ref={indicatorRef} />
    </nav>
  );
}
