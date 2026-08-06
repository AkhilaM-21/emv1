import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { geoNaturalEarth1, geoPath, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import {
  Truck, Boxes, Warehouse, ShoppingCart, Factory, ClipboardCheck, Ship,
  ScanLine, Handshake, TrendingUp, Gauge, TriangleAlert, Timer, Package,
  ArrowUpRight, Check, Layers,
} from 'lucide-react';
import {
  motion, Reveal, Stagger, StaggerItem, MaskText, useLive, EASE,
} from './motion';
import {
  ProductPage, SubNav, Hero, SectionHead, Chrome, HairGrid, StatRow,
  Story, Split, ClosingCta, Footer,
} from './system';
import { useSize, AreaChart, LiveBars, Meter, Ring } from './viz';
import './SupplyChain.css';

/* =====================================================================
   WORLD MAP
   A real Natural Earth projection of the same topology the rest of the
   site already ships, with great-circle trade lanes drawn between real
   port coordinates. Nothing here is a decorative illustration.
   ===================================================================== */

const PORTS = {
  yantian: { c: [114.06, 22.54], label: 'Yantian' },
  singapore: { c: [103.82, 1.35], label: 'Singapore' },
  mumbai: { c: [72.87, 19.08], label: 'Mumbai' },
  rotterdam: { c: [4.48, 51.92], label: 'Rotterdam' },
  jebelAli: { c: [55.06, 25.01], label: 'Jebel Ali' },
  dammam: { c: [50.1, 26.43], label: 'Dammam' },
  jeddah: { c: [39.2, 21.49], label: 'Jeddah' },
  riyadh: { c: [46.72, 24.71], label: 'Riyadh DC' },
};

const LANES = [
  ['yantian', 'jebelAli', 0],
  ['singapore', 'dammam', 0.9],
  ['rotterdam', 'jeddah', 1.7],
  ['mumbai', 'riyadh', 2.5],
];

const HUBS = ['jebelAli', 'dammam', 'jeddah', 'riyadh'];

const WorldMap = () => {
  const [ref, { w, h }] = useSize();
  const [land, setLand] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/countries-110m.json')
      .then((r) => r.json())
      .then((world) => {
        if (alive) setLand(feature(world, world.objects.countries));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const { countries, project } = useMemo(() => {
    if (!land || !w || !h) return { countries: [], project: null };
    /* a little padding so coastlines never touch the panel edge */
    const projection = geoNaturalEarth1().fitExtent([[6, 6], [w - 6, h - 6]], land);
    const gen = geoPath(projection);
    return {
      countries: land.features.map((f, i) => ({ d: gen(f), id: i })),
      project: projection,
    };
  }, [land, w, h]);

  const lanes = useMemo(() => {
    if (!project) return [];
    return LANES.map(([from, to, delay]) => {
      const interp = geoInterpolate(PORTS[from].c, PORTS[to].c);
      const pts = Array.from({ length: 48 }, (_, i) => project(interp(i / 47)));
      return {
        key: `${from}-${to}`,
        delay,
        d: `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}`,
      };
    });
  }, [project]);

  const hubs = useMemo(() => {
    if (!project) return [];
    return HUBS.map((k) => {
      const [x, y] = project(PORTS[k].c);
      return { key: k, x, y, label: PORTS[k].label };
    });
  }, [project]);

  return (
    <div className="sx-map" ref={ref}>
      {w > 0 && (
        <svg width={w} height={h} aria-label="Global logistics network" role="img">
          <g className="sx-land">
            {countries.map((c) => c.d && <path key={c.id} d={c.d} />)}
          </g>

          {lanes.map((l) => (
            <g key={l.key}>
              <path d={l.d} className="sx-lane" />
              <motion.path
                d={l.d}
                className="sx-lane-run"
                initial={{ pathLength: 0.1, pathOffset: 0, opacity: 0 }}
                animate={{ pathOffset: [0, 0.9], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 4.6,
                  delay: l.delay,
                  repeat: Infinity,
                  repeatDelay: 0.7,
                  ease: 'linear',
                  times: [0, 0.12, 0.82, 1],
                }}
              />
            </g>
          ))}

          {hubs.map((hb, i) => (
            <g key={hb.key} className="sx-hub">
              <motion.circle
                cx={hb.x} cy={hb.y} r="9"
                className="sx-hub-halo"
                initial={{ scale: 0.4, opacity: 0.55 }}
                animate={{ scale: [0.4, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2.8, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
                style={{ transformOrigin: `${hb.x}px ${hb.y}px` }}
              />
              <circle cx={hb.x} cy={hb.y} r="3.2" className="sx-hub-dot" />
              <text x={hb.x + 8} y={hb.y + 3} className="sx-hub-label">{hb.label}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

/* =====================================================================
   HERO — the operations control tower
   ===================================================================== */

const SHIPMENT_POOL = [
  { id: 'SHP-20418', lane: 'Yantian → Jebel Ali', eta: 'ETA 14 Aug', tone: 'warn', state: '+48h' },
  { id: 'SHP-20419', lane: 'Singapore → Dammam', eta: 'ETA 11 Aug', tone: 'pos', state: 'On time' },
  { id: 'SHP-20420', lane: 'Rotterdam → Jeddah', eta: 'ETA 19 Aug', tone: 'pos', state: 'On time' },
  { id: 'SHP-20421', lane: 'Mumbai → Riyadh', eta: 'ETA 09 Aug', tone: 'pos', state: 'Customs' },
  { id: 'SHP-20422', lane: 'Jebel Ali → Dammam', eta: 'ETA 08 Aug', tone: 'pos', state: 'Inland' },
  { id: 'SHP-20423', lane: 'Yantian → Jeddah', eta: 'ETA 23 Aug', tone: 'warn', state: 'Rebooked' },
];

const makeShipment = (i) => ({ ...SHIPMENT_POOL[i % SHIPMENT_POOL.length], key: i });

const ControlTower = () => {
  const [tick, liveRef] = useLive(
    {
      n: 0,
      fill: 99.1,
      transit: 34,
      cover: 18.4,
      shipments: [0, 1, 2, 3].map(makeShipment),
    },
    (s) => {
      const n = s.n + 1;
      const wave = Math.sin(n * 1.1) * 0.6 + Math.sin(n * 0.7) * 0.4;
      return {
        n,
        fill: 99.1 + wave * 0.28,
        transit: Math.max(28, Math.round(34 + wave * 3)),
        cover: 18.4 + wave * 0.7,
        shipments: [...s.shipments.slice(1), makeShipment(s.shipments[s.shipments.length - 1].key + 1)],
      };
    },
    3600
  );

  return (
    <div className="sx-tower" ref={liveRef}>
      <div className="sx-tower-map">
        <header className="sx-tower-head">
          <div>
            <h4>Network control tower</h4>
            <p>1,284 open orders · 42 lanes · 9 distribution centres</p>
          </div>
          <div className="sx-tower-tools">
            <span className="px-chrome-tag"><span className="px-live" /> Live</span>
            <span className="px-chrome-tag">Gulf network</span>
          </div>
        </header>

        <WorldMap />

        <div className="sx-tower-kpis">
          {[
            ['Order fill rate', `${tick.fill.toFixed(1)}%`, 'pos'],
            ['Shipments in transit', `${tick.transit}`, ''],
            ['Days of cover', `${tick.cover.toFixed(1)}`, ''],
            ['Exceptions open', '4', 'warn'],
          ].map(([k, v, tone]) => (
            <div className="sx-kpi" key={k}>
              <span className="sx-kpi-k">{k}</span>
              <motion.b
                key={v}
                className="tnum"
                initial={{ opacity: 0.4, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                {v}
              </motion.b>
              {tone && <i className={tone} />}
            </div>
          ))}
        </div>
      </div>

      <aside className="sx-tower-side">
        <section className="sx-side-panel">
          <div className="sx-panel-head">
            <h5>In transit</h5>
            <span className="px-tag accent">{tick.transit}</span>
          </div>
          <div className="sx-ships">
            <AnimatePresence initial={false} mode="popLayout">
              {tick.shipments.map((s) => (
                <motion.div
                  className="sx-ship" key={s.key} layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 22, transition: { duration: 0.32, ease: EASE } }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <span className="sx-ship-ic"><Ship size={12} /></span>
                  <span className="sx-txt"><b>{s.id}</b><i>{s.lane}</i></span>
                  <span className={`px-tag ${s.tone}`}>{s.state}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="sx-side-panel">
          <div className="sx-panel-head">
            <h5>Exceptions</h5>
            <span className="px-tag warn">4 open</span>
          </div>
          <div className="sx-ex">
            {[
              [TriangleAlert, 'neg', 'Stockout risk — SKU 44192', 'Riyadh · 2 days cover'],
              [Timer, 'warn', 'ETA slipped 48 hours', 'Yantian → Jebel Ali'],
              [Package, 'warn', 'Short receipt on PO-8841', '18 of 240 cartons'],
              [TrendingUp, 'info', 'Demand spike detected', 'Jeddah · +38% WoW'],
            ].map(([Icon, tone, title, meta]) => (
              <div className="sx-ex-row" key={title}>
                <span className={`sx-ex-ic ${tone}`}><Icon size={12} /></span>
                <span className="sx-txt"><b>{title}</b><i>{meta}</i></span>
              </div>
            ))}
          </div>
        </section>

        <section className="sx-side-panel">
          <div className="sx-panel-head">
            <h5>Cover by category</h5>
            <Gauge size={13} className="sx-dim" />
          </div>
          <div className="sx-cover">
            {[['Ambient', 78, ''], ['Chilled', 41, 'warn'], ['Household', 88, ''], ['Electronics', 24, 'neg']].map(([l, v, tone], i) => (
              <div className="sx-cover-row" key={l}>
                <span>{l}</span>
                <Meter value={v} tone={tone === 'warn' ? 'warn' : tone === 'neg' ? 'neg' : 'accent'} delay={i * 0.08} />
                <b className={tone}>{v}%</b>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
};

/* =====================================================================
   STORY PANELS
   ===================================================================== */

const SensePanel = () => (
  <Chrome title="Demand signal" tags={['212 outlets']}>
    <div className="sx-pane">
      <div className="sx-panel-head">
        <h5>Sell-through, last 12 weeks</h5>
        <span className="px-tag pos">94% forecast accuracy</span>
      </div>
      <AreaChart series={[38, 46, 42, 55, 51, 64, 59, 72, 68, 80, 86, 92, 97]} forecastFrom={9} height={150} />
      <div className="sx-signal">
        {[
          ['POS terminals', '212 outlets streaming'],
          ['E-commerce', '4 channels, 1 basket view'],
          ['Field orders', 'Van sales synced offline'],
        ].map(([k, v]) => (
          <div key={k}><b>{k}</b><i>{v}</i></div>
        ))}
      </div>
    </div>
  </Chrome>
);

const PlanPanel = () => (
  <Chrome title="Replenishment plan" tags={['12-week horizon']}>
    <div className="sx-pane">
      <div className="sx-panel-head">
        <h5>Planned supply vs forecast demand</h5>
        <span className="px-tag accent">12 POs drafted</span>
      </div>
      <LiveBars values={[54, 62, 48, 71, 66, 84, 77, 92, 85, 96, 88, 99]} height={130} highlightFrom={8} />
      <div className="sx-plan-rows">
        {[
          ['SKU 44192', 'Reorder point breached', 'neg', 'Order now'],
          ['SKU 20871', '34 days of cover', 'warn', 'Overstocked'],
          ['SKU 31544', '12 days of cover', 'pos', 'Healthy'],
        ].map(([sku, meta, tone, label]) => (
          <div className="sx-plan-row" key={sku}>
            <span className="sx-txt"><b>{sku}</b><i>{meta}</i></span>
            <span className={`px-tag ${tone}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  </Chrome>
);

const ExecutePanel = () => (
  <Chrome title="Riyadh DC · floor" tags={['38 pickers']}>
    <div className="sx-pane">
      <div className="sx-panel-head">
        <h5>Live bin status</h5>
        <span className="px-tag pos">Wave 42 released</span>
      </div>
      <div className="sx-racks">
        {Array.from({ length: 64 }).map((_, i) => {
          const state = i % 13 === 0 ? 'neg' : i % 6 === 0 ? 'warn' : i % 4 === 0 ? 'idle' : 'ok';
          return (
            <motion.span
              key={i}
              className={`sx-bin ${state}`}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.006, ease: EASE }}
            />
          );
        })}
      </div>
      <div className="sx-rack-legend">
        {[['ok', 'Stocked'], ['warn', 'Low'], ['neg', 'Empty'], ['idle', 'Reserved']].map(([k, l]) => (
          <span key={k}><i className={`sx-bin ${k}`} /> {l}</span>
        ))}
      </div>
      <div className="sx-tasks">
        {[[ScanLine, 'Pick wave 42', '186 lines · 4 zones'], [ClipboardCheck, 'Cycle count due', 'Aisle C · 240 bins'], [Package, 'Putaway queue', '31 pallets']].map(([Icon, t, m]) => (
          <div className="sx-task" key={t}>
            <span className="sx-task-ic"><Icon size={12} /></span>
            <span className="sx-txt"><b>{t}</b><i>{m}</i></span>
          </div>
        ))}
      </div>
    </div>
  </Chrome>
);

const OptimisePanel = () => (
  <Chrome title="Supplier performance" tags={['Last 90 days']}>
    <div className="sx-pane">
      <div className="sx-panel-head">
        <h5>Scorecards</h5>
        <span className="px-tag accent">128 rated</span>
      </div>
      <div className="sx-score">
        {[
          ['Al Faisal Trading', 96, 'OTIF 98% · quality 94%', 'A'],
          ['Nexa Components', 88, 'OTIF 91% · quality 84%', 'B'],
          ['Gulf Packaging', 71, 'OTIF 64% · quality 79%', 'C'],
        ].map(([name, score, meta, grade], i) => (
          <motion.div
            className="sx-score-row" key={name}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
          >
            <span className={`sx-grade g-${grade}`}>{grade}</span>
            <span className="sx-txt"><b>{name}</b><i>{meta}</i></span>
            <Ring value={score} size={38} stroke={3} label={String(score)} />
          </motion.div>
        ))}
      </div>
      <div className="sx-callout">
        <Handshake size={13} /> Scores drive sourcing rules — repeat late delivery loses allocation automatically.
      </div>
    </div>
  </Chrome>
);

/* =====================================================================
   SPLIT VISUALS
   ===================================================================== */

const TraceVisual = () => (
  <Chrome title="Batch traceability" tags={['Batch · Serial']}>
    <div className="sx-pane">
      <div className="sx-trace-head">
        <span className="sx-trace-ic"><ScanLine size={14} /></span>
        <span className="sx-txt"><b>Batch B-2026-0417</b><i>Chilled dairy · 4,800 units</i></span>
        <span className="px-tag pos">Fully traced</span>
      </div>
      <div className="sx-trace">
        {[
          [Factory, 'Manufactured', 'Plant 3 · 02 Aug'],
          [Truck, 'Inbound shipment', 'Reefer held at 3°C'],
          [Warehouse, 'Received at DC', 'Riyadh · bin C-14-02'],
          [ShoppingCart, 'Dispatched', '38 outlets · 4,120 units'],
        ].map(([Icon, title, meta], i, arr) => (
          <motion.div
            className="sx-trace-step" key={title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
          >
            <span className="sx-trace-node"><Icon size={12} /></span>
            {i < arr.length - 1 && <span className="sx-trace-line" aria-hidden="true" />}
            <span className="sx-txt"><b>{title}</b><i>{meta}</i></span>
          </motion.div>
        ))}
      </div>
      <div className="sx-callout">
        <TriangleAlert size={13} /> A recall isolates 38 outlets and 680 remaining units in one query.
      </div>
    </div>
  </Chrome>
);

const VendorVisual = () => (
  <Chrome title="Vendor portal" tags={['Free for suppliers']}>
    <div className="sx-pane">
      <div className="sx-panel-head">
        <h5>Open purchase orders</h5>
        <span className="px-tag accent">Supplier view</span>
      </div>
      <div className="sx-potable">
        <div className="sx-po sx-po-head"><span>PO</span><span>Line</span><span>Qty</span><span>Confirm</span></div>
        {[
          ['PO-8841', 'Steel bracket 40mm', '2,400', 'pos', 'Confirmed'],
          ['PO-8842', 'Hex bolt M8', '18,000', 'pos', 'Confirmed'],
          ['PO-8843', 'Packaging film', '640', 'warn', 'Awaiting'],
          ['PO-8844', 'Pallet liner', '1,200', 'warn', 'Awaiting'],
        ].map(([po, line, qty, tone, label], i) => (
          <motion.div
            className="sx-po" key={po}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
          >
            <span className="px-mono sx-dim">{po}</span>
            <span>{line}</span>
            <span className="px-mono sx-num">{qty}</span>
            <span><i className={`px-tag ${tone}`}>{label}</i></span>
          </motion.div>
        ))}
      </div>
      <div className="sx-callout">
        <Check size={13} /> Suppliers confirm dates and upload invoices themselves. No licence, no chasing by email.
      </div>
    </div>
  </Chrome>
);

/* =====================================================================
   SECTION 6 — showcase deck
   ===================================================================== */

const DECK = [
  { key: 'inv', label: 'Inventory', panel: <PlanPanel /> },
  { key: 'wh', label: 'Warehouse', panel: <ExecutePanel /> },
  { key: 'sup', label: 'Suppliers', panel: <OptimisePanel /> },
  { key: 'trace', label: 'Traceability', panel: <TraceVisual /> },
];

const ShowcaseDeck = () => {
  const [active, setActive] = useState(0);
  return (
    <div className="sx-deck">
      <div className="sx-deck-tabs" role="tablist">
        {DECK.map((s, i) => (
          <button
            key={s.key} role="tab" aria-selected={active === i}
            className={active === i ? 'on' : ''}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {s.label}
            {active === i && (
              <motion.span className="sx-deck-underline" layoutId="sx-deck-underline" transition={{ duration: 0.45, ease: EASE }} />
            )}
          </button>
        ))}
      </div>
      <div className="sx-deck-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={DECK[active].key}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {DECK[active].panel}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* =====================================================================
   SECTION 7 — order-to-delivery pipeline (distinct from Finance's hub)
   ===================================================================== */

const PIPELINE = [
  { icon: TrendingUp, label: 'Demand', meta: 'POS · e-commerce · field' },
  { icon: ClipboardCheck, label: 'Procure', meta: 'Requisition → PO' },
  { icon: Factory, label: 'Produce', meta: 'BOM · work orders' },
  { icon: Warehouse, label: 'Store', meta: 'Putaway · pick · pack' },
  { icon: Ship, label: 'Ship', meta: 'Carrier feeds · ETA' },
  { icon: ShoppingCart, label: 'Deliver', meta: 'POD on the driver app' },
];

const Pipeline = () => (
  <div className="sx-pipe">
    {PIPELINE.map(({ icon: Icon, label, meta }, i) => (
      <motion.div
        className="sx-pipe-node"
        key={label}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      >
        <span className="sx-pipe-ic"><Icon size={16} strokeWidth={1.7} /></span>
        <b>{label}</b>
        <i>{meta}</i>
      </motion.div>
    ))}

    {/* one pulse travels the full pipeline rather than a connector per gap,
        so the grid stays six columns of equal weight */}
    <motion.span
      className="sx-pipe-flow"
      aria-hidden="true"
      initial={{ left: '-12%' }}
      animate={{ left: '104%' }}
      transition={{ duration: 5.2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
    />
  </div>
);

/* ===================================================================== */
const SupplyChain = () => (
  <ProductPage
    accent="#2563eb"
    accent2="#1d4ed8"
    wash="rgba(37,99,235,0.09)"
    className="sx"
  >
    <SubNav
      icon={Truck}
      name="Emvive Supply Chain"
      links={[
        { href: '#story', label: 'How it works' },
        { href: '#capabilities', label: 'Capabilities' },
        { href: '#outcomes', label: 'Outcomes' },
        { href: '#showcase', label: 'Product' },
      ]}
    />

    <Hero
      eyebrow="New"
      note="The control tower now ships with live carrier tracking"
      title="Every unit, every lane, every location —"
      accentWord="in one view."
      lede="Procurement, inventory, warehousing and logistics on one network. Stockouts get predicted, not reported."
      primary="Book a demo"
      secondary="See how it works"
      trustedBy="In production today"
      meta={[
        { value: '99.1%', label: 'Order fill rate across the network' },
        { value: '−34%', label: 'Excess and dead stock removed' },
        { value: '9', label: 'Distribution centres on one ledger' },
      ]}
    >
      <Chrome title="app.emvive.com/supply-chain" tags={['Gulf network']} live>
        <ControlTower />
      </Chrome>
    </Hero>

    {/* ---- 02 · story ---- */}
    <section className="px-band-sm">
      <div className="px-shell">
        <SectionHead
          index="02"
          label="Product story"
          title="Sense. Plan. Execute. Optimise."
          lede="One loop, running continuously. Scroll to follow a single SKU from the shelf that sold it back to the supplier who makes it."
        />
      </div>
    </section>

    <Story
      steps={[
        {
          title: 'Sense what the network actually did',
          desc: 'Point of sale, e-commerce, van sales and warehouse movements stream in as they happen. The network reports its own position instead of being surveyed once a week.',
          panel: <SensePanel />,
        },
        {
          title: 'Plan supply against real demand',
          desc: 'Forecasts blend history, promotions and seasonality into a rolling twelve-week plan. Reorder points move with lead time and supplier reliability rather than sitting in a spreadsheet.',
          panel: <PlanPanel />,
        },
        {
          title: 'Execute on the floor and on the road',
          desc: 'Directed putaway and wave picking route the team by the shortest path. Every scan updates stock instantly, and carrier feeds keep each shipment tracked to the door.',
          panel: <ExecutePanel />,
        },
        {
          title: 'Optimise what you buy next',
          desc: 'Every receipt is scored against the promised date, quantity and quality. Performance stops being an argument at renewal and becomes a number that shapes allocation.',
          panel: <OptimisePanel />,
        },
      ]}
    />

    {/* ---- 03 · capabilities ---- */}
    <section className="px-band" id="capabilities">
      <div className="px-shell">
        <SectionHead
          index="03"
          label="Capabilities"
          title="One item master. One stock ledger. One supplier record."
          lede="Warehouses, stores, vans and in-transit stock are locations in the same system, so nothing has to be reconciled between them."
        />
        <div style={{ marginTop: '4.5rem' }}>
          <HairGrid
            items={[
              { icon: ClipboardCheck, title: 'Procurement', desc: 'Requisition to purchase order, with quotes compared side by side and approvals by value.' },
              { icon: Boxes, title: 'Inventory', desc: 'Batch, serial, expiry and multi-UOM across every location in a single ledger.' },
              { icon: Warehouse, title: 'Warehouse operations', desc: 'Directed putaway, wave picking, packing and continuous cycle counting on mobile.' },
              { icon: TrendingUp, title: 'Demand planning', desc: 'Statistical forecasts blended with promotions, then turned into live reorder points.' },
              { icon: Truck, title: 'Logistics', desc: 'Load planning, route assignment and shipment tracking with proof of delivery.' },
              { icon: Handshake, title: 'Vendor portal', desc: 'Suppliers acknowledge orders, confirm dispatch and upload invoices themselves.' },
              { icon: Factory, title: 'Production', desc: 'Multi-level bills of material and shop-floor consumption on the same stock ledger.' },
              { icon: ScanLine, title: 'Traceability', desc: 'Forward and backward trace on any batch or serial, from supplier to customer.' },
              { icon: Layers, title: 'Multi-channel', desc: 'Stores, marketplaces and B2B orders drawing on one pool of available stock.' },
            ]}
          />
        </div>
      </div>
    </section>

    {/* ---- 04 · depth ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <Split
          eyebrow="Traceability"
          title="Trace any batch in seconds, not days."
          body="Batch and serial data is captured at every movement, so the chain from plant to outlet is already recorded by the time somebody asks for it."
          points={[
            'Forward and backward trace on batch or serial number',
            'FEFO picking enforced for expiry-managed stock',
            'Quarantine and recall isolated to the affected units',
            'Cold-chain and condition data held against the batch',
          ]}
          link="Explore traceability"
        >
          <TraceVisual />
        </Split>

        <Split
          flip
          eyebrow="Suppliers"
          title="Hold suppliers to the dates they promised."
          body="Give your vendors a free, restricted login and the acknowledgement chase disappears. What they confirm becomes the date your plan runs on."
          points={[
            'On-time in-full scoring per supplier and category',
            'Quality rejections and short receipts tracked to source',
            'Sourcing rules that shift volume to reliable suppliers',
            'Invoices submitted by the supplier, matched on arrival',
          ]}
          link="See supplier management"
        >
          <VendorVisual />
        </Split>
      </div>
    </section>

    {/* ---- 05 · outcomes ---- */}
    <section className="px-band" id="outcomes">
      <div className="px-shell">
        <SectionHead
          index="05"
          label="Enterprise outcomes"
          title="What operations teams get back."
          lede="Measured across retail, distribution and manufacturing networks in their first year on the platform."
        />
        <div style={{ marginTop: '4.5rem' }}>
          <StatRow
            stats={[
              { value: 99.1, decimals: 1, suffix: '%', label: 'Order fill rate across the network' },
              { value: 34, prefix: '−', suffix: '%', label: 'Reduction in excess and dead stock' },
              { value: 4.2, decimals: 1, suffix: '×', label: 'Faster stock counts with mobile scanning' },
              { value: 21, suffix: '%', label: 'Less shrinkage after the first year' },
            ]}
          />
        </div>

        <div className="sx-compare">
          <Reveal className="sx-compare-col">
            <span className="px-eyebrow">Before</span>
            <ul>
              {['Weekly stock reports, already out of date', 'Stockouts discovered by a phone call from a store', 'Reorder points last reviewed eighteen months ago', 'Supplier performance argued at renewal', 'Counts that shut the site for a weekend'].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="sx-compare-col on" delay={0.12}>
            <span className="px-eyebrow">On Emvive</span>
            <ul>
              {['Position visible the moment a unit moves', 'Purchase orders raised before cover runs out', 'Reorder points recalculated nightly', 'Allocation shifted by measured OTIF', 'Continuous cycle counting, no shutdown'].map((t) => (
                <li key={t}><Check size={14} strokeWidth={2.5} /> {t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>

    {/* ---- 06 · showcase ---- */}
    <section className="px-band px-band-alt" id="showcase">
      <div className="px-shell">
        <SectionHead
          index="06"
          label="Inside the product"
          title="The surfaces your network runs on."
          lede="Hover to move between them. Each one is reading the same stock ledger."
        />
        <div style={{ marginTop: '4rem' }}><ShowcaseDeck /></div>
      </div>
    </section>

    {/* ---- 07 · pipeline ---- */}
    <section className="px-band">
      <div className="px-shell">
        <SectionHead
          index="07"
          label="Order to delivery"
          title="Six stages. One record."
          lede="Data does not stop at a module boundary, because there are no module boundaries to stop at."
        />
        <Reveal delay={0.1} y={24} style={{ marginTop: '4rem' }}><Pipeline /></Reveal>
      </div>
    </section>

    {/* ---- 08 · customer success ---- */}
    <section className="px-band px-band-alt">
      <div className="px-shell">
        <div className="sx-case">
          <div>
            <Reveal><span className="px-eyebrow"><i className="idx">08</i> Customer success</span></Reveal>
            <MaskText
              text="We used to find out about a stockout when a store manager called. The system now raises the order two weeks before the shelf would have gone empty."
              as="blockquote"
              className="sx-quote"
            />
            <Reveal delay={0.2}>
              <div className="sx-quote-by">
                <span className="sx-quote-avatar">OS</span>
                <span className="sx-txt">
                  <b>Omar Siddiqui</b>
                  <i>Head of Supply Chain, Nesto Group</i>
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <a href="#start" className="px-link" style={{ marginTop: '2.25rem' }}>
                Read the case study <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>

          <Stagger className="sx-case-metrics" gap={0.1}>
            {[['−34%', 'Excess stock removed'], ['+2.8pp', 'On-shelf availability'], ['212', 'Outlets on one network'], ['4.2×', 'Faster stock counts']].map(([v, l]) => (
              <StaggerItem className="sx-case-metric" key={l}>
                <b>{v}</b><span>{l}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>

    <ClosingCta
      label="Emvive Supply Chain"
      title="See your own network on Emvive."
      lede="Share one month of stock movements. We will show you where the working capital is trapped and what the system would have ordered instead."
      primary="Book a demo"
      secondary="Talk to sales"
    />

    <Footer />
  </ProductPage>
);

export default SupplyChain;
