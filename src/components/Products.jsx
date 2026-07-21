import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Zap, Users, LineChart, PieChart, GitMerge, FileCheck, Search,
  LayoutDashboard, Briefcase, Headphones, Folder, Handshake,
  MessageSquare, Settings, LogOut, ChevronDown, Bell, User,
  CheckCircle, Clock, ArrowRight, ChevronLeft, ChevronRight, Package,
  Factory, ShoppingCart, Truck, Boxes, HardHat, HeartPulse, GraduationCap,
  Building2, Hotel, HeartHandshake, Home, Landmark, ShoppingBag, Cloud,
  Cpu, RadioTower, Megaphone, Server, Clapperboard, Cog, Scale, Calculator,
  IdCard, BarChart3, Workflow, ReceiptText, Database, Target, Waypoints,
  Network, BadgeDollarSign, TrendingUp
} from 'lucide-react';

// Icon per target-industry (reference style pills)
const INDUSTRY_ICONS = {
  Manufacturing: Factory, Retail: ShoppingCart, Logistics: Truck, Wholesale: Boxes,
  Construction: HardHat, Healthcare: HeartPulse, Education: GraduationCap,
  Corporate: Building2, Hospitality: Hotel, 'Non-Profit': HeartHandshake,
  'Real Estate': Home, Finance: Landmark, 'E-commerce': ShoppingBag, Consulting: Briefcase,
  SaaS: Cloud, Technology: Cpu, Telecom: RadioTower, Government: Landmark,
  Marketing: Megaphone, Energy: Zap, 'IT Services': Server, Media: Clapperboard,
  Operations: Cog, Legal: Scale, 'Customer Support': Headphones, Accounting: Calculator,
  'B2B Trade': Handshake, Freelance: User, 'Supply Chain': Truck,
};
import './Products.css';

const productsList = [
  {
    id: 1,
    title: 'Cloud ERP',
    description: 'A comprehensive, scalable Enterprise Resource Planning solution that integrates all your core business processes in real-time. Unify your financials, supply chain, operations, and commerce.',
    industries: ['Manufacturing', 'Retail', 'Logistics', 'Wholesale', 'Construction'],
    icon: <Database size={22} color="#fff" />
  },
  {
    id: 2,
    title: 'HR & Payroll',
    description: 'Streamline your human resources management and payroll processing. Automate employee onboarding, attendance tracking, and ensure accurate, timely compensation.',
    industries: ['Healthcare', 'Education', 'Corporate', 'Hospitality', 'Non-Profit'],
    icon: <Users size={22} color="#fff" />
  },
  {
    id: 3,
    title: 'CRM & Sales',
    description: 'Build stronger customer relationships and drive sales growth. Track interactions, manage pipelines, and leverage actionable insights to close deals faster.',
    industries: ['Real Estate', 'Finance', 'E-commerce', 'Consulting', 'SaaS'],
    icon: <TrendingUp size={22} color="#fff" />
  },
  {
    id: 4,
    title: 'Advanced Reporting',
    description: 'Transform your raw data into meaningful intelligence. Create custom dashboards, visualize trends, and make data-driven decisions with powerful analytics.',
    industries: ['Technology', 'Telecom', 'Government', 'Marketing', 'Energy'],
    icon: <BarChart3 size={22} color="#fff" />
  },
  {
    id: 5,
    title: 'Workflow Automation',
    description: 'Eliminate manual tasks and optimize business efficiency. Design custom workflows that automatically route approvals, trigger actions, and reduce human error.',
    industries: ['IT Services', 'Media', 'Operations', 'Legal', 'Customer Support'],
    icon: <Network size={22} color="#fff" />
  },
  {
    id: 6,
    title: 'E-Invoicing',
    description: 'Secure, compliant, and seamless electronic invoicing. Digitize your billing process, track invoice statuses, and integrate directly with your financial systems.',
    industries: ['Accounting', 'B2B Trade', 'Freelance', 'Supply Chain', 'Legal'],
    icon: <ReceiptText size={22} color="#fff" />
  }
];

