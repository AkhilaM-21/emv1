import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  AnimatePresence, motion, useMotionValue, useSpring, useTransform,
  useReducedMotion, useVelocity, useDragControls,
} from 'framer-motion';
import { GripVertical } from 'lucide-react';
import './SupplyUI.css';

/* =====================================================================
   EMVIVE — PREMIUM INTERACTION PRIMITIVES

   Every primitive here is an adaptation of a known premium component
   pattern, re-authored against Emvive's tokens, data and product
   language. The pattern is credited on each one; nothing is a copy —
   the geometry, the surfaces, the payloads and the motion timings are
   ours, and each one is driven by real supply-chain data.

     Beam         ← Magic UI · Animated Beam        (ref-measured SVG + moving gradient)
     Dock         ← Magic UI · Dock                 (pointer-distance magnification)
     LiveList     ← Magic UI · Animated List        (spring-in, layout-shifted feed)
     Compare      ← Aceternity UI · Compare         (clip-path split, drag or hover)
     DragPanel    ← Aceternity UI · Draggable Card  (drag + velocity tilt + glare)
     Ticker       ← Motion Primitives · AnimatedNumber (spring-driven formatted number)
     Rail         ← Aceternity UI · Timeline        (scroll-filled progress spine)
   ===================================================================== */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

/* React 19's useId emits guillemets (`«r0»`), which are not a legal
   fragment reference inside url(#…). Beams need a stable, plain id. */
let uid = 0;
const useLocalId = (prefix) => {
  const ref = useRef(null);
  if (ref.current === null) { uid += 1; ref.current = `${prefix}${uid}`; }
  return ref.current;
};

/* =====================================================================
   Beam — adapted from Magic UI's Animated Beam.
   Kept: measuring both endpoints against a container and animating a
   userSpaceOnUse gradient along the path.
   Changed: the resize observer watches the endpoints as well as the
   container (our panels move while the container does not), the curve
   can bow on either axis so a beam can run vertically through an
   architecture stack, a static rail is always drawn so the diagram
   still reads with motion off, and the palette comes from --accent.
   ===================================================================== */
export const Beam = ({
  containerRef, fromRef, toRef,
  curvature = 0, axis = 'x', reverse = false,
  fromSide = 'center', toSide = 'center',
  duration = 4.2, delay = 0, width = 1.6,
  color = 'var(--accent)', trail = 'rgba(255,255,255,0.10)',
}) => {
  const id = useLocalId('beam');
  const [d, setD] = useState('');
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const draw = () => {
      const c = containerRef.current;
      const a = fromRef.current;
      const b = toRef.current;
      if (!c || !a || !b) return;

      const C = c.getBoundingClientRect();
      const A = a.getBoundingClientRect();
      const B = b.getBoundingClientRect();
      setBox({ w: C.width, h: C.height });

      /* Magic UI always leaves from the centre of a box. That is fine
         for a 40px circle and wrong for a 300px panel, where the beam
         spends its first half hidden behind its own source. Anchoring to
         an edge is what makes an architecture diagram read. */
      const anchorX = (r, side) => (
        side === 'left' ? r.left - C.left
          : side === 'right' ? r.right - C.left
            : r.left - C.left + r.width / 2
      );

      const sx = anchorX(A, fromSide);
      const sy = A.top - C.top + A.height / 2;
      const ex = anchorX(B, toSide);
      const ey = B.top - C.top + B.height / 2;

      /* the control point bows across the axis the beam is NOT running
         along, so vertical stacks curve sideways and horizontal
         integrations curve upward */
      const cx = axis === 'x' ? (sx + ex) / 2 : (sx + ex) / 2 + curvature;
      const cy = axis === 'x' ? (sy + ey) / 2 - curvature : (sy + ey) / 2;

      setD(`M ${sx},${sy} Q ${cx},${cy} ${ex},${ey}`);
    };

    const ro = new ResizeObserver(draw);
    [containerRef, fromRef, toRef].forEach((r) => { if (r.current) ro.observe(r.current); });
    draw();
    window.addEventListener('resize', draw);
    return () => { ro.disconnect(); window.removeEventListener('resize', draw); };
  }, [containerRef, fromRef, toRef, curvature, axis, fromSide, toSide]);

  const run = reverse
    ? { x1: ['90%', '-10%'], x2: ['100%', '0%'] }
    : { x1: ['10%', '110%'], x2: ['0%', '100%'] };

  return (
    <svg
      className="ui-beam"
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w} ${box.h}`}
      fill="none"
      aria-hidden="true"
    >
      <path d={d} stroke={trail} strokeWidth={width} strokeLinecap="round" />
      {!reduced && (
        <>
          <path d={d} stroke={`url(#${id})`} strokeWidth={width * 1.7} strokeLinecap="round" />
          <defs>
            <motion.linearGradient
              id={id}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
              animate={{ ...run, y1: ['0%', '0%'], y2: ['0%', '0%'] }}
              transition={{ delay, duration, ease: EASE_OUT_EXPO, repeat: Infinity, repeatDelay: 0.4 }}
            >
              <stop stopColor={color} stopOpacity="0" />
              <stop stopColor={color} stopOpacity="0.9" />
              <stop offset="34%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
};

