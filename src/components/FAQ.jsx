import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Sparkles } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    id: 1,
    question: "How long does implementation take?",
    answer: "Usually 2-4 weeks depending on data migration complexity. Our dedicated onboarding team handles the heavy lifting to ensure a smooth transition from your legacy systems."
  },
  {
    id: 2,
    question: "Does the platform integrate with legacy on-premise systems?",
    answer: "Yes, via our secure API gateway and custom connectors. We routinely integrate with older ERPs and specialized local databases without disruption."
  },
  {
    id: 3,
    question: "Is my enterprise data secure on the cloud?",
    answer: "Absolutely. We use AES-256 encryption at rest and in transit. We are fully SOC-2 Type II compliant with regular third-party penetration testing."
  },
  {
    id: 4,
    question: "Can I customize the reporting dashboards?",
    answer: "Yes, every user can build custom views with drag-and-drop widgets. You can filter, group, and export data in real-time without needing IT support."
  },
  {
    id: 5,
    question: "Do you offer 24/7 technical support?",
    answer: "Yes, our enterprise plans include 24/7 dedicated account support with a guaranteed 1-hour SLA for critical issues."
  },
  {
    id: 6,
    question: "How does pricing scale as we add employees?",
    answer: "We offer tiered per-user pricing that decreases in cost-per-user as you scale. You only pay for active seats, and there are no hidden module fees."
  }
];

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqs = [
    {
      id: 1,
      question: t('faqData.q1', 'How long does implementation take?'),
      answer: t('faqData.a1', 'Usually 2-4 weeks depending on data migration complexity. Our dedicated onboarding team handles the heavy lifting to ensure a smooth transition from your legacy systems.')
    },
    {
      id: 2,
      question: t('faqData.q2', 'Does the platform integrate with legacy on-premise systems?'),
      answer: t('faqData.a2', 'Yes, via our secure API gateway and custom connectors. We routinely integrate with older ERPs and specialized local databases without disruption.')
    },
    {
      id: 3,
      question: t('faqData.q3', 'Is my enterprise data secure on the cloud?'),
      answer: t('faqData.a3', 'Absolutely. We use AES-256 encryption at rest and in transit. We are fully SOC-2 Type II compliant with regular third-party penetration testing.')
    },
    {
      id: 4,
      question: t('faqData.q4', 'Can I customize the reporting dashboards?'),
      answer: t('faqData.a4', 'Yes, every user can build custom views with drag-and-drop widgets. You can filter, group, and export data in real-time without needing IT support.')
    },
    {
      id: 5,
      question: t('faqData.q5', 'Do you offer 24/7 technical support?'),
      answer: t('faqData.a5', 'Yes, our enterprise plans include 24/7 dedicated account support with a guaranteed 1-hour SLA for critical issues.')
    },
    {
      id: 6,
      question: t('faqData.q6', 'How does pricing scale as we add employees?'),
      answer: t('faqData.a6', 'We offer tiered per-user pricing that decreases in cost-per-user as you scale. You only pay for active seats, and there are no hidden module fees.')
    }
  ];

  const N = faqs.length;
  const ITEM_H = 78;      // px height of each row in the reel
  const CENTER_Y = 250;   // vertical centre of the 500px search area
  const CYCLE = 2000;     // ms per question (decreased for faster scrolling)

  // Start in the middle copy so there are always questions above and below.
  const [step, setStep] = useState(N);
  const [noAnim, setNoAnim] = useState(false);
  const [paused, setPaused] = useState(false);

  // Step the marquee up by one question every cycle
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setStep((s) => s + 1), CYCLE);
    return () => clearTimeout(t);
  }, [step, paused]);

  // Circular loop: once we've scrolled a full list, jump back one list with no
  // animation. The surroundings are identical there, so it's perfectly seamless.
  useEffect(() => {
    if (step >= 2 * N) {
      const t = setTimeout(() => {
        setNoAnim(true);
        setStep((s) => s - N);
      }, 650);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [step]);

  useEffect(() => {
    if (!noAnim) return undefined;
    const r = requestAnimationFrame(() => setNoAnim(false));
    return () => cancelAnimationFrame(r);
  }, [noAnim]);

  const idx = ((step % N) + N) % N;                       // question currently in the bar
  const translate = CENTER_Y - (step + 0.5) * ITEM_H;     // centre the active row on the bar
  const reelItems = [...faqs, ...faqs, ...faqs];          // 3 copies for a circular loop

  return (
    <section className="faq-section" id="faq">
      {/* Real Dropship background — blue light beams across the whole section */}
      <img className="faq-bg-image" src="/ai-search-bg.webp" alt="" aria-hidden="true" />

      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-badge">
            <span className="badge-dot-blue"></span>
            {t('faq.badge', 'FAQ')}
          </span>
          <h2 className="faq-title">{t('faq.title', 'Ask Us Anything')}</h2>
          <p className="faq-subtitle">
            {t('faq.subtitle', 'Browse the questions our customers ask most — get clear, instant answers about running your enterprise on our platform.')}
          </p>
        </div>

        <div className="faq-body">
        <div
          className="faq-search-area"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Scrolling reel of questions (the centre one sits behind the bar) */}
          <div className="reel-viewport">
            <div
              className="reel-track"
              style={{
                transform: `translateY(${translate}px)`,
                transition: noAnim ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {reelItems.map((faq, i) => (
                <div
                  key={i}
                  className={`reel-item ${i === step ? 'is-center' : ''} ${i > step ? 'is-below' : ''}`}
                  style={{ height: ITEM_H }}
                  onClick={() => setStep(N + (i % N))}
                >
                  {faq.question}
                </div>
              ))}
            </div>
          </div>

          {/* The search bar sits fixed in the centre, showing the current question */}
          <div className="search-bar-overlay">
            <span className="ov-icon"><Sparkles size={20} color="#e2601f" /></span>
            <span className="ov-query">{faqs[idx].question}</span>
            <button className="ov-send" aria-label="Ask"><ArrowUp size={20} strokeWidth={2.5} color="#fff" /></button>
          </div>

          {/* Answer — below the bar, left edge aligned under the send arrow */}
          <div className="faq-answer-panel" key={idx}>
            <p className="answer-text">{faqs[idx].answer}</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
