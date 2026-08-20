import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleDollarSign, TrendingUp, Users, Package, BarChart3, FolderKanban, Factory, Store, FileCheck, Blocks, Workflow, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, HardHat, ShoppingBag, Truck, Briefcase, Wrench, HeartPulse, Building2, Utensils } from 'lucide-react';
import './Features.css';
import './Industries.css';

/* Emvive applications (Master Document §4 / §6). Each app carries its own
   accent colour; `rgb` is the same colour as a raw triple so the CSS can
   build translucent tints from it. */
const FEATURES = [
  { id: 1, icon: HardHat, title: 'Construction & Engineering', color: '#cb8c1f', rgb: '203, 140, 31', desc: 'Connect projects, procurement, workforce, costs, and finance.', points: ['Project Costing', 'Subcontractor Management', 'Bill of Quantities (BOQ)', 'Equipment Tracking', 'Progress Billing'], link: 'Explore Construction & Engineering', img: '/images/industries/industry_construction_1787246641858.jpg' },
  { id: 2, icon: ShoppingBag, title: 'Retail & Commerce', color: '#b14a2f', rgb: '177, 74, 47', desc: 'Connect POS, inventory, purchasing, people, and finance.', points: ['Point of Sale (POS)', 'Inventory Optimization', 'Customer Loyalty', 'Multi-Store Management', 'E-commerce Integration'], link: 'Explore Retail & Commerce', img: '/images/industries/industry_retail_1787246653414.jpg' },
  { id: 3, icon: Factory, title: 'Manufacturing', color: '#c85a1e', rgb: '200, 90, 30', desc: 'Connect production, inventory, procurement, sales, and finance.', points: ['Production Planning', 'Bill of Materials (BOM)', 'Shop Floor Control', 'Quality Management', 'Equipment Maintenance'], link: 'Explore Manufacturing', img: '/images/industries/industry_manufacturing_1787246666617.jpg' },
  { id: 4, icon: Truck, title: 'Supply Chain & Distribution', color: '#6c50b2', rgb: '108, 80, 178', desc: 'Connect suppliers, stock, customer orders, invoicing, and finance.', points: ['Warehouse Management', 'Fleet Tracking', 'Vendor Portals', 'Order Fulfillment', 'Demand Forecasting'], link: 'Explore Supply Chain & Distribution', img: '/images/industries/industry_supply_chain_1787246679383.jpg' },
  { id: 5, icon: Briefcase, title: 'Professional Services', color: '#d9722a', rgb: '217, 114, 42', desc: 'Connect projects, people, customers, expenses, and billing.', points: ['Time & Expense Tracking', 'Resource Scheduling', 'Project Profitability', 'Client Billing', 'Contract Management'], link: 'Explore Professional Services', img: '/images/industries/industry_prof_services_1787246694178.jpg' },
  { id: 6, icon: Wrench, title: 'Field Service Management', color: '#4f46e5', rgb: '79, 70, 229', desc: 'Connect scheduling, technicians, assets, billing, and finance.', points: ['Technician Dispatch', 'Mobile Work Orders', 'Route Optimization', 'Service Contracts', 'Warranty Management'], link: 'Explore Field Service Management', img: '/images/industries/industry_field_service_1787246705897.jpg' },
  { id: 7, icon: HeartPulse, title: 'Healthcare', color: '#0ea5e9', rgb: '14, 165, 233', desc: 'Connect patients, staff, inventory, billing, and compliance.', points: ['Patient Records', 'Clinic Scheduling', 'Medical Inventory', 'Billing & Claims', 'Compliance Management'], link: 'Explore Healthcare', img: '/images/industries/industry_healthcare_1787246719364.jpg' },
  { id: 8, icon: Building2, title: 'Real Estate & Property', color: '#ec4899', rgb: '236, 72, 153', desc: 'Connect properties, leasing, tenants, payments, and finance.', points: ['Lease Management', 'Tenant Portals', 'Facility Maintenance', 'Rent Collection', 'Contract Renewals'], link: 'Explore Real Estate & Property', img: '/images/industries/industry_real_estate_1787246732258.jpg' }
];

