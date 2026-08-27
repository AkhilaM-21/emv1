import React from 'react';
import {
  AlertTriangle, Bell, Braces, Calendar, Check, ChevronDown, ChevronRight, Clock,
  Code2, Copy, Eye, FileText, Filter, GitBranch, GripVertical, Hash, KeyRound,
  Link2, Mail, MoreHorizontal, MousePointerClick, Plus, RotateCw, Search, Send,
  Table2, Timer, Type, User, UserCheck, Wallet, Webhook, Zap,
} from 'lucide-react';

/* =====================================================================
   THE PRODUCT SHOTS

   Emvive's own screens, drawn in markup rather than pasted in as PNGs.
   There are no product screenshots in the repo, and a rebuilt screen
   beats an exported one here anyway: it stays sharp on any display, it
   reflows with the page, the type is real type, and a detail can be
   changed without going back to the app for a new capture.

   HOW THEY SCALE — this is the whole trick, and it is the same one the
   hero canvas uses. Every shot sits in a `.sh-body`, which is a
   container query. `.sh-root` inside it sets ONE font size, in `cqw` —
   a percentage of the body's own width — and every size below is an
   `em` off that. So the whole screen scales as a single unit, and its
   height comes from its own content rather than from a ratio that has
   to be guessed: nothing can crop, reflow or spill out of the frame at
   any width. Author it once and every breakpoint is free.

   The prefix is `sh-`.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE SURFACE

   NOT a browser window. It had three traffic-light dots, a rounded
   address pill and two fake buttons — skeuomorphic chrome that dates a
   page instantly and, worse, frames the product as a picture of an app
   rather than as the app. What is left is a hairline surface with one
   slim status strip: a live dot and the path in mono, the way a
   developer tool labels a pane. The screen itself is the hero.
   --------------------------------------------------------------- */
export const Frame = ({ path, chip, tone = 'light', className = '', children }) => (
  <div className={`sh-frame sh-frame--${tone} ${className}`}>
    {path && (
      <div className="sh-bar">
        <span className="sh-bar-dot" aria-hidden="true" />
        <span className="sh-path">{path}</span>
        {chip && <em>{chip}</em>}
      </div>
    )}

    <div className="sh-body">
      <div className="sh-root">{children}</div>
    </div>
  </div>
);

/* small shared pieces ------------------------------------------------ */

const Rail = ({ title, items, action }) => (
  <aside className="sh-rail">
    <div className="sh-rail-top">
      <span className="sh-search"><Search size={11} strokeWidth={2.2} />Search</span>
    </div>
    <p className="sh-rail-k">{title}</p>
    <ul className="sh-rail-list">
      {items.map((it) => (
        <li key={it.n} className={it.on ? 'is-on' : ''}>
          <span className="sh-rail-n">{it.n}</span>
          {it.c != null && <em>{it.c}</em>}
        </li>
      ))}
    </ul>
    {action && <span className="sh-rail-add"><Plus size={11} strokeWidth={2.4} />{action}</span>}
  </aside>
);

const Tabs = ({ items, on = 0 }) => (
  <div className="sh-tabs">
    {items.map((t, i) => (
      <span key={t} className={i === on ? 'is-on' : ''}>{t}</span>
    ))}
  </div>
);

const Head = ({ icon: Icon, title, sub, right }) => (
  <div className="sh-head">
    {Icon && <span className="sh-head-ic"><Icon size={13} strokeWidth={2.2} /></span>}
    <span className="sh-head-t">
      <b>{title}</b>
      {sub && <i>{sub}</i>}
    </span>
    {right && <span className="sh-head-r">{right}</span>}
  </div>
);

/* =====================================================================
   BUILD — OBJECTS.  The primary Build visual.
   ===================================================================== */
const OBJECTS = [
  { n: 'Customer', c: 14, on: true },
  { n: 'Sales Order', c: 22 },
  { n: 'Invoice', c: 19 },
  { n: 'Vendor', c: 11 },
  { n: 'Item', c: 26 },
  { n: 'Project', c: 17 },
];

