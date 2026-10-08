'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  /** ms par caractère */
  speed?: number;
  /** délai avant la première lettre */
  delay?: number;
  /** affiche tout immédiatement (prefers-reduced-motion) */
  instant?: boolean;
  /** callback à chaque caractère (son, animation de la bouche…) */
  onChar?: (char: string) => void;
  /** change cette valeur pour relancer l'animation sur un texte identique */
  runKey?: unknown;
};

/**
 * Machine à écrire avec pauses naturelles sur la ponctuation et possibilité de « skip ».
 */
export function useTypewriter(text: string, { speed = 26, delay = 220, instant = false, onChar, runKey }: Options = {}) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const timer = useRef<number | undefined>(undefined);
  const onCharRef = useRef(onChar);
  onCharRef.current = onChar;

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (instant || !text) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      const ch = text[i - 1];
      onCharRef.current?.(ch);
      if (i >= text.length) return;
      const pause = /[.!?…]/.test(ch) ? speed * 11 : /[,;:]/.test(ch) ? speed * 5 : speed + Math.random() * speed * 0.6;
      timer.current = window.setTimeout(tick, pause);
    };
    timer.current = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer.current);
  }, [text, instant, speed, delay, runKey]);

  const skip = useCallback(() => {
    window.clearTimeout(timer.current);
    setCount(text.length);
  }, [text]);

  return { shown: text.slice(0, count), done: count >= text.length, skip };
}
