import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Search, Bell, ChevronDown, ChevronRight, SlidersHorizontal, Plus, X,
  BookOpen, Receipt, CreditCard, Wallet, Building2, Percent, ChartPie,
  FileText, Star, Check, Sparkles, MessageSquare, Paperclip, MoreHorizontal,
  ArrowUpRight, CornerDownLeft, Command, Zap, GitBranch, ShieldCheck,
  CircleCheckBig, Clock, TrendingUp, Landmark,
} from 'lucide-react';
import { motion, EASE } from '../shared/motion';
import { AreaChart, Spark, Meter, Ring } from '../shared/viz';

/* =====================================================================
   THE APPLICATION
   Not a dashboard. An application shell — workspace switcher, command
   bar, breadcrumbs, filter chips, a table with expandable rows and
   assignees, a right-hand inspector with an activity timeline, and
   floating layers (palette, toasts, insight cards) that sit above it.

   The shell persists across every beat of the scroll. Only the work
   area changes, which is what makes it read as one piece of software.
   ===================================================================== */

const CUR = 'SAR';

/* ---------------------------------------------------------------
   SIDEBAR
   --------------------------------------------------------------- */
export const Sidebar = () => (
  <div className="ap-side">
    <button className="ap-ws">
      <span className="ap-ws-mark">EM</span>
      <span className="ap-txt"><b>Emvive Group</b><i>7 entities · SAR</i></span>
      <ChevronDown size={13} className="ap-mute" />
    </button>

    <div className="ap-search">
      <Search size={12} />
      <span>Search</span>
      <kbd>⌘K</kbd>
    </div>

    <nav className="ap-nav">
      <span className="ap-nav-label">Finance</span>
      {[
        [ChartPie, 'Overview', null, true],
        [BookOpen, 'General ledger', '1,284', false],
        [Receipt, 'Payables', '18', false],
        [CreditCard, 'Receivables', '42', false],
        [Wallet, 'Cash & banking', null, false],
        [Building2, 'Fixed assets', null, false],
        [Percent, 'Tax & e-invoicing', '3', false],
        [FileText, 'Reports', null, false],
      ].map(([Icon, label, badge, on]) => (
        <span className={`ap-nav-item ${on ? 'on' : ''}`} key={label}>
          <Icon size={13} strokeWidth={1.8} />
          <span>{label}</span>
          {badge && <i className="ap-badge">{badge}</i>}
        </span>
      ))}

      <span className="ap-nav-label mt">Pinned</span>
      {[['Month-end close', '#0a8f5e'], ['Q4 board pack', '#d97706'], ['VAT return', '#2563eb']].map(([l, c]) => (
        <span className="ap-nav-item" key={l}>
          <i className="ap-pin-dot" style={{ background: c }} />
          <span>{l}</span>
          <Star size={11} className="ap-mute" />
        </span>
      ))}
    </nav>

    <div className="ap-side-foot">
      <span className="ap-avatar sm">RH</span>
      <span className="ap-txt"><b>Rania Haddad</b><i>Controller</i></span>
      <MoreHorizontal size={13} className="ap-mute" />
    </div>
  </div>
);

/* ---------------------------------------------------------------
   TOOLBAR — breadcrumbs, filters, presence
   --------------------------------------------------------------- */
