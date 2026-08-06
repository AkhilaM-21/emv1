import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { geoNaturalEarth1, geoPath, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  Ship, Truck, Warehouse, Factory, Package, TriangleAlert, ScanLine,
  Sparkles, Check, X, TrendingUp, ShieldCheck, Globe, Cpu, Boxes,
  Database, Receipt, Users, Radio, Zap, Clock, ArrowUpRight, Forklift,
} from 'lucide-react';
import { motion, EASE } from './motion';
import { useSize } from './viz';
import './SupplyOps.css';

/* =====================================================================
   SUPPLY CHAIN — the immersive sections that sit between the existing
   scroll beats. Every one of these is instrumentation, not decoration.
   ===================================================================== */

/* =====================================================================
   1 · GLOBAL SUPPLY NETWORK
   ===================================================================== */
const PLACES = {
  yantian: { c: [114.06, 22.54], n: 'Yantian', k: 'port' },
  shanghai: { c: [121.47, 31.23], n: 'Shanghai', k: 'supplier' },
  singapore: { c: [103.82, 1.35], n: 'Singapore', k: 'port' },
  mumbai: { c: [72.87, 19.08], n: 'Mumbai', k: 'supplier' },
  rotterdam: { c: [4.48, 51.92], n: 'Rotterdam', k: 'port' },
  jebelAli: { c: [55.06, 25.01], n: 'Jebel Ali', k: 'port' },
  riyadh: { c: [46.72, 24.71], n: 'Riyadh DC', k: 'dc' },
  jeddah: { c: [39.2, 21.49], n: 'Jeddah DC', k: 'dc' },
  dammam: { c: [50.1, 26.43], n: 'Dammam DC', k: 'dc' },
  istanbul: { c: [28.98, 41.01], n: 'Istanbul', k: 'supplier' },
};

const META = {
  yantian: ['4 vessels', '18 containers', 'On schedule'],
  shanghai: ['Grade A · OTIF 96%', '12 open POs', 'Lead time 21d'],
  singapore: ['2 vessels', '9 containers', 'On schedule'],
  mumbai: ['Grade B · OTIF 91%', '6 open POs', 'Lead time 14d'],
  rotterdam: ['1 vessel', '22 containers', 'Congestion +1d'],
  jebelAli: ['6 vessels', '41 containers', 'Customs 4h'],
  riyadh: ['92% utilised', '38 pickers', '3 waves open'],
  jeddah: ['64% utilised', '24 pickers', '2 waves open'],
  dammam: ['81% utilised', '31 pickers', '1 wave open'],
  istanbul: ['Grade A · OTIF 98%', '4 open POs', 'Lead time 9d'],
};

const ROUTES = [
  ['yantian', 'jebelAli', 0], ['shanghai', 'jebelAli', 0.8],
  ['singapore', 'dammam', 1.5], ['rotterdam', 'jeddah', 2.2],
  ['mumbai', 'riyadh', 2.9], ['istanbul', 'jeddah', 3.6],
  ['jebelAli', 'dammam', 4.2], ['jebelAli', 'riyadh', 4.8],
];

