import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Receipt, CreditCard, Landmark, Building2, Percent,
  FileText, ShieldCheck, ChartPie, ArrowUpRight, ArrowRight, Lock, Database,
  Layers, TrendingUp, Users, Check, RefreshCw,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from '../shared/motion';
import { Pin, Narration, Canvas, Module, HRail, Spotlight, ScrollNumber, ActRule } from '../shared/stage';
import { ProductPage, Footer } from '../shared/system';
import ProductNav from '../shared/nav';
import { TrustBand, Faq, ContactSection } from '../shared/blocks';
import { LiveBars, Ring, Spark, Meter } from '../shared/viz';
import {
  FinanceOverview, WhyFinance, CoreCapabilities, FinanceAutomation,
  RealTimeVisibility, FINANCE_TRUST, FINANCE_FAQ, FINANCE_CONTACT, FINANCE_NAV,
} from './FinanceSections';
import {
  Sidebar, Toolbar, LedgerTable, Inspector, KpiWidgets, ChartPanel,
  ApprovalPanel, RulesPanel, LogPanel, TreePanel, StatementPanel,
  AiCard, Toast, Palette, CloseWidget,
} from './FinanceApp';
import './FinanceApp.css';
import './Finance.css';

const CUR = 'SAR';

/* =====================================================================
   LIVE DATA — one interval feeds every surface on the page
   ===================================================================== */

const LOG_POOL = [
  { text: 'Bank feed reconciled', meta: 'Al Rajhi · 412 lines', ms: '0.4s' },
  { text: 'Invoice cleared by ZATCA', meta: 'INV-2025-04412', ms: '0.9s' },
  { text: 'FX revaluation posted', meta: 'AED, QAR', ms: '1.2s' },
  { text: 'Intercompany matched', meta: 'EM-DXB · 412,000', ms: '0.6s' },
  { text: 'Depreciation run complete', meta: '1,284 assets', ms: '2.1s' },
  { text: 'Payment run released', meta: '34 suppliers', ms: '0.8s' },
];

const ACT_POOL = [
  { who: 'MK', text: 'M. Khalid edited amount', meta: '18,240 → 18,240.00', ago: '2s' },
  { who: 'RH', text: 'R. Haddad approved', meta: 'Within delegation', ago: '1m' },
  { who: 'AS', text: 'A. Salem attached file', meta: 'fx-rates-oct.pdf', ago: '4m' },
  { who: 'SY', text: 'System posted journal', meta: 'Rule: FX revaluation', ago: '9m' },
  { who: 'MK', text: 'M. Khalid left a comment', meta: '"Check the closing rate"', ago: '12m' },
];

const POST_POOL = [
  { text: 'Invoice #2189', meta: 'Al Faisal Trading', amt: '184,200' },
  { text: 'Payroll batch', meta: 'October · 412 staff', amt: '742,900' },
  { text: 'Vendor payment', meta: 'Nexa Components', amt: '311,450' },
  { text: 'Customer receipt', meta: 'Landmark Retail', amt: '96,300' },
  { text: 'Asset acquisition', meta: 'Fleet · 4 units', amt: '428,000' },
];

const pick = (pool) => (i) => ({ ...pool[i % pool.length], id: i });
const makeLog = pick(LOG_POOL);
const makeAct = pick(ACT_POOL);
const makePost = pick(POST_POOL);

const useFinanceLive = () => useLive(
  {
    n: 0, cash: 42.8, dso: 31, margin: 18.6, pct: 2.4,
    log: [0, 1, 2, 3].map(makeLog),
    act: [0, 1, 2, 3].map(makeAct),
    posts: [0, 1, 2].map(makePost),
  },
  (s) => {
    const n = s.n + 1;
    const w = Math.sin(n * 0.9) * 0.55 + Math.sin(n * 1.7) * 0.45;
    return {
      n,
      cash: 42.8 * (1 + w * 0.011),
      dso: Math.round(31 + w * 1.4),
      margin: 18.6 * (1 + w * 0.008),
      pct: 2.4 + w * 0.5,
      log: [makeLog(s.log[0].id + 1), ...s.log.slice(0, 3)],
      act: [makeAct(s.act[0].id + 1), ...s.act.slice(0, 3)],
      posts: [makePost(s.posts[0].id + 1), ...s.posts.slice(0, 2)],
    };
  },
  3000
);

