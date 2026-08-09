import React, {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lock, MousePointer2 } from 'lucide-react';
import { motion, useInView, useReducedMotion, EASE } from '../shared/motion';
import './PlatformKit.css';

/* =====================================================================
   PLATFORM KIT — the vocabulary of a software-building environment.

   Finance speaks in ledgers and Supply Chain speaks in wallboards.
   Platform speaks in *editor chrome*: dot grids, selection handles,
   bezier wires, node ports, multiplayer cursors, keycaps, mono labels
   and syntax colour. Nothing in here is a card and nothing in here is
   a KPI tile — that is the whole point of the namespace.

   Everything degrades to a still, readable state under
   prefers-reduced-motion. The page must teach the product with the
   animation switched off.
   ===================================================================== */

/* ---------------------------------------------------------------
   TIMING
   Auto-playing sequences are what make a builder feel *alive on
   arrival* rather than only on scroll. But a loop that runs
   off-screen is wasted battery, and one that keeps running while
   somebody is reading a panel is hostile — so every sequence is
   gated on visibility and pauses under the pointer.
   --------------------------------------------------------------- */
/* `interval` may be a number, or a function of the current index — some
   sequences have several beats behind one label and want the label, not
   the beat, to be what holds for a fixed time. */
export const useAutoStep = (count, interval = 3000, opts = {}) => {
  const { start = 0, loop = true, hold = 0 } = opts;
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -18% 0px' });
  const [index, setIndex] = useState(start);
  const [paused, setPaused] = useState(false);
  const grace = useRef(0);

  useEffect(() => {
    if (reduced || !inView || paused) return undefined;
    const ms = typeof interval === 'function' ? interval(index) : interval;
    const id = setTimeout(
      () => setIndex((i) => (i + 1 >= count ? (loop ? 0 : i) : i + 1)),
      index === count - 1 && hold ? hold : ms
    );
    return () => clearTimeout(id);
  }, [index, count, interval, reduced, inView, paused, loop, hold]);

  /* a manual pick should own the sequence for a beat rather than being
     stolen back by the timer half a second later. One timer, replaced on
     every pick — otherwise a run of hovers stacks up releases that fire
     while the reader is still looking at their last choice. */
  const pick = useCallback((i) => {
    setIndex(i);
    setPaused(true);
    window.clearTimeout(grace.current);
    grace.current = window.setTimeout(() => setPaused(false), 6500);
  }, []);

  useEffect(() => () => window.clearTimeout(grace.current), []);

  return {
    ref,
    index: reduced ? Math.min(start, count - 1) : index,
    pick,
    setIndex,
    inView,
    bind: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
    },
  };
};

/* A 0→1 progress value that runs once when the element lands on screen.
   Used for one-shot assembly animations that shouldn't be scroll-tied. */
export const useOnce = (margin = '0px 0px -20% 0px') => {
  const ref = useRef(null);
  const on = useInView(ref, { once: true, margin });
  return [ref, on];
};

/* ---------------------------------------------------------------
   MICRO TYPE
   --------------------------------------------------------------- */
export const Kicker = ({ children, tone = '', dot = true }) => (
  <span className={`pk-kicker ${tone}`}>
    {dot && <i className="pk-kicker-dot" />}
    {children}
  </span>
);

export const Kbd = ({ children }) => <kbd className="pk-kbd">{children}</kbd>;

export const Chip = ({ children, tone = '', icon: Icon }) => (
  <span className={`pk-chip ${tone}`}>
    {Icon && <Icon size={11} strokeWidth={2} />}
    {children}
  </span>
);

/* ---------------------------------------------------------------
   SURFACES
   --------------------------------------------------------------- */

/* The canvas backdrop. A dot field rather than a ruled grid — a ruled
   grid reads as "dashboard", a dot field reads as "artboard". */
export const DotField = ({ className = '', size = 22, tone = 'light' }) => (
  <div
    className={`pk-dots ${tone} ${className}`}
    style={{ '--pk-dot': `${size}px` }}
    aria-hidden="true"
  />
);

/* Editor panel: the floating window every builder surface lives in.
   `lift` is the depth index — panels layer rather than tile. */
export const Panel = ({
  title, icon: Icon, right, tone = '', lift = 1, className = '', bodyClass = '', children, foot,
}) => (
  <div className={`pk-panel ${tone} lift-${lift} ${className}`}>
    {(title || right) && (
      <div className="pk-panel-bar">
        {Icon && <Icon size={12} strokeWidth={2} className="pk-panel-ic" />}
        {title && <span className="pk-panel-title">{title}</span>}
        {right && <div className="pk-panel-right">{right}</div>}
      </div>
    )}
    <div className={`pk-panel-body ${bodyClass}`}>{children}</div>
    {foot && <div className="pk-panel-foot">{foot}</div>}
  </div>
);

/* Browser mockup. Real tab strip, real omnibox, real toolbar — the
   cheap version of this (three dots and a grey bar) is the tell that
   a page was assembled rather than designed. */
