import React from 'react';

/* =====================================================================
   THE FIELD — TRANSLUCENT LAYERS

   Sheets of glass crossing the fold at shallow angles.

   The thing that makes this read as planes rather than as shapes: every
   sheet is far larger than the hero and anchored outside it, so what
   you see is never a rectangle — only the one or two edges that happen
   to cross the visible area. A sheet sized to the viewport reads as a
   card; a sheet three times the viewport reads as a plane passing
   through it.

   Each sheet is soft in the body and crisp at the edge. The body is a
   near-transparent gradient that fades out along its length, so no
   sheet ever ends in a visible hard stop; the edge is a single bright
   hairline, which is the refraction. Where two sheets cross, their
   alpha compounds and the overlap sits a shade denser than either.

   Two families, and only two: three sheets at +21° and two at -26°.
   Within a family the angle never varies and the offset steps evenly,
   so their lit edges land as parallel lines rather than as five
   unrelated diagonals. That is the whole difference between a
   composition and a scatter.

   Two elements per sheet: the outer carries position and drift, the
   inner carries rotation and glass. A single element cannot animate
   part of its transform while holding the rest.
   ===================================================================== */

/* w/h in vw, x/y in % of the fold. Everything is oversized on purpose —
   see above. `tone` picks the tint, `lit` puts the hairline on the edge
   that actually crosses the frame. */
const PLANES = [
  /* family A — parallel, stepping down the fold */
  { k: 'a1', w: 170, h: 56, x: -18, y: -50, r: 21, tone: 'plain', lit: 'b' },
  { k: 'a2', w: 170, h: 50, x: -14, y: 8, r: 21, tone: 'cool', lit: 'b' },
  { k: 'a3', w: 170, h: 46, x: -10, y: 66, r: 21, tone: 'plain', lit: 't' },

  /* family B — the counter-angle, crossing them twice */
  { k: 'b1', w: 96, h: 132, x: 46, y: -50, r: -26, tone: 'violet', lit: 'l' },
  { k: 'b2', w: 88, h: 126, x: 78, y: -18, r: -26, tone: 'cool', lit: 'l' },
];

const FinanceField = () => (
  <div className="fh-field" aria-hidden="true">
    {PLANES.map((p, i) => (
      <span
        className="fh-plane"
        key={p.k}
        style={{
          width: `${p.w}vw`,
          height: `${p.h}vw`,
          left: `${p.x}%`,
          top: `${p.y}%`,
          animationDelay: `${i * -7}s`,
          animationDuration: `${38 + i * 5}s`,
        }}
      >
        <i
          className={`fh-glass ${p.tone} lit-${p.lit}`}
          style={{ transform: `rotate(${p.r}deg)` }}
        />
      </span>
    ))}
  </div>
);

export default FinanceField;
