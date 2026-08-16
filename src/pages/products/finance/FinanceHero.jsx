import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen, Receipt, CreditCard, Wallet, TrendingUp, ChartPie,
  ArrowRight, ChevronLeft, ChevronRight, Play, Pause,
} from 'lucide-react';
import {
  motion, EASE, MaskText, Reveal, useReducedMotion,
} from '../shared/motion';
import FinanceFilm from './FinanceFilm';
import FinanceField from './FinanceField';
import './FinanceHero.css';

/* =====================================================================
   EMVIVE FINANCE — HERO

   Three levels of attention and nothing else:

     1  the statement            what Emvive Finance is
     2  the product film         what it actually looks like, working
     3  the capability rail      what it covers, moving as you scroll

   The film is rendered rather than recorded (see FinanceFilm.jsx). If a
   real screen capture is produced, put it in DEMO_SOURCE below and the
   frame swaps to a lazy, muted, looping <video> with a poster — the
   surrounding frame, hover behaviour and controls are unchanged.
   ===================================================================== */

const DEMO_SOURCE = { src: null, poster: null };

/* ---------------------------------------------------------------
   THE FRAME
   A product demonstration window: thin border, minimal chrome, one
   soft shadow. On hover it lifts a hair, the border firms up and a
   spotlight tracks the cursor across the glass. The UI inside never
   moves — the frame does.
   --------------------------------------------------------------- */
