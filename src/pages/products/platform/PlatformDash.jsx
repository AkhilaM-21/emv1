import React from 'react';
import { ArrowDownRight, ArrowUpRight, BellRing, LayoutDashboard, Table2 } from 'lucide-react';

/* =====================================================================
   ANALYZE — the board.

   NOT A GRAPH DASHBOARD. The card in the middle carries what an
   operations screen actually carries: rows. Which orders came in, for
   whom, on what date, at what value, and where each one has got to.
   The two charts are the visual reading of those same rows, and they
   hang off the card's left and right edges rather than stacking under
   it — the donut for how the work splits, the bars for which flows
   carry it.

   The line chart that used to sit here has gone, and so has the
   machinery that drew it: the scale, the Catmull-Rom smoothing, the
   hover state and the crosshair. Leaving that behind for a card that
   no longer plots anything would have been dead weight.

   Still drawn rather than exported — the arcs and the bar widths are
   computed from the numbers below, not traced by hand.
   ===================================================================== */

const KPIS = [
  { v: '1,284', k: 'Records processed', d: '+12.4%', up: true, s: 'vs prior 90 days' },
  { v: '₹24.8M', k: 'Value routed', d: '+8.1%', up: true, s: 'across 6 entities' },
  { v: '94.2%', k: 'Approvals in SLA', d: '−1.2%', up: false, s: '3,908 of 4,149' },
  { v: '4h 12m', k: 'Median cycle time', d: '−31%', up: true, s: 'was 6h 05m' },
];

/* the row above the board — what reporting on this platform actually is */
const REPORTING = [
  {
    id: 'r1',
    ic: Table2,
    h: 'Build the report',
    p: 'Group, filter and pivot any object you have modelled. Save the view your team reviews, and it reads the live records — not a copy taken overnight.',
  },
  {
    id: 'r2',
    ic: LayoutDashboard,
    h: 'Put it on a dashboard',
    p: 'Pin any report to a board and scope it per role, so finance, operations and the site each open on the numbers that are theirs.',
  },
  {
    id: 'r3',
    ic: BellRing,
    h: 'Be told, not surprised',
    p: 'Set a threshold and a flow raises it — to a person, a channel, or another flow that fixes it before anyone has to look.',
  },
];

/* ---------------------------------------------------------------
   THE ROWS — the thing the card is actually for
   --------------------------------------------------------------- */
const ORDERS = [
  { id: 'SO-2841', e: 'Gulf Build Contracting', d: '27 Aug', v: '482,900.00', s: 'Approved', t: 'good' },
  { id: 'SO-2840', e: 'Nesto Group', d: '27 Aug', v: '96,400.00', s: 'In approval', t: 'warn' },
  { id: 'SO-2839', e: 'Zahran Trading', d: '26 Aug', v: '1,204,000.00', s: 'Approved', t: 'good' },
  { id: 'SO-2838', e: 'Al Rawabi Foods', d: '26 Aug', v: '38,750.00', s: 'On hold', t: 'crit' },
  { id: 'SO-2837', e: 'Meridian Facilities', d: '25 Aug', v: '212,300.00', s: 'Approved', t: 'good' },
  { id: 'SO-2836', e: 'Northwind Logistics', d: '25 Aug', v: '74,120.00', s: 'Draft', t: 'idle' },
];

/* ---------------------------------------------------------------
   THE DONUT — share of one total, so a SEQUENTIAL ramp: one hue
   stepped by magnitude, largest to smallest. Five independent hues
   would have implied five unrelated things; these are five parts of
   the same number. Every slice is named with its percentage beside
   it, so nothing rests on the colour.
   --------------------------------------------------------------- */
const SHARE = [
  { n: 'Sales', v: 41, c: '#c94f12' },
  { n: 'Finance', v: 27, c: '#e2601f' },
  { n: 'Procurement', v: 18, c: '#ee8144' },
  { n: 'Projects', v: 9, c: '#f4a77c' },
  { n: 'HR', v: 5, c: '#f9cdb4' },
];

const DONUT_R = 42;
const DONUT_C = 2 * Math.PI * DONUT_R;

