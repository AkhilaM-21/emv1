import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Boxes, Briefcase, Check, ChevronLeft, ChevronRight, Cloud, Factory, Gauge, Handshake, HardDrive, Landmark, ShieldCheck, ShoppingCart, TrendingUp, Users,
} from 'lucide-react';
import SupplyBanner from './SupplyBanner';
import './SupplyWhatsNew.css';
import './SupplyRadars.css';
import './SupplyShowcase.css';
import './SupplyPricing.css';
import './SupplyPlatform.css';
import PlatformFilm from './SupplyPlatformVideo';
import '../finance/FinanceD365.css';

/* =====================================================================
   EMVIVE SUPPLY CHAIN — page

   The same page the Finance landing page is: identical sections, the
   same component shapes, the same `fd-` stylesheet and the same
   colours. The only things that change are the headings and the
   content, because what a supply chain buyer asks is not what a
   controller asks.

     1  L1 banner         full-bleed film, copy on its whitened foot
     2  Overview          Infosys "What's Happening" carousel
     3  Solutions         Infosys "Our Radars" image accordion
     4  Products          Infosys IKI hero — banner + nav strip
     5  Pricing           three plans, no figures, featured inverted
     6  Platform          one card, two tabs, an icon grid

   Customer stories, resources and the closing CTA come from the shared
   site sections, exactly as they do on Finance.
   ===================================================================== */

/* A slot renders whatever art is dropped into it and falls back to a
   tinted panel while there is none, so the layout is final before the
   pictures arrive and nothing shifts when they do. */
const Slot = ({ src, alt = '', className = '', ratio }) => (
  <div className={`fd-slot ${className}`} style={{ aspectRatio: ratio }}>
    {src
      ? <img src={src} alt={alt} loading="lazy" decoding="async" />
      : <span className="fd-slot-empty" aria-hidden="true" />}
  </div>
);

/* =====================================================================
   SCROLL BEHAVIOUR — as Finance: reveal once, then disconnect.
   ===================================================================== */
const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    /* motion off: show it, skip the observer entirely */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('effect-on');
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('effect-on');
        io.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
};

/* The anchor bar tracks the section in view. The last section wins when
   several are visible, which matches reading order as you scroll down. */
const useScrollSpy = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        if (seen.length) setActive(seen[seen.length - 1].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
};

/* THE SWAP.
   Two bars must never be on screen together: the site header owns the
   top while the hero is in view, and the section bar takes over once
   the hero has gone by. */
/* Read on scroll rather than with an IntersectionObserver.

   An observer only calls back when `isIntersecting` CHANGES, and both
   "above the viewport" and "below the viewport" are the same `false`.
   With this banner shorter than the fold the sentinel starts below,
   so a jump from far down the page back to the top goes false → false
   and never fires — leaving the site header hidden with the hero back
   on screen. A position read has no such state to miss. */
const useNavSwap = () => {
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return undefined;

    let frame = 0;

    const read = () => {
      frame = 0;
      /* handover happens when the sentinel has gone UP past the top */
      document.body.classList.toggle(
        'fd-nav-swap',
        el.getBoundingClientRect().top < 0,
      );
    };

    /* one read per frame at most, however fast the scroll fires */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.body.classList.remove('fd-nav-swap');
    };
  }, []);

  return sentinel;
};

const ANCHORS = [
  ['overview', 'Overview'],
  ['solutions', 'Solutions'],
  ['products', 'Products'],
  ['pricing', 'Pricing'],
  ['platform', 'Platform'],
  ['stories', 'Customer stories'],
  ['resources', 'Resources'],
];

/* =====================================================================
   1 — L1 BANNER + ANCHOR BAR
   The banner itself lives in SupplyBanner.jsx; what is left here is the
   handover sentinel and the anchor bar that rides under it.
   ===================================================================== */
