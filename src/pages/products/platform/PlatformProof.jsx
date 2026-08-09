import React, { useState } from 'react';
import {
  Play, Pause, Volume2, Maximize2, Table2, Database, Workflow,
  Rocket, MousePointer2, FileSpreadsheet, Mail, MessageCircle, FolderOpen,
  FileText, ArrowRight, ArrowUpRight, Check, ShieldCheck, KeyRound, Fingerprint,
  History, Globe, Server, Layers, GitBranch, Activity, Lock, Users,
  PanelsTopLeft, Braces, Gauge,
} from 'lucide-react';
import { motion, MaskText, Reveal, CountUp, EASE } from '../shared/motion';
import {
  Kicker, Magnet, Spotlight, Browser, DotField, useAutoStep, useOnce, AnimatePresence,
} from './PlatformKit';
import './PlatformProof.css';

/* =====================================================================
   PROOF

   Four closing movements, each with its own treatment:
     · WALKTHROUGH — a player. No stock footage exists and none would
       help, so the "video" is the product itself, chaptered and scrubbed.
     · TRANSFORMATION — five scattered artefacts converging into one
       application. The animation carries the argument.
     · ENTERPRISE — an architecture stack with cross-cutting concerns
       drawn down the side, which is how an IT reviewer reads it.
     · CTA — one ink panel, three honest ways to start.
   ===================================================================== */

/* ------------------------------------------------------------------
   WALKTHROUGH
   ------------------------------------------------------------------ */
const CHAPTERS = [
  { t: 'Open a blank canvas', at: '0:00', scene: 'canvas' },
  { t: 'Bind it to real data', at: '0:34', scene: 'data' },
  { t: 'Add the workflow', at: '1:12', scene: 'flow' },
  { t: 'Preview on mobile', at: '1:48', scene: 'mobile' },
  { t: 'Publish to production', at: '2:16', scene: 'ship' },
];

