import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Factory, ShoppingCart, Cog, Warehouse, Truck, Network, Users, Boxes,
  Check, ArrowRight, AlertTriangle, EyeOff, Layers, Timer,
  ShieldCheck, KeyRound, History, Globe, Server, ClipboardCheck,
  FileWarning, MapPin, Building2, Activity, Database, HelpCircle,
} from 'lucide-react';
import { motion, Reveal, MaskText, useInView, useReducedMotion, scrollToY, EASE } from '../shared/motion';
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
          <Reveal><span className="sn-kick"><i /> Supply chain overview</span></Reveal>
          <MaskText
            text="One system from the purchase order"
            accent="to the carton in someone's hand."
            as="h2"
            className="sn-h2"
          />
          <Reveal delay={0.16} y={16}>
            <p className="sx-lede">
              Emvive Supply Chain runs the physical side of the business on a single
              stock and document ledger. Procurement, manufacturing, the warehouse,
              the fleet and the outlets all read and write the same records — so a
              quantity never has to be reconciled between two systems that both
              claim to be right.
            </p>
          </Reveal>
          <Reveal delay={0.24} y={14}>
            <a href="#endtoend" className="sx-link">Follow one order through it <ArrowRight size={15} /></a>
          </Reveal>
        </div>

        <Reveal className="sx-manages" delay={0.1} y={22}>
          <span className="sx-manages-k">What it manages</span>
          {MANAGES.map(([t, d], i) => (
            <motion.div
              className="sx-manages-row"
              key={t}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            >
              <span className="sx-manages-n">{String(i + 1).padStart(2, '0')}</span>
              <div><b>{t}</b><em>{d}</em></div>
            </motion.div>
          ))}
        </Reveal>
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

export const SupplyChallenge = () => (
  <section className="sx-chall" id="challenge">
    <div className="sx-inner">
      <div className="sx-chall-head">
        <Reveal><span className="sn-kick"><i /> The supply chain challenge</span></Reveal>
        <MaskText text="Five gaps that cost real money." as="h2" className="sn-h2" />
        <Reveal delay={0.16} y={14}>
          <p className="sx-lede">
            None of these are software problems on their own. They are the same
            problem — the physical flow and the record of it have come apart.
          </p>
        </Reveal>
      </div>

      <div className="sx-chall-rows">
        {CHALLENGES.map((c, i) => (
          <Reveal className="sx-chall-row" key={c.k} delay={i * 0.06}>
            <span className="sx-chall-ic"><c.icon size={16} strokeWidth={1.8} /></span>
            <div className="sx-chall-t">
              <b>{c.k}</b>
              <p>{c.p}</p>
            </div>
            <span className="sx-chall-cost">
              <AlertTriangle size={12} strokeWidth={2} />
              {c.cost}
            </span>
          </Reveal>
        ))}
      </div>
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
          <div className="sx-e2e-head">
            <Reveal><span className="sn-kick"><i /> End-to-end supply chain</span></Reveal>
            <MaskText text="One order, seven stages," accent="a single record." as="h2" className="sn-h2" />
            <Reveal delay={0.16} y={14}>
              <p className="sx-lede">
                This is the same purchase order the whole way through. Nothing is re-keyed,
                nothing is exported, and every stage can see what the one before it did.
              </p>
            </Reveal>
          </div>

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
          <Reveal><span className="sn-kick"><i /> {stage.kicker}</span></Reveal>
          <MaskText text={stage.title} accent={stage.accent} as="h2" className="sn-h2" />
          <Reveal delay={0.16} y={14}><p className="sx-body">{stage.body}</p></Reveal>

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
      <div className="sx-gov-head">
        <Reveal><span className="sn-kick"><i /> Security, controls &amp; governance</span></Reveal>
        <MaskText text="Control that survives contact with a warehouse." as="h2" className="sn-h2" />
        <Reveal delay={0.16} y={14}>
          <p className="sx-lede">
            Physical operations are where controls usually break — a shift needs to move
            stock now and the system is the obstacle. These are designed to hold without
            stopping the work.
          </p>
        </Reveal>
      </div>

      <div className="sx-gov-grid">
        {GOV.map((g, i) => (
          <Reveal className="sx-gov-cell" key={g.t} delay={i * 0.05}>
            <span className="sx-gov-ic"><g.icon size={16} strokeWidth={1.8} /></span>
            <h3>{g.t}</h3>
            <p>{g.d}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="sx-certs" delay={0.1}>
        {['ISO/IEC 27001', 'SOC 2 Type II', 'GDPR', 'PDPL', 'GS1 barcode standards'].map((c) => (
          <span key={c}><Check size={11} strokeWidth={3} />{c}</span>
        ))}
      </Reveal>
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
  aside: [
    { icon: Boxes, t: 'We look at your movements', d: 'One month of real stock data tells us more than a two-hour requirements workshop.' },
    { icon: MapPin, t: 'Site walk, not a webinar', d: 'For warehouse work we would rather stand in the aisle than screen-share at it.' },
    { icon: ShieldCheck, t: 'Under NDA from the first call', d: 'Sample data is destroyed after the session unless you ask us to keep it.' },
  ],
  fields: [
    { name: 'name', label: 'Name', required: true, placeholder: 'Omar Siddiqui', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    { name: 'company', label: 'Company', required: true, placeholder: 'Gulf Cement', autoComplete: 'organization' },
    {
      name: 'industry', label: 'Industry', type: 'select', required: true,
      options: ['Manufacturing', 'Retail & FMCG', 'Distribution & wholesale', 'Construction', 'Pharma & healthcare', 'Food & cold chain', 'Other'],
    },
    {
      name: 'area', label: 'Supply-chain area', type: 'choice', span: 2,
      options: ['Procurement', 'Warehouse', 'Inventory', 'Transport & fleet', 'Distribution', 'Planning & forecasting'],
    },
    {
      name: 'size', label: 'Company size', type: 'select', required: true,
      options: ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'],
    },
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