const CountUp = ({ end, duration = 2000, prefix='', suffix='', inView, isFloat=false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(ease * end);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return (
    <span>
      {prefix}
      {isFloat ? (count).toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
};

const DashboardWindow = ({ title, sidebarItems, children, inView }) => {
  const { t } = useTranslation();
  return (
  <div className={`detailed-dashboard ${inView ? 'is-visible' : ''}`}>
    <div className="dd-sidebar">
      <div className="dd-logo">
        <div className="dd-logo-icon"></div>
        <span>{title}</span>
      </div>
      <nav className="dd-nav">
        {sidebarItems.map((item, i) => (
          <div key={i} className={`dd-nav-item ${i===0 ? 'active':''}`}>{item.icon} {item.label}</div>
        ))}
      </nav>
      <div className="dd-sidebar-footer">
        <div className="dd-nav-item"><Settings size={14} /> {t('products.dash.settings', 'Settings')}</div>
      </div>
    </div>
    <div className="dd-main">
      <header className="dd-header">
        <div className="dd-header-title">{t('products.dash.dashboard', 'Dashboard')} <span>/{t('products.dash.overview', 'Overview')}</span></div>
        <div className="dd-header-actions">
          <button className="dd-icon-btn"><Bell size={14} /></button>
          <div className="dd-profile">
            <div className="dd-avatar"><User size={12} /></div>
          </div>
        </div>
      </header>
      <div className="dd-content">
        {children}
      </div>
    </div>
  </div>
  );
};

const DashboardERP = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.erp.title', 'Cloud ERP')} inView={inView} sidebarItems={[{icon: <LayoutDashboard size={14}/>, label: t('products.dash.overview', 'Overview')}, {icon: <Briefcase size={14}/>, label: t('products.dash.erp.resources', 'Resources')}, {icon: <Folder size={14}/>, label: t('products.dash.erp.inventory', 'Inventory')}]}>
    <div className="db-grid erp-grid">
      <div className="db-card stat"><div className="lbl">{t('products.dash.erp.globalRevenue', 'Global Revenue')}</div><div className="val"><CountUp end={1.2} isFloat={true} prefix="$" suffix="M" inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.erp.activeSupplyNodes', 'Active Supply Nodes')}</div><div className="val text-blue"><CountUp end={342} inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.erp.operationsEfficiency', 'Operations Efficiency')}</div><div className="val text-green"><CountUp end={94} suffix="%" inView={inView} /></div></div>
      <div className="db-card main-chart">
        <h4>{t('products.dash.erp.resourceAllocation', 'Resource Allocation (Global)')}</h4>
        <div className={`chart-bars ${inView ? 'in-view' : ''}`}>
           <div className="c-bar blue" style={{'--target-h': '60%'}}></div><div className="c-bar blue" style={{'--target-h': '80%'}}></div>
           <div className="c-bar blue" style={{'--target-h': '40%'}}></div><div className="c-bar blue" style={{'--target-h': '90%'}}></div>
           <div className="c-bar blue" style={{'--target-h': '50%'}}></div>
        </div>
      </div>
      <div className="db-card side-list">
        <h4>{t('products.dash.erp.recentShipments', 'Recent Shipments')}</h4>
        <div className="list-item"><span>#SHP-091</span><span className="badge green">{t('products.dash.delivered', 'Delivered')}</span></div>
        <div className="list-item"><span>#SHP-092</span><span className="badge orange">{t('products.dash.inTransit', 'In Transit')}</span></div>
        <div className="list-item"><span>#SHP-093</span><span className="badge orange">{t('products.dash.inTransit', 'In Transit')}</span></div>
      </div>
    </div>
  </DashboardWindow>
  );
};

