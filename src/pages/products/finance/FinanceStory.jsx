import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, PieChart, TrendingUp, FileText, Scale,
  Check, ArrowRight, Clock, ShieldCheck, Landmark, Building2, Users,
  Layers, Lock, Database, RefreshCw, FileCheck2, GitBranch, Banknote,
  ChartPie, Percent, Globe, Play, Pause, Inbox, Send,
} from 'lucide-react';
import {
  motion, Reveal, MaskText, useLive, EASE, useInView, useReducedMotion,
} from '../shared/motion';
import { Spotlight, ScrollNumber } from '../shared/stage';
import { Spark, LiveBars, Ring } from '../shared/viz';
import {
  Toolbar, LedgerTable, ApprovalPanel, StatementPanel,
} from './FinanceApp';
import './FinanceStory.css';

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

   08 is the shared Faq/ContactSection pair and lives in Finance.jsx.

   Every section opens with the same head: its number, its name, and the
   question in the reader's own words. That question is the section's
   brief — if a block on the page is not answering it, the block does
   not belong there.

   Namespace `fs-`.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE PALETTE
   The same eight colours the capability rail in the hero runs on, so
   the page below the fold is coloured by the same hand that coloured
   the fold. `rgb` is the raw triple, which is what lets the CSS build
   translucent tints from the same value.

   A colour is always attached to a THING — a module, a step, a
   connection, a number — never to a section. Two sections never share
   a colour scheme, and no block is coloured just to be colourful.
   --------------------------------------------------------------- */
const C = {
  green: ['#0a8f5e', '10, 143, 94'],
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
    <div className="fs-film" style={tone}>
      <video ref={ref} src={src} muted loop playsInline preload="metadata" aria-label={label} />
      <span className="fs-film-wash" aria-hidden="true" />
    </div>
  );
};

/* ---------------------------------------------------------------
   The section head, used by all six sections below.
   --------------------------------------------------------------- */
