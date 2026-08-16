'use client';

import Lenis from 'lenis';
import NextImage from 'next/image';
import { Asterisk, X } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Experience } from '@/components/Experience';
import { Locale } from '@/locales/config';

import styles from './EditorialResume.module.css';

interface Profile {
  name: string;
  occupation?: string;
}

export interface ResumeLocalization {
  experiences: Experience[];
  profile: Profile;
}

interface Props {
  assetPrefix: string;
  initialLocale: Locale;
  localizations: Record<Locale, ResumeLocalization>;
}

interface WorkTheme {
  accent: string;
  poster: string;
}

interface Work {
  details: string[];
  index: string;
  logo: string;
  period: string;
  role: string;
  theme: WorkTheme;
  title: string;
  url: string;
}

const WORK_THEMES: WorkTheme[] = [
  { accent: '#183f4d', poster: '#dce9e8' },
  { accent: '#674816', poster: '#eee3cb' },
  { accent: '#781d27', poster: '#f0dcd8' },
  { accent: '#174331', poster: '#dce8d8' },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const snapMaskInset = (value: number) => {
  if (value < 0.5) return 0;
  if (value > 99.5) return 100;
  return value;
};
const removeLeadingEmoji = (value: string) => value.replace(/^[^\p{L}\p{N}]+/u, '');
const scrollEasing = (value: number) => (value === 1 ? 1 : 1 - Math.pow(2, -10 * value));

export default function EditorialResume({ assetPrefix, initialLocale, localizations }: Props) {
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const [activeWork, setActiveWork] = useState(-1);
  const [landingInteractive, setLandingInteractive] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hoverColor, setHoverColor] = useState('#0b0b0b');
  const [settledLogos, setSettledLogos] = useState<Set<string>>(() => new Set());
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const workRefs = useRef<Array<HTMLElement | null>>([]);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const clipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const posterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const activeWorkRef = useRef(-1);
  const landingInteractiveRef = useRef(true);

  const { experiences, profile } = localizations[activeLocale];
  const isChinese = activeLocale === Locale.ZH;
  const otherLocale = isChinese ? Locale.EN : Locale.ZH;

  const works = useMemo<Work[]>(
    () =>
      experiences.map((experience, index) => ({
        index: `0${index + 1}`,
        title: experience.org,
        role: removeLeadingEmoji(experience.title),
        period: `${experience.start} — ${experience.end}`,
        details: experience.highlights ?? [],
        logo: `${assetPrefix}${experience.logo}`,
        theme: WORK_THEMES[index],
        url: experience.url,
      })),
    [assetPrefix, experiences]
  );

  const pageReady = works.every((work) => settledLogos.has(work.logo));
  const settledLogoCount = works.filter((work) => settledLogos.has(work.logo)).length;
  const loadingTarget = pageReady
    ? 100
    : Math.min(92, Math.round((settledLogoCount / works.length) * 92));
  const interfaceReady = pageReady && loadingProgress === 100;

  const markLogoSettled = useCallback((logo: string) => {
    setSettledLogos((current) => {
      if (current.has(logo)) return current;
      const next = new Set(current);
      next.add(logo);
      return next;
    });
  }, []);

  useEffect(() => {
    if (loadingProgress >= loadingTarget) return;

    const interval = window.setInterval(() => {
      setLoadingProgress((current) => {
        if (current >= loadingTarget) return current;
        const step = Math.max(1, Math.ceil((loadingTarget - current) * 0.08));
        return Math.min(loadingTarget, current + step);
      });
    }, 24);

    return () => window.clearInterval(interval);
  }, [loadingProgress, loadingTarget]);

  const updateScrollEffects = useCallback(() => {
    frameRef.current = null;
    const root = rootRef.current;
    if (!root) return;

    const viewportHeight = root.clientHeight;
    const scrollTop = root.scrollTop;
    const maxScroll = Math.max(0, root.scrollHeight - viewportHeight);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const topLandingVisibility = 1 - clamp(scrollTop / (viewportHeight * 0.82));
    const bottomLandingVisibility = clamp(
      (scrollTop - (maxScroll - viewportHeight * 0.9)) / (viewportHeight * 0.75)
    );
    const landingVisibility = Math.max(topLandingVisibility, bottomLandingVisibility);
    const nextLandingInteractive = landingVisibility > 0.6;

    if (introRef.current) {
      const introScale = reducedMotion ? 1 : 0.8 + landingVisibility * 0.2;
      introRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${introScale})`;
      introRef.current.style.opacity = `${landingVisibility}`;
    }

    if (nextLandingInteractive !== landingInteractiveRef.current) {
      landingInteractiveRef.current = nextLandingInteractive;
      setLandingInteractive(nextLandingInteractive);
    }

    if (promptRef.current) {
      const promptProgress = clamp((scrollTop - viewportHeight * 0.55) / (viewportHeight * 0.3));
      promptRef.current.style.opacity = `${1 - promptProgress}`;
    }

    let nextActiveWork = -1;
    workRefs.current.forEach((work, index) => {
      if (!work) return;
      const rect = work.getBoundingClientRect();
      if (rect.top <= viewportHeight * 0.52 && rect.bottom > viewportHeight * 0.52) {
        nextActiveWork = index;
      }
    });

    trackRefs.current.forEach((track, index) => {
      const clip = clipRefs.current[index];
      const poster = posterRefs.current[index];
      if (!track || !clip || !poster) return;

      const rect = track.getBoundingClientRect();
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
      const topInset = snapMaskInset(Math.max(0, (0.5 - progress) * 2) * 100);
      const bottomInset = snapMaskInset(Math.max(0, (progress - 0.5) * 2) * 100);
      const scale = reducedMotion ? 1 : 1 + progress * 0.2;

      clip.style.clipPath = `inset(${topInset}% 0 ${bottomInset}% 0)`;
      poster.style.transform = `scale(${scale})`;
    });

    if (nextActiveWork !== activeWorkRef.current) {
      activeWorkRef.current = nextActiveWork;
      setActiveWork(nextActiveWork);
    }
  }, []);

  const scheduleScrollUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(updateScrollEffects);
  }, [updateScrollEffects]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.scrollTop = 0;
    updateScrollEffects();
    root.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollUpdate);
    return () => {
      root.removeEventListener('scroll', scheduleScrollUpdate);
      window.removeEventListener('resize', scheduleScrollUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [scheduleScrollUpdate, updateScrollEffects]);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content || !interfaceReady) return;

    const lenis = new Lenis({
      wrapper: root,
      content,
      eventsTarget: root,
      autoRaf: true,
      duration: window.matchMedia('(max-width: 900px)').matches ? 3 : 5,
      easing: scrollEasing,
      gestureOrientation: 'vertical',
      orientation: 'vertical',
      overscroll: false,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;
    lenis.resize();

    return () => {
      lenis.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
    };
  }, [interfaceReady]);

  useEffect(() => {
    scheduleScrollUpdate();
  }, [activeLocale, scheduleScrollUpdate]);

  useEffect(() => {
    const handlePopState = () => {
      const matchedLocale = window.location.pathname.match(/\/(en|zh)\/about\/?$/)?.[1] as
        Locale | undefined;
      if (matchedLocale && localizations[matchedLocale]) setActiveLocale(matchedLocale);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [localizations]);

  useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  const rootStyle = { '--resume-background': hoverColor } as CSSProperties;
  const activeWorkItem = activeWork >= 0 ? works[activeWork] : undefined;
  const counter = activeWorkItem?.index ?? '00';
  const total = String(works.length).padStart(2, '0');
  const homeUrl = `${assetPrefix}/${activeLocale}`;

  const switchLanguage = useCallback(() => {
    setActiveLocale(otherLocale);
    window.history.pushState(window.history.state, '', `${assetPrefix}/${otherLocale}/about`);
  }, [assetPrefix, otherLocale]);

  const scrollToExperience = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const target = root.clientHeight * 1.2;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.8, easing: scrollEasing });
      return;
    }
    root.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.8, easing: scrollEasing });
      return;
    }
    rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToWork = useCallback((index: number) => {
    const root = rootRef.current;
    const work = workRefs.current[index];
    if (!root || !work) return;

    const target =
      root.scrollTop + work.getBoundingClientRect().top - root.getBoundingClientRect().top;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.8, easing: scrollEasing });
      return;
    }
    root.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  return (
    <main
      ref={rootRef}
      className={styles.resume}
      style={rootStyle}
      data-ready={interfaceReady ? 'true' : 'false'}
      data-section={activeWork + 1}
      aria-busy={!interfaceReady}
    >
      <div className={styles.background} aria-hidden="true" />

      <header className={`${styles.header} ${interfaceReady ? styles.ready : ''}`}>
        <a className={styles.identity} href={homeUrl}>
          <span>RYAN</span>
          <Asterisk aria-hidden="true" size={14} strokeWidth={1.5} />
        </a>
        <div className={styles.headerActions}>
          <span aria-hidden="true">
            {counter} / {total}
          </span>
          <button type="button" onClick={switchLanguage}>
            {otherLocale.toUpperCase()}
          </button>
          <a href={homeUrl}>
            <span>{isChinese ? '退出' : 'CLOSE'}</span>
            <X aria-hidden="true" size={14} strokeWidth={1.5} />
          </a>
        </div>
      </header>

      <nav
        className={`${styles.timeline} ${activeWork >= 0 ? styles.timelineVisible : ''}`}
        aria-label={isChinese ? '经历时间线' : 'Experience timeline'}
      >
        {works.map((work, index) => (
          <button
            key={work.index}
            type="button"
            className={activeWork === index ? styles.timelineActive : ''}
            onClick={() => scrollToWork(index)}
            aria-current={activeWork === index ? 'step' : undefined}
            aria-label={`${work.period} · ${work.title}`}
          >
            <span className={styles.timelineDot} aria-hidden="true" />
            <span className={styles.timelinePeriod}>{work.period}</span>
          </button>
        ))}
      </nav>

      <div ref={contentRef} className={`${styles.content} ${interfaceReady ? styles.ready : ''}`}>
        <div
          ref={introRef}
          className={`${styles.introPanel} ${landingInteractive ? styles.landingInteractive : ''}`}
          aria-hidden={!landingInteractive}
          inert={!landingInteractive ? true : undefined}
        >
          <div className={styles.introRow}>
            <h1>{profile.name.toUpperCase()}</h1>
            <Asterisk aria-hidden="true" size={17} strokeWidth={1.35} />
          </div>
          <p>{(profile.occupation ?? '').toUpperCase()}</p>
          <div className={styles.introRow}>
            <span>2016</span>
            <span>—</span>
            <span>{isChinese ? '至今' : 'PRESENT'}</span>
          </div>
          <div className={`${styles.introRow} ${styles.introLinks}`}>
            <span>{isChinese ? '职业轨迹' : 'CAREER TIMELINE'}</span>
            <button type="button" onClick={scrollToExperience}>
              {isChinese ? '完整履历' : 'FULL PROFILE'}
            </button>
          </div>
        </div>

        <figure className={styles.introTrack}>
          <p ref={promptRef} className={styles.scrollPrompt}>
            {isChinese ? '向下滚动探索' : 'SCROLL TO EXPLORE'}
          </p>
        </figure>

        <div className={styles.works}>
          {works.map((work, index) => {
            const posterStyle = {
              '--poster-background': work.theme.poster,
              '--poster-accent': work.theme.accent,
            } as CSSProperties;

            return (
              <section
                key={work.index}
                ref={(node) => {
                  workRefs.current[index] = node;
                }}
                className={styles.work}
              >
                <div className={styles.titleStage}>
                  <div className={styles.titleIndex}>{work.index}</div>
                  <h2 className={styles.workTitle}>
                    <a href={work.url} target="_blank" rel="noopener noreferrer">
                      {work.title}
                    </a>
                  </h2>
                  <div className={styles.srOnly}>
                    <p>{work.period}</p>
                    <p>{work.role}</p>
                    {work.details.map((detail) => (
                      <p key={detail}>{detail}</p>
                    ))}
                  </div>
                </div>

                <div
                  ref={(node) => {
                    trackRefs.current[index] = node;
                  }}
                  className={styles.imageTrack}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setHoverColor(work.theme.accent);
                  }}
                  onPointerLeave={() => setHoverColor('#0b0b0b')}
                >
                  <span
                    className={`${styles.imageHitArea} ${work.details.length <= 1 ? styles.compactVisual : ''}`}
                    aria-hidden="true"
                  />
                </div>

                <figure className={styles.fixedVisual} aria-hidden="true">
                  <div
                    ref={(node) => {
                      clipRefs.current[index] = node;
                    }}
                    className={`${styles.imageClip} ${work.details.length <= 1 ? styles.compactVisual : ''}`}
                  >
                    <div
                      ref={(node) => {
                        posterRefs.current[index] = node;
                      }}
                      className={styles.poster}
                      style={posterStyle}
                    >
                      <div className={styles.posterComposition}>
                        <div className={styles.posterBrand}>
                          <NextImage
                            ref={(node) => {
                              if (node?.complete) markLogoSettled(work.logo);
                            }}
                            src={work.logo}
                            alt=""
                            width={720}
                            height={720}
                            loading="eager"
                            unoptimized
                            className={styles.logo}
                            onLoad={() => markLogoSettled(work.logo)}
                            onError={() => markLogoSettled(work.logo)}
                          />
                          <span className={styles.posterPeriod}>{work.period}</span>
                        </div>
                        <div className={styles.posterExperience}>
                          <p
                            className={`${styles.posterRole} ${index === 0 ? styles.posterRoleCompact : ''}`}
                          >
                            {work.role}
                          </p>
                          {work.details.length > 0 && (
                            <ul className={styles.posterDetails}>
                              {work.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </figure>
              </section>
            );
          })}
        </div>

        <figure className={styles.outroTrack}>
          <button type="button" className={styles.scrollUp} onClick={scrollToTop}>
            {isChinese ? '返回顶部' : 'SCROLL UP'}
          </button>
        </figure>
      </div>

      <div className={`${styles.loader} ${interfaceReady ? styles.loaderHidden : ''}`}>
        <span>{String(loadingProgress).padStart(2, '0')}%</span>
      </div>
    </main>
  );
}