const FIELDS = [
  { n: 'Name', t: 'Text', tone: 'slate', ic: Type, req: true, d: '—' },
  { n: 'Email', t: 'Email', tone: 'blue', ic: Mail, req: true, d: '—' },
  { n: 'Customer Type', t: 'Dropdown', tone: 'violet', ic: ChevronDown, req: false, d: 'Distributor' },
  { n: 'Credit Limit', t: 'Currency', tone: 'green', ic: Wallet, req: false, d: '0.00' },
  { n: 'Account Owner', t: 'User', tone: 'amber', ic: User, req: false, d: '—' },
  { n: 'Onboarded on', t: 'Date', tone: 'blue', ic: Calendar, req: false, d: '—' },
  { n: 'Price List', t: 'Lookup', tone: 'violet', ic: Link2, req: false, d: 'Standard' },
  { n: 'Status', t: 'Status', tone: 'orange', ic: Hash, req: true, d: 'Active' },
];

export const ObjectShot = () => (
  <div className="sh-split">
    <Rail title="Objects" items={OBJECTS} action="New object" />

    <main className="sh-main">
      <Head
        icon={Table2}
        title="Customer"
        sub="14 fields · 3 relations · 2 forms"
        right={<><b className="sh-mini-ghost"><Eye size={10} strokeWidth={2.3} />Preview</b><b className="sh-mini-solid"><Plus size={10} strokeWidth={2.6} />Add field</b></>}
      />

      <Tabs items={['Fields', 'Relations', 'Permissions', 'Layout', 'History']} on={0} />

      <div className="sh-table">
        <div className="sh-tr sh-tr--h">
          <span>Field</span><span>Type</span><span>Required</span><span>Default</span><span />
        </div>

        {FIELDS.map((f) => {
          const Ic = f.ic;
          return (
            <div className="sh-tr" key={f.n}>
              <span className="sh-td-n"><GripVertical size={11} strokeWidth={2} />{f.n}</span>
              <span>
                <em className={`sh-type sh-type--${f.tone}`}>
                  <Ic size={9} strokeWidth={2.4} />{f.t}
                </em>
              </span>
              <span className={f.req ? 'sh-yes' : 'sh-no'}>{f.req ? 'Required' : 'Optional'}</span>
              <span className="sh-td-d">{f.d}</span>
              <span className="sh-td-x"><MoreHorizontal size={12} strokeWidth={2.2} /></span>
            </div>
          );
        })}

        <div className="sh-tr sh-tr--add">
          <span><Plus size={11} strokeWidth={2.6} />Add field</span>
        </div>
      </div>
    </main>
  </div>
);

/* the small form that sits over the corner of the object builder ---- */
export const FormPeek = () => (
  <div className="sh-peek">
    <div className="sh-peek-bar">
      <span><MousePointerClick size={10} strokeWidth={2.3} />Form builder</span>
      <em>Draft</em>
    </div>
    <div className="sh-peek-body">
      <p className="sh-peek-h">New Customer</p>
      <label className="sh-fld"><i>Name</i><span>Gulf Build Contracting</span></label>
      <div className="sh-fld-2">
        <label className="sh-fld"><i>Type</i><span className="sh-sel">Distributor <ChevronDown size={9} strokeWidth={2.4} /></span></label>
        <label className="sh-fld"><i>Credit limit</i><span>250,000.00</span></label>
      </div>
      <label className="sh-fld"><i>Owner</i><span className="sh-av"><b>AM</b>Akhila M.</span></label>
      <div className="sh-peek-foot"><b>Save record</b></div>
    </div>
  </div>
);

/* =====================================================================
   BUILD — APP BUILDER
   ===================================================================== */
