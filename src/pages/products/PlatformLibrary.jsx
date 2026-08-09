import React, { useState } from 'react';
import {
  Users, Wallet, ShoppingCart, TrendingUp, Headphones, Factory, Package,
  UserCheck, Building2, ArrowRight, Star, Download, Check, Search, Filter,
  PanelsTopLeft, Workflow, KeyRound, Database, Clock, Sparkles,
  LayoutGrid, FileCheck2, Receipt, Kanban, Boxes, LifeBuoy,
} from 'lucide-react';
import { motion, MaskText, Reveal, EASE } from './motion';
import { Kicker, Browser, DotField, useAutoStep, AnimatePresence } from './PlatformKit';
import './PlatformLibrary.css';

/* =====================================================================
   TWO LIBRARIES

   · BUILD ANYTHING — paper. A department list on the left; picking one
     reveals the application that department actually built. The list is
     the navigation, the screen is the argument.

   · TEMPLATES — night. Not a grid of marketing cards: the platform's
     own template marketplace, rendered as the product screen it is,
     with a detail drawer that tells you exactly what lands in your
     workspace when you press the button.
   ===================================================================== */

/* ------------------------------------------------------------------
   Five screen archetypes. Every department gets real content; the
   archetype decides the shape so nine previews never read as nine
   screenshots of the same page.
   ------------------------------------------------------------------ */
