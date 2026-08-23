import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, PieChart, TrendingUp, FileText, Scale,
  Check, ArrowRight, Clock, ShieldCheck, Landmark, Building2, Users,
  Layers, Lock, Database, RefreshCw, FileCheck2, GitBranch, Banknote,
  ChartPie, Percent, Globe, Play, Pause, Inbox, Send, User, X
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
export const tint = (k) => ({ '--c': C[k][0], '--c-rgb': C[k][1] });

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
/* exported so the rebuilt page can reuse the content without copying it */
export const CAPS = [
  {
    k: 'General Ledger', c: 'green', icon: BookOpen, img: 'post_step',
    line: 'The single book every other module posts into.',
    body: 'A multi-entity, multi-currency chart of accounts with dimensions instead of endless account codes. Journals arrive from the sub-ledgers already coded, already approved and already matched.',
    points: ['Multi-entity, multi-book, multi-currency', 'Dimensions: cost centre, project, segment, site', 'Automatic FX revaluation and translation', 'Period locks with maker–checker enforcement', 'Automated accruals and prepayments'],
    stat: ['1.2M', 'journal lines a month'],
  },
  {
    k: 'Accounts Payable', c: 'violet', icon: Receipt, img: 'capture_step',
    line: 'Match before you pay, not after.',
    body: 'Supplier invoices arrive by email, portal or EDI and are read, coded and matched three ways against the purchase order and the goods receipt. Variances are held rather than nodded through.',
    points: ['Three-way matching with tolerance rules', 'Duplicate and fraud detection on capture', 'Payment runs with bank file generation', 'Supplier self-service for invoice status', 'Vendor portal for invoice submission'],
    stat: ['128', 'invoices a day, 84% touchless'],
  },
  {
    k: 'Accounts Receivable', c: 'blue', icon: CreditCard, img: 'close_step',
    line: 'Shorten the cash cycle without a collections team.',
    body: 'Credit limits are checked before dispatch, not after the debt exists. Reminder sequences fire on their own schedule and escalate by ageing bucket.',
    points: ['Credit limits enforced at order entry', 'Automated dunning by ageing and segment', 'Cash application with bank-feed matching', 'Customer statements and payment portal', 'Integrated online payment gateways'],
    stat: ['31 days', 'DSO, down from 40'],
  },
  {
    k: 'Expenses', c: 'orange', icon: Wallet, img: 'capture_step',
    line: 'Claims that check themselves against policy.',
    body: 'Receipts are captured on a phone, read on the spot and tested against the grade, category and city rules before anyone is asked to approve them.',
    points: ['Mobile capture with receipt extraction', 'Policy rules by grade, category and location', 'Per-diem and mileage calculators', 'Reimbursement posted through payroll', 'Corporate card automated reconciliation'],
    stat: ['412', 'claimants, 2-day turnaround'],
  },
  {
    k: 'Budgeting', c: 'teal', icon: PieChart, img: 'control_step',
    line: 'A budget the ledger actually enforces.',
    body: 'Budgets are held per dimension and checked at commitment, not at month end. A purchase requisition that would breach its cost centre is stopped where it is raised.',
    points: ['Bottom-up and top-down budget builds', 'Commitment accounting on requisitions', 'Budget-versus-actual on live balances', 'Reforecast cycles with version history', 'Approval workflows for budget transfers'],
    stat: ['9', 'cost centres, monthly reforecast'],
  },
  {
    k: 'Forecasting', c: 'cyan', icon: TrendingUp, img: 'automate_step',
    line: 'Thirteen weeks of cash you can plan against.',
    body: 'Committed flows from open orders, payables and payroll are combined with expected flows to produce a rolling cash forecast that updates as the underlying documents change.',
    points: ['13-week rolling cash forecast', 'Scenario modelling on collection assumptions', 'Bank position across four institutions', 'Variance tracking against last forecast', 'Cash flow sensitivity analysis'],
    stat: ['13 weeks', 'rolling, updated daily'],
  },
  {
    k: 'Reporting', c: 'purple', icon: FileText, img: 'control_step',
    line: 'The statutory pack as a view, not a project.',
    body: 'Elimination, translation and consolidation have already run. P&L, balance sheet, cash flow and the notes are produced from the same postings the operational dashboards read.',
    points: ['IFRS and local GAAP presentations', 'Consolidated and entity-level statements', 'Drill from any figure to its journal', 'Scheduled distribution to the board pack', 'Interactive custom dashboard builder'],
    stat: ['3', 'currencies consolidated'],
  },
  {
    k: 'Reconciliation', c: 'rose', icon: Scale, img: 'close_step',
    line: 'Reconciled overnight, reviewed in the morning.',
    body: 'Bank feeds, intercompany balances and control accounts are matched by rule every night. What reaches a person is the exception list, not the whole population.',
    points: ['Daily bank-feed reconciliation', 'Intercompany auto-matching and elimination', 'Control account and sub-ledger tie-outs', 'Exception queue with ageing and owner', 'AI-assisted matching recommendations'],
    stat: ['96%', 'matched without a human'],
  },
];

