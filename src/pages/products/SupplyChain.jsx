import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Truck, ArrowRight, ArrowUpRight, Warehouse, ScanLine, Globe,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from './motion';
import { ProductPage, SubNav, ClosingCta, Footer } from './system';
import { NetworkScreen, SiteScreen, TaskScreen } from './SupplyApp';
import {
  NetworkMap, WarehouseFloor, ControlRoom, AiPanel, IntegrationWeb, BeforeAfter, ScalePanel,
} from './SupplyOps';
import { OperationsWorkspace } from './SupplyWorkspace';
import './SupplyApp.css';
import './SupplyOpsAdd.css';
import './SupplyChain.css';

/* =====================================================================
   EMVIVE SUPPLY CHAIN
   Signature mechanic: the drill-down stack. Three real screens pile up
   as you scroll — network, site, task — each sliding over the last with
   its edge still showing, the way you actually descend through an
   operations system. Nothing on this page is a diagram.
   ===================================================================== */

const ALERT_POOL = [
  { code: 'SKU-44192', text: 'reorder point breached', tone: 'bad' },
  { code: 'REF-042', text: 'reefer 6.4°C — above range', tone: 'bad' },
  { code: 'PO-8843', text: 'not acknowledged in 24h', tone: 'warn' },
  { code: 'SHP-20418', text: 'ETA slipped 48 hours', tone: 'warn' },
  { code: 'DOCK-D4', text: 'unload overrunning by 40m', tone: 'warn' },
];

const FEED_POOL = [
  { t: 'Wave 42 · 12 lines picked', m: 'A. Hassan · zone Ambient A' },
  { t: 'ASN-4471 received', m: '4,800 units · 0 discrepancies' },
  { t: 'Bin C-14-02 replenished', m: 'FEFO · batch B-2026-0417' },
  { t: 'TRK-208 departed', m: 'Dock D5 · 38 pallets' },
  { t: 'Cycle count closed', m: 'Aisle C · variance 0.02%' },
];

const EVENT_POOL = [
  { code: 'SHP-20419', text: 'berthed at Dammam', tone: 'ok' },
  { code: 'PO-8842', text: 'acknowledged by Nexa', tone: 'ok' },
  { code: 'REF-042', text: 'excursion cleared', tone: 'warn' },
  { code: 'WO-4414', text: 'run complete · 12,400 u', tone: 'ok' },
  { code: 'DC-RUH', text: 'wave 42 released', tone: 'ok' },
  { code: 'SKU-44192', text: 'reorder point breached', tone: 'bad' },
];

const mk = (pool) => (i) => ({ ...pool[i % pool.length], id: i });
const mkAlert = mk(ALERT_POOL);
const mkFeed = mk(FEED_POOL);
const PO_POOL = [
  { code: "PO-8841", sup: "Al Faisal Trading", val: "184,200", pct: 82, tone: "ok", state: "Confirmed" },
  { code: "PO-8842", sup: "Nexa Components", val: "311,450", pct: 64, tone: "ok", state: "Confirmed" },
  { code: "PO-8843", sup: "Gulf Packaging", val: "62,900", pct: 18, tone: "warn", state: "Awaiting ack" },
  { code: "PO-8844", sup: "Delta Chemicals", val: "128,700", pct: 41, tone: "info", state: "In approval" },
  { code: "PO-8845", sup: "Meridian Labels", val: "94,300", pct: 96, tone: "ok", state: "Shipped" },
  { code: "PO-8846", sup: "Orbit Textiles", val: "58,400", pct: 12, tone: "info", state: "Drafted" },
];

const NOTE_POOL = [
  { t: "Replenishment rescheduled", m: "3 orders moved · no stockout risk", tone: "ok" },
  { t: "Reefer excursion cleared", m: "REF-042 back in range at 3.2°C", tone: "ok" },
  { t: "PO-8843 still unacknowledged", m: "24h elapsed · escalated to buyer", tone: "warn" },
  { t: "Wave 42 released", m: "186 lines across 4 zones", tone: "ok" },
];