export const Browser = ({
  url = 'app.emvive.com', tabs = [], active = 0, tone = 'light',
  onTab, chrome = true, className = '', children, badge,
}) => (
  <div className={`pk-browser ${tone} ${className}`}>
    {chrome && (
      <div className="pk-browser-top">
        <div className="pk-tl"><i /><i /><i /></div>

        {tabs.length > 0 && (
          <div className="pk-tabs" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`pk-tab ${i === active ? 'on' : ''}`}
                onClick={onTab ? () => onTab(i) : undefined}
                tabIndex={onTab ? 0 : -1}
              >
                <span className="pk-favi" />
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="pk-omni">
          <Lock size={9} strokeWidth={2.4} />
          <span>{url}</span>
        </div>

        {badge && <span className="pk-browser-badge">{badge}</span>}
      </div>
    )}
    <div className="pk-browser-body">{children}</div>
  </div>
);

/* Phone frame, for the "one build, every surface" moments. */
export const Device = ({ label, tone = 'light', className = '', children }) => (
  <div className={`pk-device ${tone} ${className}`}>
    <div className="pk-device-notch" />
    <div className="pk-device-screen">{children}</div>
    {label && <span className="pk-device-label">{label}</span>}
  </div>
);

/* Selection chrome. Drop it around anything to make it read as the
   currently-selected object on a canvas. */
export const Selected = ({ label, tone = '', children, className = '' }) => (
  <div className={`pk-sel ${tone} ${className}`}>
    {children}
    <span className="pk-sel-ring" aria-hidden="true" />
    <i className="pk-h tl" /><i className="pk-h tr" /><i className="pk-h bl" /><i className="pk-h br" />
    {label && <span className="pk-sel-tag">{label}</span>}
  </div>
);

/* ---------------------------------------------------------------
   WIRES — the connective tissue of both Studio and Flow.

   A wire has three layers: the dead track, the live stroke that draws
   itself when the connection is made, and an optional packet that runs
   the length of it. The packet is a short dash sliding along the same
   path, which costs one CSS animation instead of a JS loop.
   --------------------------------------------------------------- */
export const Wire = ({
  d, on = true, flow = false, delay = 0, tone = '', dash = false, width = 1.4,
}) => {
  const reduced = useReducedMotion();

  return (
    <g className={`pk-wire ${tone} ${dash ? 'dashed' : ''}`}>
      <path d={d} className="pk-wire-track" strokeWidth={width} />
      {reduced ? (
        on && <path d={d} className="pk-wire-live" strokeWidth={width} />
      ) : (
        <motion.path
          d={d}
          className="pk-wire-live"
          strokeWidth={width}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.85, delay, ease: EASE }}
        />
      )}
      {flow && on && !reduced && (
        <path
          d={d}
          className="pk-wire-packet"
          strokeWidth={width + 1.4}
          style={{ animationDelay: `${delay}s` }}
        />
      )}
    </g>
  );
};

/* A port on the edge of a node. Lights when its wire is carrying. */
export const Port = ({ side = 'l', on = false, className = '' }) => (
  <span className={`pk-port ${side} ${on ? 'on' : ''} ${className}`} aria-hidden="true" />
);

/* ---------------------------------------------------------------
   MULTIPLAYER CURSORS
   Two people editing the same screen is the single fastest way to say
   "this is a real tool" without writing a word of copy.
   --------------------------------------------------------------- */
export const Cursor = ({ name, tone = 'v', x, y, show = true, delay = 0 }) => {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <motion.div
      className={`pk-cursor ${tone}`}
      initial={false}
      animate={{ left: x, top: y, opacity: show ? 1 : 0 }}
      transition={{ duration: 1.5, delay, ease: EASE }}
    >
      <MousePointer2 size={15} strokeWidth={1.6} />
      <span>{name}</span>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   POINTER EFFECTS
   --------------------------------------------------------------- */

/* Spotlight follows the pointer across a surface. Written against CSS
   custom properties so the paint happens on the compositor and no React
   state changes on mousemove. */
export const Spotlight = ({ className = '', children, radius = 420, tone = '' }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--on', '1');
  };

  return (
    <div
      ref={ref}
      className={`pk-spot ${tone} ${className}`}
      style={{ '--pk-r': `${radius}px` }}
      onMouseMove={onMove}
      onMouseLeave={() => ref.current && ref.current.style.setProperty('--on', '0')}
    >
      {children}
    </div>
  );
};

/* A button that leans toward the cursor. Restrained — 0.3 of the
   distance, which reads as weight rather than as a toy. */
export const Magnet = ({ children, pull = 0.3, range = 110, className = '' }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [d, setD] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return undefined;

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > range + Math.max(r.width, r.height) / 2) {
        setD((p) => (p.x === 0 && p.y === 0 ? p : { x: 0, y: 0 }));
        return;
      }
      setD({ x: dx * pull, y: dy * pull });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [pull, range, reduced]);

  return (
    <motion.span
      ref={ref}
      className={`pk-magnet ${className}`}
      animate={{ x: d.x, y: d.y }}
      transition={{ type: 'spring', stiffness: 190, damping: 16, mass: 0.4 }}
    >
      {children}
    </motion.span>
  );
};