const Scene = ({ kind }) => {
  if (kind === 'canvas') {
    return (
      <div className="pv-scene s-canvas">
        <div className="pv-rail">
          {['Text', 'Select', 'Table', 'Chart', 'Button'].map((c, i) => (
            <span key={c} className={i === 2 ? 'on' : ''}>{c}</span>
          ))}
        </div>
        <div className="pv-art">
          <span className="pv-art-h">Field Service Requests</span>
          <span className="pv-art-f" />
          <span className="pv-art-f" />
          <span className="pv-art-t">
            {[0, 1, 2].map((i) => <i key={i} />)}
          </span>
        </div>
        <motion.span
          className="pv-cursor"
          animate={{ left: ['12%', '46%', '48%'], top: ['62%', '44%', '46%'] }}
          transition={{ duration: 3.4, ease: EASE, repeat: Infinity, repeatType: 'reverse' }}
        >
          <MousePointer2 size={16} strokeWidth={1.7} />
        </motion.span>
      </div>
    );
  }

  if (kind === 'data') {
    return (
      <div className="pv-scene s-data">
        <div className="pv-src">
          <span className="pv-src-h"><Database size={12} strokeWidth={2} /> Emvive ERP</span>
          {['work_order', 'asset', 'employee', 'site'].map((o, i) => (
            <span key={o} className={`pv-src-o ${i === 0 ? 'on' : ''}`}><Table2 size={10} strokeWidth={2} />{o}</span>
          ))}
        </div>
        <svg className="pv-link" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,42 C40,42 55,54 100,54" />
          <path d="M0,42 C40,42 55,54 100,54" className="p" />
        </svg>
        <div className="pv-bound">
          <span className="pv-bound-h">work_order <em>18,204 rows · live</em></span>
          {['WO-4412 · Compressor 2', 'WO-4408 · Conveyor B', 'WO-4401 · Pump 14', 'WO-4396 · Motor 3'].map((r) => (
            <span className="pv-bound-r" key={r}><i />{r}</span>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'flow') {
    return (
      <div className="pv-scene s-flow">
        {['Job sheet submitted', 'Reserve parts', 'Draft invoice', 'Send report'].map((n, i) => (
          <React.Fragment key={n}>
            {i > 0 && <span className="pv-fw"><i style={{ animationDelay: `${i * 0.3}s` }} /></span>}
            <motion.span
              className="pv-fn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.18, ease: EASE }}
            >
              <Workflow size={12} strokeWidth={1.9} />{n}
            </motion.span>
          </React.Fragment>
        ))}
        <span className="pv-flog">
          {['run #48219 started', 'parts reserved · 2 lines', 'invoice INV-9312 drafted', 'report sent · 0.9s'].map((l) => (
            <em key={l}><i />{l}</em>
          ))}
        </span>
      </div>
    );
  }

  if (kind === 'mobile') {
    return (
      <div className="pv-scene s-mobile">
        {['Web · 1440', 'Tablet · 1024', 'Mobile · 390'].map((d, i) => (
          <motion.div
            className={`pv-dev d${i}`}
            key={d}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.14, ease: EASE }}
          >
            <span className="pv-dev-s">
              <i className="h" /><i /><i /><i className="b" />
            </span>
            <em>{d}</em>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="pv-scene s-ship">
      <div className="pv-ship-card">
        <span className="pv-ship-k">Deploying to production</span>
        {[['Build', 'v1.4.0'], ['Region', 'ksa-central-1'], ['Approval', 'Granted'], ['Rollback', 'Ready']].map(([k, v], i) => (
          <motion.span
            className="pv-ship-r"
            key={k}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
          >
            <Check size={11} strokeWidth={3} />{k}<em>{v}</em>
          </motion.span>
        ))}
        <motion.span
          className="pv-ship-url"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          <Globe size={12} strokeWidth={1.9} /> app.emvive.com/field-service is live
        </motion.span>
      </div>
    </div>
  );
};

const Walkthrough = () => {
  const [playing, setPlaying] = useState(true);
  const { ref, index, pick, bind } = useAutoStep(CHAPTERS.length, 3600);

  return (
    <section className="pv" id="watch" ref={ref} {...bind}>
      <div className="pv-inner">
        <div className="pv-head">
          <Reveal><Kicker>12 — Watch it built</Kicker></Reveal>
          <MaskText text="Two and a half minutes," accent="start to production." as="h2" className="pv-h2" />
        </div>

        <Spotlight radius={520} className="pv-frame">
          <div className="pv-player">
            <div className="pv-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={CHAPTERS[index].scene}
                  className="pv-stage-in"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <Scene kind={CHAPTERS[index].scene} />
                </motion.div>
              </AnimatePresence>

              <span className="pv-rec"><i />REC · screen capture</span>
              <span className="pv-caption">{CHAPTERS[index].t}</span>
            </div>

            {/* player chrome */}
            <div className="pv-ctrl">
              <button
                type="button"
                className="pv-play"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
              </button>

              <span className="pv-time">{CHAPTERS[index].at}</span>

              <div className="pv-scrub">
                <motion.i
                  className="pv-scrub-f"
                  animate={{ width: `${((index + 1) / CHAPTERS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
                {CHAPTERS.map((c, i) => (
                  <button
                    type="button"
                    key={c.t}
                    className={`pv-mark ${index >= i ? 'on' : ''}`}
                    style={{ left: `${(i / CHAPTERS.length) * 100}%` }}
                    onClick={() => pick(i)}
                    aria-label={c.t}
                  />
                ))}
              </div>

              <span className="pv-time">2:41</span>
              <Volume2 size={14} strokeWidth={1.9} className="pv-ic" />
              <Maximize2 size={14} strokeWidth={1.9} className="pv-ic" />
            </div>
          </div>
        </Spotlight>

        <div className="pv-chapters">
          {CHAPTERS.map((c, i) => (
            <button
              type="button"
              key={c.t}
              className={`pv-chapter ${index === i ? 'on' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="pv-chapter-at">{c.at}</span>
              <b>{c.t}</b>
              <i />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------
   TRANSFORMATION
   ------------------------------------------------------------------ */
/* The "before" state is a manila folder with the four systems fanned
   out of its mouth. Offsets are in PIXELS from the centre of the stage,
   measured against the folder art below — a percentage here resolves
   against the card's own width, which is how an earlier version ended
   up as one unreadable pile in the middle.

   Rotation is kept under 8° on purpose: the cards overlap the folder's
   front flap, and a steeper angle drops a corner far enough below the
   flap edge to clip the label. */
const SCATTER = [
  { t: 'Site inspections v7 FINAL.xlsx', m: 'Shared drive · 14 versions', icon: FileSpreadsheet, x: -344, y: -14, r: -6 },
  { t: 'RE: RE: FW: inspection sheet', m: 'Email thread · 41 replies', icon: Mail, x: -172, y: -26, r: -3 },
  { t: 'Site Ops (group)', m: 'WhatsApp · photos, no records', icon: MessageCircle, x: 0, y: -30, r: 1 },
  { t: 'Signed_form_scan_04.pdf', m: 'Paper, scanned, filed nowhere', icon: FileText, x: 172, y: -24, r: 4 },
  { t: '\\\\fileserver\\ops\\2025', m: 'Nobody knows what is current', icon: FolderOpen, x: 344, y: -12, r: 7 },
];

/* The folder itself. Two paths from one 940×330 grid so the back panel,
   the tab and the front flap always line up: the back is drawn behind
   the cards, the flap in front of them, and the cards sit in the mouth
   between the two. */
const FOLDER_BACK = 'M32,26 h188 l26,34 h662 a18,18 0 0 1 18,18 v226 a18,18 0 0 1 -18,18 H32 a18,18 0 0 1 -18,-18 V44 a18,18 0 0 1 18,-18 Z';
const FOLDER_FRONT = 'M14,182 q222,-28 456,-28 t456,28 v122 a18,18 0 0 1 -18,18 H32 a18,18 0 0 1 -18,-18 Z';

const OUTCOMES = [
  { v: 9, suffix: ' days', l: 'from brief to first live user', d: 0 },
  { v: 41, suffix: '%', l: 'less time per inspection', d: 0 },
  { v: 100, suffix: '%', l: 'of inspections now auditable', d: 0 },
  { v: 4, suffix: '', l: 'systems retired', d: 0 },
];

const Transformation = () => {
  /* lands on After two seconds after the section is scrolled into view and
     stays there — loop off, so it settles on the answer rather than
     flipping back to the mess every couple of seconds. Either label is
     still clickable. */
  const { ref, index, pick, bind } = useAutoStep(2, 2000, { loop: false });
  const after = index === 1;
  const [statRef] = useOnce();

  return (
    <section className="px2" id="story" ref={ref} {...bind}>
      <div className="px2-inner">
        <div className="px2-head">
          <Reveal><Kicker>13 — From process to application</Kicker></Reveal>
          <MaskText text="Gulf Cement had a process." accent="Now they have software." as="h2" className="px2-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              Site inspections lived in a spreadsheet, an email thread, a WhatsApp
              group and a filing cabinet. Two of their own analysts rebuilt it in Studio
              and Flow in nine days.
            </p>
          </Reveal>
        </div>

        <div className="px2-toggle">
          {['Before', 'After'].map((t, i) => (
            <button type="button" key={t} className={index === i ? 'on' : ''} onClick={() => pick(i)}>
              {t}
            </button>
          ))}
          <span className="px2-toggle-h">{after ? 'One application, one record' : 'Four systems, no record'}</span>
        </div>

        <div className="px2-stage">
          {/* the mess — a folder with four systems falling out of it */}
          <div className="px2-fit">
            <motion.div
              className="px2-mess"
              animate={{ opacity: after ? 0 : 1 }}
              transition={{ duration: 0.6, delay: after ? 0.35 : 0.1, ease: EASE }}
              aria-hidden={after}
            >
              <svg className="px2-folder back" viewBox="0 0 940 330" aria-hidden="true">
                <path d={FOLDER_BACK} />
              </svg>

              <span className="px2-folder-tab">Site inspections · 2025</span>

              {SCATTER.map((s, i) => (
                <motion.div
                  className="px2-scrap"
                  key={s.t}
                  style={{ zIndex: 4 + i }}
                  animate={{
                    x: after ? 0 : s.x,
                    y: after ? 90 : s.y,
                    rotate: after ? 0 : s.r,
                    scale: after ? 0.72 : 1,
                  }}
                  transition={{
                    duration: 0.85,
                    delay: after ? i * 0.05 : (SCATTER.length - i) * 0.06,
                    ease: EASE,
                  }}
                >
                  <s.icon size={15} strokeWidth={1.8} />
                  <b>{s.t}</b>
                  <em>{s.m}</em>
                </motion.div>
              ))}

              <svg className="px2-folder front" viewBox="0 0 940 330" aria-hidden="true">
                <path d={FOLDER_FRONT} />
              </svg>

              <span className="px2-folder-note">4 systems · 0 records</span>
            </motion.div>
          </div>


          {/* the application */}
          <motion.div
            className="px2-app"
            animate={{ opacity: after ? 1 : 0, scale: after ? 1 : 0.9, y: after ? 0 : 14 }}
            transition={{ duration: 0.8, delay: after ? 0.24 : 0, ease: EASE }}
          >
            <Browser url="inspections.emvive.app" tabs={['Site Inspections']} badge="LIVE">
              <div className="px2-app-in">
                <div className="px2-app-nav">
                  <span className="px2-app-mark" />
                  <b>Site Inspections</b>
                  {['Today', 'Assigned', 'Findings', 'Reports'].map((n, i) => (
                    <span key={n} className={i === 0 ? 'on' : ''}>{n}</span>
                  ))}
                </div>
                <div className="px2-app-body">
                  <div className="px2-app-kpis">
                    {[['38', 'Inspections today'], ['4', 'Open findings'], ['1.2h', 'Avg. turnaround'], ['0', 'Missing records']].map(([n, l]) => (
                      <div key={l}><b>{n}</b><span>{l}</span></div>
                    ))}
                  </div>
                  <div className="px2-app-rows">
                    {[
                      ['Jubail Terminal 4', 'Y. Rahman', 'Signed', 'ok'],
                      ['Riyadh DC', 'N. Saleh', 'In progress', 'warn'],
                      ['Dammam Plant', 'T. Aziz', 'Signed', 'ok'],
                      ['Yanbu Depot', 'H. Kareem', 'Finding raised', 'bad'],
                    ].map(([site, who, st, tone]) => (
                      <span key={site}>
                        <i />
                        <b>{site}</b>
                        <em>{who}</em>
                        <u className={tone}>{st}</u>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Browser>
          </motion.div>
        </div>

        <div className="px2-out" ref={statRef}>
          {OUTCOMES.map((o) => (
            <div key={o.l}>
              <b><CountUp to={o.v} suffix={o.suffix} /></b>
              <span>{o.l}</span>
            </div>
          ))}
        </div>

        <div className="px2-quote">
          <blockquote>
            “An agency quoted four months for the inspection app. Two of our own
            analysts built it in nine days — and when the regulator changed the form,
            we changed it the same afternoon.”
          </blockquote>
          <div className="px2-by">
            <span>FA</span>
            <div><b>Faisal Al-Mutairi</b><em>Head of Digital, Gulf Cement</em></div>
            <a href="#start" className="px2-link">Read the case study <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------
   ENTERPRISE
   ------------------------------------------------------------------ */
const STACK = [
  {
    k: 'Applications', icon: PanelsTopLeft, tone: 'v',
    items: ['Built in Studio', 'Templates', 'Mobile + offline', 'Portals for outsiders'],
  },
  {
    k: 'Automation', icon: Workflow, tone: 'run',
    items: ['Flow engine', 'Human approvals', 'AI steps', 'Custom code (sandboxed)'],
  },
  {
    k: 'Platform services', icon: Layers, tone: 'cy',
    items: ['Identity & SSO', 'Permission model', 'Notifications', 'Document service'],
  },
  {
    k: 'Data', icon: Database, tone: 'amb',
    items: ['One object model', 'Row-level security', 'Event stream', 'Warehouse sync'],
  },
  {
    k: 'Infrastructure', icon: Server, tone: 'ink',
    items: ['Regional residency', 'Encrypted at rest & in flight', 'Autoscaling', 'Disaster recovery'],
  },
];

const CROSS = [
  { k: 'Security', icon: ShieldCheck },
  { k: 'Audit', icon: History },
  { k: 'Governance', icon: KeyRound },
  { k: 'Observability', icon: Activity },
];

const Enterprise = () => {
  const [hover, setHover] = useState(null);

  return (
    <section className="pn" id="enterprise">
      <DotField size={30} className="pn-dots fade" />

      <div className="pn-inner">
        <div className="pn-head">
          <Reveal><Kicker>14 — Enterprise</Kicker></Reveal>
          <MaskText text="Everything built here inherits" accent="the platform underneath it." as="h2" className="pn-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              A department can build an application on Friday afternoon without IT
              losing a single control. Security, identity, audit and residency are
              properties of the platform, not decisions each builder gets to make.
            </p>
          </Reveal>
        </div>

        <div className="pn-arch">
          {/* cross-cutting concerns run down the side of every layer */}
          <div className="pn-cross">
            {CROSS.map((c) => (
              <div className="pn-cross-i" key={c.k}>
                <span><c.icon size={14} strokeWidth={1.8} /></span>
                <b>{c.k}</b>
              </div>
            ))}
            <span className="pn-cross-rule" aria-hidden="true" />
            <span className="pn-cross-note">applies to every layer</span>
          </div>

          <div className="pn-stack">
            {STACK.map((s, i) => (
              <div
                className={`pn-layer t-${s.tone} ${hover === i ? 'on' : ''}`}
                key={s.k}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <span className="pn-layer-h">
                  <i><s.icon size={14} strokeWidth={1.8} /></i>
                  {s.k}
                </span>
                <div className="pn-layer-items">
                  {s.items.map((it) => <span key={it}>{it}</span>)}
                </div>
                {i < STACK.length - 1 && <span className="pn-layer-tie" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        <div className="pn-badges">
          {[
            [Fingerprint, 'SSO, SCIM & MFA', 'SAML 2.0 and OIDC, with automated joiner–mover–leaver.'],
            [Lock, 'Data residency', 'Pin a workspace to a region. Nothing leaves it, including backups.'],
            [History, 'Immutable audit', 'Who changed what, in which environment, with the payload.'],
            [GitBranch, 'Environments', 'Dev, test and production with approval-gated promotion.'],
            [Gauge, 'Scale', '99.98% platform availability across the last twelve months.'],
            [Users, 'Governance', 'Who may build, what they may bind to, and what needs review.'],
          ].map(([Ic, t, d]) => (
            <div className="pn-badge" key={t}>
              <Ic size={16} strokeWidth={1.8} />
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="pn-certs">
          {['ISO/IEC 27001', 'SOC 2 Type II', 'GDPR', 'ZATCA e-invoicing', 'PDPL'].map((c) => (
            <span key={c}><Check size={11} strokeWidth={3} />{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------
   CTA
   ------------------------------------------------------------------ */
const Start = () => (
  <section className="pc" id="start">
    <div className="pc-inner">
      <div className="pc-panel">
        <span className="pc-grid" aria-hidden="true" />
        <span className="pc-glow" aria-hidden="true" />

        <div className="pc-copy">
          <Kicker tone="dark">Emvive Platform &amp; Builder</Kicker>
          <MaskText text="Bring one process." accent="Leave with an application." as="h2" className="pc-h2" />
          <p>
            Pick the process your teams complain about most. In a two-hour session we
            will model it, build the screens, wire the workflow and hand you the URL.
            You keep whatever we build, whether you go ahead or not.
          </p>

          <div className="pc-actions">
            <Magnet>
              <a href="#start" className="pc-btn primary">Build with Emvive <ArrowRight size={16} /></a>
            </Magnet>
            <a href="#studio" className="pc-btn ghost">Explore Studio</a>
          </div>
        </div>

        <div className="pc-ways">
          {[
            [Rocket, 'Book a build session', 'Two hours, your process, a working app at the end.'],
            [Braces, 'Start a sandbox', 'A full workspace with sample data and every template.'],
            [Users, 'Talk to an architect', 'Bring your security review. We will answer it line by line.'],
          ].map(([Ic, t, d]) => (
            <a className="pc-way" href="#start" key={t}>
              <span className="pc-way-ic"><Ic size={16} strokeWidth={1.8} /></span>
              <b>{t}</b>
              <em>{d}</em>
              <ArrowRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export { Transformation, Enterprise, Start };
export default Walkthrough;
