import React, { useMemo, useRef, useState } from 'react';
import {
  Ship, TriangleAlert, Warehouse, Factory, Maximize2, Minimize2, X,
  Command, Check, Waves, Truck,
} from 'lucide-react';
import { motion, EASE, useReducedMotion } from './motion';
import {
  DragPanel, Dock, DockIcon, LiveList, Ticker,
} from './SupplyUI';
import './SupplyControl.css';

/* =====================================================================
   CONTROL ROOM — the operations workbench

   Composed from three adapted primitives rather than a grid of tiles:

     · a browser frame that crops its own contents, so the workspace
       reads as a window onto something larger (the Magic UI "Safari"
       mockup idea, rebuilt as real DOM chrome we can put live product
       inside instead of an <img>)
     · four satellite panels on the DragPanel primitive (Aceternity's
       Draggable Card) — two of them deliberately cut by the frame edge,
       all of them draggable, expandable and closable
     · a risk feed on the LiveList primitive (Magic UI's Animated List)

   The wave board in the centre is the anchor: it never moves, and every
   satellite overlaps it. That is what an operations desk looks like.
   ===================================================================== */

const WAVES = [
  ['W-4212', 'Riyadh DC', 'Ambient A', 186, 12, 78, 'Picking'],
  ['W-4213', 'Riyadh DC', 'Chilled', 94, 6, 41, 'Picking'],
  ['W-4214', 'Jeddah DC', 'Ambient B', 142, 9, 96, 'Packing'],
  ['W-4215', 'Dammam DC', 'Bulk', 68, 4, 22, 'Released'],
  ['W-4216', 'Jeddah DC', 'Returns', 31, 2, 100, 'Closed'],
  ['W-4217', 'Riyadh DC', 'Ambient C', 118, 8, 0, 'Queued'],
  ['W-4218', 'Dammam DC', 'Chilled', 76, 5, 63, 'Picking'],
  ['W-4219', 'Jubail DC', 'Ambient A', 154, 11, 34, 'Picking'],
  ['W-4220', 'Riyadh DC', 'Frozen', 42, 3, 88, 'Packing'],
  ['W-4221', 'Jeddah DC', 'Bulk', 97, 6, 12, 'Released'],
  ['W-4222', 'Jubail DC', 'Returns', 24, 2, 0, 'Queued'],
  ['W-4223', 'Riyadh DC', 'Ambient B', 131, 9, 0, 'Queued'],
  ['W-4224', 'Dammam DC', 'Frozen', 58, 4, 0, 'Queued'],
  ['W-4225', 'Jeddah DC', 'Chilled', 88, 6, 0, 'Queued'],
];

const GANTT = [
  ['TRK-208', 'Riyadh → Buraidah', 6, 26, 'run'],
  ['TRK-214', 'Dammam → Muscat', 18, 34, 'run'],
  ['TRK-221', 'Jeddah → Makkah', 34, 18, 'late'],
  ['TRK-226', 'Riyadh → Kuwait City', 48, 30, 'run'],
  ['TRK-231', 'Doha → Muscat', 62, 24, 'plan'],
  ['TRK-238', 'Jubail → Dammam', 71, 20, 'plan'],
];

const PANELS = {
  ship: {
    label: 'Shipment activity', icon: Ship,
    box: { left: '-3%', top: '9%', width: '28%', height: '26%' },
    big: { left: '4%', top: '12%', width: '46%', height: '68%' },
  },
  alerts: {
    label: 'Inventory alerts', icon: TriangleAlert,
    box: { left: '0%', top: '44%', width: '26%', height: '31%' },
    big: { left: '4%', top: '14%', width: '44%', height: '66%' },
  },
  supplier: {
    label: 'Supplier status', icon: Factory,
    box: { left: '75%', top: '7%', width: '28%', height: '30%' },
    big: { left: '50%', top: '12%', width: '46%', height: '66%' },
  },
  warehouse: {
    label: 'Warehouse activity', icon: Warehouse,
    box: { left: '73%', top: '42%', width: '30%', height: '29%' },
    big: { left: '50%', top: '16%', width: '46%', height: '64%' },
  },
};

