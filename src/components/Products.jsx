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
  Network, BadgeDollarSign, TrendingUp,
  BookOpen, ArrowLeftRight, Layers, RefreshCw, Warehouse, Percent, Tag,
  CreditCard, Wallet, CalendarCheck, Award, ShieldCheck, UserCog, WifiOff,
  ScanLine, Printer, LayoutGrid, Monitor, Gift, QrCode, Code, PenTool, Plug,
  Lock, Globe, GitBranch, ClipboardList, Flag, MousePointerClick
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

/* Application switcher: tab buttons above the divider, and the detail panel
   that replaces the old static "featured apps" grid when a tab is clicked. */
/* points: [Icon, name, short description] — rendered as icon-tile mini cards */
const APPS = [
  { key: 'financials', tab: 'Financials', title: 'Run Your Finances with Greater Control', icon: BadgeDollarSign, color: '#7c3aed', link: 'Explore Financials',
    points: [[BookOpen, 'General Ledger', 'Multi-entity chart of accounts'], [ArrowLeftRight, 'Payables & Receivables', 'Vendor bills and customer dues'], [Landmark, 'Cash & Bank', 'Balances, transfers and payments'], [Building2, 'Fixed Assets', 'Registers, depreciation and disposal'], [LineChart, 'Budgeting & Forecasting', 'Plan, track and compare spend'], [Layers, 'Cost Centers & Dimensions', 'Analyse by unit, branch or project'], [Network, 'Intercompany Accounting', 'Cross-entity entries and balancing'], [GitMerge, 'Consolidation', 'Group reporting across entities'], [RefreshCw, 'Auto Bank Reconciliation', 'Match statements to book entries']] },
  { key: 'supply', tab: 'Supply Chain', title: 'Connect Purchasing, Inventory and Warehouses', icon: Truck, color: '#0891b2', link: 'Explore Supply Chain',
    points: [[ShoppingCart, 'Procurement Management', 'Requisitions through purchase orders'], [Handshake, 'Vendor Management', 'Supplier records, terms and history'], [Boxes, 'Inventory Control', 'Stock levels across every location'], [Warehouse, 'Warehouse Management', 'Bins, transfers and picking'], [TrendingUp, 'Demand Planning', 'Forecast what to buy and hold'], [Waypoints, '2 & 3-Way Matching', 'PO, receipt and invoice checks'], [BadgeDollarSign, 'Vendor Advance Payments', 'Prepayments tracked against bills'], [Percent, 'Retention Deduction', 'Hold amounts on supplier work'], [FileCheck, 'Partial Receipts', 'Receive orders in stages']] },
  { key: 'sales', tab: 'Sales & CRM', title: 'Manage the Customer Journey from Lead to Order', icon: TrendingUp, color: '#059669', link: 'Explore Sales & CRM',
    points: [[Target, 'Leads & Opportunities', 'Pipeline from first contact'], [ReceiptText, 'Quotations', 'Build and send priced offers'], [ShoppingBag, 'Sales Orders', 'Confirm and fulfil customer orders'], [Tag, 'Pricing & Discounts', 'Price lists and approval rules'], [Users, 'Customer Management', 'Accounts, contacts and history'], [CreditCard, 'Credit Limits', 'Control exposure per customer'], [Truck, 'Partial Deliveries', 'Ship orders in multiple drops'], [Package, 'Backorders', 'Track what is still owed'], [BadgeDollarSign, 'Advance Payments', 'Collect and apply deposits'], [Percent, 'Retention Handling', 'Manage held customer amounts']] },
  { key: 'hcm', tab: 'HCM', title: 'Manage Your Workforce from Hire to Payroll', icon: Users, color: '#2563eb', link: 'Explore HCM',
    points: [[Users, 'Core HR', 'Employee records and org structure'], [Wallet, 'Payroll', 'Salaries, allowances and deductions'], [CalendarCheck, 'Attendance & Leave', 'Shifts, timesheets and balances'], [Award, 'End of Service Benefits', 'Automatic settlement calculations'], [ShieldCheck, 'GOSI', 'Social insurance contributions'], [BadgeDollarSign, 'Loans & Advances', 'Requests with payroll recovery'], [BarChart3, 'KPI & Appraisals', 'Goals, reviews and ratings'], [User, 'Employee Self-Service', 'Requests, payslips and profiles'], [UserCog, 'Manager Self-Service', 'Approvals and team visibility'], [ShieldCheck, 'WPS Compliance', 'Wage protection file generation']] },
  { key: 'pos', tab: 'POS', title: 'Connect Every Sale with Your Business Operations', icon: ShoppingCart, color: '#9333ea', link: 'Explore POS',
    points: [[Zap, 'Fast Billing', 'Quick checkout at the counter'], [WifiOff, 'Offline Mode', 'Keep selling without a connection'], [ScanLine, 'Barcode Scanning', 'Scan items straight to the bill'], [Printer, 'Receipt Printing', 'Printed and digital receipts'], [Building2, 'Multi-Branch POS', 'One setup across every outlet'], [LayoutGrid, 'Table Management', 'Floor plans, covers and orders'], [Monitor, 'Kitchen Display', 'Orders sent straight to the kitchen'], [Gift, 'Promotions & Loyalty', 'Offers, points and vouchers'], [Clock, 'Cashier & Shift Control', 'Tills, handovers and closing'], [RefreshCw, 'Real-Time Stock Sync', 'Inventory updates on every sale']] },
  { key: 'einv', tab: 'E-Invoicing', title: 'Make Compliance Part of Your Invoicing Process', icon: ReceiptText, color: '#0d9488', link: 'Explore E-Invoicing',
    points: [[ReceiptText, 'Electronic Invoices', 'Compliant invoices from your ledger'], [QrCode, 'QR Code Generation', 'Required codes on every invoice'], [Code, 'XML / JSON Formats', 'Standards-based invoice files'], [PenTool, 'Digital Signatures', 'Signed, tamper-evident documents'], [ShieldCheck, 'ZATCA Phase 1 & 2', 'Generation and integration phases'], [Zap, 'Real-Time Clearance', 'Submit and clear as you invoice'], [Plug, 'API Integration', 'Connect external billing systems'], [Lock, 'Cryptographic Stamping', 'Secure stamps on each document'], [Globe, 'Country Tax Compliance', 'Rules applied per jurisdiction'], [Landmark, 'Government APIs', 'Direct link to tax authorities']] },
  { key: 'projects', tab: 'Projects', title: 'Keep Projects, Resources and Financials in View', icon: Briefcase, color: '#d97706', link: 'Explore Projects',
    points: [[GitBranch, 'Planning with WBS', 'Break work into structured tasks'], [ClipboardList, 'Task Management', 'Assign, schedule and track work'], [Users, 'Resource Allocation', 'Plan people across projects'], [LineChart, 'Budget Tracking', 'Compare planned and actual cost'], [Clock, 'Time & Expense', 'Log hours and project spend'], [Flag, 'Milestone Billing', 'Invoice as stages complete'], [Percent, 'Retention Management', 'Track held project amounts']] },
  { key: 'mfg', tab: 'Manufacturing', title: 'Connect Production with Inventory and Cost', icon: Factory, color: '#be123c', link: 'Explore Manufacturing',
    points: [[ClipboardList, 'Bill of Materials', 'Define what each product needs'], [Factory, 'Production Orders', 'Plan and release production runs'], [Cog, 'Shop Floor Control', 'Track progress on the floor'], [Boxes, 'Material Consumption', 'Issue and record used stock'], [BadgeDollarSign, 'Production Costing', 'Cost of every finished item']] },
  { key: 'studio', tab: 'Studio', title: 'Build Around the Way Your Business Works', icon: LayoutDashboard, color: '#ec4899', link: 'Explore Studio',
    points: [[MousePointerClick, 'Drag-and-Drop Builder', 'Assemble apps without code'], [LayoutGrid, 'Custom Forms', 'Capture exactly the data you need'], [PenTool, 'UI Designer', 'Lay out screens your way']] },
  { key: 'flow', tab: 'Flow', title: 'Automate the Processes Between Your Teams', icon: Workflow, color: '#4f46e5', link: 'Explore Flow',
    points: [[Workflow, 'Workflow Automation', 'Route work between teams'], [GitMerge, 'Approval Chains', 'Multi-level review and sign-off'], [Zap, 'Event Triggers', 'Run actions when things change']] },
  { key: 'insights', tab: 'Insights', title: 'Turn Business Data into Clearer Decisions', icon: BarChart3, color: '#e2601f', link: 'Explore Insights',
    points: [[LayoutDashboard, 'Financial Dashboards', 'Live view of company numbers'], [TrendingUp, 'Sales Analytics', 'Pipeline, revenue and trends'], [ShoppingCart, 'POS Analytics', 'Performance by outlet and hour'], [Boxes, 'Inventory Insights', 'Movement, ageing and stock value'], [BadgeDollarSign, 'Project Profitability', 'Margin per project and client'], [PieChart, 'Custom Report Builder', 'Build reports without IT'], [Search, 'Drill-Down Analysis', 'Go from summary to transaction']] },
];

