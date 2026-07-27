import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDollarSign, TrendingUp, Users, Package, BarChart3, ShieldCheck, FolderKanban, Factory, Store, FileCheck, Handshake, Blocks } from 'lucide-react';
import './Features.css';

/* Each department carries its own accent. `rgb` is the same colour as a raw
   triple so the CSS can build translucent tints from it without a second var. */
const FEATURES = [
  /* Order matters: on a 4-across grid no card may sit next to — or directly
     above/below — another from the same colour family. */
  { id: 1, icon: CircleDollarSign, title: 'Finance & Accounting', color: '#7c3aed', rgb: '124, 58, 237', grad: 'linear-gradient(165deg, #d9722a 0%, #114e87 100%)' },
  { id: 2, icon: TrendingUp, title: 'Sales & CRM', color: '#059669', rgb: '5, 150, 105', grad: 'linear-gradient(165deg, #059669 0%, #034e36 100%)' },
  { id: 3, icon: Users, title: 'Human Resources', color: '#2563eb', rgb: '37, 99, 235', grad: 'linear-gradient(165deg, #c14a2e 0%, #7c2617 100%)' },
  { id: 4, icon: Package, title: 'Operations & Supply Chain', color: '#f43f5e', rgb: '244, 63, 94', grad: 'linear-gradient(165deg, #cb8c1f 0%, #8b5b10 100%)' },
  { id: 5, icon: BarChart3, title: 'Analytics & Reporting', color: '#d97706', rgb: '217, 119, 6', grad: 'linear-gradient(165deg, #e2601f 0%, #9e3b0e 100%)' },
  { id: 6, icon: ShieldCheck, title: 'Security & Access', color: '#8466d9', rgb: '132, 102, 217', grad: 'linear-gradient(165deg, #6c40b2 0%, #3f2082 100%)' },
  { id: 7, icon: FolderKanban, title: 'Projects', color: '#0d9488', rgb: '13, 148, 136', grad: 'linear-gradient(165deg, #0d9488 0%, #0f514c 100%)' },
  { id: 8, icon: Factory, title: 'Manufacturing', color: '#4f46e5', rgb: '79, 70, 229', grad: 'linear-gradient(165deg, #c85a1e 0%, #17406f 100%)' },
  { id: 9, icon: Store, title: 'Retail & POS', color: '#9333ea', rgb: '147, 51, 234', grad: 'linear-gradient(165deg, #b14a2f 0%, #6f2b19 100%)' },
  { id: 10, icon: FileCheck, title: 'E-Invoicing & Tax', color: '#0891b2', rgb: '8, 145, 178', grad: 'linear-gradient(165deg, #0891b2 0%, #164e63 100%)' },
  { id: 11, icon: Handshake, title: 'Vendor & Customer Portals', color: '#e2601f', rgb: '226, 96, 31', grad: 'linear-gradient(165deg, #f0883e 0%, #b44410 100%)' },
  { id: 12, icon: Blocks, title: 'No-Code Studio', color: '#ec4899', rgb: '236, 72, 153', grad: 'linear-gradient(165deg, #ec4899 0%, #831843 100%)' }
];

const FeatureCard = ({ feature, variant }) => {
  const { t } = useTranslation();
  const Icon = feature.icon;
  const colored = variant === 'color';
  const solid = variant === 'solid';

  const cardStyle = solid
    ? { background: feature.grad }
    : colored
    ? { '--fc': feature.color, '--fc-rgb': feature.rgb }
    : undefined;

  return (
    <div
      className={`feature-card${solid ? ' feature-card--solid' : ''}`}
      style={cardStyle}
    >
      {!solid && (
        <div className="feature-media" aria-hidden="true">
          <span className="feature-media-light" />
          <Icon size={150} className="feature-media-icon" />
        </div>
      )}

      <span className="feature-ic">
        <Icon size={solid ? 30 : 34} strokeWidth={1.4} />
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
  const solid = variant === 'solid';

  const sectionClass = `features-section${
    solid ? ' features-section--solid' : colored ? ' features-section--color' : ''
  }`;

  return (
    <section className={sectionClass} id={id}>
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
            <FeatureCard key={feature.id} feature={feature} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
