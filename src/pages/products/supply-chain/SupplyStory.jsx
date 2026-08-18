import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, PieChart, TrendingUp, FileText, Scale,
  Check, ArrowRight, Clock, ShieldCheck, Landmark, Building2, Users,
  Layers, Lock, Database, RefreshCw, FileCheck2, GitBranch, Banknote,
  ChartPie, Percent, Globe, Play, Pause, Inbox, Send, User, X,
  /* the supply chain's own icons — the list above arrived with the file
     when it was copied from Finance, and a ledger book is the wrong mark
     for supplier management */
  Factory, ShoppingCart, Cog, Warehouse, Truck, Network, PackageCheck,
} from 'lucide-react';
import {
  motion, Reveal, MaskText, useLive, EASE, useInView, useReducedMotion,
} from '../shared/motion';
import { Spotlight, ScrollNumber } from '../shared/stage';
import { Spark, LiveBars, Ring } from '../shared/viz';
import {
  Toolbar, LedgerTable, ApprovalPanel, StatementPanel,
} from './SupplyApp';
import './SupplyStory.css';

/* =====================================================================
   EMVIVE FINANCE — THE PAGE AFTER THE HERO

   Seven sections, each answering one question a buyer actually asks, in
   the order they ask it:

     02  Product & capabilities   what can it do?
     03  How it works             how does it work?
     04  Automation               what can it automate?
     05  Integrations             does it connect with our ecosystem?
     06  Security & controls      can we trust it?
     07  Why Emvive               why should we choose it?
     08  FAQ + contact            I understand it — let's talk.

   08 is the shared Faq/ContactSection pair and lives in Supply.jsx.

   Every section opens with the same head: its number, its name, and the
   question in the reader's own words. That question is the section's
   brief — if a block on the page is not answering it, the block does
   not belong there.

   Namespace `ss-`.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE PALETTE

   Eight colours, the same way Finance runs eight: a colour belongs to a
   THING — a capability, a step — never to a section, so two neighbouring
   cards are always told apart by hue. The first slot is the page accent,
   which is why the first and most important capability wears it.

   `rgb` is the raw triple, which is what lets the CSS build translucent
   tints from the same value.
   --------------------------------------------------------------- */
const C = {
  green: ['#3557d8', '53, 87, 216'],
  violet: ['#6c50b2', '108, 80, 178'],
  blue: ['#2563eb', '37, 99, 235'],
  orange: ['#e2601f', '226, 96, 31'],
  teal: ['#0d9488', '13, 148, 136'],
  purple: ['#9333ea', '147, 51, 234'],
  cyan: ['#0891b2', '8, 145, 178'],
  rose: ['#e11d48', '225, 29, 72'],
};

/* every coloured element takes its colour the same way */
const tint = (k) => ({ '--c': C[k][0], '--c-rgb': C[k][1] });

/* ---------------------------------------------------------------
   A film panel. Plays only while it is on screen and only if motion
   is welcome — it is decoration, so a refused autoplay is not worth
   surfacing to anybody.
   --------------------------------------------------------------- */
const StoryVideo = ({ src, label, tone }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '0px 0px -12% 0px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduced) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, reduced]);

  return (
    <div className="ss-film" style={tone}>
      <video ref={ref} src={src} muted loop playsInline preload="metadata" aria-label={label} />
      <span className="ss-film-wash" aria-hidden="true" />
    </div>
  );
};

/* ---------------------------------------------------------------
   The section head, used by all six sections below.
   --------------------------------------------------------------- */
const Head = ({ n, label, ask, title, accent, lede, tone = '' }) => (
  <div className={`ss-head ${tone}`}>
    <Reveal duration={0.7}>
      <span className="ss-eyebrow">
        <i aria-hidden="true" />
        {label}
      </span>
    </Reveal>

    <MaskText text={title} accent={accent} as="h2" className="ss-h2" />

    {ask && (
      <Reveal delay={0.14} y={12}>
        <p className="ss-ask">{ask}</p>
      </Reveal>
    )}

    {lede && <Reveal delay={0.2} y={14}><p className="ss-lede">{lede}</p></Reveal>}
  </div>
);

/* =====================================================================
   02 — PRODUCT & CAPABILITIES
   "What can it do?"

   Eight modules, one detail panel. A list the reader drives, rather
   than eight identical cards they have to compare themselves.
   ===================================================================== */
