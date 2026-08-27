import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Banknote, Bell, Boxes, Briefcase, ChartColumn, ChevronLeft,
  ChevronRight, Code2, FileText, FormInput, LayoutGrid, PanelsTopLeft, Receipt,
  ShoppingCart, UserRound, Workflow,
} from 'lucide-react';
/* the Finance hero's type and buttons: .hi-title / .hi-line /
   .hi-accent live here, .cta-btn-* are global in index.css */
import '../../../components/hero/variants/HeroInfosys.css';
import PlatformCanvas from './PlatformCanvas';
import PlatformDash from './PlatformDash';
import PlatformPillars from './PlatformPillars';
import {
  ApiShot, AppShot, ApprovalsShot, DocShot, FlowRails, FnShot,
  FormShot, Frame, NavShot, ObjectShot, RunsShot, ScheduleShot,
} from './PlatformShots';
import './PlatformCanvas.css';
import './PlatformShots.css';
import './PlatformDash.css';
import './PlatformPillars.css';
import './PlatformAuto.css';

/* =====================================================================
   EMVIVE PLATFORM — landing page

   PRODUCT-FIRST. Every section is carried by a screen from the product
   rather than by a row of icon-and-paragraph cards. The order:

     1  hero            copy left, the live workflow canvas beside it
     2  one platform    build → automate → analyze, three tinted
                        cards each carrying the screen it produces
                        (PlatformPillars.jsx)
     3  build           the object builder, full width, with a form
                        panel over its corner and a capability selector
                        that swaps the screen underneath
     4  automate        the flow designer in its own chrome — rails,
                        canvas, properties — then four capability crops
     6  analyze         the dark block: an operational dashboard
     6  what you build  the module grid on a dark block, with the
                        one-record visual beside it

   The screens themselves are in PlatformShots.jsx and PlatformDash.jsx
   — drawn in markup, not exported as images. See the header of
   PlatformShots.jsx for why, and for how they scale.
   ===================================================================== */

/* =====================================================================
   THE ANCHOR BAR — the same one Supply Chain and Finance run.

   Two behaviours, both taken from there: the bar tracks whichever
   section is in view, and once the hero has scrolled past, the site
   header steps aside so the two bars are never on screen together.
   ===================================================================== */
const ANCHORS = [
  ['platform', 'Overview'],
  ['build', 'Build'],
  ['automate', 'Automate'],
  ['analyze', 'Analyze'],
  ['modules', 'What you can build'],
  ['stories', 'Customer stories'],
  ['resources', 'Resources'],
];

/* at module scope, so the effect below has a stable dependency — built
   inline it would be a new array every render and re-run every time */
const ANCHOR_IDS = ANCHORS.map(([id]) => id);

/* The last section wins when several are visible, which matches
   reading order on the way down. */
const useScrollSpy = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (seen.length) setActive(seen[seen.length - 1].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
};

/* THE SWAP, read on scroll rather than with an observer.

   An observer only fires when `isIntersecting` CHANGES, and "above the
   viewport" and "below the viewport" are both the same `false` — so
   jumping from far down the page back to the top can go false → false
   and never fire, leaving the site header hidden with the hero back on
   screen. A position read has no such state to miss. */
const useNavSwap = () => {
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return undefined;

    let frame = 0;

    const read = () => {
      frame = 0;
      /* handover happens once the sentinel has gone up past the top */
      document.body.classList.toggle('pa-nav-swap', el.getBoundingClientRect().top < 0);
    };

    /* at most one read per frame, however fast the scroll fires */
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.body.classList.remove('pa-nav-swap');
    };
  }, []);

  return sentinel;
};

/* =====================================================================
   3 — BUILD.  Six screens behind one selector.
   ===================================================================== */
