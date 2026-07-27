import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Globe, ChevronDown, ShoppingCart, Calculator, Truck, Activity, FileText, Users, Settings, Box, CheckCircle, Package, PenTool, BarChart2, X, Moon, Sun, Menu,
  Cloud, TrendingUp, BarChart3, Workflow, Blocks, CircleDollarSign, Store, Factory, Receipt, Handshake, ClipboardCheck, LayoutGrid, Plug, ShieldCheck, UserCheck, Layers, ArrowUpRight,
  Boxes, Puzzle, Zap, Sparkles, PackageCheck, Database, MousePointerClick, KeyRound, Filter, Webhook, Smartphone, Globe2, Lock, Briefcase,
  HardHat, Wrench, HeartPulse, Building2, Utensils } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

import { getMegaMenuData } from '../data/megaMenuData';

/* Icon + colour + one-line description per mega-menu entry, keyed by its
   label. Each tile carries its own accent colour so the menu isn't all
   orange. Unknown labels get a varied icon/colour picked deterministically
   from the title (see megaMeta), so dynamic data is never boring or blank. */
const MEGA_META = {
  'Cloud ERP': { icon: Cloud, sub: 'Finance, supply chain & operations', color: '#2563eb' },
  'ERP': { icon: Cloud, sub: 'Finance, supply chain & operations', color: '#2563eb' },
  'HR & Payroll': { icon: Users, sub: 'People, payroll & compliance', color: '#0d9488' },
  'CRM & Sales': { icon: TrendingUp, sub: 'Pipeline to cash', color: '#7c3aed' },
  'Advanced Reporting': { icon: BarChart3, sub: 'Dashboards & insights', color: '#db2777' },
  'Workflow Automation': { icon: Workflow, sub: 'Approvals & triggers', color: '#0891b2' },
  'Low-Code App Builder': { icon: Blocks, sub: 'Build without code', color: '#e2601f' },
  'Inventory for Retail & POS': { icon: ShoppingCart, sub: 'Stock & point of sale', color: '#2563eb' },
  'Financial Management': { icon: CircleDollarSign, sub: 'Ledgers, cash & assets', color: '#059669' },
  'Supply Chain': { icon: Truck, sub: 'Procure to pay', color: '#d97706' },
  'Advanced POS': { icon: Store, sub: 'Multi-branch retail', color: '#7c3aed' },
  'Invoicing & Billing': { icon: Receipt, sub: 'E-invoicing & tax', color: '#0891b2' },
  'Vendor Portal': { icon: Handshake, sub: 'Supplier collaboration', color: '#4f46e5' },
  'Production Planning': { icon: Factory, sub: 'BOM & shop floor', color: '#be123c' },
  'Quality Control': { icon: ClipboardCheck, sub: 'Inspections & compliance', color: '#0d9488' },
  'Data Connections': { icon: Database, sub: 'Connect any source', color: '#2563eb' },
  'Drag-and-Drop UI': { icon: MousePointerClick, sub: 'Visual builder', color: '#7c3aed' },
  'Role-Based Logic': { icon: KeyRound, sub: 'Permissions & rules', color: '#0d9488' },
  'Advanced Filtering': { icon: Filter, sub: 'Slice any data', color: '#db2777' },
  'Workflow Hooks': { icon: Webhook, sub: 'Event triggers', color: '#0891b2' },
  'SSO Integration': { icon: Lock, sub: 'Single sign-on', color: '#4f46e5' },
  'Mobile Optimized': { icon: Smartphone, sub: 'Works on any device', color: '#d97706' },
  'Custom Domains': { icon: Globe2, sub: 'Your own URL', color: '#059669' },
  'Emvive Studio': { icon: LayoutGrid, sub: 'Drag & drop builder', color: '#7c3aed' },
  'Emvive Flow': { icon: Workflow, sub: 'Workflow automation', color: '#0891b2' },
  'Integration Layer': { icon: Plug, sub: 'APIs & webhooks', color: '#e2601f' },
  'Security': { icon: ShieldCheck, sub: 'Roles & audit logs', color: '#4f46e5' },
  'Customer Portal': { icon: UserCheck, sub: 'Orders & payments', color: '#0d9488' },
  'Employee Portal (ESS)': { icon: Users, sub: 'Self-service for staff', color: '#db2777' },
  'Vendor Portal ': { icon: Handshake, sub: 'Supplier collaboration', color: '#2563eb' },
  /* real Emvive modules surfaced under Featured Products (master document §4/§8) */
  'Sales & CRM': { icon: TrendingUp, sub: '', color: '#7c3aed' },
  'Retail & POS': { icon: ShoppingCart, sub: '', color: '#2563eb' },
  'Manufacturing': { icon: Factory, sub: '', color: '#be123c' },
  'Projects': { icon: Briefcase, sub: '', color: '#4f46e5' },
  'E-Invoicing': { icon: Receipt, sub: '', color: '#0891b2' },
  'Analytics & Reporting': { icon: BarChart3, sub: '', color: '#db2777' },
  'HR & Payroll': { icon: Users, sub: '', color: '#0d9488' },
  /* industries (§ hero list) */
  'Construction & Engineering': { icon: HardHat, sub: '', color: '#d97706' },
  'Retail & Commerce': { icon: ShoppingCart, sub: '', color: '#be123c' },
  'Supply Chain & Distribution': { icon: Truck, sub: '', color: '#7c3aed' },
  'Professional Services': { icon: Briefcase, sub: '', color: '#2563eb' },
  'Field Service Management': { icon: Wrench, sub: '', color: '#0d9488' },
  'Healthcare': { icon: HeartPulse, sub: '', color: '#0891b2' },
  'Real Estate & Property': { icon: Building2, sub: '', color: '#4f46e5' },
  'Hospitality & Restaurants': { icon: Utensils, sub: '', color: '#e2601f' },
};

