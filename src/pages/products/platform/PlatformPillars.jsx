import React from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, Box, Braces, ChartColumn, ChevronDown,
  Circle, CircleCheck, CircleX, Filter, FileText, LayoutDashboard, LayoutGrid,
  Link2, MoreHorizontal, MousePointer2, Plus, RotateCw, ShieldCheck, Square,
  TrendingUp, UserCheck, Workflow, Zap,
} from 'lucide-react';

/* =====================================================================
   2 — ONE PLATFORM.  Prefix `pl-`.

   Three capability cards, each carrying the screen that capability
   actually produces: the object builder, the flow canvas, the
   dashboard. Built to the reference layout — a shell holding three
   tinted cards, arrows in the gaps between them, and a row of entry
   points along the bottom of each.

   COLOUR. This is the one place on the page that is not orange-only.
   The three pillars are a CATEGORICAL set — three distinct things,
   named — so they take three hues rather than three shades of one, and
   the set was run through the palette validator rather than picked by
   eye. On white, all pairs: CVD ΔE 14.2 (>= 8 target), normal-vision
   27.1 (>= 15 floor), all three >= 3:1 contrast. Slot 1 is the brand
   orange, so the page's own accent leads the row.

   Every card also carries its number and its name, so the colour is
   never the only thing telling the three apart.

   SCALING. Each mock sits in a container query and is sized in `em`
   off one `cqw` font size — the same trick as PlatformShots — so a
   screen scales as one piece and can never reflow inside its card.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE BUILD MOCK — the object builder
   --------------------------------------------------------------- */
const FIELDS = [
  ['Name', 'Text'],
  ['Email', 'Email'],
  ['Customer Type', 'Dropdown'],
  ['Credit Limit', 'Currency'],
  ['Status', 'Status'],
];

const ObjectMock = () => (
  <div className="pm pm-obj">
    <aside className="pm-rail" aria-hidden="true">
      {[Box, LayoutGrid, FileText, Workflow, LayoutDashboard, Filter, ShieldCheck, Braces].map((Ic, i) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <span key={i} className={i === 0 ? 'is-on' : ''}><Ic size={10} strokeWidth={2.2} /></span>
      ))}
    </aside>

    <div className="pm-panel">
      <div className="pm-obj-h">
        <ArrowLeft size={11} strokeWidth={2.3} />
        <b>Customer</b>
        <MoreHorizontal size={12} strokeWidth={2.3} />
      </div>

      <div className="pm-tabs">
        <span className="is-on">Fields</span>
        <span>Relationships</span>
        <span>Settings</span>
      </div>

      <div className="pm-rows">
        {FIELDS.map(([n, t]) => (
          <div className="pm-row" key={n}>
            <b>{n}</b>
            <i>{t}</i>
            <ChevronDown size={10} strokeWidth={2.3} />
          </div>
        ))}
      </div>

      <span className="pm-add"><Plus size={10} strokeWidth={2.8} />Add Field</span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   THE AUTOMATE MOCK — the flow canvas

   The three outcome columns are equal thirds, so their centres sit at
   50 / 150 / 250 of the fork's 300-unit box — which is where the three
   drops land. Same reasoning as the hero canvas: the connector is
   drawn to the layout rather than guessed at.
   --------------------------------------------------------------- */
const OUTCOMES = [
  { id: 'reject', ic: CircleX, tone: 'red', h: 'Reject', p: 'End' },
  { id: 'revise', ic: RotateCw, tone: 'amber', h: 'Revise', p: 'Update Record' },
  { id: 'approve', ic: CircleCheck, tone: 'green', h: 'Approve', p: 'Create Record' },
];

