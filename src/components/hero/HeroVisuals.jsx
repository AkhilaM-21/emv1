import React from 'react';

/*
 * Dark, glowing card visuals for the hero split-carousel (theme blue).
 * Each fills its parent card (width/height 100%).
 */

// Light faceted background for the main carousel card (like the reference)
export const CardFacets = () => (
  <svg
    className="hero-card-facets"
    viewBox="0 0 1240 520"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="1240" height="520" fill="#eef1f6" />
    <polygon points="0,0 820,0 300,520 0,520" fill="#f4f7fb" />
    <polygon points="820,0 1240,0 1240,250 610,110" fill="#e7ecf3" />
    <polygon points="300,520 820,520 1240,300 1240,520" fill="#e4eaf2" />
    <polygon points="610,110 1240,250 1240,300 820,520 300,520 720,150" fill="#eaeef4" opacity="0.6" />
  </svg>
);

const CardFrame = ({ children }) => (
  <svg
    className="hero-visual-svg"
    viewBox="0 0 520 360"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hvBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0a1530" />
        <stop offset="100%" stopColor="#0f2a63" />
      </linearGradient>
      <radialGradient id="hvGlow" cx="70%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#e2601f" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#e2601f" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="520" height="360" fill="url(#hvBg)" />
    <rect width="520" height="360" fill="url(#hvGlow)" />
    {children}
  </svg>
);

// Slide 1 — connected network of nodes
export const NetworkViz = () => {
  const nodes = [
    [70, 80], [150, 140], [90, 220], [200, 70], [240, 200], [180, 290],
    [320, 120], [300, 250], [400, 80], [420, 200], [460, 300], [360, 320],
    [130, 60], [260, 130],
  ];
  const links = [
    [0, 1], [1, 2], [0, 3], [1, 4], [4, 5], [3, 6], [6, 7], [4, 7],
    [6, 8], [8, 9], [9, 10], [7, 11], [1, 13], [3, 13], [6, 13], [9, 6],
    [12, 3], [2, 5],
  ];
  return (
    <CardFrame>
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#ef7838" strokeWidth="1" opacity="0.4"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3} fill="#f7a869">
          <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </CardFrame>
  );
};

// Slide 2 — flowing particle streams
export const ParticleViz = () => {
  const streams = [40, 90, 140, 190, 240];
  const dots = [];
  for (let s = 0; s < streams.length; s++) {
    for (let d = 0; d < 22; d++) {
      const x = 20 + d * 22 + (s % 2) * 8;
      const y = streams[s] + Math.sin(d * 0.6 + s) * 26 + 40;
      dots.push(
        <circle
          key={`${s}-${d}`}
          cx={x}
          cy={y}
          r={1.5 + (d % 4) * 0.7}
          fill={d % 3 === 0 ? '#f7a869' : '#e2601f'}
          opacity={0.35 + (d % 5) * 0.13}
        />,
      );
    }
  }
  return <CardFrame>{dots}</CardFrame>;
};

// Slide 3 — glowing bars + trend line
export const ChartViz = () => {
  const bars = [120, 200, 160, 260, 210, 300, 250];
  const bw = 44;
  const gap = 20;
  const baseY = 320;
  return (
    <CardFrame>
      {bars.map((h, i) => {
        const x = 40 + i * (bw + gap);
        return (
          <rect
            key={i}
            x={x} y={baseY - h} width={bw} height={h}
            rx="8" fill="#e2601f" opacity={0.55 + (i % 3) * 0.15}
          />
        );
      })}
      <polyline
        points={bars.map((h, i) => `${40 + i * (bw + gap) + bw / 2},${baseY - h - 14}`).join(' ')}
        fill="none" stroke="#f7b07e" strokeWidth="3" strokeLinecap="round"
      />
      {bars.map((h, i) => (
        <circle key={i} cx={40 + i * (bw + gap) + bw / 2} cy={baseY - h - 14} r="4" fill="#fbe3cf" />
      ))}
    </CardFrame>
  );
};
