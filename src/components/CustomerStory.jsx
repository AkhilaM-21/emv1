import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import './CustomerStory.css';

const STORIES = [
  {
    id: 1,
    company: 'Meridian Logistics',
    eyebrow: 'MERIDIAN LOGISTICS · 12 COUNTRIES · 1,800 EMPLOYEES',
    quote: '"Emvive replaced our ERP and HR stack. Our month-end close went from eleven days to four."',
    authorName: 'Anika Rao',
    authorRole: 'CFO, Meridian Logistics',
    stats: [
      { value: '-64%', label: 'Month-end close time', colorClass: 'cs-stat-orange' },
      { value: '$2.1M', label: 'Annual tooling saved', colorClass: '' },
      { value: '9wk', label: 'Time to go-live', colorClass: '' }
    ],
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    company: 'Lumen Health',
    eyebrow: 'LUMEN HEALTH · HEALTHCARE · 5,000+ STAFF',
    quote: '"Staff scheduling and payroll are finally in sync, saving us hundreds of hours weekly."',
    authorName: 'Sarah Kim',
    authorRole: 'Ops Director, Lumen Health',
    stats: [
      { value: '120h', label: 'Saved per week', colorClass: 'cs-stat-orange' },
      { value: '100%', label: 'Compliance rate', colorClass: '' },
      { value: '3wk', label: 'Implementation', colorClass: '' }
    ],
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    company: 'Nimbus Retail',
    eyebrow: 'NIMBUS RETAIL · E-COMMERCE · 3M CUSTOMERS',
    quote: '"Real-time inventory across every warehouse cut our stockouts by 40%."',
    authorName: 'David Okoro',
    authorRole: 'Supply Chain Lead, Nimbus Retail',
    stats: [
      { value: '-40%', label: 'Stockouts reduced', colorClass: 'cs-stat-orange' },
      { value: '99.9%', label: 'Inventory accuracy', colorClass: '' },
      { value: '+$1M', label: 'Recovered revenue', colorClass: '' }
    ],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    company: 'Zephyr Group',
    eyebrow: 'ZEPHYR GROUP · IT SERVICES · GLOBAL',
    quote: '"The rollout across 14 countries was incredibly smooth. Setup was entirely painless."',
    authorName: 'Omar Haddad',
    authorRole: 'VP of IT, Zephyr Group',
    stats: [
      { value: '14', label: 'Countries deployed', colorClass: 'cs-stat-orange' },
      { value: 'Zero', label: 'Downtime incidents', colorClass: '' },
      { value: '4mos', label: 'To full adoption', colorClass: '' }
    ],
    mediaType: 'video',
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
              See how <span className="text-accent">teams are transforming</span> their work.
            </h2>
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
                    <blockquote className="cs-quote">
                      {story.quote}
                    </blockquote>
                    <p className="cs-author">
                      <strong>{story.authorName}</strong> &middot; {story.authorRole}
                    </p>
                    
                    <hr className="cs-divider" />
                    
                    <div className="cs-stats">
                      {story.stats.map((stat, i) => (
                        <div className="cs-stat-item" key={i}>
                          <div className={`cs-stat-value ${stat.colorClass}`}>{stat.value}</div>
                          <div className="cs-stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
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
