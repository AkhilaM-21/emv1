import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BookOpen, Receipt, CreditCard, Wallet, ChartPie, Bell, Search,
  Check, ChevronRight, Clock, CircleCheckBig,
} from 'lucide-react';
import { motion, EASE, useInView, useReducedMotion } from '../shared/motion';

/* =====================================================================
   THE DEMO FILM

   A product demonstration, not a dashboard screenshot. One workspace —
   Emvive Finance, Payables — plays a single piece of work end to end:

     0  the workspace opens on the group position
     1  a card settlement lands in the transaction feed
     2  invoice INV-2048 arrives from a vendor
     3  the controller approves it (the cursor does the clicking)
     4  the journal posts and the ledger moves
     5  the cash-flow report refreshes off the new balance
     6  a notification confirms the period is ready
     7+ the frame dims, rewinds, and starts again — seamlessly

   Roughly 13 seconds a loop. The shell never changes; only the work
   does, which is what makes it read as one piece of software rather
   than a slideshow of panels.

   This is rendered rather than recorded on purpose: it stays sharp at
   any width, it costs a fraction of an mp4, and it can be edited when
   the product changes. If a real screen capture is ever produced, drop
   it into DEMO_SOURCE in FinanceHero.jsx and this becomes the fallback.
   ===================================================================== */

const CUR = 'SAR';

const SCENES = [
  { k: 'open',    step: 0, ms: 1700, crumb: 'Overview' },
  { k: 'txn',     step: 1, ms: 1600, crumb: 'Transactions' },
  { k: 'invoice', step: 2, ms: 1900, crumb: 'Payables' },
  { k: 'approve', step: 3, ms: 1900, crumb: 'Approvals' },
  { k: 'ledger',  step: 4, ms: 1800, crumb: 'General ledger' },
  { k: 'report',  step: 5, ms: 1900, crumb: 'Reports' },
  { k: 'notify',  step: 6, ms: 1700, crumb: 'Reports' },
  /* The loop seam. The frame dims, the workspace rewinds behind the dim,
     and it comes back up already at the opening state — so the join is
     invisible. The rewind has to outlast the longest exit animation
     underneath it (0.45s) or the unwinding rows are visible on the way
     back in. */
  { k: 'fade',    step: 6, ms: 450, crumb: 'Reports', dim: true },
  { k: 'rewind',  step: 0, ms: 600, crumb: 'Overview', dim: true },
];

const PLAY_MS = SCENES.slice(0, 7).reduce((a, s) => a + s.ms, 0);
const ELAPSED = SCENES.map((_, i) => SCENES.slice(0, i + 1).reduce((a, s) => a + s.ms, 0));

/* where the pointer is during each scene, as a percentage of the stage */
const CURSOR = [
  { x: 33, y: 26 },
  { x: 31, y: 55 },
  { x: 78, y: 34 },
  { x: 83, y: 66 },
  { x: 44, y: 86 },
  { x: 63, y: 82 },
  { x: 88, y: 13 },
];

/* ---------------------------------------------------------------
   The transaction feed. Each row knows the scene it arrives in, so
   the list is a pure function of the step — no queue to keep in sync.
   --------------------------------------------------------------- */
const TXNS = [
  { id: 'inv', ref: 'INV-2048', name: 'ABC Technologies', meta: 'Payables · IT services', amt: '84,500', from: 2 },
  { id: 'stl', ref: 'STL-7741', name: 'Card settlement', meta: 'Mada · 214 transactions', amt: '48,120', from: 1 },
  { id: 'rct', ref: 'RCT-9903', name: 'Landmark Retail', meta: 'Receivables · receipt', amt: '96,300', from: 0 },
  { id: 'pay', ref: 'PAY-4417', name: 'Nexa Components', meta: 'Payables · settled', amt: '311,450', from: 0 },
];

