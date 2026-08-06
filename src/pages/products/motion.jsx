import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion, animate, useInView, useScroll, useSpring, useTransform,
  useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import Lenis from 'lenis';

/* =====================================================================
   MOTION SYSTEM
   One easing curve, one duration language, one set of primitives.
   Every primitive resolves to a no-op under prefers-reduced-motion —
   the page must read identically with animation switched off.
   ===================================================================== */

/* expo-out. Fast departure, long settle. The reason motion reads as
   "expensive" rather than "bouncy". */
export const EASE = [0.16, 1, 0.3, 1];
export const DUR = { fast: 0.5, base: 0.9, slow: 1.25 };

/* ---------------------------------------------------------------
   Scroll input ranges must be safe for the Web Animations API.
   Framer converts a scroll-linked useTransform into a native
   scroll-driven animation, and the input range becomes keyframe
   offsets — which WAAPI requires to sit inside [0,1] AND be
   monotonically non-decreasing. A range like [-0.08 … 1.09] throws
   "Offsets must be null or in the range [0,1]" and blanks the page.
   Always build scroll ranges through this.
   --------------------------------------------------------------- */
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const safeRange = (values) => {
  const eps = 1e-4;
  const out = values.map(clamp01);

  for (let i = 1; i < out.length; i += 1) {
    if (out[i] <= out[i - 1]) out[i] = out[i - 1] + eps;
  }

  /* if nudging pushed the tail past 1, walk the correction backwards */
  if (out[out.length - 1] > 1) {
    out[out.length - 1] = 1;
    for (let i = out.length - 2; i >= 0; i -= 1) {
      if (out[i] >= out[i + 1]) out[i] = out[i + 1] - eps;
    }
  }

  return out;
};

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

/* ---------------------------------------------------------------
   Inertial scrolling. Mounted per page, torn down on unmount so the
   rest of the site keeps native scrolling.
   --------------------------------------------------------------- */

/* Held at module scope so programmatic scrolls can go through Lenis.
   A raw window.scrollTo fights the RAF loop and stutters. */
let lenisInstance = null;

export const scrollToY = (y) => {
  if (lenisInstance) lenisInstance.scrollTo(y, { duration: 1.1 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
};

export const useSmoothScroll = () => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenisInstance = lenis;

    let frame = 0;
    const loop = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    /* in-page anchors go through Lenis so they glide instead of jumping */
    const onAnchor = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -110, duration: 1.4 });
    };
    document.addEventListener('click', onAnchor);

    return () => {
      document.removeEventListener('click', onAnchor);
      cancelAnimationFrame(frame);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, [reduced]);
};

/* Land at the top, unless the caller arrived pointing at a section —
   the mega menu sends both Studio and Flow to the same page. */
export const useScrollTop = (sectionId) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!sectionId) return undefined;

    /* two frames: one for the section to mount, one for Lenis to settle */
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 110;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [sectionId]);
};

/* ---------------------------------------------------------------
   Reveal — the workhorse. Opacity and a short rise, nothing else.
   --------------------------------------------------------------- */
export const Reveal = ({
  children, y = 20, delay = 0, duration = DUR.base, className, style, as = 'div',
}) => {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className} style={style}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

