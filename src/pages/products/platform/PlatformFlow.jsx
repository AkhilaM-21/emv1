import React, { useMemo } from 'react';
import {
  Zap, Database, FileCheck2, GitBranch, UserCheck, ShieldCheck, Bell, Check,
  RefreshCw, Clock, Play, Timer, AlertTriangle, Braces, Workflow, Mail,
  ListChecks, Filter, Split, Webhook, Bot, Table2, Sparkles,
  MousePointer2, PanelsTopLeft, Repeat,
} from 'lucide-react';
import {
  motion, useSteps, useTransform, useReducedMotion, MaskText, Reveal, EASE,
} from '../shared/motion';
import { Kicker, Code, DotField, Kbd, useAutoStep, AnimatePresence } from './PlatformKit';
import './PlatformFlow.css';

/* =====================================================================
   FLOW

   Studio is a canvas you place things on. Flow is a graph that *runs* —
   so it gets a different visual key entirely: wires instead of panels,
   green execution instead of violet selection, and state that changes
   over time rather than properties that change on click.

   Two sections, deliberately perpendicular:
     · AUTHORING — a horizontal editor canvas. Left to right, because
       that is how a process is designed.
     · EXECUTION — a vertical trace. Top to bottom, because that is how
       a run is read, and because scrolling down should feel like
       following the run rather than scrubbing a video.
   ===================================================================== */

/* ------------------------------------------------------------------
   AUTHORING CANVAS
   Geometry lives in a 1320×560 space and the container is locked to
   that aspect ratio, so nodes positioned in per-cent and wires drawn
   in user units land on each other exactly at any width.
   ------------------------------------------------------------------ */
const W = 1320;
const H = 560;

const NODES = [
  { id: 'trigger', x: 20, y: 200, label: 'New employee created', sub: 'Trigger · Emvive HR', icon: Zap, kind: 'trigger' },
  { id: 'record', x: 200, y: 200, label: 'Create onboarding record', sub: 'Action · Data', icon: Database, kind: 'action' },
  { id: 'verify', x: 380, y: 200, label: 'Verify documents', sub: 'Action · OCR + rules', icon: FileCheck2, kind: 'action' },
  { id: 'cond', x: 560, y: 200, label: 'All documents valid?', sub: 'Condition', icon: GitBranch, kind: 'cond', w: 110 },
  { id: 'approve', x: 710, y: 200, label: 'Manager approval', sub: 'Human · SLA 24h', icon: UserCheck, kind: 'human' },
  { id: 'account', x: 890, y: 200, label: 'Create IT account', sub: 'Action · REST', icon: ShieldCheck, kind: 'action' },
  { id: 'notify', x: 1070, y: 200, label: 'Notify HR + joiner', sub: 'Action · Email', icon: Bell, kind: 'action' },
  { id: 'reject', x: 710, y: 400, label: 'Return to joiner', sub: 'Action · with reason', icon: RefreshCw, kind: 'alt' },
];

const NW = 150;
const NH = 64;

const EDGES = [
  { d: `M170,232 L200,232`, tone: '' },
  { d: `M350,232 L380,232`, tone: '' },
  { d: `M530,232 L560,232`, tone: '' },
  { d: `M670,232 L710,232`, tone: 'run', label: 'yes', lx: 690, ly: 220 },
  { d: `M860,232 L890,232`, tone: '' },
  { d: `M1040,232 L1070,232`, tone: '' },
  { d: `M615,264 C615,360 640,432 710,432`, tone: 'amb', label: 'no', lx: 606, ly: 330 },
  { d: `M710,432 C540,432 455,410 455,264`, tone: 'amb', dash: true },
];

const LIB = [
  ['Triggers', [[Zap, 'Record created'], [Clock, 'Schedule'], [Webhook, 'Webhook'], [Mail, 'Inbound email']]],
  ['Logic', [[GitBranch, 'Condition'], [Split, 'Parallel branch'], [Repeat, 'Loop over rows'], [Filter, 'Filter']]],
  ['Actions', [[Database, 'Create / update'], [Mail, 'Send email'], [Bell, 'Notify'], [Webhook, 'Call API']]],
  ['AI', [[Bot, 'Extract from document'], [Sparkles, 'Summarise'], [ListChecks, 'Classify']]],
];

