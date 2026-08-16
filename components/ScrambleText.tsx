'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './ScrambleText.module.css';

interface Props {
  delay?: number;
  duration?: number;
  hover?: boolean;
  play?: boolean;
  text: string;
}

interface ScrambleMap {
  characters: string[];
  mutableCount: number;
  wordIds: number[];
}

const isMutableCharacter = (character: string) => /[\p{L}\p{N}]/u.test(character);

const createScrambleMap = (text: string): ScrambleMap => {
  const characters = Array.from(text);
  const wordIds: number[] = [];
  let wordId = 0;
  let mutableCount = 0;

  characters.forEach((character) => {
    if (/\s/u.test(character)) {
      wordIds.push(-1);
      wordId += 1;
      return;
    }

    wordIds.push(wordId);
    if (!isMutableCharacter(character)) return;
    mutableCount += 1;
  });

  return { characters, mutableCount, wordIds };
};

const createFrame = (map: ScrambleMap, progress: number) => {
  const revealProgress = Math.max(0, Math.min(1, (progress - 0.32) / 0.68));
  const revealedCount = Math.floor(map.mutableCount * revealProgress);
  const output = [...map.characters];
  const unrevealedByWord = new Map<number, number[]>();
  let mutableIndex = 0;

  map.characters.forEach((character, index) => {
    if (!isMutableCharacter(character)) return;
    if (mutableIndex++ < revealedCount) return;

    const wordId = map.wordIds[index];
    const positions = unrevealedByWord.get(wordId) ?? [];
    positions.push(index);
    unrevealedByWord.set(wordId, positions);
  });

  unrevealedByWord.forEach((positions) => {
    const characters = positions.map((position) => map.characters[position]);
    for (let index = characters.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [characters[index], characters[randomIndex]] = [characters[randomIndex], characters[index]];
    }
    positions.forEach((position, index) => {
      output[position] = characters[index];
    });
  });

  return output.join('');
};

export default function ScrambleText({
  delay = 0,
  duration = 480,
  hover = false,
  play = false,
  text,
}: Props) {
  const scrambleMap = useMemo(() => createScrambleMap(text), [text]);
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const delayRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (delayRef.current !== null) {
      window.clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    activeRef.current = false;
    setIsScrambling(false);
  }, []);

  const scramble = useCallback(
    (startDelay = 0) => {
      if (activeRef.current) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplayText(text);
        return;
      }

      activeRef.current = true;
      setIsScrambling(true);

      const begin = () => {
        delayRef.current = null;
        const startedAt = performance.now();
        let previousFrameAt = 0;

        const renderFrame = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);

          if (now - previousFrameAt >= 30 || progress === 1) {
            previousFrameAt = now;
            setDisplayText(progress === 1 ? text : createFrame(scrambleMap, progress));
          }

          if (progress < 1) {
            animationFrameRef.current = window.requestAnimationFrame(renderFrame);
            return;
          }

          animationFrameRef.current = null;
          activeRef.current = false;
          setIsScrambling(false);
        };

        animationFrameRef.current = window.requestAnimationFrame(renderFrame);
      };

      if (startDelay > 0) delayRef.current = window.setTimeout(begin, startDelay);
      else begin();
    },
    [duration, scrambleMap, text]
  );

  useEffect(() => {
    cancelAnimation();
    setDisplayText(text);
    if (play) scramble(delay);
    return cancelAnimation;
  }, [cancelAnimation, delay, play, scramble, text]);

  return (
    <span
      className={styles.root}
      data-scramble-text={text}
      data-scrambling={isScrambling ? 'true' : 'false'}
      onPointerEnter={
        hover
          ? (event) => {
              if (event.pointerType === 'mouse' || event.pointerType === 'pen') scramble();
            }
          : undefined
      }
    >
      <span className={styles.srOnly}>{text}</span>
      <span className={styles.visual} aria-hidden="true">
        {displayText}
      </span>
    </span>
  );
}
