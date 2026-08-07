import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Users, TrendingUp, Truck, Check, ArrowUpRight,
  MoreHorizontal, Plus, Filter, Clock, Thermometer,
} from 'lucide-react';
import { motion, EASE } from './motion';
import './SupplyWorkspace.css';

/* =====================================================================
   OPERATIONS WORKSPACE
   Replaces the four-equal-card grid. Editorial asymmetry: a tall
   purchase-order desk on the left, two shorter panels stacked beside
   it, and a wide fleet timeline underneath. Same information, four
   different visual weights.
   ===================================================================== */

const LIFECYCLE = ['Raised', 'Approved', 'Manufacturing', 'Shipping', 'Delivered'];

/* --- LARGE: the purchase order desk ------------------------------- */
const PoDesk = ({ live }) => (
  <section className="ws-panel ws-po">
    <header className="ws-bar">
      <span className="ws-ic"><ClipboardList size={12} /></span>
      <b>Purchase orders</b>
      <span className="ws-count">142 open</span>
      <div className="ws-tools">
        <span className="ws-chip"><Plus size={9} /> New</span>
        <span className="ws-chip"><Filter size={9} /> Status</span>
        <MoreHorizontal size={13} className="ws-dim" />
      </div>
    </header>

    {/* the stage one order is currently walking through */}
    <div className="ws-life">
      {LIFECYCLE.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <span className={`ws-life-link ${i <= live.poStage ? 'on' : ''}`} />}
          <span className={`ws-life-node ${i < live.poStage ? 'done' : ''} ${i === live.poStage ? 'now' : ''}`}>
            <i>{i < live.poStage ? <Check size={9} strokeWidth={4} /> : i + 1}</i>
            <em>{s}</em>
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
            className="ws-tr ws-row" key={p.id} layout
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 22, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="ws-mono ws-lit">{p.code}</span>
            <span>{p.sup}</span>
            <span className="ws-mono ws-lit ws-r">{p.val}</span>
            <span className="ws-prog">
              <motion.i animate={{ width: `${p.pct}%` }} transition={{ duration: 0.9, ease: EASE }} />
              <em>{p.pct}%</em>
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
);

/* --- SMALL: supplier scorecard ------------------------------------ */
const SupplierCard = () => (
  <section className="ws-panel ws-sup">
    <header className="ws-bar">
      <span className="ws-ic"><Users size={12} /></span>
      <b>Supplier scorecard</b>
      <span className="ws-count">128 rated</span>
    </header>
    <div className="ws-sup-list">
      {[['Al Faisal Trading', 96, 'A', '+2'], ['Meridian Labels', 94, 'A', '+1'],
        ['Nexa Components', 88, 'B', '−3'], ['Gulf Packaging', 64, 'C', '−11']].map(([n, sc, g, d], i) => (
        <div className="ws-sup-row" key={n}>
          <span className={`ws-g g-${g}`}>{g}</span>
          <span className="ws-sup-n">{n}</span>
          <span className="ws-sup-bar">
            <motion.i
              className={`g-${g}`}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: Number(sc) / 100 }}
              viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.09, ease: EASE }}
            />
          </span>
          <b className="ws-mono">{sc}</b>
          <em className={String(d).startsWith('+') ? 'up' : 'down'}>{d}</em>
        </div>
      ))}
    </div>
    <footer className="ws-foot"><span>Allocation follows grade automatically</span></footer>
  </section>
);

/* --- SMALL: demand plan ------------------------------------------- */
const DemandCard = ({ live }) => (
  <section className="ws-panel ws-fc">
    <header className="ws-bar">
      <span className="ws-ic"><TrendingUp size={12} /></span>
      <b>Demand plan</b>
      <span className="ws-count">12 weeks</span>
      <div className="ws-tools"><span className="ws-pill accent">94% accuracy</span></div>
    </header>
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
);

/* --- LARGE: fleet timeline ---------------------------------------- */
const FLEET = [
  ['TRK-114', 'Riyadh → Qassim', 6, 26, 'ok', 'Delivered'],
  ['TRK-208', 'Dammam → Riyadh', 20, 34, 'ok', 'In transit'],
  ['REF-042', 'Riyadh → Kharj', 34, 24, 'warn', 'Delayed 40m'],
  ['TRK-517', 'Jubail → Dammam', 52, 22, 'ok', 'Loading'],
  ['REF-088', 'Jeddah → Taif', 62, 28, 'ok', 'Scheduled'],
];

const FleetTimeline = () => (
  <section className="ws-panel ws-fleet">
    <header className="ws-bar">
      <span className="ws-ic"><Truck size={12} /></span>
      <b>Fleet timeline · today</b>
      <span className="ws-count">12 vehicles</span>
      <div className="ws-tools">
        <span className="ws-pill ok">On-time 94.2%</span>
        <span className="ws-chip"><Clock size={9} /> 24h</span>
      </div>
    </header>

    <div className="ws-fl-head">
      <span />
      <div>{['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t) => <em key={t}>{t}</em>)}</div>
    </div>

    <div className="ws-fl-body">
      {FLEET.map(([v, lane, start, len, tone, label], i) => (
        <div className="ws-fl-lane" key={v}>
          <span className="ws-fl-v">
            <i className={String(v).startsWith('REF') ? 'ref' : ''}>
              {String(v).startsWith('REF') ? <Thermometer size={9} /> : <Truck size={9} />}
            </i>
            <b className="ws-mono">{v}</b>
            <em>{lane}</em>
          </span>
          <span className="ws-fl-track">
            <motion.i
              className={tone}
              style={{ left: `${start}%` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${len}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: EASE }}
            >
              <em>{label}</em>
            </motion.i>
            {tone === 'ok' && (
              <motion.span
                className="ws-fl-dot"
                animate={{ left: [`${start}%`, `${start + len}%`] }}
                transition={{ duration: 11 + i * 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  </section>
);

/* ===================================================================== */
export const OperationsWorkspace = ({ live }) => (
  <div className="ws">
    <PoDesk live={live} />
    <div className="ws-right">
      <SupplierCard />
      <DemandCard live={live} />
    </div>
    <FleetTimeline />
  </div>
);

export const WorkspaceLink = () => (
  <a href="#control" className="ws-link">
    See it running in the control room <ArrowUpRight size={14} />
  </a>
);
