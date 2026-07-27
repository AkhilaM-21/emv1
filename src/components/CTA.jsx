import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="cta-section">
      <div className="cta-panel">
        <span className="cta-eyebrow">READY TO RUN YOUR BUSINESS BETTER?</span>

        <h2 className="cta-title">
          See what <span className="text-accent">one connected business platform</span><br />
          can do for you.
        </h2>

        <p className="cta-subtitle">
          Discover how Emvive can bring your finance, supply chain, sales, people, projects, POS, compliance, reporting and workflows together around the way your business operates.
        </p>

        <div className="cta-actions">
          <a className="cta-btn-primary" href="#demo">
            Book Your Emvive Demo <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
          </a>
          <a className="cta-btn-secondary" href="#demo">
            Talk to an Emvive Specialist
          </a>
        </div>

        <p className="cta-microcopy">
          See the applications and workflows most relevant to your business.
        </p>
      </div>
    </section>
  );
};

export default CTA;
