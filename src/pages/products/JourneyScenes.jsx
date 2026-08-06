import React, { useEffect, useMemo, useState } from 'react';
import { geoNaturalEarth1, geoPath, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import { motion } from 'framer-motion';
import { EASE } from './motion';
import { useSize } from './viz';
import './JourneyScenes.css';

/* =====================================================================
   THE EIGHT ENVIRONMENTS
   Each stage of the consignment's transit is a full-viewport world, not
   a panel on a page. They share no layout with one another and none of
   them is a card, a grid of features or a chart.
   ===================================================================== */

/* ---------------------------------------------------------------
   00 · ORIGIN — the planet, one pin
   --------------------------------------------------------------- */
const PORTS = {
  plant: [46.72, 24.71], jebelAli: [55.06, 25.01], dammam: [50.1, 26.43],
  jeddah: [39.2, 21.49], yantian: [114.06, 22.54], rotterdam: [4.48, 51.92],
  singapore: [103.82, 1.35],
};

export const useWorld = () => {
  const [land, setLand] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch('/countries-110m.json')
      .then((r) => r.json())
      .then((w) => { if (alive) setLand(feature(w, w.objects.countries)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return land;
};

export const SceneOrigin = ({ active }) => {
  const [ref, { w, h }] = useSize();
  const land = useWorld();

  const { paths, project } = useMemo(() => {
    if (!land || !w || !h) return { paths: [], project: null };
    const pr = geoNaturalEarth1().fitExtent([[w * 0.04, h * 0.06], [w * 0.96, h * 0.94]], land);
    const gen = geoPath(pr);
    return { paths: land.features.map((f, i) => ({ d: gen(f), id: i })), project: pr };
  }, [land, w, h]);

  const arcs = useMemo(() => {
    if (!project) return [];
    return [['plant', 'jebelAli'], ['yantian', 'jebelAli'], ['rotterdam', 'jeddah'], ['singapore', 'dammam']]
      .map(([a, b], i) => {
        const it = geoInterpolate(PORTS[a], PORTS[b]);
        const pts = Array.from({ length: 40 }, (_, k) => project(it(k / 39)));
        return { key: `${a}${b}`, i, d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}` };
      });
  }, [project]);

  const origin = project ? project(PORTS.plant) : null;

  return (
    <div className="js-scene js-origin" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} aria-hidden="true">
          <g className="js-land">{paths.map((p) => p.d && <path key={p.id} d={p.d} />)}</g>
          {arcs.map((a) => (
            <motion.path
              key={a.key} d={a.d} className="js-arc"
              initial={{ pathLength: 0.08, pathOffset: 0, opacity: 0 }}
              animate={active ? { pathOffset: [0, 0.92], opacity: [0, 0.9, 0.9, 0] } : { opacity: 0 }}
              transition={{ duration: 5, delay: a.i * 0.8, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.85, 1] }}
            />
          ))}
          {origin && (
            <g>
              <motion.circle
                cx={origin[0]} cy={origin[1]} r="14" className="js-ping"
                animate={active ? { scale: [0.4, 1.9], opacity: [0.7, 0] } : {}}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
                style={{ transformOrigin: `${origin[0]}px ${origin[1]}px` }}
              />
              <circle cx={origin[0]} cy={origin[1]} r="4" className="js-pin" />
              <line x1={origin[0]} y1={origin[1]} x2={origin[0]} y2={origin[1] - 54} className="js-leader" />
              <text x={origin[0] + 8} y={origin[1] - 58} className="js-pin-label">PLANT 3 · RIYADH</text>
              <text x={origin[0] + 8} y={origin[1] - 46} className="js-pin-sub">24.71°N 46.72°E</text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   01 · SUPPLIER — a constellation of suppliers, one selected
   --------------------------------------------------------------- */
const SUPPLIERS = [
  { n: 'Al Faisal Dairy', g: 'A', x: 50, y: 46, r: 46, sel: true, otif: 98 },
  { n: 'Nexa Packaging', g: 'A', x: 20, y: 22, r: 26, otif: 94 },
  { n: 'Gulf Cold Chain', g: 'B', x: 80, y: 26, r: 24, otif: 88 },
  { n: 'Meridian Labels', g: 'A', x: 16, y: 74, r: 22, otif: 96 },
  { n: 'Orbit Logistics', g: 'C', x: 84, y: 72, r: 20, otif: 71 },
  { n: 'Delta Additives', g: 'B', x: 50, y: 88, r: 21, otif: 86 },
];

export const SceneSupplier = ({ active }) => {
  const [ref, { w, h }] = useSize();
  const hub = SUPPLIERS[0];

  return (
    <div className="js-scene js-supplier" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} aria-hidden="true">
          {[0.2, 0.32, 0.44].map((f) => (
            <circle key={f} cx={(hub.x / 100) * w} cy={(hub.y / 100) * h} r={Math.min(w, h) * f} className="js-orbit" />
          ))}

          {SUPPLIERS.slice(1).map((s, i) => {
            const x1 = (hub.x / 100) * w, y1 = (hub.y / 100) * h;
            const x2 = (s.x / 100) * w, y2 = (s.y / 100) * h;
            return (
              <g key={s.n}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className={`js-tie g-${s.g}`} />
                <motion.circle
                  r="2.5" className="js-packet"
                  animate={active ? { cx: [x2, x1], cy: [y2, y1], opacity: [0, 1, 1, 0] } : { opacity: 0 }}
                  transition={{ duration: 2.4, delay: i * 0.45, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }}
                />
              </g>
            );
          })}

          {SUPPLIERS.map((s, i) => {
            const x = (s.x / 100) * w, y = (s.y / 100) * h;
            return (
              <motion.g
                key={s.n}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                <circle cx={x} cy={y} r={s.r} className={`js-sup ${s.sel ? 'sel' : ''} g-${s.g}`} />
                <text x={x} y={y + 5} className={s.sel ? 'js-sup-grade sel' : 'js-sup-grade'}>{s.g}</text>
                <text x={x} y={y + s.r + 16} className="js-sup-name">{s.n}</text>
                <text x={x} y={y + s.r + 29} className="js-sup-otif">OTIF {s.otif}%</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   02 · PURCHASE — the order writes itself
   --------------------------------------------------------------- */
const PO_LINES = [
  ['4400-118', 'Full cream milk 1L', '4,800', 'SAR 11,520'],
  ['4400-204', 'Carton · 12-pack', '400', 'SAR 1,240'],
  ['4400-771', 'Thermal label roll', '18', 'SAR 612'],
];

export const ScenePurchase = ({ active }) => (
  <div className="js-scene js-purchase">
    <motion.div
      className="js-doc"
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={active ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div className="js-doc-top">
        <div>
          <span className="js-doc-kind">Purchase order</span>
          <b>PO-8841</b>
        </div>
        <div className="js-doc-meta">
          <span>Raised automatically</span>
          <span>Reorder point breached · 02:14</span>
        </div>
      </div>

      <div className="js-doc-party">
        <div><span>Supplier</span><b>Al Faisal Dairy</b></div>
        <div><span>Deliver to</span><b>Riyadh DC · Dock 4</b></div>
        <div><span>Required</span><b>04 Aug · 06:00</b></div>
      </div>

      <div className="js-doc-lines">
        <div className="js-doc-row js-doc-head"><span>Item</span><span>Description</span><span>Qty</span><span>Value</span></div>
        {PO_LINES.map(([code, desc, qty, val], i) => (
          <motion.div
            className="js-doc-row" key={code}
            initial={{ opacity: 0, x: -20 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.16, ease: EASE }}
          >
            <span className="js-mono">{code}</span>
            <span>{desc}</span>
            <span className="js-mono r">{qty}</span>
            <span className="js-mono r">{val}</span>
          </motion.div>
        ))}
      </div>

      <div className="js-doc-foot">
        <span>Three-way match armed · GRN and invoice will settle against this order</span>
        <b className="js-mono">SAR 13,372</b>
      </div>

      <motion.div
        className="js-stamp"
        initial={{ opacity: 0, scale: 1.5, rotate: -18 }}
        animate={active ? { opacity: 1, scale: 1, rotate: -12 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
      >
        <span>ACKNOWLEDGED</span>
        <em>04 Aug 02:19 · Al Faisal</em>
      </motion.div>
    </motion.div>
  </div>
);

/* ---------------------------------------------------------------
   03 · FACTORY — a conveyor that actually runs
   --------------------------------------------------------------- */
export const SceneFactory = ({ active }) => (
  <div className="js-scene js-factory">
    <div className="js-gauges">
      {[['OEE', 87.4, '%'], ['Line speed', 1284, '/hr'], ['Yield', 99.2, '%'], ['Batch', 4800, 'u']].map(([k, v, u], i) => (
        <motion.div
          className="js-gauge" key={k}
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
        >
          <span>{k}</span>
          <b className="js-mono">{v}<em>{u}</em></b>
        </motion.div>
      ))}
    </div>

    {/* three belts running at different speeds */}
    {[0, 1, 2].map((row) => (
      <div className={`js-belt js-belt-${row}`} key={row}>
        <div className="js-belt-rail" />
        <motion.div
          className="js-belt-track"
          animate={active ? { x: ['0%', '-50%'] } : {}}
          transition={{ duration: 18 + row * 6, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <span className={`js-unit ${i % 9 === 0 ? 'flag' : ''}`} key={i}>
              <i />
            </span>
          ))}
        </motion.div>
      </div>
    ))}

    <motion.div
      className="js-wo"
      initial={{ opacity: 0, x: 30 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
    >
      <div className="js-wo-bar"><b>WO-4412</b><span className="js-run">RUNNING</span></div>
      {[['Line A · Filling', 78], ['Line B · Capping', 91], ['Line C · Labelling', 64]].map(([l, p], i) => (
        <div className="js-wo-line" key={l}>
          <span>{l}</span>
          <span className="js-wo-track">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={active ? { scaleX: p / 100 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.12, ease: EASE }}
            />
          </span>
          <b className="js-mono">{p}%</b>
        </div>
      ))}
    </motion.div>
  </div>
);

/* ---------------------------------------------------------------
   04 · WAREHOUSE — rack elevation with a live pick path
   --------------------------------------------------------------- */
const PICK_PATH = 'M40,300 L40,120 L150,120 L150,250 L280,250 L280,90 L400,90 L400,220 L520,220';

export const SceneWarehouse = ({ active }) => (
  <div className="js-scene js-warehouse">
    <div className="js-racks">
      {Array.from({ length: 5 }).map((_, bay) => (
        <div className="js-bay" key={bay}>
          <span className="js-bay-label">AISLE {String(bay + 1).padStart(2, '0')}</span>
          <div className="js-bay-grid">
            {Array.from({ length: 24 }).map((_, i) => {
              const filled = (bay * 24 + i) % 7 !== 0;
              const target = bay === 2 && i === 9;
              return (
                <motion.i
                  key={i}
                  className={`js-bin ${filled ? 'full' : 'empty'} ${target ? 'target' : ''}`}
                  initial={{ opacity: 0, scaleY: 0.3 }}
                  animate={active ? { opacity: 1, scaleY: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: bay * 0.06 + i * 0.008, ease: EASE }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <svg className="js-pickpath" viewBox="0 0 560 340" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={PICK_PATH} className="js-pick"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.6, delay: 0.6, ease: EASE }}
      />
    </svg>

    <motion.div
      className="js-scan"
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
    >
      <div className="js-scan-code">
        {Array.from({ length: 34 }).map((_, i) => (
          <i key={i} style={{ width: [1, 2, 3][i % 3], opacity: i % 4 === 0 ? 0.35 : 1 }} />
        ))}
      </div>
      <div className="js-scan-txt">
        <b>B-2026-0417</b>
        <span>Bin C-14-02 · putaway confirmed · 4,800 units</span>
      </div>
      <span className="js-fefo">FEFO</span>
    </motion.div>
  </div>
);

/* ---------------------------------------------------------------
   05 · SHIPPING — the lane, zoomed
   --------------------------------------------------------------- */
export const SceneShipping = ({ active, progress = 0 }) => {
  const [ref, { w, h }] = useSize();
  const land = useWorld();

  const { paths, lane } = useMemo(() => {
    if (!land || !w || !h) return { paths: [], lane: null };
    /* framed on the Gulf corridor rather than the whole planet */
    const pr = geoNaturalEarth1().center([48, 24]).scale(Math.min(w, h) * 2.6).translate([w / 2, h / 2]);
    const gen = geoPath(pr);
    const it = geoInterpolate(PORTS.plant, PORTS.jebelAli);
    const pts = Array.from({ length: 40 }, (_, k) => pr(it(k / 39)));
    return {
      paths: land.features.map((f, i) => ({ d: gen(f), id: i })),
      lane: { d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}`, pts },
    };
  }, [land, w, h]);

  const vIdx = Math.min(39, Math.round(progress * 39));
  const vessel = lane ? lane.pts[vIdx] : null;

  return (
    <div className="js-scene js-shipping" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} aria-hidden="true">
          <g className="js-land near">{paths.map((p) => p.d && <path key={p.id} d={p.d} />)}</g>
          {lane && <path d={lane.d} className="js-lane" />}
          {lane && (
            <motion.path
              d={lane.d} className="js-lane-done"
              style={{ pathLength: progress }}
            />
          )}
          {vessel && (
            <g>
              <circle cx={vessel[0]} cy={vessel[1]} r="16" className="js-vessel-halo" />
              <circle cx={vessel[0]} cy={vessel[1]} r="5" className="js-vessel" />
              <text x={vessel[0] + 12} y={vessel[1] - 10} className="js-vessel-label">TRK-208 · 62 km/h</text>
            </g>
          )}
        </svg>
      )}

      <motion.div
        className="js-manifest"
        initial={{ opacity: 0, x: -24 }}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
      >
        <span className="js-manifest-label">Manifest</span>
        {[['Consignment', 'B-2026-0417'], ['Units', '4,800'], ['Reefer', '3.1°C · in range'], ['Seal', 'SL-99184 intact']].map(([k, v]) => (
          <div key={k}><span>{k}</span><b className="js-mono">{v}</b></div>
        ))}
        <div className="js-eta">
          <span>ETA</span>
          <b className="js-mono">{Math.max(0, Math.round((1 - progress) * 214))} km</b>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------------------------------------------------------
   06 · RETAIL — a planogram filling up
   --------------------------------------------------------------- */
export const SceneRetail = ({ active }) => (
  <div className="js-scene js-retail">
    <div className="js-shelves">
      {Array.from({ length: 4 }).map((_, shelf) => (
        <div className="js-shelf" key={shelf}>
          <div className="js-shelf-row">
            {Array.from({ length: 16 }).map((_, i) => {
              const ours = shelf === 1 && i >= 4 && i <= 9;
              const gap = !ours && (shelf * 16 + i) % 11 === 0;
              return (
                <motion.i
                  key={i}
                  className={`js-facing ${ours ? 'ours' : ''} ${gap ? 'gap' : ''}`}
                  initial={{ opacity: 0, y: -14 }}
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.45, delay: (ours ? 0.7 : 0.1) + i * 0.03 + shelf * 0.05, ease: EASE }}
                />
              );
            })}
          </div>
          <span className="js-shelf-edge" />
        </div>
      ))}
    </div>

    <motion.div
      className="js-plano"
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
    >
      <div className="js-plano-row"><span>Outlet</span><b>Landmark · Olaya</b></div>
      <div className="js-plano-row"><span>Planogram</span><b>6 facings · shelf 2</b></div>
      <div className="js-plano-row"><span>On shelf</span><b className="js-good">99.1% availability</b></div>
      <div className="js-plano-row"><span>Replenished</span><b>08:42 · 38 outlets</b></div>
    </motion.div>
  </div>
);

/* ---------------------------------------------------------------
   07 · CUSTOMER — the loop closes
   --------------------------------------------------------------- */
export const SceneCustomer = ({ active }) => (
  <div className="js-scene js-customer">
    <motion.div
      className="js-receipt"
      initial={{ opacity: 0, y: 34 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <span className="js-receipt-top">LANDMARK · OLAYA</span>
      {[['Full cream milk 1L', '2', '5.80'], ['Full cream milk 1L', '1', '2.90']].map(([n, q, v], i) => (
        <div className="js-receipt-row" key={i}><span>{n}</span><span className="js-mono">{q}</span><span className="js-mono">{v}</span></div>
      ))}
      <div className="js-receipt-total"><span>TOTAL</span><b className="js-mono">SAR 8.70</b></div>
      <span className="js-receipt-time">08:51 · TILL 04</span>
    </motion.div>

    {/* the sale becomes tomorrow's demand signal */}
    <svg className="js-loop" viewBox="0 0 520 200" aria-hidden="true">
      <motion.path
        d="M400,58 C470,58 500,110 440,146 C360,192 150,192 90,146 C36,106 62,58 130,58"
        className="js-loop-path"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
      />
      <motion.circle
        r="4" className="js-loop-dot"
        animate={active ? { offsetDistance: ['0%', '100%'] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ offsetPath: `path("M400,58 C470,58 500,110 440,146 C360,192 150,192 90,146 C36,106 62,58 130,58")` }}
      />
    </svg>

    <motion.div
      className="js-signal"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
    >
      <span className="js-signal-k">Demand signal</span>
      <b>Sell-through +38% week on week</b>
      <em>Reorder point recalculated · next PO drafts in 4 hours</em>
    </motion.div>
  </div>
);

export const SCENES = [
  SceneOrigin, SceneSupplier, ScenePurchase, SceneFactory,
  SceneWarehouse, SceneShipping, SceneRetail, SceneCustomer,
];
