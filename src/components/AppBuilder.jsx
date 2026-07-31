import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Bell, FileText, ArrowRight } from 'lucide-react';
import './AppBuilder.css';

const B = '{';
const E = '}';

/* Left card — glowing isometric data-layer stack */
const DataStack = () => (
  <div className="ab-iso-wrap">
    <div className="ab-iso">
      <span className="ab-iso-layer il1" />
      <span className="ab-iso-layer il2" />
      <span className="ab-iso-layer il3" />
      <span className="ab-iso-layer il4" />
      <span className="ab-iso-base" />
    </div>
  </div>
);

const AppBuilder = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    const fontSize = 13;      // small glyphs
    const rowGap = 22;        // vertical spacing between rows
    const charW = 11;         // horizontal step per glyph
    const chars = '01{}[]()<>;=+-*/&|!$#</>constletfnabcdef';  // code-like characters
    let width = 0, height = 0, drops = [];

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const rows = Math.floor(height / rowGap);
      drops = Array.from({ length: rows }, () => Math.random() * (width / charW));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf, last = 0;
    const step = 70;          // ms per frame — slow, gentle drift
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < step) return;
      last = t;
      const dark = document.body.classList.contains('dark-theme');
      // translucent fade leaves fading trails — match the section background
      // exactly so trails don't drift toward a purple tint
      ctx.fillStyle = dark ? 'rgba(5,8,22,0.18)' : 'rgba(238,244,255,0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      // clean blue glyphs (numbers + code) — no violet cast
      ctx.fillStyle = dark ? 'rgba(242, 141, 66,0.35)' : 'rgba(217, 83, 31,0.38)';
      for (let i = 0; i < drops.length; i++) {
        const c = chars[(Math.random() * chars.length) | 0];
        ctx.fillText(c, drops[i] * charW, i * rowGap + fontSize);   // move rightward
        if (drops[i] * charW > width && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="app-builder-section" id="app-builder">
      <canvas ref={canvasRef} className="ab-bg-canvas" aria-hidden="true" />
      <div className="ab-circuit" aria-hidden="true" />

      <div className="ab-container">
        <div className="ab-header">
          <div className="ab-header-text">
            <span className="ab-eyebrow">POWERING ENTERPRISES GLOBALLY</span>
            <h2 className="ab-title">
              {t('appBuilder.titleLine1', 'One Platform.')}{' '}
              <span className="ab-title-grad">{t('appBuilder.titleLine2', 'Infinite Possibilities.')}</span>
            </h2>
            <p className="ab-subtitle">
              {t('appBuilder.subtitle', 'From India to the world — we help businesses connect, automate, and grow across borders.')}
            </p>
          </div>
          <a href="#app-builder" className="ab-cta-btn">
            Explore platform <span className="ab-cta-arrow"><ArrowRight size={16} /></span>
          </a>
        </div>
      </div>

      <div className="ab-stage">
        <div className="ab-deck">
          {/* pills with connector wires */}
          <div className="ab-pill pos-tl">
            <span className="ab-pill-ring" />
            {t('appBuilder.tabs.data', 'Data Builder')}
            <span className="ab-wire wire-left" aria-hidden="true" />
          </div>
          <div className="ab-pill pos-tc">
            <span className="ab-pill-ring" />
            {t('appBuilder.tabs.form', 'Form Builder')}
            <span className="ab-wire wire-center" aria-hidden="true" />
          </div>
          <div className="ab-pill pos-tr">
            <span className="ab-pill-ring" />
            {t('appBuilder.tabs.workflow', 'Workflow & Automation')}
            <span className="ab-wire wire-right" aria-hidden="true" />
          </div>

          {/* LEFT — Data Connectors */}
          <div className="ab-term ab-data-card step-0">
            <div className="ab-data-head"><Database size={17} /> Data Connectors</div>
            <DataStack />
          </div>

          {/* CENTER — contact-request.form */}
          <div className="ab-term step-1">
            <div className="ab-term-bar">
              <span className="ab-dot r" /><span className="ab-dot y" /><span className="ab-dot g" />
              <span className="ab-term-title">emvive - contact-request.form</span>
              <span className="ab-live"><span className="ab-live-dot" /> Live</span>
            </div>
            <div className="ab-term-body">
              <div className="ab-code">
                <div className="tl"><span className="kw">form</span> <span className="ty2">ContactRequest</span> {B}</div>
                <div className="tl">  full_name   <span className="tp">input</span>    <span className="at">@required</span></div>
                <div className="tl">  email       <span className="tp">email</span>    <span className="at">@required</span></div>
                <div className="tl">  phone       <span className="tp">tel</span></div>
                <div className="tl">  department  <span className="tp">select</span>   <span className="at">@required</span></div>
                <div className="tl">  message     <span className="tp">textarea</span></div>
                <div className="tl">{E}</div>
                <div className="tl sp" />
                <div className="tl cm">// validation</div>
                <div className="tl">  <span className="fn">on</span>(submit) <span className="kw">=&gt;</span> <span className="fn">notify</span>(team)</div>
                <div className="tl cm">// published</div>
                <div className="tl ok"><span className="ck">✓</span> 5 fields · live</div>
              </div>
              <div className="ab-out">
                <div className="ab-out-label">PREVIEW · CONTACT REQUEST</div>
                <div className="ab-out-form">
                  <div className="of-field"><label>Full name</label><div className="of-inp of-ph">Enter full name</div></div>
                  <div className="of-field"><label>Email address</label><div className="of-inp of-ph">Enter email address</div></div>
                  <div className="of-field"><label>Phone</label><div className="of-inp of-ph">Enter phone number</div></div>
                  <div className="of-field"><label>Department</label><div className="of-inp of-sel of-ph">Select department<span className="of-chev">⌄</span></div></div>
                  <div className="of-field"><label>Message</label><div className="of-inp of-area of-ph">Type your message…</div></div>
                  <button className="of-btn">Submit request</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — order-approval.flow */}
          <div className="ab-term step-2">
            <div className="ab-term-bar">
              <span className="ab-dot r" /><span className="ab-dot y" /><span className="ab-dot g" />
              <span className="ab-term-title">emvive - order-approval.flow</span>
              <span className="ab-live"><span className="ab-live-dot" /> Live</span>
            </div>
            <div className="ab-term-body stacked">
              <div className="ab-code">
                <div className="tl"><span className="kw">on</span> <span className="ty2">OrderCreated</span> {B}</div>
                <div className="tl">  <span className="kw">if</span> (amount &gt; <span className="nm">1000</span>) {B}</div>
                <div className="tl">    <span className="fn">notify</span>(manager)</div>
                <div className="tl">    <span className="fn">invoice.create</span>()</div>
                <div className="tl">  {E}</div>
                <div className="tl">{E}</div>
                <div className="tl sp" />
                <div className="tl ok"><span className="ck">✓</span> Live · trigger + 2 actions</div>
              </div>
              <div className="ab-out">
                <div className="ab-out-label">PREVIEW · ORDER APPROVAL</div>
                <div className="ab-flow">
                  <div className="ab-flow-row">
                    <span className="fbox order">New order</span>
                    <span className="fbox-arrow">→</span>
                    <span className="fbox cond">&gt; $1,000</span>
                  </div>
                  <div className="ab-flow-tree" aria-hidden="true">
                    <span className="tree-v" />
                    <span className="tree-h" />
                    <span className="tree-l" />
                    <span className="tree-r" />
                  </div>
                  <div className="ab-flow-row">
                    <span className="fbox act notify"><Bell size={13} /> Notify</span>
                    <span className="fbox act invoice"><FileText size={13} /> Invoice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppBuilder;