const DashboardHR = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.hr.title', 'HR Hub')} inView={inView} sidebarItems={[{icon: <Users size={14}/>, label: t('products.dash.hr.employees', 'Employees')}, {icon: <FileCheck size={14}/>, label: t('products.dash.hr.payroll', 'Payroll')}, {icon: <Clock size={14}/>, label: t('products.dash.hr.timeOff', 'Time Off')}]}>
    <div className="db-grid hr-grid">
      <div className="db-card stat"><div className="lbl">{t('products.dash.hr.totalHeadcount', 'Total Headcount')}</div><div className="val"><CountUp end={1402} inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.hr.onLeaveToday', 'On Leave Today')}</div><div className="val text-orange"><CountUp end={24} inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.hr.nextPayroll', 'Next Payroll')}</div><div className="val text-blue">Oct 15</div></div>
      <div className="db-card roster">
        <h4>{t('products.dash.hr.recentHires', 'Recent Hires')}</h4>
        <div className="avatar-list">
           <div className="av-row"><div className="av"></div><div className="av-info"><b>Sarah J.</b><span>{t('products.dash.dept.engineering', 'Engineering')}</span></div></div>
           <div className="av-row"><div className="av"></div><div className="av-info"><b>Mike T.</b><span>{t('products.dash.dept.marketing', 'Marketing')}</span></div></div>
           <div className="av-row"><div className="av"></div><div className="av-info"><b>Elena R.</b><span>{t('products.dash.dept.sales', 'Sales')}</span></div></div>
        </div>
      </div>
      <div className="db-card payroll-chart">
        <h4>{t('products.dash.hr.salaryDistribution', 'Salary Distribution')}</h4>
        <div className={`donut-wrap ${inView ? 'in-view' : ''}`}>
          <svg viewBox="0 0 100 100" className="mini-donut">
             <circle className="d-layer l1" cx="50" cy="50" r="40" stroke="#1e3a8a" strokeWidth="15" fill="none" strokeDasharray="180 300" strokeDashoffset="300"/>
             <circle className="d-layer l2" cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="15" fill="none" strokeDasharray="60 300" strokeDashoffset="300"/>
             <circle className="d-layer l3" cx="50" cy="50" r="40" stroke="#2b4fb0" strokeWidth="15" fill="none" strokeDasharray="30 300" strokeDashoffset="300"/>
          </svg>
        </div>
      </div>
    </div>
  </DashboardWindow>
  );
};

const DashboardCRM = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.crm.title', 'CRM Pro')} inView={inView} sidebarItems={[{icon: <LineChart size={14}/>, label: t('products.dash.crm.pipeline', 'Pipeline')}, {icon: <Handshake size={14}/>, label: t('products.dash.crm.deals', 'Deals')}, {icon: <MessageSquare size={14}/>, label: t('products.dash.crm.inbox', 'Inbox')}]}>
    <div className="db-grid crm-grid">
      <div className="db-card stat"><div className="lbl">{t('products.dash.crm.winRate', 'Win Rate')}</div><div className="val text-green"><CountUp end={68} suffix="%" inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.crm.activeDeals', 'Active Deals')}</div><div className="val"><CountUp end={142} inView={inView} /></div></div>
      <div className="db-card funnel">
        <h4>{t('products.dash.crm.salesFunnel', 'Sales Funnel')}</h4>
        <div className={`funnel-chart ${inView ? 'in-view' : ''}`}>
           <div className="f-layer l1" style={{'--target-w': '100%'}}>Leads (1,200)</div>
           <div className="f-layer l2" style={{'--target-w': '80%'}}>Qualified (800)</div>
           <div className="f-layer l3" style={{'--target-w': '60%'}}>Proposal (300)</div>
           <div className="f-layer l4" style={{'--target-w': '40%'}}>Won (142)</div>
        </div>
      </div>
      <div className="db-card deal-list">
        <h4>{t('products.dash.crm.topOpportunities', 'Top Opportunities')}</h4>
        <div className="list-item"><span>Acme Corp</span><b className="text-green">$45,000</b></div>
        <div className="list-item"><span>Globex Inc</span><b className="text-green">$32,000</b></div>
        <div className="list-item"><span>Initech</span><b className="text-green">$28,500</b></div>
        <div className="list-item"><span>Soylent</span><b className="text-green">$15,000</b></div>
      </div>
    </div>
  </DashboardWindow>
  );
};

