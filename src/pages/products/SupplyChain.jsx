import React, { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import {
  Truck, Warehouse, Factory, Package, TriangleAlert, Timer,
  Thermometer, ClipboardCheck, Boxes, ScanLine, ArrowRight, ArrowUpRight,
  Handshake, Navigation, CircleCheckBig,
} from 'lucide-react';
import { motion, Reveal, MaskText, useLive, EASE } from './motion';
import { ProductPage, SubNav, ClosingCta, Footer } from './system';
import {
  OpsMap, Ticker, ShipmentBoard, AlertStack, CounterTile, WarehouseHeat,
  PoPanel, ProductionLine, RoutePanel, PodPanel, NetworkGraph, FleetGantt, OpsBoard,
} from './SupplyOps';
import './SupplyOps.css';
import './SupplyChain.css';

/* =====================================================================
   LIVE NETWORK STATE
   ===================================================================== */

const SHIP_POOL = [
  { code: 'SHP-20418', lane: 'Yantian → Jebel Ali', vessel: 'MSC Layla', eta: '14 Aug', tone: 'warn', state: '+48h' },
  { code: 'SHP-20419', lane: 'Singapore → Dammam', vessel: 'Ever Given', eta: '11 Aug', tone: 'ok', state: 'On time' },
  { code: 'SHP-20420', lane: 'Rotterdam → Jeddah', vessel: 'Maersk Kul', eta: '19 Aug', tone: 'ok', state: 'On time' },
  { code: 'SHP-20421', lane: 'Mumbai → Riyadh', vessel: 'Air · EK 908', eta: '09 Aug', tone: 'info', state: 'Customs' },
  { code: 'SHP-20422', lane: 'Jebel Ali → Dammam', vessel: 'Road · TRK-208', eta: '08 Aug', tone: 'ok', state: 'Inland' },
  { code: 'SHP-20423', lane: 'Shanghai → Jeddah', vessel: 'COSCO Pride', eta: '23 Aug', tone: 'warn', state: 'Rebooked' },
];

const ALERT_POOL = [
  { icon: TriangleAlert, tone: 'bad', title: 'Stockout risk · SKU 44192', meta: 'Riyadh DC · 2 days cover', age: '4m' },
  { icon: Timer, tone: 'warn', title: 'ETA slipped 48 hours', meta: 'Yantian → Jebel Ali', age: '12m' },
  { icon: Package, tone: 'warn', title: 'Short receipt on PO-8841', meta: '18 of 240 cartons', age: '26m' },
  { icon: Thermometer, tone: 'bad', title: 'Reefer above range', meta: 'REF-042 · 6.4°C', age: '31m' },
  { icon: Boxes, tone: 'info', title: 'Demand spike detected', meta: 'Jeddah · +38% WoW', age: '48m' },
];

const TICKER_ITEMS = [
  { tone: 'ok', code: 'SHP-20419', text: 'berthed at Dammam', meta: '08:14' },
  { tone: 'warn', code: 'REF-042', text: 'temperature excursion cleared', meta: '08:02' },
  { tone: 'ok', code: 'PO-8842', text: 'acknowledged by Nexa Components', meta: '07:51' },
  { tone: 'info', code: 'WO-4414', text: 'production run complete · 12,400 units', meta: '07:44' },
  { tone: 'ok', code: 'TRK-114', text: 'delivered · Qassim · signed', meta: '07:30' },
  { tone: 'bad', code: 'SKU-44192', text: 'reorder point breached · PO drafted', meta: '07:18' },
  { tone: 'ok', code: 'DC-RUH', text: 'cycle count closed · variance 0.02%', meta: '06:55' },
];

const mk = (pool) => (i) => ({ ...pool[i % pool.length], id: i });
const mkShip = mk(SHIP_POOL);
const mkAlert = mk(ALERT_POOL);

/* =====================================================================
   ACT I — THE COMMAND ROOM
   Full-bleed map. Copy sits over it. Operational windows float at
   different depths. Nothing is in a two-column split.
   ===================================================================== */

const CommandRoom = () => {
  const [live, ref] = useLive(
    {
      n: 0, transit: 342, otif: 96.4, cover: 18.4, throughput: 1284,
      ships: [0, 1, 2, 3, 4].map(mkShip),
      alerts: [0, 1, 2, 3].map(mkAlert),
    },
    (s) => {
      const n = s.n + 1;
      const w = Math.sin(n * 1.1) * 0.6 + Math.sin(n * 0.63) * 0.4;
      return {
        n,
        transit: Math.round(342 + w * 11),
        otif: 96.4 + w * 0.5,
        cover: 18.4 + w * 0.6,
        throughput: Math.round(1284 + w * 64),
        ships: [...s.ships.slice(1), mkShip(s.ships[s.ships.length - 1].id + 1)],
        alerts: [mkAlert(s.alerts[0].id + 1), ...s.alerts.slice(0, 3)],
      };
    },
    3400
  );

  return (
    <section className="sc-room" id="top" ref={ref}>
      <div className="sc-room-map"><OpsMap /></div>
      <div className="sc-room-scrim" aria-hidden="true" />
      <div className="sc-room-scan" aria-hidden="true" />

      <div className="sc-room-ticker"><Ticker items={TICKER_ITEMS} /></div>

      {/* headline sits over the map, bottom-left */}
      <div className="sc-room-copy">
        <Reveal duration={0.7}>
          <span className="sc-eyebrow">
            <i className="sc-eyebrow-dot" /> Emvive Supply Chain
            <em>· 42 lanes · 9 DCs · 212 outlets</em>
          </span>
        </Reveal>
        <MaskText text="The command centre for" as="h1" className="sc-display" delay={0.06} />
        <MaskText text="everything you" accent="move." as="h1" className="sc-display" delay={0.14} />
        <Reveal delay={0.4} y={16}>
          <p className="sc-lede">
            Suppliers, factories, warehouses and fleets on one live network.
            You see the disruption before it reaches the shelf.
          </p>
        </Reveal>
        <Reveal delay={0.5} y={16}>
          <div className="sc-actions">
            <a href="#start" className="px-btn px-btn-solid">Book a demo <ArrowRight size={16} /></a>
            <a href="#journey" className="px-btn px-btn-quiet">Follow a shipment</a>
          </div>
        </Reveal>
      </div>

      {/* floating operational windows at different depths */}
      <motion.div
        className="sc-win sc-win-ships"
        initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
      >
        <ShipmentBoard rows={live.ships} />
      </motion.div>

      <motion.div
        className="sc-win sc-win-alerts"
        initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.72, ease: EASE }}
      >
        <AlertStack alerts={live.alerts} />
      </motion.div>

      <motion.div
        className="sc-win sc-win-tiles"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
      >
        <CounterTile label="In transit" value={live.transit} unit="" delta="▲ 11" bars={[40, 62, 48, 71, 55, 82]} />
        <CounterTile label="OTIF" value={live.otif.toFixed(1)} unit="%" delta="▲ 0.5" bars={[62, 68, 71, 74, 78, 82]} />
        <CounterTile label="Days cover" value={live.cover.toFixed(1)} unit="d" delta="▲ 0.6" bars={[52, 48, 55, 61, 58, 64]} />
        <CounterTile label="Units / hr" value={live.throughput} unit="" delta="▲ 64" bars={[44, 58, 52, 66, 74, 88]} />
      </motion.div>
    </section>
  );
};

