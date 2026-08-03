import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Users, TrendingUp, BarChart3, Workflow, ReceiptText } from 'lucide-react';
import { DashboardWrapper } from '../Products';
import './HeroDemoBox.css';

/* Tabbed product demo, modelled on the showcase block from crisp.chat:
   a white box whose top strip is a row of product cards — icon chip, title,
   one-liner — with the active card running a bar that advances on its own.

   The dashboards themselves are the project's existing ones from
   Products.jsx (DashboardERP / HR / CRM / Reporting / Workflow / Invoice),
   matched by product id so there is only one set to maintain. Names, icons,
   accents and one-liners come from the header's Business Suites menu. */

/* keep in step with the hdb-fill duration in HeroDemoBox.css */
const TAB_MS = 4200;

const PRODUCTS = [
  { id: 1, name: 'Cloud ERP', blurb: 'Finance, supply chain & operations', accent: '#2563eb', Icon: Cloud },
  { id: 2, name: 'HR & Payroll', blurb: 'People, payroll & compliance', accent: '#0d9488', Icon: Users },
  { id: 3, name: 'CRM & Sales', blurb: 'Pipeline to cash', accent: '#7c3aed', Icon: TrendingUp },
  { id: 4, name: 'Advanced Reporting', blurb: 'Dashboards & insights', accent: '#db2777', Icon: BarChart3 },
  { id: 5, name: 'Workflow Automation', blurb: 'Approvals & triggers', accent: '#0891b2', Icon: Workflow },
  { id: 6, name: 'E-Invoicing', blurb: 'E-invoicing & ZATCA clearance', accent: '#e2601f', Icon: ReceiptText },
];

const HeroDemoBox = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % PRODUCTS.length), TAB_MS);
    return () => clearInterval(id);
  }, [paused]);

  /* replay the fill animation whenever the active tab changes */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }, [active]);

  return (
    <div
      className={`hdb-box ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hdb-tabs" role="tablist">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`hdb-tab ${active === i ? 'on' : ''}`}
            style={{ '--acc': p.accent }}
            onClick={() => setActive(i)}
          >
            <span className="hdb-tab-ic"><p.Icon size={20} /></span>
            <span className="hdb-tab-name">{p.name}</span>
            <span className="hdb-tab-blurb">{p.blurb}</span>
            <span className="hdb-tab-progress">
              <i ref={active === i ? barRef : null} />
            </span>
          </button>
        ))}
      </div>

      <div className="hdb-stage">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            className={`hdb-slide ${active === i ? 'on' : ''}`}
            style={{ '--acc': p.accent }}
            aria-hidden={active !== i}
          >
            {/* inView drives the dashboards' own count-ups and bar growth,
                so the numbers re-animate every time a tab becomes active */}
            <DashboardWrapper product={p} inView={active === i} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroDemoBox;