export const CapabilitiesGrid = () => {
  return (
    <section className="fs-caps" id="capabilities-grid">
      <div className="fs-in">
        <Head
          n="02b"
          label="Product & capabilities (Grid)"
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

/* The eight modules, grouped under four outcome pills. The pill bar is
   the shape Microsoft uses on the Dynamics 365 Finance overview: a row
   of pills above the panel, each swapping the whole accordion beneath
   it rather than scrolling one long list of eight.

   Grouping is by outcome, not by module name, because that is the
   question a buyer is actually asking — "can it handle what I pay and
   what I collect", not "do you have an AP module". Two modules per pill
   keeps every group the same weight. */
const CAP_PILLS = [
  { k: 'Record and reconcile', modules: ['General Ledger', 'Reconciliation'] },
  { k: 'Pay and get paid', modules: ['Accounts Payable', 'Accounts Receivable'] },
  { k: 'Control spend', modules: ['Expenses', 'Budgeting'] },
  { k: 'Plan and report', modules: ['Forecasting', 'Reporting'] },
];

/* resolved once, by name — so reordering CAPS cannot silently reshuffle
   which modules sit under which pill */
const CAP_GROUPS = CAP_PILLS.map((p) => p.modules.map((n) => CAPS.findIndex((c) => c.k === n)));

export const Capabilities = () => {
  const [pill, setPill] = useState(0);
  const [activeTab, setActiveTab] = useState(CAP_GROUPS[0][0]);

  const members = CAP_GROUPS[pill];

  /* changing pill opens that group's first module, so the panel is never
     showing a module the visible accordion no longer lists */
  const choosePill = (i) => {
    setPill(i);
    setActiveTab(CAP_GROUPS[i][0]);
  };

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

        <div className="fs-pill-bar" role="tablist" aria-label="Capability groups">
          {CAP_PILLS.map((p, i) => (
            <button
              key={p.k}
              type="button"
              role="tab"
              className={`fs-pill${i === pill ? ' active' : ''}`}
              aria-selected={i === pill}
              onClick={() => choosePill(i)}
            >
              {p.k}
            </button>
          ))}
        </div>

        <div className="fs-ms-layout">
          <div className="fs-ms-accordion">
            {members.map((idx) => {
              const cap = CAPS[idx];
              const isActive = idx === activeTab;
              return (
                <div
                  key={cap.k}
                  className={`fs-ms-accordion-item ${isActive ? 'active' : ''}`}
                  style={tint(cap.c)}
                >
                  <button
                    className="fs-ms-accordion-header"
                    onClick={() => setActiveTab(idx)}
                    aria-expanded={isActive}
                  >
                    <div className="fs-ms-accordion-title-wrap">
                      <cap.icon size={20} strokeWidth={2.2} className="fs-ms-accordion-icon" />
                      <span className="fs-ms-accordion-title">{cap.k}</span>
                    </div>
                    <span className="fs-ms-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isActive ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="fs-ms-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <div className="fs-ms-accordion-inner">
                          <p>{cap.body}</p>
                          <a href="#how" className="fs-ms-link" style={{ color: 'var(--c)' }}>Explore module</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="fs-ms-display" style={tint(CAPS[activeTab].c)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="fs-ms-display-inner only-visual full-image"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {/* the visual travels with the module (CAPS[].img) rather
                    than being looked up by position */}
                <img
                  src={`/images/${CAPS[activeTab].img}.jpg`}
                  alt={CAPS[activeTab].k}
                  className="fs-ms-full-img"
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
    k: 'Capture', c: 'green', icon: Inbox,
    t: 'The document arrives and codes itself',
    d: 'Invoices and receipts are automatically read and coded to account and dimension before a person sees them.',
    crumb: 'General ledger',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Post', c: 'blue', icon: Send,
    t: 'It posts to the ledger in real time',
    d: 'Journals are written directly to the general ledger as work happens, producing a continuous trial balance.',
    crumb: 'Journal entries',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Control', c: 'violet', icon: ShieldCheck,
    t: 'The controls decide who signs, and when',
    d: 'Matching tolerances and delegation rules instantly route entries to the right person for approval.',
    crumb: 'Approvals',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Automate', c: 'orange', icon: RefreshCw,
    t: 'Rules run while the office is closed',
    d: 'Reconciliation and revaluation run against live balances on schedule without manual intervention.',
    crumb: 'Automations',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Close', c: 'rose', icon: FileCheck2,
    t: 'The period closes on day three',
    d: 'With live ledgers and nightly reconciliations, the month-end close becomes a simple administrative lock.',
    crumb: 'Period close',
    img: '/images/close_step.jpg',
  },
];

export const HowItWorks = () => {
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

        <div className="fs-how-split" style={{ marginTop: '4rem' }}>
          
          <motion.div 
            className="fs-how-tall-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/images/automate_step.jpg" alt="How it works" className="fs-how-tall-img" />
            <div className="fs-how-tall-overlay" />
            <div className="fs-how-tall-content">
              <h3>Five seamless moves</h3>
              <p>Watch how a single document flows through the entire system without ever leaving the ledger.</p>
            </div>
          </motion.div>

          <div className="fs-how-features-wrapper">
            <div className="fs-ms-features-grid fs-grid-2-col">
              {STEPS.map((st, idx) => (
                <motion.div
                  key={st.k}
                  className="fs-ms-feature-card"
                  style={tint(st.c)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <div className="fs-ms-feature-top">
                    <div className="fs-ms-feature-icon">
                      <st.icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="fs-ms-feature-name">{st.k}</span>
                  </div>
                  <div className="fs-ms-feature-header">
                    <div className="fs-ms-feature-bar" />
                    <h3 className="fs-ms-feature-title">{st.t}</h3>
                  </div>
                  <p className="fs-ms-feature-desc">{st.d}</p>
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

// Right Side Consumer Nodes with Google-style Geometric Vector Illustrations
const CONSUMERS = [
  {
    name: 'Power BI / Tableau',
    col: '#34A853',
    offset: { top: '-20px', left: '0' },
    illustration: (
      <svg viewBox="0 0 100 60" width="100%" height="80" style={{ padding: '10px' }}>
        <circle cx="30" cy="30" r="15" fill="#f1f3f4" />
        <path d="M30 30 L30 15 A15 15 0 0 1 45 30 Z" fill="#EA4335" />
        <rect x="60" y="25" width="8" height="20" rx="2" fill="#4285F4" />
        <rect x="72" y="15" width="8" height="30" rx="2" fill="#34A853" />
        <rect x="84" y="30" width="8" height="15" rx="2" fill="#FBBC04" />
      </svg>
    )
  },
  {
    name: 'ZATCA clearance',
    col: '#4285F4',
    offset: { top: '20px', left: '30px' },
    illustration: (
      <svg viewBox="0 0 100 60" width="100%" height="80" style={{ padding: '10px' }}>
        <rect x="35" y="5" width="30" height="45" rx="3" fill="#f8f9fa" stroke="#e8eaed" strokeWidth="2" />
        <circle cx="50" cy="27" r="10" fill="#34A853" />
        <path d="M46 27 L49 30 L55 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="42" x2="60" y2="42" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Board reporting',
    col: '#EA4335',
    offset: { top: '0px', left: '-10px' },
    illustration: (
      <svg viewBox="0 0 100 60" width="100%" height="80" style={{ padding: '10px' }}>
        <rect x="10" y="10" width="80" height="40" rx="4" fill="#f1f3f4" />
        <polyline points="15,40 35,20 55,30 85,15" fill="none" stroke="#EA4335" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Tax authority filing',
    col: '#FBBC04',
    offset: { top: '25px', left: '20px' },
    illustration: (
      <svg viewBox="0 0 100 60" width="100%" height="80" style={{ padding: '10px' }}>
        <rect x="30" y="5" width="40" height="50" fill="#fff" stroke="#e8eaed" strokeWidth="2" />
        <line x1="36" y1="15" x2="64" y2="15" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="25" x2="55" y2="25" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="35" x2="60" y2="35" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="45" x2="64" y2="45" stroke="#FBBC04" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Auditor portal',
    col: '#34A853',
    offset: { top: '-15px', left: '-20px' },
    illustration: (
      <svg viewBox="0 0 100 60" width="100%" height="80" style={{ padding: '10px' }}>
        <rect x="10" y="10" width="80" height="40" rx="2" fill="#fff" stroke="#e8eaed" strokeWidth="2" />
        <rect x="10" y="10" width="80" height="12" fill="#f8f9fa" />
        <circle cx="18" cy="30" r="3" fill="#4285F4" />
        <line x1="28" y1="30" x2="80" y2="30" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="42" r="3" fill="#34A853" />
        <line x1="28" y1="42" x2="60" y2="42" stroke="#dadce0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
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
              {CONSUMERS.map((item, i) => {
                const targetY = (2 - i) * 100; 
                
                return (
                  <Reveal className="fs-google-right-node" key={item.name} delay={0.3 + i * 0.1} style={{ transform: `translate(${item.offset.left}, ${item.offset.top})` }}>
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
                    
                    <div className="fs-google-right-content">
                      <div className="fs-google-node-header">
                        <span className="fs-google-node-dots" />
                        <span className="fs-google-node-dots" />
                      </div>
                      <div className="fs-google-node-body" style={{ flexDirection: 'column', alignItems: 'center' }}>
                        {item.illustration}
                        <span style={{ padding: '0 0 10px 0', fontSize: '13px', fontWeight: 600 }}>{item.name}</span>
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
  green: '#0a8f5e',
  wash: 'rgba(10, 143, 94, 0.09)',
  stop: '#e11d48',
};

const Dia = ({ span, h, children }) => (
  <svg
    className="fs-sec-dia"
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
    <section className="fs-sec-new" id="security">
      <div className="fs-in">
        <Head
          n="06"
          label="Security & controls"
          ask="Can we trust it?"
          title="Every field that changes"
          accent="leaves a record."
          lede="Controls here are system behaviour, not a policy document. Emvive Finance is built on immutable ledgers with strict role-based access."
        />

        <div className="fs-sec-grid-6">
          {SEC_CARDS.map((card, i) => (
            <Reveal className="fs-sec-card-clean" style={{ gridColumn: `span ${card.span}` }} key={card.title} delay={i * 0.06}>
              <div className="fs-sec-card-text-clean">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
              <div className="fs-sec-card-graphic-clean">
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

/* the ruler the two bars are measured against — each tick sits at the
   same scale the bars are drawn on, so day 19 on the ruler is the end
   of the 19-day bar underneath it */
const RULER = [1, 5, 10, 15, 20, 25, 31];

const STATS = [
  { icon: Clock, value: '3', suffix: ' days', label: 'To close' },
  { icon: Layers, value: '42', suffix: '%', label: 'Less manual work' },
  { icon: Users, value: '7', suffix: '', label: 'Entities consolidated' },
  { icon: ShieldCheck, value: '99.8', suffix: '%', label: 'First-pass clearance' },
];

const QUOTES = [
  'Sub-ledgers post in real time and reconciliations run nightly, so period end reviews work that is already done.',
  'ZATCA Phase 2, Arabic presentation, multi-currency groups and data held in Saudi Arabia, UAE or India.',
  'A closed period rejects a posting. Approval limits and duty segregation are enforced by the ledger, not by memo.',
];

/* ---------------------------------------------------------------
   The close card and the four figures are used by both variants of
   section 07 below, so they are written once here. Copying the markup
   into the second variant would mean every future change to the close
   card had to be made twice, and the two would drift.
   --------------------------------------------------------------- */
const CloseCard = () => (
  <Reveal className="fs-close" y={22}>
    <div className="fs-close-top">
      <span className="fs-close-k">THE MONTH-END CLOSE</span>
      <span className="fs-close-sub">Working days after period end</span>
    </div>

    <div className="fs-close-ruler">
      <span className="fs-close-ruler-track">
        {RULER.map((d) => (
          <i key={d} style={{ left: pct(d) }}>{d}</i>
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
);

const StatsBand = ({ className = '' }) => (
  <div className={`fs-stats-grid ${className}`}>
    {STATS.map((s, i) => (
      <Reveal className="fs-stat-item" key={s.label} delay={i * 0.08}>
        <div className="fs-stat-icon">
          <s.icon size={24} strokeWidth={2} />
        </div>
        <div className="fs-stat-value">
          <b>{s.value}<span>{s.suffix}</span></b>
          <p>{s.label}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

export const WhyEmvive = () => (
  <section className="fs-why" id="impact">
    <div className="fs-in">
      <Head
        n="07"
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — seven legal entities, three currencies — twelve months after go-live. Measured in working days after period end."
      />
      {/* one rounded panel, split: the close card and the figures on a
          grey ground, the photograph filling the other half, and the
          three quotes lying across the seam between them */}
      <div className="fs-why-panel">
        <div className="fs-why-panel-left">
          <CloseCard />
          <StatsBand />
        </div>

        <div className="fs-why-panel-photo">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=900"
            alt="Finance professional"
            className="fs-quotes-bg-img"
          />
        </div>

        <div className="fs-quotes-overlay">
          {QUOTES.map((q, i) => (
            <Reveal className="fs-quote-card" key={i} delay={0.1 + i * 0.1}>
              <span className="fs-quote-mark">❝</span>
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
  <section className="fs-why fs-why-wide" id="impact-wide">
    <div className="fs-in">
      <Head
        n="07b"
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — seven legal entities, three currencies — twelve months after go-live. Measured in working days after period end."
      />

      <div className="fs-why-panel fs-why-panel-wide">
        <CloseCard />
        <StatsBand className="fs-stats-row" />
      </div>
    </div>
  </section>
);