const Head = ({ n, label, ask, title, accent, lede, tone = '' }) => (
  <div className={`fs-head ${tone}`}>
    <Reveal duration={0.7}>
      <span className="fs-eyebrow">
        <i aria-hidden="true" />
        {label}
      </span>
    </Reveal>

    <MaskText text={title} accent={accent} as="h2" className="fs-h2" />

    {ask && (
      <Reveal delay={0.14} y={12}>
        <p className="fs-ask">{ask}</p>
      </Reveal>
    )}

    {lede && <Reveal delay={0.2} y={14}><p className="fs-lede">{lede}</p></Reveal>}
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
    k: 'General Ledger', c: 'green', icon: BookOpen,
    line: 'The single book every other module posts into.',
    body: 'A multi-entity, multi-currency chart of accounts with dimensions instead of endless account codes. Journals arrive from the sub-ledgers already coded, already approved and already matched.',
    points: ['Multi-entity, multi-book, multi-currency', 'Dimensions: cost centre, project, segment, site', 'Automatic FX revaluation and translation', 'Period locks with maker–checker enforcement', 'Automated accruals and prepayments'],
    stat: ['1.2M', 'journal lines a month'],
  },
  {
    k: 'Accounts Payable', c: 'violet', icon: Receipt,
    line: 'Match before you pay, not after.',
    body: 'Supplier invoices arrive by email, portal or EDI and are read, coded and matched three ways against the purchase order and the goods receipt. Variances are held rather than nodded through.',
    points: ['Three-way matching with tolerance rules', 'Duplicate and fraud detection on capture', 'Payment runs with bank file generation', 'Supplier self-service for invoice status', 'Vendor portal for invoice submission'],
    stat: ['128', 'invoices a day, 84% touchless'],
  },
  {
    k: 'Accounts Receivable', c: 'blue', icon: CreditCard,
    line: 'Shorten the cash cycle without a collections team.',
    body: 'Credit limits are checked before dispatch, not after the debt exists. Reminder sequences fire on their own schedule and escalate by ageing bucket.',
    points: ['Credit limits enforced at order entry', 'Automated dunning by ageing and segment', 'Cash application with bank-feed matching', 'Customer statements and payment portal', 'Integrated online payment gateways'],
    stat: ['31 days', 'DSO, down from 40'],
  },
  {
    k: 'Expenses', c: 'orange', icon: Wallet,
    line: 'Claims that check themselves against policy.',
    body: 'Receipts are captured on a phone, read on the spot and tested against the grade, category and city rules before anyone is asked to approve them.',
    points: ['Mobile capture with receipt extraction', 'Policy rules by grade, category and location', 'Per-diem and mileage calculators', 'Reimbursement posted through payroll', 'Corporate card automated reconciliation'],
    stat: ['412', 'claimants, 2-day turnaround'],
  },
  {
    k: 'Budgeting', c: 'teal', icon: PieChart,
    line: 'A budget the ledger actually enforces.',
    body: 'Budgets are held per dimension and checked at commitment, not at month end. A purchase requisition that would breach its cost centre is stopped where it is raised.',
    points: ['Bottom-up and top-down budget builds', 'Commitment accounting on requisitions', 'Budget-versus-actual on live balances', 'Reforecast cycles with version history', 'Approval workflows for budget transfers'],
    stat: ['9', 'cost centres, monthly reforecast'],
  },
  {
    k: 'Forecasting', c: 'cyan', icon: TrendingUp,
    line: 'Thirteen weeks of cash you can plan against.',
    body: 'Committed flows from open orders, payables and payroll are combined with expected flows to produce a rolling cash forecast that updates as the underlying documents change.',
    points: ['13-week rolling cash forecast', 'Scenario modelling on collection assumptions', 'Bank position across four institutions', 'Variance tracking against last forecast', 'Cash flow sensitivity analysis'],
    stat: ['13 weeks', 'rolling, updated daily'],
  },
  {
    k: 'Reporting', c: 'purple', icon: FileText,
    line: 'The statutory pack as a view, not a project.',
    body: 'Elimination, translation and consolidation have already run. P&L, balance sheet, cash flow and the notes are produced from the same postings the operational dashboards read.',
    points: ['IFRS and local GAAP presentations', 'Consolidated and entity-level statements', 'Drill from any figure to its journal', 'Scheduled distribution to the board pack', 'Interactive custom dashboard builder'],
    stat: ['3', 'currencies consolidated'],
  },
  {
    k: 'Reconciliation', c: 'rose', icon: Scale,
    line: 'Reconciled overnight, reviewed in the morning.',
    body: 'Bank feeds, intercompany balances and control accounts are matched by rule every night. What reaches a person is the exception list, not the whole population.',
    points: ['Daily bank-feed reconciliation', 'Intercompany auto-matching and elimination', 'Control account and sub-ledger tie-outs', 'Exception queue with ageing and owner', 'AI-assisted matching recommendations'],
    stat: ['96%', 'matched without a human'],
  },
];