const DashboardReporting = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.reporting.title', 'Analytics')} inView={inView} sidebarItems={[{icon: <PieChart size={14}/>, label: t('products.dash.reporting.dashboards', 'Dashboards')}, {icon: <Search size={14}/>, label: t('products.dash.reporting.queries', 'Queries')}, {icon: <Folder size={14}/>, label: t('products.dash.reporting.reports', 'Reports')}]}>
    <div className="db-grid report-grid">
      <div className="db-card kpi"><div className="lbl">{t('products.dash.reporting.mrr', 'MRR')}</div><div className="val"><CountUp end={248} prefix="$" suffix="K" inView={inView} /></div><div className="line-graph blue"></div></div>
      <div className="db-card kpi"><div className="lbl">{t('products.dash.reporting.churn', 'Churn')}</div><div className="val text-orange"><CountUp end={1.2} isFloat={true} suffix="%" inView={inView} /></div><div className="line-graph orange"></div></div>
      <div className="db-card kpi"><div className="lbl">{t('products.dash.reporting.cac', 'CAC')}</div><div className="val"><CountUp end={450} prefix="$" inView={inView} /></div><div className="line-graph green"></div></div>
      <div className="db-card radar">
        <h4>{t('products.dash.reporting.marketPenetration', 'Market Penetration')}</h4>
        <div className={`radar-circle ${inView ? 'in-view' : ''}`}>
           <div className="r-line"></div><div className="r-line rot1"></div><div className="r-line rot2"></div>
           <div className="r-poly"></div>
        </div>
      </div>
      <div className="db-card bars">
        <h4>{t('products.dash.reporting.yoyGrowth', 'YoY Growth')}</h4>
        <div className={`chart-bars multi ${inView ? 'in-view' : ''}`}>
           <div className="c-bar-group"><div className="c-bar blue" style={{'--target-h': '40%'}}></div><div className="c-bar green" style={{'--target-h': '60%'}}></div></div>
           <div className="c-bar-group"><div className="c-bar blue" style={{'--target-h': '50%'}}></div><div className="c-bar green" style={{'--target-h': '70%'}}></div></div>
           <div className="c-bar-group"><div className="c-bar blue" style={{'--target-h': '60%'}}></div><div className="c-bar green" style={{'--target-h': '85%'}}></div></div>
        </div>
      </div>
    </div>
  </DashboardWindow>
  );
};

const DashboardWorkflow = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.workflow.title', 'AutoFlow')} inView={inView} sidebarItems={[{icon: <GitMerge size={14}/>, label: t('products.dash.workflow.workflows', 'Workflows')}, {icon: <CheckCircle size={14}/>, label: t('products.dash.workflow.tasks', 'Tasks')}, {icon: <LogOut size={14}/>, label: t('products.dash.workflow.integrations', 'Integrations')}]}>
    <div className="db-grid flow-grid">
      <div className="db-card header-stat">
         <div className="lbl">{t('products.dash.workflow.executed', 'Workflows Executed (24h)')}</div>
         <div className="val text-blue"><CountUp end={14204} inView={inView} /></div>
      </div>
      <div className="db-card flow-canvas">
        <h4>{t('products.dash.workflow.visualBuilder', 'Visual Builder')}</h4>
        <div className={`node-map ${inView ? 'in-view' : ''}`}>
           <div className="node trigger">{t('products.dash.workflow.webhook', 'Webhook')}</div>
           <div className="line-down"></div>
           <div className="node action">{t('products.dash.workflow.filterData', 'Filter Data')}</div>
           <div className="line-split"></div>
           <div className="node-row">
              <div className="node end blue">{t('products.dash.workflow.updateCrm', 'Update CRM')}</div>
              <div className="node end green">{t('products.dash.workflow.sendEmail', 'Send Email')}</div>
           </div>
        </div>
      </div>
    </div>
  </DashboardWindow>
  );
};

