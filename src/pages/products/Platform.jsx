import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Blocks, LayoutGrid, Workflow, MousePointer2, Database, KeyRound, Webhook,
  Smartphone, ShieldCheck, Zap, GitBranch, Table2, Bell, Code, Rocket,
  Puzzle, Lock, Plug, Check, Clock, Users, FileText, Mail, CircleCheckBig,
  Globe, Layers, ArrowUpRight, Filter, MessageSquare,
} from 'lucide-react';
import {
  motion, Reveal, Stagger, StaggerItem, MaskText, useLive, EASE,
} from './motion';
import {
  ProductPage, SubNav, Hero, SectionHead, Chrome, HairGrid, StatRow,
  Story, ClosingCta, Footer,
} from './system';
import { useSize } from './viz';
import './Platform.css';

/* =====================================================================
   THE CANVAS
   Nodes are placed in percentages, then resolved to real pixels so the
   connecting curves are true cubic beziers rather than a stretched
   viewBox. Figma-style: a collaborator cursor drifts across it.
   ===================================================================== */

const NODES = [
  { id: 'trigger', x: 17, y: 62, label: 'Record created', sub: 'Capex request', icon: Zap, kind: 'trigger' },
  { id: 'cond', x: 50, y: 62, label: 'Amount > 50,000', sub: 'Condition', icon: GitBranch, kind: 'cond' },
  { id: 'approve', x: 83, y: 42, label: 'Route to CFO', sub: 'Approval · SLA 24h', icon: Users, kind: 'action' },
  { id: 'notify', x: 83, y: 82, label: 'Auto-approve', sub: 'Within budget', icon: CircleCheckBig, kind: 'action' },
];

const EDGES = [['trigger', 'cond'], ['cond', 'approve'], ['cond', 'notify']];