export const Capabilities = () => {

  return (
    <section className="fs-caps" id="capabilities">
      <div className="fs-in">
        <Head
          n="02"
          label="Product & capabilities"
          title="Eight modules."
          accent="One ledger underneath."
          lede="Nothing here is a separate product with its own database. Every module writes to the same journals and inherits the same controls, so what one module knows, all of them know."
        />

        <div className="fs-caps-body fs-folder-grid">
          {CAPS.map((cap, idx) => (
            <motion.div 
              key={cap.k} 
              className="fs-folder-card" 
              style={tint(cap.c)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <div className="fs-folder-tab">
                {cap.k}
              </div>
              <div className="fs-folder-body">
                <div className="fs-folder-icon">
                  <cap.icon size={48} strokeWidth={1.2} />
                </div>
                <div className="fs-folder-divider" />
                <div className="fs-folder-text">
                  <ul className="fs-folder-points">
                    {cap.points.slice(0, 5).map((pt, i) => (
                      <li key={i} style={{ '--i': i }}>
                        <span className="fs-folder-bullet"></span>
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
    k: 'Capture', c: 'green', icon: Inbox,
    t: 'The document arrives and codes itself',
    d: 'Invoices, receipts, bank statements and sub-ledger entries land by email, portal, EDI or feed. Each one is read, coded to account and dimension, and matched against its purchase order before a person sees it.',
    meta: ['Email · portal · EDI · bank feed', 'Coded on arrival', 'Three-way matched'],
    crumb: 'General ledger',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Post', c: 'blue', icon: Send,
    t: 'It posts to the ledger in real time',
    d: 'There is no staging table and no nightly run. The journal is written to the general ledger as the work happens, which is why the trial balance is produced continuously rather than assembled at period end.',
    meta: ['Live trial balance', 'Multi-entity, multi-currency', 'Balanced or rejected'],
    crumb: 'Journal entries',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Control', c: 'violet', icon: ShieldCheck,
    t: 'The controls decide who signs, and when',
    d: 'Matching tolerances, approval limits and delegation rules route the entry to the right person. What is within tolerance clears on its own; what is outside it is held, never quietly approved.',
    meta: ['Limits by role and entity', 'Maker–checker enforced', 'Exceptions held, not passed'],
    crumb: 'Approvals',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Automate', c: 'orange', icon: RefreshCw,
    t: 'Rules run while the office is closed',
    d: 'Reconciliation, revaluation, depreciation and dunning run against live balances on a schedule or on an event. Every automated posting carries the rule that produced it.',
    meta: ['Scheduled and event-driven', 'Rule stored with the journal', '96% matched without a human'],
    crumb: 'Automations',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Close', c: 'rose', icon: FileCheck2,
    t: 'The period closes on day three',
    d: 'Because the ledger is live and reconciliations run nightly, the month-end close is an administrative lock rather than an exercise in data gathering.',
    meta: ['Automated eliminations', 'Continuous translation', 'Soft and hard period locks'],
    crumb: 'Period close',
    img: '/images/close_step.jpg',
  },
];

export const HowItWorks = () => {
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(true);
  const touched = useRef(0);
  const s = STEPS[i];

  /* it advances on its own, and holds for a few seconds after the
     reader has moved it themselves */
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      if (Date.now() - touched.current < 6000) return;
      setI((n) => (n + 1) % STEPS.length);
    }, 4600);
    return () => clearInterval(id);
  }, [running]);

  const go = useCallback((n) => {
    touched.current = Date.now();
    setI(n);
  }, []);

  return (
    <section className="fs-how" id="how">
      <div className="fs-in">
        <Head
          n="03"
          label="How it works"
          title="From document to signed close,"
          accent="in five moves."
          lede="The same record travels the whole way. Nothing is re-keyed, re-exported or reconciled against a second system — each step below is the one screen where that move actually happens."
        />

        <div className="fs-how-body">
          <div className="fs-steps" role="tablist" aria-label="How Emvive Finance works">
            {STEPS.map((st, idx) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === idx}
                key={st.k}
                style={tint(st.c)}
                className={`fs-step ${i === idx ? 'on' : ''}`}
                onClick={() => go(idx)}
              >
                <span className="fs-step-n"><st.icon size={18} strokeWidth={2} /></span>
                <span className="fs-step-k">{st.k}</span>
                <span className="fs-step-bar" aria-hidden="true">
                  <i className={i === idx && running ? 'run' : ''} />
                </span>
              </button>
            ))}
          </div>

          <div className="fs-how-grid">
            <div className="fs-how-copy" style={tint(s.c)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className="fs-how-k">{s.k}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <ul className="fs-how-meta">
                    {s.meta.map((m) => <li key={m}><Check size={11} strokeWidth={3} />{m}</li>)}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Two kinds of move, two kinds of picture: the ones that
                happen on a screen are shown on the screen, and the ones
                that happen in the business are shown as film. A page of
                nothing but dashboards describes software; this describes
                the work. */}
            <div className="fs-how-stage" style={tint(s.c)}>
              <AnimatePresence mode="wait">
                <motion.div
                  className="fs-how-media"
                  key={s.k}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {s.img ? (
                    <img src={s.img} alt={s.t} className="fs-how-img" />
                  ) : s.film ? (
                    <StoryVideo src={s.film} label={`${s.k} — ${s.t}`} tone={tint(s.c)} />
                  ) : (
                    <div className="fs-app">
                      <div className="fs-app-bar"><Toolbar crumb={s.crumb} /></div>
                      <div className="fs-app-body">
                        <div className="fs-app-screen">{s.panel}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
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
    id: 'financial-close',
    label: 'Financial Close',
    items: [
      { name: 'Bank feed reconciliation' },
      { name: 'FX revaluation' },
      { name: 'Depreciation run' },
      { name: 'Intercompany elimination' },
    ]
  },
  {
    id: 'payables-receivables',
    label: 'Payables & Receivables',
    items: [
      { name: 'Three-way invoice match' },
      { name: 'Dunning escalation' },
      { name: 'Payment allocations' },
      { name: 'Credit limit enforcement' },
    ]
  }
];

export const Automation = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="fs-auto" id="automation">
      <div className="fs-in">
        <Head
          n="04"
          label="Automation"
          title="The routine work stops"
          accent="reaching a person."
          lede="Rules run against live balances on a schedule or on an event. What lands in somebody's queue is the exception — never the whole population."
        />

        <div className="fs-auto-card">
          <div className="fs-auto-left">
            <h2>Our Offerings</h2>
            <p>We help enterprises pursue a path of smart transformation</p>
            
            <div className="fs-auto-tabs">
              {AUTOMATION_TABS.map((tab, i) => (
                <button 
                  key={tab.id}
                  className={`fs-auto-tab ${activeTab === i ? 'on' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="fs-auto-right">
            <div className="fs-auto-hero">
              <img src="/abstract.png" alt="Automation Abstract" />
            </div>
            
            <div className="fs-auto-grid">
              {AUTOMATION_TABS[activeTab].items.map((item, i) => (
                <div className="fs-auto-item" key={i}>
                  <span className="fs-auto-item-n">0{i + 1}. {item.name}</span>
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
    <section className="fs-int" id="integrations" ref={ref}>
      <div className="fs-in">
        <Head
          n="05"
          label="Integrations"
          title="One ledger, wired to"
          accent="everything else."
          lede="Emvive Finance is the accounting core, not an island. What posts into it and what reads out of it are both live connections — no exports, no overnight file drops nobody owns."
        />

        <div className="fs-google-wrapper">
          <div className="fs-google-grid">
            
            {/* LEFT COLUMN: Bank Feeds (Geometric Nodes) */}
            <div className="fs-google-col left">
              {SOURCES.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                const gColors = ['#FBBC04', '#34A853', '#EA4335', '#4285F4', '#FBBC04'];
                const color = gColors[i % gColors.length];
                
                return (
                  <Reveal className="fs-google-left-node" key={name} delay={i * 0.1}>
                    <div className="fs-google-left-content">
                      <div className="fs-google-icon-box" style={{ borderBottomColor: color }}>
                        <Icon size={18} strokeWidth={2.5} color="#5f6368" />
                      </div>
                      <span className="fs-google-label">{name}</span>
                    </div>
                    
                    {/* SVG Line: Thin -> Circle -> Thick -> Dotted Curve */}
                    <svg width="300" height="2" className="fs-google-svg left-svg">
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
            <div className="fs-google-col center">
              <Reveal className="fs-google-center-card" delay={0.2}>
                <div className="fs-google-center-logo">
                  <span style={{ fontSize: 64, fontWeight: 'bold', color: '#fff', fontFamily: 'Inter, sans-serif' }}>E</span>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Dashboard UI Cards */}
            <div className="fs-google-col right">
              {CONSUMERS.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                
                return (
                  <Reveal className="fs-google-right-node" key={name} delay={0.3 + i * 0.1}>
                    {/* SVG Line: Geometric elbows & zigzags */}
                    <svg width="300" height="2" className="fs-google-svg right-svg">
                      {i === 2 ? (
                        // Special zigzag for the middle one to match ref
                        <polyline points={`300,0 260,-15 220,15 180,-15 140,15 100,-15 60,15 0,${targetY}`} fill="none" stroke="#34A853" strokeWidth="3" />
                      ) : (
                        // Standard elbow lines for others
                        <path d={`M 300 0 L 150 0 L 150 ${targetY} L 0 ${targetY}`} fill="none" stroke="#4285F4" strokeWidth="2" strokeDasharray={i % 2 === 0 ? "none" : "6 4"} />
                      )}
                    </svg>

                    <div className="fs-google-dash-card">
                      <div className="fs-google-dash-header">
                        <div className="dash-dot"></div>
                        <div className="dash-dot"></div>
                      </div>
                      <div className="fs-google-dash-body">
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

const CONTROLS = [
  [Lock, 'Segregation of duties', 'Maker and checker enforced per entity. An administrator cannot quietly bypass it.', 'orange'],
  [ShieldCheck, 'Immutable trail', 'User, timestamp, device, before and after values on every change.', 'violet'],
  [Layers, 'Period locks', 'Closed periods reject postings outright rather than warning and letting them through.', 'green'],
  [Database, 'Data residency', 'Saudi Arabia, the UAE or India. Private cloud where shared infrastructure is ruled out.', 'blue'],
];

const BADGES = ['ZATCA Phase 2 certified', 'IFRS & local GAAP', 'Role-based access control', 'Encrypted at rest and in transit', 'Scoped auditor access'];

export const Security = () => {
  const [live, ref] = useLive(
    { n: 0, act: [0, 1, 2, 3].map(makeAct) },
    (s) => ({ n: s.n + 1, act: [makeAct(s.act[0].id + 1), ...s.act.slice(0, 3)] }),
    3000
  );

  return (
    <section className="fs-sec" id="security">
      {/* full-bleed rather than a dark card floating on the page — the
          band itself is the object, so it needs no border to say so */}
      <Spotlight className="fs-sec-band">
        <div className="fs-in">
          <Head
            n="06"
            label="Security & controls"
            ask="Can we trust it?"
            title="Every field that changes"
            accent="leaves a record."
            tone="dark"
            lede="Controls here are system behaviour, not a policy document. The trail below is being written as you read it, and it is the same trail an auditor is given."
          />

          <div className="fs-chain" ref={ref}>
            {CHAIN.map(({ icon: Icon, label, meta, c }, i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <span className="fs-chain-link" aria-hidden="true">
                    <motion.i
                      initial={{ x: '-130%' }}
                      animate={{ x: '130%' }}
                      transition={{ duration: 1.9, delay: i * 0.42, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
                    />
                  </span>
                )}
                <motion.div
                  className="fs-chain-node"
                  style={tint(c)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                >
                  <span className="fs-chain-ic"><Icon size={15} strokeWidth={1.7} /></span>
                  <b>{label}</b>
                  <i>{meta}</i>
                </motion.div>
              </React.Fragment>
            ))}
          </div>

          <div className="fs-audit">
            <div className="fs-audit-head">
              <span className="fs-audit-label">Audit trail</span>
              <span className="fs-audit-live"><i />Recording</span>
            </div>
            <div className="fs-audit-rows">
              <AnimatePresence initial={false}>
                {live.act.map((a) => (
                  <motion.div
                    className="fs-audit-row"
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <span className="fs-audit-avatar">{a.who}</span>
                    <span className="fs-audit-text"><b>{a.text}</b><i>{a.meta}</i></span>
                    <span className="fs-audit-time">{a.ago} ago</span>
                    <span className="fs-audit-hash tnum">0x{(a.id * 7919).toString(16).padStart(6, '0').slice(-6)}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="fs-ctrl-grid">
            {CONTROLS.map(([Icon, t, d, col], i) => (
              <Reveal className="fs-ctrl" delay={i * 0.07} key={t} style={tint(col)}>
                <Icon size={17} strokeWidth={1.6} />
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="fs-badges" delay={0.1}>
            {BADGES.map((b) => (
              <span className="fs-badge" key={b}><Check size={11} strokeWidth={3} />{b}</span>
            ))}
          </Reveal>
        </div>
      </Spotlight>
    </section>
  );
};

/* =====================================================================
   07 — WHY EMVIVE / BUSINESS IMPACT
   "Why should we choose it?"

   The close is the number finance is judged on, so it is drawn against
   the month it has to fit inside rather than shown as an oversized
   numeral. Everything else sits underneath at a size that lets the
   close keep the stage.
   ===================================================================== */
const CLOSE = [
  { k: 'Before Emvive', days: 19, tone: 'was', note: 'Nineteen working days, most of it chasing' },
  { k: 'With Emvive', days: 3, tone: 'now', note: 'Reviewed, signed and filed by day three' },
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

const DAYS = 31;
const pct = (d) => `${(d / DAYS) * 100}%`;

export const WhyEmvive = () => (
  <section className="fs-why" id="impact">
    <div className="fs-in">
      <Head
        n="07"
        label="Why Emvive · business impact"
        ask="Why should we choose it?"
        title="What changes in"
        accent="the first year."
        lede="One real group — seven legal entities, three currencies — twelve months after go-live. Measured in working days after period end."
      />

      <Reveal className="fs-close" y={22}>
        <div className="fs-close-top">
          <span className="fs-close-k">The month-end close</span>
          <span className="fs-close-sub">Working days after period end</span>
        </div>

        <div className="fs-close-ruler" aria-hidden="true">
          <span className="fs-close-ruler-track">
            {[1, 5, 10, 15, 20, 25, 31].map((d) => (
              <i key={d} style={{ left: pct(d - 1) }}>{d}</i>
            ))}
          </span>
        </div>

        {CLOSE.map((c, i) => (
          <div className={`fs-close-row ${c.tone}`} key={c.k}>
            <span className="fs-close-label">
              <b>{c.k}</b>
              <em>{c.note}</em>
            </span>

            <span className="fs-close-track">
              <motion.i
                style={{ width: pct(c.days) }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.25 + i * 0.2, ease: EASE }}
              />
            </span>

            <span className="fs-close-days"><b>{c.days}</b> days</span>
          </div>
        ))}

        <div className="fs-close-delta">
          <span className="fs-close-gap" style={{ marginLeft: pct(3), width: pct(16) }}><i /></span>
          <span className="fs-close-claim">
            <b><ScrollNumber to={16} prefix="−" /> days</b>
            returned to the team, every month
          </span>
        </div>
      </Reveal>

      <div className="fs-impact">
        {IMPACT.map((s, i) => (
          <Reveal className="fs-impact-cell" key={s.label} delay={i * 0.07} style={tint(s.c)}>
            <b>
              <ScrollNumber to={s.v} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix} />
            </b>
            <h3>{s.label}</h3>
            <p>{s.sub}</p>
          </Reveal>
        ))}
      </div>

      <div className="fs-reasons">
        {REASONS.map(([Icon, t, d, col], i) => (
          <Reveal className="fs-reason" key={t} delay={i * 0.06} style={tint(col)}>
            <span className="fs-reason-ic"><Icon size={15} strokeWidth={1.8} /></span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>

      <div className="fs-proof">
        <div className="fs-proof-quote">
          <MaskText
            text="We closed on day nineteen and argued about which spreadsheet was current. We close on day three now."
            as="blockquote"
            className="fs-quote"
          />
          <Reveal delay={0.2}>
            <div className="fs-proof-by">
              <span className="fs-proof-avatar">RH</span>
              <span className="fs-reg-txt"><b>Rania Haddad</b><i>Group Financial Controller, Horizon Holding</i></span>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <a href="#start" className="fs-link">Talk to the finance team <ArrowRight size={15} /></a>
          </Reveal>

          <Reveal className="fs-proof-film" delay={0.34} y={20}>
            <StoryVideo
              src="/images/newletter.mp4"
              label="A finance architect in session with a customer"
              tone={tint('teal')}
            />
          </Reveal>
        </div>

        <Reveal className="fs-proof-visual" delay={0.12} y={26}>
          <div className="fs-proof-bar">
            <b>Close velocity</b>
            <span className="fs-proof-tag">Horizon Holding · 12 months</span>
          </div>
          <div className="fs-proof-bars">
            <LiveBars values={[19, 17, 14, 12, 9, 7, 5, 4, 3, 3, 3, 3]} height={150} />
          </div>
          <div className="fs-proof-axis"><span>Month 1</span><span>Month 12</span></div>
          <div className="fs-proof-stats">
            <div><Ring value={86} size={40} stroke={3.5} label="86" /><span>Automated<br />postings</span></div>
            <div><b className="tnum">3</b><span>Days to<br />close</span></div>
            <div><b className="tnum">7</b><span>Entities<br />consolidated</span></div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
