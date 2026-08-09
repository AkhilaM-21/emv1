import React, { useEffect, useRef } from 'react';

/*
 * LiquidBackground
 * Wraps the threejs-components "liquid1" background (loaded from CDN at runtime).
 * Renders an abstract image on a liquid, metallic plane that ripples toward the
 * cursor. Self-contained: the CDN module bundles its own three.js build.
 */

// Abstract blue image the liquid displacement ripples across.
// Served from /public.
const IMAGE_URL = '/hero-bg.jpg';
const MODULE_URL =
  'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js';

const LiquidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app;
    let cancelled = false;
    let raf;

    // Ripple strength while the cursor is moving; eases back to 0 when still,
    // so the image sits flat until you move the mouse.
    const MAX_DISPLACEMENT = 0.6;
    const IDLE_MS = 130;          // no movement for this long => settle to flat
    let target = 0;
    let current = 0;
    let lastMove = -Infinity;

    const onMove = () => {
      target = MAX_DISPLACEMENT;
      lastMove = performance.now();
    };

    (async () => {
      try {
        // @vite-ignore keeps this as a runtime browser import from the CDN
        const mod = await import(/* @vite-ignore */ MODULE_URL);
        if (cancelled) return;

        const LiquidBackgroundFactory = mod.default;
        app = LiquidBackgroundFactory(canvas);

        await app.loadImage(IMAGE_URL);
        if (cancelled) return;

        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 0; // flat at rest
        app.setRain(false);

        const parent = canvas.parentElement || canvas;
        parent.addEventListener('pointermove', onMove);

        // Drive the displacement toward its target every frame.
        const tick = () => {
          if (cancelled) return;
          if (performance.now() - lastMove > IDLE_MS) target = 0;
          current += (target - current) * 0.12;         // smooth ease
          if (current < 0.001 && target === 0) current = 0;
          if (app.liquidPlane?.uniforms?.displacementScale) {
            app.liquidPlane.uniforms.displacementScale.value = current;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (err) {
        // Leave the CSS gradient fallback visible if the CDN/WebGL fails.
        console.warn('LiquidBackground failed to load:', err);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      const parent = canvas.parentElement || canvas;
      parent.removeEventListener('pointermove', onMove);
      if (app && typeof app.dispose === 'function') {
        try { app.dispose(); } catch { /* ignore */ }
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="liquid-canvas" aria-hidden="true" />;
};

export default LiquidBackground;
