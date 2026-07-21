import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDollarSign, TrendingUp, Users, Package, Megaphone, ShieldCheck, FolderKanban, Factory, Store, FileCheck, Handshake, Blocks } from 'lucide-react';
import './Features.css';

/* Each department carries its own accent. `rgb` is the same colour as a raw
   triple so the CSS can build translucent tints from it without a second var. */
const FEATURES = [
  /* Order matters: on a 4-across grid no card may sit next to — or directly
     above/below — another from the same colour family. */
  { id: 1, icon: CircleDollarSign, title: 'Finance & Accounting', color: '#7c3aed', rgb: '124, 58, 237' },
  { id: 2, icon: TrendingUp, title: 'Sales & CRM', color: '#059669', rgb: '5, 150, 105' },
  { id: 3, icon: Users, title: 'Human Resources', color: '#2563eb', rgb: '37, 99, 235' },
  { id: 4, icon: Package, title: 'Operations & Supply Chain', color: '#f43f5e', rgb: '244, 63, 94' },
  { id: 5, icon: Megaphone, title: 'Marketing', color: '#d97706', rgb: '217, 119, 6' },
  { id: 6, icon: ShieldCheck, title: 'IT & Security', color: '#8466d9', rgb: '132, 102, 217' },
  { id: 7, icon: FolderKanban, title: 'Projects', color: '#0d9488', rgb: '13, 148, 136' },
  { id: 8, icon: Factory, title: 'Manufacturing', color: '#4f46e5', rgb: '79, 70, 229' },
  { id: 9, icon: Store, title: 'Retail & POS', color: '#9333ea', rgb: '147, 51, 234' },
  { id: 10, icon: FileCheck, title: 'E-Invoicing & Tax', color: '#0891b2', rgb: '8, 145, 178' },
  { id: 11, icon: Handshake, title: 'Vendor & Customer Portals', color: '#e2601f', rgb: '226, 96, 31' },
  { id: 12, icon: Blocks, title: 'No-Code Studio', color: '#ec4899', rgb: '236, 72, 153' }
];

const FeatureCard = ({ feature, colored }) => {
  const { t } = useTranslation();
  const Icon = feature.icon;

  return (
    <div
      className="feature-card"
      style={colored ? { '--fc': feature.color, '--fc-rgb': feature.rgb } : undefined}
    >
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

const Features = ({ variant = 'mono', id = 'features' }) => {
  const { t } = useTranslation();
  const colored = variant === 'color';

  return (
    <section
      className={`features-section${colored ? ' features-section--color' : ''}`}
      id={id}
    >
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
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} colored={colored} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