const PanelBody = ({ id, big, live }) => {
  if (id === 'ship') {
    const rows = [
      ['SHP-20418', 'Yantian → Jebel Ali', 68, '14 Aug'],
      ['SHP-20419', 'Singapore → Dammam', 41, '19 Aug'],
      ['SHP-20421', 'Mumbai → Riyadh', 88, '09 Aug'],
      ['SHP-20424', 'Rotterdam → Jeddah', 22, '22 Aug'],
      ['SHP-20427', 'Colombo → Jebel Ali', 55, '16 Aug'],
      ['SHP-20429', 'Istanbul → Cairo', 74, '13 Aug'],
      ['SHP-20431', 'Ho Chi Minh → Jubail', 9, '27 Aug'],
    ];
    return (
      <div className="cr-lanes">
        {rows.slice(0, big ? 7 : 4).map(([code, lane, p, eta]) => (
          <div className="cr-lane" key={code}>
            <div>
              <span className="mono">{code}</span>
              <em>{lane}</em>
              <u>{eta}</u>
            </div>
            <span className="cr-track">
              <motion.i
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: p / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE }}
              />
            </span>
          </div>
        ))}
        <div className="cr-foot"><span>Across 42 lanes</span><b>{live.transit} in transit</b></div>
      </div>
    );
  }

  if (id === 'alerts') {
    const rows = [
      ['SKU-44192', 'Reorder point breached', 'bad', '−2.1 d'],
      ['SKU-20871', '34 days cover vs 12 needed', 'warn', '+22 d'],
      ['SKU-31544', 'Single-sourced, no buffer', 'warn', '4 d'],
      ['SKU-11902', 'Below safety at 3 outlets', 'bad', '−0.6 d'],
      ['SKU-88410', 'Slow mover, 96 days aged', 'warn', '+84 d'],
      ['SKU-50218', 'Expiry inside 30 days', 'bad', '28 d'],
    ];
    return (
      <div className="cr-alerts">
        {rows.slice(0, big ? 6 : 4).map(([sku, text, tone, delta]) => (
          <div className={`cr-alert ${tone}`} key={sku}>
            <i />
            <span><b>{sku}</b>{text}</span>
            <u>{delta}</u>
          </div>
        ))}
        <div className="cr-foot"><span>Routed to buying &amp; cold chain</span><b>6 open</b></div>
      </div>
    );
  }

  if (id === 'supplier') {
    const rows = [
      ['Al Faisal Trading', 94, 'A', 'ok'],
      ['Nexa Components', 91, 'A', 'ok'],
      ['Gulf Packaging', 64, 'C', 'bad'],
      ['Meridian Labels', 97, 'A', 'ok'],
      ['Delta Chemicals', 82, 'B', 'warn'],
    ];
    return (
      <div className="cr-sup">
        {rows.slice(0, big ? 5 : 4).map(([name, otif, grade, tone]) => (
          <div className="cr-sup-row" key={name}>
            <span>{name}</span>
            <span className="cr-bar">
              <motion.i
                className={tone}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: otif / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </span>
            <b className="mono">{otif}%</b>
            <u className={tone}>{grade}</u>
          </div>
        ))}
        <div className="cr-foot"><span>Weighted OTIF, trailing 90 days</span><b>89.6%</b></div>
      </div>
    );
  }

  const rows = [
    ['Riyadh', 92, 38, 3],
    ['Jeddah', 64, 24, 2],
    ['Dammam', 81, 31, 1],
    ['Jubail', 96, 18, 2],
  ];
  return (
    <div className="cr-wh">
      {rows.map(([site, util, pickers, waves]) => (
        <div className="cr-wh-row" key={site}>
          <span>{site}</span>
          <span className="cr-bar">
            <motion.i
              className={util > 90 ? 'warn' : 'ok'}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: util / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </span>
          <b className="mono">{util}%</b>
          {big && <u>{pickers} pickers · {waves} waves</u>}
        </div>
      ))}
      <div className="cr-foot">
        <span>Lines picked per hour, network</span>
        <b><Ticker value={live.rate} /></b>
      </div>
    </div>
  );
};

