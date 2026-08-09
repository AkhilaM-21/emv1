import React, { useRef } from 'react';
import {
  Blocks, Type, Table2, BarChart3, MousePointer2, ListChecks, Image as ImageIcon,
  Database, Palette, Monitor, Tablet, Smartphone, Component, Check, Search,
  SlidersHorizontal, ArrowRight, ArrowLeft, Users, Wallet, Headphones,
  Package, FileCheck2, Plus, Filter, MoreHorizontal, Clock,
} from 'lucide-react';
import {
  motion, useScroll, useTransform, useSpring, useSteps, useReducedMotion,
  MaskText, EASE,
} from './motion';
import { Kicker, Chip, Browser, DotField, Cursor, Kbd, Spotlight } from './PlatformKit';
import './PlatformStudio.css';

/* =====================================================================
   STUDIO

   Two sections with deliberately opposite gravity.

   · THE CANVAS — night. Panels are detached and float at different
     depths around an artboard, drifting at different rates as you
     scroll. Nothing is in a grid; the composition is a workspace with
     things scattered on it, which is what building actually looks like.

   · THE SHOWCASE — paper. Five finished applications on a horizontal
     rail driven by vertical scroll. The canvas shows the making; the
     showcase shows the made.
   ===================================================================== */

const BEATS = [
  {
    k: 'Component library',
    t: 'Drag what the screen needs.',
    d: 'Ninety production components — fields, tables, charts, uploads, signatures, maps. They arrive knowing how to lay out, validate and behave.',
  },
  {
    k: 'The artboard',
    t: 'A real screen, not a wireframe.',
    d: 'What you place is what ships. No handoff, no rebuild, no "the developer will make it match".',
  },
  {
    k: 'Inspector',
    t: 'Change anything, see it immediately.',
    d: 'Labels, rules, visibility conditions, formatting, bindings. Every property is live — the artboard never lags behind the panel.',
  },
  {
    k: 'Data binding',
    t: 'Point a table at a real object.',
    d: 'No import and no nightly sync. The object you bind to is the one finance and supply chain are already writing to, with their row-level access intact.',
  },
  {
    k: 'Design tokens',
    t: 'Your brand, applied once.',
    d: 'Colour, type, radius and spacing are tokens. Change one and every application your teams have built moves with it.',
  },
  {
    k: 'Responsive + reuse',
    t: 'One build, every surface.',
    d: 'Web, tablet, the Emvive mobile app — from the same definition. Save a block as a component and it updates everywhere it was used.',
  },
];

const PALETTE = [
  [Type, 'Text field'], [ListChecks, 'Select'], [Table2, 'Data table'],
  [BarChart3, 'Chart'], [ImageIcon, 'Image'], [MousePointer2, 'Button'],
  [FileCheck2, 'Approval'], [Component, 'Custom'],
];

/* ------------------------------------------------------------------
   A floating panel on the canvas. `depth` drives how fast it drifts,
   which is what separates the layers visually without a drop shadow
   arms race.
   ------------------------------------------------------------------ */