const DashboardInvoice = ({ inView }) => {
  const { t } = useTranslation();
  return (
  <DashboardWindow title={t('products.dash.invoice.title', 'InvoiceHub')} inView={inView} sidebarItems={[{icon: <FileCheck size={14}/>, label: t('products.dash.invoice.invoices', 'Invoices')}, {icon: <Users size={14}/>, label: t('products.dash.invoice.clients', 'Clients')}, {icon: <Briefcase size={14}/>, label: t('products.dash.invoice.payments', 'Payments')}]}>
    <div className="db-grid inv-grid">
      <div className="db-card stat"><div className="lbl">{t('products.dash.invoice.awaitingPayment', 'Awaiting Payment')}</div><div className="val text-orange"><CountUp end={42500} prefix="$" inView={inView} /></div></div>
      <div className="db-card stat"><div className="lbl">{t('products.dash.invoice.paidThisMonth', 'Paid (This Month)')}</div><div className="val text-green"><CountUp end={12800} prefix="$" inView={inView} /></div></div>
      <div className="db-card inv-preview">
        <div className={`inv-doc ${inView ? 'in-view' : ''}`}>
           <div className="inv-head"><b>{t('products.dash.invoice.invoiceLabel', 'INVOICE')} #1042</b><span>$4,500.00</span></div>
           <div className="inv-line"></div>
           <div className="inv-row"><span>{t('products.dash.invoice.consulting', 'Consulting')}</span><span>$2,000</span></div>
           <div className="inv-row"><span>{t('products.dash.invoice.development', 'Development')}</span><span>$2,500</span></div>
           <div className="inv-total">{t('products.dash.invoice.total', 'Total')}: $4,500.00</div>
           <div className="badge green paid-stamp">{t('products.dash.invoice.paidStamp', 'PAID')}</div>
        </div>
      </div>
      <div className="db-card inv-list">
        <h4>{t('products.dash.invoice.recentActivity', 'Recent Activity')}</h4>
        <div className="list-item"><span>#1041 (Stripe)</span><span className="badge green">{t('products.dash.paid', 'Paid')}</span></div>
        <div className="list-item"><span>#1043 (Wire)</span><span className="badge orange">{t('products.dash.pending', 'Pending')}</span></div>
        <div className="list-item"><span>#1044 (Card)</span><span className="badge orange">{t('products.dash.pending', 'Pending')}</span></div>
      </div>
    </div>
  </DashboardWindow>
  );
};

// Sparse decorative accents behind the carousel card (reference style):
// soft blurred orbs, thin outline rings, and small dot clusters.
const DotCluster = ({ x, y, rows = 4, cols = 5, gap = 11, r = 1.8, fill = '#c9d9f5' }) => {
  const dots = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push(<circle key={`${i}-${j}`} cx={x + j * gap} cy={y + i * gap} r={r} fill={fill} />);
    }
  }
  return <g opacity="0.5">{dots}</g>;
};

// Tiny 4-point sparkle particle
const Sparkle = ({ x, y, s = 6, fill = '#a9c2ee', opacity = 0.7 }) => (
  <path
    d={`M${x} ${y - s} Q ${x + s * 0.16} ${y - s * 0.16} ${x + s} ${y} Q ${x + s * 0.16} ${y + s * 0.16} ${x} ${y + s} Q ${x - s * 0.16} ${y + s * 0.16} ${x - s} ${y} Q ${x - s * 0.16} ${y - s * 0.16} ${x} ${y - s} Z`}
    fill={fill}
    opacity={opacity}
  />
);

