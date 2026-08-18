import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Factory, ShoppingCart, Cog, Warehouse, Truck, Network, Users, Boxes,
  Check, ArrowRight, AlertTriangle, EyeOff, Layers, Timer,
  ShieldCheck, KeyRound, History, Globe, Server, ClipboardCheck,
  FileWarning, MapPin, Building2, Activity, Database, HelpCircle,
} from 'lucide-react';
import { motion, Reveal, MaskText, useInView, useReducedMotion, scrollToY, EASE } from '../shared/motion';
import {
  SectionHead, FeatureGrid, CardGrid, NumberedList, AccordionShowcase, SplitFeature,
  FolderGrid, OfferingsCard, ImpactPanel,
} from '../shared/sections';
import './SupplySections.css';

/* =====================================================================
   SUPPLY CHAIN — the narrative sections. Namespace `sx-`.

   The spine of this page is a single idea and it is deliberately not a
   grid of cards:

     Supplier → Procurement → Manufacturing → Warehouse →
     Transportation → Distribution → Customer

   The chain is drawn once, full width and scroll-stepped, in the
   end-to-end section. The stage deep-dives below it carry their own
   heading and do not repeat the strip.
   ===================================================================== */

export const CHAIN = [
  { id: 'supplier', label: 'Supplier', icon: Factory, meta: '412 active' },
  { id: 'procurement', label: 'Procurement', icon: ShoppingCart, meta: '128 open POs' },
  { id: 'manufacturing', label: 'Manufacturing', icon: Cog, meta: '9 work orders' },
  { id: 'warehouse', label: 'Warehouse', icon: Warehouse, meta: '46 aisles' },
  { id: 'transport', label: 'Transportation', icon: Truck, meta: '342 in transit' },
  { id: 'distribution', label: 'Distribution', icon: Network, meta: '18 hubs' },
  { id: 'customer', label: 'Customer', icon: Users, meta: '212 outlets' },
];

/* a tiny local cycler — the supply page has no need for the fuller
   stepper the platform page ships, and importing across products would
   couple two pages that should stay independent */
const useCycle = (ref, count, ms = 2600, enabled = true) => {
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -20% 0px' });
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!enabled || reduced || !inView || held) return undefined;
    const t = setTimeout(() => setI((v) => (v + 1) % count), ms);
    return () => clearTimeout(t);
  }, [i, count, ms, reduced, inView, held, enabled]);

  return {
    i: reduced ? 0 : i,
    set: (n) => { setI(n); setHeld(true); setTimeout(() => setHeld(false), 6000); },
    bind: { onMouseEnter: () => setHeld(true), onMouseLeave: () => setHeld(false) },
  };
};

/* The end-to-end section pins itself and hands the seven stages to the
   scroll wheel: one turn of the page, one stage. It only does this where
   the pinned frame actually fits — on a short or narrow viewport, and
   under reduced motion, the timed cycler above drives it instead. */
const useStepMode = () => {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (reduced) { setOk(false); return undefined; }
    const mq = window.matchMedia('(min-width: 861px) and (min-height: 760px)');
    const read = () => setOk(mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, [reduced]);

  return ok;
};

const useScrollStep = (ref, count, enabled) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;

    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(0.9999, Math.max(0, -r.top / span));
      const next = Math.floor(p * count);
      setI((v) => (v === next ? v : next));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, count, enabled]);

  return enabled ? i : 0;
};

/* ---------------------------------------------------------------
   THE CHAIN — drawn once, in the end-to-end section
   --------------------------------------------------------------- */
const ChainStrip = ({ active, onPick }) => (
  <div className="sx-chain">
    {CHAIN.map((s, i) => (
      <React.Fragment key={s.id}>
        {i > 0 && (
          <span className={`sx-chain-link ${active >= i ? 'on' : ''}`} aria-hidden="true">
            <i />
          </span>
        )}
        <button
          type="button"
          className={`sx-chain-node ${active === i ? 'on' : ''} ${active > i ? 'past' : ''}`}
          onClick={onPick ? () => onPick(i) : undefined}
          tabIndex={onPick ? 0 : -1}
          aria-current={active === i ? 'step' : undefined}
        >
          <span className="sx-chain-ic"><s.icon size={17} strokeWidth={1.8} /></span>
          <b>{s.label}</b>
          <em>{s.meta}</em>
        </button>
      </React.Fragment>
    ))}
  </div>
);

