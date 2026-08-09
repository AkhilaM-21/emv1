import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Truck, Warehouse, Factory, Boxes, Database, Receipt, Users, Radio, Zap, Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { motion, EASE } from '../shared/motion';
import { useSize } from '../shared/viz';
import './SupplyOps.css';

/* =====================================================================
   SUPPLY CHAIN — the cursor-spotlight integration ring.

   This file used to hold seven surfaces. The network map, control-room
   desk, AI panel, before/after split and enterprise-scale grid were
   rejected and replaced (SupplyControl / SupplyIntel / SupplySuccess /
   SupplyScale). The warehouse floor and the world map were cut outright.
   What is left is the one surface that was approved.
   ===================================================================== */

/* =====================================================================
   CONNECTED — the cursor-spotlight integration ring
   ===================================================================== */
const RING = [
  { k: 'ERP', icon: Database, a: -90 }, { k: 'CRM', icon: Users, a: -45 },
  { k: 'WMS', icon: Warehouse, a: 0 }, { k: 'Accounting', icon: Receipt, a: 45 },
  { k: 'Transport', icon: Truck, a: 90 }, { k: 'API', icon: Zap, a: 135 },
  { k: 'IoT sensors', icon: Cpu, a: 180 }, { k: 'Suppliers', icon: Factory, a: -135 },
];

export const IntegrationWeb = ({ live }) => {
  const [ref, { w, h }] = useSize();
  const [hot, setHot] = useState(null);
  const hostRef = useRef(null);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.36;

  /* the spotlight writes CSS variables straight to the node — pointer
     movement never triggers a React render */
  const track = (e) => {
    const el = hostRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    el.style.setProperty('--so', '1');
  };
  const dim = () => {
    const el = hostRef.current;
    if (el) el.style.setProperty('--so', '0');
  };

  return (
    <div className="so-int" ref={hostRef} onPointerMove={track} onPointerLeave={dim}>
      <span className="so-int-grid" aria-hidden="true" />
      <span className="so-int-beam" aria-hidden="true" />

      {/* LEFT — the feeds coming in */}
      <aside className="so-int-side">
        <span className="so-side-k"><ArrowUpRight size={10} /> Inbound feeds</span>
        {[
          [Zap, 'REST API', '4.2M calls / day', 'live'],
          [Database, 'EDI 850 / 856', '1,284 documents', 'live'],
          [Cpu, 'IoT gateway', '1,284 sensors', 'live'],
          [Users, 'Supplier portal', '128 vendors', 'live'],
          [Receipt, 'SFTP batch', 'nightly 02:00', 'idle'],
        ].map(([Icon, t, m, st]) => (
          <div className={`so-side-row ${st}`} key={t}>
            <span className="so-side-ic"><Icon size={12} /></span>
            <span className="so-side-t"><b>{t}</b><em>{m}</em></span>
            <i className="so-side-dot" />
          </div>
        ))}
        <div className="so-side-foot">
          <span>Throughput</span>
          <b className="so-mono">{live && live.sync ? live.sync : 1284}<em>/min</em></b>
        </div>
      </aside>

      {/* CENTRE — the ring */}
      <div className="so-int-stage" ref={ref}>
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
                    {/* the packet travels by transform, not by animating
                        cx/cy. Keyframing the attributes made framer emit
                        an "undefined" first frame for all eight packets —
                        sixteen SVG errors on every page load. The path
                        drawn is identical. */}
                    <motion.circle
                      r="3" className="so-int-packet" cx={x} cy={y}
                      animate={{ x: [0, cx - x], y: [0, cy - y], opacity: [0, 1, 1, 0] }}
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
                  <i className="so-int-blip" />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* RIGHT — what the sync is doing right now */}
      <aside className="so-int-side right">
        <span className="so-side-k"><Radio size={10} /> Sync activity</span>
        <div className="so-side-feed">
          <AnimatePresence initial={false}>
            {(live ? live.events : []).map((e) => (
              <motion.div
                className="so-side-ev" key={e.id} layout
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <i className={`so-dot ${e.tone}`} />
                <span><b>{e.code}</b>{e.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="so-side-stats">
          {[['Latency', '84ms'], ['Success', '99.98%'], ['Queued', '0']].map(([k, v]) => (
            <div key={k}><span>{k}</span><b className="so-mono">{v}</b></div>
          ))}
        </div>
        <div className="so-side-foot">
          <span>Last full sync</span>
          <b className="so-mono">2m ago</b>
        </div>
      </aside>

      {/* the light that lifts whatever it falls on, panels included */}
      <span className="so-int-lift" aria-hidden="true" />
    </div>
  );
};
