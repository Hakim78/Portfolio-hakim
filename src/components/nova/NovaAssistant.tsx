'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import GlitchScreen from './GlitchScreen';
import { useTypewriter } from './useTypewriter';
import { defaultFlow, type Choice, type Flow, type Input, type Mood, type NovaData } from './flow';
import s from './nova.module.css';

export type SubmitPayload = { goal?: string; data: NovaData; submittedAt: string };

export type NovaAssistantProps = {
  /** Graphe conversationnel (voir flow.ts) */
  flow?: Flow;
  /** Slug de départ */
  start?: string;
  /** Fonction d'envoi personnalisée. Prioritaire sur `endpoint`. */
  onSubmit?: (payload: SubmitPayload) => Promise<void>;
  /** URL POST JSON (ex. /api/contact). Sans onSubmit ni endpoint : log console. */
  endpoint?: string;
  theme?: 'light' | 'dark';
  /** Couleur du visage sur l'écran */
  accent?: string;
  /** Nom affiché en haut à gauche */
  name?: string;
  id?: string;
  className?: string;
  ui?: Partial<typeof defaultUi>;
};

const defaultUi = {
  status: 'en ligne',
  continue: 'Continuer',
  hint: 'Entrée ↵',
  back: "Revenir à l'étape précédente",
  soundOn: 'Son activé',
  soundOff: 'Son coupé',
  required: 'Ce champ est requis.',
  email: 'Adresse email invalide.',
  pickOne: 'Choisissez au moins une option.',
  screen: 'N.O.V.A, assistante animée sur un écran rétro',
};

type Entry = { slug: string; sentence: string };
type Anim = 'none' | 'fwd' | 'back';

const TRANSITION_MS = 320;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const fill = (t: string, d: NovaData) =>
  t.replace(/\s?\{(\w+)\}/g, (m, k: string) => {
    const v = d[k];
    const str = Array.isArray(v) ? v.join(', ') : v;
    return str ? m.replace(`{${k}}`, str) : '';
  });

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Petit « bip » synthétisé (aucun fichier audio). */
function blip(ctx: AudioContext) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'square';
  osc.frequency.value = 480 + Math.random() * 220;
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.03, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
}

