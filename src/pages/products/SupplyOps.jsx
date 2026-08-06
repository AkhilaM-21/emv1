import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { geoNaturalEarth1, geoPath, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  Ship, Truck, Warehouse, Factory, Package, TriangleAlert, Timer,
  Thermometer, Fuel, ScanLine, Boxes, ClipboardCheck, Signal, Navigation,
  CircleCheckBig, ArrowUpRight, Radio,
} from 'lucide-react';
import { motion, EASE } from './motion';
import { useSize } from './viz';

/* =====================================================================
   OPERATIONS COMPONENTS
   Instrumentation, not analytics. Everything here is modelled on a
   control room: departure boards, heat maps, radar, Gantt lanes,
   alert stacks. Nothing borrowed from the Finance surfaces.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE MAP — real Natural Earth projection, great-circle lanes
   --------------------------------------------------------------- */
const PORTS = {
  yantian: [114.06, 22.54], singapore: [103.82, 1.35], mumbai: [72.87, 19.08],
  rotterdam: [4.48, 51.92], jebelAli: [55.06, 25.01], dammam: [50.1, 26.43],
  jeddah: [39.2, 21.49], riyadh: [46.72, 24.71], shanghai: [121.47, 31.23],
  hamburg: [9.99, 53.55],
};

const LANES = [
  ['yantian', 'jebelAli', 0], ['singapore', 'dammam', 0.7],
  ['rotterdam', 'jeddah', 1.4], ['mumbai', 'riyadh', 2.1],
  ['shanghai', 'jebelAli', 2.8], ['hamburg', 'dammam', 3.5],
];

const HUBS = [
  ['riyadh', 'Riyadh DC', 92], ['jeddah', 'Jeddah DC', 64],
  ['dammam', 'Dammam DC', 81], ['jebelAli', 'Jebel Ali', 47],
];

