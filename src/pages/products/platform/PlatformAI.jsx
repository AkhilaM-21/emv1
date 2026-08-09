import React from 'react';
import {
  Sparkles, Database, FormInput, Workflow, Bell, BarChart3, Check, Rocket,
  ArrowUp, Table2, PanelsTopLeft, Pencil, Eye, RotateCcw, ShieldCheck, Users,
} from 'lucide-react';
import { motion, MaskText, Reveal, EASE } from '../shared/motion';
import { Kicker, Browser, DotField, useAutoStep, AnimatePresence } from './PlatformKit';
import './PlatformAI.css';

/* =====================================================================
   AI BUILDER

   The trap with an AI section is that it becomes a paragraph about AI
   next to a glowing orb. So this one is a transcript: a real prompt, the
   steps the builder actually takes, and the application appearing beside
   them piece by piece — with the point that every generated artifact
   opens in Studio and can be edited by hand.
   ===================================================================== */

const STEPS = [
  { t: 'Reading your data model', m: '46 objects · 8 already relevant', icon: Database },
  { t: 'Creating data model', m: 'employee · document · approval', icon: Table2 },
  { t: 'Generating the joiner form', m: '11 fields · 4 validation rules', icon: FormInput },
  { t: 'Building screens', m: '4 pages · desktop + mobile', icon: PanelsTopLeft },
  { t: 'Creating approval workflow', m: '5 nodes · SLA 24h', icon: Workflow },
  { t: 'Connecting notifications', m: 'email · in-app · WhatsApp', icon: Bell },
  { t: 'Generating the dashboard', m: '4 metrics · 1 chart', icon: BarChart3 },
  { t: 'Application ready', m: '9 min 41 s · ready to edit', icon: Check, done: true },
];

const FOLLOWUPS = [
  'Add a probation review after 90 days',
  'Send the welcome email in Arabic',
  'Require a second approver above grade 12',
];

/* ------------------------------------------------------------------
   The application being generated. Each part keys off the step index,
   so the right-hand side is literally the output of the left-hand side.
   ------------------------------------------------------------------ */
