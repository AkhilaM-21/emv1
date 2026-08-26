import React, { useMemo } from 'react';

/* =====================================================================
   GLASS PANELS — a row of cards receding to a vanishing point, one of
   them lit. Drawn, not rendered: pure SVG off a pinhole camera.

   THE CAMERA. Each panel sits at a world position that steps evenly
   along both X and Z:

       X = X0 + i·dx        Z = Z0 + i·dz

   and is divided through by depth, p = f / Z. That single division is
   what does all the work — panels shrink, their spacing closes up, and
   the row converges on a vanishing point at

       x = CX + (dx / dz) · f

   Stepping the screen positions directly instead would need each of
   those three to be faked separately, and they would not agree.

   THE LIT PANEL is not a different colour so much as a different
   material: it takes the pale fill, sits a little proud of its slot,
   and carries the one strong glow in the figure. Everything else is
   translucent, so the row reads as glass with a light in it rather
   than as a chart with a highlighted bar.
   ===================================================================== */

const PANELS = 26;

/* the camera */
const F = 900;      // focal length
const Z0 = 620;     // depth of the nearest panel
const DZ = 104;     // depth step
const X0 = -430;    // world X of the nearest panel
const DX = 92;      // world X step
const CX = 600;     // where the camera axis lands on screen
const CY = 372;     // and the height it converges to

const LIT = 3;      // which panel carries the light — a third of
                    // the way in, as the reference has it, not mid-frame

const GlassPanels = ({
  accent = '#f0883e',
  deep = '#d6461a',
  className = '',
}) => {
  const W = 1200;
  const H = 700;

  const panels = useMemo(() => {
    const out = [];

    for (let i = 0; i < PANELS; i += 1) {
      const z = Z0 + i * DZ;
      const p = F / z;                 // the perspective divide

      const isLit = i === LIT;

      /* THE LIT PANEL IS RAISED, NOT ENLARGED.

         Every panel in the row is the same size at its own depth and
         sits on one baseline; the lit one is lifted straight up out of
         that line by a quarter of its own height. Scaling it instead —
         which is what this did first — reads as "nearer", not as
         "picked out", and the row loses its baseline. */
      const grow = 1;
      const lift = isLit ? 0.26 : 0;

      /* A WIDE face, not a sliver. At 40 world units the cards came
         out narrower than their own corner radius and read as pills;
         these are rounded squares, and at this width they overlap
         their neighbours the way the reference's do — you see a slice
         of each and the whole of the front one and the lit one. */
      const w = 172 * p * grow;
      const h = 250 * p * grow;
      const x = CX + (X0 + i * DX) * p;
      const y = CY + 62 * p - h * lift;   // the baseline, minus the lift

      out.push({
        i,
        isLit,
        p,
        x: +x.toFixed(2),
        y: +y.toFixed(2),
        w: +w.toFixed(2),
        h: +h.toFixed(2),
        /* the card's own thickness, shown as a slab behind its face */
        t: +(13 * p).toFixed(2),
        r: +(34 * p).toFixed(2),   // corner radius, in perspective too
      });
    }

    /* far panels first, so nearer ones overlap them */
    return out.reverse();
  }, []);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* the ground the row stands on */}
        <linearGradient id="gp-bg" x1="0.15" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#8a3008" />
          <stop offset="42%" stopColor="#5a1c05" />
          <stop offset="100%" stopColor="#2e0d02" />
        </linearGradient>

        {/* the light in the room, pooled behind the row */}
        <radialGradient id="gp-glow" cx="0.66" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#ffc79b" stopOpacity="0.6" />
          <stop offset="38%" stopColor={accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>

        {/* an ordinary panel: lit down its leading edge, falling away */}
        <linearGradient id="gp-face" x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0%" stopColor="#ffcda6" stopOpacity="0.62" />
          <stop offset="45%" stopColor={accent} stopOpacity="0.42" />
          <stop offset="100%" stopColor={deep} stopOpacity="0.34" />
        </linearGradient>

        {/* the lit one — pale rather than saturated, which is what
            makes it read as brighter and not merely as another hue */}
        <linearGradient id="gp-lit" x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0%" stopColor="#fff6ef" stopOpacity="0.98" />
          <stop offset="50%" stopColor="#ffd0ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
        </linearGradient>

        {/* the card's thickness — always darker than its face */}
        <linearGradient id="gp-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={deep} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7a2408" stopOpacity="0.95" />
        </linearGradient>

        <filter id="gp-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>

        <filter id="gp-halo" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#gp-bg)" />
      <rect width={W} height={H} fill="url(#gp-glow)" />

      {/* the pool of light the row is standing in */}
      <ellipse
        cx={W * 0.66}
        cy={H * 0.62}
        rx={W * 0.36}
        ry={H * 0.2}
        fill={accent}
        opacity="0.28"
        filter="url(#gp-soft)"
      />

      {panels.map((d) => (
        /* the whole card leans, rather than each face being redrawn as
           a parallelogram — at this angle the two are indistinguishable
           and this keeps the corner radius honest */
        <g key={d.i} transform={`rotate(-4 ${d.x} ${d.y})`}>
          {/* the halo the lit panel throws onto its neighbours */}
          {d.isLit && (
            <rect
              x={d.x - d.w / 2}
              y={d.y - d.h / 2}
              width={d.w}
              height={d.h}
              rx={d.r}
              fill="#ffd9bd"
              opacity="0.75"
              filter="url(#gp-halo)"
            />
          )}

          {/* thickness, offset back and to the left of the face */}
          <rect
            x={d.x - d.w / 2 - d.t}
            y={d.y - d.h / 2 + d.t * 0.5}
            width={d.w}
            height={d.h}
            rx={d.r}
            fill="url(#gp-edge)"
            opacity={d.isLit ? 0.92 : 0.6}
          />

          {/* the face */}
          <rect
            x={d.x - d.w / 2}
            y={d.y - d.h / 2}
            width={d.w}
            height={d.h}
            rx={d.r}
            fill={d.isLit ? 'url(#gp-lit)' : 'url(#gp-face)'}
            stroke={d.isLit ? '#fff3e8' : '#ffb98a'}
            strokeOpacity={d.isLit ? 0.95 : 0.42}
            strokeWidth={Math.max(0.6, 1.6 * d.p)}
          />
        </g>
      ))}
    </svg>
  );
};

export default GlassPanels;
