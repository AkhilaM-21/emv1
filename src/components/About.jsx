import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();
  const featuresList = t('about.features', { returnObjects: true });

  return (
    <section id="enterprise" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <div className="about-text">
              <span className="global-section-badge"><span className="global-badge-dot"></span> {t('about.badge', 'About Us')}</span>
              <h2>{t('about.title', 'Dedicated to Building Scalable Solutions')}</h2>
              <p>
                {t('about.desc', 'We specialize in providing top-tier technological solutions tailored to your business needs. Our expertise in Microsoft Dynamics, Cloud Computing, and custom Application Development ensures that your enterprise stays ahead of the curve.')}
              </p>
              <ul className="about-features">
                {Array.isArray(featuresList) && featuresList.map((feature, index) => (
                  <li key={index}><CheckCircle className="check-icon" /> {feature}</li>
                ))}
              </ul>
              <a href="#more" className="btn-primary">
                {t('about.learnMore', 'Learn More')}
              </a>
            </div>
          </div>
          <div className="about-visuals">
            <div className="about-card glass-panel card-1">
              <div className="stat-card">
                <h3>10+</h3>
                <p>{t('about.years', 'Years of Experience')}</p>
              </div>
              <div className="stat-card">
                <h3>500+</h3>
                <p>{t('about.projects', 'Projects Delivered')}</p>
              </div>
            </div>
            <div className="about-image glass-panel">
              <div className="abstract-shape"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
