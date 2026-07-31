import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './WhyEmviveOriginal.css';

const WhyEmviveOriginal = () => {
  const { t } = useTranslation();

  /* Points are taken verbatim from the Emvive ERP Master Document —
     §11 Industry Use Cases, §4 ERP Modules, §4/§7 Compliance, §7 Global. */
  const benefits = [
    {
      id: 1,
      title: t('whyData.b1_title', 'Built for your industry'),
      points: [
        t('whyData.b1_p1', 'Construction & contracting'),
        t('whyData.b1_p2', 'Retail & restaurants'),
        t('whyData.b1_p3', 'Manufacturing'),
        t('whyData.b1_p4', 'Trading companies'),
        t('whyData.b1_p5', 'Service organizations'),
      ],
    },
    {
      id: 2,
      title: t('whyData.b2_title', 'One connected system'),
      points: [
        t('whyData.b2_p1', 'Financials & supply chain'),
        t('whyData.b2_p2', 'Sales & CRM'),
        t('whyData.b2_p3', 'Projects & manufacturing'),
        t('whyData.b2_p4', 'Human capital & payroll'),
        t('whyData.b2_p5', 'POS for retail & restaurants'),
      ],
    },
    {
      id: 3,
      title: t('whyData.b3_title', 'Compliance built in'),
      points: [
        t('whyData.b3_p1', 'ZATCA Phase 1 & 2'),
        t('whyData.b3_p2', 'GOSI contributions'),
        t('whyData.b3_p3', 'WPS payroll compliance'),
        t('whyData.b3_p4', 'End of service benefits'),
        t('whyData.b3_p5', 'VAT, GST & withholding tax'),
      ],
    },
    {
      id: 4,
      title: t('whyData.b4_title', 'Ready for every region'),
      points: [
        t('whyData.b4_p1', 'Multi-company'),
        t('whyData.b4_p2', 'Multi-currency'),
        t('whyData.b4_p3', 'Multi-country'),
        t('whyData.b4_p4', 'English & Arabic (RTL)'),
        t('whyData.b4_p5', 'Country-based tax rules'),
      ],
    },
  ];

  return (
    <section className="why-original-emvive-section" id="why-emvive">
      <div className="why-original-emvive-container">
        <div className="why-original-panel">
          {/* Header row: eyebrow + title + intro on the left, CTA on the right */}
          <div className="why-original-header">
            <div className="why-original-header-text">
              <span className="why-original-eyebrow">{t('why.badge', 'Why Us?')}</span>
              <h2 className="why-original-heading">
                {t('why.title1', 'One platform to run')}{' '}
                <span className="text-accent">
                  {t('why.title2', 'your')}{' '}
                  <br className="why-original-br" />
                  {t('why.title3', 'entire business.')}
                </span>
              </h2>
              <p className="why-original-subtitle">
                {t(
                  'why.subtitle',
                  'A next-generation, cloud-based, no-code enterprise platform that unifies finance, supply chain, sales, HR, projects, manufacturing and POS into a single system. Built for Saudi Arabia, the GCC and global enterprises — it is not just ERP software, it is a complete Business Operating System.'
                )}
              </p>
            </div>
            <a href="#products" className="why-original-cta">
              {t('why.cta', 'Explore platform modules')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Benefits Grid */}
          <div className="why-original-grid">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="why-original-card">
                <div className="why-original-card-body">
                  <h3 className="why-original-card-title">{benefit.title}</h3>
                  <ul className="why-original-points">
                    {benefit.points.map((point, i) => (
                      /* --i drives the stagger: each point steps forward
                         70ms after the one above it. */
                      <li key={point} style={{ '--i': i }}>
                        <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEmviveOriginal;