/* Children rise in sequence. Used for lists and grid rows. */
export const Stagger = ({ children, delay = 0, gap = 0.07, className, style }) => {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={style}
      initial="rest"
      whileInView="go"
      viewport={VIEWPORT}
      variants={{ go: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, y = 18, className, style }) => {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className} style={style}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={style}
      variants={{ rest: { opacity: 0, y }, go: { opacity: 1, y: 0 } }}
      transition={{ duration: DUR.base, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   MaskText — words rise out of a clipped line. Used only on the
   display headlines, where it earns its cost.
   --------------------------------------------------------------- */
export const MaskText = ({ text, as: Tag = 'h1', className, delay = 0, gap = 0.038, accent }) => {
  const reduced = useReducedMotion();
  const words = String(text).split(' ');

  if (reduced) {
    return (
      <Tag className={className}>
        {accent ? <>{text} <em>{accent}</em></> : text}
      </Tag>
    );
  }

  const all = accent ? [...words, ...String(accent).split(' ').map((w) => ({ w, em: true }))] : words;

  return (
    <Tag className={className} aria-label={accent ? `${text} ${accent}` : text}>
      {all.map((item, i) => {
        const word = typeof item === 'string' ? item : item.w;
        const em = typeof item === 'object';
        return (
          <span className="mk" key={`${word}-${i}`} aria-hidden="true">
            <motion.span
              className={em ? 'mk-em' : undefined}
              initial={{ y: '112%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1, delay: delay + i * gap, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
};

/* A hairline that draws itself across. Used as a section divider. */
export const DrawLine = ({ className, delay = 0 }) => {
  const reduced = useReducedMotion();
  if (reduced) return <div className={`draw-line ${className || ''}`} />;

  return (
    <motion.div
      className={`draw-line ${className || ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.3, delay, ease: EASE }}
      style={{ transformOrigin: 'left' }}
    />
  );
};

/* ---------------------------------------------------------------
   Parallax — spring-damped so it trails the scroll slightly.
   --------------------------------------------------------------- */
export const Parallax = ({ children, distance = 50, className, style }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 110, damping: 30, mass: 0.5 });

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
};

/* The hero product surface: settles from slightly below and scaled
   down, then lifts on scroll. One gesture, done well. */
export const HeroStage = ({ children, className }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y = useSpring(raw, { stiffness: 90, damping: 30, mass: 0.6 });

  if (reduced) return <div ref={ref} className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      {/* tilts back a few degrees and settles flat — one gesture, on load
          only. The parent supplies the perspective. */}
      <motion.div
        initial={{ opacity: 0, y: 64, rotateX: 7, scale: 0.965 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: EASE }}
        style={{ transformOrigin: 'center 22%' }}
      >
        <motion.div style={{ y }}>{children}</motion.div>
      </motion.div>
    </div>
  );
};

/* ---------------------------------------------------------------
   Numbers that count. Formatted, not just toFixed.
   --------------------------------------------------------------- */
const fmt = (v, decimals, group) => {
  const n = v.toFixed(decimals);
  if (!group) return n;
  const [int, dec] = n.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? `.${dec}` : '');
};

export const CountUp = ({
  to, from = 0, decimals = 0, prefix = '', suffix = '', duration = 1.8, group = true,
}) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [value, setValue] = useState(reduced ? to : from);

  useEffect(() => {
    if (!inView || reduced) return undefined;
    const controls = animate(from, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration, reduced]);

  return (
    <span ref={ref} className="tnum">
      {prefix}{fmt(value, decimals, group)}{suffix}
    </span>
  );
};

/* ---------------------------------------------------------------
   Scroll-driven step tracking, for the pinned story sections.
   Returns the active index plus the raw progress value.
   --------------------------------------------------------------- */
export const useSteps = (count) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(v * count * 0.999)));
    setIndex((cur) => (cur === next ? cur : next));
  });

  return { ref, index, setIndex, progress: scrollYProgress };
};

/* ---------------------------------------------------------------
   Live data. Only ticks while the surface is on screen and the user
   has not asked for reduced motion — a dashboard mutating off-screen
   is wasted battery.
   --------------------------------------------------------------- */
export const useLive = (initial, step, interval = 2400) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -5% 0px' });
  const [state, setState] = useState(initial);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (reduced || !inView) return undefined;
    const id = setInterval(() => setState((s) => stepRef.current(s)), interval);
    return () => clearInterval(id);
  }, [inView, reduced, interval]);

  return [state, ref];
};

/* Ticks a number up and down inside a band, for "live" KPI readouts. */
export const useDrift = (base, band = 0.012, interval = 2600) => {
  const seed = useRef(0);
  const stepFn = useCallback(
    () => {
      seed.current += 1;
      const wave = Math.sin(seed.current * 1.7) * 0.6 + Math.sin(seed.current * 0.9) * 0.4;
      return base * (1 + wave * band);
    },
    [base, band]
  );
  return useLive(base, stepFn, interval);
};

export { motion, useInView, useReducedMotion, useScroll, useTransform, useSpring };
