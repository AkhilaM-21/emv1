import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Play, Check, Sparkles, Infinity as InfinityIcon,
  UserRound, Landmark, MonitorSmartphone, Scale, PackageSearch,
  ChevronLeft, ChevronRight, Factory, ShoppingBag, HeartPulse, Truck,
  X, Maximize2,
  LayoutGrid, Users, Clock, Wallet, UserPlus, BarChart3, Settings, Search,
  Layers, Home, UsersRound, Cpu, TrendingUp,
} from 'lucide-react';
import './AgenticHero.css';

// HRM dashboard mock content (emerald theme — no blue)
const DASH_NAV = [
  { icon: <LayoutGrid size={17} />, label: 'Dashboard' },
  { icon: <Users size={17} />, label: 'Employees' },
  { icon: <Clock size={17} />, label: 'Attendance' },
  { icon: <Wallet size={17} />, label: 'Payroll' },
  { icon: <UserPlus size={17} />, label: 'Recruitment' },
  { icon: <BarChart3 size={17} />, label: 'Reports' },
  { icon: <Settings size={17} />, label: 'Settings' },
];
const RG = 'radial-gradient(90% 85% at 50% 15%,';
const DASH_STATS = [
  { icon: <Users size={18} />, value: '1,248', label: 'Total employees', trend: 4.2, bg: `${RG} #a7f3d0, #ffffff)`, fg: '#059669' },
  { icon: <Clock size={18} />, value: '1,180', label: 'Present today', trend: 2.1, bg: `${RG} #fed7aa, #ffffff)`, fg: '#c2410c' },
  { icon: <UserPlus size={18} />, value: '18', label: 'Open roles', trend: 6.0, bg: `${RG} #fbe6d4, #ffffff)`, fg: '#6d28d9' },
  { icon: <Wallet size={18} />, value: '$2.4M', label: 'Payroll (MTD)', trend: -1.4, bg: `${RG} #fbcfe8, #ffffff)`, fg: '#be185d' },
];
const DASH_HIRES = [
  { name: 'Marcus Lee', role: 'Product Designer', dept: 'Design', c: `${RG} #fcd34d, #f59e0b)`, i: 'ML' },
  { name: 'Aisha Khan', role: 'Backend Engineer', dept: 'Engineering', c: `${RG} #6ee7b7, #10b981)`, i: 'AK' },
  { name: 'Diego Torres', role: 'Sales Executive', dept: 'Sales', c: `${RG} #f7c8a3, #e86a2c)`, i: 'DT' },
  { name: 'Emma Wilson', role: 'HR Coordinator', dept: 'People', c: `${RG} #f9a8d4, #ec4899)`, i: 'EW' },
];
const DASH_BARS = [62, 78, 70, 88, 95, 74, 58];
const DASH_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// hero dashboard-card metrics
const DASH_METRICS = [
  { label: 'REVENUE YTD', value: '$4.28M', accent: true },
  { label: 'COUNTRIES', value: '42' },
  { label: 'UPTIME', value: '99.99%' },
];

