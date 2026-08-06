import React, { useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, MaskText, Reveal, safeRange, EASE } from './motion';
import { ProductPage, Footer } from './system';
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
    id: 'BLANK', pin: { x: 300, y: 170 }, label: 'Blank canvas', cam: { x: 610, y: 400, s: 1 },
    title: 'Start with nothing.',
    accent: 'Finish with production software.',
    line: 'Studio is an infinite canvas that happens to be wired to your ERP. Everything you place on it is real from the first minute.',
    logs: [{ lvl: 'info', m: 'workspace opened · capex-request', t: '09:41:02' }],
    lead: true,
  },
  {
    id: 'COMPONENTS', pin: { x: 300, y: 170 }, label: 'Drag components', cam: { x: 610, y: 380, s: 1.18 },
    title: 'Drag what the process needs.',
    line: 'Fields arrive knowing how to validate, lay out and behave. A working form exists before anyone writes a requirement.',
    logs: [
      { lvl: 'ok', m: 'component added · text_field "title"', t: '09:41:18' },
      { lvl: 'ok', m: 'component added · currency "amount"', t: '09:41:24' },
    ],
  },
  {
    id: 'DATA', pin: { x: 930, y: 130 }, label: 'Connect data', cam: { x: 900, y: 340, s: 0.86 },
    title: 'Point it at real records.',
    line: 'No import, no nightly sync. The object you bind to is the one finance and supply chain are already writing to.',
    logs: [
      { lvl: 'ok', m: 'bound to object · capex_request (1,284 rows)', t: '09:42:06' },
      { lvl: 'info', m: 'row-level access inherited from ERP roles', t: '09:42:07' },
    ],
  },
  {
    id: 'LOGIC', pin: { x: 330, y: 620 }, label: 'Build the workflow', cam: { x: 880, y: 800, s: 0.78 },
    title: 'Wire the process behind it.',
    line: 'Triggers, conditions and actions on the same canvas as the screen, reading the same records the form just wrote.',
    logs: [
      { lvl: 'ok', m: 'flow created · po-approval', t: '09:44:31' },
      { lvl: 'info', m: '5 nodes · 5 connections validated', t: '09:44:33' },
    ],
  },
  {
    id: 'RUN', pin: { x: 330, y: 620 }, label: 'Test the automation', cam: { x: 880, y: 790, s: 0.9 },
    title: 'Watch it execute.',
    line: 'Every run is logged step by step — duration, outcome, and whoever is sitting on an approval.',
    logs: [
      { lvl: 'info', m: 'run #48219 started · trigger: record created', t: '09:45:02' },
      { lvl: 'ok', m: 'condition true · amount 142,000 > 50,000', t: '09:45:02' },
      { lvl: 'ok', m: 'run completed in 0.81s · 0 retries', t: '09:45:03' },
    ],
  },
  {
    id: 'PREVIEW', pin: { x: 1520, y: 130 }, label: 'Preview anywhere', cam: { x: 1560, y: 430, s: 0.92 },
    title: 'One build, every surface.',
    line: 'Web, the Emvive mobile app and a REST endpoint come from the same definition. Offline capture included.',
    logs: [
      { lvl: 'ok', m: 'preview build v1.4 · web + ios + android', t: '09:47:12' },
      { lvl: 'info', m: 'locale bundle · en, ar (rtl)', t: '09:47:13' },
    ],
  },
  {
    id: 'PUBLISH', pin: { x: 330, y: 940 }, label: 'Ship it', cam: { x: 900, y: 780, s: 0.5 },
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

  /* Camera. The input range uses step centres so the camera and the
     discrete step index agree — mapping to i/(n-1) put them out of sync.
     The canvas origin is pinned to the viewport centre in CSS, so the
     transform is simply scale-then-offset: point (x,y) lands dead centre. */
  const RANGE = safeRange(STEPS.map((_, i) => (i + 0.5) / STEPS.length));
  const spring = { stiffness: 58, damping: 24, mass: 0.9 };
  const camX = useSpring(useTransform(scrollYProgress, RANGE, STEPS.map((s) => s.cam.x)), spring);
  const camY = useSpring(useTransform(scrollYProgress, RANGE, STEPS.map((s) => s.cam.y)), spring);
  const camS = useSpring(useTransform(scrollYProgress, RANGE, STEPS.map((s) => s.cam.s)), spring);

  const transform = useTransform([camX, camY, camS], ([x, y, s]) =>
    `scale(${s}) translate(${-x}px, ${-y}px)`);

  /* comment pins live on the canvas, so they must be counter-scaled to
     stay readable as the camera zooms out */
  const inv = useTransform(camS, (s) => 1 / s);

  const zoomPct = useTransform(camS, (s) => Math.round(s * 100));
  const [zoomLabel, setZoomLabel] = useState(100);
  useMotionValueEvent(zoomPct, 'change', (v) => setZoomLabel(v));

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

              {/* Narration lives on the canvas as comment pins, the way it
                  would in a design tool — counter-scaled so it stays
                  readable while the camera zooms from 118% down to 50%. */}
              {STEPS.map((s, i) => (
                <div className="pi-pin" key={s.id} style={{ left: s.pin.x, top: s.pin.y }}>
                  <motion.div
                    className="pi-pin-body"
                    style={{ scale: inv }}
                    animate={{ opacity: step === i ? 1 : 0, y: step === i ? 0 : 10 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <span className="pi-pin-n">{String(i + 1).padStart(2, '0')}</span>
                    <div className="pi-pin-card">
                      <span className="pi-pin-k">{s.label}</span>
                      <h2 className={s.lead ? 'pi-pin-h lead' : 'pi-pin-h'}>
                        {s.title}
                        {s.accent && <em>{s.accent}</em>}
                      </h2>
                      <p>{s.line}</p>
                      {s.lead && (
                        <div className="pi-pin-cta">
                          <a href="#ship" className="px-btn px-btn-solid">Book a build session <ArrowRight size={16} /></a>
                          <span className="pi-scrollhint">Scroll to build</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
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
    <Editor />
    <Ship />
    <Footer />
  </ProductPage>
);

export default Platform;
