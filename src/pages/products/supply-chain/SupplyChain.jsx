import React, { Suspense, lazy } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from '../shared/motion';
import { ProductPage, Footer } from '../shared/system';
import ProductNav from '../shared/nav';
import { TrustBand, Faq, ContactSection } from '../shared/blocks';
import {
  SupplyOverview, SupplyChallenge, EndToEnd, Procurement, WarehouseStage,
  Logistics, SupplyGovernance, SUPPLY_TRUST, SUPPLY_FAQ, SUPPLY_CONTACT, SUPPLY_NAV,
} from './SupplySections';
import { NetworkScreen } from './SupplyApp';
import { IntegrationWeb } from './SupplyOps';
import './SupplyApp.css';
import './SupplyOpsAdd.css';
import './SupplyChain.css';

/* Every heavy section is code-split — the descent alone carries three
   full product screens, and none of this belongs in the bundle that
   renders the fold. */
const Descent = lazy(() => import('./SupplyDescent'));
const ControlWorkbench = lazy(() => import('./SupplyControl'));
const CustomerSuccess = lazy(() => import('./SupplySuccess'));

/* a plain reserved block, so a section loading in never shifts the page
   under someone mid-scroll */
const Hold = ({ tone = 'dark', h = '46rem' }) => (
  <div className={`sn-hold ${tone}`} style={{ height: h }} aria-hidden="true" />
);

/* =====================================================================
   EMVIVE SUPPLY CHAIN
   Signature mechanic: the descent. One viewport, three depths, and you
   fly into the next one by picking it. Nothing on this page is a diagram
   and nothing on it is a card.
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
    n: 0, temp: 3.1, pickers: 38, rate: 412, transit: 342, otif: 96.4, sync: 1284,
    /* newest first. Every stepper below reads index 0 as the newest item
       and derives the next id from it, so seeding these ascending made
       the new id collide with one still in the list — two React children
       with the same key, and an AnimatePresence row that could vanish
       mid-transition. */
    alerts: [2, 1, 0].map(mkAlert), feed: [3, 2, 1, 0].map(mkFeed),
    events: [2, 1, 0].map(mkEvent),
    pos: [0, 1, 2, 3, 4].map(mkPo),
    poStage: 1,
    demand: [42, 48, 45, 56, 52, 64, 61, 72, 78, 74, 86, 92],
    notes: [1, 0].map(mkNote),
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
      sync: Math.round(1284 + w * 84),
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
   A dark instrumentation section. Used for every immersive band so
   they read as one wallboard family rather than assorted panels.
   --------------------------------------------------------------- */
const Band = ({ id, kicker, title, lede, height, wide, tone, children, foot }) => (
  <section className={`sn-band ${wide ? 'wide' : ''} ${tone || ''}`} id={id}>
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

/* =====================================================================
   PAGE — the locked information architecture

     01 Hero                              Opening
     02 Trusted by / enterprise trust     TrustBand
     03 Supply chain overview             SupplyOverview
     04 The supply chain challenge        SupplyChallenge
     05 End-to-end supply chain           EndToEnd        (the spine)
     06 Global supply network             Descent         (depth experience)
     07 Procurement & supplier mgmt       Procurement
     08 Warehouse & inventory             WarehouseStage
     09 Shipment & logistics              Logistics
     10 Operations / control centre       ControlWorkbench
     11 Connected enterprise              IntegrationWeb
     12 Security, controls & governance   SupplyGovernance
     13 Customer success                  CustomerSuccess
     14 FAQ                               Faq
     15 Contact / demo form               ContactSection
     16 Footer

   Sections 05–09 all draw the same Supplier → … → Customer chain, so
   the page reads as one physical flow rather than a set of modules.
   The old `Bento` block (OperationsWorkspace, in SupplyWorkspace.jsx)
   is parked: the three stage deep-dives now carry that job. The
   component is untouched if it is wanted back.
   ===================================================================== */
const SupplyChain = () => {
  const [live, ref] = useOpsLive();

  return (
    <ProductPage accent="#3557d8" accent2="#2a46bb" wash="rgba(53,87,216,0.09)" className="sn">
      <ProductNav {...SUPPLY_NAV} />

      <div ref={ref}>
        <Opening live={live} />

        <TrustBand {...SUPPLY_TRUST} />
        <SupplyOverview />
        <SupplyChallenge />
        <EndToEnd />

        <Suspense fallback={<Hold h="56rem" />}>
          <Descent live={live} />
        </Suspense>
      </div>

      <Procurement />
      <WarehouseStage />
      <Logistics />

      <Suspense fallback={<Hold h="42rem" />}>
        <ControlWorkbench />
      </Suspense>

      <Band
        id="integrations"
        kicker="Connected enterprise"
        title="Wired to everything you already run."
        lede="ERP, CRM, accounting, transport, IoT sensors and your suppliers — reading and writing one supply chain record."
        height="min(60vh, 520px)"
        tone="alt"
      >
        <IntegrationWeb live={live} />
      </Band>

      <SupplyGovernance />

      <Suspense fallback={<Hold tone="paper" h="60rem" />}>
        <CustomerSuccess />
      </Suspense>

      <Faq
        eyebrow="Questions operations teams ask"
        title="Before you put a warehouse on it."
        lede="The six things every operations director raises once the demo is over."
        items={SUPPLY_FAQ}
        aside={(
          <>Running a live site? Say so in the form below and we will bring someone
          who has commissioned a DC, not just configured one.</>
        )}
      />

      <ContactSection {...SUPPLY_CONTACT} />

      <Footer />
    </ProductPage>
  );
};

export default SupplyChain;