const Generated = ({ step }) => (
  <div className="pa-app">
    <div className="pa-app-nav">
      <span className="pa-app-mark" />
      <b>Employee Onboarding</b>
      {['Overview', 'Joiners', 'Approvals'].map((n, i) => (
        <span key={n} className={i === 0 ? 'on' : ''}>{n}</span>
      ))}
      <motion.span
        className={`pa-app-ship ${step >= 7 ? 'live' : ''}`}
        animate={{ opacity: step >= 3 ? 1 : 0.35 }}
      >
        {step >= 7 ? <><Check size={11} strokeWidth={3} /> Published</> : <><Rocket size={11} strokeWidth={2} /> Publish</>}
      </motion.span>
    </div>

    <div className="pa-app-body">
      {/* objects */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className="pa-objects"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {['employee', 'document', 'approval'].map((o, i) => (
              <motion.span
                key={o}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
              >
                <Table2 size={11} strokeWidth={2} />{o}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pa-app-grid">
        {/* form */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              className="pa-card pa-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="pa-card-h"><FormInput size={11} strokeWidth={2} /> New joiner</span>
              {[['Full name', 'Yusuf Rahman'], ['Position', 'Site engineer'], ['Start date', '12 Sep 2026'], ['Line manager', 'A. Hassan']].map(([l, v], i) => (
                <motion.span
                  className="pa-frow"
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: EASE }}
                >
                  <i>{l}</i>{v}
                </motion.span>
              ))}
              <span className="pa-fsubmit">Submit</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* metrics + chart */}
        <AnimatePresence>
          {step >= 6 && (
            <motion.div
              className="pa-card pa-metrics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="pa-card-h"><BarChart3 size={11} strokeWidth={2} /> Onboarding health</span>
              <div className="pa-kpis">
                {[['14', 'In progress'], ['1.4d', 'Avg. cycle'], ['96%', 'On time'], ['0', 'Overdue']].map(([n, l]) => (
                  <div key={l}><b>{n}</b><em>{l}</em></div>
                ))}
              </div>
              <div className="pa-bars">
                {[38, 52, 44, 66, 58, 74, 62, 81, 70, 88].map((h, i) => (
                  <motion.i
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease: EASE }}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* workflow */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              className="pa-card pa-flow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="pa-card-h"><Workflow size={11} strokeWidth={2} /> Approval workflow</span>
              <div className="pa-nodes">
                {['Submit', 'Verify', 'Approve', 'Provision', 'Notify'].map((n, i) => (
                  <React.Fragment key={n}>
                    {i > 0 && <i className="pa-wire" />}
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: i * 0.09, ease: EASE }}
                    >
                      {n}
                    </motion.span>
                  </React.Fragment>
                ))}
              </div>
              {step >= 5 && (
                <motion.div
                  className="pa-channels"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                >
                  {['Email', 'In-app', 'WhatsApp'].map((c) => (
                    <span key={c}><Bell size={9} strokeWidth={2.4} />{c}</span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* skeleton, before anything exists */}
      {step < 1 && (
        <div className="pa-skeleton" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
          <span>waiting for the model…</span>
        </div>
      )}
    </div>
  </div>
);

/* ================================================================== */
const PlatformAI = () => {
  const { ref, index, bind } = useAutoStep(STEPS.length, 1500, { hold: 5000 });

  return (
    <section className="pa" id="ai" ref={ref} {...bind}>
      <DotField tone="dark" size={30} className="pa-dots fade" />
      <span className="pa-glow" aria-hidden="true" />

      <div className="pa-inner">
        <div className="pa-head">
          <Reveal><Kicker tone="dark">07 — Emvive AI</Kicker></Reveal>
          <MaskText text="Describe it. Then" accent="open it in Studio." as="h2" className="pa-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              The AI builder is not a black box that emits an app you cannot touch.
              It produces the same objects, screens and flows you would have dragged
              yourself — and hands you the editor.
            </p>
          </Reveal>
        </div>

        <div className="pa-split">
          {/* ---------------- transcript ---------------- */}
          <div className="pa-chat">
            <div className="pa-prompt">
              <span className="pa-prompt-av">RM</span>
              <div>
                <p>Build an employee onboarding app. Joiners upload documents, HR verifies, the line manager approves, IT gets a ticket.</p>
                <span className="pa-prompt-meta">Reem Al-Mansour · HR Operations</span>
              </div>
            </div>

            <div className="pa-steps">
              {STEPS.map((s, i) => (
                <div
                  className={`pa-step ${index === i ? 'on' : ''} ${index > i ? 'done' : ''} ${s.done ? 'final' : ''}`}
                  key={s.t}
                >
                  <span className="pa-step-ic">
                    {index > i || (s.done && index >= i)
                      ? <Check size={12} strokeWidth={3} />
                      : <s.icon size={13} strokeWidth={1.9} />}
                    {index === i && !s.done && <i className="pa-spin" />}
                  </span>
                  <span className="pa-step-t">
                    <b>{s.t}{index === i && !s.done ? '…' : ''}</b>
                    <em>{index >= i ? s.m : ''}</em>
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {index >= STEPS.length - 1 && (
                <motion.div
                  className="pa-after"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="pa-actions">
                    <span className="pa-act primary"><Pencil size={12} strokeWidth={2} /> Open in Studio</span>
                    <span className="pa-act"><Eye size={12} strokeWidth={2} /> Preview</span>
                    <span className="pa-act"><RotateCcw size={12} strokeWidth={2} /> Regenerate</span>
                  </div>

                  <span className="pa-follow-k">Refine it</span>
                  <div className="pa-follows">
                    {FOLLOWUPS.map((f) => <span key={f}>{f}</span>)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pa-composer">
              <Sparkles size={14} strokeWidth={1.9} />
              <span>Ask for a change…</span>
              <i><ArrowUp size={13} strokeWidth={2.4} /></i>
            </div>
          </div>

          {/* ---------------- generated app ---------------- */}
          <div className="pa-stage">
            <Browser
              url="onboarding.emvive.app"
              tabs={['Employee Onboarding']}
              badge={index >= 7 ? 'LIVE' : undefined}
              className="pa-browser"
            >
              <Generated step={index} />
            </Browser>

            <div className="pa-stage-foot">
              <span className={index >= 7 ? 'ok' : ''}>
                <i />{index >= 7 ? 'generated · fully editable' : `generating · step ${index + 1} of ${STEPS.length}`}
              </span>
              <span className="pa-stage-count">
                {[[Table2, index >= 1 ? 3 : 0, 'objects'], [PanelsTopLeft, index >= 3 ? 4 : 0, 'pages'], [Workflow, index >= 4 ? 5 : 0, 'nodes']].map(([Ic, n, l]) => (
                  <em key={l}><Ic size={11} strokeWidth={1.9} />{n} {l}</em>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="pa-guards">
          {[
            [ShieldCheck, 'Nothing is generated outside your permissions.', 'The builder can only see and write the objects the requesting user already has rights to.'],
            [Users, 'It reads your organisation, not the internet.', 'Grades, sites, cost centres and approval limits come from your own ERP data.'],
            [Pencil, 'Everything it makes is ordinary Studio work.', 'Open any generated screen or flow and edit it by hand. There is no separate AI format.'],
          ].map(([Ic, t, d]) => (
            <div className="pa-guard" key={t}>
              <Ic size={16} strokeWidth={1.8} />
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformAI;