const FilmFrame = () => {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);

  const onMove = useCallback((e) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (v) {
      if (v.paused) v.play(); else v.pause();
      setPlaying(v.paused === false);
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <motion.div
      className="fh-stage"
      initial={reduced ? false : { opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
    >
      <div className="fh-frame" ref={frameRef} onMouseMove={onMove}>
        <div className="fh-frame-glass" aria-hidden="true" />

        {DEMO_SOURCE.src ? (
          <video
            ref={videoRef}
            className="fh-video"
            src={DEMO_SOURCE.src}
            poster={DEMO_SOURCE.poster || undefined}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="none"
            aria-label="Emvive Finance product demonstration"
          />
        ) : (
          <FinanceFilm playing={playing} />
        )}

        <button
          type="button"
          className="fh-frame-ctl"
          onClick={toggle}
          aria-label={playing ? 'Pause the product demonstration' : 'Play the product demonstration'}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>

      <p className="fh-frame-cap">
        <span className="fh-frame-dot" aria-hidden="true" />
        Emvive Finance — an invoice from arrival to a posted journal
      </p>

      {/* what the film shows, for anyone who cannot see it */}
      <p className="fh-sr">
        A demonstration of Emvive Finance: invoice INV-2048 arrives from ABC Technologies for
        SAR 84,500, passes a three-way match, is approved by the controller, posts to the general
        ledger as journal JV-10431, refreshes the cash-flow report and confirms the period is
        ready to close.
      </p>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   THE CAPABILITY RAIL
   One horizontal product rail, not six cards. Scroll drives it
   sideways; the capability under the reading line is emphasised and
   opens a small contextual preview from the real product. Geometry is
   fixed — emphasis is transform and opacity only — so the scroll sync
   never fights a reflow.
   --------------------------------------------------------------- */
/* Each capability carries its own accent, the same way the industry
   cards on the home page do — `rgb` is the raw triple so the CSS can
   build translucent tints from it. The page green stays with the
   general ledger, where the ledger itself lives. */
const CAPS = [
  {
    k: 'General Ledger', icon: BookOpen, color: '#0a8f5e', rgb: '10, 143, 94',
    d: 'Centralize and manage all financial records in real time.',
  },
  {
    k: 'Accounts Payable', icon: Receipt, color: '#6c50b2', rgb: '108, 80, 178',
    d: 'Manage invoices, approvals and payments with complete control.',
  },
  {
    k: 'Accounts Receivable', icon: CreditCard, color: '#2563eb', rgb: '37, 99, 235',
    d: 'Track invoices, manage collections and improve cash flow.',
  },
  {
    k: 'Expense Management', icon: Wallet, color: '#e2601f', rgb: '226, 96, 31',
    d: 'Track, control and optimize business expenses effortlessly.',
  },
  {
    k: 'Budgeting & Forecasting', icon: TrendingUp, color: '#0d9488', rgb: '13, 148, 136',
    d: 'Plan, forecast and monitor financial performance with confidence.',
  },
  {
    k: 'Financial Reporting', icon: ChartPie, color: '#9333ea', rgb: '147, 51, 234',
    d: 'Build real-time reports and get deeper financial insights.',
  },
];

const CapabilityRail = () => {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const touched = useRef(0);
  const paused = useRef(false);

  /* one card plus the gap after it */
  const stepPx = useCallback(() => {
    const el = trackRef.current;
    const card = el && el.firstElementChild;
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card.offsetWidth + gap;
  }, []);

  /* Move on by one card, the same cadence as the industry tiles on the
     home hero — but seamlessly. The set is rendered twice, so once the
     rail has travelled the width of one full set it is snapped back by
     exactly that distance with no animation. The content at the two
     positions is identical, so nothing is visible: the cards simply
     keep sliding for as long as the page is open, instead of running
     to the end and jumping back to the start. */
  const advance = useCallback((dir = 1) => {
    const el = trackRef.current;
    const step = stepPx();
    if (!el || step <= 0) return;

    const setW = step * CAPS.length;
    if (dir > 0 && el.scrollLeft >= setW - 1) el.scrollLeft -= setW;
    if (dir < 0 && el.scrollLeft < 1) el.scrollLeft += setW;

    el.scrollBy({ left: dir * step, behavior: 'smooth' });
    setActive((cur) => (cur + dir + CAPS.length) % CAPS.length);
  }, [stepPx]);

  /* It holds while the pointer is over it, and for a few seconds after
     the visitor has moved it themselves. */
  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => {
      if (paused.current || Date.now() - touched.current < 4000) return;
      advance(1);
    }, 2800);
    return () => clearInterval(id);
  }, [reduced, advance]);

  const nudge = (dir) => {
    touched.current = Date.now();
    advance(dir);
  };

  return (
    <div
      className="fh-rail"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div
        className="fh-rail-track"
        ref={trackRef}
        onPointerDown={() => { touched.current = Date.now(); }}
        onWheel={() => { touched.current = Date.now(); }}
      >
        {/* rendered twice — the second pass is what the rail slides into
            when it wraps, and is hidden from assistive tech */}
        {[...CAPS, ...CAPS].map((c, n) => {
          const Icon = c.icon;
          return (
            <article
              className="fh-cap"
              key={`${c.k}-${n}`}
              style={{ '--cc': c.color, '--cc-rgb': c.rgb }}
              aria-hidden={n >= CAPS.length ? 'true' : undefined}
              tabIndex={n >= CAPS.length ? -1 : 0}
            >
              <span className="fh-cap-ic"><Icon size={30} strokeWidth={1.5} /></span>
              <h3 className="fh-cap-band"><span>{c.k}</span></h3>
              <p>{c.d}</p>
            </article>
          );
        })}
      </div>

      <div className="fh-rail-foot">
        <span className="fh-rail-dots" aria-hidden="true">
          {CAPS.map((c, i) => (
            <i
              key={c.k}
              className={i === active ? 'on' : ''}
              style={i === active ? { background: c.color } : undefined}
            />
          ))}
        </span>

        <div className="fh-rail-btns">
          <button
            type="button"
            className="fh-rail-btn prev"
            onClick={() => nudge(-1)}
            aria-label="Previous capability"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            className="fh-rail-btn next"
            onClick={() => nudge(1)}
            aria-label="Next capability"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   HERO
   ===================================================================== */
const FinanceHero = () => (
  <section className="fh" id="top">
    <div className="fh-bg" aria-hidden="true">
      <FinanceField />
      <span className="fh-bg-noise" />
    </div>

    <div className="fh-top">
      <div className="fh-head">
        <Reveal duration={0.7}>
          <span className="fh-pill">Emvive Finance</span>
        </Reveal>

        <h1 className="fh-h1">
          <MaskText text="Financial operations," as="span" className="fh-h1-line" delay={0.06} />
          <MaskText text="connected." as="span" className="fh-h1-line fh-accent" delay={0.18} />
        </h1>

        <Reveal delay={0.36} y={16}>
          <p className="fh-lede">
            Connect financial operations, approvals, reporting and controls in one platform
            built to give your business greater visibility and control.
          </p>
        </Reveal>
      </div>

      <FilmFrame />

      <div className="fh-cta">
        <Reveal delay={0.46} y={16}>
          <div className="fh-actions">
            <a href="#start" className="fh-btn fh-btn-solid">
              Request a Demo
              <span className="fh-btn-disc"><ArrowRight size={15} strokeWidth={2.2} /></span>
            </a>
            <a href="#overview" className="fh-btn fh-btn-shell">
              Explore Finance
              <span className="fh-btn-disc"><ArrowRight size={15} strokeWidth={2.2} /></span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.56} y={12}>
          <p className="fh-note">Built for modern finance teams.</p>
        </Reveal>
      </div>
    </div>

    <CapabilityRail />
  </section>
);

export default FinanceHero;
