import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Globe, ChevronDown, ShoppingCart, Calculator, Truck, Activity, FileText, Users, Settings, Box, CheckCircle, Package, PenTool, BarChart2, X, Moon, Sun, Menu } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

import { getMegaMenuData } from '../data/megaMenuData';

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
                <div key={item} className="nav-item">
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
        <div className="mega-menu-wrapper infor-mega-wrapper">
          <div className="infor-mega-layout">
            
            {/* Column 1: SOLUTIONS */}
            <div className="infor-column">
              <h3 className="infor-col-header">SOLUTIONS</h3>
              <ul className="infor-list">
                {productKeys.map((tab, pIdx) => (
                  <li key={tab}>
                    <button
                      className={`infor-list-btn ${activeProductIndex === pIdx ? 'active' : ''}`}
                      onMouseEnter={() => {
                        setActiveProductIndex(pIdx);
                        setActiveIndustryIndex(0);
                      }}
                      onClick={() => {
                        setActiveProductIndex(pIdx);
                        setActiveIndustryIndex(0);
                      }}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
              <a href="#all-solutions" className="infor-all-link">
                All solutions &rarr;
              </a>
            </div>

            {/* Column 2: FEATURED PRODUCTS */}
            <div className="infor-column">
              <h3 className="infor-col-header">FEATURED PRODUCTS</h3>
              <ul className="infor-list">
                {(() => {
                  // Flatten modules from all industries under the active category
                  const modules = [];
                  Object.values(activeProductData).forEach(ind => {
                    if (ind.modules) modules.push(...ind.modules);
                  });
                  return modules.slice(0, 8).map((mod, i) => (
                    <li key={i}>
                      <button
                        className="infor-list-btn"
                        onClick={() => {
                          if (mod.id === 'retail-inventory' || mod.title === 'Inventory for Retail & POS' || mod.title === t('megaMenu.retail.inventory', "Inventory for Retail & POS")) {
                            navigate('/products/retail-inventory');
                            setOpenNav(null);
                          }
                        }}
                      >
                        {mod.title}
                      </button>
                    </li>
                  ));
                })()}
              </ul>
              <a href="#all-products" className="infor-all-link">
                All products &rarr;
              </a>
            </div>

            {/* Column 3: NO CODE MACHINE */}
            <div className="infor-column">
              <h3 className="infor-col-header">NO CODE MACHINE</h3>
              <ul className="infor-list">
                <li><button className="infor-list-btn">Emvive Studio</button></li>
                <li><button className="infor-list-btn">Emvive Flow</button></li>
                <li><button className="infor-list-btn">Integration Layer</button></li>
                <li><button className="infor-list-btn">Security</button></li>
              </ul>
              <a href="#all-platforms" className="infor-all-link">
                All platforms &rarr;
              </a>
            </div>

            {/* Column 3: PORTALS */}
            <div className="infor-column">
              <h3 className="infor-col-header">PORTALS</h3>
              <ul className="infor-list">
                <li>
                  <button className="infor-list-btn">
                    Vendor Portal
                  </button>
                </li>
                <li>
                  <button className="infor-list-btn">
                    Customer Portal
                  </button>
                </li>
                <li>
                  <button className="infor-list-btn">
                    Employee Portal (ESS)
                  </button>
                </li>
              </ul>
              <a href="#all-portals" className="infor-all-link">
                All portals &rarr;
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
