'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Locale } from '@/locales/config';
import type { LifeEntry } from '@/data/lifeJournal';
import styles from './LifeJournal.module.css';

export default function LifeJournal({ locale }: { locale: Locale }) {
  const en = locale === Locale.EN;
  const language = en ? 1 : 0;
  const [photo, setPhoto] = useState<LifeEntry | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const previewImage = useRef<HTMLImageElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const animation = useRef<Animation | null>(null);
  const targetRect = useRef<DOMRect | null>(null);
  const closing = useRef(false);
  const previousOverflow = useRef('');

  const sourceTransform = () => {
    const source = trigger.current?.querySelector('img')?.getBoundingClientRect();
    const target = targetRect.current;
    if (!source || !target) return 'none';
    return `translate(${source.left - target.left}px, ${source.top - target.top}px) scale(${source.width / target.width}, ${source.height / target.height})`;
  };
  useLayoutEffect(() => {
    if (!photo || !dialog.current || !previewImage.current) return;
    const modal = dialog.current;
    const image = previewImage.current;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closing.current = false;
    modal.showModal();
    targetRect.current = image.getBoundingClientRect();
    animation.current = image.animate([{ transform: sourceTransform() }, { transform: 'none' }], {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'both',
    });
    return () => {
      animation.current?.cancel();
      document.body.style.overflow = previousOverflow.current;
    };
  }, [photo]);

  const closePhoto = () => {
    if (closing.current || !previewImage.current) return;
    closing.current = true;
    const image = previewImage.current;
    const current = getComputedStyle(image).transform;
    animation.current?.cancel();
    animation.current = image.animate([{ transform: current }, { transform: sourceTransform() }], {
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'both',
    });
    animation.current.onfinish = () => dialog.current?.close();
  };
  const [entries, setEntries] = useState<LifeEntry[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const form = event.currentTarget;
    const password = new FormData(form).get('password');
    form.reset();
    try {
      const auth = await fetch('/api/life/unlock', {
        method: 'POST',
        body: typeof password === 'string' ? password : '',
        cache: 'no-store',
      });
      if (auth.status === 401) {
        setError(en ? 'Incorrect password.' : '密码不正确。');
        return;
      }
      if (auth.status === 429) {
        setError(
          en ? 'Too many attempts. Try again in a minute.' : '尝试次数过多，请一分钟后再试。'
        );
        return;
      }
      if (auth.status !== 204) throw new Error('Unlock unavailable');
      const response = await fetch('/api/life/entries', { cache: 'no-store' });
      if (!response.ok || !response.headers.get('Content-Type')?.includes('application/json'))
        throw new Error('Journal unavailable');
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid journal');
      setEntries(data as LifeEntry[]);
    } catch {
      setError(
        en ? 'Could not open the journal. Please try again.' : '暂时无法打开生活页，请稍后再试。'
      );
    } finally {
      setBusy(false);
    }
  };
  if (entries === null)
    return (
      <div className={`${styles.journal} ${styles.locked}`}>
        <header className="editorial-page-heading">
          <h1>{en ? 'Life' : '生活'}</h1>
        </header>
        <form
          className={styles.unlock}
          method="post"
          action="/api/life/unlock"
          onSubmit={unlock}
          aria-busy={busy}
        >
          <label htmlFor="life-password">
            {en ? 'Enter the password to view.' : '输入密码后查看。'}
          </label>
          <div className={styles.unlockControls}>
            <input
              id="life-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            <button type="submit" disabled={busy}>
              {en ? 'Unlock' : '解锁'}
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
        </form>
      </div>
    );
  const years = [...new Set(entries.map((entry) => entry.date?.slice(0, 4) || 'pending'))];

  return (
    <div className={styles.journal}>
      <header className="editorial-page-heading">
        <h1>{en ? 'Life' : '生活'}</h1>
        <p>{en ? 'Remembering every important day.' : '记录每一个重要的日子。'}</p>
      </header>
      <div className={styles.timeline}>
        {years.map((year) => (
          <section className={styles.yearGroup} key={year} aria-labelledby={`year-${year}`}>
            <h3 id={`year-${year}`} className={styles.year}>
              {year === 'pending' ? (en ? 'Undated' : '日期待补') : year}
            </h3>
            <div className={styles.entries}>
              {entries
                .filter((entry) =>
                  year === 'pending' ? !entry.date : entry.date?.startsWith(year)
                )
                .map((entry) => {
                  return (
                    <article key={entry.id} className={styles.entry}>
                      <div className={styles.entryHeading}>
                        <time className={styles.date} dateTime={entry.date || undefined}>
                          {entry.date
                            ? entry.date.slice(5).replace('-', ' / ')
                            : en
                              ? 'Undated'
                              : '待补日期'}
                        </time>
                        <p>{entry.summary[language]}</p>
                      </div>
                      {entry.image && (
                        <button
                          className={styles.photo}
                          style={
                            {
                              '--photo-ratio':
                                (entry.image.width || 960) / (entry.image.height || 600),
                            } as CSSProperties
                          }
                          aria-label={`${en ? 'Enlarge image' : '查看大图'}：${entry.image.alt[language]}`}
                          onClick={(event) => {
                            trigger.current = event.currentTarget;
                            setPhoto(entry);
                          }}
                        >
                          <Image
                            src={entry.image.src}
                            alt={entry.image.alt[language]}
                            width={entry.image.width || 960}
                            height={entry.image.height || 600}
                            unoptimized
                          />
                        </button>
                      )}
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePhoto();
        }}
        onCancel={(event) => {
          event.preventDefault();
          closePhoto();
        }}
        onClose={() => {
          setPhoto(null);
          trigger.current?.focus({ preventScroll: true });
        }}
        aria-label={en ? 'Photo preview' : '图片预览'}
      >
        <button
          className={styles.close}
          onClick={closePhoto}
          aria-label={en ? 'Close' : '关闭'}
          autoFocus
        >
          <X size={22} />
        </button>
        {photo?.image && (
          <Image
            ref={previewImage}
            src={photo.image.src}
            alt={photo.image.alt[language]}
            width={photo.image.width || 960}
            height={photo.image.height || 600}
            unoptimized
          />
        )}
      </dialog>
    </div>
  );
}
