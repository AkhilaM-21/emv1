import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import {
  BadgeDollarSign, BookOpen, Boxes, Briefcase, Building2, ChevronDown, ChevronRight, Cloud, ArrowRight,
  Factory, FileText, GitMerge, Globe, Handshake, HardDrive, Landmark, Languages,
  Layers, LayoutDashboard, Percent, Play, Receipt, ReceiptText, RefreshCw, Search, Share2,
  ShieldCheck, ShoppingCart, Sparkles, TrendingUp, Truck, Users, Wallet,
} from 'lucide-react';
import { tint } from './FinanceStory';
import '../../../components/hero/variants/HeroInfosys.css';
import './FinanceD365.css';

/* =====================================================================
   EMVIVE FINANCE — page

   Rebuilt to the section order and component shapes of the Dynamics 365
   Finance product page:

     1  Hero blade        background image, copy left, media right
     2  Overview          pill bar -> accordion -> swapping screenshot
     3  Features          eyebrow, heading, six cards, one link out
     4  Customer stories  three-up carousel
     5  Resources         three-up card grid
     6  Closing banner    one horizontal card, image beside the ask

   The reference's Agents and News sections are not carried over. The
   plan cards under Pricing deliberately show no figures — what each
   tier includes, and the number comes from a conversation.

   Every word here is Emvive's own — the reference supplied the
   structure, not the sentences. Artwork is a sized placeholder in each
   image slot; see IMAGE SLOTS below for the exact dimensions to
   generate against.
   ===================================================================== */

/* --- IMAGE SLOTS -----------------------------------------------------
   slot                       aspect     generate at
   hero background            2.6 : 1    2000 x 770
   hero media                 16 : 9     1280 x 720
   overview screenshot        16 : 9     1280 x 720   (x8, one per module)
   partner card               16 : 7     1000 x 437   (x3)
   customer story panel       fluid      1000 x 800   (x3, cover-cropped
                                         to the copy column height)
   resource card              7 : 3      1000 x 429   (x3)
   closing banner             3 : 2      1200 x 800
   ------------------------------------------------------------------- */

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
   SCROLL BEHAVIOUR

   The reference drives its reveals off a class the page adds when a
   section scrolls into view (`.effect-on`), then runs a 1200ms
   fade-in paired with a transform. Rebuilt here with an
   IntersectionObserver so the timings and keyframes below can be the
   ones read out of their stylesheet rather than approximations.

   It fires once per element and then disconnects: re-animating a
   section every time it scrolls back past is the thing that makes a
   page feel restless. */
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
      /* a tenth of the way in, and not until it has cleared the fold a
         little, so a section does not animate while still off-screen */
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
};

/* The anchor bar tracks the section in view, the way their scrollspy
   does. The last section wins when several are visible, which matches
   reading order as you scroll down. */
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
   the hero has gone by.

   A sentinel sits at the foot of the hero. While it is visible the page
   is "at the top"; the moment it leaves, `fd-nav-swap` goes on <body>
   and the site header hides. Nothing about the header's `position` is
   touched — it stays fixed, so hiding it moves no layout, which is what
   went wrong when this was tried by putting it back into flow. */