// floating feature pills on the right (blue theme)
const PILLS = [
  { title: 'Cloud ERP', sub: 'Unified operations', icon: <Layers size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'HR & Payroll', sub: 'People management', icon: <UsersRound size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'CRM & Sales', sub: 'Deepen relationships', icon: <TrendingUp size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'Advanced Reporting', sub: 'Live insights', icon: <BarChart3 size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'Workflow Automation', sub: 'No-code flows', icon: <Sparkles size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
];


// dummy demo video (placeholder for now) — embedded YouTube link
const DEMO_VIDEO = 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0';

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;

// Hero screenshot + background texture (downloaded locally into /public/hero)
const HERO_SHOT = '/hero/hero-dashboard-2.jpg';
const HERO_BG = '/hero/hero-custom.png';

// departments that rotate into the headline one by one
const DEPTS = [
  'finance.', 'HR.', 'IT.', 'operations.', 'sales.', 'legal.',
  'marketing.', 'procurement.', 'payroll.', 'accounting.',
  'inventory.', 'manufacturing.', 'logistics.', 'projects.',
];

const FEATURES = [
  { icon: <Check size={22} />, color: 'linear-gradient(180deg, #ccf2c7,#9de195)', iconColor: '#156f08', title: 'All-in-one', sub: 'Unified ERP suite' },
  { icon: <Sparkles size={22} />, color: 'linear-gradient(180deg, #fbeee0,#d5c0f9)', iconColor: '#5a28b0', title: 'Automation', sub: 'Streamline every workflow' },
  { icon: <InfinityIcon size={22} />, color: 'linear-gradient(180deg, #fdeede,#f9d2b3)', iconColor: '#c2491b', title: 'Enterprise-ready', sub: 'Secure & compliant' },
];

const INDUSTRIES = [
  { key: 'hr', title: 'HR', desc: 'Elevate the potential of your people with human-AI collaboration.', link: 'Human Capital Management', icon: <UserRound size={30} />, grad: 'linear-gradient(165deg, #c14a2e 0%, #7c2617 100%)' },
  { key: 'finance', title: 'Finance', desc: 'Close faster, plan smarter, run global operations from one ledger.', link: 'Financial Management', icon: <Landmark size={30} />, grad: 'linear-gradient(165deg, #d9722a 0%, #114e87 100%)' },
  { key: 'it', title: 'IT', desc: 'One platform, one data model — retire your integration debt.', link: 'Platform & APIs', icon: <MonitorSmartphone size={30} />, grad: 'linear-gradient(165deg, #6c40b2 0%, #3f2082 100%)' },
  { key: 'legal', title: 'Legal', desc: 'Compliance workflows and audit trails, live in 42 countries.', link: 'Compliance suite', icon: <Scale size={30} />, grad: 'linear-gradient(165deg, #1f9f70 0%, #0f5d44 100%)' },
  { key: 'ops', title: 'Operations', desc: 'Supply, inventory, and logistics — orchestrated end-to-end.', link: 'Ops suite', icon: <PackageSearch size={30} />, grad: 'linear-gradient(165deg, #cb8c1f 0%, #8b5b10 100%)' },
  { key: 'mfg', title: 'Manufacturing', desc: 'Plan production, track output and cut waste in real time.', link: 'Production suite', icon: <Factory size={30} />, grad: 'linear-gradient(165deg, #c85a1e 0%, #17406f 100%)' },
  { key: 'retail', title: 'Retail', desc: 'Unify online and in-store commerce with live data.', link: 'Commerce suite', icon: <ShoppingBag size={30} />, grad: 'linear-gradient(165deg, #b14a2f 0%, #6f2b19 100%)' },
  { key: 'health', title: 'Healthcare', desc: 'Streamline care operations, staffing and billing.', link: 'Care suite', icon: <HeartPulse size={30} />, grad: 'linear-gradient(165deg, #1f9f8f 0%, #0f5d53 100%)' },
  { key: 'supply', title: 'Supply Chain', desc: 'Forecast demand and automate fulfillment everywhere.', link: 'Logistics suite', icon: <Truck size={30} />, grad: 'linear-gradient(165deg, #6c50b2 0%, #3f3082 100%)' },
];

const AgenticHero = () => {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const videoRef = useRef(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [deptIndex, setDeptIndex] = useState(0);

  // rotate the department word one by one
  useEffect(() => {
    const t = setInterval(() => setDeptIndex((i) => (i + 1) % DEPTS.length), 2000);
    return () => clearInterval(t);
  }, []);

  // auto-scroll the industry cards (pauses on hover)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const t = setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 324, behavior: 'smooth' });
      }
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTiles = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * 324, behavior: 'smooth' });
  };

  const enlargeVideo = () => {
    const v = videoRef.current;
    if (v && v.requestFullscreen) v.requestFullscreen();
  };

  // close the popup on Escape
  useEffect(() => {
    if (!videoOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setVideoOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [videoOpen]);

  return (
    <>
    <div className="ah-dark-wrap">
    {/* faint vertical guide lines left & right — span the whole dark area */}
    <div className="ah-vlines" aria-hidden="true" />
    <section className="ah-section ah-dark" id="agentic-hero">
      <div className="ah-grid">
        {/* left — copy */}
        <div className="ah-copy">
          <span className="ah-eyebrow">{t('agenticHero.eyebrow', 'THE AGENTIC ENTERPRISE')}</span>
          <h1 className="ah-title">
            {t('agenticHero.headline1', 'Business software')} <span className="ah-grad">{t('agenticHero.headline2', 'designed to think ahead.')}</span>
          </h1>
          <p className="ah-sub">
            {t('agenticHero.subtitle', 'Emvive is the enterprise AI platform for HR, finance, IT and operations — unified across 42 countries, powered by autonomous agents that solve problems, not just report them.')}
          </p>
          <div className="ah-btns">
            <a href="#demo" className="btn-get-started">
              {t('agenticHero.requestDemo', 'Request a free demo')}
              <span className="arrow-circle"><ArrowRight size={14} color="#fff" /></span>
            </a>
          </div>
        </div>

        {/* right — dashboard card + floating pills */}
        <div className="ah-visual">
          <div className="ah-dashcard">
            <div className="ah-dash-head">
              <span className="ah-dash-badge">EMV · GLOBAL</span>
              <span className="ah-dash-sub">Q3 · Real-time</span>
            </div>
            <div className="ah-dash-stats">
              {DASH_METRICS.map((m, i) => (
                <div key={m.label} className="ah-dash-metric">
                  <span className="ah-dash-metric-label">{t(`agenticHero.metrics.${i}.label`, m.label)}</span>
                  <b className={m.accent ? 'accent' : ''}>{m.value}</b>
                </div>
              ))}
            </div>
            <button className="ah-dash-chart" type="button" aria-label="Play video" onClick={() => setVideoOpen(true)}>
              <svg className="ah-chart-svg" viewBox="0 0 520 220" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="ah-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e2601f" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#e2601f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,190 C90,180 150,120 230,150 C320,184 380,70 520,54 L520,220 L0,220 Z" fill="url(#ah-area)" />
                <path d="M0,190 C90,180 150,120 230,150 C320,184 380,70 520,54" fill="none" stroke="#f2853f" strokeWidth="2.5" />
                <circle cx="230" cy="150" r="4" fill="#f2853f" />
                <circle cx="380" cy="92" r="4" fill="#f2853f" />
              </svg>
              <span className="ah-chart-play"><Play size={22} fill="#fff" color="#fff" /></span>
              <span className="ah-chart-caption">
                <b>{t('agenticHero.watchTitle', 'Watch: The Agentic Enterprise.')}</b> {t('agenticHero.watchDesc', 'Emvive is the last operations software your team will ever need.')}
              </span>
            </button>
          </div>

          <div className="ah-pills">
            {PILLS.map((p, i) => (
              <div key={p.title} className="ah-pill">
                <span className="ah-pill-ic" style={{ background: p.bg }}>{p.icon}</span>
                <span className="ah-pill-txt">
                  <b>{t(`agenticHero.pills.${i}.title`, p.title)}</b>
                  <span>{t(`agenticHero.pills.${i}.sub`, p.sub)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="ah-tiles-section ah-dark" id="industries">
      <div className="ah-industries-wrap">
        <div className="ah-tiles-head">
          <h2 className="ah-tiles-title">
            {t('agenticHero.tilesTitle1', 'A unified AI platform built to serve')}<br />
            <span className="ah-grad">{t('agenticHero.tilesTitle2', 'your entire organization.')}</span>
          </h2>
          <div className="ah-tiles-nav">
            <button className="ah-tile-arrow" onClick={() => scrollTiles(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
            <button className="ah-tile-arrow" onClick={() => scrollTiles(1)} aria-label="Next"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div
          className="ah-industries"
          ref={trackRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.key} className="ind-card" style={{ backgroundImage: ind.grad }}>
              <span className="ind-ic">{ind.icon}</span>
              <div className="ind-body">
                <h3 className="ind-title">{t(`agenticHero.industries.${i}.title`, ind.title)}</h3>
                <p className="ind-desc">{t(`agenticHero.industries.${i}.desc`, ind.desc)}</p>
                <a href="#platform" className="ind-link">{t(`agenticHero.industries.${i}.link`, ind.link)} <ArrowRight size={15} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>

    {videoOpen && (
      <div className="ah-modal" onClick={() => setVideoOpen(false)}>
        <div className="ah-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="ah-modal-actions">
            <button className="ah-modal-btn" type="button" aria-label="Enlarge" onClick={enlargeVideo}>
              <Maximize2 size={18} />
            </button>
            <button className="ah-modal-btn" type="button" aria-label="Close" onClick={() => setVideoOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <iframe
            ref={videoRef}
            className="ah-modal-video"
            src={DEMO_VIDEO}
            title="Discover Emvive"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )}
    </>
  );
};

export default AgenticHero;
