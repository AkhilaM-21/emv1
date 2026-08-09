import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronRight, ChevronDown, Plus, Filter, MoreHorizontal,
  Ship, Truck, Warehouse, PackageCheck, ClipboardList, Boxes, Users,
  TrendingUp, ScanLine, TriangleAlert, Check, Clock, MapPin, ArrowUpRight,
  Thermometer, Layers, Command,
} from 'lucide-react';
import { motion, EASE } from '../shared/motion';
import './SupplyApp.css';

/* =====================================================================
   EMVIVE SUPPLY CHAIN — the application
   Real warehouse, transport and procurement software. Tables, toolbars,
   dock schedules, wave lists, scan tasks. Nothing here is a diagram of
   a warehouse; it is the screen a warehouse is run from.
   ===================================================================== */

const NAV = [
  [Ship, 'Inbound', '24'],
  [Truck, 'Outbound', '38'],
  [Boxes, 'Stock', null],
  [ClipboardList, 'Waves', '3'],
  [PackageCheck, 'Receiving', '4'],
  [Users, 'Suppliers', null],
  [TrendingUp, 'Planning', null],
  [MapPin, 'Fleet', '12'],
];

/* ---------------------------------------------------------------
   SHELL
   --------------------------------------------------------------- */
export const Shell = ({ crumb, active = 0, chips, children, right }) => (
  <div className="sw-shell">
    <aside className="sw-side">
      <div className="sw-org">
        <span className="sw-org-mark">EM</span>
        <span className="sw-txt"><b>Nesto Group</b><i>9 DCs · 212 outlets</i></span>
        <ChevronDown size={12} className="sw-mute" />
      </div>
      <div className="sw-find"><Search size={11} /><span>Find order, SKU, ASN</span><kbd>⌘K</kbd></div>
      <nav>
        <span className="sw-nav-k">Operations</span>
        {NAV.map(([Icon, label, badge], i) => (
          <span className={`sw-nav ${i === active ? 'on' : ''}`} key={label}>
            <Icon size={13} strokeWidth={1.8} />
            <span>{label}</span>
            {badge && <i>{badge}</i>}
          </span>
        ))}
      </nav>
      <div className="sw-side-foot">
        <span className="sw-health"><i />Network healthy</span>
        <span className="sw-mono">99.1% fill</span>
      </div>
    </aside>

    <div className="sw-main">
      <div className="sw-bar">
        <div className="sw-crumb">
          <span>Nesto Group</span><ChevronRight size={10} />
          <span className="on">{crumb}</span>
        </div>
        <div className="sw-chips">
          {chips.map((c) => <span className="sw-chip" key={c}>{c}</span>)}
          <span className="sw-chip ghost"><Plus size={9} /> Filter</span>
          <span className="sw-chip ghost"><Filter size={9} /> Saved views</span>
        </div>
        <div className="sw-bar-r">
          <span className="sw-faces">{['OS', 'MK', 'AH'].map((a) => <i key={a}>{a}</i>)}</span>
          <span className="sw-ico"><Bell size={12} /><i /></span>
          <span className="sw-ico"><Command size={12} /></span>
        </div>
      </div>
      <div className="sw-work">{children}</div>
    </div>

    {right && <aside className="sw-insp">{right}</aside>}
  </div>
);

/* ---------------------------------------------------------------
   LEVEL 1 — the network: every shipment moving
   --------------------------------------------------------------- */
