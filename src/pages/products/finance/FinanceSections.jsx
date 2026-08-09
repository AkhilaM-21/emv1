import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, PieChart, TrendingUp, FileText,
  Scale, Check, ArrowRight, Zap, Clock, ShieldCheck, Landmark, Building2,
  Users, Globe, Activity, RefreshCw, AlertTriangle, Layers, Lock, Database,
  HelpCircle,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from '../shared/motion';
import { ActRule } from '../shared/stage';
import './FinanceSections.css';

/* =====================================================================
   FINANCE — the narrative sections that sit between the product
   surfaces. Namespace `fx-`.

   These carry the information architecture: what the product is, why it
   exists, what is in it, and what it changes. The interactive product
   screens (the morph, the rail, the architecture diagram) stay exactly
   as they were — these are the connective tissue around them.
   ===================================================================== */

/* ---------------------------------------------------------------
   03 · FINANCE OVERVIEW
   --------------------------------------------------------------- */
const MODULES = [
  ['General ledger', '7 entities'],
  ['Accounts payable', '128 invoices/day'],
  ['Accounts receivable', 'DSO 31 days'],
  ['Cash & treasury', '4 banks'],
  ['Fixed assets', '1,284 assets'],
  ['Expenses', '412 claimants'],
  ['Budgeting', '9 cost centres'],
  ['Tax & e-invoicing', 'ZATCA Phase 2'],
  ['Consolidation', '3 currencies'],
  ['Statutory reporting', 'IFRS'],
];

export const FinanceOverview = () => (
  <section className="fx-over" id="overview">
    <div className="fx-inner">
      <ActRule label="Finance overview" />

      <div className="fx-over-grid">
        <div className="fx-over-copy">
          <MaskText
            text="One ledger for every entity,"
            accent="currency and regulator."
            as="h2"
            className="stg-h2"
          />
          <Reveal delay={0.16} y={16}>
            <p className="fx-lede">
              Emvive Finance is the accounting core of the group, not a reporting layer
              bolted on top of one. Sales, procurement, payroll and inventory post into
              it directly — so the trial balance is produced as work happens rather than
              assembled from extracts at month end.
            </p>
          </Reveal>
          <Reveal delay={0.24} y={16}>
            <p className="fx-body">
              Consolidation, elimination and translation are properties of the same
              ledger. There is no second system to reconcile against, and no window
              during which the numbers are known to be wrong.
            </p>
          </Reveal>
          <Reveal delay={0.3} y={14}>
            <a href="#capabilities" className="fx-link">See what is inside <ArrowRight size={15} /></a>
          </Reveal>
        </div>

        <Reveal className="fx-over-map" delay={0.12} y={24}>
          <div className="fx-map">
            <span className="fx-map-k">What runs on it</span>
            {MODULES.map(([m, meta], i) => (
              <motion.div
                className="fx-map-row"
                key={m}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.045, ease: EASE }}
              >
                <i />
                <b>{m}</b>
                <em>{meta}</em>
              </motion.div>
            ))}
            <div className="fx-map-foot">
              <Layers size={13} strokeWidth={1.8} />
              One data model · one audit trail · one close
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------
   04 · WHY EMVIVE FINANCE
   --------------------------------------------------------------- */
const WHY = [
  {
    icon: Clock,
    problem: 'The close takes three weeks and half of it is chasing.',
    answer: 'Continuous close',
    detail:
      'Sub-ledgers post in real time and reconciliations run nightly, so period end is a review of work already done rather than the work itself.',
    stat: '19 days → 3 days',
  },
  {
    icon: Layers,
    problem: 'Every entity keeps its own version of the truth.',
    answer: 'One ledger, many books',
    detail:
      'Statutory, management and IFRS views come off the same postings. Intercompany matches and eliminates itself instead of being reconciled by email.',
    stat: '7 entities, 1 chart of accounts',
  },
  {
    icon: AlertTriangle,
    problem: 'Controls are a policy document, not a system behaviour.',
    answer: 'Controls that actually stop things',
    detail:
      'Segregation of duties, approval limits and period locks are enforced by the ledger. A closed period rejects a posting; it does not warn and let it through.',
    stat: '0 back-dated entries',
  },
  {
    icon: Activity,
    problem: 'The board pack is a month old the day it is printed.',
    answer: 'Reporting off live balances',
    detail:
      'No warehouse and no nightly export. The dashboard the CFO steers by reads the journals that were posted an hour ago.',
    stat: 'Refreshed in seconds',
  },
];

