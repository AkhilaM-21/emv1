import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Users, TrendingUp, Truck, Check, Database, Factory,
  Warehouse, Boxes, Package, Receipt, Cpu, ShieldCheck, Radio, Zap,
} from 'lucide-react';
import { motion, EASE } from './motion';
import './SupplyWorkspace.css';

/* =====================================================================
   OPERATIONS WORKSPACE
   Replaces the four-equal-card grid. Editorial asymmetry — one large
   purchase-order desk, two small panels beside it, one wide fleet
   timeline underneath. Rows arrive, badges change, the order lifecycle
   advances on its own.
   ===================================================================== */

const PO_STAGES = ['Raised', 'Approved', 'Manufacturing', 'Shipping', 'Delivered'];

export const OperationsWorkspace = ({ live }) => (
  <div className="ws">
    {/* --- LARGE: purchase order desk --- */}
    <section className="ws-po">
      <header className="ws-bar">
        <ClipboardList size={12} />
        <b>Purchase orders</b>
        <span className="ws-count">142 open</span>
        <span className="ws-pill accent">12 raised automatically</span>
      </header>

      {/* the lifecycle one order is walking through, live */}
      <div className="ws-life">
        {PO_STAGES.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className={`ws-life-link ${i <= live.poStage ? 'on' : ''}`} />}
            <span className={`ws-life-node ${i < live.poStage ? 'done' : ''} ${i === live.poStage ? 'now' : ''}`}>
              <i>{i < live.poStage ? <Check size={9} strokeWidth={4} /> : i + 1}</i>
              {s}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="ws-table">
        <div className="ws-tr ws-th">
          <span>Order</span><span>Supplier</span><span>Value</span><span>Progress</span><span>Status</span>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {live.pos.map((p) => (
            <motion.div
              className="ws-tr" key={p.id} layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="ws-mono ws-lit">{p.code}</span>
              <span>{p.sup}</span>
              <span className="ws-mono ws-lit ws-r">{p.val}</span>
              <span className="ws-prog">
                <motion.i animate={{ width: `${p.pct}%` }} transition={{ duration: 0.8, ease: EASE }} />
              </span>
              <span><i className={`ws-pill ${p.tone}`}>{p.state}</i></span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="ws-foot">
        <span>Committed <b>SAR 4.28M</b></span>
        <span>Avg approval <b>4.2h</b></span>
        <span className="ws-pill ok">98% within SLA</span>
      </footer>
    </section>

    {/* --- SMALL: supplier scorecard --- */}
    <section className="ws-sup">
      <header className="ws-bar"><Users size={12} /><b>Supplier scorecard</b><span className="ws-count">128</span></header>
      <div className="ws-sup-list">
        {[['Al Faisal', 96, 'A'], ['Meridian', 94, 'A'], ['Nexa', 88, 'B'], ['Gulf Pack', 64, 'C']].map(([n, sc, g], i) => (
          <div className="ws-sup-row" key={n}>
            <span className={`ws-g g-${g}`}>{g}</span>
            <span className="ws-sup-n">{n}</span>
            <span className="ws-sup-bar">
              <motion.i
                className={`g-${g}`}
                initial={{ scaleX: 0 }} whileInView={{ scaleX: sc / 100 }}
                viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.09, ease: EASE }}
              />
            </span>
            <b className="ws-mono">{sc}</b>
          </div>
        ))}
      </div>
      <footer className="ws-foot"><span>Allocation follows grade</span></footer>
    </section>

    {/* --- SMALL: demand forecast --- */}
    <section className="ws-fc">
      <header className="ws-bar"><TrendingUp size={12} /><b>Demand forecast</b><span className="ws-count">94% acc</span></header>
      <div className="ws-chart">
        {live.demand.map((v, i) => (
          <motion.i
            key={i}
            className={i > 7 ? 'proj' : ''}
            animate={{ height: `${v}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        ))}
      </div>
      <div className="ws-x"><span>W1</span><span>W6</span><span>W12</span></div>
      <footer className="ws-foot"><span>Reorder points recalculated nightly</span></footer>
    </section>

    {/* --- LARGE: fleet timeline --- */}
    <section className="ws-fleet">
      <header className="ws-bar">
        <Truck size={12} /><b>Fleet timeline · today</b>
        <span className="ws-count">12 vehicles</span>
        <span className="ws-pill ok">On-time 94.2%</span>
      </header>
      <div className="ws-fl-head">
        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="ws-fl-body">
        {[
          ['TRK-114', 'Riyadh → Qassim', 6, 26, 'ok'],
          ['TRK-208', 'Dammam → Riyadh', 20, 34, 'ok'],
          ['REF-042', 'Riyadh → Kharj', 34, 24, 'warn'],
          ['TRK-517', 'Jubail → Dammam', 52, 22, 'ok'],
          ['REF-088', 'Jeddah → Taif', 62, 28, 'ok'],
        ].map(([v, lane, start, len, tone], i) => (
          <div className="ws-fl-lane" key={v}>
            <span className="ws-fl-v"><i className={String(v).startsWith('REF') ? 'ref' : ''} />{v}</span>
            <span className="ws-fl-n">{lane}</span>
            <span className="ws-fl-track">
              <motion.i
                className={tone} style={{ left: `${start}%` }}
                initial={{ width: 0 }} whileInView={{ width: `${len}%` }}
                viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.07, ease: EASE }}
              />
              {tone === 'ok' && (
                <motion.em
                  animate={{ left: [`${start}%`, `${start + len}%`] }}
                  transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

/* =====================================================================
   SUPPLY CHAIN ECOSYSTEM
   Replaces the radial mind map. A real operational chain: nine stages,
   each a live panel, wired with packets that actually travel.
   ===================================================================== */

const CHAIN = [
  { k: 'ERP', icon: Database, m: 'Master data', v: 'synced 2m' },
  { k: 'Procurement', icon: ClipboardList, m: 'Open orders', v: '142' },
  { k: 'Manufacturing', icon: Factory, m: 'Work orders', v: '18 running' },
  { k: 'Warehouse', icon: Warehouse, m: 'Waves', v: '3 open' },
  { k: 'Inventory', icon: Boxes, m: 'Days cover', v: '18.4' },
  { k: 'Transport', icon: Truck, m: 'In transit', v: '342' },
  { k: 'Distribution', icon: Package, m: 'Outbound', v: '38 loads' },
  { k: 'Retail', icon: Receipt, m: 'Outlets', v: '212 live' },
  { k: 'Customer', icon: Users, m: 'Fill rate', v: '99.1%' },
];

export const EcosystemFlow = ({ live }) => (
  <div className="ws-eco">
    <div className="ws-eco-top">
      <span className="ws-eco-k"><Zap size={11} /> One record · nine stages</span>
      <span className="ws-eco-live"><i />API sync · {live.sync} events / min</span>
    </div>

    <div className="ws-eco-rail">
      {CHAIN.map((c, i) => {
        const Icon = c.icon;
        const hot = live.n % CHAIN.length === i;
        return (
          <React.Fragment key={c.k}>
            {i > 0 && (
              <span className="ws-eco-link">
                <motion.i
                  animate={{ left: ['-34%', '134%'] }}
                  transition={{ duration: 2, delay: i * 0.26, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
                />
              </span>
            )}
            <motion.div
              className={`ws-eco-node ${hot ? 'hot' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.055, ease: EASE }}
            >
              <span className="ws-eco-ic"><Icon size={14} /></span>
              <b>{c.k}</b>
              <em>{c.m}</em>
              <span className="ws-eco-v">{c.v}</span>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>

    <div className="ws-eco-foot">
      {[
        [Cpu, 'IoT sensors', '1,284 devices reporting'],
        [ShieldCheck, 'API gateway', 'REST · webhooks · EDI'],
        [Radio, 'Supplier portals', '128 connected'],
      ].map(([Icon, t, m]) => (
        <div className="ws-eco-cell" key={t}>
          <Icon size={13} />
          <div><b>{t}</b><em>{m}</em></div>
        </div>
      ))}
    </div>
  </div>
);

/* =====================================================================
   SPOTLIT — cursor-lit wrapper. Writes CSS variables straight to the
   node, so pointer movement never triggers a React render.
   ===================================================================== */
export const Spotlit = ({ children, className = '' }) => {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    el.style.setProperty('--so', '1');
  };

  const leave = () => {
    const el = ref.current;
    if (el) el.style.setProperty('--so', '0');
  };

  return (
    <div ref={ref} className={`ws-spot ${className}`} onPointerMove={move} onPointerLeave={leave}>
      <span className="ws-spot-grid" aria-hidden="true" />
      <span className="ws-spot-glow" aria-hidden="true" />
      <div className="ws-spot-body">{children}</div>
    </div>
  );
};
