import React from 'react';
import {
  Database, FormInput, PanelsTopLeft, Workflow, KeyRound, Rocket, MessageSquareText,
  Check, ArrowRight, Users, FileCheck2, ShieldCheck, Table2, Bell, GitBranch, Globe,
} from 'lucide-react';
import { motion, MaskText, Reveal, EASE } from '../shared/motion';
import { Kicker, Chip, Browser, useAutoStep, AnimatePresence } from './PlatformKit';
import './PlatformIdea.css';

/* =====================================================================
   IDEA → APP

   A build line, not a list of steps. One requirement enters on the left
   and seven artifacts are produced in front of the reader — each one a
   real piece of the product rather than an icon standing in for it.

   The stepper runs itself and is clickable; it is not scroll-pinned,
   because Studio and Flow further down both are, and three pinned
   sections in a row is a page that fights the reader.
   ===================================================================== */

const STOPS = [
  { id: 'req', label: 'Requirement', icon: MessageSquareText, at: '00:00' },
  { id: 'model', label: 'Data model', icon: Database, at: '00:40' },
  { id: 'forms', label: 'Forms', icon: FormInput, at: '02:10' },
  { id: 'pages', label: 'Pages', icon: PanelsTopLeft, at: '04:05' },
  { id: 'flow', label: 'Workflow', icon: Workflow, at: '06:20' },
  { id: 'perms', label: 'Permissions', icon: KeyRound, at: '08:10' },
  { id: 'live', label: 'Published', icon: Rocket, at: '09:41' },
];

const NOTE = [
  'Read as a requirement, not a ticket. Nothing has been built yet.',
  'Three objects and the relations between them, inferred from the request.',
  'Every field arrives knowing how to validate itself.',
  'Screens for the joiner, for HR and for the approving manager.',
  'The process behind the screens, on the same canvas.',
  'Who may see the record, who may approve it, who may never touch salary.',
  'A URL, a mobile build and an API endpoint from one definition.',
];

