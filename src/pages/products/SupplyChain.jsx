import React, { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import {
  Truck, ArrowRight, ArrowUpRight, Warehouse, ScanLine, Globe,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, safeRange, EASE } from './motion';
import { ProductPage, SubNav, ClosingCta, Footer } from './system';
import {
  NetworkScreen, SiteScreen, TaskScreen,
  ProcurementScreen, FleetScreen, ForecastScreen, SupplierScreen,
} from './SupplyApp';
import './SupplyApp.css';
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

const mk = (pool) => (i) => ({ ...pool[i % pool.length], id: i });
const mkAlert = mk(ALERT_POOL);
const mkFeed = mk(FEED_POOL);

const useOpsLive = () => useLive(
  { n: 0, temp: 3.1, pickers: 38, rate: 412, alerts: [0, 1, 2].map(mkAlert), feed: [0, 1, 2, 3].map(mkFeed) },
  (s) => {
    const n = s.n + 1;
    const w = Math.sin(n * 1.1) * 0.6 + Math.sin(n * 0.7) * 0.4;
    return {
      n,
      temp: 3.1 + w * 0.25,
      pickers: Math.round(38 + w * 3),
      rate: Math.round(412 + w * 26),
      alerts: [mkAlert(s.alerts[0].id + 1), ...s.alerts.slice(0, 2)],
      feed: [mkFeed(s.feed[0].id + 1), ...s.feed.slice(0, 3)],
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

/* One layer of the stack. A component rather than a loop body, so the
   scroll transforms are real hook calls at a stable call site. */
const DrillLayer = ({ level, index, count, progress, children }) => {
  const from = index / count;
  const to = (index + 0.62) / count;
  const y = useTransform(progress, safeRange([from, to]), index === 0 ? ['0%', '0%'] : ['104%', '0%']);
  const Icon = level.icon;

  return (
    <motion.div
      className="sn-layer"
      style={{ y, zIndex: index + 1, top: `${index * 24}px` }}
    >
      <div className="sn-layer-tab"><Icon size={11} />{level.tag}</div>
      <div className="sn-frame flush">{children}</div>
    </motion.div>
  );
};

const DrillNote = ({ level, index, count, progress }) => {
  const from = index / count;
  const to = (index + 0.62) / count;
  const opacity = useTransform(
    progress,
    safeRange([from - 0.08, from + 0.05, to + 0.1, to + 0.22]),
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0]
  );

  return (
    <motion.div className="sn-drill-note" style={{ opacity }}>
      <span className="sn-note-tag">{level.tag}</span>
      <h2>{level.title}</h2>
      <p>{level.line}</p>
    </motion.div>
  );
};

const Drill = ({ live }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  /* the three levels, in order — rendered inside their own layer, so no
     key is needed on the elements themselves */
  const screens = [
    <NetworkScreen key="network" live={live} />,
    <SiteScreen key="site" live={live} />,
    <TaskScreen key="task" />,
  ];

  return (
    <section className="sn-drill" id="drill" ref={ref}>
      <div className="sn-drill-port">
        <div className="sn-drill-stack">
          {LEVELS.map((lv, i) => (
            <DrillLayer key={lv.id} level={lv} index={i} count={LEVELS.length} progress={scrollYProgress}>
              {screens[i]}
            </DrillLayer>
          ))}
        </div>

        <div className="sn-drill-copy">
          {LEVELS.map((lv, i) => (
            <DrillNote key={lv.id} level={lv} index={i} count={LEVELS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   BENTO — four more real screens, deliberately unequal
   --------------------------------------------------------------- */
const Bento = () => (
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

      <div className="sn-bento-grid">
        <Reveal className="sn-b sn-b-wide"><div className="sn-frame sm"><ProcurementScreen /></div></Reveal>
        <Reveal className="sn-b" delay={0.08}><div className="sn-frame sm"><SupplierScreen /></div></Reveal>
        <Reveal className="sn-b" delay={0.14}><div className="sn-frame sm"><FleetScreen /></div></Reveal>
        <Reveal className="sn-b sn-b-wide" delay={0.2}><div className="sn-frame sm"><ForecastScreen /></div></Reveal>
      </div>
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
        <Drill live={live} />
      </div>

      <Bento />
      <Readout />
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
