import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import {
  ArrowUpRight, Check, TriangleAlert, ScanLine, Repeat, Sparkles, Table2,
} from 'lucide-react';
import { motion, EASE, useInView } from '../shared/motion';
import { Rail, Ticker } from './SupplyUI';
import './SupplySuccess.css';

/* =====================================================================
   CUSTOMER SUCCESS — a transformation, not a testimonial

   One adapted primitive carries it:

     · Rail (Aceternity UI's Timeline) — a scroll-filled spine that
       walks the reader through the five states of the rollout, with
       every number counting up as its stage arrives.

   There is one quote on the whole section and it sits at the end, after
   the evidence, where a quote belongs.
   ===================================================================== */

const STAGES = [
  {
    k: 'before', tag: 'Before', icon: Table2,
    title: 'A weekly spreadsheet and a phone call.',
    body: 'Stock was counted twice a year and reconciled in a workbook that four people edited. Nobody found a stockout until a store manager rang the buying office about it.',
    stats: [['Inventory visibility', 42, '%'], ['Stock counts', 2, ' / year'], ['Dead stock', 18.4, '%']],
    panel: 'sheet',
  },
  {
    k: 'build', tag: 'Implementation', icon: ScanLine,
    title: 'Eleven weeks, nine sites, one ledger.',
    body: 'Sites went live one region at a time. Bins were mapped and scanned in place rather than re-racked, so no distribution centre closed for a single shift during the migration.',
    stats: [['Sites migrated', 9, ''], ['SKUs loaded', 41200, ''], ['Operating downtime', 0, ' h']],
    panel: 'rollout',
  },
  {
    k: 'auto', tag: 'Automation', icon: Repeat,
    title: 'Reorder points that rewrite themselves.',
    body: 'Every night the system re-reads demand, supplier lead times and delivered variance, then moves the reorder point. Buyers approve exceptions instead of raising routine orders.',
    stats: [['Replenishment automated', 94, '%'], ['Manual purchase orders', -71, '%'], ['Counting', 100, '% continuous']],
    panel: 'rule',
  },
  {
    k: 'ops', tag: 'Operational improvement', icon: TriangleAlert,
    title: 'Exceptions surface before anyone calls.',
    body: 'Shortages, temperature excursions and unacknowledged orders arrive as work, routed to whoever owns them. The buying office stopped running reports to find problems.',
    stats: [['Stockouts seen ahead', 14, ' d'], ['Pick accuracy', 99.98, '%'], ['Lines per hour', 38, '% faster']],
    panel: 'feed',
  },
  {
    k: 'result', tag: 'Result', icon: Sparkles,
    title: 'What the first year actually returned.',
    body: 'Twelve months on one ledger across 212 outlets and nine distribution centres, measured against the year before on the same store base.',
    stats: [['Inventory visibility', 96, '%'], ['Working capital released', 4.2, 'M SAR'], ['Fill rate', 99.1, '%']],
    panel: 'result',
  },
];

/* the numbers only start counting when their own stage arrives, so the
   page does not burn five count-ups behind the fold */
const Stat = ({ label, value, unit }) => {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -18% 0px' });
  const dec = String(value).includes('.') ? 1 : 0;
  return (
    <div ref={ref}>
      <dt>{label}</dt>
      <dd>{seen ? <Ticker value={value} decimals={dec} suffix={unit} /> : <span className="tnum">0{unit}</span>}</dd>
    </div>
  );
};