/* ---------------------------------------------------------------
   MARQUEE — one row, duplicated, translated. Pauses on hover so a
   logo or an integration can actually be read.
   --------------------------------------------------------------- */
export const Marquee = ({ children, speed = 42, reverse = false, className = '' }) => {
  const reduced = useReducedMotion();

  return (
    <div className={`pk-marquee ${reduced ? 'still' : ''} ${className}`}>
      <div
        className={`pk-marquee-run ${reverse ? 'rev' : ''}`}
        style={{ '--pk-dur': `${speed}s` }}
      >
        <div className="pk-marquee-set">{children}</div>
        <div className="pk-marquee-set" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   CODE
   A small tokeniser rather than a syntax-highlighting dependency.
   The snippets on this page are short and hand-authored, so the cost
   of shipping a highlighter is not worth paying.
   --------------------------------------------------------------- */
const TOKEN = new RegExp([
  /(\/\/[^\n]*|#[^\n]*)/,                                            /* 1 comment */
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/,        /* 2 string  */
  /\b(const|let|var|await|async|function|return|import|export|from|new|if|else|for|of|type|true|false|null|def|class)\b/, /* 3 keyword */
  /\b(GET|POST|PUT|PATCH|DELETE|curl)\b/,                            /* 4 verb    */
  /\b(\d[\d_.]*)\b/,                                                 /* 5 number  */
  /([A-Za-z_$][\w$]*)(?=\s*\()/,                                     /* 6 call    */
  /([A-Za-z_$"][\w$"]*)(?=\s*:)/,                                    /* 7 key     */
].map((r) => r.source).join('|'), 'g');

const CLASS = [null, 'com', 'str', 'kw', 'verb', 'num', 'fn', 'key'];

const tokenise = (line) => {
  const out = [];
  let last = 0;
  let m = TOKEN.exec(line);
  TOKEN.lastIndex = 0;

  while ((m = TOKEN.exec(line)) !== null) {
    if (m.index > last) out.push({ t: line.slice(last, m.index) });
    const gi = m.slice(1).findIndex((g) => g !== undefined) + 1;
    out.push({ t: m[0], c: CLASS[gi] });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out;
};

export const Code = ({ code, numbers = true, className = '', typed = false, tone = 'dark' }) => {
  const lines = useMemo(() => String(code).replace(/\t/g, '  ').split('\n'), [code]);
  const reduced = useReducedMotion();
  const [ref, on] = useOnce();

  return (
    <pre ref={ref} className={`pk-code ${tone} ${className}`}>
      <code>
        {lines.map((line, i) => (
          <span
            className="pk-code-line"
            key={`${i}-${line}`}
            style={
              typed && !reduced
                ? { opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(4px)', transitionDelay: `${i * 0.045}s` }
                : undefined
            }
          >
            {numbers && <i className="pk-code-n">{i + 1}</i>}
            <span className="pk-code-t">
              {tokenise(line).map((tk, j) => (
                <span className={tk.c ? `pk-t-${tk.c}` : undefined} key={j}>{tk.t}</span>
              ))}
              {line === '' ? ' ' : ''}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
};

/* ---------------------------------------------------------------
   A log line stream, used by Flow and by the AI builder. Newest at the
   bottom, because a build log reads downward.
   --------------------------------------------------------------- */
export const LogStream = ({ lines, className = '', tail = 6 }) => {
  const body = useRef(null);
  const shown = lines.slice(-tail);

  useLayoutEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [lines.length]);

  return (
    <div className={`pk-log ${className}`} ref={body}>
      <AnimatePresence initial={false}>
        {shown.map((l) => (
          <motion.div
            className={`pk-log-line ${l.tone || ''}`}
            key={l.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <i className="pk-log-dot" />
            <span className="pk-log-t">{l.t}</span>
            {l.m && <em className="pk-log-m">{l.m}</em>}
            {l.ms && <b className="pk-log-ms">{l.ms}</b>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------------------------------------------------------
   Progress ring, used for node execution state.
   --------------------------------------------------------------- */
export const Ring = ({ value = 0, size = 22, width = 2, tone = '' }) => {
  const r = (size - width) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg className={`pk-ring ${tone}`} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} className="pk-ring-t" strokeWidth={width} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="pk-ring-v"
        strokeWidth={width}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
      />
    </svg>
  );
};

/* A word that swaps in place. Used once, in the hero. */
export const Cycler = ({ words, index, className = '' }) => {
  const reduced = useReducedMotion();
  const word = words[index % words.length];

  if (reduced) return <span className={className}>{words[0]}</span>;

  return (
    <span className={`pk-cycle ${className}`} aria-live="polite">
      {/* the widest word reserves the box so the headline never reflows */}
      <span className="pk-cycle-ghost" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="pk-cycle-w"
          initial={{ y: '78%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-78%', opacity: 0 }}
          transition={{ duration: 0.62, ease: EASE }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export { AnimatePresence };
