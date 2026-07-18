import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { geoOrthographic, geoPath, geoInterpolate } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import './GlobeSection.css';
import Galaxy from './Galaxy';

// Office regions: [lon, lat, label]
const OFFICES = [
  { coords: [77.21, 28.61], label: 'India', regionKey: 'india', address: 'Cyber City, DLF Phase 2, Gurugram, Haryana 122002, India' },
  { coords: [46.72, 24.63], label: 'Saudi Arabia', regionKey: 'saudi', labelBelow: true, address: 'King Fahd Road, Olaya District, Riyadh 12214, Saudi Arabia' },
  { coords: [55.27, 25.20], label: 'Dubai', regionKey: 'dubai', address: 'Sheikh Zayed Road, Trade Centre, Dubai, UAE' },
];

// Nodes that shoot arcs to the offices to simulate global traffic
const TRAFFIC_NODES = [
  { coords: [-74.006, 40.712] }, // New York
  { coords: [-0.127, 51.507] },  // London
  { coords: [139.691, 35.689] }, // Tokyo
  { coords: [151.209, -33.868] },// Sydney
  { coords: [-43.172, -22.906] },// Rio
  { coords: [18.423, -33.924] }, // Cape Town
  { coords: [103.819, 1.352] },  // Singapore
  { coords: [2.352, 48.856] },   // Paris
  { coords: [-118.24, 34.05] },  // Los Angeles
  { coords: [-79.38, 43.65] },   // Toronto
  { coords: [13.40, 52.52] },    // Berlin
  { coords: [37.62, 55.75] },    // Moscow
  { coords: [116.40, 39.90] },   // Beijing
  { coords: [121.47, 31.23] },   // Shanghai
  { coords: [36.82, -1.29] },    // Nairobi
  { coords: [100.50, 13.75] },   // Bangkok
  { coords: [28.98, 41.01] },    // Istanbul
  { coords: [-99.13, 19.43] },   // Mexico City
  { coords: [-58.38, -34.60] },  // Buenos Aires
  { coords: [72.88, 19.08] },    // Mumbai
];

// Re-implemented custom geoDistance
const geoDistanceFn = (a, b) => {
  const r = Math.PI / 180;
  const lat1 = a[1] * r;
  const lat2 = b[1] * r;
  const dLon = (b[0] - a[0]) * r;
  const c = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return Math.acos(Math.max(-1, Math.min(1, c)));
};

