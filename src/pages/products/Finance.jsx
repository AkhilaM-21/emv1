import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Wallet, BookOpen, Receipt, CreditCard, Landmark, Building2, Percent,
  FileText, ShieldCheck, Layers, Sparkles, ArrowUpRight, Check,
  TrendingUp, ChartPie, Lock, Database, Banknote,
} from 'lucide-react';
import {
  motion, Reveal, Stagger, StaggerItem, MaskText, useLive, EASE,
} from './motion';
import {
  ProductPage, SubNav, Hero, SectionHead, Chrome, HairGrid, StatRow,
  Story, Split, ClosingCta, Footer,
} from './system';
import { AreaChart, LiveBars, Spark, Ring, Meter } from './viz';
import './Finance.css';

/* ISO code rather than the riyal glyph, which does not render in every
   font the product ships with. Finance teams read the code anyway. */
const CUR = 'SAR';
const money = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });

/* =====================================================================
   HERO — the CFO workspace. Numbers drift, the approval queue clears
   itself, and the activity feed writes new lines while you read.
   ===================================================================== */

const APPROVAL_POOL = [
  { vendor: 'Al Faisal Trading', ref: 'PO-8841 · 3-way matched', amount: '184,200', tone: 'ok' },
  { vendor: 'Nexa Components', ref: 'PO-8902 · 3-way matched', amount: '311,450', tone: 'ok' },
  { vendor: 'Gulf Logistics', ref: 'Price variance 2.4%', amount: '42,890', tone: 'warn' },
  { vendor: 'Orbit Textiles', ref: 'PO-8917 · 3-way matched', amount: '94,300', tone: 'ok' },
  { vendor: 'Delta Chemicals', ref: 'Contract renewal', amount: '128,700', tone: 'ok' },
  { vendor: 'Meridian Facilities', ref: 'Awaiting GRN', amount: '61,040', tone: 'warn' },
];

const FEED_POOL = [
  'Bank feed reconciled — Al Rajhi ·· 412 lines',
  'Invoice INV-2025-04412 cleared by ZATCA',
  'FX revaluation posted — AED, QAR',
  'Intercompany EM-DXB matched — 412,000',
  'Depreciation run completed — 1,284 assets',
  'Budget variance alert — Technology +18%',
  'Payment run released — 34 suppliers',
];

const makeApproval = (i) => ({ ...APPROVAL_POOL[i % APPROVAL_POOL.length], id: i });
const makeFeed = (i) => ({ text: FEED_POOL[i % FEED_POOL.length], id: i });

const NAV = [
  [ChartPie, 'Overview', true], [BookOpen, 'General ledger', false],
  [Receipt, 'Payables', false], [CreditCard, 'Receivables', false],
  [Wallet, 'Cash & banking', false], [Building2, 'Fixed assets', false],
  [Percent, 'Tax & e-invoicing', false], [FileText, 'Reports', false],
];

