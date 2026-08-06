import React, { useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Truck, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, MaskText, Reveal, EASE } from './motion';
import { ProductPage, SubNav, Footer } from './system';
import {
  SceneOrigin, SceneSupplier, ScenePurchase, SceneFactory,
  SceneWarehouse, SceneShipping, SceneRetail, SceneCustomer,
} from './JourneyScenes';
import './SupplyChain.css';

/* =====================================================================
   EMVIVE SUPPLY CHAIN — THE TRANSIT
   The page is not a set of sections. It is one continuous journey that
   a single consignment makes, and you ride along with it. There is no
   hero, no feature grid, no stats band, no testimonial block. The
   journey is the landing page.
   ===================================================================== */

const STAGES = [
  {
    id: 'ORIGIN',
    scene: SceneOrigin,
    title: 'Every unit has a journey.',
    accent: 'Most companies only see the end of it.',
    line: 'Follow one consignment of chilled dairy from a supplier contract to a customer receipt — the whole way, without leaving the system.',
    hud: { where: 'Riyadh · Plant 3', temp: '—', status: 'Not yet raised', clock: 'T−06d 04h' },
    cta: true,
  },
  {
    id: 'SUPPLIER',
    scene: SceneSupplier,
    title: 'It starts with a promise.',
    line: 'Six suppliers can make it. One has held 98% on-time-in-full for eleven months, so the volume goes to them automatically.',
    hud: { where: 'Al Faisal Dairy', temp: '—', status: 'Sourcing rule applied', clock: 'T−06d 02h' },
    facts: [['Suppliers rated', '128'], ['Selected OTIF', '98.2%'], ['Allocation', 'Automatic']],
  },
  {
    id: 'PURCHASE',
    scene: ScenePurchase,
    title: 'The order writes itself.',
    line: 'Cover fell below the reorder point at 02:14. Nobody was awake. The order was drafted, priced, approved and acknowledged before the shift started.',
    hud: { where: 'PO-8841', temp: '—', status: 'Acknowledged', clock: 'T−05d 22h' },
    facts: [['Raised', '02:14 automatically'], ['Acknowledged', '02:19'], ['Value', 'SAR 13,372']],
  },
  {
    id: 'FACTORY',
    scene: SceneFactory,
    title: 'Made, measured, logged.',
    line: 'Work orders consume from the same ledger they replenish. Every unit that comes off the line exists in stock the instant it is counted.',
    hud: { where: 'Plant 3 · Line A', temp: '4.0°C', status: 'Running', clock: 'T−04d 09h' },
    facts: [['Batch', 'B-2026-0417'], ['Units produced', '4,800'], ['OEE', '87.4%']],
  },
  {
    id: 'WAREHOUSE',
    scene: SceneWarehouse,
    title: 'Received, binned, picked.',
    line: 'Directed putaway chooses the bin. FEFO chooses the pallet. The picker walks the shortest path the system can find, and every scan moves the ledger.',
    hud: { where: 'Riyadh DC · C-14-02', temp: '3.2°C', status: 'Putaway confirmed', clock: 'T−02d 16h' },
    facts: [['Bins', '312 scanned'], ['Pick path', '−31% walking'], ['Variance', '0.02%']],
  },
  {
    id: 'TRANSIT',
    scene: SceneShipping,
    title: 'Tracked to the metre.',
    line: 'Reefer temperature, seal integrity and position stream back the whole way. If the ETA slips, the replenishment plan behind it reschedules itself.',
    hud: { where: 'Route 40 · en route', temp: '3.1°C', status: 'In transit', clock: 'T−06h 12m' },
    facts: [['Distance', '214 km'], ['Seal', 'SL-99184 intact'], ['Excursions', 'None']],
  },
  {
    id: 'RETAIL',
    scene: SceneRetail,
    title: 'On the shelf, on time.',
    line: 'Six facings on shelf two, replenished across thirty-eight outlets before the store opened. Availability is a number, not an assumption.',
    hud: { where: 'Landmark · Olaya', temp: '3.4°C', status: 'On shelf', clock: 'T−00h 09m' },
    facts: [['Outlets', '38 replenished'], ['On-shelf', '99.1%'], ['Delivered', '08:42']],
  },
  {
    id: 'CUSTOMER',
    scene: SceneCustomer,
    title: 'Sold — and the loop closes.',
    line: 'The sale is tomorrow’s demand signal. Sell-through recalculates the reorder point, and the next order is already drafting.',
    hud: { where: 'Till 04 · 08:51', temp: '—', status: 'Sold', clock: 'T+00h 00m' },
    facts: [['Sell-through', '+38% WoW'], ['Next PO', 'Drafts in 4h'], ['Cycle', 'Closed']],
    end: true,
  },
];

/* ---------------------------------------------------------------
   The transit — one pinned viewport, eight worlds
   --------------------------------------------------------------- */
