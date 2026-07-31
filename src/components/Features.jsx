import React from 'react';
import { CircleDollarSign, TrendingUp, Users, Package, BarChart3, FolderKanban, Factory, Store, FileCheck, Blocks, Workflow, ArrowRight, HardHat, ShoppingBag, Truck, Briefcase, Wrench, HeartPulse, Building2, Utensils } from 'lucide-react';
import './Features.css';

/* Emvive applications (Master Document §4 / §6). Each app carries its own
   accent colour; `rgb` is the same colour as a raw triple so the CSS can
   build translucent tints from it. */
const FEATURES = [
  { id: 1, icon: HardHat, title: 'Construction & Engineering', color: '#cb8c1f', rgb: '203, 140, 31', desc: 'Connect projects, procurement, workforce, costs, and finance.', points: ['Project Costing', 'Subcontractor Management', 'Bill of Quantities (BOQ)', 'Equipment Tracking', 'Progress Billing'], link: 'Explore Construction & Engineering' },
  { id: 2, icon: ShoppingBag, title: 'Retail & Commerce', color: '#b14a2f', rgb: '177, 74, 47', desc: 'Connect POS, inventory, purchasing, people, and finance.', points: ['Point of Sale (POS)', 'Inventory Optimization', 'Customer Loyalty', 'Multi-Store Management', 'E-commerce Integration'], link: 'Explore Retail & Commerce' },
  { id: 3, icon: Factory, title: 'Manufacturing', color: '#c85a1e', rgb: '200, 90, 30', desc: 'Connect production, inventory, procurement, sales, and finance.', points: ['Production Planning', 'Bill of Materials (BOM)', 'Shop Floor Control', 'Quality Management', 'Equipment Maintenance'], link: 'Explore Manufacturing' },
  { id: 4, icon: Truck, title: 'Supply Chain & Distribution', color: '#6c50b2', rgb: '108, 80, 178', desc: 'Connect suppliers, stock, customer orders, invoicing, and finance.', points: ['Warehouse Management', 'Fleet Tracking', 'Vendor Portals', 'Order Fulfillment', 'Demand Forecasting'], link: 'Explore Supply Chain & Distribution' },
  { id: 5, icon: Briefcase, title: 'Professional Services', color: '#d9722a', rgb: '217, 114, 42', desc: 'Connect projects, people, customers, expenses, and billing.', points: ['Time & Expense Tracking', 'Resource Scheduling', 'Project Profitability', 'Client Billing', 'Contract Management'], link: 'Explore Professional Services' },
  { id: 6, icon: Wrench, title: 'Field Service Management', color: '#4f46e5', rgb: '79, 70, 229', desc: 'Connect scheduling, technicians, assets, billing, and finance.', points: ['Technician Dispatch', 'Mobile Work Orders', 'Route Optimization', 'Service Contracts', 'Warranty Management'], link: 'Explore Field Service Management' },
  { id: 7, icon: HeartPulse, title: 'Healthcare', color: '#0ea5e9', rgb: '14, 165, 233', desc: 'Connect patients, staff, inventory, billing, and compliance.', points: ['Patient Records', 'Clinic Scheduling', 'Medical Inventory', 'Billing & Claims', 'Compliance Management'], link: 'Explore Healthcare' },
  { id: 8, icon: Building2, title: 'Real Estate & Property', color: '#ec4899', rgb: '236, 72, 153', desc: 'Connect properties, leasing, tenants, payments, and finance.', points: ['Lease Management', 'Tenant Portals', 'Facility Maintenance', 'Rent Collection', 'Contract Renewals'], link: 'Explore Real Estate & Property' },
  { id: 9, icon: Utensils, title: 'Hospitality & Restaurants', color: '#f97316', rgb: '249, 115, 22', desc: 'Connect POS, inventory, staff, bookings, and finance.', points: ['Table Management', 'Recipe Costing', 'Kitchen Display', 'Reservations', 'Staff Scheduling'], link: 'Explore Hospitality & Restaurants' },
];

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

      <span className="feature-ic">
        <Icon size={34} strokeWidth={1.4} />
      </span>

      <div className="feature-body">
        <h3 className="feature-card-title">{feature.title}</h3>
        <p className="feature-card-desc">{feature.desc}</p>
        <ul className="feature-points">
          {feature.points.map((pt, i) => (
            <li key={pt} style={{ '--i': i }}>
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
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
  const colored = variant === 'color';
  const solid = variant === 'solid';

  const sectionClass = `features-section${
    solid ? ' features-section--solid' : colored ? ' features-section--color' : ''
  }`;

  return (
    <section className={sectionClass} id={id}>
      <div className="features-container">
        <div className="features-header">
          <div className="features-header-text">
            <span className="features-kicker">INDUSTRIES</span>
            <h2 className="features-heading">
              Built for the way{' '}
              <span className="text-accent">your industry works.</span>
            </h2>
            <p className="features-sub">
              Different industries have different processes, priorities and operational demands. We bring the business functions behind them into a connected platform designed to support everyday operations.
            </p>
          </div>
          <a href="#products" className="features-cta">
            Explore All Applications
            <Arrow />
          </a>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} variant={variant} />
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