const ProductsDecor = () => (
  <svg
    className="prod-decor-svg"
    viewBox="0 0 1200 560"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <filter id="pdGlow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="30" />
      </filter>
    </defs>

    {/* Large soft glow spheres (corners only) */}
    <circle cx="1150" cy="52" r="58" fill="#c3d4f5" opacity="0.42" filter="url(#pdGlow)" />
    <circle cx="36" cy="512" r="72" fill="#dce7fa" opacity="0.38" filter="url(#pdGlow)" />

    {/* Top-left: concentric rings (medium) */}
    <g fill="none" stroke="#c9d9f5" strokeWidth="1.2">
      <circle cx="18" cy="22" r="70" opacity="0.5" />
      <circle cx="18" cy="22" r="112" opacity="0.3" />
      <circle cx="134" cy="64" r="13" stroke="#b8ccf0" opacity="0.5" />
    </g>

    {/* Bottom-left: LARGE concentric rings (varied scale) */}
    <g fill="none" stroke="#c9d9f5" strokeWidth="1.2">
      <circle cx="52" cy="558" r="106" opacity="0.4" />
      <circle cx="52" cy="558" r="156" opacity="0.24" />
      <circle cx="52" cy="558" r="206" opacity="0.13" />
    </g>

    {/* Top-right: dotted grid texture */}
    <DotCluster x="1066" y="34" rows={5} cols={6} fill="#c9d9f5" />

    {/* Bottom-right: soft curved flowing lines */}
    <g fill="none">
      <path d="M952 560 C 1048 494 1136 520 1214 456" stroke="#c9d9f5" strokeWidth="1.2" opacity="0.5" />
      <path d="M982 560 C 1072 510 1152 532 1214 480" stroke="#b8ccf0" strokeWidth="1" opacity="0.34" />
      <path d="M1014 560 C 1096 524 1162 542 1214 502" stroke="#c9d9f5" strokeWidth="0.8" opacity="0.28" />
    </g>

    {/* A couple of tiny sparkles near corners (never the center) */}
    <Sparkle x={1036} y={150} s={6} fill="#a9c2ee" opacity={0.65} />
    <Sparkle x={168} y={150} s={5} fill="#c0d2f2" opacity={0.55} />
  </svg>
);

const DashboardWrapper = ({ product, inView }) => {
  switch(product.id) {
    case 1: return <DashboardERP inView={inView} />;
    case 2: return <DashboardHR inView={inView} />;
    case 3: return <DashboardCRM inView={inView} />;
    case 4: return <DashboardReporting inView={inView} />;
    case 5: return <DashboardWorkflow inView={inView} />;
    case 6: return <DashboardInvoice inView={inView} />;
    default: return <DashboardERP inView={inView} />;
  }
};