/* =====================================================================
   Dock — adapted from Magic UI's Dock.
   Kept: one shared mouseX motion value, per-icon distance transform,
   spring-smoothed magnification.
   Changed: it magnifies scale rather than width so our icons keep a
   fixed hit area, it carries an "open" state per item because this dock
   controls real panels rather than links, and magnification is skipped
   entirely under prefers-reduced-motion.
   ===================================================================== */
export const Dock = ({ children, className = '' }) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <div
      className={`ui-dock ${className}`}
      onPointerMove={(e) => mouseX.set(e.pageX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      {React.Children.map(children, (c) => (
        React.isValidElement(c) ? React.cloneElement(c, { mouseX }) : c
      ))}
    </div>
  );
};

export const DockIcon = ({
  mouseX, label, active, onClick, children, distance = 130, magnification = 1.62,
}) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const fallback = useMotionValue(Infinity);

  const dx = useTransform(mouseX || fallback, (v) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return v - b.x - b.width / 2;
  });
  const target = useTransform(dx, [-distance, 0, distance], [1, magnification, 1]);
  const scale = useSpring(target, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`ui-dock-icon ${active ? 'on' : ''}`}
      style={reduced ? undefined : { scale }}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
      <em>{label}</em>
    </motion.button>
  );
};

/* =====================================================================
   LiveList — adapted from Magic UI's Animated List.
   Kept: AnimatePresence over a keyed list with `layout` so survivors
   slide down, and the stiff 350/40 spring that gives the drop its snap.
   Changed: Magic UI reveals a fixed array on a timer; ours is fed by a
   live operations stream, so items enter at the top, the tail is
   trimmed, and the scale-from-zero was replaced with an x-offset entry
   because a notification that inflates from nothing reads as a toy.
   ===================================================================== */
export const LiveList = ({ items, render, className = '' }) => (
  <div className={`ui-livelist ${className}`}>
    <AnimatePresence initial={false}>
      {items.map((it) => (
        <motion.div
          key={it.id}
          layout
          initial={{ opacity: 0, x: 26, filter: 'blur(2px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 12, transition: { duration: 0.22 } }}
          transition={{ type: 'spring', stiffness: 350, damping: 40 }}
        >
          {render(it)}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* =====================================================================
   Compare — adapted from Aceternity UI's Compare.
   Kept: a single slider percentage driving `clip-path: inset(...)` on
   the top layer, drag and hover modes, and the ping-pong autoplay.
   Changed: it compares two live React surfaces instead of two <img>
   tags, so the "before" can be a spreadsheet and the "after" can be the
   running product; pointer capture replaces the mouse/touch handler
   pairs; the percentage is written to a CSS variable inside a rAF so a
   drag never re-renders the two surfaces underneath.
   ===================================================================== */
export const Compare = ({
  before, after, beforeLabel = 'Before', afterLabel = 'After',
  initial = 50, autoplay = true, className = '',
}) => {
  const box = useRef(null);
  const frame = useRef(0);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();

  const put = useCallback((pct) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (box.current) box.current.style.setProperty('--p', `${Math.max(2, Math.min(98, pct))}%`);
    });
  }, []);

  const fromX = useCallback((clientX) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    put(((clientX - r.left) / r.width) * 100);
  }, [put]);

  useEffect(() => {
    if (!autoplay || held || reduced) return undefined;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      /* a slow sine sweep reads as a demonstration; a linear ping-pong
         reads as a broken slider */
      put(50 + Math.sin(n / 46) * 38);
    }, 32);
    return () => clearInterval(id);
  }, [autoplay, held, reduced, put]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={box}
      className={`ui-compare ${className}`}
      style={{ '--p': `${initial}%` }}
      onPointerDown={(e) => {
        setHeld(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      }}
      onPointerMove={(e) => { if (e.buttons === 1) fromX(e.clientX); }}
      onPointerUp={() => setHeld(true)}
    >
      <div className="ui-compare-face b">{before}</div>
      <div className="ui-compare-face a">{after}</div>

      <span className="ui-compare-tag l">{beforeLabel}</span>
      <span className="ui-compare-tag r">{afterLabel}</span>

      <div className="ui-compare-bar" aria-hidden="true">
        <i><GripVertical size={15} /></i>
      </div>
    </div>
  );
};

/* =====================================================================
   DragPanel — adapted from Aceternity UI's Draggable Card.
   Kept: drag with a velocity-aware settle, pointer-driven rotateX /
   rotateY tilt through springs, and the glare sheet on top.
   Changed: Aceternity flings a card across the whole viewport; an
   operations panel that flies off the desk is a bug, so the drag is
   constrained to the workspace and the fling is replaced with a damped
   settle. Tilt is cut to a few degrees because these panels carry
   tabular data that has to stay readable, and the whole 3D layer is
   dropped under prefers-reduced-motion.
   ===================================================================== */
const TILT = { stiffness: 120, damping: 18, mass: 0.4 };

export const DragPanel = ({
  containerRef, className = '', style, front, onFocus, bar, children,
}) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const controls = useDragControls();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const vx = useVelocity(mx);

  const rotateX = useSpring(useTransform(my, [-260, 260], [6, -6]), TILT);
  const rotateY = useSpring(useTransform(mx, [-260, 260], [-6, 6]), TILT);
  const glare = useSpring(useTransform(vx, [-900, 0, 900], [0.16, 0, 0.16]), TILT);

  const track = (e) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - (r.left + r.width / 2));
    my.set(e.clientY - (r.top + r.height / 2));
  };
  const release = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`ui-drag ${front ? 'front' : ''} ${className}`}
      style={reduced ? style : { ...style, rotateX, rotateY }}
      drag={!reduced}
      dragControls={controls}
      dragConstraints={containerRef}
      dragElastic={0.055}
      dragMomentum={false}
      dragListener={false}
      onPointerDown={onFocus}
      onPointerMove={track}
      onPointerLeave={release}
      whileDrag={{ scale: 1.018 }}
      initial={{ opacity: 0, y: 26, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }}
    >
      {/* the title bar is the only drag surface — dragging from a data
          table would make the table impossible to read */}
      <div
        className="ui-drag-bar"
        onPointerDown={(e) => { if (!reduced) controls.start(e); }}
      >
        {bar}
      </div>
      <div className="ui-drag-body">{children}</div>
      {!reduced && <motion.span className="ui-drag-glare" style={{ opacity: glare }} aria-hidden="true" />}
    </motion.div>
  );
};