/* magnitude across four named things, so BARS — one hue again, since
   this is one measure split by category rather than four measures */
const TOPFLOWS = [
  { n: 'Sales Order Approval', v: 432 },
  { n: 'Expense Approval', v: 256 },
  { n: 'Purchase Request', v: 186 },
  { n: 'Vendor Onboarding', v: 94 },
];
const TOP_MAX = 432;

const PlatformDash = () => (
  <div className="db">
    {/* ---- what reporting on this actually is, ahead of the numbers
         and the rows it produces ---- */}
    <div className="db-rep">
      {REPORTING.map((r) => {
        const Ic = r.ic;
        return (
          <article key={r.id}>
            <h3>
              <span><Ic size={19} strokeWidth={1.9} /></span>
              {r.h}
            </h3>
            <p>{r.p}</p>
          </article>
        );
      })}
    </div>

    <div className="db-board">
      <div className="db-core">
        {/* ---- the readings: type on a rule, not four boxes ---- */}
        <div className="db-reads">
          {KPIS.map((k) => (
            <article className="db-read" key={k.k}>
              <p className="db-read-v">{k.v}</p>
              <p className="db-read-k">{k.k}</p>
              <p className={`db-read-d${k.up ? ' is-up' : ' is-down'}`}>
                {k.up ? <ArrowUpRight size={13} strokeWidth={2.6} /> : <ArrowDownRight size={13} strokeWidth={2.6} />}
                {k.d}
                <span>{k.s}</span>
              </p>
            </article>
          ))}
        </div>

        {/* ---- the records ---- */}
        <div className="db-recs">
          <header className="db-recs-h">
            <span>
              <b>Sales Orders</b>
              <i>Latest 6 of 1,284 · all entities</i>
            </span>
            <em>Live</em>
          </header>

          <div>
            <div className="db-row db-row--h">
              <span>Order</span>
              <span>Entity</span>
              <span>Date</span>
              <span>Value</span>
              <span>Status</span>
            </div>

            {ORDERS.map((o) => (
              <div className="db-row" key={o.id}>
                <span className="db-id">{o.id}</span>
                <span>{o.e}</span>
                <span>{o.d}</span>
                <span className="db-num">{o.v}</span>
                <span><em className={`db-pill is-${o.t}`}>{o.s}</em></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE CHARTS ARE THE SIDE PANELS — the visual reading of those
          same rows, left and right of them, never underneath. */}
      <aside className="db-side db-side--a">
        <p className="db-more-k">Where the work runs</p>

        <div className="db-donut">
          <svg viewBox="0 0 100 100" role="img" aria-label="Share of records by module: Sales 41 percent, Finance 27, Procurement 18, Projects 9, HR 5">
            {SHARE.reduce((acc, sh) => {
              const seg = (sh.v / 100) * DONUT_C;
              acc.els.push(
                <circle
                  key={sh.n}
                  cx="50"
                  cy="50"
                  r={DONUT_R}
                  fill="none"
                  stroke={sh.c}
                  strokeWidth="17"
                  strokeDasharray={`${(seg - 1.8).toFixed(2)} ${(DONUT_C - seg + 1.8).toFixed(2)}`}
                  strokeDashoffset={(-(acc.at / 100) * DONUT_C).toFixed(2)}
                  transform="rotate(-90 50 50)"
                />,
              );
              acc.at += sh.v;
              return acc;
            }, { els: [], at: 0 }).els}
          </svg>

          <ul className="db-slices">
            {SHARE.map((sh) => (
              <li key={sh.n}>
                <i style={{ background: sh.c }} />
                {sh.n}
                <b>{sh.v}%</b>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <aside className="db-side db-side--b">
        <p className="db-more-k">Top workflows · runs</p>

        <ul className="db-hbars">
          {TOPFLOWS.map((f) => (
            <li key={f.n}>
              <span>{f.n}</span>
              <i><b style={{ width: `${(f.v / TOP_MAX) * 100}%` }} /></i>
              <em>{f.v}</em>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </div>
);

export default PlatformDash;