export const NetworkMap = ({ live }) => {
  const [ref, { w, h }] = useSize();
  const [land, setLand] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/countries-110m.json').then((r) => r.json())
      .then((wd) => { if (alive) setLand(feature(wd, wd.objects.countries)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const { paths, project } = useMemo(() => {
    if (!land || !w || !h) return { paths: [], project: null };
    const pr = geoNaturalEarth1().fitExtent([[16, 16], [w - 16, h - 16]], land);
    const gen = geoPath(pr);
    return { paths: land.features.map((f, i) => ({ d: gen(f), id: i })), project: pr };
  }, [land, w, h]);

  const routes = useMemo(() => {
    if (!project) return [];
    return ROUTES.map(([a, b, delay]) => {
      const it = geoInterpolate(PLACES[a].c, PLACES[b].c);
      const pts = Array.from({ length: 42 }, (_, i) => project(it(i / 41)));
      return { key: `${a}${b}`, a, b, delay, d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}` };
    });
  }, [project]);

  const nodes = useMemo(() => {
    if (!project) return [];
    return Object.entries(PLACES).map(([k, v]) => {
      const [x, y] = project(v.c);
      return { k, x, y, n: v.n, k2: v.k };
    });
  }, [project]);

  return (
    <div className="so-map" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} role="img" aria-label="Global supply network">
          <g className="so-land">{paths.map((p) => p.d && <path key={p.id} d={p.d} />)}</g>

          {routes.map((r) => {
            const lit = hover && (hover === r.a || hover === r.b);
            return (
              <g key={r.key}>
                <path d={r.d} className={`so-route ${lit ? 'lit' : ''}`} />
                <motion.path
                  d={r.d} className="so-route-run"
                  initial={{ pathLength: 0.07, pathOffset: 0, opacity: 0 }}
                  animate={{ pathOffset: [0, 0.93], opacity: [0, 0.95, 0.95, 0] }}
                  transition={{ duration: 5.4, delay: r.delay, repeat: Infinity, ease: 'linear' }}
                />
              </g>
            );
          })}

          {nodes.map((n, i) => (
            <g
              key={n.k}
              className={`so-node ${n.k === hover ? 'on' : ''}`}
              onMouseEnter={() => setHover(n.k)}
              onMouseLeave={() => setHover(null)}
            >
              <motion.circle
                cx={n.x} cy={n.y} r="13" className="so-node-halo"
                animate={{ scale: [0.4, 1.7], opacity: [0.5, 0] }}
                transition={{ duration: 3, delay: i * 0.32, repeat: Infinity, ease: 'easeOut' }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              {/* marker shape encodes the role: square supplier, round DC,
                  diamond port — readable without reading the legend */}
              {n.k2 === 'supplier' && <rect x={n.x - 4} y={n.y - 4} width="8" height="8" className="so-mk supplier" />}
              {n.k2 === 'dc' && <circle cx={n.x} cy={n.y} r="4.5" className="so-mk dc" />}
              {n.k2 === 'port' && (
                <rect x={n.x - 4} y={n.y - 4} width="8" height="8" className="so-mk port" transform={`rotate(45 ${n.x} ${n.y})`} />
              )}
              <circle cx={n.x} cy={n.y} r="15" className="so-hit" />
              <text x={n.x + 10} y={n.y + 3.5} className="so-node-label">{n.n}</text>
            </g>
          ))}
        </svg>
      )}

      {/* hover card */}
      <AnimatePresence>
        {hover && (
          <motion.div
            className="so-tip"
            key={hover}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="so-tip-h">
              <span className={`so-tip-k ${PLACES[hover].k}`}>{PLACES[hover].k}</span>
              <b>{PLACES[hover].n}</b>
            </div>
            {META[hover].map((m) => <span className="so-tip-r" key={m}>{m}</span>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* legend + live counters */}
      <div className="so-map-legend">
        <span><i className="so-lg supplier" /> Supplier</span>
        <span><i className="so-lg port" /> Port</span>
        <span><i className="so-lg dc" /> Distribution centre</span>
        <span className="so-map-hint">Hover a location</span>
      </div>

      <div className="so-map-stats">
        {[['LANES', '42'], ['IN TRANSIT', String(live.transit)], ['CONTAINERS', '1,284'], ['ON TIME', `${live.otif.toFixed(1)}%`]].map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <motion.b key={v} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{v}</motion.b>
          </div>
        ))}
      </div>

      <div className="so-map-feed">
        <span className="so-feed-k"><Radio size={10} /> NETWORK EVENTS</span>
        <AnimatePresence initial={false}>
          {live.events.map((e) => (
            <motion.div
              className="so-feed-row" key={e.id} layout
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <i className={`so-dot ${e.tone}`} />
              <b>{e.code}</b><span>{e.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* =====================================================================
   2 · WAREHOUSE INTELLIGENCE — a floor you can read
   ===================================================================== */
export const WarehouseFloor = ({ live }) => (
  <div className="so-wh">
    <div className="so-wh-top">
      <span className="so-wh-title"><Warehouse size={12} /> Riyadh DC · floor</span>
      <span className="so-wh-live"><i />OPERATING · SHIFT A</span>
      <span className="so-wh-clock">08:42</span>
    </div>

    <div className="so-wh-body">
      {/* receiving */}
      <div className="so-zone so-zone-in">
        <span className="so-zone-k">Receiving</span>
        {['D1', 'D2', 'D3', 'D4'].map((d, i) => (
          <div className={`so-dock ${i === 0 ? 'busy' : i === 3 ? 'over' : i === 1 ? 'booked' : ''}`} key={d}>
            <b>{d}</b>
            <span>{['Unloading', 'Booked', 'Free', 'Overrun'][i]}</span>
          </div>
        ))}
      </div>

      {/* aisles */}
      <div className="so-aisles">
        {Array.from({ length: 6 }).map((_, aisle) => (
          <div className="so-aisle" key={aisle}>
            <span className="so-aisle-k">A{aisle + 1}</span>
            <div className="so-racks">
              {Array.from({ length: 22 }).map((_, b) => {
                const n = (aisle * 22 + b);
                const base = n % 17 === 0 ? 'empty' : n % 7 === 0 ? 'low' : n % 5 === 0 ? 'pick' : 'full';
                /* a rolling handful of bins change state on every tick, so the
                   floor reads as operating rather than as a screenshot */
                const touched = (n + live.n * 13) % 41 === 0;
                const state = touched ? 'flash' : base;
                return (
                  <motion.i
                    key={b} className={`so-bin ${state}`}
                    initial={{ opacity: 0, scaleY: 0.2 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: aisle * 0.05 + b * 0.008, ease: EASE }}
                  />
                );
              })}
            </div>
            {/* a cart running the aisle */}
            <motion.span
              className="so-cart"
              animate={{ left: ['2%', '94%', '2%'] }}
              transition={{ duration: 16 + aisle * 3, repeat: Infinity, ease: 'easeInOut', delay: aisle * 1.4 }}
            >
              <Forklift size={9} />
            </motion.span>
          </div>
        ))}
      </div>

      {/* dispatch */}
      <div className="so-zone so-zone-out">
        <span className="so-zone-k">Dispatch</span>
        {['D5', 'D6', 'D7', 'D8'].map((d, i) => (
          <div className={`so-dock ${i < 2 ? 'busy' : ''}`} key={d}>
            <b>{d}</b>
            <span>{['Loading', 'Staged', 'Free', 'Free'][i]}</span>
          </div>
        ))}
      </div>
    </div>

    {/* activity popups — receiving and dispatch as they happen */}
    <div className="so-wh-pops">
      <AnimatePresence initial={false}>
        {live.feed.slice(0, 2).map((f, i) => (
          <motion.div
            className="so-pop" key={f.id}
            initial={{ opacity: 0, x: 26, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <span className="so-pop-ic"><Package size={11} /></span>
            <span><b>{f.t}</b><em>{f.m}</em></span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    <div className="so-wh-foot">
      {[
        ['Storage utilisation', '82%', 82],
        ['Pick accuracy', '99.98%', 99],
        ['Lines / hour', String(live.rate), 74],
        ['Open waves', '3', 30],
      ].map(([k, v, p], i) => (
        <div className="so-wh-metric" key={k}>
          <span>{k}</span>
          <b>{v}</b>
          <span className="so-wh-track">
            <motion.i
              initial={{ scaleX: 0 }} whileInView={{ scaleX: p / 100 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.08, ease: EASE }}
            />
          </span>
        </div>
      ))}
      <div className="so-wh-legend">
        <span><i className="so-bin full" /> Stocked</span>
        <span><i className="so-bin low" /> Low</span>
        <span><i className="so-bin pick" /> Picking</span>
        <span><i className="so-bin empty" /> Empty</span>
      </div>
    </div>
  </div>
);

/* =====================================================================
   3 · CONTROL ROOM — layered windows over a dark desk
   ===================================================================== */
export const ControlRoom = ({ live }) => (
  <div className="so-cr">
    <div className="so-cr-chrome">
      <span className="so-cr-dots"><i /><i /><i /></span>
      <span className="so-cr-url">control.emvive.com/operations</span>
      <span className="so-cr-tag"><i className="so-live-dot" />LIVE · 09 AUG 08:42</span>
    </div>

    <div className="so-cr-desk">
      {/* orders */}
      <motion.div
        className="so-win so-w-orders"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="so-win-bar"><Package size={11} /><b>Orders</b><span className="so-badge">1,284</span></div>
        <div className="so-rows">
          {[['SO-99184', 'Landmark · Olaya', 'ok', 'Picked'], ['SO-99185', 'Nesto · Jeddah', 'ok', 'Packed'],
            ['SO-99186', 'Danube · Riyadh', 'warn', 'Short'], ['SO-99187', 'Tamimi · Dammam', 'ok', 'Shipped']].map(([id, cust, tone, st]) => (
            <div className="so-row" key={id}>
              <span className="so-mono">{id}</span><span>{cust}</span>
              <i className={`so-pill ${tone}`}>{st}</i>
            </div>
          ))}
        </div>
      </motion.div>

      {/* shipments */}
      <motion.div
        className="so-win so-w-ship"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
      >
        <div className="so-win-bar"><Ship size={11} /><b>Shipments</b><span className="so-badge">342</span></div>
        <div className="so-rows">
          {[['SHP-20418', 'Yantian → Jebel Ali', 68], ['SHP-20419', 'Singapore → Dammam', 41],
            ['SHP-20421', 'Mumbai → Riyadh', 88]].map(([id, lane, p]) => (
            <div className="so-shiprow" key={id}>
              <div><span className="so-mono">{id}</span><em>{lane}</em></div>
              <span className="so-shiptrack">
                <motion.i
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: p / 100 }}
                  viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE }}
                />
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* inventory heat */}
      <motion.div
        className="so-win so-w-inv"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
      >
        <div className="so-win-bar"><Boxes size={11} /><b>Inventory cover</b></div>
        <div className="so-heat">
          {Array.from({ length: 72 }).map((_, i) => (
            <i key={i} style={{ '--h': ((Math.sin(i * 0.7) + 1) / 2).toFixed(2) }} />
          ))}
        </div>
        <div className="so-win-foot"><span>18.4 days average cover</span><span className="so-pill ok">Healthy</span></div>
      </motion.div>

      {/* alerts */}
      <motion.div
        className="so-win so-w-alerts"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
      >
        <div className="so-win-bar"><TriangleAlert size={11} /><b>Risk &amp; alerts</b><span className="so-badge warn">4</span></div>
        <div className="so-alerts">
          <AnimatePresence initial={false}>
            {live.alerts.map((a) => (
              <motion.div
                className={`so-alert ${a.tone}`} key={a.id} layout
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <i />
                <span><b>{a.code}</b>{a.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* floating toast */}
      <motion.div
        className="so-toast"
        initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      >
        <span className="so-toast-ic"><Check size={12} /></span>
        <span><b>Replenishment plan rescheduled</b><em>3 orders moved · no stockout risk</em></span>
      </motion.div>
    </div>
  </div>
);

/* =====================================================================
   4 · PREDICTIVE INTELLIGENCE
   ===================================================================== */
export const AiPanel = () => (
  <div className="so-ai">
    <div className="so-ai-head">
      <span className="so-ai-mark"><Sparkles size={13} /></span>
      <div><b>Emvive Intelligence</b><em>Trained on your network · updated hourly</em></div>
      <span className="so-pill accent">4 new</span>
    </div>

    <div className="so-ai-body">
      <div className="so-ai-list">
        {[
          ['Raise PO early for SKU 44192', 'Lead time from Al Faisal has drifted +2.4 days over 6 weeks. Ordering 3 days earlier removes the stockout risk.', 94, 'SAR 184k', 'high'],
          ['Reallocate volume from Gulf Packaging', 'OTIF has fallen to 64% across 11 receipts. Meridian can absorb the volume at +2% cost.', 88, 'SAR 42k', 'high'],
          ['Reduce cover on SKU 20871', '34 days of cover against 12-day demand. Releasing 22 days frees working capital.', 76, 'SAR 96k', 'med'],
        ].map(([t, d, conf, val, pri], i) => (
          <motion.div
            className="so-rec" key={t}
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
          >
            <div className="so-rec-top">
              <span className={`so-pri ${pri}`}>{pri === 'high' ? 'High impact' : 'Medium'}</span>
              <span className="so-conf">{conf}% confidence</span>
            </div>
            <b>{t}</b>
            <p>{d}</p>
            <div className="so-rec-foot">
              <span className="so-val">{val}<em>impact</em></span>
              <span className="so-acts"><i className="ok"><Check size={11} /> Apply</i><i><X size={11} /> Dismiss</i></span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="so-ai-side">
        <div className="so-fc">
          <div className="so-fc-h"><TrendingUp size={11} /><b>Demand forecast</b><span className="so-badge">94% acc</span></div>
          <div className="so-fc-chart">
            {[42, 48, 45, 56, 52, 64, 61, 72, 78, 74, 86, 92].map((v, i) => (
              <motion.i
                key={i} className={i > 7 ? 'proj' : ''}
                initial={{ height: 0 }} whileInView={{ height: `${v}%` }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.04, ease: EASE }}
              />
            ))}
          </div>
          <div className="so-fc-x"><span>W1</span><span>W6</span><span>W12</span></div>
        </div>

        <div className="so-risk">
          <div className="so-fc-h"><TriangleAlert size={11} /><b>Risk register</b></div>
          {[['Port congestion · Jebel Ali', 'high', 72], ['Single-source · SKU 31544', 'med', 48], ['FX exposure · EUR lane', 'low', 21]].map(([r, lvl, p]) => (
            <div className="so-riskrow" key={r}>
              <span>{r}</span>
              <span className="so-risktrack"><i className={lvl} style={{ width: `${p}%` }} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* =====================================================================
   5 · INTEGRATIONS — a connected ecosystem
   ===================================================================== */
const RING = [
  { k: 'ERP', icon: Database, a: -90 }, { k: 'CRM', icon: Users, a: -45 },
  { k: 'WMS', icon: Warehouse, a: 0 }, { k: 'Accounting', icon: Receipt, a: 45 },
  { k: 'Transport', icon: Truck, a: 90 }, { k: 'API', icon: Zap, a: 135 },
  { k: 'IoT sensors', icon: Cpu, a: 180 }, { k: 'Suppliers', icon: Factory, a: -135 },
];

export const IntegrationWeb = () => {
  const [ref, { w, h }] = useSize();
  const [hot, setHot] = useState(null);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.36;

  return (
    <div className="so-int" ref={ref}>
      {w > 0 && (
        <>
          <svg width={w} height={h} aria-hidden="true">
            <circle cx={cx} cy={cy} r={R} className="so-int-ring" />
            <circle cx={cx} cy={cy} r={R * 0.62} className="so-int-ring" />
            {RING.map((n, i) => {
              const rad = (n.a * Math.PI) / 180;
              const x = cx + Math.cos(rad) * R;
              const y = cy + Math.sin(rad) * R;
              return (
                <g key={n.k}>
                  <line x1={cx} y1={cy} x2={x} y2={y} className={`so-int-line ${hot === n.k ? 'lit' : ''}`} />
                  <motion.circle
                    r="3" className="so-int-packet"
                    animate={{ cx: [x, cx], cy: [y, cy], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.4, delay: i * 0.32, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }}
                  />
                </g>
              );
            })}
          </svg>

          <div className="so-int-core">
            <span><Boxes size={16} /></span>
            <b>Emvive</b>
            <em>One supply chain record</em>
          </div>

          {RING.map((n) => {
            const rad = (n.a * Math.PI) / 180;
            const Icon = n.icon;
            return (
              <div
                className={`so-int-node ${hot === n.k ? 'on' : ''}`}
                key={n.k}
                style={{ left: cx + Math.cos(rad) * R, top: cy + Math.sin(rad) * R }}
                onMouseEnter={() => setHot(n.k)}
                onMouseLeave={() => setHot(null)}
              >
                <Icon size={13} />
                <span>{n.k}</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

/* =====================================================================
   6 · BEFORE / AFTER
   ===================================================================== */
export const BeforeAfter = () => (
  <div className="so-ba">
    <div className="so-ba-col before">
      <span className="so-ba-k">Before Emvive</span>
      {[['Stock visibility', 'Weekly spreadsheet'], ['Stockouts found', 'Store manager calls'],
        ['Reorder points', 'Reviewed once a year'], ['Supplier performance', 'Argued at renewal'],
        ['Stock counts', 'Site closed for a weekend']].map(([k, v]) => (
        <div className="so-ba-row" key={k}><span>{k}</span><b>{v}</b></div>
      ))}
    </div>
    <div className="so-ba-mid"><i /><span>→</span><i /></div>
    <div className="so-ba-col after">
      <span className="so-ba-k">On Emvive</span>
      {[['Stock visibility', 'Live, to the bin'], ['Stockouts found', 'Predicted 2 weeks out'],
        ['Reorder points', 'Recalculated nightly'], ['Supplier performance', 'Drives allocation'],
        ['Stock counts', 'Continuous cycle counting']].map(([k, v]) => (
        <div className="so-ba-row" key={k}><span>{k}</span><b><Check size={11} />{v}</b></div>
      ))}
    </div>
  </div>
);

/* =====================================================================
   7 · ENTERPRISE SCALE
   ===================================================================== */
export const ScalePanel = () => (
  <div className="so-es">
    <div className="so-es-map">
      <span className="so-es-k"><Globe size={11} /> Regions</span>
      <div className="so-es-regions">
        {[['ksa-central-1', 'Riyadh', 'Primary', 'live'], ['uae-north-1', 'Dubai', 'Active', 'live'],
          ['ind-west-1', 'Mumbai', 'Active', 'live'], ['eu-west-1', 'Dublin', 'DR', 'standby']].map(([id, city, role, st]) => (
          <div className={`so-region ${st}`} key={id}>
            <i />
            <span className="so-mono">{id}</span>
            <em>{city} · {role}</em>
            <b>{st === 'live' ? 'Live' : 'Standby'}</b>
          </div>
        ))}
      </div>
    </div>

    <div className="so-es-grid">
      {[
        [ShieldCheck, 'Security', ['SSO & SCIM', 'Row-level access', 'Immutable audit trail']],
        [Check, 'Compliance', ['ISO 27001', 'SOC 2 Type II', 'GDPR & PDPL']],
        [Clock, 'Performance', ['p99 under 180ms', '99.98% uptime', 'Offline-capable scanning']],
        [ScanLine, 'Scale', ['4.2M lines / day', '212 outlets live', '9 DCs on one ledger']],
      ].map(([Icon, t, items], i) => (
        <motion.div
          className="so-es-cell" key={t}
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
        >
          <Icon size={15} />
          <b>{t}</b>
          {items.map((x) => <span key={x}><ArrowUpRight size={9} />{x}</span>)}
        </motion.div>
      ))}
    </div>
  </div>
);
