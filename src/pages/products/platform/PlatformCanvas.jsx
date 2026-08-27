import React, { useEffect, useRef, useState } from 'react';
import { Bell, CirclePlus, RotateCw, UserCheck, XCircle, Zap, Check, FileText } from 'lucide-react';

/* =====================================================================
   THE WORKFLOW CANVAS — the real Emvive builder, as hero background.

   Authored against a 1100 x 560 space, but emitted as PERCENTAGES of
   it — so the figure scales to whatever width it is given and always
   fits, rather than being pinned at a scale that has to be guessed per
   breakpoint (which is how the third branch kept falling off the right
   edge). Type scales with it too, in `cqw` off a container query.

   The connectors are one SVG on the same viewBox, so the elbows meet
   the ports exactly at every size. Every node declares its height here
   rather than letting content set it, because the wires are drawn to
   those numbers — so the heights below are the CONTENT'S measured
   height rounded up, not a guess (the trigger card used to be 108 for
   124px of content, which is why its last line sat on the border).

   Shape is the product's own: trigger, one approval step, then a
   three-way branch — Reject, Revise, Approve — into three steps.
   ===================================================================== */

const W = 1100;
const H = 560;

/* the two stacked nodes down the middle */
const TRIGGER = { x: 550, y: 36, w: 288, h: 138 };
const APPROVE = { x: 550, y: 236, w: 288, h: 72 };

/* the three branches: pill, then the step it leads to */
const BRANCHES = [
  {
    id: 'reject',
    x: 205,
    tone: 'red',
    pill: 'Reject',
    pillIcon: XCircle,
    icon: Bell,
    kind: 'STEP',
    name: 'Send Notification',
  },
  {
    id: 'revise',
    x: 550,
    tone: 'amber',
    pill: 'Revise',
    pillIcon: RotateCw,
    icon: Bell,
    kind: 'STEP',
    name: 'Send Notification',
  },
  {
    id: 'approve',
    x: 895,
    tone: 'green',
    pill: 'Approve',
    pillIcon: Check,
    icon: CirclePlus,
    kind: 'STEP',
    name: 'Create Record',
  },
];

const PILL_Y = 362;
const PILL_H = 36;
const PILL_W = 112;
const STEP_Y = 452;
const STEP_W = 252;
const STEP_H = 72;

/* ---------------------------------------------------------------
   A ROUNDED ELBOW.

   Down from (x0,y0), across at `my`, then down into (x1,y1) — with
   the two corners arced rather than mitred, which is what the builder
   itself draws and the single biggest reason the old figure read as a
   wireframe. Falls back to a straight line when there is nothing to
   turn (the middle branch, which drops straight through).
   --------------------------------------------------------------- */
const elbow = (x0, y0, x1, y1, my, r = 14) => {
  if (x0 === x1) return `M${x0} ${y0} L${x1} ${y1}`;
  const dir = x1 > x0 ? 1 : -1;
  const rr = Math.min(r, Math.abs(x1 - x0) / 2, my - y0, y1 - my);
  return [
    `M${x0} ${y0}`,
    `L${x0} ${my - rr}`,
    `Q${x0} ${my} ${x0 + dir * rr} ${my}`,
    `L${x1 - dir * rr} ${my}`,
    `Q${x1} ${my} ${x1} ${my + rr}`,
    `L${x1} ${y1}`,
  ].join(' ');
};

/* THE WIRES, derived once so the drawn line, the lit state and the
   pulse that runs along it are literally the same path string.
   `stage` is the step of the run that lights the wire up. */
const FORK_Y = APPROVE.y + APPROVE.h + 20;

const WIRES = [
  {
    id: 'w-trigger',
    d: `M${TRIGGER.x} ${TRIGGER.y + TRIGGER.h} L${APPROVE.x} ${APPROVE.y - 9}`,
    head: true,
    stage: 1,
    delay: 0,
  },
  ...BRANCHES.map((b) => ({
    id: `w-${b.id}`,
    d: elbow(APPROVE.x, APPROVE.y + APPROVE.h, b.x, PILL_Y - 7, FORK_Y),
    head: false,
    stage: 2,
    delay: 0.7,
  })),
  ...BRANCHES.map((b) => ({
    id: `s-${b.id}`,
    d: `M${b.x} ${PILL_Y + PILL_H + 2} L${b.x} ${STEP_Y - 9}`,
    head: true,
    stage: 3,
    delay: 1.4,
  })),
];

/* the ports the wires actually leave from and arrive at — the small
   ringed dots on the edge of a node. Drawn in the SVG so they sit on
   the coordinate space the wires do, not on the card's rounded corner. */
const PORTS = [
  { id: 'p1', x: TRIGGER.x, y: TRIGGER.y + TRIGGER.h, stage: 0 },
  { id: 'p2', x: APPROVE.x, y: APPROVE.y, stage: 1 },
  { id: 'p3', x: APPROVE.x, y: APPROVE.y + APPROVE.h, stage: 1 },
  ...BRANCHES.map((b) => ({ id: `p-${b.id}`, x: b.x, y: STEP_Y, stage: 3 })),
];

