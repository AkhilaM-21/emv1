import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './CustomerStory.css';

/* SAMPLE stories — illustrative examples only, to be replaced with real,
   verified case studies. Names, figures and quotes here are placeholders. */
const STORIES = [
  {
    id: 1,
    company: 'Gulf Build Contracting',
    eyebrow: 'CONSTRUCTION & ENGINEERING · SAUDI ARABIA',
    quote: 'Projects, procurement and costs finally live in one place.',
    detail: 'Site teams, procurement and finance now work from a single source of data, reducing manual reconciliation across active projects.',
    stats: [
      { value: '6 → 1', label: 'Systems replaced', colorClass: 'cs-stat-orange' },
      { value: 'Real-time', label: 'Project cost view', colorClass: '' },
      { value: '~40%', label: 'Less admin work', colorClass: '' }
    ],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    company: 'Marina Retail Group',
    eyebrow: 'RETAIL & COMMERCE · UAE',
    quote: 'POS, inventory and finance connected across every branch.',
    detail: 'Live stock and sales data across branches gives head office one real-time view of the business.',
    stats: [
      { value: '12', label: 'Branches live', colorClass: 'cs-stat-orange' },
      { value: 'Real-time', label: 'Inventory sync', colorClass: '' },
      { value: '~30%', label: 'Less manual entry', colorClass: '' }
    ],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    company: 'Meridian Advisory',
    eyebrow: 'PROFESSIONAL SERVICES · GCC',
    quote: 'Projects, people and billing in one connected flow.',
    detail: 'Time, expenses and billing now flow from project delivery straight into finance, with fewer gaps between teams.',
    stats: [
      { value: '1 platform', label: 'Projects to finance', colorClass: 'cs-stat-orange' },
      { value: 'Faster', label: 'Invoicing cycle', colorClass: '' },
      { value: 'More', label: 'Billable hours captured', colorClass: '' }
    ],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=80'
  }
];

const CustomerStory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % STORIES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  };

  return (
    <section className="cs-section">
      <div className="cs-container">
        <div className="cs-header-wrapper">
          <div className="cs-header">
            <span className="cs-eyebrow-top">CUSTOMER STORIES</span>
            <h2 className="cs-title">
              See how businesses are <span className="text-accent">transforming the way they work.</span>
            </h2>
            <p className="cs-sub">
              See how organizations use Emvive to connect operations, improve visibility and manage everyday business processes from one platform.
            </p>
          </div>
          <div className="cs-nav-buttons">
            <button className="cs-nav-btn" onClick={prevSlide} aria-label="Previous story">
              <ChevronLeft size={24} />
            </button>
            <button className="cs-nav-btn" onClick={nextSlide} aria-label="Next story">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="cs-carousel">
          <div 
            className="cs-carousel-track" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {STORIES.map((story) => (
              <div className="cs-slide" key={story.id}>
                <div className="cs-card">
                  <div className="cs-media-side">
                    <img src={story.mediaUrl} alt={story.company} className="cs-media-image" />
                    {story.mediaType === 'video' && (
                      <div className="cs-media-play">
                        <Play size={32} fill="white" color="white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="cs-content-side">
                    <span className="cs-eyebrow-card">{story.eyebrow}</span>
                    <p className="cs-company">{story.company}</p>
                    <blockquote className="cs-quote">
                      {story.quote}
                    </blockquote>
                    <p className="cs-author">{story.detail}</p>

                    <hr className="cs-divider" />

                    <div className="cs-stats">
                      {story.stats.map((stat, i) => (
                        <div className="cs-stat-item" key={i}>
                          <div className={`cs-stat-value ${stat.colorClass}`}>{stat.value}</div>
                          <div className="cs-stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <a href="#" className="cs-read-link">
                      Read Customer Story <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cs-pagination">
          {STORIES.map((_, idx) => (
            <button
              key={idx}
              className={`cs-dot ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerStory;