const ROWS = [
  { a: 'SO-2841', b: 'Gulf Build Contracting', c: '482,900.00', s: 'Approved', tone: 'green' },
  { a: 'SO-2840', b: 'Nesto Group', c: '96,400.00', s: 'In approval', tone: 'amber' },
  { a: 'SO-2839', b: 'Zahran Trading', c: '1,204,000.00', s: 'Approved', tone: 'green' },
  { a: 'SO-2838', b: 'Al Rawabi Foods', c: '38,750.00', s: 'On hold', tone: 'red' },
  { a: 'SO-2837', b: 'Meridian Facilities', c: '212,300.00', s: 'Approved', tone: 'green' },
  { a: 'SO-2836', b: 'Northwind Logistics', c: '74,120.00', s: 'Draft', tone: 'slate' },
  { a: 'SO-2835', b: 'Gulf Build Contracting', c: '156,880.00', s: 'Approved', tone: 'green' },
  { a: 'SO-2834', b: 'Zahran Trading', c: '61,050.00', s: 'In approval', tone: 'amber' },
];

const APP_NAV = [
  { n: 'Home', ic: Table2 },
  { n: 'Customers', ic: User },
  { n: 'Sales Orders', ic: FileText, on: true },
  { n: 'Invoices', ic: Wallet },
  { n: 'Approvals', ic: UserCheck },
  { n: 'Reports', ic: Hash },
];

export const AppShot = () => (
  <div className="sh-split sh-split--app">
    <aside className="sh-nav">
      <p className="sh-nav-brand"><b>E</b>Sales Ops</p>
      <ul>
        {APP_NAV.map((x) => {
          const Ic = x.ic;
          return (
            <li key={x.n} className={x.on ? 'is-on' : ''}>
              <Ic size={11} strokeWidth={2.2} />{x.n}
            </li>
          );
        })}
      </ul>
      <span className="sh-nav-add"><Plus size={11} strokeWidth={2.4} />Add page</span>
    </aside>

    <main className="sh-main">
      <Head
        title="Sales Orders"
        sub="Live view · 1,284 records"
        right={<><b className="sh-mini-ghost"><Filter size={10} strokeWidth={2.3} />Filter</b><b className="sh-mini-solid"><Plus size={10} strokeWidth={2.6} />New order</b></>}
      />
      <Tabs items={['All', 'Awaiting approval', 'This week', 'Mine']} on={0} />

      <div className="sh-table">
        <div className="sh-tr sh-tr--h sh-tr--app">
          <span>Order</span><span>Customer</span><span>Value</span><span>Status</span><span />
        </div>
        {ROWS.map((r) => (
          <div className="sh-tr sh-tr--app" key={r.a}>
            <span className="sh-td-n">{r.a}</span>
            <span>{r.b}</span>
            <span className="sh-td-num">{r.c}</span>
            <span><em className={`sh-chip sh-chip--${r.tone}`}>{r.s}</em></span>
            <span className="sh-td-x"><MoreHorizontal size={12} strokeWidth={2.2} /></span>
          </div>
        ))}
      </div>
    </main>
  </div>
);

/* =====================================================================
   BUILD — FORMS
   ===================================================================== */
const PALETTE = [
  { n: 'Text', ic: Type }, { n: 'Number', ic: Hash }, { n: 'Date', ic: Calendar },
  { n: 'Dropdown', ic: ChevronDown }, { n: 'Lookup', ic: Link2 }, { n: 'Table', ic: Table2 },
  { n: 'Approval', ic: UserCheck }, { n: 'Attachment', ic: FileText },
];

export const FormShot = () => (
  <div className="sh-split sh-split--form">
    <main className="sh-main sh-main--pad">
      <Head title="Customer Onboarding" sub="Form · 2 sections · 9 fields" right={<b className="sh-mini-solid">Publish form</b>} />

      <div className="sh-canvas">
        <p className="sh-sec-k">Company</p>
        <label className="sh-fld sh-fld--drop"><i>Legal name</i><span>Gulf Build Contracting LLC</span></label>
        <div className="sh-fld-2">
          <label className="sh-fld"><i>Trade licence</i><span>CN-1184920</span></label>
          <label className="sh-fld"><i>Country</i><span className="sh-sel">United Arab Emirates <ChevronDown size={9} strokeWidth={2.4} /></span></label>
        </div>

        <p className="sh-sec-k">Commercial terms</p>
        <div className="sh-fld-2">
          <label className="sh-fld"><i>Payment terms</i><span className="sh-sel">Net 45 <ChevronDown size={9} strokeWidth={2.4} /></span></label>
          <label className="sh-fld"><i>Credit limit</i><span>250,000.00</span></label>
        </div>
        <span className="sh-drop">Drop a field here</span>
      </div>
    </main>

    <aside className="sh-pal">
      <p className="sh-rail-k">Fields</p>
      <ul>
        {PALETTE.map((p) => {
          const Ic = p.ic;
          return <li key={p.n}><Ic size={11} strokeWidth={2.2} />{p.n}<GripVertical size={10} strokeWidth={2} /></li>;
        })}
      </ul>
    </aside>
  </div>
);