const BUILD_CAPS = [
  {
    id: 'apps',
    ic: LayoutGrid,
    label: 'App Builder',
    path: 'emvive.app/studio/apps/sales-ops',
    chip: 'App builder',
    h: 'Ship the screen, not the ticket.',
    p: 'Assemble pages, lists and record views over your own objects, and hand each team the app it actually works in.',
    Shot: AppShot,
  },
  {
    id: 'forms',
    ic: FormInput,
    label: 'Forms',
    path: 'emvive.app/studio/forms/customer-onboarding',
    chip: 'Form builder',
    h: 'The form is the process.',
    p: 'Drag the field in, set who has to sign it off, and it is collecting real records on the next page load.',
    Shot: FormShot,
  },
  {
    id: 'objects',
    ic: Boxes,
    label: 'Objects',
    path: 'emvive.app/studio/objects/customer',
    chip: 'Studio',
    h: 'Your data model, in your language.',
    p: 'Every field, relationship and permission on the record — no schema migration, no release window.',
    Shot: ObjectShot,
  },
  {
    id: 'docs',
    ic: FileText,
    label: 'Documents',
    path: 'emvive.app/studio/documents/tax-invoice',
    chip: 'Template',
    h: 'The paperwork writes itself.',
    p: 'Invoices, POs and certificates rendered from the live record, in the format each authority expects.',
    Shot: DocShot,
  },
  {
    id: 'nav',
    ic: PanelsTopLeft,
    label: 'Navigation',
    path: 'emvive.app/studio/navigation',
    chip: 'Designer',
    h: 'Every role sees its own system.',
    p: 'Arrange what each team opens on, and what they never have to look at, down to the item.',
    Shot: NavShot,
  },
  {
    id: 'fn',
    ic: Code2,
    label: 'Functions',
    path: 'emvive.app/studio/functions/on-order-approved',
    chip: 'Code',
    h: 'And where it needs code, write code.',
    p: 'Drop into JavaScript for the logic no builder should own, with the same records and the same permissions.',
    Shot: FnShot,
  },
];

/* =====================================================================
   4 — AUTOMATE.  The four capability crops under the big screen.
   ===================================================================== */
const AUTO_CAPS = [
  {
    id: 'flows',
    sum: 'Triggers, branches, loops, replay',
    label: 'Workflows',
    h: 'Multi-step processes that run themselves.',
    p: 'Open any run and see what each step read, what it decided and what it changed — then replay a single record without redoing the rest.',
    Shot: RunsShot,
  },
  {
    id: 'approvals',
    sum: 'Value routing, SLA clocks, escalation',
    label: 'Approvals',
    h: 'The sign-off, with a clock on it.',
    p: 'Route by value, entity or exception, escalate when the window closes, and let anyone approve from the record itself.',
    Shot: ApprovalsShot,
  },
  {
    id: 'scheduled',
    sum: 'Cron, your timezone, backfills',
    label: 'Scheduled',
    h: 'The work nobody should remember.',
    p: 'Nightly reviews, month-end postings, quarterly re-scores — on your calendar and your timezone, not someone’s reminder.',
    Shot: ScheduleShot,
  },
  {
    id: 'api',
    sum: 'REST, SDK, signed webhooks',
    label: 'API & Webhooks',
    h: 'A flow is not confined to Emvive.',
    p: 'Call anything you already run, and let anything you already run call a flow — with a signed payload and a full delivery log.',
    Shot: ApiShot,
  },
];


/* =====================================================================
   4b — THE CAPABILITY RAIL

   The retool.com pattern: the copy holds still on the left while the
   screens scroll past on the right, and whichever screen is crossing
   the middle of the viewport is the one the copy is describing.

   It replaced a segmented control, which made you click four times to
   see four things and showed one at a time. Here the scroll IS the
   interaction — every screen gets a moment, in order, for free.

   The observer's rootMargin squeezes the viewport to a band across its
   middle, so a panel becomes "active" as it crosses the centre rather
   than as it clips the bottom edge. Last one wins when two are in the
   band at once, which matches reading order going down.
   ===================================================================== */
