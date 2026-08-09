import {
  ShoppingCart, Calculator, Truck, Activity, FileText, Users,
  Settings, Box, CheckCircle, Package, PenTool, BarChart2,
  Shield, Clock, TrendingUp, CreditCard, PieChart,
  Layout, Zap, Link2, Send, Mail, Search, Star, Briefcase
} from 'lucide-react';

/* Content mirrors the Emvive ERP Master Document:
   §4 ERP Modules, §5 Portals, §6 Platform, §8 Analytics.
   Structure (solution -> group -> modules) is unchanged so the mega-menu
   UI and its hover interactivity stay exactly the same. */
export const getMegaMenuData = (t) => ({
  [t('megaMenu.products.cloudErp', 'ERP')]: {
    [t('megaMenu.erp.label', 'Core ERP')]: {
      title: t('megaMenu.erp.title', 'Core ERP'),
      subtitle: t('megaMenu.erp.subtitle', 'Five operations on one ledger — finance, supply chain, plant, counter and project.'),
      modules: [
        { icon: Calculator, title: t('megaMenu.erp.financials', 'Financial Management'), desc: t('megaMenu.erp.financialsDesc', 'GL, AP/AR, cash, fixed assets, consolidation and ZATCA e-invoicing.') },
        { icon: Truck, title: t('megaMenu.erp.supplyChain', 'Supply Chain Operations'), desc: t('megaMenu.erp.supplyChainDesc', 'Procurement, inventory, warehouse and logistics.') },
        { icon: Settings, title: t('megaMenu.erp.manufacturing', 'Manufacturing Operations'), desc: t('megaMenu.erp.manufacturingDesc', 'BOM, work orders and shop-floor control.') },
        { icon: ShoppingCart, title: t('megaMenu.erp.commerce', 'Commerce & POS'), desc: t('megaMenu.erp.commerceDesc', 'Fast billing, offline mode and multi-branch retail.') },
        { icon: Briefcase, title: t('megaMenu.erp.projects', 'Project & Service Operations'), desc: t('megaMenu.erp.projectsDesc', 'WBS, time & expense, milestone billing and field service.') }
      ]
    }
  },
  [t('megaMenu.products.hrPayroll', 'HR & Payroll')]: {
    [t('megaMenu.hcm.label', 'Human Capital')]: {
      title: t('megaMenu.hcm.title', 'Human Capital (HCM)'),
      subtitle: t('megaMenu.hcm.subtitle', 'Core HR, payroll and full GCC compliance in one place.'),
      modules: [
        { icon: Users, title: t('megaMenu.hcm.coreHr', 'Core HR'), desc: t('megaMenu.hcm.coreHrDesc', 'Employee records, org structure and contracts.') },
        { icon: CreditCard, title: t('megaMenu.hcm.payroll', 'Payroll & WPS'), desc: t('megaMenu.hcm.payrollDesc', 'Salary processing with WPS-compliant payslips.') },
        { icon: Calculator, title: t('megaMenu.hcm.eosb', 'End of Service (EOSB)'), desc: t('megaMenu.hcm.eosbDesc', 'Automated gratuity and final settlement.') },
        { icon: Shield, title: t('megaMenu.hcm.gosi', 'GOSI Compliance'), desc: t('megaMenu.hcm.gosiDesc', 'Registration, contributions and reporting.') },
        { icon: Star, title: t('megaMenu.hcm.performance', 'Performance & KPIs'), desc: t('megaMenu.hcm.performanceDesc', 'Goals, appraisals and increment workflows.') },
        { icon: Clock, title: t('megaMenu.hcm.attendance', 'Attendance & Leave'), desc: t('megaMenu.hcm.attendanceDesc', 'Shift scheduling, leave and overtime rules.') },
        { icon: CreditCard, title: t('megaMenu.hcm.loans', 'Employee Loans'), desc: t('megaMenu.hcm.loansDesc', 'Loan requests with EMI deduction from payroll.') },
        { icon: Users, title: t('megaMenu.hcm.ess', 'Employee Self-Service'), desc: t('megaMenu.hcm.essDesc', 'Payslips, leave and requests on the go.') }
      ]
    }
  },
  [t('megaMenu.products.crmSales', 'CRM & Sales')]: {
    [t('megaMenu.crm.label', 'Sales & CRM')]: {
      title: t('megaMenu.crm.title', 'Sales & CRM'),
      subtitle: t('megaMenu.crm.subtitle', 'From first lead to final payment on one pipeline.'),
      modules: [
        { icon: TrendingUp, title: t('megaMenu.crm.leads', 'Leads & Opportunities'), desc: t('megaMenu.crm.leadsDesc', 'Track and convert every opportunity.') },
        { icon: FileText, title: t('megaMenu.crm.quotations', 'Quotations'), desc: t('megaMenu.crm.quotationsDesc', 'Generate professional quotes in seconds.') },
        { icon: CheckCircle, title: t('megaMenu.crm.orders', 'Sales Orders'), desc: t('megaMenu.crm.ordersDesc', 'Order-to-cash with delivery and invoicing.') },
        { icon: Calculator, title: t('megaMenu.crm.pricing', 'Pricing & Discounts'), desc: t('megaMenu.crm.pricingDesc', 'Flexible price lists and discount rules.') },
        { icon: Users, title: t('megaMenu.crm.customers', 'Customer Management'), desc: t('megaMenu.crm.customersDesc', 'A single 360° view of every customer.') },
        { icon: Shield, title: t('megaMenu.crm.creditLimits', 'Credit Limits'), desc: t('megaMenu.crm.creditLimitsDesc', 'Control exposure with credit controls.') }
      ]
    }
  },
  [t('megaMenu.products.reporting', 'Advanced Reporting')]: {
    [t('megaMenu.analytics.label', 'Analytics')]: {
      title: t('megaMenu.analytics.title', 'Analytics & Reporting'),
      subtitle: t('megaMenu.analytics.subtitle', 'Turn operational data into decisions.'),
      modules: [
        { icon: PieChart, title: t('megaMenu.analytics.financial', 'Financial Dashboards'), desc: t('megaMenu.analytics.financialDesc', 'P&L, balance sheet and cash-flow views.') },
        { icon: TrendingUp, title: t('megaMenu.analytics.sales', 'Sales Analytics'), desc: t('megaMenu.analytics.salesDesc', 'Revenue, pipeline and conversion trends.') },
        { icon: ShoppingCart, title: t('megaMenu.analytics.pos', 'POS Analytics'), desc: t('megaMenu.analytics.posDesc', 'Branch, cashier and product performance.') },
        { icon: Box, title: t('megaMenu.analytics.inventory', 'Inventory Insights'), desc: t('megaMenu.analytics.inventoryDesc', 'Turnover, ageing and stock optimisation.') },
        { icon: Briefcase, title: t('megaMenu.analytics.projects', 'Project Profitability'), desc: t('megaMenu.analytics.projectsDesc', 'Budget vs actuals across every project.') },
        { icon: Layout, title: t('megaMenu.analytics.builder', 'Custom Report Builder'), desc: t('megaMenu.analytics.builderDesc', 'Build any report with drill-down analysis.') }
      ]
    }
  },
  [t('megaMenu.products.workflow', 'Workflow Automation')]: {
    [t('megaMenu.flow.label', 'Flow')]: {
      title: t('megaMenu.flow.title', 'Workflow Automation'),
      subtitle: t('megaMenu.flow.subtitle', 'Automate approvals and processes across the platform.'),
      modules: [
        { icon: Zap, title: t('megaMenu.flow.automation', 'Workflow Automation'), desc: t('megaMenu.flow.automationDesc', 'Automate repetitive tasks end to end.') },
        { icon: CheckCircle, title: t('megaMenu.flow.approvals', 'Approval Chains'), desc: t('megaMenu.flow.approvalsDesc', 'Multi-level conditional approval routing.') },
        { icon: Activity, title: t('megaMenu.flow.triggers', 'Event Triggers'), desc: t('megaMenu.flow.triggersDesc', 'Launch flows from any system event.') },
        { icon: Mail, title: t('megaMenu.flow.notifications', 'Notifications'), desc: t('megaMenu.flow.notificationsDesc', 'Alerts via email, SMS and in-app.') },
        { icon: Clock, title: t('megaMenu.flow.sla', 'SLA Tracking'), desc: t('megaMenu.flow.slaDesc', 'Monitor bottlenecks and turnaround time.') },
        { icon: FileText, title: t('megaMenu.flow.audit', 'Audit Trails'), desc: t('megaMenu.flow.auditDesc', 'Full history of every workflow action.') }
      ]
    }
  }
});
