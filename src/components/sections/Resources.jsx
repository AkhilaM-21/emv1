import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Resources.css';

/* Photography follows the pattern already set by CustomerStory.jsx —
   Unsplash, same query string, sized for the card. The gradient stays
   underneath as the ground the image loads onto, so a slow or failed
   image leaves a deliberate-looking card rather than a grey hole. */
const RESOURCES = [
  {
    id: 1,
    category: 'GUIDE',
    categoryColor: 'res-cat-blue',
    title: 'A Practical Guide to Connecting Finance and Operations',
    description: 'How connected data between finance and operations cuts manual work and delays.',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 40%, #06b6d4 100%)',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    alt: 'Two colleagues working through figures on paper beside open laptops.',
  },
  {
    id: 2,
    category: 'REPORT / INSIGHT',
    categoryColor: 'res-cat-green',
    title: 'What Growing Businesses Should Look for in a Modern ERP',
    description: 'The capabilities that matter when you outgrow spreadsheets and disconnected tools.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #6366f1 100%)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    alt: 'A laptop on a desk showing a business analytics dashboard.',
  },
  {
    id: 3,
    category: 'PLAYBOOK',
    categoryColor: 'res-cat-red',
    title: 'Building a More Connected Procure-to-Pay Process',
    description: 'Steps to link purchasing, receiving, invoicing and payments end to end.',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #dc2626 100%)',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    alt: 'A warehouse aisle lined with stacked pallets and cartons.',
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
              Practical insights for <span className="text-accent">running&nbsp;a&nbsp;better&nbsp;business.</span>
            </h2>
            <p className="res-sub">
              Explore guides, reports and practical resources for finance, HR, sales, operations and business leaders managing growing organizations.
            </p>
          </div>
          <a href="#resources" className="res-view-all">
            Explore All Resources <ArrowRight size={16} />
          </a>
        </div>

        <div className="res-grid">
          {RESOURCES.map((item) => (
            <a href="#" className="res-card" key={item.id}>
              <div
                className="res-card-image"
                style={{ background: item.gradient }}
              >
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
              </div>
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
