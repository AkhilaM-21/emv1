import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Announcement.css';

/* Constellation animation for the right panel */
const ConstellationViz = () => {
  const nodes = [
    { x: 60, y: 30 }, { x: 140, y: 20 }, { x: 220, y: 45 },
    { x: 260, y: 100 }, { x: 200, y: 140 }, { x: 120, y: 120 },
    { x: 80, y: 80 }, { x: 170, y: 75 },
  ];
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
    [1, 7], [7, 4], [7, 2], [6, 5],
  ];

  return (
    <svg viewBox="0 0 320 180" className="ann-constellation">
      {edges.map(([a, b], i) => (
        <line
          key={`e${i}`}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          className="ann-edge"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r="4" className="ann-node" style={{ animationDelay: `${i * 0.3}s` }} />
          <circle cx={n.x} cy={n.y} r="8" className="ann-node-ring" style={{ animationDelay: `${i * 0.3}s` }} />
        </g>
      ))}
    </svg>
  );
};

const Announcement = () => {
  return (
    <section className="ann-section">
      <div className="ann-container">
        <div className="ann-card">
          <div className="ann-content">
            <span className="ann-eyebrow">INTELLIGENT FEATURES</span>
            <h2 className="ann-heading">
              Data that works for you — <span className="text-accent">not the other way around.</span>
            </h2>
            <p className="ann-desc">
              Emvive turns your operational data into decisions with predictive analytics, smart recommendations and automatic bank reconciliation — with AI-driven insights on the roadmap to help you act before problems surface.
            </p>
            {/* reuse the CTA button pair so the UI and colours match exactly */}
            <div className="ann-actions">
              <a href="#platform" className="cta-btn-primary">
                Explore the platform
                <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
              </a>
              <a href="#demo" className="cta-btn-secondary">
                Request a demo
              </a>
            </div>
          </div>

          <div className="ann-visual">
            <div className="ann-visual-panel">
              <ConstellationViz />
              <div className="ann-icon-badge">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;