/* =====================================================================
   BUILD — DOCUMENTS
   ===================================================================== */
const LINES = [
  ['Ready-mix concrete C40', '120 m³', '412.00', '49,440.00'],
  ['Reinforcement steel B500', '18 t', '2,940.00', '52,920.00'],
  ['Formwork hire — 30 days', '1 lot', '18,600.00', '18,600.00'],
  ['Site supervision', '160 hrs', '145.00', '23,200.00'],
];

export const DocShot = () => (
  <div className="sh-split sh-split--doc">
    <main className="sh-main sh-main--pad">
      <Head title="Tax Invoice" sub="Template · Sales Invoice" right={<b className="sh-mini-ghost"><Copy size={10} strokeWidth={2.3} />Duplicate</b>} />

      <div className="sh-doc">
        <div className="sh-doc-top">
          <span className="sh-doc-logo">E</span>
          <span className="sh-doc-t"><b>TAX INVOICE</b><i>INV-2026-04812</i></span>
          <span className="sh-doc-meta">
            <em>Issued<b>27 Aug 2026</b></em>
            <em>Due<b>11 Oct 2026</b></em>
          </span>
        </div>

        <div className="sh-doc-lines">
          <div className="sh-dl sh-dl--h"><span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
          {LINES.map((l) => (
            <div className="sh-dl" key={l[0]}>
              <span>{l[0]}</span><span>{l[1]}</span><span>{l[2]}</span><span>{l[3]}</span>
            </div>
          ))}
        </div>

        <div className="sh-doc-sum">
          <em>Subtotal<b>144,160.00</b></em>
          <em>VAT 5%<b>7,208.00</b></em>
          <em className="is-total">Total due<b>151,368.00</b></em>
        </div>
      </div>
    </main>
  </div>
);

/* =====================================================================
   BUILD — NAVIGATION
   ===================================================================== */
const TREE = [
  { n: 'Dashboard', d: 0 },
  { n: 'Sales', d: 0, open: true },
  { n: 'Customers', d: 1 },
  { n: 'Sales Orders', d: 1, on: true },
  { n: 'Quotations', d: 1 },
  { n: 'Finance', d: 0, open: true },
  { n: 'Invoices', d: 1 },
  { n: 'Payments', d: 1 },
  { n: 'Settings', d: 0 },
];

export const NavShot = () => (
  <div className="sh-split sh-split--nav">
    <main className="sh-main sh-main--pad">
      <Head title="Navigation" sub="Sales Ops · 9 items" right={<b className="sh-mini-solid">Save layout</b>} />

      <ul className="sh-tree">
        {TREE.map((t) => (
          <li key={t.n} className={`sh-tree-i${t.on ? ' is-on' : ''}`} style={{ marginLeft: `${t.d * 1.6}em` }}>
            <GripVertical size={11} strokeWidth={2} />
            {t.d === 0 ? <ChevronDown size={10} strokeWidth={2.4} /> : <ChevronRight size={10} strokeWidth={2.4} className="sh-tree-sp" />}
            {t.n}
            {t.on && <em>Visible to 4 roles</em>}
          </li>
        ))}
      </ul>
    </main>

    <aside className="sh-props">
      <p className="sh-rail-k">Item</p>
      <label className="sh-fld"><i>Label</i><span>Sales Orders</span></label>
      <label className="sh-fld"><i>Opens</i><span className="sh-sel">Sales Order list <ChevronDown size={9} strokeWidth={2.4} /></span></label>
      <label className="sh-fld"><i>Icon</i><span><FileText size={10} strokeWidth={2.2} /> Document</span></label>
      <p className="sh-rail-k">Visible to</p>
      <div className="sh-roles">
        {['Sales', 'Finance', 'Ops', 'Admin'].map((r) => (
          <em key={r}><Check size={9} strokeWidth={3} />{r}</em>
        ))}
      </div>
    </aside>
  </div>
);