const txnTag = (id, step) => {
  if (id !== 'inv') return { t: 'Cleared', tone: 'ok' };
  return step >= 3 ? { t: 'Approved', tone: 'ok' } : { t: 'Pending', tone: 'wait' };
};

const RAIL = [
  [ChartPie, 'Overview', false],
  [BookOpen, 'General ledger', false],
  [Receipt, 'Payables', true],
  [CreditCard, 'Receivables', false],
  [Wallet, 'Expenses', false],
];

const REPORT_BEFORE = [32, 46, 39, 58, 50, 61];
const REPORT_AFTER = [32, 46, 39, 58, 50, 88];

/* the two sides of the journal, before and after INV-2048 posts */
const JOURNAL = {
  prior: [
    { c: '4010', n: 'Revenue — Retail KSA', dr: '—', cr: '1,284,500' },
    { c: '1200', n: 'Trade receivables', dr: '1,284,500', cr: '—' },
  ],
  posted: [
    { c: '6120', n: 'IT services — infrastructure', dr: '84,500', cr: '—' },
    { c: '2100', n: 'Trade payables — ABC Technologies', dr: '—', cr: '84,500' },
  ],
};

/* small helper: a value that flashes when it changes */
const Live = ({ value, className }) => (
  <motion.b
    key={value}
    className={className}
    initial={{ opacity: 0.35, y: -2 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: EASE }}
  >
    {value}
  </motion.b>
);