const Canvas = ({ compact }) => {
  const [ref, { w, h }] = useSize();

  const { edges, pos } = useMemo(() => {
    if (!w || !h) return { edges: [], pos: {} };
    const p = {};
    NODES.forEach((n) => { p[n.id] = [(n.x / 100) * w, (n.y / 100) * h]; });
    const e = EDGES.map(([a, b]) => {
      const [x1, y1] = p[a];
      const [x2, y2] = p[b];
      const dx = Math.max(38, (x2 - x1) * 0.48);
      return { key: `${a}-${b}`, d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` };
    });
    return { edges: e, pos: p };
  }, [w, h]);

  return (
    <div className={`pf-canvas ${compact ? 'compact' : ''}`} ref={ref}>
      {w > 0 && (
        <svg className="pf-wires" width={w} height={h} aria-hidden="true">
          {edges.map((e, i) => (
            <g key={e.key}>
              <path d={e.d} className="pf-wire" />
              <motion.path
                d={e.d}
                className="pf-wire-run"
                initial={{ pathLength: 0.16, pathOffset: 0, opacity: 0 }}
                animate={{ pathOffset: [0, 0.84], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.6, delay: i * 0.6, repeat: Infinity,
                  repeatDelay: 0.9, ease: 'linear', times: [0, 0.15, 0.8, 1],
                }}
              />
            </g>
          ))}
        </svg>
      )}

      {NODES.map((n, i) => {
        const Icon = n.icon;
        const at = pos[n.id];
        return (
          <motion.div
            key={n.id}
            className={`pf-node ${n.kind}`}
            style={at ? { left: at[0], top: at[1] } : { left: `${n.x}%`, top: `${n.y}%` }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: EASE }}
          >
            <span className="pf-node-ic"><Icon size={13} /></span>
            <span className="pf-txt"><b>{n.label}</b><i>{n.sub}</i></span>
            <span className="pf-port in" />
            <span className="pf-port out" />
          </motion.div>
        );
      })}

      {/* the Studio artboard, selected, sitting above the flow */}
      <motion.div
        className="pf-artboard"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
      >
        <span className="pf-artboard-tag">Capex request · Form</span>
        <div className="pf-art-field"><span>Request title</span><i>New forklift — Riyadh DC</i></div>
        <div className="pf-art-row">
          <div className="pf-art-field"><span>Cost centre</span><i>Logistics · CC-204</i></div>
          <div className="pf-art-field"><span>Amount</span><i>SAR 142,000</i></div>
        </div>
        <div className="pf-art-field selected">
          <span>Justification</span>
          <i>Replaces unit FL-08, failed inspection…</i>
          <span className="pf-h tl" /><span className="pf-h tr" />
          <span className="pf-h bl" /><span className="pf-h br" />
        </div>
      </motion.div>

      {/* collaborator cursor */}
      <motion.div
        className="pf-cursor"
        aria-hidden="true"
        initial={{ x: '18%', y: '22%', opacity: 0 }}
        animate={{
          x: ['18%', '54%', '46%', '30%', '18%'],
          y: ['22%', '38%', '72%', '54%', '22%'],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.55, 0.8, 1] }}
      >
        <MousePointer2 size={15} />
        <span>Layla</span>
      </motion.div>
    </div>
  );
};

const BuilderShell = () => (
  <div className="pf-builder">
    <aside className="pf-palette">
      <span className="pf-rail-label">Components</span>
      {[
        [Table2, 'Text field'], [Filter, 'Dropdown'], [Users, 'Lookup'],
        [FileText, 'File upload'], [CircleCheckBig, 'Checkbox'], [Layers, 'Section'],
        [LayoutGrid, 'Table'], [Database, 'Data source'],
      ].map(([Icon, label]) => (
        <span className="pf-palette-item" key={label}><Icon size={12} /> {label}</span>
      ))}
    </aside>

    <Canvas />

    <aside className="pf-inspector">
      <span className="pf-rail-label">Properties</span>
      {[['Field', 'justification'], ['Type', 'Long text'], ['Required', 'Yes'], ['Visible to', 'Requester, Approver']].map(([k, v]) => (
        <div className="pf-prop" key={k}><span>{k}</span><b>{v}</b></div>
      ))}
      <div className="pf-rule">
        <Zap size={11} /> Show when <b>Amount &gt; 50,000</b>
      </div>
      <span className="pf-rail-label" style={{ marginTop: '0.9rem' }}>Publish</span>
      {[[Globe, 'Web'], [Smartphone, 'Mobile'], [Plug, 'REST API']].map(([Icon, l]) => (
        <div className="pf-target" key={l}><Icon size={11} /> {l} <span className="px-tag pos">Live</span></div>
      ))}
    </aside>
  </div>
);

/* =====================================================================
   FLOW EXECUTION — plays continuously while on screen
   ===================================================================== */

const RUN_STEPS = [
  { label: 'Trigger fired', meta: 'PO-8845 created', icon: Zap, ms: '0.02s' },
  { label: 'Condition evaluated', meta: 'Amount 142,000 > 50,000 → true', icon: GitBranch, ms: '0.04s' },
  { label: 'Approval requested', meta: 'Routed to CFO · SLA 24h', icon: Users, ms: '0.31s' },
  { label: 'Notification sent', meta: 'Email + WhatsApp to requester', icon: Mail, ms: '0.44s' },
  { label: 'Ledger updated', meta: 'Commitment posted to CC-204', icon: Table2, ms: '0.68s' },
  { label: 'Run completed', meta: 'Total 0.81s · no retries', icon: CircleCheckBig, ms: '0.81s' },
];

const FlowRun = () => {
  const [step, ref] = useLive(0, (s) => (s + 1) % (RUN_STEPS.length + 1), 1200);

  return (
    <Chrome title="flow.emvive.com/runs/48219" tags={['Execution log']} live>
      <div className="pf-run" ref={ref}>
        <div className="pf-run-chain">
          {RUN_STEPS.map((s, i) => {
            const Icon = s.icon;
            const state = i < step ? 'done' : i === step ? 'active' : 'idle';
            return (
              <div className={`pf-run-row ${state}`} key={s.label}>
                <span className="pf-run-node">
                  {state === 'done' ? <Check size={10} strokeWidth={3.5} /> : <Icon size={11} />}
                </span>
                <span className="pf-txt"><b>{s.label}</b><i>{s.meta}</i></span>
                <span className="pf-run-ms px-mono">{state === 'idle' ? '—' : s.ms}</span>
              </div>
            );
          })}
        </div>
        <div className="pf-run-foot">
          <span><b>{Math.min(step, RUN_STEPS.length)}</b> / {RUN_STEPS.length} steps</span>
          <span className="px-tag pos">99.97% success rate</span>
        </div>
      </div>
    </Chrome>
  );
};

/* =====================================================================
   STORY PANELS
   ===================================================================== */

const ModelPanel = () => (
  <Chrome title="studio.emvive.com/model" tags={['No SQL']}>
    <div className="pf-pane">
      <div className="pf-pane-head"><h5>Data model</h5><span className="px-tag accent">3 related objects</span></div>
      <div className="pf-model">
        {[
          ['Capex request', ['title · text', 'amount · currency', 'cost centre · lookup', 'status · workflow'], true],
          ['Cost centre', ['code · text', 'owner · user', 'budget · currency'], false],
          ['Approval', ['approver · user', 'decision · choice', 'decided · datetime'], false],
        ].map(([name, fields, primary], idx) => (
          <motion.div
            className={`pf-entity ${primary ? 'primary' : ''}`} key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.09, ease: EASE }}
          >
            <div className="pf-entity-head"><Database size={11} /> {name}</div>
            <ul>{fields.map((f) => <li key={f}>{f}</li>)}</ul>
          </motion.div>
        ))}
      </div>
      <div className="pf-callout">
        <Layers size={13} /> Relations, validation and indexes are generated from the model. No migration scripts.
      </div>
    </div>
  </Chrome>
);

const DesignPanel = () => (
  <Chrome title="studio.emvive.com/capex-request" tags={['Draft v1.4']}>
    <BuilderShell />
  </Chrome>
);

const LogicPanel = () => (
  <Chrome title="flow.emvive.com/po-approval" tags={['Live']}>
    <div className="pf-flowpane"><Canvas compact /></div>
  </Chrome>
);

const PublishPanel = () => (
  <Chrome title="studio.emvive.com/deploy" tags={['One click']}>
    <div className="pf-pane">
      <div className="pf-pane-head"><h5>Publish</h5><span className="px-tag pos">Live · v1.4</span></div>
      <div className="pf-targets">
        {[
          [Globe, 'Web application', 'app.emvive.com/capex'],
          [Smartphone, 'iOS & Android', 'Emvive mobile · same build'],
          [Plug, 'REST endpoint', '/api/v1/capex-request'],
        ].map(([Icon, t, m], i) => (
          <motion.div
            className="pf-target-row" key={t}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
          >
            <span className="pf-target-ic"><Icon size={13} /></span>
            <span className="pf-txt"><b>{t}</b><i>{m}</i></span>
            <span className="px-tag pos">Live</span>
          </motion.div>
        ))}
      </div>
      <div className="pf-versions">
        {[['v1.4', 'Added signature field', 'now', true], ['v1.3', 'Approval threshold 50k', '2 days ago', false], ['v1.2', 'Cost centre lookup', '1 week ago', false]].map(([v, note, when, on]) => (
          <div className={`pf-version ${on ? 'on' : ''}`} key={v}>
            <b className="px-mono">{v}</b><span>{note}</span><i>{when}</i>
          </div>
        ))}
      </div>
    </div>
  </Chrome>
);

/* =====================================================================
   STUDIO / FLOW feature strips
   ===================================================================== */

const StudioStrip = () => (
  <div className="pf-strip">
    {[
      [LayoutGrid, 'Forms & tables', 'Screens assembled from components that already know how to validate, paginate and paginate again.'],
      [Database, 'Data model', 'Objects, fields and relationships defined visually. The schema follows.'],
      [KeyRound, 'Permissions', 'Roles inherited from the ERP, enforced row by row inside the query.'],
      [Puzzle, 'Themes & components', 'A shared component library so every internal app looks like it came from one company.'],
      [Rocket, 'Publishing', 'Web, mobile and API from one build, with version history and instant rollback.'],
      [Code, 'Escape hatch', 'Drop into script for the last ten percent without leaving the platform.'],
    ].map(([Icon, title, desc], i) => (
      <motion.div
        className="pf-strip-item" key={title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
      >
        <Icon size={18} strokeWidth={1.6} />
        <h4>{title}</h4>
        <p>{desc}</p>
      </motion.div>
    ))}
  </div>
);

const FlowStrip = () => (
  <div className="pf-strip">
    {[
      [Zap, 'Triggers', 'Record events, schedules, inbound webhooks or a button a user presses.'],
      [GitBranch, 'Conditions & branching', 'Route by amount, department or supplier score. Multi-level chains without config files.'],
      [Users, 'Approvals', 'Sequential or parallel, with delegation, escalation and a hard SLA.'],
      [MessageSquare, 'Email, WhatsApp & Slack', 'Reach people where they already are, with branded templates.'],
      [Webhook, 'API & schedules', 'Call anything on a timer or on an event, with retries and backoff handled.'],
      [Clock, 'Execution logs', 'Every run, every step, every duration — and who is holding it up.'],
    ].map(([Icon, title, desc], i) => (
      <motion.div
        className="pf-strip-item" key={title}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
      >
        <Icon size={18} strokeWidth={1.6} />
        <h4>{title}</h4>
        <p>{desc}</p>
      </motion.div>
    ))}
  </div>
);

/* =====================================================================
   SHOWCASE
   ===================================================================== */

const DECK = [
  { key: 'canvas', label: 'Studio canvas', panel: <DesignPanel /> },
  { key: 'model', label: 'Data model', panel: <ModelPanel /> },
  { key: 'flow', label: 'Flow designer', panel: <LogicPanel /> },
  { key: 'runs', label: 'Execution log', panel: <FlowRun /> },
];

const ShowcaseDeck = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="pf-deck">
      <div className="pf-deck-tabs" role="tablist">
        {DECK.map((s, i) => (
          <button
            key={s.key} role="tab" aria-selected={active === i}
            className={active === i ? 'on' : ''}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {s.label}
            {active === i && (
              <motion.span className="pf-deck-underline" layoutId="pf-deck-underline" transition={{ duration: 0.45, ease: EASE }} />
            )}
          </button>
        ))}
      </div>
      <div className="pf-deck-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={DECK[active].key}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {DECK[active].panel}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ===================================================================== */
const Platform = () => {
  /* the Products mega menu routes Studio and Flow to this same page */
  const location = useLocation();

  return (
  <ProductPage
    accent="#7c3aed"
    accent2="#6d28d9"
    wash="rgba(124,58,237,0.09)"
    section={location.state?.section}
    className="pf"
  >
    <SubNav
      icon={Blocks}
      name="Emvive Platform"
      links={[
        { href: '#story', label: 'How it works' },
        { href: '#studio', label: 'Studio' },
        { href: '#flow', label: 'Flow' },
        { href: '#showcase', label: 'Product' },
      ]}
    />

    <Hero
      eyebrow="New"
      note="Studio and Flow now share a single canvas"
      title="The operating system for the apps your business"
      accentWord="keeps asking for."
      lede="Studio builds the screens. Flow runs the process behind them. Both sit directly on your live ERP data."
      primary="Book a build session"
      secondary="See how it works"
      trustedBy="In production today"
      meta={[
        { value: '5 days', label: 'Median idea to published app' },
        { value: '1,120', label: 'Hours automated each quarter' },
        { value: '0', label: 'Lines of glue between Studio and Flow' },
      ]}
    >
      <Chrome title="studio.emvive.com/capex-request" tags={['Studio', 'Flow']} live>
        <BuilderShell />
      </Chrome>
    </Hero>

    {/* ---- 02 · story ---- */}
    <section className="px-band-sm">
      <div className="px-shell">
        <SectionHead
          index="02"
          label="Product story"
          title="Watch an application get built."
          lede="A capital expenditure request, from an empty canvas to a running automation. Four moves, no ticket, no sprint."
        />
      </div>
    </section>

    <Story
      steps={[
        {
          title: 'Model the data',
          desc: 'Define objects, fields and relationships visually. Studio generates the schema, validation and indexes, and the app reads existing ERP records from the first minute.',
          panel: <ModelPanel />,
        },
        {
          title: 'Design the screen',
          desc: 'Drag components onto the canvas. Layout, responsiveness and validation arrive with them, so a working form exists before anyone writes a requirements document.',
          panel: <DesignPanel />,
        },
        {
          title: 'Connect the logic',
          desc: 'Flow takes over at the boundary. Triggers, conditions and approval chains are drawn on the same canvas, reading the same records the form just wrote.',
          panel: <LogicPanel />,
        },
        {
          title: 'Publish and watch it run',
          desc: 'One build reaches web, mobile and a REST endpoint. Every execution is logged step by step, with duration, outcome and whoever is sitting on an approval.',
          panel: <PublishPanel />,
        },
      ]}
    />

    {/* ---- 03 · STUDIO ---- */}
    <section className="px-band pf-studio-band" id="studio">
      <div className="px-shell">
        <div className="pf-product-head">
          <Reveal>
            <span className="pf-product-mark studio"><LayoutGrid size={22} /></span>
          </Reveal>
          <div>
            <Reveal delay={0.06}><span className="px-eyebrow"><i className="idx">03</i> Studio</span></Reveal>
            <MaskText text="The low-code builder your operations team can actually use." as="h2" className="px-h2" />
            <Reveal delay={0.16}>
              <p className="px-lede">
                Forms, tables, dashboards and portals — assembled on a canvas, secured by the roles
                you already maintain, published everywhere at once.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1} y={26} style={{ marginTop: '4.5rem' }}>
          <Chrome title="studio.emvive.com/capex-request" tags={['Draft v1.4']}>
            <BuilderShell />
          </Chrome>
        </Reveal>

        <div style={{ marginTop: '5rem' }}><StudioStrip /></div>
      </div>
    </section>

    {/* ---- 04 · FLOW (own accent) ---- */}
    <section className="px-band px-band-alt pf-flow-band" id="flow">
      <div className="px-shell">
        <div className="pf-product-head">
          <Reveal>
            <span className="pf-product-mark flow"><Workflow size={22} /></span>
          </Reveal>
          <div>
            <Reveal delay={0.06}><span className="px-eyebrow"><i className="idx">04</i> Flow</span></Reveal>
            <MaskText text="Automate the process, not just the paperwork." as="h2" className="px-h2" />
            <Reveal delay={0.16}>
              <p className="px-lede">
                Approvals, notifications, ledger postings and integrations — drawn visually, run
                reliably, and accounted for down to the millisecond.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="pf-flow-split">
          <Reveal y={24}>
            <Chrome title="flow.emvive.com/po-approval" tags={['Designer']}>
              <div className="pf-flowpane"><Canvas compact /></div>
            </Chrome>
          </Reveal>
          <Reveal y={24} delay={0.12}>
            <FlowRun />
          </Reveal>
        </div>

        <div style={{ marginTop: '5rem' }}><FlowStrip /></div>
      </div>
    </section>

    {/* ---- 05 · foundations ---- */}
    <section className="px-band" id="capabilities">
      <div className="px-shell">
        <SectionHead
          index="05"
          label="Foundations"
          title="Built on the platform, not beside it."
          lede="Everything you build inherits the security, data and governance the rest of Emvive already runs on."
        />
        <div style={{ marginTop: '4.5rem' }}>
          <HairGrid
            items={[
              { icon: ShieldCheck, title: 'Enterprise security', desc: 'SSO, MFA, role inheritance and row-level access on every object you create.' },
              { icon: Plug, title: 'Open APIs', desc: 'Every object gets a REST endpoint and webhook automatically, with no extra work.' },
              { icon: Smartphone, title: 'Mobile by default', desc: 'Offline capture and camera scanning in the Emvive app, from the same build.' },
              { icon: Layers, title: 'One data layer', desc: 'Studio and Flow read the records finance and supply chain write. Nothing is duplicated.' },
              { icon: FileText, title: 'Governance', desc: 'Environments, version history and an immutable log keep citizen development reviewable.' },
              { icon: Lock, title: 'Residency', desc: 'Saudi Arabia, the UAE or India — and private cloud where shared infrastructure is ruled out.' },
              { icon: Puzzle, title: 'Templates', desc: 'Approval matrices, asset registers and inspections ship ready to adapt, not blank.' },
              { icon: Globe, title: 'Multilingual & RTL', desc: 'English and Arabic layouts, regional formats and local tax rules out of the box.' },
              { icon: Bell, title: 'Observability', desc: 'Run history, SLA breaches and failure alerts surfaced before somebody chases you.' },
            ]}
          />
        </div>
      </div>
    </section>

    {/* ---- 06 · outcomes ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <SectionHead
          index="06"
          label="Enterprise outcomes"
          title="What stops going through IT."
          lede="Measured across enterprises that moved internal application development onto the platform."
        />
        <div style={{ marginTop: '4.5rem' }}>
          <StatRow
            stats={[
              { value: 5, suffix: ' days', label: 'Median time from idea to a published app' },
              { value: 1120, label: 'Hours of manual work removed each quarter' },
              { value: 99.97, decimals: 2, suffix: '%', label: 'Automation run success rate' },
              { value: 34, label: 'Internal apps live on one platform' },
            ]}
          />
        </div>
      </div>
    </section>

    {/* ---- 07 · showcase ---- */}
    <section className="px-band" id="showcase">
      <div className="px-shell">
        <SectionHead
          index="07"
          label="Inside the product"
          title="Four surfaces, one platform."
          lede="Hover to move between them. Studio and Flow are different tools reading the same records."
        />
        <div style={{ marginTop: '4rem' }}><ShowcaseDeck /></div>
      </div>
    </section>

    {/* ---- 08 · customer success ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <div className="pf-case">
          <div>
            <Reveal><span className="px-eyebrow"><i className="idx">08</i> Customer success</span></Reveal>
            <MaskText
              text="An agency quoted four months for our site inspection app. Two of our own analysts built it in nine days, and Flow had the approvals wired the same week."
              as="blockquote"
              className="pf-quote"
            />
            <Reveal delay={0.2}>
              <div className="pf-quote-by">
                <span className="pf-quote-avatar">FA</span>
                <span className="pf-txt">
                  <b>Faisal Al-Mutairi</b>
                  <i>Head of Digital, Gulf Cement</i>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <a href="#start" className="px-link" style={{ marginTop: '2.25rem' }}>
                Read the case study <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>

          <Stagger className="pf-case-metrics" gap={0.1}>
            {[['9 days', 'Sketch to production'], ['34', 'Internal apps live'], ['0', 'Developers required'], ['1,120', 'Hours saved per quarter']].map(([v, l]) => (
              <StaggerItem className="pf-case-metric" key={l}>
                <b>{v}</b><span>{l}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>

    <ClosingCta
      label="Studio & Flow"
      title="Build your first app with us."
      lede="Pick a process that still runs on email and spreadsheets. In forty-five minutes we will turn it into a working app with the approvals attached."
      primary="Book a build session"
      secondary="Talk to sales"
    />

    <Footer />
  </ProductPage>
  );
};

export default Platform;
