import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDollarSign, TrendingUp, Users, Package, Megaphone, ShieldCheck, Hexagon } from 'lucide-react';
import './Features.css';

const FEATURES = [
  { id: 1, icon: CircleDollarSign, title: 'Finance & Accounting' },
  { id: 2, icon: TrendingUp, title: 'Sales & CRM' },
  { id: 3, icon: Users, title: 'Human Resources' },
  { id: 4, icon: Package, title: 'Operations & Supply Chain' },
  { id: 5, icon: Megaphone, title: 'Marketing' },
  { id: 6, icon: ShieldCheck, title: 'IT & Security' }
];

const FeatureCard = ({ feature, activeIndex, index }) => {
  const { t } = useTranslation();
  const Icon = feature.icon;
  const isActive = activeIndex === index;

  return (
    <div className={`feature-card ${isActive ? 'active' : ''}`}>
      <div className="feature-media" aria-hidden="true">
        <span className="feature-media-light" />
        <Icon size={150} className="feature-media-icon" />
      </div>

      <div className="feature-icon-box">
        <Icon size={24} />
      </div>
      <h3 className="feature-card-title">{t(`featuresData.f${feature.id}_title`, feature.title)}</h3>
      <p className="feature-card-desc">{t(`featuresData.f${feature.id}_desc`)}</p>
    </div>
  );
};

const Features = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <span className="features-badge">
            <span className="badge-dot-blue"></span>
            {t('features.badge', 'Departments')}
          </span>
          <h2 className="features-title">{t('features.title', 'One Platform for Every Team')}</h2>
        </div>

        <div className="features-layout">
          <svg className="connector-svg" preserveAspectRatio="none" viewBox="0 0 1000 600">
            <path className="conn-line" d="M 500 300 L 400 300 L 400 100 L 300 100" />
            <path className="conn-glow" d="M 500 300 L 400 300 L 400 100 L 300 100" />
            <path className="conn-line" d="M 500 300 L 300 300" />
            <path className="conn-glow glow-delay-1" d="M 500 300 L 300 300" />
            <path className="conn-line" d="M 500 300 L 400 300 L 400 500 L 300 500" />
            <path className="conn-glow glow-delay-2" d="M 500 300 L 400 300 L 400 500 L 300 500" />
            <path className="conn-line" d="M 500 300 L 600 300 L 600 100 L 700 100" />
            <path className="conn-glow glow-delay-3" d="M 500 300 L 600 300 L 600 100 L 700 100" />
            <path className="conn-line" d="M 500 300 L 700 300" />
            <path className="conn-glow glow-delay-1" d="M 500 300 L 700 300" />
            <path className="conn-line" d="M 500 300 L 600 300 L 600 500 L 700 500" />
            <path className="conn-glow glow-delay-2" d="M 500 300 L 600 300 L 600 500 L 700 500" />
          </svg>

          <div className="features-column left-col">
            {FEATURES.slice(0, 3).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} activeIndex={activeTab} index={index} />
            ))}
          </div>

          <div className="features-center">
            <div className="hub-logo-box">
              <Hexagon size={48} className="hub-icon" />
              <span className="hub-text">Emvive</span>
            </div>
          </div>

          <div className="features-column right-col">
            {FEATURES.slice(3, 6).map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} activeIndex={activeTab} index={index + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
