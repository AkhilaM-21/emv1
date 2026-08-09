import React, { useRef } from 'react';
import {
  ArrowRight, Play, Type, Hash, ListChecks, CalendarDays, Table2, BarChart3,
  MousePointer2, Upload, Database, Workflow, Smartphone, Rocket, Check,
  Layers, SlidersHorizontal, Command, Search, Plus, Sparkles,
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MaskText, Reveal, EASE } from './motion';
import {
  Kicker, Kbd, Chip, DotField, Cursor, Magnet, Cycler, Marquee,
  useAutoStep, AnimatePresence,
} from './PlatformKit';
import './PlatformHero.css';

/* =====================================================================
   HERO — the builder, running.

   The brief was explicit: no static dashboard. So the right half of the
   fold is an application being assembled in front of the reader on a
   seven-beat loop — palette, canvas, binding, workflow, preview, ship.
   The headline verb tracks the same beat, which is what ties the copy
   to the demonstration instead of leaving them as two separate things.
   ===================================================================== */

const VERBS = ['Build', 'Connect', 'Automate', 'Deploy'];

/* beat → which verb is lit. Assembly is BUILD, binding is CONNECT,
   the workflow is AUTOMATE, preview and ship are DEPLOY. */
const BEAT_VERB = [0, 0, 0, 1, 2, 3, 3];

const PALETTE = [
  { icon: Type, label: 'Text field', at: 1 },
  { icon: ListChecks, label: 'Select', at: 2 },
  { icon: Hash, label: 'Number', at: null },
  { icon: CalendarDays, label: 'Date', at: null },
  { icon: Table2, label: 'Table', at: 2 },
  { icon: BarChart3, label: 'Chart', at: 3 },
  { icon: Upload, label: 'File upload', at: null },
  { icon: MousePointer2, label: 'Button', at: 3 },
];

/* every object on the artboard, with the beat it lands on */
const BLOCKS = [
  { id: 'head', at: 0, kind: 'head' },
  { id: 'company', at: 1, kind: 'field', label: 'Company name', value: 'Gulf Cement Co.' },
  { id: 'type', at: 2, kind: 'select', label: 'Request type', value: 'Service escalation' },
  { id: 'pair', at: 2, kind: 'pair', a: 'Region', av: 'Eastern Province', b: 'Owner', bv: 'A. Hassan' },
  { id: 'table', at: 2, kind: 'table', label: 'Open requests' },
  { id: 'chart', at: 3, kind: 'chart', label: 'Resolution time · 30 days' },
  { id: 'submit', at: 3, kind: 'button', label: 'Submit request' },
];

const INSPECTOR = [
  {
    tag: 'Page', name: 'customer-portal', tone: 'v',
    rows: [['Layout', '12 column'], ['Theme', 'Emvive Light'], ['Access', 'Authenticated']],
  },
  {
    tag: 'Field', name: 'company_name', tone: 'v',
    rows: [['Type', 'Text'], ['Required', 'On'], ['Bind', 'customer.name']],
  },
  {
    tag: 'Table', name: 'open_requests', tone: 'v',
    rows: [['Rows', 'Live query'], ['Filter', 'status ≠ closed'], ['Sort', 'created desc']],
  },
  {
    tag: 'Data', name: 'customer', tone: 'cy',
    rows: [['Source', 'Emvive ERP'], ['Records', '8,412'], ['Sync', 'Realtime']],
  },
  {
    tag: 'Flow', name: 'request-routing', tone: 'run',
    rows: [['Trigger', 'On submit'], ['Nodes', '4'], ['SLA', '4 hours']],
  },
  {
    tag: 'Preview', name: 'web · ios · android', tone: 'v',
    rows: [['Breakpoints', '3'], ['Locales', 'en · ar (rtl)'], ['Offline', 'Enabled']],
  },
  {
    tag: 'Deploy', name: 'production', tone: 'run',
    rows: [['Version', 'v1.4.0'], ['Region', 'ksa-central-1'], ['Rollback', '1 click']],
  },
];

const FLOW_NODES = [
  { label: 'Request created', icon: Sparkles },
  { label: 'Route by SLA', icon: Workflow },
  { label: 'Notify owner', icon: Check },
  { label: 'Update record', icon: Database },
];

const CURSORS = [
  { name: 'Layla', tone: 'p', pos: [[62, 118], [188, 196], [214, 268], [372, 150], [318, 330], [246, 118], [430, 96]] },
  { name: 'Omar', tone: 'c', pos: [[420, 300], [352, 132], [128, 316], [438, 224], [176, 402], [402, 262], [140, 218]] },
];

