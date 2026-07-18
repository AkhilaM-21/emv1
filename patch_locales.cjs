const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const arPath = path.join(__dirname, 'src', 'locales', 'ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf-8'));

// Deep merge helper
function mergeDeep(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

const missingEn = {
  hero: {
    slides: [
      {
        badge: "ENTERPRISE GRADE",
        title: "Scale operations without limits",
        desc: "Designed for high-growth companies. Handle millions of transactions with 99.9% guaranteed uptime."
      },
      {
        badge: "AI-POWERED",
        title: "Automate your daily workflows",
        desc: "Eliminate manual data entry. Let AI route approvals, flag anomalies, and optimize your supply chain."
      },
      {
        badge: "REAL-TIME INSIGHTS",
        title: "Make faster decisions with live data",
        desc: "Track revenue, orders, inventory and workforce in real time. Emvive turns your operational data into clear, actionable insights the moment you need them."
      }
    ]
  },
  why: {
    badge: "Benefits",
    title: "Why Choose Emvive",
    subtitle: "One platform to run your entire enterprise — ERP, CRM, HR, Invoicing, and more — with the performance, security, and simplicity your teams deserve.",
    benefits: {
      1: { title: "Unified Platform, Zero Silos", desc: "From Cloud ERP and CRM to HR & Payroll and E-Invoicing — Emvive connects every department on a single platform. No more juggling between disconnected tools or importing spreadsheets." },
      2: { title: "99.9% Uptime Guarantee", desc: "Our cloud infrastructure is built for mission-critical operations. Real-time monitoring, automatic failovers, and load balancing keep your business running 24/7 without disruption." },
      3: { title: "Enterprise-Grade Security", desc: "End-to-end encryption, role-based access control, SSO/SAML authentication, and comprehensive audit trails. Your financial data, HR records, and customer information stay protected." },
      4: { title: "Intuitive by Design", desc: "Every module — from Workflow Automation to Advanced Reporting — is crafted with clean interfaces that your teams can adopt in days, not months. Less training, faster ROI." }
    }
  },
  faq: {
    badge: "FAQs",
    title: "Got Questions? We Have Answers.",
    subtitle: "Everything you need to know about Emvive's platform, implementation, and pricing.",
    contactTitle: "Still have questions?",
    contactDesc: "Can't find the answer you're looking for? Please chat to our friendly team.",
    contactBtn: "Get in touch"
  },
  faqData: {
    q1_q: "How long does it take to implement Emvive?", q1_a: "Usually 2-4 weeks depending on data migration complexity. Our dedicated onboarding team handles the heavy lifting to ensure a smooth transition from your legacy systems.",
    q2_q: "Does Emvive integrate with legacy on-premise systems?", q2_a: "Yes, via our secure API gateway and custom connectors. We routinely integrate with older ERPs and specialized local databases without disruption.",
    q3_q: "Is my enterprise data secure on the cloud?", q3_a: "Absolutely. We use AES-256 encryption at rest and in transit. We are fully SOC-2 Type II compliant with regular third-party penetration testing.",
    q4_q: "Can I customize the reporting dashboards?", q4_a: "Yes, every user can build custom views with drag-and-drop widgets. You can filter, group, and export data in real-time without needing IT support.",
    q5_q: "Do you offer 24/7 technical support?", q5_a: "Yes, our enterprise plans include 24/7 dedicated account support with a guaranteed 1-hour SLA for critical issues.",
    q6_q: "How does pricing scale as we add employees?", q6_a: "We offer tiered per-user pricing that decreases in cost-per-user as you scale. You only pay for active seats, and there are no hidden module fees."
  },
  footer: {
    emailPlaceholder: "Email Address*",
    privacyConsent1: "I agree to Emvive processing my personal data in accordance with Emvive's",
    privacyConsent2: "Privacy Policy",
    subscribe: "SUBSCRIBE",
    productsTitle: "PRODUCTS",
    industriesTitle: "INDUSTRIES",
    industry: {
      Manufacturing: "Manufacturing",
      Retail: "Retail & E-commerce",
      Healthcare: "Healthcare",
      Financial: "Financial Services",
      Logistics: "Logistics & Supply Chain",
      Technology: "Technology & SaaS",
      Government: "Government & Public Sector"
    },
    legalTitle: "LEGAL & SOCIAL",
    legal: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cookie: "Cookie Policy",
      brand: "Brand Guidelines"
    },
    followUs: "Follow us",
    slogan: "Unify. Automate. Scale."
  },
  globe: {
    badge: "Global Reach",
    title: "Powering Enterprises Across the World",
    desc: "Join thousands of businesses across 140+ countries that rely on Emvive to scale their operations globally. Our resilient cloud infrastructure ensures your data is always accessible, secure, and compliant, no matter where your teams are located.",
    countries: "Countries",
    uptime: "Uptime",
    support: "Support"
  }
};