const Float = ({ on, at, depth = 1, progress, className = '', children, z = 2 }) => {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 1], [40 * depth, -55 * depth]);
  const drift = useSpring(y, { stiffness: 70, damping: 26, mass: 0.7 });

  return (
    <motion.div
      className={`ps-float ${className}`}
      style={{ zIndex: z, ...(reduced ? {} : { y: drift }) }}
      initial={false}
      animate={{
        opacity: on ? 1 : 0,
        scale: on ? 1 : 0.95,
        filter: on ? 'blur(0px)' : 'blur(6px)',
      }}
      transition={{ duration: 0.7, delay: on ? at * 0.06 : 0, ease: EASE }}
      aria-hidden={!on}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
const Artboard = ({ beat }) => (
  <div className="ps-art">
    <div className="ps-art-top">
      <span className="ps-art-mark" />
      <b>Field Service Requests</b>
      <span className="ps-art-tabs"><i className="on" /><i /><i /></span>
      <span className="ps-art-av">AH</span>
    </div>

    <div className="ps-art-body">
      <motion.div
        className="ps-art-row"
        animate={{ opacity: beat >= 1 ? 1 : 0.15, y: beat >= 1 ? 0 : 8 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="ps-in"><span>Site</span><b>Jubail Terminal 4</b></div>
        <div className="ps-in"><span>Priority</span><b>High</b></div>
      </motion.div>

      <motion.div
        className={`ps-art-table ${beat >= 3 ? 'bound' : ''}`}
        animate={{ opacity: beat >= 1 ? 1 : 0.15, y: beat >= 1 ? 0 : 10 }}
        transition={{ duration: 0.6, delay: 0.06, ease: EASE }}
      >
        <div className="ps-tr head">
          <span>Request</span><span>Asset</span><span>Engineer</span><span>State</span>
          {beat >= 3 && <Chip tone="cy">work_order · live</Chip>}
        </div>
        {[
          ['WO-4412', 'Compressor 2', 'Y. Rahman', 'In progress', 'run'],
          ['WO-4408', 'Conveyor B', 'N. Saleh', 'Awaiting part', 'amb'],
          ['WO-4401', 'Pump 14', 'T. Aziz', 'Closed', ''],
        ].map(([id, a, e, s, tone]) => (
          <div className="ps-tr" key={id}>
            <span className="ps-mono">{id}</span><span>{a}</span><span>{e}</span>
            <span><i className={`ps-state ${tone}`} />{s}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="ps-art-chart"
        animate={{ opacity: beat >= 1 ? 1 : 0.15 }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
      >
        <span className="ps-art-k">Mean time to repair · 12 weeks</span>
        <div className="ps-spark">
          <svg viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="psg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(108,76,241,0.35)" />
                <stop offset="100%" stopColor="rgba(108,76,241,0)" />
              </linearGradient>
            </defs>
            <path d="M0,34 L18,30 36,33 54,24 72,27 90,18 108,21 126,13 144,16 162,9 180,12 200,6 200,44 0,44Z" fill="url(#psg)" />
            <path d="M0,34 L18,30 36,33 54,24 72,27 90,18 108,21 126,13 144,16 162,9 180,12 200,6" fill="none" stroke="#6c4cf1" strokeWidth="1.6" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="ps-art-cta"
        animate={{ opacity: beat >= 1 ? 1 : 0.15 }}
        transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
      >
        <span className="ps-btn-a">Dispatch engineer</span>
        <span className="ps-btn-b">Export</span>
      </motion.div>
    </div>

    {/* selection chrome — appears when the inspector is in play */}
    <motion.div
      className="ps-selbox"
      animate={{ opacity: beat === 2 ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      aria-hidden="true"
    >
      <span className="ps-selbox-tag">data_table · work_orders</span>
      <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
    </motion.div>
  </div>
);

/* ------------------------------------------------------------------ */
const StudioCanvasSection = () => {
  const { ref, index, progress } = useSteps(BEATS.length);

  return (
    <section className="ps" id="studio" ref={ref} style={{ height: `${BEATS.length * 92}vh` }}>
      <div className="ps-sticky">
        <DotField tone="dark" size={26} className="ps-dots fade" />
        <span className="ps-glow" aria-hidden="true" />

        {/* masthead sits inside the pin so it never scrolls away from
            the thing it is describing */}
        <div className="ps-head">
          <Kicker tone="dark">02 — Studio</Kicker>
          <h2 className="ps-h2">Design the application<em> visually.</em></h2>
          <div className="ps-head-meta">
            <span><Kbd>⌘</Kbd><Kbd>K</Kbd> command palette</span>
            <span>90+ components</span>
            <span>Live preview</span>
          </div>
        </div>

        <div className="ps-canvas">
          {/* ---------- component library ---------- */}
          <Float on={index >= 0} at={0} depth={1.3} progress={progress} className="p-lib" z={4}>
            <div className="ps-panel">
              <div className="ps-panel-bar"><Blocks size={12} strokeWidth={2} /> Components</div>
              <div className="ps-lib-search"><Search size={11} /> Search<Kbd>⌘K</Kbd></div>
              <div className="ps-lib-grid">
                {PALETTE.map(([Ic, l], i) => (
                  <span className={`ps-lib-item ${i === 2 ? 'hot' : ''}`} key={l}>
                    <Ic size={14} strokeWidth={1.7} />{l}
                  </span>
                ))}
              </div>
            </div>
          </Float>

          {/* ---------- artboard ---------- */}
          <Float on at={0} depth={0.4} progress={progress} className="p-art" z={3}>
            <Artboard beat={index} />
          </Float>

          {/* ---------- inspector ---------- */}
          <Float on={index >= 2} at={1} depth={1.1} progress={progress} className="p-insp" z={5}>
            <div className="ps-panel">
              <div className="ps-panel-bar"><SlidersHorizontal size={12} strokeWidth={2} /> Inspector</div>
              <div className="ps-insp-id"><Chip tone="night v">Table</Chip><span className="ps-mono">work_orders</span></div>
              {[['Columns', '4 of 11'], ['Row action', 'Open record'], ['Empty state', 'Custom'], ['Page size', '25']].map(([k, v]) => (
                <div className="ps-insp-row" key={k}><span>{k}</span><b>{v}</b></div>
              ))}
              <div className="ps-insp-toggle">
                <span>Show only my sites</span>
                <i className="on" />
              </div>
              <div className="ps-insp-cond">
                <span className="ps-insp-k">Visible when</span>
                <code>role = &quot;supervisor&quot;</code>
              </div>
            </div>
          </Float>

          {/* ---------- data ---------- */}
          <Float on={index >= 3} at={1} depth={1.5} progress={progress} className="p-data" z={4}>
            <div className="ps-panel">
              <div className="ps-panel-bar"><Database size={12} strokeWidth={2} /> Data sources</div>
              <div className="ps-data-src">
                <span className="ps-data-dot" /> Emvive ERP
                <em>realtime</em>
              </div>
              {[['work_order', '18,204'], ['asset', '2,841'], ['employee', '1,120'], ['site', '46']].map(([o, n], i) => (
                <div className={`ps-data-row ${i === 0 ? 'on' : ''}`} key={o}>
                  <Table2 size={11} strokeWidth={1.9} />{o}<em>{n}</em>
                </div>
              ))}
              <div className="ps-data-foot">Row-level access inherited · nothing re-granted here</div>
            </div>
          </Float>

          {/* The binding wire. Its container is anchored to the exact edges
              of the data panel and the artboard — same percentages, same
              rem offsets — so a 0→100 viewBox lands on both ports at any
              viewport width instead of drifting off them. */}
          <div className="ps-bindwire" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M0,94 C44,94 56,6 100,6"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: index >= 3 ? 1 : 0, opacity: index >= 3 ? 0.9 : 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              {index >= 3 && (
                <path
                  d="M0,94 C44,94 56,6 100,6"
                  fill="none"
                  stroke="#a5e4ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="3 160"
                  vectorEffect="non-scaling-stroke"
                  className="ps-wire-packet"
                />
              )}
            </svg>
          </div>

          {/* ---------- tokens ---------- */}
          <Float on={index >= 4} at={1} depth={1.8} progress={progress} className="p-tokens" z={6}>
            <div className="ps-panel">
              <div className="ps-panel-bar"><Palette size={12} strokeWidth={2} /> Design tokens</div>
              <div className="ps-tok-row">
                {['#6c4cf1', '#08090a', '#38bdf8', '#34d399', '#f5a524', '#f472b6'].map((c, i) => (
                  <i key={c} style={{ background: c }} className={i === 0 ? 'on' : ''} />
                ))}
              </div>
              {[['Type', 'Inter · −0.02em'], ['Radius', '10px'], ['Density', 'Comfortable']].map(([k, v]) => (
                <div className="ps-insp-row" key={k}><span>{k}</span><b>{v}</b></div>
              ))}
              <div className="ps-tok-note">Applied to 34 applications</div>
            </div>
          </Float>

          {/* ---------- responsive ---------- */}
          <Float on={index >= 5} at={1} depth={0.9} progress={progress} className="p-resp" z={7}>
            <div className="ps-resp">
              {[[Monitor, 'Desktop', '1440'], [Tablet, 'Tablet', '1024'], [Smartphone, 'Mobile', '390']].map(([Ic, l, w], i) => (
                <span className={`ps-resp-b ${i === 0 ? 'on' : ''}`} key={l}>
                  <Ic size={13} strokeWidth={1.8} />{l}<em>{w}</em>
                </span>
              ))}
              <span className="ps-resp-sep" />
              <span className="ps-resp-save"><Component size={12} strokeWidth={1.9} /> Save as component<Check size={11} strokeWidth={3} /></span>
            </div>
          </Float>

          {/* ---------- collaborators ---------- */}
          <Cursor name="Layla" tone="p" x={index >= 2 ? '58%' : '30%'} y={index >= 2 ? '30%' : '58%'} />
          <Cursor name="Omar" tone="c" x={index >= 3 ? '26%' : '68%'} y={index >= 3 ? '68%' : '26%'} />
        </div>

        {/* ---------- narration ---------- */}
        <div className="ps-narr">
          <div className="ps-narr-rail" aria-hidden="true">
            {BEATS.map((b, i) => (
              <i key={b.k} className={index === i ? 'on' : index > i ? 'past' : ''} />
            ))}
          </div>

          <div className="ps-narr-body">
            {BEATS.map((b, i) => (
              <div className={`ps-narr-item ${index === i ? 'on' : ''}`} key={b.k}>
                <span className="ps-narr-k">{String(i + 1).padStart(2, '0')} · {b.k}</span>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   SHOWCASE — five finished applications on a horizontal rail
   ===================================================================== */

const APPS = [
  {
    id: 'employee', name: 'Employee Portal', team: 'HR · 6 days to build',
    icon: Users, url: 'people.emvive.app', tone: 'v',
    note: 'Leave, payslips, documents and requests for 1,120 employees.',
  },
  {
    id: 'finance', name: 'Invoice Approvals', team: 'Finance · 4 days to build',
    icon: Wallet, url: 'approvals.emvive.app', tone: 'ink',
    note: 'Three-way match, delegation and a full audit trail.',
  },
  {
    id: 'customer', name: 'Customer Portal', team: 'Service · 9 days to build',
    icon: Headphones, url: 'support.emvive.app', tone: 'cy',
    note: 'Tickets, SLAs and a conversation thread customers can see.',
  },
  {
    id: 'inventory', name: 'Inventory Counts', team: 'Operations · 5 days to build',
    icon: Package, url: 'counts.emvive.app', tone: 'amb',
    note: 'Offline-first cycle counting on a phone in a warehouse aisle.',
  },
  {
    id: 'vendor', name: 'Vendor Onboarding', team: 'Procurement · 7 days to build',
    icon: FileCheck2, url: 'vendors.emvive.app', tone: 'run',
    note: 'Registration, document expiry and compliance sign-off.',
  },
];

/* Each screen is written out rather than generated from a config —
   five applications that share a skeleton look like five screenshots of
   one application, which defeats the point of the section. */
const Screen = ({ id }) => {
  if (id === 'employee') {
    return (
      <div className="sc sc-employee">
        <aside>
          <span className="sc-mark" />
          {['Home', 'Leave', 'Payslips', 'Documents', 'Requests'].map((n, i) => (
            <span key={n} className={i === 1 ? 'on' : ''}>{n}</span>
          ))}
        </aside>
        <main>
          <header><b>My leave</b><span className="sc-pill">Request leave</span></header>
          <div className="sc-donuts">
            {[['Annual', 18, 30], ['Sick', 4, 15], ['Unpaid', 0, 10]].map(([l, v, t]) => (
              <div key={l}>
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="16" className="t" />
                  <circle cx="20" cy="20" r="16" className="v" strokeDasharray={`${(v / t) * 100.5} 100.5`} />
                </svg>
                <b>{v}<em>/{t}</em></b><span>{l}</span>
              </div>
            ))}
          </div>
          <div className="sc-list">
            {[['12–16 Sep', 'Annual leave', 'Approved'], ['02 Aug', 'Sick leave', 'Approved'], ['21–22 Jun', 'Annual leave', 'Approved']].map(([d, t, s]) => (
              <span key={d}><b>{d}</b><em>{t}</em><u>{s}</u></span>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (id === 'finance') {
    return (
      <div className="sc sc-finance">
        <header>
          <b>Invoices awaiting approval</b>
          <span className="sc-filter"><Filter size={10} /> This week</span>
          <span className="sc-count">SAR 1,284,900</span>
        </header>
        <table>
          <thead><tr><th>Invoice</th><th>Vendor</th><th>PO match</th><th>Amount</th><th /></tr></thead>
          <tbody>
            {[
              ['INV-9241', 'Al Faisal Trading', '3-way', '184,200', true],
              ['INV-9238', 'Nexa Components', '3-way', '311,450', true],
              ['INV-9236', 'Gulf Packaging', 'Price var.', '62,900', false],
              ['INV-9231', 'Delta Chemicals', '3-way', '128,700', true],
            ].map(([n, v, m, a, ok]) => (
              <tr key={n}>
                <td className="sc-mono">{n}</td>
                <td>{v}</td>
                <td><i className={ok ? 'ok' : 'warn'} />{m}</td>
                <td className="sc-num">{a}</td>
                <td><span className="sc-approve">Approve</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer>
          <span className="sc-chain">
            {['Requester', 'Cost centre', 'Finance', 'CFO'].map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <i className={i <= 2 ? 'on' : ''} />}
                <em className={i <= 1 ? 'done' : i === 2 ? 'live' : ''}>{s}</em>
              </React.Fragment>
            ))}
          </span>
          <span className="sc-sla"><Clock size={10} /> SLA 4h · 1h 12m left</span>
        </footer>
      </div>
    );
  }

  if (id === 'customer') {
    return (
      <div className="sc sc-customer">
        <div className="sc-tickets">
          <header><b>Open tickets</b><span className="sc-pill ghost"><Plus size={10} />New</span></header>
          {[
            ['REQ-2041', 'Delivery delay at Jubail', 'High', true],
            ['REQ-2039', 'Invoice mismatch', 'Normal', false],
            ['REQ-2036', 'Site access badge', 'Normal', false],
            ['REQ-2030', 'Quotation request', 'Low', false],
          ].map(([id2, t, p, on]) => (
            <span key={id2} className={on ? 'on' : ''}>
              <b>{t}</b><em>{id2}</em><u className={p === 'High' ? 'hi' : ''}>{p}</u>
            </span>
          ))}
        </div>
        <div className="sc-thread">
          <header><b>Delivery delay at Jubail</b><span className="sc-pill">Reply</span></header>
          <div className="sc-msg them"><i>GC</i><p>The 40 pallets scheduled for Tuesday have not arrived. Site is down.</p></div>
          <div className="sc-msg us"><p>Truck TRK-208 was re-routed. New ETA is 14:20 today — tracking link attached.</p><i>AH</i></div>
          <div className="sc-msg them"><i>GC</i><p>Received, thank you.</p></div>
          <div className="sc-compose"><span>Write a reply…</span><em>Send</em></div>
        </div>
      </div>
    );
  }

  if (id === 'inventory') {
    return (
      <div className="sc sc-inventory">
        <header>
          <b>Cycle count · Aisle C</b>
          <span className="sc-offline">Offline · 12 pending</span>
        </header>
        <div className="sc-bins">
          {[
            ['C-14-01', 'Bolts M12', 480, 480], ['C-14-02', 'Gaskets 40mm', 122, 140],
            ['C-14-03', 'Seals HD', 96, 96], ['C-14-04', 'Filters A2', 38, 60],
            ['C-15-01', 'Cable 4mm', 640, 640], ['C-15-02', 'Lugs 16mm', 210, 260],
          ].map(([bin, item, c, e]) => (
            <div key={bin} className={c === e ? 'ok' : 'var'}>
              <span className="sc-mono">{bin}</span>
              <b>{item}</b>
              <div className="sc-bar"><i style={{ width: `${(c / e) * 100}%` }} /></div>
              <em>{c}<u>/{e}</u></em>
            </div>
          ))}
        </div>
        <footer>
          <span className="sc-scan">Scan next bin</span>
          <span className="sc-var">Variance 0.4% · 2 to recount</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="sc sc-vendor">
      <header><b>Vendor onboarding</b><span className="sc-pill ghost"><MoreHorizontal size={11} /></span></header>
      <div className="sc-kanban">
        {[
          ['Registered', ['Meridian Labels', 'Orbit Textiles', 'Harbour Foods']],
          ['Documents', ['Delta Chemicals', 'Nexa Components']],
          ['Compliance', ['Al Faisal Trading']],
          ['Approved', ['Gulf Packaging', 'Riyadh Logistics']],
        ].map(([col, items], ci) => (
          <div key={col}>
            <span className="sc-col-h">{col}<em>{items.length}</em></span>
            {items.map((n) => (
              <div className="sc-card" key={n}>
                <b>{n}</b>
                <span><i className={ci === 3 ? 'ok' : ci === 2 ? 'warn' : ''} />{ci === 3 ? 'CR valid' : ci === 2 ? 'Expiring 40d' : 'Awaiting'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const StudioShowcase = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const xRaw = useTransform(scrollYProgress, [0.04, 0.96], ['0vw', '-282vw']);
  const x = useSpring(xRaw, { stiffness: 92, damping: 28, mass: 0.5 });

  return (
    <section className="pw" id="apps" ref={ref}>
      <div className="pw-sticky">
        <div className="pw-head">
          <Kicker>03 — Built with Studio</Kicker>
          <MaskText text="Five applications." accent="One platform." as="h2" className="pw-h2" />
          <p>
            None of these were built by us. Each one was built by the team that
            owns the process — then inherited the platform&apos;s security, data and
            audit trail for free.
          </p>
          <span className="pw-hint"><ArrowLeft size={13} /> keep scrolling <ArrowRight size={13} /></span>
        </div>

        <motion.div className="pw-rail" style={reduced ? undefined : { x }}>
          {APPS.map((a, i) => (
            <article className={`pw-app t-${a.tone}`} key={a.id}>
              <div className="pw-app-meta">
                <span className="pw-app-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="pw-app-ic"><a.icon size={15} strokeWidth={1.8} /></span>
                <div>
                  <b>{a.name}</b>
                  <em>{a.team}</em>
                </div>
              </div>

              <Spotlight radius={340} className="pw-app-frame">
                <Browser url={a.url} tabs={[a.name]} badge="LIVE">
                  <Screen id={a.id} />
                </Browser>
              </Spotlight>

              <p className="pw-app-note">{a.note}</p>
            </article>
          ))}

          <article className="pw-app pw-more">
            <div>
              <span className="pw-more-n">+1,235</span>
              <h3>more, running in production right now.</h3>
              <p>Site inspections, safety permits, tender tracking, fleet checklists, retail audits, grant applications.</p>
              <a href="#templates" className="pw-more-link">Browse the template library <ArrowRight size={15} /></a>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
};

export { StudioShowcase };
export default StudioCanvasSection;
