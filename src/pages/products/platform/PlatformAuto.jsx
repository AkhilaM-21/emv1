import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight, ArrowRight, Banknote, Bell, Boxes, Briefcase, ChartColumn,
  ChevronDown, ChevronLeft, ChevronRight, FileText, FormInput,
  LayoutGrid, MousePointer2, PanelsTopLeft, Receipt, ShoppingCart,
  UserRound, Workflow,
} from 'lucide-react';
import PlatformCanvas from './PlatformCanvas';
import PlatformDash from './PlatformDash';
import PlatformPillars from './PlatformPillars';
import {
  AppShot, ApprovalsShot, FlowRails,
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
                        canvas, properties — then three capability crops
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

/* =====================================================================
   THE HERO'S OWN "NOT JUST WORKFLOW" CARDS.

   The canvas beside the headline is a flow diagram, and a flow diagram
   read on its own says "automation tool". These three cards sit next
   to it and name the other two things the product is — an app builder
   and a data modeller — so the first screen a visitor sees states the
   whole platform, not just the one capability the canvas happens to
   draw. Same three words the page's own anchor bar uses: Build,
   [Object] Model[ling], Automate.
   ===================================================================== */
/* =====================================================================
   BESIDE THE HERO DIAGRAM — a second screen, not a fifth text panel.

   Four goes at this slot were all words: the three-word list, the
   blocks-and-code panel, the two-timeline bars, the who-builds-it
   rows. Every one of them put a paragraph next to a picture, and the
   hero already has a headline and a lede doing that job.

   So it shows PRODUCT instead. The canvas on the left is the Flow
   Designer; this is the Object Builder — the same screen the Build
   pillar draws further down the page, imported rather than rebuilt so
   the two can never drift apart. Together they say the low-code claim
   by demonstration: model the data here, move it there, no code in
   either shot.
   ===================================================================== */

/* =====================================================================
   THE MARGIN DOODLES — a curved arrow in currentColor, one <defs> per
   instance so the arrowhead marker id is never duplicated in the DOM.
   ===================================================================== */
const Doodle = ({ id, d, w, h, className }) => (
  <svg className={className} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
    <defs>
      <marker id={id} viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M1.5 1.5 L5.5 4 L1.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" markerEnd={`url(#${id})`} />
  </svg>
);

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
   3 — BUILD.  Four screens behind one selector.
   ===================================================================== */
const BUILD_CAPS = [
  {
    id: 'apps',
    ic: LayoutGrid,
    label: 'Drag & Drop Builder',
    path: 'emvive.app/studio/apps/sales-ops',
    chip: 'App builder',
    h: 'Drag & Drop Builder',
    p: 'Design application components through a drag-and-drop approach, making it easier to build business solutions without traditional development.',
    Shot: AppShot,
  },
  {
    id: 'forms',
    ic: FormInput,
    label: 'Custom Forms',
    path: 'emvive.app/studio/forms/customer-onboarding',
    chip: 'Form builder',
    h: 'Custom Forms',
    p: 'Create forms tailored to specific business requirements and processes.',
    Shot: FormShot,
  },
  {
    id: 'objects',
    ic: Boxes,
    label: 'Tables & Relationships',
    path: 'emvive.app/studio/objects/customer',
    chip: 'Object Builder',
    h: 'Tables & Relationships',
    p: 'Structure business data using tables and define relationships between related information.',
    Shot: ObjectShot,
  },
  {
    id: 'nav',
    ic: PanelsTopLeft,
    label: 'UI Designer',
    path: 'emvive.app/studio/navigation',
    chip: 'Designer',
    h: 'UI Designer',
    p: 'Design application interfaces to create user experiences aligned with your business processes.',
    Shot: NavShot,
  },
];

/* =====================================================================
   4 — AUTOMATE.  The three capability crops under the big screen.
   ===================================================================== */
const AUTO_CAPS = [
  {
    id: 'flows',
    sum: 'Define and automate business workflows',
    label: 'Workflow Automation',
    h: 'Workflow Automation',
    p: 'Define and automate business workflows based on organisational requirements.',
    Shot: RunsShot,
  },
  {
    id: 'approvals',
    sum: 'Structured approvals, any stage',
    label: 'Approval Chains',
    h: 'Approval Chains',
    p: 'Create structured approval processes involving the required users or stages.',
    Shot: ApprovalsShot,
  },
  {
    id: 'triggers',
    sum: 'Initiate workflows on business events',
    label: 'Event Triggers',
    h: 'Event Triggers',
    p: 'Initiate workflows based on defined business events.',
    Shot: ScheduleShot,
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
                  block of copy above three screens pairs with none of
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
   THE HERO SIDE PANEL — the code first, then the screen it renders.

   A stand-in for the whole "low-code" pitch in one small screen: the
   same three builders named in the hero copy (App, Object, Flow) as a
   tab row, the markup for a small form, then — the arrow standing in
   for "compiles to" — the visual output that markup actually builds.
   Stacked, not side-by-side, because the panel this sits in is a
   sidebar, not a wide screen.
   ===================================================================== */
const LC_TABS = ['App Builder', 'Object Builder', 'Flow Designer'];

/* the code pane's tokens, coloured rather than left flat grey — three
   of the site's own hues (teal for tags, violet for attributes, the
   page's orange for strings) so the "code" view reads as code and
   still belongs to this palette, not a borrowed editor theme */
const LowCodeMock = () => (
  <div className="pm pm-lc">
    <div className="pm-lc-tabs">
      {LC_TABS.map((t, i) => (
        <span key={t} className={i === 0 ? 'is-on' : undefined}>{t}</span>
      ))}
    </div>

    <pre className="pm-lc-code">
      <code>
        <span className="tk-tag">{'<Form '}</span>
        <span className="tk-attr">onSubmit</span>
        <span className="tk-tag">{'={saveVendor}>'}</span>{'\n'}
        {'  '}<span className="tk-tag">{'<Field '}</span>
        <span className="tk-attr">name</span>
        <span className="tk-tag">=</span>
        <span className="tk-str">&quot;name&quot;</span>{' '}
        <span className="tk-attr">label</span>
        <span className="tk-tag">=</span>
        <span className="tk-str">&quot;Vendor Name&quot;</span>
        <span className="tk-tag">{' />'}</span>{'\n'}
        {'  '}<span className="tk-tag">{'<Field '}</span>
        <span className="tk-attr">name</span>
        <span className="tk-tag">=</span>
        <span className="tk-str">&quot;category&quot;</span>{' '}
        <span className="tk-attr">type</span>
        <span className="tk-tag">=</span>
        <span className="tk-str">&quot;select&quot;</span>
        <span className="tk-tag">{' />'}</span>{'\n'}
        {'  '}<span className="tk-tag">{'<Button>'}</span>Save<span className="tk-tag">{'</Button>'}</span>{'\n'}
        <span className="tk-tag">{'</Form>'}</span>
      </code>
    </pre>

    <span className="pm-lc-div" aria-hidden="true">
      <i />
      <ArrowLeftRight size={10} strokeWidth={2.4} />
      <i />
    </span>

    <div className="pm-lc-form">
      <div className="pm-lc-form-h">
        <b><MousePointer2 size={9} strokeWidth={2.4} />Create Vendor</b>
        <span className="pm-lc-chip">Drag &amp; Drop</span>
      </div>
      <span className="pm-lc-fld">Vendor Name</span>
      <span className="pm-lc-fld pm-lc-fld--sel">Category<ChevronDown size={9} strokeWidth={2.4} /></span>
      <span className="pm-lc-save">Save</span>
    </div>
  </div>
);

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
          {/* copy left, the diagram beside it.

              THE HEADLINE IS FLOWING TEXT, not four fixed line-breaks —
              one block that wraps on its own at whatever width the row
              gives it, exactly like .pa-hero-lede below it. A forced
              per-line layout (four short spans, each hugging its own
              text) can never fill a wide row; ordinary wrapping text
              does, the same way a paragraph does. */}
          <div className="pa-hero-copy">
            <h1 className="pa-hero-title">
              Build, Automate and Connect Your Business{' '}
              <span className="pa-hero-title-accent">on One Platform</span>
            </h1>

            <p className="pa-hero-lede">
              Extend your enterprise applications with a no-code platform designed to
              build applications, automate workflows, connect business systems and
              manage access — all within a unified enterprise environment.
            </p>
          </div>

          {/* the copy runs full width above, so this row is free to use
              the WHOLE hero width for itself — the low-code card on the
              left, the flow diagram on the right. */}
          <div className="pa-hero-bg" aria-hidden="true">
            <aside className="pa-lc">
              <p className="pa-lc-k">
                <i className="pa-lc-dot" />
                Build with low-code
              </p>

              <div className="pa-lc-shot"><LowCodeMock /></div>

              <p className="pa-lc-foot">
                Same app, two views. Drag it together, or drop straight
                into the code.
              </p>
            </aside>

            <div className="pa-hero-canvas">
              <PlatformCanvas />

              {/* the margin notes — the reference's hand-drawn asides,
                  same three claims the cards and the wire diagram
                  already make, said again in a different voice so the
                  hero doesn't read as one dry diagram */}
              <span className="pa-note pa-note--top">
                Automate<br />with a few clicks
                <Doodle
                  id="pa-doodle-top"
                  className="pa-note-arrow pa-note-arrow--top"
                  w={54} h={44}
                  d="M50 4 C 40 4, 14 10, 6 38"
                />
              </span>
            </div>
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
          <a href="#start" className="btn-get-started pa-anchors-cta">
            Contact us
            <span className="arrow-circle">
              <ArrowRight size={14} color="#fff" />
            </span>
          </a>
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
              <span className="pa-eyebrow">Emvive Studio</span>
              <h2 className="pa-h2">Build Applications Around <em>the Way Your Business Works</em></h2>
              <p className="pa-lede">
                Emvive Studio provides no-code tools to create and customise business
                applications through a visual development environment. From business
                requirements to working applications, Emvive Studio gives organisations
                the tools to shape applications around the way they operate.
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
          longest. The three capabilities under it are a segmented
          control — the component the product itself would use — not a
          card with a tab strip glued to its top.
          ============================================================ */}
      <section className="pa-sec pa-flow" id="automate">
        <div className="pa-in">
          <div className="pa-head pa-head--c">
            <span className="pa-eyebrow">Emvive Flow</span>
            <h2 className="pa-h2 pa-h2--xl">Automate <em>the Way Work Moves</em></h2>
            <p className="pa-lede">
              Business processes often involve multiple steps, users and approvals. Emvive
              Flow provides workflow automation capabilities to structure and automate
              these processes. Emvive Flow brings structure and automation to business
              processes, helping organisations manage how work moves across teams and
              functions.
            </p>
          </div>
        </div>

        <div className="pa-bleed">
          <Frame path="emvive.app/flows/sales-quotation-to-invoice" chip="Flow Designer">
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
