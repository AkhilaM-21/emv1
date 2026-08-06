import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring, useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import { EASE } from './motion';
import './stage.css';

/* =====================================================================
   STAGE ENGINE
   The page is not a stack of sections. It is a small number of pinned
   acts, each holding ONE persistent product canvas that reconfigures as
   you scroll. Modules are never unmounted between beats — they move,
   resize and hand space to each other, which is what makes a scroll read
   as a single continuous system rather than a slideshow.
   ===================================================================== */

/* ---------------------------------------------------------------
   Pin — a full-viewport act. `count` beats of 100vh each; children
   receive the active beat and the raw progress value.
   --------------------------------------------------------------- */
export const Pin = ({ count, children, className = '', id }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [beat, setBeat] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(v * count * 0.999)));
    setBeat((cur) => (cur === next ? cur : next));
  });

  return (
    <section
      ref={ref}
      id={id}
      className={`stg-pin ${className}`}
      style={{ height: `${count * 100}vh` }}
    >
      <div className="stg-pin-sticky">
        {children({ beat, progress: scrollYProgress, count })}
      </div>
    </section>
  );
};

/* Progress of the current beat, 0..1 — for anything that should track
   scroll continuously rather than snap between beats. */
export const useBeatProgress = (progress, beat, count) =>
  useTransform(progress, [beat / count, (beat + 1) / count], [0, 1], { clamp: true });

/* ---------------------------------------------------------------
   Narration that crossfades with the beat. Lines rise out of a mask.
   --------------------------------------------------------------- */
export const Narration = ({ beats, beat, count }) => {
  const reduced = useReducedMotion();

  return (
    <div className="stg-narr">
      <div className="stg-narr-index">
        <span className="stg-narr-num">{String(beat + 1).padStart(2, '0')}</span>
        <span className="stg-narr-rule"><i style={{ transform: `scaleX(${(beat + 1) / count})` }} /></span>
        <span className="stg-narr-total">{String(count).padStart(2, '0')}</span>
      </div>

      <div className="stg-narr-body">
        {beats.map((b, i) => (
          <motion.div
            key={b.title}
            className="stg-narr-item"
            initial={false}
            animate={
              reduced
                ? { opacity: beat === i ? 1 : 0 }
                : { opacity: beat === i ? 1 : 0, y: beat === i ? 0 : 18, filter: beat === i ? 'blur(0px)' : 'blur(3px)' }
            }
            transition={{ duration: 0.72, ease: EASE }}
            style={{ pointerEvents: beat === i ? 'auto' : 'none' }}
            aria-hidden={beat !== i}
          >
            <span className="stg-narr-kicker">{b.kicker}</span>
            <h2>{b.title}</h2>
            <p>{b.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   Module — a panel on the persistent canvas. It survives beat changes
   and animates its grid position, which is where the morph comes from.
   --------------------------------------------------------------- */
export const Module = ({ area, show, children, className = '', z = 1 }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout={!reduced}
      className={`stg-mod ${className}`}
      style={{ gridArea: area, zIndex: z }}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        scale: show ? 1 : 0.97,
        filter: show ? 'blur(0px)' : 'blur(4px)',
      }}
      transition={{
        layout: { duration: 0.9, ease: EASE },
        default: { duration: 0.55, ease: EASE },
      }}
      aria-hidden={!show}
    >
      <div className="stg-mod-inner" style={{ pointerEvents: show ? 'auto' : 'none' }}>
        {children}
      </div>
    </motion.div>
  );
};

/* The canvas itself — a named-area grid whose template changes per beat.
   Framer's layout animation FLIPs every module between templates. */
export const Canvas = ({ template, children, className = '' }) => (
  <div className={`stg-canvas ${className}`} style={{ gridTemplateAreas: template }}>
    {children}
  </div>
);

/* ---------------------------------------------------------------
   Horizontal rail — vertical scroll drives sideways travel.
   --------------------------------------------------------------- */
export const HRail = ({ children, className = '', id }) => {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      setDist(Math.max(0, el.scrollWidth - window.innerWidth + 96));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [children]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(raw, { stiffness: 120, damping: 32, mass: 0.5 });

  return (
    <section
      ref={ref}
      id={id}
      className={`stg-hrail ${className}`}
      style={{ height: reduced ? 'auto' : `${dist + (typeof window !== 'undefined' ? window.innerHeight : 900)}px` }}
    >
      <div className="stg-hrail-sticky">
        <motion.div ref={trackRef} className="stg-hrail-track" style={reduced ? undefined : { x }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   Spotlight — a cursor-aware surface. Writes CSS variables straight to
   the node rather than through state, so it never re-renders on move.
   --------------------------------------------------------------- */
export const Spotlight = ({ children, className = '' }) => {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '-20%');
  };

  return (
    <div
      ref={ref}
      className={`stg-spot ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </div>
  );
};

/* ---------------------------------------------------------------
   A value that counts as it enters, driven by scroll position rather
   than a timer — it tracks the reader instead of firing once.
   --------------------------------------------------------------- */
export const ScrollNumber = ({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.45'] });
  const [val, setVal] = useState(reduced ? to : 0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return;
    setVal(to * Math.min(1, Math.max(0, v)));
  });

  const shown = val.toFixed(decimals);
  const [int, dec] = shown.split('.');

  return (
    <span ref={ref} className="tnum">
      {prefix}{int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{dec ? `.${dec}` : ''}{suffix}
    </span>
  );
};

/* ---------------------------------------------------------------
   Scroll-drawn SVG path — the line draws with the reader's scroll.
   --------------------------------------------------------------- */
export const ScrollPath = ({ d, className, strokeWidth = 2, progress }) => {
  const reduced = useReducedMotion();
  if (reduced) return <path d={d} className={className} strokeWidth={strokeWidth} fill="none" />;
  return (
    <motion.path
      d={d}
      className={className}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      style={{ pathLength: progress }}
    />
  );
};

/* A quiet full-bleed rule that draws itself as the act begins. */
export const ActRule = ({ label }) => (
  <div className="stg-actrule">
    <motion.i
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE }}
    />
    {label && <span>{label}</span>}
  </div>
);
