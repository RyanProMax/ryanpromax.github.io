'use client';

import NextImage from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { Experience } from '@/components/Experience';
import SocialIcon from '@/components/social-icons';
import { Locale } from '@/locales/config';

interface Profile {
  name: string;
  occupation?: string;
  company?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  bluesky?: string;
  summary?: string;
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

const HOLD_DURATION = 1.2;
const TRANSITION_DURATION = 1.2;
const STAGE_IMAGE_NAMES = [
  'h-1-main.png',
  'h-2-douyin.png',
  'h-3-gainer.png',
  'h-4-unicom.png',
  'h-5-sysu.png',
];
const HOLD_START_TIMES = STAGE_IMAGE_NAMES.map((_, index) => index * HOLD_DURATION);
const TRANSITION_OFFSET = HOLD_START_TIMES.length * HOLD_DURATION;
const EXPECTED_VIDEO_DURATION =
  TRANSITION_OFFSET + (STAGE_IMAGE_NAMES.length - 1) * 2 * TRANSITION_DURATION;
const SEEK_PADDING = 1 / 30;
const TRANSITION_SEEK_EPSILON = 1 / 240;
const WHEEL_SNAP_THRESHOLD = 72;
const WHEEL_GESTURE_IDLE_DELAY = 160;
const TOUCH_SNAP_THRESHOLD = 52;
const TIMELINE_NODE_OPACITY = [1, 0.52, 0.36, 0.26, 0.2];
const RESUME_ASSET_VERSION = '20260802-keyframe-4';
const HOME_ASSET_VERSION = '20260803-fal-all-ideas-1';

type HomeVideoSlot = 0 | 1;

const HOME_IDLE_ID = 'home-idle-loop';
const HOME_IDEA_IDS = ['home-idea-douyinlive', 'home-idea-react', 'home-idea-electron'] as const;
type HomeIdeaId = (typeof HOME_IDEA_IDS)[number];

interface VideoTransition {
  endTime: number;
  from: number;
  hasStarted: boolean;
  startTime: number;
  to: number;
}

const getTransitionStartTime = (from: number, to: number) => {
  if (to === from + 1) return TRANSITION_OFFSET + from * TRANSITION_DURATION;
  if (to === from - 1)
    return TRANSITION_OFFSET + (STAGE_IMAGE_NAMES.length - 1 + to) * TRANSITION_DURATION;
  return null;
};

const removeLeadingEmoji = (value: string) => value.replace(/^[^\p{L}\p{N}]+/u, '');

export default function ImmersiveResume({ assetPrefix, initialLocale, localizations }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const homeVideoARef = useRef<HTMLVideoElement>(null);
  const homeVideoBRef = useRef<HTMLVideoElement>(null);
  const homeActiveSlotRef = useRef<HomeVideoSlot>(0);
  const homeReadyRef = useRef<[boolean, boolean]>([false, false]);
  const homePendingSlotRef = useRef<HomeVideoSlot | null>(null);
  const homeAmbientActiveRef = useRef(true);
  const lastHomeIdeaIdRef = useRef<HomeIdeaId | null>(null);
  const visualSectionRef = useRef(0);
  const transitionRef = useRef<VideoTransition | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelGestureIdleRef = useRef(true);
  const wheelGestureLockedRef = useRef(false);
  const wheelResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const timelineViewportRef = useRef<HTMLElement>(null);
  const timelineItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeLocale, setActiveLocale] = useState(initialLocale);
  const [activeSection, setActiveSection] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoTransitioning, setVideoTransitioning] = useState(false);
  const [homeActiveSlot, setHomeActiveSlot] = useState<HomeVideoSlot>(0);
  const [homeIdeaId, setHomeIdeaId] = useState<HomeIdeaId>(HOME_IDEA_IDS[0]);
  const [homeReady, setHomeReady] = useState<[boolean, boolean]>([false, false]);
  const [timelineOffset, setTimelineOffset] = useState(0);

  const { experiences, profile } = localizations[activeLocale];
  const isChinese = activeLocale === Locale.ZH;
  const otherLocale = isChinese ? Locale.EN : Locale.ZH;
  const videoUrl = `${assetPrefix}/static/resume/video/ryan-resume-landscape.mp4?v=${RESUME_ASSET_VERSION}`;
  const posterUrl = `${assetPrefix}/static/resume/stages/video-endpoints/${STAGE_IMAGE_NAMES[0]}?v=${RESUME_ASSET_VERSION}`;
  const homeAmbientActive = activeSection === 0 && !videoTransitioning;
  const homeClipIds = [HOME_IDLE_ID, homeIdeaId] as const;
  homeAmbientActiveRef.current = homeAmbientActive;
  const sections = useMemo(
    () => [
      { id: 'profile', label: isChinese ? '关于我' : 'Profile' },
      ...experiences.map((experience, index) => ({
        id: `${experience.org}-${index}`,
        label: experience.org,
      })),
    ],
    [experiences, isChinese]
  );

  useLayoutEffect(() => {
    const viewport = timelineViewportRef.current;
    const activeItem = timelineItemRefs.current[activeSection];
    if (!viewport || !activeItem) return;
    const activeContent =
      activeItem.querySelector<HTMLElement>('.resume-panel-enter') ?? activeItem;

    let animationFrame = 0;
    const updateTimelineOffset = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const focusPosition = viewport.clientHeight / 2;
        const activeContentCenter = activeContent.offsetTop + activeContent.offsetHeight / 2;
        const desiredOffset = focusPosition - activeItem.offsetTop - activeContentCenter;
        setTimelineOffset(desiredOffset);
      });
    };

    updateTimelineOffset();
    const resizeObserver = new ResizeObserver(updateTimelineOffset);
    resizeObserver.observe(viewport);
    resizeObserver.observe(activeContent);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [activeLocale, activeSection]);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  useEffect(() => {
    const handlePopState = () => {
      const matchedLocale = window.location.pathname.match(/\/(en|zh)\/about\/?$/)?.[1] as
        | Locale
        | undefined;
      if (matchedLocale && localizations[matchedLocale]) setActiveLocale(matchedLocale);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [localizations]);

  const switchLanguage = useCallback(() => {
    setActiveLocale(otherLocale);
    window.history.pushState(window.history.state, '', `${assetPrefix}/${otherLocale}/about`);
  }, [assetPrefix, otherLocale]);

  useEffect(() => {
    setVideoReady(false);
    setVideoError(false);
    setVideoTransitioning(false);
    setLoadingProgress(0);
    videoRef.current?.load();
  }, [videoUrl]);

  const playVideo = useCallback((video: HTMLVideoElement) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, []);

  const getHomeVideo = useCallback(
    (slot: HomeVideoSlot) => (slot === 0 ? homeVideoARef.current : homeVideoBRef.current),
    []
  );

  const setHomeSlotReady = useCallback((slot: HomeVideoSlot, ready: boolean) => {
    homeReadyRef.current = homeReadyRef.current.map((current, index) =>
      index === slot ? ready : current
    ) as [boolean, boolean];
    setHomeReady(homeReadyRef.current);
  }, []);

  const pickNextHomeIdea = useCallback(() => {
    const candidates = HOME_IDEA_IDS.filter((id) => id !== lastHomeIdeaIdRef.current);
    const nextIdea = candidates[Math.floor(Math.random() * candidates.length)];
    lastHomeIdeaIdRef.current = nextIdea;
    return nextIdea;
  }, []);

  const activateHomeSlot = useCallback(
    (nextSlot: HomeVideoSlot, finishedSlot: HomeVideoSlot) => {
      const finishedVideo = getHomeVideo(finishedSlot);
      if (finishedVideo) {
        finishedVideo.pause();
        finishedVideo.currentTime = 0;
      }

      homePendingSlotRef.current = null;
      homeActiveSlotRef.current = nextSlot;
      setHomeActiveSlot(nextSlot);

      requestAnimationFrame(() => {
        const video = getHomeVideo(nextSlot);
        if (video && homeAmbientActiveRef.current) playVideo(video);
      });
    },
    [getHomeVideo, playVideo]
  );

  const handleHomeVideoLoaded = useCallback(
    (slot: HomeVideoSlot) => {
      const video = getHomeVideo(slot);
      if (!video) return;
      video.pause();
      video.currentTime = 0;
      setHomeSlotReady(slot, true);

      if (homePendingSlotRef.current === slot) {
        activateHomeSlot(slot, slot === 0 ? 1 : 0);
        return;
      }

      if (slot === homeActiveSlotRef.current && homeAmbientActiveRef.current) playVideo(video);
    },
    [activateHomeSlot, getHomeVideo, playVideo, setHomeSlotReady]
  );

  const handleHomeVideoEnded = useCallback(
    (slot: HomeVideoSlot) => {
      if (slot !== homeActiveSlotRef.current) return;
      const nextSlot: HomeVideoSlot = slot === 0 ? 1 : 0;
      if (homeReadyRef.current[nextSlot]) {
        activateHomeSlot(nextSlot, slot);
      } else {
        homePendingSlotRef.current = nextSlot;
      }

      if (slot === 1) {
        setHomeSlotReady(1, false);
        setHomeIdeaId(pickNextHomeIdea());
      }
    },
    [activateHomeSlot, pickNextHomeIdea, setHomeSlotReady]
  );

  useEffect(() => {
    const idleVideo = homeVideoARef.current;
    if (!idleVideo) return;

    if (idleVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleHomeVideoLoaded(0);
    } else {
      idleVideo.load();
    }
  }, [handleHomeVideoLoaded]);

  useEffect(() => {
    setHomeIdeaId(pickNextHomeIdea());
  }, [pickNextHomeIdea]);

  useEffect(() => {
    const ideaVideo = homeVideoBRef.current;
    if (!ideaVideo) return;
    setHomeSlotReady(1, false);
    ideaVideo.load();
  }, [homeIdeaId, setHomeSlotReady]);

  useEffect(() => {
    const activeVideo = getHomeVideo(homeActiveSlotRef.current);
    const inactiveVideo = getHomeVideo(homeActiveSlotRef.current === 0 ? 1 : 0);
    inactiveVideo?.pause();

    if (!homeAmbientActive) {
      homePendingSlotRef.current = null;
      homeActiveSlotRef.current = 0;
      setHomeActiveSlot(0);
      ([homeVideoARef.current, homeVideoBRef.current] as const).forEach((video) => {
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      });
      return;
    }

    if (activeVideo && homeReadyRef.current[homeActiveSlotRef.current]) playVideo(activeVideo);
  }, [getHomeVideo, homeAmbientActive, playVideo]);

  const seekVideoToHold = useCallback((index: number) => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    transitionRef.current = null;
    visualSectionRef.current = index;
    setVideoTransitioning(false);
    video.currentTime = HOLD_START_TIMES[index] + SEEK_PADDING;
    video.pause();
    if (wheelGestureIdleRef.current) {
      wheelAccumulatorRef.current = 0;
      wheelGestureLockedRef.current = false;
    }
  }, []);

  const startVideoTransition = useCallback(
    (from: number, to: number) => {
      const video = videoRef.current;
      if (
        !video ||
        video.readyState < HTMLMediaElement.HAVE_METADATA ||
        !Number.isFinite(video.duration) ||
        video.duration < EXPECTED_VIDEO_DURATION - SEEK_PADDING
      )
        return false;

      const startTime = getTransitionStartTime(from, to);
      if (startTime === null) return false;
      transitionRef.current = {
        endTime: startTime + TRANSITION_DURATION,
        from,
        hasStarted: false,
        startTime,
        to,
      };
      setVideoTransitioning(true);
      video.pause();
      video.addEventListener(
        'seeked',
        () => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const activeTransition = transitionRef.current;
              if (activeTransition?.from === from && activeTransition.to === to) playVideo(video);
            });
          });
        },
        { once: true }
      );
      video.currentTime = startTime + TRANSITION_SEEK_EPSILON;
      return true;
    },
    [playVideo]
  );

  const handleVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    transitionRef.current = null;
    visualSectionRef.current = activeSection;
    video.currentTime = HOLD_START_TIMES[activeSection] + SEEK_PADDING;
    video.pause();
    setVideoTransitioning(false);
    setLoadingProgress(100);
    setVideoReady(true);
  }, [activeSection]);

  useEffect(() => {
    if (videoReady || videoError) return;

    const interval = window.setInterval(() => {
      setLoadingProgress((current) => {
        if (current >= 94) return current;
        const increment = Math.max(1, Math.round((94 - current) * 0.08));
        return Math.min(94, current + increment);
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, [videoError, videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady || !videoTransitioning) return;
    let animationFrame = 0;

    const keepTimelinePlaying = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        const transition = transitionRef.current;

        if (transition) {
          if (
            video.currentTime >= transition.startTime - SEEK_PADDING &&
            video.currentTime < transition.endTime - SEEK_PADDING
          ) {
            transition.hasStarted = true;
          }

          if (transition.hasStarted && video.currentTime >= transition.endTime - SEEK_PADDING) {
            seekVideoToHold(transition.to);
            return;
          }
        }
      }
      animationFrame = requestAnimationFrame(keepTimelinePlaying);
    };

    animationFrame = requestAnimationFrame(keepTimelinePlaying);
    return () => cancelAnimationFrame(animationFrame);
  }, [seekVideoToHold, videoReady, videoTransitioning]);

  const navigateByDirection = useCallback(
    (direction: -1 | 1) => {
      if (transitionRef.current) return;

      const currentSection = visualSectionRef.current;
      const nextSection = Math.min(sections.length - 1, Math.max(0, currentSection + direction));
      if (nextSection === currentSection) return;

      setActiveSection(nextSection);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        seekVideoToHold(nextSection);
        return;
      }

      if (!startVideoTransition(currentSection, nextSection)) seekVideoToHold(nextSection);
    },
    [sections.length, seekVideoToHold, startVideoTransition]
  );

  const navigateTowardSection = useCallback(
    (targetSection: number) => {
      const currentSection = visualSectionRef.current;
      if (targetSection === currentSection) return;
      navigateByDirection(targetSection > currentSection ? 1 : -1);
    },
    [navigateByDirection]
  );

  useEffect(() => {
    const resetWheelGesture = () => {
      if (wheelResetTimeoutRef.current) clearTimeout(wheelResetTimeoutRef.current);
      wheelAccumulatorRef.current = 0;
      wheelGestureIdleRef.current = true;
      wheelGestureLockedRef.current = false;
      wheelResetTimeoutRef.current = null;
    };

    const markWheelGestureIdle = () => {
      wheelGestureIdleRef.current = true;
      wheelResetTimeoutRef.current = null;
      if (!transitionRef.current) {
        wheelAccumulatorRef.current = 0;
        wheelGestureLockedRef.current = false;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();

      wheelGestureIdleRef.current = false;
      if (wheelResetTimeoutRef.current) clearTimeout(wheelResetTimeoutRef.current);
      wheelResetTimeoutRef.current = setTimeout(markWheelGestureIdle, WHEEL_GESTURE_IDLE_DELAY);
      if (transitionRef.current || wheelGestureLockedRef.current) return;

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 16 : event.deltaY;
      if (
        wheelAccumulatorRef.current !== 0 &&
        Math.sign(wheelAccumulatorRef.current) !== Math.sign(delta)
      ) {
        wheelAccumulatorRef.current = 0;
      }
      wheelAccumulatorRef.current += delta;

      if (Math.abs(wheelAccumulatorRef.current) >= WHEEL_SNAP_THRESHOLD) {
        const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
        wheelAccumulatorRef.current = 0;
        wheelGestureLockedRef.current = true;
        navigateByDirection(direction);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => event.preventDefault();

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;
      if (startY === null || endY === undefined || transitionRef.current) return;

      const distance = startY - endY;
      if (Math.abs(distance) >= TOUCH_SNAP_THRESHOLD) {
        navigateByDirection(distance > 0 ? 1 : -1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('blur', resetWheelGesture);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('blur', resetWheelGesture);
      resetWheelGesture();
    };
  }, [navigateByDirection]);

  const homeHref = `${assetPrefix}/${activeLocale}`;

  return (
    <div className="dark fixed inset-0 z-[60] overflow-hidden bg-[#101611] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(193,207,168,0.52),transparent_38%),linear-gradient(135deg,#78866b_0%,#536251_52%,#273129_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(0deg,rgba(8,13,10,0.92)_0%,rgba(8,13,10,0.62)_30%,transparent_64%)]" />
      <div className="resume-grain pointer-events-none absolute inset-0 z-10 opacity-[0.16]" />
      <div className="resume-vignette pointer-events-none absolute inset-0 z-10" />

      {STAGE_IMAGE_NAMES.map((imageName, index) => (
        <NextImage
          key={imageName}
          src={`${assetPrefix}/static/resume/stages/video-endpoints/${imageName}?v=${RESUME_ASSET_VERSION}`}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className={`pointer-events-none absolute inset-0 z-[1] object-cover transition-opacity duration-150 motion-reduce:transition-none ${
            index === activeSection ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      ))}

      {homeClipIds.map((clipId, index) => {
        const slot = index as HomeVideoSlot;
        const active = homeAmbientActive && slot === homeActiveSlot && homeReady[slot];
        const homeVideoBaseUrl = `${assetPrefix}/static/resume/home/${clipId}`;

        return (
          <video
            key={`home-video-slot-${slot}`}
            ref={slot === 0 ? homeVideoARef : homeVideoBRef}
            poster={posterUrl}
            muted
            playsInline
            preload="auto"
            className={`pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => handleHomeVideoLoaded(slot)}
            onEnded={() => handleHomeVideoEnded(slot)}
            onError={() => setHomeSlotReady(slot, false)}
            data-home-clip={clipId}
            data-home-slot={slot}
            data-home-active={active ? 'true' : 'false'}
            aria-hidden="true"
          >
            <source src={`${homeVideoBaseUrl}.webm?v=${HOME_ASSET_VERSION}`} type="video/webm" />
            <source src={`${homeVideoBaseUrl}.mp4?v=${HOME_ASSET_VERSION}`} type="video/mp4" />
          </video>
        );
      })}

      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        muted
        playsInline
        autoPlay
        preload="auto"
        className={`pointer-events-none absolute inset-0 z-[3] h-full w-full object-cover ${
          videoTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        onLoadedData={handleVideoReady}
        onError={() => {
          setVideoError(true);
          setVideoTransitioning(false);
        }}
        aria-hidden="true"
      />

      <header className="pointer-events-none absolute top-0 right-0 left-0 z-30 flex items-center justify-between px-4 py-4 sm:px-7 sm:py-6 lg:px-10">
        <a
          href={homeHref}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-xs font-medium tracking-[0.16em] text-white/80 uppercase backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          aria-label={isChinese ? '返回首页' : 'Back to home'}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ryan / Interactive résumé</span>
          <span className="sm:hidden">Ryan</span>
        </a>

        <button
          type="button"
          onClick={switchLanguage}
          className="pointer-events-auto grid h-10 min-w-10 place-items-center rounded-full border border-white/15 bg-black/15 px-3 text-xs font-semibold text-white/80 backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          aria-label={isChinese ? 'Switch to English' : '切换到中文'}
        >
          {otherLocale.toUpperCase()}
        </button>
      </header>

      {!videoReady && !videoError && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <div className="flex w-40 flex-col items-center gap-3">
            <span className="text-3xl font-light tracking-tight text-white/85 tabular-nums">
              {Math.round(loadingProgress)}%
            </span>
            <div className="h-px w-full overflow-hidden bg-white/15">
              <div
                className="h-full bg-white/75 transition-[width] duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {videoError && (
        <div className="pointer-events-none absolute top-20 left-1/2 z-30 -translate-x-1/2 rounded-full border border-amber-200/20 bg-amber-950/35 px-4 py-2 text-center text-xs text-amber-50/85 backdrop-blur-md">
          {isChinese
            ? '部分效果未能加载，内容仍可浏览。'
            : 'Some effects could not load. The content remains available.'}
        </div>
      )}

      <aside
        ref={timelineViewportRef}
        className="pointer-events-auto absolute inset-y-0 right-0 left-0 z-20 h-[100svh] w-full overflow-clip text-left drop-shadow-[0_2px_20px_rgba(0,0,0,0.76)] [overflow-anchor:none] md:left-[55vw] md:w-[45vw]"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,13,10,0)_0%,rgba(8,13,10,0.48)_18%,rgba(8,13,10,0.74)_100%)]"
        />
        <div
          className="absolute top-0 right-4 left-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0 sm:right-7 sm:left-7 md:right-8 md:left-0"
          style={{ transform: `translate3d(0, ${timelineOffset}px, 0)` }}
        >
          <span
            aria-hidden="true"
            className="absolute top-[5px] bottom-[5px] left-[5px] w-px bg-white/18"
          />

          {sections.map((section, index) => {
            const active = index === activeSection;
            const distance = Math.abs(index - activeSection);
            const experience = index > 0 ? experiences[index - 1] : null;
            const inactiveOpacity = TIMELINE_NODE_OPACITY[distance] ?? 0.2;

            return (
              <div
                key={section.id}
                ref={(node) => {
                  timelineItemRefs.current[index] = node;
                }}
                className={`relative pl-7 transition-opacity duration-500 sm:pl-8 ${
                  active ? 'pb-10' : 'h-28 sm:h-32'
                }`}
                style={{ opacity: active ? 1 : inactiveOpacity }}
              >
                {!active && (
                  <button
                    type="button"
                    onClick={() => navigateTowardSection(index)}
                    className="absolute inset-0 z-20 cursor-pointer rounded-sm text-left outline-none focus-visible:ring-1 focus-visible:ring-[#C1CFA8]/80 focus-visible:ring-inset"
                    aria-label={
                      isChinese
                        ? `向${index > activeSection ? '下' : '上'}切换一项，前往${section.label}`
                        : `Move one item ${index > activeSection ? 'forward' : 'back'} toward ${section.label}`
                    }
                  >
                    <span className="sr-only">{section.label}</span>
                  </button>
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[5px] bottom-0 left-[5px] w-px bg-[#C1CFA8]/58"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute z-10 rounded-full transition-[opacity,transform,background-color,border-color,box-shadow] duration-500 ${
                    active
                      ? 'top-0 left-0 h-[11px] w-[11px] border border-[#F4F1E8]/90 bg-[#C1CFA8] shadow-[0_0_0_4px_rgba(193,207,168,0.14),0_0_18px_rgba(244,241,232,0.42)]'
                      : 'top-[2px] left-[2px] h-[7px] w-[7px] border border-white/40 bg-white/45'
                  }`}
                />

                {active ? (
                  index === 0 ? (
                    <div className="resume-panel-enter max-w-md">
                      <p className="mb-3 text-[9px] font-medium tracking-[0.26em] text-white/55 uppercase">
                        {isChinese ? '个人简介' : 'Profile'}
                      </p>
                      <h1 className="text-4xl leading-none font-semibold tracking-[-0.045em] text-[#F4F1E8] sm:text-5xl">
                        {profile.name}
                      </h1>
                      <p className="mt-3 text-xs font-medium tracking-[0.04em] text-white/78 sm:text-sm">
                        {profile.occupation}
                        {profile.company ? ` · ${profile.company}` : ''}
                      </p>
                      {profile.summary && (
                        <p className="mt-3 max-w-sm text-xs leading-5 text-white/64 sm:text-[13px] sm:leading-6">
                          {profile.summary}
                        </p>
                      )}
                      <div className="mt-4 flex justify-start gap-3 text-white/82">
                        <SocialIcon kind="mail" href={`mailto:${profile.email}`} />
                        <SocialIcon kind="github" href={profile.github} />
                        <SocialIcon kind="linkedin" href={profile.linkedin} />
                        <SocialIcon kind="x" href={profile.twitter} />
                        <SocialIcon kind="bluesky" href={profile.bluesky} />
                      </div>
                    </div>
                  ) : experience ? (
                    <div className="resume-panel-enter max-w-md">
                      <p className="mb-3 text-[9px] font-medium tracking-[0.26em] text-white/55 uppercase">
                        {experience.start} — {experience.end}
                      </p>
                      <a
                        href={experience.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-400 group inline-flex items-center gap-3 text-[#F4F1E8] outline-offset-4 transition-colors duration-300"
                      >
                        <NextImage
                          src={`${assetPrefix}${experience.logo}`}
                          alt={`${experience.org} logo`}
                          width={48}
                          height={48}
                          className="group-hover:border-primary-400/80 group-hover:shadow-primary-400/20 h-9 w-9 shrink-0 rounded-md border border-white/25 bg-white/90 object-contain p-1 transition duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-1 group-hover:bg-white group-hover:shadow-[0_0_0_3px] sm:h-10 sm:w-10"
                        />
                        <h2 className="after:bg-primary-400/85 relative text-xl leading-tight font-medium tracking-[-0.025em] after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 group-hover:after:scale-x-100 sm:text-2xl">
                          {experience.org}
                        </h2>
                      </a>

                      <p className="mt-3 flex items-start gap-2 text-xs leading-5 font-medium text-white/78 sm:text-[13px]">
                        <span aria-hidden="true" className="text-[#C1CFA8]/70">
                          -
                        </span>
                        <span>{removeLeadingEmoji(experience.title)}</span>
                      </p>

                      {experience.highlights && (
                        <ul className="mt-3 max-w-md list-none space-y-1.5 p-0">
                          {experience.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="relative pl-3.5 text-[11px] leading-[1.55] text-white/58 before:absolute before:top-[0.68em] before:left-0 before:h-px before:w-1.5 before:bg-[#C1CFA8]/55 sm:text-xs"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null
                ) : (
                  <div className="flex h-28 items-start gap-3 pt-px text-white/62 sm:h-32">
                    <span className="shrink-0 text-[8px] font-medium tracking-[0.2em] uppercase">
                      {index === 0
                        ? isChinese
                          ? '个人简介'
                          : 'Profile'
                        : `${experience?.start} — ${experience?.end}`}
                    </span>
                    <span className="truncate text-[11px] leading-none font-medium tracking-[0.02em]">
                      {index === 0 ? profile.name : experience?.org}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
