'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === 'dark';

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const nextTheme = dark ? 'light' : 'dark';
    const update = () => flushSync(() => setTheme(nextTheme));
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      update();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.detail ? event.clientX : rect.left + rect.width / 2;
    const y = event.detail ? event.clientY : rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(update);
    void transition.ready
      .then(() => {
        const clips = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
        document.documentElement.animate(
          { clipPath: nextTheme === 'dark' ? clips.reverse() : clips },
          {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards',
            pseudoElement:
              nextTheme === 'dark' ? '::view-transition-old(root)' : '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        /* A superseding navigation can cancel the visual transition. */
      });
  };

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={toggle}
      disabled={!mounted}
      aria-label={mounted && dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title="Toggle color scheme"
    >
      {mounted ? (
        dark ? (
          <Moon size={19} />
        ) : (
          <Sun size={19} />
        )
      ) : (
        <span className="theme-placeholder" />
      )}
    </button>
  );
}
