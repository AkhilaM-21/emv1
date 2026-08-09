import React from 'react';
import {
  ArrowRight, Check, Search, Bell, LayoutGrid, Users, Clock, Wallet,
  BarChart3, Landmark, CircleDollarSign, TrendingUp, Package, FolderKanban,
  Store, FileCheck, UserRound,
} from 'lucide-react';
import { useHeroContent } from './heroContent';
import './HeroDashboard.css';

/* STYLE 3 — the reference screenshot:
   light canvas, left copy block, right side a constellation of module pills
   wired by dotted connectors into three layered product dashboards. */

const HeroDashboard = () => {
  const c = useHeroContent();

  return (
    <section className="hd-hero">
      <div className="hd-wash" aria-hidden="true" />

      <div className="hd-grid">
        {/* ---------- left: copy ---------- */}
        <div className="hd-copy">
          <span className="hd-eyebrow">{c.eyebrow}</span>

          <h1 className="hd-title">
            {c.headline1} <span className="hd-accent">{c.headline2}</span>
          </h1>

          <p className="hd-sub">{c.subtitle}</p>

          <div className="hd-btns">
            <a href="#demo" className="hd-btn-primary">
              {c.primaryCta}
              <span className="hd-btn-arrow"><ArrowRight size={14} /></span>
            </a>
            <a href="#products" className="hd-btn-outline">{c.secondaryCta}</a>
          </div>

          <p className="hd-note">
            <span className="hd-note-ic"><Check size={12} strokeWidth={3.4} /></span>
            Built for businesses across Saudi Arabia, the GCC, India and beyond.
          </p>
        </div>

        {/* ---------- right: layered dashboards ---------- */}
        <div className="hd-visual">
          <svg className="hd-connectors" viewBox="0 0 800 660" preserveAspectRatio="none" aria-hidden="true">
            {/* x values track the cards: left column 50 (6.25%), centre 360
                (45%), right 650 (81.25%) of the 800-wide stretched viewBox */}
            <line x1="360" y1="42" x2="360" y2="112" className="hd-line hd-blue" />
            <circle cx="360" cy="112" r="4" className="hd-blue" />
            <line x1="50" y1="66" x2="50" y2="136" className="hd-line hd-purple" />
            <circle cx="50" cy="136" r="4" className="hd-purple" />
            <line x1="650" y1="66" x2="650" y2="146" className="hd-line hd-green" />
            <circle cx="650" cy="146" r="4" className="hd-green" />
            <line x1="50" y1="578" x2="50" y2="440" className="hd-line hd-orange" />
            <circle cx="50" cy="440" r="4" className="hd-orange" />
            <line x1="360" y1="618" x2="360" y2="520" className="hd-line hd-blue" />
            <circle cx="360" cy="520" r="4" className="hd-blue" />
            <line x1="650" y1="578" x2="650" y2="440" className="hd-line hd-pink" />
            <circle cx="650" cy="440" r="4" className="hd-pink" />
          </svg>

          {/* back-left: HCM */}
          <div className="hd-card hd-card-left">
            <div className="hd-card-head">
              <span className="hd-card-logo"><UserRound size={15} color="#6c50b2" /> HCM</span>
            </div>
            <div className="hd-card-body">
              <div className="hd-side">
                <div className="hd-nav"><LayoutGrid size={11} /> Dashboard</div>
                <div className="hd-nav on"><Users size={11} /> Employees</div>
                <div className="hd-nav"><Clock size={11} /> Attendance</div>
                <div className="hd-nav"><Check size={11} /> Leave</div>
                <div className="hd-nav"><Wallet size={11} /> Payroll</div>
              </div>
              <div className="hd-main">
                <h4 className="hd-main-title">Employees</h4>
                <div className="hd-rows">
                  <div className="hd-row"><span className="hd-av av-blue">AK</span><span>Arun Kumar</span></div>
                  <div className="hd-row"><span className="hd-av av-purple">FH</span><span>Fatima Al-Harbi</span></div>
                  <div className="hd-row"><span className="hd-av av-green">RS</span><span>Rahul Sharma</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* back-right: CRM */}
          <div className="hd-card hd-card-right">
            <div className="hd-card-head">
              <span className="hd-card-logo"><TrendingUp size={15} color="#10b981" /> CRM</span>
            </div>
            <div className="hd-card-body">
              <div className="hd-main">
                <h4 className="hd-main-title">Pipeline</h4>

                <div className="hd-mini-row">
                  <div className="hd-mini">
                    <span>Open pipeline</span>
                    <b>$2.41M</b>
                    <i className="up">+9.3%</i>
                  </div>
                  <div className="hd-mini">
                    <span>Win rate</span>
                    <b>32.4%</b>
                    <i className="up">+3.6%</i>
                  </div>
                </div>

                <div className="hd-stage-bars">
                  {[
                    ['Lead', 82], ['Qualified', 64], ['Proposal', 48],
                    ['Negotiation', 33], ['Won', 24],
                  ].map(([label, h]) => (
                    <div key={label} className="hd-stage-col">
                      <div className="hd-stage-bar" style={{ height: `${h}%` }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="hd-deals">
                  <div className="hd-deal">
                    <span className="hd-deal-name">Gulf Traders</span>
                    <span className="hd-deal-amt">$18,240</span>
                  </div>
                  <div className="hd-deal">
                    <span className="hd-deal-name">Nesto Retail</span>
                    <span className="hd-deal-amt">$12,600</span>
                  </div>
                  <div className="hd-deal">
                    <span className="hd-deal-name">Tamimi Group</span>
                    <span className="hd-deal-amt">$8,870</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* front: Financials */}
          <div className="hd-card hd-card-center">
            <div className="hd-card-head hd-head-main">
              <span className="hd-card-logo main"><CircleDollarSign size={19} color="#f2853f" /> Financials</span>
              <span className="hd-card-actions">
                <Search size={13} />
                <Bell size={13} />
                <i className="hd-av-dot" />
              </span>
            </div>
            <div className="hd-card-body">
              <div className="hd-side main">
                <div className="hd-nav on"><LayoutGrid size={13} /> Dashboard</div>
                <div className="hd-nav"><CircleDollarSign size={13} /> Finance</div>
                <div className="hd-nav"><Landmark size={13} /> Banking</div>
                <div className="hd-nav"><ArrowRight size={13} /> Payables</div>
                <div className="hd-nav"><ArrowRight size={13} /> Receivables</div>
                <div className="hd-nav"><BarChart3 size={13} /> Reports</div>
              </div>
              <div className="hd-main main">
                <div className="hd-kpi">
                  <span className="hd-kpi-label">Total Revenue</span>
                  <span className="hd-kpi-val"><b>$4.28M</b><i className="up">+12.6%</i></span>
                </div>

                <div className="hd-chart">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="hd-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,50 Q20,40 40,50 T80,30 T120,40 T160,10 L200,20 L200,60 L0,60 Z" fill="url(#hd-area)" />
                    <path d="M0,50 Q20,40 40,50 T80,30 T120,40 T160,10 L200,20" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
                </div>

                <div className="hd-kpi">
                  <span className="hd-kpi-label">Cash Position</span>
                  <span className="hd-kpi-val"><b>$1.92M</b><i className="up">+8.4%</i></span>
                </div>

                <div className="hd-kpi">
                  <span className="hd-kpi-label">Profitability</span>
                  <span className="hd-kpi-val"><b>18.5%</b><i className="up">+4.1%</i></span>
                </div>
              </div>
            </div>
          </div>

          {/* floating module pills */}
          <div className="hd-pill p-top"><Package size={14} color="#3b82f6" /><span>Supply Chain</span></div>
          <div className="hd-pill p-tl"><UserRound size={14} color="#8b5cf6" /><span>HCM</span></div>
          <div className="hd-pill p-tr"><TrendingUp size={14} color="#10b981" /><span>CRM</span></div>
          <div className="hd-pill p-bl"><FolderKanban size={14} color="#f59e0b" /><span>Projects</span></div>
          <div className="hd-pill p-bottom"><Store size={14} color="#3b82f6" /><span>POS</span></div>
          <div className="hd-pill p-br"><FileCheck size={14} color="#ec4899" /><span>E-Invoicing</span></div>
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
