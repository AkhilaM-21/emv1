import React from 'react';
import {
  ArrowRight, Cloud, Users, TrendingUp, CircleDollarSign, AlertTriangle,
  Layers, BarChart3, ShieldCheck, Blocks, Truck, Workflow, ReceiptText,
} from 'lucide-react';
import { useHeroContent } from './heroContent';
import './HeroCoframe.css';

/* STYLE 4 — outlined browser frame on a warm wash, with product cards
   floating over its left edge and a feature strip beneath. */

const FEATURES = [
  { icon: <Layers size={20} />, label: 'Unified ERP Suite' },
  { icon: <BarChart3 size={20} />, label: 'Real-Time Reporting' },
  { icon: <ShieldCheck size={20} />, label: 'Role-Based Security' },
  { icon: <Blocks size={20} />, label: 'Low-Code App Builder' },
];

const HeroCoframe = () => {
  const c = useHeroContent();

  return (
    <section className="hfr-hero">
      <div className="hfr-glow" aria-hidden="true" />
      {/* faint vertical guides down both edges, as on the live hero */}
      <div className="hfr-vlines" aria-hidden="true" />

      <div className="hfr-grid">
        {/* ---------------- left: copy ---------------- */}
        <div className="hfr-copy">
          <h1 className="hfr-title">
            {c.headline1}{' '}
            <span className="hfr-accent">{c.headline2}</span>
          </h1>

          <p className="hfr-sub">{c.subtitle}</p>

          <a href="#demo" className="cta-btn-primary hfr-cta">
            {c.primaryCta}
            <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
          </a>
        </div>

        {/* ---------------- right: framed screen + cards ---------------- */}
        <div className="hfr-visual">
          {/* the outlined browser shell */}
          <div className="hfr-frame" aria-hidden="true">
            <div className="hfr-frame-bar">
              <span className="hfr-frame-pill" />
              <span className="hfr-frame-dot" />
              <span className="hfr-frame-dot" />
            </div>
          </div>

          {/* small card — top left */}
          <div className="hfr-card hfr-card-a">
            <div className="hfr-card-head">
              <span className="hfr-card-ic" style={{ '--c': '#2563eb' }}><Cloud size={18} /></span>
              <span className="hfr-card-name">ERP</span>
              <span className="hfr-card-badge">42 <Users size={11} /></span>
            </div>
          </div>

          {/* expanded card — left */}
          <div className="hfr-card hfr-card-b">
            <div className="hfr-card-head">
              <span className="hfr-card-ic" style={{ '--c': '#e2601f' }}><CircleDollarSign size={18} /></span>
              <span className="hfr-card-name">Financials</span>
              <span className="hfr-card-badge">18 <Users size={11} /></span>
            </div>
            <div className="hfr-card-alert">
              <AlertTriangle size={13} />
              Approvals pending
            </div>
            <div className="hfr-card-body">
              <span className="hfr-card-label">Total revenue this quarter</span>
              <b className="hfr-card-value">$4.28M</b>
              <span className="hfr-card-note">up 12.6% on the previous quarter</span>
            </div>
          </div>

          {/* people card — top right */}
          <div className="hfr-card hfr-card-c">
            <div className="hfr-card-head">
              <span className="hfr-card-ic" style={{ '--c': '#0d9488' }}><Users size={18} /></span>
              <span className="hfr-card-name">HR &amp; Payroll</span>
              <span className="hfr-card-badge">1,248 <Users size={11} /></span>
            </div>
            <div className="hfr-card-people">
              <span><i className="av-blue" />Arun Kumar</span>
              <span><i className="av-violet" />Fatima Al-Harbi</span>
              <span><i className="av-green" />Rahul Sharma</span>
            </div>
          </div>

          {/* donut — revenue split by module */}
          <div className="hfr-card hfr-card-d">
            <span className="hfr-w-title">Revenue by module</span>
            <div className="hfr-donut-row">
              <svg className="hfr-donut" viewBox="0 0 72 72" aria-hidden="true">
                <g transform="rotate(-90 36 36)" fill="none" strokeWidth="11">
                  <circle cx="36" cy="36" r="28" stroke="#f1f3f7" />
                  <circle cx="36" cy="36" r="28" stroke="#e2601f" strokeDasharray="70.4 175.9" strokeDashoffset="0" />
                  <circle cx="36" cy="36" r="28" stroke="#7c3aed" strokeDasharray="45.7 175.9" strokeDashoffset="-70.4" />
                  <circle cx="36" cy="36" r="28" stroke="#0d9488" strokeDasharray="35.2 175.9" strokeDashoffset="-116.1" />
                  <circle cx="36" cy="36" r="28" stroke="#3b82f6" strokeDasharray="24.6 175.9" strokeDashoffset="-151.3" />
                </g>
              </svg>
              <ul className="hfr-legend">
                <li><i style={{ background: '#e2601f' }} />Financials <b>40%</b></li>
                <li><i style={{ background: '#7c3aed' }} />Sales <b>26%</b></li>
                <li><i style={{ background: '#0d9488' }} />People <b>20%</b></li>
                <li><i style={{ background: '#3b82f6' }} />Supply <b>14%</b></li>
              </ul>
            </div>
          </div>

          {/* bar chart — orders trend */}
          <div className="hfr-card hfr-card-e">
            <span className="hfr-w-title">Orders — last 6 months</span>
            <div className="hfr-bars">
              {[['Apr', 46], ['May', 62], ['Jun', 54], ['Jul', 78], ['Aug', 68], ['Sep', 92]].map(([m, h]) => (
                <div key={m} className="hfr-bar-col">
                  <span className="hfr-bar" style={{ height: `${h}%` }} />
                  <em>{m}</em>
                </div>
              ))}
            </div>
          </div>

          {/* compact module chips tucked into the gaps */}
          <div className="hfr-card hfr-card-f">
            <div className="hfr-card-head">
              <span className="hfr-card-ic" style={{ '--c': '#7c3aed' }}><TrendingUp size={18} /></span>
              <span className="hfr-card-name">CRM &amp; Sales</span>
              <span className="hfr-card-badge">84 <Users size={11} /></span>
            </div>
          </div>

          <div className="hfr-card hfr-card-g">
            <div className="hfr-card-head">
              <span className="hfr-card-ic" style={{ '--c': '#3b82f6' }}><Truck size={18} /></span>
              <span className="hfr-card-name">Supply Chain</span>
              <span className="hfr-card-badge">36 <Users size={11} /></span>
            </div>
          </div>

          {/* small stat tiles */}
          <div className="hfr-card hfr-tile hfr-card-h">
            <span className="hfr-tile-ic" style={{ '--c': '#0891b2' }}><Workflow size={15} /></span>
            <b>212</b>
            <span className="hfr-tile-lbl">workflows live</span>
          </div>

          <div className="hfr-card hfr-tile hfr-card-i">
            <span className="hfr-tile-ic" style={{ '--c': '#db2777' }}><ReceiptText size={15} /></span>
            <b>57</b>
            <span className="hfr-tile-lbl">invoices cleared</span>
          </div>
        </div>
      </div>

      {/* ---------------- feature strip ---------------- */}
      <div className="hfr-features">
        {FEATURES.map((f) => (
          <div key={f.label} className="hfr-feature">
            <span className="hfr-feature-ic">{f.icon}</span>
            {f.label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroCoframe;