/* ------------------------------------------------------------------ */
const Field = ({ label, value, active }) => (
  <div className={`ph-field ${active ? 'sel' : ''}`}>
    <span className="ph-field-l">{label}</span>
    <div className="ph-field-i">{value}<i className="ph-caret" /></div>
    {active && (
      <>
        <span className="ph-tagpill">company_name</span>
        <i className="ph-hd tl" /><i className="ph-hd tr" /><i className="ph-hd bl" /><i className="ph-hd br" />
      </>
    )}
  </div>
);

const Artboard = ({ beat }) => (
  <div className="ph-art">
    <AnimatePresence initial={false}>
      {BLOCKS.filter((b) => b.at <= beat).map((b, i) => (
        <motion.div
          className={`ph-block k-${b.kind}`}
          key={b.id}
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
          layout
        >
          {b.kind === 'head' && (
            <div className="ph-apphead">
              <span className="ph-appmark" />
              <div>
                <b>Customer Portal</b>
                <em>Support &amp; service requests</em>
              </div>
              <span className="ph-avatar">GC</span>
            </div>
          )}

          {b.kind === 'field' && <Field label={b.label} value={b.value} active={beat === 1} />}

          {b.kind === 'select' && (
            <div className="ph-field">
              <span className="ph-field-l">{b.label}</span>
              <div className="ph-field-i sel-i">
                {b.value}
                <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
              </div>
            </div>
          )}

          {b.kind === 'pair' && (
            <div className="ph-pair">
              <div className="ph-field"><span className="ph-field-l">{b.a}</span><div className="ph-field-i">{b.av}</div></div>
              <div className="ph-field"><span className="ph-field-l">{b.b}</span><div className="ph-field-i">{b.bv}</div></div>
            </div>
          )}

          {b.kind === 'table' && (
            <div className={`ph-table ${beat >= 3 ? 'bound' : ''}`}>
              <div className="ph-table-h">
                <span>{b.label}</span>
                {beat >= 3 && <Chip tone="cy">customer · live</Chip>}
              </div>
              {[
                ['REQ-2041', 'Delivery delay', 'High', 'bad'],
                ['REQ-2039', 'Invoice mismatch', 'Normal', 'ok'],
                ['REQ-2036', 'Site access', 'Normal', 'ok'],
              ].map(([id, t, p, tone]) => (
                <div className="ph-row" key={id}>
                  <span className="ph-mono">{id}</span>
                  <span>{t}</span>
                  <i className={`ph-pri ${tone}`}>{p}</i>
                </div>
              ))}
            </div>
          )}

          {b.kind === 'chart' && (
            <div className="ph-chart">
              <span className="ph-field-l">{b.label}</span>
              <div className="ph-bars">
                {[44, 61, 38, 72, 56, 83, 64, 91, 70, 48, 79, 96].map((h, j) => (
                  <motion.i
                    key={j}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, delay: 0.12 + j * 0.035, ease: EASE }}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {b.kind === 'button' && (
            <div className="ph-cta-row">
              <span className="ph-appbtn">{b.label}</span>
              <span className="ph-appbtn ghost">Save draft</span>
            </div>
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ------------------------------------------------------------------ */
const FlowStrip = ({ beat }) => {
  const on = beat >= 4;
  /* the run walks the nodes during the automate beat and stays complete
     afterwards, so the strip never reads as half-finished on screen */
  const running = beat === 4 ? 2 : beat > 4 ? FLOW_NODES.length : -1;

  return (
    <motion.div
      className="ph-flow"
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <span className="ph-flow-k">FLOW</span>
      {FLOW_NODES.map((n, i) => (
        <React.Fragment key={n.label}>
          {i > 0 && (
            <span className={`ph-flow-wire ${on && i <= running ? 'on' : ''}`}>
              <i />
            </span>
          )}
          <span className={`ph-flow-node ${on && i < running ? 'done' : ''} ${on && i === running ? 'live' : ''}`}>
            <n.icon size={11} strokeWidth={2} />
            {n.label}
          </span>
        </React.Fragment>
      ))}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
const Inspector = ({ beat }) => {
  const step = INSPECTOR[Math.min(beat, INSPECTOR.length - 1)];

  return (
    <div className="ph-insp">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.38, ease: EASE }}
        >
          <div className="ph-insp-id">
            <Chip tone={`night ${step.tone}`}>{step.tag}</Chip>
            <span className="ph-mono">{step.name}</span>
          </div>

          {step.rows.map(([k, v]) => (
            <div className="ph-insp-row" key={k}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="ph-insp-swatches">
        <span className="ph-insp-lab">Theme</span>
        <div>
          {['#6c4cf1', '#08090a', '#38bdf8', '#34d399', '#f5a524'].map((c, i) => (
            <i key={c} style={{ background: c }} className={i === 0 ? 'on' : ''} />
          ))}
        </div>
      </div>

      <div className="ph-insp-slider">
        <span className="ph-insp-lab">Radius</span>
        <div className="ph-track"><i style={{ width: '38%' }} /><em style={{ left: '38%' }} /></div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
const PreviewPhone = ({ beat }) => {
  const on = beat >= 5;

  return (
    <motion.div
      className="ph-phone"
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 26, scale: on ? 1 : 0.94 }}
      transition={{ duration: 0.75, ease: EASE }}
      aria-hidden={!on}
    >
      <div className="ph-phone-frame">
        <span className="ph-phone-notch" />
        <div className="ph-phone-screen">
          <div className="ph-phone-bar"><b>Customer Portal</b><Smartphone size={11} /></div>
          <div className="ph-phone-card"><span>Company</span><b>Gulf Cement Co.</b></div>
          <div className="ph-phone-card"><span>Request type</span><b>Service escalation</b></div>
          <div className="ph-phone-list">
            {['REQ-2041', 'REQ-2039', 'REQ-2036'].map((r) => (
              <span key={r}><i />{r}</span>
            ))}
          </div>
          <span className="ph-phone-btn">Submit request</span>
        </div>
      </div>
      <span className="ph-phone-tag">Live preview · iOS</span>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
const Builder = ({ beat, pick }) => (
  <div className="ph-win">
    {/* window chrome */}
    <div className="ph-win-bar">
      <div className="ph-tl"><i /><i /><i /></div>
      <span className="ph-win-name"><Layers size={11} strokeWidth={2} /> customer-portal <em>· Studio</em></span>

      <div className="ph-win-seg">
        {['Design', 'Data', 'Flow'].map((s, i) => (
          <button
            key={s}
            type="button"
            className={
              (beat <= 2 && i === 0) || (beat === 3 && i === 1) || (beat >= 4 && i === 2) ? 'on' : ''
            }
            onClick={() => pick(i === 0 ? 1 : i === 1 ? 3 : 4)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="ph-win-right">
        <span className="ph-faces"><i>L</i><i>O</i><i>+3</i></span>
        <motion.span
          className={`ph-ship ${beat >= 6 ? 'live' : ''}`}
          animate={{ scale: beat === 6 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {beat >= 6 ? <><Check size={12} strokeWidth={2.6} /> Published</> : <><Rocket size={12} strokeWidth={2} /> Publish</>}
        </motion.span>
      </div>
    </div>

    <div className="ph-win-body">
      {/* component palette */}
      <div className="ph-rail">
        <div className="ph-rail-search"><Search size={11} /><span>Components</span><Kbd>⌘K</Kbd></div>
        {PALETTE.map((p) => (
          <div
            key={p.label}
            className={`ph-rail-item ${p.at !== null && p.at === beat ? 'drag' : ''} ${p.at !== null && p.at < beat ? 'used' : ''}`}
          >
            <p.icon size={13} strokeWidth={1.8} />
            {p.label}
            {p.at !== null && p.at < beat && <Check size={11} strokeWidth={2.6} className="ph-rail-tick" />}
          </div>
        ))}
        <div className="ph-rail-foot"><Plus size={11} /> Custom component</div>
      </div>

      {/* canvas */}
      <div className="ph-canvas">
        <DotField tone="dark" size={20} className="ph-canvas-dots" />

        <div className="ph-canvas-top">
          <span className="ph-mono">100%</span>
          <span className="ph-mono">Desktop · 1440</span>
          <span className={`ph-bindtag ${beat >= 3 ? 'on' : ''}`}>
            <Database size={10} strokeWidth={2} /> {beat >= 3 ? 'customer · bound' : 'no data source'}
          </span>
        </div>

        <div className="ph-frame">
          <Artboard beat={beat} />
        </div>

        <FlowStrip beat={beat} />

        {CURSORS.map((c, i) => (
          <Cursor
            key={c.name}
            name={c.name}
            tone={c.tone}
            x={c.pos[Math.min(beat, c.pos.length - 1)][0]}
            y={c.pos[Math.min(beat, c.pos.length - 1)][1]}
            delay={i * 0.12}
          />
        ))}

        <PreviewPhone beat={beat} />
      </div>

      {/* inspector */}
      <div className="ph-insp-wrap">
        <div className="ph-insp-bar">
          <SlidersHorizontal size={11} strokeWidth={2} /> Inspector
        </div>
        <Inspector beat={beat} />
      </div>
    </div>

    {/* status bar */}
    <div className="ph-win-foot">
      <span className={beat >= 6 ? 'ok' : ''}>
        <i />{beat >= 6 ? 'app.emvive.com/portal · live' : 'draft · autosaved'}
      </span>
      <span className="ph-mono">{BLOCKS.filter((b) => b.at <= beat).length} objects</span>
      <span className="ph-mono">{beat >= 3 ? '1 data source' : '0 data sources'}</span>
      <span className="ph-mono">{beat >= 4 ? '4 flow nodes' : '0 flow nodes'}</span>
      <span className="ph-win-foot-t"><Command size={10} /> Everything here is real from minute one</span>
    </div>
  </div>
);

/* ================================================================== */
const PlatformHero = () => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { index: beat, pick, ref: seqRef, bind } = useAutoStep(7, 2400, { hold: 3600 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotRaw = useTransform(scrollYProgress, [0, 0.6], [-7, 0]);
  const rot = useSpring(rotRaw, { stiffness: 80, damping: 26, mass: 0.6 });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const verb = BEAT_VERB[beat];

  return (
    <section className="ph" id="top" ref={ref}>
      <div className="ph-bg" aria-hidden="true">
        <span className="ph-aurora a" />
        <span className="ph-aurora b" />
        <DotField tone="light" size={26} className="ph-bg-dots fade" />
      </div>

      <div className="ph-inner">
        {/* ---------------- copy ---------------- */}
        <div className="ph-copy">
          <Reveal duration={0.7}>
            <a className="ph-badge" href="#studio">
              <span>New</span> Studio 2.0 — AI-assisted app generation
              <ArrowRight size={12} />
            </a>
          </Reveal>

          <h1 className="ph-h1">
            <MaskText text="Build the software" as="span" className="ph-h1-l" delay={0.06} />
            <MaskText text="your business needs." as="span" className="ph-h1-l" delay={0.14} />
          </h1>

          <Reveal delay={0.3} y={16}>
            <p className="ph-lede">
              Emvive Platform is where your teams <Cycler words={VERBS} index={verb} className="ph-cycle-in" /> the
              applications the business actually runs on — visually, on top of the ERP data
              they already trust, with no separate stack to maintain.
            </p>
          </Reveal>

          <Reveal delay={0.4} y={16}>
            <div className="ph-actions">
              <Magnet>
                <a href="#start" className="ph-btn primary">
                  Build with Emvive <ArrowRight size={16} />
                </a>
              </Magnet>
              <a href="#studio" className="ph-btn quiet">
                <span className="ph-play"><Play size={9} fill="currentColor" /></span>
                Explore Studio
              </a>
            </div>
          </Reveal>

          {/* the four verbs as a rail that tracks the demonstration */}
          <Reveal delay={0.5} y={16}>
            <div className="ph-verbs">
              {VERBS.map((v, i) => (
                <button
                  type="button"
                  key={v}
                  className={`ph-verb ${verb === i ? 'on' : ''} ${verb > i ? 'past' : ''}`}
                  onClick={() => pick(BEAT_VERB.indexOf(i))}
                >
                  <i className="ph-verb-bar" />
                  <span className="ph-mono">{String(i + 1).padStart(2, '0')}</span>
                  {v}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ---------------- the builder ---------------- */}
        <div className="ph-stage" ref={seqRef} {...bind}>
          <motion.div
            className="ph-stage-tilt"
            initial={reduced ? false : { opacity: 0, y: 60, scale: 0.97 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.28, ease: EASE }}
            style={reduced ? undefined : { rotateY: rot, y: lift }}
          >
            <Builder beat={beat} pick={pick} />
          </motion.div>

          <div className="ph-beats" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={`ph-beat ${beat === i ? 'on' : ''}`}
                onClick={() => pick(i)}
                tabIndex={-1}
              >
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- trust strip ---------------- */}
      <div className="ph-trust">
        <span className="ph-trust-l"><Kicker>Built on Emvive</Kicker></span>
        <Marquee speed={46} className="ph-trust-run">
          {[
            'GULF CEMENT', 'NEXA COMPONENTS', 'AL FAISAL TRADING', 'MERIDIAN LABELS',
            'ORBIT TEXTILES', 'DELTA CHEMICALS', 'RIYADH LOGISTICS', 'HARBOUR FOODS',
          ].map((n) => <span className="ph-logo" key={n}>{n}</span>)}
        </Marquee>
        <span className="ph-trust-r">
          <b>1,240+</b> applications shipped by customer teams
        </span>
      </div>
    </section>
  );
};

export default PlatformHero;
