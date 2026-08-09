import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useHeroContent } from './heroContent';
import './HeroCinematic.css';

/* STYLE 3 — cinematic enterprise hero, built to the animation brief:
   bright white environment, translucent glass ribbons and spheres,
   volumetric light from the upper right, drifting particles, a slow forward
   camera push, and a staged content reveal on the brief's own timeline —
   0.0s background · 1.2s label · 2.0s headline · 3.0s copy · 4.0s button. */

/* deterministic particle field — no Math.random, so SSR and client agree */
const PARTICLES = (() => {
  const out = [];
  let seed = 20260803;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < 26; i += 1) {
    out.push({
      left: `${rnd() * 100}%`,
      top: `${rnd() * 100}%`,
      size: `${2 + rnd() * 4}px`,
      delay: `${rnd() * 14}s`,
      duration: `${16 + rnd() * 14}s`,
      opacity: 0.25 + rnd() * 0.45,
    });
  }
  return out;
})();

const HeroCinematic = () => {
  const c = useHeroContent();

  return (
    <section className="cin-hero">
      {/* ---------- scene: everything inside gets the slow camera push ---------- */}
      <div className="cin-scene" aria-hidden="true">
        <div className="cin-base" />
        <div className="cin-volumetric" />

        {/* flowing glass ribbons */}
        <svg className="cin-ribbons" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="cin-r1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#a78bfa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#99f6e4" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="cin-r2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#67e8f9" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cin-r3" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          <path className="cin-ribbon r1" fill="url(#cin-r1)"
            d="M900,80 C1120,140 1240,300 1180,470 C1120,640 900,700 760,620 C640,552 660,430 800,380 C940,330 1060,400 1020,500" />
          <path className="cin-ribbon r2" fill="url(#cin-r2)"
            d="M1180,60 C1360,180 1420,420 1300,600 C1200,750 980,780 900,690 C830,612 900,520 1010,540" />
          <path className="cin-ribbon r3" fill="url(#cin-r3)"
            d="M780,520 C960,560 1100,700 1040,840 C990,960 800,960 720,860 C650,772 700,660 820,660" />
        </svg>

        {/* glass spheres */}
        <span className="cin-sphere s1" />
        <span className="cin-sphere s2" />
        <span className="cin-sphere s3" />

        {/* thin glowing lines travelling across */}
        <span className="cin-beam b1" />
        <span className="cin-beam b2" />
        <span className="cin-beam b3" />

        {/* drifting particles */}
        <div className="cin-particles">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---------- content, staged on the brief's timeline ---------- */}
      <div className="cin-inner">
        <div className="cin-copy">
          <span className="cin-label">{c.eyebrow}</span>

          <h1 className="cin-title">
            {c.headline1} <span className="cin-title-accent">{c.headline2}</span>
          </h1>

          <p className="cin-sub">{c.subtitle}</p>

          <a href="#products" className="cin-btn">
            {c.secondaryCta}
            <span className="cin-btn-arrow"><ArrowRight size={16} /></span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroCinematic;