const CAPS = [
  {
    k: 'Supplier Management', c: 'green', icon: Factory,
    line: 'Onboarding, scorecards and contracts.',
    body: 'Supplier CR, VAT, ISO and insurance certificates tracked with expiry alerting before an order can be placed. Performance by delivery and quality.',
    points: ['Supplier onboarding and scorecards', 'Price lists and contract terms', 'Compliance documents with expiry alerting', 'RFQ and quotation comparison', 'Performance by delivery and quality'],
    stat: ['412', 'active suppliers'],
  },
  {
    k: 'Procurement', c: 'violet', icon: ShoppingCart,
    line: 'Every order acknowledged, every supplier scored.',
    body: 'Requisition to receipt on one document trail. Budget is checked when the commitment is made, approvals route by value and category.',
    points: ['Requisition, RFQ, PO and acknowledgement', 'Commitment accounting against live budgets', 'Approval routing by value and category', 'ASN and goods receipt matching', 'Variance holds instead of nodded-through receipts'],
    stat: ['128', 'open POs'],
  },
  {
    k: 'Manufacturing', c: 'blue', icon: Cog,
    line: 'Bill of materials and shop-floor issue.',
    body: 'The bill of materials issues stock from the right bins and back-flushes the finished goods when the run closes.',
    points: ['Bill of materials and routing', 'Shop-floor issue and back-flush', 'Work order scheduling against capacity', 'Batch and serial traceability', 'Yield and scrap reporting'],
    stat: ['9', 'work orders'],
  },
  {
    k: 'Warehouse', c: 'orange', icon: Warehouse,
    line: 'Down to the bin, down to the batch.',
    body: 'Putaway, picking, packing and counting run on a scanner that works when the signal does not. Stock is held at bin and batch level.',
    points: ['Bin, batch and serial level stock', 'Putaway, picking, packing and counting', 'FEFO selection with wave planning', 'Offline-first scanning, synced in range', 'Cycle counts with variance approval'],
    stat: ['46', 'aisles'],
  },
  {
    k: 'Transportation', c: 'teal', icon: Truck,
    line: 'You hear about the delay before the customer does.',
    body: 'Loads are built by weight and drop sequence, trips are tracked against plan, and cold chain is logged the whole way.',
    points: ['Load building by weight and drop', 'Live ETA against plan', 'Temperature and humidity logging', 'Proof of delivery with signature and photo', 'Driver, trip and fleet records'],
    stat: ['342', 'in transit'],
  },
  {
    k: 'Distribution', c: 'cyan', icon: Network,
    line: 'Cross-docked and allocated across hubs.',
    body: 'Allocation across hubs happens against live demand rather than a monthly plan.',
    points: ['Replenishment and allocation', 'Inter-site transfers and returns', 'Cross-docking at the hub', 'Outlet-level stock visibility', 'Demand-led distribution, not monthly plans'],
    stat: ['18', 'hubs'],
  },
  {
    k: 'Customer Planning', c: 'purple', icon: Users,
    line: 'Demand forecasting by outlet.',
    body: 'The outlet sees the same record the supplier did. Fill rate is measured on the line, not on the invoice.',
    points: ['Demand forecasting by outlet', 'Inventory targets and reorder points', 'Risk and stock-out prediction', 'Scenario planning on assumptions', 'Fill rate and OTIF measurement'],
    stat: ['212', 'outlets'],
  }
];