const Transit = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [stage, setStage] = useState(0);
  const [local, setLocal] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const raw = v * STAGES.length;
    const next = Math.min(STAGES.length - 1, Math.max(0, Math.floor(raw * 0.999)));
    setStage((c) => (c === next ? c : next));
    setLocal(Math.min(1, Math.max(0, raw - next)));
  });

  const current = STAGES[stage];
  const railFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      className="tr" id="transit" ref={ref}
      style={{ height: `${STAGES.length * 100}vh` }}
    >
      <div className="tr-view">
        {/* --- the worlds --- */}
        <div className="tr-stage">
          {STAGES.map((s, i) => {
            const Scene = s.scene;
            return (
              <motion.div
                className="tr-world"
                key={s.id}
                initial={false}
                animate={{ opacity: stage === i ? 1 : 0, scale: stage === i ? 1 : 1.04 }}
                transition={{ duration: 0.9, ease: EASE }}
                style={{ pointerEvents: stage === i ? 'auto' : 'none' }}
                aria-hidden={stage !== i}
              >
                <Scene active={stage === i} progress={local} />
              </motion.div>
            );
          })}
          <div className="tr-vignette" aria-hidden="true" />
        </div>

        {/* --- consignment HUD, top --- */}
        <div className="tr-hud">
          <div className="tr-hud-id">
            <span className="tr-hud-dot" />
            <b>B-2026-0417</b>
            <em>Chilled dairy · 4,800 units</em>
          </div>
          <div className="tr-hud-tel">
            {[['LOCATION', current.hud.where], ['TEMP', current.hud.temp], ['STATUS', current.hud.status], ['CLOCK', current.hud.clock]].map(([k, v]) => (
              <div key={k}>
                <span>{k}</span>
                <motion.b key={v} initial={{ opacity: 0.3, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  {v}
                </motion.b>
              </div>
            ))}
          </div>
        </div>

        {/* --- narration, bottom-left, over the world --- */}
        <div className="tr-copy">
          <motion.span
            className="tr-stage-id"
            key={`k${current.id}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <i>{String(stage).padStart(2, '0')}</i> {current.id}
          </motion.span>

          <motion.h2
            key={`t${current.id}`}
            className={stage === 0 ? 'tr-title lead' : 'tr-title'}
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {current.title}
            {current.accent && <em>{current.accent}</em>}
          </motion.h2>

          <motion.p
            key={`l${current.id}`}
            className="tr-line"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {current.line}
          </motion.p>

          {current.facts && (
            <motion.div
              className="tr-facts"
              key={`f${current.id}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            >
              {current.facts.map(([k, v]) => (
                <div key={k}><span>{k}</span><b>{v}</b></div>
              ))}
            </motion.div>
          )}

          {current.cta && (
            <motion.div
              className="tr-cta"
              key="cta"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
            >
              <a href="#arrive" className="px-btn px-btn-solid">Ride the journey <ArrowRight size={16} /></a>
              <span className="tr-scroll">Scroll to depart</span>
            </motion.div>
          )}
        </div>

        {/* --- the transit rail, bottom --- */}
        <div className="tr-rail">
          <div className="tr-rail-line">
            <motion.i style={{ width: railFill }} />
          </div>
          <div className="tr-rail-stops">
            {STAGES.map((s, i) => (
              <span className={`tr-stop ${i === stage ? 'on' : ''} ${i < stage ? 'past' : ''}`} key={s.id}>
                <i />
                <em>{s.id}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   Arrival — the only non-journey moment on the page
   --------------------------------------------------------------- */
const Arrival = () => (
  <section className="tr-arrive" id="arrive">
    <div className="tr-arrive-inner">
      <Reveal>
        <span className="tr-arrive-k">End of transit · 6 days 4 hours</span>
      </Reveal>
      <MaskText text="You just watched one unit." as="h2" className="tr-arrive-h" />
      <MaskText text="Emvive watches" accent="all of them." as="h2" className="tr-arrive-h" />

      <Reveal delay={0.2} y={16}>
        <p>
          Forty-two lanes, nine distribution centres, two hundred and twelve outlets —
          every consignment carrying the same record, from the contract that bought it
          to the till that sold it.
        </p>
      </Reveal>

      <Reveal delay={0.3} y={16}>
        <div className="tr-arrive-cta">
          <a href="#arrive" className="px-btn px-btn-solid">Book a demo <ArrowRight size={16} /></a>
          <a href="#transit" className="px-btn px-btn-quiet">Ride it again</a>
        </div>
      </Reveal>

      <Reveal delay={0.4} y={16}>
        <div className="tr-arrive-quote">
          <blockquote>
            “We used to find out about a stockout when a store manager called.
            The system now raises the order two weeks earlier.”
          </blockquote>
          <div className="tr-arrive-by">
            <span>OS</span>
            <div>
              <b>Omar Siddiqui</b>
              <em>Head of Supply Chain, Nesto Group</em>
            </div>
            <a href="#arrive" className="px-link">Case study <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ===================================================================== */
const SupplyChain = () => (
  <ProductPage accent="#28c8e0" accent2="#4ad9ee" wash="rgba(40,200,224,0.12)" className="sc">
    <SubNav
      icon={Truck}
      name="Emvive Supply Chain"
      links={[{ href: '#transit', label: 'The transit' }, { href: '#arrive', label: 'Arrival' }]}
      cta="Book demo"
    />
    <Transit />
    <Arrival />
    <Footer />
  </ProductPage>
);

export default SupplyChain;