const Preview = ({ spec }) => {
  const { layout, accent } = spec;

  if (layout === 'dash') {
    return (
      <div className={`gv gv-dash a-${accent}`}>
        <div className="gv-top"><b>{spec.title}</b><span>{spec.period}</span></div>
        <div className="gv-kpis">
          {spec.kpis.map(([n, l, d]) => (
            <div key={l}><b>{n}</b><span>{l}</span>{d && <em className={d[0] === '+' ? 'up' : 'dn'}>{d}</em>}</div>
          ))}
        </div>
        <div className="gv-chart">
          <div className="gv-bars">
            {spec.bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
          </div>
          <div className="gv-legend">{spec.legend.map((l) => <span key={l}><i />{l}</span>)}</div>
        </div>
        <div className="gv-rows">
          {spec.rows.map(([a, b, c]) => (
            <span key={a}><b>{a}</b><em>{b}</em><u>{c}</u></span>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'table') {
    return (
      <div className={`gv gv-table a-${accent}`}>
        <div className="gv-top">
          <b>{spec.title}</b>
          <span className="gv-chip"><Filter size={9} />{spec.period}</span>
          <em>{spec.total}</em>
        </div>
        <table>
          <thead><tr>{spec.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {spec.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j === r.length - 1 ? 'st' : ''}>
                    {j === r.length - 1 ? <span className={`gv-st ${c[1]}`}>{c[0]}</span> : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (layout === 'board') {
    return (
      <div className={`gv gv-board a-${accent}`}>
        <div className="gv-top"><b>{spec.title}</b><span>{spec.period}</span></div>
        <div className="gv-cols">
          {spec.cols.map(([c, items]) => (
            <div key={c}>
              <span className="gv-col-h">{c}<em>{items.length}</em></span>
              {items.map(([t, m, tone]) => (
                <div className="gv-card" key={t}>
                  <b>{t}</b>
                  <span><i className={tone} />{m}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className={`gv gv-list a-${accent}`}>
        <aside>
          <span className="gv-side-h">{spec.title}</span>
          {spec.items.map(([t, m], i) => (
            <span key={t} className={i === 0 ? 'on' : ''}><b>{t}</b><em>{m}</em></span>
          ))}
        </aside>
        <main>
          <div className="gv-detail-h"><b>{spec.detail.title}</b><span className="gv-chip">{spec.detail.tag}</span></div>
          <div className="gv-facts">
            {spec.detail.facts.map(([k, v]) => (
              <div key={k}><span>{k}</span><b>{v}</b></div>
            ))}
          </div>
          <div className="gv-time">
            {spec.detail.timeline.map(([t, m], i) => (
              <span key={t} className={i === 0 ? 'on' : ''}><i />{t}<em>{m}</em></span>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`gv gv-form a-${accent}`}>
      <div className="gv-top"><b>{spec.title}</b><span>{spec.period}</span></div>
      <div className="gv-formwrap">
        <div className="gv-fields">
          {spec.fields.map(([l, v]) => (
            <span key={l}><i>{l}</i><u>{v}</u></span>
          ))}
          <span className="gv-submit">{spec.cta}</span>
        </div>
        <div className="gv-aside">
          <span className="gv-side-h">Status</span>
          {spec.status.map(([t, m, tone]) => (
            <span key={t} className="gv-status"><i className={tone} /><b>{t}</b><em>{m}</em></span>
          ))}
        </div>
      </div>
    </div>
  );
};

const DOMAINS = [
  {
    id: 'hr', name: 'Human Resources', icon: Users, built: 'Built by HR Ops · 6 days',
    line: 'Headcount, attrition and the onboarding pipeline in one place.',
    url: 'people.emvive.app',
    spec: {
      layout: 'dash', accent: 'v', title: 'Workforce overview', period: 'This quarter',
      kpis: [['1,120', 'Headcount', '+34'], ['4.2%', 'Attrition', '-0.8'], ['14', 'Onboarding'], ['96%', 'Docs valid']],
      bars: [52, 61, 48, 70, 65, 78, 72, 84, 79, 88, 82, 93],
      legend: ['Joiners', 'Leavers'],
      rows: [['Yusuf Rahman', 'Site engineer', 'Day 3'], ['Noura Saleh', 'Accountant', 'Day 1'], ['Hana Kareem', 'QA lead', 'Offer']],
    },
  },
  {
    id: 'finance', name: 'Finance', icon: Wallet, built: 'Built by FP&A · 8 days',
    line: 'Budget versus actual by cost centre, refreshed from the ledger.',
    url: 'budget.emvive.app',
    spec: {
      layout: 'table', accent: 'ink', title: 'Budget vs actual', period: 'FY26 Q3', total: 'SAR 18.4M',
      cols: ['Cost centre', 'Budget', 'Actual', 'Variance', 'State'],
      rows: [
        ['Operations', '6,400,000', '6,118,200', '−4.4%', ['On track', 'ok']],
        ['Logistics', '3,200,000', '3,486,900', '+9.0%', ['Over', 'bad']],
        ['Plant', '5,100,000', '4,902,400', '−3.9%', ['On track', 'ok']],
        ['Corporate', '2,400,000', '2,388,100', '−0.5%', ['On track', 'ok']],
        ['Projects', '1,300,000', '1,412,700', '+8.7%', ['Review', 'warn']],
      ],
    },
  },
  {
    id: 'procurement', name: 'Procurement', icon: ShoppingCart, built: 'Built by Sourcing · 5 days',
    line: 'RFQs from draft to award, with supplier scoring built in.',
    url: 'sourcing.emvive.app',
    spec: {
      layout: 'board', accent: 'amb', title: 'RFQ pipeline', period: '12 open',
      cols: [
        ['Draft', [['Reefer spares', '4 suppliers', ''], ['Site fencing', '2 suppliers', '']]],
        ['Quoting', [['Cement additives', 'Closes in 2d', 'warn'], ['PPE annual', 'Closes in 6d', '']]],
        ['Scoring', [['Fleet tyres', '3 of 5 scored', 'warn']]],
        ['Awarded', [['Packaging film', 'Gulf Packaging', 'ok'], ['Lab reagents', 'Delta Chem.', 'ok']]],
      ],
    },
  },
  {
    id: 'sales', name: 'Sales', icon: TrendingUp, built: 'Built by Commercial · 7 days',
    line: 'A pipeline that reads credit limits and stock before it promises a date.',
    url: 'pipeline.emvive.app',
    spec: {
      layout: 'list', accent: 'cy', title: 'Opportunities',
      items: [['Jubail Terminal expansion', 'SAR 2.4M · 60%'], ['Riyadh retail rollout', 'SAR 840K · 35%'], ['Dammam plant retrofit', 'SAR 1.1M · 80%'], ['Yanbu maintenance', 'SAR 320K · 20%']],
      detail: {
        title: 'Jubail Terminal expansion', tag: 'Proposal',
        facts: [['Value', 'SAR 2.4M'], ['Close', '30 Sep'], ['Credit', 'Within limit'], ['Stock', 'Available']],
        timeline: [['Quotation sent', 'today · 09:12'], ['Site survey', '3 days ago'], ['Qualified', '2 weeks ago']],
      },
    },
  },
  {
    id: 'service', name: 'Customer Service', icon: Headphones, built: 'Built by Service · 9 days',
    line: 'Tickets, SLAs and the conversation the customer can see too.',
    url: 'support.emvive.app',
    spec: {
      layout: 'list', accent: 'v', title: 'Open tickets',
      items: [['Delivery delay at Jubail', 'REQ-2041 · High'], ['Invoice mismatch', 'REQ-2039 · Normal'], ['Site access badge', 'REQ-2036 · Normal'], ['Quotation request', 'REQ-2030 · Low']],
      detail: {
        title: 'Delivery delay at Jubail', tag: 'SLA 1h 12m',
        facts: [['Customer', 'Gulf Cement'], ['Owner', 'A. Hassan'], ['Opened', '2h ago'], ['Breaches', '0']],
        timeline: [['Re-routed TRK-208', '12 min ago'], ['Escalated to logistics', '48 min ago'], ['Ticket created', '2h ago']],
      },
    },
  },
  {
    id: 'ops', name: 'Operations', icon: Factory, built: 'Built by Plant Ops · 6 days',
    line: 'Shift handover, downtime reasons and the maintenance queue.',
    url: 'plant.emvive.app',
    spec: {
      layout: 'board', accent: 'run', title: 'Maintenance queue', period: 'Shift B',
      cols: [
        ['Reported', [['Conveyor B vibration', 'Line 2', 'warn'], ['Dust filter alarm', 'Line 1', '']]],
        ['Diagnosed', [['Compressor 2 seal', 'Parts needed', 'warn']]],
        ['In progress', [['Pump 14 rebuild', 'Y. Rahman', ''], ['Valve 8 replace', 'T. Aziz', '']]],
        ['Closed', [['Motor 3 bearing', '4.2h', 'ok']]],
      ],
    },
  },
  {
    id: 'inventory', name: 'Inventory', icon: Package, built: 'Built by Warehouse · 5 days',
    line: 'Bin-level counts on a phone, offline, in a warehouse aisle.',
    url: 'counts.emvive.app',
    spec: {
      layout: 'table', accent: 'amb', title: 'Stock by bin', period: 'DC Riyadh', total: '46 aisles',
      cols: ['Bin', 'Item', 'On hand', 'Expected', 'State'],
      rows: [
        ['C-14-01', 'Bolts M12', '480', '480', ['Matched', 'ok']],
        ['C-14-02', 'Gaskets 40mm', '122', '140', ['Variance', 'warn']],
        ['C-14-03', 'Seals HD', '96', '96', ['Matched', 'ok']],
        ['C-15-01', 'Cable 4mm', '640', '640', ['Matched', 'ok']],
        ['C-15-02', 'Lugs 16mm', '210', '260', ['Recount', 'bad']],
      ],
    },
  },
  {
    id: 'portal', name: 'Employee Portal', icon: UserCheck, built: 'Built by HR Ops · 4 days',
    line: 'Everything an employee needs to ask for, without emailing anyone.',
    url: 'me.emvive.app',
    spec: {
      layout: 'form', accent: 'v', title: 'Request', period: 'Yusuf Rahman',
      fields: [['Request type', 'Salary certificate'], ['Purpose', 'Bank — mortgage'], ['Language', 'Arabic + English'], ['Deliver to', 'y.rahman@…']],
      cta: 'Submit request',
      status: [['Approved', 'Annual leave · 12–16 Sep', 'ok'], ['With manager', 'Overtime claim · 8h', 'warn'], ['Issued', 'Payslip · August', 'ok']],
    },
  },
  {
    id: 'vendor', name: 'Vendor Portal', icon: Building2, built: 'Built by Procurement · 7 days',
    line: 'Suppliers keep their own documents current. Nobody chases a CR copy.',
    url: 'suppliers.emvive.app',
    spec: {
      layout: 'form', accent: 'cy', title: 'Vendor profile', period: 'Nexa Components',
      fields: [['Commercial reg.', 'CR-4402118 · valid'], ['VAT certificate', 'Expires 11 Apr 2027'], ['Bank IBAN', 'SA44 •••• 8821'], ['Categories', 'Components · Fasteners']],
      cta: 'Submit for review',
      status: [['Compliant', 'All documents valid', 'ok'], ['Expiring', 'ISO 9001 · 40 days', 'warn'], ['Open POs', '4 · SAR 611,900', '']],
    },
  },
];

const Gallery = () => {
  const [active, setActive] = useState(0);
  const d = DOMAINS[active];

  return (
    <section className="pg" id="build">
      <div className="pg-inner">
        <div className="pg-head">
          <Reveal><Kicker>08 — Build anything</Kicker></Reveal>
          <MaskText text="Nine departments." accent="Nine real applications." as="h2" className="pg-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              Every one of these was built inside a customer&apos;s own workspace, by the
              people who own the process. Pick a department and look at what they shipped.
            </p>
          </Reveal>
        </div>

        <div className="pg-body">
          <div className="pg-list" role="tablist" aria-label="Departments">
            {DOMAINS.map((it, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === i}
                key={it.id}
                className={`pg-item ${active === i ? 'on' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="pg-item-ic"><it.icon size={15} strokeWidth={1.8} /></span>
                <span className="pg-item-t">
                  <b>{it.name}</b>
                  <em>{it.line}</em>
                </span>
                <ArrowRight size={15} className="pg-item-go" />
              </button>
            ))}
          </div>

          <div className="pg-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                <Browser url={d.url} tabs={[d.name]} badge="LIVE" className="pg-browser">
                  <Preview spec={d.spec} />
                </Browser>

                <div className="pg-stage-meta">
                  <span className="pg-built">{d.built}</span>
                  <span className="pg-parts">
                    {[[Database, 'objects'], [PanelsTopLeft, 'screens'], [Workflow, 'flows'], [KeyRound, 'roles']].map(([Ic, l], i) => (
                      <em key={l}><Ic size={11} strokeWidth={1.9} />{[6, 4, 3, 4][i]} {l}</em>
                    ))}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   TEMPLATES — the marketplace, rendered as the product screen
   ===================================================================== */

const CATS = ['All templates', 'Sales & service', 'People', 'Finance', 'Operations', 'Projects'];

const TEMPLATES = [
  {
    id: 'crm', name: 'CRM', icon: TrendingUp, cat: 'Sales & service', installs: '2,140', rate: '4.9',
    tag: 'Most installed', tone: 'cy',
    line: 'Leads, opportunities, quotations and a pipeline that respects credit limits.',
    parts: [['Objects', '9'], ['Screens', '11'], ['Flows', '6'], ['Roles', '4'], ['Reports', '7']],
    ships: ['Lead capture form + web-to-lead endpoint', 'Quotation builder with approval thresholds', 'Pipeline board and forecast dashboard', 'Handover flow into Sales Orders'],
  },
  {
    id: 'hrms', name: 'HRMS', icon: Users, cat: 'People', installs: '1,880', rate: '4.8',
    tag: 'GCC ready', tone: 'v',
    line: 'Core HR, onboarding, leave, attendance and end-of-service in one workspace.',
    parts: [['Objects', '12'], ['Screens', '14'], ['Flows', '9'], ['Roles', '5'], ['Reports', '8']],
    ships: ['Employee master with GOSI + Iqama tracking', 'Leave, overtime and attendance rules', 'Onboarding and offboarding checklists', 'EOSB calculation flow'],
  },
  {
    id: 'inventory', name: 'Inventory', icon: Boxes, cat: 'Operations', installs: '1,410', rate: '4.7',
    tag: '', tone: 'amb',
    line: 'Bins, batches, cycle counts and reorder rules — offline capable on mobile.',
    parts: [['Objects', '8'], ['Screens', '9'], ['Flows', '5'], ['Roles', '3'], ['Reports', '6']],
    ships: ['Bin and batch model with FEFO picking', 'Offline cycle-count mobile screens', 'Reorder-point automation', 'Variance approval flow'],
  },
  {
    id: 'helpdesk', name: 'Helpdesk', icon: LifeBuoy, cat: 'Sales & service', installs: '1,260', rate: '4.8',
    tag: '', tone: 'cy',
    line: 'Ticketing with SLAs, escalation ladders and a customer-visible thread.',
    parts: [['Objects', '6'], ['Screens', '8'], ['Flows', '7'], ['Roles', '4'], ['Reports', '5']],
    ships: ['Multi-channel intake — email, portal, WhatsApp', 'SLA clocks with pause and escalation', 'Customer portal with conversation view', 'CSAT survey flow'],
  },
  {
    id: 'approval', name: 'Approval System', icon: FileCheck2, cat: 'Finance', installs: '2,020', rate: '4.9',
    tag: 'Fastest to deploy', tone: 'run',
    line: 'One approval engine for anything — limits, delegation, out-of-office, audit.',
    parts: [['Objects', '4'], ['Screens', '6'], ['Flows', '8'], ['Roles', '6'], ['Reports', '4']],
    ships: ['Matrix-driven approval limits by grade and cost centre', 'Delegation and out-of-office routing', 'Mobile approve/reject with reason capture', 'Immutable audit trail'],
  },
  {
    id: 'portal', name: 'Customer Portal', icon: Headphones, cat: 'Sales & service', installs: '980', rate: '4.6',
    tag: '', tone: 'v',
    line: 'Statements, orders, tickets and documents behind your customers’ own login.',
    parts: [['Objects', '7'], ['Screens', '10'], ['Flows', '4'], ['Roles', '3'], ['Reports', '3']],
    ships: ['External identity with row-level scoping', 'Order and delivery tracking screens', 'Statement of account with PDF export', 'Ticket raising and reply thread'],
  },
  {
    id: 'vendor', name: 'Vendor Management', icon: Building2, cat: 'Operations', installs: '860', rate: '4.7',
    tag: '', tone: 'amb',
    line: 'Registration, document expiry, scoring and compliance sign-off.',
    parts: [['Objects', '7'], ['Screens', '8'], ['Flows', '6'], ['Roles', '4'], ['Reports', '5']],
    ships: ['Self-service vendor registration portal', 'Document expiry monitoring and reminders', 'Scorecards fed by PO and delivery data', 'Compliance approval chain'],
  },
  {
    id: 'expense', name: 'Expense Management', icon: Receipt, cat: 'Finance', installs: '1,540', rate: '4.8',
    tag: '', tone: 'run',
    line: 'Receipt capture, policy checks and reimbursement straight into payroll.',
    parts: [['Objects', '5'], ['Screens', '7'], ['Flows', '6'], ['Roles', '4'], ['Reports', '5']],
    ships: ['Mobile receipt capture with OCR extraction', 'Policy rules by grade, category and city', 'Per-diem and mileage calculators', 'Payroll and GL posting flow'],
  },
  {
    id: 'projects', name: 'Project Management', icon: Kanban, cat: 'Projects', installs: '1,120', rate: '4.6',
    tag: '', tone: 'v',
    line: 'WBS, timesheets, milestone billing and profitability per project.',
    parts: [['Objects', '10'], ['Screens', '12'], ['Flows', '5'], ['Roles', '5'], ['Reports', '9']],
    ships: ['Work breakdown structure with baselines', 'Timesheet capture and approval', 'Milestone and progress billing', 'Profitability dashboard'],
  },
];

const Templates = () => {
  const [cat, setCat] = useState(0);
  const list = cat === 0 ? TEMPLATES : TEMPLATES.filter((t) => t.cat === CATS[cat]);
  const { index, pick, ref, bind } = useAutoStep(TEMPLATES.length, 3600, { hold: 5000 });

  /* the auto-rotation must land on something that is actually visible
     after a category filter, otherwise the drawer shows a template the
     grid is not displaying */
  const sel = list.includes(TEMPLATES[index]) ? TEMPLATES[index] : list[0] || TEMPLATES[0];

  return (
    <section className="pt" id="templates" ref={ref} {...bind}>
      <DotField tone="dark" size={30} className="pt-dots fade" />

      <div className="pt-inner">
        <div className="pt-head">
          <Reveal><Kicker tone="dark">09 — Template library</Kicker></Reveal>
          <MaskText text="Start from something" accent="that already works." as="h2" className="pt-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              A template is not a picture of an app. It is objects, screens, flows,
              roles and reports that land in your workspace, wired to your data,
              ready to be pulled apart.
            </p>
          </Reveal>
        </div>

        <div className="pt-shell">
          {/* ---------- marketplace chrome ---------- */}
          <div className="pt-bar">
            <span className="pt-bar-t"><LayoutGrid size={12} strokeWidth={2} /> Template library</span>
            <span className="pt-search"><Search size={11} /> Search 140 templates</span>
            <span className="pt-bar-r"><Sparkles size={11} strokeWidth={2} /> Generate a custom one</span>
          </div>

          <div className="pt-body">
            {/* categories */}
            <aside className="pt-cats">
              {CATS.map((c, i) => (
                <button
                  type="button"
                  key={c}
                  className={cat === i ? 'on' : ''}
                  onClick={() => setCat(i)}
                >
                  {c}
                  <em>{i === 0 ? TEMPLATES.length : TEMPLATES.filter((t) => t.cat === c).length}</em>
                </button>
              ))}

              <span className="pt-cats-note">
                <Clock size={11} strokeWidth={1.9} />
                Median time from install to first live user: <b>3 days</b>
              </span>
            </aside>

            {/* grid */}
            <div className="pt-grid">
              {list.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`pt-card t-${t.tone} ${sel.id === t.id ? 'on' : ''}`}
                  onClick={() => pick(TEMPLATES.indexOf(t))}
                  onMouseEnter={() => pick(TEMPLATES.indexOf(t))}
                >
                  <span className="pt-card-ic"><t.icon size={16} strokeWidth={1.8} /></span>
                  <b>{t.name}</b>
                  <em>{t.line}</em>
                  <span className="pt-card-f">
                    <i><Download size={10} strokeWidth={2} />{t.installs}</i>
                    <i><Star size={10} strokeWidth={2} />{t.rate}</i>
                    {t.tag && <u>{t.tag}</u>}
                  </span>
                </button>
              ))}
            </div>

            {/* drawer */}
            <div className="pt-drawer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sel.id}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.36, ease: EASE }}
                >
                  <div className="pt-d-head">
                    <span className={`pt-d-ic t-${sel.tone}`}><sel.icon size={18} strokeWidth={1.8} /></span>
                    <div>
                      <b>{sel.name}</b>
                      <em>{sel.cat}</em>
                    </div>
                  </div>

                  {/* a thumbnail of the template's own home screen */}
                  <div className={`pt-thumb t-${sel.tone}`}>
                    <span className="pt-thumb-nav"><i /><i /><i /><i /></span>
                    <span className="pt-thumb-kpis"><i /><i /><i /></span>
                    <span className="pt-thumb-rows"><i /><i /><i /><i /></span>
                    <span className="pt-thumb-tag">home screen</span>
                  </div>

                  <div className="pt-parts">
                    {sel.parts.map(([k, v]) => (
                      <div key={k}><b>{v}</b><span>{k}</span></div>
                    ))}
                  </div>

                  <span className="pt-d-k">What lands in your workspace</span>
                  <ul className="pt-ships">
                    {sel.ships.map((s) => (
                      <li key={s}><Check size={11} strokeWidth={3} />{s}</li>
                    ))}
                  </ul>

                  <div className="pt-d-cta">
                    <span className="pt-use">Use template <ArrowRight size={14} /></span>
                    <span className="pt-preview">Preview</span>
                  </div>
                  <span className="pt-d-foot">Installs into a sandbox first. Nothing touches production until you promote it.</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Templates };
export default Gallery;