export const CapabilitiesGrid = () => {
  return (
    <section className="ss-caps" id="capabilities-grid">
      <div className="ss-in">
        <Head
          n="02b"
          label="Product & capabilities (Grid)"
          title="Seven modules."
          accent="One stock ledger underneath."
          lede="Nothing here is a separate product with its own database. Every module writes to the same stock and document records, so what one of them knows, all of them know."
        />

        <div className="ss-caps-body ss-folder-grid">
          {CAPS.map((cap, idx) => (
            <motion.div 
              key={cap.k} 
              className="ss-folder-card" 
              style={tint(cap.c)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <div className="ss-folder-tab">
                {cap.k}
              </div>
              <div className="ss-folder-body">
                <div className="ss-folder-icon">
                  <cap.icon size={48} strokeWidth={1.2} />
                </div>
                <div className="ss-folder-divider" />
                <div className="ss-folder-text">
                  <ul className="ss-folder-points">
                    {cap.points.slice(0, 5).map((pt, i) => (
                      <li key={i} style={{ '--i': i }}>
                        <span className="ss-folder-bullet"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Capabilities = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="ss-caps" id="capabilities">
      <div className="ss-in">
        <Head
          n="02"
          label="Product & capabilities"
          title="Seven modules."
          accent="One stock ledger underneath."
          lede="Nothing here is a separate product with its own database. Every module writes to the same stock and document records, so what one of them knows, all of them know."
        />

        <div className="ss-ms-layout" style={{ marginTop: '3rem' }}>
          <div className="ss-ms-accordion">
            {CAPS.map((cap, idx) => {
              const isActive = idx === activeTab;
              return (
                <div 
                  key={cap.k} 
                  className={`ss-ms-accordion-item ${isActive ? 'active' : ''}`}
                  style={tint(cap.c)}
                >
                  <button 
                    className="ss-ms-accordion-header"
                    onClick={() => setActiveTab(idx)}
                    aria-expanded={isActive}
                  >
                    <div className="ss-ms-accordion-title-wrap">
                      <cap.icon size={20} strokeWidth={2.2} className="ss-ms-accordion-icon" />
                      <span className="ss-ms-accordion-title">
                        {cap.k}
                      </span>
                    </div>
                    <span className="ss-ms-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isActive ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        className="ss-ms-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <div className="ss-ms-accordion-inner">
                          <p>{cap.body}</p>
                          <a href="#how" className="ss-ms-link" style={{ color: 'var(--c)' }}>Explore module</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="ss-ms-display" style={tint(CAPS[activeTab].c)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="ss-ms-display-inner only-visual full-image"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <img 
                  src={`/images/${['capture_step', 'post_step', 'control_step', 'automate_step', 'close_step', 'capture_step', 'post_step', 'control_step'][activeTab]}.jpg`} 
                  alt={CAPS[activeTab].k} 
                  className="ss-ms-full-img" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   03 — HOW IT WORKS
   "How does it work?"

   Five moves from a document arriving to a signed close, and the real
   product surface for each one beside them. The step advances on its
   own so the section demonstrates rather than describes; touching it
   takes control, and the control can be paused.
   ===================================================================== */
const STEPS = [
  {
    k: 'Purchase', c: 'green', icon: ShoppingCart,
    t: 'Requisition became a purchase order',
    d: 'Budget checked at commitment, approval routed by value, order sent and acknowledged — no email in the loop.',
    crumb: 'Procurement',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Produce', c: 'blue', icon: Cog,
    t: 'Work order consumes the components',
    d: 'The bill of materials issues stock from the right bins and back-flushes the finished goods when the run closes.',
    crumb: 'Manufacturing',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Warehouse', c: 'violet', icon: Warehouse,
    t: 'Putaway, then picked against wave',
    d: 'FEFO batch selection, bin-level allocation, and a pick path that walks the aisles once.',
    crumb: 'Warehouse',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Transit', c: 'orange', icon: Truck,
    t: 'Truck departs dock',
    d: 'Load built by weight and drop sequence, temperature logged end to end, proof of delivery captured on the driver’s phone.',
    crumb: 'Logistics',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Delivery', c: 'rose', icon: PackageCheck,
    t: 'On the shelf, in stock, on time',
    d: 'The outlet sees the same record the supplier did. Fill rate is measured on the line, not on the invoice.',
    crumb: 'Distribution',
    img: '/images/close_step.jpg',
  }
];

export const HowItWorks = () => {
  return (
    <section className="ss-how" id="how">
      <div className="ss-in">
        <Head
          n="03"
          label="How it works"
          title="From the purchase order"
          accent="to the carton on the shelf."
          lede="The same order travels the whole way. Procurement, the warehouse and the fleet read and write the same records, so a quantity never has to be reconciled between two systems that both claim to be right."
        />

        <div className="ss-how-split" style={{ marginTop: '4rem' }}>
          
          <motion.div 
            className="ss-how-tall-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/images/automate_step.jpg" alt="How it works" className="ss-how-tall-img" />
            <div className="ss-how-tall-overlay" />
            <div className="ss-how-tall-content">
              <h3>Five seamless moves</h3>
              <p>Watch how a single document flows through the entire system without ever leaving the ledger.</p>
            </div>
          </motion.div>

          <div className="ss-how-features-wrapper">
            <div className="ss-ms-features-grid ss-grid-2-col">
              {STEPS.map((st, idx) => (
                <motion.div
                  key={st.k}
                  className="ss-ms-feature-card"
                  style={tint(st.c)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <div className="ss-ms-feature-top">
                    <div className="ss-ms-feature-icon">
                      <st.icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="ss-ms-feature-name">{st.k}</span>
                  </div>
                  <div className="ss-ms-feature-header">
                    <div className="ss-ms-feature-bar" />
                    <h3 className="ss-ms-feature-title">{st.t}</h3>
                  </div>
                  <p className="ss-ms-feature-desc">{st.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   04 — AUTOMATION
   "What can it automate?"
   ===================================================================== */
const AUTOMATION_TABS = [
  {
    id: 'stock-replenishment',
    label: 'Stock & Replenishment',
    items: [
      { name: 'Reorder point breach' },
      { name: 'FEFO batch selection' },
      { name: 'Cycle count scheduling' },
      { name: 'Transfer suggestions' },
    ]
  },
  {
    id: 'procurement-transport',
    label: 'Procurement & Transport',
    items: [
      { name: 'PO acknowledgement chasing' },
      { name: 'Three-way receipt match' },
      { name: 'Load building by drop' },
      { name: 'ETA slip alerting' },
    ]
  }
];

export const Automation = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="ss-auto" id="automation">
      <div className="ss-in">
        <Head
          n="04"
          label="Automation"
          title="The routine work stops"
          accent="reaching a person."
          lede="Rules run against live stock on a schedule or on an event. What lands in somebody's queue is the exception — never the whole population."
        />

        <div className="ss-auto-card">
          <div className="ss-auto-left">
            <h2>Our Offerings</h2>
            <p>We help enterprises pursue a path of smart transformation</p>
            
            <div className="ss-auto-tabs">
              {AUTOMATION_TABS.map((tab, i) => (
                <button 
                  key={tab.id}
                  className={`ss-auto-tab ${activeTab === i ? 'on' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="ss-auto-right">
            <div className="ss-auto-hero">
              <img src="/abstract.png" alt="Automation Abstract" />
            </div>
            
            <div className="ss-auto-grid">
              {AUTOMATION_TABS[activeTab].items.map((item, i) => (
                <div className="ss-auto-item" key={i}>
                  <span className="ss-auto-item-n">0{i + 1}. {item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   05 — INTEGRATIONS
   "Does it connect with our ecosystem?"

   Two live registers with the ledger between them: what posts in, and
   what reads out. The wires carry traffic, because a diagram of empty
   boxes is the one thing this question does not answer.
   ===================================================================== */
const SOURCES = [
  [Landmark, 'Bank feeds', 'connected', 'blue', '4 banks · daily'],
  [Receipt, 'Supplier invoices', 'syncing', 'violet', '128 today'],
  [CreditCard, 'Payment gateways', 'connected', 'teal', 'Live'],
  [Database, 'Legacy ERP', 'connected', 'cyan', 'Nightly'],
  [Users, 'Payroll & HRMS', 'connected', 'orange', '412 staff'],
];

const CONSUMERS = [
  [ChartPie, 'Power BI / Tableau', 'connected', 'purple', 'Refreshed 2m'],
  [ShieldCheck, 'ZATCA clearance', 'connected', 'green', '4,182 cleared'],
  [TrendingUp, 'Board reporting', 'syncing', 'blue', 'Generating'],
  [Percent, 'Tax authority filing', 'connected', 'orange', 'Q4 filed'],
  [FileCheck2, 'Auditor portal', 'connected', 'teal', 'Read-only'],
];



const WAYS = [
  [GitBranch, 'REST & webhook API', 'Every object readable and writable, with events pushed on change.', 'cyan'],
  [Database, 'Pre-built connectors', 'SAP, Oracle, Dynamics, Tally, Odoo and the regional banks.', 'violet'],
  [Banknote, 'Bank & payment rails', 'Statement import, host-to-host files and direct gateway settlement.', 'blue'],
  [Globe, 'Regulator channels', 'ZATCA clearance, e-invoicing and statutory filing built in, not bolted on.', 'green'],
];

export const Integrations = () => {
  const [live, ref] = useLive(
    { n: 0, cash: 42.8, pct: 2.4 },
    (s) => {
      const n = s.n + 1;
      const w = Math.sin(n * 0.9) * 0.55 + Math.sin(n * 1.7) * 0.45;
      return { n, cash: 42.8 * (1 + w * 0.011), pct: 2.4 + w * 0.5 };
    },
    3000
  );

  return (
    <section className="ss-int" id="integrations" ref={ref}>
      <div className="ss-in">
        <Head
          n="05"
          label="Integrations"
          title="One stock ledger, wired to"
          accent="everything else."
          lede="Emvive Supply is the accounting core, not an island. What posts into it and what reads out of it are both live connections — no exports, no overnight file drops nobody owns."
        />

        <div className="ss-google-wrapper">
          <div className="ss-google-grid">
            
            {/* LEFT COLUMN: Bank Feeds (Geometric Nodes) */}
            <div className="ss-google-col left">
              {SOURCES.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                const gColors = ['#FBBC04', '#34A853', '#EA4335', '#4285F4', '#FBBC04'];
                const color = gColors[i % gColors.length];
                
                return (
                  <Reveal className="ss-google-left-node" key={name} delay={i * 0.1}>
                    <div className="ss-google-left-content">
                      <div className="ss-google-icon-box" style={{ borderBottomColor: color }}>
                        <Icon size={18} strokeWidth={2.5} color="#5f6368" />
                      </div>
                      <span className="ss-google-label">{name}</span>
                    </div>
                    
                    {/* SVG Line: Thin -> Circle -> Thick -> Dotted Curve */}
                    <svg width="300" height="2" className="ss-google-svg left-svg">
                      <line x1="0" y1="0" x2="60" y2="0" stroke="#dadce0" strokeWidth="2" />
                      <circle cx="60" cy="0" r="3" fill="#fff" stroke={color} strokeWidth="2" />
                      <line x1="63" y1="0" x2="160" y2="0" stroke={color} strokeWidth="4" />
                      <path d={`M 160 0 C 220 0, 240 ${targetY}, 300 ${targetY}`} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
                    </svg>
                  </Reveal>
                );
              })}
            </div>

            {/* CENTER COLUMN: Solid Blue Block */}
            <div className="ss-google-col center">
              <Reveal className="ss-google-center-card" delay={0.2}>
                <div className="ss-google-center-logo">
                  <span style={{ fontSize: 64, fontWeight: 'bold', color: '#fff', fontFamily: 'Inter, sans-serif' }}>E</span>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Dashboard UI Cards */}
            <div className="ss-google-col right">
              {CONSUMERS.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                
                return (
                  <Reveal className="ss-google-right-node" key={name} delay={0.3 + i * 0.1}>
                    {/* SVG Line: Geometric elbows & zigzags */}
                    <svg width="300" height="2" className="ss-google-svg right-svg">
                      {i === 2 ? (
                        // Special zigzag for the middle one to match ref
                        <polyline points={`300,0 260,-15 220,15 180,-15 140,15 100,-15 60,15 0,${targetY}`} fill="none" stroke="#0891b2" strokeWidth="3" />
                      ) : (
                        // Standard elbow lines for others
                        <path d={`M 300 0 L 150 0 L 150 ${targetY} L 0 ${targetY}`} fill="none" stroke="#0891b2" strokeWidth="2" strokeDasharray={i % 2 === 0 ? "none" : "6 4"} />
                      )}
                    </svg>

                    <div className="ss-google-dash-card">
                      <div className="ss-google-dash-header">
                        <div className="dash-dot"></div>
                        <div className="dash-dot"></div>
                      </div>
                      <div className="ss-google-dash-body">
                        <Icon size={14} color="#80868b" />
                        <b>{name}</b>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   06 — SECURITY & CONTROLS
   "Can we trust it?"

   The answer is evidence, so the section shows the chain a record
   travels and the trail it leaves while you are reading it.
   ===================================================================== */
const CHAIN = [
  { icon: FileText, label: 'Record', meta: 'Invoice created', c: 'blue' },
  { icon: ShieldCheck, label: 'Validation', meta: '3-way match passed', c: 'violet' },
  { icon: Users, label: 'Approval', meta: 'Controller signed', c: 'orange' },
  { icon: Lock, label: 'Locked', meta: 'Period closed', c: 'green' },
  { icon: ChartPie, label: 'Analytics', meta: 'Report refreshed', c: 'purple' },
];

const ACT_POOL = [
  { who: 'MK', text: 'M. Khalid edited amount', meta: '18,240 → 18,240.00', ago: '2s' },
  { who: 'RH', text: 'R. Haddad approved', meta: 'Within delegation', ago: '1m' },
  { who: 'AS', text: 'A. Salem attached file', meta: 'fx-rates-oct.pdf', ago: '4m' },
  { who: 'SY', text: 'System posted journal', meta: 'Rule: FX revaluation', ago: '9m' },
  { who: 'MK', text: 'M. Khalid left a comment', meta: '"Check the closing rate"', ago: '12m' },
];

const makeAct = (i) => ({ ...ACT_POOL[i % ACT_POOL.length], id: i });

const SEC_CARDS = [
  { 
    id: 'duties', 
    title: 'Segregation of Duties', 
    desc: 'Maker-checker enforced per entity. No administrator can bypass it.',
    span: 2 
  },
  { 
    id: 'audit', 
    title: 'Immutable Audit Trail', 
    desc: 'User, timestamp, device, before-and-after values on every single change.',
    span: 2 
  },
  { 
    id: 'locks', 
    title: 'Period Locks', 
    desc: 'Closed periods reject postings outright, not just warn.',
    span: 2 
  },
  { 
    id: 'residency', 
    title: 'Data Residency', 
    desc: 'Saudi Arabia, UAE or India. Private cloud with no shared infrastructure.',
    span: 3 
  },
  { 
    id: 'encryption', 
    title: 'Encryption Everywhere', 
    desc: 'AES-256 at rest, TLS 1.3 in transit. Zero plain-text storage.',
    span: 3 
  },
];

/* ---------------------------------------------------------------
   THE CONTROL DIAGRAMS

   One per card, each drawing the mechanism its card claims: maker and
   checker being two different people, a value's before and its after,
   a posting bouncing off a closed period. They replace five grey-bar
   UI mockups that showed placeholder furniture instead — bars where
   the words should be, in a blue nothing else on this page uses.

   Drawn as SVG on a shared 240-unit grid, so all five sit at one scale
   and take their colour from the same seven constants.
   --------------------------------------------------------------- */
const D = {
  ink: '#0f172a',
  mid: '#475569',
  soft: '#94a3b8',
  hair: '#e2e8f0',
  green: '#0891b2',
  wash: 'rgba(8, 145, 178, 0.09)',
  stop: '#e11d48',
};

const Dia = ({ span, h, children }) => (
  <svg
    className="ss-sec-dia"
    data-span={span}
    viewBox={`0 0 240 ${h}`}
    fill="none"
    role="img"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* a padlock, at whatever size and colour the caller needs */
const Padlock = ({ x, y, c }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect y="5" width="12" height="9" rx="2" fill={c} />
    <path d="M3 5 V3.5 a3 3 0 0 1 6 0 V5" stroke={c} strokeWidth="1.6" fill="none" />
  </g>
);

const SecGraphic = ({ id, span }) => {
  /* maker and checker are two people, and the third row is the rule
     that keeps them from collapsing into one */
  if (id === 'duties') {
    const rows = [
      { i: 'MK', n: 'M. Khalid', d: 'raised the invoice', state: 'was' },
      { i: 'RH', n: 'R. Haddad', d: 'approved it', state: 'ok' },
      { i: 'MK', n: 'M. Khalid', d: 'cannot approve his own', state: 'no' },
    ];
    return (
      <Dia span={span} h={124}>
        {rows.map((r, k) => {
          const y = 4 + k * 40;
          const ok = r.state === 'ok';
          const no = r.state === 'no';
          return (
            <g key={r.d}>
              <rect
                x="4" y={y} width="232" height="32" rx="9"
                fill={ok ? D.wash : '#fff'}
                stroke={ok ? D.green : D.hair}
                strokeDasharray={no ? '4 3' : undefined}
              />
              <circle cx="26" cy={y + 16} r="9" fill={ok ? D.green : '#fff'} stroke={ok ? D.green : D.hair} />
              <text
                x="26" y={y + 19} fontSize="8.5" fontWeight="700" textAnchor="middle"
                fill={ok ? '#fff' : no ? D.soft : D.mid}
              >
                {r.i}
              </text>
              <text x="44" y={y + 14} fontSize="10" fontWeight="600" fill={no ? D.soft : D.ink}>{r.n}</text>
              <text x="44" y={y + 26} fontSize="8.5" fill={ok ? D.green : D.soft}>{r.d}</text>
              {ok && (
                <path
                  d={`M210 ${y + 16} l4 4 l9 -9`}
                  stroke={D.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                />
              )}
              {no && (
                <path
                  d={`M211 ${y + 11} l9 9 M220 ${y + 11} l-9 9`}
                  stroke={D.stop} strokeWidth="2.2" strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </Dia>
    );
  }

  /* every change keeps its before as well as its after, in order */
  if (id === 'audit') {
    const rows = [
      ['09:14', 'amount', '18,240', '18,240.00'],
      ['09:15', 'approver', '—', 'R. Haddad'],
      ['09:16', 'status', 'draft', 'posted'],
    ];
    return (
      <Dia span={span} h={124}>
        <line x1="16" y1="20" x2="16" y2="100" stroke={D.hair} strokeWidth="2" />
        {rows.map(([t, f, was, now], k) => {
          const y = 20 + k * 34;
          const last = k === rows.length - 1;
          const arrow = 40 + was.length * 5.6;
          return (
            <g key={t}>
              <circle
                cx="16" cy={y} r="5"
                fill={last ? D.green : '#fff'}
                stroke={last ? D.green : D.soft}
                strokeWidth="2"
              />
              <text x="34" y={y - 3} fontSize="8.5" fill={D.soft} fontFamily="ui-monospace, monospace">{t}</text>
              <text x="72" y={y - 3} fontSize="9" fontWeight="600" fill={D.ink}>{f}</text>
              <text x="34" y={y + 12} fontSize="9" fill={D.soft} fontFamily="ui-monospace, monospace">{was}</text>
              <path d={`M${arrow} ${y + 9} h12`} stroke={D.soft} strokeWidth="1.3" />
              <path
                d={`M${arrow + 9} ${y + 6} l3 3 l-3 3`}
                stroke={D.soft} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
              />
              <text
                x={arrow + 18} y={y + 12} fontSize="9" fontWeight="600"
                fill={D.green} fontFamily="ui-monospace, monospace"
              >
                {now}
              </text>
            </g>
          );
        })}
      </Dia>
    );
  }

  /* a closed period does not warn, it refuses */
  if (id === 'locks') {
    const months = [['Sep', true], ['Oct', true], ['Nov', false]];
    return (
      <Dia span={span} h={124}>
        {months.map(([m, shut], k) => {
          const x = 4 + k * 78;
          return (
            <g key={m}>
              <rect
                x={x} y="6" width="70" height="54" rx="10"
                fill={shut ? '#f8fafc' : D.wash}
                stroke={shut ? D.hair : D.green}
              />
              <text
                x={x + 35} y="27" fontSize="10.5" fontWeight="700" textAnchor="middle"
                fill={shut ? D.soft : D.green}
              >
                {m}
              </text>
              {shut
                ? <Padlock x={x + 29} y="34" c={D.soft} />
                : <text x={x + 35} y="46" fontSize="8.5" fill={D.green} textAnchor="middle">open</text>}
            </g>
          );
        })}

        <path d="M117 96 V70" stroke={D.stop} strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M112 75 l5 -6 l5 6" stroke={D.stop} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        <rect x="50" y="96" width="140" height="24" rx="8" fill="#fff" stroke={D.hair} />
        <path d="M65 103 l9 9 M74 103 l-9 9" stroke={D.stop} strokeWidth="2" strokeLinecap="round" />
        <text x="84" y="112" fontSize="9.5" fontWeight="600" fill={D.ink}>posting rejected</text>
      </Dia>
    );
  }

  /* the data sits in one region, and that is a decision made once */
  if (id === 'residency') {
    const regions = [['Saudi Arabia', true], ['UAE', false], ['India', false]];
    return (
      <Dia span={span} h={124}>
        <rect x="3" y="3" width="234" height="118" rx="14" fill="none" stroke={D.hair} strokeDasharray="5 4" />
        <text x="18" y="24" fontSize="8" fontWeight="700" fill={D.soft} letterSpacing="0.08em">
          PRIVATE CLOUD · NO SHARED INFRASTRUCTURE
        </text>

        {regions.map(([r, on], k) => {
          const x = 16 + k * 72;
          return (
            <g key={r}>
              <rect
                x={x} y="36" width="64" height="66" rx="11"
                fill={on ? D.wash : '#fff'}
                stroke={on ? D.green : D.hair}
                strokeWidth={on ? 1.6 : 1}
              />
              <circle cx={x + 32} cy="60" r="12" stroke={on ? D.green : D.soft} strokeWidth="1.5" />
              <path
                d={`M${x + 20} 60 h24 M${x + 32} 48 a17 17 0 0 1 0 24 a17 17 0 0 1 0 -24`}
                stroke={on ? D.green : D.soft} strokeWidth="1.2"
              />
              <text
                x={x + 32} y="86" fontSize="8.5" fontWeight="600" textAnchor="middle"
                fill={on ? D.ink : D.soft}
              >
                {r}
              </text>
              {on && <circle cx={x + 32} cy="94" r="3" fill={D.green} />}
            </g>
          );
        })}
      </Dia>
    );
  }

  /* readable while you work on it, unreadable everywhere it rests or travels */
  if (id === 'encryption') {
    return (
      <Dia span={span} h={104}>
        <rect x="4" y="6" width="104" height="92" rx="12" fill="#fff" stroke={D.hair} />
        <text x="20" y="26" fontSize="8" fontWeight="700" fill={D.soft} letterSpacing="0.08em">AT REST</text>
        <text x="20" y="44" fontSize="10" fontWeight="600" fill={D.ink}>AES-256</text>
        <text x="20" y="64" fontSize="8.5" fill={D.soft} fontFamily="ui-monospace, monospace">18,240.00</text>
        <path d="M20 71 h68" stroke={D.hair} strokeWidth="1.2" />
        <text x="20" y="86" fontSize="8.5" fill={D.green} fontFamily="ui-monospace, monospace">9f2a·c17e·40b</text>

        <rect x="132" y="6" width="104" height="92" rx="12" fill={D.wash} stroke={D.green} />
        <text x="148" y="26" fontSize="8" fontWeight="700" fill={D.green} letterSpacing="0.08em">IN TRANSIT</text>
        <text x="148" y="44" fontSize="10" fontWeight="600" fill={D.ink}>TLS 1.3</text>
        <circle cx="152" cy="76" r="5" fill="#fff" stroke={D.green} strokeWidth="1.6" />
        <path d="M158 76 h50" stroke={D.green} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="214" cy="76" r="5" fill="#fff" stroke={D.green} strokeWidth="1.6" />
        <Padlock x="177" y="64" c={D.green} />
      </Dia>
    );
  }

  return null;
};

export const Security = () => {
  return (
    <section className="ss-sec-new" id="security">
      <div className="ss-in">
        <Head
          n="06"
          label="Security & controls"
          ask="Can we trust it?"
          title="Every field that changes"
          accent="leaves a record."
          lede="Controls here are system behaviour, not a policy document. Emvive Supply is built on immutable ledgers with strict role-based access."
        />

        <div className="ss-sec-grid-6">
          {SEC_CARDS.map((card, i) => (
            <Reveal className="ss-sec-card-clean" style={{ gridColumn: `span ${card.span}` }} key={card.title} delay={i * 0.06}>
              <div className="ss-sec-card-text-clean">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
              <div className="ss-sec-card-graphic-clean">
                 <SecGraphic id={card.id} span={card.span} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   07 — WHY EMVIVE / BUSINESS IMPACT
   "Why should we choose it?"

   The close is the number supply-chain is judged on, so it is drawn against
   the month it has to fit inside rather than shown as an oversized
   numeral. Everything else sits underneath at a size that lets the
   close keep the stage.
   ===================================================================== */
const CLOSE = [
  { k: 'Before Emvive', days: 11, tone: 'was', note: 'Eleven days, most of it waiting on a status' },
  { k: 'With Emvive', days: 4, tone: 'now', note: 'Acknowledged, picked, loaded and delivered' },
];

const IMPACT = [
  { v: 42, c: 'orange', suffix: '%', label: 'Fewer manual journal entries', sub: 'Posting rules absorb the routine work within the first quarter' },
  { v: 4.2, c: 'blue', decimals: 1, prefix: 'SAR ', suffix: 'M', label: 'Working capital released', sub: 'Recovered from a shorter cash cycle and tighter credit control' },
  { v: 99.8, c: 'green', decimals: 1, suffix: '%', label: 'Cleared on first submission', sub: 'Signed, stamped and accepted by the authority in under a second' },
];

const REASONS = [
  [Clock, 'The close stops being a project', 'Sub-ledgers post in real time and reconciliations run nightly, so period end reviews work already done.', 'teal'],
  [Layers, 'One ledger, many books', 'Statutory, management and IFRS views come off the same postings. Intercompany matches itself.', 'violet'],
  [ShieldCheck, 'Controls that actually stop things', 'A closed period rejects a posting. Approval limits and duty segregation are enforced by the ledger, not by memo.', 'orange'],
  [Building2, 'Built for this region', 'ZATCA Phase 2, Arabic presentation, multi-currency groups and data held in Saudi Arabia, the UAE or India.', 'green'],
];

const DAYS = 20;
const pct = (d) => `${(d / DAYS) * 100}%`;

/* the ruler the two bars are measured against — each tick sits at the
   same scale the bars are drawn on, so day 19 on the ruler is the end
   of the 19-day bar underneath it */
const RULER = [1, 4, 7, 10, 14, 18, 20];

const STATS = [
  { icon: Clock, value: '4', suffix: ' days', label: 'Order to shelf' },
  { icon: Layers, value: '99.1', suffix: '%', label: 'Fill rate' },
  { icon: Users, value: '18', suffix: '', label: 'Hubs consolidated' },
  { icon: ShieldCheck, value: '96.4', suffix: '%', label: 'OTIF' },
];

const QUOTES = [
  'Stock is held at bin and batch level, so what the system says is on the shelf is what the picker finds on the shelf.',
  'Loads are built by weight and drop sequence, and an ETA that slips lists the outlets affected before the customer calls.',
  'A buyer cannot receive their own order. Approval limits and duty segregation are enforced by the ledger, not by memo.',
];

/* ---------------------------------------------------------------
   The close card and the four figures are used by both variants of
   section 07 below, so they are written once here. Copying the markup
   into the second variant would mean every future change to the close
   card had to be made twice, and the two would drift.
   --------------------------------------------------------------- */
const CloseCard = () => (
  <Reveal className="ss-close" y={22}>
    <div className="ss-close-top">
      <span className="ss-close-k">ORDER TO SHELF</span>
      <span className="ss-close-sub">Working days from PO to outlet</span>
    </div>

    <div className="ss-close-ruler">
      <span className="ss-close-ruler-track">
        {RULER.map((d) => (
          <i key={d} style={{ left: pct(d) }}>{d}</i>
        ))}
      </span>
    </div>

    {CLOSE.map((c, i) => (
      <div className={`ss-close-row ${c.tone}`} key={c.k}>
        <span className="ss-close-label">
          <b>{c.k}</b>
          <em>{c.note}</em>
        </span>

        <span className="ss-close-track">
          <motion.i
            style={{ width: pct(c.days) }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05, delay: 0.25 + i * 0.2, ease: EASE }}
          />
        </span>

        <span className="ss-close-days"><b>{c.days}</b> days</span>
      </div>
    ))}

    <div className="ss-close-delta">
      <span className="ss-close-gap" style={{ marginLeft: pct(3), width: pct(16) }}><i /></span>
      <span className="ss-close-claim">
        <b><ScrollNumber to={7} prefix="−" /> days</b>
        off the cycle, on every order
      </span>
    </div>
  </Reveal>
);

const StatsBand = ({ className = '' }) => (
  <div className={`ss-stats-grid ${className}`}>
    {STATS.map((s, i) => (
      <Reveal className="ss-stat-item" key={s.label} delay={i * 0.08}>
        <div className="ss-stat-icon">
          <s.icon size={24} strokeWidth={2} />
        </div>
        <div className="ss-stat-value">
          <b>{s.value}<span>{s.suffix}</span></b>
          <p>{s.label}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

export const WhyEmvive = () => (
  <section className="ss-why" id="impact">
    <div className="ss-in">
      <Head
        n="07"
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — eighteen hubs, two hundred and twelve outlets — twelve months after go-live. Measured on the line, not on the invoice."
      />
      {/* one rounded panel, split: the close card and the figures on a
          grey ground, the photograph filling the other half, and the
          three quotes lying across the seam between them */}
      <div className="ss-why-panel">
        <div className="ss-why-panel-left">
          <CloseCard />
          <StatsBand />
        </div>

        <div className="ss-why-panel-photo">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=900"
            alt="Supply professional"
            className="ss-quotes-bg-img"
          />
        </div>

        <div className="ss-quotes-overlay">
          {QUOTES.map((q, i) => (
            <Reveal className="ss-quote-card" key={i} delay={0.1 + i * 0.1}>
              <span className="ss-quote-mark">❝</span>
              <p>{q}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* =====================================================================
   07b — THE SAME SECTION, ONE LONG CARD
   No photograph and no quotes: the panel runs the full width with the
   close card across it and the four figures in a single line of four
   underneath. Same components, same surface, different arrangement.
   ===================================================================== */
export const WhyEmviveWide = () => (
  <section className="ss-why ss-why-wide" id="impact-wide">
    <div className="ss-in">
      <Head
        n="07b"
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — eighteen hubs, two hundred and twelve outlets — twelve months after go-live. Measured on the line, not on the invoice."
      />

      <div className="ss-why-panel ss-why-panel-wide">
        <CloseCard />
        <StatsBand className="ss-stats-row" />
      </div>
    </div>
  </section>
);
