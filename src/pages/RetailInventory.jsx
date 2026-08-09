import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, BarChart2, Truck, RefreshCcw, ShieldCheck, Box, Package, Check, ArrowRight, Diamond, Gem, Hexagon } from 'lucide-react';
import Clients from '../components/sections/Clients';
import './RetailInventory.css';

// A custom hook for triggering animations when elements scroll into view
const useReveal = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach((reveal) => observer.observe(reveal));
    return () => observer.disconnect();
  }, []);
};

const ACCORDION_DATA = [
  {
    title: 'Connect & Discover',
    desc: "Once connected, the platform's first mission is discovery — automatically syncing with your POS systems, eCommerce platforms, and warehouses. Within minutes, you can map out your entire stock ecosystem and identify discrepancies before they impact customers.",
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Identify Shrinkage & Risks',
    desc: 'Inventory discrepancies can be buried deep, obscured by miscounts, delayed vendor shipments, and returns. The platform digs through the layers to map out interdependencies and oversights to identify exactly where stock is leaking.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800&h=600'
  },
  {
    title: 'Automate Remediation',
    desc: 'Stop manually counting and ordering. The system automatically generates Purchase Orders when stock dips below critical thresholds and routes them to the correct suppliers, keeping your business operations uninterrupted.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800&h=600'
  }
];