export const WhyFinance = () => (
  <section className="fx-why" id="why">
    <div className="fx-inner">
      <ActRule label="Why Emvive Finance" />
      <MaskText text="Four things finance teams stop doing." as="h2" className="stg-h2" />

      <div className="fx-why-rows">
        {WHY.map((w, i) => (
          <Reveal className="fx-why-row" key={w.answer} delay={i * 0.06}>
            <span className="fx-why-n">{String(i + 1).padStart(2, '0')}</span>

            <div className="fx-why-problem">
              <span className="fx-why-tag">Today</span>
              <p>{w.problem}</p>
            </div>

            <span className="fx-why-arrow" aria-hidden="true">
              <ArrowRight size={16} strokeWidth={1.8} />
            </span>

            <div className="fx-why-answer">
              <span className="fx-why-ic"><w.icon size={15} strokeWidth={1.8} /></span>
              <h3>{w.answer}</h3>
              <p>{w.detail}</p>
              <span className="fx-why-stat">{w.stat}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------
   05 · CORE FINANCE CAPABILITIES
   Eight modules, one detail panel. A list you drive rather than a
   grid of eight identical cards.
   --------------------------------------------------------------- */
const CAPS = [
  {
    k: 'General Ledger', icon: BookOpen,
    line: 'The single book every other module posts into.',
    body: 'A multi-entity, multi-currency chart of accounts with dimensions instead of endless account codes. Journals arrive from the sub-ledgers already coded, already approved and already matched.',
    points: ['Multi-entity, multi-book, multi-currency', 'Dimensions: cost centre, project, segment, site', 'Automatic FX revaluation and translation', 'Period locks with maker–checker enforcement'],
    stat: ['1.2M', 'journal lines a month'],
  },
  {
    k: 'Accounts Payable', icon: Receipt,
    line: 'Match before you pay, not after.',
    body: 'Supplier invoices arrive by email, portal or EDI and are read, coded and matched three ways against the purchase order and goods receipt. Variances are held rather than nodded through.',
    points: ['Three-way matching with tolerance rules', 'Duplicate and fraud detection on capture', 'Payment runs with bank file generation', 'Supplier self-service for invoice status'],
    stat: ['128', 'invoices a day, 84% touchless'],
  },
  {
    k: 'Accounts Receivable', icon: CreditCard,
    line: 'Shorten the cash cycle without a collections team.',
    body: 'Credit limits are checked before dispatch, not after the debt exists. Reminder sequences fire on their own schedule and escalate by ageing bucket.',
    points: ['Credit limits enforced at order entry', 'Automated dunning by ageing and segment', 'Cash application with bank-feed matching', 'Customer statements and payment portal'],
    stat: ['31 days', 'DSO, down from 40'],
  },
  {
    k: 'Expenses', icon: Wallet,
    line: 'Claims that check themselves against policy.',
    body: 'Receipts are captured on a phone, read on the spot and tested against the grade, category and city rules before anyone is asked to approve them.',
    points: ['Mobile capture with receipt extraction', 'Policy rules by grade, category and location', 'Per-diem and mileage calculators', 'Reimbursement posted through payroll'],
    stat: ['412', 'claimants, 2-day turnaround'],
  },
  {
    k: 'Budgeting', icon: PieChart,
    line: 'A budget the ledger actually enforces.',
    body: 'Budgets are held per dimension and checked at commitment, not at month end. A purchase requisition that would breach its cost centre is stopped where it is raised.',
    points: ['Bottom-up and top-down budget builds', 'Commitment accounting on requisitions', 'Budget-versus-actual on live balances', 'Reforecast cycles with version history'],
    stat: ['9', 'cost centres, monthly reforecast'],
  },
  {
    k: 'Forecasting', icon: TrendingUp,
    line: 'Thirteen weeks of cash you can plan against.',
    body: 'Committed flows from open orders, payables and payroll are combined with expected flows to produce a rolling cash forecast that updates as the underlying documents change.',
    points: ['13-week rolling cash forecast', 'Scenario modelling on collection assumptions', 'Bank position across four institutions', 'Variance tracking against last forecast'],
    stat: ['13 weeks', 'rolling, updated daily'],
  },
  {
    k: 'Reporting', icon: FileText,
    line: 'The statutory pack as a view, not a project.',
    body: 'Elimination, translation and consolidation have already run. P&L, balance sheet, cash flow and the notes are produced from the same postings the operational dashboards read.',
    points: ['IFRS and local GAAP presentations', 'Consolidated and entity-level statements', 'Drill from any figure to its journal', 'Scheduled distribution to the board pack'],
    stat: ['3', 'currencies consolidated'],
  },
  {
    k: 'Reconciliation', icon: Scale,
    line: 'Reconciled overnight, reviewed in the morning.',
    body: 'Bank feeds, intercompany balances and control accounts are matched by rule every night. What reaches a person is the exception list, not the whole population.',
    points: ['Daily bank-feed reconciliation', 'Intercompany auto-matching and elimination', 'Control account and sub-ledger tie-outs', 'Exception queue with ageing and owner'],
    stat: ['96%', 'matched without a human'],
  },
];

export const CoreCapabilities = () => {
  const [i, setI] = useState(0);
  const c = CAPS[i];

  return (
    <section className="fx-caps" id="capabilities">
      <div className="fx-inner">
        <ActRule label="Core finance capabilities" />
        <MaskText text="Eight modules. One ledger underneath." as="h2" className="stg-h2" />
        <Reveal delay={0.16} y={14}>
          <p className="fx-lede">
            Nothing here is a separate product with its own database. Every module writes
            to the same journals and inherits the same controls.
          </p>
        </Reveal>

        <div className="fx-caps-body">
          <div className="fx-caps-list" role="tablist" aria-label="Finance capabilities">
            {CAPS.map((cap, idx) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === idx}
                key={cap.k}
                className={`fx-cap ${i === idx ? 'on' : ''}`}
                onMouseEnter={() => setI(idx)}
                onFocus={() => setI(idx)}
                onClick={() => setI(idx)}
              >
                <span className="fx-cap-ic"><cap.icon size={15} strokeWidth={1.8} /></span>
                <span className="fx-cap-t">
                  <b>{cap.k}</b>
                  <em>{cap.line}</em>
                </span>
                <span className="fx-cap-n">{String(idx + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="fx-caps-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={c.k}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="fx-panel-head">
                  <span className="fx-panel-ic"><c.icon size={19} strokeWidth={1.7} /></span>
                  <div>
                    <h3>{c.k}</h3>
                    <span>{c.line}</span>
                  </div>
                </div>

                <p className="fx-panel-body">{c.body}</p>

                <ul className="fx-panel-points">
                  {c.points.map((p) => (
                    <li key={p}><Check size={12} strokeWidth={3} />{p}</li>
                  ))}
                </ul>

                <div className="fx-panel-stat">
                  <b>{c.stat[0]}</b>
                  <span>{c.stat[1]}</span>
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
   07 · FINANCE AUTOMATION
   --------------------------------------------------------------- */
const RULES = [
  { name: 'Bank feed reconciliation', when: 'Every night · 02:00', did: '412 lines matched', rate: 96 },
  { name: 'Three-way invoice match', when: 'On invoice capture', did: '108 of 128 cleared', rate: 84 },
  { name: 'FX revaluation', when: 'Month end · open items', did: 'AED, QAR posted', rate: 100 },
  { name: 'Depreciation run', when: 'Monthly · 1,284 assets', did: 'Journal 4412 posted', rate: 100 },
  { name: 'Dunning escalation', when: 'Ageing crosses 30 days', did: '46 reminders sent', rate: 91 },
  { name: 'Intercompany elimination', when: 'On consolidation', did: '18 pairs matched', rate: 98 },
];

export const FinanceAutomation = () => {
  const [live] = useLive(
    { n: 0, touchless: 84.2, saved: 1284 },
    (s) => ({
      n: s.n + 1,
      touchless: 84.2 + Math.sin(s.n * 1.1) * 0.6,
      saved: 1284 + Math.round(Math.sin(s.n * 0.8) * 18),
    }),
    3200
  );

  return (
    <section className="fx-auto" id="automation">
      <div className="fx-inner">
        <ActRule label="Finance automation" />
        <MaskText text="The routine work stops reaching a person." as="h2" className="stg-h2" />
        <Reveal delay={0.16} y={14}>
          <p className="fx-lede">
            Rules run against live balances on a schedule or on an event. What lands in
            somebody&apos;s queue is the exception — never the whole population.
          </p>
        </Reveal>

        <div className="fx-auto-body">
          <div className="fx-rules">
            {RULES.map((r, idx) => (
              <Reveal className="fx-rule" key={r.name} delay={idx * 0.05}>
                <span className="fx-rule-dot"><Zap size={12} strokeWidth={2} /></span>
                <div className="fx-rule-t">
                  <b>{r.name}</b>
                  <em>{r.when}</em>
                </div>
                <div className="fx-rule-r">
                  <span className="fx-rule-did">{r.did}</span>
                  <div className="fx-rule-bar">
                    <motion.i
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: r.rate / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.15 + idx * 0.05, ease: EASE }}
                    />
                  </div>
                  <span className="fx-rule-pct">{r.rate}%</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="fx-auto-side" delay={0.14} y={22}>
            <div className="fx-auto-card">
              <span className="fx-auto-k">Touchless posting</span>
              <b className="tnum">{live.touchless.toFixed(1)}%</b>
              <span className="fx-auto-sub">of journals posted with no human touch</span>

              <div className="fx-auto-split">
                <div>
                  <b className="tnum">{live.saved}</b>
                  <span>finance hours returned each month</span>
                </div>
                <div>
                  <b className="tnum">42%</b>
                  <span>fewer manual journal entries in year one</span>
                </div>
              </div>

              <div className="fx-auto-note">
                <ShieldCheck size={13} strokeWidth={1.8} />
                Every automated posting carries the rule that produced it, so an auditor
                can trace the logic as easily as the number.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   09 · REAL-TIME FINANCIAL VISIBILITY
   --------------------------------------------------------------- */
const VIEWS = [
  { who: 'CFO', sees: 'Group position, covenant headroom, cash runway', when: 'Continuously' },
  { who: 'Financial controller', sees: 'Close status by entity, open exceptions, journals awaiting review', when: 'Continuously' },
  { who: 'Treasury', sees: 'Bank balances across four institutions, 13-week forecast', when: 'Every bank feed' },
  { who: 'Business unit head', sees: 'Their P&L, budget consumption, committed spend', when: 'Continuously' },
  { who: 'Auditor', sees: 'Read-only ledger, full trail, no export required', when: 'On demand' },
];

export const RealTimeVisibility = () => {
  const [live, ref] = useLive(
    { n: 0, cash: 42.8, secs: 2 },
    (s) => ({
      n: s.n + 1,
      cash: 42.8 * (1 + Math.sin(s.n * 0.9) * 0.011),
      secs: (s.n % 4) + 1,
    }),
    3000
  );

  return (
    <section className="fx-vis" id="visibility" ref={ref}>
      <div className="fx-inner">
        <ActRule label="Real-time financial visibility" />

        <div className="fx-vis-top">
          <MaskText text="Everyone is looking at" accent="the same hour." as="h2" className="stg-h2" />
          <Reveal delay={0.16} y={14}>
            <p className="fx-lede">
              There is no management pack, no extract and no lag. Each role sees the
              slice of the ledger they are entitled to, as it stands right now.
            </p>
          </Reveal>
        </div>

        <Reveal className="fx-vis-strip" y={22}>
          <div className="fx-vis-live">
            <span className="fx-vis-k"><i />Live group position</span>
            <motion.b
              key={live.cash.toFixed(1)}
              className="tnum"
              initial={{ opacity: 0.45, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              SAR {live.cash.toFixed(1)}M
            </motion.b>
            <span className="fx-vis-ago">updated {live.secs} sec ago</span>
          </div>

          <div className="fx-vis-facts">
            {[
              [Globe, '18', 'countries reporting into one ledger'],
              [Building2, '7', 'legal entities consolidated live'],
              [RefreshCw, '0', 'nightly extracts to wait for'],
              [Clock, '3 days', 'to a signed group close'],
            ].map(([Icon, v, l]) => (
              <div key={l}>
                <Icon size={14} strokeWidth={1.8} />
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="fx-vis-table">
          <div className="fx-vis-row head">
            <span>Role</span><span>What they see</span><span>Refreshed</span>
          </div>
          {VIEWS.map((v, idx) => (
            <Reveal className="fx-vis-row" key={v.who} delay={idx * 0.05}>
              <span className="fx-vis-who">{v.who}</span>
              <span className="fx-vis-sees">{v.sees}</span>
              <span className="fx-vis-when"><i />{v.when}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   Content for the shared blocks
   --------------------------------------------------------------- */
export const FINANCE_TRUST = {
  label: 'Finance teams running on Emvive',
  logos: ['HORIZON HOLDING', 'GULF CEMENT', 'AL FAISAL TRADING', 'LANDMARK RETAIL', 'NEXA COMPONENTS', 'DELTA CHEMICALS'],
  proofs: [
    { icon: Landmark, value: 'SAR 18B+', label: 'posted through the ledger each year' },
    { icon: Building2, value: '7 entities', label: 'consolidated in the largest group live today' },
    { icon: ShieldCheck, value: 'ZATCA Phase 2', label: 'certified e-invoicing, cleared in under a second' },
    { icon: Users, value: '4,200+', label: 'finance and approval users' },
  ],
  note: 'Hosted in Saudi Arabia, the UAE or India — or in your own private cloud where shared infrastructure is ruled out.',
};

export const FINANCE_FAQ = [
  {
    q: 'Can we run Emvive Finance alongside our existing ERP?',
    a: 'Yes, and most groups do at first. Emvive reads your legacy ledger through a nightly or streaming connector and takes over entity by entity. Nothing forces a big-bang cutover.',
  },
  {
    q: 'How long does implementation actually take?',
    a: 'A single entity with a clean chart of accounts is typically live in six to eight weeks. A seven-entity group with intercompany and consolidation is usually a four to five month programme, with the first entity reporting from month two.',
  },
  {
    q: 'Is it compliant with ZATCA e-invoicing?',
    a: 'Yes — Phase 2 certified. Every invoice is signed, QR-stamped and cleared with the authority before it leaves, and the authority response is stored against the document for audit.',
    points: ['Phase 1 and Phase 2 clearance', 'Arabic and English invoice presentation', 'Authority response retained with the journal'],
  },
  {
    q: 'How do you handle multi-currency and IFRS?',
    a: 'Transaction, functional and presentation currency are held on every posting. Revaluation and translation run as scheduled processes, and statutory, management and IFRS views are produced from the same journals rather than maintained separately.',
  },
  {
    q: 'What happens to our audit?',
    a: 'Auditors get a scoped read-only login rather than an export. They can drill from any figure in the statements to the journal, the source document and the approval that released it, with user, timestamp and before/after values on every change.',
  },
  {
    q: 'Where does our data live?',
    a: 'Saudi Arabia, the UAE or India, pinned per workspace — including backups. Where shared infrastructure is ruled out entirely, Emvive is deployed into your own private cloud.',
  },
];

export const FINANCE_CONTACT = {
  eyebrow: 'Talk to the finance team',
  title: "Let's transform your",
  accent: 'finance operations.',
  lede:
    'Tell us where the month-end actually goes. Bring a recent trial balance to the call and we will show you how it posts, consolidates and reports on Emvive — with your own numbers, not a demo dataset.',
  cta: 'Talk to Finance Team',
  aside: [
    { icon: Clock, t: 'A working session, not a pitch', d: 'Ninety minutes with a finance architect who has closed books, not a slide deck.' },
    { icon: ShieldCheck, t: 'Your data stays yours', d: 'Sample data is used under NDA and destroyed after the session unless you ask otherwise.' },
    { icon: Activity, t: 'You leave with a close plan', d: 'A written view of which days come out of your close and what it would take.' },
  ],
  fields: [
    { name: 'name', label: 'Name', required: true, placeholder: 'Rania Haddad', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    { name: 'company', label: 'Company', required: true, placeholder: 'Horizon Holding', autoComplete: 'organization' },
    {
      name: 'size', label: 'Company size', type: 'select', required: true,
      options: ['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'],
    },
    {
      name: 'challenge', label: 'Finance challenges', type: 'choice', span: 2,
      options: ['Slow month-end close', 'Multi-entity consolidation', 'Manual journals', 'Cash visibility', 'Audit & controls', 'E-invoicing compliance'],
    },
    {
      name: 'message', label: 'Message', type: 'textarea', span: 2,
      placeholder: 'How many entities, which ERP you run today, and what the close looks like now.',
    },
  ],
};

/* ---------------------------------------------------------------
   Product navigation
   --------------------------------------------------------------- */
/* Same rule as Supply Chain and Platform: every section on the page has
   a row in one of the flyouts, in page order — overview group, then the
   capability group, then assurance. Hero is the mark, contact is the CTA. */
export const FINANCE_NAV = {
  mark: { label: 'Finance', suffix: '& Controls' },
  menus: [
    {
      id: 'intro', label: 'Overview', icon: Building2, href: '#overview',
      blurb: 'What the product covers and what breaks without it.',
      items: [
        { href: '#trust', icon: Building2, t: 'Trusted by', d: 'The finance teams already closing on it.' },
        { href: '#overview', icon: BookOpen, t: 'Finance overview', d: 'One ledger under record, control and report.' },
        { href: '#why', icon: AlertTriangle, t: 'Why Emvive', d: 'What a ledger split across systems costs.' },
      ],
      feature: { t: 'The executive command centre', d: 'One shell, five configurations — record through to consolidation.', href: '#system' },
    },
    {
      id: 'capabilities', label: 'Capabilities', icon: Layers, href: '#capabilities',
      blurb: 'Eight modules writing to one ledger — record, approve, automate, report.',
      items: [
        { href: '#capabilities', icon: BookOpen, t: 'Core capabilities', d: 'GL, payables, receivables, expenses, budgeting.' },
        { href: '#ledger', icon: Layers, t: 'Connected ledger', d: 'Payables, receivables, treasury, assets, tax.' },
        { href: '#automation', icon: Zap, t: 'Finance automation', d: 'Rules that match, post and reconcile overnight.' },
        { href: '#system', icon: Landmark, t: 'Command centre', d: 'One shell, five configurations, one ledger.' },
        { href: '#visibility', icon: Activity, t: 'Real-time visibility', d: 'The live group position, by role.' },
      ],
      feature: { t: 'Finance automation', d: 'Rules that match, post and reconcile while the office is closed.', href: '#automation' },
    },
    {
      id: 'assurance', label: 'Assurance', icon: ShieldCheck, tone: 'ink', href: '#controls',
      blurb: 'The controls, connections and evidence an auditor asks for.',
      items: [
        { href: '#integrations', icon: Database, t: 'Connected enterprise', d: 'Banks, ZATCA, BI, legacy ERP.' },
        { href: '#controls', icon: Lock, t: 'Controls & compliance', d: 'Duty segregation, period locks, immutable trail.' },
        { href: '#scale', icon: TrendingUp, t: 'Business impact', d: 'What changes across the first year.' },
        { href: '#story', icon: Users, t: 'Customer story', d: 'Horizon Holding, day nineteen to day three.' },
        { href: '#faq', icon: HelpCircle, t: 'FAQ', d: 'The six questions a controller raises.' },
      ],
      feature: { t: 'Cleared in under a second', d: 'ZATCA Phase 2 — signed, stamped and stored with the journal.', href: '#controls' },
    },
  ],
  links: [],
  watch: { href: '#system', label: 'See the close' },
  cta: { href: '#start', label: 'Talk to Finance' },
  spy: [
    'top', 'trust', 'overview', 'why', 'capabilities', 'ledger', 'automation',
    'system', 'visibility', 'integrations', 'controls', 'scale', 'story', 'faq', 'start',
  ],
  owner: {
    trust: 'intro', overview: 'intro', why: 'intro',
    capabilities: 'capabilities', ledger: 'capabilities', automation: 'capabilities',
    system: 'capabilities', visibility: 'capabilities',
    integrations: 'assurance', controls: 'assurance', scale: 'assurance',
    story: 'assurance', faq: 'assurance',
  },
};