const FlowMock = () => (
  <div className="pm pm-flow">
    <aside className="pm-tools" aria-hidden="true">
      {[MousePointer2, Square, Circle, RotateCw, Link2, Braces].map((Ic, i) => (
        /* eslint-disable-next-line react/no-array-index-key */
        <span key={i}><Ic size={9} strokeWidth={2.2} /></span>
      ))}
    </aside>

    <div className="pm-canvas">
      <span className="pm-node">
        <b><i className="pm-dot pm-dot--green"><Zap size={8} strokeWidth={3} /></i>Trigger</b>
        <em>Record Created</em>
      </span>

      <svg className="pm-drop" viewBox="0 0 2 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1 0 L1 20" />
      </svg>

      <span className="pm-node">
        <b><i className="pm-dot pm-dot--violet"><UserCheck size={8} strokeWidth={3} /></i>Request Approval</b>
        <em>Manager</em>
      </span>

      <svg className="pm-fork" viewBox="0 0 300 26" aria-hidden="true">
        <path d="M150 0 L150 8 Q150 13 145 13 L55 13 Q50 13 50 18 L50 26" />
        <path d="M150 0 L150 26" />
        <path d="M150 0 L150 8 Q150 13 155 13 L245 13 Q250 13 250 18 L250 26" />
      </svg>

      <div className="pm-outs">
        {OUTCOMES.map((o) => {
          const Ic = o.ic;
          return (
            <span className={`pm-out pm-out--${o.tone}`} key={o.id}>
              <b><Ic size={9} strokeWidth={2.6} />{o.h}</b>
              <em>{o.p}</em>
            </span>
          );
        })}
      </div>

      <span className="pm-end" aria-hidden="true"><ArrowDown size={11} strokeWidth={2.4} /></span>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   THE ANALYZE MOCK — the dashboard

   The trend is computed from the week's readings rather than drawn by
   hand, so the shape is the data's. One series, so no legend is owed —
   the panel title names it.
   --------------------------------------------------------------- */
const TREND = [148, 172, 161, 205, 238, 219, 264];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const trendPath = () => {
  const w = 300;
  const h = 54;
  const lo = 120;
  const hi = 280;
  const pts = TREND.map((v, i) => [
    +((i / (TREND.length - 1)) * w).toFixed(1),
    +(h - ((v - lo) / (hi - lo)) * h).toFixed(1),
  ]);

  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const t = 0.2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) * t).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * t).toFixed(1)},`
      + ` ${(p2[0] - (p3[0] - p1[0]) * t).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * t).toFixed(1)},`
      + ` ${p2[0]} ${p2[1]}`;
  }
  return { line: d, area: `${d} L${w} ${h} L0 ${h} Z` };
};

const STATS = [
  { v: '1,284', k: 'Total Records', d: '+12.4%', up: true },
  { v: '842', k: 'Pending Tasks', d: '−6.2%', up: false },
  { v: '94.2%', k: 'SLA Met', d: '+2.3%', up: true },
];

const TOP = [
  ['Sales Order Approval', '432', '+14%'],
  ['Expense Approval', '256', '+8%'],
  ['Purchase Request Flow', '186', '+6%'],
];

const DashMock = () => {
  const { line, area } = trendPath();

  return (
    <div className="pm pm-dash">
      <div className="pm-dash-h">
        <b>Business Overview</b>
        <span><Filter size={9} strokeWidth={2.3} />This Week<ChevronDown size={9} strokeWidth={2.3} /></span>
      </div>

      <div className="pm-stats">
        {STATS.map((s) => (
          <span className="pm-stat" key={s.k}>
            <b>{s.v}</b>
            <i>{s.k}</i>
            <em className={s.up ? 'is-up' : 'is-down'}>
              {s.up ? '↑' : '↓'} {s.d.replace(/[+−]/, '')}
            </em>
          </span>
        ))}
      </div>

      <p className="pm-k">Records Trend</p>

      <div className="pm-chart">
        <svg viewBox="0 0 300 54" preserveAspectRatio="none" role="img" aria-label="Records created each day this week, rising from 148 on Monday to 264 on Sunday">
          <defs>
            <linearGradient id="pm-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f9b8e" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#0f9b8e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="pm-chart-f" d={area} fill="url(#pm-fill)" />
          <path className="pm-chart-l" d={line} />
        </svg>
        <ul className="pm-days">{DAYS.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>

      <p className="pm-k">Top Workflows</p>

      <div className="pm-top">
        <div className="pm-top-r pm-top-r--h"><span>Workflow</span><span>Completed</span><span>Trend</span></div>
        {TOP.map(([n, c, t]) => (
          <div className="pm-top-r" key={n}>
            <span>{n}</span>
            <span>{c}</span>
            <span className="is-up">↑ {t.replace('+', '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =====================================================================
   THE THREE CARDS
   ===================================================================== */
const PILLARS = [
  {
    id: 'build',
    n: '01',
    ic: Box,
    h: 'Build',
    p: 'Model the data, design the applications, and shape the experience.',
    Mock: ObjectMock,
    links: [[Box, 'Objects'], [FileText, 'Forms'], [LayoutGrid, 'Apps']],
  },
  {
    id: 'automate',
    n: '02',
    ic: Zap,
    h: 'Automate',
    p: 'Orchestrate processes, set approvals, and connect systems.',
    Mock: FlowMock,
    links: [[Workflow, 'Workflows'], [ShieldCheck, 'Approvals'], [Link2, 'APIs']],
  },
  {
    id: 'analyze',
    n: '03',
    ic: ChartColumn,
    h: 'Analyze',
    p: 'Turn operational data into real-time insights and intelligent reports.',
    Mock: DashMock,
    links: [[FileText, 'Reports'], [LayoutDashboard, 'Dashboards'], [TrendingUp, 'Analytics']],
  },
];

const PlatformPillars = () => (
  <section className="pa-sec pl-sec" id="platform">
    <div className="pa-in">
      <div className="pl-shell">
        <div className="pl-head">
          <span className="pl-eyebrow">One platform</span>
          <h2 className="pl-h2">
            Build. <em className="pl-v">Automate.</em> <em className="pl-t">Analyze.</em>
          </h2>
          <p className="pl-lede">
            Three capabilities, one connected system. What you build is what the flows act on,
            and what the flows do is what the reports read.
          </p>
        </div>

        <div className="pl-row">
          {PILLARS.map((p, i) => {
            const Ic = p.ic;
            const { Mock } = p;
            return (
              <React.Fragment key={p.id}>
                {i > 0 && (
                  <span className={`pl-link pl-link--${PILLARS[i - 1].id}-${p.id}`} aria-hidden="true">
                    <i className="pl-link-arrow"><ArrowRight size={13} strokeWidth={3} /></i>
                  </span>
                )}

                <article className={`pl-card pl-card--${p.id}`}>
                  <header className="pl-card-h">
                    <span className="pl-ic"><Ic size={19} strokeWidth={2} /></span>
                    <span className="pl-card-t">
                      <i>{p.n}</i>
                      <b>{p.h}</b>
                    </span>
                  </header>

                  <p className="pl-p">{p.p}</p>

                  <div className="pl-shot"><Mock /></div>

                  <ul className="pl-links">
                    {p.links.map(([LinkIc, label]) => (
                      <li key={label}><LinkIc size={13} strokeWidth={2.1} />{label}</li>
                    ))}
                  </ul>
                </article>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default PlatformPillars;
