import React, { useEffect, useRef } from 'react';

/* =====================================================================
   PLATFORM FILM

   The clip is 1280x720 and 10s long, and carries a Gemini mark in the
   bottom-right corner — its left edge sits at about 89% of the width.

   TWO THINGS ARE DONE TO IT, both at display time rather than by
   re-encoding the file:

     THE CROP   the video is laid out 15% wider than its frame and
                pinned to the left edge, so the right 15% — the corner
                the mark is in — falls outside the frame and is clipped
                away. Nothing is scaled down and no quality is lost;
                the mark is simply not in the visible rectangle.

     THE LOOP   playback returns to 0 when it passes LOOP_END, so only
                the first four seconds ever play. `loop` on the element
                cannot do this: it restarts at the END of the file, not
                at a mark part way through.

   IT ONLY PLAYS UNDER THE CURSOR. At rest it holds a frame; pointing
   at it starts the loop, leaving stops it where it is. A pointer that
   cannot hover — a phone — has no way to ask, so there the clip plays
   on its own as it did before.

   `timeupdate` fires about four times a second, so the turnaround can
   overrun by up to ~250ms. requestVideoFrameCallback is frame-exact
   and is used instead wherever it exists, which is every current
   browser bar Firefox; timeupdate is the fallback there.
   ===================================================================== */

const SRC = '/here_a_sin_image_i_wnat_small.mp4';
const LOOP_END = 4;

const PlatformFilm = ({ src = SRC, end = LOOP_END, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;

    /* the frame is the parent, so that is what the cursor is over */
    const frame = v.parentElement;
    const noHover = window.matchMedia('(hover: none)');

    let handle = 0;
    let stopped = false;

    /* back to the top the moment we pass the mark */
    const check = () => {
      if (v.currentTime >= end) v.currentTime = 0;
    };

    const tick = () => {
      if (stopped) return;
      check();
      if (v.requestVideoFrameCallback) {
        handle = v.requestVideoFrameCallback(tick);
      }
    };

    const play = () => {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    const pause = () => v.pause();

    if (v.requestVideoFrameCallback) {
      handle = v.requestVideoFrameCallback(tick);
    } else {
      v.addEventListener('timeupdate', check);
    }

    /* On a touch screen there is no hovering, so the clip would simply
       never run. Play it outright there. */
    if (noHover.matches) {
      play();
    } else if (frame) {
      frame.addEventListener('mouseenter', play);
      frame.addEventListener('mouseleave', pause);
      /* keyboard reaches it through the card, so focus counts too */
      frame.addEventListener('focusin', play);
      frame.addEventListener('focusout', pause);
    }

    return () => {
      stopped = true;
      if (handle && v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(handle);
      v.removeEventListener('timeupdate', check);
      if (frame) {
        frame.removeEventListener('mouseenter', play);
        frame.removeEventListener('mouseleave', pause);
        frame.removeEventListener('focusin', play);
        frame.removeEventListener('focusout', pause);
      }
    };
  }, [end]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      playsInline
      preload="auto"
      tabIndex={-1}
      aria-hidden="true"
    />
  );
};

export default PlatformFilm;