/* Static mega-menu lists (no hover-driven swapping). Products keep the
   original Solutions list — only the interactivity changed, not the items. */
const MEGA_PRODUCTS = [
  'ERP', 'HR & Payroll', 'CRM & Sales',
  'Advanced Reporting', 'Workflow Automation', 'Emvive Studio',
];
const MEGA_CORE_APPS = [
  'Construction & Engineering', 'Retail & Commerce', 'Manufacturing',
  'Supply Chain & Distribution', 'Professional Services', 'Field Service Management',
  'Healthcare', 'Real Estate & Property', 'Hospitality & Restaurants',
];

/* deterministic pools for any label not in the map above */
const FALLBACK_ICONS = [Boxes, Puzzle, Plug, LayoutGrid, Workflow, ShieldCheck, Zap, Sparkles, PackageCheck, FileText, Database, Filter];
const FALLBACK_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#db2777', '#0d9488', '#d97706', '#4f46e5', '#059669', '#9333ea', '#be123c'];
const hashStr = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const megaMeta = (title) => {
  if (MEGA_META[title]) return MEGA_META[title];
  const h = hashStr(title || '');
  return {
    icon: FALLBACK_ICONS[h % FALLBACK_ICONS.length],
    color: FALLBACK_COLORS[h % FALLBACK_COLORS.length],
    sub: '',
  };
};

/* One tile row: icon chip · title + subtitle · trailing arrow.
   The tile's accent colour rides on the --mc custom property. */