const AutoRail = () => {
  const [active, setActive] = useState(0);
  const items = useRef([]);

  useEffect(() => {
    const els = items.current.filter(Boolean);
    if (!els.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (!seen.length) return;
        const i = items.current.indexOf(seen[seen.length - 1].target);
        if (i >= 0) setActive(i);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = AUTO_CAPS[active];

  return (
    <div className="pa-rail">
      <div className="pa-rail-l">
        <div className="pa-rail-copy">
          <span className="pa-rail-n">
            {String(active + 1).padStart(2, '0')}
            <i>/ {String(AUTO_CAPS.length).padStart(2, '0')}</i>
          </span>

          {/* keyed on the capability, so the entrance animation replays
              when the copy swaps rather than only on first paint */}
          <h3 key={`h-${cur.id}`}>{cur.h}</h3>
          <p key={`p-${cur.id}`}>{cur.p}</p>
        </div>

        <ul className="pa-rail-nav">
          {AUTO_CAPS.map((c, i) => (
            <li key={c.id} className={i === active ? 'is-on' : undefined}>
              <a href={`#auto-${c.id}`}>
                <b>{c.label}</b>
                <i>{c.sum}</i>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pa-rail-r">
        {AUTO_CAPS.map((c, i) => {
          const Shot = c.Shot;
          return (
            <div
              className={`pa-rail-item${i === active ? ' is-on' : ''}`}
              id={`auto-${c.id}`}
              key={c.id}
              ref={(el) => { items.current[i] = el; }}
            >
              {/* the same copy, carried with its own screen. It is off
                  on desktop, where the sticky column says it — but once
                  the rail stacks there is no sticky column, and one
                  block of copy above four screens pairs with none of
                  them. */}
              <div className="pa-rail-item-copy">
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>

              <Frame path={`emvive.app/flows/${c.id}`} chip={c.label}>
                <Shot />
              </Frame>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =====================================================================
   THE RECORD FLOW — the figure beside the heading.

   Built to the savant.io hero diagram: pill-labelled groups with the
   work fanning left to right through them. Their three stages are
   Source / Analyze & Automate / Deliver; these are the three this
   section is actually claiming — everything starts somewhere, meets on
   ONE record, and leaves as whatever each department needed.

   Authored on a 600 x 300 box and emitted as PERCENTAGES of it, with
   the connectors on the same viewBox, so the elbows meet the tiles
   exactly at every width. Same approach as the hero canvas.
   ===================================================================== */
const FW = 600;
const FH = 300;

const TILE = { w: 118, h: 60 };
const ROWS = [46, 141, 236];                 /* centres at 75 / 170 / 265 */
const CORE = { x: 228, y: 124, w: 144, h: 92 };
const MID = CORE.y + CORE.h / 2;             /* 170 */

const STARTS = [
  { n: 'Sales Order', ic: ShoppingCart, c: '226, 96, 31' },
  { n: 'Purchase Request', ic: Boxes, c: '74, 58, 167' },
  { n: 'Expense Claim', ic: Receipt, c: '18, 128, 90' },
];

const ENDS = [
  { n: 'Invoice', ic: FileText, c: '42, 120, 214' },
  { n: 'Dashboard', ic: ChartColumn, c: '15, 155, 142' },
  { n: 'Notification', ic: Bell, c: '217, 79, 134' },
];

/* a horizontal elbow: out, turn at `mx`, in — with the corners arced
   rather than mitred, which is what the reference draws */
const hElbow = (x0, y0, x1, y1, mx, r = 12) => {
  if (y0 === y1) return `M${x0} ${y0} L${x1} ${y1}`;
  const dir = y1 > y0 ? 1 : -1;
  const rr = Math.min(r, Math.abs(y1 - y0) / 2, mx - x0, x1 - mx);
  return [
    `M${x0} ${y0}`,
    `L${mx - rr} ${y0}`,
    `Q${mx} ${y0} ${mx} ${y0 + dir * rr}`,
    `L${mx} ${y1 - dir * rr}`,
    `Q${mx} ${y1} ${mx + rr} ${y1}`,
    `L${x1} ${y1}`,
  ].join(' ');
};

const pcf = (v, total) => `${(v / total) * 100}%`;

/* THE RUN. Three beats — the sources fire, the record takes it, the
   outputs go — and the travelling dots are timed to land just before
   each beat, so a tile lights up as the line reaches it rather than on
   its own schedule. See the keyframes in PlatformAuto.css for how the
   two halves share one 4.2s loop. */
const FLOW_STAGES = 3;
const FLOW_MS = 1400;

const RecordFlow = () => {
  const ref = useRef(null);
  const [stage, setStage] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setStage((n) => (n + 1) % FLOW_STAGES), FLOW_MS);
    return () => clearTimeout(t);
  }, [onScreen, stage]);

  return (
  <div className="pf" ref={ref} aria-hidden="true">
    <svg className="pf-wires" viewBox={`0 0 ${FW} ${FH}`} preserveAspectRatio="none">
      <defs>
        <marker id="pf-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1.5 1.5 L5.5 4 L1.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {ROWS.map((y) => {
          const d = hElbow(8 + TILE.w, y + TILE.h / 2, CORE.x - 6, MID, 176);
          return (
            <React.Fragment key={`in-${y}`}>
              <path className={`pf-wire${stage >= 1 ? ' is-live' : ''}`} d={d} markerEnd="url(#pf-arrow)" />
              <path className="pf-pulse" d={d} pathLength="100" />
            </React.Fragment>
          );
        })}
        {ROWS.map((y) => {
          const d = hElbow(CORE.x + CORE.w, MID, FW - 8 - TILE.w - 6, y + TILE.h / 2, 424);
          return (
            <React.Fragment key={`out-${y}`}>
              <path className={`pf-wire${stage >= 2 ? ' is-live' : ''}`} d={d} markerEnd="url(#pf-arrow)" />
              <path className="pf-pulse pf-pulse--out" d={d} pathLength="100" />
            </React.Fragment>
          );
        })}
      </g>
    </svg>

    <span className="pf-tag" style={{ left: pcf(8, FW), width: pcf(TILE.w, FW) }}>Starts</span>
    <span className="pf-tag pf-tag--core" style={{ left: pcf(CORE.x, FW), width: pcf(CORE.w, FW) }}>One record</span>
    <span className="pf-tag" style={{ left: pcf(FW - 8 - TILE.w, FW), width: pcf(TILE.w, FW) }}>Comes out</span>

    {STARTS.map((t, i) => {
      const Ic = t.ic;
      return (
        <div
          className={`pf-tile${stage === 0 ? ' is-on' : ''}`}
          key={t.n}
          style={{
            left: pcf(8, FW), top: pcf(ROWS[i], FH),
            width: pcf(TILE.w, FW), height: pcf(TILE.h, FH), '--tc': t.c,
          }}
        >
          <i><Ic size={13} strokeWidth={2.1} /></i>
          <b>{t.n}</b>
        </div>
      );
    })}

    <div
      className={`pf-core${stage === 1 ? ' is-on' : ''}`}
      style={{
        left: pcf(CORE.x, FW), top: pcf(CORE.y, FH),
        width: pcf(CORE.w, FW), height: pcf(CORE.h, FH),
      }}
    >
      <span>Sales Order</span>
      <b>SO-2841</b>
      <em>6 departments · 1 record</em>
    </div>

    {ENDS.map((t, i) => {
      const Ic = t.ic;
      return (
        <div
          className={`pf-tile${stage === 2 ? ' is-on' : ''}`}
          key={t.n}
          style={{
            left: pcf(FW - 8 - TILE.w, FW), top: pcf(ROWS[i], FH),
            width: pcf(TILE.w, FW), height: pcf(TILE.h, FH), '--tc': t.c,
          }}
        >
          <i><Ic size={13} strokeWidth={2.1} /></i>
          <b>{t.n}</b>
        </div>
      );
    })}
  </div>
  );
};

/* =====================================================================
   THE DEPARTMENT CAROUSEL

   Six cards on a horizontal rail with prev/next. The buttons move by
   ONE CARD — measured off the rendered card rather than a guessed
   pixel step, so it stays right however the cards resize — and they
   disable at each end rather than dead-clicking. The rail is a real
   scroll container, so a trackpad swipe works too and the buttons stay
   in step with it.
   ===================================================================== */
const DeptRail = () => {
  const rail = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const read = () => {
    const el = rail.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 2,
      /* a point of slack: sub-pixel widths mean scrollLeft rarely
         lands exactly on the maximum */
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2,
    });
  };

  useEffect(() => {
    read();
    window.addEventListener('resize', read, { passive: true });
    return () => window.removeEventListener('resize', read);
  }, []);

  const nudge = (dir) => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.offsetWidth + 18 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="pa-mwrap">
      <div className="pa-mrail" ref={rail} onScroll={read}>
        {MODULES.map((m) => {
          const Ic = m.ic;
          return (
            <article className="pa-mcard" key={m.id} style={{ '--mc': m.c }}>
              <h3>
                <span className="pa-mic"><Ic size={19} strokeWidth={1.9} /></span>
                {m.h}
              </h3>
              <p>{m.p}</p>
            </article>
          );
        })}
      </div>

      <div className="pa-mnav">
        <button type="button" onClick={() => nudge(-1)} disabled={edge.start} aria-label="Previous departments">
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>
        <button type="button" onClick={() => nudge(1)} disabled={edge.end} aria-label="Next departments">
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
};

/* =====================================================================
   6 — WHAT CAN YOU BUILD
   ===================================================================== */
const MODULES = [
  {
    id: 'sales',
    c: '226, 96, 31',
    ic: Receipt,
    h: 'Sales',
    p: 'Orders, quotations and the customers behind them — priced, approved and invoiced on one record.',
  },
  {
    id: 'finance',
    c: '18, 128, 90',
    ic: Banknote,
    h: 'Finance',
    p: 'Expenses, payments and the approvals that release them, posted against the same ledger.',
  },
  {
    id: 'ops',
    c: '42, 120, 214',
    ic: Workflow,
    h: 'Operations',
    p: 'Requests, cases and the processes that move them, without a spreadsheet in the middle.',
  },
  {
    id: 'proc',
    c: '74, 58, 167',
    ic: Boxes,
    h: 'Procurement',
    p: 'Purchase orders, vendors and contracts, from the requisition through to the goods receipt.',
  },
  {
    id: 'hr',
    c: '217, 79, 134',
    ic: UserRound,
    h: 'HR & People',
    p: 'Employee requests, onboarding and sign-offs, on the same approvals engine as everything else.',
  },
  {
    id: 'projects',
    c: '161, 98, 7',
    ic: Briefcase,
    h: 'Projects',
    p: 'Timesheets, milestones and budgets, reading the costs finance has already posted.',
  },
];


/* =====================================================================
   THE PAGE
   ===================================================================== */
const PlatformAuto = () => {
  const [buildCap, setBuildCap] = useState('objects');
  const active = useScrollSpy(ANCHOR_IDS);
  const sentinel = useNavSwap();

  const build = BUILD_CAPS.find((c) => c.id === buildCap);
  const BuildShot = build.Shot;

  return (
    <div className="pa">
      {/* ============================================================
          1 — HERO
          ============================================================ */}
      <section className="pa-hero" id="top">
        <div className="pa-in pa-hero-in">
          {/* copy left, the diagram beside it */}
          <div className="pa-hero-copy">
            <span className="pa-eyebrow">Platform &amp; Builder</span>

            {/* THE FINANCE HERO'S HEADLINE, verbatim: .hi-title at 65px
                with the lines stacked and the last one carrying
                .hi-accent — the 100deg orange ramp clipped to the glyphs
                rather than a flat colour. The two inline overrides are
                Finance's own: left-aligned instead of centred, and the
                text-shadow off, since it exists to hold white type off a
                dark film and this ground is white. */}
            <h1
              className="hi-title"
              style={{ alignItems: 'flex-start', margin: 0, textShadow: 'none', fontSize: '65px' }}
            >
              <span className="hi-line" style={{ color: 'var(--ink)' }}>The system your</span>
              <span className="hi-line" style={{ color: 'var(--ink)' }}>business actually</span>
              <span className="hi-line hi-accent">runs on.</span>
            </h1>

            <p className="pa-hero-lede">
              Model the objects you work with, automate the work between them, and put it live
              across every entity you operate — on one record every module reads and writes.
            </p>

            {/* and its buttons — the global pair, with the secondary
                forced white the way Finance does it: its default is a
                transparent shell with a white border, which is meant for
                a dark hero and disappears on this one */}
            <div className="pa-hero-actions">
              <a href="#start" className="cta-btn-primary">
                Request a demo <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
              </a>
              <a href="#platform" className="cta-btn-secondary" style={{ backgroundColor: 'white' }}>
                See how it works
              </a>
            </div>
          </div>

          {/* the builder, at full strength in its own column */}
          <div className="pa-hero-bg" aria-hidden="true">
            <PlatformCanvas />
          </div>
        </div>
      </section>

      {/* the handover point: while this is on screen the site header
          owns the top; once it passes, the bar below takes over */}
      <span className="pa-nav-sentinel" ref={sentinel} aria-hidden="true" />

      <nav className="pa-anchors" aria-label="On this page">
        <div className="pa-in pa-anchors-in">
          <ul>
            {ANCHORS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={active === id ? 'is-current' : undefined}
                  aria-current={active === id ? 'true' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#start" className="pa-btn pa-btn-solid pa-anchors-cta">Contact us</a>
        </div>
      </nav>

      <PlatformPillars />

      {/* ============================================================
          3 — BUILD

          Built to the appsmith.com shape: one tinted panel, the
          capabilities as a spread tab row across its top with the live
          one underlined, then copy on the left and the screen on the
          right. The tabs drive BOTH — the headline, the paragraph and
          the screen all belong to whichever capability is open, which
          is what makes the row worth clicking.

          Their layout, our everything else: the site's orange for the
          tint and the underline, Plus Jakarta Sans over Inter, and the
          page's own button.
          ============================================================ */}
      <section className="pa-sec pa-build" id="build">
        <div className="pa-in">
          <div className="pa-bpanel">
            <div className="pa-head">
              <span className="pa-eyebrow">Build</span>
              <h2 className="pa-h2">Build around <em>your business.</em></h2>
              <p className="pa-lede">
                Create the applications, data structures and experiences your teams need —
                without being held to the shape somebody else’s software came in.
              </p>
            </div>

            <div className="pa-btabs" role="tablist" aria-label="Build capabilities">
              {BUILD_CAPS.map((c) => {
                const Ic = c.ic;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={c.id === buildCap}
                    className={c.id === buildCap ? 'is-on' : undefined}
                    onClick={() => setBuildCap(c.id)}
                  >
                    <Ic size={17} strokeWidth={2} />
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="pa-bbody">
              <div className="pa-bcopy">
                <h3>{build.h}</h3>
                <p>{build.p}</p>
              </div>

              <div className="pa-bshot">
                <Frame path={build.path} chip={build.chip}>
                  <BuildShot />
                </Frame>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4 — AUTOMATE

          The one section that breaks the page's own measure: the flow
          designer runs wider than every other block on the page, on a
          band of its own, because it is the screen worth looking at
          longest. The four capabilities under it are a segmented
          control — the component the product itself would use — not a
          card with a tab strip glued to its top.
          ============================================================ */}
      <section className="pa-sec pa-flow" id="automate">
        <div className="pa-in">
          <div className="pa-head pa-head--c">
            <span className="pa-eyebrow">Automate</span>
            <h2 className="pa-h2 pa-h2--xl">Turn business processes <em>into workflows.</em></h2>
            <p className="pa-lede">
              Design how work moves through your organisation — from the first event to the
              final action, including everything that has to happen when someone says no.
            </p>
          </div>
        </div>

        <div className="pa-bleed">
          <Frame path="emvive.app/flows/sales-invoice-approval" chip="Flow designer">
            <FlowRails><PlatformCanvas /></FlowRails>
          </Frame>
        </div>

        <div className="pa-in">
          <AutoRail />
        </div>
      </section>

      {/* ============================================================
          6 — ANALYZE
          ============================================================ */}
      <section className="pa-sec pa-an" id="analyze">
        <div className="pa-in">
          <div className="pa-head pa-head--c">
            <span className="pa-eyebrow">Analyze</span>
            <h2 className="pa-h2">See what your business <em>is actually doing.</em></h2>
            <p className="pa-lede">
              Turn the data your applications and processes generate into operational insight —
              on the live ledger, not on last night’s extract.
            </p>
          </div>

          <PlatformDash />
        </div>
      </section>

      {/* ============================================================
          6 — WHAT CAN YOU BUILD

          Three across, twice — icon, heading, two lines, and no card
          around any of it. The panel border and fill were doing nothing
          the whitespace was not already doing, and six boxed cards next
          to a boxed visual made the block read as a form.
          ============================================================ */}
      <section className="pa-sec pa-mods" id="modules">
        <div className="pa-in">
          <div className="pa-mtop">
            <div className="pa-head">
              <span className="pa-eyebrow">What you can build</span>
              <h2 className="pa-h2">Build for the way <em>your business works.</em></h2>
              <p className="pa-lede">
                Not six products with six databases. Six departments on one record — which is
                what lets a flow cross from procurement to finance without an integration.
              </p>
            </div>

            <RecordFlow />
          </div>

          <DeptRail />
        </div>
      </section>

    </div>
  );
};
export default PlatformAuto;