const Workspace = () => {
  /* one interval drives every live surface, so they stay in step */
  const [tick, liveRef] = useLive(
    {
      n: 0,
      cash: 42.8,
      dso: 31,
      margin: 18.6,
      bars: [58, 44, 71, 52, 83, 66, 92, 74, 88, 61, 79, 95],
      approvals: [0, 1, 2, 3].map(makeApproval),
      feed: [0, 1, 2].map(makeFeed),
    },
    (s) => {
      const n = s.n + 1;
      const wave = Math.sin(n * 0.9) * 0.55 + Math.sin(n * 1.7) * 0.45;
      const bars = [...s.bars.slice(1), Math.round(52 + Math.abs(wave) * 44)];
      return {
        n,
        cash: 42.8 * (1 + wave * 0.011),
        dso: Math.round(31 + wave * 1.4),
        margin: 18.6 * (1 + wave * 0.008),
        bars,
        approvals: [...s.approvals.slice(1), makeApproval(s.approvals[s.approvals.length - 1].id + 1)],
        feed: [makeFeed(s.feed[0].id + 1), ...s.feed.slice(0, 2)],
      };
    },
    3400
  );

  return (
    <div className="fx-ws" ref={liveRef}>
      <aside className="fx-rail">
        <div className="fx-rail-org">
          <span className="fx-rail-mark">EM</span>
          <span className="fx-txt"><b>Emvive Group</b><i>7 entities · SAR</i></span>
        </div>
        <nav>
          {NAV.map(([Icon, label, on]) => (
            <span className={`fx-rail-item ${on ? 'on' : ''}`} key={label}>
              <Icon size={14} strokeWidth={1.7} /> {label}
            </span>
          ))}
        </nav>
        <div className="fx-rail-foot">
          <span className="px-tag pos">Period open</span>
          <i>Oct 2025</i>
        </div>
      </aside>

      <div className="fx-main">
        <header className="fx-head">
          <div>
            <h4>Financial control</h4>
            <p>Consolidated · all entities · FY 2025</p>
          </div>
          <div className="fx-head-tools">
            <span className="px-chrome-tag">Q4 FY25</span>
            <span className="px-chrome-tag"><span className="px-live" /> Live</span>
          </div>
        </header>

        <div className="fx-kpis">
          {[
            { k: 'Cash position', v: `${CUR} ${money(tick.cash)}M`, d: '+6.4%', up: true, s: [32, 38, 35, 44, 41, 52, 49, 58] },
            { k: 'Days sales outstanding', v: `${tick.dso} days`, d: '−9 days', up: true, s: [58, 54, 49, 46, 42, 38, 34, 31] },
            { k: 'Net margin', v: `${tick.margin.toFixed(1)}%`, d: '+2.1pp', up: true, s: [12, 14, 13, 16, 15, 17, 18, 19] },
            { k: 'Unposted journals', v: '4', d: '−128', up: true, s: [88, 62, 44, 31, 22, 14, 8, 4] },
          ].map((kpi) => (
            <div className="fx-kpi" key={kpi.k}>
              <span className="fx-kpi-k">{kpi.k}</span>
              <motion.b
                key={kpi.v}
                className="fx-kpi-v tnum"
                initial={{ opacity: 0.35, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {kpi.v}
              </motion.b>
              <span className="fx-kpi-row">
                <i className={kpi.up ? 'up' : 'down'}>{kpi.d}</i>
                <Spark values={kpi.s} width={56} height={18} />
              </span>
            </div>
          ))}
        </div>

        <div className="fx-body">
          <section className="fx-panel fx-panel-chart">
            <div className="fx-panel-head">
              <h5>Cash flow</h5>
              <span className="fx-legend"><i /> Actual <i className="ghost" /> Forecast</span>
            </div>
            <AreaChart series={[38, 44, 41, 52, 48, 61, 57, 68, 74, 71, 82, 88, 94]} forecastFrom={9} height={132} />
            <div className="fx-axis">
              {['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => <span key={m}>{m}</span>)}
            </div>
          </section>

          <section className="fx-panel">
            <div className="fx-panel-head">
              <h5>Approvals</h5>
              <span className="px-tag accent">{tick.approvals.length} queued</span>
            </div>
            <div className="fx-queue">
              <AnimatePresence initial={false} mode="popLayout">
                {tick.approvals.map((a) => (
                  <motion.div
                    className="fx-queue-row"
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 26, transition: { duration: 0.34, ease: EASE } }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <span className="fx-avatar">{a.vendor.slice(0, 2).toUpperCase()}</span>
                    <span className="fx-txt"><b>{a.vendor}</b><i>{a.ref}</i></span>
                    <span className="fx-amt tnum">{CUR} {a.amount}</span>
                    <span className={`px-tag ${a.tone === 'ok' ? 'pos' : 'warn'}`}>
                      {a.tone === 'ok' ? 'Ready' : 'Held'}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="fx-panel">
            <div className="fx-panel-head">
              <h5>Spend by cost centre</h5>
              <span className="px-chrome-tag">12 weeks</span>
            </div>
            <LiveBars values={tick.bars} height={92} highlightFrom={9} />
            <div className="fx-panel-foot">
              <span>Committed <b className="tnum">{CUR} 8.4M</b></span>
              <span>Budget <b className="tnum">{CUR} 9.1M</b></span>
            </div>
          </section>

          <section className="fx-panel fx-panel-feed">
            <div className="fx-panel-head">
              <h5>Activity</h5>
              <Ring value={86} size={34} stroke={3} label="86" />
            </div>
            <div className="fx-feed">
              <AnimatePresence initial={false}>
                {tick.feed.map((f) => (
                  <motion.div
                    className="fx-feed-row"
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <span className="fx-feed-dot" />
                    {f.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   STORY PANELS
   ===================================================================== */

const LedgerPanel = () => (
  <Chrome title="General ledger" tags={['Auto-posted']}>
    <div className="fx-sheet">
      <div className="fx-tr fx-th"><span>Journal</span><span>Account</span><span>Debit</span><span>Credit</span><span /></div>
      {[
        ['JV-10428', 'Revenue — Retail KSA', '—', '1,284,500', 'pos', 'Posted'],
        ['JV-10429', 'Trade receivables', '1,284,500', '—', 'pos', 'Posted'],
        ['JV-10430', 'FX revaluation — AED', '18,240', '—', 'warn', 'Review'],
        ['JV-10431', 'Depreciation — Fleet', '96,700', '—', 'pos', 'Posted'],
        ['JV-10432', 'Intercompany — EM-DXB', '—', '412,000', 'info', 'Matching'],
        ['JV-10433', 'Accrued expenses', '54,120', '—', 'pos', 'Posted'],
      ].map(([id, acct, dr, cr, tone, status], i) => (
        <motion.div
          className="fx-tr" key={id}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
        >
          <span className="px-mono fx-dim">{id}</span>
          <span>{acct}</span>
          <span className="px-mono num">{dr}</span>
          <span className="px-mono num">{cr}</span>
          <span><i className={`px-tag ${tone}`}>{status}</i></span>
        </motion.div>
      ))}
      <div className="fx-sheet-foot">
        <span>Balanced · <b className="px-mono">1,453,560</b> Dr / <b className="px-mono">1,453,560</b> Cr</span>
        <span className="px-tag pos">Trial balance clean</span>
      </div>
    </div>
  </Chrome>
);

const ApprovalPanel = () => (
  <Chrome title="Approval routing" tags={['Policy v4']}>
    <div className="fx-pane">
      <div className="fx-chain">
        {[
          ['Invoice received', 'Captured & OCR matched', 'done'],
          ['Three-way match', 'PO · GRN · Invoice', 'done'],
          ['Cost centre owner', 'Approved · 4 min', 'done'],
          ['Finance controller', 'Awaiting · SLA 6h', 'live'],
          ['Payment run', 'Scheduled Thursday', 'next'],
        ].map(([title, meta, state], i) => (
          <motion.div
            className={`fx-chain-row ${state}`} key={title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
          >
            <span className="fx-chain-node">{state === 'done' && <Check size={10} strokeWidth={3.5} />}</span>
            <span className="fx-txt"><b>{title}</b><i>{meta}</i></span>
          </motion.div>
        ))}
      </div>
      <div className="fx-callout">
        <Sparkles size={14} /> Invoices above 50,000 route to the controller. Everything below clears on the match.
      </div>
    </div>
  </Chrome>
);

const ForecastPanel = () => (
  <Chrome title="Liquidity forecast" tags={['13 weeks']}>
    <div className="fx-pane">
      <div className="fx-banks">
        {[
          ['Al Rajhi Bank', 'SAR · Operating', '18.4M'],
          ['Emirates NBD', 'AED · Operating', '6.9M'],
          ['SAB', 'SAR · Payroll', '4.2M'],
        ].map(([bank, meta, bal], i) => (
          <div className="fx-bank" key={bank}>
            <span className="fx-bank-ic"><Landmark size={13} /></span>
            <span className="fx-txt"><b>{bank}</b><i>{meta}</i></span>
            <span className="fx-amt tnum">{CUR} {bal}</span>
            <Meter value={[82, 54, 38][i]} delay={i * 0.1} />
          </div>
        ))}
      </div>
      <AreaChart series={[42, 55, 38, 64, 71, 49, 82, 60, 74, 88, 66, 92, 79]} forecastFrom={8} height={112} />
      <div className="fx-panel-foot">
        <span>Week 13 projected <b className="tnum">{CUR} 51.2M</b></span>
        <span className="px-tag pos">Covenant headroom 2.4×</span>
      </div>
    </div>
  </Chrome>
);

const ClosePanel = () => (
  <Chrome title="Continuous close" tags={['Day 3']}>
    <div className="fx-pane">
      <div className="fx-close-top">
        <Ring value={86} size={62} stroke={5} label="86%" />
        <div>
          <b>Close is 86% complete</b>
          <i>Projected finish in 3 days · 7 entities</i>
        </div>
      </div>
      <div className="fx-checks">
        {[
          ['Bank reconciliation', 'done'], ['Accruals & prepayments', 'done'],
          ['Intercompany matching', 'done'], ['FX revaluation', 'live'],
          ['Consolidation & elimination', 'next'], ['Statutory pack', 'next'],
        ].map(([label, state], i) => (
          <motion.div
            className={`fx-check ${state}`} key={label}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
          >
            <span className="fx-check-dot">{state === 'done' && <Check size={9} strokeWidth={4} />}</span>
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  </Chrome>
);

/* =====================================================================
   SPLIT VISUALS
   ===================================================================== */

const ConsolidationVisual = () => (
  <Chrome title="Group consolidation" tags={['IFRS']}>
    <div className="fx-pane">
      <div className="fx-parent">
        <span className="fx-parent-ic"><Building2 size={15} /></span>
        <span className="fx-txt"><b>Emvive Holding</b><i>Consolidated · SAR</i></span>
        <span className="px-tag pos">Eliminations applied</span>
      </div>
      <div className="fx-tree">
        {[
          ['Emvive KSA', 'SAR · 100%', '214M'],
          ['Emvive UAE', 'AED · 100%', '96M'],
          ['Emvive Qatar', 'QAR · 75%', '38M'],
          ['Emvive Logistics', 'SAR · 60%', '27M'],
        ].map(([name, meta, rev], i) => (
          <motion.div
            className="fx-node" key={name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: EASE }}
          >
            <span className="fx-node-line" aria-hidden="true" />
            <span className="fx-node-body">
              <span className="fx-txt"><b>{name}</b><i>{meta}</i></span>
              <span className="fx-amt tnum">{CUR} {rev}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </Chrome>
);

const TaxVisual = () => (
  <Chrome title="E-invoicing" tags={['ZATCA Phase 2']}>
    <div className="fx-pane">
      <div className="fx-invoice">
        <div className="fx-invoice-head">
          <div><span className="fx-invoice-label">Tax invoice</span><b>INV-2025-04412</b></div>
          <span className="fx-qr" aria-hidden="true">
            {Array.from({ length: 49 }).map((_, i) => (
              <i key={i} className={[0, 1, 2, 3, 6, 8, 12, 14, 16, 19, 21, 23, 25, 28, 30, 33, 35, 38, 40, 42, 44, 46, 48].includes(i) ? 'on' : ''} />
            ))}
          </span>
        </div>
        <div className="fx-invoice-grid">
          {[['Seller VAT', '3106••••00003'], ['Buyer VAT', '3009••••00007'], ['Issued', '05 Aug 2026'], ['Currency', 'SAR']].map(([k, v]) => (
            <div key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
        <div className="fx-invoice-total">
          <div><span>Subtotal</span><b className="px-mono">128,400.00</b></div>
          <div><span>VAT 15%</span><b className="px-mono">19,260.00</b></div>
          <div className="grand"><span>Total due</span><b className="px-mono">147,660.00</b></div>
        </div>
        <motion.div
          className="fx-stamp"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        >
          <ShieldCheck size={14} />
          <span><b>Cleared by ZATCA</b><i>Signed · UUID verified · 0.9s</i></span>
        </motion.div>
      </div>
    </div>
  </Chrome>
);

/* =====================================================================
   SECTION 5 — showcase with switchable windows
   ===================================================================== */

const SHOWCASE = [
  { key: 'P&L', label: 'Profit & loss', panel: <LedgerPanel /> },
  { key: 'Cash', label: 'Cash & treasury', panel: <ForecastPanel /> },
  { key: 'Close', label: 'Period close', panel: <ClosePanel /> },
  { key: 'Tax', label: 'Tax & compliance', panel: <TaxVisual /> },
];

const ShowcaseDeck = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="fx-deck">
      <div className="fx-deck-tabs" role="tablist">
        {SHOWCASE.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={active === i}
            className={active === i ? 'on' : ''}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {s.label}
            {active === i && (
              <motion.span className="fx-deck-underline" layoutId="fx-deck-underline" transition={{ duration: 0.45, ease: EASE }} />
            )}
          </button>
        ))}
      </div>

      <div className="fx-deck-stage">
        <div className="fx-deck-back" aria-hidden="true" />
        <div className="fx-deck-back2" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.div
            key={SHOWCASE[active].key}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {SHOWCASE[active].panel}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* =====================================================================
   SECTION 6 — integrations, drawn as an API flow
   ===================================================================== */

const FLOW_NODES = [
  { label: 'Bank feeds', icon: Landmark, x: 8, y: 16 },
  { label: 'ZATCA', icon: ShieldCheck, x: 8, y: 50 },
  { label: 'Payment gateways', icon: Banknote, x: 8, y: 84 },
  { label: 'Power BI', icon: ChartPie, x: 92, y: 16 },
  { label: 'Payroll & WPS', icon: Layers, x: 92, y: 50 },
  { label: 'Legacy ERP', icon: Database, x: 92, y: 84 },
];

const IntegrationFlow = () => (
  <div className="fx-flow">
    <svg className="fx-flow-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {FLOW_NODES.map((n, i) => {
        const left = n.x < 50;
        const d = `M${n.x},${n.y} C${left ? 32 : 68},${n.y} ${left ? 40 : 60},50 50,50`;
        return (
          <g key={n.label}>
            <path d={d} className="fx-wire" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={d}
              className="fx-wire-pulse"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0.14, pathOffset: 0 }}
              animate={{ pathOffset: [0, 0.86] }}
              transition={{ duration: 3.4, delay: i * 0.5, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        );
      })}
    </svg>

    {FLOW_NODES.map(({ label, icon: Icon, x, y }, i) => (
      <motion.div
        className="fx-flow-node"
        key={label}
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE }}
      >
        <span className="fx-flow-ic"><Icon size={15} strokeWidth={1.7} /></span>
        {label}
      </motion.div>
    ))}

    <motion.div
      className="fx-flow-core"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <b>Emvive Finance</b>
      <i>One ledger · REST &amp; webhooks</i>
    </motion.div>
  </div>
);

/* ===================================================================== */
const Finance = () => (
  <ProductPage
    accent="#059669"
    accent2="#047857"
    wash="rgba(5,150,105,0.09)"
    className="fx"
  >
    <SubNav
      icon={Wallet}
      name="Emvive Finance"
      links={[
        { href: '#story', label: 'How it works' },
        { href: '#capabilities', label: 'Capabilities' },
        { href: '#outcomes', label: 'Outcomes' },
        { href: '#showcase', label: 'Product' },
      ]}
    />

    <Hero
      eyebrow="New"
      note="Continuous close is generally available"
      title="Close the books while the month is still"
      accentWord="running."
      lede="One ledger for every entity, currency and regulator. Approvals route themselves and cash is forecast rather than guessed."
      primary="Book a demo"
      secondary="See how it works"
      trustedBy="In production today"
      meta={[
        { value: '3 days', label: 'Average group close, across seven entities' },
        { value: '99.8%', label: 'Invoices cleared on first submission' },
        { value: '18', label: 'Countries reporting on one ledger' },
      ]}
    >
      <Chrome title="app.emvive.com/finance" tags={['SAR', 'FY25']} live>
        <Workspace />
      </Chrome>
    </Hero>

    {/* ---- 02 · Product story, pinned ---- */}
    <section className="px-band-sm">
      <div className="px-shell">
        <SectionHead
          index="02"
          label="Product story"
          title="Four things stop being manual."
          lede="Scroll through a single month of finance operations. The workspace on the right is the same system at each stage."
        />
      </div>
    </section>

    <Story
      steps={[
        {
          title: 'Everything posts to one ledger',
          desc: 'Sales, procurement, payroll and inventory write directly into the general ledger. Journals are produced by the transaction that caused them, so the trial balance is never reassembled after the fact.',
          panel: <LedgerPanel />,
        },
        {
          title: 'Approvals route themselves',
          desc: 'Invoices match against the purchase order and goods receipt before a human sees them. Variances are held rather than paid, and thresholds decide who signs.',
          panel: <ApprovalPanel />,
        },
        {
          title: 'Cash is forecast, not guessed',
          desc: 'Bank feeds reconcile daily and roll into a thirteen-week liquidity view built from committed payables, expected receipts and your own scenarios.',
          panel: <ForecastPanel />,
        },
        {
          title: 'The close runs continuously',
          desc: 'Reconciliation, accruals and elimination run throughout the period. By the time you declare a close, most of it has already happened.',
          panel: <ClosePanel />,
        },
      ]}
    />

    {/* ---- 03 · Capabilities ---- */}
    <section className="px-band" id="capabilities">
      <div className="px-shell">
        <SectionHead
          index="03"
          label="Capabilities"
          title="The whole finance function, on one data model."
          lede="No bolt-on modules and no nightly sync between systems that disagree with each other."
        />
        <div style={{ marginTop: '4.5rem' }}>
          <HairGrid
            items={[
              { icon: BookOpen, title: 'General ledger', desc: 'Multi-entity, multi-currency accounts with dimensions carried on every posting.' },
              { icon: Receipt, title: 'Accounts payable', desc: 'Capture, three-way match and route approvals by amount, entity or cost centre.' },
              { icon: CreditCard, title: 'Accounts receivable', desc: 'Invoice, dun and collect on schedule, with credit limits enforced before dispatch.' },
              { icon: Wallet, title: 'Cash & treasury', desc: 'Bank feeds, same-day reconciliation and a rolling thirteen-week liquidity view.' },
              { icon: Building2, title: 'Fixed assets', desc: 'Acquisition to disposal with automated depreciation, revaluation and components.' },
              { icon: Percent, title: 'Tax & e-invoicing', desc: 'ZATCA Phase 1 and 2 clearance, VAT returns and withholding inside the document flow.' },
              { icon: Layers, title: 'Consolidation', desc: 'Intercompany elimination, FX translation and minority interest at group level.' },
              { icon: Lock, title: 'Controls & audit', desc: 'Segregation of duties, maker-checker approvals and an immutable field-level trail.' },
              { icon: TrendingUp, title: 'Planning', desc: 'Budgets on the same dimensions you post to, with forecasts refreshed nightly.' },
            ]}
          />
        </div>
      </div>
    </section>

    {/* ---- 04 · Depth ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <Split
          eyebrow="Group reporting"
          title="Consolidate seven entities as easily as one."
          body="Ownership, currencies and fiscal calendars are configured once. Group results are produced on demand instead of being assembled by hand at quarter end."
          points={[
            'Automatic intercompany elimination and matching',
            'FX translation at closing, average or historical rates',
            'Minority interest and partial ownership handled natively',
            'Drill from a consolidated figure to the source document',
          ]}
          link="See group reporting"
        >
          <ConsolidationVisual />
        </Split>

        <Split
          flip
          eyebrow="Compliance"
          title="Cleared before the invoice leaves the building."
          body="Every tax invoice is signed, QR-stamped and cleared with the authority in under a second, with the response stored against the document for audit."
          points={[
            'ZATCA Phase 1 and Phase 2 in the same document flow',
            'VAT returns produced from posted transactions, not exports',
            'Withholding and reverse charge applied by rule',
            'Authority response retained against every invoice',
          ]}
          link="Explore compliance"
        >
          <TaxVisual />
        </Split>
      </div>
    </section>

    {/* ---- 05 · Outcomes ---- */}
    <section className="px-band" id="outcomes">
      <div className="px-shell">
        <SectionHead
          index="05"
          label="Enterprise outcomes"
          title="What changes in the first year."
          lede="Measured across mid-market and enterprise finance teams that moved from a legacy ERP and spreadsheets."
        />

        <div style={{ marginTop: '4.5rem' }}>
          <StatRow
            stats={[
              { value: 16, prefix: '−', suffix: ' days', label: 'Removed from the month-end close' },
              { value: 42, suffix: '%', label: 'Fewer manual journal entries after go-live' },
              { value: 4.2, decimals: 1, prefix: 'SAR ', suffix: 'M', label: 'Working capital released in year one' },
              { value: 99.8, decimals: 1, suffix: '%', label: 'Invoices cleared on first submission' },
            ]}
          />
        </div>

        <div className="fx-timeline">
          {[
            ['Week 1', 'Connect', 'Chart of accounts, opening balances and bank feeds imported from the existing ERP.'],
            ['Week 4', 'Parallel run', 'One full period closed on both systems. The numbers are compared line by line before anyone commits.'],
            ['Week 8', 'Cutover', 'Approvals, matching thresholds and posting rules go live. Manual journals fall away first.'],
            ['Month 6', 'Compound', 'Continuous close, live consolidation and forecasting that no longer waits for a month-old export.'],
          ].map(([when, title, desc], i) => (
            <Reveal className="fx-tl-item" delay={i * 0.08} key={when}>
              <span className="fx-tl-when">{when}</span>
              <span className="fx-tl-dot" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* ---- 06 · Showcase ---- */}
    <section className="px-band px-band-alt" id="showcase">
      <div className="px-shell">
        <SectionHead
          index="06"
          label="Inside the product"
          title="Four surfaces your team lives in."
          lede="Hover to move between them. Every figure below is rendered from the same ledger."
        />
        <div style={{ marginTop: '4rem' }}>
          <ShowcaseDeck />
        </div>
      </div>
    </section>

    {/* ---- 07 · Integrations ---- */}
    <section className="px-band">
      <div className="px-shell">
        <SectionHead
          index="07"
          label="Connected"
          title="Fits the systems you already run."
          lede="Bank feeds, tax authorities, BI tools and the rest of the Emvive platform, without a middleware project."
        />
        <Reveal delay={0.1} y={26} style={{ marginTop: '4rem' }}>
          <IntegrationFlow />
        </Reveal>
      </div>
    </section>

    {/* ---- 08 · Customer success ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <div className="fx-case">
          <div>
            <Reveal><span className="px-eyebrow"><i className="idx">08</i> Customer success</span></Reveal>
            <MaskText
              text="We closed on day nineteen and argued about which spreadsheet was current. We now close on day three."
              as="blockquote"
              className="fx-quote"
            />
            <Reveal delay={0.2}>
              <div className="fx-quote-by">
                <span className="fx-quote-avatar">RH</span>
                <span className="fx-txt">
                  <b>Rania Haddad</b>
                  <i>Group Financial Controller, Horizon Holding</i>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <a href="#start" className="px-link" style={{ marginTop: '2.25rem' }}>
                Read the case study <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>

          <Stagger className="fx-case-metrics" gap={0.1}>
            {[
              ['−16 days', 'Faster month-end close'], ['4.2M', 'Working capital released'],
              ['7', 'Entities on one ledger'], ['0', 'Spreadsheets in the close pack'],
            ].map(([v, l]) => (
              <StaggerItem className="fx-case-metric" key={l}>
                <b>{v}</b>
                <span>{l}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>

    <ClosingCta
      label="Emvive Finance"
      title="See your own close on Emvive."
      lede="Bring a recent trial balance. We will show you exactly how it posts, consolidates and reports on the platform."
      primary="Book a demo"
      secondary="Talk to sales"
    />

    <Footer />
  </ProductPage>
);

export default Finance;
