import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Play, ArrowRight } from 'lucide-react';
import './Testimonials.css';

const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;

const Stars = () => (
  <span className="tst-stars">
    {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={22} fill="#f59e0b" color="#f59e0b" />)}
  </span>
);

const Review = ({ d }) => {
  const { t } = useTranslation();
  return (
  <div className="tst-card tst-review">
    <p className="tst-quote">{t(`testimonials.reviews.${d.idx}.quote`, d.quote)}</p>
    <div className="tst-person">
      <span className="tst-ava" style={{ background: d.c }}>{d.i}</span>
      <div className="tst-person-txt">
        <b>{d.name}</b>
        <span>{t(`testimonials.reviews.${d.idx}.role`, d.role)}</span>
      </div>
    </div>
  </div>
  );
};

const Rating = ({ d }) => {
  const { t } = useTranslation();
  return (
  <div className="tst-card tst-rating">
    <div className="tst-rating-top">
      <span className="tst-plat" style={{ background: d.platColor }}>{d.platform}</span>
      <Stars />
    </div>
    <p className="tst-rating-review">{t(`testimonials.ratings.${d.idx}.review`, d.review)}</p>
  </div>
  );
};

const VideoCard = ({ d }) => {
  const { t } = useTranslation();
  return (
  <a className="tst-card tst-video" href="#stories" style={{ backgroundImage: `url(${d.img})` }}>
    <span className="tst-play"><Play size={18} fill="#fff" color="#fff" /></span>
    <div className="tst-video-company">
      <span className="tst-vc-logo" style={{ background: d.c }}>{d.i}</span>
      <div className="tst-vc-txt"><b>{d.company}</b><span>{t(`testimonials.videos.${d.idx}.name`, d.name)}</span></div>
    </div>
  </a>
  );
};

const render = (d) => {
  if (d.type === 'rating') return <Rating key={d.review} d={d} />;
  if (d.type === 'video') return <VideoCard key={d.company} d={d} />;
  return <Review key={d.name} d={d} />;
};

const COLUMNS = [
  [
    { type: 'video', idx: 0, company: 'Lumen Health', name: 'Sarah Kim, Ops Director', i: 'LH', c: '#ec4899', img: IMG('1576091160550-2173dba999ef') },
    { type: 'review', idx: 0, quote: 'One platform replaced five disconnected tools. Our month-end close went from 9 days to 2.', name: 'Priya Nair', role: 'CFO · Northwind Logistics', i: 'PN', c: '#10b981' },
    { type: 'review', idx: 1, quote: 'Onboarding a new hire used to take a week of paperwork. Now it takes 20 minutes.', name: 'Marcus Lee', role: 'Head of People · Brightwave', i: 'ML', c: '#f59e0b' },
    { type: 'review', idx: 2, quote: 'Compliance audits that used to take weeks are now just a few clicks.', name: 'Hannah Weiss', role: 'Legal Counsel · Meridian Bank', i: 'HW', c: '#14b8a6' },
  ],
  [
    { type: 'rating', idx: 0, platform: 'G2', platColor: '#ff5e2c', review: 'The most complete platform we evaluated — and by far the easiest to roll out.' },
    { type: 'review', idx: 3, quote: 'One data model across finance, HR and operations finally gave us a single source of truth.', name: 'Elena Duarte', role: 'COO · Vantel Retail', i: 'ED', c: '#e86a2c' },
    { type: 'review', idx: 4, quote: 'Real-time inventory across every warehouse cut our stockouts by 40%.', name: 'David Okoro', role: 'Supply Chain Lead · Cobalt Foods', i: 'DO', c: '#6366f1' },
    { type: 'video', idx: 1, company: 'Nimbus Retail', name: 'Ava Chen, Head of Ops', i: 'NR', c: '#e8802e', img: IMG('1521737604893-d14cc237f11d') },
  ],
  [
    { type: 'review', idx: 5, quote: 'The rollout across 14 countries was smoother than any system we have ever deployed.', name: 'Omar Haddad', role: 'VP of IT · Zephyr Group', i: 'OH', c: '#e8802e' },
    { type: 'video', idx: 2, company: 'Fabrik Studios', name: 'Thomas Reed, CEO', i: 'FS', c: '#f97316', img: IMG('1600880292089-90a7e086ee0c') },
    { type: 'rating', idx: 1, platform: 'Capterra', platColor: '#dd5a1f', review: 'Setup was painless and the support team felt like an extension of our own.' },
    { type: 'review', idx: 6, quote: 'We consolidated 12 regional systems into one — reporting is finally real-time.', name: 'Sofia Ramos', role: 'VP Finance · Orbit Manufacturing', i: 'SR', c: '#ef4444' },
  ],
];

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section className="tst-section" id="testimonials">


      <div className="tst-wrapper">
        {COLUMNS.map((col, i) => (
          <div className="tst-col" key={i}>
            {col.map(render)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