const RetailInventory = () => {
  const { t } = useTranslation();
  useReveal();
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const CYCLE_DURATION = 5000; // 5 seconds per item

  // Auto-cycle through accordion items
  useEffect(() => {
    const startCycle = () => {
      setProgress(0);
      // Progress bar animation
      progressRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + (100 / (CYCLE_DURATION / 50));
        });
      }, 50);

      // Switch to next item
      timerRef.current = setTimeout(() => {
        setActiveSection(prev => (prev + 1) % ACCORDION_DATA.length);
      }, CYCLE_DURATION);
    };

    startCycle();

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [activeSection]);

  const handleAccordionClick = (idx) => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setActiveSection(idx);
    setProgress(0);
  };

  const features = [
    {
      icon: <Box size={24} />,
      title: 'Unified Stock Levels',
      desc: 'Connect your POS, eCommerce, and warehouses into one centralized, real-time inventory ledger.',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      icon: <RefreshCcw size={24} />,
      title: 'Automated Restocking',
      desc: 'Set minimum thresholds and let the system automatically generate POs when stock runs low.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      icon: <BarChart2 size={24} />,
      title: 'Demand Forecasting',
      desc: 'Use historical sales data across all channels to predict future inventory needs accurately.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      icon: <ShoppingCart size={24} />,
      title: 'Omnichannel Ready',
      desc: 'Never oversell again. Instantly sync stock deductions across physical stores and online marketplaces.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      icon: <Truck size={24} />,
      title: 'Supplier Portal',
      desc: 'Give your vendors secure access to update delivery statuses and acknowledge automated POs.',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Loss Prevention',
      desc: 'Track shrink, damages, and returns with detailed audit logs and role-based permissions.',
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=400&h=250'
    }
  ];

  const STATS = [
    { brand: 'Reliance Retail', number: '92%', desc: 'LESS TIME SPENT ON STOCK AUDITS' },
    { brand: 'Landmark Group', number: '10%', desc: 'NRR INCREASE' },
    { brand: 'Lulu Hypermarket', number: '1%', desc: 'HIGHER NRR IN YEAR 1' },
    { brand: "Spencer's", number: '34%', desc: 'MORE EFFICIENCY PER MANAGER' },
    { brand: 'DMart', number: '+300', desc: 'HOURS SAVED ANNUALLY PER PERSON' },
    { brand: 'Metro Cash & Carry', number: '21%', desc: 'LESS SHRINKAGE' },
  ];

  return (
    <div className="retail-inventory-page">
      {/* PRODUCT SUB-NAV (Zoho Vertical Studio style) */}
      <div className="ri-subnav">
        <div className="ri-subnav-inner">
          <a href="#top" className="ri-subnav-brand">
            <span className="ri-subnav-icon"><Package size={20} /></span>
            <span className="ri-subnav-name">{t('retail.title', 'Retail Inventory')}</span>
          </a>
          <nav className="ri-subnav-links">
            <a href="#ri-features">{t('retail.nav.features', 'Features')}</a>
            <a href="#ri-pricing">{t('retail.nav.pricing', 'Pricing')}</a>
          </nav>
        </div>
      </div>

      {/* HERO SECTION (Dropship.io Style) */}
      <section className="ri-hero dropship-style">
        <div className="ri-hero-content reveal">
          <div className="ri-hero-badge">{t('retail.hero.badge', 'Inventory for Retail & POS 2.0 is live!')}</div>
          <h1><span>{t('retail.hero.titleHighlight', 'Rooting Out')}</span> {t('retail.hero.titleMain', 'Stockouts in Your Retail Operations')}</h1>
          <p>
            {t('retail.hero.desc', 'Secure your supply chain and manage your inventory from a single platform. Real-time stock tracking tailored specifically for fast-paced Retail environments.')}
          </p>
          <div className="ri-hero-actions">
            <a href="#demo" className="ri-btn-secondary">
              {t('retail.hero.cta', 'Book a Demo')}
              <span className="arrow-circle">
                <ArrowRight size={14} color="#fff" />
              </span>
            </a>
          </div>
        </div>

        {/* Continuous Scrolling Cards & Central Line */}
        <div className="ri-hero-graphics" dir="ltr">

          {/* ROW 1 */}
          <div className="card-row row-1">
            <div className="card-track">
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={`r1-${setIdx}`}>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fde68a' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c1_name', 'Kids ATM Bank')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $34.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$128,450.70</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 16%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#f8cba6' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c2_name', 'Mini Drone')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $39.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$301,540.62</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 8.5%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fecaca' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c3_name', 'Wine Dispenser')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $19.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$72,614.22</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 9.8%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#d9f99d' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c4_name', 'Portable Warmer')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $26.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$54,320.18</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 4.2%</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="card-row row-2">
            <div className="card-track">
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={`r2-${setIdx}`}>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#f7c8a3' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c5_name', 'Galaxy Projector')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $32.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$421,766.24</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 18.4%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fbcfe8' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c6_name', 'Hair Straightener')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $29.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$74,632.40</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 2.1%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#e2e8f0' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c7_name', 'Moon Lamp')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $24.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$187,290.10</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 11.5%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fed7aa' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c8_name', 'LED Strip')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $14.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$12,732.88</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 5.4%</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ROW 3 */}
          <div className="card-row row-3">
            <div className="card-track">
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={`r3-${setIdx}`}>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fca5a5' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c9_name', 'Mosquito Slapper')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $29.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$42,432.12</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 18.7%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#f6c39c' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c10_name', 'Popcorn Maker')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $34.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$81,273.16</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 12%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#bbf7d0' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c11_name', 'Mini Sealing Machine')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $12.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$117,904.33</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 6.3%</span>
                  </div>
                  <div className="product-card">
                    <div className="pc-avatar" style={{ background: '#fde68a' }}></div>
                    <div className="pc-info">
                      <span className="pc-name">{t('retail.demoCards.c12_name', 'Car Humidifier')}</span>
                      <span className="pc-price">{t('retail.demoCards.price', 'Price')} $22.99</span>
                    </div>
                    <div className="pc-revenue">
                      <span className="pc-amount">$164,872.50</span>
                      <span className="pc-label">{t('retail.demoCards.revenue', 'Revenue')}</span>
                    </div>
                    <span className="pc-badge up">↗ 8.1%</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Skeleton Overlay (clips left half to show wireframes) */}
          <div className="skeleton-overlay">
            {[1, 2, 3].map(row => (
              <div className={`skel-row skel-row-${row}`} key={row}>
                <div className="skel-track">
                  {[...Array(8)].map((_, i) => (
                    <div className="skel-card" key={i}>
                      <div className="skel-circle"></div>
                      <div className="skel-lines">
                        <div className="skel-line long"></div>
                        <div className="skel-line short"></div>
                      </div>
                      <div className="skel-lines">
                        <div className="skel-line long"></div>
                        <div className="skel-line short"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* The glowing central line */}
          <div className="central-line-container">
            <div className="central-line"></div>
            <div className="central-icon-wrapper">
              <Box size={28} color="#fff" />
            </div>
            <div className="central-line-bottom"></div>
          </div>
        </div>
      </section>



      {/* ACCORDION + IMAGE SECTION */}
      <section className="ri-accordion-section reveal">
        <div className="ri-accordion-container">

          {/* LEFT: Image */}
          <div className="ri-accordion-image">
            {ACCORDION_DATA.map((item, idx) => (
              <img
                key={idx}
                src={item.image}
                alt={item.title}
                className={`acc-img ${activeSection === idx ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* RIGHT: Accordion */}
          <div className="ri-accordion-list">
            {ACCORDION_DATA.map((item, idx) => (
              <div
                key={idx}
                className={`ri-accordion-item ${activeSection === idx ? 'active' : ''}`}
                onClick={() => handleAccordionClick(idx)}
              >
                <div className="acc-header">
                  <h3>{t(`retail.accordionData.${idx}.title`, item.title)}</h3>
                  <span className="acc-toggle">{activeSection === idx ? '−' : '+'}</span>
                </div>
                <div className="acc-body">
                  <p>{t(`retail.accordionData.${idx}.desc`, item.desc)}</p>
                  {/* Progress bar */}
                  <div className="acc-progress-bar">
                    <div
                      className="acc-progress-fill"
                      style={{ width: activeSection === idx ? `${progress}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* STATS SECTION in Dark Background Marquee Style */}
      <section className="neurox-clients-section">
        <div className="nc-dark-bg" style={{ paddingBottom: '8rem', paddingTop: '10rem' }}>

          {/* Top Cutout */}
          <div className="nc-top-cutout">
            <div className="nc-top-cutout-inner">
              <span className="nc-top-cutout-text">{t('retail.stats', 'SUCCESS METRICS')}</span>
            </div>
          </div>

          {/* Diagonal Stripes Background */}
          <div className="nc-stripes"></div>

          {/* Stats Marquee */}
          <div className="nc-marquee-container">
            <div className="nc-marquee-track">
              {[...STATS, ...STATS, ...STATS].map((stat, idx) => (
                <div className="nc-logo-card stat-marquee-card" key={idx}>
                  <div className="nc-logo-content stat-card-content">
                    <span className="stat-brand">{t(`retail.statsData.${idx % STATS.length}.brand`, stat.brand)}</span>
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-desc">{t(`retail.statsData.${idx % STATS.length}.desc`, stat.desc)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="ri-features" id="ri-features">
        <div className="ri-features-container reveal">
          <div className="ri-features-header" style={{ textAlign: 'center' }}>
            <span className="global-section-badge"><span className="global-badge-dot"></span> {t('retail.nav.features', 'Features')}</span>
            <h2 className="global-section-title">{t('retail.features.title', 'Everything you need for Retail Inventory')}</h2>
          </div>
          <div className="ri-features-grid">
            {features.map((feature, idx) => (
              <div className="ri-feature-card" key={idx}>
                <div className="ri-feature-img-wrapper">
                  <div className="ri-light-sweep"></div>
                  <img src={feature.image} alt={feature.title} className="ri-feature-img" />
                </div>
                <div className="ri-feature-content">
                  <div className="ri-feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{t(`retail.featureCards.${idx}.title`, feature.title)}</h3>
                  <p>{t(`retail.featureCards.${idx}.desc`, feature.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="ri-pricing" id="ri-pricing">
        <div className="ri-pricing-container reveal">
          <div className="ri-pricing-header" style={{ textAlign: 'center' }}>
            <span className="global-section-badge"><span className="global-badge-dot"></span> {t('retail.pricing.badge', 'Pricing')}</span>
            <h2 className="global-section-title">{t('retail.pricing.title', 'Simple pricing for every retail team')}</h2>
            <p>{t('retail.pricing.subtitle', 'Start free, scale as you grow. No hidden fees — cancel anytime.')}</p>
            
            <div className="ri-billing-toggle-wrapper">
              <span className={`ri-toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
              
              <div className={`ri-simple-toggle ${isAnnual ? 'annual' : 'monthly'}`} onClick={() => setIsAnnual(!isAnnual)}>
                <div className="ri-toggle-circle"></div>
              </div>
              
              <span className={`ri-toggle-label ${isAnnual ? 'active' : ''}`}>
                Annually <span className="ri-save-badge">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="ri-pricing-grid">
            {[
              {
                name: 'Starter',
                Icon: Diamond,
                price: '$0',
                period: isAnnual ? '/yr' : '/mo',
                desc: 'For single-store retailers getting started.',
                features: ['1 store location', 'Up to 500 SKUs', 'Real-time stock tracking', 'Email support'],
                cta: 'Start Free',
                featured: false,
              },
              {
                name: 'Growth',
                Icon: Gem,
                price: isAnnual ? '$468' : '$49',
                period: isAnnual ? '/yr' : '/mo',
                desc: 'For growing multi-store retail operations.',
                features: ['Up to 10 stores', 'Unlimited SKUs', 'Shrinkage & risk alerts', 'Vendor management', 'Priority support'],
                cta: 'Start Free Trial',
                featured: true,
              },
              {
                name: 'Enterprise',
                Icon: Hexagon,
                price: 'Custom',
                period: '',
                desc: 'For large chains with advanced needs.',
                features: ['Unlimited stores', 'Advanced automation', 'Dedicated success manager', 'SSO & audit logs', '24/7 support'],
                cta: 'Contact Sales',
                featured: false,
              },
            ].map((plan, idx) => (
              <div className={`ri-price-card ${plan.featured ? 'featured' : ''}`} key={idx}>
                {plan.featured && <span className="ri-price-badge">{t('retail.pricing.popular', 'Most Popular')}</span>}
                <span className="ri-price-icon"><plan.Icon size={22} /></span>
                <h3 className="ri-price-name">{t(`retail.pricing.p${idx}_name`, plan.name)}</h3>
                <div className="ri-price-amount">
                  <span className="ri-price-value">{t(`retail.pricing.p${idx}_price`, plan.price)}</span>
                  <span className="ri-price-period">{t(`retail.pricing.p${idx}_period`, plan.period)}</span>
                </div>
                <p className="ri-price-desc">{t(`retail.pricing.p${idx}_desc`, plan.desc)}</p>
                <ul className="ri-price-features">
                  {plan.features.map((f, i) => (
                    <li key={i}><Check size={16} /> {t(`retail.pricing.p${idx}_f${i}`, f)}</li>
                  ))}
                </ul>
                <a href="#demo" className="ri-price-cta">{t(`retail.pricing.p${idx}_cta`, plan.cta)}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default RetailInventory;
