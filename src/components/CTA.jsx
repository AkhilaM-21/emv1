import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './CTA.css';

const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="cta-section">
      <div className="cta-panel">
        <span className="cta-eyebrow">READY WHEN YOU ARE</span>
        
        <h2 className="cta-title">
          Run your operations like <span className="text-accent">it's 2030</span>.
        </h2>
        
        <p className="cta-subtitle">
          Ten-minute setup. Free for 30 days. Bring your team, bring your books,<br />
          bring your countries.
        </p>

        <div className="cta-actions">
          <a className="cta-btn-primary" href="#demo">
            Start free <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
          </a>
          <a className="cta-btn-secondary" href="#demo">
            Book a walkthrough
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