const FlowCanvas = () => {
  const { ref, index, bind } = useAutoStep(NODES.length, 1300, { hold: 3000 });

  /* the packet walks the main path node by node, so the canvas is alive
     without pretending to be a full execution — that is the next section's
     job, and doing it twice would flatten both */
  const lit = useMemo(() => NODES.slice(0, index + 1).map((n) => n.id), [index]);

  return (
    <section className="pf" id="flow" ref={ref} {...bind}>
      <DotField tone="dark" size={30} className="pf-dots fade" />

      <div className="pf-inner">
        <div className="pf-head">
          <Reveal><Kicker tone="dark run">04 — Flow</Kicker></Reveal>
          <MaskText text="The process behind" accent="the screen." as="h2" className="pf-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              Triggers, conditions, human approvals, API calls and AI steps on one
              canvas — reading and writing the same records the application does.
              No integration layer between them, because there is nothing to integrate.
            </p>
          </Reveal>
        </div>

        <div className="pf-editor">
          {/* ---------- node library ---------- */}
          <aside className="pf-lib">
            <div className="pf-lib-search">Search nodes <Kbd>/</Kbd></div>
            {LIB.map(([group, items]) => (
              <div className="pf-lib-g" key={group}>
                <span className="pf-lib-k">{group}</span>
                {items.map(([Ic, l]) => (
                  <span className="pf-lib-i" key={l}><Ic size={12} strokeWidth={1.8} />{l}</span>
                ))}
              </div>
            ))}
          </aside>

          {/* ---------- graph ---------- */}
          <div className="pf-graphwrap">
            <div className="pf-toolbar">
              <span className="pf-tool on"><MousePointer2 size={11} strokeWidth={2} /></span>
              <span className="pf-tool"><Workflow size={11} strokeWidth={2} /></span>
              <span className="pf-tool"><Braces size={11} strokeWidth={2} /></span>
              <span className="pf-tool-sep" />
              <span className="pf-tool-run"><Play size={10} fill="currentColor" /> Test run</span>
              <span className="pf-tool-v">v4 · 8 nodes · saved</span>
            </div>

            <div className="pf-graph">
              <svg className="pf-wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                {EDGES.map((e, i) => (
                  <g key={e.d} className={`pf-edge ${e.tone} ${e.dash ? 'dash' : ''} ${i <= index ? 'on' : ''}`}>
                    <path d={e.d} className="pf-edge-t" vectorEffect="non-scaling-stroke" />
                    <path d={e.d} className="pf-edge-l" vectorEffect="non-scaling-stroke" />
                    <path d={e.d} className="pf-edge-p" vectorEffect="non-scaling-stroke" />
                  </g>
                ))}
              </svg>

              {EDGES.filter((e) => e.label).map((e) => (
                <span
                  className={`pf-elabel ${e.tone}`}
                  key={e.label}
                  style={{ left: `${(e.lx / W) * 100}%`, top: `${(e.ly / H) * 100}%` }}
                >
                  {e.label}
                </span>
              ))}

              {NODES.map((n, i) => (
                <div
                  className={`pf-node k-${n.kind} ${lit.includes(n.id) ? 'lit' : ''} ${index === i ? 'sel' : ''}`}
                  key={n.id}
                  style={{
                    left: `${(n.x / W) * 100}%`,
                    top: `${(n.y / H) * 100}%`,
                    width: `${((n.w || NW) / W) * 100}%`,
                    height: `${(NH / H) * 100}%`,
                  }}
                >
                  <span className="pf-node-ic"><n.icon size={13} strokeWidth={1.9} /></span>
                  <span className="pf-node-t">
                    <b>{n.label}</b>
                    <em>{n.sub}</em>
                  </span>
                  <i className="pf-port l" />
                  <i className="pf-port r" />
                </div>
              ))}
            </div>
          </div>

          {/* ---------- node inspector ---------- */}
          <aside className="pf-insp">
            <span className="pf-insp-h">Node</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={NODES[index].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="pf-insp-id">
                  <span className={`pf-insp-ic k-${NODES[index].kind}`}>
                    {React.createElement(NODES[index].icon, { size: 13, strokeWidth: 1.9 })}
                  </span>
                  <b>{NODES[index].label}</b>
                </div>
                <span className="pf-insp-sub">{NODES[index].sub}</span>
              </motion.div>
            </AnimatePresence>

            <span className="pf-insp-h">Configuration</span>
            <Code
              code={`{
  "on_error": "retry",
  "retries": 3,
  "backoff": "exponential",
  "timeout_ms": 8000
}`}
              numbers={false}
              className="pf-insp-code"
            />

            <span className="pf-insp-h">Last 24 hours</span>
            <div className="pf-insp-stats">
              {[['Runs', '412'], ['Success', '99.8%'], ['Median', '0.81s'], ['Retries', '3']].map(([k, v]) => (
                <div key={k}><b>{v}</b><span>{k}</span></div>
              ))}
            </div>
          </aside>
        </div>

        <div className="pf-foot">
          {[
            [Zap, 'Any record event, schedule, webhook or inbound email can start a flow.'],
            [UserCheck, 'Human steps are first-class — approvals, reviews and delegations, not just API calls.'],
            [ShieldCheck, 'Every run is signed, timed and kept. Auditors get the trace, not a screenshot.'],
          ].map(([Ic, t]) => (
            <span key={t}><Ic size={14} strokeWidth={1.8} />{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   EXECUTION — a vertical trace, driven by scroll
   ===================================================================== */

const RUN = [
  {
    id: 'trigger', icon: Zap, label: 'New employee created', kind: 'trigger',
    state: 'Triggered', ms: '0 ms',
    log: [{ t: 'run #48219 started', m: 'trigger: employee.created', tone: 'v' }],
    payload: `{
  "event": "employee.created",
  "employee_id": "E-2041",
  "name": "Yusuf Rahman",
  "site": "Jubail Terminal 4"
}`,
  },
  {
    id: 'record', icon: Database, label: 'Create onboarding record', kind: 'action',
    state: 'Success', ms: '18 ms',
    log: [{ t: 'onboarding record created', m: 'ONB-1187', tone: 'ok', ms: '18ms' }],
    payload: `{
  "onboarding_id": "ONB-1187",
  "stage": "documents",
  "checklist": 7
}`,
  },
  {
    id: 'verify', icon: FileCheck2, label: 'Verify documents', kind: 'action',
    state: 'Retried · then success', ms: '1.24 s', retry: true,
    log: [
      { t: 'ocr timeout', m: 'attempt 1 of 3', tone: 'warn' },
      { t: 'retrying in 400ms', m: 'exponential backoff', tone: 'warn' },
      { t: '3 documents read', m: 'passport · iqama · degree', tone: 'ok', ms: '1.24s' },
    ],
    payload: `{
  "documents": 3,
  "iqama_expiry": "2029-04-11",
  "confidence": 0.98,
  "attempts": 2
}`,
  },
  {
    id: 'cond', icon: GitBranch, label: 'All documents valid?', kind: 'cond',
    state: 'true → approval branch', ms: '2 ms',
    log: [{ t: 'condition evaluated true', m: 'expiry > 6 months', tone: 'v', ms: '2ms' }],
    payload: `{
  "expression": "all(docs.valid) && iqama_months > 6",
  "result": true,
  "branch": "approval"
}`,
  },
  {
    id: 'approve', icon: UserCheck, label: 'Manager approval', kind: 'human',
    state: 'Approved by A. Hassan', ms: '1 h 12 m', human: true,
    log: [
      { t: 'assigned to A. Hassan', m: 'SLA 24h · mobile push sent', tone: 'v' },
      { t: 'approved', m: 'A. Hassan · from mobile', tone: 'ok', ms: '1h12m' },
    ],
    payload: `{
  "approver": "a.hassan@gulfcement.com",
  "decision": "approved",
  "channel": "mobile",
  "sla_used": "5%"
}`,
  },
  {
    id: 'account', icon: ShieldCheck, label: 'Create IT account', kind: 'action',
    state: 'Success', ms: '410 ms',
    log: [{ t: 'identity provisioned', m: 'SSO group: field-ops', tone: 'ok', ms: '410ms' }],
    payload: `{
  "upn": "y.rahman@gulfcement.com",
  "groups": ["field-ops", "site-jubail"],
  "mfa": "enforced"
}`,
  },
  {
    id: 'notify', icon: Bell, label: 'Notify HR + joiner', kind: 'action',
    state: 'Success', ms: '62 ms',
    log: [
      { t: 'welcome email sent', m: 'template: onboarding-ar', tone: 'ok', ms: '38ms' },
      { t: 'HR notified in-app', m: 'R. Al-Mansour', tone: 'ok', ms: '24ms' },
    ],
    payload: `{
  "channels": ["email", "in_app", "whatsapp"],
  "locale": "ar",
  "delivered": true
}`,
  },
  {
    id: 'done', icon: Check, label: 'Run complete', kind: 'done',
    state: 'Completed', ms: '1 h 12 m 01 s',
    log: [{ t: 'run #48219 completed', m: '7 steps · 1 retry · 0 failures', tone: 'ok', ms: '1h12m' }],
    payload: `{
  "run": 48219,
  "status": "success",
  "steps": 7,
  "retries": 1,
  "cost_units": 4
}`,
  },
];

const FlowRun = () => {
  const { ref, index, progress } = useSteps(RUN.length);
  const reduced = useReducedMotion();

  /* the spine fills as the run walks down it */
  const fill = useTransform(progress, [0, 1], ['0%', '100%']);

  const logs = useMemo(() => {
    const out = [];
    RUN.slice(0, index + 1).forEach((s, si) => {
      s.log.forEach((l, li) => out.push({ ...l, id: `${si}-${li}` }));
    });
    return out.slice(-6);
  }, [index]);

  const step = RUN[index];

  return (
    <section className="pr" id="run" ref={ref} style={{ height: `${RUN.length * 90}vh` }}>
      <div className="pr-sticky">
        <span className="pr-glow" aria-hidden="true" />

        <div className="pr-head">
          <Kicker tone="dark run">05 — One run, step by step</Kicker>
          <h2 className="pr-h2">Watch it execute.</h2>
          <div className="pr-runmeta">
            <span className="pr-runid">run&nbsp;#48219</span>
            <span><Timer size={12} strokeWidth={1.9} /> {step.ms}</span>
            <span className={index === RUN.length - 1 ? 'ok' : ''}>
              <i />{index === RUN.length - 1 ? 'completed' : 'running'}
            </span>
          </div>
        </div>

        <div className="pr-body">
          {/* ---------- the vertical trace ---------- */}
          <div className="pr-trace">
            <div className="pr-spine" aria-hidden="true">
              {reduced
                ? <i className="pr-spine-fill" style={{ height: '100%' }} />
                : <motion.i className="pr-spine-fill" style={{ height: fill }} />}
            </div>

            {RUN.map((s, i) => (
              <div
                className={`pr-step k-${s.kind} ${index === i ? 'on' : ''} ${index > i ? 'past' : ''}`}
                key={s.id}
              >
                <span className="pr-node">
                  {index > i ? <Check size={13} strokeWidth={3} /> : <s.icon size={14} strokeWidth={1.9} />}
                  {index === i && <i className="pr-node-halo" />}
                </span>

                <div className="pr-step-b">
                  <b>{s.label}</b>
                  <em>{index >= i ? s.state : 'queued'}</em>
                </div>

                <span className="pr-step-ms">{index >= i ? s.ms : '—'}</span>

                {s.retry && index === i && (
                  <motion.span
                    className="pr-retry"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <RefreshCw size={10} strokeWidth={2.4} /> retry 1 of 3
                  </motion.span>
                )}

                {s.human && index === i && (
                  <motion.span
                    className="pr-human"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <UserCheck size={10} strokeWidth={2.4} /> waiting on a person
                  </motion.span>
                )}

                {s.kind === 'cond' && index >= i && (
                  <span className="pr-branch">
                    <em className="on">yes → approval</em>
                    <em>no → return to joiner</em>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ---------- the run inspector ---------- */}
          <div className="pr-side">
            <div className="pr-blk">
            <div className="pr-panel">
              <div className="pr-panel-h">
                <Braces size={12} strokeWidth={2} /> Payload
                <span className="pr-panel-tag">step {index + 1} / {RUN.length}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <Code code={step.payload} numbers={false} className="pr-code" />
                </motion.div>
              </AnimatePresence>
            </div>
            </div>

            <div className="pr-blk grow">
            <div className="pr-panel grow">
              <div className="pr-panel-h">
                <ListChecks size={12} strokeWidth={2} /> Execution log
                <span className="pr-panel-tag live"><i /> live</span>
              </div>
              <div className="pr-log">
                <AnimatePresence initial={false}>
                  {logs.map((l) => (
                    <motion.div
                      className={`pr-log-l ${l.tone}`}
                      key={l.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <i />
                      <span>{l.t}</span>
                      <em>{l.m}</em>
                      {l.ms && <b>{l.ms}</b>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            </div>

            <div className="pr-blk">
            <div className="pr-note">
              <AlertTriangle size={13} strokeWidth={1.9} />
              A failed step does not lose the run. It retries, escalates, or waits — and
              the trace shows exactly where it stopped and why.
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   BRIDGE — Studio makes the application, Flow makes it act
   ===================================================================== */

const CHAIN = [
  {
    k: 'App', icon: PanelsTopLeft, tone: 'v',
    t: 'A field engineer submits a job sheet.',
    frag: 'form',
  },
  {
    k: 'Data', icon: Table2, tone: 'cy',
    t: 'It becomes a record in work_order.',
    frag: 'record',
  },
  {
    k: 'Workflow', icon: Workflow, tone: 'run',
    t: 'The record event starts a flow.',
    frag: 'flow',
  },
  {
    k: 'Automation', icon: Bot, tone: 'run',
    t: 'Parts are reserved and the invoice drafted.',
    frag: 'auto',
  },
  {
    k: 'Action', icon: Mail, tone: 'amb',
    t: 'The customer gets a signed report before the van leaves.',
    frag: 'action',
  },
];

const Frag = ({ kind }) => {
  if (kind === 'form') {
    return (
      <div className="pbr-frag f-form">
        <span className="pbr-frag-h">Job sheet · WO-4412</span>
        <span className="pbr-frag-r"><i>Asset</i> Compressor 2</span>
        <span className="pbr-frag-r"><i>Hours</i> 3.5</span>
        <span className="pbr-frag-r"><i>Parts</i> Seal kit ×2</span>
        <span className="pbr-frag-btn">Submit</span>
      </div>
    );
  }
  if (kind === 'record') {
    return (
      <div className="pbr-frag f-record">
        <span className="pbr-frag-h">work_order</span>
        {[['id', 'WO-4412'], ['status', 'completed'], ['labour_h', '3.5'], ['parts', '2']].map(([k, v]) => (
          <span className="pbr-frag-kv" key={k}><i>{k}</i>{v}</span>
        ))}
      </div>
    );
  }
  if (kind === 'flow') {
    return (
      <div className="pbr-frag f-flow">
        <span className="pbr-frag-h">on work_order.completed</span>
        {['Reserve parts', 'Draft invoice', 'Generate report'].map((n, i) => (
          <span className="pbr-frag-n" key={n}><i style={{ animationDelay: `${i * 0.25}s` }} />{n}</span>
        ))}
      </div>
    );
  }
  if (kind === 'auto') {
    return (
      <div className="pbr-frag f-auto">
        <span className="pbr-frag-h">Executed</span>
        <span className="pbr-frag-ok"><Check size={11} strokeWidth={3} />Stock reserved · seal kit ×2</span>
        <span className="pbr-frag-ok"><Check size={11} strokeWidth={3} />Invoice INV-9312 drafted</span>
        <span className="pbr-frag-ok"><Check size={11} strokeWidth={3} />Report PDF signed</span>
      </div>
    );
  }
  return (
    <div className="pbr-frag f-action">
      <span className="pbr-frag-h">To: operations@gulfcement.com</span>
      <b>Service report · Compressor 2</b>
      <p>Completed 14:22. Seal kit replaced. Next service due 12 Mar.</p>
      <span className="pbr-frag-att">report-WO-4412.pdf</span>
    </div>
  );
};

const Bridge = () => {
  const { ref, index, pick, bind } = useAutoStep(CHAIN.length, 2600, { hold: 4200 });

  return (
    <section className="pbr" id="bridge" ref={ref} {...bind}>
      <div className="pbr-inner">
        <div className="pbr-head">
          <Reveal><Kicker>06 — Studio × Flow</Kicker></Reveal>
          <MaskText text="The screen and the process" accent="are the same object." as="h2" className="pbr-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              In most stacks the app is one product, the workflow engine is another,
              and an integration team sits between them. Here, one submission travels
              the whole way without crossing a boundary.
            </p>
          </Reveal>
        </div>

        <div className="pbr-chain">
          <div className="pbr-track" aria-hidden="true">
            <motion.i animate={{ scaleX: index / (CHAIN.length - 1) }} transition={{ duration: 0.7, ease: EASE }} />
          </div>

          {CHAIN.map((c, i) => (
            <button
              type="button"
              key={c.k}
              className={`pbr-stop t-${c.tone} ${index === i ? 'on' : ''} ${index > i ? 'past' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="pbr-node"><c.icon size={15} strokeWidth={1.8} /></span>
              <b>{c.k}</b>
            </button>
          ))}
        </div>

        <div className="pbr-stage">
          {CHAIN.map((c, i) => (
            <div className={`pbr-slot ${index === i ? 'on' : ''} ${index > i ? 'past' : ''}`} key={c.k}>
              <Frag kind={c.frag} />
            </div>
          ))}
        </div>

        <div className="pbr-say">
          <AnimatePresence mode="wait">
            <motion.p
              key={CHAIN[index].k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {CHAIN[index].t}
            </motion.p>
          </AnimatePresence>
          <span className="pbr-elapsed">
            <Timer size={12} strokeWidth={1.9} /> 0 → 4.1 seconds, end to end
          </span>
        </div>
      </div>
    </section>
  );
};

export { FlowRun, Bridge };
export default FlowCanvas;