/* Rotating tile colours for the point icons — one app's list cycles through
   these so the grid reads like the featured-apps tiles, not one flat colour. */
const POINT_COLORS = ['#2f9bf5', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#0891b2', '#f59e0b'];

/* Short descriptive blurb per app for the coloured card */
const BLURBS = {
  financials: 'One connected view of your ledger, cash, payables, and assets.',
  supply: 'Procurement, inventory, and warehouses managed end to end.',
  sales: 'From lead to order to payment in one connected flow.',
  hcm: 'Core HR, payroll, and attendance with compliance built in.',
  pos: 'Fast billing across every branch — online or offline.',
  einv: 'Compliant e-invoicing with real-time ZATCA clearance.',
  projects: 'Plan, resource, track, and bill projects in one place.',
  mfg: 'Production, materials, and costing kept connected.',
  studio: 'Build custom apps with drag-and-drop, not heavy code.',
  flow: 'Automate approvals and processes between your teams.',
  insights: 'Dashboards and analytics across your whole business.',
};

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
  const [activeApp, setActiveApp] = useState(0);
  const active = APPS[activeApp];
  const ActiveIcon = active.icon;
  const slideCount = productsList.length;

  const goPrev = () => setActiveSlide((s) => (s - 1 + slideCount) % slideCount);
  const goNext = () => setActiveSlide((s) => (s + 1) % slideCount);

  // auto-advance; any manual change restarts the dwell because the
  // effect re-runs on activeSlide
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setActiveSlide((s) => (s + 1) % slideCount), 2200);
    return () => clearTimeout(timer);
  }, [activeSlide, paused, slideCount]);

  // auto-cycle the app tabs one by one; pauses while hovered, and any
  // manual click restarts the dwell (effect re-runs on activeApp)
  const [appPaused, setAppPaused] = useState(false);
  useEffect(() => {
    if (appPaused) return undefined;
    const timer = setTimeout(() => setActiveApp((a) => (a + 1) % APPS.length), 3000);
    return () => clearTimeout(timer);
  }, [activeApp, appPaused]);

  return (
    <section id="products" className="products-section">
      <div className="container">

        {/* HEADER BLOCK */}
        <div className="emv-products-header">
          <div className="emv-subtitle">FEATURED PRODUCTS</div>
          <div className="emv-products-headline-row">
            <h2 className="emv-headline">
              Everything You Need to Run <br />
              Your Business, <span className="text-accent">Connected</span>
            </h2>
            <a href="#all-products" className="emv-explore-all emv-explore-all--head">
              Explore all products <ArrowRight size={16}/>
            </a>
          </div>
          <p className="emv-description">
            From financials and supply chain to sales, people, projects, manufacturing, POS, compliance, and automation, Emvive brings the applications behind your business into one connected Business Operating System.
          </p>
        </div>

        {/* APP SWITCHER: full-width tabs, divider, then card + info */}
        <div
          className="emv-apps-wrap"
          onMouseEnter={() => setAppPaused(true)}
          onMouseLeave={() => setAppPaused(false)}
        >
          {/* Full-width tab buttons */}
          <div className="emv-app-tabs">
            {APPS.map((app, i) => {
              const TabIcon = app.icon;
              return (
                <button
                  key={app.key}
                  type="button"
                  className={`emv-app-tab ${activeApp === i ? 'active' : ''}`}
                  style={{ '--ac': app.color }}
                  onClick={() => setActiveApp(i)}
                >
                  <TabIcon size={15} strokeWidth={2} />
                  {app.tab}
                </button>
              );
            })}
          </div>

          {/* Below the divider line: left card (app-coloured) + right info */}
          <div className="emv-featured-apps-container" style={{ '--ac': active.color }}>
            {/* Left: coloured card — reflects the selected application */}
            <div className="emv-agent-studio-card" key={active.key} style={{ '--ac': active.color }}>
              <div className="emv-card-head">
                <span className="emv-card-icon"><ActiveIcon size={22} color="#fff" /></span>
                <h3>{active.tab}</h3>
              </div>
              <p className="emv-card-tagline">{active.title}</p>
              <p className="emv-card-blurb">{BLURBS[active.key]}</p>
              <a href="#" className="emv-app-cta emv-card-cta">{active.link} <ArrowRight size={16}/></a>
            </div>

            {/* Right: selected app info — icon + name heading, items, button */}
            <div className="emv-apps-grid-section">
              <div className="emv-app-detail" key={active.key} style={{ '--ac': active.color }}>
                <div className="emv-app-detail-head">
                  <div className="emv-app-detail-head-left">
                    <h3 className="emv-app-detail-title">{active.tab}</h3>
                  </div>
                  <a href="#" className="emv-app-cta" style={{ '--ac': active.color }}>
                    {active.link} <ArrowRight size={16}/>
                  </a>
                </div>
                <ul className="emv-app-detail-points">
                  {active.points.map((pt, pi) => {
                    const Pi = pt[0];
                    return (
                      <li key={pt[1]}>
                        <span className="emv-point-ic" style={{ '--pc': POINT_COLORS[pi % POINT_COLORS.length] }}>
                          <Pi size={18} color="#fff" strokeWidth={2.1} />
                        </span>
                        <span className="emv-point-txt">
                          <b>{pt[1]}</b>
                          <span>{pt[2]}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* HERO-STYLE CAROUSEL FOR DETAILED DASHBOARDS — hidden for now */}
        {false && (
        <>
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
        </>
        )}

      </div>
    </section>
  );
};

export default Products;
