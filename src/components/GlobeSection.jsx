import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { geoOrthographic, geoPath, geoInterpolate, geoNaturalEarth1, geoCentroid } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import './GlobeSection.css';

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

// `selected` / `onSelect` are owned by GlobeSection so the detail card
// beside the globe reflects whichever pin is active.
const Globe = ({ selected = 0, onSelect = () => {} }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const badgeRefs = useRef([]);

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
          className={`globe-pin${m.labelBelow ? ' globe-pin-below' : ''} ${selected === i ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onSelect(i); }}
        >
          <span className="globe-pin-flag" />
          {t(`header.regions.${m.regionKey}`, m.label)}
          <span className="globe-pin-dot" />
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

// Flags keyed by region so they can never fall out of step with OFFICES.
const FLAG_BY_KEY = { india: FLAG_IN, saudi: FLAG_SA, dubai: FLAG_AE };

// What "native" means in each region we operate in. Rows mirror the
// compliance surface described in the product doc.
const REGION_DETAILS = {
  saudi: [
    ['Currency', 'SAR'],
    ['Tax regime', 'VAT 15%'],
    ['Payroll', 'WPS · GOSI'],
    ['E-invoicing', 'ZATCA Phase 1 & 2'],
    ['Data residency', 'Riyadh'],
  ],
  dubai: [
    ['Currency', 'AED'],
    ['Tax regime', 'VAT 5%'],
    ['Payroll', 'WPS'],
    ['E-invoicing', 'UAE e-invoicing'],
    ['Data residency', 'Dubai'],
  ],
  india: [
    ['Currency', 'INR'],
    ['Tax regime', 'GST'],
    ['Payroll', 'EPF · ESI'],
    ['E-invoicing', 'GST e-invoice (IRP)'],
    ['Data residency', 'India'],
  ],
};

// Figures shown along the bottom of the panel.
const COVERAGE_STATS = [
  { value: '3', labelKey: 'globe.stat_1_label', label: 'Global Regions' },
  { value: '50k+', labelKey: 'globe.stat_2_label', label: 'Active Users' },
  { value: '99.9%', labelKey: 'globe.stat_0_label', label: 'Server Uptime' },
  { value: '24/7', labelKey: 'globe.stat_3_label', label: 'Support' },
];

// Person photos for the active-users card (placeholder avatar service).
const AVATARS = [
  'https://i.pravatar.cc/80?img=11',
  'https://i.pravatar.cc/80?img=32',
  'https://i.pravatar.cc/80?img=5',
  'https://i.pravatar.cc/80?img=45',
];


/* Dot-matrix world map. Land is rasterised once to an offscreen canvas,
   then sampled on a grid — every hit becomes a dot. All the dots live in a
   single <path> (zero-length segments + round linecaps) so the map is a
   couple of DOM nodes rather than thousands of <circle> elements. */
const DOT_STEP = 7;   // grid spacing in viewBox units
const MAP_W = 960;
const MAP_H = 440;

const WorldMap = ({ selected = 0, onSelect = () => {} }) => {
  const { t } = useTranslation();
  const [world, setWorld] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/countries-110m.json')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setWorld(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { dots, points } = useMemo(() => {
    if (!world || typeof document === 'undefined') return { dots: '', points: [] };

    // Antarctica reads as a meaningless band of dots along the bottom — drop it
    // so the inhabited world fills the frame.
    const all = feature(world, world.objects.countries);
    const land = {
      type: 'FeatureCollection',
      features: all.features.filter((f) => geoCentroid(f)[1] > -60),
    };
    const projection = geoNaturalEarth1().fitExtent(
      [[4, 4], [MAP_W - 4, MAP_H - 4]],
      land
    );

    const canvas = document.createElement('canvas');
    canvas.width = MAP_W;
    canvas.height = MAP_H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const path = geoPath(projection, ctx);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    path(land);
    ctx.fill();

    const { data } = ctx.getImageData(0, 0, MAP_W, MAP_H);
    const cells = [];
    for (let y = 4; y < MAP_H; y += DOT_STEP) {
      for (let x = 4; x < MAP_W; x += DOT_STEP) {
        // alpha channel of the rasterised land tells us if this cell is on land
        if (data[(y * MAP_W + x) * 4 + 3] > 128) cells.push([x, y]);
      }
    }
    if (!cells.length) return { dots: '', points: [] };

    // fitExtent sizes to the land geometry, which includes specks too small to
    // produce a dot — that left empty margins. Re-fit to the dots themselves so
    // the drawn map touches the frame on every side.
    const xs = cells.map((c) => c[0]);
    const ys = cells.map((c) => c[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = 6;
    const k = Math.min(
      (MAP_W - pad * 2) / (maxX - minX),
      (MAP_H - pad * 2) / (maxY - minY)
    );
    const tx = pad - minX * k + (MAP_W - pad * 2 - (maxX - minX) * k) / 2;
    const ty = pad - minY * k + (MAP_H - pad * 2 - (maxY - minY) * k) / 2;
    const fit = ([x, y]) => [x * k + tx, y * k + ty];

    let d = '';
    for (const c of cells) {
      const [x, y] = fit(c);
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    }

    return {
      dots: d,
      points: OFFICES.map((o) => ({ ...o, xy: fit(projection(o.coords)) })),
    };
  }, [world]);

  return (
    <div className="worldmap-wrap">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="wm-svg" role="img">
        <defs>
          <linearGradient id="wmDotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f7a76c" />
            <stop offset="45%" stopColor="#f0883e" />
            <stop offset="100%" stopColor="#d6461a" />
          </linearGradient>
          <radialGradient id="wmGlow">
            <stop offset="0%" stopColor="#e2601f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e2601f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {points.map((p) => (
          <circle
            key={`g${p.regionKey}`}
            cx={p.xy[0]}
            cy={p.xy[1]}
            r="90"
            fill="url(#wmGlow)"
          />
        ))}

        <path d={dots} className="wm-dots" />

        {points.map((p, i) => (
          <g
            key={p.regionKey}
            className={`wm-pin${selected === i ? ' active' : ''}`}
            transform={`translate(${p.xy[0]}, ${p.xy[1]})`}
            onClick={() => onSelect(i)}
          >
            <circle r="22" className="wm-halo" />
            <circle r="6.5" className="wm-dot" />
            <g className="wm-tag" transform="translate(0, -20)">
              <rect x="-52" y="-16" width="104" height="26" rx="13" />
              <text x="0" y="2">{t(`header.regions.${p.regionKey}`, p.label)}</text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
};

const GlobeSection = ({ variant = 'globe', id = 'global' }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const office = OFFICES[selected];
  const rows = REGION_DETAILS[office.regionKey] || [];

  // Regions advance on their own; clicking a pin jumps to it and
  // restarts the dwell from there (the effect re-runs on `selected`).
  useEffect(() => {
    const timer = setTimeout(
      () => setSelected((i) => (i + 1) % OFFICES.length),
      5000
    );
    return () => clearTimeout(timer);
  }, [selected]);

  return (
    <section className="globe-section" id={id}>
      <div className="globe-shell">
        <div className="globe-header">
          <span className="globe-kicker">{t('globe.badge', 'Global by design')}</span>
          <h2 className="globe-heading">
            {t('globe.title1', 'Native in')}{' '}
            <span className="text-accent">{t('globe.title2', 'every region you run.')}</span>
          </h2>
          <p className="globe-sub">
            {t(
              'globe.subtitle',
              'Local tax regimes, statutory payroll, e-invoicing formats and data residency — the default, not an add-on. Click a location on the globe to see what native means where you operate.'
            )}
          </p>
        </div>

        <div className="globe-panel">
          <div className="globe-panel-grid">
            {/* Detail card — cycling through the regions */}
            <div className="globe-detail is-open" key={office.regionKey}>
              <span className="gd-flag">{FLAG_BY_KEY[office.regionKey]}</span>
              <h3 className="gd-title">
                {t(`header.regions.${office.regionKey}`, office.label)}
              </h3>
              <dl className="gd-rows">
                {rows.map(([label, value]) => (
                  <div className="gd-row" key={label}>
                    <dt>{t(`globe.fields.${label.toLowerCase().replace(/ /g, '_')}`, label)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="gd-dots">
                {OFFICES.map((o, i) => (
                  <button
                    key={o.regionKey}
                    type="button"
                    aria-label={o.label}
                    className={`gd-dot${selected === i ? ' active' : ''}`}
                    onClick={() => setSelected(i)}
                  />
                ))}
              </div>
            </div>

            {/* Globe — left */}
            <div className={`globe-stage${variant === 'map' ? ' globe-stage--map' : ''}`}>
              {variant === 'map' ? (
                <WorldMap selected={selected} onSelect={setSelected} />
              ) : (
                <Globe selected={selected} onSelect={setSelected} />
              )}
            </div>
          </div>

          {/* Coverage figures + CTA */}
          <div className="globe-metrics">
            <div className="gm-stats">
              {COVERAGE_STATS.map((st) => (
                <div className="gm-stat" key={st.label}>
                  <span className="gm-value">{st.value}</span>
                  <span className="gm-label">{t(st.labelKey, st.label)}</span>
                </div>
              ))}
            </div>
            <a href="#why-emvive" className="gm-cta">
              {t('globe.cta', 'See compliance coverage')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