const MegaItem = ({ title, active, onEnter, onClick, noSub }) => {
  const { icon: Icon, sub, color } = megaMeta(title);
  return (
    <button
      className={`mega-item ${active ? 'active' : ''}`}
      style={{ '--mc': color }}
      onMouseEnter={onEnter}
      onClick={onClick}
    >
      <span className="mega-item-ic"><Icon size={23} strokeWidth={1.9} /></span>
      <span className="mega-item-txt">
        <span className="mega-item-title">{title}</span>
      </span>
      <ArrowUpRight size={15} className="mega-item-arrow" aria-hidden="true" />
    </button>
  );
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // The home hero is dark; every other route has a light background, so the
  // header must be solid (dark logo/nav) there from the top.
  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'region' | 'lang' | null
  const [region, setRegion] = useState('india'); // Store region key
  const [lang, setLang] = useState(i18n.language || 'en');
  const [openNav, setOpenNav] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const NAV_ITEMS = [
    { key: 'Products', label: t('header.nav.products', 'Products') },
    { key: 'Enterprise', label: t('header.nav.enterprises', 'Enterprise') },
    { key: 'Customers', label: t('header.nav.customers', 'Customers') },
    { key: 'Partners', label: t('header.nav.partners', 'Partners') },
    { key: 'Resources', label: t('header.nav.resources', 'Resources') }
  ];

  const REGIONS = [
    { key: 'india', label: t('header.regions.india', 'India') },
    { key: 'saudi', label: t('header.regions.saudi', 'Saudi Arabia') },
    { key: 'dubai', label: t('header.regions.dubai', 'Dubai') }
  ];

  const LANGUAGES = [
    { key: 'en', label: 'English' },
    { key: 'ar', label: 'العربية' }
  ];

  const MEGA_MENU_DATA = getMegaMenuData(t);

  // Apply / persist the dark theme
  useEffect(() => {
    const stored = localStorage.getItem('emvive-theme');
    if (stored === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark-theme', next);
      localStorage.setItem('emvive-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Mega Menu State
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);
  
  // Compute active data based on indices (safe for i18n key swaps)
  const productKeys = Object.keys(MEGA_MENU_DATA);
  const activeProductTab = productKeys[activeProductIndex] || productKeys[0];
  const activeProductData = MEGA_MENU_DATA[activeProductTab] || {};
  const industryKeys = Object.keys(activeProductData);
  const activeIndustryTab = industryKeys[activeIndustryIndex] || industryKeys[0];
  const activeIndustryData = activeProductData[activeIndustryTab] || {};
  
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Turn the whole nav solid-white once we've scrolled past the hero
      setIsScrolled(window.scrollY > window.innerHeight - 120);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, []);

  const toggle = (menu) => setOpenMenu((prev) => (prev === menu ? null : menu));

  /* Hover-intent for the mega menu (Infor-style): open on nav hover, and
     close on a short delay so the pointer can cross the gap into the panel
     without it snapping shut. The panel cancels the pending close on enter. */
  const megaCloseTimer = useRef(null);
  const openMega = (item) => {
    clearTimeout(megaCloseTimer.current);
    setOpenNav(item);
  };
  const scheduleMegaClose = () => {
    clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => setOpenNav(null), 160);
  };
  const cancelMegaClose = () => clearTimeout(megaCloseTimer.current);

  return (
    <header className={`neurox-header ${isScrolled || openNav || mobileOpen || !isHome ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <div className="header-pill">

          {/* Logo (click → home) — now lives inside the pill */}
          <Link
            to="/"
            className="header-logo"
            onClick={() => {
              setOpenNav(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="#FF6B6B" strokeWidth="2" strokeLinejoin="round"/>
               <path d="M16 8L8 13V19L16 24L24 19V13L16 8Z" stroke="#4ECDC4" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span className="logo-text">Emvive</span>
          </Link>

          <nav className="header-nav">
            {NAV_ITEMS.map((itemObj) => {
              const item = itemObj.key;
              const label = itemObj.label;
              const isOpen = openNav === item;
              const hasMegaMenu = item === 'Products';
              
              return (
                <div
                  key={item}
                  className="nav-item"
                  onMouseEnter={() => (hasMegaMenu ? openMega(item) : scheduleMegaClose())}
                  onMouseLeave={hasMegaMenu ? scheduleMegaClose : undefined}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => {
                      if (hasMegaMenu) {
                        e.preventDefault();
                        setOpenNav(isOpen ? null : item);
                      }
                    }}
                  >
                    {label}
                  </a>
                  <button
                    className={`nav-toggle ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenNav(isOpen ? null : item)}
                    aria-label={`${isOpen ? 'Close' : 'Open'} ${label} menu`}
                    aria-expanded={isOpen}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="header-actions" ref={actionsRef}>
            <div className="selector-wrap">
              <button
                className="selector-btn"
                onClick={() => toggle('region')}
                aria-expanded={openMenu === 'region'}
              >
                <MapPin size={16} />
                {REGIONS.find(r => r.key === region)?.label}
                <ChevronDown size={14} className={`selector-caret ${openMenu === 'region' ? 'flip' : ''}`} />
              </button>

              {openMenu === 'region' && (
                <div className="dropdown">
                  <div className="dropdown-title">Region</div>
                  {REGIONS.map((r) => (
                    <button
                      key={r.key}
                      className={`dropdown-row ${region === r.key ? 'active' : ''}`}
                      onClick={() => { 
                        setRegion(r.key); 
                        setOpenMenu(null);
                        // Force arabic if dubai or saudi is selected
                        if (r.key === 'dubai' || r.key === 'saudi') {
                          setLang('ar');
                          i18n.changeLanguage('ar');
                        } else {
                          setLang('en');
                          i18n.changeLanguage('en');
                        }
                      }}
                    >
                      <MapPin size={16} />
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="selector-wrap">
              <button
                className="selector-btn"
                onClick={() => toggle('lang')}
                aria-expanded={openMenu === 'lang'}
              >
                <Globe size={16} />
                {LANGUAGES.find(l => l.key === lang)?.label}
                <ChevronDown size={14} className={`selector-caret ${openMenu === 'lang' ? 'flip' : ''}`} />
              </button>

              {openMenu === 'lang' && (
                <div className="dropdown">
                  <div className="dropdown-title">Language</div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.key}
                      className={`dropdown-row ${lang === l.key ? 'active' : ''}`}
                      onClick={() => { 
                        setLang(l.key);
                        i18n.changeLanguage(l.key);
                        setOpenMenu(null); 
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#started" className="btn-get-started">
              {t('header.getStarted', 'Get Started')}
              <span className="arrow-circle">
                <ArrowRight size={14} color="#fff" />
              </span>
            </a>

            {/* Hamburger — only visible on tablet/mobile */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

      </div>

      {/* MOBILE NAV PANEL */}
      {mobileOpen && (
        <div className="mobile-nav">
          <nav className="mobile-nav-links">
            {NAV_ITEMS.map((itemObj) => {
              const item = itemObj.key;

              // Products expands into a mobile version of the mega menu
              if (item === 'Products') {
                return (
                  <div key={item} className="mobile-nav-group">
                    <button
                      className={`mobile-nav-link-btn ${mobileProductsOpen ? 'open' : ''}`}
                      onClick={() => setMobileProductsOpen((o) => !o)}
                      aria-expanded={mobileProductsOpen}
                    >
                      {itemObj.label}
                      <ChevronDown size={18} className="mobile-nav-caret" />
                    </button>

                    {mobileProductsOpen && (
                      <div className="mobile-mega">
                        {/* Product categories */}
                        <div className="mobile-mega-tabs">
                          {productKeys.map((tab, pIdx) => (
                            <button
                              key={tab}
                              className={`mobile-mega-tab ${activeProductIndex === pIdx ? 'active' : ''}`}
                              onClick={() => {
                                setActiveProductIndex(pIdx);
                                setActiveIndustryIndex(0);
                              }}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Industries for the active category */}
                        <div className="mobile-mega-industries">
                          {industryKeys.map((ind, iIdx) => (
                            <button
                              key={ind}
                              className={`mobile-mega-ind ${activeIndustryIndex === iIdx ? 'active' : ''}`}
                              onClick={() => setActiveIndustryIndex(iIdx)}
                            >
                              {ind}
                            </button>
                          ))}
                        </div>

                        {/* Modules for the active industry */}
                        {activeIndustryData.modules && (
                          <div className="mobile-mega-modules">
                            {activeIndustryData.modules.map((mod, i) => {
                              const Icon = mod.icon;
                              return (
                                <div
                                  key={i}
                                  className="mobile-module-card"
                                  onClick={() => {
                                    // Use a stable identifier or check if the title matches either language
                                    if (mod.id === 'retail-inventory' || mod.title === 'Inventory for Retail & POS' || mod.title === t('megaMenu.retail.inventory', "Inventory for Retail & POS")) {
                                      navigate('/products/retail-inventory');
                                      setMobileOpen(false);
                                    }
                                  }}
                                >
                                  <div className="module-icon"><Icon size={20} /></div>
                                  <div className="module-text">
                                    <h3>{mod.title}</h3>
                                    <p>{mod.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {itemObj.label}
                </a>
              );
            })}
          </nav>

          <div className="mobile-nav-selectors">
            <div className="mobile-select-group">
              <span className="mobile-select-label">Region</span>
              <div className="mobile-chip-row">
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    className={`mobile-chip ${region === r.key ? 'active' : ''}`}
                    onClick={() => {
                      setRegion(r.key);
                      if (r.key === 'dubai' || r.key === 'saudi') {
                        setLang('ar');
                        i18n.changeLanguage('ar');
                      } else {
                        setLang('en');
                        i18n.changeLanguage('en');
                      }
                    }}
                  >
                    <MapPin size={15} />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-select-group">
              <span className="mobile-select-label">Language</span>
              <div className="mobile-chip-row">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.key}
                    className={`mobile-chip ${lang === l.key ? 'active' : ''}`}
                    onClick={() => {
                      setLang(l.key);
                      i18n.changeLanguage(l.key);
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a
            href="#started"
            className="btn-get-started mobile-get-started"
            onClick={() => setMobileOpen(false)}
          >
            {t('header.getStarted', 'Get Started')}
            <span className="arrow-circle">
              <ArrowRight size={14} color="#fff" />
            </span>
          </a>
        </div>
      )}

      {/* PRODUCTS MEGA MENU - INFOR STYLE */}
      {openNav === 'Products' && (
        <div
          className="mega-menu-wrapper infor-mega-wrapper"
          onMouseEnter={cancelMegaClose}
          onMouseLeave={scheduleMegaClose}
        >
          <div className="infor-mega-layout">

            {/* Column 1: SOLUTIONS — original list, now static (no hover swap) */}
            <div className="infor-column">
              <h3 className="infor-col-header">Business Suites</h3>
              <div className="mega-items">
                {MEGA_PRODUCTS.map((title) => (
                  <MegaItem key={title} title={title} noSub onClick={() => setOpenNav(null)} />
                ))}
              </div>
              <a href="#all-solutions" className="infor-all-link">
                All solutions <ArrowRight size={15} />
              </a>
            </div>

            {/* Column 2: INDUSTRIES — static list */}
            <div className="infor-column">
              <h3 className="infor-col-header">Industries</h3>
              <div className="mega-items">
                {MEGA_CORE_APPS.map((title) => (
                  <MegaItem key={title} title={title} noSub onClick={() => setOpenNav(null)} />
                ))}
              </div>
              <a href="#industries" className="infor-all-link" onClick={() => setOpenNav(null)}>
                All industries <ArrowRight size={15} />
              </a>
            </div>

            {/* Column 3: PLATFORM & BUILDER */}
            <div className="infor-column">
              <h3 className="infor-col-header">Platform & Builder</h3>
              <div className="mega-items">
                <MegaItem title="Emvive Studio" />
                <MegaItem title="Emvive Flow" />
              </div>
              <a href="#all-platforms" className="infor-all-link">
                All platforms <ArrowRight size={15} />
              </a>
            </div>

            {/* Column 4: PORTALS */}
            <div className="infor-column">
              <h3 className="infor-col-header">Digital Portals</h3>
              <div className="mega-items">
                <MegaItem title="Vendor Portal" />
                <MegaItem title="Customer Portal" />
                <MegaItem title="Employee Portal (ESS)" />
              </div>
              <a href="#all-portals" className="infor-all-link">
                All portals <ArrowRight size={15} />
              </a>
            </div>

          </div>

        </div>
      )}

    </header>
  );
};

export default Header;
