import {
  ShoppingCart, Calculator, Truck, Activity, FileText, Users,
  Settings, Box, CheckCircle, Package, PenTool, BarChart2,
  Heart, Shield, Stethoscope, Clipboard, UserPlus, Clock,
  HardHat, Map, Wrench, Briefcase, Ruler, Zap,
  Coffee, Utensils, Droplet, Star, TrendingUp, Key,
  CreditCard, PieChart, Database, Server, Smartphone, Lock,
  Globe, MessageSquare, Send, Mail, Phone, Video,
  Home, Camera, Search, Layout, Wifi, Link2
} from 'lucide-react';

export const getMegaMenuData = (t) => ({
  [t('megaMenu.products.cloudErp', 'Cloud ERP')]: {
    [t('megaMenu.retail.title', 'Retail & POS')]: {
      title: t('megaMenu.retail.title', 'Retail & POS'),
      subtitle: t('megaMenu.retail.subtitle', 'Discover how we tailor this product specifically for the Retail & POS sector.'),
      modules: [
        { icon: ShoppingCart, title: t('megaMenu.retail.inventory', "Inventory for Retail & POS"), desc: t('megaMenu.retail.inventoryDesc', "Real-time stock tracking tailored for Retail & POS operations.") },
        { icon: Calculator, title: t('megaMenu.retail.financial', "Financial Management"), desc: t('megaMenu.retail.financialDesc', "ZATCA-compliant accounting and ledger.") },
        { icon: Truck, title: t('megaMenu.retail.supplyChain', "Supply Chain"), desc: t('megaMenu.retail.supplyChainDesc', "Automate POs and supplier management seamlessly.") },
        { icon: Activity, title: t('megaMenu.retail.pos', "Advanced POS"), desc: t('megaMenu.retail.posDesc', "Unified commerce and quick multi-branch sales processing.") },
        { icon: FileText, title: t('megaMenu.retail.invoicing', "Invoicing & Billing"), desc: t('megaMenu.retail.invoicingDesc', "Generate e-invoices instantly.") },
        { icon: Users, title: t('megaMenu.retail.vendor', "Vendor Portal"), desc: t('megaMenu.retail.vendorDesc', "Self-service access for your vendors.") }
      ]
    },
    [t('megaMenu.manufacturing.title', 'Manufacturing')]: {
      title: t('megaMenu.manufacturing.title', 'Manufacturing'),
      subtitle: t('megaMenu.manufacturing.subtitle', 'Optimize production lines, track materials, and manage your manufacturing workforce.'),
      modules: [
        { icon: Settings, title: t('megaMenu.manufacturing.production', "Production Planning"), desc: t('megaMenu.manufacturing.productionDesc', "Optimize shop floor operations") },
        { icon: Box, title: t('megaMenu.manufacturing.quality', "Quality Control"), desc: t('megaMenu.manufacturing.qualityDesc', "Automated inspection workflows") },
        { icon: CheckCircle, title: t('megaMenu.manufacturing.maintenance', "Predictive Maintenance"), desc: t('megaMenu.manufacturing.maintenanceDesc', "IoT-driven asset management") },
        { icon: Package, title: t('megaMenu.manufacturing.warehouse', "Warehouse Management"), desc: t('megaMenu.manufacturing.warehouseDesc', "Advanced bin and batch tracking.") },
        { icon: PenTool, title: t('megaMenu.manufacturing.maintenanceSchedule', "Maintenance"), desc: t('megaMenu.manufacturing.maintenanceScheduleDesc', "Predictive maintenance schedules.") },
        { icon: BarChart2, title: t('megaMenu.manufacturing.costAccounting', "Cost Accounting"), desc: t('megaMenu.manufacturing.costAccountingDesc', "Real-time cost variance analysis.") }
      ]
    },
    [t('megaMenu.healthcare.title', 'Healthcare')]: {
      title: t('megaMenu.healthcare.title', 'Healthcare'),
      subtitle: t('megaMenu.healthcare.subtitle', 'Tailored for clinics and hospitals to manage patient data and billing.'),
      modules: [
        { icon: Heart, title: t('megaMenu.healthcare.patient', "Patient Records"), desc: t('megaMenu.healthcare.patientDesc', "HIPAA-compliant data management") },
        { icon: Shield, title: t('megaMenu.healthcare.compliance', "Compliance"), desc: t('megaMenu.healthcare.complianceDesc', "HIPAA and local data privacy compliance tools.") },
        { icon: Stethoscope, title: t('megaMenu.healthcare.clinic', "Clinic Operations"), desc: t('megaMenu.healthcare.clinicDesc', "Manage appointments, doctors, and staff schedules.") },
        { icon: Clipboard, title: t('megaMenu.healthcare.billing', "Medical Billing"), desc: t('megaMenu.healthcare.billingDesc', "Automated insurance claims") },
        { icon: Box, title: t('megaMenu.healthcare.pharmacy', "Pharmacy Inventory"), desc: t('megaMenu.healthcare.pharmacyDesc', "Track medicines, expiry dates, and stock levels.") },
        { icon: Users, title: t('megaMenu.healthcare.portal', "Patient Portal"), desc: t('megaMenu.healthcare.portalDesc', "Online portal for patients to view test results.") }
      ]
    }
  },
  [t('megaMenu.products.hrPayroll', 'HR & Payroll')]: {
    [t('megaMenu.coreHr.label', "Core HR")]: {
      title: t('megaMenu.coreHr.title', "Core HR & Payroll"),
      subtitle: t('megaMenu.coreHr.subtitle', "Comprehensive HR management for modern organizations."),
      modules: [
        { icon: Users, title: t('megaMenu.coreHr.directory', "Employee Directory"), desc: t('megaMenu.coreHr.directoryDesc', "Centralized database for all employee records.") },
        { icon: CreditCard, title: t('megaMenu.coreHr.payroll', "Automated Payroll"), desc: t('megaMenu.coreHr.payrollDesc', "One-click payroll processing with tax compliance.") },
        { icon: Clock, title: t('megaMenu.coreHr.attendance', "Time & Attendance"), desc: t('megaMenu.coreHr.attendanceDesc', "Biometric integration and leave management.") },
        { icon: UserPlus, title: t('megaMenu.coreHr.recruitment', "Recruitment"), desc: t('megaMenu.coreHr.recruitmentDesc', "Applicant tracking and onboarding workflows.") },
        { icon: Star, title: t('megaMenu.coreHr.performance', "Performance"), desc: t('megaMenu.coreHr.performanceDesc', "KPI tracking and regular appraisal cycles.") },
        { icon: Shield, title: t('megaMenu.coreHr.selfService', "Employee Self-Service"), desc: t('megaMenu.coreHr.selfServiceDesc', "Mobile app for payslips and leave requests.") }
      ]
    },
    [t('megaMenu.retailShift.label', "Retail & Shift Work")]: {
      title: t('megaMenu.retailShift.title', "Retail & Shift Work HR"),
      subtitle: t('megaMenu.retailShift.subtitle', "Specialized tools for managing hourly and shift-based workers."),
      modules: [
        { icon: Clock, title: t('megaMenu.retailShift.rostering', "Advanced Rostering"), desc: t('megaMenu.retailShift.rosteringDesc', "AI-driven shift scheduling and swap requests.") },
        { icon: Map, title: t('megaMenu.retailShift.geoAttendance', "Geo-fenced Attendance"), desc: t('megaMenu.retailShift.geoAttendanceDesc', "Mobile check-ins restricted to store locations.") },
        { icon: Calculator, title: t('megaMenu.retailShift.overtime', "Overtime Rules"), desc: t('megaMenu.retailShift.overtimeDesc', "Automated calculation of complex overtime rates.") },
        { icon: TrendingUp, title: t('megaMenu.retailShift.commission', "Sales Commission"), desc: t('megaMenu.retailShift.commissionDesc', "Link POS data to employee commission payouts.") },
        { icon: Users, title: t('megaMenu.retailShift.tempStaffing', "Temporary Staffing"), desc: t('megaMenu.retailShift.tempStaffingDesc', "Manage contracts for seasonal retail workers.") },
        { icon: MessageSquare, title: t('megaMenu.retailShift.teamComms', "Team Comms"), desc: t('megaMenu.retailShift.teamCommsDesc', "Broadcast messages to all store staff instantly.") }
      ]
    },
    [t('megaMenu.healthcareStaffing.label', "Healthcare Staffing")]: {
      title: t('megaMenu.healthcareStaffing.title', "Healthcare Staffing"),
      subtitle: t('megaMenu.healthcareStaffing.subtitle', "Manage complex medical rosters and credential tracking."),
      modules: [
        { icon: Stethoscope, title: t('megaMenu.healthcareStaffing.credentials', "Credential Tracking"), desc: t('megaMenu.healthcareStaffing.credentialsDesc', "Monitor license expiries and certifications.") },
        { icon: Clock, title: t('megaMenu.healthcareStaffing.onCall', "On-Call Rostering"), desc: t('megaMenu.healthcareStaffing.onCallDesc', "Manage complex 24/7 on-call schedules.") },
        { icon: Heart, title: t('megaMenu.healthcareStaffing.burnout', "Burnout Prevention"), desc: t('megaMenu.healthcareStaffing.burnoutDesc', "Track consecutive shifts to ensure compliance.") },
        { icon: FileText, title: t('megaMenu.healthcareStaffing.differentials', "Shift Differentials"), desc: t('megaMenu.healthcareStaffing.differentialsDesc', "Automate pay rates for night and weekend shifts.") },
        { icon: Shield, title: t('megaMenu.healthcareStaffing.audits', "Compliance Audits"), desc: t('megaMenu.healthcareStaffing.auditsDesc', "Automated reporting for healthcare regulations.") },
        { icon: Users, title: t('megaMenu.healthcareStaffing.locum', "Locum Management"), desc: t('megaMenu.healthcareStaffing.locumDesc', "Manage temporary doctors and agency staff.") }
      ]
    }
  },
  [t('megaMenu.products.crmSales', 'CRM & Sales')]: {
    [t('megaMenu.b2b.label', "B2B Enterprise")]: {
      title: t('megaMenu.b2b.title', "B2B Sales CRM"),
      subtitle: t('megaMenu.b2b.subtitle', "Drive revenue with advanced pipeline and account management."),
      modules: [
        { icon: Briefcase, title: t('megaMenu.b2b.account', "Account Management"), desc: t('megaMenu.b2b.accountDesc', "360-degree view of corporate clients.") },
        { icon: TrendingUp, title: t('megaMenu.b2b.pipeline', "Pipeline Tracking"), desc: t('megaMenu.b2b.pipelineDesc', "Visual drag-and-drop sales pipelines.") },
        { icon: FileText, title: t('megaMenu.b2b.quotes', "Quotes & Proposals"), desc: t('megaMenu.b2b.quotesDesc', "Generate professional quotes in seconds.") },
        { icon: Mail, title: t('megaMenu.b2b.email', "Email Integration"), desc: t('megaMenu.b2b.emailDesc', "Sync with Outlook and Gmail automatically.") },
        { icon: PieChart, title: t('megaMenu.b2b.forecasting', "Sales Forecasting"), desc: t('megaMenu.b2b.forecastingDesc', "AI-driven revenue predictions.") },
        { icon: Shield, title: t('megaMenu.b2b.territory', "Territory Management"), desc: t('megaMenu.b2b.territoryDesc', "Assign leads based on geography and rules.") }
      ]
    },
    [t('megaMenu.retailEcommerce.label', "Retail & E-commerce")]: {
      title: t('megaMenu.retailEcommerce.title', "Retail & POS CRM"),
      subtitle: t('megaMenu.retailEcommerce.subtitle', "Omnichannel customer engagement and loyalty."),
      modules: [
        { icon: Heart, title: t('megaMenu.retailEcommerce.loyalty', "Loyalty Programs"), desc: t('megaMenu.retailEcommerce.loyaltyDesc', "Points, tiers, and rewards management.") },
        { icon: UserPlus, title: t('megaMenu.retailEcommerce.profiles', "Customer Profiles"), desc: t('megaMenu.retailEcommerce.profilesDesc', "Unified view of online and in-store purchases.") },
        { icon: Send, title: t('megaMenu.retailEcommerce.marketing', "Marketing Automation"), desc: t('megaMenu.retailEcommerce.marketingDesc', "Triggered SMS and email campaigns.") },
        { icon: Activity, title: t('megaMenu.retailEcommerce.behavior', "Behavior Analytics"), desc: t('megaMenu.retailEcommerce.behaviorDesc', "Track browsing and purchase patterns.") },
        { icon: MessageSquare, title: t('megaMenu.retailEcommerce.support', "Support Tickets"), desc: t('megaMenu.retailEcommerce.supportDesc', "Manage customer complaints and returns.") },
        { icon: Star, title: t('megaMenu.retailEcommerce.feedback', "Feedback & Reviews"), desc: t('megaMenu.retailEcommerce.feedbackDesc', "Automated post-purchase survey collection.") }
      ]
    },
    [t('megaMenu.realEstate.label', "Real Estate")]: {
      title: t('megaMenu.realEstate.title', "Real Estate CRM"),
      subtitle: t('megaMenu.realEstate.subtitle', "Manage properties, leads, and agent commissions."),
      modules: [
        { icon: Home, title: t('megaMenu.realEstate.listings', "Property Listings"), desc: t('megaMenu.realEstate.listingsDesc', "Centralized database of available inventory.") },
        { icon: Users, title: t('megaMenu.realEstate.leadMatching', "Lead Matching"), desc: t('megaMenu.realEstate.leadMatchingDesc', "Auto-match buyer preferences to new listings.") },
        { icon: Camera, title: t('megaMenu.realEstate.tours', "Virtual Tours"), desc: t('megaMenu.realEstate.toursDesc', "Integrate 3D tours directly into client portals.") },
        { icon: Calculator, title: t('megaMenu.realEstate.commissions', "Commission Splits"), desc: t('megaMenu.realEstate.commissionsDesc', "Automate complex broker and agent payouts.") },
        { icon: FileText, title: t('megaMenu.realEstate.contracts', "Contract Management"), desc: t('megaMenu.realEstate.contractsDesc', "Digital signatures and lease tracking.") },
        { icon: Phone, title: t('megaMenu.realEstate.callTracking', "Call Tracking"), desc: t('megaMenu.realEstate.callTrackingDesc', "Log agent calls and texts automatically.") }
      ]
    }
  },
  [t('megaMenu.products.reporting', 'Advanced Reporting')]: {
    [t('megaMenu.bi.label', "Business Intelligence")]: {
      title: t('megaMenu.bi.title', "Business Intelligence"),
      subtitle: t('megaMenu.bi.subtitle', "Turn your raw data into actionable insights."),
      modules: [
        { icon: BarChart2, title: t('megaMenu.bi.dashboards', "Custom Dashboards"), desc: t('megaMenu.bi.dashboardsDesc', "Drag-and-drop widget builder.") },
        { icon: PieChart, title: t('megaMenu.bi.financialReports', "Financial Reports"), desc: t('megaMenu.bi.financialReportsDesc', "P&L, Balance Sheets, and Cash Flow statements.") },
        { icon: Database, title: t('megaMenu.bi.warehousing', "Data Warehousing"), desc: t('megaMenu.bi.warehousingDesc', "Consolidate data from multiple sources.") },
        { icon: Activity, title: t('megaMenu.bi.realtime', "Real-time Metrics"), desc: t('megaMenu.bi.realtimeDesc', "Live monitoring of critical KPIs.") },
        { icon: Send, title: t('megaMenu.bi.scheduled', "Scheduled Reports"), desc: t('megaMenu.bi.scheduledDesc', "Automated email delivery to stakeholders.") },
        { icon: Shield, title: t('megaMenu.bi.roleAccess', "Role-based Access"), desc: t('megaMenu.bi.roleAccessDesc', "Control who sees sensitive financial data.") }
      ]
    },
    [t('megaMenu.financialAnalytics.label', "Financial Analytics")]: {
      title: t('megaMenu.financialAnalytics.title', "Financial Analytics"),
      subtitle: t('megaMenu.financialAnalytics.subtitle', "Deep-dive into revenue, costs, and profit margins."),
      modules: [
        { icon: TrendingUp, title: t('megaMenu.financialAnalytics.revenueForecasting', "Revenue Forecasting"), desc: t('megaMenu.financialAnalytics.revenueForecastingDesc', "Predictive models based on historical sales.") },
        { icon: Calculator, title: t('megaMenu.financialAnalytics.costAllocation', "Cost Allocation"), desc: t('megaMenu.financialAnalytics.costAllocationDesc', "Track expenses across departments and projects.") },
        { icon: Search, title: t('megaMenu.financialAnalytics.auditTrails', "Audit Trails"), desc: t('megaMenu.financialAnalytics.auditTrailsDesc', "Detailed logs for compliance and auditing.") },
        { icon: CreditCard, title: t('megaMenu.financialAnalytics.cashFlow', "Cash Flow Analysis"), desc: t('megaMenu.financialAnalytics.cashFlowDesc', "Real-time liquidity and burn rate tracking.") },
        { icon: Briefcase, title: t('megaMenu.financialAnalytics.budget', "Budget vs Actuals"), desc: t('megaMenu.financialAnalytics.budgetDesc', "Variance reporting for strict budget control.") },
        { icon: FileText, title: t('megaMenu.financialAnalytics.tax', "Tax Reporting"), desc: t('megaMenu.financialAnalytics.taxDesc', "Automated generation of local tax documents.") }
      ]
    },
    [t('megaMenu.operationalMetrics.label', "Operational Metrics")]: {
      title: t('megaMenu.operationalMetrics.title', "Operational Metrics"),
      subtitle: t('megaMenu.operationalMetrics.subtitle', "Monitor efficiency and output across your supply chain."),
      modules: [
        { icon: Truck, title: t('megaMenu.operationalMetrics.logistics', "Logistics Tracking"), desc: t('megaMenu.operationalMetrics.logisticsDesc', "Delivery times and fleet efficiency stats.") },
        { icon: Box, title: t('megaMenu.operationalMetrics.turnover', "Inventory Turnover"), desc: t('megaMenu.operationalMetrics.turnoverDesc', "Identify slow-moving stock and optimize space.") },
        { icon: Settings, title: t('megaMenu.operationalMetrics.yield', "Production Yield"), desc: t('megaMenu.operationalMetrics.yieldDesc', "Monitor manufacturing defect rates and output.") },
        { icon: Users, title: t('megaMenu.operationalMetrics.labor', "Labor Efficiency"), desc: t('megaMenu.operationalMetrics.laborDesc', "Track output per hour for shift workers.") },
        { icon: CheckCircle, title: t('megaMenu.operationalMetrics.qualityMetrics', "Quality Metrics"), desc: t('megaMenu.operationalMetrics.qualityMetricsDesc', "Analyze return rates and defect reasons.") },
        { icon: Zap, title: t('megaMenu.operationalMetrics.downtime', "Downtime Analysis"), desc: t('megaMenu.operationalMetrics.downtimeDesc', "Track and minimize equipment failure times.") }
      ]
    }
  },
  [t('megaMenu.products.workflow', 'Workflow Automation')]: {
    [t('megaMenu.processManagement.label', "Process Management")]: {
      title: t('megaMenu.processManagement.title', "Process Management"),
      subtitle: t('megaMenu.processManagement.subtitle', "Automate repetitive tasks and approval chains."),
      modules: [
        { icon: Layout, title: t('megaMenu.processManagement.visualBuilder', "Visual Builder"), desc: t('megaMenu.processManagement.visualBuilderDesc', "No-code drag-and-drop workflow creator.") },
        { icon: CheckCircle, title: t('megaMenu.processManagement.approvals', "Approval Matrices"), desc: t('megaMenu.processManagement.approvalsDesc', "Multi-level conditional approval routing.") },
        { icon: Zap, title: t('megaMenu.processManagement.triggers', "Event Triggers"), desc: t('megaMenu.processManagement.triggersDesc', "Launch workflows based on system events.") },
        { icon: Clock, title: t('megaMenu.processManagement.sla', "SLA Tracking"), desc: t('megaMenu.processManagement.slaDesc', "Monitor bottlenecks and task turnaround times.") },
        { icon: Mail, title: t('megaMenu.processManagement.notifications', "Notifications"), desc: t('megaMenu.processManagement.notificationsDesc', "Automated alerts via email, SMS, or Slack.") },
        { icon: FileText, title: t('megaMenu.processManagement.auditTrails', "Audit Trails"), desc: t('megaMenu.processManagement.auditTrailsDesc', "Complete history of every workflow action.") }
      ]
    },
    [t('megaMenu.itService.label', "IT Service Management")]: {
      title: t('megaMenu.itService.title', "IT Service Management"),
      subtitle: t('megaMenu.itService.subtitle', "Automate internal IT ticketing and asset provisioning."),
      modules: [
        { icon: Shield, title: t('megaMenu.itService.accessRequests', "Access Requests"), desc: t('megaMenu.itService.accessRequestsDesc', "Automate software provisioning approvals.") },
        { icon: Wrench, title: t('megaMenu.itService.incidentRouting', "Incident Routing"), desc: t('megaMenu.itService.incidentRoutingDesc', "Auto-assign tickets based on issue type.") },
        { icon: Server, title: t('megaMenu.itService.assetDeployment', "Asset Deployment"), desc: t('megaMenu.itService.assetDeploymentDesc', "Track laptops and software licenses.") },
        { icon: Lock, title: t('megaMenu.itService.securityAlerts', "Security Alerts"), desc: t('megaMenu.itService.securityAlertsDesc', "Trigger lockdown workflows on breach detection.") },
        { icon: Users, title: t('megaMenu.itService.vendorOnboarding', "Vendor Onboarding"), desc: t('megaMenu.itService.vendorOnboardingDesc', "Streamline IT setup for new contractors.") },
        { icon: FileText, title: t('megaMenu.itService.complianceLogs', "Compliance Logs"), desc: t('megaMenu.itService.complianceLogsDesc', "Automated reporting for IT audits.") }
      ]
    },
    [t('megaMenu.hrOnboarding.label', "HR Onboarding")]: {
      title: t('megaMenu.hrOnboarding.title', "HR Onboarding"),
      subtitle: t('megaMenu.hrOnboarding.subtitle', "Seamlessly transition new hires into the company."),
      modules: [
        { icon: UserPlus, title: t('megaMenu.hrOnboarding.documents', "Document Collection"), desc: t('megaMenu.hrOnboarding.documentsDesc', "Automate ID and tax form submissions.") },
        { icon: PenTool, title: t('megaMenu.hrOnboarding.signatures', "Digital Signatures"), desc: t('megaMenu.hrOnboarding.signaturesDesc', "Route contracts for legally binding signatures.") },
        { icon: Settings, title: t('megaMenu.hrOnboarding.accountSetup', "Account Setup"), desc: t('megaMenu.hrOnboarding.accountSetupDesc', "Trigger IT workflows to create emails.") },
        { icon: Heart, title: t('megaMenu.hrOnboarding.welcome', "Welcome Journeys"), desc: t('megaMenu.hrOnboarding.welcomeDesc', "Drip-feed company culture and training emails.") },
        { icon: CheckCircle, title: t('megaMenu.hrOnboarding.checklists', "Task Checklists"), desc: t('megaMenu.hrOnboarding.checklistsDesc', "Ensure managers complete desk setup.") },
        { icon: BarChart2, title: t('megaMenu.hrOnboarding.surveys', "Feedback Surveys"), desc: t('megaMenu.hrOnboarding.surveysDesc', "Automated 30-60-90 day check-ins.") }
      ]
    }
  },
  [t('megaMenu.products.noCode', 'No-Code App Builder')]: {
    [t('megaMenu.internalPortals.label', "Internal Portals")]: {
      title: t('megaMenu.internalPortals.title', "Internal Portals"),
      subtitle: t('megaMenu.internalPortals.subtitle', "Build secure dashboards for your team without coding."),
      modules: [
        { icon: Database, title: t('megaMenu.internalPortals.dataConnections', "Data Connections"), desc: t('megaMenu.internalPortals.dataConnectionsDesc', "Link directly to Emvive ERP tables securely.") },
        { icon: Layout, title: t('megaMenu.internalPortals.dragDrop', "Drag-and-Drop UI"), desc: t('megaMenu.internalPortals.dragDropDesc', "Build interfaces with pre-made components.") },
        { icon: Shield, title: t('megaMenu.internalPortals.roleLogic', "Role-Based Logic"), desc: t('megaMenu.internalPortals.roleLogicDesc', "Show or hide elements based on user roles.") },
        { icon: Search, title: t('megaMenu.internalPortals.filtering', "Advanced Filtering"), desc: t('megaMenu.internalPortals.filteringDesc', "Create custom search views for employees.") },
        { icon: Link2, title: t('megaMenu.internalPortals.hooks', "Workflow Hooks"), desc: t('megaMenu.internalPortals.hooksDesc', "Trigger automations from button clicks.") },
        { icon: Lock, title: t('megaMenu.internalPortals.sso', "SSO Integration"), desc: t('megaMenu.internalPortals.ssoDesc', "Seamless login using corporate credentials.") }
      ]
    },
    [t('megaMenu.customerApps.label', "Customer Apps")]: {
      title: t('megaMenu.customerApps.title', "Customer Apps"),
      subtitle: t('megaMenu.customerApps.subtitle', "Create white-labeled portals for your clients."),
      modules: [
        { icon: Smartphone, title: t('megaMenu.customerApps.mobile', "Mobile Optimized"), desc: t('megaMenu.customerApps.mobileDesc', "Responsive designs that look great on phones.") },
        { icon: Globe, title: t('megaMenu.customerApps.domains', "Custom Domains"), desc: t('megaMenu.customerApps.domainsDesc', "Host portals on your company URL.") },
        { icon: CreditCard, title: t('megaMenu.customerApps.payments', "Payment Gateways"), desc: t('megaMenu.customerApps.paymentsDesc', "Accept invoices directly through the portal.") },
        { icon: MessageSquare, title: t('megaMenu.customerApps.chat', "Support Chat"), desc: t('megaMenu.customerApps.chatDesc', "Embed live chat widgets for customers.") },
        { icon: Star, title: t('megaMenu.customerApps.whiteLabel', "White Labeling"), desc: t('megaMenu.customerApps.whiteLabelDesc', "Full control over colors, logos, and fonts.") },
        { icon: Activity, title: t('megaMenu.customerApps.usage', "Usage Analytics"), desc: t('megaMenu.customerApps.usageDesc', "Track how clients interact with the app.") }
      ]
    },
    [t('megaMenu.fieldService.label', "Field Service Apps")]: {
      title: t('megaMenu.fieldService.title', "Field Service Apps"),
      subtitle: t('megaMenu.fieldService.subtitle', "Empower remote workers with custom mobile tools."),
      modules: [
        { icon: Wifi, title: t('megaMenu.fieldService.offline', "Offline Mode"), desc: t('megaMenu.fieldService.offlineDesc', "Data syncs automatically when signal returns.") },
        { icon: Map, title: t('megaMenu.fieldService.gps', "GPS Tracking"), desc: t('megaMenu.fieldService.gpsDesc', "Log locations for deliveries and site visits.") },
        { icon: Camera, title: t('megaMenu.fieldService.photos', "Photo Uploads"), desc: t('megaMenu.fieldService.photosDesc', "Capture proof of delivery or site damage.") },
        { icon: PenTool, title: t('megaMenu.fieldService.eSignatures', "E-Signatures"), desc: t('megaMenu.fieldService.eSignaturesDesc', "Collect customer sign-offs in the field.") },
        { icon: Clock, title: t('megaMenu.fieldService.timeTracking', "Time Tracking"), desc: t('megaMenu.fieldService.timeTrackingDesc', "Start and stop timers for billable hours.") },
        { icon: Truck, title: t('megaMenu.fieldService.inventoryCheck', "Inventory Check"), desc: t('megaMenu.fieldService.inventoryCheckDesc', "Scan barcodes to view van stock levels.") }
      ]
    }
  }
});
