import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Briefcase, Wallet, Users, Settings, Package, TrendingUp,
  ChevronLeft, ChevronRight, Cpu, BarChart3,
} from 'lucide-react';
import LiquidBackground from './LiquidBackground';
import { NetworkViz, ParticleViz, ChartViz, CardFacets } from './HeroVisuals';
import './Hero.css';

const Hero = () => {
  const { t } = useTranslation();
  const [wordIndex, setWordIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const words = t('hero.rotator', { returnObjects: true });

  const ROTATING_ICONS = {
    'Business': Briefcase,
    'Finance': Wallet,
    'Workforce': Users,
    'Operations': Settings,
    'Inventory': Package,
    'Sales': TrendingUp,
  };

  const SLIDES = [
    {
      eyebrow: t('hero.slides.0.eyebrow', 'THE INTELLIGENT ERP'),
      title: t('hero.slides.0.title', 'Run your entire enterprise on one platform'),
      desc: t('hero.slides.0.desc', 'Unify ERP, HR & Payroll, CRM, Finance, Inventory and Workflow Automation into a single intelligent platform — built to help modern organizations run smarter and move faster.'),
      cta: t('hero.slides.0.cta', 'Book a Demo'),
      Visual: NetworkViz,
      BadgeIcon: Package,
      badgeClass: 'badge-blue',
      rotating: true,
    },
    {
      eyebrow: t('hero.slides.1.eyebrow', 'AI-POWERED AUTOMATION'),
      title: t('hero.slides.1.title', 'The agentic enterprise is here'),
      desc: t('hero.slides.1.desc', "AI agents that don't just report problems — they solve them. Automate approvals, invoicing and reconciliation end to end, so your teams focus on decisions, not busywork."),
      cta: t('hero.slides.1.cta', 'Explore Automation'),
      Visual: ParticleViz,
      BadgeIcon: Cpu,
      badgeClass: 'badge-violet',
      rotating: false,
    },
    {
      eyebrow: t('hero.slides.2.eyebrow', 'REAL-TIME INSIGHTS'),
      title: t('hero.slides.2.title', 'Make faster decisions with live data'),
      desc: t('hero.slides.2.desc', 'Track revenue, orders, inventory and workforce in real time. Emvive turns your operational data into clear, actionable insights the moment you need them.'),
      cta: t('hero.slides.2.cta', 'See Analytics'),
      Visual: ChartViz,
      BadgeIcon: BarChart3,
      badgeClass: 'badge-teal',
      rotating: false,
    },
  ];

  const SLIDE_COUNT = SLIDES.length;

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % words.length),
      2200,
    );
    return () => clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    const slideId = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDE_COUNT);
    }, 8000);
    
    // Check if device is mobile based on actual screen size or user agent
    const checkMobile = () => {
      setIsMobile(window.screen.width <= 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearInterval(slideId);
      window.removeEventListener('resize', checkMobile);
    };
  }, [SLIDE_COUNT]);

  const goPrev = () => setActiveSlide((s) => (s - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  const goNext = () => setActiveSlide((s) => (s + 1) % SLIDE_COUNT);

  return (
    <section id="home" className={`hero-section ${isMobile ? 'mobile-vertical-active' : ''}`}>
      <LiquidBackground />

      <div className={`hero-stage ${isMobile ? 'mobile-vertical' : ''}`}>
        <button className="hero-arrow prev" onClick={goPrev} aria-label="Previous slide">
          <ChevronLeft size={22} />
        </button>

        <div className="hero-card-track">
          {SLIDES.map((slide, i) => {
            const { Visual, BadgeIcon } = slide;
            const currentWord = words[wordIndex];
            const RotIcon = ROTATING_ICONS[currentWord] || Briefcase;

            return (
              <div
                key={i}
                className={`hero-card ${activeSlide === i ? 'active' : ''} ${isMobile ? 'mobile-vertical' : ''}`}
              >
                <div className="hero-card-bg">
                  <CardFacets />
                </div>

                <div className="hero-card-content">
                  <p className="hero-eyebrow">{slide.eyebrow}</p>

                  <h1 className="hero-title">
                    {slide.rotating ? (
                      <>
                        {t('hero.runYourEntire', 'Run Your Entire')}{' '}
                        <span className="hero-rotator">
                          <span key={wordIndex} className="hero-rotate-word">
                            {currentWord}
                          </span>
                        </span>{' '}
                        {t('hero.fromOnePlatform', 'From One Platform')}
                      </>
                    ) : (
                      slide.title
                    )}
                  </h1>

                  <p className="hero-description">{slide.desc}</p>

                  <a href="#demo" className="hero-cta">
                    {slide.cta}
                    <ArrowRight size={18} />
                  </a>
                </div>

                {/* Right: image card overhanging the right edge */}
                <div className="hero-card-visual">
                  <div className="hero-visual-card">
                    <Visual />
                    <span className={`hero-visual-badge ${slide.badgeClass}`}>
                      <BadgeIcon size={26} color="#fff" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        <button className="hero-arrow next" onClick={goNext} aria-label="Next slide">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