const mkEvent = mk(EVENT_POOL);
const mkPo = mk(PO_POOL);
const mkNote = mk(NOTE_POOL);


const useOpsLive = () => useLive(
  {
    n: 0, temp: 3.1, pickers: 38, rate: 412, transit: 342, otif: 96.4,
    alerts: [0, 1, 2].map(mkAlert), feed: [0, 1, 2, 3].map(mkFeed),
    events: [0, 1, 2].map(mkEvent),
    pos: [0, 1, 2, 3, 4].map(mkPo),
    poStage: 1,
    demand: [42, 48, 45, 56, 52, 64, 61, 72, 78, 74, 86, 92],
    notes: [0, 1].map(mkNote),
  },
  (s) => {
    const n = s.n + 1;
    const w = Math.sin(n * 1.1) * 0.6 + Math.sin(n * 0.7) * 0.4;
    return {
      n,
      temp: 3.1 + w * 0.25,
      pickers: Math.round(38 + w * 3),
      rate: Math.round(412 + w * 26),
      transit: Math.round(342 + w * 12),
      otif: 96.4 + w * 0.4,
      alerts: [mkAlert(s.alerts[0].id + 1), ...s.alerts.slice(0, 2)],
      feed: [mkFeed(s.feed[0].id + 1), ...s.feed.slice(0, 3)],
      events: [mkEvent(s.events[0].id + 1), ...s.events.slice(0, 2)],
      pos: [...s.pos.slice(1), mkPo(s.pos[s.pos.length - 1].id + 1)],
      poStage: (s.poStage + 1) % 5,
      demand: s.demand.map((d, i) => Math.max(30, Math.min(99, d + Math.sin(n * 0.7 + i) * 4))),
      notes: [mkNote(s.notes[0].id + 1), ...s.notes.slice(0, 1)],
    };
  },
  3200
);

/* ---------------------------------------------------------------
   OPENING — headline above, the network screen full width below,
   cropped by the fold. No side-by-side split.
   --------------------------------------------------------------- */
const Opening = ({ live }) => (
  <section className="sn-open" id="top">
    <div className="sn-open-bg" aria-hidden="true"><i /></div>

    <div className="sn-open-copy">
      <Reveal duration={0.7}>
        <span className="sn-kick"><i /> Emvive Supply Chain</span>
      </Reveal>
      <MaskText text="Run the network from" as="h1" className="sn-display" delay={0.06} />
      <MaskText text="one screen." accent="Down to the bin." as="h1" className="sn-display" delay={0.14} />
      <Reveal delay={0.38} y={16}>
        <p className="sn-lede">
          Procurement, warehousing, transport and planning in a single operations
          system — from a shipment leaving Yantian to the carton a picker is holding.
        </p>
      </Reveal>
      <Reveal delay={0.48} y={16}>
        <div className="sn-cta">
          <a href="#start" className="px-btn px-btn-solid">Book a demo <ArrowRight size={16} /></a>
          <a href="#drill" className="px-btn px-btn-quiet">See it drill down</a>
        </div>
      </Reveal>
    </div>

    <motion.div
      className="sn-open-screen"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.35, ease: EASE }}
    >
      <div className="sn-frame"><NetworkScreen live={live} /></div>
    </motion.div>
  </section>
);

/* ---------------------------------------------------------------
   THE DRILL-DOWN STACK — the signature interaction
   --------------------------------------------------------------- */
const LEVELS = [
  {
    id: 'network', icon: Globe, tag: 'Level 01 · Network',
    title: 'Every shipment, every lane.',
    line: 'Three hundred and forty-two shipments moving across forty-two lanes. Exceptions surface themselves; nobody runs a report to find them.',
  },
  {
    id: 'site', icon: Warehouse, tag: 'Level 02 · Site',
    title: 'Then inside one building.',
    line: 'Dock schedule, open waves, bin utilisation and the labour on shift — the screen a distribution centre is actually run from.',
  },
  {
    id: 'task', icon: ScanLine, tag: 'Level 03 · Task',
    title: 'Then into a picker’s hand.',
    line: 'The same system, on a handheld. Bin, SKU, quantity, FEFO batch. Every scan moves the ledger the moment it happens.',
  },
];

