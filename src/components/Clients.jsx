import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './Clients.css';

const CLIENTS = [
  { id: 1, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/brand-1.png' },
  { id: 2, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/brand-2.png' },
  { id: 3, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/brand-3.png' },
  { id: 4, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/top-logo-New.png' },
  { id: 5, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/brand-4.png' },
  { id: 6, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/header-logo.png' },
  { id: 7, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/ship_logo.png' },
  { id: 8, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/taxillalogo_l.png' },
  { id: 9, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/logo-h.png' },
  { id: 10, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/sappco.png' },
  { id: 11, imgSrc: 'https://tekspurts.com/EMvive/assets/img/brand/home-3/saptex.jpg' },
  { id: 12, imgSrc: '/tamimi_logo.svg' }
];

const Clients = () => {
  const { t } = useTranslation();
  return (
    <section className="emv-clients-section">
      <div className="container emv-clients-container">

        <div className="emv-clients-top-block">
          <div className="emv-subtitle">{t('clients.meetEmvive', 'MEET EMVIVE')}</div>

          <div className="emv-headline-row">
            <h2 className="emv-headline">
              {t('clients.headline1', 'Enterprise software and AI that ')}<span className="text-accent">{t('clients.headline2', 'knows your industry.')}</span>
            </h2>
            <a href="#customer-stories" className="emv-customer-btn">
              {t('clients.viewAllStories', 'View all customer stories')} <ArrowRight size={16} />
            </a>
          </div>

          <p className="emv-description">
            {t('clients.descPart1', 'Emvive is a global leader in cloud enterprise software built for the way industries actually work. We combine deep operational expertise, proven processes and ')}<a href="#ai-agents" className="text-link">{t('clients.aiAgents', 'AI agents')}</a>{t('clients.descPart2', " — so your operations don't just run, they think, adapt and act. Turn your business into an agentic enterprise, and set the pace for your industry.")}
          </p>
        </div>

        <div className="emv-clients-bottom">
          <h6 className="emv-brands-title">{t('clients.brandsTrust', 'BRANDS THAT TRUST US')}</h6>
          <div className="emv-marquee-wrapper" dir="ltr">
            <div className="emv-marquee-content">
              {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, idx) => (
                <div className="emv-logo-item" key={idx}>
                  <img src={client.imgSrc} alt={`Client ${client.id}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Clients;
