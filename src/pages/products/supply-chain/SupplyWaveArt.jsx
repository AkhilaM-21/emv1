import React, { useMemo } from 'react';

/* =====================================================================
   HALFTONE WAVE — drawn, not photographed.

   A grid of ellipses warped by a wave field. Two things vary per cell
   and they are what make it read as a wave rather than as a dot grid:

     WIDTH   a mark in a quiet part of the field is a thin sliver; in
             a loud one it swells to a round dot. Only the across-axis
             moves — the along-axis stays put — so every mark keeps the
             same length and the eye reads the change as depth rather
             than as scale.

     ANGLE   each mark lies along the slope of its own row, which is
             what bends the rows into flowing bands. A fixed angle
             gives a plaid; an angle read off a field GRADIENT gives a
             pinwheel, because the gradient reverses at every zero
             crossing of the field.

   Everything is pure maths off (i, j) — no randomness — so the figure
   is identical on every render and between server and client.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE ROW WARP.

   Each row of the grid is pushed up and down by this. It is what
   bends the rows into flowing bands — and because the marks take
   their angle from its SLOPE rather than from a gradient direction,
   the angle never flips sign, so the bands stay continuous. (Reading
   the angle off a field gradient was the first attempt; the gradient
   reverses across every zero crossing and the figure came out as a
   pinwheel of seams rather than as a wave.)
   --------------------------------------------------------------- */
const warp = (u, v, phase) =>
  0.085 * Math.sin(u * 4.1 + v * 1.05 + phase)
  + 0.042 * Math.sin(u * 2.0 - v * 3.1 + phase * 0.7);

/* the separate field that decides how fat a mark is — smooth, and
   nothing to do with position on the grid */
const weight = (u, v, phase) =>
  0.5 + 0.5 * Math.sin(u * 3.6 + Math.sin(v * 2.4 + phase) * 1.7 - v * 1.35);

const HalftoneWave = ({
  color = '#e2601f',
  phase = 0,
  cols = 84,
  rows = 50,
  className = '',
}) => {
  /* The viewBox matches the frame's own 12:7, so nothing has to be
     cropped to fill it. It was 12:10 sliced into a 12:7 frame before,
     which threw away the top and bottom of the figure and magnified
     what was left — the wave could not be read as a whole. */
  const W = 1200;
  const H = 700;

  const dots = useMemo(() => {
    const out = [];
    const stepX = W / (cols - 1);
    const stepY = H / (rows - 1);
    /* The mark's half-length. At 0.66 of the step the marks were
       wider than the grid spacing and every row fused into one
       continuous chain; the reference keeps clear white between them,
       so this has to stay under half the step. */
    const R = Math.min(stepX, stepY) * 0.44;
    const h = 0.004;

    for (let j = 0; j < rows; j += 1) {
      for (let i = 0; i < cols; i += 1) {
        const u = i / (cols - 1);
        const v = j / (rows - 1);

        /* the row, pushed off its line */
        const y = (v + warp(u, v, phase)) * H;
        const x = u * W;

        /* the row's own slope, in pixels per pixel */
        const dWarp = (warp(u + h, v, phase) - warp(u - h, v, phase)) / (2 * h);
        const angle = (Math.atan2(dWarp * H, W) * 180) / Math.PI;

        const n = weight(u, v, phase);

        /* Where the figure is loudest: building to the right, and
           peaking in a band a little below the middle. The whole
           viewBox is visible now, so this is the whole composition —
           nothing is cropped off the ends. */
        const uFall = Math.min(1, 0.26 + u * 1.05);
        const vFall = Math.exp(-Math.pow((v - 0.58) / 0.4, 2));
        const fall = uFall * (0.3 + 0.7 * vFall);
        /* squared rather than ^1.5: the reference holds far more white,
           with the weight concentrated in a few bands */
        const a = Math.min(1, Math.pow(n, 1.9) * fall * 1.5);

        if (a < 0.03) continue;

        out.push({
          k: `${i}-${j}`,
          x: +x.toFixed(2),
          y: +y.toFixed(2),
          rx: +(R * (0.92 + 0.08 * a)).toFixed(2),
          ry: +(R * (0.09 + 0.91 * a)).toFixed(2),
          r: +angle.toFixed(1),
          o: +(0.05 + a * 0.95).toFixed(3),
        });
      }
    }
    return out;
  }, [cols, rows, phase]);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>
        {dots.map((d) => (
          <ellipse
            key={d.k}
            cx={d.x}
            cy={d.y}
            rx={d.rx}
            ry={d.ry}
            opacity={d.o}
            transform={`rotate(${d.r} ${d.x} ${d.y})`}
          />
        ))}
      </g>
    </svg>
  );
};

export default HalftoneWave;
