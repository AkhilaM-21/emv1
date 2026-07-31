import React from 'react';
import { ArrowRight } from 'lucide-react';
import './AnnouncementOriginal.css';

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

const AnnouncementOriginal = () => {
  return (
    <section className="ann-section-original">
      <div className="ann-container-original">
        <div className="ann-card-original">
          <div className="ann-content-original">
            <span className="ann-eyebrow-original">THE AGENTIC ENTERPRISE</span>
            <h2 className="ann-heading-original">
              Enterprise AI that doesn't just report problems — <span className="text-accent-original">it solves them.</span>
            </h2>
            <p className="ann-desc-original">
              AI agents run inside your tenant with the same permissions as your users. They detect ledger exceptions, reconcile invoices end-to-end, chase vendors and post journals — escalating to humans only when judgement is required.
            </p>
            <div className="ann-actions-original">
              <a href="#blog" className="ann-btn-primary-original">
                Read the blog <ArrowRight size={16} />
              </a>
              <a href="#demo" className="ann-btn-secondary-original">
                See agents in action
              </a>
            </div>
          </div>

          <div className="ann-visual-original">
            <div className="ann-visual-panel-original">
              <ConstellationViz />
              <div className="ann-icon-badge-original">
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

export default AnnouncementOriginal;
