import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Play, Check, Sparkles, Infinity as InfinityIcon,
  UserRound, Landmark, MonitorSmartphone, Scale, PackageSearch,
  ChevronLeft, ChevronRight, Factory, ShoppingBag, HeartPulse, Truck,
  X, Maximize2,
  LayoutGrid, Users, Clock, Wallet, UserPlus, BarChart3, Settings, Search,
  Layers, Home, UsersRound, Cpu, TrendingUp,
  HardHat, Utensils, Briefcase, Headphones, Wrench, Building2,
  CircleDollarSign, Package, FolderKanban, Store, FileCheck, Bell
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
// dashboard = product concepts, not mock claims (sample/demo data only)
const DASH_METRICS = [
  { label: 'REVENUE', value: '$4.28M', accent: true },
  { label: 'OPEN ORDERS', value: '128' },
  { label: 'PENDING APPROVALS', value: '17' },
];

// floating feature pills on the right — Business Operating System modules
const PILLS = [
  { title: 'Finance & ERP', sub: 'Finance to operations', icon: <Landmark size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'Sales & CRM', sub: 'Lead to cash', icon: <TrendingUp size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'HR & Payroll', sub: 'People & payroll', icon: <UsersRound size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'Supply Chain', sub: 'Procure to pay', icon: <Truck size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
  { title: 'POS', sub: 'Retail & restaurant', icon: <ShoppingBag size={18} />, bg: 'linear-gradient(180deg, #f0883e 0%, #e2601f 50%, #d6461a 100%)' },
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

// Industries carousel — text comes from en.json, icons/gradients here.
const INDUSTRIES = [
  { key: 'fin', title: 'Finance', desc: 'Run finance with greater visibility and control.', link: 'Explore Finance', icon: <CircleDollarSign size={26} />, grad: 'linear-gradient(165deg, #cb8c1f 0%, #8b5b10 100%)' },
  { key: 'sc', title: 'Supply Chain', desc: 'Connect purchasing, suppliers, inventory, and warehouses.', link: 'Explore Supply Chain', icon: <Package size={26} />, grad: 'linear-gradient(165deg, #b14a2f 0%, #6f2b19 100%)' },
  { key: 'crm', title: 'Sales & CRM', desc: 'Manage customer relationships from lead to order.', link: 'Explore Sales & CRM', icon: <TrendingUp size={26} />, grad: 'linear-gradient(165deg, #c85a1e 0%, #17406f 100%)' },
  { key: 'hcm', title: 'HCM', desc: 'Manage people, payroll, attendance, and performance.', link: 'Explore HCM', icon: <Users size={26} />, grad: 'linear-gradient(165deg, #6c50b2 0%, #3f3082 100%)' },
  { key: 'proj', title: 'Projects', desc: 'Keep project work, resources, costs, and billing connected.', link: 'Explore Projects', icon: <FolderKanban size={26} />, grad: 'linear-gradient(165deg, #d9722a 0%, #114e87 100%)' },
  { key: 'mfg', title: 'Manufacturing', desc: 'Connect production planning with materials and costs.', link: 'Explore Manufacturing', icon: <Factory size={26} />, grad: 'linear-gradient(150deg, #4f46e5 0%, #06b6d4 100%)' },
  { key: 'pos', title: 'POS', desc: 'Connect every sale with inventory and operations.', link: 'Explore POS', icon: <Store size={26} />, grad: 'linear-gradient(150deg, #0ea5e9 0%, #22c55e 100%)' },
  { key: 'einv', title: 'E-Invoicing', desc: 'Manage electronic invoicing and ZATCA compliance.', link: 'Explore E-Invoicing', icon: <FileCheck size={26} />, grad: 'linear-gradient(150deg, #8b5cf6 0%, #ec4899 100%)' },
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
        el.scrollBy({ left: 284, behavior: 'smooth' });
      }
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const scrollTiles = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * 284, behavior: 'smooth' });
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
            {t('agenticHero.headline1', 'Run Your Entire Business on')}{' '}
            <span className="ah-grad">{t('agenticHero.headline2', 'One Connected Platform.')}</span>
          </h1>
          <p className="ah-sub">
            {t('agenticHero.subtitle', 'The enterprise AI platform for HR, finance, IT and operations — unified across 42 countries, powered by autonomous agents that solve problems, not just report them.')}
          </p>
          <div className="ah-btns">
            <a href="#demo" className="btn-get-started">
              {t('agenticHero.requestDemo', 'Request a Demo')}
              <span className="arrow-circle"><ArrowRight size={14} color="#fff" /></span>
            </a>
            <a href="#products" className="cta-btn-primary">
              {t('agenticHero.secondaryCta', 'Explore the Platform')}
              <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
            </a>
          </div>
        </div>

        {/* right — dashboard card + floating pills */}
        <div className="ah-visual ah-visual-complex">
          
          {/* Connector Lines & Dots */}
          <svg className="ah-connectors" viewBox="0 0 800 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {/* Supply Chain */}
            <line x1="400" y1="40" x2="400" y2="110" className="ah-conn-line ah-dot-blue" />
            <circle cx="400" cy="110" r="4" className="ah-dot-blue" />
            
            {/* HCM */}
            <line x1="160" y1="60" x2="160" y2="130" className="ah-conn-line ah-dot-purple" />
            <circle cx="160" cy="130" r="4" className="ah-dot-purple" />
            
            {/* CRM */}
            <line x1="640" y1="60" x2="640" y2="140" className="ah-conn-line ah-dot-green" />
            <circle cx="640" cy="140" r="4" className="ah-dot-green" />

            {/* Projects */}
            <line x1="160" y1="580" x2="160" y2="440" className="ah-conn-line ah-dot-orange" />
            <circle cx="160" cy="440" r="4" className="ah-dot-orange" />
            
            {/* POS */}
            <line x1="400" y1="620" x2="400" y2="520" className="ah-conn-line ah-dot-blue" />
            <circle cx="400" cy="520" r="4" className="ah-dot-blue" />
            
            {/* E-Invoicing */}
            <line x1="640" y1="580" x2="640" y2="440" className="ah-conn-line ah-dot-pink" />
            <circle cx="640" cy="440" r="4" className="ah-dot-pink" />
          </svg>

          {/* BACKGROUND CARDS (Layer 1) */}
          <div className="ah-mock-card ah-card-left">
            <div className="ah-mock-header">
              <span className="ah-mock-logo"><CircleDollarSign size={16} color="#6c50b2" /> HCM</span>
            </div>
            <div className="ah-mock-body">
              <div className="ah-mock-sidebar">
                <div className="ah-mock-nav"><LayoutGrid size={12} /> Dashboard</div>
                <div className="ah-mock-nav active"><Users size={12} /> Employees</div>
                <div className="ah-mock-nav"><Clock size={12} /> Attendance</div>
                <div className="ah-mock-nav"><Check size={12} /> Leave</div>
                <div className="ah-mock-nav"><Wallet size={12} /> Payroll</div>
              </div>
              <div className="ah-mock-main">
                <h4 className="ah-mock-title">Employees</h4>
                <div className="ah-mock-table">
                  <div className="ah-mock-row">
                    <div className="ah-mock-avatar bg-blue">AK</div>
                    <div className="ah-mock-txt">Arun Kumar</div>
                  </div>
                  <div className="ah-mock-row">
                    <div className="ah-mock-avatar bg-purple">FH</div>
                    <div className="ah-mock-txt">Fatima Al-Harbi</div>
                  </div>
                  <div className="ah-mock-row">
                    <div className="ah-mock-avatar bg-green">RS</div>
                    <div className="ah-mock-txt">Rahul Sharma</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ah-mock-card ah-card-right">
            <div className="ah-mock-header">
              <span className="ah-mock-logo"><TrendingUp size={16} color="#10b981" /> CRM</span>
            </div>
            <div className="ah-mock-body">
              <div className="ah-mock-main">
                <h4 className="ah-mock-title">Sales Orders</h4>
                <div className="ah-mock-table ah-mock-table-full">
                  <div className="ah-mock-th"><span>Amount</span><span>Status</span></div>
                  <div className="ah-mock-tr"><span>$18,240</span><span className="ah-mock-badge bg-green">Confirmed</span></div>
                  <div className="ah-mock-tr"><span>$12,600</span><span className="ah-mock-badge bg-orange">Pending</span></div>
                  <div className="ah-mock-tr"><span>$8,870</span><span className="ah-mock-badge bg-blue">Delivered</span></div>
                  <div className="ah-mock-tr"><span>$7,120</span><span className="ah-mock-badge bg-green">Confirmed</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CARD (Layer 2) */}
          <div className="ah-mock-card ah-card-center">
            <div className="ah-mock-header ah-header-main">
              <span className="ah-mock-logo main-logo"><CircleDollarSign size={20} color="#f2853f" /> Finance</span>
              <div className="ah-mock-actions">
                <Search size={14} />
                <Bell size={14} />
                <div className="ah-mock-avatar-small"></div>
              </div>
            </div>
            <div className="ah-mock-body">
              <div className="ah-mock-sidebar main-sidebar">
                <div className="ah-mock-nav active"><LayoutGrid size={14} /> Dashboard</div>
                <div className="ah-mock-nav"><CircleDollarSign size={14} /> Finance</div>
                <div className="ah-mock-nav"><Landmark size={14} /> Banking</div>
                <div className="ah-mock-nav"><ArrowRight size={14} /> Payables</div>
                <div className="ah-mock-nav"><ArrowRight size={14} /> Receivables</div>
                <div className="ah-mock-nav"><BarChart3 size={14} /> Reports</div>
              </div>
              <div className="ah-mock-main main-content">
                <div className="ah-mock-kpi">
                  <span className="ah-kpi-label">Total Revenue</span>
                  <div className="ah-kpi-val">
                    <b>$4.28M</b>
                    <span className="ah-kpi-trend up">+12.6%</span>
                  </div>
                </div>
                
                <div className="ah-mock-chart">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path d="M0,50 Q20,40 40,50 T80,30 T120,40 T160,10 L200,20 L200,60 L0,60 Z" fill="url(#blue-grad)" />
                    <path d="M0,50 Q20,40 40,50 T80,30 T120,40 T160,10 L200,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <defs>
                      <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="ah-mock-kpi">
                  <span className="ah-kpi-label">Cash Position</span>
                  <div className="ah-kpi-val">
                    <b>$1.92M</b>
                    <span className="ah-kpi-trend up">+8.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING PILLS (Layer 3) */}
          <div className="ah-float-pill pill-top">
            <Package size={14} color="#3b82f6" />
            <span>Supply Chain</span>
          </div>
          <div className="ah-float-pill pill-tl">
            <UserRound size={14} color="#8b5cf6" />
            <span>HCM</span>
          </div>
          <div className="ah-float-pill pill-tr">
            <TrendingUp size={14} color="#10b981" />
            <span>CRM</span>
          </div>
          <div className="ah-float-pill pill-bl">
            <FolderKanban size={14} color="#f59e0b" />
            <span>Projects</span>
          </div>
          <div className="ah-float-pill pill-bottom">
            <Store size={14} color="#3b82f6" />
            <span>POS</span>
          </div>
          <div className="ah-float-pill pill-br">
            <FileCheck size={14} color="#ec4899" />
            <span>E-Invoicing</span>
          </div>

        </div>
      </div>
    </section>

    {/* Hidden per user request for now */}
    {false && (
    <section className="ah-tiles-section ah-dark" id="industries">
      <div className="ah-industries-wrap">
        <div className="ah-tiles-head">
          <div className="ah-tiles-head-text">
            <span className="ah-tiles-eyebrow">{t('agenticHero.applicationsEyebrow', 'APPLICATIONS')}</span>
            <h2 className="ah-tiles-title">
              {t('agenticHero.tilesTitle1', 'Applications Built to Run')}{' '}
              <span className="ah-grad">{t('agenticHero.tilesTitle2', 'Every Part of Your Business.')}</span>
            </h2>
            <p className="ah-tiles-sub">
              {t('agenticHero.applicationsSub', 'From financials and supply chain to people, projects, POS, compliance, and automation, explore the applications that connect everyday operations across your business.')}
            </p>
          </div>
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
            /* The slot holds the size and never moves — the card lifts inside
               it, so :hover can't be lost when the card slides up. */
            <div key={ind.key} className="ind-slot">
              <div className="ind-card" style={{ backgroundImage: ind.grad }}>
                <span className="ind-ic">{ind.icon}</span>
                <div className="ind-body">
                  <h3 className="ind-title">{ind.title}</h3>
                  <p className="ind-desc">{ind.desc}</p>
                  <a href={`#${ind.key}`} className="ind-link">
                    {ind.link}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    )}
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
            title="Discover the Platform"
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
