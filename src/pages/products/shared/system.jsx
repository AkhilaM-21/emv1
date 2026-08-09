import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  motion, Reveal, Stagger, StaggerItem, MaskText, CountUp, HeroStage,
  useSteps, useSmoothScroll, useScrollTop, useReducedMotion, useTransform,
  scrollToY, safeRange, EASE,
} from './motion';
import './system.css';

/* =====================================================================
   Shared page furniture. Each page composes these differently — the
   primitives are shared, the layouts are not.
   ===================================================================== */

/* Page root: installs inertial scrolling and publishes the accent. */
export const ProductPage = ({ accent, accent2, wash, section, className = '', children }) => {
  useScrollTop(section);
  useSmoothScroll();

  return (
    <div
      className={`px ${className}`}
      style={{ '--accent': accent, '--accent-2': accent2 || accent, '--accent-wash': wash }}
    >
      {children}
    </div>
  );
};

/* --------------------------------------------------------------- */
export const SubNav = ({ icon: Icon, name, links, cta = 'Book demo' }) => {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`px-subnav ${stuck ? 'stuck' : ''}`}>
      <div className="px-shell px-subnav-inner">
        <a href="#top" className="px-subnav-name">
          <span className="dot"><Icon size={11} /></span>
          {name}
        </a>
        <nav className="px-subnav-links">
          {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <a href="#start" className="px-btn px-btn-solid">{cta}</a>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------- */
export const Hero = ({
  eyebrow, note, title, accentWord, lede, primary, secondary, meta = [], trustedBy, children,
}) => (
  <section className="px-hero" id="top">
    <div className="px-hero-bg" aria-hidden="true">
      <div className="px-hero-grid" />
      <div className="px-hero-aurora a" />
      <div className="px-hero-aurora b" />
    </div>

    <div className="px-shell px-hero-copy">
      <Reveal duration={0.7}>
        <a href="#story" className="px-hero-pill">
          <span className="px-hero-pill-tag">{eyebrow}</span>
          {note}
          <ArrowRight size={13} />
        </a>
      </Reveal>

      <MaskText text={title} accent={accentWord} as="h1" className="px-display" delay={0.08} />

      <Reveal delay={0.34} y={16}>
        <p className="px-lede">{lede}</p>
      </Reveal>

      <Reveal delay={0.44} y={16}>
        <div className="px-hero-actions">
          <a href="#start" className="px-btn px-btn-solid">
            {primary} <ArrowRight size={16} />
          </a>
          <a href="#story" className="px-btn px-btn-quiet">{secondary}</a>
        </div>
      </Reveal>
    </div>

    {/* the product surface runs wider than the text column and is cropped
        by the fold — the page reads as a window into a bigger application */}
    <HeroStage className="px-hero-stage">
      <div className="px-hero-frame">{children}</div>
    </HeroStage>

    {meta.length > 0 && (
      <div className="px-shell">
        <Reveal delay={0.1} y={18}>
          <div className="px-trust">
            {trustedBy && <span className="px-trust-label">{trustedBy}</span>}
            <div className="px-trust-metrics">
              {meta.map((m) => (
                <div key={m.label}>
                  <b>{m.value}</b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    )}
  </section>
);

/* --------------------------------------------------------------- */
export const SectionHead = ({ index, label, title, lede, children }) => (
  <div className="px-sec-head">
    <Reveal duration={0.7}>
      <span className="px-eyebrow"><i className="idx">{index}</i> {label}</span>
    </Reveal>
    <div className="px-sec-head-body">
      <MaskText text={title} as="h2" className="px-h2" />
      {lede && (
        <Reveal delay={0.18} y={16}>
          <p className="px-lede">{lede}</p>
        </Reveal>
      )}
      {children}
    </div>
  </div>
);

/* --------------------------------------------------------------- */
export const Chrome = ({ title, tags = [], live, className = '', children }) => (
  <div className={`px-chrome ${className}`}>
    <div className="px-chrome-bar">
      <div className="px-dots"><i /><i /><i /></div>
      {title && <span className="px-chrome-title">{title}</span>}
      <div className="px-chrome-right">
        {live && <span className="px-chrome-tag"><span className="px-live" /> Live</span>}
        {tags.map((tg) => <span className="px-chrome-tag" key={tg}>{tg}</span>)}
      </div>
    </div>
    <div className="px-chrome-body">{children}</div>
  </div>
);

/* --------------------------------------------------------------- */
export const HairGrid = ({ items, cols = 3 }) => (
  <Stagger className={`px-grid ${cols === 2 ? 'px-grid-2' : cols === 4 ? 'px-grid-4' : ''}`}>
    {items.map(({ icon: Icon, title, desc }) => (
      <StaggerItem className="px-cell" key={title}>
        <Icon className="px-cell-ic" size={19} strokeWidth={1.6} />
        <h3>{title}</h3>
        <p>{desc}</p>
      </StaggerItem>
    ))}
  </Stagger>
);

/* --------------------------------------------------------------- */
export const StatRow = ({ stats }) => (
  <Stagger className="px-stats" gap={0.09}>
    {stats.map((s) => (
      <StaggerItem className="px-stat" key={s.label}>
        <b>
          {s.prefix}
          <CountUp to={s.value} decimals={s.decimals || 0} suffix={s.suffix || ''} />
        </b>
        <span>{s.label}</span>
      </StaggerItem>
    ))}
  </Stagger>
);

/* ---------------------------------------------------------------
   Pinned story. The visual pins; narration scrolls past it and drives
   which panel is shown. Clicking a step jumps the reader to it.
   --------------------------------------------------------------- */
/* One step. Its rail fills with the scroll position inside its own band,
   which is what makes the narration feel tracked rather than switched. */
const StoryStep = ({ step, i, count, progress, active, onJump }) => {
  const reduced = useReducedMotion();
  const fill = useTransform(progress, safeRange([i / count, (i + 1) / count]), ['0%', '100%'], { clamp: true });

  return (
    <button
      type="button"
      className={`px-story-step ${active ? 'on' : ''}`}
      onClick={() => onJump(i)}
      aria-current={active ? 'step' : undefined}
    >
      {reduced
        ? <span className="fill" style={{ height: active ? '100%' : '0%' }} />
        : <motion.span className="fill" style={{ height: fill }} />}
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
    </button>
  );
};

export const Story = ({ steps, id = 'story' }) => {
  const { ref, index, progress } = useSteps(steps.length);
  const reduced = useReducedMotion();

  /* Land a third of the way into the requested step's band, so a click
     never parks the reader on a boundary that immediately flips over. */
  const jump = (i) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(0, el.offsetHeight - window.innerHeight);
    scrollToY(top + ((i + 0.34) / steps.length) * travel);
  };

  return (
    <section className="px-story" id={id} ref={ref}>
      <div className="px-shell px-story-inner" style={{ minHeight: `${steps.length * 92}vh` }}>
        <div className="px-story-rail">
          <div className="px-story-sticky">
            <div className="px-story-steps">
              {steps.map((s, i) => (
                <StoryStep
                  key={s.title}
                  step={s}
                  i={i}
                  count={steps.length}
                  progress={progress}
                  active={index === i}
                  onJump={jump}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-story-stage">
          {steps.map((s, i) => (
            <div className={`px-story-panel ${index === i ? 'on' : ''}`} key={s.title}>
              {reduced ? s.panel : (
                <motion.div
                  animate={index === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {s.panel}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* --------------------------------------------------------------- */
export const Split = ({ eyebrow, title, body, points = [], link, flip, children }) => (
  <div className={`px-split ${flip ? 'flip' : ''}`}>
    <div className="px-split-copy">
      <Reveal duration={0.7}><span className="px-eyebrow">{eyebrow}</span></Reveal>
      <MaskText text={title} as="h3" className="px-h2" />
      <Reveal delay={0.14} y={16}><p className="px-body">{body}</p></Reveal>

      {points.length > 0 && (
        <Stagger className="px-points" delay={0.1}>
          {points.map((p, i) => (
            <StaggerItem className="px-point" key={p}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{p}</span>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {link && (
        <Reveal delay={0.2} y={14}>
          <a href="#start" className="px-link" style={{ marginTop: '2rem' }}>
            {link} <ArrowUpRight size={16} />
          </a>
        </Reveal>
      )}
    </div>

    <Reveal delay={0.08} y={26} className="px-split-visual">{children}</Reveal>
  </div>
);

/* --------------------------------------------------------------- */
/* `actions` lets a page supply its own call to action without every
   other page inheriting it — the default markup is unchanged. */
export const ClosingCta = ({ label, title, lede, primary, secondary, actions, className = '' }) => (
  <section className={`px-band ${className}`} id="start">
    <div className="px-shell">
      <Reveal y={28} duration={1.1}>
        <div className="px-cta">
          <span className="px-eyebrow">{label}</span>
          <MaskText text={title} as="h2" className="px-h2" />
          <p className="px-lede">{lede}</p>
          {actions || (
            <div className="px-cta-actions">
              <a href="#start" className="px-btn px-btn-invert">{primary} <ArrowRight size={16} /></a>
              <a href="#start" className="px-btn px-btn-ghost-invert">{secondary}</a>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  </section>
);

/* --------------------------------------------------------------- */
const SOCIAL = [
  ['LinkedIn', 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'],
  ['X', 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z'],
  ['YouTube', 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'],
];

export const Footer = () => (
  <footer className="px-footer">
    <div className="px-shell">
      <div className="px-footer-top">
        <div className="px-footer-brand">
          <div className="px-footer-mark">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 8L8 13V19L16 24L24 19V13L16 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.4" />
            </svg>
            Emvive
          </div>
          <p className="px-small">
            The enterprise platform for finance, supply chain and the applications
            your teams build on top of them.
          </p>

          <form className="px-news" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Work email" aria-label="Work email" required />
            <button type="submit" className="px-btn px-btn-solid">Subscribe</button>
          </form>
        </div>

        {[
          ['Product', ['Finance', 'Supply Chain', 'Studio', 'Flow', 'Analytics', 'Pricing']],
          ['Solutions', ['Retail', 'Manufacturing', 'Construction', 'Healthcare', 'Distribution']],
          ['Resources', ['Documentation', 'API reference', 'Customer stories', 'Security', 'Status']],
          ['Company', ['About', 'Careers', 'Partners', 'Contact', 'Legal']],
        ].map(([heading, links]) => (
          <div className="px-footer-col" key={heading}>
            <h4>{heading}</h4>
            <ul>
              {links.map((l) => <li key={l}><a href="#start">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-footer-bottom">
        <span>&copy; {new Date().getFullYear()} Emvive. All rights reserved.</span>
        <div className="px-socials">
          {SOCIAL.map(([name, d]) => (
            <button key={name} type="button" aria-label={name}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
