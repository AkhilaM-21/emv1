import React, { useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { Blocks, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, MaskText, Reveal, EASE } from './motion';
import { ProductPage, SubNav, Footer } from './system';
import {
  TopBar, LeftRail, RightRail, Console, Artboard, DataNode,
  FlowGraph, DevicePreview, DeployCard, RunBadge,
} from './StudioCanvas';
import './Platform.css';

/* =====================================================================
   EMVIVE PLATFORM — THE CANVAS
   The page is an editor window. Chrome is fixed; scrolling drives the
   canvas camera, which pans and zooms between regions while the
   application assembles itself. There is no hero and no section.
   ===================================================================== */

/* camera targets in canvas coordinates */
const STEPS = [
  {
    id: 'BLANK', label: 'Blank canvas', cam: { x: 610, y: 400, s: 1 },
    title: 'Start with nothing.',
    accent: 'Finish with production software.',
    line: 'Studio is an infinite canvas that happens to be wired to your ERP. Everything you place on it is real from the first minute.',
    logs: [{ lvl: 'info', m: 'workspace opened · capex-request', t: '09:41:02' }],
    lead: true,
  },
  {
    id: 'COMPONENTS', label: 'Drag components', cam: { x: 610, y: 380, s: 1.18 },
    title: 'Drag what the process needs.',
    line: 'Fields arrive knowing how to validate, lay out and behave. A working form exists before anyone writes a requirement.',
    logs: [
      { lvl: 'ok', m: 'component added · text_field "title"', t: '09:41:18' },
      { lvl: 'ok', m: 'component added · currency "amount"', t: '09:41:24' },
    ],
  },
  {
    id: 'DATA', label: 'Connect data', cam: { x: 900, y: 340, s: 0.86 },
    title: 'Point it at real records.',
    line: 'No import, no nightly sync. The object you bind to is the one finance and supply chain are already writing to.',
    logs: [
      { lvl: 'ok', m: 'bound to object · capex_request (1,284 rows)', t: '09:42:06' },
      { lvl: 'info', m: 'row-level access inherited from ERP roles', t: '09:42:07' },
    ],
  },
  {
    id: 'LOGIC', label: 'Build the workflow', cam: { x: 880, y: 800, s: 0.78 },
    title: 'Wire the process behind it.',
    line: 'Triggers, conditions and actions on the same canvas as the screen, reading the same records the form just wrote.',
    logs: [
      { lvl: 'ok', m: 'flow created · po-approval', t: '09:44:31' },
      { lvl: 'info', m: '5 nodes · 5 connections validated', t: '09:44:33' },
    ],
  },
  {
    id: 'RUN', label: 'Test the automation', cam: { x: 880, y: 790, s: 0.9 },
    title: 'Watch it execute.',
    line: 'Every run is logged step by step — duration, outcome, and whoever is sitting on an approval.',
    logs: [
      { lvl: 'info', m: 'run #48219 started · trigger: record created', t: '09:45:02' },
      { lvl: 'ok', m: 'condition true · amount 142,000 > 50,000', t: '09:45:02' },
      { lvl: 'ok', m: 'run completed in 0.81s · 0 retries', t: '09:45:03' },
    ],
  },
  {
    id: 'PREVIEW', label: 'Preview anywhere', cam: { x: 1560, y: 430, s: 0.92 },
    title: 'One build, every surface.',
    line: 'Web, the Emvive mobile app and a REST endpoint come from the same definition. Offline capture included.',
    logs: [
      { lvl: 'ok', m: 'preview build v1.4 · web + ios + android', t: '09:47:12' },
      { lvl: 'info', m: 'locale bundle · en, ar (rtl)', t: '09:47:13' },
    ],
  },
  {
    id: 'PUBLISH', label: 'Ship it', cam: { x: 900, y: 780, s: 0.5 },
    title: 'Live before the meeting ends.',
    line: 'Promote through environments with approval, roll back in one click, and watch the first users arrive.',
    logs: [
      { lvl: 'ok', m: 'deployed to production · ksa-central-1', t: '09:52:40' },
      { lvl: 'ok', m: 'https://app.emvive.com/capex is live', t: '09:52:41' },
      { lvl: 'info', m: '412 sessions in the first hour', t: '10:52:00' },
    ],
  },
];

const Editor = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  const [runIndex, setRunIndex] = useState(0);
  const [logs, setLogs] = useState(STEPS[0].logs.map((l, i) => ({ ...l, id: `0-${i}` })));

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * STEPS.length;
    const next = Math.min(STEPS.length - 1, Math.max(0, Math.floor(raw * 0.999)));
    if (next !== step) {
      setStep(next);
      setLogs((prev) => [
        ...STEPS[next].logs.map((l, i) => ({ ...l, id: `${next}-${i}` })),
        ...prev,
      ].slice(0, 6));
    }
    /* during the run step, the local progress drives node execution */
    if (next === 4) setRunIndex(Math.floor((raw - next) * 6));
  });

  /* camera: spring-damped pan and zoom between regions */
  const camX = useSpring(useTransform(scrollYProgress, STEPS.map((_, i) => i / (STEPS.length - 1)), STEPS.map((s) => s.cam.x)), { stiffness: 60, damping: 22, mass: 0.9 });
  const camY = useSpring(useTransform(scrollYProgress, STEPS.map((_, i) => i / (STEPS.length - 1)), STEPS.map((s) => s.cam.y)), { stiffness: 60, damping: 22, mass: 0.9 });
  const camS = useSpring(useTransform(scrollYProgress, STEPS.map((_, i) => i / (STEPS.length - 1)), STEPS.map((s) => s.cam.s)), { stiffness: 60, damping: 22, mass: 0.9 });

  const transform = useTransform([camX, camY, camS], ([x, y, s]) =>
    `translate(calc(50% - ${x * s}px), calc(50% - ${y * s}px)) scale(${s})`);

  const zoomPct = useTransform(camS, (s) => Math.round(s * 100));
  const [zoomLabel, setZoomLabel] = useState(100);
  useMotionValueEvent(zoomPct, 'change', (v) => setZoomLabel(v));

  const cur = STEPS[step];

  return (
    <section className="pi" id="canvas" ref={ref} style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="pi-window">
        <TopBar zoom={zoomLabel} step={step} />

        <div className="pi-body">
          <LeftRail step={step} />

          <div className="pi-canvas-wrap">
            <div className="pi-grid" aria-hidden="true" />

            <motion.div className="pi-canvas" style={{ transform }}>
              <Artboard step={step} />
              <DataNode step={step} />
              <FlowGraph step={step} runIndex={runIndex} />
              <DevicePreview step={step} />
              <DeployCard step={step} />
              <RunBadge step={step} runIndex={runIndex} />

              {/* the wire that binds the form to the data object */}
              <svg className="pi-bind" width="1800" height="1200" aria-hidden="true">
                <motion.path
                  d="M840,330 C900,330 900,262 960,262"
                  className="pi-bind-path"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: step >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                />
              </svg>
            </motion.div>

            {/* narration, as an editor annotation rather than page copy */}
            <div className="pi-note">
              <motion.span
                className="pi-note-k"
                key={`k${cur.id}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <i>{String(step + 1).padStart(2, '0')}</i> {cur.label}
              </motion.span>

              <motion.h2
                key={`t${cur.id}`}
                className={cur.lead ? 'pi-note-h lead' : 'pi-note-h'}
                initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {cur.title}
                {cur.accent && <em>{cur.accent}</em>}
              </motion.h2>

              <motion.p
                key={`l${cur.id}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
              >
                {cur.line}
              </motion.p>

              {cur.lead && (
                <motion.div
                  className="pi-note-cta"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                >
                  <a href="#ship" className="px-btn px-btn-solid">Book a build session <ArrowRight size={16} /></a>
                  <span className="pi-scrollhint">Scroll to build</span>
                </motion.div>
              )}
            </div>

            {/* step rail down the right edge of the canvas */}
            <div className="pi-steps">
              {STEPS.map((s, i) => (
                <span className={`pi-step ${i === step ? 'on' : ''} ${i < step ? 'past' : ''}`} key={s.id}>
                  <em>{s.id}</em><i />
                </span>
              ))}
            </div>
          </div>

          <RightRail step={step} />
        </div>

        <Console lines={logs} />
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   Ship — the one moment the editor steps aside
   --------------------------------------------------------------- */
const Ship = () => (
  <section className="pi-ship" id="ship">
    <div className="pi-ship-inner">
      <Reveal><span className="pi-ship-k">Session ended · 11 minutes</span></Reveal>
      <MaskText text="That was one process." as="h2" className="pi-ship-h" />
      <MaskText text="Your teams have" accent="hundreds." as="h2" className="pi-ship-h" />

      <Reveal delay={0.18} y={16}>
        <p>
          Studio and Flow ship with the platform rather than being priced per app.
          The people who own the process build it, and everything they build inherits
          the security, data and audit trail the rest of Emvive already runs on.
        </p>
      </Reveal>

      <Reveal delay={0.26} y={16}>
        <div className="pi-ship-cta">
          <a href="#ship" className="px-btn px-btn-solid">Book a build session <ArrowRight size={16} /></a>
          <a href="#canvas" className="px-btn px-btn-quiet">Open the canvas again</a>
        </div>
      </Reveal>

      <Reveal delay={0.34} y={16}>
        <div className="pi-ship-quote">
          <blockquote>
            “An agency quoted four months for our site inspection app. Two of our own
            analysts built it in nine days.”
          </blockquote>
          <div className="pi-ship-by">
            <span>FA</span>
            <div><b>Faisal Al-Mutairi</b><em>Head of Digital, Gulf Cement</em></div>
            <a href="#ship" className="px-link">Case study <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ===================================================================== */
const Platform = () => (
  <ProductPage accent="#a78bfa" accent2="#c4b5fd" wash="rgba(167,139,250,0.14)" className="pf">
    <SubNav
      icon={Blocks}
      name="Emvive Studio & Flow"
      links={[{ href: '#canvas', label: 'The canvas' }, { href: '#ship', label: 'Ship' }]}
      cta="Book a session"
    />
    <Editor />
    <Ship />
    <Footer />
  </ProductPage>
);

export default Platform;