export const SupplyHeroBlade = () => {
  const active = useScrollSpy(ANCHORS.map(([id]) => id));
  const sentinel = useNavSwap();

  return (
  <>
    <SupplyBanner />

    {/* the handover point: while this is on screen the site header owns
        the top; once it passes, the bar below takes over */}
    <span className="fd-nav-sentinel" ref={sentinel} aria-hidden="true" />

    <nav className="fd-anchors" aria-label="On this page">
      <div className="fd-in fd-anchors-in">
        <ul>
          {ANCHORS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'is-current' : undefined}
                aria-current={active === id ? 'true' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#start" className="fd-btn fd-btn-solid fd-anchors-cta">Contact us</a>
      </div>
    </nav>
  </>
  );
};

/* =====================================================================
   2 — OVERVIEW
   Built to the Infosys "What's Happening" carousel on
   /services/consulting.html — see SupplyWhatsNew.css for the shape and
   for what was read out of their stylesheet.
   ===================================================================== */
const OVERVIEW_ITEMS = [
  {
    id: 'what',
    kind: 'Overview',
    img: '/images/capture_step.jpg',
    title: 'What is Emvive Supply Chain?',
    cta: 'Read more',
    href: '#products',
  },
  {
    id: 'tour',
    kind: 'Guided tour',
    img: '/images/control_step.jpg',
    title: 'Follow one order from requisition to proof of delivery',
    cta: 'Start the tour',
    href: '#solutions',
  },
  {
    id: 'pricing',
    kind: 'Pricing',
    img: '/images/close_step.jpg',
    title: 'Compare plans across your sites, warehouses and fleet',
    cta: 'See pricing',
    href: '#pricing',
  },
  {
    id: 'platform',
    kind: 'Platform',
    img: '/images/platform_connected.png',
    title: 'How supply chain connects to the rest of the business',
    cta: 'See the platform',
    href: '#platform',
  },
];

/* The reference pairs a `fadeInUp` / `fadeInDown` class with an
   `animatedBlock` class that WOW.js adds when the block scrolls into
   view. Same pairing, an IntersectionObserver in place of the library —
   and it fires once, so the section does not re-animate every time it
   scrolls back past. */
const useAnimatedBlock = (delay = 0) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('animatedBlock');
      return undefined;
    }

    el.style.animationDelay = `${delay}s`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('animatedBlock');
        io.disconnect();
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return ref;
};