/* ------------------------------------------------------------------ */
const Requirement = () => (
  <div className="pi-req">
    <div className="pi-req-head">
      <span className="pi-av">RM</span>
      <div>
        <b>Reem Al-Mansour</b>
        <em>HR Operations · 09:41</em>
      </div>
      <Chip tone="v">New request</Chip>
    </div>

    <p className="pi-req-body">
      “We need an <mark>employee onboarding application</mark>. New joiners upload
      their documents, HR verifies them, the line manager approves, and IT gets a
      ticket to create accounts. Right now it lives in three spreadsheets.”
    </p>

    <div className="pi-req-extract">
      <span className="pi-req-k">Understood as</span>
      {[
        ['3 objects', Database],
        ['1 form', FormInput],
        ['4 screens', PanelsTopLeft],
        ['1 approval chain', Workflow],
        ['3 roles', Users],
      ].map(([t, Ic]) => (
        <span className="pi-req-tag" key={t}><Ic size={11} strokeWidth={2} />{t}</span>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
const ENTITIES = [
  { name: 'employee', x: 12, y: 14, fields: ['id', 'full_name', 'position', 'start_date', 'manager_id'] },
  { name: 'document', x: 60, y: 6, fields: ['id', 'employee_id', 'type', 'file', 'verified'] },
  { name: 'approval', x: 56, y: 58, fields: ['id', 'employee_id', 'approver', 'state'] },
];

const DataModel = () => (
  <div className="pi-model">
    <svg className="pi-model-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M46,26 C55,26 52,16 60,16"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      />
      <motion.path
        d="M46,34 C54,34 50,68 56,68"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
      />
    </svg>

    {ENTITIES.map((e, i) => (
      <motion.div
        className="pi-ent"
        key={e.name}
        style={{ left: `${e.x}%`, top: `${e.y}%` }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
      >
        <div className="pi-ent-h"><Table2 size={11} strokeWidth={2} />{e.name}</div>
        {e.fields.map((f) => (
          <div className="pi-ent-f" key={f}>
            <i className={f.endsWith('_id') || f === 'id' ? 'key' : ''} />
            {f}
          </div>
        ))}
      </motion.div>
    ))}

    <span className="pi-model-note">Relations inferred · 2 foreign keys · row-level security inherited</span>
  </div>
);

/* ------------------------------------------------------------------ */
const Forms = () => (
  <div className="pi-forms">
    <div className="pi-form-card">
      <div className="pi-form-h"><FormInput size={12} strokeWidth={2} /> New joiner<span>Draft · autosaved</span></div>
      {[
        ['Full name', 'Yusuf Rahman', 'Required'],
        ['Position', 'Site engineer', 'From list'],
        ['Start date', '12 Sep 2026', 'Date'],
        ['Line manager', 'A. Hassan', 'Lookup'],
      ].map(([l, v, rule], i) => (
        <motion.div
          className="pi-form-row"
          key={l}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
        >
          <span className="pi-form-l">{l}</span>
          <span className="pi-form-v">{v}</span>
          <i className="pi-form-rule">{rule}</i>
        </motion.div>
      ))}

      <motion.div
        className="pi-form-drop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        <FileCheck2 size={14} strokeWidth={1.7} />
        Passport · Iqama · Degree certificate
        <span>3 files</span>
      </motion.div>

      <div className="pi-form-submit">Submit for verification</div>
    </div>

    <div className="pi-form-side">
      <span className="pi-side-k">Validation</span>
      {['Iqama expiry must be > 6 months', 'Start date cannot be in the past', 'Manager must be active'].map((r) => (
        <span className="pi-side-row" key={r}><Check size={11} strokeWidth={2.6} /><em>{r}</em></span>
      ))}
      <span className="pi-side-k">Layout</span>
      <div className="pi-side-cols"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
const Pages = () => (
  <div className="pi-pages">
    <div className="pi-tree">
      <span className="pi-side-k">Pages</span>
      {[
        ['Onboarding home', true],
        ['New joiner', false],
        ['Document review', false],
        ['Manager approvals', false],
        ['Reports', false],
      ].map(([p, on], i) => (
        <motion.span
          className={`pi-tree-row ${on ? 'on' : ''}`}
          key={p}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
        >
          <PanelsTopLeft size={11} strokeWidth={1.9} />{p}
        </motion.span>
      ))}
    </div>

    <div className="pi-wire">
      <div className="pi-wire-top"><i /><i /><i /><span>Onboarding home</span></div>
      <div className="pi-wire-body">
        <div className="pi-wire-nav">{Array.from({ length: 5 }).map((_, i) => <i key={i} />)}</div>
        <div className="pi-wire-main">
          <div className="pi-wire-kpis">
            {[['14', 'In progress'], ['6', 'Awaiting docs'], ['3', 'With manager'], ['21', 'Completed']].map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: EASE }}
              >
                <b>{n}</b><span>{l}</span>
              </motion.div>
            ))}
          </div>
          <div className="pi-wire-table">
            {['Yusuf Rahman · Site engineer', 'Noura Saleh · Accountant', 'Tariq Aziz · Driver'].map((r, i) => (
              <motion.span
                key={r}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <i />{r}<em>{['Docs', 'Approval', 'IT setup'][i]}</em>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
const FLOW = [
  { t: 'Joiner submits', ic: FormInput },
  { t: 'HR verifies docs', ic: FileCheck2 },
  { t: 'Manager approves', ic: Check },
  { t: 'IT account created', ic: ShieldCheck },
  { t: 'Welcome email', ic: Bell },
];

const FlowStop = () => (
  <div className="pi-flow">
    <svg className="pi-flow-wires" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M${11 + i * 19.5},30 L${28 + i * 19.5},30`}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.16, ease: EASE }}
        />
      ))}
    </svg>

    {FLOW.map((n, i) => (
      <motion.div
        className="pi-flow-n"
        key={n.t}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: i * 0.16, ease: EASE }}
      >
        <span className="pi-flow-ic"><n.ic size={14} strokeWidth={1.8} /></span>
        <b>{n.t}</b>
        <em>{['on submit', '2 checks', 'SLA 24h', 'API', 'template'][i]}</em>
      </motion.div>
    ))}

    <motion.div
      className="pi-flow-branch"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
    >
      <GitBranch size={12} strokeWidth={2} />
      If a document fails verification → return to joiner with a reason
    </motion.div>
  </div>
);

/* ------------------------------------------------------------------ */
const ROLES = ['Joiner', 'HR officer', 'Line manager', 'IT admin'];
const OBJECTS = ['Own record', 'All employees', 'Documents', 'Salary', 'Approve'];
const MATRIX = [
  [2, 0, 1, 0, 0],
  [2, 2, 2, 1, 1],
  [1, 1, 1, 0, 2],
  [0, 1, 0, 0, 0],
];

const Perms = () => (
  <div className="pi-perms">
    <div className="pi-perm-grid" style={{ gridTemplateColumns: `9rem repeat(${OBJECTS.length}, minmax(0, 1fr))` }}>
      <span />
      {OBJECTS.map((o) => <span className="pi-perm-c" key={o}>{o}</span>)}

      {ROLES.map((r, ri) => (
        <React.Fragment key={r}>
          <span className="pi-perm-r">{r}</span>
          {MATRIX[ri].map((v, ci) => (
            <motion.span
              className={`pi-perm-cell v${v}`}
              key={`${r}-${OBJECTS[ci]}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: (ri * OBJECTS.length + ci) * 0.022, ease: EASE }}
            >
              {v === 2 ? <Check size={11} strokeWidth={3} /> : v === 1 ? <i /> : <em />}
            </motion.span>
          ))}
        </React.Fragment>
      ))}
    </div>

    <div className="pi-perm-legend">
      <span><i className="l2" />Full</span>
      <span><i className="l1" />Read only</span>
      <span><i className="l0" />No access</span>
      <span className="pi-perm-src"><ShieldCheck size={11} strokeWidth={2} /> Inherited from your ERP roles — not redefined here</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