/* ---------------------------------------------------------------
   03 · SUPPLY CHAIN OVERVIEW
   --------------------------------------------------------------- */
const MANAGES = [
  ['Suppliers & contracts', 'Onboarding, scorecards, price lists, compliance documents'],
  ['Purchase requisitions to receipt', 'Requisition, RFQ, PO, acknowledgement, ASN, GRN'],
  ['Manufacturing & work orders', 'BOM, routing, shop-floor issue and back-flush'],
  ['Warehouse & bin-level stock', 'Putaway, picking, packing, cycle counts, FEFO batches'],
  ['Transport & fleet', 'Loads, trips, drivers, temperature, proof of delivery'],
  ['Distribution & outlets', 'Replenishment, transfers, allocation, returns'],
  ['Planning & forecasting', 'Demand, inventory targets, reorder points, risk'],
];

export const SupplyOverview = () => (
  <section className="sx-over" id="overview">
    <div className="sx-inner">
      <div className="sx-over-grid">
        <div>
          <SectionHead
            label="Supply chain overview"
            title="One system from the purchase order"
            accent="to the carton in someone's hand."
            lede="Emvive Supply Chain runs the physical side of the business on a single stock and document ledger. Procurement, manufacturing, the warehouse, the fleet and the outlets all read and write the same records — so a quantity never has to be reconciled between two systems that both claim to be right."
          />
          <Reveal delay={0.24} y={14}>
            <a href="#endtoend" className="sx-link">Follow one order through it <ArrowRight size={15} /></a>
          </Reveal>
        </div>

        <NumberedList label="What it manages" items={MANAGES} />
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------
   04 · THE SUPPLY CHAIN CHALLENGE
   --------------------------------------------------------------- */
const CHALLENGES = [
  {
    icon: Layers, k: 'Fragmented operations',
    p: 'Procurement is in one system, the warehouse in another, transport on a spreadsheet and the outlets on WhatsApp.',
    cost: 'Four versions of the same quantity',
  },
  {
    icon: EyeOff, k: 'No inventory visibility',
    p: 'Head office knows what was in stock last night. Nobody can answer what is on the shelf, in the van and on the water right now.',
    cost: 'Stock-outs beside dead stock',
  },
  {
    icon: FileWarning, k: 'Procurement complexity',
    p: 'Quotes arrive by email, approvals happen in a chat, and nobody notices a supplier never acknowledged the order.',
    cost: 'Late deliveries found out late',
  },
  {
    icon: Warehouse, k: 'Warehouse inefficiency',
    p: 'Pickers walk the building twice because the pick list is printed in the order it was typed, not the order the aisles run.',
    cost: 'Hours lost per shift',
  },
  {
    icon: Timer, k: 'Shipment delays',
    p: 'An ETA slips at sea and the first person to hear about it is the customer whose line has stopped.',
    cost: 'OTIF you cannot explain',
  },
];

/* Converted to the shared section furniture — same head and the same
   feature cards Finance uses, so this section is now the Finance
   pattern with supply-chain content in it. The cost line rides along
   as `note`, which is what the pill under each card is for. */
export const SupplyChallenge = () => (
  <section className="sx-chall" id="challenge">
    <div className="sx-inner">
      <SectionHead
        label="The supply chain challenge"
        title="Five gaps that"
        accent="cost real money."
        lede="None of these are software problems on their own. They are the same problem — the physical flow and the record of it have come apart."
      />

      <FeatureGrid
        cols={3}
        items={CHALLENGES.map((c) => ({
          icon: c.icon, t: c.k, d: c.p, note: c.cost,
        }))}
      />
    </div>
  </section>
);

/* ---------------------------------------------------------------
   05 · END-TO-END SUPPLY CHAIN — the signature section
   --------------------------------------------------------------- */
const STORY = [
  { t: 'Al Faisal Trading acknowledges PO-8841', d: 'Price, quantity and promised date confirmed against the contract. The clock starts here.', doc: 'PO-8841', meta: '184,200 SAR · 12 lines' },
  { t: 'Requisition became a purchase order', d: 'Budget checked at commitment, approval routed by value, order sent and acknowledged — no email in the loop.', doc: 'REQ-4412 → PO-8841', meta: 'Approved in 3h 20m' },
  { t: 'Work order 4414 consumes the components', d: 'The bill of materials issues stock from the right bins and back-flushes the finished goods when the run closes.', doc: 'WO-4414', meta: '12,400 units produced' },
  { t: 'Putaway, then picked against wave 42', d: 'FEFO batch selection, bin-level allocation, and a pick path that walks the aisles once.', doc: 'Wave 42', meta: '186 lines · 4 zones' },
  { t: 'TRK-208 departs dock D5', d: 'Load built by weight and drop sequence, temperature logged end to end, proof of delivery captured on the driver’s phone.', doc: 'TRK-208', meta: '38 pallets · 6 drops' },
  { t: 'Cross-docked at the Riyadh hub', d: 'Allocation across eighteen hubs happens against live demand rather than a monthly plan.', doc: 'DC-RUH', meta: '18 hubs · 212 outlets' },
  { t: 'On the shelf, in stock, on time', d: 'The outlet sees the same record the supplier did. Fill rate is measured on the line, not on the invoice.', doc: 'OTIF 96.4%', meta: 'Fill rate 99.1%' },
];

export const EndToEnd = () => {
  const ref = useRef(null);
  const stepped = useStepMode();
  const scrollI = useScrollStep(ref, CHAIN.length, stepped);
  const cycle = useCycle(ref, CHAIN.length, 3000, !stepped);
  const i = stepped ? scrollI : cycle.i;

  /* clicking a node in stepped mode means scrolling to that node's slice
     of the track — the scroll position is the source of truth, so setting
     an index directly would be undone on the next wheel event */
  const pick = (n) => {
    if (!stepped) { cycle.set(n); return; }
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToY(top + span * ((n + 0.5) / CHAIN.length));
  };

  return (
    <section
      className={`sx-e2e ${stepped ? 'stepped' : ''}`}
      id="endtoend"
      ref={ref}
      {...(stepped ? {} : cycle.bind)}
    >
      <div className="sx-e2e-pin">
        <div className="sx-e2e-bg" aria-hidden="true" />

        <div className="sx-inner">
          <SectionHead
            className="sx-e2e-head"
            label="End-to-end supply chain"
            title="One order, seven stages,"
            accent="a single record."
            lede="This is the same purchase order the whole way through. Nothing is re-keyed, nothing is exported, and every stage can see what the one before it did."
          />

          <ChainStrip active={i} onPick={pick} />

          <div className="sx-e2e-story">
            <AnimatePresence mode="wait">
              <motion.div
                className="sx-e2e-card"
                key={CHAIN[i].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <span className="sx-e2e-stage">
                  Stage {String(i + 1).padStart(2, '0')} · {CHAIN[i].label}
                </span>
                <h3>{STORY[i].t}</h3>
                <p>{STORY[i].d}</p>
                <div className="sx-e2e-doc">
                  <span className="sx-e2e-docid">{STORY[i].doc}</span>
                  <span className="sx-e2e-docmeta">{STORY[i].meta}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   07 / 08 / 09 · STAGE DEEP-DIVES
   Same frame, one film each. The clips are muted and looping, and only
   the one on screen is playing — four videos decoding at once is what
   makes a page like this feel heavy. Swap the `video` path per stage.
   --------------------------------------------------------------- */
export const StageVideo = ({ src, poster, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduced) {
      /* autoplay can still be refused (low power mode); a muted loop is
         decoration, so a rejection is not worth surfacing */
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, reduced]);

  return (
    <div className="sx-video">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
};

const STAGES = [
  {
    id: 'procurement', kicker: 'Procurement & supplier management',
    title: 'Every order acknowledged,', accent: 'every supplier scored.',
    body: 'Requisition to receipt on one document trail. Budget is checked when the commitment is made rather than when the invoice arrives, approvals route by value and category, and a supplier who has not acknowledged an order is chased by the system, not remembered by a buyer.',
    points: [
      'Requisition → RFQ → PO → acknowledgement → ASN → GRN',
      'Commitment accounting against live budgets',
      'Supplier scorecards fed by delivery and quality data',
      'Contract prices and expiry enforced at order entry',
    ],
    video: '/images/1.mp4',
  },
  {
    id: 'warehouse', kicker: 'Warehouse & inventory intelligence',
    title: 'Down to the bin,', accent: 'down to the batch.',
    body: 'Putaway, picking, packing and counting run on a scanner that works when the signal does not. Stock is held at bin and batch level with FEFO selection, so what the system says is on the shelf is what the picker finds on the shelf.',
    points: [
      'Bin, batch and serial level stock with FEFO picking',
      'Wave planning with a pick path that walks the aisles once',
      'Offline-first mobile capture, synced when back in range',
      'Cycle counting with variance approval and ageing analysis',
    ],
    video: '/images/2.mp4',
  },
  {
    id: 'logistics', kicker: 'Shipment & logistics management',
    title: 'You hear about the delay', accent: 'before the customer does.',
    body: 'Loads are built by weight and drop sequence, trips are tracked against plan, and cold chain is logged the whole way. When an ETA moves, the outlets affected and the orders at risk are already listed.',
    points: [
      'Load building by weight, volume and drop sequence',
      'Live ETA against plan with exception alerting',
      'Temperature and humidity logging for cold chain',
      'Proof of delivery captured with signature and photo',
    ],
    video: '/images/3.mp4',
  },
];

/* exported so the control room can be the same kind of section rather
   than a second, differently-styled account of the same product */
export const StageSection = ({ stage, flip }) => (
  <section className={`sx-stage ${flip ? 'flip' : ''}`} id={stage.id}>
    <div className="sx-inner">
      <div className="sx-stage-grid">
        <div className="sx-stage-copy">
          <SectionHead
            label={stage.kicker}
            title={stage.title}
            accent={stage.accent}
            lede={stage.body}
          />

          <Reveal delay={0.22} y={14}>
            <ul className="sx-points">
              {stage.points.map((p) => (
                <li key={p}><Check size={12} strokeWidth={3} />{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="sx-stage-visual" delay={0.1} y={24}>
          <StageVideo src={stage.video} poster={stage.poster} label={stage.kicker} />
        </Reveal>
      </div>
    </div>
  </section>
);

export const Procurement = () => <StageSection stage={STAGES[0]} />;
export const WarehouseStage = () => <StageSection stage={STAGES[1]} flip />;
export const Logistics = () => <StageSection stage={STAGES[2]} />;

/* ---------------------------------------------------------------
   13 · SECURITY, CONTROLS & ENTERPRISE GOVERNANCE
   --------------------------------------------------------------- */
const GOV = [
  { icon: KeyRound, t: 'Segregation of duties', d: 'A buyer cannot receive their own order and a storekeeper cannot approve their own variance. Enforced per site, not per policy document.' },
  { icon: ClipboardCheck, t: 'Approval matrices', d: 'Limits by value, category, site and grade, with delegation and out-of-office routing that does not quietly skip a step.' },
  { icon: History, t: 'Immutable movement trail', d: 'Every stock movement carries user, device, timestamp, location and the document that authorised it. Adjustments are reasons, not silent edits.' },
  { icon: ShieldCheck, t: 'Compliance documents', d: 'Supplier CR, VAT, ISO and insurance certificates tracked with expiry alerting before an order can be placed.' },
  { icon: Globe, t: 'Data residency', d: 'Saudi Arabia, the UAE or India, pinned per workspace including backups. Private cloud where shared infrastructure is ruled out.' },
  { icon: Server, t: 'Availability', d: '99.98% platform availability over the last twelve months, with offline capture so a warehouse keeps working through a network outage.' },
];

export const SupplyGovernance = () => (
  <section className="sx-gov" id="governance">
    <div className="sx-inner">
      <SectionHead
        label="Security, controls & governance"
        title="Control that survives"
        accent="contact with a warehouse."
        lede="Physical operations are where controls usually break — a shift needs to move stock now and the system is the obstacle. These are designed to hold without stopping the work."
      />

      {/* the same CardGrid Finance heads its security section with, on the
          same 6-column track — three cards of two, then two of three */}
      <CardGrid
        items={GOV.map((g, i) => ({ ...g, span: i < 3 ? 2 : 3 }))}
      />

      <Reveal className="sx-certs" delay={0.1}>
        {['ISO/IEC 27001', 'SOC 2 Type II', 'GDPR', 'PDPL', 'GS1 barcode standards'].map((c) => (
          <span key={c}><Check size={11} strokeWidth={3} />{c}</span>
        ))}
      </Reveal>
    </div>
  </section>
);

/* =====================================================================
   THE FINANCE SECTIONS, WITH SUPPLY CHAIN CONTENT

   These two replace the page's own signature blocks — the scroll-pinned
   chain, the depth descent, the three stage deep-dives, the dark
   instrumentation bands and the success story. Every one of them is now
   the same component Finance runs, fed this page's content.

   The old components are still in the repo; the page simply stops
   importing them. Reversing this is a matter of putting them back in
   the render, not rebuilding anything.
   ===================================================================== */

/* Finance cycles five screenshots across eight modules; there are five
   stage images in the repo and seven stages here, so the last two reuse
   the first two rather than shipping a blank panel. */
/* what each module covers, in the order the chain runs — the folder
   grid lists these beside the stage's icon */
const MODULE_POINTS = [
  ['Supplier onboarding and scorecards', 'Price lists and contract terms', 'Compliance documents with expiry alerting', 'RFQ and quotation comparison', 'Performance by delivery and quality'],
  ['Requisition, RFQ, PO and acknowledgement', 'Commitment accounting against live budgets', 'Approval routing by value and category', 'ASN and goods receipt matching', 'Variance holds instead of nodded-through receipts'],
  ['Bill of materials and routing', 'Shop-floor issue and back-flush', 'Work order scheduling against capacity', 'Batch and serial traceability', 'Yield and scrap reporting'],
  ['Bin, batch and serial level stock', 'Putaway, picking, packing and counting', 'FEFO selection with wave planning', 'Offline-first scanning, synced in range', 'Cycle counts with variance approval'],
  ['Load building by weight and drop', 'Live ETA against plan', 'Temperature and humidity logging', 'Proof of delivery with signature and photo', 'Driver, trip and fleet records'],
  ['Replenishment and allocation', 'Inter-site transfers and returns', 'Cross-docking at the hub', 'Outlet-level stock visibility', 'Demand-led distribution, not monthly plans'],
  ['Demand forecasting by outlet', 'Inventory targets and reorder points', 'Risk and stock-out prediction', 'Scenario planning on assumptions', 'Fill rate and OTIF measurement'],
];

const STAGE_IMG = [
  '/images/capture_step.jpg',
  '/images/post_step.jpg',
  '/images/control_step.jpg',
  '/images/automate_step.jpg',
  '/images/close_step.jpg',
  '/images/capture_step.jpg',
  '/images/post_step.jpg',
];

export const SupplyStages = () => (
  <section className="sx-over" id="stages">
    <div className="sx-inner">
      <SectionHead
        label="What it covers"
        title="Seven stages,"
        accent="one record."
        lede="Supplier to outlet on a single stock and document ledger. Each stage below is the one screen where that part of the chain actually happens — nothing is re-keyed between them."
      />

      <AccordionShowcase
        items={CHAIN.map((c, i) => ({
          k: c.label,
          icon: c.icon,
          body: STORY[i] ? STORY[i].d : c.meta,
          img: STAGE_IMG[i],
        }))}
      />
    </div>
  </section>
);

export const SupplyJourney = () => (
  <section className="sx-stage" id="journey">
    <div className="sx-inner">
      <SectionHead
        label="How it works"
        title="From the purchase order"
        accent="to the carton on the shelf."
        lede="The same order travels the whole way. Procurement, the warehouse and the fleet read and write the same records, so a quantity never has to be reconciled between two systems that both claim to be right."
      />

      <SplitFeature
        image="/images/automate_step.jpg"
        alt="Supply chain operations"
        title="One order, seven stages"
        body="Follow a single purchase order from acknowledgement to the shelf, without it being exported once."
        cols={3}
        items={STAGES.map((s) => ({
          k: s.kicker.split(' ')[0],
          t: `${s.title} ${s.accent}`,
          d: s.body,
        }))}
      />
    </div>
  </section>
);

/* 02b — the folder grid, Finance's second capabilities section */
export const SupplyModules = () => (
  <section className="sx-over" id="modules">
    <div className="sx-inner">
      <SectionHead
        label="Product & capabilities"
        title="Seven modules."
        accent="One stock ledger underneath."
        lede="Nothing here is a separate product with its own database. Every module writes to the same stock and document records, so what one of them knows, all of them know."
      />

      <FolderGrid
        items={CHAIN.map((c, i) => ({
          k: c.label,
          icon: c.icon,
          points: MODULE_POINTS[i],
        }))}
      />
    </div>
  </section>
);

/* 04 — the offerings card, Finance's automation section */
export const SupplyAutomation = () => (
  <section className="sx-chall" id="automation">
    <div className="sx-inner">
      <SectionHead
        label="Automation"
        title="The routine work stops"
        accent="reaching a person."
        lede="Rules run against live stock on a schedule or on an event. What lands in somebody's queue is the exception — never the whole population."
      />

      <OfferingsCard
        title="Our Offerings"
        note="We help operations teams pursue a path of smart transformation"
        image="/images/automation_abstract.png"
        tabs={[
          {
            label: 'Stock & replenishment',
            items: ['Reorder point breach', 'FEFO batch selection', 'Cycle count scheduling', 'Transfer suggestions'],
          },
          {
            label: 'Procurement & transport',
            items: ['PO acknowledgement chasing', 'Three-way receipt match', 'Load building by drop', 'ETA slip alerting'],
          },
        ]}
      />
    </div>
  </section>
);

/* 07 — the impact panel, Finance's "what changes in the first year" */
export const SupplyImpact = () => (
  <section className="sx-gov" id="impact">
    <div className="sx-inner">
      <SectionHead
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — eighteen hubs, two hundred and twelve outlets — twelve months after go-live. Measured on the line, not on the invoice."
      />

      <ImpactPanel
        bars={{
          k: 'ORDER TO SHELF',
          sub: 'Working days from PO to outlet',
          scale: 20,
          unit: ' days',
          rows: [
            { k: 'Before Emvive', note: 'Eleven days, most of it waiting on a status', v: 11, tone: 'was' },
            { k: 'With Emvive', note: 'Acknowledged, picked, loaded and delivered', v: 4, tone: 'now' },
          ],
          claim: { v: '−7 days', label: 'off the cycle, on every order' },
        }}
        figures={[
          { icon: Timer, value: '4', suffix: ' days', label: 'Order to shelf' },
          { icon: Boxes, value: '99.1', suffix: '%', label: 'Fill rate' },
          { icon: Building2, value: '18', suffix: '', label: 'Hubs consolidated' },
          { icon: ShieldCheck, value: '96.4', suffix: '%', label: 'OTIF' },
        ]}
        photo="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=900"
        alt="Warehouse operations"
        quotes={[
          'Stock is held at bin and batch level, so what the system says is on the shelf is what the picker finds on the shelf.',
          'Loads are built by weight and drop sequence, and an ETA that slips lists the outlets affected before the customer calls.',
          'A buyer cannot receive their own order. Approval limits and duty segregation are enforced by the ledger, not by memo.',
        ]}
      />
    </div>
  </section>
);

/* ---------------------------------------------------------------
   Content for the shared blocks
   --------------------------------------------------------------- */
export const SUPPLY_TRUST = {
  label: 'Operations teams running on Emvive',
  logos: ['GULF CEMENT', 'LANDMARK RETAIL', 'NEXA COMPONENTS', 'RIYADH LOGISTICS', 'HARBOUR FOODS', 'ORBIT TEXTILES'],
  proofs: [
    { icon: Boxes, value: '2.4M', label: 'stock movements posted every month' },
    { icon: Building2, value: '212 outlets', label: 'replenished from eighteen hubs' },
    { icon: Truck, value: '342', label: 'shipments tracked at any moment' },
    { icon: Activity, value: '99.1%', label: 'fill rate across the largest network' },
  ],
  note: 'Warehouse and driver apps keep working offline — capture continues through a network outage and syncs when the signal returns.',
};

export const SUPPLY_FAQ = [
  {
    q: 'Do we have to replace our existing WMS or ERP?',
    a: 'No. Most networks start with one layer — usually procurement or the warehouse — and connect the rest. Emvive reads and writes to your existing ERP through connectors while it takes over site by site.',
  },
  {
    q: 'Does the warehouse app work without a network?',
    a: 'Yes. Picking, putaway and counting are offline-first. The device holds the work, applies the same validation rules locally, and syncs when it is back in range. Nothing is lost and nothing is double-counted.',
    points: ['Offline picking, putaway and cycle counts', 'Local validation with conflict resolution on sync', 'Works on standard Android scanners and phones'],
  },
  {
    q: 'How does it handle batches, expiry and serial numbers?',
    a: 'Stock is held at bin, batch and serial level. FEFO selection is applied at allocation, expiry is checked before dispatch, and full genealogy is retained so a recall can be traced in both directions.',
  },
  {
    q: 'Can it manage multi-warehouse and multi-company transfers?',
    a: 'Yes, including in-transit ownership, inter-company pricing and automatic elimination when the group consolidates in Emvive Finance. Transfers are one document, not a receipt guessed against a dispatch.',
  },
  {
    q: 'What integrations are typical?',
    a: 'Supplier EDI and portals, carrier and telematics feeds, temperature sensors, e-commerce channels, and the finance ledger. Everything is available over REST and webhooks, and events publish outward as they happen.',
  },
  {
    q: 'How long before we see a difference?',
    a: 'A single distribution centre is usually live in eight to ten weeks. The measurable changes customers report first are dead stock and count speed, typically inside the first quarter.',
  },
];

export const SUPPLY_CONTACT = {
  eyebrow: 'Talk to the supply chain team',
  title: "Let's connect",
  accent: 'your supply chain.',
  lede:
    'Share a month of stock movements and we will show you where working capital is trapped, which lanes are hurting OTIF, and what the system would have ordered instead.',
  cta: 'Talk to Supply Chain Team',
  panel: {
    title: 'What to expect',
    note: 'A month of your real stock movements read back to you, not a requirements workshop.',
  },
  aside: [
    { icon: Boxes, t: 'We look at your movements', d: 'One month of real stock data tells us more than a two-hour requirements workshop.' },
    { icon: MapPin, t: 'Site walk, not a webinar', d: 'For warehouse work we would rather stand in the aisle than screen-share at it.' },
    { icon: ShieldCheck, t: 'Under NDA from the first call', d: 'Sample data is destroyed after the session unless you ask us to keep it.' },
  ],
  /* Four fields, matching Finance and Platform. Industry, supply-chain
     area and company size were three sorting questions asked before
     anyone had spoken — the message box already asks for the sites, the
     SKUs and the system, which is what those three were circling. */
  fields: [
    { name: 'name', label: 'Name', required: true, placeholder: 'Omar Siddiqui', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    { name: 'company', label: 'Company', required: true, span: 2, placeholder: 'Gulf Cement', autoComplete: 'organization' },
    {
      name: 'message', label: 'Message', type: 'textarea', span: 2,
      placeholder: 'How many sites and SKUs, what you run today, and where it hurts most.',
    },
  ],
};

/* ---------------------------------------------------------------
   Product navigation
   --------------------------------------------------------------- */
/* The flyouts are the page's table of contents: every section on the
   page appears in one of them, in page order — overview group first,
   then the stage-by-stage group, then the enterprise group. The hero is
   the mark and the contact block is the CTA, so neither needs a row.
   The same rule holds on Finance and Platform. */
export const SUPPLY_NAV = {
  mark: { label: 'Supply Chain', suffix: '& Logistics' },
  menus: [
    {
      id: 'intro', label: 'Overview', icon: Layers, href: '#overview',
      blurb: 'What the product covers, the problem it is aimed at, and one order followed the whole way through.',
      items: [
        { href: '#trust', icon: Building2, t: 'Trusted by', d: 'The networks already running on it.' },
        { href: '#overview', icon: Boxes, t: 'Supply chain overview', d: 'One system from the purchase order to the shelf.' },
        { href: '#challenge', icon: AlertTriangle, t: 'The challenge', d: 'Where the physical flow and the record come apart.' },
        { href: '#endtoend', icon: Network, t: 'One order, seven stages', d: 'Supplier to customer on a single record.' },
        { href: '#drill', icon: Globe, t: 'Global supply network', d: 'Fly from the network down to a single bin.' },
      ],
      feature: { t: 'One order, seven stages', d: 'Follow a single purchase order from supplier to shelf.', href: '#endtoend' },
    },
    {
      id: 'operations', label: 'Operations', icon: Cog, href: '#procurement',
      blurb: 'Procurement, the warehouse and the fleet on one stock ledger.',
      items: [
        { href: '#procurement', icon: ShoppingCart, t: 'Procurement', d: 'Requisition to receipt, with supplier scorecards.' },
        { href: '#warehouse', icon: Warehouse, t: 'Warehouse & inventory', d: 'Bin, batch and offline cycle counting.' },
        { href: '#logistics', icon: Truck, t: 'Shipment & logistics', d: 'Loads, live ETA, cold chain, proof of delivery.' },
        { href: '#control', icon: Activity, t: 'Control centre', d: 'One desk for the whole network.' },
      ],
      feature: { t: 'Down to the bin, down to the batch', d: 'FEFO batches, bin-level stock and scanning that works offline.', href: '#warehouse' },
    },
    {
      id: 'enterprise', label: 'Enterprise', icon: ShieldCheck, tone: 'cy', href: '#integrations',
      blurb: 'What it connects to, how it is controlled, and what changed for a customer.',
      items: [
        { href: '#integrations', icon: Database, t: 'Connected enterprise', d: 'ERP, CRM, carriers, sensors, suppliers.' },
        { href: '#governance', icon: KeyRound, t: 'Security & governance', d: 'Duty segregation, movement trail, residency.' },
        { href: '#change', icon: Users, t: 'Customer success', d: 'Nesto Group, 212 outlets on one ledger.' },
        { href: '#faq', icon: HelpCircle, t: 'FAQ', d: 'The six questions operations directors ask.' },
      ],
      feature: { t: 'Control that survives contact', d: 'Duty segregation, an immutable movement trail and pinned residency.', href: '#governance' },
    },
  ],
  links: [],
  watch: { href: '#drill', label: 'See it drill down' },
  cta: { href: '#start', label: 'Talk to Supply Chain' },
  spy: [
    'top', 'trust', 'overview', 'challenge', 'endtoend', 'drill', 'procurement',
    'warehouse', 'logistics', 'control', 'integrations', 'governance', 'change',
    'faq', 'start',
  ],
  owner: {
    trust: 'intro', overview: 'intro', challenge: 'intro', endtoend: 'intro', drill: 'intro',
    procurement: 'operations', warehouse: 'operations', logistics: 'operations', control: 'operations',
    integrations: 'enterprise', governance: 'enterprise', change: 'enterprise', faq: 'enterprise',
  },
};
