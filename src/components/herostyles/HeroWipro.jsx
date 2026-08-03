import React from 'react';
import './HeroWipro.css';

/* STYLE 3 — wipro.com banner.
   Their hero is not "background video + copy on top": the whole banner IS
   the clip, with the headline, brand and animation rendered inside it. So
   nothing is layered over the film here either.

     .cmp-teaser__image video   width/height 100%, pointer-events none
     .cmp-teaser__content       min-height 500px, margin-inline 4pc */

const HERO_VIDEO = '/Create_a_premium_enterprise_we.mp4';

const HeroWipro = () => (
  <section className="hw-hero">
    <video
      className="hw-video"
      src={HERO_VIDEO}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-label="Emvive platform hero film"
    />
  </section>
);

export default HeroWipro;
