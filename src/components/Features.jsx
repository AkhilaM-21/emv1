import React from 'react';
import { CircleDollarSign, TrendingUp, Users, Package, BarChart3, FolderKanban, Factory, Store, FileCheck, Blocks, Workflow, ArrowRight } from 'lucide-react';
import './Features.css';

/* Emvive applications (Master Document §4 / §6). Each app carries its own
   accent colour; `rgb` is the same colour as a raw triple so the CSS can
   build translucent tints from it. */
const FEATURES = [
  {
    id: 1, icon: CircleDollarSign, title: 'Emvive Financials', color: '#7c3aed', rgb: '124, 58, 237',
    desc: 'Run finance with greater visibility and control.',
    points: ['General Ledger', 'Accounts Payable & Receivable', 'Cash & Bank Management', 'Fixed Assets', 'Budgeting & Forecasting'],
    link: 'Explore Financials',
  },
  {
    id: 2, icon: Package, title: 'Emvive Supply Chain', color: '#0891b2', rgb: '8, 145, 178',
    desc: 'Connect purchasing, suppliers, inventory, and warehouses.',
    points: ['Procurement Management', 'Vendor Management', 'Inventory Control', 'Warehouse Management', 'Demand Planning'],
    link: 'Explore Supply Chain',
  },
  {
    id: 3, icon: TrendingUp, title: 'Emvive Sales & CRM', color: '#059669', rgb: '5, 150, 105',
    desc: 'Manage customer relationships from lead to order.',
    points: ['Leads & Opportunities', 'Quotations', 'Sales Orders', 'Pricing & Discounts', 'Customer Management'],
    link: 'Explore Sales & CRM',
  },
  {
    id: 4, icon: Users, title: 'Emvive HCM', color: '#2563eb', rgb: '37, 99, 235',
    desc: 'Manage people, payroll, attendance, and performance.',
    points: ['Core HR & Payroll', 'Attendance & Leave', 'EOSB & GOSI', 'Employee Self-Service', 'Performance & Appraisals'],
    link: 'Explore HCM',
  },
  {
    id: 5, icon: FolderKanban, title: 'Emvive Projects', color: '#d97706', rgb: '217, 119, 6',
    desc: 'Keep project work, resources, costs, and billing connected.',
    points: ['Project Planning & WBS', 'Task Management', 'Resource Allocation', 'Budget Tracking', 'Time & Expense Tracking'],
    link: 'Explore Projects',
  },
  {
    id: 6, icon: Factory, title: 'Emvive Manufacturing', color: '#be123c', rgb: '190, 18, 60',
    desc: 'Connect production planning with materials and costs.',
    points: ['Bill of Materials', 'Production Orders', 'Shop Floor Control', 'Material Consumption', 'Production Costing'],
    link: 'Explore Manufacturing',
  },
  {
    id: 7, icon: Store, title: 'Emvive POS', color: '#9333ea', rgb: '147, 51, 234',
    desc: 'Connect every sale with inventory and operations.',
    points: ['Fast Billing', 'Offline Mode', 'Barcode Scanning', 'Multi-Branch POS', 'Real-Time Inventory Sync'],
    link: 'Explore POS',
  },
  {
    id: 8, icon: FileCheck, title: 'Emvive E-Invoicing', color: '#0d9488', rgb: '13, 148, 136',
    desc: 'Manage electronic invoicing and ZATCA compliance.',
    points: ['Electronic Invoices', 'QR Code Generation', 'XML / JSON Formats', 'Digital Signatures', 'ZATCA Phase 1 & 2'],
    link: 'Explore E-Invoicing',
  },
  {
    id: 9, icon: Blocks, title: 'Emvive Studio', color: '#ec4899', rgb: '236, 72, 153',
    desc: 'Build business applications around your processes.',
    points: ['Drag-and-Drop Builder', 'Custom Forms', 'Tables & Relationships', 'UI Designer'],
    link: 'Explore Studio',
  },
  {
    id: 10, icon: Workflow, title: 'Emvive Flow', color: '#4f46e5', rgb: '79, 70, 229',
    desc: 'Automate approvals and everyday business processes.',
    points: ['Workflow Automation', 'Approval Chains', 'Event Triggers'],
    link: 'Explore Flow',
  },
  {
    id: 11, icon: BarChart3, title: 'Emvive Insights', color: '#e2601f', rgb: '226, 96, 31',
    desc: 'Turn operational data into business visibility.',
    points: ['Financial Dashboards', 'Sales Analytics', 'POS Analytics', 'Inventory Insights', 'Custom Report Builder'],
    link: 'Explore Insights',
  },
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
            <span className="features-kicker">APPLICATIONS</span>
            <h2 className="features-heading">
              Applications Built to Run{' '}
              <span className="text-accent">Every Part of Your Business.</span>
            </h2>
            <p className="features-sub">
              From financials and supply chain to people, projects, POS, compliance, and automation, explore the Emvive applications that connect everyday operations across your business.
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