const Published = () => (
  <div className="pi-live">
    <Browser url="onboarding.emvive.app" tabs={['Onboarding']} badge="LIVE" className="pi-live-br">
      <div className="pi-live-app">
        <div className="pi-live-nav">
          <span className="pi-live-mark" />
          <b>Employee Onboarding</b>
          {['Home', 'Joiners', 'Documents', 'Approvals'].map((n, i) => (
            <span key={n} className={i === 1 ? 'on' : ''}>{n}</span>
          ))}
          <span className="pi-live-av">RM</span>
        </div>

        <div className="pi-live-body">
          <div className="pi-live-kpis">
            {[['14', 'In progress'], ['6', 'Awaiting docs'], ['3', 'With manager'], ['1.4d', 'Avg. cycle']].map(([n, l]) => (
              <div key={l}><b>{n}</b><span>{l}</span></div>
            ))}
          </div>
          <div className="pi-live-list">
            {[
              ['Yusuf Rahman', 'Site engineer', 'Docs verified', 'ok'],
              ['Noura Saleh', 'Accountant', 'With manager', 'warn'],
              ['Tariq Aziz', 'Driver', 'IT setup', 'ok'],
              ['Hana Kareem', 'QA lead', 'Awaiting docs', 'warn'],
            ].map(([n, p, s, tone]) => (
              <span key={n}>
                <i className="pi-live-dot" />
                <b>{n}</b>
                <em>{p}</em>
                <u className={tone}>{s}</u>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Browser>

    <div className="pi-live-meta">
      {[
        [Globe, 'onboarding.emvive.app'],
        [Users, '212 employees onboarded'],
        [ShieldCheck, 'SSO + audit trail from day one'],
      ].map(([Ic, t]) => (
        <span key={t}><Ic size={12} strokeWidth={1.9} />{t}</span>
      ))}
    </div>
  </div>
);

const STAGE = [Requirement, DataModel, Forms, Pages, FlowStop, Perms, Published];

/* ================================================================== */
const PlatformIdea = () => {
  const { ref, index, pick, bind } = useAutoStep(STOPS.length, 3400, { hold: 5200 });
  const Active = STAGE[index];

  return (
    <section className="pi" id="idea" ref={ref} {...bind}>
      <div className="pi-inner">
        <div className="pi-head">
          <Reveal><Kicker>01 — Idea to application</Kicker></Reveal>
          <MaskText text="One request in." accent="A working application out." as="h2" className="pi-h2" />
          <Reveal delay={0.16} y={14}>
            <p className="pi-lede">
              This is a real onboarding app, assembled the way Emvive assembles one.
              Watch the seven artifacts a single request produces — and how long each takes.
            </p>
          </Reveal>
        </div>

        {/* ------- the build line ------- */}
        <div className="pi-line">
          <div className="pi-line-track" aria-hidden="true">
            <motion.i
              className="pi-line-fill"
              animate={{ scaleX: index / (STOPS.length - 1) }}
              transition={{ duration: 0.75, ease: EASE }}
            />
          </div>

          {STOPS.map((s, i) => (
            <button
              type="button"
              key={s.id}
              className={`pi-stop ${index === i ? 'on' : ''} ${index > i ? 'done' : ''}`}
              onClick={() => pick(i)}
              aria-current={index === i ? 'step' : undefined}
            >
              <span className="pi-stop-node">
                {index > i ? <Check size={12} strokeWidth={3} /> : <s.icon size={13} strokeWidth={1.9} />}
              </span>
              <b>{s.label}</b>
              <em>{s.at}</em>
            </button>
          ))}
        </div>

        {/* ------- the artifact ------- */}
        <div className="pi-stage">
          <div className="pi-stage-bar">
            <span className="pi-stage-n">{String(index + 1).padStart(2, '0')} / 07</span>
            <span className="pi-stage-note">{NOTE[index]}</span>
            <span className="pi-stage-t">
              <i /> {index === STOPS.length - 1 ? 'session complete' : 'building'} · {STOPS[index].at}
            </span>
          </div>

          <div className="pi-stage-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={STOPS[index].id}
                className="pi-stage-slot"
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.995 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Active />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="pi-foot">
          <span>Nine minutes and forty-one seconds, start to production URL.</span>
          <a href="#studio" className="pi-foot-link">See how Studio does it <ArrowRight size={15} /></a>
        </div>
      </div>
    </section>
  );
};

export default PlatformIdea;
