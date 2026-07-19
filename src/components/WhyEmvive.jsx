import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import './WhyEmvive.css';

/* ------------------------------------------------------------------
   Card visuals — one looping illustration per card, sitting in a
   fixed-height panel at the bottom of the card (same pattern as the
   cloud-7 feature cards). All motion is CSS/SVG, no JS timers.
------------------------------------------------------------------ */

// 1. Industries scrolling past in two opposing marquee rows
const IndustryViz = () => {
  const rowA = ['Construction', 'Retail', 'Manufacturing', 'Trading'];
  const rowB = ['Restaurants', 'Services', 'Contracting', 'Wholesale'];
  const track = (items, cls) => (
    <div className={`viz-track ${cls}`}>
      {[...items, ...items].map((label, i) => (
        <span className="viz-pill" key={i}>
          {label}
        </span>
      ))}
    </div>
  );
  return (
    <div className="why-viz why-viz--marquee">
      {track(rowA, '')}
      {track(rowB, 'viz-track--rev')}
      {track(rowA, '')}
    </div>
  );
};

// 2. One system, every team connected to it
const ConnectedViz = () => {
  const people = [
    { x: 34, y: 30 },
    { x: 34, y: 110 },
    { x: 206, y: 30 },
    { x: 206, y: 110 },
    { x: 120, y: 16 },
    { x: 120, y: 124 },
  ];
  return (
    <div className="why-viz">
      <svg viewBox="0 0 240 140" className="viz-svg">
        {/* links, each carrying a packet to and from the system */}
        {people.map((p, i) => (
          <line
            key={`l${i}`}
            x1="120"
            y1="70"
            x2={p.x}
            y2={p.y}
            className="viz-wire"
          />
        ))}
        {people.map((p, i) => (
          <line
            key={`p${i}`}
            x1="120"
            y1="70"
            x2={p.x}
            y2={p.y}
            className="viz-packet"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* the people on each end */}
        {people.map((p, i) => (
          <g key={`u${i}`} className="viz-user" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={p.x} cy={p.y - 7} r="4.5" className="viz-user-head" />
            <path
              d={`M${p.x - 8},${p.y + 6} a8,8 0 0 1 16,0`}
              className="viz-user-body"
            />
          </g>
        ))}

        {/* the system itself */}
        <g className="viz-machine">
          <rect x="94" y="50" width="52" height="36" rx="5" className="viz-screen" />
          <rect x="100" y="57" width="26" height="3" rx="1.5" className="viz-screen-line" />
          <rect x="100" y="64" width="34" height="3" rx="1.5" className="viz-screen-line" />
          <rect x="100" y="71" width="20" height="3" rx="1.5" className="viz-screen-line viz-screen-line--hot" />
          <rect x="114" y="86" width="12" height="6" className="viz-stand" />
          <rect x="103" y="92" width="34" height="4" rx="2" className="viz-stand" />
        </g>
      </svg>
    </div>
  );
};

// 3. Compliance tags streaming behind a shield that stamps a check
const ComplianceViz = () => {
  const tags = ['ZATCA', 'GOSI', 'WPS', 'VAT', 'EOSB', 'E-INVOICE'];
  return (
    <div className="why-viz why-viz--shield">
      <div className="viz-stream">
        <div className="viz-track">
          {[...tags, ...tags].map((tag, i) => (
            <span className="viz-code" key={i}>
              {tag}
            </span>
          ))}
        </div>
        <div className="viz-track viz-track--rev">
          {[...tags, ...tags].reverse().map((tag, i) => (
            <span className="viz-code" key={i}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 120 130" className="viz-shield">
        <path
          d="M60 8 L108 30 L108 70 Q108 108 60 122 Q12 108 12 70 L12 30 Z"
          className="viz-shield-body"
        />
        <path d="M40 66 L54 80 L82 50" className="viz-check" />
      </svg>
    </div>
  );
};

import { geoEquirectangular, geoPath } from 'd3-geo';
import * as topojson from 'topojson-client';

// 4. Regions lighting up on a flat world map
const RegionViz = () => {
  const [landPath, setLandPath] = React.useState('');
  
  React.useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then((r) => r.json())
      .then((world) => {
        const land = topojson.feature(world, world.objects.land);
        // Create a flat projection centered around our points of interest
        const projection = geoEquirectangular()
          .scale(40)
          .translate([100, 80]); // Shift map to focus on Europe/Asia/Africa
        const pathGenerator = geoPath().projection(projection);
        setLandPath(pathGenerator(land));
      })
      .catch((err) => console.error('Map load error', err));
  }, []);

  // Approximate screen coordinates for the locations on this specific projection
  const dots = [
    { x: 131, y: 55, label: 'Saudi' },
    { x: 139, y: 57, label: 'Dubai' },
    { x: 158, y: 65, label: 'India' },
  ];

  return (
    <div className="why-viz">
      <svg viewBox="0 0 240 140" className="viz-svg viz-map">
        {/* World Map Background */}
        {landPath && (
          <path d={landPath} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        )}
        
        {/* Pings */}
        {landPath && dots.map((d, i) => (
          <g key={i} style={{ animationDelay: `${i * 0.6}s` }} className="viz-ping">
            <circle cx={d.x} cy={d.y} r="8" className="viz-ping-ring" />
            <circle cx={d.x} cy={d.y} r="2.5" className="viz-ping-dot" />
          </g>
        ))}

        {/* Labels */}
        {landPath && (
          <g className="viz-fx">
            <text x="175" y="46" className="viz-cur">Saudi</text>
            <text x="175" y="66" className="viz-cur">Dubai</text>
            <text x="175" y="86" className="viz-cur">India</text>
          </g>
        )}
      </svg>
    </div>
  );
};

const WhyEmvive = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      id: 1,
      title: t('whyData.b1_title', 'Built for your industry'),
      description: t(
        'whyData.b1_desc',
        'Pre-configured flows for construction, retail, manufacturing, and services reduce customization and risk, so you go live faster and with more confidence.'
      ),
      viz: <IndustryViz />,
    },
    {
      id: 2,
      title: t('whyData.b2_title', 'One connected system'),
      description: t(
        'whyData.b2_desc',
        'Finance, supply chain, sales, HR, and POS share a single cloud data model, so nothing is stitched together and nothing falls between systems.'
      ),
      viz: <ConnectedViz />,
    },
    {
      id: 3,
      title: t('whyData.b3_title', 'Compliance built in'),
      description: t(
        'whyData.b3_desc',
        'ZATCA e-invoicing, GOSI, WPS, and VAT are native to the platform, keeping every entity audit-ready without bolt-on tools or manual filing.'
      ),
      viz: <ComplianceViz />,
    },
    {
      id: 4,
      title: t('whyData.b4_title', 'Ready for every region'),
      description: t(
        'whyData.b4_desc',
        'Multi-company, multi-currency, and multi-country from day one, with local tax rules and full Arabic and English support across the platform.'
      ),
      viz: <RegionViz />,
    },
  ];

  return (
    <section className="why-emvive-section" id="why-emvive">
      <div className="why-emvive-container">
        <div className="why-panel">
          {/* Header row: eyebrow + title + intro on the left, CTA on the right */}
          <div className="why-header">
            <div className="why-header-text">
              <span className="why-eyebrow">{t('why.badge', 'Why Emvive?')}</span>
              <h2 className="why-heading">
                {t('why.title1', 'One platform to run')}{' '}
                <span className="text-accent">
                  {t('why.title2', 'your')}{' '}
                  <br className="why-br" />
                  {t('why.title3', 'entire business.')}
                </span>
              </h2>
              <p className="why-subtitle">
                {t(
                  'why.subtitle',
                  'Emvive is a next-generation, cloud-based, no-code enterprise platform that unifies finance, supply chain, sales, HR, projects, manufacturing and POS into a single system. Built for Saudi Arabia, the GCC and global enterprises — it is not just ERP software, it is a complete Business Operating System.'
                )}
              </p>
            </div>
            <a href="#products" className="why-cta">
              {t('why.cta', 'Explore Emvive modules')}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Benefits Grid */}
          <div className="why-grid">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="why-card">
                <div className="why-card-body">
                  <h3 className="why-card-title">{benefit.title}</h3>
                  <p className="why-card-desc">{benefit.description}</p>
                </div>
                {benefit.viz}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyEmvive;