const StagePanel = ({ kind }) => {
  if (kind === 'sheet') {
    return (
      <div className="su-frag sheet">
        <div className="su-frag-bar">stock_master_v14_FINAL.xlsx<u>read-only</u></div>
        <div className="su-sheet">
          {['', 'SKU', 'On hand', 'Store 04', 'Updated'].map((h) => <span className="h" key={h}>{h}</span>)}
          {[
            ['12', '44192', '?', '—', '6 days ago'],
            ['13', '20871', '1,204', '?', '6 days ago'],
            ['14', '31544', '—', '88', '11 days ago'],
            ['15', '11902', '412', '—', '6 days ago'],
          ].map((r) => r.map((c, i) => (
            <span key={`${r[1]}-${i}`} className={i === 0 ? 'rn' : c === '?' || c === '—' ? 'q' : ''}>{c}</span>
          )))}
        </div>
      </div>
    );
  }

  if (kind === 'rollout') {
    return (
      <div className="su-frag">
        <div className="su-frag-bar">Rollout · wave plan<u>11 weeks</u></div>
        <div className="su-roll">
          {[['Riyadh DC', 'Wk 1–2'], ['Jeddah DC', 'Wk 3–4'], ['Dammam DC', 'Wk 5'],
            ['Jubail DC', 'Wk 6'], ['212 outlets', 'Wk 7–11']].map(([site, when], i) => (
              <motion.div
                className="su-roll-row"
                key={site}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              >
                <i><Check size={10} /></i>
                <span>{site}</span>
                <u>{when}</u>
              </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'rule') {
    return (
      <div className="su-frag">
        <div className="su-frag-bar">Replenishment rule · SKU-44192<u>nightly</u></div>
        <div className="su-rule">
          <div className="su-rule-line"><span>Demand, trailing 8 weeks</span><b>61.4 / wk</b></div>
          <div className="su-rule-line"><span>Lead time delivered</span><b>23.4 d</b></div>
          <div className="su-rule-line"><span>Service target</span><b>98.5%</b></div>
          <div className="su-rule-out">
            <span>Reorder point</span>
            <b>248 <em>was 196</em></b>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'feed') {
    return (
      <div className="su-frag">
        <div className="su-frag-bar">Exceptions · routed<u>live</u></div>
        <div className="su-feed">
          {[['SKU-44192', 'Reorder point breached', 'bad', 'Buying'],
            ['REF-042', 'Reefer 6.4 °C, above range', 'bad', 'Cold chain'],
            ['PO-8843', 'Not acknowledged in 24 h', 'warn', 'Buying'],
            ['DOCK-D4', 'Unload overrunning by 40 m', 'warn', 'Riyadh DC']].map(([code, text, tone, owner]) => (
              <div className={`su-feed-row ${tone}`} key={code}>
                <i />
                <span><b>{code}</b>{text}</span>
                <u>{owner}</u>
              </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="su-frag">
      <div className="su-frag-bar">Year one · against prior year<u>same store base</u></div>
      <div className="su-result">
        {[['Fill rate', 91.2, 99.1], ['Inventory visibility', 42, 96], ['Dead stock', 18.4, 12.1]].map(([k, a, b]) => (
          <div className="su-result-row" key={k}>
            <span>{k}</span>
            <span className="su-result-bar">
              <motion.i
                className="was"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: a / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              <motion.i
                className="now"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: b / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.25, ease: EASE }}
              />
            </span>
            <b>{a}<em>→</em>{b}</b>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomerSuccess = () => {
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 62%', 'end 74%'],
  });

  return (
    <section className="su" id="change">
      <div className="su-inner">
        <header className="su-head">
          <div>
            <span className="su-kick">Customer success</span>
            <h2>
              Nesto Group ran on a spreadsheet.
              <em> Then it did not.</em>
            </h2>
          </div>
          <div className="su-who">
            <div><b>212</b><span>outlets</span></div>
            <div><b>9</b><span>distribution centres</span></div>
            <div><b>41,200</b><span>SKUs on one ledger</span></div>
          </div>
        </header>

        {/* --- the transformation --- */}
        <div className="su-rail" ref={railRef}>
          <Rail progress={scrollYProgress} />

          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <article className="su-stage" key={s.k}>
                <div className="su-stage-mark">
                  <span className="su-stage-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="su-stage-tag"><Icon size={11} />{s.tag}</span>
                </div>

                <div className="su-stage-say">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <dl className="su-stage-stats">
                    {s.stats.map(([label, v, u]) => (
                      <Stat key={label} label={label} value={v} unit={u} />
                    ))}
                  </dl>
                </div>

                <div className="su-stage-panel">
                  <StagePanel kind={s.panel} />
                </div>
              </article>
            );
          })}
        </div>

        {/* --- and only now, the quote --- */}
        <figure className="su-quote">
          <blockquote>
            We used to find out about a stockout when a store manager called.
            Now the system tells us two weeks before it would have happened,
            and it has usually already ordered.
          </blockquote>
          <figcaption>
            <span>OS</span>
            <div><b>Omar Siddiqui</b><em>Head of Supply Chain, Nesto Group</em></div>
            <a href="#start" className="su-link">Read the full case study <ArrowUpRight size={15} /></a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default CustomerSuccess;