export const Toolbar = ({ crumb = 'General ledger', filters = ['Period: Oct 2025', 'Entity: All', 'Status: Posted'] }) => (
  <div className="ap-bar">
    <div className="ap-crumbs">
      <span>Finance</span>
      <ChevronRight size={11} />
      <span className="on">{crumb}</span>
    </div>

    <div className="ap-filters">
      {filters.map((f) => (
        <span className="ap-chip" key={f}>{f}<X size={10} /></span>
      ))}
      <span className="ap-chip ghost"><Plus size={10} /> Filter</span>
      <span className="ap-chip ghost"><SlidersHorizontal size={10} /> View</span>
    </div>

    <div className="ap-bar-right">
      <span className="ap-faces">
        {['RH', 'MK', 'AS'].map((a, i) => (
          <i className="ap-avatar xs" key={a} style={{ zIndex: 3 - i }}>{a}</i>
        ))}
        <i className="ap-avatar xs more">+4</i>
      </span>
      <span className="ap-icon-btn"><Bell size={13} /><i className="ap-dot" /></span>
      <span className="ap-icon-btn"><Command size={13} /></span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   LEDGER TABLE — checkboxes, sort, expandable row, assignees
   --------------------------------------------------------------- */
const ROWS = [
  { id: 'JV-10428', acct: 'Revenue — Retail KSA', cc: 'CC-101', dr: '—', cr: '1,284,500', tone: 'pos', st: 'Posted', who: 'RH', dot: '#0a8f5e' },
  { id: 'JV-10429', acct: 'Trade receivables', cc: 'CC-101', dr: '1,284,500', cr: '—', tone: 'pos', st: 'Posted', who: 'RH', dot: '#0a8f5e' },
  {
    id: 'JV-10430', acct: 'FX revaluation — AED', cc: 'CC-204', dr: '18,240', cr: '—', tone: 'warn', st: 'In review', who: 'MK', dot: '#d97706',
    open: true,
    lines: [
      ['4210 · FX gain/loss', '18,240', '—'],
      ['1120 · Bank — AED', '—', '18,240'],
    ],
  },
  { id: 'JV-10431', acct: 'Depreciation — Fleet', cc: 'CC-330', dr: '96,700', cr: '—', tone: 'pos', st: 'Posted', who: 'AS', dot: '#0a8f5e' },
  { id: 'JV-10432', acct: 'Intercompany — EM-DXB', cc: 'CC-900', dr: '—', cr: '412,000', tone: 'info', st: 'Matching', who: 'MK', dot: '#2563eb' },
  { id: 'JV-10433', acct: 'Accrued expenses', cc: 'CC-204', dr: '54,120', cr: '—', tone: 'pos', st: 'Posted', who: 'RH', dot: '#0a8f5e' },
];

export const LedgerTable = ({ dense }) => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Journal entries</b>
      <span className="ap-tag mute">1,284</span>
      <div className="ap-panel-tools">
        <span className="ap-chip ghost sm">Group: Account</span>
        <MoreHorizontal size={13} className="ap-mute" />
      </div>
    </div>

    <div className="ap-table">
      <div className="ap-tr ap-thead">
        <span className="ap-check" />
        <span>Journal</span>
        <span>Account</span>
        <span className="r">Debit</span>
        <span className="r">Credit</span>
        <span>Status</span>
        <span />
      </div>

      {ROWS.slice(0, dense ? 3 : 6).map((r) => (
        <React.Fragment key={r.id}>
          <div className={`ap-tr ap-row ${r.open ? 'open' : ''}`}>
            <span className="ap-check"><i /></span>
            <span className="ap-mono ap-mute">{r.id}</span>
            <span className="ap-acct">
              {r.open ? <ChevronDown size={11} /> : <ChevronRight size={11} className="ap-caret" />}
              <i className="ap-dotc" style={{ background: r.dot }} />
              {r.acct}
              <em>{r.cc}</em>
            </span>
            <span className="ap-mono r">{r.dr}</span>
            <span className="ap-mono r">{r.cr}</span>
            <span><i className={`ap-tag ${r.tone}`}>{r.st}</i></span>
            <span className="ap-avatar xs">{r.who}</span>
          </div>

          {r.open && !dense && r.lines.map(([l, d, c]) => (
            <div className="ap-tr ap-subrow" key={l}>
              <span /><span />
              <span className="ap-sub">{l}</span>
              <span className="ap-mono r">{d}</span>
              <span className="ap-mono r">{c}</span>
              <span /><span />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>

    <div className="ap-panel-foot">
      <span><b>Balanced</b> · 1,453,560 Dr / 1,453,560 Cr</span>
      <span className="ap-tag pos"><Check size={9} strokeWidth={4} /> Trial balance clean</span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   INSPECTOR — record detail + activity timeline + comment
   --------------------------------------------------------------- */
export const Inspector = ({ mode = 'record', feed }) => (
  <div className="ap-panel ap-insp">
    <div className="ap-panel-bar">
      <b>{mode === 'record' ? 'JV-10430' : 'Activity'}</b>
      {mode === 'record' && <span className="ap-tag warn">In review</span>}
      <div className="ap-panel-tools"><X size={13} className="ap-mute" /></div>
    </div>

    {mode === 'record' && (
      <>
        <div className="ap-tabs">
          {['Details', 'Activity', 'Files'].map((t, i) => (
            <span className={i === 0 ? 'on' : ''} key={t}>{t}</span>
          ))}
        </div>
        <div className="ap-fields">
          {[['Entity', 'Emvive UAE'], ['Period', 'Oct 2025'], ['Source', 'FX revaluation run'], ['Prepared by', 'M. Khalid'], ['Amount', `${CUR} 18,240`]].map(([k, v]) => (
            <div key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
      </>
    )}

    <div className="ap-timeline">
      <span className="ap-sec-label">Activity</span>
      <AnimatePresence initial={false}>
        {(feed || []).map((f) => (
          <motion.div
            className="ap-tl-row"
            key={f.id}
            layout
            initial={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="ap-avatar xs">{f.who}</span>
            <span className="ap-txt"><b>{f.text}</b><i>{f.meta}</i></span>
            <span className="ap-mono ap-mute ap-when">{f.ago}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    <div className="ap-comment">
      <span className="ap-avatar xs">RH</span>
      <span className="ap-comment-input">Add a comment…</span>
      <Paperclip size={12} className="ap-mute" />
      <MessageSquare size={12} className="ap-mute" />
    </div>
  </div>
);

/* ---------------------------------------------------------------
   KPI WIDGETS
   --------------------------------------------------------------- */
export const KpiWidgets = ({ live }) => (
  <div className="ap-kpis">
    {[
      { k: 'Cash position', v: `${CUR} ${live.cash.toFixed(1)}M`, d: '+6.4%', up: true, s: [32, 38, 35, 44, 41, 52, 49, 58] },
      { k: 'Days sales outstanding', v: `${live.dso} days`, d: '−9 days', up: true, s: [58, 54, 49, 46, 42, 38, 34, 31] },
      { k: 'Net margin', v: `${live.margin.toFixed(1)}%`, d: '+2.1pp', up: true, s: [12, 14, 13, 16, 15, 17, 18, 19] },
    ].map((w) => (
      <div className="ap-kpi" key={w.k}>
        <div className="ap-kpi-top">
          <span>{w.k}</span>
          <MoreHorizontal size={12} className="ap-mute" />
        </div>
        <motion.b
          key={w.v}
          className="tnum"
          initial={{ opacity: 0.4, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {w.v}
        </motion.b>
        <div className="ap-kpi-bot">
          <i className={w.up ? 'up' : 'down'}>{w.d}</i>
          <Spark values={w.s} width={54} height={16} />
        </div>
      </div>
    ))}
  </div>
);

/* ---------------------------------------------------------------
   CHART PANEL — with range selector and footer stats
   --------------------------------------------------------------- */
export const ChartPanel = () => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Cash flow</b>
      <span className="ap-tag mute">Rolling 12 months</span>
      <div className="ap-panel-tools">
        {['1M', '3M', '12M', 'YTD'].map((r, i) => (
          <span className={`ap-range ${i === 2 ? 'on' : ''}`} key={r}>{r}</span>
        ))}
      </div>
    </div>
    <div className="ap-chart">
      <div className="ap-chart-head">
        <div>
          <b className="tnum">{CUR} 42.8M</b>
          <span className="ap-tag pos"><TrendingUp size={9} /> +2.4%</span>
        </div>
        <span className="ap-legend"><i /> Actual <i className="ghost" /> Forecast</span>
      </div>
      <AreaChart series={[38, 44, 41, 52, 48, 61, 57, 68, 74, 71, 82, 88, 94]} forecastFrom={9} height={148} />
      <div className="ap-axis">{['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => <span key={m}>{m}</span>)}</div>
    </div>
    <div className="ap-panel-foot">
      <span>Inflow <b className="tnum">{CUR} 9.2M</b></span>
      <span>Outflow <b className="tnum">{CUR} 6.8M</b></span>
      <span>Net <b className="tnum">{CUR} 2.4M</b></span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   APPROVAL WORKFLOW
   --------------------------------------------------------------- */
export const ApprovalPanel = () => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Approval routing</b>
      <span className="ap-tag mute">Policy v4</span>
      <div className="ap-panel-tools"><span className="ap-chip ghost sm">SLA 6h</span></div>
    </div>
    <div className="ap-chain">
      {[
        ['Invoice captured', 'OCR matched to PO-8841', 'done', 'RH'],
        ['Three-way match', 'PO · GRN · Invoice agree', 'done', null],
        ['Cost centre owner', 'Approved in 4 minutes', 'done', 'AS'],
        ['Finance controller', 'Awaiting · 2h 14m left', 'live', 'MK'],
        ['Payment run', 'Scheduled Thursday', 'next', null],
      ].map(([t, m, state, who]) => (
        <div className={`ap-chain-row ${state}`} key={t}>
          <span className="ap-chain-node">{state === 'done' && <Check size={9} strokeWidth={4} />}</span>
          <span className="ap-txt"><b>{t}</b><i>{m}</i></span>
          {who && <span className="ap-avatar xs">{who}</span>}
          {state === 'live' && <span className="ap-tag warn">Pending</span>}
        </div>
      ))}
    </div>
    <div className="ap-panel-foot">
      <span>Average clearance <b>4.2h</b></span>
      <span className="ap-tag pos">98% within SLA</span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   RULES + EXECUTION LOG
   --------------------------------------------------------------- */
export const RulesPanel = () => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Posting rules</b>
      <span className="ap-tag mute">14 active</span>
      <div className="ap-panel-tools"><span className="ap-chip ghost sm"><Plus size={10} /> Rule</span></div>
    </div>
    <div className="ap-rules">
      {[
        ['Invoice under 50,000', 'Auto-approve on match', 1284],
        ['Price variance > 2%', 'Hold for controller', 42],
        ['Intercompany', 'Match and eliminate', 318],
        ['FX revaluation', 'Run nightly at 02:00', 30],
        ['Depreciation', 'Post on period close', 12],
      ].map(([cond, act, runs]) => (
        <div className="ap-rule" key={cond}>
          <span className="ap-rule-when"><Zap size={10} />{cond}</span>
          <GitBranch size={10} className="ap-mute" />
          <span className="ap-rule-then">{act}</span>
          <span className="ap-mono ap-mute">{runs}×</span>
          <i className="ap-switch" />
        </div>
      ))}
    </div>
  </div>
);

export const LogPanel = ({ feed }) => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Execution log</b>
      <span className="ap-tag pos"><i className="ap-live" />Live</span>
      <div className="ap-panel-tools"><span className="ap-chip ghost sm">Last 24h</span></div>
    </div>
    <div className="ap-log">
      <AnimatePresence initial={false}>
        {feed.map((f) => (
          <motion.div
            className="ap-log-row"
            key={f.id}
            layout
            initial={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="ap-log-ic"><CircleCheckBig size={11} /></span>
            <span className="ap-txt"><b>{f.text}</b><i>{f.meta}</i></span>
            <span className="ap-mono ap-mute">{f.ms}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
    <div className="ap-panel-foot">
      <span>1,284 runs today</span>
      <span className="ap-tag pos">99.97% success</span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   GROUP STRUCTURE + STATEMENT
   --------------------------------------------------------------- */
export const TreePanel = () => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Group structure</b>
      <span className="ap-tag mute">IFRS</span>
      <div className="ap-panel-tools"><span className="ap-chip ghost sm">Oct 2025</span></div>
    </div>
    <div className="ap-tree">
      <div className="ap-tree-parent">
        <span className="ap-tree-ic"><Building2 size={13} /></span>
        <span className="ap-txt"><b>Emvive Holding</b><i>Consolidated · SAR</i></span>
        <span className="ap-tag pos">Eliminated</span>
      </div>
      {[
        ['Emvive KSA', 'SAR · 100%', '214M', 100],
        ['Emvive UAE', 'AED · 100%', '96M', 78],
        ['Emvive Qatar', 'QAR · 75%', '38M', 46],
        ['Emvive Logistics', 'SAR · 60%', '27M', 32],
      ].map(([n, m, v, pct], i) => (
        <div className="ap-tree-node" key={n}>
          <span className="ap-tree-line" aria-hidden="true" />
          <span className="ap-tree-body">
            <span className="ap-txt"><b>{n}</b><i>{m}</i></span>
            <span className="ap-mono ap-amt">{CUR} {v}</span>
            <Meter value={pct} delay={i * 0.08} />
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const StatementPanel = () => (
  <div className="ap-panel">
    <div className="ap-panel-bar">
      <b>Consolidated P&amp;L</b>
      <span className="ap-tag mute">Q4 FY25</span>
      <div className="ap-panel-tools">
        <span className="ap-chip ghost sm"><ArrowUpRight size={10} /> Export</span>
      </div>
    </div>
    <div className="ap-stmt">
      {[
        ['Revenue', '1,284,500', 100, false],
        ['Cost of sales', '(742,900)', 58, false],
        ['Gross profit', '541,600', 42, true],
        ['Operating expenses', '(298,400)', 23, false],
        ['EBITDA', '243,200', 19, true],
        ['Net profit', '238,900', 18.6, true],
      ].map(([label, amt, pct, strong]) => (
        <div className={`ap-stmt-row ${strong ? 'strong' : ''}`} key={label}>
          <span>{label}</span>
          <span className="ap-mono">{amt}</span>
          <Meter value={pct} />
        </div>
      ))}
    </div>
    <div className="ap-panel-foot">
      <span>4 entities · eliminations applied</span>
      <span className="ap-tag pos">Balanced</span>
    </div>
  </div>
);

/* =====================================================================
   FLOATING LAYERS — these sit above the shell, not inside the grid
   ===================================================================== */

export const AiCard = () => (
  <div className="ap-float ap-ai">
    <div className="ap-ai-head">
      <span className="ap-ai-ic"><Sparkles size={12} /></span>
      <b>Insight</b>
      <span className="ap-tag accent">New</span>
      <X size={12} className="ap-mute" />
    </div>
    <p>
      Receivables from <b>Delta Foods</b> are ageing past 60 days while their
      order volume is up 18%. Credit exposure is trending outside policy.
    </p>
    <div className="ap-ai-actions">
      <span className="ap-btn-sm solid">Review exposure</span>
      <span className="ap-btn-sm">Dismiss</span>
    </div>
  </div>
);

export const Toast = () => (
  <div className="ap-float ap-toast">
    <span className="ap-toast-ic"><ShieldCheck size={13} /></span>
    <span className="ap-txt">
      <b>Cleared by ZATCA</b>
      <i>INV-2025-04412 · signed in 0.9s</i>
    </span>
    <span className="ap-toast-bar"><i /></span>
  </div>
);

export const Palette = () => (
  <div className="ap-float ap-palette">
    <div className="ap-pal-input">
      <Search size={13} className="ap-mute" />
      <span>post journal<i className="ap-caretblink" /></span>
      <kbd>esc</kbd>
    </div>
    <div className="ap-pal-body">
      <span className="ap-sec-label">Actions</span>
      {[
        [BookOpen, 'Post journal entry', '⌘ J'],
        [Receipt, 'Create supplier invoice', '⌘ I'],
        [Clock, 'Run period close', null],
      ].map(([Icon, label, kb], i) => (
        <div className={`ap-pal-row ${i === 0 ? 'on' : ''}`} key={label}>
          <Icon size={13} />
          <span>{label}</span>
          {kb ? <kbd>{kb}</kbd> : <CornerDownLeft size={11} className="ap-mute" />}
        </div>
      ))}
      <span className="ap-sec-label">Recent</span>
      {[[Landmark, 'Bank reconciliation — Al Rajhi'], [Percent, 'VAT return Q4']].map(([Icon, label]) => (
        <div className="ap-pal-row" key={label}>
          <Icon size={13} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

export const CloseWidget = () => (
  <div className="ap-float ap-close">
    <div className="ap-close-head">
      <Ring value={86} size={38} stroke={3.5} label="86" />
      <span className="ap-txt"><b>Month-end close</b><i>3 days projected</i></span>
    </div>
    {[['Bank reconciliation', 'done'], ['Accruals', 'done'], ['FX revaluation', 'live'], ['Consolidation', 'next']].map(([l, s]) => (
      <div className={`ap-close-row ${s}`} key={l}>
        <span className="ap-close-dot">{s === 'done' && <Check size={8} strokeWidth={4} />}</span>
        {l}
      </div>
    ))}
  </div>
);