/* =====================================================================
   BUILD — FUNCTIONS
   ===================================================================== */
const CODE = [
  [['k', 'export async function'], ['f', ' onOrderApproved'], ['p', '(order, ctx) {']],
  [['c', '  // runs as the approver, with their permissions']],
  [['k', '  const'], ['p', ' credit = '], ['k', 'await'], ['f', ' ctx.records.get'], ['p', '('], ['s', "'Customer'"], ['p', ', order.customer);']],
  [[]],
  [['k', '  if'], ['p', ' (order.total > credit.limit) {']],
  [['k', '    return'], ['p', ' ctx.flow.'], ['f', 'branch'], ['p', '('], ['s', "'credit_hold'"], ['p', ');']],
  [['p', '  }']],
  [[]],
  [['k', '  await'], ['p', ' ctx.records.'], ['f', 'create'], ['p', '('], ['s', "'Invoice'"], ['p', ', {']],
  [['p', '    customer: order.customer,']],
  [['p', '    lines:    order.lines,']],
  [['p', '    terms:    credit.terms,']],
  [['p', '  });']],
  [['p', '}']],
];

export const FnShot = () => (
  <div className="sh-split sh-split--fn">
    <main className="sh-main sh-main--pad">
      <Head icon={Code2} title="onOrderApproved.js" sub="Function · Node 20 · v14" right={<b className="sh-mini-solid">Run test</b>} />

      <div className="sh-code">
        {CODE.map((line, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div className="sh-code-l" key={i}>
            <span className="sh-code-n">{i + 1}</span>
            <code>
              {line.map((tok, j) => (
                /* eslint-disable-next-line react/no-array-index-key */
                <em className={`t-${tok[0]}`} key={j}>{tok[1]}</em>
              ))}
            </code>
          </div>
        ))}
      </div>

      <div className="sh-code-out">
        <span className="sh-chip sh-chip--green"><Check size={9} strokeWidth={3} />Test passed</span>
        <em>4 assertions · 128 ms · SO-2841</em>
      </div>
    </main>
  </div>
);

/* =====================================================================
   AUTOMATE — the rails either side of the flow canvas
   ===================================================================== */
const BLOCKS = [
  { n: 'Trigger', ic: Zap, tone: 'green' },
  { n: 'Condition', ic: GitBranch, tone: 'violet' },
  { n: 'Approval', ic: UserCheck, tone: 'violet' },
  { n: 'Notify', ic: Bell, tone: 'amber' },
  { n: 'Create record', ic: Plus, tone: 'green' },
  { n: 'Update record', ic: RotateCw, tone: 'blue' },
  { n: 'Call API', ic: Webhook, tone: 'blue' },
  { n: 'Run script', ic: Braces, tone: 'slate' },
];

