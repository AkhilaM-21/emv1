import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Resources.css';

const RESOURCES = [
  {
    id: 1,
    category: 'WHITEPAPER',
    categoryColor: 'res-cat-green',
    title: 'The 2026 State of Global Operations',
    description: 'How 400+ finance leaders are consolidating stacks and adopting agentic workflows.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #6366f1 100%)',
  },
  {
    id: 2,
    category: 'GUIDE',
    categoryColor: 'res-cat-blue',
    title: 'Multi-entity close in 4 days, not 11',
    description: 'A step-by-step playbook for shortening month-end across borders and currencies.',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 40%, #06b6d4 100%)',
  },
  {
    id: 3,
    category: 'CASE STUDY',
    categoryColor: 'res-cat-red',
    title: 'How Meridian saved $2.1M in tooling',
    description: 'The 12-week migration story: from 7 systems to a single operating platform.',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #dc2626 100%)',
  },
];

const Resources = () => {
  return (
    <section className="res-section">
      <div className="res-container">
        <div className="res-header">
          <div className="res-header-text">
            <span className="res-eyebrow">RESOURCES</span>
            <h2 className="res-heading">
              Insights, reports and <span className="text-accent">playbooks&nbsp;for&nbsp;operators.</span>
            </h2>
          </div>
          <a href="#resources" className="res-view-all">
            View all resources <ArrowRight size={16} />
          </a>
        </div>

        <div className="res-grid">
          {RESOURCES.map((item) => (
            <a href="#" className="res-card" key={item.id}>
              <div
                className="res-card-image"
                style={{ background: item.gradient }}
              />
              <div className="res-card-body">
                <span className={`res-category ${item.categoryColor}`}>
                  {item.category}
                </span>
                <h3 className="res-card-title">{item.title}</h3>
                <p className="res-card-desc">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
