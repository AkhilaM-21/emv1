const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src', 'locales', 'en.json');
const arPath = path.join(__dirname, 'src', 'locales', 'ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf-8'));

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
  retail: {
    title: "Retail Inventory",
    nav: {
      features: "Features",
      pricing: "Pricing"
    },
    hero: {
      badge: "Inventory for Retail & POS 2.0 is live!",
      titleHighlight: "Rooting Out",
      titleMain: "Stockouts in Your Retail Operations",
      desc: "Secure your supply chain and manage your inventory from a single platform. Real-time stock tracking tailored specifically for fast-paced Retail environments.",
      cta: "Book a Demo"
    },
    accordion: {
      a0_title: "Connect & Discover",
      a0_desc: "Once connected, Emvive's first mission is discovery — automatically syncing with your POS systems, eCommerce platforms, and warehouses. Within minutes, you can map out your entire stock ecosystem and identify discrepancies before they impact customers.",
      a1_title: "Identify Shrinkage & Risks",
      a1_desc: "Inventory discrepancies can be buried deep, obscured by miscounts, delayed vendor shipments, and returns. Emvive digs through the layers to map out interdependencies and oversights to identify exactly where stock is leaking.",
      a2_title: "Automate Remediation",
      a2_desc: "Stop manually counting and ordering. Emvive automatically generates Purchase Orders when stock dips below critical thresholds and routes them to the correct suppliers, keeping your business operations uninterrupted."
    },
    stat: {
      desc_0: "LESS TIME SPENT ON STOCK AUDITS",
      desc_1: "NRR INCREASE",
      desc_2: "HIGHER NRR IN YEAR 1",
      desc_3: "MORE EFFICIENCY PER MANAGER",
      desc_4: "HOURS SAVED ANNUALLY PER PERSON",
      desc_5: "LESS SHRINKAGE"
    },
    feature: {
      f0_title: "Unified Stock Levels", f0_desc: "Connect your POS, eCommerce, and warehouses into one centralized, real-time inventory ledger.",
      f1_title: "Automated Restocking", f1_desc: "Set minimum thresholds and let Emvive automatically generate POs when stock runs low.",
      f2_title: "Demand Forecasting", f2_desc: "Use historical sales data across all channels to predict future inventory needs accurately.",
      f3_title: "Omnichannel Ready", f3_desc: "Never oversell again. Instantly sync stock deductions across physical stores and online marketplaces.",
      f4_title: "Supplier Portal", f4_desc: "Give your vendors secure access to update delivery statuses and acknowledge automated POs.",
      f5_title: "Loss Prevention", f5_desc: "Track shrink, damages, and returns with detailed audit logs and role-based permissions."
    },
    pricing: {
      badge: "Pricing",
      title: "Simple pricing for every retail team",
      subtitle: "Start free, scale as you grow. No hidden fees — cancel anytime.",
      popular: "Most Popular",
      p0_name: "Starter", p0_price: "$0", p0_period: "/mo", p0_desc: "For single-store retailers getting started.", p0_f0: "1 store location", p0_f1: "Up to 500 SKUs", p0_f2: "Real-time stock tracking", p0_f3: "Email support", p0_cta: "Start Free",
      p1_name: "Growth", p1_price: "$49", p1_period: "/mo", p1_desc: "For growing multi-store retail operations.", p1_f0: "Up to 10 stores", p1_f1: "Unlimited SKUs", p1_f2: "Shrinkage & risk alerts", p1_f3: "Vendor management", p1_f4: "Priority support", p1_cta: "Start Free Trial",
      p2_name: "Enterprise", p2_price: "Custom", p2_period: "", p2_desc: "For large chains with advanced needs.", p2_f0: "Unlimited stores", p2_f1: "Advanced automation", p2_f2: "Dedicated success manager", p2_f3: "SSO & audit logs", p2_f4: "24/7 support", p2_cta: "Contact Sales"
    }
  }
};

