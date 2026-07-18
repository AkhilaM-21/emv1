const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

const en = {
  header: {
    getStarted: "Get Started",
    regions: {
      india: "India",
      saudi: "Saudi Arabia",
      dubai: "Dubai"
    },
    nav: {
      products: "Products",
      enterprises: "Enterprises",
      customers: "Customers",
      partners: "Partners",
      resources: "Resources"
    },
    exploreProducts: "Explore all products"
  },
  hero: {
    badge: "New: AI-Powered Insights",
    titleLine1: "Unify Your",
    titleLine2: "Enterprise",
    desc: "A single, intelligent platform to manage your finances, supply chain, and workforce. Built for scale, designed for simplicity.",
    primaryBtn: "Book a Demo",
    secondaryBtn: "View Features",
    rotator: ["Finance", "Supply Chain", "Workforce", "Operations"]
  },
  clients: {
    trusted: "3600+ Trusted companies all over the world"
  },
  about: {
    badge: "About Us",
    title: "Dedicated to Building\nScalable Solutions",
    desc: "We specialize in providing top-tier technological solutions tailored to your business needs. Our expertise in Microsoft Dynamics, Cloud Computing, and custom Application Development ensures that your enterprise stays ahead of the curve.",
    years: "Years of Experience",
    projects: "Projects Delivered",
    features: [
      "Microsoft Dynamics Implementation",
      "Cloud Computing & Migration",
      "Custom Application Development",
      "Enterprise IT Solutions"
    ],
    learnMore: "Learn More"
  },
  services: {
    badge: "Our Services",
    title: "Intelligent Solutions for\nModern Enterprises",
    readMore: "Read More"
  },
  servicesData: {
    s1_title: "Microsoft Dynamics",
    s1_desc: "Empower your business with comprehensive ERP and CRM solutions tailored to streamline operations.",
    s2_title: "Cloud Computing",
    s2_desc: "Secure, scalable, and efficient cloud infrastructure solutions to modernize your IT environment.",
    s3_title: "App Development",
    s3_desc: "Custom application development leveraging the latest technologies for maximum performance.",
    s4_title: "IT Infrastructure",
    s4_desc: "Robust and resilient IT infrastructure setup and management for uninterrupted business flow."
  },
  features: {
    badge: "Departments",
    title: "One Platform for Every Team"
  },
  featuresData: {
    f1_title: "Finance & Accounting",
    f1_desc: "Automate invoicing, track cash flow in real-time, and streamline compliance. Connect every transaction directly to your core ledger.",
    f2_title: "Sales & CRM",
    f2_desc: "Manage pipelines, forecast revenue accurately, and close deals faster. Give your sales team full visibility into customer history.",
    f3_title: "Human Resources",
    f3_desc: "Simplify onboarding, automate complex payroll calculations, and empower your workforce with intuitive self-service portals.",
    f4_title: "Operations & Supply Chain",
    f4_desc: "Optimize inventory levels, manage vendor relationships, and track logistics from procurement all the way to final delivery.",
    f5_title: "Marketing",
    f5_desc: "Launch targeted campaigns, track ROI on marketing spend, and seamlessly hand off qualified leads to your sales teams.",
    f6_title: "IT & Security",
    f6_desc: "Maintain complete control over user access, monitor system health, and ensure enterprise-grade data security across all modules."
  },
  products: {
    badge: "Our Products",
    title: "Intelligent Enterprise Solutions"
  },
  productsData: {
    p1_title: "Cloud ERP",
    p1_desc: "A comprehensive, scalable Enterprise Resource Planning solution that integrates all your core business processes in real-time. Unify your financials, supply chain, operations, and commerce.",
    p2_title: "HR & Payroll",
    p2_desc: "Streamline your human resources management and payroll processing. Automate employee onboarding, attendance tracking, and ensure accurate, timely compensation.",
    p3_title: "CRM & Sales",
    p3_desc: "Build stronger customer relationships and drive sales growth. Track interactions, manage pipelines, and leverage actionable insights to close deals faster.",
    p4_title: "Advanced Reporting",
    p4_desc: "Transform your raw data into meaningful intelligence. Create custom dashboards, visualize trends, and make data-driven decisions with powerful analytics.",
    p5_title: "Workflow Automation",
    p5_desc: "Eliminate manual tasks and optimize business efficiency. Design custom workflows that automatically route approvals, trigger actions, and reduce human error.",
    p6_title: "E-Invoicing",
    p6_desc: "Secure, compliant, and seamless electronic invoicing. Digitize your billing process, track invoice statuses, and integrate directly with your financial systems.",
    targetIndustries: "Target Industries"
  },
  why: {
    badge: "Benefits",
    title: "Why Choose Emvive",
    subtitle: "One platform to run your entire enterprise — ERP, CRM, HR, Invoicing, and more — with the performance, security, and simplicity your teams deserve."
  },
  whyData: {
    b1_title: "Unified Platform, Zero Silos",
    b1_desc: "From Cloud ERP and CRM to HR & Payroll and E-Invoicing — Emvive connects every department on a single platform. No more juggling between disconnected tools or importing spreadsheets.",
    b2_title: "99.9% Uptime Guarantee",
    b2_desc: "Our cloud infrastructure is built for mission-critical operations. Real-time monitoring, automatic failovers, and load balancing keep your business running 24/7 without disruption.",
    b3_title: "Enterprise-Grade Security",
    b3_desc: "End-to-end encryption, role-based access control, SSO/SAML authentication, and comprehensive audit trails. Your financial data, HR records, and customer information stay protected.",
    b4_title: "Intuitive by Design",
    b4_desc: "Every module — from Workflow Automation to Advanced Reporting — is crafted with clean interfaces that your teams can adopt in days, not months. Less training, faster ROI."
  },
  faq: {
    badge: "FAQ",
    title: "Ask Emvive Anything",
    subtitle: "Browse the questions our customers ask most — get clear, instant answers about running your enterprise on Emvive."
  },
  faqData: {
    q1: "How long does it take to implement Emvive?",
    a1: "Usually 2-4 weeks depending on data migration complexity. Our dedicated onboarding team handles the heavy lifting to ensure a smooth transition from your legacy systems.",
    q2: "Does Emvive integrate with legacy on-premise systems?",
    a2: "Yes, via our secure API gateway and custom connectors. We routinely integrate with older ERPs and specialized local databases without disruption.",
    q3: "Is my enterprise data secure on the cloud?",
    a3: "Absolutely. We use AES-256 encryption at rest and in transit. We are fully SOC-2 Type II compliant with regular third-party penetration testing.",
    q4: "Can I customize the reporting dashboards?",
    a4: "Yes, every user can build custom views with drag-and-drop widgets. You can filter, group, and export data in real-time without needing IT support.",
    q5: "Do you offer 24/7 technical support?",
    a5: "Yes, our enterprise plans include 24/7 dedicated account support with a guaranteed 1-hour SLA for critical issues.",
    q6: "How does pricing scale as we add employees?",
    a6: "We offer tiered per-user pricing that decreases in cost-per-user as you scale. You only pay for active seats, and there are no hidden module fees."
  },
  globe: {
    customers: "+2,781 Customers",
    scaling: "Scaling their business with us",
    badge: "GLOBAL PRESENCE",
    title: "One platform, offices across the globe",
    subtitle: "From India to Saudi Arabia and Dubai, Emvive powers enterprises across regions — drag the globe to explore where we operate."
  },
  footer: {
    emailLabel: "Email Address*",
    agree: "I agree to Emvive processing my personal data in accordance with Emvive's",
    privacy: "Privacy Policy",
    subscribe: "SUBSCRIBE",
    products: "PRODUCTS",
    industries: "INDUSTRIES",
    legal: "LEGAL & SOCIAL",
    hugeText: "Unify. Automate. Scale.",
    copyright: "© 2026 Emvive Inc."
  },
  megaMenu: {
    products: {
      cloudErp: "Cloud ERP",
      hrPayroll: "HR & Payroll",
      crmSales: "CRM & Sales",
      reporting: "Advanced Reporting",
      workflow: "Workflow Automation",
      noCode: "No-Code App Builder",
      exploreAll: "Explore all products"
    },
    manufacturing: {
      title: "Manufacturing",
      production: "Production Planning",
      productionDesc: "Optimize shop floor operations",
      quality: "Quality Control",
      qualityDesc: "Automated inspection workflows",
      maintenance: "Predictive Maintenance",
      maintenanceDesc: "IoT-driven asset management"
    },
    retail: {
      title: "Retail & POS",
      inventory: "Inventory for Retail & POS",
      inventoryDesc: "Real-time stock tracking tailored for Retail & POS operations.",
      financial: "Financial Management",
      financialDesc: "ZATCA-compliant accounting and ledger.",
      supplyChain: "Supply Chain",
      supplyChainDesc: "Automate POs and supplier management seamlessly.",
      vendor: "Vendor Portal",
      vendorDesc: "Self-service access for your vendors.",
      invoicing: "Invoicing & Billing",
      invoicingDesc: "Generate e-invoices instantly.",
      pos: "Advanced POS",
      posDesc: "Unified commerce and quick multi-branch sales processing."
    },
    healthcare: {
      title: "Healthcare",
      patient: "Patient Records",
      patientDesc: "HIPAA-compliant data management",
      scheduling: "Staff Scheduling",
      schedulingDesc: "Shift and rotation optimization",
      billing: "Medical Billing",
      billingDesc: "Automated insurance claims"
    }
  },
  retailInventory: {
    title: "in Your Retail Operations",
    subtitle: "Secure your supply chain and manage your inventory from a single platform. Real-time stock tracking tailored specifically for fast-paced Retail environments.",
    bookDemo: "Book a Demo 🚀",
    statsBadge: "STATS",
    f1Title: "Connect & Discover",
    f1Desc: "Map out your entire inventory network—from warehouse shelves to store fronts—in one unified view. Sync data across your POS systems and eCommerce platforms instantly.",
    f2Title: "Identify Shrinkage & Risks",
    f2Desc: "Inventory discrepancies can be buried deep, obscured by miscounts, delayed vendor shipments, and returns. Emvive digs through the layers to map out interdependencies and oversights to identify exactly where stock is leaking.",
    f3Title: "Automate Remediation",
    f3Desc: "Reduce manual stock-taking and eliminate stockouts. Let AI-driven restocking alerts and automated purchase orders maintain optimal levels so you never miss a sale.",
    c1Title: "Demand Forecasting",
    c1Desc: "Use historical sales data across all channels to predict future inventory needs accurately.",
    c2Title: "Automated Restocking",
    c2Desc: "Set minimum thresholds and let Emvive automatically generate POs when stock runs low.",
    c3Title: "Unified Stock Levels",
    c3Desc: "Connect your POS, eCommerce, and warehouses into one centralized, real-time inventory ledger."
  }
};

