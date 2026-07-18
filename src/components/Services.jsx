import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Code, Database, Server, Smartphone, Zap } from 'lucide-react';
import './Services.css';

const SERVICES = [
  {
    icon: Database,
    title: 'Microsoft Dynamics',
    desc: 'Empower your business with comprehensive ERP and CRM solutions tailored to streamline operations.'
  },
  {
    icon: Cloud,
    title: 'Cloud Computing',
    desc: 'Secure, scalable, and efficient cloud infrastructure solutions to modernize your IT environment.'
  },
  {
    icon: Code,
    title: 'App Development',
    desc: 'Custom application development leveraging the latest technologies for maximum performance.'
  },
  {
    icon: Server,
    title: 'IT Infrastructure',
    desc: 'Robust and resilient IT infrastructure setup and management for uninterrupted business flow.'
  }
];

const Services = () => {
  const { t } = useTranslation();

  return (
    <section id="services" className="services-section section-padding">
      <div className="container">
        <div className="section-title text-center">
          <span className="global-section-badge"><span className="global-badge-dot"></span> {t('services.badge', 'Our Services')}</span>
          <h2>{t('services.title', 'Intelligent Solutions for Modern Enterprises')}</h2>
        </div>

        <div className="services-grid">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="service-card glass-panel group">
                <div className="service-icon-wrapper">
                  <Icon className="service-icon group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3>{t(`servicesData.s${index + 1}_title`, service.title)}</h3>
                <p>{t(`servicesData.s${index + 1}_desc`, service.desc)}</p>
                <a href="#services" className="service-link">
                  {t('services.readMore', 'Read More')} &rarr;
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
