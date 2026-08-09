import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { motion, useScroll, useSpring, EASE } from './motion';
import './nav.css';

/* =====================================================================
   PRODUCT NAVIGATION

   The site header handles the company. This bar handles the product:
   where you are inside a very long page, and what else lives in each
   part of it. The flyouts are the only place on a product page that
   behaves like a menu, which is why they are allowed to look like one.

   Shared by Finance, Supply Chain and Platform. Everything that differs
   between them is configuration — the mark, two flyout groups, the flat
   links, and the two calls to action. Colour comes from the page's
   --accent, which ProductPage already publishes, so the bar tints
   itself green, blue or violet with no per-page CSS.

   Config shape:
     mark    { label, suffix, icon }        icon optional, falls back to the Emvive mark
     menus   [{ id, label, icon, tone, blurb, items[], feature }]
     links   [{ href, label }]
     watch   { href, label }                the quiet secondary action
     cta     { href, label }
     spy     [sectionId]                    ids to track, in page order
     owner   { sectionId: menuIdOrLinkId }  which nav item lights up for each section
   ===================================================================== */

const EmviveMark = () => (
  <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
);

const ProductNav = ({ mark, menus = [], links = [], watch, cta, spy = [], owner = {} }) => {
  const [stuck, setStuck] = useState(false);
  const [here, setHere] = useState(spy[0] || 'top');
  const [open, setOpen] = useState(null);
  const closeTimer = useRef(0);

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 260);

      /* last section whose top has passed the bar wins — cheaper than an
         observer per section and it never reports two at once */
      let current = spy[0] || 'top';
      for (const id of spy) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 220) current = id;
      }
      setHere(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [spy]);

  /* a short grace period, so crossing the gap between the trigger and
     the panel does not snap the menu shut */
  const hold = (id) => {
    window.clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const release = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const active = owner[here] || '';
  const Mark = mark.icon || EmviveMark;

  return (
    <div className={`pnv ${stuck ? 'stuck' : ''}`} onMouseLeave={release}>
      <div className="pnv-in">
        <a className="pnv-mark" href="#top">
          <span className="pnv-mark-ic">
            <Mark size={14} strokeWidth={2} />
          </span>
          <span className="pnv-mark-t">
            {mark.label} {mark.suffix && <em>{mark.suffix}</em>}
          </span>
        </a>

        <nav className="pnv-nav" aria-label={`${mark.label} sections`}>
          {menus.map((m) => (
            <div
              className={`pnv-item ${open === m.id ? 'open' : ''} ${active === m.id ? 'on' : ''}`}
              key={m.id}
              onMouseEnter={() => hold(m.id)}
              onFocus={() => hold(m.id)}
            >
              <a href={m.href || `#${m.id}`} className="pnv-trigger">
                {m.icon && <m.icon size={13} strokeWidth={2} />}
                {m.label}
                <i className="pnv-caret" />
              </a>
            </div>
          ))}

          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`pnv-link ${active === l.href.slice(1) ? 'on' : ''}`}
              onMouseEnter={release}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="pnv-right">
          {watch && (
            <a href={watch.href} className="pnv-watch" onMouseEnter={release}>
              <span><Play size={8} fill="currentColor" /></span>
              {watch.label}
            </a>
          )}
          <a href={cta.href} className="pnv-cta" onMouseEnter={release}>
            {cta.label} <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* ---------------- flyout ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="pnv-flyout"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: EASE }}
            onMouseEnter={() => hold(open)}
          >
            {menus.filter((m) => m.id === open).map((m) => (
              <div className={`pnv-fly-in ${m.tone ? `t-${m.tone}` : ''}`} key={m.id}>
                <div className="pnv-fly-l">
                  <span className="pnv-fly-k">{m.icon && <m.icon size={13} strokeWidth={2} />} {m.label}</span>
                  <p>{m.blurb}</p>
                </div>

                <div className="pnv-fly-items">
                  {m.items.map((it) => (
                    <a href={it.href} key={it.href} onClick={() => setOpen(null)}>
                      <span className="pnv-fly-ic"><it.icon size={15} strokeWidth={1.8} /></span>
                      <b>{it.t}</b>
                      <em>{it.d}</em>
                    </a>
                  ))}
                </div>

                <a className="pnv-fly-feat" href={m.feature.href} onClick={() => setOpen(null)}>
                  <span className="pnv-fly-feat-tag">Featured</span>
                  <b>{m.feature.t}</b>
                  <em>{m.feature.d}</em>
                  <span className="pnv-fly-feat-go">Jump to it <ArrowRight size={14} /></span>
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span className="pnv-progress" style={{ scaleX: bar }} aria-hidden="true" />
    </div>
  );
};

export default ProductNav;