/* the run walks: trigger -> approval -> pills -> steps, then restarts */
const STAGES = 4;
const STAGE_MS = 1400;

const PlatformCanvas = () => {
  const ref = useRef(null);
  const [stage, setStage] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setStage((n) => (n + 1) % STAGES), STAGE_MS);
    return () => clearTimeout(t);
  }, [onScreen, stage]);

  /* ONE card is live at a time; the ones the run has already passed
     settle into a quieter "done" state. Everything staying lit — which
     is what `stage >= i` did — ended with six orange cards and no
     sense of a run moving through them. */
  const at = (i) => {
    if (stage === i) return ' is-on';
    if (stage > i) return ' is-done';
    return '';
  };

  /* every box as a PERCENTAGE of the canvas, so one width on the
     wrapper scales the whole figure */
  const pc = (v, total) => `${(v / total) * 100}%`;
  const box = (n) => ({
    left: pc(n.x - n.w / 2, W),
    top: pc(n.y, H),
    width: pc(n.w, W),
    height: pc(n.h, H),
  });

  return (
    <div className="pc" ref={ref}>
      {/* ---- the connectors, on the same coordinate space ---- */}
      <svg className="pc-wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="pc-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto">
            <path d="M1.5 1.5 L5.5 4 L1.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <g className="pc-wire-g" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {WIRES.map((w) => (
            <React.Fragment key={w.id}>
              {/* the wire itself — lit while the run is crossing it */}
              <path
                className={`pc-wire${stage >= w.stage ? ' is-live' : ''}`}
                d={w.d}
                markerEnd={w.head ? 'url(#pc-arrow)' : undefined}
              />

              {/* THE TRAVELLING LINE. A second copy of the same path,
                  dashed so that only a short segment is drawn, with the
                  dash offset animated — that segment then runs the
                  length of the wire. Each leg is delayed by how far
                  down the flow it is, so the pulse moves card to card
                  rather than every wire firing at once. */}
              <path
                className="pc-pulse"
                d={w.d}
                pathLength="100"
                style={{ animationDelay: `${w.delay}s` }}
              />
            </React.Fragment>
          ))}

          {/* the ports, on top of the wire ends */}
          {PORTS.map((p) => (
            <circle
              key={p.id}
              className={`pc-port${stage >= p.stage ? ' is-live' : ''}`}
              cx={p.x}
              cy={p.y}
              r="4"
            />
          ))}
        </g>
      </svg>

      {/* ---- the trigger ---- */}
      <div className={`pc-node pc-node--trigger${at(0)}`} style={box(TRIGGER)}>
        <div className="pc-node-head">
          <span className="pc-ic pc-ic--green"><Zap size={13} strokeWidth={2.4} /></span>
          <span className="pc-meta">
            <b>Workflow start</b>
            <i>Trigger</i>
          </span>
          <span className="pc-tag">Live</span>
        </div>

        <div className="pc-rule" />

        <div className="pc-node-sub">
          <p>When a row is created</p>
          <span className="pc-chip">
            <FileText size={11} strokeWidth={2.2} />
            Sales Invoice
          </span>
        </div>
      </div>

      {/* ---- the approval step ---- */}
      <div className={`pc-node${at(1)}`} style={box(APPROVE)}>
        <div className="pc-node-head">
          <span className="pc-ic pc-ic--violet"><UserCheck size={13} strokeWidth={2.4} /></span>
          <span className="pc-meta">
            <b>Step</b>
            <i>Request Approval</i>
          </span>
          <span className="pc-dots" aria-hidden="true"><b /><b /><b /></span>
        </div>
      </div>

      {/* ---- the three outcomes ---- */}
      {BRANCHES.map((b) => {
        const PillIcon = b.pillIcon;
        const Icon = b.icon;
        return (
          <React.Fragment key={b.id}>
            <span
              className={`pc-pill pc-pill--${b.tone}${at(2)}`}
              style={{
                left: pc(b.x - PILL_W / 2, W),
                top: pc(PILL_Y, H),
                width: pc(PILL_W, W),
                height: pc(PILL_H, H),
              }}
            >
              <PillIcon size={11} strokeWidth={2.6} />
              {b.pill}
            </span>

            <div
              className={`pc-node${at(3)}`}
              style={{
                left: pc(b.x - STEP_W / 2, W),
                top: pc(STEP_Y, H),
                width: pc(STEP_W, W),
                height: pc(STEP_H, H),
              }}
            >
              <div className="pc-node-head">
                <span className={`pc-ic pc-ic--${b.tone}`}><Icon size={13} strokeWidth={2.4} /></span>
                <span className="pc-meta">
                  <b>{b.kind}</b>
                  <i>{b.name}</i>
                </span>
                <span className="pc-dots" aria-hidden="true"><b /><b /><b /></span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PlatformCanvas;
