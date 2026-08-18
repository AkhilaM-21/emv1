import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, PieChart, TrendingUp, FileText, Scale,
  Check, ArrowRight, Clock, ShieldCheck, Landmark, Building2, Users,
  Layers, Lock, Database, RefreshCw, FileCheck2, GitBranch, Banknote,
  ChartPie, Percent, Globe, Play, Pause, Inbox, Send, User, X,
  /* the builder's own icons — the list above arrived with the file when
     it was copied from Finance, and a receipt is the wrong mark for a
     form builder */
  LayoutGrid, FileStack, Menu, Code2, Workflow, BadgeCheck, CalendarClock, Webhook,
} from 'lucide-react';
import {
  motion, Reveal, MaskText, useLive, EASE, useInView, useReducedMotion,
} from '../shared/motion';
import { Spotlight, ScrollNumber } from '../shared/stage';
import { Spark, LiveBars, Ring } from '../shared/viz';
import {
  Toolbar, LedgerTable, ApprovalPanel, StatementPanel,
} from './PlatformApp';
import './PlatformStory.css';

/* =====================================================================
   EMVIVE PLATFORM & BUILDER — THE PAGE AFTER THE HERO

   Seven sections, each answering one question a buyer actually asks, in
   the order they ask it:

     02  Product & capabilities   what can it do?  (the eleven)
     03  How it works             how does it work?
     04  Automation               what can it automate?
     05  Integrations             not rendered on this page
     06  Security & controls      can we trust it?
     07  Why Emvive               why should we choose it?
     08  FAQ + contact            I understand it — let's talk.

   08 is the shared Faq/ContactSection pair and lives in Platform.jsx.

   Every section opens with the same head: its number, its name, and the
   question in the reader's own words. That question is the section's
   brief — if a block on the page is not answering it, the block does
   not belong there.

   Namespace `ps-`.
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
  green: ['#6c4cf1', '108, 76, 241'],
  violet: ['#9333ea', '147, 51, 234'],
  blue: ['#2563eb', '37, 99, 235'],
  orange: ['#e2601f', '226, 96, 31'],
  teal: ['#0d9488', '13, 148, 136'],
  purple: ['#c026d3', '192, 38, 211'],
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
    <div className="ps-film" style={tone}>
      <video ref={ref} src={src} muted loop playsInline preload="metadata" aria-label={label} />
      <span className="ps-film-wash" aria-hidden="true" />
    </div>
  );
};

/* ---------------------------------------------------------------
   The section head, used by all six sections below.
   --------------------------------------------------------------- */
const Head = ({ n, label, ask, title, accent, lede, tone = '' }) => (
  <div className={`ps-head ${tone}`}>
    <Reveal duration={0.7}>
      <span className="ps-eyebrow">
        <i aria-hidden="true" />
        {label}
      </span>
    </Reveal>

    <MaskText text={title} accent={accent} as="h2" className="ps-h2" />

    {ask && (
      <Reveal delay={0.14} y={12}>
        <p className="ps-ask">{ask}</p>
      </Reveal>
    )}

    {lede && <Reveal delay={0.2} y={14}><p className="ps-lede">{lede}</p></Reveal>}
  </div>
);

/* =====================================================================
   02 — PRODUCT & CAPABILITIES
   "What can it do?"

   The eleven capabilities the product is made of, in the three groups
   it ships in — a) App Builder, b) Workflow & Automation, c) Reporting
   & Analysis. Each carries its group in `stat`, so the grid and the
   accordion below both read the same list. A list the reader drives,
   rather than eleven cards to compare by eye.
   ===================================================================== */