export default function NovaAssistant({
  flow = defaultFlow,
  start = 'intro',
  onSubmit,
  endpoint,
  theme = 'light',
  accent = '#6CFFB8',
  name = 'N.O.V.A',
  id,
  className,
  ui: uiOverride,
}: NovaAssistantProps) {
  const ui = { ...defaultUi, ...uiOverride };
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const lastSubmit = useRef<string | null>(null);
  const sentFor = useRef<number>(-1);

  const [inView, setInView] = useState(false);
  const [history, setHistory] = useState<Entry[]>([]);
  const [data, setData] = useState<NovaData>({});
  const [anim, setAnim] = useState<Anim>('none');
  const [enterDir, setEnterDir] = useState<'fwd' | 'back'>('fwd');
  const [sending, setSending] = useState(false);
  const [muted, setMuted] = useState(true);

  // Démarre quand la section devient visible (séquence de « boot » puis intro)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || history.length) return;
    const t = window.setTimeout(
      () => setHistory([{ slug: start, sentence: fill(pick(flow[start].say), {}) }]),
      reduced ? 0 : 1100,
    );
    return () => window.clearTimeout(t);
  }, [inView, history.length, flow, start, reduced]);

  const current = history[history.length - 1];
  const step = current ? flow[current.slug] : undefined;
  const prevSentence = history.length > 1 ? history[history.length - 2].sentence : null;

  const onChar = useCallback(
    (ch: string) => {
      const letter = /\S/.test(ch);
      levelRef.current = Math.max(levelRef.current, letter ? 0.55 + Math.random() * 0.45 : 0.12);
      if (!muted && audioRef.current && letter && Math.random() < 0.6) blip(audioRef.current);
    },
    [muted],
  );

  const { shown, done, skip } = useTypewriter(current?.sentence ?? '', {
    onChar,
    instant: reduced,
    runKey: history.length,
  });

  const go = useCallback(
    (slug: string, nextData: NovaData) => {
      const target = slug === '__retry' && lastSubmit.current ? lastSubmit.current : slug;
      const targetStep = flow[target];
      if (!targetStep) {
        console.warn(`[NOVA] étape inconnue : "${target}"`);
        return;
      }
      setAnim('fwd');
      window.setTimeout(
        () => {
          const d = targetStep.reset ? {} : nextData;
          setData(d);
          setEnterDir('fwd');
          setHistory((h) => [...h, { slug: target, sentence: fill(pick(targetStep.say), d) }]);
          setAnim('none');
          mainRef.current?.scrollTo({ top: 0 });
        },
        reduced ? 0 : TRANSITION_MS,
      );
    },
    [flow, reduced],
  );

  const canGoBack = history.length > 1 && !step?.noBack && anim === 'none' && !sending;
  const back = useCallback(() => {
    if (!canGoBack) return;
    setAnim('back');
    window.setTimeout(
      () => {
        setEnterDir('back');
        setHistory((h) => h.slice(0, -1));
        setAnim('none');
      },
      reduced ? 0 : TRANSITION_MS,
    );
  }, [canGoBack, reduced]);

  // Auto-avance pour les étapes « narratives »
  useEffect(() => {
    if (!done || !step || anim !== 'none' || step.submit) return;
    if (step.next && !step.choices && !step.inputs) {
      const t = window.setTimeout(() => go(step.next!, data), 1100);
      return () => window.clearTimeout(t);
    }
  }, [done, step, anim, go, data]);

  // Envoi
  useEffect(() => {
    if (!done || !step?.submit || !current || sentFor.current === history.length) return;
    sentFor.current = history.length;
    lastSubmit.current = current.slug;
    setSending(true);
    const payload: SubmitPayload = { goal: data.goal as string | undefined, data, submittedAt: new Date().toISOString() };
    const send = onSubmit
      ? onSubmit(payload)
      : endpoint
        ? fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
          })
        : Promise.resolve(console.info('[NOVA] submit (aucun endpoint configuré)', payload));
    const minDelay = new Promise((r) => setTimeout(r, reduced ? 0 : 1400));
    Promise.all([send, minDelay])
      .then(() => go(step.next ?? 'done', data))
      .catch((err) => {
        console.error('[NOVA] échec envoi', err);
        go('error', data);
      })
      .finally(() => setSending(false));
  }, [done, step, current, history.length, data, onSubmit, endpoint, go, reduced]);

  const choose = (c: Choice) => {
    if (c.href) {
      if (c.href.startsWith('#')) document.querySelector(c.href)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      else window.open(c.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (c.next) go(c.next, { ...data, ...c.set });
  };

  const toggleSound = () => {
    if (muted && !audioRef.current) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioRef.current = new Ctx();
    }
    audioRef.current?.resume();
    setMuted((m) => !m);
  };

  // Clic pendant la frappe = afficher la phrase entière
  const onMainClick = () => {
    if (current && !done) skip();
  };

  const expanded = done && anim === 'none';
  const mood: Mood | 'boot' = !current ? 'boot' : sending ? 'code' : (step?.mood ?? 'idle');
  const compact = !current || !!step?.compact;

  return (
    <section
      ref={rootRef}
      id={id}
      className={cx(s.root, theme === 'dark' && s.dark, compact && s.compact, className)}
      style={{ '--nova-progress': step?.progress ?? 0 } as CSSProperties}
      aria-label={`${name} — assistant de contact`}
    >
      <header className={s.topbar}>
        <span className={s.brand}>{name}</span>
        <span className={s.status}>
          <i className={s.dot} style={{ background: accent, color: accent }} /> {ui.status}
        </span>
      </header>

      <div className={s.visual}>
        <GlitchScreen mood={mood} levelRef={levelRef} accent={accent} reduced={reduced} label={ui.screen} />
      </div>

      <div ref={mainRef} className={s.main} onClick={onMainClick}>
        {current && step && (
          <div
            key={history.length}
            className={cx(
              s.step,
              expanded && s.expanded,
              anim === 'fwd' && s.leaveFwd,
              anim === 'back' && s.leaveBack,
              enterDir === 'back' && s.enterBack,
            )}
          >
            {prevSentence && (
              <button type="button" className={s.previous} onClick={back} tabIndex={-1} aria-hidden>
                {prevSentence}
              </button>
            )}

            <p className={s.dialog}>
              <span aria-hidden>
                {shown}
                {!done && <i className={s.cursor} />}
              </span>
              <span className={s.srOnly} aria-live="polite">
                {current.sentence}
              </span>
            </p>

            {(step.choices || step.inputs) && (
              <div className={s.content} ref={(el) => { if (el) el.inert = !expanded; }}>
                {step.inputs ? (
                  <StepForm
                    key={current.slug}
                    inputs={step.inputs}
                    data={data}
                    ui={ui}
                    active={expanded}
                    onSubmit={(values) => go(step.next ?? 'menu', { ...data, ...values })}
                  />
                ) : (
                  <div className={s.choices}>
                    {step.choices!.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        className={cx(s.button, c.variant === 'secondary' && s.secondary)}
                        onClick={() => choose(c)}
                      >
                        {c.label}
                        {c.href && !c.href.startsWith('#') && <ArrowIcon diagonal />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button type="button" className={cx(s.back, !canGoBack && s.ctlHidden)} onClick={back} aria-label={ui.back} disabled={!canGoBack}>
        <ArrowIcon left />
      </button>

      <button type="button" className={cx(s.sound, !muted && s.soundOn)} onClick={toggleSound} aria-pressed={!muted}>
        <SoundIcon on={!muted} />
        <span>{muted ? ui.soundOff : ui.soundOn}</span>
      </button>

      <span className={s.progress} aria-hidden />
    </section>
  );
}

/* ─────────────────────────── Formulaire d'étape ─────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function StepForm({
  inputs,
  data,
  ui,
  active,
  onSubmit,
}: {
  inputs: Input[];
  data: NovaData;
  ui: typeof defaultUi;
  active: boolean;
  onSubmit: (values: NovaData) => void;
}) {
  const [values, setValues] = useState<NovaData>(() =>
    Object.fromEntries(inputs.map((i) => [i.name, data[i.name] ?? (i.type === 'checkboxes' ? [] : '')])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (active) firstRef.current?.focus({ preventScroll: true });
  }, [active]);

  const set = (name: string, v: string | string[]) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    for (const i of inputs) {
      const v = values[i.name];
      if (i.type === 'checkboxes') {
        if (i.required && !(v as string[]).length) errs[i.name] = ui.pickOne;
      } else {
        const str = String(v ?? '').trim();
        if (i.required && !str) errs[i.name] = ui.required;
        else if (i.type === 'email' && str && !EMAIL_RE.test(str)) errs[i.name] = ui.email;
      }
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    onSubmit(clean);
  };

  const onTextareaKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Entrée = valider, Maj+Entrée = retour à la ligne
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      {inputs.map((i, idx) => {
        const err = errors[i.name];
        const ref = idx === 0 ? firstRef : undefined;
        if (i.type === 'checkboxes') {
          const selected = values[i.name] as string[];
          return (
            <fieldset key={i.name} className={s.checks}>
              <legend className={s.srOnly}>{i.label}</legend>
              {i.options!.map((opt, oi) => (
                <label key={opt} className={s.check}>
                  <input
                    ref={oi === 0 ? ref : undefined}
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={(e) => set(i.name, e.target.checked ? [...selected, opt] : selected.filter((o) => o !== opt))}
                  />
                  <span>
                    <i className={s.checkIcon} aria-hidden />
                    {opt}
                  </span>
                </label>
              ))}
              {err && <p className={s.error}>{err}</p>}
            </fieldset>
          );
        }
        const common = {
          id: `nova-${i.name}`,
          name: i.name,
          placeholder: ' ',
          value: values[i.name] as string,
          autoComplete: i.autoComplete ?? 'off',
          'aria-invalid': !!err,
          'aria-describedby': err ? `nova-${i.name}-err` : undefined,
          className: cx(s.input, i.type === 'textarea' && s.textarea, err && s.invalid),
        };
        return (
          <div key={i.name} className={s.field}>
            {i.type === 'textarea' ? (
              <textarea
                {...common}
                ref={ref}
                rows={1}
                onKeyDown={onTextareaKey}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  set(i.name, e.target.value);
                }}
              />
            ) : (
              <input {...common} ref={ref} type={i.type} onChange={(e) => set(i.name, e.target.value)} />
            )}
            <label htmlFor={common.id} className={s.label}>
              {i.label}
              {!i.required && <em> (facultatif)</em>}
            </label>
            {err && (
              <p id={`nova-${i.name}-err`} className={s.error}>
                {err}
              </p>
            )}
          </div>
        );
      })}
      <div className={s.formActions}>
        <span className={s.hint}>{ui.hint}</span>
        <button type="submit" className={s.button}>
          {ui.continue} <ArrowIcon />
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────── Icônes ─────────────────────────── */

function ArrowIcon({ left, diagonal }: { left?: boolean; diagonal?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      aria-hidden
      style={{ transform: left ? 'rotate(180deg)' : diagonal ? 'rotate(-45deg)' : undefined }}
    >
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" aria-hidden>
      <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" />
      {on ? (
        <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      ) : (
        <path d="M10.5 6l4 4M14.5 6l-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      )}
    </svg>
  );
}
