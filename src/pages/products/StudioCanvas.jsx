import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Type, List, Calendar, Hash, Upload, ToggleLeft, Table2, Database,
  Zap, GitBranch, Mail, CircleCheckBig, Play, Users, Globe, Smartphone,
  Layers, Search, ChevronDown, MoreHorizontal, Share2, Rocket, Terminal,
  MousePointer2, Frame, Cloud,
} from 'lucide-react';
import { motion, EASE } from './motion';
import './StudioCanvas.css';

/* =====================================================================
   EMVIVE STUDIO — the editor
   The page is an application window. Chrome is fixed; the canvas behind
   it pans and zooms. Artefacts are placed in canvas coordinates and
   appear as the build progresses.
   ===================================================================== */

/* ---------------------------------------------------------------
   CHROME
   --------------------------------------------------------------- */
export const TopBar = ({ zoom, step }) => (
  <div className="st-top">
    <div className="st-top-l">
      <span className="st-mark"><Frame size={13} /></span>
      <span className="st-file">
        <b>capex-request</b>
        <em>Emvive Studio</em>
      </span>
      <span className="st-branch"><GitBranch size={10} /> main</span>
      <span className="st-saved">All changes saved</span>
    </div>

    <div className="st-top-c">
      {['Design', 'Data', 'Logic', 'Preview'].map((t, i) => (
        <span className={`st-tab ${i === Math.min(3, Math.floor(step / 2)) ? 'on' : ''}`} key={t}>{t}</span>
      ))}
    </div>

    <div className="st-top-r">
      <span className="st-zoom">{zoom}%<ChevronDown size={10} /></span>
      <span className="st-faces">
        {['LA', 'MK', 'RS'].map((a) => <i key={a}>{a}</i>)}
      </span>
      <span className="st-icon"><Share2 size={12} /></span>
      <span className="st-publish"><Rocket size={11} /> Publish</span>
    </div>
  </div>
);

const PALETTE = [
  [Type, 'Text field'], [List, 'Select'], [Hash, 'Number'], [Calendar, 'Date'],
  [Upload, 'File'], [ToggleLeft, 'Toggle'], [Table2, 'Table'], [Users, 'User picker'],
];

