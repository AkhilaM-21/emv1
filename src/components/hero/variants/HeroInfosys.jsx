import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useHeroContent } from './heroContent';
import './HeroInfosys.css';

/* STYLE 5 — film banner with a three-act intro.

   Act 1: the first line of the headline builds word by word in the middle of
   the empty banner, holds a beat, then leaves.
   Act 2: the second line does the same, alone.
   Act 3: the finished banner arrives — both lines together, plus the buttons
   — and stays.

   The two acts are a separate, aria-hidden overlay rather than the real
   headline being animated in place. The <h1> has to survive the whole
   sequence intact for assistive tech and for anything reading the page, so
   the theatre happens on a copy and the real heading simply fades up at the
   end. */

const HERO_VIDEO = '/Create_a_premium_enterprise_we.mp4';

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
  const videoRef = useRef(null);

  /* Autoplaying film is motion the viewer did not ask for, so honour the
     reduced-motion preference: hold the first frame instead of looping. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) el.pause();
      else el.play().catch(() => {}); // autoplay can be refused; the frame still shows
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const lineEnd = (start, text) =>
    start + (text.split(' ').length - 1) * WORD_STEP + WORD_DUR;

  const act1Out = lineEnd(START, c.headline1) + HOLD;
  const act2In = act1Out + OUT_DUR + BETWEEN;
  const act2Out = lineEnd(act2In, c.headline2) + HOLD;
  const finalIn = act2Out + OUT_DUR + 0.1;

  return (
    <section className="hi-hero" id="hero">
      <video
        ref={videoRef}
        className="hi-video"
        src={video}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
      />
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

      <div className="hi-inner" style={{ animationDelay: `${finalIn.toFixed(2)}s` }}>
        <h1 className="hi-title">
          <span className="hi-line">{c.headline1}</span>
          <span className="hi-line hi-accent">{c.headline2}</span>
        </h1>

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
      </div>
    </section>
  );
};

export default HeroInfosys;
