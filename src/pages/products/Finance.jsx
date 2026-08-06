import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Wallet, BookOpen, Receipt, CreditCard, Landmark, Building2, Percent,
  FileText, ShieldCheck, ChartPie, Check, Zap, ArrowUpRight, ArrowRight,
  Lock, Database, Layers, GitBranch, TrendingUp,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from './motion';
import {
  Pin, Narration, Canvas, Module, HRail, Spotlight, ScrollNumber, ActRule,
} from './stage';
import { ProductPage, SubNav, ClosingCta, Footer } from './system';
import { AreaChart, LiveBars, Meter, Ring, Spark } from './viz';
import './Finance.css';

const CUR = 'SAR';

/* =====================================================================
   ACT I — OVERTURE
   Asymmetric. Type owns the left, the workspace enters from the right
   edge and runs off it. Nothing is centred.
   ===================================================================== */

const Overture = () => (
  <section className="fn-overture" id="top">
    <div className="fn-overture-bg" aria-hidden="true">
      <div className="fn-grid" />
      <div className="fn-bloom" />
    </div>

    <div className="fn-overture-inner">
      <div className="fn-overture-copy">
        <Reveal duration={0.7}>
          <span className="fn-kicker">
            <span className="fn-kicker-dot" /> Emvive Finance
          </span>
        </Reveal>

        <MaskText
          text="The financial operating"
          as="h1"
          className="stg-display"
          delay={0.06}
        />
        <MaskText
          text="system for groups that"
          as="h1"
          className="stg-display"
          delay={0.14}
        />
        <MaskText
          text="close"
          accent="continuously."
          as="h1"
          className="stg-display"
          delay={0.22}
        />

        <Reveal delay={0.42} y={16}>
          <p className="fn-lede">
            One ledger. Every entity, currency and regulator.
          </p>
        </Reveal>

        <Reveal delay={0.5} y={16}>
          <div className="fn-actions">
            <a href="#start" className="px-btn px-btn-solid">Book a demo <ArrowRight size={16} /></a>
            <a href="#system" className="px-btn px-btn-quiet">Explore the system</a>
          </div>
        </Reveal>
      </div>

      {/* a slice of the real workspace, bleeding off the right edge */}
      <motion.div
        className="fn-overture-slice"
        initial={{ opacity: 0, x: 90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
      >
        <div className="fn-slice-frame">
          <ModuleChrome title="Financial control" tag="Live" />
          <KpiStrip compact />
          <LedgerTable rows={7} />
        </div>
      </motion.div>
    </div>

    <Reveal delay={0.7} className="fn-overture-foot">
      <span className="fn-foot-label">In production today</span>
      <div className="fn-foot-metrics">
        {[
          ['3 days', 'Average group close'],
          ['99.8%', 'Cleared on first submission'],
          ['18', 'Countries, one ledger'],
        ].map(([v, l]) => (
          <div key={l}><b>{v}</b><span>{l}</span></div>
        ))}
      </div>
    </Reveal>
  </section>
);

/* =====================================================================
   CANVAS MODULES — the same surfaces reappear across every beat
   ===================================================================== */

const ModuleChrome = ({ title, tag, right }) => (
  <div className="fn-mchrome">
    <span className="fn-mchrome-title">{title}</span>
    {right}
    {tag && <span className="fn-mchrome-tag">{tag === 'Live' && <i className="fn-live" />}{tag}</span>}
  </div>
);

const NavRail = () => (
  <>
    <div className="fn-rail-org">
      <span className="fn-rail-mark">EM</span>
      <span className="fn-txt"><b>Emvive Group</b><i>7 entities</i></span>
    </div>
    <nav className="fn-rail-nav">
      {[
        [ChartPie, 'Overview'], [BookOpen, 'Ledger'], [Receipt, 'Payables'],
        [CreditCard, 'Receivables'], [Wallet, 'Cash'], [Building2, 'Assets'],
        [Percent, 'Tax'], [FileText, 'Reports'],
      ].map(([Icon, label], i) => (
        <span className={`fn-rail-item ${i === 0 ? 'on' : ''}`} key={label}>
          <Icon size={14} strokeWidth={1.7} /> {label}
        </span>
      ))}
    </nav>
    <div className="fn-rail-foot">
      <span className="px-tag pos">Period open</span>
    </div>
  </>
);

const KpiStrip = ({ live, compact }) => {
  const set = [
    { k: 'Cash position', v: live ? `${CUR} ${live.cash.toFixed(1)}M` : `${CUR} 42.8M`, d: '+6.4%', s: [32, 38, 35, 44, 41, 52, 49, 58] },
    { k: 'DSO', v: live ? `${live.dso} days` : '31 days', d: '−9 days', s: [58, 54, 49, 46, 42, 38, 34, 31] },
    { k: 'Net margin', v: live ? `${live.margin.toFixed(1)}%` : '18.6%', d: '+2.1pp', s: [12, 14, 13, 16, 15, 17, 18, 19] },
    { k: 'Unposted', v: '4', d: '−128', s: [88, 62, 44, 31, 22, 14, 8, 4] },
  ];

  return (
    <div className={`fn-kpis ${compact ? 'compact' : ''}`}>
      {set.map((kpi) => (
        <div className="fn-kpi" key={kpi.k}>
          <span className="fn-kpi-k">{kpi.k}</span>
          <motion.b
            key={kpi.v}
            initial={{ opacity: 0.4, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="tnum"
          >
            {kpi.v}
          </motion.b>
          <span className="fn-kpi-row">
            <i>{kpi.d}</i>
            <Spark values={kpi.s} width={52} height={16} />
          </span>
        </div>
      ))}
    </div>
  );
};

const LEDGER_ROWS = [
  ['JV-10428', 'Revenue — Retail KSA', '—', '1,284,500', 'pos', 'Posted'],
  ['JV-10429', 'Trade receivables', '1,284,500', '—', 'pos', 'Posted'],
  ['JV-10430', 'FX revaluation — AED', '18,240', '—', 'warn', 'Review'],
  ['JV-10431', 'Depreciation — Fleet', '96,700', '—', 'pos', 'Posted'],
  ['JV-10432', 'Intercompany — EM-DXB', '—', '412,000', 'info', 'Matching'],
  ['JV-10433', 'Accrued expenses', '54,120', '—', 'pos', 'Posted'],
  ['JV-10434', 'Payroll accrual — Oct', '742,900', '—', 'pos', 'Posted'],
  ['JV-10435', 'Deferred revenue', '—', '318,600', 'pos', 'Posted'],
];

const LedgerTable = ({ rows = 8 }) => (
  <div className="fn-sheet">
    <div className="fn-tr fn-th">
      <span>Journal</span><span>Account</span><span>Debit</span><span>Credit</span><span>Status</span>
    </div>
    <div className="fn-sheet-body">
      {LEDGER_ROWS.slice(0, rows).map(([id, acct, dr, cr, tone, status]) => (
        <div className="fn-tr" key={id}>
          <span className="px-mono fn-dim">{id}</span>
          <span>{acct}</span>
          <span className="px-mono num">{dr}</span>
          <span className="px-mono num">{cr}</span>
          <span><i className={`px-tag ${tone}`}>{status}</i></span>
        </div>
      ))}
    </div>
  </div>
);

const CashChart = () => (
  <div className="fn-chartwrap">
    <div className="fn-chart-head">
      <div>
        <span className="fn-chart-label">Net cash position</span>
        <b className="tnum">{CUR} 42.8M</b>
      </div>
      <span className="fn-legend"><i /> Actual <i className="ghost" /> Forecast</span>
    </div>
    <AreaChart
      series={[38, 44, 41, 52, 48, 61, 57, 68, 74, 71, 82, 88, 94]}
      forecastFrom={9}
      height={190}
    />
    <div className="fn-axis">
      {['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => <span key={m}>{m}</span>)}
    </div>
  </div>
);

const ApprovalFlow = () => (
  <div className="fn-flowwrap">
    <ModuleChrome title="Approval routing" tag="Policy v4" />
    <div className="fn-chain">
      {[
        ['Invoice captured', 'OCR matched to PO-8841', 'done'],
        ['Three-way match', 'PO · GRN · Invoice agree', 'done'],
        ['Cost centre owner', 'Approved in 4 minutes', 'done'],
        ['Finance controller', 'Awaiting · SLA 6h', 'live'],
        ['Payment run', 'Scheduled Thursday', 'next'],
      ].map(([t, m, state]) => (
        <div className={`fn-chain-row ${state}`} key={t}>
          <span className="fn-chain-node">{state === 'done' && <Check size={10} strokeWidth={3.5} />}</span>
          <span className="fn-txt"><b>{t}</b><i>{m}</i></span>
        </div>
      ))}
    </div>
  </div>
);

const RulesPanel = () => (
  <>
    <ModuleChrome title="Posting rules" tag="14 active" />
    <div className="fn-rules">
      {[
        ['Invoice under 50,000', 'Auto-approve on match', 'pos'],
        ['Price variance > 2%', 'Hold for controller', 'warn'],
        ['Intercompany', 'Match and eliminate', 'info'],
        ['FX revaluation', 'Run nightly at 02:00', 'pos'],
        ['Depreciation', 'Post on period close', 'pos'],
      ].map(([cond, act, tone]) => (
        <div className="fn-rule" key={cond}>
          <span className="fn-rule-when">{cond}</span>
          <GitBranch size={12} className="fn-dim" />
          <span className="fn-rule-then">{act}</span>
          <i className={`px-tag ${tone}`}>on</i>
        </div>
      ))}
    </div>
  </>
);

const LogPanel = ({ feed }) => (
  <>
    <ModuleChrome title="Execution log" tag="Live" />
    <div className="fn-log">
      <AnimatePresence initial={false}>
        {feed.map((f) => (
          <motion.div
            className="fn-log-row"
            key={f.id}
            layout
            initial={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="fn-log-dot" />
            <span className="fn-txt"><b>{f.text}</b><i>{f.meta}</i></span>
            <span className="px-mono fn-dim">{f.ms}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>
);

const EntityTree = () => (
  <>
    <ModuleChrome title="Group structure" tag="IFRS" />
    <div className="fn-tree">
      <div className="fn-tree-parent">
        <span className="fn-tree-ic"><Building2 size={14} /></span>
        <span className="fn-txt"><b>Emvive Holding</b><i>Consolidated · SAR</i></span>
      </div>
      {[
        ['Emvive KSA', 'SAR · 100%', '214M'],
        ['Emvive UAE', 'AED · 100%', '96M'],
        ['Emvive Qatar', 'QAR · 75%', '38M'],
        ['Emvive Logistics', 'SAR · 60%', '27M'],
      ].map(([n, m, v]) => (
        <div className="fn-tree-node" key={n}>
          <span className="fn-tree-line" aria-hidden="true" />
          <span className="fn-tree-body">
            <span className="fn-txt"><b>{n}</b><i>{m}</i></span>
            <span className="fn-amt tnum">{CUR} {v}</span>
          </span>
        </div>
      ))}
    </div>
  </>
);

const StatementPanel = () => (
  <>
    <ModuleChrome title="Consolidated P&L" tag="Q4 FY25" />
    <div className="fn-stmt">
      {[
        ['Revenue', '1,284,500', 100, false],
        ['Cost of sales', '(742,900)', 58, false],
        ['Gross profit', '541,600', 42, true],
        ['Operating expenses', '(298,400)', 23, false],
        ['EBITDA', '243,200', 19, true],
        ['Net profit', '238,900', 18.6, true],
      ].map(([label, amt, pct, strong]) => (
        <div className={`fn-stmt-row ${strong ? 'strong' : ''}`} key={label}>
          <span>{label}</span>
          <span className="px-mono fn-stmt-amt">{amt}</span>
          <Meter value={pct} />
        </div>
      ))}
      <div className="fn-stmt-foot">
        <span>Eliminations applied · 4 entities</span>
        <span className="px-tag pos">Balanced</span>
      </div>
    </div>
  </>
);

/* =====================================================================
   ACT II — THE MORPH
   One canvas, five configurations. Modules are declared once and simply
   given a different grid area per beat; Framer FLIPs them between them.
   ===================================================================== */

const BEATS = [
  {
    kicker: 'Record',
    title: 'Everything lands in one ledger.',
    body: 'Sales, procurement, payroll and inventory post directly. The trial balance is produced, never reassembled.',
  },
  {
    kicker: 'Analyse',
    title: 'The ledger becomes the analytics.',
    body: 'No warehouse, no nightly export. The chart you steer by is reading the journals you just posted.',
  },
  {
    kicker: 'Approve',
    title: 'Analytics become the workflow.',
    body: 'Variances raise themselves. Matching, thresholds and delegation decide who signs, and when.',
  },
  {
    kicker: 'Automate',
    title: 'The workflow becomes automation.',
    body: 'Rules run against live balances every night. Routine entries stop touching a person at all.',
  },
  {
    kicker: 'Report',
    title: 'Automation becomes the statutory pack.',
    body: 'Elimination, translation and consolidation are already done. The group report is a view, not a project.',
  },
];

/* module → grid area per beat. `null` means the module steps back. */
const LAYOUT = {
  rail: ['1/1/9/3', '1/1/9/3', '1/1/9/3', '1/1/9/3', '1/1/9/3'],
  kpis: ['1/3/3/13', '1/3/4/6', '1/3/3/8', null, null],
  table: ['3/3/9/13', '6/6/9/13', null, null, null],
  chart: ['1/13/9/13', '1/6/6/13', '1/8/3/13', null, null],
  flow: [null, null, '3/3/9/13', null, null],
  rules: [null, null, null, '1/3/9/8', null],
  log: [null, null, null, '1/8/9/13', null],
  tree: [null, null, null, null, '1/3/9/8'],
  stmt: [null, null, null, null, '1/8/9/13'],
};

/* where a hidden module parks — kept near where it will appear so the
   entrance reads as a slide rather than a pop */
const PARK = {
  kpis: '1/3/3/8', table: '5/3/9/13', chart: '1/8/5/13',
  flow: '3/3/9/13', rules: '1/3/9/8', log: '1/8/9/13',
  tree: '1/3/9/8', stmt: '1/8/9/13',
};

const area = (key, beat) => LAYOUT[key][beat] || PARK[key] || '1/1/2/2';
const shown = (key, beat) => Boolean(LAYOUT[key][beat]);

const FEED_POOL = [
  { text: 'Bank feed reconciled', meta: 'Al Rajhi · 412 lines', ms: '0.4s' },
  { text: 'Invoice cleared by ZATCA', meta: 'INV-2025-04412', ms: '0.9s' },
  { text: 'FX revaluation posted', meta: 'AED, QAR', ms: '1.2s' },
  { text: 'Intercompany matched', meta: 'EM-DXB · 412,000', ms: '0.6s' },
  { text: 'Depreciation run complete', meta: '1,284 assets', ms: '2.1s' },
  { text: 'Payment run released', meta: '34 suppliers', ms: '0.8s' },
];

const makeFeed = (i) => ({ ...FEED_POOL[i % FEED_POOL.length], id: i });

const TheSystem = () => {
  const [live, liveRef] = useLive(
    { n: 0, cash: 42.8, dso: 31, margin: 18.6, feed: [0, 1, 2, 3].map(makeFeed) },
    (s) => {
      const n = s.n + 1;
      const w = Math.sin(n * 0.9) * 0.55 + Math.sin(n * 1.7) * 0.45;
      return {
        n,
        cash: 42.8 * (1 + w * 0.011),
        dso: Math.round(31 + w * 1.4),
        margin: 18.6 * (1 + w * 0.008),
        feed: [makeFeed(s.feed[0].id + 1), ...s.feed.slice(0, 3)],
      };
    },
    3200
  );

  return (
    <Pin count={BEATS.length} id="system">
      {({ beat }) => (
        <div className="fn-act" ref={liveRef}>
          <div className="fn-act-narr">
            <Narration beats={BEATS} beat={beat} count={BEATS.length} />
          </div>

          <div className="fn-act-canvas">
            <Canvas>
              <Module area={area('rail', beat)} show={shown('rail', beat)} className="fn-m-rail">
                <NavRail />
              </Module>

              <Module area={area('kpis', beat)} show={shown('kpis', beat)} className="fn-m-flush">
                <KpiStrip live={live} />
              </Module>

              <Module area={area('table', beat)} show={shown('table', beat)}>
                <ModuleChrome title="General ledger" tag="Auto-posted" />
                <LedgerTable rows={beat === 0 ? 8 : 4} />
              </Module>

              <Module area={area('chart', beat)} show={shown('chart', beat)}>
                <CashChart />
              </Module>

              <Module area={area('flow', beat)} show={shown('flow', beat)}>
                <ApprovalFlow />
              </Module>

              <Module area={area('rules', beat)} show={shown('rules', beat)}>
                <RulesPanel />
              </Module>

              <Module area={area('log', beat)} show={shown('log', beat)}>
                <LogPanel feed={live.feed} />
              </Module>

              <Module area={area('tree', beat)} show={shown('tree', beat)}>
                <EntityTree />
              </Module>

              <Module area={area('stmt', beat)} show={shown('stmt', beat)}>
                <StatementPanel />
              </Module>
            </Canvas>
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
  {
    k: 'Payables',
    title: 'Match before you pay',
    body: 'Three-way matching against the purchase order and goods receipt, with variances held rather than approved.',
    body2: '18 invoices awaiting approval',
    icon: Receipt,
  },
  {
    k: 'Receivables',
    title: 'Shorten the cash cycle',
    body: 'Credit limits enforced before dispatch, with reminder sequences that fire without a collector chasing them.',
    body2: 'DSO down from 40 to 31 days',
    icon: CreditCard,
  },
  {
    k: 'Treasury',
    title: 'Liquidity you can plan against',
    body: 'Bank feeds reconcile daily and roll into a thirteen-week forecast built from committed and expected flows.',
    body2: '4 banks · 3 currencies connected',
    icon: Landmark,
  },
  {
    k: 'Assets',
    title: 'Acquisition to disposal',
    body: 'Componentised assets with automated depreciation, revaluation and disposal posting straight to the ledger.',
    body2: '1,284 assets under management',
    icon: Building2,
  },
  {
    k: 'Tax',
    title: 'Cleared before it leaves',
    body: 'Every invoice signed, QR-stamped and cleared with the authority in under a second, response stored for audit.',
    body2: 'ZATCA Phase 2 certified',
    icon: ShieldCheck,
  },
];

const Gallery = () => (
  <HRail id="capabilities">
    <div className="fn-rail-intro">
      <ActRule label="The rest of the function" />
      <h2 className="stg-h2">Five more surfaces,<br />reading the same ledger.</h2>
      <p className="fn-rail-intro-p">Keep scrolling — this moves sideways.</p>
    </div>

    {RAIL_PANELS.map(({ k, title, body, body2, icon: Icon }, i) => (
      <article className="fn-rpanel" key={k}>
        <header>
          <span className="fn-rpanel-n">{String(i + 1).padStart(2, '0')}</span>
          <span className="fn-rpanel-ic"><Icon size={17} strokeWidth={1.7} /></span>
        </header>
        <h3>{title}</h3>
        <p>{body}</p>
        <footer>
          <span className="fn-rpanel-stat">{body2}</span>
        </footer>
      </article>
    ))}
  </HRail>
);

/* =====================================================================
   ACT IV — CONTROLS, on a cursor-lit dark surface
   ===================================================================== */

const Controls = () => (
  <section className="fn-controls">
    <Spotlight className="fn-controls-panel">
      <div className="fn-controls-head">
        <Reveal><span className="fn-kicker dark"><span className="fn-kicker-dot" /> Controls &amp; assurance</span></Reveal>
        <MaskText
          text="Every field that changes leaves a record."
          as="h2"
          className="stg-h2"
        />
      </div>

      <div className="fn-controls-grid">
        {[
          [Lock, 'Segregation of duties', 'Maker and checker are enforced per entity, and an administrator cannot quietly bypass it.'],
          [ShieldCheck, 'Immutable audit trail', 'User, timestamp, device, before and after values — on every create, edit and deletion.'],
          [Layers, 'Period locks', 'Closed periods reject postings outright rather than warning and letting them through.'],
          [Database, 'Data residency', 'Saudi Arabia, the UAE or India. Private cloud where shared infrastructure is ruled out.'],
        ].map(([Icon, t, d], i) => (
          <Reveal className="fn-control" delay={i * 0.07} key={t}>
            <Icon size={18} strokeWidth={1.6} />
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>
    </Spotlight>
  </section>
);

/* =====================================================================
   ACT V — SCALE
   ===================================================================== */

const Scale = () => (
  <section className="fn-scale">
    <div className="fn-scale-inner">
      <ActRule label="Enterprise scale" />
      <MaskText
        text="What changes in the first year."
        as="h2"
        className="stg-h2"
      />

      <div className="fn-scale-rows">
        {[
          { v: 16, suffix: ' days', pre: '−', label: 'Removed from the month-end close', sub: 'From nineteen days to three, across seven legal entities' },
          { v: 42, suffix: '%', label: 'Fewer manual journal entries', sub: 'Posting rules absorb the routine work within the first quarter' },
          { v: 4.2, decimals: 1, prefix: `${CUR} `, suffix: 'M', label: 'Working capital released', sub: 'Recovered from a shorter cash cycle and tighter credit control' },
          { v: 99.8, decimals: 1, suffix: '%', label: 'Cleared on first submission', sub: 'Signed, stamped and accepted by the authority in under a second' },
        ].map((s) => (
          <Reveal className="fn-scale-row" key={s.label}>
            <b>
              {s.pre}
              <ScrollNumber to={s.v} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix} />
            </b>
            <div>
              <h3>{s.label}</h3>
              <p>{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* =====================================================================
   ACT VI — ARCHITECTURE
   ===================================================================== */

const Architecture = () => (
  <section className="fn-arch">
    <div className="fn-arch-inner">
      <ActRule label="Connected" />
      <MaskText text="One ledger, wired to everything else." as="h2" className="stg-h2" />

      <div className="fn-arch-diagram">
        {[
          ['Sources', [[Landmark, 'Bank feeds'], [Receipt, 'Supplier invoices'], [CreditCard, 'Payment gateways']]],
          ['Emvive Finance', [[BookOpen, 'General ledger'], [Zap, 'Posting rules'], [Lock, 'Controls']]],
          ['Consumers', [[ChartPie, 'Power BI'], [ShieldCheck, 'ZATCA'], [TrendingUp, 'Board reporting']]],
        ].map(([col, items], ci) => (
          <React.Fragment key={col}>
            {ci > 0 && (
              <div className="fn-arch-wire" aria-hidden="true">
                <motion.i
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2.4, delay: ci * 0.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                />
              </div>
            )}
            <Reveal className={`fn-arch-col ${ci === 1 ? 'core' : ''}`} delay={ci * 0.1}>
              <span className="fn-arch-col-label">{col}</span>
              {items.map(([Icon, label]) => (
                <div className="fn-arch-item" key={label}>
                  <Icon size={14} strokeWidth={1.7} /> {label}
                </div>
              ))}
            </Reveal>
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

/* =====================================================================
   ACT VII — PROOF
   ===================================================================== */

const Proof = () => (
  <section className="fn-proof">
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
            <span className="fn-txt">
              <b>Rania Haddad</b>
              <i>Group Financial Controller, Horizon Holding</i>
            </span>
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
          <ModuleChrome title="Close velocity" tag="Horizon Holding" />
          <div className="fn-proof-bars">
            <LiveBars values={[19, 17, 14, 12, 9, 7, 5, 4, 3, 3, 3, 3]} height={140} />
          </div>
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

/* ===================================================================== */
const Finance = () => (
  <ProductPage accent="#0a8f5e" accent2="#07724b" wash="rgba(10,143,94,0.09)" className="fn">
    <SubNav
      icon={Wallet}
      name="Emvive Finance"
      links={[
        { href: '#system', label: 'The system' },
        { href: '#capabilities', label: 'Capabilities' },
        { href: '#scale', label: 'Outcomes' },
      ]}
    />

    <Overture />
    <TheSystem />
    <Gallery />
    <Controls />
    <div id="scale"><Scale /></div>
    <Architecture />
    <Proof />

    <ClosingCta
      label="Emvive Finance"
      title="See your own close on Emvive."
      lede="Bring a recent trial balance. We will show you exactly how it posts, consolidates and reports."
      primary="Book a demo"
      secondary="Talk to sales"
    />

    <Footer />
  </ProductPage>
);

export default Finance;