export const LeftRail = ({ step }) => (
  <div className="st-rail">
    <div className="st-rail-search"><Search size={11} /><span>Insert</span><kbd>/</kbd></div>

    <span className="st-rail-k">Components</span>
    {PALETTE.map(([Icon, label], i) => (
      <motion.span
        className={`st-comp ${step >= 1 && i < 4 ? 'used' : ''}`}
        key={label}
        animate={step === 1 && i < 4 ? { x: [0, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.6, delay: i * 0.25, ease: EASE }}
      >
        <Icon size={12} /> {label}
        <i className="st-grab" />
      </motion.span>
    ))}

    <span className="st-rail-k mt">Layers</span>
    {[[Frame, 'Capex request', 0], [Type, 'Title', 1], [Hash, 'Amount', 1], [Database, 'capex_request', 0]].map(([Icon, l, ind], i) => (
      <span className={`st-layer ${ind ? 'ind' : ''}`} key={l} style={{ opacity: step >= (i > 2 ? 2 : 1) ? 1 : 0.28 }}>
        <Icon size={11} /> {l}
      </span>
    ))}
  </div>
);

export const RightRail = ({ step }) => {
  const panes = [
    { k: 'Canvas', rows: [['Frame', '1200 × 720'], ['Grid', '8 px'], ['Theme', 'Emvive light']] },
    { k: 'Text field', rows: [['Name', 'justification'], ['Type', 'Long text'], ['Required', 'Yes'], ['Width', 'Full']] },
    { k: 'Data source', rows: [['Object', 'capex_request'], ['Rows', '1,284'], ['Access', 'Row-level'], ['Sync', 'Live']] },
    { k: 'Condition', rows: [['Field', 'amount'], ['Operator', 'is greater than'], ['Value', '50,000'], ['Else', 'Auto-approve']] },
    { k: 'Run', rows: [['Trigger', 'Record created'], ['Steps', '5'], ['Duration', '0.81s'], ['Result', 'Completed']] },
    { k: 'Preview', rows: [['Device', 'iPhone 15'], ['Build', 'v1.4'], ['Offline', 'Enabled'], ['Locale', 'en · ar']] },
    { k: 'Deployment', rows: [['Env', 'Production'], ['Region', 'ksa-central-1'], ['Version', 'v1.4'], ['Status', 'Live']] },
  ];
  const pane = panes[Math.min(step, panes.length - 1)];

  return (
    <div className="st-insp">
      <div className="st-insp-bar">
        <b>{pane.k}</b>
        <MoreHorizontal size={12} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pane.k}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {pane.rows.map(([k, v]) => (
            <div className="st-prop" key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </motion.div>
      </AnimatePresence>

      <span className="st-rail-k mt">Permissions</span>
      {[['Requester', 'Create'], ['Cost centre owner', 'Approve'], ['Finance', 'Full']].map(([r, p]) => (
        <div className="st-perm" key={r}><i className="st-av">{r[0]}</i>{r}<em>{p}</em></div>
      ))}
    </div>
  );
};

export const Console = ({ lines }) => (
  <div className="st-console">
    <div className="st-console-bar">
      <Terminal size={11} />
      <b>Console</b>
      <span className="st-console-tabs"><i className="on">Output</i><i>Problems</i><i>Network</i></span>
      <span className="st-console-ok">0 errors</span>
    </div>
    <div className="st-console-body">
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <motion.div
            className="st-log" key={l.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="st-log-t">{l.t}</span>
            <span className={`st-log-lvl ${l.lvl}`}>{l.lvl}</span>
            <span className="st-log-m">{l.m}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   CANVAS ARTEFACTS
   Placed in canvas coordinates; the viewport moves to them.
   --------------------------------------------------------------- */

const FIELDS = [
  ['Request title', 'New forklift — Riyadh DC', 2],
  ['Cost centre', 'Logistics · CC-204', 1],
  ['Amount', 'SAR 142,000', 1],
  ['Justification', 'Replaces unit FL-08, failed inspection…', 2],
];

export const Artboard = ({ step }) => (
  <div className="st-art" style={{ left: 380, top: 240, width: 460 }}>
    <span className="st-art-name"><Frame size={10} /> Capex request · Form</span>
    <div className="st-art-body">
      {FIELDS.map(([label, val, span], i) => (
        <motion.div
          className={`st-field ${span === 2 ? 'w2' : ''} ${step >= 1 && i === 3 ? 'sel' : ''}`}
          key={label}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={step >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.18, ease: EASE }}
        >
          <span>{label}</span>
          <i>{val}</i>
          {step >= 1 && i === 3 && (
            <>
              <b className="st-h tl" /><b className="st-h tr" />
              <b className="st-h bl" /><b className="st-h br" />
            </>
          )}
        </motion.div>
      ))}
      <motion.div
        className="st-drop"
        animate={step === 1 ? { opacity: 1 } : { opacity: 0.35 }}
        transition={{ duration: 0.4 }}
      >
        <MousePointer2 size={11} /> Drop component
      </motion.div>
    </div>
  </div>
);

export const DataNode = ({ step }) => (
  <motion.div
    className="st-node st-db" style={{ left: 960, top: 210, width: 260 }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={step >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.6, ease: EASE }}
  >
    <div className="st-node-bar"><Database size={11} /><b>capex_request</b><span className="st-badge">1,284</span></div>
    <div className="st-db-rows">
      {[['id', 'uuid'], ['title', 'text'], ['amount', 'currency'], ['cost_centre', 'lookup'], ['status', 'workflow'], ['created_by', 'user']].map(([f, t], i) => (
        <motion.div
          className="st-db-row" key={f}
          initial={{ opacity: 0, x: -8 }}
          animate={step >= 2 ? { opacity: 1, x: 0 } : { opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.2 + i * 0.07, ease: EASE }}
        >
          <span>{f}</span><em>{t}</em>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const FLOW = [
  { id: 'trg', x: 380, y: 720, icon: Zap, kind: 'trigger', t: 'Record created', s: 'capex_request' },
  { id: 'cnd', x: 700, y: 720, icon: GitBranch, kind: 'cond', t: 'Amount > 50,000', s: 'Condition' },
  { id: 'apr', x: 1020, y: 640, icon: Users, kind: 'act', t: 'Request approval', s: 'CFO · SLA 24h' },
  { id: 'ntf', x: 1020, y: 830, icon: Mail, kind: 'act', t: 'Notify requester', s: 'Email · WhatsApp' },
  { id: 'pst', x: 1340, y: 720, icon: CircleCheckBig, kind: 'act', t: 'Post commitment', s: 'Ledger · CC-204' },
];

const WIRES = [
  ['trg', 'cnd'], ['cnd', 'apr'], ['cnd', 'ntf'], ['apr', 'pst'], ['ntf', 'pst'],
];

const NODE_W = 210;
const nodeAnchor = (id, side) => {
  const n = FLOW.find((f) => f.id === id);
  return [side === 'out' ? n.x + NODE_W : n.x, n.y + 26];
};

export const FlowGraph = ({ step, runIndex }) => (
  <>
    <svg className="st-wires" width="1800" height="1200" aria-hidden="true">
      {WIRES.map(([a, b], i) => {
        const [x1, y1] = nodeAnchor(a, 'out');
        const [x2, y2] = nodeAnchor(b, 'in');
        const dx = Math.max(50, (x2 - x1) * 0.5);
        const d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
        const lit = step >= 4 && runIndex > i;
        return (
          <g key={`${a}${b}`}>
            <motion.path
              d={d} className="st-wire"
              initial={{ pathLength: 0 }}
              animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: EASE }}
            />
            {lit && <path d={d} className="st-wire-lit" />}
          </g>
        );
      })}
    </svg>

    {FLOW.map((n, i) => {
      const Icon = n.icon;
      const running = step >= 4 && runIndex === i;
      const done = step >= 4 && runIndex > i;
      return (
        <motion.div
          className={`st-node st-flow ${n.kind} ${running ? 'run' : ''} ${done ? 'done' : ''}`}
          key={n.id}
          style={{ left: n.x, top: n.y, width: NODE_W }}
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={step >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
        >
          <span className="st-node-ic"><Icon size={12} /></span>
          <span className="st-node-t"><b>{n.t}</b><em>{n.s}</em></span>
          <i className="st-port in" /><i className="st-port out" />
        </motion.div>
      );
    })}
  </>
);

export const DevicePreview = ({ step }) => (
  <motion.div
    className="st-device" style={{ left: 1560, top: 200 }}
    initial={{ opacity: 0, y: 30, rotateY: -12 }}
    animate={step >= 5 ? { opacity: 1, y: 0, rotateY: 0 } : { opacity: 0, y: 30, rotateY: -12 }}
    transition={{ duration: 0.8, ease: EASE }}
  >
    <div className="st-device-notch" />
    <div className="st-device-bar"><Smartphone size={10} /> capex-request<span className="st-live" /></div>
    <div className="st-device-body">
      <span className="st-dev-h">New request</span>
      {['Request title', 'Cost centre', 'Amount'].map((f, i) => (
        <motion.div
          className="st-dev-f" key={f}
          initial={{ opacity: 0, y: 8 }}
          animate={step >= 5 ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.12, ease: EASE }}
        >
          <span>{f}</span><i />
        </motion.div>
      ))}
      <motion.div
        className="st-dev-btn"
        initial={{ opacity: 0 }}
        animate={step >= 5 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.85 }}
      >
        Submit
      </motion.div>
    </div>
  </motion.div>
);

export const DeployCard = ({ step }) => (
  <motion.div
    className="st-deploy" style={{ left: 380, top: 1010, width: 620 }}
    initial={{ opacity: 0, y: 24 }}
    animate={step >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
    transition={{ duration: 0.7, ease: EASE }}
  >
    <div className="st-deploy-bar">
      <Cloud size={12} /><b>Deployment</b>
      <span className="st-deploy-ok"><CircleCheckBig size={10} /> Live</span>
    </div>
    <div className="st-deploy-url"><Globe size={11} /> app.emvive.com/capex<span className="st-copy">Copy</span></div>
    <div className="st-deploy-targets">
      {[[Globe, 'Web', 'v1.4'], [Smartphone, 'Mobile', 'same build'], [Layers, 'REST API', '/v1/capex']].map(([Icon, t, m], i) => (
        <motion.div
          key={t}
          initial={{ opacity: 0, y: 10 }}
          animate={step >= 6 ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease: EASE }}
        >
          <Icon size={12} /><b>{t}</b><em>{m}</em>
        </motion.div>
      ))}
    </div>
    <div className="st-deploy-users">
      <span className="st-rail-k">Live traffic</span>
      <div className="st-users">
        {['LA', 'MK', 'RS', 'AH', 'TN', 'DK', 'FZ'].map((a, i) => (
          <motion.i
            key={a}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={step >= 6 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.09, ease: EASE }}
          >
            {a}
          </motion.i>
        ))}
        <motion.span
          className="st-users-n"
          initial={{ opacity: 0 }}
          animate={step >= 6 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          +412 today
        </motion.span>
      </div>
    </div>
  </motion.div>
);

export const RunBadge = ({ step, runIndex }) => (
  <motion.div
    className="st-runbadge" style={{ left: 700, top: 640 }}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={step === 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.4, ease: EASE }}
  >
    <Play size={10} />
    Run #48219 · step {Math.min(runIndex + 1, FLOW.length)} of {FLOW.length}
  </motion.div>
);