/* =====================================================================
   ACT II — THE JOURNEY
   A scroll-linked rail. A token travels down the centre; each stage
   arrives from an alternating side as the token reaches it. This is a
   timeline, not a pinned canvas.
   ===================================================================== */

const STAGES = [
  {
    key: 'supplier', n: '01', icon: Handshake, title: 'Supplier',
    body: 'Scorecards decide who gets the volume. On-time-in-full, quality rejections and acknowledgement speed feed sourcing rules directly.',
    stat: ['128 suppliers rated', 'OTIF 96.4%'],
    panel: <NetworkGraph />,
    tall: true,
  },
  {
    key: 'po', n: '02', icon: ClipboardCheck, title: 'Purchase order',
    body: 'Reorder points recalculate nightly against demand, lead time and supplier reliability. Twelve of today’s orders drafted themselves.',
    stat: ['142 open orders', '12 auto-raised'],
    panel: <PoPanel />,
  },
  {
    key: 'make', n: '03', icon: Factory, title: 'Manufacturing',
    body: 'Work orders consume from the same stock ledger they replenish. Shop-floor progress is a live number, not a shift report.',
    stat: ['OEE 87.4%', '1,284 units/hr'],
    panel: <ProductionLine />,
  },
  {
    key: 'store', n: '04', icon: Warehouse, title: 'Warehouse',
    body: 'Directed putaway and wave picking route the team by the shortest path. Every scan moves the ledger the instant it happens.',
    stat: ['9 distribution centres', '38 pickers active'],
    panel: null,
    heat: true,
  },
  {
    key: 'move', n: '05', icon: Navigation, title: 'Distribution',
    body: 'Loads are planned, routes optimised and every vehicle tracked. When an ETA slips the replenishment plan reschedules itself.',
    stat: ['218 km planned', '−32 km saved'],
    panel: <RoutePanel />,
  },
  {
    key: 'deliver', n: '06', icon: CircleCheckBig, title: 'Customer',
    body: 'Proof of delivery, temperature history and signature captured on the driver app, posted against the order before the van leaves.',
    stat: ['99.1% fill rate', '08:42 · on time'],
    panel: <PodPanel />,
  },
];