export const FlowRails = ({ children }) => (
  <div className="sh-flow">
    <aside className="sh-blocks">
      <p className="sh-rail-k">Blocks</p>
      <ul>
        {BLOCKS.map((b) => {
          const Ic = b.ic;
          return (
            <li key={b.n}>
              <span className={`sh-bi sh-bi--${b.tone}`}><Ic size={10} strokeWidth={2.3} /></span>
              {b.n}
            </li>
          );
        })}
      </ul>
    </aside>

    <div className="sh-flow-canvas">
      <div className="sh-flow-tool">
        <span className="sh-chip sh-chip--green"><i className="sh-live" />Live</span>
        <em>Sales Invoice approval</em>
        <span className="sh-flow-zoom">100%</span>
      </div>
      <div className="sh-flow-stage">{children}</div>
    </div>

    <aside className="sh-props sh-props--flow">
      <p className="sh-rail-k">Step</p>
      <div className="sh-prop-h">
        <span className="sh-bi sh-bi--violet"><UserCheck size={10} strokeWidth={2.3} /></span>
        Request Approval
      </div>
      <label className="sh-fld"><i>Approver</i><span className="sh-av"><b>RK</b>Finance Manager</span></label>
      <label className="sh-fld"><i>Escalate after</i><span className="sh-sel">24 hours <ChevronDown size={9} strokeWidth={2.4} /></span></label>
      <label className="sh-fld"><i>On timeout</i><span className="sh-sel">Notify + hold <ChevronDown size={9} strokeWidth={2.4} /></span></label>
      <p className="sh-rail-k">Outcomes</p>
      <div className="sh-outs">
        <em className="sh-chip sh-chip--red">Reject</em>
        <em className="sh-chip sh-chip--amber">Revise</em>
        <em className="sh-chip sh-chip--green">Approve</em>
      </div>
      <span className="sh-runs-k">Runs today <b>318</b></span>
    </aside>
  </div>
);

/* =====================================================================
   AUTOMATE — the four capability crops
   ===================================================================== */
const RUNS = [
  { a: 'SO-2841', b: 'Approve', c: '1.2s', s: 'Completed', tone: 'green' },
  { a: 'SO-2840', b: 'Request Approval', c: '4h 11m', s: 'Waiting', tone: 'amber' },
  { a: 'SO-2839', b: 'Approve', c: '0.9s', s: 'Completed', tone: 'green' },
  { a: 'SO-2838', b: 'Credit check', c: '2.4s', s: 'Branched', tone: 'violet' },
  { a: 'SO-2837', b: 'Approve', c: '1.1s', s: 'Completed', tone: 'green' },
];

export const RunsShot = () => (
  <div className="sh-crop">
    <Head icon={Timer} title="Run history" sub="Sales Invoice approval · last 24h" right={<b className="sh-mini-ghost">Replay</b>} />
    <div className="sh-table">
      <div className="sh-tr sh-tr--h sh-tr--runs"><span>Record</span><span>Current step</span><span>Elapsed</span><span>Status</span></div>
      {RUNS.map((r) => (
        <div className="sh-tr sh-tr--runs" key={r.a}>
          <span className="sh-td-n">{r.a}</span>
          <span>{r.b}</span>
          <span className="sh-td-num">{r.c}</span>
          <span><em className={`sh-chip sh-chip--${r.tone}`}>{r.s}</em></span>
        </div>
      ))}
    </div>
  </div>
);

const APPROVALS = [
  { i: 'RK', n: 'Rahul K.', r: 'SO-2840 · Nesto Group', v: '96,400.00', t: '4h left', warn: false },
  { i: 'AM', n: 'Akhila M.', r: 'PO-1192 · Zahran Trading', v: '1,204,000.00', t: '40m left', warn: true },
  { i: 'SD', n: 'Sara D.', r: 'EXP-884 · Site travel', v: '3,180.00', t: '2d left', warn: false },
];

export const ApprovalsShot = () => (
  <div className="sh-crop">
    <Head icon={UserCheck} title="Approvals" sub="3 waiting on you" right={<b className="sh-mini-ghost">Delegate</b>} />
    <ul className="sh-appr">
      {APPROVALS.map((a) => (
        <li key={a.r}>
          <span className="sh-av"><b>{a.i}</b></span>
          <span className="sh-appr-t"><b>{a.r}</b><i>Raised by {a.n}</i></span>
          <span className="sh-appr-v">{a.v}</span>
          <span className={`sh-appr-sla${a.warn ? ' is-warn' : ''}`}>
            {a.warn ? <AlertTriangle size={10} strokeWidth={2.4} /> : <Clock size={10} strokeWidth={2.4} />}{a.t}
          </span>
          <span className="sh-appr-act"><b className="sh-mini-ghost">Reject</b><b className="sh-mini-solid">Approve</b></span>
        </li>
      ))}
    </ul>
  </div>
);

