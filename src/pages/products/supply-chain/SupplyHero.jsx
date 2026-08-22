import React from 'react';
import {
  BookOpen, Receipt, CreditCard, Wallet, TrendingUp, ChartPie,
} from 'lucide-react';
import {
  motion, EASE, Reveal, useReducedMotion,
} from '../shared/motion';
import './SupplyHero.css';

/* =====================================================================
   EMVIVE SUPPLY — HERO

   Three bands stacked on white, in reading order:

     1  the statement            what Emvive Supply is
     2  the capability scroller  what it covers, moving on its own
     3  the illustration         the chain itself, end to end

   The page is white down to the scroller. Below it a shade band lifts
   the illustration's own sky (#4dafe0 — sampled from the file) out of
   the white, so the artwork rises out of the page instead of being
   pasted onto it. The band and the image share one colour token; if the
   artwork is ever swapped, change --sh-sky and the seam stays invisible.
   ===================================================================== */

const HERO_IMAGE = '/supply%20and%20chain%20hero.jpg';

/* ---------------------------------------------------------------
   THE CAPABILITY SCROLLER
   Six capabilities on one continuous rail. No cards, no section
   heading — the page already has a capabilities section that explains
   these properly; here they are a glance at the coverage.
   --------------------------------------------------------------- */
/* Each capability carries its own accent, the same way the industry
   cards on the home page do — `rgb` is the raw triple so the CSS can
   build translucent tints from it. */
const CAPS = [
  { k: 'Supplier Management', icon: BookOpen, color: '#0a8f5e', rgb: '10, 143, 94' },
  { k: 'Procurement', icon: Receipt, color: '#6c50b2', rgb: '108, 80, 178' },
  { k: 'Manufacturing', icon: CreditCard, color: '#2563eb', rgb: '37, 99, 235' },
  { k: 'Warehouse', icon: Wallet, color: '#e2601f', rgb: '226, 96, 31' },
  { k: 'Transportation', icon: TrendingUp, color: '#0d9488', rgb: '13, 148, 136' },
  { k: 'Distribution', icon: ChartPie, color: '#9333ea', rgb: '147, 51, 234' },
];

const CapabilityRail = () => {
  const reduced = useReducedMotion();

  const track = (dup) => (
    <div className={`sh-rail-marquee-content ${reduced ? 'paused' : ''}`} aria-hidden={dup || undefined}>
      {CAPS.map((c, n) => {
        const Icon = c.icon;
        return (
          <div
            className="sh-cap-marquee-item"
            key={`${c.k}-${n}${dup ? '-dup' : ''}`}
            style={{ '--cc': c.color, '--cc-rgb': c.rgb }}
          >
            <span className="sh-cap-ic"><Icon size={18} strokeWidth={2} /></span>
            <span className="sh-cap-name">{c.k}</span>
            <span className="sh-cap-sep" aria-hidden="true">•</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="sh-rail">
      <div className="sh-rail-marquee">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   THE ILLUSTRATION
   Full-bleed. The artwork meets the white statement directly — there
   is no fade band between them.
   --------------------------------------------------------------- */
const HeroVisual = () => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="sh-visual"
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
    >
      <img
        className="sh-visual-img"
        src={HERO_IMAGE}
        alt="Freight moving through one connected chain: a container ship at a crane-served
             quay, a barge, a truck, and a freight train, with an aircraft overhead and the
             globe behind them."
        loading="eager"
        decoding="async"
      />
    </motion.div>
  );
};

/* =====================================================================
   HERO
   ===================================================================== */
const SupplyHero = () => (
  <section className="fh" id="top">
    {/* the statement and the rail share one wash, so it can finish at the
        artwork's sky exactly where the artwork starts */}
    <div className="sh-lead">
      <div className="sh-top">
        <div className="sh-head">
          {/* A plain heading, not MaskText. MaskText animates each word up
              out of an overflow:hidden box from y:112%, so if that animation
              does not resolve the headline is invisible while still taking
              its space — which is exactly what was happening here. The hero
              headline is the one thing on the page that must never depend on
              an animation firing, so it uses the same Reveal the lede does. */}
          <Reveal delay={0.06} y={16}>
            <h1 className="sh-h1">
              Supply chain, <span className="sh-accent">connected.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.36} y={16}>
            <p className="sh-lede">
              Connect procurement, manufacturing, logistics and distribution in one platform
              built to give your business greater visibility and control.
            </p>
          </Reveal>
        </div>
      </div>

      <CapabilityRail />
    </div>

    <HeroVisual />
  </section>
);

export default SupplyHero;
