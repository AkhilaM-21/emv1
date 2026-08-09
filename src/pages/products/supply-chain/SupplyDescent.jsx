import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CornerDownRight, ChevronUp, Globe, Warehouse, ScanLine } from 'lucide-react';
import { motion, EASE, useInView, useReducedMotion } from '../shared/motion';
import { NetworkScreen, SiteScreen, TaskScreen } from './SupplyApp';
import './SupplyDescent.css';

/* =====================================================================
   THE DESCENT — network → site → task

   The old version of this section piled three screens on top of each
   other as you scrolled. This one does not stack and is not driven by
   scroll at all: you pick a target on the screen in front of you and the
   viewport flies into it.

   The mechanic is a true zoom-through, borrowed from the scroll-zoom
   family (Aceternity's Container Scroll, Apple's keynote deep-dives) and
   rewired to a click: the outgoing level scales up about the exact point
   you chose and fades out, while the next level rises from under it
   through the same origin. Descending and returning are the same
   animation played in opposite directions.

   The chrome is a borehole gauge down the left edge rather than tabs —
   depth, not tabs, is what this section is about.
   ===================================================================== */

const LEVELS = [
  {
    id: 'network',
    icon: Globe,
    depth: 'Level 01',
    name: 'Network',
    scale: '42 lanes · 9 sites',
    title: 'Every shipment, every lane.',
    line: 'Three hundred and forty-two shipments moving across forty-two lanes. Exceptions surface themselves — nobody runs a report to find them.',
    /* Where the next level lives on this screen, as a fraction of the
       viewport — measured off the real rows, not guessed. The zoom
       pivots here, so it has to sit on the thing being opened: the
       inbound shipment bound for Riyadh, then the wave inside it. */
    into: { x: 0.48, y: 0.288, label: 'Riyadh DC', sub: 'Open the site' },
  },
  {
    id: 'site',
    icon: Warehouse,
    depth: 'Level 02',
    name: 'Site',
    scale: '312 bins · 39 pickers',
    title: 'Then inside one building.',
    line: 'Dock schedule, open waves, bin utilisation and the labour on shift — the screen a distribution centre is actually run from.',
    into: { x: 0.314, y: 0.416, label: 'Wave 42', sub: 'Open the wave' },
  },
  {
    id: 'task',
    icon: ScanLine,
    depth: 'Level 03',
    name: 'Task',
    scale: '186 lines · 1 handheld',
    title: 'Then into a picker’s hand.',
    line: 'The same system, on a scanner. Bin, SKU, quantity, FEFO batch. Every scan moves the ledger the moment it happens.',
    into: null,
  },
];

const ZOOM = 2.35;

export const Descent = ({ live }) => {
  const hostRef = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(hostRef, { margin: '-25% 0px -25% 0px' });
  const [level, setLevel] = useState(0);
  const [dir, setDir] = useState(1);
  const touched = useRef(false);

  const go = useCallback((next) => {
    setDir(next > level ? 1 : -1);
    setLevel(next);
  }, [level]);

  const take = useCallback((next) => {
    touched.current = true;
    go(next);
  }, [go]);

  /* it descends once on its own so the reader sees what the section
     does, then hands over and never moves again */
  useEffect(() => {
    if (!inView || reduced || touched.current || level > 0) return undefined;
    const t = setTimeout(() => { if (!touched.current) go(1); }, 2600);
    return () => clearTimeout(t);
  }, [inView, reduced, level, go]);

  const L = LEVELS[level];
  const screens = [
    <NetworkScreen key="network" live={live} />,
    <SiteScreen key="site" live={live} />,
    <TaskScreen key="task" />,
  ];

  /* the pivot for the flight is the point that was clicked on the way
     down, so returning lands the reader back where they left */
  const pivot = dir > 0
    ? (LEVELS[Math.max(0, level - 1)].into || { x: 0.5, y: 0.5 })
    : (L.into || { x: 0.5, y: 0.5 });

  return (
    <section className="dc" id="drill" ref={hostRef}>
      <div className="dc-inner">
        <header className="dc-head">
          <span className="dc-kick">The drill-down</span>
          <h2>
            One system, three depths.
            <em> Fly into it.</em>
          </h2>
        </header>

        <div className="dc-body">
          {/* --- borehole gauge --- */}
          <nav className="dc-gauge" aria-label="Depth">
            <span className="dc-gauge-line" aria-hidden="true">
              <motion.i
                animate={{ height: `${(level / (LEVELS.length - 1)) * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
              />
            </span>

            {LEVELS.map((lv, i) => {
              const Icon = lv.icon;
              return (
                <button
                  type="button"
                  key={lv.id}
                  className={`dc-stop ${i === level ? 'on' : ''} ${i < level ? 'past' : ''}`}
                  onClick={() => take(i)}
                  aria-current={i === level ? 'step' : undefined}
                >
                  <span className="dc-stop-dot"><Icon size={12} /></span>
                  <span className="dc-stop-t">
                    <u>{lv.depth}</u>
                    <b>{lv.name}</b>
                    <em>{lv.scale}</em>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* --- the viewport you fly through --- */}
          <div className="dc-port">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                className="dc-layer"
                key={L.id}
                style={{ transformOrigin: `${pivot.x * 100}% ${pivot.y * 100}%` }}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: dir > 0 ? 0.62 : ZOOM }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: dir > 0 ? ZOOM : 0.62 }}
                transition={{ duration: reduced ? 0 : 0.86, ease: EASE }}
              >
                {screens[level]}
              </motion.div>
            </AnimatePresence>

            {/* the target you are about to fly into */}
            {L.into && (
              <motion.button
                type="button"
                className="dc-target"
                key={`t-${L.id}`}
                style={{ left: `${L.into.x * 100}%`, top: `${L.into.y * 100}%` }}
                onClick={() => take(level + 1)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.7, ease: EASE }}
              >
                <span className="dc-target-box" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="dc-target-tag">
                  <CornerDownRight size={12} />
                  <b>{L.into.label}</b>
                  {L.into.sub}
                </span>
              </motion.button>
            )}

            {level > 0 && (
              <button type="button" className="dc-up" onClick={() => take(level - 1)}>
                <ChevronUp size={13} /> Back to {LEVELS[level - 1].name.toLowerCase()}
              </button>
            )}

            {/* the caption rides on the screen instead of sitting in its
                own column beside it */}
            <div className="dc-caption">
              <AnimatePresence mode="wait">
                <motion.div
                  key={L.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                >
                  <h3>{L.title}</h3>
                  <p>{L.line}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Descent;