/* =====================================================================
   ACT I — OVERTURE
   ===================================================================== */

const Overture = () => {
  const [live, ref] = useFinanceLive();

  return (
    <section className="fn-overture" id="top" ref={ref}>
      <div className="fn-overture-bg" aria-hidden="true">
        <div className="fn-grid" />
        <div className="fn-bloom" />
      </div>

      <div className="fn-overture-inner">
        <div className="fn-overture-copy">
          <Reveal duration={0.7}>
            <span className="fn-kicker"><span className="fn-kicker-dot" /> Emvive Finance</span>
          </Reveal>

          <MaskText text="The financial operating" as="h1" className="stg-display" delay={0.06} />
          <MaskText text="system for groups that" as="h1" className="stg-display" delay={0.14} />
          <MaskText text="close" accent="continuously." as="h1" className="stg-display" delay={0.22} />

          <Reveal delay={0.42} y={16}>
            <p className="fn-lede">One ledger. Every entity, currency and regulator.</p>
          </Reveal>

          <Reveal delay={0.5} y={16}>
            <div className="fn-actions">
              <a href="#start" className="px-btn px-btn-solid">Book a demo <ArrowRight size={16} /></a>
              <a href="#system" className="px-btn px-btn-quiet">Explore the system</a>
            </div>
          </Reveal>

          {/* the trust strip belongs to the copy column, under the calls to
              action — not spanning the whole fold */}
          <Reveal delay={0.7} className="fn-overture-foot">
            <span className="fn-foot-label">In production today</span>
            <div className="fn-foot-metrics">
              {[['3 days', 'Average group close'], ['99.8%', 'Cleared on first submission'], ['18', 'Countries, one ledger']].map(([v, l]) => (
                <div key={l}><b>{v}</b><span>{l}</span></div>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div
          className="fn-overture-slice"
          initial={{ opacity: 0, x: 90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
        >
          <div className="fn-slice-frame">
            <div className="fn-slice-grid">
              <div className="fn-slice-side"><Sidebar /></div>
              <div className="fn-slice-bar"><Toolbar /></div>
              <div className="fn-slice-main"><LedgerTable /></div>
              <div className="fn-slice-insp"><Inspector feed={live.act} /></div>
            </div>
            <motion.div
              className="fn-slice-float"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
            >
              <AiCard />
            </motion.div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

/* =====================================================================
   ACT II — THE MORPH
   The shell (sidebar + toolbar) persists across every beat. Only the
   work area reconfigures, and floating layers drift above it.
   ===================================================================== */

const BEATS = [
  { kicker: 'Record', title: 'Everything lands in one ledger.', body: 'Sales, procurement, payroll and inventory post directly. The trial balance is produced, never reassembled.' },
  { kicker: 'Analyse', title: 'The ledger becomes the analytics.', body: 'No warehouse, no nightly export. The chart you steer by is reading the journals you just posted.' },
  { kicker: 'Approve', title: 'Analytics become the workflow.', body: 'Variances raise themselves. Matching, thresholds and delegation decide who signs, and when.' },
  { kicker: 'Automate', title: 'The workflow becomes automation.', body: 'Rules run against live balances every night. Routine entries stop touching a person at all.' },
  { kicker: 'Report', title: 'Automation becomes the statutory pack.', body: 'Elimination, translation and consolidation are already done. The group report is a view, not a project.' },
];

const LAYOUT = {
  side: ['1/1/9/3', '1/1/9/3', '1/1/9/3', '1/1/9/3', '1/1/9/3'],
  bar: ['1/3/2/13', '1/3/2/13', '1/3/2/13', '1/3/2/13', '1/3/2/13'],
  table: ['2/3/9/10', null, null, null, null],
  kpis: [null, '2/3/4/10', null, null, null],
  chart: [null, '4/3/9/10', null, null, null],
  flow: [null, null, '2/3/9/9', null, null],
  rules: [null, null, null, '2/3/9/8', null],
  log: [null, null, null, '2/8/9/13', null],
  tree: [null, null, null, null, '2/3/9/8'],
  stmt: [null, null, null, null, '2/8/9/13'],
  insp: ['2/10/9/13', '2/10/9/13', '2/9/9/13', null, null],
};

const PARK = {
  table: '2/3/9/10', kpis: '2/3/4/10', chart: '4/3/9/10', flow: '2/3/9/9',
  rules: '2/3/9/8', log: '2/8/9/13', tree: '2/3/9/8', stmt: '2/8/9/13',
  insp: '2/10/9/13',
};

const at = (k, b) => LAYOUT[k][b] || PARK[k] || '1/1/2/2';
const on = (k, b) => Boolean(LAYOUT[k][b]);

const FLOATS = [
  null,
  { key: 'ai', style: { right: '24%', bottom: '6%' }, el: <AiCard /> },
  { key: 'toast', style: { right: '2.5%', top: '13%' }, el: <Toast /> },
  { key: 'pal', style: { left: '31%', top: '17%' }, el: <Palette /> },
  { key: 'close', style: { left: '23%', bottom: '7%' }, el: <CloseWidget /> },
];

const TheSystem = () => {
  const [live, liveRef] = useFinanceLive();

  return (
    <Pin count={BEATS.length} id="system">
      {({ beat }) => (
        <div className="fn-act" ref={liveRef}>
          <div className="fn-act-narr">
            <Narration beats={BEATS} beat={beat} count={BEATS.length} />
          </div>

          <div className="fn-act-canvas">
            <div className="fn-appframe">
              <Canvas>
                <Module area={at('side', beat)} show className="fn-pane"><Sidebar /></Module>
                <Module area={at('bar', beat)} show className="fn-pane">
                  <Toolbar crumb={['General ledger', 'Cash flow', 'Approvals', 'Automations', 'Consolidation'][beat]} />
                </Module>

                <Module area={at('table', beat)} show={on('table', beat)} className="fn-pane"><LedgerTable /></Module>
                <Module area={at('kpis', beat)} show={on('kpis', beat)} className="fn-pane flush"><KpiWidgets live={live} /></Module>
                <Module area={at('chart', beat)} show={on('chart', beat)} className="fn-pane"><ChartPanel /></Module>
                <Module area={at('flow', beat)} show={on('flow', beat)} className="fn-pane"><ApprovalPanel /></Module>
                <Module area={at('rules', beat)} show={on('rules', beat)} className="fn-pane"><RulesPanel /></Module>
                <Module area={at('log', beat)} show={on('log', beat)} className="fn-pane"><LogPanel feed={live.log} /></Module>
                <Module area={at('tree', beat)} show={on('tree', beat)} className="fn-pane"><TreePanel /></Module>
                <Module area={at('stmt', beat)} show={on('stmt', beat)} className="fn-pane"><StatementPanel /></Module>
                <Module area={at('insp', beat)} show={on('insp', beat)} className="fn-pane">
                  <Inspector mode={beat === 2 ? 'activity' : 'record'} feed={live.act} />
                </Module>

                <AnimatePresence mode="wait">
                  {FLOATS[beat] && (
                    <motion.div
                      key={FLOATS[beat].key}
                      className="fn-float"
                      style={FLOATS[beat].style}
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
                    >
                      {FLOATS[beat].el}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Canvas>
            </div>
          </div>
        </div>
      )}
    </Pin>
  );
};

/* =====================================================================
   ACT III — HORIZONTAL GALLERY
   ===================================================================== */

const RAIL_PANELS = [
  { k: 'Payables', title: 'Match before you pay', body: 'Three-way matching against the purchase order and goods receipt, with variances held rather than approved.', stat: '18 invoices awaiting approval', icon: Receipt },
  { k: 'Receivables', title: 'Shorten the cash cycle', body: 'Credit limits enforced before dispatch, with reminder sequences that fire without a collector chasing them.', stat: 'DSO down from 40 to 31 days', icon: CreditCard },
  { k: 'Treasury', title: 'Liquidity you can plan against', body: 'Bank feeds reconcile daily and roll into a thirteen-week forecast built from committed and expected flows.', stat: '4 banks · 3 currencies connected', icon: Landmark },
  { k: 'Assets', title: 'Acquisition to disposal', body: 'Componentised assets with automated depreciation, revaluation and disposal posting straight to the ledger.', stat: '1,284 assets under management', icon: Building2 },
  { k: 'Tax', title: 'Cleared before it leaves', body: 'Every invoice signed, QR-stamped and cleared with the authority in under a second, response stored for audit.', stat: 'ZATCA Phase 2 certified', icon: ShieldCheck },
];

const Gallery = () => (
  <HRail id="ledger">
    <div className="fn-rail-intro">
      <ActRule label="Connected ledger" />
      <h2 className="stg-h2">Five more surfaces,<br />reading the same ledger.</h2>
      <p className="fn-rail-intro-p">Keep scrolling — this moves sideways.</p>
    </div>

    {RAIL_PANELS.map(({ k, title, body, stat, icon: Icon }, i) => (
      <article className="fn-rpanel" key={k}>
        <header>
          <span className="fn-rpanel-n">{String(i + 1).padStart(2, '0')}</span>
          <span className="fn-rpanel-ic"><Icon size={17} strokeWidth={1.7} /></span>
        </header>
        <h3>{title}</h3>
        <p>{body}</p>
        <footer><span className="fn-rpanel-stat">{stat}</span></footer>
      </article>
    ))}
  </HRail>
);

/* =====================================================================
   ACT IV — CONTROLS
   The middle is now the point: a live audit chain with glowing links
   and a trail that writes itself, revealed by the cursor light.
   ===================================================================== */

const CHAIN = [
  { icon: FileText, label: 'Record', meta: 'Invoice created', tone: '' },
  { icon: ShieldCheck, label: 'Validation', meta: '3-way match passed', tone: '' },
  { icon: Users, label: 'Approval', meta: 'Controller signed', tone: '' },
  { icon: Lock, label: 'Locked', meta: 'Period closed', tone: '' },
  { icon: ChartPie, label: 'Analytics', meta: 'Report refreshed', tone: '' },
];

const Controls = () => {
  const [live, ref] = useFinanceLive();

  return (
    <section className="fn-controls" id="controls">
      <Spotlight className="fn-controls-panel">
        <div className="fn-controls-head">
          <Reveal><span className="fn-kicker dark"><span className="fn-kicker-dot" /> Controls &amp; assurance</span></Reveal>
          <MaskText text="Every field that changes leaves a record." as="h2" className="stg-h2" />
        </div>

        {/* the chain */}
        <div className="fn-chain-rail" ref={ref}>
          {CHAIN.map(({ icon: Icon, label, meta }, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <span className="fn-chain-link" aria-hidden="true">
                  <motion.i
                    initial={{ x: '-130%' }}
                    animate={{ x: '130%' }}
                    transition={{ duration: 1.9, delay: i * 0.42, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
                  />
                </span>
              )}
              <motion.div
                className="fn-chain-node"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              >
                <span className="fn-chain-ic"><Icon size={15} strokeWidth={1.7} /></span>
                <b>{label}</b>
                <i>{meta}</i>
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        {/* the trail */}
        <div className="fn-audit">
          <div className="fn-audit-head">
            <span className="fn-audit-label">Audit trail</span>
            <span className="fn-audit-live"><i />Recording</span>
          </div>
          <div className="fn-audit-rows">
            <AnimatePresence initial={false}>
              {live.act.map((a) => (
                <motion.div
                  className="fn-audit-row"
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <span className="fn-audit-avatar">{a.who}</span>
                  <span className="fn-audit-text"><b>{a.text}</b><i>{a.meta}</i></span>
                  <span className="fn-audit-time">{a.ago} ago</span>
                  <span className="fn-audit-hash">0x{(a.id * 7919).toString(16).padStart(6, '0').slice(-6)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="fn-controls-grid">
          {[
            [Lock, 'Segregation of duties', 'Maker and checker enforced per entity. An administrator cannot quietly bypass it.'],
            [ShieldCheck, 'Immutable trail', 'User, timestamp, device, before and after values on every change.'],
            [Layers, 'Period locks', 'Closed periods reject postings outright rather than warning and letting them through.'],
            [Database, 'Data residency', 'Saudi Arabia, the UAE or India. Private cloud where shared infrastructure is ruled out.'],
          ].map(([Icon, t, d], i) => (
            <Reveal className="fn-control" delay={i * 0.07} key={t}>
              <Icon size={17} strokeWidth={1.6} />
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </Spotlight>
    </section>
  );
};

/* =====================================================================
   ACT V — SCALE
   The close is the number finance is judged on, so the section shows it
   as a calendar measure rather than as a row of oversized numerals: two
   bars against the same thirty-one days, and the gap between them
   annotated. The remaining outcomes sit underneath at a size that lets
   the close keep the stage.
   ===================================================================== */

const CLOSE = [
  { k: 'Before Emvive', days: 19, tone: 'was', note: 'Nineteen working days, most of it chasing' },
  { k: 'With Emvive', days: 3, tone: 'now', note: 'Reviewed, signed and filed by day three' },
];

const IMPACT = [
  { v: 42, suffix: '%', label: 'Fewer manual journal entries', sub: 'Posting rules absorb the routine work within the first quarter' },
  { v: 4.2, decimals: 1, prefix: `${CUR} `, suffix: 'M', label: 'Working capital released', sub: 'Recovered from a shorter cash cycle and tighter credit control' },
  { v: 99.8, decimals: 1, suffix: '%', label: 'Cleared on first submission', sub: 'Signed, stamped and accepted by the authority in under a second' },
];

const DAYS = 31;
const pct = (d) => `${(d / DAYS) * 100}%`;

const Scale = () => (
  <section className="fn-scale" id="scale">
    <div className="fn-scale-inner">
      <ActRule label="Enterprise scale" />

      <div className="fn-scale-head">
        <MaskText text="What changes in the first year." as="h2" className="stg-h2" />
        <Reveal delay={0.16} y={14}>
          <p>
            One real group — seven legal entities, three currencies — twelve months
            after go-live. Measured in working days after period end.
          </p>
        </Reveal>
      </div>

      {/* the close, drawn against the month it has to fit inside */}
      <Reveal className="fn-close" y={22}>
        <div className="fn-close-top">
          <span className="fn-close-k">The month-end close</span>
          <span className="fn-close-sub">Working days after period end</span>
        </div>

        <div className="fn-close-ruler" aria-hidden="true">
          <span className="fn-close-ruler-track">
            {[1, 5, 10, 15, 20, 25, 31].map((d) => (
              <i key={d} style={{ left: pct(d - 1) }}>{d}</i>
            ))}
          </span>
        </div>

        {CLOSE.map((c, i) => (
          <div className={`fn-close-row ${c.tone}`} key={c.k}>
            <span className="fn-close-label">
              <b>{c.k}</b>
              <em>{c.note}</em>
            </span>

            <span className="fn-close-track">
              <motion.i
                style={{ width: pct(c.days) }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.25 + i * 0.2, ease: EASE }}
              />
            </span>

            <span className="fn-close-days"><b>{c.days}</b> days</span>
          </div>
        ))}

        {/* the gap between the two bars, called out where it happens */}
        <div className="fn-close-delta">
          <span className="fn-close-gap" style={{ marginLeft: pct(3), width: pct(16) }}>
            <i />
          </span>
          <span className="fn-close-claim">
            <b><ScrollNumber to={16} prefix="−" /> days</b>
            returned to the team, every month
          </span>
        </div>
      </Reveal>

      {/* the rest of the year-one outcomes */}
      <div className="fn-impact">
        {IMPACT.map((s, i) => (
          <Reveal className="fn-impact-cell" key={s.label} delay={i * 0.07}>
            <b>
              <ScrollNumber to={s.v} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix} />
            </b>
            <h3>{s.label}</h3>
            <p>{s.sub}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* =====================================================================
   ACT VI — ARCHITECTURE
   The centre is a working application panel; the flanks are live
   connection registers, not empty boxes.
   ===================================================================== */

const SOURCES = [
  [Landmark, 'Bank feeds', 'connected', '4 banks'],
  [Receipt, 'Supplier invoices', 'syncing', '128 today'],
  [CreditCard, 'Payment gateways', 'connected', 'Live'],
  [Database, 'Legacy ERP', 'connected', 'Nightly'],
  [FileText, 'Expense claims', 'connected', '42 pending'],
];

const CONSUMERS = [
  [ChartPie, 'Power BI', 'connected', 'Refreshed 2m'],
  [ShieldCheck, 'ZATCA', 'connected', '4,182 cleared'],
  [TrendingUp, 'Board reporting', 'syncing', 'Generating'],
  [Percent, 'Tax authority', 'connected', 'Q4 filed'],
  [Users, 'Auditor portal', 'connected', 'Read-only'],
];

const Register = ({ label, items }) => (
  <div className="fn-reg">
    <span className="fn-reg-label">{label}</span>
    {items.map(([Icon, name, state, meta], i) => (
      <motion.div
        className="fn-reg-row"
        key={name}
        initial={{ opacity: 0, x: label === 'Sources' ? -12 : 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
      >
        <span className="fn-reg-ic"><Icon size={13} strokeWidth={1.8} /></span>
        <span className="fn-reg-txt"><b>{name}</b><i>{meta}</i></span>
        {state === 'syncing' ? (
          <span className="fn-reg-state sync"><RefreshCw size={9} /> Syncing</span>
        ) : (
          <span className="fn-reg-state ok"><Check size={9} strokeWidth={4} /> Connected</span>
        )}
      </motion.div>
    ))}
  </div>
);

const CoreApp = ({ live }) => (
  <div className="fn-core">
    <div className="fn-core-bar">
      <span className="fn-core-mark">EM</span>
      <b>Emvive Finance</b>
      <kbd>⌘K</kbd>
    </div>

    <div className="fn-core-sec">
      <span className="fn-core-label">General ledger</span>
      {[
        ['Revenue', '12,284,500', 100, 'up'],
        ['Expenses', '7,429,000', 61, ''],
        ['Payroll', '1,742,900', 24, ''],
        ['Assets', '4,120,000', 44, 'up'],
        ['Liabilities', '2,318,600', 31, ''],
      ].map(([name, amt, pct, dir], i) => (
        <div className="fn-core-row" key={name}>
          <span>{name}</span>
          <span className="fn-core-amt px-mono">{amt}</span>
          {dir === 'up' && <i className="fn-core-up">▲</i>}
          <Meter value={pct} delay={i * 0.06} />
        </div>
      ))}
    </div>

    <div className="fn-core-sec">
      <div className="fn-core-label-row">
        <span className="fn-core-label">Today&apos;s postings</span>
        <span className="fn-core-live"><i /> live</span>
      </div>
      <div className="fn-core-posts">
        <AnimatePresence initial={false}>
          {live.posts.map((p) => (
            <motion.div
              className="fn-core-post"
              key={p.id}
              layout
              initial={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="fn-core-plus">+</span>
              <span className="fn-reg-txt"><b>{p.text}</b><i>{p.meta}</i></span>
              <span className="px-mono fn-core-amt">{p.amt}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

    <div className="fn-core-cash">
      <div>
        <span className="fn-core-label">Cash position</span>
        <motion.b
          key={live.cash.toFixed(1)}
          className="px-mono"
          initial={{ opacity: 0.4, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {CUR} {live.cash.toFixed(1)}M
        </motion.b>
        <span className="fn-core-delta">▲ +{live.pct.toFixed(1)}% <em>updated 2 sec ago</em></span>
      </div>
      <Spark values={[32, 38, 35, 44, 41, 52, 49, 58, 55, 64]} width={92} height={34} />
    </div>
  </div>
);

const Architecture = () => {
  const [live, ref] = useFinanceLive();

  return (
    <section className="fn-arch" id="integrations" ref={ref}>
      <div className="fn-arch-inner">
        <ActRule label="Connected" />
        <MaskText text="One ledger, wired to everything else." as="h2" className="stg-h2" />

        <div className="fn-arch-diagram">
          <Reveal className="fn-arch-side"><Register label="Sources" items={SOURCES} /></Reveal>

          <div className="fn-arch-wire" aria-hidden="true">
            <motion.i initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }} />
          </div>

          <Reveal className="fn-arch-core" delay={0.1}><CoreApp live={live} /></Reveal>

          <div className="fn-arch-wire" aria-hidden="true">
            <motion.i initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2.4, delay: 0.7, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' }} />
          </div>

          <Reveal className="fn-arch-side" delay={0.16}><Register label="Consumers" items={CONSUMERS} /></Reveal>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   ACT VII — PROOF
   ===================================================================== */

const Proof = () => (
  <section className="fn-proof" id="story">
    <div className="fn-proof-inner">
      <div className="fn-proof-quote">
        <MaskText
          text="We closed on day nineteen and argued about which spreadsheet was current. We close on day three now."
          as="blockquote"
          className="fn-quote"
        />
        <Reveal delay={0.2}>
          <div className="fn-proof-by">
            <span className="fn-proof-avatar">RH</span>
            <span className="fn-reg-txt"><b>Rania Haddad</b><i>Group Financial Controller, Horizon Holding</i></span>
          </div>
        </Reveal>
        <Reveal delay={0.28}>
          <a href="#start" className="px-link" style={{ marginTop: '2rem' }}>
            Read the case study <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>

      <Reveal className="fn-proof-visual" delay={0.12} y={26}>
        <div className="fn-proof-card">
          <div className="fn-proof-bar">
            <b>Close velocity</b>
            <span className="ap-tag mute">Horizon Holding · 12 months</span>
          </div>
          <div className="fn-proof-bars"><LiveBars values={[19, 17, 14, 12, 9, 7, 5, 4, 3, 3, 3, 3]} height={140} /></div>
          <div className="fn-proof-axis"><span>Month 1</span><span>Month 12</span></div>
          <div className="fn-proof-stats">
            <div><Ring value={86} size={40} stroke={3.5} label="86" /><span>Automated<br />postings</span></div>
            <div><b className="tnum">3</b><span>Days to<br />close</span></div>
            <div><b className="tnum">7</b><span>Entities<br />consolidated</span></div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* =====================================================================
   PAGE — the locked information architecture

     01 Hero                              Overture
     02 Trusted by / enterprise trust     TrustBand
     03 Finance overview                  FinanceOverview
     04 Why Emvive Finance                WhyFinance
     05 Core finance capabilities         CoreCapabilities
     06 Connected ledger                  Gallery        (horizontal rail)
     07 Finance automation                FinanceAutomation
     08 Executive command centre          TheSystem      (stacked dashboards)
     09 Real-time financial visibility    RealTimeVisibility
     10 Integrations / connected          Architecture
     11 Security, controls & compliance   Controls
     12 Business impact                   Scale
     13 Customer success                  Proof
     14 FAQ                               Faq
     15 Contact / demo form               ContactSection
     16 Footer

   No AI section on this page, by design.
   ===================================================================== */
const Finance = () => (
  <ProductPage accent="#0a8f5e" accent2="#07724b" wash="rgba(10,143,94,0.09)" className="fn">
    <ProductNav {...FINANCE_NAV} />

    <Overture />
    <TrustBand {...FINANCE_TRUST} />
    <FinanceOverview />
    <WhyFinance />
    <CoreCapabilities />
    <Gallery />
    <FinanceAutomation />
    <TheSystem />
    <RealTimeVisibility />
    <Architecture />
    <Controls />
    <Scale />
    <Proof />

    <Faq
      eyebrow="Questions finance teams ask"
      title="Before you put your ledger on it."
      lede="The six things every controller and CFO raises in the first call, answered plainly."
      items={FINANCE_FAQ}
      aside={(
        <>Something not answered here? Ask it in the form below — it goes to the same
        people who would run your implementation.</>
      )}
    />

    <ContactSection {...FINANCE_CONTACT} />

    <Footer />
  </ProductPage>
);

export default Finance;