export const Overview = () => {
  const headRef = useAnimatedBlock(0.2);
  const railRef = useAnimatedBlock(0.2);

  const trackRef = useRef(null);
  const [i, setI] = useState(0);
  const [per, setPer] = useState(3);

  /* how many slides are in view — read from the CSS variable rather
     than duplicated here, so the breakpoints live in one place */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const read = () => {
      const n = parseInt(
        getComputedStyle(el.parentElement.parentElement).getPropertyValue('--per'),
        10,
      );
      setPer(Number.isNaN(n) ? 3 : n);
    };

    read();
    window.addEventListener('resize', read, { passive: true });
    return () => window.removeEventListener('resize', read);
  }, []);

  /* the last resting position, so the track never runs past its end */
  const last = Math.max(0, OVERVIEW_ITEMS.length - per);
  const at = Math.min(i, last);

  const go = (d) => setI((n) => Math.min(Math.max(n + d, 0), last));

  /* one slide is its own width plus one gap */
  const shift = `calc(-${at} * (100% + var(--wh-gap)) / ${per})`;

  return (
    <section className="wh" id="overview">
      <div className="wh-in">
        <div className="wh-head wh-anim wh-anim--down" ref={headRef}>
          <div className="emv-subtitle">OVERVIEW</div>
          <h2 className="fd-h2 global-section-title" style={{ marginTop: '1rem', letterSpacing: '-0.03em' }}>
            Get to know <span className="text-gradient">Emvive Supply Chain</span>
          </h2>
          <p className="fd-lede" style={{ maxWidth: '70ch', margin: '1rem 0 0' }}>
            Learn more about our solutions and products across procurement, manufacturing, warehousing, transportation and planning.
          </p>
        </div>

        <div className="wh-rail wh-anim wh-anim--up" ref={railRef}>
          <div className="wh-arrows">
            <button
              type="button"
              className="wh-arrow fd-orange-btn"
              onClick={() => go(-1)}
              disabled={at === 0}
              aria-label="Previous"
            >
              <ChevronLeft size={20} strokeWidth={2.4} />
            </button>

            <span className="wh-nums" aria-hidden="true">
              {/* the total is the number of positions the rail can REST
                  at, not the number of cards: with three in view and
                  four cards there are two, and "/04" would promise two
                  more steps that the next arrow will not take. It falls
                  out of `per`, so it restates itself at each breakpoint
                  — 02 at three per view, 03 at two, 04 at one. */}
              {String(at + 1).padStart(2, '0')}/{String(last + 1).padStart(2, '0')}
            </span>

            <button
              type="button"
              className="wh-arrow fd-orange-btn"
              onClick={() => go(1)}
              disabled={at >= last}
              aria-label="Next"
            >
              <ChevronRight size={20} strokeWidth={2.4} />
            </button>
          </div>

          <div className="wh-viewport">
            <div className="wh-track" ref={trackRef} style={{ transform: `translateX(${shift})` }}>
              {OVERVIEW_ITEMS.map((it) => (
                <article className="wh-slide" key={it.id}>
                  <div className="wh-media">
                    <img src={it.img} alt="" loading="lazy" decoding="async" />
                  </div>

                  {/* the card rides up over the picture by 60px */}
                  <div className="wh-card">
                    <div className="wh-card-top">
                      <span className="wh-label">{it.kind}</span>
                      <h3 className="wh-title">{it.title}</h3>
                    </div>

                    <div className="wh-cta-row">
                      <a className="wh-cta" href={it.href}>
                        {it.cta}
                        <i aria-hidden="true"><ArrowRight size={14} strokeWidth={2.6} /></i>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   2b — SOLUTIONS
   Built to the Infosys "Our Radars" image accordion on infosys.com/iki
   — see SupplyRadars.css for the shape and for what was read out of
   their stylesheet.
   ===================================================================== */
const SOLUTIONS_DATA = [
  {
    k: 'Modernize your procurement operations',
    line: 'Requisition to receipt on one document trail, with budget checked at the commitment and approvals routed by value and category.',
    link: 'Explore procurement',
    href: '#products',
    img: '/images/solution_procurement.jpg',
    c: '#10b981', // Green
  },
  {
    k: 'Run the warehouse down to the bin',
    line: 'Putaway, picking, packing and counting on a scanner that keeps working when the signal does not, with stock held at bin, batch and serial level.',
    link: 'Discover warehousing',
    href: '#products',
    img: '/images/solution_warehouse.jpg',
    c: '#3b82f6', // Blue
  },
  {
    k: 'Move goods with live visibility',
    line: 'Loads built by weight and drop sequence, ETAs tracked against plan, and cold chain logged the whole way to the door.',
    link: 'See transportation',
    href: '#products',
    img: '/images/solution_transport.jpg',
    c: '#8b5cf6', // Purple
  },
  {
    k: 'Plan demand outlet by outlet',
    line: 'Forecasts, reorder points and allocation that read live stock rather than last month’s plan, with fill rate measured on the line.',
    link: 'View planning tools',
    href: '#products',
    img: '/images/solution_planning.jpg',
    c: '#d6461a', // Orange
  },
];

export const Solutions = () => {
  const reveal = useReveal();

  /* Click only — no autoplay, and hovering a panel does not open it.
     The reference opens on click too; the rotating version this
     replaces was the old Solutions section's behaviour, not theirs. */
  const [open, setOpen] = useState(0);

  return (
    <section className="rd" id="solutions" ref={reveal}>
      <div className="rd-in">
        <div className="rd-head">
          <p className="emv-subtitle" style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>Solutions</p>
          <h2 className="fd-h2 global-section-title" style={{ letterSpacing: '-0.03em' }}>
            Move from a system of record to a <span className="text-gradient">system of action</span>
          </h2>
        </div>

        <ul className="rd-list">
          {SOLUTIONS_DATA.map((it, i) => {
            const isOpen = open === i;
            return (
              <li
                key={it.k}
                className={`rd-panel${isOpen ? ' is-open' : ''}`}
                style={{ '--rd-c': it.c }}
                onClick={() => setOpen(i)}
                /* Enter and Space are the keyboard's click, so the panel
                   opens the same way for both. Nothing opens on hover. */
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(i);
                  }
                }}
              >
                <img className="rd-img" src={it.img} alt="" loading="lazy" decoding="async" />

                {/* COLLAPSED — the title, on its side */}
                <div className="rd-title">
                  <h3>{it.k}</h3>
                </div>

                {/* OPEN — the copy */}
                <div className="rd-body">
                  <span className="rd-rule" aria-hidden="true" />
                  <h3>{it.k}</h3>
                  <p>{it.line}</p>
                  <a className="rd-link" href={it.href} onClick={(e) => e.stopPropagation()}>
                    {it.link}
                    <i aria-hidden="true"><ArrowRight size={16} strokeWidth={2.6} /></i>
                  </a>
                </div>

              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

/* =====================================================================
   2.5 — PRODUCTS
   Built to the hero at the top of infosys.com/iki.html — a banner
   carousel whose caption strip IS the navigation. See
   SupplyShowcase.css for the shape and for what was read out of their
   stylesheet.
   ===================================================================== */
const SHOWCASE = [
  {
    id: 'procurement',
    tag: 'Procurement',
    title: 'Requisition to receipt, on one trail',
    img: '/images/solution_procurement.jpg',
    head: 'Procurement',
    body: 'Budget checked at the commitment, approvals routed by value, and a variance that holds the receipt instead of nodding it through.',
    cta: 'Read more',
  },
  {
    id: 'warehouse',
    tag: 'Warehouse',
    title: 'Down to the bin, down to the batch',
    img: '/images/solution_warehouse.jpg',
    head: 'Warehouse management',
    body: 'Putaway, picking, packing and counting on a scanner that keeps working when the signal does not.',
    cta: 'Read more',
  },
  {
    id: 'transport',
    tag: 'Transportation',
    title: 'You hear about the delay first',
    img: '/images/solution_transport.jpg',
    head: 'Transportation',
    body: 'Loads built by weight and drop sequence, live ETAs against plan, and cold chain logged to the door.',
    cta: 'Read more',
  },
  {
    id: 'planning',
    tag: 'Planning',
    title: 'Demand, outlet by outlet',
    img: '/images/solution_planning.jpg',
    head: 'Customer planning',
    body: 'Forecasts, reorder points and allocation that read live stock rather than last month’s plan.',
    cta: 'Explore now',
  },
];

/* how long each banner holds before the next — the progress bar runs
   for exactly this, so the two can never drift apart */
const HB_MS = 7000;

export const Products = () => {
  const ref = useReveal();
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(true);

  /* Autoplay is the point here: the bar along the foot of the current
     item IS the timer, so stopping it would leave a bar that fills and
     then does nothing. Clicking an item still jumps straight to it. */
  useEffect(() => {
    if (!running) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const t = setTimeout(() => setI((n) => (n + 1) % SHOWCASE.length), HB_MS);
    return () => clearTimeout(t);
  }, [running, i]);

  return (
    <section id="products" className="hb" ref={ref}>
      <div className="hb-in">
        <div className="hb-head">
          <span className="emv-subtitle" style={{ marginBottom: '1rem', display: 'inline-block', textTransform: 'uppercase' }}>PRODUCTS</span>
          <h2 className="fd-h2 global-section-title" style={{ letterSpacing: '-0.03em' }}>
            Bring your supply chain together with <span className="text-gradient">Emvive Supply Chain</span>
          </h2>
          <p className="hb-sub">
            From everyday stock movements to advanced planning and logistics, Emvive Supply Chain provides a connected platform for managing goods across your organisation.
          </p>
        </div>

        {/* THE BANNER — the slides are stacked and cross-faded */}
        <div
          className="hb-stage"
          onMouseEnter={() => setRunning(false)}
          onMouseLeave={() => setRunning(true)}
        >
          {SHOWCASE.map((s, n) => (
            <div
              className={`hb-slide${n === i ? ' is-current' : ''}`}
              key={s.id}
              aria-hidden={n !== i}
            >
              <img className="hb-img" src={s.img} alt="" loading={n === 0 ? 'eager' : 'lazy'} decoding="async" />
              <div className="hb-copy">
                <span className="hb-tag">{s.tag}</span>
                <h3 className="hb-title">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* THE STRIP — pulled up into the banner, and it is the nav */}
        <div
          className="hb-strip"
          onMouseEnter={() => setRunning(false)}
          onMouseLeave={() => setRunning(true)}
        >
          {SHOWCASE.map((s, n) => (
            <button
              type="button"
              className={`hb-item${n === i ? ' is-current' : ''}`}
              key={s.id}
              onClick={() => setI(n)}
              aria-current={n === i ? 'true' : undefined}
            >
              <span className="hb-inner">
                {/* spans, not h4/p: a <button>'s content model is
                    phrasing content, so flow elements inside it are
                    invalid markup. They are styled as a heading and a
                    paragraph instead. */}
                <span>
                  <span className="hb-h">{s.head}</span>
                  <span className="hb-p">{s.body}</span>
                </span>

                <span className="hb-more">
                  <i aria-hidden="true"><ChevronRight size={13} strokeWidth={3} /></i>
                  {s.cta}
                </span>
              </span>

              {/* the timer, drawn. It restarts whenever the turn does,
                  which is what the key is for. */}
              <span className="hb-bar" aria-hidden="true">
                <i
                  key={`${s.id}-${i}-${running}`}
                  className={running ? undefined : 'is-held'}
                  style={{ animationDuration: `${HB_MS}ms` }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   3c — PRICING
   There are no published Emvive figures, so no card shows one. What
   sits in the price slot instead is the thing that actually sets the
   number — the shape of the operation the plan is for — and then a
   plain note that the figure comes from a conversation. See
   SupplyPricing.css for why the previous cards were replaced.
   ===================================================================== */
const PLANS = [
  {
    k: 'Essentials',
    line: 'One site, one warehouse, the full stock ledger.',
    forK: 'Built for',
    forV: 'A single site',
    forN: 'Priced on users and the modules you turn on.',
    points: [
      'Procurement and goods receipt',
      'Bin, batch and serial stock',
      'Standard stock and ageing reporting',
      'Up to 10 users',
    ],
  },
  {
    k: 'Growth',
    line: 'Several sites, several warehouses, one plan.',
    forK: 'Built for',
    forV: 'Multi-site operations',
    forN: 'Priced on sites, users and the modules you turn on.',
    points: [
      'Everything in Essentials',
      'Multi-site and inter-site transfers',
      'Demand forecasting and reorder points',
      'Approval workflows and audit trail',
    ],
    featured: true,
  },
  {
    k: 'Enterprise',
    line: 'Hubs, fleet and outlets, across countries.',
    forK: 'Built for',
    forV: 'Groups and networks',
    forN: 'Priced on entities, sites, fleet and residency.',
    points: [
      'Everything in Growth',
      'Transportation, routing and proof of delivery',
      'Cross-docking and hub allocation',
      'Data residency and SSO',
    ],
  },
];

export const Pricing = () => {
  const reveal = useReveal();

  return (
    <section className="pr" id="pricing" ref={reveal}>
      <div className="pr-in">
        <div className="pr-head">
          <span className="global-section-badge fd-badge-orange"><span className="global-badge-dot" aria-hidden="true" /> PRICING</span>
          <h2 className="fd-h2 global-section-title">Emvive Supply Chain <span className="text-gradient">pricing</span></h2>
          <p className="pr-lede">
            Priced on sites, users and the modules you turn on. Tell us how you are
            structured and we will put a number against it.
          </p>
        </div>

        <div className="pr-grid">
          {PLANS.map((p) => (
            <article className={`pr-card${p.featured ? ' is-featured' : ''}`} key={p.k}>
              {p.featured && <span className="pr-badge">Most chosen</span>}

              <h3 className="pr-name">{p.k}</h3>
              <p className="pr-line">{p.line}</p>

              {/* where a price would be */}
              <div className="pr-for">
                <span className="pr-for-k">{p.forK}</span>
                <span className="pr-for-v">{p.forV}</span>
                <span className="pr-for-n">{p.forN}</span>
              </div>

              <ul className="pr-points">
                {p.points.map((pt) => (
                  <li key={pt}>
                    <i aria-hidden="true"><Check size={11} strokeWidth={3.4} /></i>
                    {pt}
                  </li>
                ))}
              </ul>

              <a href="#start" className="pr-cta">
                Get a quote
                <i aria-hidden="true"><ArrowRight size={15} strokeWidth={2.6} /></i>
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

/* =====================================================================
   6 — PLATFORM
   The two statements about what Emvive Supply Chain sits inside and
   runs on. Not a feature and not a module, so it is neither in the
   accordion nor in the product rail — it is what both of those are
   part of.
   ===================================================================== */
const PLATFORM = [
  {
    k: 'Connected supply chain operations',
    phase: 0,
    items: [
      { name: 'Finance', icon: Landmark, color: '#f0883e' },
      { name: 'Sales', icon: Handshake, color: '#10b981' },
      { name: 'Projects', icon: Briefcase, color: '#3b82f6' },
      { name: 'Manufacturing', icon: Factory, color: '#8b5cf6' },
      { name: 'Human Capital', icon: Users, color: '#ec4899' },
      { name: 'POS', icon: ShoppingCart, color: '#06b6d4' },
    ],
  },
  {
    k: 'Built on a secure cloud platform',
    phase: 2.1,
    items: [
      { name: 'SaaS, multi-tenant', icon: Boxes, color: '#f59e0b' },
      { name: 'Cloud-native', icon: Cloud, color: '#3b82f6' },
      { name: 'Built to scale', icon: TrendingUp, color: '#10b981' },
      { name: 'Zero-downtime updates', icon: Gauge, color: '#ef4444' },
      { name: 'Backup', icon: HardDrive, color: '#8b5cf6' },
      { name: 'Disaster recovery', icon: ShieldCheck, color: '#06b6d4' },
    ],
  },
];

export const Platform = () => {
  const reveal = useReveal();
  const [tab, setTab] = useState(0);
  const active = PLATFORM[tab];

  return (
    <section className="fd-section fd-platform fd-anim fd-anim--up" id="platform" ref={reveal}>
      <div className="fd-in">
        <span className="global-section-badge fd-badge-orange"><span className="global-badge-dot" aria-hidden="true" /> PLATFORM</span>
        <h2 className="fd-h2 global-section-title">Supply chain as part of the business, <span className="text-gradient">not beside it</span></h2>

        <div className="fd-auto-card">
          <div className="fd-auto-left">
            <h3>The platform underneath</h3>
            <p>The supply chain does not run on its own island — it runs on the same system the rest of the business does.</p>

            <div className="fd-auto-tabs" role="tablist" aria-label="Platform">
              {PLATFORM.map((x, i) => (
                <button
                  key={x.k}
                  type="button"
                  role="tab"
                  aria-selected={i === tab}
                  className={`fd-auto-tab${i === tab ? ' is-current' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {x.k}
                </button>
              ))}
            </div>
          </div>

          <div className="fd-auto-right">
            {/* the clip, cropped past the Gemini mark and looped over
                its first four seconds — see SupplyPlatformVideo.jsx */}
            <div className="sw-art sw-art--film">
              <PlatformFilm />
            </div>

            <div className="fd-auto-body">
              <div className="fd-auto-grid">
                {active.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span className="fd-auto-item" key={item.name}>
                      <i aria-hidden="true" style={{ color: item.color }}><Icon size={20} strokeWidth={2} /></i>
                      {item.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   7 — NEXT STEPS
   One white card: the ask on the left, a picture filling the right.
   Kept here for parity with Finance, which mounts the shared CTA in its
   place.
   ===================================================================== */
export const ClosingBanner = () => {
  const reveal = useReveal();
  return (
  <section className="fd-section fd-closing fd-anim fd-anim--up" id="start" ref={reveal}>
    <div className="fd-in">
      <div className="fd-closing-card">
        <div className="fd-closing-copy">
          <h2 className="fd-h2 global-section-title">Bring your supply chain <span className="text-gradient">together</span></h2>
          <p className="fd-lede">
            From everyday stock movements to advanced planning and logistics, Emvive
            Supply Chain provides a connected platform for managing goods across your
            organisation.
          </p>

          <div className="fd-closing-actions">
            <a href="#contact" className="fd-btn fd-btn-solid">Request a demo</a>
            <a href="#contact" className="fd-btn fd-btn-shell">Start free trial</a>
          </div>
        </div>

        {/* no ratio: the picture takes the card's height from the copy */}
        <Slot className="fd-closing-media" src="/images/close_step.jpg" alt="" />
      </div>
    </div>
  </section>
  );
};
