import React, { useEffect, useRef, useState } from 'react';
import {
  Blocks, Workflow, Sparkles, Braces, ShieldCheck, ArrowRight, Play,
  PanelsTopLeft, LayoutGrid, Zap, Webhook, Boxes, History, Bot,
} from 'lucide-react';
import { motion, useScroll, useSpring, EASE } from './motion';
import { AnimatePresence } from './PlatformKit';
import './PlatformNav.css';

/* =====================================================================
   PRODUCT NAVIGATION

   The site header handles the company. This bar handles the product:
   where you are inside a very long page, and what else lives in each
   half of it. The flyouts are the only place on the page that behaves
   like a menu, which is why they are allowed to look like one.
   ===================================================================== */

const MENUS = [
  {
    id: 'studio',
    label: 'Studio',
    icon: Blocks,
    tone: 'v',
    blurb: 'The visual application builder — screens, data, permissions.',
    items: [
      { href: '#studio', icon: PanelsTopLeft, t: 'The canvas', d: 'Components, inspector, live data binding.' },
      { href: '#apps', icon: LayoutGrid, t: 'Applications built', d: 'Five real apps shipped by customer teams.' },
      { href: '#build', icon: Boxes, t: 'Build anything', d: 'Nine departments, nine working applications.' },
      { href: '#templates', icon: Sparkles, t: 'Template library', d: 'CRM, HRMS, helpdesk, expenses and more.' },
    ],
    feature: { t: 'Idea → application in one session', d: 'Watch a request become a published app in nine minutes.', href: '#idea' },
  },
  {
    id: 'flow',
    label: 'Flow',
    icon: Workflow,
    tone: 'run',
    blurb: 'The workflow and automation builder — triggers to actions.',
    items: [
      { href: '#flow', icon: Workflow, t: 'Workflow canvas', d: 'Triggers, conditions, human steps, API calls.' },
      { href: '#run', icon: Zap, t: 'Live execution', d: 'One run, step by step, with payloads and retries.' },
      { href: '#bridge', icon: History, t: 'Studio × Flow', d: 'How a screen and a process become one object.' },
      { href: '#integrations', icon: Webhook, t: 'Integrations', d: 'ERP, CRM, email, WhatsApp, APIs, databases.' },
    ],
    feature: { t: '412 runs an hour, 0.81s median', d: 'Every run signed, timed and replayable.', href: '#run' },
  },
];

const LINKS = [
  { href: '#ai', label: 'AI', icon: Bot },
  { href: '#developers', label: 'Developers', icon: Braces },
  { href: '#enterprise', label: 'Enterprise', icon: ShieldCheck },
];

/* every section that the bar should light up for */
const SPY = [
  'top', 'idea', 'studio', 'apps', 'flow', 'run', 'bridge', 'ai',
  'build', 'templates', 'integrations', 'developers', 'watch', 'story', 'enterprise',
];

const OWNER = {
  studio: 'studio', apps: 'studio', build: 'studio', templates: 'studio', idea: 'studio',
  flow: 'flow', run: 'flow', bridge: 'flow', integrations: 'flow',
  ai: 'ai', developers: 'developers', watch: '', story: '', enterprise: 'enterprise',
};

const PlatformNav = () => {
  const [stuck, setStuck] = useState(false);
  const [here, setHere] = useState('top');
  const [open, setOpen] = useState(null);
  const closeTimer = useRef(0);

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 260);

      /* last section whose top has passed the bar wins — cheaper than an
         observer per section and it never reports two at once */
      let current = 'top';
      for (const id of SPY) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 220) current = id;
      }
      setHere(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const active = OWNER[here] || '';

  return (
    <div className={`pnv ${stuck ? 'stuck' : ''}`} onMouseLeave={release}>
      <div className="pnv-in">
        <a className="pnv-mark" href="#top">
          <span className="pnv-mark-ic">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="pnv-mark-t">
            Platform <em>&amp; Builder</em>
          </span>
        </a>

        <nav className="pnv-nav" aria-label="Platform sections">
          {MENUS.map((m) => (
            <div
              className={`pnv-item ${open === m.id ? 'open' : ''} ${active === m.id ? 'on' : ''}`}
              key={m.id}
              onMouseEnter={() => hold(m.id)}
              onFocus={() => hold(m.id)}
            >
              <a href={`#${m.id}`} className="pnv-trigger">
                <m.icon size={13} strokeWidth={2} />
                {m.label}
                <i className="pnv-caret" />
              </a>
            </div>
          ))}

          {LINKS.map((l) => (
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
          <a href="#watch" className="pnv-watch" onMouseEnter={release}>
            <span><Play size={8} fill="currentColor" /></span>
            Watch
          </a>
          <a href="#start" className="pnv-cta" onMouseEnter={release}>
            Build with Emvive <ArrowRight size={14} />
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
            {MENUS.filter((m) => m.id === open).map((m) => (
              <div className={`pnv-fly-in t-${m.tone}`} key={m.id}>
                <div className="pnv-fly-l">
                  <span className="pnv-fly-k"><m.icon size={13} strokeWidth={2} /> {m.label}</span>
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

export default PlatformNav;