/* The stack is driven by a discrete active index rather than scroll-linked
   motion values. Motion values bound to style go through framer's native
   scroll-animation path, and when that bails the elements fall back to
   their static state — which stacked all three screens and all three
   captions on top of each other. A class change plus a CSS transition
   cannot fail that way, and the movement is identical. */
const Drill = ({ live }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(LEVELS.length - 1, Math.max(0, Math.floor(v * LEVELS.length * 0.999)));
    setActive((cur) => (cur === next ? cur : next));
  });

  const screens = [
    <NetworkScreen key="network" live={live} />,
    <SiteScreen key="site" live={live} />,
    <TaskScreen key="task" />,
  ];

  return (
    <section className="sn-drill" id="drill" ref={ref}>
      <div className="sn-drill-port">
        <div className="sn-drill-stack">
          {LEVELS.map((lv, i) => {
            const Icon = lv.icon;
            /* below = still waiting off-stage, laid = settled in the pile */
            const state = i > active ? 'below' : 'laid';
            return (
              <div
                className={`sn-layer ${state}`}
                key={lv.id}
                style={{ zIndex: i + 1, paddingTop: `${i * 30}px` }}
              >
                <div className="sn-layer-tab"><Icon size={11} />{lv.tag}</div>
                <div className="sn-frame flush">{screens[i]}</div>
              </div>
            );
          })}
        </div>

        <div className="sn-drill-copy">
          {LEVELS.map((lv, i) => (
            <div className={`sn-drill-note ${active === i ? 'on' : ''}`} key={lv.id}>
              <span className="sn-note-tag">{lv.tag}</span>
              <h2>{lv.title}</h2>
              <p>{lv.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   A dark instrumentation section. Used for every immersive band so
   they read as one wallboard family rather than assorted panels.
   --------------------------------------------------------------- */
const Band = ({ id, kicker, title, lede, height, wide, children, foot }) => (
  <section className={`sn-band ${wide ? 'wide' : ''}`} id={id}>
    <div className="sn-band-inner">
      <div className="sn-band-head">
        <div>
          <Reveal><span className="sn-kick"><i /> {kicker}</span></Reveal>
          <MaskText text={title} as="h2" className="sn-h2" />
        </div>
        {lede && <Reveal delay={0.14} y={14}><p>{lede}</p></Reveal>}
      </div>

      <Reveal delay={0.08} y={26}>
        <div className="so-panel" style={height ? { height } : undefined}>{children}</div>
      </Reveal>

      {foot && <div className="sn-band-foot">{foot}</div>}
    </div>
  </section>
);



/* ---------------------------------------------------------------
   BENTO — four more real screens, deliberately unequal
   --------------------------------------------------------------- */
const Bento = ({ live }) => (
  <section className="sn-bento" id="modules">
    <div className="sn-bento-inner">
      <div className="sn-bento-head">
        <Reveal><span className="sn-kick"><i /> The rest of the system</span></Reveal>
        <MaskText text="Four more screens, one record." as="h2" className="sn-h2" />
        <Reveal delay={0.16} y={14}>
          <p>
            Procurement, fleet, planning and supplier performance read and write the
            same stock ledger the warehouse does. No interfaces between them.
          </p>
        </Reveal>
      </div>

      <Reveal y={24}><OperationsWorkspace live={live} /></Reveal>
    </div>
  </section>
);

/* ---------------------------------------------------------------
   READOUT — metrics as an instrument strip, not big-number rows
   --------------------------------------------------------------- */
const Readout = () => (
  <section className="sn-readout" id="outcomes">
    <div className="sn-readout-inner">
      {[
        ['FILL RATE', '99.1', '%', 'across 212 outlets'],
        ['DEAD STOCK', '−34', '%', 'removed in year one'],
        ['COUNT SPEED', '4.2', '×', 'faster with scanning'],
        ['SHRINKAGE', '−21', '%', 'after twelve months'],
      ].map(([k, v, u, sub], i) => (
        <Reveal className="sn-cell" delay={i * 0.06} key={k}>
          <span className="sn-cell-k">{k}</span>
          <b>{v}<i>{u}</i></b>
          <span className="sn-cell-s">{sub}</span>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ---------------------------------------------------------------
   PROOF
   --------------------------------------------------------------- */
const Proof = () => (
  <section className="sn-proof">
    <div className="sn-proof-inner">
      <MaskText
        text="We used to find out about a stockout when a store manager called."
        as="blockquote"
        className="sn-quote"
      />
      <Reveal delay={0.2}>
        <div className="sn-by">
          <span>OS</span>
          <div><b>Omar Siddiqui</b><em>Head of Supply Chain, Nesto Group</em></div>
          <a href="#start" className="px-link">Case study <ArrowUpRight size={15} /></a>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ===================================================================== */
const SupplyChain = () => {
  const [live, ref] = useOpsLive();

  return (
    <ProductPage accent="#3557d8" accent2="#2a46bb" wash="rgba(53,87,216,0.09)" className="sn">
      <SubNav
        icon={Truck}
        name="Emvive Supply Chain"
        links={[
          { href: '#drill', label: 'Drill down' },
          { href: '#modules', label: 'Modules' },
          { href: '#outcomes', label: 'Outcomes' },
        ]}
      />

      <div ref={ref}>
        <Opening live={live} />

        {/* NEW — the network before you descend into it */}
        <Band
          id="network"
          kicker="Global supply network"
          title="Forty-two lanes, live."
          lede="Suppliers, ports and distribution centres on one map, with every route carrying its own telemetry. Hover any location to read it."
          height="min(70vh, 660px)"
          wide
        >
          <NetworkMap live={live} />
        </Band>

        {/* KEPT — the drill-down stack, untouched */}
        <Drill live={live} />

        {/* NEW — inside the building */}
        <Band
          id="warehouse"
          kicker="Warehouse intelligence"
          title="Every bin, every cart, every dock."
          lede="Receiving on the left, dispatch on the right, six aisles of live bin status in between — and the equipment moving through them."
          height="min(64vh, 600px)"
          wide
        >
          <WarehouseFloor live={live} />
        </Band>
      </div>

      <Bento live={live} />

      {/* NEW — the wallboard everything reports into */}
      <Band
        id="control"
        kicker="Control room"
        title="One desk, the whole operation."
        lede="Orders, shipments, inventory cover and risk on layered windows that update while you watch."
        height="min(74vh, 700px)"
        wide
      >
        <ControlRoom live={live} />
      </Band>

      {/* NEW — the system's own opinion */}
      <Band
        id="intelligence"
        kicker="Predictive intelligence"
        title="It tells you what to do next."
        lede="Recommendations scored by confidence and cash impact, built from your own lead times, demand history and supplier behaviour."
        height="min(70vh, 640px)"
      >
        <AiPanel />
      </Band>

      {/* NEW — the ecosystem */}
      <Band
        id="integrations"
        kicker="Connected"
        title="Wired to everything you already run."
        lede="ERP, CRM, accounting, transport, IoT sensors and your suppliers — reading and writing one supply chain record."
        height="min(60vh, 520px)"
      >
        <IntegrationWeb live={live} />
      </Band>

      <Readout />

      {/* NEW — before and after, on one surface */}
      <Band
        id="change"
        kicker="Customer success"
        title="What actually changes."
        lede="Measured across retail and distribution networks in their first year on the platform."
      >
        <BeforeAfter />
      </Band>

      {/* NEW — the enterprise questions */}
      <Band
        id="scale"
        kicker="Enterprise scale"
        title="Built for the whole group."
        lede="Regional residency, enterprise security and the throughput a national network actually generates."
      >
        <ScalePanel />
      </Band>

      <Proof />

      <ClosingCta
        label="Emvive Supply Chain"
        title="Put your network on one screen."
        lede="Share a month of stock movements. We will show you where the working capital is trapped and what the system would have ordered instead."
        primary="Book a demo"
        secondary="Talk to sales"
      />

      <Footer />
    </ProductPage>
  );
};

export default SupplyChain;
