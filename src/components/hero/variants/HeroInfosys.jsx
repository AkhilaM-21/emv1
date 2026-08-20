import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroContent } from './heroContent';
import './HeroInfosys.css';

/* STYLE 5 — film banner, three slides, with a three-act intro on the first.

   Act 1: the first line of the headline builds word by word in the middle of
   the empty banner, holds a beat, then leaves.
   Act 2: the second line does the same, alone.
   Act 3: the finished banner arrives — both lines together, plus the buttons
   — and stays. From there the banner rotates.

   The two acts are a separate, aria-hidden overlay rather than the real
   headline being animated in place. The <h1> has to survive the whole
   sequence intact for assistive tech and for anything reading the page, so
   the theatre happens on a copy and the real heading simply fades up at the
   end. */

const HERO_VIDEO = '/Create_a_premium_enterprise_we.mp4';

/* The three slides. Each carries its own film and its own headline, and
   cross-fades to the next.

   Slide one is the real thing: its film comes from the `video` prop and
   its words from the shared hero copy, so it stays in step with the other
   hero variants and with i18n.

   Slides two and three are PLACEHOLDERS — stand-in clips already in
   /public/images and stand-in copy. Replace `video`, `headline1` and
   `headline2` with the real thing; nothing else needs touching. Neither
   carries calls to action: two sets of buttons rotating in and out of the
   same spot reads as a glitch rather than as a choice. */
const SLIDES = [
  { key: 'lead', video: null, ctas: true },
  {
    key: 'two',
    video: '/images/1.mp4',
    headline1: 'Close the books',
    headline2: 'in days, not weeks.',
    ctas: false,
  },
  {
    key: 'three',
    video: '/images/3.mp4',
    headline1: 'Every order tracked',
    headline2: 'from quote to cash.',
    ctas: false,
  },
];

const SLIDE_MS = 6000;   // how long each slide holds

/* Act timing, in seconds. Everything downstream is derived from these and
   from the real word counts, so a longer translation still lands in order
   instead of overlapping the next act. */
const START = 0.25;      // first word appears
const WORD_STEP = 0.12;  // gap between words inside a line
const WORD_DUR = 0.6;    // how long one word takes to resolve
const HOLD = 0.3;        // beat a completed line is left on screen
const OUT_DUR = 0.45;    // how long a line takes to leave
const BETWEEN = 0.15;    // pause between one line leaving and the next starting

const Words = ({ text, base }) => {
  const words = text.split(' ');
  return words.map((word, i) => (
    <React.Fragment key={`${word}-${i}`}>
      <span
        className="hi-word"
        style={{ animationDelay: `${(base + i * WORD_STEP).toFixed(2)}s` }}
      >
        {word}
      </span>
      {/* a real space: inline-block spans swallow the whitespace JSX would
          otherwise collapse, running the words together into one string */}
      {i < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ));
};

const HeroInfosys = ({ video = HERO_VIDEO }) => {
  const c = useHeroContent();
  const videoRefs = useRef([]);
  const [slide, setSlide] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  // slide one's words and film; the rest carry their own
  const slideCopy = (s) => ({
    headline1: s.headline1 ?? c.headline1,
    headline2: s.headline2 ?? c.headline2,
  });

  /* Only the slide on screen plays. Three clips running at once is three
     decoders' worth of work for two pictures nobody can see, and the
     off-screen ones would drift out of sync with their own slide.

     Autoplaying film is also motion the viewer did not ask for, so honour
     the reduced-motion preference: hold a frame instead of looping. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const apply = () => {
      videoRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i !== slide || mq.matches) {
          el.pause();
        } else {
          // autoplay can be refused; the poster frame still shows
          el.play().catch(() => {});
        }
      });
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [slide]);

  const lineEnd = (start, text) =>
    start + (text.split(' ').length - 1) * WORD_STEP + WORD_DUR;

  const act1Out = lineEnd(START, c.headline1) + HOLD;
  const act2In = act1Out + OUT_DUR + BETWEEN;
  const act2Out = lineEnd(act2In, c.headline2) + HOLD;
  const finalIn = act2Out + OUT_DUR + 0.1;

  /* Nothing rotates until the three-act intro has finished — starting
     mid-act would cut the headline off as it builds. */
  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), finalIn * 1000);
    return () => clearTimeout(t);
  }, [finalIn]);

  /* One dwell per slide rather than a standing interval: because the
     effect depends on `slide`, pressing an arrow restarts the clock
     instead of leaving a half-spent timer to fire immediately after.
     Reduced motion holds wherever it is, while the arrows still work. */
  useEffect(() => {
    if (!introDone) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const t = setTimeout(() => setSlide((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [introDone, slide]);

  // the arrows wrap, matching the rotation — no dead end at either end
  const go = (delta) => setSlide((i) => (i + delta + SLIDES.length) % SLIDES.length);

  return (
    <section className="hi-hero" id="hero">
      {/* the films, one per slide, cross-fading with the words over them */}
      {SLIDES.map((s, i) => (
        <video
          key={s.key}
          ref={(el) => { videoRefs.current[i] = el; }}
          className={`hi-video${i === slide ? ' is-current' : ''}`}
          src={s.video || video}
          muted
          loop
          playsInline
          /* only the opening film is worth the bandwidth up front; the
             other two fetch while the first one is on screen */
          preload={i === 0 ? 'auto' : 'metadata'}
          tabIndex={-1}
          aria-hidden="true"
        />
      ))}

      <div className="hi-scrim" aria-hidden="true" />

      {/* the two solo acts — decorative, the real heading is below */}
      <div className="hi-intro" aria-hidden="true">
        <span className="hi-intro-line" style={{ animationDelay: `${act1Out.toFixed(2)}s` }}>
          <Words text={c.headline1} base={START} />
        </span>
        <span className="hi-intro-line hi-accent" style={{ animationDelay: `${act2Out.toFixed(2)}s` }}>
          <Words text={c.headline2} base={act2In} />
        </span>
      </div>

      <button
        type="button"
        className="carousel-arrow hi-arrow hi-arrow-prev"
        onClick={() => go(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="carousel-arrow hi-arrow hi-arrow-next"
        onClick={() => go(1)}
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={2.2} />
      </button>

      <div className="hi-slides">
        {SLIDES.map((s, i) => {
          const current = i === slide;
          const { headline1, headline2 } = slideCopy(s);
          return (
            <div
              key={s.key}
              className={`hi-slide${current ? ' is-current' : ''}`}
              /* only the slide on screen is in the accessibility tree, so
                 the three headings never read as three at once */
              aria-hidden={!current}
            >
              <div
                className="hi-inner"
                /* the three-act intro only precedes the first slide; the
                   rest simply cross-fade in */
                style={i === 0 ? { animationDelay: `${finalIn.toFixed(2)}s` } : undefined}
              >
                <h1 className="hi-title">
                  <span className="hi-line">{headline1}</span>
                  <span className="hi-line hi-accent">{headline2}</span>
                </h1>

                {s.ctas && (
                  <div className="hi-ctas">
                    <a href="#demo" className="hi-btn hi-btn-solid">
                      {c.primaryCta}
                      <span className="hi-btn-ic"><ArrowRight size={15} /></span>
                    </a>
                    <a href="#products" className="hi-btn hi-btn-ghost">
                      {c.secondaryCta}
                      <span className="hi-btn-ic"><ArrowRight size={15} /></span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroInfosys;