const Pointer = () => (
  <svg width="17" height="19" viewBox="0 0 17 19" fill="none" aria-hidden="true">
    <path
      d="M1.5 1.2L14.4 9.9L8.6 10.6L5.9 16.9L1.5 1.2Z"
      fill="#0d1117"
      stroke="#fff"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

/* =====================================================================
   FILM
   ===================================================================== */
const SupplyFilm = ({ playing = true }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -12% 0px' });
  const [i, setI] = useState(0);

  const running = playing && inView && !reduced;

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => setI((n) => (n + 1) % SCENES.length), SCENES[i].ms);
    return () => clearTimeout(id);
  }, [running, i]);

  /* with motion switched off the film holds on the beat that says the
     most about the product: the invoice, approved, mid-workflow */
  const idx = reduced ? 3 : i;
  const scene = SCENES[idx];
  const { step, k } = scene;
  const dim = Boolean(scene.dim);

  const rows = TXNS.filter((t) => step >= t.from);
  const cursor = CURSOR[Math.min(step, CURSOR.length - 1)];
  const bars = step >= 5 ? REPORT_AFTER : REPORT_BEFORE;

  const progress = k === 'rewind' ? 0 : Math.min(1, ELAPSED[idx] / PLAY_MS);

  return (
    <div className="sh-f" ref={ref}>
      {/* ---- application chrome ---- */}
      <div className="sh-f-chrome">
        <span className="sh-f-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sh-f-mark">EM</span>
        <span className="sh-f-crumb">
          <span>Emvive Finance</span>
          <ChevronRight size={10} />
          <motion.b
            key={scene.crumb}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {scene.crumb}
          </motion.b>
        </span>
        <span className="sh-f-omni"><Search size={10} /> Search the ledger <kbd>⌘K</kbd></span>
        <span className={`sh-f-bell ${step >= 6 ? 'on' : ''}`}><Bell size={12} />{step >= 6 && <i />}</span>
        <span className="sh-f-face">RH</span>
      </div>

      {/* ---- the workspace ----
          The loop-seam dim is a CSS transition, not an animated value.
          Timers and requestAnimationFrame do not always advance
          together — in a backgrounded tab the scene timer keeps firing
          while rAF is parked — and an interrupted opacity animation
          would leave the whole workspace stuck invisible with the film
          still running underneath it. A class cannot get stuck. */}
      <div className={`sh-f-body ${dim ? 'dim' : ''}`} aria-hidden="true">
        <nav className="sh-f-rail">
          {RAIL.map(([Icon, label, on]) => (
            <span className={`sh-f-rail-i ${on && step >= 2 ? 'on' : ''}`} key={label} title={label}>
              <Icon size={13} strokeWidth={1.8} />
            </span>
          ))}
        </nav>

        <div className="sh-f-main">
          {/* the group position, moved by the posting in scene 4 */}
          <div className="sh-f-kpis">
            <div>
              <span>Revenue</span>
              <Live value={`${CUR} 12.28M`} className="sh-f-num" />
              <em className="up">▲ 4.1%</em>
            </div>
            <div>
              <span>Expenses</span>
              <Live value={step >= 4 ? `${CUR} 7.51M` : `${CUR} 7.42M`} className="sh-f-num" />
              <em className={step >= 4 ? 'move' : ''}>{step >= 4 ? '▲ 1.1%' : '▲ 0.2%'}</em>
            </div>
            <div>
              <span>Cash position</span>
              <Live value={step >= 4 ? `${CUR} 42.7M` : `${CUR} 42.8M`} className="sh-f-num" />
              <em className="up">▲ 2.4%</em>
            </div>
            <div className="sh-f-live"><i />Live</div>
          </div>

          <div className="sh-f-cols">
            {/* --- transaction feed --- */}
            <section className="sh-f-panel">
              <header>
                <b>Recent transactions</b>
                <span className="sh-f-count">{rows.length} today</span>
              </header>
              <div className="sh-f-rows">
                <AnimatePresence initial={false}>
                  {rows.map((r) => {
                    const tag = txnTag(r.id, step);
                    return (
                      <motion.div
                        className={`sh-f-row ${r.id === 'inv' ? 'sel' : ''}`}
                        key={r.id}
                        layout
                        initial={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                      >
                        <span className="sh-f-ref">{r.ref}</span>
                        <span className="sh-f-txt"><b>{r.name}</b><i>{r.meta}</i></span>
                        <span className="sh-f-amt">{r.amt}</span>
                        <span className={`sh-f-tag ${tag.tone}`}>{tag.t}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            {/* --- approvals queue, which becomes the invoice --- */}
            {/* The two states of the inspector cross-fade in place rather
                than taking turns. `mode="wait"` left a third of a second
                of empty panel every loop, which reads as a glitch. */}
            <section className="sh-f-panel sh-f-insp">
              <AnimatePresence initial={false}>
                {step < 2 ? (
                  <motion.div
                    className="sh-f-queue sh-f-layer"
                    key="queue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <header><b>Approvals</b><span className="sh-f-count">18</span></header>
                    <p>Awaiting your signature</p>
                    <div className="sh-f-queue-rows">
                      {[['Vendor payments', '11'], ['Expense claims', '5'], ['Journals', '2']].map(([l, n]) => (
                        <span key={l}>{l}<i>{n}</i></span>
                      ))}
                    </div>
                    <div className="sh-f-queue-foot"><Clock size={11} /> Oldest 2 days</div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="sh-f-invoice sh-f-layer"
                    key="invoice"
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <header>
                      <span className="sh-f-inv-k">Invoice</span>
                      <b>INV-2048</b>
                    </header>

                    <div className="sh-f-inv-amt">
                      <span>{CUR}</span> 84,500
                    </div>

                    <dl className="sh-f-inv-fields">
                      <div><dt>Vendor</dt><dd>ABC Technologies</dd></div>
                      <div><dt>Due</dt><dd>24 Aug</dd></div>
                      <div><dt>Match</dt><dd className="ok"><Check size={10} strokeWidth={3.4} /> 3-way passed</dd></div>
                      <div>
                        <dt>Approval</dt>
                        <dd>
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={step >= 3 ? 'ok' : 'wait'}
                              className={`sh-f-tag ${step >= 3 ? 'ok' : 'wait'}`}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3, ease: EASE }}
                            >
                              {step >= 3 ? <><Check size={9} strokeWidth={4} /> Approved</> : <><i className="sh-f-pulse" /> Pending</>}
                            </motion.span>
                          </AnimatePresence>
                        </dd>
                      </div>
                    </dl>

                    <div className="sh-f-inv-actions">
                      <motion.span
                        className={`sh-f-btn ${step >= 3 ? 'done' : ''}`}
                        animate={step === 3 ? { scale: [1, 0.94, 1] } : { scale: 1 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        {step >= 3 ? <><Check size={11} strokeWidth={3.2} /> Approved</> : 'Approve'}
                      </motion.span>
                      <span className="sh-f-btn quiet">Hold</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* --- the ledger, then the report it feeds --- */}
          <section className="sh-f-panel sh-f-strip">
            <AnimatePresence initial={false}>
              {step < 5 ? (
                <motion.div
                  className="sh-f-ledger sh-f-layer"
                  key="ledger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <header>
                    <b>General ledger</b>
                    <span className="sh-f-count">Oct 2025 · open</span>
                    {step >= 4 && (
                      <motion.span
                        className="sh-f-tag ok"
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        JV-10431 posted
                      </motion.span>
                    )}
                  </header>

                  <div className="sh-f-jrow sh-f-jhead">
                    <span>Acct</span>
                    <span>Description</span>
                    <span>Debit</span>
                    <span>Credit</span>
                  </div>

                  <div className="sh-f-jrows">
                    <AnimatePresence initial={false}>
                      {JOURNAL[step >= 4 ? 'posted' : 'prior'].map((j) => (
                        <motion.div
                          className="sh-f-jrow"
                          key={`${step >= 4 ? 'new' : 'old'}-${j.c}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.42, ease: EASE }}
                        >
                          <span className="sh-f-acct">{j.c}</span>
                          <span className="sh-f-jname">{j.n}</span>
                          <span className="sh-f-amt">{j.dr}</span>
                          <span className="sh-f-amt">{j.cr}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="sh-f-jfoot">
                    <span><Check size={9} strokeWidth={4} /> Trial balance in balance</span>
                    <b className="sh-f-amt">{step >= 4 ? '84,500' : '1,284,500'}</b>
                    <b className="sh-f-amt">{step >= 4 ? '84,500' : '1,284,500'}</b>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="sh-f-report sh-f-layer"
                  key="report"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <header>
                    <b>Cash flow</b>
                    <span className="sh-f-count">Six months to Oct</span>
                    <span className="sh-f-tag mute">Refreshed just now</span>
                  </header>
                  <div className="sh-f-bars">
                    {bars.map((v, n) => (
                      <motion.i
                        key={n}
                        className={n === bars.length - 1 ? 'last' : ''}
                        initial={{ height: '10%' }}
                        animate={{ height: `${v}%` }}
                        transition={{ duration: 0.75, delay: n * 0.05, ease: EASE }}
                      />
                    ))}
                  </div>
                  <div className="sh-f-report-side">
                    <span>Net movement</span>
                    <b className="sh-f-num">+{CUR} 3.9M</b>
                    <em className="up">▲ 12.4% vs plan</em>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* ---- the notification ---- */}
        <AnimatePresence>
          {step >= 6 && !dim && (
            <motion.div
              className="sh-f-toast"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <CircleCheckBig size={14} strokeWidth={2} />
              <span className="sh-f-txt">
                <b>October is ready to close</b>
                <i>All approvals cleared · 3 days ahead</i>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- the pointer doing the work ---- */}
        {!reduced && !dim && (
          <motion.div
            className="sh-f-cursor"
            animate={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.7 }}
          >
            <Pointer />
            {step === 3 && (
              <motion.i
                key="click"
                initial={{ scale: 0, opacity: 0.55 }}
                animate={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            )}
          </motion.div>
        )}
      </div>

      {/* ---- loop position ---- */}
      <div className="sh-f-progress" aria-hidden="true">
        <motion.i
          animate={{ scaleX: progress }}
          transition={{ duration: k === 'rewind' ? 0 : scene.ms / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

export default SupplyFilm;
