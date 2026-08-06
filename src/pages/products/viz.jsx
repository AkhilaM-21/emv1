import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { EASE } from './motion';
import './viz.css';

/* =====================================================================
   DATA VISUALISATION PRIMITIVES
   Charts are measured in real pixels rather than stretched from a
   viewBox, so strokes, radii and markers stay geometrically correct at
   any width. Colour comes from --accent; nothing here is hard-coded.
   ===================================================================== */

/* Measure the host element so charts can draw in true coordinates. */
export const useSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

/* Catmull-Rom through the points, converted to cubic beziers. Gives a
   curve that actually passes through every value — unlike a naive
   quadratic smoothing, which drifts off the data. */
const smooth = (pts) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
};

const toPoints = (series, w, h, padY) => {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const stepX = w / (series.length - 1 || 1);
  return series.map((v, i) => [
    i * stepX,
    padY + (1 - (v - min) / span) * (h - padY * 2),
  ]);
};

let uid = 0;

/* ---------------------------------------------------------------
   Area chart. The solid section draws itself, the forecast tail
   follows as a dashed continuation, and the handover point is marked.
   --------------------------------------------------------------- */
export const AreaChart = ({ series, forecastFrom, height = 168, padY = 14, showGrid = true }) => {
  const [ref, { w }] = useSize();
  const idRef = useRef(null);
  if (idRef.current === null) { uid += 1; idRef.current = `vz${uid}`; }
  const gid = idRef.current;

  const h = height;
  const pts = w ? toPoints(series, w, h, padY) : [];
  const cut = forecastFrom ?? series.length - 1;

  const solid = pts.length ? smooth(pts.slice(0, cut + 1)) : '';
  const dashed = pts.length && cut < pts.length - 1 ? smooth(pts.slice(cut)) : '';
  const area = solid ? `${solid} L${pts[cut][0].toFixed(2)},${h} L0,${h} Z` : '';
  const marker = pts[cut];

  return (
    <div className="vz-area" ref={ref} style={{ height }}>
      {w > 0 && (
        <svg width={w} height={h} aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {showGrid && [0.25, 0.5, 0.75].map((f) => (
            <line
              key={f} x1="0" y1={h * f} x2={w} y2={h * f}
              className="vz-grid" strokeWidth="1" shapeRendering="crispEdges"
            />
          ))}

          <motion.path
            d={area}
            fill={`url(#${gid})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          />

          <motion.path
            d={solid}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.5, ease: EASE }}
          />

          {dashed && (
            <motion.path
              d={dashed}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.75"
              strokeDasharray="4 5"
              strokeLinecap="round"
              opacity="0.42"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: 1.2, ease: EASE }}
            />
          )}

          {marker && (
            <motion.circle
              cx={marker[0]} cy={marker[1]} r="3.5"
              fill="var(--bg)" stroke="var(--accent)" strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: 1.15, ease: EASE }}
              style={{ transformOrigin: `${marker[0]}px ${marker[1]}px` }}
            />
          )}
        </svg>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   Live bars. Heights animate whenever the values change, which is how
   the hero dashboards read as running rather than rendered.
   --------------------------------------------------------------- */
export const LiveBars = ({ values, height = 120, highlightFrom, gap = 5 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const max = Math.max(...values) || 1;

  return (
    <div className="vz-bars" ref={ref} style={{ height, gap }}>
      {values.map((v, i) => (
        <motion.span
          key={i}
          className={highlightFrom != null && i >= highlightFrom ? 'vz-bar ghost' : 'vz-bar'}
          initial={{ height: 0 }}
          animate={{ height: inView ? `${Math.max(4, (v / max) * 100)}%` : 0 }}
          transition={{
            duration: 0.85,
            delay: inView ? i * 0.035 : 0,
            ease: EASE,
          }}
        />
      ))}
    </div>
  );
};

/* Compact inline sparkline for table rows and stat cells. */
export const Spark = ({ values, width = 68, height = 22 }) => {
  const pts = toPoints(values, width, height, 3);
  return (
    <svg className="vz-spark" width={width} height={height} aria-hidden="true">
      <motion.path
        d={smooth(pts)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </svg>
  );
};

/* ---------------------------------------------------------------
   Ring gauge. Sweeps to its value once, then holds.
   --------------------------------------------------------------- */
export const Ring = ({ value, size = 60, stroke = 5, label }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="vz-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--hair)" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="var(--accent)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.4, ease: EASE }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && <span className="vz-ring-label">{label}</span>}
    </div>
  );
};

/* ---------------------------------------------------------------
   Horizontal meter, used for utilisation and budget rows.
   --------------------------------------------------------------- */
export const Meter = ({ value, tone = 'accent', delay = 0 }) => (
  <span className="vz-meter">
    <motion.i
      className={`vz-meter-fill ${tone}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: Math.max(0.02, value / 100) }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.05, delay, ease: EASE }}
    />
  </span>
);
