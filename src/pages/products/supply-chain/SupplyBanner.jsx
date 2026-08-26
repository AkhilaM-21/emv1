import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import './SupplyBanner.css';

/* =====================================================================
   SUPPLY CHAIN — L1 BANNER

   The Infosys industry banner, rebuilt: a full-bleed film inset ten
   pixels from the edge with a ten-pixel radius, a dark wash over its
   top half so the site header stays legible, and a gradient that fades
   the film to white at the foot. The copy sits on that whitened foot —
   bottom of the band, centred — which is why it is dark ink and not
   white.

     label      small navy pill
     h1         thin, clamp(32px, 5vw, 64px)
     para       one line, clamped at three
     actions    black gradient button, arrow rights itself on hover

   ------------------------------------------------------------------
   THE FILM IS A PLACEHOLDER.

   `video` defaults to a clip already in /public/images. Drop the real
   one in and pass it — `<SupplyBanner video="/images/your-clip.mp4" />`
   — or change DEFAULT_VIDEO below. `poster` is the frame that shows
   before the film has loaded and while motion is refused; give it a
   still from the same clip when there is one.
   ------------------------------------------------------------------
   ===================================================================== */

const DEFAULT_VIDEO = '/images/network.mp4';

const SupplyBanner = ({
  video = DEFAULT_VIDEO,
  poster,
  /* One line, so keep it short — it is set `nowrap` above 620px. */
  title = 'Every move on',
  accent = 'one ledger',
  para = 'Procurement, production, the warehouse and the fleet read and write the same records — from the purchase order to the carton on the shelf.',
  primary = { label: 'Request a demo', href: '#demo' },
  secondary = { label: 'Explore the platform', href: '#overview' },
}) => {
  const ref = useRef(null);

  /* Autoplaying film is motion the viewer did not ask for: honour the
     reduced-motion preference by holding the poster frame instead of
     looping. Autoplay can also simply be refused, and that is fine —
     the poster is still there. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const apply = () => {
      if (mq.matches) {
        el.pause();
      } else {
        const p = el.play();
        if (p && p.catch) p.catch(() => {});
      }
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [video]);

  return (
    <section className="sb-banner" id="top">
      <div className="sb-media">
        <video
          ref={ref}
          className="sb-fit"
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* the copy sits on the whitened lower half of the film, as the
          reference's does — one block, heading through buttons */}
      <div className="sb-align">
        <div className="sb-copy">
          {/* one line — the accent runs inline rather than breaking to
              its own, which is what kept it to two before */}
          <h1 className="sb-title">
            {title}
            {accent && <> <em>{accent}</em></>}
          </h1>

          {para && <p className="sb-para">{para}</p>}

          <div className="sb-actions">
            {primary && (
              <a className="sb-btn sb-btn-solid" href={primary.href}>
                {primary.label}
                <span className="sb-btn-ic" aria-hidden="true"><ArrowRight size={15} strokeWidth={2.4} /></span>
              </a>
            )}
            {secondary && (
              <a className="sb-btn sb-btn-ghost" href={secondary.href}>
                {secondary.label}
                <span className="sb-btn-ic" aria-hidden="true"><ArrowRight size={15} strokeWidth={2.4} /></span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyBanner;