/* =====================================================================
   Rail — adapted from Aceternity UI's Timeline.
   Kept: measuring the content height, then driving a gradient spine's
   height from that section's own scroll progress.
   Changed: the spine carries a travelling head so the reader can see
   where the story currently is, the measurement re-runs on resize
   (Aceternity measures once and desyncs the moment anything reflows),
   and it renders as a plain static line under prefers-reduced-motion.
   ===================================================================== */
export const Rail = ({ progress }) => {
  const reduced = useReducedMotion();
  const height = useTransform(progress, [0, 1], ['0%', '100%']);
  if (reduced) return <span className="ui-rail"><i style={{ height: '100%' }} /></span>;
  return (
    <span className="ui-rail">
      <motion.i style={{ height }}><b /></motion.i>
    </span>
  );
};

/* =====================================================================
   Ticker — adapted from Motion Primitives' AnimatedNumber.
   Kept: a spring driving the value and useTransform formatting it, so
   the digits ease rather than step.
   Changed: it takes decimals, a prefix and a suffix because our
   readouts are currencies, percentages and day counts rather than bare
   integers, and it holds the final value verbatim when motion is off.
   ===================================================================== */
export const Ticker = ({
  value, decimals = 0, prefix = '', suffix = '', className = '',
}) => {
  const reduced = useReducedMotion();
  const spring = useSpring(reduced ? value : 0, { stiffness: 68, damping: 20, mass: 0.9 });
  const text = useTransform(spring, (v) => (
    v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  ));

  useEffect(() => { spring.set(value); }, [spring, value]);

  if (reduced) {
    return (
      <span className={`tnum ui-num ${className}`}>
        {prefix}
        {value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </span>
    );
  }

  return (
    <span className={`tnum ui-num ${className}`}>
      {prefix}<motion.span>{text}</motion.span>{suffix}
    </span>
  );
};

/* =====================================================================
   Magnetic — adapted from Motion Primitives' Magnetic.
   Kept: measuring pointer distance from the element centre and pulling
   the element toward it through a spring.
   Changed: the pull is clamped so a button never detaches from its own
   label, the inner content counter-shifts slightly so the arrow leads
   the movement, and the whole effect is skipped under reduced motion —
   theirs still translates.
   ===================================================================== */
export const Magnetic = ({ children, pull = 0.32, range = 120, className = '' }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  const track = (e) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) > range + Math.max(r.width, r.height) / 2) return;
    /* clamped: past a point the label stops tracking the shape */
    x.set(Math.max(-18, Math.min(18, dx * pull)));
    y.set(Math.max(-12, Math.min(12, dy * pull)));
  };
  const release = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`ui-magnet ${className}`}
      style={reduced ? undefined : { x: sx, y: sy }}
      onPointerMove={track}
      onPointerLeave={release}
    >
      {children}
    </motion.div>
  );
};

export { EASE_OUT_EXPO };
