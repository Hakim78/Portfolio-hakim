'use client';

import { useEffect, useRef, type CSSProperties, type MutableRefObject } from 'react';
import type { Mood } from './flow';
import s from './nova.module.css';

type ScreenMood = Mood | 'boot';

type Props = {
  mood: ScreenMood;
  /** niveau « vocal » 0→1, alimenté par la machine à écrire */
  levelRef: MutableRefObject<number>;
  accent: string;
  reduced?: boolean;
  label?: string;
};

// Résolution volontairement basse, agrandie en CSS (image-rendering: pixelated)
const W = 120;
const H = 90;
const BG = '#05070a';

type Line = { indent: number; w: number; dim: boolean };
const randLine = (): Line => ({ indent: Math.floor(Math.random() * 4), w: 8 + Math.floor(Math.random() * 60), dim: Math.random() < 0.45 });
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function GlitchScreen({ mood, levelRef, accent, reduced = false, label = 'Assistante animée' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<ScreenMood>(mood);
  const accentRef = useRef(accent);
  const glitchRef = useRef(0);

  accentRef.current = accent;

  useEffect(() => {
    if (moodRef.current !== mood) glitchRef.current = 1; // petit glitch à chaque changement d'expression
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    canvas.width = W;
    canvas.height = H;

    const st = {
      gx: 0, gy: 0, tx: 0, ty: 0,
      blinkAt: 0, nextBlink: performance.now() + 1500,
      pointerAt: 0,
      scroll: 0,
      lines: Array.from({ length: 26 }, randLine),
      level: 0,
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      st.tx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      st.ty = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1);
      st.pointerAt = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const px = (x: number, y: number, w: number, h: number) => ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));

    const drawCode = (fast: boolean, A: string) => {
      st.scroll += fast ? 1.4 : 0.7;
      while (st.scroll >= 4) {
        st.scroll -= 4;
        st.lines.shift();
        st.lines.push(randLine());
      }
      st.lines.forEach((l, i) => {
        ctx.fillStyle = A;
        ctx.globalAlpha = l.dim ? 0.35 : 0.9;
        px(8 + l.indent * 5, 4 + i * 4 - st.scroll, Math.min(l.w, W - 16 - l.indent * 5), 2);
      });
      ctx.globalAlpha = 1;
      // curseur clignotant
      if (Math.floor(performance.now() / 300) % 2) {
        ctx.fillStyle = A;
        px(8, H - 10, 5, 6);
      }
    };

    const drawFace = (m: ScreenMood, now: number, A: string) => {
      const cx = W / 2 + st.gx * 9;
      const cy = H / 2 - 6 + st.gy * 6;
      const dx = 21;
      const blinking = now - st.blinkAt < 130;
      ctx.fillStyle = A;
      ctx.shadowColor = A;
      ctx.shadowBlur = 6;

      const block = (x: number, y: number, w: number, h: number) => px(x - w / 2, y - h / 2, w, h);
      const caret = (x: number, y: number) => {
        for (let k = 0; k < 6; k++) {
          px(x - 7 + k, y + 3 - k, 2, 2);
          px(x + 5 - k, y + 3 - k, 2, 2);
        }
      };
      const eye = (x: number, y: number) => {
        const h = blinking ? 2 : 15;
        block(x, y, 11, h);
        if (!blinking) {
          // reflet qui suit le regard
          ctx.fillStyle = BG;
          ctx.shadowBlur = 0;
          px(x - 3 + st.gx * 2, y - 5 + st.gy * 2, 2, 2);
          ctx.fillStyle = A;
          ctx.shadowBlur = 6;
        }
      };

      switch (m) {
        case 'happy':
          caret(cx - dx, cy);
          caret(cx + dx, cy);
          break;
        case 'think': {
          const ox = 4, oy = -4;
          block(cx - dx + ox, cy + oy, 11, blinking ? 2 : 5);
          block(cx + dx + ox, cy + oy, 11, blinking ? 2 : 5);
          const t = Math.floor(now / 320) % 4;
          for (let i = 0; i < 3; i++) if (i < t) px(cx + dx + 12 + i * 4, cy + 18, 2, 2);
          break;
        }
        case 'wink':
          eye(cx - dx, cy);
          block(cx + dx, cy + 2, 11, 2);
          break;
        default:
          eye(cx - dx, cy);
          eye(cx + dx, cy);
      }

      // bouche
      const my = cy + 20;
      const talk = st.level > 0.06;
      if (talk) {
        const h = 2 + Math.round(st.level * 9);
        block(cx, my, 12 + Math.round(st.level * 6), h);
      } else if (m === 'happy' || m === 'wink') {
        px(cx - 7, my, 14, 2);
        px(cx - 9, my - 2, 2, 2);
        px(cx + 7, my - 2, 2, 2);
      } else if (m === 'think') {
        px(cx + 2, my, 7, 2);
      } else {
        px(cx - 5, my, 10, 2);
      }
      ctx.shadowBlur = 0;
    };

    const bandShift = (g: number) => {
      const n = 1 + Math.floor(g * 4);
      for (let i = 0; i < n; i++) {
        const y = Math.floor(Math.random() * H);
        const h = 1 + Math.floor(Math.random() * 7);
        const dx = Math.round((Math.random() * 2 - 1) * g * 14);
        const img = ctx.getImageData(0, y, W, h);
        ctx.putImageData(img, dx, y);
      }
      if (g > 0.45) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.3;
        ctx.drawImage(canvas, 2, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const draw = (now: number) => {
      const m = moodRef.current;
      const A = accentRef.current;

      // niveau vocal lissé + décroissance
      const raw = levelRef.current;
      levelRef.current *= 0.78;
      st.level += (raw - st.level) * 0.5;

      // regard : suit le pointeur, sinon erre doucement
      if (now - st.pointerAt > 3000 && Math.random() < 0.012) {
        st.tx = (Math.random() * 2 - 1) * 0.7;
        st.ty = (Math.random() * 2 - 1) * 0.4;
      }
      st.gx += (st.tx - st.gx) * 0.14;
      st.gy += (st.ty - st.gy) * 0.14;

      if (now > st.nextBlink) {
        st.blinkAt = now;
        st.nextBlink = now + 1800 + Math.random() * 3600;
      }

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // bruit léger
      ctx.fillStyle = A;
      ctx.globalAlpha = 0.07;
      for (let i = 0; i < 45; i++) ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1, 1);
      ctx.globalAlpha = 1;

      if (m === 'boot' || m === 'code') drawCode(m === 'boot', A);
      else drawFace(m, now, A);

      glitchRef.current *= 0.88;
      const g = glitchRef.current + (Math.random() < 0.012 ? 0.6 : 0) + st.level * 0.06;
      if (!reduced && g > 0.15) bandShift(g);

      // variables CSS pour le halo / l'inclinaison
      wrap.style.setProperty('--nova-level', st.level.toFixed(3));
      wrap.style.setProperty('--nova-tx', st.gx.toFixed(3));
      wrap.style.setProperty('--nova-ty', st.gy.toFixed(3));
    };

    let raf = 0;
    let last = 0;
    const interval = 1000 / 30; // 30 fps suffisent pour un écran rétro
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < interval) return;
      last = now;
      draw(now);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [levelRef, reduced]);

  return (
    <div className={s.float}>
      <div ref={wrapRef} className={s.monitor} role="img" aria-label={label} style={{ '--nova-accent': accent } as CSSProperties}>
        <span className={s.glow} aria-hidden />
        <div className={s.bezel}>
          <div className={s.glass}>
            <canvas ref={canvasRef} className={s.canvas} aria-hidden />
            <span className={s.scanlines} aria-hidden />
            <span className={s.glare} aria-hidden />
          </div>
          <span className={s.led} aria-hidden />
        </div>
      </div>
      <span className={s.ground} aria-hidden />
    </div>
  );
}
