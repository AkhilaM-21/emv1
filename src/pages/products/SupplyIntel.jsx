import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate } from 'framer-motion';
import {
  Activity, Sparkles, TriangleAlert, Lightbulb, Check, RotateCcw, X, ChevronRight,
} from 'lucide-react';
import { motion, EASE, useInView, useReducedMotion } from './motion';
import { useSize } from './viz';
import { Beam, Ticker } from './SupplyUI';
import './SupplyIntel.css';

/* =====================================================================
   PREDICTIVE INTELLIGENCE — the decision chain

   Not an analytics panel. One instrument that walks the reader through
   the five states a planning decision actually passes through, and then
   hands them the decision:

     DEMAND → PREDICTION → RISK → RECOMMENDATION → ACTION

   The chain runs on the Beam primitive (adapted from Magic UI's
   Animated Beam) — a beam only lights once its stage has been reached,
   so the diagram is a progress indicator rather than decoration.

   The payoff is real: pressing Approve morphs the cover curve, closes
   the shortage window on the chart and re-runs every number underneath.
   Nothing about this section is true until the reader acts on it.
   ===================================================================== */

const WEEKS = 20;
const CUT = 9;
const CH = 330;

const DEMAND = [42, 45, 44, 49, 52, 50, 57, 55, 61, 64, 68, 74, 79, 83, 86, 88, 91, 93, 96, 99];
const COVER_NOW = [96, 94, 93, 90, 88, 86, 84, 81, 79, 77, 74, 71, 68, 66, 63, 61, 58, 56, 54, 52];
const COVER_FIX = [96, 94, 93, 90, 88, 86, 84, 81, 79, 77, 79, 88, 94, 97, 100, 103, 105, 108, 111, 114];

const STAGES = [
  {
    k: 'demand', label: 'Demand', icon: Activity,
    head: 'Ten weeks of actual offtake.',
    body: 'Every sale across 212 outlets, netted against returns and posted to the same stock ledger the warehouse writes to. No extract, no reconciliation, no lag.',
    stat: [['Average weekly offtake', 49.9, ' idx'], ['Growth against last quarter', 18.4, '%']],
  },
  {
    k: 'prediction', label: 'AI prediction', icon: Sparkles,
    head: 'Modelled ten weeks forward.',
    body: 'The model is fitted on your own seasonality, promotion calendar and the lead times your suppliers actually delivered — not the ones they quoted.',
    stat: [['Forecast accuracy, trailing', 94.2, '%'], ['Projected week 20 demand', 99.0, ' idx']],
  },
  {
    k: 'risk', label: 'Risk', icon: TriangleAlert,
    head: 'Cover crosses demand in week 12.',
    body: 'At the current reorder point, available cover falls under projected demand for eight consecutive weeks. Al Faisal’s lead time has drifted +2.4 days over six weeks, which is what moves the crossing forward.',
    stat: [['Weeks exposed', 8, ''], ['Revenue at risk', 184, 'k SAR']],
  },
  {
    k: 'recommendation', label: 'Recommendation', icon: Lightbulb,
    head: 'Raise PO-8846 three days early.',
    body: 'Ordering on the 14th instead of the 17th, at 1.4× the standing quantity, closes the window entirely. Meridian can absorb the overflow at +2% if Al Faisal slips again.',
    stat: [['Confidence', 94, '%'], ['Working capital impact', 242, 'k SAR']],
  },
  {
    k: 'action', label: 'Action', icon: Check,
    head: 'Plan updated. Window closed.',
    body: 'PO-8846 is raised and acknowledged, the reorder point for SKU-44192 is rewritten, and the wave plan for Riyadh has been rebuilt around the new receipt date. Every downstream site sees it now.',
    stat: [['Weeks exposed', 0, ''], ['Cover restored to', 114, ' idx']],
  },
];