const SHIPMENTS = [
  ['SHP-20418', 'Yantian → Jebel Ali', 'MSC Layla', 'Sea', '14 Aug', 'warn', 'Delayed 48h', 'MK'],
  ['SHP-20419', 'Singapore → Dammam', 'Ever Given', 'Sea', '11 Aug', 'ok', 'On time', 'OS'],
  ['SHP-20420', 'Rotterdam → Jeddah', 'Maersk Kul', 'Sea', '19 Aug', 'ok', 'On time', 'AH'],
  ['SHP-20421', 'Mumbai → Riyadh', 'EK 908', 'Air', '09 Aug', 'info', 'Customs', 'MK'],
  ['SHP-20422', 'Jebel Ali → Dammam', 'TRK-208', 'Road', '08 Aug', 'ok', 'In transit', 'OS'],
  ['SHP-20423', 'Shanghai → Jeddah', 'COSCO Pride', 'Sea', '23 Aug', 'warn', 'Rebooked', 'AH'],
  ['SHP-20424', 'Jeddah → Makkah', 'TRK-331', 'Road', '08 Aug', 'ok', 'Delivered', 'MK'],
];

export const NetworkScreen = ({ live }) => (
  <Shell
    crumb="Inbound shipments"
    active={0}
    chips={['Window: 14 days', 'Mode: All', 'Status: Active']}
    right={<ShipmentInspector live={live} />}
  >
    <div className="sw-tablehead">
      <b>Shipments</b>
      <span className="sw-count">342 active</span>
      <div className="sw-tools">
        <span className="sw-chip ghost sm">Group: Lane</span>
        <MoreHorizontal size={12} className="sw-mute" />
      </div>
    </div>

    <div className="sw-table sw-t-net">
      <div className="sw-tr sw-th">
        <span className="sw-ck" /><span>Shipment</span><span>Lane</span><span>Carrier</span>
        <span>Mode</span><span>ETA</span><span>Status</span><span />
      </div>
      {SHIPMENTS.map(([id, lane, carrier, mode, eta, tone, state, who], i) => (
        <motion.div
          className={`sw-tr sw-row ${i === 0 ? 'sel' : ''}`} key={id}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
        >
          <span className="sw-ck"><i /></span>
          <span className="sw-mono sw-strong">{id}</span>
          <span>{lane}</span>
          <span className="sw-mute">{carrier}</span>
          <span><i className="sw-mode">{mode}</i></span>
          <span className="sw-mono">{eta}</span>
          <span><i className={`sw-pill ${tone}`}>{state}</i></span>
          <span className="sw-av">{who}</span>
        </motion.div>
      ))}
    </div>

    <div className="sw-strip">
      <span className="sw-strip-k"><TriangleAlert size={11} /> Exceptions</span>
      <AnimatePresence initial={false}>
        {live.alerts.map((a) => (
          <motion.span
            className={`sw-ex ${a.tone}`} key={a.id} layout
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <b>{a.code}</b>{a.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  </Shell>
);

const ShipmentInspector = ({ live }) => (
  <>
    <div className="sw-insp-bar"><b>SHP-20418</b><span className="sw-pill warn">Delayed 48h</span></div>
    <div className="sw-tabs"><span className="on">Detail</span><span>Lines</span><span>Docs</span></div>
    <div className="sw-fields">
      {[['Carrier', 'MSC Layla'], ['Container', 'MSCU-778412'], ['Consignment', 'B-2026-0417'], ['Units', '4,800'], ['Reefer', `${live.temp.toFixed(1)}°C`], ['Seal', 'SL-99184']].map(([k, v]) => (
        <div key={k}><span>{k}</span><b>{v}</b></div>
      ))}
    </div>
    <div className="sw-timeline">
      <span className="sw-sec">Milestones</span>
      {[['Booked', '28 Jul', 'done'], ['Departed Yantian', '30 Jul', 'done'], ['At sea', 'now', 'live'], ['Customs', 'est. 14 Aug', 'next'], ['Delivered DC', 'est. 17 Aug', 'next']].map(([t, d, s]) => (
        <div className={`sw-ms ${s}`} key={t}>
          <i>{s === 'done' && <Check size={8} strokeWidth={4} />}</i>
          <span className="sw-txt"><b>{t}</b><em>{d}</em></span>
        </div>
      ))}
    </div>
    <div className="sw-impact">
      <TriangleAlert size={11} />
      <span>Delay pushes 3 replenishment orders. Plan rescheduled automatically.</span>
    </div>
  </>
);

/* ---------------------------------------------------------------
   LEVEL 2 — the site: one distribution centre
   --------------------------------------------------------------- */
export const SiteScreen = ({ live }) => (
  <Shell
    crumb="Riyadh DC"
    active={4}
    chips={['Shift: 06:00–14:00', 'Zone: All']}
    right={<SiteInspector live={live} />}
  >
    <div className="sw-tablehead">
      <b>Dock schedule</b>
      <span className="sw-count">8 doors</span>
      <div className="sw-tools"><span className="sw-chip ghost sm">Today</span></div>
    </div>

    <div className="sw-docks">
      {[
        ['D1', 'ASN-4471 · Al Faisal', 18, 26, 'ok', 'Unloading'],
        ['D2', 'ASN-4472 · Nexa', 46, 20, 'ok', 'Booked'],
        ['D3', '—', 0, 0, 'idle', 'Free'],
        ['D4', 'ASN-4468 · Gulf Pack', 8, 16, 'warn', 'Overrun'],
        ['D5', 'OUT · Wave 42', 58, 28, 'ok', 'Loading'],
        ['D6', 'OUT · Wave 43', 74, 22, 'ok', 'Staged'],
      ].map(([d, job, start, len, tone, state], i) => (
        <div className="sw-dock" key={d}>
          <span className="sw-dock-id">{d}</span>
          <span className="sw-dock-job">{job}</span>
          <span className="sw-dock-track">
            {len > 0 && (
              <motion.i
                className={tone}
                style={{ left: `${start}%` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${len}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
              />
            )}
          </span>
          <span><i className={`sw-pill ${tone === 'idle' ? 'mute' : tone}`}>{state}</i></span>
        </div>
      ))}
    </div>

    <div className="sw-split">
      <div>
        <div className="sw-tablehead sub"><b>Open waves</b><span className="sw-count">3</span></div>
        <div className="sw-table sw-t-wave">
          <div className="sw-tr sw-th"><span>Wave</span><span>Zone</span><span>Lines</span><span>Progress</span></div>
          {[['W-42', 'Ambient A–C', '186', 74], ['W-43', 'Chilled', '92', 41], ['W-44', 'Bulk', '54', 12]].map(([w, z, l, p], i) => (
            <div className="sw-tr sw-row" key={w}>
              <span className="sw-mono sw-strong">{w}</span>
              <span>{z}</span>
              <span className="sw-mono">{l}</span>
              <span className="sw-prog">
                <motion.i
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: p / 100 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
                />
                <em>{p}%</em>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="sw-tablehead sub"><b>Bin utilisation</b><span className="sw-count">312 bins</span></div>
        <div className="sw-util">
          {[['Ambient A', 92], ['Ambient B', 78], ['Ambient C', 64], ['Chilled', 88], ['Frozen', 41], ['Bulk', 56]].map(([z, p], i) => (
            <div className="sw-util-row" key={z}>
              <span>{z}</span>
              <span className="sw-util-track">
                <motion.i
                  className={p > 85 ? 'hot' : ''}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: p / 100 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.07, ease: EASE }}
                />
              </span>
              <b className="sw-mono">{p}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Shell>
);

const SiteInspector = ({ live }) => (
  <>
    <div className="sw-insp-bar"><b>Riyadh DC</b><span className="sw-pill ok">Running</span></div>
    <div className="sw-kpis">
      {[['Pickers', `${live.pickers}`], ['Lines / hr', `${live.rate}`], ['Dock util', '82%'], ['Accuracy', '99.98%']].map(([k, v]) => (
        <div key={k}><span>{k}</span><b className="sw-mono">{v}</b></div>
      ))}
    </div>
    <div className="sw-timeline">
      <span className="sw-sec">Live floor</span>
      <AnimatePresence initial={false}>
        {live.feed.map((f) => (
          <motion.div
            className="sw-feed" key={f.id} layout
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <i className="sw-feed-dot" />
            <span className="sw-txt"><b>{f.t}</b><em>{f.m}</em></span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>
);

/* ---------------------------------------------------------------
   LEVEL 3 — the task: what the picker is holding
   --------------------------------------------------------------- */
export const TaskScreen = () => (
  <Shell crumb="Wave 42 · Task" active={3} chips={['Zone: Ambient A', 'Assigned: A. Hassan']}>
    <div className="sw-taskwrap">
      <div className="sw-tasklist">
        <div className="sw-tablehead sub"><b>Pick tasks</b><span className="sw-count">186 lines</span></div>
        <div className="sw-table sw-t-task">
          <div className="sw-tr sw-th"><span>Seq</span><span>Bin</span><span>SKU</span><span>Qty</span><span>Status</span></div>
          {[
            ['001', 'A-04-12', '44192 · Milk 1L', '48', 'ok', 'Picked'],
            ['002', 'A-06-03', '20871 · Yoghurt', '24', 'ok', 'Picked'],
            ['003', 'A-09-21', '31544 · Butter', '36', 'live', 'Picking'],
            ['004', 'B-02-08', '44810 · Cream', '12', 'next', 'Queued'],
            ['005', 'B-05-14', '31902 · Labneh', '60', 'next', 'Queued'],
          ].map(([seq, bin, sku, qty, tone, state]) => (
            <div className={`sw-tr sw-row ${tone === 'live' ? 'sel' : ''}`} key={seq}>
              <span className="sw-mono sw-mute">{seq}</span>
              <span className="sw-mono sw-strong">{bin}</span>
              <span>{sku}</span>
              <span className="sw-mono">{qty}</span>
              <span><i className={`sw-pill ${tone === 'ok' ? 'ok' : tone === 'live' ? 'info' : 'mute'}`}>{state}</i></span>
            </div>
          ))}
        </div>
      </div>

      {/* the handheld the picker is actually holding */}
      <div className="sw-hh">
        <div className="sw-hh-top"><span>WAVE 42</span><span className="sw-mono">03 / 186</span></div>
        <div className="sw-hh-bin">
          <span>GO TO BIN</span>
          <b className="sw-mono">A-09-21</b>
        </div>
        <div className="sw-hh-item">
          <div><span>SKU</span><b className="sw-mono">31544</b></div>
          <div><span>QTY</span><b className="sw-mono">36</b></div>
          <div><span>UOM</span><b className="sw-mono">CASE</b></div>
        </div>
        <div className="sw-hh-scan">
          <ScanLine size={14} />
          <span>Scan bin to confirm</span>
        </div>
        <div className="sw-hh-fefo"><Thermometer size={10} /> FEFO · batch B-2026-0417 · exp 22 Aug</div>
      </div>
    </div>
  </Shell>
);

/* ---------------------------------------------------------------
   SUPPORTING SCREENS — used in the bento
   --------------------------------------------------------------- */
export const ProcurementScreen = () => (
  <div className="sw-mini">
    <div className="sw-mini-bar"><ClipboardList size={11} /><b>Purchase orders</b><span className="sw-count">142</span><span className="sw-pill accent">12 auto-raised</span></div>
    <div className="sw-table sw-t-po">
      <div className="sw-tr sw-th"><span>PO</span><span>Supplier</span><span>Value</span><span>Status</span></div>
      {[
        ['PO-8841', 'Al Faisal Trading', '184,200', 'ok', 'Confirmed'],
        ['PO-8842', 'Nexa Components', '311,450', 'ok', 'Confirmed'],
        ['PO-8843', 'Gulf Packaging', '62,900', 'warn', 'Awaiting'],
        ['PO-8844', 'Delta Chemicals', '128,700', 'info', 'Approval'],
      ].map(([po, sup, val, tone, state]) => (
        <div className="sw-tr sw-row" key={po}>
          <span className="sw-mono sw-strong">{po}</span>
          <span>{sup}</span>
          <span className="sw-mono r">{val}</span>
          <span><i className={`sw-pill ${tone}`}>{state}</i></span>
        </div>
      ))}
    </div>
  </div>
);

export const FleetScreen = () => (
  <div className="sw-mini">
    <div className="sw-mini-bar"><Truck size={11} /><b>Fleet · today</b><span className="sw-count">12 vehicles</span></div>
    <div className="sw-gantt">
      {[
        ['TRK-114', 'Riyadh → Qassim', 6, 28, 'ok'],
        ['TRK-208', 'Dammam → Riyadh', 20, 36, 'ok'],
        ['REF-042', 'Riyadh → Kharj', 36, 24, 'warn'],
        ['TRK-517', 'Jubail → Dammam', 54, 22, 'ok'],
        ['REF-088', 'Jeddah → Taif', 64, 30, 'ok'],
      ].map(([v, lane, start, len, tone], i) => (
        <div className="sw-gl" key={v}>
          <span className="sw-mono sw-strong">{v}</span>
          <span className="sw-gl-lane">{lane}</span>
          <span className="sw-gl-track">
            <motion.i
              className={tone} style={{ left: `${start}%` }}
              initial={{ width: 0 }} whileInView={{ width: `${len}%` }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
            />
          </span>
        </div>
      ))}
    </div>
    <div className="sw-mini-foot"><span>On-time 94.2%</span><span>Utilisation 81%</span><span>Idle 3</span></div>
  </div>
);

export const ForecastScreen = () => (
  <div className="sw-mini">
    <div className="sw-mini-bar"><TrendingUp size={11} /><b>Demand plan</b><span className="sw-count">12 weeks</span></div>
    <div className="sw-plan">
      <div className="sw-plan-row sw-plan-head">
        <span>SKU</span>
        {['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((w) => <span key={w}>{w}</span>)}
      </div>
      {[
        ['44192', [420, 468, 512, 496, 540, 588]],
        ['20871', [180, 176, 204, 232, 218, 240]],
        ['31544', [96, 112, 108, 140, 156, 172]],
        ['44810', [64, 58, 72, 88, 84, 96]],
      ].map(([sku, vals]) => (
        <div className="sw-plan-row" key={sku}>
          <span className="sw-mono sw-strong">{sku}</span>
          {vals.map((v, i) => (
            <span className="sw-mono sw-cell" key={i} style={{ '--h': Math.min(1, v / 600) }}>{v}</span>
          ))}
        </div>
      ))}
    </div>
    <div className="sw-mini-foot"><span>Accuracy 94%</span><span>Bias +1.2%</span><span>Reorder points live</span></div>
  </div>
);

export const SupplierScreen = () => (
  <div className="sw-mini">
    <div className="sw-mini-bar"><Users size={11} /><b>Supplier scorecards</b><span className="sw-count">128 rated</span></div>
    <div className="sw-table sw-t-sup">
      <div className="sw-tr sw-th"><span>Supplier</span><span>OTIF</span><span>Quality</span><span>Lead</span><span>Grade</span></div>
      {[
        ['Al Faisal Trading', '98%', '94%', '4d', 'A'],
        ['Nexa Components', '91%', '88%', '7d', 'B'],
        ['Meridian Labels', '96%', '97%', '3d', 'A'],
        ['Gulf Packaging', '64%', '79%', '11d', 'C'],
      ].map(([n, otif, q, lead, g]) => (
        <div className="sw-tr sw-row" key={n}>
          <span>{n}</span>
          <span className="sw-mono">{otif}</span>
          <span className="sw-mono">{q}</span>
          <span className="sw-mono">{lead}</span>
          <span><i className={`sw-grade g-${g}`}>{g}</i></span>
        </div>
      ))}
    </div>
    <div className="sw-mini-foot"><span>Allocation shifts automatically on grade</span></div>
  </div>
);

export const ICONS = { Warehouse, Layers, Clock, ArrowUpRight };