const CAPS = [
  {
    k: 'Form Builder', c: 'violet', icon: LayoutGrid,
    line: 'Drag and drop the form the process actually needs.',
    body: 'Fields, sections, tabs and conditional rules placed by hand. Validation and required fields are set where you place them, not in a config file somewhere else.',
    points: ['Drag-and-drop field placement', 'Sections, tabs and conditional visibility', 'Validation and required rules at the field', 'Responsive by default, mobile build included', 'What you place is what ships'],
    stat: ['a.1', 'App Builder'],
  },
  {
    k: 'Object Builder', c: 'blue', icon: Database,
    line: 'Tables, fields and the relationships between them.',
    body: 'Define the object the form writes to — its columns, its types and its links to other objects. Row-level access is inherited from the record rather than re-granted per screen.',
    points: ['Tables, columns and data types', 'Relationships between objects', 'Computed fields and defaults', 'Row-level access inherited', 'Import from spreadsheet or existing table'],
    stat: ['a.2', 'App Builder'],
  },
  {
    k: 'Document Sequence Designer', c: 'green', icon: FileStack,
    line: 'Numbering, and the documents a process issues.',
    body: 'Prefixes, running numbers, per-entity and per-year sequences, and the document each step of the process produces — designed once and applied everywhere it is used.',
    points: ['Prefixes and running numbers', 'Per-entity and per-year sequences', 'Document templates per step', 'Reset rules and gap control', 'Applied everywhere the object is used'],
    stat: ['a.3', 'App Builder'],
  },
  {
    k: 'Navigation Designer', c: 'teal', icon: Menu,
    line: 'Menus, roles and what each person sees.',
    body: 'Build the navigation the application ships with, and decide by role which parts of it exist for whom. One definition covers both the web app and the mobile build.',
    points: ['Menus, groups and ordering', 'Visibility by role', 'Landing screen per role', 'One definition for web and mobile', 'Deep links into any record'],
    stat: ['a.4', 'App Builder'],
  },
  {
    k: 'Functions Designer', c: 'cyan', icon: Code2,
    line: 'Code where you want it, not everywhere.',
    body: 'Low-code is the default, not the ceiling. Write a function against the same objects when a rule is genuinely too specific to place, and call it from a form or from a flow.',
    points: ['Functions against the same objects', 'Called from a form or a flow', 'Versioned with the workspace', 'Runs server-side with the caller access', 'Nothing you write by hand is second class'],
    stat: ['a.5', 'App Builder'],
  },
  {
    k: 'Workflow', c: 'orange', icon: GitBranch,
    line: 'The states a record moves through.',
    body: 'Draft, submitted, approved, closed — the states a record can be in, who can move it between them, and what has to be true before it moves.',
    points: ['States and transitions per object', 'Who can move a record, and when', 'Entry and exit conditions', 'Status history on every record', 'Reopen rules that leave a trail'],
    stat: ['b.1', 'Workflow'],
  },
  {
    k: 'Flow Designer', c: 'purple', icon: Workflow,
    line: 'Triggers, conditions and actions on one canvas.',
    body: 'Fire on a record change, on a schedule, or on an inbound call. Branch on conditions, loop over lines, call out and carry on — with every run traced step by step.',
    points: ['Triggers on record, schedule or webhook', 'Conditions, branches and loops', 'Actions on any object', 'Calls out to your own services', 'Every run traced step by step'],
    stat: ['b.2', 'Workflow'],
  },
  {
    k: 'Approval', c: 'rose', icon: BadgeCheck,
    line: 'Limits, delegation and a way back.',
    body: 'Route by value, category, site or grade, with out-of-office delegation that does not quietly skip a step, and a rejection that returns the record with its reason attached.',
    points: ['Limits by value, category, site and grade', 'Multi-step and parallel approval', 'Delegation and out-of-office routing', 'Rejection returns the reason', 'Full approval history on the record'],
    stat: ['b.3', 'Workflow'],
  },
  {
    k: 'Schedule Workflow', c: 'blue', icon: CalendarClock,
    line: 'The work that should happen while nobody is watching.',
    body: 'Nightly, hourly, or on a schedule of your own. Reminders, escalations, batch updates and recurring documents run against live records without anybody starting them.',
    points: ['Nightly, hourly or custom schedules', 'Reminders and escalations', 'Batch updates over a filter', 'Recurring document creation', 'Run history with failures surfaced'],
    stat: ['b.4', 'Workflow'],
  },
  {
    k: 'API & Webhooks', c: 'green', icon: Webhook,
    line: 'Every object is an API the moment it exists.',
    body: 'REST endpoints on everything you build, webhooks pushed out on change, and inbound calls that can start a flow. There is no integration project to make an application reachable.',
    points: ['REST endpoints on every object', 'Webhooks pushed on change', 'Inbound calls that start a flow', 'Keys, secrets and scopes held centrally', 'Rate limits and call logs'],
    stat: ['b.5', 'Workflow'],
  },
  {
    k: 'Reports & Dashboards', c: 'violet', icon: ChartPie,
    line: 'The numbers come back out of the same records.',
    body: 'Reports and dashboards built on the objects the applications write to, so a figure in a board pack and a figure on a screen are the same record read twice — not two systems disagreeing.',
    points: ['Report builder on live objects', 'Dashboards with drill-down to the record', 'Saved views shared with a team', 'Scheduled distribution to the people who need it', 'Export to spreadsheet or PDF, access rules intact'],
    stat: ['c', 'Reporting'],
  },
];

