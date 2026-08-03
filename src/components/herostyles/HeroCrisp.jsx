import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useHeroContent } from './heroContent';
import HeroDemoBox from './HeroDemoBox';
import './HeroCrisp.css';

/* STYLE 1 — crisp.chat, replicated shot-for-shot:
   rounded sky-blue panel inset from the page edge · clouds, rolling hills and
   a green sphere · white "NEW!" pill · two-line headline with a hand-drawn
   brush underline · three white value pills · one ringed CTA · trial
   microcopy · framed app screenshot with a floating "Discover" video pill. */

const HeroCrisp = () => {
  const c = useHeroContent();

  /* the brush underlines the tail of line one, like the reference does —
     first word stays plain, the rest carries the stroke */
  const words = c.wideHeadline1.split(' ');
  const lead = words.slice(0, 1).join(' ');
  const emphasis = words.slice(1).join(' ') || c.wideHeadline1;

  return (
    <section className="hcx-hero">
      <div className="hcx-panel">
        {/* ---------- scenery ---------- */}
        <img className="hcx-bg" src="/hero/hero-custom.png" alt="" aria-hidden="true" />
        <div className="hcx-texture" aria-hidden="true" />

        {/* ---------- content ---------- */}
        <div className="hcx-inner">
          <h1 className="hcx-title">
            {/* each line is its own nowrap block, so the break never drifts */}
            <span className="hcx-title-line">
              {lead}{lead && ' '}
              <span className="hcx-line">
                <span className="hcx-line-text">{emphasis}</span>
                {/* tapered brush stroke — their emphasis svg is 252 x 20 */}
                <svg className="hcx-brush" viewBox="0 0 252 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3,13 C55,6 120,3 186,5 C213,6 232,8 248,4 L249,9 C236,14 216,12 185,11 C120,8 58,11 4,17 Z" />
                </svg>
              </span>
            </span>
            <span className="hcx-title-line">{c.wideHeadline2}</span>
          </h1>

          {/* the site's own button pair: embossed white pill (Header.css) plus
              the orange primary (index.css), same as the live hero uses */}
          <div className="hcx-props">
            <a href="#demo" className="btn-get-started">
              {c.primaryCta}
              <span className="arrow-circle"><ArrowRight size={14} color="#fff" /></span>
            </a>

            <a href="#products" className="cta-btn-primary">
              {c.secondaryCta}
              <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>

        {/* sits outside the 80% text column so it can run wider than the copy */}
        <div className="hcx-shot">
          <HeroDemoBox />
        </div>
      </div>
    </section>
  );
};

export default HeroCrisp;