export const OpsMap = ({ scale = 1, dense }) => {
  const [ref, { w, h }] = useSize();
  const [land, setLand] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/countries-110m.json')
      .then((r) => r.json())
      .then((world) => { if (alive) setLand(feature(world, world.objects.countries)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const { paths, project } = useMemo(() => {
    if (!land || !w || !h) return { paths: [], project: null };
    const pr = geoNaturalEarth1().fitExtent([[10, 10], [w - 10, h - 10]], land);
    const gen = geoPath(pr);
    return { paths: land.features.map((f, i) => ({ d: gen(f), id: i })), project: pr };
  }, [land, w, h]);

  const lanes = useMemo(() => {
    if (!project) return [];
    return LANES.map(([a, b, delay]) => {
      const it = geoInterpolate(PORTS[a], PORTS[b]);
      const pts = Array.from({ length: 44 }, (_, i) => project(it(i / 43)));
      return { key: `${a}${b}`, delay, d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}` };
    });
  }, [project]);

  const hubs = useMemo(() => {
    if (!project) return [];
    return HUBS.map(([k, label, load]) => {
      const [x, y] = project(PORTS[k]);
      return { k, x, y, label, load };
    });
  }, [project]);

  return (
    <div className="op-map" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label="Global logistics network"
          style={{ transform: `scale(${scale})`, transformOrigin: '58% 44%' }}>
          <g className="op-land">{paths.map((p) => p.d && <path key={p.id} d={p.d} />)}</g>

          {lanes.map((l) => (
            <g key={l.key}>
              <path d={l.d} className="op-lane" />
              <motion.path
                d={l.d} className="op-lane-run"
                initial={{ pathLength: 0.09, pathOffset: 0, opacity: 0 }}
                animate={{ pathOffset: [0, 0.91], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5.2, delay: l.delay, repeat: Infinity, repeatDelay: 0.4, ease: 'linear', times: [0, 0.1, 0.85, 1] }}
              />
            </g>
          ))}

          {hubs.map((hb, i) => (
            <g key={hb.k}>
              <motion.circle
                cx={hb.x} cy={hb.y} r="11" className="op-hub-ring"
                initial={{ scale: 0.35, opacity: 0.6 }}
                animate={{ scale: [0.35, 1.7], opacity: [0.55, 0] }}
                transition={{ duration: 3, delay: i * 0.45, repeat: Infinity, ease: 'easeOut' }}
                style={{ transformOrigin: `${hb.x}px ${hb.y}px` }}
              />
              <circle cx={hb.x} cy={hb.y} r="3.4" className="op-hub" />
              {!dense && (
                <>
                  <line x1={hb.x} y1={hb.y} x2={hb.x + 16} y2={hb.y - 16} className="op-hub-leader" />
                  <text x={hb.x + 19} y={hb.y - 18} className="op-hub-name">{hb.label}</text>
                  <text x={hb.x + 19} y={hb.y - 7} className="op-hub-load">{hb.load}% utilised</text>
                </>
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   TICKER — the strip that runs across the top of a control room
   --------------------------------------------------------------- */
export const Ticker = ({ items }) => (
  <div className="op-ticker">
    <span className="op-ticker-tag"><Radio size={11} /> NETWORK</span>
    <div className="op-ticker-window">
      <motion.div
        className="op-ticker-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((t, i) => (
          <span className="op-ticker-item" key={i}>
            <i className={`op-dot ${t.tone}`} />
            <b>{t.code}</b>
            {t.text}
            <em>{t.meta}</em>
          </span>
        ))}
      </motion.div>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   DEPARTURE BOARD — shipments in transit
   --------------------------------------------------------------- */
export const ShipmentBoard = ({ rows }) => (
  <div className="op-win">
    <div className="op-win-bar">
      <Ship size={12} />
      <b>In transit</b>
      <span className="op-count">{rows.length * 8}</span>
      <span className="op-live"><i />LIVE</span>
    </div>
    <div className="op-board">
      <div className="op-brow op-bhead">
        <span>ID</span><span>Lane</span><span>Vessel</span><span>ETA</span><span>Status</span>
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r) => (
          <motion.div
            className="op-brow" key={r.id} layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="op-mono">{r.code}</span>
            <span>{r.lane}</span>
            <span className="op-dim">{r.vessel}</span>
            <span className="op-mono">{r.eta}</span>
            <span><i className={`op-pill ${r.tone}`}>{r.state}</i></span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   ALERT STACK
   --------------------------------------------------------------- */
export const AlertStack = ({ alerts }) => (
  <div className="op-win">
    <div className="op-win-bar">
      <TriangleAlert size={12} />
      <b>Exceptions</b>
      <span className="op-count warn">{alerts.length}</span>
    </div>
    <div className="op-alerts">
      <AnimatePresence initial={false}>
        {alerts.map((a) => (
          <motion.div
            className={`op-alert ${a.tone}`} key={a.id} layout
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="op-alert-ic"><a.icon size={12} /></span>
            <span className="op-txt"><b>{a.title}</b><i>{a.meta}</i></span>
            <span className="op-alert-age">{a.age}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   COUNTER TILES
   --------------------------------------------------------------- */
export const CounterTile = ({ label, value, unit, delta, bars }) => (
  <div className="op-tile">
    <span className="op-tile-label">{label}</span>
    <motion.b
      key={value}
      className="op-mono"
      initial={{ opacity: 0.35, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {value}<em>{unit}</em>
    </motion.b>
    <div className="op-tile-foot">
      {delta && <span className="op-delta">{delta}</span>}
      {bars && (
        <span className="op-microbars">
          {bars.map((b, i) => <i key={i} style={{ height: `${b}%` }} />)}
        </span>
      )}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   WAREHOUSE HEAT MAP — aisles × bays, live pick density
   --------------------------------------------------------------- */
export const WarehouseHeat = ({ pulse }) => {
  const cells = useMemo(() => {
    const out = [];
    for (let a = 0; a < 12; a += 1) {
      for (let b = 0; b < 26; b += 1) {
        const n = Math.sin(a * 0.9 + b * 0.4) * 0.5 + Math.sin(b * 0.17) * 0.5;
        const heat = Math.max(0, Math.min(1, (n + 1) / 2));
        out.push({ a, b, heat, empty: (a * 26 + b) % 37 === 0 });
      }
    }
    return out;
  }, []);

  return (
    <div className="op-heat">
      <div className="op-heat-aisles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>A{String(i + 1).padStart(2, '0')}</span>
        ))}
      </div>
      <div className="op-heat-grid">
        {cells.map((c, i) => (
          <motion.i
            key={i}
            className={`op-cell ${c.empty ? 'empty' : ''} ${pulse === (c.a * 26 + c.b) % 40 ? 'pick' : ''}`}
            style={{ '--h': c.heat }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (c.b * 0.006 + c.a * 0.012), ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   PURCHASE ORDERS
   --------------------------------------------------------------- */
export const PoPanel = () => (
  <div className="op-win">
    <div className="op-win-bar">
      <ClipboardCheck size={12} /><b>Purchase orders</b>
      <span className="op-count">142</span>
      <span className="op-chip">Auto-raised 12</span>
    </div>
    <div className="op-board">
      {[
        ['PO-8841', 'Al Faisal Trading', '2,400 units', 'ok', 'Confirmed'],
        ['PO-8842', 'Nexa Components', '18,000 units', 'ok', 'Confirmed'],
        ['PO-8843', 'Gulf Packaging', '640 rolls', 'warn', 'Awaiting ack'],
        ['PO-8844', 'Delta Chemicals', '1,200 drums', 'info', 'In approval'],
      ].map(([code, sup, qty, tone, state], i) => (
        <motion.div
          className="op-brow po" key={code}
          initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
        >
          <span className="op-mono">{code}</span>
          <span>{sup}</span>
          <span className="op-dim">{qty}</span>
          <span><i className={`op-pill ${tone}`}>{state}</i></span>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   PRODUCTION LINE — work orders with live progress
   --------------------------------------------------------------- */
export const ProductionLine = () => (
  <div className="op-win">
    <div className="op-win-bar">
      <Factory size={12} /><b>Shop floor · Plant 3</b>
      <span className="op-live"><i />RUNNING</span>
    </div>
    <div className="op-lines">
      {[
        ['WO-4412', 'Line A · Bottling', 78, 'ok'],
        ['WO-4413', 'Line B · Labelling', 42, 'ok'],
        ['WO-4414', 'Line C · Packing', 91, 'ok'],
        ['WO-4415', 'Line D · Palletising', 16, 'warn'],
      ].map(([wo, line, pct, tone], i) => (
        <div className="op-line" key={wo}>
          <div className="op-line-top">
            <span className="op-mono">{wo}</span>
            <span className="op-dim">{line}</span>
            <span className="op-mono op-line-pct">{pct}%</span>
          </div>
          <span className="op-track">
            <motion.i
              className={tone}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: pct / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
            />
          </span>
        </div>
      ))}
    </div>
    <div className="op-win-foot">
      <span>OEE <b>87.4%</b></span>
      <span>Throughput <b>1,284/hr</b></span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   ROUTE OPTIMISATION
   --------------------------------------------------------------- */
export const RoutePanel = () => (
  <div className="op-win">
    <div className="op-win-bar">
      <Navigation size={12} /><b>Route plan · Riyadh metro</b>
      <span className="op-chip">Optimised</span>
    </div>
    <div className="op-route">
      <svg viewBox="0 0 300 128" className="op-route-svg" aria-hidden="true">
        <motion.path
          d="M14,104 C50,96 62,52 96,58 C130,64 138,26 176,32 C214,38 226,80 262,66 C278,60 284,44 290,30"
          className="op-route-line"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }}
        />
        {[[14, 104], [96, 58], [176, 32], [262, 66], [290, 30]].map(([x, y], i) => (
          <motion.circle
            key={i} cx={x} cy={y} r="4" className="op-route-stop"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 + i * 0.16, ease: EASE }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}
      </svg>
      <div className="op-route-stats">
        {[['Stops', '14'], ['Distance', '218 km'], ['Saved', '−32 km'], ['Window', '06:00–14:00']].map(([k, v]) => (
          <div key={k}><span>{k}</span><b>{v}</b></div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   PROOF OF DELIVERY
   --------------------------------------------------------------- */
export const PodPanel = () => (
  <div className="op-win">
    <div className="op-win-bar">
      <CircleCheckBig size={12} /><b>Proof of delivery</b>
      <span className="op-pill ok">Signed</span>
    </div>
    <div className="op-pod">
      <div className="op-pod-row"><span>Order</span><b className="op-mono">SO-99184</b></div>
      <div className="op-pod-row"><span>Outlet</span><b>Landmark · Olaya</b></div>
      <div className="op-pod-row"><span>Delivered</span><b className="op-mono">08:42 · on time</b></div>
      <div className="op-pod-row"><span>Temperature</span><b className="op-mono">3.1°C <i className="op-ok">in range</i></b></div>
      <div className="op-pod-sig">
        <svg viewBox="0 0 200 44" aria-hidden="true">
          <motion.path
            d="M8,32 C22,10 30,38 44,22 C58,6 66,34 82,26 C98,18 104,36 120,24 C136,12 148,32 166,20 C176,14 184,22 192,16"
            className="op-sig"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.3, ease: EASE }}
          />
        </svg>
        <span>Received by M. Al-Otaibi</span>
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   SUPPLIER NETWORK — nodes and links, radar styling
   --------------------------------------------------------------- */
const NET = [
  { id: 'hub', x: 50, y: 50, label: 'Emvive', grade: null, r: 30 },
  { id: 'n1', x: 18, y: 22, label: 'Al Faisal', grade: 'A', r: 18 },
  { id: 'n2', x: 82, y: 24, label: 'Nexa', grade: 'A', r: 17 },
  { id: 'n3', x: 14, y: 74, label: 'Gulf Pack', grade: 'C', r: 14 },
  { id: 'n4', x: 86, y: 72, label: 'Orbit', grade: 'B', r: 15 },
  { id: 'n5', x: 50, y: 12, label: 'Delta', grade: 'B', r: 14 },
  { id: 'n6', x: 50, y: 88, label: 'Meridian', grade: 'A', r: 16 },
];

export const NetworkGraph = () => {
  const [ref, { w, h }] = useSize();
  const hub = NET[0];

  return (
    <div className="op-net" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} aria-hidden="true">
          <circle cx={(hub.x / 100) * w} cy={(hub.y / 100) * h} r={Math.min(w, h) * 0.42} className="op-net-radar" />
          <circle cx={(hub.x / 100) * w} cy={(hub.y / 100) * h} r={Math.min(w, h) * 0.28} className="op-net-radar" />

          {NET.slice(1).map((n, i) => {
            const x1 = (hub.x / 100) * w, y1 = (hub.y / 100) * h;
            const x2 = (n.x / 100) * w, y2 = (n.y / 100) * h;
            return (
              <g key={n.id}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className={`op-net-link g-${n.grade}`} />
                <motion.circle
                  r="2.5" className="op-net-packet"
                  initial={{ opacity: 0 }}
                  animate={{ cx: [x2, x1], cy: [y2, y1], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.6, delay: i * 0.4, repeat: Infinity, repeatDelay: 1.1, ease: 'linear' }}
                />
              </g>
            );
          })}

          {NET.map((n) => {
            const x = (n.x / 100) * w, y = (n.y / 100) * h;
            return (
              <g key={n.id}>
                <circle cx={x} cy={y} r={n.r} className={n.id === 'hub' ? 'op-net-hub' : `op-net-node g-${n.grade}`} />
                <text x={x} y={n.id === 'hub' ? y + 4 : y + 3} className={n.id === 'hub' ? 'op-net-hublabel' : 'op-net-grade'}>
                  {n.id === 'hub' ? 'EM' : n.grade}
                </text>
                <text x={x} y={y + n.r + 13} className="op-net-label">{n.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   FLEET GANTT — lanes over a 24 hour window
   --------------------------------------------------------------- */
const FLEET = [
  { v: 'TRK-114', lane: 'Riyadh → Qassim', start: 4, len: 30, tone: 'ok', label: 'Delivered' },
  { v: 'TRK-208', lane: 'Dammam → Riyadh', start: 18, len: 38, tone: 'ok', label: 'In transit' },
  { v: 'TRK-331', lane: 'Jeddah → Makkah', start: 10, len: 18, tone: 'ok', label: 'Delivered' },
  { v: 'REF-042', lane: 'Riyadh → Kharj', start: 34, len: 26, tone: 'warn', label: 'Delayed 40m' },
  { v: 'TRK-517', lane: 'Jubail → Dammam', start: 52, len: 24, tone: 'ok', label: 'Loading' },
  { v: 'REF-088', lane: 'Jeddah → Taif', start: 62, len: 30, tone: 'ok', label: 'Scheduled' },
];

export const FleetGantt = () => (
  <div className="op-gantt">
    <div className="op-gantt-head">
      {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
    <div className="op-gantt-body">
      {FLEET.map((f, i) => (
        <div className="op-gantt-lane" key={f.v}>
          <span className="op-gantt-label">
            <i className={`op-veh ${f.v.startsWith('REF') ? 'ref' : ''}`}>
              {f.v.startsWith('REF') ? <Thermometer size={10} /> : <Truck size={10} />}
            </i>
            <b className="op-mono">{f.v}</b>
            <em>{f.lane}</em>
          </span>
          <span className="op-gantt-track">
            <motion.i
              className={`op-gantt-bar ${f.tone}`}
              style={{ left: `${f.start}%` }}
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: `${f.len}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
            >
              <em>{f.label}</em>
            </motion.i>
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   DEPARTURE-BOARD STATS — flip-board styling, no big number rows
   --------------------------------------------------------------- */
export const OpsBoard = ({ rows }) => (
  <div className="op-stats">
    {rows.map((r, i) => (
      <motion.div
        className="op-stat" key={r.label}
        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.65, delay: i * 0.06, ease: EASE }}
      >
        <span className="op-stat-key">{r.key}</span>
        <b className="op-mono">{r.value}</b>
        <span className="op-stat-label">{r.label}</span>
        <span className={`op-stat-trend ${r.tone}`}>{r.trend}</span>
      </motion.div>
    ))}
  </div>
);

export const OPS_ICONS = {
  Ship, Truck, Warehouse, Factory, Package, TriangleAlert, Timer,
  Thermometer, Fuel, ScanLine, Boxes, ClipboardCheck, Signal, ArrowUpRight,
};