const SCHEDULES = [
  { n: 'Nightly credit-limit review', c: '0 2 * * *', next: 'Tonight, 02:00', s: 'Active', tone: 'green' },
  { n: 'Weekly ageing reminder', c: '0 9 * * MON', next: 'Mon, 09:00', s: 'Active', tone: 'green' },
  { n: 'Month-end accrual post', c: '0 23 L * *', next: '31 Aug, 23:00', s: 'Active', tone: 'green' },
  { n: 'Quarterly vendor re-score', c: '0 6 1 */3 *', next: '1 Oct, 06:00', s: 'Paused', tone: 'slate' },
];

export const ScheduleShot = () => (
  <div className="sh-crop">
    <Head icon={Calendar} title="Scheduled flows" sub="4 schedules · Asia/Dubai" right={<b className="sh-mini-solid"><Plus size={10} strokeWidth={2.6} />New</b>} />
    <div className="sh-table">
      <div className="sh-tr sh-tr--h sh-tr--sch"><span>Flow</span><span>Runs at</span><span>Next run</span><span>Status</span></div>
      {SCHEDULES.map((s) => (
        <div className="sh-tr sh-tr--sch" key={s.n}>
          <span className="sh-td-n">{s.n}</span>
          <span><em className="sh-cron">{s.c}</em></span>
          <span>{s.next}</span>
          <span><em className={`sh-chip sh-chip--${s.tone}`}>{s.s}</em></span>
        </div>
      ))}
    </div>
  </div>
);

const PAYLOAD = [
  [['p', '{']],
  [['s', '  "event"'], ['p', ':     '], ['s', '"order.approved"'], ['p', ',']],
  [['s', '  "record"'], ['p', ':    '], ['s', '"SO-2841"'], ['p', ',']],
  [['s', '  "entity"'], ['p', ':    '], ['s', '"Gulf Build LLC"'], ['p', ',']],
  [['s', '  "total"'], ['p', ':     '], ['n', '482900.00'], ['p', ',']],
  [['s', '  "currency"'], ['p', ':  '], ['s', '"AED"'], ['p', ',']],
  [['s', '  "lines"'], ['p', ':     '], ['n', '6'], ['p', ',']],
  [['s', '  "approver"'], ['p', ':  '], ['s', '"finance.manager"'], ['p', ',']],
  [['s', '  "approved_at"'], ['p', ': '], ['s', '"2026-08-27T09:14:22Z"'], ['p', ',']],
  [['s', '  "flow"'], ['p', ':      '], ['s', '"sales-invoice-approval"'], ['p', ',']],
  [['s', '  "signature"'], ['p', ': '], ['s', '"sha256=a41f…9c2e"']],
  [['p', '}']],
];

export const ApiShot = () => (
  <div className="sh-crop sh-crop--api">
    <div className="sh-api-l">
      <Head icon={Webhook} title="Endpoints" sub="6 active" />
      <ul className="sh-api-list">
        {[
          ['POST', '/v1/orders', 'green'],
          ['GET', '/v1/customers', 'blue'],
          ['POST', '/hooks/erp-sync', 'green'],
          ['GET', '/v1/runs/:id', 'blue'],
          ['POST', '/v1/invoices', 'green'],
          ['GET', '/v1/approvals', 'blue'],
        ].map(([m, u, tone]) => (
          <li key={u}><em className={`sh-verb sh-verb--${tone}`}>{m}</em>{u}</li>
        ))}
      </ul>
      <span className="sh-key"><KeyRound size={10} strokeWidth={2.3} />sk_live_••••••4f2a</span>
    </div>

    <div className="sh-api-r">
      <div className="sh-api-bar">
        <span className="sh-chip sh-chip--green">200 OK</span>
        <em>142 ms</em>
        <span className="sh-mini-ghost"><Send size={10} strokeWidth={2.3} />Resend</span>
      </div>
      <div className="sh-code sh-code--json">
        {PAYLOAD.map((line, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div className="sh-code-l" key={i}>
            <code>{line.map((t, j) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <em className={`t-${t[0]}`} key={j}>{t[1]}</em>
            ))}</code>
          </div>
        ))}
      </div>
    </div>
  </div>
);