export const ControlWorkbench = ({ live }) => {
  const deskRef = useRef(null);
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(Object.keys(PANELS));
  const [open, setOpen] = useState(Object.keys(PANELS));
  const [big, setBig] = useState(null);
  const [row, setRow] = useState(0);

  const raise = (id) => setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]));

  const notes = useMemo(() => live.notes.slice(0, 2), [live.notes]);

  return (
    <section className="cr" id="control">
      <div className="cr-inner">
        <header className="cr-head">
          <div>
            <span className="cr-kick"><Command size={12} /> Control room</span>
            <h2>
              A desk, not a dashboard.
              <em> Move it around.</em>
            </h2>
          </div>
          <p>
            The wave board holds the centre and never moves. Everything else is
            a panel you can drag, expand or put away — the same window layout
            your controllers keep open all shift.
          </p>
        </header>

        {/* the frame crops its own contents on purpose */}
        <div className="cr-frame">
          <div className="cr-chrome">
            <span className="cr-lights"><i /><i /><i /></span>
            <span className="cr-tabs">
              <b>Operations</b>
              <span>Procurement</span>
              <span>Planning</span>
            </span>
            <span className="cr-url">app.emvive.com/operations/control</span>
            <span className="cr-live"><i />9 SITES · 08:42 AST</span>
          </div>

          <div className="cr-desk" ref={deskRef}>
            {/* ---------- the anchor: wave board ---------- */}
            <div className="cr-board">
              <div className="cr-board-bar">
                <Waves size={12} />
                <b>Wave board</b>
                <span className="cr-chip">{WAVES.length} open</span>
                <span className="cr-board-sum">
                  <Ticker value={639} /> lines · <Ticker value={live.pickers} /> pickers on shift
                </span>
              </div>

              <div className="cr-th">
                <span>Wave</span><span>Site</span><span>Zone</span>
                <span>Lines</span><span>Pickers</span><span>Status</span><span>Progress</span>
              </div>

              <div className="cr-rows">
                {WAVES.map((wv, i) => (
                  <button
                    type="button"
                    key={wv[0]}
                    className={`cr-row ${row === i ? 'on' : ''}`}
                    onClick={() => setRow(i)}
                  >
                    <span className="mono">{wv[0]}</span>
                    <span>{wv[1]}</span>
                    <span>{wv[2]}</span>
                    <span className="mono">{wv[3]}</span>
                    <span className="mono">{wv[4]}</span>
                    <span className={`cr-state ${wv[6].toLowerCase()}`}>{wv[6]}</span>
                    <span className="cr-prog">
                      <motion.i
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: wv[5] / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.06, ease: EASE }}
                      />
                      <u>{wv[5]}%</u>
                    </span>
                  </button>
                ))}
              </div>

              {/* transport timeline, cropped by the frame so it reads as
                  the top of a longer schedule */}
              <div className="cr-gantt">
                <div className="cr-gantt-h">
                  <Truck size={11} />
                  <b>Transport</b>
                  <span className="cr-chip">12 active</span>
                  <span className="cr-hours">
                    {['06', '09', '12', '15', '18', '21'].map((hh) => <i key={hh}>{hh}</i>)}
                  </span>
                </div>
                {GANTT.map(([code, lane, start, len, tone], i) => (
                  <div className="cr-gantt-row" key={code}>
                    <span className="mono">{code}</span>
                    <span className="cr-gantt-track">
                      <motion.i
                        className={tone}
                        style={{ left: `${start}%` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${len}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
                      >
                        <em>{lane}</em>
                      </motion.i>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- satellites ---------- */}
            {Object.entries(PANELS).map(([id, p]) => {
              if (!open.includes(id)) return null;
              const Icon = p.icon;
              const isBig = big === id;
              const z = order.indexOf(id);
              return (
                <DragPanel
                  key={id}
                  containerRef={deskRef}
                  className={`cr-panel ${isBig ? 'big' : ''}`}
                  style={{ ...(isBig ? p.big : p.box), zIndex: 20 + z + (isBig ? 10 : 0) }}
                  front={z === order.length - 1}
                  onFocus={() => raise(id)}
                  bar={(
                    <>
                      <Icon size={11} />
                      <b>{p.label}</b>
                      <span className="cr-panel-acts">
                        <button
                          type="button"
                          aria-label={isBig ? 'Collapse' : 'Expand'}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => { setBig((v) => (v === id ? null : id)); raise(id); }}
                        >
                          {isBig ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                        </button>
                        <button
                          type="button"
                          aria-label={`Close ${p.label}`}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => { setOpen((o) => o.filter((x) => x !== id)); setBig((v) => (v === id ? null : v)); }}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    </>
                  )}
                >
                  <PanelBody id={id} big={isBig} live={live} />
                </DragPanel>
              );
            })}

            {/* ---------- risk feed ---------- */}
            <div className="cr-feed">
              <span className="cr-feed-k">Risk &amp; approvals</span>
              <LiveList
                items={notes}
                render={(n) => (
                  <div className={`cr-note ${n.tone}`}>
                    <span className="cr-note-ic">
                      {n.tone === 'ok' ? <Check size={11} /> : <TriangleAlert size={11} />}
                    </span>
                    <span><b>{n.t}</b><em>{n.m}</em></span>
                  </div>
                )}
              />
            </div>

            {/* ---------- dock ---------- */}
            <div className="cr-dockwrap">
              <Dock>
                {Object.entries(PANELS).map(([id, p]) => {
                  const Icon = p.icon;
                  return (
                    <DockIcon
                      key={id}
                      label={p.label}
                      active={open.includes(id)}
                      onClick={() => {
                        if (open.includes(id) && order[order.length - 1] === id) {
                          setOpen((o) => o.filter((x) => x !== id));
                          setBig((v) => (v === id ? null : v));
                        } else {
                          setOpen((o) => (o.includes(id) ? o : [...o, id]));
                          raise(id);
                        }
                      }}
                    >
                      <Icon size={16} />
                    </DockIcon>
                  );
                })}
              </Dock>
            </div>
          </div>
        </div>

        <p className="cr-hint">
          {reduced
            ? 'Panels are laid out for reduced motion — expand or close them from the dock.'
            : 'Drag a panel by its title bar · expand it · close it · bring it back from the dock.'}
        </p>
      </div>
    </section>
  );
};

export default ControlWorkbench;