const missingAr = {
  hero: {
    slides: [
      {
        badge: "على مستوى المؤسسة",
        title: "توسيع العمليات بلا حدود",
        desc: "مصمم للشركات سريعة النمو. تعامل مع ملايين المعاملات بضمان تشغيل بنسبة 99.9٪."
      },
      {
        badge: "مدعوم بالذكاء الاصطناعي",
        title: "أتمتة سير عملك اليومي",
        desc: "تخلص من إدخال البيانات اليدوي. دع الذكاء الاصطناعي يوجه الموافقات ويشير إلى الحالات الشاذة ويحسن سلسلة التوريد الخاصة بك."
      },
      {
        badge: "رؤى في الوقت الفعلي",
        title: "اتخذ قرارات أسرع ببيانات حية",
        desc: "تتبع الإيرادات والطلبات والمخزون والقوى العاملة في الوقت الفعلي. تحول Emvive بياناتك التشغيلية إلى رؤى واضحة وقابلة للتنفيذ في اللحظة التي تحتاج إليها."
      }
    ]
  },
  why: {
    badge: "المزايا",
    title: "لماذا تختار Emvive",
    subtitle: "منصة واحدة لإدارة مؤسستك بالكامل - التخطيط، العملاء، الموارد البشرية، الفواتير، والمزيد - بالأداء والأمان والبساطة التي تستحقها فرقك.",
    benefits: {
      1: { title: "منصة موحدة، بلا صوامع", desc: "من Cloud ERP و CRM إلى الموارد البشرية والرواتب والفوترة الإلكترونية - يربط Emvive كل قسم على منصة واحدة. لا مزيد من التوفيق بين الأدوات المنفصلة أو استيراد جداول البيانات." },
      2: { title: "ضمان وقت التشغيل بنسبة 99.9٪", desc: "تم تصميم بنيتنا التحتية السحابية للعمليات الحرجة. تحافظ المراقبة في الوقت الفعلي والتجاوز التلقائي للفشل وموازنة التحميل على تشغيل عملك على مدار الساعة طوال أيام الأسبوع دون انقطاع." },
      3: { title: "أمان على مستوى المؤسسة", desc: "تشفير شامل، وتحكم في الوصول المستند إلى الدور، ومصادقة SSO / SAML، ومسارات تدقيق شاملة. تظل بياناتك المالية وسجلات الموارد البشرية ومعلومات العملاء محمية." },
      4: { title: "بديهي بالتصميم", desc: "تم تصميم كل وحدة - من أتمتة سير العمل إلى إعداد التقارير المتقدمة - بواجهات نظيفة يمكن لفرقك تبنيها في غضون أيام، وليس أشهر. تدريب أقل، عائد استثمار أسرع." }
    }
  },
  faq: {
    badge: "الأسئلة الشائعة",
    title: "هل لديك أسئلة؟ لدينا إجابات.",
    subtitle: "كل ما تحتاج لمعرفته حول منصة Emvive وتنفيذها وأسعارها.",
    contactTitle: "لا تزال لديك أسئلة؟",
    contactDesc: "لا يمكنك العثور على الإجابة التي تبحث عنها؟ يرجى الدردشة مع فريقنا الودود.",
    contactBtn: "ابقى على تواصل"
  },
  faqData: {
    q1_q: "كم من الوقت يستغرق تنفيذ Emvive؟", q1_a: "عادة من 2-4 أسابيع اعتمادًا على تعقيد ترحيل البيانات. يتعامل فريقنا المخصص مع العمل الشاق لضمان انتقال سلس من أنظمتك القديمة.",
    q2_q: "هل يتكامل Emvive مع الأنظمة القديمة المحلية؟", q2_a: "نعم، عبر بوابة API الآمنة والموصلات المخصصة. نحن نتكامل بشكل روتيني مع أنظمة تخطيط موارد المؤسسات القديمة وقواعد البيانات المحلية المتخصصة دون انقطاع.",
    q3_q: "هل بيانات مؤسستي آمنة على السحابة؟", q3_a: "بالتأكيد. نحن نستخدم تشفير AES-256 في حالة الراحة وأثناء النقل. نحن متوافقون تمامًا مع SOC-2 Type II مع اختبار اختراق منتظم من طرف ثالث.",
    q4_q: "هل يمكنني تخصيص لوحات معلومات التقارير؟", q4_a: "نعم، يمكن لكل مستخدم إنشاء طرق عرض مخصصة باستخدام أدوات السحب والإفلات. يمكنك تصفية البيانات وتجميعها وتصديرها في الوقت الفعلي دون الحاجة إلى دعم تكنولوجيا المعلومات.",
    q5_q: "هل تقدمون دعمًا فنيًا على مدار الساعة طوال أيام الأسبوع؟", q5_a: "نعم، تتضمن خطط المؤسسات لدينا دعمًا مخصصًا للحساب على مدار الساعة طوال أيام الأسبوع مع ضمان اتفاقية مستوى الخدمة لمدة ساعة واحدة للمشكلات الحرجة.",
    q6_q: "كيف يتغير السعر عندما نضيف موظفين؟", q6_a: "نحن نقدم أسعارًا متدرجة لكل مستخدم تنخفض في التكلفة لكل مستخدم كلما تقدمت. أنت تدفع فقط للمقاعد النشطة، ولا توجد رسوم خفية على الوحدات."
  },
  footer: {
    emailPlaceholder: "عنوان البريد الإلكتروني*",
    privacyConsent1: "أوافق على معالجة Emvive لبياناتي الشخصية وفقًا لـ",
    privacyConsent2: "سياسة الخصوصية",
    subscribe: "اشتراك",
    productsTitle: "المنتجات",
    industriesTitle: "الصناعات",
    industry: {
      Manufacturing: "التصنيع",
      Retail: "التجزئة والتجارة الإلكترونية",
      Healthcare: "الرعاية الصحية",
      Financial: "الخدمات المالية",
      Logistics: "اللوجستيات وسلسلة التوريد",
      Technology: "التكنولوجيا والبرمجيات كخدمة",
      Government: "الحكومة والقطاع العام"
    },
    legalTitle: "القانونية والاجتماعية",
    legal: {
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
      cookie: "سياسة ملفات تعريف الارتباط",
      brand: "إرشادات العلامة التجارية"
    },
    followUs: "تابعنا",
    slogan: "توحيد. أتمتة. توسيع."
  },
  globe: {
    badge: "الوصول العالمي",
    title: "دعم المؤسسات في جميع أنحاء العالم",
    desc: "انضم إلى آلاف الشركات في أكثر من 140 دولة تعتمد على Emvive لتوسيع عملياتها عالميًا. تضمن بنيتنا التحتية السحابية المرنة أن تكون بياناتك دائمًا متاحة وآمنة ومتوافقة، بغض النظر عن موقع فرقك.",
    countries: "بلدان",
    uptime: "وقت التشغيل",
    support: "الدعم"
  }
};

mergeDeep(en, missingEn);
mergeDeep(ar, missingAr);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));

console.log('Successfully patched translation files!');