const useNavSwap = () => {
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('fd-nav-swap', !entry.isIntersecting);
      },
      { threshold: 0 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
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
   1 — HERO BLADE
   ===================================================================== */
export const FinanceHeroBlade = () => {
  const active = useScrollSpy(ANCHORS.map(([id]) => id));
  const sentinel = useNavSwap();

  return (
  <>
    <section className="fd-hero" id="top">
      {/* The reference's hero ground is a background image: a warm
          off-white field with a large cyan form sweeping in from the
          right. Rebuilt here in CSS rather than lifted as a file. */}
      <div className="fd-hero-art" aria-hidden="true">
        {/* soft blurred forms, then two dot fields over them */}
        <span className="fd-hero-orb fd-hero-orb--1" />
        <span className="fd-hero-orb fd-hero-orb--2" />
        <span className="fd-hero-orb fd-hero-orb--3" />
        <span className="fd-hero-orb fd-hero-orb--4" />
        <span className="fd-hero-dots fd-hero-dots--tr" />
        <span className="fd-hero-dots fd-hero-dots--bl" />
      </div>

      <div className="fd-in fd-hero-in">
        <div className="fd-hero-copy">
          <h1 className="hi-title" style={{ alignItems: 'flex-start', margin: 0, textShadow: 'none', fontSize: '65px' }}>
            <span className="hi-line" style={{ color: 'var(--ink)' }}>Complete financial</span>
            <span className="hi-line" style={{ color: 'var(--ink)' }}>management for</span>
            <span className="hi-line hi-accent">connected businesses</span>
          </h1>

          <div className="fd-hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#demo" className="cta-btn-primary">
              Request a demo <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
            </a>
            <a href="#demo" className="cta-btn-secondary" style={{ backgroundColor: 'white' }}>
              Start free trial
            </a>
          </div>
        </div>

        {/* the screenshot rides in a tinted glass frame, not flush */}
        <div className="fd-hero-media">
          <div className="fd-hero-frame">
            <Slot ratio="16 / 9" src="https://picsum.photos/seed/hero/1280/720" alt="Emvive Finance" />
            <button type="button" className="fd-play" aria-label="Watch the Emvive Finance overview">
              <Play size={20} strokeWidth={2.2} />
            </button>
            <span className="fd-hero-caption">One platform for every financial process</span>
          </div>
        </div>
      </div>
    </section>

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
   Pill bar over a vertical accordion, with the screenshot beside it
   swapping as an item opens. The pills group the eight modules by
   outcome, because that is the question being asked — "can it handle
   what I pay and what I collect", not "do you have an AP module".
   ===================================================================== */
/* THE MODULE SET.
   Emvive Finance's own capabilities, grouped the way the product content
   groups them. Each carries its colour and its icon here rather than
   reading them out of FinanceStory's CAPS: that set is the older
   eight-module story and no longer matches what this page describes. */
const MODULES = [
  /* --- core accounting --- */
  {
    k: 'General Ledger', c: 'green', icon: BookOpen,
    line: 'The core accounting book, across every company.',
    body: 'Manage your core accounting operations with a multi-company General Ledger. Maintain financial records and transactions within a unified accounting structure, supporting organisations that operate across multiple companies.',
    img: '/images/general_ledger.jpg',
  },
  {
    k: 'Accounts Payable & Accounts Receivable', c: 'violet', icon: Receipt,
    line: 'Payables and receivables as connected parts of one workflow.',
    body: 'Manage payables and receivables as connected parts of your financial operations. Support vendor and customer-related financial transactions while keeping accounting activities integrated with the wider business workflow.',
    img: '/images/accounts_payable_receivable.jpg',
  },
  {
    k: 'Cash & Bank Management', c: 'blue', icon: Landmark,
    line: 'Banking activity and accounting in one view.',
    body: 'Manage cash and bank transactions within your financial system. Keep banking activities connected with your accounting operations and maintain a unified view of your financial transactions.',
    img: 'https://picsum.photos/seed/bank/1280/720',
  },
  {
    k: 'Fixed Assets Management', c: 'orange', icon: Building2,
    line: 'Assets held alongside the accounts they post to.',
    body: 'Manage fixed assets as part of your financial operations. Keep asset-related information connected with your accounting processes within the same financial platform.',
    img: 'https://picsum.photos/seed/assets/1280/720',
  },
  {
    k: 'Auto Bank Reconciliation', c: 'teal', icon: RefreshCw,
    line: 'Reconciliation automated as part of the operation.',
    body: 'Automate bank reconciliation as part of your financial operations. Emvive includes auto bank reconciliation to connect banking activity with your accounting processes.',
    img: 'https://picsum.photos/seed/recon/1280/720',
  },

  /* --- advanced financial management --- */
  {
    k: 'Advance Payments', c: 'cyan', icon: Wallet,
    line: 'Advances handled on both sides of the ledger.',
    body: 'Manage advance payments across Accounts Receivable and Accounts Payable. Support advance payment transactions as part of your customer and vendor financial processes.',
    img: 'https://picsum.photos/seed/adv/1280/720',
  },
  {
    k: 'Retention Management', c: 'purple', icon: ShieldCheck,
    line: 'Retained amounts tracked where they arise.',
    body: 'Manage retention-related financial transactions within your accounting processes. Emvive supports retention management across the financial workflows where retained amounts form part of business transactions.',
    img: 'https://picsum.photos/seed/ret/1280/720',
  },
  {
    k: 'Budgeting & Forecasting', c: 'rose', icon: TrendingUp,
    line: 'Plans read against the same data as the accounts.',
    body: 'Plan and monitor your financial activities with budgeting and forecasting capabilities. Use financial planning information alongside your accounting data to support ongoing financial management.',
    img: 'https://picsum.photos/seed/budg/1280/720',
  },
  {
    k: 'Cost Centres & Dimensions', c: 'green', icon: Layers,
    line: 'Financial data structured the way you report.',
    body: 'Structure financial information using cost centres and dimensions. Organise financial data according to the areas, entities or dimensions relevant to your organisation and its reporting requirements.',
    img: 'https://picsum.photos/seed/cost/1280/720',
  },

  /* --- multi-company --- */
  {
    k: 'Intercompany Accounting', c: 'blue', icon: Share2,
    line: 'Transactions between your own companies.',
    body: 'Support financial transactions between companies within your organisation through intercompany accounting. This is particularly relevant for businesses managing multiple entities within a connected financial environment.',
    img: 'https://picsum.photos/seed/inter/1280/720',
  },
  {
    k: 'Financial Consolidation', c: 'violet', icon: GitMerge,
    line: 'One financial view across every entity.',
    body: 'Bring financial information together across multiple companies through consolidation. Support a consolidated view of financial information for organisations operating across multiple entities.',
    img: 'https://picsum.photos/seed/cons/1280/720',
  },

  /* --- reporting and analytics --- */
  {
    k: 'Financial Dashboards', c: 'teal', icon: LayoutDashboard,
    line: 'Business performance at a glance.',
    body: "Bring financial information into dashboards for a clearer view of business performance. Financial dashboards are part of Emvive's analytics and reporting capabilities.",
    img: 'https://picsum.photos/seed/dash/1280/720',
  },
  {
    k: 'Custom Report Builder', c: 'orange', icon: FileText,
    line: 'Reports shaped to your organisation.',
    body: "Create customised reports to analyse the business information relevant to your organisation. Emvive's analytics capabilities include a custom report builder for flexible reporting.",
    img: 'https://picsum.photos/seed/report/1280/720',
  },
  {
    k: 'Drill-Down Analysis', c: 'cyan', icon: Search,
    line: 'From the reported figure to what is behind it.',
    body: 'Move from high-level financial information into the underlying details with drill-down analysis. This allows users to explore the information behind reported figures rather than relying only on summary-level views.',
    img: 'https://picsum.photos/seed/drill/1280/720',
  },

  /* --- global operations --- */
  {
    k: 'Multi-Country, Multi-Company & Multi-Currency', c: 'purple', icon: Globe,
    line: 'The foundation for operating across markets.',
    body: "Support business operations across multiple countries, companies and currencies through Emvive's global capabilities. These capabilities provide the foundation for organisations operating across different entities and markets.",
    img: 'https://picsum.photos/seed/multi/1280/720',
  },
  {
    k: 'Tax Management', c: 'rose', icon: Percent,
    line: 'One engine for the taxes you have to file.',
    body: 'Support different tax requirements through the Emvive Tax Engine, including VAT, GST, sales tax, withholding tax and reverse charge.',
    img: 'https://picsum.photos/seed/tax/1280/720',
  },
  {
    k: 'Multi-Language Financial Operations', c: 'blue', icon: Languages,
    line: 'English and Arabic, including right-to-left.',
    body: 'Support English and Arabic with RTL, along with multilingual documents, for businesses operating across different markets.',
    img: 'https://picsum.photos/seed/lang/1280/720',
  },
];

const PILLS = [
  {
    k: 'Core accounting',
    modules: ['General Ledger', 'Accounts Payable & Accounts Receivable', 'Cash & Bank Management', 'Fixed Assets Management', 'Auto Bank Reconciliation'],
  },
  {
    k: 'Advanced financial management',
    modules: ['Advance Payments', 'Retention Management', 'Budgeting & Forecasting', 'Cost Centres & Dimensions'],
  },
  {
    k: 'Multi-company',
    modules: ['Intercompany Accounting', 'Financial Consolidation'],
  },
  {
    k: 'Reporting and analytics',
    modules: ['Financial Dashboards', 'Custom Report Builder', 'Drill-Down Analysis'],
  },
  {
    k: 'Global operations',
    modules: ['Multi-Country, Multi-Company & Multi-Currency', 'Tax Management', 'Multi-Language Financial Operations'],
  },
];

/* resolved by name, so reordering MODULES cannot silently reshuffle
   which capability sits under which pill */
const GROUPS = PILLS.map((p) => p.modules.map((n) => MODULES.findIndex((m) => m.k === n)));

/* how long each item holds before the section moves itself on */
const AUTOPLAY_MS = 6000;

export const Overview = () => {
  const reveal = useReveal();

  return (
    <section className="fd-section fd-overview fd-anim fd-anim--up" id="overview" ref={reveal}>
      <div className="fd-in">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="emv-subtitle" style={{ margin: '0 auto' }}>OVERVIEW</div>
          <h2 className="fd-h2 global-section-title" style={{ marginTop: '1rem', letterSpacing: '-0.03em' }}>Get to know <span className="text-gradient">Emvive Finance</span></h2>
          <p className="fd-lede" style={{ maxWidth: '100%', margin: '1rem auto 0' }}>
            Learn more about our solutions and products across accounting, consolidation, tax, and reporting.
          </p>
        </div>
        
        <div className="fd-overview-grid">
          <div className="fd-ocard">
            <Slot className="fd-ocard-img" ratio="16 / 9" src="https://picsum.photos/seed/work1/1280/720" alt="What is Emvive Finance?" />
            <div className="fd-ocard-content">
              <h3 className="fd-ocard-title">What is Emvive Finance?</h3>
              <p className="fd-ocard-body">Become more data-driven and innovative with a unified platform for all your financial operations.</p>
              <a href="#explore" className="fd-ocard-cta">
                <i aria-hidden="true"><ChevronRight /></i> Explore Emvive Finance
              </a>
            </div>
          </div>

          <div className="fd-ocard">
            <Slot className="fd-ocard-img" ratio="16 / 9" src="https://picsum.photos/seed/work2/1280/720" alt="Take a guided tour" />
            <div className="fd-ocard-content">
              <h3 className="fd-ocard-title">Take a guided tour</h3>
              <p className="fd-ocard-body">Get a closer look at how to improve specific business processes with our financial tools.</p>
              <a href="#tour" className="fd-ocard-cta">
                <i aria-hidden="true"><ChevronRight /></i> Start your tour
              </a>
            </div>
          </div>

          <div className="fd-ocard">
            <Slot className="fd-ocard-img" ratio="16 / 9" src="https://picsum.photos/seed/work3/1280/720" alt="Compare plans and pricing" />
            <div className="fd-ocard-content">
              <h3 className="fd-ocard-title">Compare plans and pricing</h3>
              <p className="fd-ocard-body">Find the right plan for your business needs by exploring the different options.</p>
              <a href="#pricing" className="fd-ocard-cta">
                <i aria-hidden="true"><ChevronRight /></i> See pricing overview
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   2b — SOLUTIONS
   ===================================================================== */
const SOLUTIONS_DATA = [
  {
    k: 'Modernize your financial operations',
    line: 'Enhance accounting across payables, receivables, and cash management with an integrated financial solution.',
    link: 'Explore financial operations',
    img: '/images/general_ledger.jpg',
    c: '#10b981', // Green
  },
  {
    k: 'Achieve more with automated reporting',
    line: 'Gain instant visibility into business performance with real-time analytics and consolidated financial views.',
    link: 'Discover analytics',
    img: '/images/automate_step.jpg',
    c: '#3b82f6', // Blue
  },
  {
    k: 'Improve compliance and tax efficiency',
    line: 'Stay ahead of regional requirements with an embedded tax engine and automated localized reporting tools.',
    link: 'See compliance tools',
    img: '/images/control_step.jpg',
    c: '#8b5cf6', // Purple
  },
  {
    k: 'Personalize stakeholder experiences',
    line: 'Deliver custom dashboards, drill-down capabilities, and multi-language support to your global teams.',
    link: 'View global capabilities',
    img: '/images/close_step.jpg',
    c: '#d6461a', // Orange
  },
];

export const Solutions = () => {
  const reveal = useReveal();
  const [active, setActive] = useState(0);

  const grid = useRef(null);
  const onScreen = useInView(grid, { margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);

  const AUTOPLAY_MS = 6000;
  const running = auto && onScreen && !hover && !reduced;

  const stop = () => setAuto(false);
  const pick = (idx) => { stop(); setActive(idx); };

  useEffect(() => {
    if (!running) return undefined;
    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % SOLUTIONS_DATA.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [running, active]);

  return (
    <section className="fd-section fd-solutions fd-anim fd-anim--up" id="solutions" ref={reveal}>
      <div className="fd-in">
        <div style={{ marginBottom: '3rem' }}>
          <p className="emv-subtitle" style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>Solutions</p>
          <h2 className="fd-h2 global-section-title" style={{ letterSpacing: '-0.03em' }}>
            Move from a system of record to a <span className="text-gradient">system of action</span>
          </h2>
        </div>

        <div
          className="fd-sol-grid"
          ref={grid}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Left Accordion */}
          <div className="fd-sol-accordion">
            {SOLUTIONS_DATA.map((item, idx) => {
              const isOpen = active === idx;
              return (
                <div key={item.k} className={`fd-sol-item ${isOpen ? 'is-open' : ''}`}>
                  {isOpen && (
                    <span
                      className="fd-sol-fill"
                      style={{
                        backgroundColor: item.c,
                        ...(running 
                          ? { animationDuration: `${AUTOPLAY_MS}ms` } 
                          : { animation: 'none', transform: 'scaleY(1)' }
                        )
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    className="fd-sol-head"
                    aria-expanded={isOpen}
                    onClick={() => pick(idx)}
                  >
                    <span className="fd-sol-title">{item.k}</span>
                    <ChevronDown
                      className="fd-sol-chev"
                      size={22}
                      strokeWidth={2}
                      aria-hidden="true"
                      style={isOpen ? { color: item.c } : undefined}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="fd-sol-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="fd-sol-inner">
                          <p>{item.line}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Media */}
          <div className="fd-sol-media-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="fd-sol-img-wrapper"
              >
                <Slot ratio="16 / 12" src={SOLUTIONS_DATA[active].img} alt={SOLUTIONS_DATA[active].k} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   2.5 — PRODUCTS
   ===================================================================== */
const PRODUCTS_DATA = [
  {
    id: 'finance',
    tab: 'Finance',
    icon: BadgeDollarSign,
    title: 'Run Your Finances with Greater Control',
    link: 'Explore Finance',
    img: '/images/general_ledger.jpg',
    caption: 'One connected view of your ledger, cash, payables, and assets.',
    color: '#7c3aed',
  },
  {
    id: 'supply',
    tab: 'Supply Chain',
    icon: Truck,
    title: 'Connect Purchasing, Inventory and Warehouses',
    link: 'Explore Supply Chain',
    img: '/images/automate_step.jpg',
    caption: 'Procurement, inventory, and warehouses managed end to end.',
    color: '#0891b2',
  },
  {
    id: 'sales',
    tab: 'Sales & CRM',
    icon: TrendingUp,
    title: 'Manage the Customer Journey from Lead to Order',
    link: 'Explore Sales & CRM',
    img: '/images/control_step.jpg',
    caption: 'From lead to order to payment in one connected flow.',
    color: '#059669',
  },
  {
    id: 'hcm',
    tab: 'HCM',
    icon: Users,
    title: 'Manage Your Workforce from Hire to Payroll',
    link: 'Explore HCM',
    img: '/images/close_step.jpg',
    caption: 'Core HR, payroll, and attendance with compliance built in.',
    color: '#2563eb',
  },
  {
    id: 'pos',
    tab: 'POS',
    icon: ShoppingCart,
    title: 'Connect Every Sale with Your Business Operations',
    link: 'Explore POS',
    img: '/images/capture_step.jpg',
    caption: 'Fast billing across every branch — online or offline.',
    color: '#9333ea',
  },
  {
    id: 'einv',
    tab: 'E-Invoicing',
    icon: ReceiptText,
    title: 'Make Compliance Part of Your Invoicing Process',
    link: 'Explore E-Invoicing',
    img: '/images/post_step.jpg',
    caption: 'Compliant e-invoicing with real-time ZATCA clearance.',
    color: '#0d9488',
  },
  {
    id: 'projects',
    tab: 'Projects',
    icon: Briefcase,
    title: 'Keep Projects, Resources and Financials in View',
    link: 'Explore Projects',
    img: '/images/general_ledger.jpg',
    caption: 'Plan, resource, track, and bill projects in one place.',
    color: '#d97706',
  },
  {
    id: 'mfg',
    tab: 'Manufacturing',
    icon: Factory,
    title: 'Connect Production with Inventory and Cost',
    link: 'Explore Manufacturing',
    img: '/images/automate_step.jpg',
    caption: 'Production, materials, and costing kept connected.',
    color: '#be123c',
  }
];

export const Products = () => {
  const ref = useReveal();
  const [activeTab, setActiveTab] = useState(0);

  const cur = PRODUCTS_DATA[activeTab];

  return (
    <section id="products" className="fd-products" ref={ref}>
      <div className="fd-in fd-products-in">
        <div className="fd-prod-head">
          <span className="emv-subtitle" style={{ marginBottom: '1rem', display: 'inline-block', textTransform: 'uppercase' }}>PRODUCTS</span>
          <h2 className="fd-h2 global-section-title" style={{ letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '1.5rem' }}>
            Do more with Emvive business applications to <span className="text-gradient">help run your organization</span>
          </h2>
          <p className="fd-prod-sub">
            See how Emvive works with your data to give every team an edge.
          </p>
        </div>

        {/* Scrollable Tabs */}
        <div className="fd-prod-tabs-wrapper">
          <ul className="fd-prod-tabs">
            {PRODUCTS_DATA.map((p, idx) => {
              const TabIcon = p.icon;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`fd-prod-tab ${activeTab === idx ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(idx)}
                    style={activeTab === idx ? { '--tab-color': p.color } : undefined}
                  >
                    <TabIcon size={16} color={p.color} />
                    {p.tab}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tab Content */}
        <div className="fd-prod-content">
          <h3 className="fd-prod-body-title">{cur.title}</h3>
          <a href="#start" className="fd-prod-link">
            <span className="fd-prod-link-icon" style={{ backgroundColor: cur.color }}>
              <Cloud size={14} color="white" strokeWidth={3} />
            </span>
            {cur.link}
          </a>

          <div className="fd-prod-media">
            <div className="fd-prod-media-bg">
              <Slot ratio="16 / 9" src={cur.img} alt={cur.tab} />
              {/* Floating caption pill */}
              <div className="fd-prod-caption">
                <Sparkles size={16} color="#d6461a" className="fd-prod-caption-icon" />
                <span>{cur.caption}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   3c — PRICING
   The reference shows SKU cards with figures. There are no published
   Emvive prices, so the cards carry what each plan includes and send
   the number to a conversation. Inventing a price here would be worse
   than not showing one.
   ===================================================================== */
const PLANS = [
  {
    k: 'Essentials',
    line: 'One entity, one currency, the full ledger.',
    points: ['General ledger and sub-ledgers', 'AP, AR and expenses', 'Standard statutory reporting', 'Up to 10 users'],
  },
  {
    k: 'Growth',
    line: 'Several entities, several currencies, consolidated.',
    points: ['Everything in Essentials', 'Multi-entity and multi-currency', 'Budgeting and cash forecasting', 'Approval workflows and audit trail'],
    featured: true,
  },
  {
    k: 'Enterprise',
    line: 'Group reporting, local compliance, your controls.',
    points: ['Everything in Growth', 'Consolidation and eliminations', 'E-invoicing and regional tax packs', 'Data residency and SSO'],
  },
];

export const Pricing = () => {
  const reveal = useReveal();
  return (
    <section className="fd-section fd-section--band fd-pricing fd-anim fd-anim--up" id="pricing" ref={reveal}>
      <div className="fd-in">
        <span className="global-section-badge fd-badge-orange"><span className="global-badge-dot" aria-hidden="true" /> PRICING</span>
        <h2 className="fd-h2 global-section-title">Emvive Finance <span className="text-gradient">pricing</span></h2>
        <p className="fd-lede">
          Priced on entities, users and the modules you turn on. Tell us how you are
          structured and we will put a number against it.
        </p>

        <div className="fd-pgrid fd-stagger">
          {PLANS.map((p) => (
            <article className={`fd-pcard${p.featured ? ' is-featured' : ''}`} key={p.k}>
              {p.featured && <span className="fd-badge fd-badge--solid">Most chosen</span>}
              <h3 className="fd-pcard-title">{p.k}</h3>
              <p className="fd-pcard-line">{p.line}</p>
              <ul className="fd-pcard-points">
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <a href="#start" className="fd-btn fd-btn-shell fd-pcard-cta">Get a quote</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   3d — PARTNERS
   ===================================================================== */
/* Kicker, headline, link — no body paragraph, which is the shape the
   reference uses here. The headline carries the whole offer. */
const PARTNERS = [
  {
    k: 'Business assessment',
    c: 'green',
    title: 'Get an expert read on how you close today and where the manual work sits.',
    cta: 'Talk to a specialist',
    img: 'https://picsum.photos/seed/part1/1280/720',
  },
  {
    k: 'Implementation services',
    c: 'blue',
    title: 'Scope the entities, the chart of accounts and the cutover before anything is signed.',
    cta: 'Plan the rollout',
    img: 'https://picsum.photos/seed/part2/1280/720',
  },
  {
    k: 'Industry services',
    c: 'orange',
    title: 'Work with an implementation partner who already knows your industry and region.',
    cta: 'Find a partner',
    img: 'https://picsum.photos/seed/part3/1280/720',
  },
];

export const Partners = () => {
  const reveal = useReveal();
  return (
    <section className="fd-section fd-partners fd-anim fd-anim--right" id="partners" ref={reveal}>
      <div className="fd-in">
        <span className="global-section-badge"><span className="global-badge-dot" aria-hidden="true" /> Partners</span>
        <h2 className="fd-h2 global-section-title">See how Emvive can work for <span className="text-gradient">your business</span></h2>

        <div className="fd-pngrid fd-stagger">
          {PARTNERS.map((x) => (
            <article className="fd-card" key={x.k} style={tint(x.c)}>
              <Slot ratio="16 / 7" src={x.img} alt={x.k} />
              <span className="fd-card-kicker">{x.k}</span>
              <h3 className="fd-card-title">{x.title}</h3>
              <a href="#start" className="fd-card-cta">
                <i aria-hidden="true"><ChevronRight size={20} strokeWidth={2.4} /></i>
                {x.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =====================================================================
   4 — CUSTOMER STORIES
   Three to a view on one scroll track, arrows under it.
   ===================================================================== */
/* One story at a time, not three side by side — the reference gives the
   whole band to a single customer: quote left, picture right, a stat
   under the attribution, the products it runs on, and a logo strip below
   that doubles as the picker.

   Attribution is to a ROLE, not a named person. The companies here are
   already placeholders; putting a name and a job title against an
   invented quote would be manufacturing an endorsement rather than
   holding a slot for a real one. Swap in the real name with the real
   quote when there is one. */
const STORIES = [
  {
    id: 'gulf',
    img: 'https://picsum.photos/seed/story1/1280/720',
    c: 'teal',
    company: 'Gulf Build Contracting',
    sector: 'Construction & Engineering · Saudi Arabia',
    quote: 'Projects, procurement and finance finally read from the same numbers. What used to be a week of reconciliation is a report we open on the first.',
    author: 'Head of Finance, Gulf Build Contracting',
    stat: ['31', 'Active projects costed on one ledger'],
    products: ['General Ledger', 'Budgeting & Forecasting'],
  },
  {
    id: 'retail',
    img: 'https://picsum.photos/seed/story2/1280/720',
    c: 'violet',
    company: 'Nesto Group',
    sector: 'Retail & Commerce · UAE',
    quote: 'Every branch closes on the same day. Takings post straight to the ledger from the counter, so nobody spends the first week chasing spreadsheets.',
    author: 'Group Financial Controller, Nesto Group',
    stat: ['1 day', 'To close the period, across every branch'],
    products: ['Accounts Payable & Accounts Receivable', 'Auto Bank Reconciliation'],
  },
  {
    id: 'mfg',
    img: 'https://picsum.photos/seed/story3/1280/720',
    c: 'cyan',
    company: 'Zahran Industries',
    sector: 'Manufacturing · India',
    quote: 'Costs land against the job, not the month. Material issue and shop-floor time post to the work order as they happen, so we know the margin while the job is still running.',
    author: 'Finance Director, Zahran Industries',
    stat: ['96%', 'Of job costs posted the day they occur'],
    products: ['General Ledger', 'Financial Dashboards'],
  },
];

export const CustomerStories = () => {
  const reveal = useReveal();
  const [i, setI] = useState(0);
  const s = STORIES[i];

  return (
    <section className="fd-section fd-stories fd-anim fd-anim--right" id="stories" ref={reveal}>
      <div className="fd-in">
        <span className="global-section-badge"><span className="global-badge-dot" aria-hidden="true" /> Customer stories</span>
        <h2 className="fd-h2 global-section-title">How finance teams are using <span className="text-gradient">Emvive</span></h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            className="fd-story-panel"
            style={tint(s.c)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="fd-story-copy">
              <blockquote className="fd-story-quote">“{s.quote}”</blockquote>
              <p className="fd-story-author">{s.author}</p>

              {/* the rail hangs off the figure; the caption sits under it */}
              <div className="fd-story-stat">
                <span className="fd-story-stat-n">{s.stat[0]}</span>
                <span className="fd-story-stat-l">{s.stat[1]}</span>
              </div>

              <div className="fd-story-products">
                <span className="fd-story-products-h">Products</span>
                <ul>
                  {s.products.map((name) => {
                    const cap = MODULES.find((x) => x.k === name);
                    if (!cap) return null;
                    const Icon = cap.icon;
                    return (
                      <li key={name} style={tint(cap.c)}>
                        <i aria-hidden="true"><Icon size={16} strokeWidth={2} /></i>
                        {name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* no ratio on this one deliberately: an aspect-ratio here
                gives the media an intrinsic height that then sets the
                whole card's height. It stretches to the copy instead. */}
            <Slot className="fd-story-media" src={s.img} alt={s.company} />
          </motion.div>
        </AnimatePresence>

        {/* the strip under the panel IS the navigation — a customer's mark,
            and clicking it opens their story in the card above. Nothing in
            the box but the mark itself: the name stands in until there are
            logo files to drop in. */}
        <ul className="fd-logos">
          {STORIES.map((x, n) => (
            <li key={x.id}>
              <button
                type="button"
                className={`fd-logo${n === i ? ' is-current' : ''}`}
                aria-current={n === i ? 'true' : undefined}
                onClick={() => setI(n)}
                style={tint(x.c)}
              >
                <span className="fd-logo-name">{x.company}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

/* =====================================================================
   5 — RESOURCES
   A pill bar over a card grid, the same pair the overview uses. The
   cards are the same card the partner and story cards are — the panel
   at the top of a resource card is a mark, not a photograph, so it sits
   on a tinted ground rather than bleeding an image.
   ===================================================================== */
const RES_TABS = ['Analyst research', 'Guides and white papers', 'Webinars', 'Featured'];

const RESOURCES = [
  {
    id: 'r1', tab: 0, c: 'blue', kind: 'Report',
    title: 'What growing businesses should look for in a modern ERP',
    body: 'The capabilities that start to matter once you have outgrown spreadsheets and disconnected tools.',
    cta: 'Read the report',
  },
  {
    id: 'r2', tab: 0, c: 'violet', kind: 'Analysis',
    title: 'Where finance teams actually lose time in the close',
    body: 'A breakdown of the manual steps that stretch a close, and which of them automation removes outright.',
    cta: 'Read the analysis',
  },
  {
    id: 'r3', tab: 0, c: 'teal', kind: 'Benchmark',
    title: 'Days to close, by company size and sector',
    body: 'What a reasonable close looks like for a business your size, and what separates the fast from the slow.',
    cta: 'See the benchmark',
  },
  {
    id: 'r4', tab: 1, c: 'green', kind: 'Guide',
    title: 'A practical guide to connecting finance and operations',
    body: 'How connected data between finance and operations cuts the manual work and the delays between them.',
    cta: 'Read the guide',
  },
  {
    id: 'r5', tab: 1, c: 'orange', kind: 'Playbook',
    title: 'Building a more connected procure-to-pay process',
    body: 'Steps to link purchasing, receiving, invoicing and payment end to end, without adding approvals.',
    cta: 'Read the playbook',
  },
  {
    id: 'r6', tab: 1, c: 'cyan', kind: 'White paper',
    title: 'Multi-entity accounting without the month-end scramble',
    body: 'Consolidation, elimination and translation handled in the ledger rather than in a spreadsheet after it.',
    cta: 'Read the paper',
  },
  {
    id: 'r7', tab: 2, c: 'purple', kind: 'Webinar',
    title: 'A month close in Emvive, start to finish',
    body: 'Forty minutes through a full period close, from sub-ledger cut-off to the signed statutory pack.',
    cta: 'Watch the webinar',
  },
  {
    id: 'r8', tab: 2, c: 'rose', kind: 'Webinar',
    title: 'Cash forecasting when the inputs keep moving',
    body: 'Building a rolling forecast that updates itself from open orders, payables and payroll.',
    cta: 'Watch the webinar',
  },
  {
    id: 'r9', tab: 2, c: 'blue', kind: 'Session',
    title: 'Setting up approval rules that people do not route around',
    body: 'Thresholds, delegation and escalation, and how to keep an audit trail that stands up to a review.',
    cta: 'Watch the session',
  },
  {
    id: 'r10', tab: 3, c: 'green', kind: 'Featured',
    title: 'The Emvive Finance product tour',
    body: 'Every module in one pass, in the order a transaction actually moves through them.',
    cta: 'Take the tour',
  },
  {
    id: 'r11', tab: 3, c: 'teal', kind: 'Featured',
    title: 'What a migration onto Emvive looks like',
    body: 'The chart of accounts, the opening balances and the cutover, and who does what at each step.',
    cta: 'Read the plan',
  },
  {
    id: 'r12', tab: 3, c: 'violet', kind: 'Featured',
    title: 'Security, residency and the controls your auditor asks about',
    body: 'Where the data sits, who can reach it and what is written down every time a figure changes.',
    cta: 'See the detail',
  },
];

export const Resources = () => {
  const reveal = useReveal();
  const [tab, setTab] = useState(0);
  const shown = RESOURCES.filter((r) => r.tab === tab);

  return (
  <section className="fd-section fd-section--band fd-resources fd-anim fd-anim--right" id="resources" ref={reveal}>
    <div className="fd-in">
      <span className="global-section-badge"><span className="global-badge-dot" aria-hidden="true" /> Resources</span>
      <h2 className="fd-h2 global-section-title">Emvive Finance <span className="text-gradient">resources</span></h2>

      <div className="fd-pillbar" role="tablist" aria-label="Resource categories">
        {RES_TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={i === tab}
            className={`fd-pill${i === tab ? ' is-current' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="fd-rgrid">
        {shown.map((r) => (
          <article className="fd-card fd-rcard" key={r.id} style={tint(r.c)}>
            {/* a mark, not a photograph — the ground is tinted and the
                art sits inside it rather than filling it */}
            <Slot className="fd-rcard-mark" ratio="4 / 3" src={`https://picsum.photos/seed/${r.id}/1280/720`} alt="" />
            <span className="fd-card-kicker">{r.kind}</span>
            <h3 className="fd-card-title">{r.title}</h3>
            <p className="fd-card-body">{r.body}</p>
            <a href="#start" className="fd-card-cta">
              <i aria-hidden="true"><ChevronRight size={20} strokeWidth={2.4} /></i>
              {r.cta}
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
   The two statements about what Emvive Finance sits inside and runs on.
   Not a feature and not a module, so it is neither in the accordion nor
   in the feature grid — it is what both of those are part of.

   Built on the shape the supply-chain page's Automation section uses:
   one card, a tab rail down the left, and on the right a picture over a
   numbered grid of what the selected tab actually covers.
   ===================================================================== */
const PLATFORM = [
  {
    k: 'Connected financial operations',
    /* generated artwork — see tools_platform_art.py at the repo root */
    img: '/images/platform_connected.png',
    items: [
      { name: 'Supply Chain', icon: Truck, color: '#f0883e' },
      { name: 'Sales', icon: Handshake, color: '#10b981' },
      { name: 'Projects', icon: Briefcase, color: '#3b82f6' },
      { name: 'Manufacturing', icon: Factory, color: '#8b5cf6' },
      { name: 'Human Capital', icon: Users, color: '#ec4899' },
      { name: 'POS', icon: ShoppingCart, color: '#06b6d4' },
    ],
  },
  {
    k: 'Built on a secure cloud platform',
    img: '/images/platform_cloud.png',
    items: [
      { name: 'SaaS, multi-tenant', icon: Boxes, color: '#f59e0b' },
      { name: 'Cloud-native', icon: Cloud, color: '#3b82f6' },
      { name: 'Built to scale', icon: TrendingUp, color: '#10b981' },
      { name: 'Zero-downtime updates', icon: RefreshCw, color: '#ef4444' },
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
        <h2 className="fd-h2 global-section-title">Finance as part of the business, <span className="text-gradient">not beside it</span></h2>

        <div className="fd-auto-card">
          <div className="fd-auto-left">
            <h3>The platform underneath</h3>
            <p>Finance does not run on its own island — it runs on the same system the rest of the business does.</p>

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
            <div className="fd-auto-hero">
              <img src={active.img} alt="" loading="lazy" decoding="async" />
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
   ===================================================================== */
export const ClosingBanner = () => {
  const reveal = useReveal();
  return (
  <section className="fd-section fd-closing fd-anim fd-anim--up" id="start" ref={reveal}>
    <div className="fd-in">
      <div className="fd-closing-card">
        <div className="fd-closing-copy">
          <h2 className="fd-h2 global-section-title">Bring your financial operations <span className="text-gradient">together</span></h2>
          <p className="fd-lede">
            From everyday accounting to advanced financial management, Emvive Finance
            provides a connected platform for managing financial processes across your
            organisation.
          </p>

          <div className="fd-closing-actions">
            <a href="#contact" className="fd-btn fd-btn-solid">Request a demo</a>
            <a href="#contact" className="fd-btn fd-btn-shell">Start free trial</a>
          </div>
        </div>

        {/* no ratio: the picture takes the card's height from the copy */}
        <Slot className="fd-closing-media" src="https://picsum.photos/seed/closing/1280/720" alt="" />
      </div>
    </div>
  </section>
  );
};