const Products = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const slideCount = productsList.length;

  const goPrev = () => setActiveSlide((s) => (s - 1 + slideCount) % slideCount);
  const goNext = () => setActiveSlide((s) => (s + 1) % slideCount);

  // auto-advance; any manual change restarts the dwell because the
  // effect re-runs on activeSlide
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setActiveSlide((s) => (s + 1) % slideCount), 3000);
    return () => clearTimeout(timer);
  }, [activeSlide, paused, slideCount]);

  return (
    <section id="products" className="products-section">
      <div className="container">

        {/* HEADER BLOCK FROM IMAGE */}
        <div className="emv-products-header">
          <div className="emv-subtitle">{t('products.featured.subtitle', 'FEATURED PRODUCTS')}</div>
          <h2 className="emv-headline">
            {t('products.featured.headline1', 'One platform.')} <span className="text-accent">{t('products.featured.headline2', 'Every operating layer.')}</span>
          </h2>
          <p className="emv-description">
            {t('products.featured.description', 'Six enterprise-grade applications on a single data model — from the general ledger to the customer record. No integrations to wire. No CSVs to import.')}
          </p>
        </div>

        {/* EXACT APP STUDIO GRID BLOCK FROM IMAGE */}
        <div className="emv-featured-apps-container">
          {/* Left: Purple Card */}
          <div className="emv-agent-studio-card">
            <div className="emv-new-badge">✦ {t('products.featured.newTag', 'NEW')}</div>
            <h3>{t('products.featured.introducing', 'Introducing')}<br/>{t('products.featured.agentStudio', 'Emvive Agent Studio')}</h3>
            <p>{t('products.featured.agentStudioDesc', 'Build autonomous agents that reconcile ledgers, chase invoices, draft close notes and more.')}</p>
            <a href="#agent-studio" className="emv-btn-outline-white">{t('products.featured.exploreAgentStudio', 'Explore Agent Studio')} &rarr;</a>
          </div>

          {/* Right: Apps Grid */}
          <div className="emv-apps-grid-section">
            <div className="emv-apps-header">
              <span className="emv-apps-title">{t('products.featured.featuredApps', 'FEATURED APPS')}</span>
              <a href="#all-products" className="emv-explore-all">{t('products.featured.exploreAll', 'Explore all products')} <ArrowRight size={16}/></a>
            </div>

            <div className="emv-apps-grid">
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#2b4fb0'}}><LayoutDashboard size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.0.name', 'Finance')}</h4>
                  <p>{t('products.featured.apps.0.desc', 'Multi-entity GL, consolidation & close')}</p>
                </div>
              </div>
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#2b4fb0'}}><Users size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.1.name', 'People')}</h4>
                  <p>{t('products.featured.apps.1.desc', 'Global HR & statutory payroll')}</p>
                </div>
              </div>
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#10b981'}}><Briefcase size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.2.name', 'CRM')}</h4>
                  <p>{t('products.featured.apps.2.desc', 'Pipeline, contracts & revenue')}</p>
                </div>
              </div>
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#ec4899'}}><Package size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.3.name', 'Inventory')}</h4>
                  <p>{t('products.featured.apps.3.desc', 'Supply, warehousing & SKUs')}</p>
                </div>
              </div>
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#2b4fb0'}}><Settings size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.4.name', 'Automation')}</h4>
                  <p>{t('products.featured.apps.4.desc', 'Visual, no-code workflow studio')}</p>
                </div>
              </div>
              <div className="emv-app-mini-card">
                <div className="emv-app-icon" style={{background: '#ef4444'}}><FileCheck size={18} color="#fff"/></div>
                <div className="emv-app-info">
                  <h4>{t('products.featured.apps.5.name', 'E-Invoicing')}</h4>
                  <p>{t('products.featured.apps.5.desc', 'Native formats in 42 countries')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO-STYLE CAROUSEL FOR DETAILED DASHBOARDS */}
        <div
          className="products-carousel-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button className="prod-arrow prev" onClick={goPrev} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          <button className="prod-arrow next" onClick={goNext} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>

          <div className="products-carousel-track">
            {productsList.map((product, index) => {
              const isActive = activeSlide === index;
              return (
                <div
                  key={product.id}
                  className={`prod-carousel-slide ${isActive ? 'active' : ''}`}
                >
                  <div className="prod-card-decor">
                    <ProductsDecor />
                  </div>
                  <div className="prod-card-watermark">
                    {React.cloneElement(product.icon, { size: 200, color: '#1e3a8a' })}
                  </div>
                  <div className="timeline-content slide-content">
                    <div className="product-info">
                      <div className="product-header-top">
                        <h3 className="product-title-top">{t(`productsData.p${product.id}_title`, product.title)}</h3>
                      </div>
                      <p className="product-desc">{t(`productsData.p${product.id}_desc`, product.description)}</p>
                      <div className="product-industries">
                        <span className="industry-label">{t('productsData.targetIndustries', 'Target Industries')}</span>
                        <div className="industry-tags">
                          {product.industries.map((ind, i) => {
                            const IndIcon = INDUSTRY_ICONS[ind] || Briefcase;
                            return (
                              <span key={i} className="industry-tag">
                                <IndIcon size={15} className="industry-tag-icon" />
                                {t(`productsData.industries.${ind.replace(/\s+/g, '')}`, ind)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="product-dashboard">
                       <div className="product-dashboard-inner">
                         <DashboardWrapper product={product} inView={isActive} />
                         <span className="prod-dash-badge">
                           {React.cloneElement(product.icon, { size: 30, color: '#fff' })}
                         </span>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* dots below the card; the arrows flank it */}
        <div className="prod-controls">
          <div className="prod-dots">
            {productsList.map((_, i) => (
              <button
                key={i}
                className={`prod-dot ${activeSlide === i ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Products;