/* =====================================================================
   INDUSTRIES — a card carousel

   The shape is Microsoft's "Featured news" strip on the Dynamics 365
   home page: eyebrow and heading on the left, the controls on their own
   line under the heading (prev arrow, a row of slide indicators, next
   arrow), then a horizontally scrolling track of borderless cards —
   a rounded media panel on top, then title, body, and a link whose
   round arrow sits before its text.

   Three cards to a view on desktop, two at tablet, one-and-a-peek on a
   phone. The track is a real scroll container with snap points, so a
   trackpad swipe works and the arrows are an alternative rather than
   the only way through.
   ===================================================================== */

const useCarousel = (count) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  /* One card plus one gap, taken from the live layout rather than the
     stylesheet, so the arrows keep stepping correctly through every
     breakpoint. */
  const stepOf = (track) => {
    const cards = track.children;
    if (cards.length < 2) return track.clientWidth;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  };

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepOf(track);
    setIndex(step ? Math.round(track.scrollLeft / step) : 0);
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return undefined;
    const ro = new ResizeObserver(sync);
    ro.observe(track);
    return () => ro.disconnect();
  }, [sync, count]);

  /* scrollTo clamps at the ends by itself, so a click on one of the
     last indicators lands on the final view instead of overshooting —
     the scroll handler then reports the position it actually reached. */
  const goTo = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: Math.max(0, i) * stepOf(track), behavior: 'smooth' });
  }, []);

  return { trackRef, index, atEnd, sync, goTo };
};

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const FeatureCard = ({ feature, variant }) => {
  const Icon = feature.icon;
  const colored = variant === 'color';
  const solid = variant === 'solid';

  const cardStyle = colored ? { '--fc': feature.color, '--fc-rgb': feature.rgb } : undefined;

  return (
    <div className="feature-card" style={cardStyle}>
      {!solid && (
        <div className="feature-media" aria-hidden="true">
          <span className="feature-media-light" />
          <Icon size={150} className="feature-media-icon" />
        </div>
      )}

      {/* photo banner, with the industry's icon on its top-left corner */}
      <div className="feature-photo">
        <img src={feature.img} alt="" loading="lazy" decoding="async" />
        <span className="feature-photo-wash" aria-hidden="true" />

        <span className="feature-ic">
          <Icon size={22} strokeWidth={2} />
        </span>

      </div>

      <div className="feature-body">
        <h3 className="feature-card-title">{feature.title}</h3>
        <p className="feature-card-desc">{feature.desc}</p>
        <ul className="feature-points">
          {feature.points.map((pt, i) => (
            <li key={pt} style={{ '--i': i }}>
              <CheckCircle2 size={16} strokeWidth={2.6} aria-hidden="true" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="feature-link">
        {feature.link}
        <Arrow />
      </span>
    </div>
  );
};

const Features = ({ variant = 'mono', id = 'features' }) => {
  const solid = variant === 'solid';
  const colored = variant === 'color';

  const sectionClass = `features-section ind-section${
    solid ? ' features-section--solid' : colored ? ' features-section--color' : ''
  }`;

  const { trackRef, index, atEnd, sync, goTo } = useCarousel(FEATURES.length);

  return (
    <section className={sectionClass} id={id}>
      <div className="features-container">
        <header className="ind-head">
          <div className="ind-head-text">
            <span className="ind-eyebrow">Industries</span>
            <h2 className="ind-heading">
              Built for the way{' '}
              <span className="text-accent">your industry works.</span>
            </h2>
            <p className="ind-sub">
              Different industries have different processes, priorities and operational demands.
              We bring the business functions behind them into a connected platform designed to
              support everyday operations.
            </p>
          </div>

          {/* the site's shared section pill (.section-cta in index.css) —
              same control the Resources and Products sections use */}
          <a href="#products" className="section-cta">
            Explore all applications
            <ArrowRight size={16} />
          </a>
        </header>

        <div className="features-grid ind-track" ref={trackRef} onScroll={sync}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} variant={variant} />
          ))}
        </div>

        <div className="ind-controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous industries"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            className="carousel-arrow"
            onClick={() => goTo(index + 1)}
            disabled={atEnd}
            aria-label="Next industries"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;