const Journey = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.72', 'end 0.85'] });
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="sc-journey" id="journey" ref={ref}>
      <div className="sc-journey-head">
        <Reveal><span className="sc-eyebrow"><i className="sc-eyebrow-dot" /> The journey</span></Reveal>
        <MaskText text="Follow one unit from the" as="h2" className="sc-h2" />
        <MaskText text="supplier to the" accent="shelf." as="h2" className="sc-h2" />
      </div>

      <div className="sc-rail-wrap">
        <div className="sc-rail" aria-hidden="true">
          <motion.i className="sc-rail-fill" style={{ height: fill }} />
          <motion.span className="sc-rail-token" style={{ top: fill }}>
            <Package size={12} />
          </motion.span>
        </div>

        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const right = i % 2 === 0;
          return (
            <div className={`sc-stage ${right ? 'r' : 'l'} ${s.tall ? 'tall' : ''}`} key={s.key}>
              <motion.div
                className="sc-stage-copy"
                initial={{ opacity: 0, x: right ? -34 : 34 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <span className="sc-stage-n">{s.n}</span>
                <span className="sc-stage-ic"><Icon size={17} strokeWidth={1.7} /></span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="sc-stage-stats">
                  {s.stat.map((t) => <span key={t}>{t}</span>)}
                </div>
              </motion.div>

              <motion.div
                className="sc-stage-panel"
                initial={{ opacity: 0, x: right ? 40 : -40, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                transition={{ duration: 1, delay: 0.1, ease: EASE }}
              >
                {s.heat ? (
                  <div className="sc-heatwin">
                    <div className="sc-heatwin-bar">
                      <ScanLine size={12} />
                      <b>Riyadh DC · live pick density</b>
                      <span className="op-live"><i />ACTIVE</span>
                    </div>
                    <div className="sc-heatwin-body"><WarehouseHeat /></div>
                    <div className="sc-heatwin-legend">
                      <span><i className="lo" /> Low</span>
                      <span><i className="hi" /> High</span>
                      <span><i className="em" /> Empty bin</span>
                      <em>312 bins · 26 bays · 12 aisles</em>
                    </div>
                  </div>
                ) : s.panel}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* =====================================================================
   ACT III — FLEET
   ===================================================================== */

const Fleet = () => (
  <section className="sc-fleet">
    <div className="sc-fleet-inner">
      <div className="sc-fleet-head">
        <div>
          <Reveal><span className="sc-eyebrow"><i className="sc-eyebrow-dot" /> Fleet &amp; dispatch</span></Reveal>
          <MaskText text="Twenty-four hours of movement." as="h2" className="sc-h2" />
        </div>
        <Reveal delay={0.14}>
          <p className="sc-fleet-p">
            Every vehicle, every window, every exception on one board. Delays
            surface as they happen rather than at the end of the shift.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} y={26}><FleetGantt /></Reveal>
    </div>
  </section>
);

/* =====================================================================
   ACT IV — OPERATIONS BOARD
   ===================================================================== */

const Board = () => (
  <section className="sc-board" id="outcomes">
    <div className="sc-board-inner">
      <div className="sc-board-head">
        <Reveal><span className="sc-eyebrow"><i className="sc-eyebrow-dot" /> Measured in production</span></Reveal>
        <MaskText text="What a live network returns." as="h2" className="sc-h2" />
      </div>

      <OpsBoard
        rows={[
          { key: 'FILL', value: '99.1%', label: 'Order fill rate across the network', trend: '▲ 2.8pp', tone: 'ok' },
          { key: 'STOCK', value: '−34%', label: 'Excess and dead stock removed', trend: '▼ 34%', tone: 'ok' },
          { key: 'COUNT', value: '4.2×', label: 'Faster counts with mobile scanning', trend: '▲ 4.2×', tone: 'ok' },
          { key: 'SHRINK', value: '−21%', label: 'Less shrinkage after the first year', trend: '▼ 21%', tone: 'ok' },
        ]}
      />

      <div className="sc-board-quote">
        <MaskText
          text="We used to find out about a stockout when a store manager called. The system now raises the order two weeks earlier."
          as="blockquote"
          className="sc-quote"
        />
        <Reveal delay={0.18}>
          <div className="sc-board-by">
            <span className="sc-avatar">OS</span>
            <span className="op-txt">
              <b>Omar Siddiqui</b>
              <i>Head of Supply Chain, Nesto Group</i>
            </span>
            <a href="#start" className="px-link sc-case">Read the case study <ArrowUpRight size={15} /></a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ===================================================================== */
const SupplyChain = () => (
  <ProductPage accent="#22b8cf" accent2="#0e9fb8" wash="rgba(34,184,207,0.1)" className="sc">
    <SubNav
      icon={Truck}
      name="Emvive Supply Chain"
      links={[
        { href: '#journey', label: 'The journey' },
        { href: '#outcomes', label: 'Outcomes' },
      ]}
    />

    <CommandRoom />
    <Journey />
    <Fleet />
    <Board />

    <ClosingCta
      label="Emvive Supply Chain"
      title="Put your network on one screen."
      lede="Share a month of stock movements. We will show you where the working capital is trapped and what the system would have ordered instead."
      primary="Book a demo"
      secondary="Talk to sales"
    />

    <Footer />
  </ProductPage>
);

export default SupplyChain;
