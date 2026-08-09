import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './WhyEmvive.css';

const WhyEmvive = () => {
  const { t } = useTranslation();

  /* Points are taken verbatim from the Emvive ERP Master Document —
     §11 Industry Use Cases, §4 ERP Modules, §4/§7 Compliance, §7 Global. */
  const benefits = [
    {
      id: 1,
      label: t('whyData.b1_label', 'CONNECTED'),
      title: t('whyData.b1_title', 'One Connected Business System'),
      points: [
        t('whyData.b1_p1', 'Finance & Supply Chain'),
        t('whyData.b1_p2', 'Sales & CRM'),
        t('whyData.b1_p3', 'HCM & Payroll'),
        t('whyData.b1_p4', 'Projects & Manufacturing'),
        t('whyData.b1_p5', 'POS & E-Invoicing'),
      ],
    },
    {
      id: 2,
      label: t('whyData.b2_label', 'REGIONAL'),
      title: t('whyData.b2_title', 'Built for Regional Operations'),
      points: [
        t('whyData.b2_p1', 'Multi-company'),
        t('whyData.b2_p2', 'Multi-currency'),
        t('whyData.b2_p3', 'English & Arabic (RTL)'),
        t('whyData.b2_p4', 'Multi-language documents'),
        t('whyData.b2_p5', 'VAT, GST & sales tax'),
        t('whyData.b2_p6', 'Withholding tax & reverse charge'),
      ],
    },
    {
      id: 3,
      label: t('whyData.b3_label', 'COMPLIANT'),
      title: t('whyData.b3_title', 'Compliance Built Into the Platform'),
      points: [
        t('whyData.b3_p1', 'ZATCA Phase 1 & 2'),
        t('whyData.b3_p2', 'E-Invoicing APIs'),
        t('whyData.b3_p3', 'WPS payroll compliance'),
        t('whyData.b3_p4', 'GOSI capabilities'),
        t('whyData.b3_p5', 'EOSB calculations'),
        t('whyData.b3_p6', 'Audit logs'),
      ],
    },
    {
      id: 4,
      label: t('whyData.b4_label', 'ADAPTABLE'),
      title: t('whyData.b4_title', 'Adapt the Platform to Your Business'),
      points: [
        t('whyData.b4_p1', 'Drag-and-drop application builder'),
        t('whyData.b4_p2', 'Custom forms'),
        t('whyData.b4_p3', 'Workflow automation'),
        t('whyData.b4_p4', 'Approval chains'),
        t('whyData.b4_p5', 'APIs & Webhooks'),
      ],
    },
  ];

  return (
    <section className="why-emvive-section" id="why-emvive">
      <div className="why-emvive-container">
        <div className="why-panel">
          {/* Header row: eyebrow + title + intro on the left, CTA on the right */}
          <div className="why-header">
            <div className="why-header-text">
              <span className="why-eyebrow">{t('why.badge', 'WHY EMVIVE?')}</span>
              <h2 className="why-heading">
                {t('why.title1', 'More Than ERP.')}{' '}
                <span className="text-accent">
                  {t('why.title2', 'One System for')}{' '}
                  <br className="why-br" />
                  {t('why.title3', 'Running Your Business.')}
                </span>
              </h2>
              <p className="why-subtitle">
                {t(
                  'why.subtitle',
                  'EMVIVE brings ERP, POS, HCM, compliance, automation, reporting, and no-code capabilities into one cloud-based Business Operating System—so businesses can manage connected operations without treating every function as a separate system.'
                )}
              </p>
            </div>
            <a href="#products" className="why-cta">
              {t('why.cta', 'Explore the EMVIVE Platform')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Benefits Grid */}
          <div className="why-grid">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="why-card">
                <div className="why-card-body">
                  {benefit.label && <span className="why-card-label">{benefit.label}</span>}
                  <h3 className="why-card-title">{benefit.title}</h3>
                  <ul className="why-points">
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

export default WhyEmvive;