const Globe = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const badgeRefs = useRef([]);
  const [activePin, setActivePin] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.globe-pin') && !e.target.closest('.globe-popup')) {
        setActivePin(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    let raf;
    let destroyed = false;
    let land;
    let borders;
    let frame = 0;

    // Centre the view on the region (India/Gulf) so the arcs stay in front.
    let baseLon = -60;
    let baseLat = -18;
    let rotLon = baseLon;
    let rotLat = baseLat;
    let autoT = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Great-circle flight paths radiating from ALL THREE offices. Cities are
    // split across the offices so each one clearly fans out its own arcs.
    const INDIA = [77.21, 28.61];
    const SAUDI = [46.72, 24.63];
    const DUBAI = [55.27, 25.20];
    const ROUTES = [
      // India
      { hub: INDIA, to: [139.69, 35.69] },  // Tokyo
      { hub: INDIA, to: [103.82, 1.35] },   // Singapore
      { hub: INDIA, to: [151.21, -33.87] }, // Sydney
      { hub: INDIA, to: [116.40, 39.90] },  // Beijing
      { hub: INDIA, to: [106.85, -6.21] },  // Jakarta
      // Saudi Arabia
      { hub: SAUDI, to: [-0.13, 51.51] },   // London
      { hub: SAUDI, to: [37.62, 55.75] },   // Moscow
      { hub: SAUDI, to: [28.98, 41.01] },   // Istanbul
      { hub: SAUDI, to: [18.42, -33.92] },  // Cape Town
      { hub: SAUDI, to: [-46.63, -23.55] }, // São Paulo
      // Dubai
      { hub: DUBAI, to: [-74.0, 40.71] },   // New York
      { hub: DUBAI, to: [31.24, 30.04] },   // Cairo
      { hub: DUBAI, to: [36.82, -1.29] },   // Nairobi
      { hub: DUBAI, to: [-118.24, 34.05] }, // Los Angeles
    ];
    const ARC_N = 64;
    const arcs = ROUTES.map((r, i) => {
      const interp = geoInterpolate(r.hub, r.to);
      const dist = geoDistanceFn(r.hub, r.to);
      return {
        pts: Array.from({ length: ARC_N }, (_, s) => interp(s / (ARC_N - 1))),
        altMax: 0.08 + dist * 0.06,
        speed: 0.006 + (i % 4) * 0.0012,
        phase: (i * 0.137) % 1,
      };
    });
    const HUBS = [INDIA, SAUDI, DUBAI];

    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!dragging) return;
      rotLon += (e.clientX - lastX) * 0.25;
      rotLat -= (e.clientY - lastY) * 0.25;
      rotLat = Math.max(-85, Math.min(85, rotLat));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = 'grab';
      // Resume the gentle auto-pan around wherever the user left the globe.
      baseLon = rotLon;
      baseLat = rotLat;
      autoT = 0;
    };
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    canvas.style.cursor = 'grab';

    fetch('/countries-110m.json')
      .then((res) => res.json())
      .then((world) => {
        if (destroyed) return;
        land = feature(world, world.objects.countries);
        borders = mesh(world, world.objects.countries, (a, b) => a !== b);
        loop();
      });

    const draw = () => {
      const wrap = wrapRef.current;
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Big globe centred in an oversized canvas so the full arcs stay visible.
      const scale = Math.min(w * 0.5, 320);
      const cx = w / 2;
      const cy = h / 2;

      const projection = geoOrthographic()
        .scale(scale)
        .translate([cx, cy])
        .rotate([rotLon, rotLat, 0])
        .clipAngle(90);

      const projArc = geoOrthographic()
        .scale(scale)
        .translate([cx, cy])
        .rotate([rotLon, rotLat, 0])
        .clipAngle(180);

      const path = geoPath(projection, ctx);

      const dark = document.body.classList.contains('dark-theme');
      const landColor = '#1c7d75'; // Teal green from the image
      const borderColor = 'rgba(28, 125, 117, 0.8)'; // Match land

      // Ocean: light water blue to dark navy blue gradient
      const ocean = ctx.createRadialGradient(
        cx - scale * 0.4, cy - scale * 0.42, scale * 0.15,
        cx, cy, scale * 1.02,
      );
      ocean.addColorStop(0, '#0ea5e9'); // Light water blue
      ocean.addColorStop(0.5, '#1e3a8a'); // Dark navy blue
      ocean.addColorStop(1, '#0a1024'); // Very dark navy edge
      ctx.beginPath();
      path({ type: 'Sphere' });
      ctx.fillStyle = ocean;
      ctx.fill();

      ctx.beginPath();
      path(land);
      ctx.fillStyle = landColor;
      ctx.fill();

      ctx.beginPath();
      path(borders);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = borderColor;
      ctx.stroke();

      // Specular sheen removed based on user request.
      const center = [-rotLon, -rotLat];
      const isVisible = (c) => geoDistanceFn(c, center) < Math.PI / 2;

      // ---- Great-circle flight arcs radiating from the region ----
      const arcGlow = '255, 255, 255'; // white glow
      const arcCore = '255, 200, 100'; // orangeish head

      // Lift a surface point radially by altitude a (fraction of the radius).
      const raise = (base, a) => {
        const r = 1 + a;
        return [cx + (base[0] - cx) * r, cy + (base[1] - cy) * r];
      };

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      arcs.forEach((arc) => {
        const n = arc.pts.length;
        const P = (s) => {
          const base = projArc(arc.pts[s]);
          if (!base) return null;
          const t = s / (n - 1);
          const sp = raise(base, arc.altMax * Math.sin(Math.PI * t));
          const front = geoDistanceFn(arc.pts[s], center) < Math.PI / 2;
          const rr = Math.hypot(sp[0] - cx, sp[1] - cy);
          if (!front && rr <= scale) return null; // tucked behind the globe
          return sp;
        };

        // Faint full arc.
        ctx.beginPath();
        let drawing = false;
        for (let s = 0; s < n; s++) {
          const p = P(s);
          if (!p) { drawing = false; continue; }
          if (!drawing) { ctx.moveTo(p[0], p[1]); drawing = true; }
          else ctx.lineTo(p[0], p[1]);
        }
        ctx.strokeStyle = `rgba(${arcGlow}, 0.5)`;
        ctx.lineWidth = 1.1;
        ctx.shadowColor = `rgba(${arcGlow}, 0.5)`;
        ctx.shadowBlur = 3;
        ctx.stroke();

        // Bright comet with a dotted trail travelling out from the hub.
        const head = (frame * arc.speed + arc.phase) % 1;
        const DOTS = 16;
        const GAP = 0.022;
        for (let k = 0; k < DOTS; k++) {
          const t = head - k * GAP;
          if (t < 0 || t > 1) continue;
          const p = P(Math.round(t * (n - 1)));
          if (!p) continue;
          const fade = 1 - k / DOTS;
          ctx.beginPath();
          ctx.arc(p[0], p[1], (k === 0 ? 2.3 : 1.3) * fade + 0.25, 0, Math.PI * 2);
          if (k === 0) {
            ctx.fillStyle = `rgba(${arcCore}, 1)`;
            ctx.shadowColor = `rgba(${arcGlow}, 1)`;
            ctx.shadowBlur = 13;
          } else {
            ctx.fillStyle = `rgba(${arcCore}, ${0.85 * fade})`;
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Bright convergence glow at each office hub.
      HUBS.forEach((h) => {
        const hubP = projArc(h);
        if (!hubP || geoDistanceFn(h, center) >= Math.PI / 2) return;
        const grd = ctx.createRadialGradient(hubP[0], hubP[1], 0, hubP[0], hubP[1], 16);
        grd.addColorStop(0, `rgba(${arcCore}, 0.85)`);
        grd.addColorStop(0.4, `rgba(${arcGlow}, 0.35)`);
        grd.addColorStop(1, `rgba(${arcGlow}, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(hubP[0], hubP[1], 16, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Draw the glowing dots for the main offices
      OFFICES.forEach((m) => {
        const p = projArc(m.coords);
        if (!p) return;
        const onFront = isVisible(m.coords);
        const alpha = onFront ? 1 : 0.28;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        // Stronger white glow for the dots
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
      });

      OFFICES.forEach((m, i) => {
        const el = badgeRefs.current[i];
        if (!el) return;
        const p = projection(m.coords);
        if (p && isVisible(m.coords)) {
          const dx = m.labelDx || 0;
          // Shift the label body but keep the location dot pinned to the marker.
          el.style.setProperty('--dot-shift', `${-dx}px`);
          el.style.opacity = '1';
          const yShift = m.labelBelow ? '40%' : '-140%';
          el.style.transform = `translate(-50%, ${yShift}) translate(${p[0] + dx}px, ${p[1]}px)`;
        } else {
          el.style.opacity = '0';
        }
      });
    };

    const loop = () => {
      if (destroyed) return;
      frame += 1;
      if (!dragging) {
        // Gentle oscillation around the region so the arcs stay in view.
        autoT += 1;
        rotLon = baseLon + 22 * Math.sin(autoT * 0.006);
        rotLat = baseLat + 5 * Math.sin(autoT * 0.004);
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div className="globe-wrap" ref={wrapRef}>
      <canvas ref={canvasRef} className="globe-canvas" />
      {OFFICES.map((m, i) => (
        <div 
          key={i} 
          ref={(el) => (badgeRefs.current[i] = el)} 
          className={`globe-pin${m.labelBelow ? ' globe-pin-below' : ''} ${activePin === i ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setActivePin(activePin === i ? null : i); }}
        >
          <span className="globe-pin-flag" />
          {t(`header.regions.${m.regionKey}`, m.label)}
          <span className="globe-pin-dot" />
          
          {activePin === i && (
            <div className="globe-popup" onClick={(e) => e.stopPropagation()}>
              <h4>{t('globe.officeTitle', { region: t(`header.regions.${m.regionKey}`, m.label), defaultValue: '{{region}} Office' })}</h4>
              <p>{t(`globe.offices.${m.regionKey}.address`, m.address)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const GLOBE_STATS = [
  { value: '99.9%', label: 'Server Uptime', icon: 'uptime' },
  { value: '15+', label: 'Global Regions', icon: 'regions' },
  { value: '50k+', label: 'Active Users', icon: 'users' },
  { value: '24/7', label: 'Support', icon: 'support' },
];

const STAT_ICON_PATHS = {
  uptime: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  regions: (<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>),
  support: (<><path d="M3 14v-2a9 9 0 0 1 18 0v2" /><path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" /><path d="M3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z" /></>),
};

// Inline SVG flags (reliable everywhere, unlike flag emoji on Windows).
const FLAG_IN = (
  <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
    <rect width="900" height="200" fill="#ff9933" />
    <rect y="200" width="900" height="200" fill="#fff" />
    <rect y="400" width="900" height="200" fill="#138808" />
    <circle cx="450" cy="300" r="58" fill="none" stroke="#008" strokeWidth="12" />
    <circle cx="450" cy="300" r="9" fill="#008" />
  </svg>
);
const FLAG_AE = (
  <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
    <rect width="900" height="200" fill="#00732f" />
    <rect y="200" width="900" height="200" fill="#fff" />
    <rect y="400" width="900" height="200" fill="#000" />
    <rect width="240" height="600" fill="#ff0000" />
  </svg>
);
const FLAG_SA = (
  <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">
    <rect width="900" height="600" fill="#006c35" />
    <rect x="150" y="250" width="600" height="34" rx="6" fill="#fff" />
    <rect x="180" y="410" width="540" height="24" rx="12" fill="#fff" />
  </svg>
);
const FLAG_US = (
  <svg viewBox="0 0 910 600" preserveAspectRatio="xMidYMid slice">
    <rect width="910" height="600" fill="#fff" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect key={i} y={(i * 600) / 13} width="910" height={600 / 13} fill="#b22234" />
    ))}
    <rect width="380" height={(600 * 7) / 13} fill="#3c3b6e" />
  </svg>
);
const REGION_FLAGS = [FLAG_IN, FLAG_AE, FLAG_SA];

// Person photos for the active-users card (placeholder avatar service).
const AVATARS = [
  'https://i.pravatar.cc/80?img=11',
  'https://i.pravatar.cc/80?img=32',
  'https://i.pravatar.cc/80?img=5',
  'https://i.pravatar.cc/80?img=45',
];

const GlobeSection = () => {
  const { t } = useTranslation();

  return (
    <section className="globe-section" id="global">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Galaxy 
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.5}
          glowIntensity={0.1}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.005}
          repulsionStrength={0}
          autoCenterRepulsion={0}
          starSpeed={0.01}
          speed={0.1}
          transparent={true}
        />
      </div>

      <div className="globe-container">
        <div className="globe-header">
          <span className="globe-eyebrow">
            <span className="eyebrow-dot" />
            {t('globe.badge', 'GLOBAL PRESENCE')}
          </span>
          <h2 className="globe-title">{t('globe.title', 'One platform, offices across the globe')}</h2>
          <p className="globe-subtitle">
            {t('globe.subtitle', 'From India to Saudi Arabia and Dubai, Emvive powers enterprises across regions — drag the globe to explore where we operate.')}
          </p>
        </div>
      </div>

      <div className="globe-float-layout">
        <Globe />

        {/* Server Uptime — top left */}
        <div className="globe-stat-card float-card float-card-0">
          <div className="gs-head">
            <div className="gs-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{STAT_ICON_PATHS.uptime}</svg>
            </div>
            <div className="gs-text-wrap">
              <div className="gs-value">99.9%</div>
              <div className="gs-label">{t('globe.stat_0_label', 'Server Uptime')}</div>
            </div>
          </div>
          <svg className="gs-spark" viewBox="0 0 220 44" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gsSpark1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ef7838" stopOpacity="0.28" />
                <stop offset="1" stopColor="#ef7838" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="gs-spark-area" fill="url(#gsSpark1)" d="M0,36 C25,32 40,38 60,29 80,20 100,25 120,17 140,9 165,15 190,7 205,9 220,4 L220,44 L0,44 Z" />
            <path className="gs-spark-line" fill="none" d="M0,36 C25,32 40,38 60,29 80,20 100,25 120,17 140,9 165,15 190,7 205,9 220,4" />
          </svg>
        </div>

        {/* Active Users — top right */}
        <div className="globe-stat-card float-card float-card-2">
          <div className="gs-head">
            <div className="gs-icon-wrap gs-icon-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{STAT_ICON_PATHS.users}</svg>
            </div>
            <div className="gs-text-wrap">
              <div className="gs-value">50k+</div>
              <div className="gs-label">{t('globe.stat_2_label', 'Active Users')}</div>
            </div>
          </div>
          <div className="gs-avatars">
            {AVATARS.map((src, i) => (
              <img key={i} className="gs-av" src={src} alt="" loading="lazy" />
            ))}
            <span className="gs-av gs-av-plus">+</span>
          </div>
          <div className="gs-progress"><span style={{ width: '72%' }} /></div>
          <div className="gs-foot">
            <span>{t('globe.growingDaily', 'Growing every day')}</span>
            <span className="gs-up">12.5% ↑</span>
          </div>
        </div>

        {/* Global Regions — bottom left */}
        <div className="globe-stat-card float-card float-card-1">
          <div className="gs-head">
            <div className="gs-icon-wrap gs-icon-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{STAT_ICON_PATHS.regions}</svg>
            </div>
            <div className="gs-text-wrap">
              <div className="gs-value">3</div>
              <div className="gs-label">{t('globe.stat_1_label', 'Global Regions')}</div>
            </div>
          </div>
          <div className="gs-flags">
            {REGION_FLAGS.map((flag, i) => (
              <span key={i} className="gs-flag">{flag}</span>
            ))}
            <span className="gs-flag-more">{t('globe.regionsList', 'India · UAE · Saudi')}</span>
          </div>
        </div>

        {/* Support — bottom right */}
        <div className="globe-stat-card float-card float-card-3">
          <div className="gs-head">
            <div className="gs-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{STAT_ICON_PATHS.support}</svg>
            </div>
            <div className="gs-text-wrap">
              <div className="gs-value">24/7</div>
              <div className="gs-label">{t('globe.stat_3_label', 'Support')}</div>
            </div>
          </div>
          <svg className="gs-spark" viewBox="0 0 220 44" preserveAspectRatio="none">
            <path className="gs-spark-area" fill="url(#gsSpark1)" d="M0,30 C25,26 45,34 65,24 85,14 105,22 125,14 145,7 165,16 185,10 200,12 220,6 L220,44 L0,44 Z" />
            <path className="gs-spark-line" fill="none" d="M0,30 C25,26 45,34 65,24 85,14 105,22 125,14 145,7 165,16 185,10 200,12 220,6" />
          </svg>
          <div className="gs-foot">
            <span>{t('globe.alwaysHere', 'Always here for you')}</span>
            <span className="gs-badge">{t('globe.available', 'Available')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