export const PredictiveIntel = () => {
  const hostRef = useRef(null);
  const chainRef = useRef(null);
  const nodeRefs = useRef(STAGES.map(() => React.createRef()));
  const [plotRef, { w }] = useSize();
  const reduced = useReducedMotion();
  const inView = useInView(hostRef, { margin: '-18% 0px -18% 0px' });

  const [stage, setStage] = useState(0);
  const [k, setK] = useState(0);
  const [hoverWeek, setHoverWeek] = useState(null);

  const approved = stage === 4;

  /* it walks itself as far as the recommendation, then waits — the last
     step belongs to the reader */
  useEffect(() => {
    if (!inView || reduced || stage >= 3) return undefined;
    const t = setTimeout(() => setStage((s) => Math.min(3, s + 1)), 3400);
    return () => clearTimeout(t);
  }, [inView, reduced, stage]);

  const approve = () => {
    setStage(4);
    if (reduced) { setK(1); return; }
    animate(0, 1, { duration: 1.05, ease: EASE, onUpdate: setK });
  };

  const reset = () => {
    setStage(0);
    if (reduced) { setK(0); return; }
    animate(k, 0, { duration: 0.5, ease: EASE, onUpdate: setK });
  };

  const cover = useMemo(
    () => COVER_NOW.map((v, i) => v + (COVER_FIX[i] - v) * k),
    [k]
  );

  const geo = useMemo(() => {
    if (!w) return null;
    const padT = 18;
    const padB = 26;
    const X = (i) => (i / (WEEKS - 1)) * w;
    const Y = (v) => padT + (1 - (v - 30) / (125 - 30)) * (CH - padT - padB);
    const line = (arr, from = 0, to = WEEKS - 1) => arr
      .slice(from, to + 1)
      .map((v, j) => `${j === 0 ? 'M' : 'L'}${X(from + j).toFixed(1)},${Y(v).toFixed(1)}`)
      .join('');

    /* the shortage window is the area between the two curves wherever
       cover sits under demand — it shrinks to nothing as k reaches 1 */
    let gap = '';
    const lo = [];
    const hi = [];
    for (let i = CUT; i < WEEKS; i += 1) {
      if (cover[i] < DEMAND[i]) {
        lo.push(`${X(i).toFixed(1)},${Y(DEMAND[i]).toFixed(1)}`);
        hi.unshift(`${X(i).toFixed(1)},${Y(cover[i]).toFixed(1)}`);
      }
    }
    if (lo.length > 1) gap = `M${lo.join('L')}L${hi.join('L')}Z`;

    const cross = DEMAND.findIndex((d, i) => i >= CUT && cover[i] < d);

    return {
      X, Y,
      hist: line(DEMAND, 0, CUT),
      histArea: `${line(DEMAND, 0, CUT)}L${X(CUT).toFixed(1)},${(CH - padB).toFixed(1)}L0,${(CH - padB).toFixed(1)}Z`,
      proj: line(DEMAND, CUT, WEEKS - 1),
      cover: line(cover),
      gap,
      cross,
      grid: [30, 55, 80, 105].map((v) => ({ v, y: Y(v) })),
      base: CH - padB,
    };
  }, [w, cover]);

  const track = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (WEEKS - 1));
    setHoverWeek(Math.max(0, Math.min(WEEKS - 1, i)));
  };

  const S = STAGES[stage];
  const SIcon = S.icon;

  return (
    <section className="in" id="intelligence" ref={hostRef}>
      <div className="in-inner">
        <header className="in-head">
          <span className="in-kick"><Sparkles size={12} /> Predictive intelligence</span>
          <h2>
            It does not report the shortage.
            <em> It removes it.</em>
          </h2>
        </header>

        {/* ---------- the chain ---------- */}
        <div className="in-chain" ref={chainRef}>
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                type="button"
                key={s.k}
                ref={nodeRefs.current[i]}
                className={`in-node ${i === stage ? 'on' : ''} ${i < stage ? 'done' : ''}`}
                onClick={() => (i === 4 ? approve() : setStage(i))}
                aria-current={i === stage ? 'step' : undefined}
              >
                <span className="in-node-ic"><Icon size={14} /></span>
                <span className="in-node-t">
                  <u>{String(i + 1).padStart(2, '0')}</u>
                  {s.label}
                </span>
              </button>
            );
          })}

          {/* one beam per hop, lit only once its stage is reached */}
          {STAGES.slice(0, -1).map((s, i) => (
            stage > i ? (
              <Beam
                key={s.k}
                containerRef={chainRef}
                fromRef={nodeRefs.current[i]}
                toRef={nodeRefs.current[i + 1]}
                curvature={0}
                duration={2.4}
                delay={i * 0.12}
                width={1.4}
                color={i === 3 ? '#16a34a' : 'var(--accent)'}
                trail="transparent"
              />
            ) : null
          ))}
        </div>

        {/* ---------- the instrument ---------- */}
        <div className={`in-body ${approved ? 'ok' : ''}`}>
          <div className="in-plot">
            {/* the measured box and the pointer box have to be the same
                element — measuring the padded wrapper put every hover
                reading two weeks out */}
            <div
              className="in-canvas"
              ref={plotRef}
              onPointerMove={track}
              onPointerLeave={() => setHoverWeek(null)}
            >
            {w > 0 && geo && (
              <svg width={w} height={CH} role="img" aria-label="Projected demand against available cover">
                <defs>
                  <linearGradient id="hzGradIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.13" />
                    <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* gridlines carry their index value — a chart with no
                    scale is a decoration */}
                {geo.grid.map((g) => (
                  <g key={g.v}>
                    <line x1="0" y1={g.y} x2={w} y2={g.y} className="in-grid" />
                    <text x={w - 2} y={g.y - 4} textAnchor="end" className="in-tickv">{g.v}</text>
                  </g>
                ))}
                <line x1="0" y1={geo.base} x2={w} y2={geo.base} className="in-axis" />

                {/* the forecast half is tinted from the start, so the
                    plate never reads as half-drawn while the chain is
                    still on its first stage */}
                <rect
                  x={geo.X(CUT)} y="0"
                  width={Math.max(0, w - geo.X(CUT))} height={geo.base}
                  className="in-future"
                />
                <line x1={geo.X(CUT)} y1="0" x2={geo.X(CUT)} y2={geo.base} className="in-cut" />
                <text x={geo.X(CUT) + 6} y="14" className="in-cut-t">forecast</text>

                {/* the shortage window */}
                <AnimatePresence>
                  {stage >= 2 && geo.gap && (
                    <motion.path
                      d={geo.gap}
                      className="in-gap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                </AnimatePresence>

                <motion.path
                  d={geo.histArea}
                  className="in-histfill"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={reduced ? undefined : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: EASE }}
                />

                {/* weight under the history, so the drawn half of the
                    chart carries the eye */}
                <motion.path
                  d={geo.histArea}
                  className="in-histfill"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={reduced ? undefined : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: EASE }}
                />

                {/* demand — history always, forecast from stage 1 */}
                <motion.path
                  d={geo.hist}
                  className="in-demand"
                  initial={reduced ? false : { pathLength: 0 }}
                  whileInView={reduced ? undefined : { pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE }}
                />
                {stage >= 1 && (
                  <motion.path
                    d={geo.proj}
                    className="in-demand proj"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={reduced ? undefined : { pathLength: 1 }}
                    transition={{ duration: 1, ease: EASE }}
                  />
                )}

                {/* cover — appears with the risk stage, then morphs on approval */}
                {stage >= 2 && (
                  <motion.path
                    d={geo.cover}
                    className="in-cover"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={reduced ? undefined : { pathLength: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />
                )}

                {/* the crossing marker */}
                {stage >= 2 && geo.cross > -1 && !approved && (
                  <g className="in-cross">
                    <line x1={geo.X(geo.cross)} y1="0" x2={geo.X(geo.cross)} y2={geo.base} />
                    <circle cx={geo.X(geo.cross)} cy={geo.Y(DEMAND[geo.cross])} r="5" />
                    <text x={geo.X(geo.cross) + 8} y={geo.Y(DEMAND[geo.cross]) - 10}>
                      stockout opens · W{geo.cross + 1}
                    </text>
                  </g>
                )}

                {/* cursor readout */}
                {hoverWeek !== null && (
                  <g className="in-cursor">
                    <line x1={geo.X(hoverWeek)} y1="0" x2={geo.X(hoverWeek)} y2={geo.base} />
                    <circle cx={geo.X(hoverWeek)} cy={geo.Y(DEMAND[hoverWeek])} r="3.5" />
                    {stage >= 2 && <circle cx={geo.X(hoverWeek)} cy={geo.Y(cover[hoverWeek])} r="3.5" className="c" />}
                  </g>
                )}
              </svg>
            )}

            {hoverWeek !== null && geo && (
              <div
                className="in-tip"
                style={{ left: geo.X(hoverWeek), top: 0 }}
              >
                <b>W{hoverWeek + 1}</b>
                <span>Demand <u>{DEMAND[hoverWeek].toFixed(0)}</u></span>
                {stage >= 2 && <span>Cover <u className={cover[hoverWeek] < DEMAND[hoverWeek] ? 'bad' : 'ok'}>{cover[hoverWeek].toFixed(0)}</u></span>}
              </div>
            )}
            </div>

            <div className="in-ruler" aria-hidden="true">
              {Array.from({ length: WEEKS }).map((_, i) => (
                <span key={i} className={i === CUT ? 'now' : ''}>
                  {i % 4 === 0 ? `W${i + 1}` : i === CUT ? 'today' : ''}
                </span>
              ))}
            </div>

            <div className="in-legend">
              <span><i className="d" />Demand</span>
              {stage >= 1 && <span><i className="p" />Modelled forward</span>}
              {stage >= 2 && <span><i className="c" />Available cover</span>}
              {stage >= 2 && !approved && <span><i className="g" />Exposure</span>}
              <span className="in-legend-hint">Hover the chart</span>
            </div>

            {/* what the model is reading — the reason to believe the
                curve, sitting under the curve */}
            <div className="in-inputs">
              <span className="in-inputs-k">Fitted on</span>
              {[
                ['Offtake history', '104 weeks'],
                ['Delivered lead time', '1,284 receipts'],
                ['Promotion calendar', '38 events'],
                ['Supplier variance', '9 vendors'],
              ].map(([label, v]) => (
                <div key={label}><b>{label}</b><em>{v}</em></div>
              ))}
            </div>
          </div>

          {/* ---------- the narration, morphing per stage ---------- */}
          <aside className="in-say">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={S.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
              >
                <span className={`in-say-k ${S.k}`}><SIcon size={11} />{S.label}</span>
                <h3>{S.head}</h3>
                <p>{S.body}</p>

                <dl className="in-say-stat">
                  {S.stat.map(([label, v, u]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd><Ticker value={v} decimals={String(v).includes('.') ? 1 : 0} suffix={u} /></dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>

            <div className="in-act">
              {stage < 3 && (
                <button type="button" className="in-btn ghost" onClick={() => setStage((s) => Math.min(3, s + 1))}>
                  Next step <ChevronRight size={14} />
                </button>
              )}
              {stage === 3 && (
                <>
                  <button type="button" className="in-btn go" onClick={approve}>
                    <Check size={14} /> Approve the plan
                  </button>
                  <button type="button" className="in-btn ghost" onClick={() => setStage(2)}>
                    <X size={14} /> Not now
                  </button>
                </>
              )}
              {approved && (
                <>
                  <span className="in-done"><Check size={13} /> Applied to 9 sites</span>
                  <button type="button" className="in-btn ghost" onClick={reset}>
                    <RotateCcw size={13} /> Run it again
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PredictiveIntel;