export const CapabilitiesGrid = () => {
  return (
    <section className="ps-caps" id="capabilities-grid">
      <div className="ps-in">
        <Head
          n="02b"
          label="Product & capabilities (Grid)"
          title="Eleven capabilities."
          accent="One object model underneath."
          lede="Nothing here is a separate tool with its own database. The builder, the workflow engine and the reporting all read and write the same objects, so what one of them knows, all of them know."
        />

        <div className="ps-caps-body ps-folder-grid">
          {CAPS.map((cap, idx) => (
            <motion.div 
              key={cap.k} 
              className="ps-folder-card" 
              style={tint(cap.c)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <div className="ps-folder-tab">
                {cap.k}
              </div>
              <div className="ps-folder-body">
                <div className="ps-folder-icon">
                  <cap.icon size={48} strokeWidth={1.2} />
                </div>
                <div className="ps-folder-divider" />
                <div className="ps-folder-text">
                  <ul className="ps-folder-points">
                    {cap.points.slice(0, 5).map((pt, i) => (
                      <li key={i} style={{ '--i': i }}>
                        <span className="ps-folder-bullet"></span>
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
    <section className="ps-caps" id="capabilities">
      <div className="ps-in">
        <Head
          n="02"
          label="Product & capabilities"
          title="Eleven capabilities."
          accent="One object model underneath."
          lede="Nothing here is a separate tool with its own database. The builder, the workflow engine and the reporting all read and write the same objects, so what one of them knows, all of them know."
        />

        <div className="ps-ms-layout" style={{ marginTop: '3rem' }}>
          <div className="ps-ms-accordion">
            {CAPS.map((cap, idx) => {
              const isActive = idx === activeTab;
              return (
                <div 
                  key={cap.k} 
                  className={`ps-ms-accordion-item ${isActive ? 'active' : ''}`}
                  style={tint(cap.c)}
                >
                  <button 
                    className="ps-ms-accordion-header"
                    onClick={() => setActiveTab(idx)}
                    aria-expanded={isActive}
                  >
                    <div className="ps-ms-accordion-title-wrap">
                      <cap.icon size={20} strokeWidth={2.2} className="ps-ms-accordion-icon" />
                      <span className="ps-ms-accordion-title">
                        {cap.k}
                      </span>
                    </div>
                    <span className="ps-ms-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isActive ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        className="ps-ms-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <div className="ps-ms-accordion-inner">
                          <p>{cap.body}</p>
                          <a href="#how" className="ps-ms-link" style={{ color: 'var(--c)' }}>Explore module</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="ps-ms-display" style={tint(CAPS[activeTab].c)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="ps-ms-display-inner only-visual full-image"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <img 
                  src={`/images/${['capture_step', 'post_step', 'control_step', 'automate_step', 'close_step', 'capture_step', 'post_step', 'control_step'][activeTab]}.jpg`} 
                  alt={CAPS[activeTab].k} 
                  className="ps-ms-full-img" 
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
/* the order somebody actually builds in — the five moves that turn a
   requirement into something people are using */
const STEPS = [
  {
    k: 'Model', c: 'blue', icon: Database,
    t: 'Define the object the work lives on',
    d: 'Tables, fields and the relationships between them. The data model comes first because everything below reads and writes it.',
    crumb: 'Object builder',
    img: '/images/capture_step.jpg',
  },
  {
    k: 'Design', c: 'violet', icon: LayoutGrid,
    t: 'Place the form, the documents and the menu',
    d: 'Drag the fields into the shape the process needs, set the document numbering, and decide what each role finds in the navigation.',
    crumb: 'Form builder',
    img: '/images/post_step.jpg',
  },
  {
    k: 'Automate', c: 'orange', icon: Workflow,
    t: 'Put the process behind the screen',
    d: 'States the record moves through, a flow that fires on change or on a schedule, and the approvals that have to clear before it moves.',
    crumb: 'Flow designer',
    img: '/images/automate_step.jpg',
  },
  {
    k: 'Connect', c: 'green', icon: Webhook,
    t: 'Wire it to everything else you run',
    d: 'Every object is a REST endpoint the moment it exists, webhooks push on change, and an inbound call can start a flow.',
    crumb: 'API & webhooks',
    img: '/images/control_step.jpg',
  },
  {
    k: 'Report', c: 'purple', icon: ChartPie,
    t: 'Read the numbers back off the same records',
    d: 'Reports and dashboards on the objects the application writes to, drilling from any figure down to the records that produced it.',
    crumb: 'Reporting',
    img: '/images/close_step.jpg',
  },
];

export const HowItWorks = () => {
  return (
    <section className="ps-how" id="how">
      <div className="ps-in">
        <Head
          n="03"
          label="How it works"
          title="From a requirement to something"
          accent="people are using."
          lede="The same object travels the whole way. Nothing is re-keyed, re-exported or reconciled against a second system — each step below is the one screen where that move actually happens."
        />

        <div className="ps-how-split" style={{ marginTop: '4rem' }}>
          
          <motion.div 
            className="ps-how-tall-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/images/automate_step.jpg" alt="How it works" className="ps-how-tall-img" />
            <div className="ps-how-tall-overlay" />
            <div className="ps-how-tall-content">
              <h3>Five seamless moves</h3>
              <p>Watch a requirement become an object, a form, a process and a report without leaving the workspace.</p>
            </div>
          </motion.div>

          <div className="ps-how-features-wrapper">
            <div className="ps-ms-features-grid ps-grid-2-col">
              {STEPS.map((st, idx) => (
                <motion.div
                  key={st.k}
                  className="ps-ms-feature-card"
                  style={tint(st.c)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <div className="ps-ms-feature-top">
                    <div className="ps-ms-feature-icon">
                      <st.icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="ps-ms-feature-name">{st.k}</span>
                  </div>
                  <div className="ps-ms-feature-header">
                    <div className="ps-ms-feature-bar" />
                    <h3 className="ps-ms-feature-title">{st.t}</h3>
                  </div>
                  <p className="ps-ms-feature-desc">{st.d}</p>
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
/* the three groups the product is made of, as tabs */
const AUTOMATION_TABS = [
  {
    id: 'app-builder',
    label: 'App Builder',
    items: [
      { name: 'Form builder — drag and drop' },
      { name: 'Object builder — tables' },
      { name: 'Document sequence designer' },
      { name: 'Navigation designer' },
      { name: 'Functions designer — code' },
    ]
  },
  {
    id: 'workflow-automation',
    label: 'Workflow & Automation',
    items: [
      { name: 'Workflow' },
      { name: 'Flow designer' },
      { name: 'Approval' },
      { name: 'Schedule workflow' },
      { name: 'API / webhooks' },
    ]
  },
  {
    id: 'reporting',
    label: 'Reporting & Analysis',
    items: [
      { name: 'Report builder' },
      { name: 'Dashboards with drill-down' },
      { name: 'Saved views' },
      { name: 'Scheduled distribution' },
      { name: 'Export & API access' },
    ]
  }
];

export const Automation = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="ps-auto" id="automation">
      <div className="ps-in">
        <Head
          n="04"
          label="Automation"
          title="The routine work stops"
          accent="reaching a person."
          lede="Flows run against live records on a schedule or on an event. What lands in somebody's queue is the exception — never the whole population."
        />

        <div className="ps-auto-card">
          <div className="ps-auto-left">
            <h2>Our Offerings</h2>
            <p>We help enterprises pursue a path of smart transformation</p>
            
            <div className="ps-auto-tabs">
              {AUTOMATION_TABS.map((tab, i) => (
                <button 
                  key={tab.id}
                  className={`ps-auto-tab ${activeTab === i ? 'on' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="ps-auto-right">
            <div className="ps-auto-hero">
              <img src="/abstract.png" alt="Automation Abstract" />
            </div>
            
            <div className="ps-auto-grid">
              {AUTOMATION_TABS[activeTab].items.map((item, i) => (
                <div className="ps-auto-item" key={i}>
                  <span className="ps-auto-item-n">0{i + 1}. {item.name}</span>
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
    <section className="ps-int" id="integrations" ref={ref}>
      <div className="ps-in">
        <Head
          n="05"
          label="Integrations"
          title="One ledger, wired to"
          accent="everything else."
          lede="Emvive Platform is the accounting core, not an island. What posts into it and what reads out of it are both live connections — no exports, no overnight file drops nobody owns."
        />

        <div className="ps-google-wrapper">
          <div className="ps-google-grid">
            
            {/* LEFT COLUMN: Bank Feeds (Geometric Nodes) */}
            <div className="ps-google-col left">
              {SOURCES.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                const gColors = ['#FBBC04', '#34A853', '#EA4335', '#4285F4', '#FBBC04'];
                const color = gColors[i % gColors.length];
                
                return (
                  <Reveal className="ps-google-left-node" key={name} delay={i * 0.1}>
                    <div className="ps-google-left-content">
                      <div className="ps-google-icon-box" style={{ borderBottomColor: color }}>
                        <Icon size={18} strokeWidth={2.5} color="#5f6368" />
                      </div>
                      <span className="ps-google-label">{name}</span>
                    </div>
                    
                    {/* SVG Line: Thin -> Circle -> Thick -> Dotted Curve */}
                    <svg width="300" height="2" className="ps-google-svg left-svg">
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
            <div className="ps-google-col center">
              <Reveal className="ps-google-center-card" delay={0.2}>
                <div className="ps-google-center-logo">
                  <span style={{ fontSize: 64, fontWeight: 'bold', color: '#fff', fontFamily: 'Inter, sans-serif' }}>E</span>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Dashboard UI Cards */}
            <div className="ps-google-col right">
              {CONSUMERS.map(([Icon, name, state, col, meta], i) => {
                const targetY = (2 - i) * 100; 
                
                return (
                  <Reveal className="ps-google-right-node" key={name} delay={0.3 + i * 0.1}>
                    {/* SVG Line: Geometric elbows & zigzags */}
                    <svg width="300" height="2" className="ps-google-svg right-svg">
                      {i === 2 ? (
                        // Special zigzag for the middle one to match ref
                        <polyline points={`300,0 260,-15 220,15 180,-15 140,15 100,-15 60,15 0,${targetY}`} fill="none" stroke="#34A853" strokeWidth="3" />
                      ) : (
                        // Standard elbow lines for others
                        <path d={`M 300 0 L 150 0 L 150 ${targetY} L 0 ${targetY}`} fill="none" stroke="#4285F4" strokeWidth="2" strokeDasharray={i % 2 === 0 ? "none" : "6 4"} />
                      )}
                    </svg>

                    <div className="ps-google-dash-card">
                      <div className="ps-google-dash-header">
                        <div className="dash-dot"></div>
                        <div className="dash-dot"></div>
                      </div>
                      <div className="ps-google-dash-body">
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
    title: 'Role-Based Access',
    desc: 'Access is inherited from the record, not re-granted per screen. A builder cannot widen what they can already see.',
    span: 2
  },
  {
    id: 'audit',
    title: 'Versioned Workspaces',
    desc: 'Every change has an author, a diff and a reason. Compare any two releases.',
    span: 2
  },
  {
    id: 'locks',
    title: 'Environment Promotion',
    desc: 'Four environments with approval at each gate, and a rollback that works.',
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
  green: '#6c4cf1',
  wash: 'rgba(108, 76, 241, 0.09)',
  stop: '#e11d48',
};

const Dia = ({ span, h, children }) => (
  <svg
    className="ps-sec-dia"
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
  /* access comes from the record, so building a screen onto an object
     cannot widen what the builder was already allowed to see */
  if (id === 'duties') {
    const rows = [
      { i: 'FM', n: 'F. Al-Mutairi', d: 'built the screen', state: 'was' },
      { i: 'FM', n: 'Sees site 4 records', d: 'the access he already had', state: 'ok' },
      { i: 'FM', n: 'Cannot see site 9', d: 'building it grants nothing new', state: 'no' },
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

  /* every workspace change keeps its before as well as its after */
  if (id === 'audit') {
    const rows = [
      ['v1.4', 'field', 'optional', 'required'],
      ['v1.5', 'approver', '—', 'Site lead'],
      ['v1.6', 'status', 'draft', 'published'],
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
    const months = [['Dev', false], ['Test', false], ['Prod', true]];
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
        <text x="84" y="112" fontSize="9.5" fontWeight="600" fill={D.ink}>promotion needs sign-off</text>
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
    <section className="ps-sec-new" id="security">
      <div className="ps-in">
        <Head
          n="06"
          label="Security & controls"
          ask="Can we trust it?"
          title="Built by anyone,"
          accent="governed like everything else."
          lede="Controls here are system behaviour, not a policy document. What a department builds on a Friday afternoon is still something IT is happy to own on Monday."
        />

        <div className="ps-sec-grid-6">
          {SEC_CARDS.map((card, i) => (
            <Reveal className="ps-sec-card-clean" style={{ gridColumn: `span ${card.span}` }} key={card.title} delay={i * 0.06}>
              <div className="ps-sec-card-text-clean">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
              <div className="ps-sec-card-graphic-clean">
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

   The close is the number platform is judged on, so it is drawn against
   the month it has to fit inside rather than shown as an oversized
   numeral. Everything else sits underneath at a size that lets the
   close keep the stage.
   ===================================================================== */
/* the number this product is judged on: how long a requirement waits
   before somebody is using it */
const CLOSE = [
  { k: 'Custom development', days: 96, tone: 'was', note: 'A quote in months and a place in the backlog' },
  { k: 'With Emvive', days: 9, tone: 'now', note: 'Built by the team that owns the process' },
];

const DAYS = 120;
const pct = (d) => `${(d / DAYS) * 100}%`;

/* the ruler the two bars are measured against — each tick sits at the
   same scale the bars are drawn on */
const RULER = [0, 20, 40, 60, 80, 100, 120];

const STATS = [
  { icon: Clock, value: '9', suffix: ' days', label: 'Brief to first live user' },
  { icon: Layers, value: '1,240', suffix: '+', label: 'Applications in production' },
  { icon: Users, value: '38,000', suffix: '', label: 'People using them' },
  { icon: ShieldCheck, value: '99.98', suffix: '%', label: 'Platform availability' },
];

const QUOTES = [
  'The team that owns the process builds it, and changes it the afternoon the rule changes.',
  'Every object is an API the moment it exists, so there is no integration project to make an application reachable.',
  'Versioned workspaces, environment promotion and an audit trail of every change — IT reviews the platform, not every app on it.',
];

/* ---------------------------------------------------------------
   The close card and the four figures are used by both variants of
   section 07 below, so they are written once here. Copying the markup
   into the second variant would mean every future change to the close
   card had to be made twice, and the two would drift.
   --------------------------------------------------------------- */
const CloseCard = () => (
  <Reveal className="ps-close" y={22}>
    <div className="ps-close-top">
      <span className="ps-close-k">THE MONTH-END CLOSE</span>
      <span className="ps-close-sub">Working days after period end</span>
    </div>

    <div className="ps-close-ruler">
      <span className="ps-close-ruler-track">
        {RULER.map((d) => (
          <i key={d} style={{ left: pct(d) }}>{d}</i>
        ))}
      </span>
    </div>

    {CLOSE.map((c, i) => (
      <div className={`ps-close-row ${c.tone}`} key={c.k}>
        <span className="ps-close-label">
          <b>{c.k}</b>
          <em>{c.note}</em>
        </span>

        <span className="ps-close-track">
          <motion.i
            style={{ width: pct(c.days) }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05, delay: 0.25 + i * 0.2, ease: EASE }}
          />
        </span>

        <span className="ps-close-days"><b>{c.days}</b> days</span>
      </div>
    ))}

    <div className="ps-close-delta">
      <span className="ps-close-gap" style={{ marginLeft: pct(3), width: pct(16) }}><i /></span>
      <span className="ps-close-claim">
        <b><ScrollNumber to={16} prefix="−" /> days</b>
        returned to the team, every month
      </span>
    </div>
  </Reveal>
);

const StatsBand = ({ className = '' }) => (
  <div className={`ps-stats-grid ${className}`}>
    {STATS.map((s, i) => (
      <Reveal className="ps-stat-item" key={s.label} delay={i * 0.08}>
        <div className="ps-stat-icon">
          <s.icon size={24} strokeWidth={2} />
        </div>
        <div className="ps-stat-value">
          <b>{s.value}<span>{s.suffix}</span></b>
          <p>{s.label}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

export const WhyEmvive = () => (
  <section className="ps-why" id="impact">
    <div className="ps-in">
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
      <div className="ps-why-panel">
        <div className="ps-why-panel-left">
          <CloseCard />
          <StatsBand />
        </div>

        <div className="ps-why-panel-photo">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=900"
            alt="Platform professional"
            className="ps-quotes-bg-img"
          />
        </div>

        <div className="ps-quotes-overlay">
          {QUOTES.map((q, i) => (
            <Reveal className="ps-quote-card" key={i} delay={0.1 + i * 0.1}>
              <span className="ps-quote-mark">❝</span>
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
  <section className="ps-why ps-why-wide" id="impact-wide">
    <div className="ps-in">
      <Head
        n="07b"
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — seven legal entities, three currencies — twelve months after go-live. Measured in working days after period end."
      />

      <div className="ps-why-panel ps-why-panel-wide">
        <CloseCard />
        <StatsBand className="ps-stats-row" />
      </div>
    </div>
  </section>
);
