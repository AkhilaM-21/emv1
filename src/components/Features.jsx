import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDollarSign, TrendingUp, Users, Package, Megaphone, ShieldCheck, FolderKanban, Factory, Store, FileCheck, Handshake, Blocks } from 'lucide-react';
import './Features.css';

const FEATURES = [
  { id: 1, icon: CircleDollarSign, title: 'Finance & Accounting' },
  { id: 2, icon: TrendingUp, title: 'Sales & CRM' },
  { id: 3, icon: Users, title: 'Human Resources' },
  { id: 4, icon: Package, title: 'Operations & Supply Chain' },
  { id: 5, icon: Megaphone, title: 'Marketing' },
  { id: 6, icon: ShieldCheck, title: 'IT & Security' },
  { id: 7, icon: FolderKanban, title: 'Projects' },
  { id: 8, icon: Factory, title: 'Manufacturing' },
  { id: 9, icon: Store, title: 'Retail & POS' },
  { id: 10, icon: FileCheck, title: 'E-Invoicing & Tax' },
  { id: 11, icon: Handshake, title: 'Vendor & Customer Portals' },
  { id: 12, icon: Blocks, title: 'No-Code Studio' }
];

const FeatureCard = ({ feature, index }) => {
  const { t } = useTranslation();
  const Icon = feature.icon;

  return (
    <div className="feature-card">
      {/* revealed on hover — dark panel with the department icon behind */}
      <div className="feature-media" aria-hidden="true">
        <span className="feature-media-light" />
        <Icon size={150} className="feature-media-icon" />
      </div>

      <span className="feature-ic">
        <Icon size={34} strokeWidth={1.4} />
      </span>

      <div className="feature-body">
        <h3 className="feature-card-title">
          {t(`featuresData.f${feature.id}_title`, feature.title)}
        </h3>
        <p className="feature-card-desc">{t(`featuresData.f${feature.id}_desc`)}</p>
      </div>

      <span className="feature-link">
        {t('features.learnMore', 'Learn more')}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </div>
  );
};

const Features = () => {
  const { t } = useTranslation();

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <div className="features-header-text">
            <span className="features-kicker">{t('features.badge', 'Departments')}</span>
            <h2 className="features-heading">
              {t('features.title1', 'Built for the way')}{' '}
              <span className="text-accent">{t('features.title2', 'your teams')}</span>{' '}
              {t('features.title3', 'actually work.')}
            </h2>
            <p className="features-sub">
              {t(
                'features.subtitle',
                'Finance, sales, HR, operations, marketing and IT on one platform — configured, not customized.'
              )}
            </p>
          </div>
          <a href="#products" className="features-cta">
            {t('features.cta', 'Explore industries')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