const ar = {
  header: {
    getStarted: "البدء",
    regions: {
      india: "الهند",
      saudi: "المملكة العربية السعودية",
      dubai: "دبي"
    },
    nav: {
      products: "المنتجات",
      enterprises: "المؤسسات",
      customers: "العملاء",
      partners: "الشركاء",
      resources: "الموارد"
    },
    exploreProducts: "استكشف كل المنتجات"
  },
  hero: {
    badge: "جديد: رؤى مدعومة بالذكاء الاصطناعي",
    titleLine1: "وحّد",
    titleLine2: "مؤسستك",
    desc: "منصة واحدة ذكية لإدارة أموالك وسلسلة التوريد والقوى العاملة. مصممة للتوسع، ومصممة للبساطة.",
    primaryBtn: "احجز عرضًا توضيحيًا",
    secondaryBtn: "عرض الميزات",
    rotator: ["المالية", "سلسلة التوريد", "القوى العاملة", "العمليات"]
  },
  clients: {
    trusted: "أكثر من 3600 شركة موثوقة في جميع أنحاء العالم"
  },
  about: {
    badge: "معلومات عنا",
    title: "مكرسون لبناء حلول\nقابلة للتطوير",
    desc: "نحن متخصصون في تقديم حلول تكنولوجية من الدرجة الأولى مصممة خصيصًا لتلبية احتياجات عملك. تضمن خبرتنا في Microsoft Dynamics والحوسبة السحابية وتطوير التطبيقات المخصصة بقاء مؤسستك في الطليعة.",
    years: "سنوات من الخبرة",
    projects: "مشاريع تم تسليمها",
    features: [
      "تنفيذ Microsoft Dynamics",
      "الحوسبة السحابية والهجرة",
      "تطوير تطبيقات مخصصة",
      "حلول تكنولوجيا المعلومات للمؤسسات"
    ],
    learnMore: "أعرف أكثر"
  },
  services: {
    badge: "خدماتنا",
    title: "حلول ذكية للمؤسسات\nالحديثة",
    readMore: "اقرأ المزيد"
  },
  servicesData: {
    s1_title: "مايكروسوفت ديناميكس",
    s1_desc: "قم بتمكين عملك من خلال حلول تخطيط موارد المؤسسات وإدارة علاقات العملاء الشاملة المصممة لتبسيط العمليات.",
    s2_title: "الحوسبة السحابية",
    s2_desc: "حلول البنية التحتية السحابية الآمنة والقابلة للتطوير والفعالة لتحديث بيئة تكنولوجيا المعلومات الخاصة بك.",
    s3_title: "تطوير التطبيقات",
    s3_desc: "تطوير تطبيقات مخصصة للاستفادة من أحدث التقنيات للحصول على أقصى أداء.",
    s4_title: "البنية التحتية لتكنولوجيا المعلومات",
    s4_desc: "إعداد وإدارة بنية تحتية قوية ومرنة لتكنولوجيا المعلومات لتدفق الأعمال دون انقطاع."
  },
  features: {
    badge: "الأقسام",
    title: "منصة واحدة لكل فريق"
  },
  featuresData: {
    f1_title: "المالية والمحاسبة",
    f1_desc: "أتمتة الفواتير وتتبع التدفق النقدي في الوقت الفعلي وتبسيط الامتثال. اربط كل معاملة مباشرة بدفتر الأستاذ الأساسي الخاص بك.",
    f2_title: "المبيعات وإدارة علاقات العملاء",
    f2_desc: "إدارة خطوط الأنابيب، والتنبؤ بالإيرادات بدقة، وإغلاق الصفقات بشكل أسرع. امنح فريق المبيعات الخاص بك رؤية كاملة لتاريخ العميل.",
    f3_title: "الموارد البشرية",
    f3_desc: "تبسيط الإعداد، وأتمتة حسابات كشوف المرتبات المعقدة، وتمكين القوى العاملة لديك من خلال بوابات الخدمة الذاتية البديهية.",
    f4_title: "العمليات وسلسلة التوريد",
    f4_desc: "تحسين مستويات المخزون، وإدارة علاقات الموردين، وتتبع الخدمات اللوجستية من المشتريات وصولاً إلى التسليم النهائي.",
    f5_title: "التسويق",
    f5_desc: "إطلاق حملات مستهدفة، وتتبع عائد الاستثمار في الإنفاق التسويقي، وتسليم العملاء المحتملين المؤهلين بسلاسة إلى فرق المبيعات الخاصة بك.",
    f6_title: "تكنولوجيا المعلومات والأمن",
    f6_desc: "الحفاظ على التحكم الكامل في وصول المستخدم، ومراقبة صحة النظام، وضمان أمن البيانات على مستوى المؤسسة عبر جميع الوحدات."
  },
  products: {
    badge: "منتجاتنا",
    title: "حلول مؤسسية ذكية"
  },
  productsData: {
    p1_title: "تخطيط موارد المؤسسات السحابي",
    p1_desc: "حل شامل وقابل للتطوير لتخطيط موارد المؤسسات يدمج جميع عمليات عملك الأساسية في الوقت الفعلي. قم بتوحيد أموالك وسلسلة التوريد والعمليات والتجارة.",
    p2_title: "الموارد البشرية والرواتب",
    p2_desc: "تبسيط إدارة الموارد البشرية ومعالجة كشوف المرتبات. أتمتة تأهيل الموظفين وتتبع الحضور وضمان تعويض دقيق وفي الوقت المناسب.",
    p3_title: "إدارة علاقات العملاء والمبيعات",
    p3_desc: "بناء علاقات أقوى مع العملاء ودفع نمو المبيعات. تتبع التفاعلات وإدارة خطوط الأنابيب والاستفادة من الرؤى القابلة للتنفيذ لإغلاق الصفقات بشكل أسرع.",
    p4_title: "إعداد التقارير المتقدمة",
    p4_desc: "تحويل بياناتك الأولية إلى ذكاء مفيد. أنشئ لوحات معلومات مخصصة وتصور الاتجاهات واتخذ قرارات تعتمد على البيانات من خلال تحليلات قوية.",
    p5_title: "أتمتة سير العمل",
    p5_desc: "القضاء على المهام اليدوية وتحسين كفاءة العمل. صمم مهام سير عمل مخصصة تقوم تلقائيًا بتوجيه الموافقات وبدء الإجراءات وتقليل الأخطاء البشرية.",
    p6_title: "الفوترة الإلكترونية",
    p6_desc: "فواتير إلكترونية آمنة ومتوافقة وسلسة. قم برقمنة عملية الفوترة الخاصة بك وتتبع حالات الفواتير والتكامل مباشرة مع أنظمتك المالية.",
    targetIndustries: "الصناعات المستهدفة"
  },
  why: {
    badge: "المزايا",
    title: "لماذا تختار Emvive",
    subtitle: "منصة واحدة لإدارة مؤسستك بالكامل - التخطيط، العملاء، الموارد البشرية، الفواتير، والمزيد - بالأداء والأمان والبساطة التي تستحقها فرقك."
  },
  whyData: {
    b1_title: "منصة موحدة، بلا صوامع",
    b1_desc: "من Cloud ERP و CRM إلى الموارد البشرية والرواتب والفوترة الإلكترونية - يربط Emvive كل قسم على منصة واحدة. لا مزيد من التوفيق بين الأدوات المنفصلة أو استيراد جداول البيانات.",
    b2_title: "ضمان وقت التشغيل بنسبة 99.9٪",
    b2_desc: "تم تصميم بنيتنا التحتية السحابية للعمليات الحرجة. تحافظ المراقبة في الوقت الفعلي والتجاوز التلقائي للفشل وموازنة التحميل على تشغيل عملك على مدار الساعة طوال أيام الأسبوع دون انقطاع.",
    b3_title: "أمان على مستوى المؤسسة",
    b3_desc: "تشفير شامل، وتحكم في الوصول المستند إلى الدور، ومصادقة SSO / SAML، ومسارات تدقيق شاملة. تظل بياناتك المالية وسجلات الموارد البشرية ومعلومات العملاء محمية.",
    b4_title: "بديهي بالتصميم",
    b4_desc: "تم تصميم كل وحدة - من أتمتة سير العمل إلى إعداد التقارير المتقدمة - بواجهات نظيفة يمكن لفرقك تبنيها في غضون أيام، وليس أشهر. تدريب أقل، عائد استثمار أسرع."
  },
  faq: {
    badge: "الأسئلة الشائعة",
    title: "اسأل Emvive أي شيء",
    subtitle: "تصفح الأسئلة التي يطرحها عملاؤنا - واحصل على إجابات واضحة وفورية حول إدارة مؤسستك على Emvive."
  },
  faqData: {
    q1: "كم من الوقت يستغرق تنفيذ Emvive؟",
    a1: "عادة من 2-4 أسابيع اعتمادًا على تعقيد ترحيل البيانات. يتعامل فريقنا المخصص مع العمل الشاق لضمان انتقال سلس من أنظمتك القديمة.",
    q2: "هل يتكامل Emvive مع الأنظمة القديمة المحلية؟",
    a2: "نعم، عبر بوابة API الآمنة والموصلات المخصصة. نحن نتكامل بشكل روتيني مع أنظمة تخطيط موارد المؤسسات القديمة وقواعد البيانات المحلية المتخصصة دون انقطاع.",
    q3: "هل بيانات مؤسستي آمنة على السحابة؟",
    a3: "بالتأكيد. نحن نستخدم تشفير AES-256 في حالة الراحة وأثناء النقل. نحن متوافقون تمامًا مع SOC-2 Type II مع اختبار اختراق منتظم من طرف ثالث.",
    q4: "هل يمكنني تخصيص لوحات معلومات التقارير؟",
    a4: "نعم، يمكن لكل مستخدم إنشاء طرق عرض مخصصة باستخدام أدوات السحب والإفلات. يمكنك تصفية البيانات وتجميعها وتصديرها في الوقت الفعلي دون الحاجة إلى دعم تكنولوجيا المعلومات.",
    q5: "هل تقدمون دعمًا فنيًا على مدار الساعة طوال أيام الأسبوع؟",
    a5: "نعم، تتضمن خطط المؤسسات لدينا دعمًا مخصصًا للحساب على مدار الساعة طوال أيام الأسبوع مع ضمان اتفاقية مستوى الخدمة لمدة ساعة واحدة للمشكلات الحرجة.",
    q6: "كيف يتغير السعر عندما نضيف موظفين؟",
    a6: "نحن نقدم أسعارًا متدرجة لكل مستخدم تنخفض في التكلفة لكل مستخدم كلما تقدمت. أنت تدفع فقط للمقاعد النشطة، ولا توجد رسوم خفية على الوحدات."
  },
  globe: {
    customers: "+2,781 عميل",
    scaling: "توسيع نطاق أعمالهم معنا",
    badge: "حضور عالمي",
    title: "منصة واحدة، مكاتب حول العالم",
    subtitle: "من الهند إلى المملكة العربية السعودية ودبي، تدعم Emvive المؤسسات عبر المناطق — اسحب الكرة الأرضية لاستكشاف أماكن عملنا."
  },
  footer: {
    emailLabel: "عنوان البريد الإلكتروني*",
    agree: "أوافق على معالجة بياناتي الشخصية وفقًا لسياسة خصوصية Emvive.",
    privacy: "سياسة الخصوصية",
    subscribe: "اشتراك",
    products: "المنتجات",
    industries: "الصناعات",
    legal: "القانونية والاجتماعية",
    hugeText: "توحيد. أتمتة. توسيع.",
    copyright: "© 2026 Emvive Inc."
  },
  megaMenu: {
    products: {
      cloudErp: "تخطيط موارد المؤسسات",
      hrPayroll: "الموارد البشرية والرواتب",
      crmSales: "المبيعات وإدارة العلاقات",
      reporting: "تقارير متقدمة",
      workflow: "أتمتة سير العمل",
      noCode: "بناء تطبيقات بدون كود",
      exploreAll: "استكشف كل المنتجات"
    },
    manufacturing: {
      title: "تصنيع",
      production: "تخطيط الانتاج",
      productionDesc: "تحسين عمليات أرضية المتجر",
      quality: "مراقبة الجودة",
      qualityDesc: "سير عمل التفتيش الآلي",
      maintenance: "الصيانة التنبؤية",
      maintenanceDesc: "إدارة الأصول القائمة على إنترنت الأشياء"
    },
    retail: {
      title: "التجزئة ونقاط البيع",
      inventory: "جرد التجزئة ونقاط البيع",
      inventoryDesc: "تتبع المخزون في الوقت الفعلي مصمم لعمليات التجزئة ونقاط البيع.",
      financial: "الإدارة المالية",
      financialDesc: "دفتر الأستاذ والمحاسبة المتوافق مع ZATCA.",
      supplyChain: "سلسلة التوريد",
      supplyChainDesc: "أتمتة أوامر الشراء وإدارة الموردين بسلاسة.",
      vendor: "بوابة الموردين",
      vendorDesc: "وصول الخدمة الذاتية للموردين الخاص بك.",
      invoicing: "الفوترة",
      invoicingDesc: "توليد فواتير إلكترونية على الفور.",
      pos: "نقاط بيع متقدمة",
      posDesc: "تجارة موحدة ومعالجة مبيعات متعددة الفروع سريعة."
    },
    healthcare: {
      title: "الرعاية الصحية",
      patient: "سجلات المرضى",
      patientDesc: "إدارة البيانات المتوافقة مع HIPAA",
      scheduling: "جدولة الموظفين",
      schedulingDesc: "تحسين المناوبات والتناوب",
      billing: "الفواتير الطبية",
      billingDesc: "مطالبات التأمين الآلية"
    }
  },
  retailInventory: {
    title: "في عمليات التجزئة الخاصة بك",
    subtitle: "تأمين سلسلة التوريد الخاصة بك وإدارة مخزونك من منصة واحدة. تتبع المخزون في الوقت الفعلي المصمم خصيصًا لبيئات البيع بالتجزئة سريعة الخطى.",
    bookDemo: "احجز عرضًا توضيحيًا 🚀",
    statsBadge: "الإحصائيات",
    f1Title: "الاتصال والاكتشاف",
    f1Desc: "قم بتخطيط شبكة المخزون بأكملها - من أرفف المستودعات إلى واجهات المتاجر - في عرض موحد واحد. مزامنة البيانات عبر أنظمة نقاط البيع ومنصات التجارة الإلكترونية على الفور.",
    f2Title: "تحديد الانكماش والمخاطر",
    f2Desc: "يمكن أن تكون تناقضات المخزون مدفونة بعمق، وتحجبها الأخطاء في العد وتأخير شحنات الموردين والعوائد. تحفر Emvive عبر الطبقات لتحديد الترابطات والإغفالات لتحديد مكان تسرب المخزون بالضبط.",
    f3Title: "أتمتة المعالجة",
    f3Desc: "قلل من جرد المخزون اليدوي وتخلص من نفاذ المخزون. دع تنبيهات إعادة التخزين التي تعتمد على الذكاء الاصطناعي وأوامر الشراء الآلية تحافظ على المستويات المثلى حتى لا تفوتك أي عملية بيع.",
    c1Title: "التنبؤ بالطلب",
    c1Desc: "استخدم بيانات المبيعات التاريخية عبر جميع القنوات للتنبؤ باحتياجات المخزون المستقبلية بدقة.",
    c2Title: "إعادة التخزين الآلي",
    c2Desc: "قم بتعيين الحدود الدنيا ودع Emvive تنشئ تلقائيًا أوامر الشراء عندما ينخفض المخزون.",
    c3Title: "مستويات المخزون الموحدة",
    c3Desc: "قم بتوصيل نقطة البيع والتجارة الإلكترونية والمستودعات في دفتر أستاذ مخزون مركزي واحد في الوقت الفعلي."
  }
};

fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(localesDir, 'ar.json'), JSON.stringify(ar, null, 2));

console.log('Locale files generated successfully.');