const missingAr = {
  retail: {
    title: "جرد التجزئة",
    nav: {
      features: "الميزات",
      pricing: "الأسعار"
    },
    hero: {
      badge: "جرد التجزئة ونقاط البيع 2.0 متاح الآن!",
      titleHighlight: "القضاء على",
      titleMain: "نفاذ المخزون في عمليات التجزئة الخاصة بك",
      desc: "قم بتأمين سلسلة التوريد الخاصة بك وإدارة مخزونك من منصة واحدة. تتبع المخزون في الوقت الفعلي مصمم خصيصًا لبيئات البيع بالتجزئة سريعة الخطى.",
      cta: "احجز عرضًا توضيحيًا"
    },
    accordion: {
      a0_title: "الاتصال والاكتشاف",
      a0_desc: "بمجرد الاتصال، مهمة Emvive الأولى هي الاكتشاف - المزامنة التلقائية مع أنظمة نقاط البيع الخاصة بك ومنصات التجارة الإلكترونية والمستودعات. في غضون دقائق، يمكنك تخطيط نظام المخزون بأكمله وتحديد التناقضات قبل أن تؤثر على العملاء.",
      a1_title: "تحديد الانكماش والمخاطر",
      a1_desc: "يمكن أن تكون تناقضات المخزون مدفونة بعمق، وتحجبها الأخطاء في العد وتأخير شحنات الموردين والعوائد. تحفر Emvive عبر الطبقات لتحديد الترابطات والإغفالات لتحديد مكان تسرب المخزون بالضبط.",
      a2_title: "أتمتة المعالجة",
      a2_desc: "توقف عن الجرد والطلب يدويًا. تقوم Emvive تلقائيًا بإنشاء أوامر شراء عندما ينخفض المخزون عن الحدود الحرجة وتوجيهها إلى الموردين الصحيحين، مما يحافظ على عمليات عملك دون انقطاع."
    },
    stat: {
      desc_0: "وقت أقل في تدقيق المخزون",
      desc_1: "زيادة في صافي الإيرادات",
      desc_2: "صافي إيرادات أعلى في السنة 1",
      desc_3: "كفاءة أكبر لكل مدير",
      desc_4: "ساعات يتم توفيرها سنويًا لكل شخص",
      desc_5: "انكماش أقل"
    },
    feature: {
      f0_title: "مستويات المخزون الموحدة", f0_desc: "قم بتوصيل نقطة البيع والتجارة الإلكترونية والمستودعات في دفتر أستاذ مخزون مركزي واحد في الوقت الفعلي.",
      f1_title: "إعادة التخزين الآلي", f1_desc: "قم بتعيين الحدود الدنيا ودع Emvive تنشئ تلقائيًا أوامر الشراء عندما ينخفض المخزون.",
      f2_title: "التنبؤ بالطلب", f2_desc: "استخدم بيانات المبيعات التاريخية عبر جميع القنوات للتنبؤ باحتياجات المخزون المستقبلية بدقة.",
      f3_title: "جاهزية القنوات المتعددة", f3_desc: "لا تبالغ في البيع أبدًا. قم بمزامنة خصومات المخزون عبر المتاجر الفعلية والأسواق عبر الإنترنت على الفور.",
      f4_title: "بوابة الموردين", f4_desc: "امنح مورديك وصولاً آمنًا لتحديث حالات التسليم والإقرار بأوامر الشراء الآلية.",
      f5_title: "منع الخسائر", f5_desc: "تتبع الانكماش والأضرار والعوائد بسجلات تدقيق مفصلة وأذونات تعتمد على الأدوار."
    },
    pricing: {
      badge: "الأسعار",
      title: "أسعار بسيطة لكل فريق بيع بالتجزئة",
      subtitle: "ابدأ مجانًا، وتوسع مع نموك. لا توجد رسوم خفية - يمكنك الإلغاء في أي وقت.",
      popular: "الأكثر شيوعًا",
      p0_name: "مبتدئ", p0_price: "$0", p0_period: "/شهريًا", p0_desc: "لتجار التجزئة في المتاجر الفردية الذين بدأوا للتو.", p0_f0: "موقع متجر واحد", p0_f1: "حتى 500 SKU", p0_f2: "تتبع المخزون في الوقت الفعلي", p0_f3: "دعم عبر البريد الإلكتروني", p0_cta: "ابدأ مجانًا",
      p1_name: "النمو", p1_price: "$49", p1_period: "/شهريًا", p1_desc: "لعمليات البيع بالتجزئة المتنامية في المتاجر المتعددة.", p1_f0: "حتى 10 متاجر", p1_f1: "SKUs غير محدودة", p1_f2: "تنبيهات الانكماش والمخاطر", p1_f3: "إدارة الموردين", p1_f4: "دعم ذو أولوية", p1_cta: "ابدأ التجربة المجانية",
      p2_name: "مؤسسة", p2_price: "مخصص", p2_period: "", p2_desc: "للسلاسل الكبيرة ذات الاحتياجات المتقدمة.", p2_f0: "متاجر غير محدودة", p2_f1: "أتمتة متقدمة", p2_f2: "مدير نجاح مخصص", p2_f3: "SSO وسجلات التدقيق", p2_f4: "دعم على مدار الساعة طوال أيام الأسبوع", p2_cta: "اتصل بالمبيعات"
    }
  }
};

mergeDeep(en, missingEn);
mergeDeep(ar, missingAr);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));

console.log('Successfully patched Retail Inventory translations!');
