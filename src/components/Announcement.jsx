import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  FileText, Send, Users, ShoppingCart, PackageCheck, ReceiptText, CreditCard,
  UserPlus, Target, ClipboardList, Truck,
} from 'lucide-react';
import './Announcement.css';

/* The two end-to-end business processes documented in the Emvive ERP
   Master Document. Selecting a tab shows the actual stages of that flow,
   which then light up one after another so "connected" is demonstrated
   rather than just claimed. */
const FLOWS = {
  p2p: {
    tab: 'Procure-to-Pay',
    label: 'PROCURE-TO-PAY',
    caption: 'From request to payment, connected.',
    steps: [
      { icon: FileText, label: 'Purchase Request' },
      { icon: Send, label: 'RFQ' },
      { icon: Users, label: 'Vendor Selection' },
      { icon: ShoppingCart, label: 'Purchase Order' },
      { icon: PackageCheck, label: 'Goods Receipt' },
      { icon: ReceiptText, label: 'Vendor Invoice' },
      { icon: CreditCard, label: 'Payment' },
    ],
  },
  o2c: {
    tab: 'Order-to-Cash',
    label: 'ORDER-TO-CASH',
    caption: 'From lead to payment, connected.',
    steps: [
      { icon: UserPlus, label: 'Lead' },
      { icon: Target, label: 'Opportunity' },
      { icon: FileText, label: 'Quotation' },
      { icon: ClipboardList, label: 'Sales Order' },
      { icon: Truck, label: 'Delivery' },
      { icon: ReceiptText, label: 'Sales Invoice' },
      { icon: CreditCard, label: 'Payment' },
    ],
  },
};

/* A distinct colour per stage so the flow reads as a sequence of steps
   rather than one block. Applied by position, shared across both flows. */
const PALETTE = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899'];

const ProcessFlow = () => {
  const [tab, setTab] = useState('p2p');
  const [active, setActive] = useState(0);
  const flow = FLOWS[tab];

  /* Advance the highlighted stage on a loop; reset whenever the tab
     changes so the new flow always begins at its first stage. */
  useEffect(() => {
    setActive(0);
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % flow.steps.length);
    }, 1050);
    return () => clearInterval(id);
  }, [tab, flow.steps.length]);

  return (
    <div className="ann-visual-panel">
      <div className="flow-tabs" role="tablist" aria-label="Business processes">
        {Object.entries(FLOWS).map(([key, f]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`flow-tab ${tab === key ? 'is-active' : ''}`}
            onClick={() => setTab(key)}
          >
            {f.tab}
          </button>
        ))}
      </div>

      <div className="flow-track" key={tab}>
        {flow.steps.map((step, i) => {
          const Icon = step.icon;
          const state = i === active ? 'is-active' : i < active ? 'is-done' : '';
          return (
            <div
              className={`flow-step ${state}`}
              key={step.label}
              style={{ '--c': PALETTE[i % PALETTE.length] }}
            >
              <span className="flow-node">
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="flow-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flow-caption">
        <span className="flow-caption-label">{flow.label}</span>
        <span className="flow-caption-text">{flow.caption}</span>
      </div>
    </div>
  );
};

const Announcement = () => {
  return (
    <section className="ann-section">
      <div className="ann-container">
        <div className="ann-card">
          <div className="ann-content">
            <span className="ann-eyebrow">CONNECTED BUSINESS OPERATIONS</span>
            <h2 className="ann-heading">
              Your Business Works Together.{' '}
              <span className="text-accent">Your Software Should Too.</span>
            </h2>
            <p className="ann-desc">
              Finance, sales, procurement, inventory, people, and operations are part of the same business. One platform connects these processes end to end, helping information move with the work and giving teams greater visibility from one step to the next.
            </p>
            <div className="ann-actions">
              <a href="#platform" className="cta-btn-primary">
                See How It Works
                <span className="cta-btn-arrow"><ArrowRight size={16} /></span>
              </a>
              <a href="#demo" className="cta-btn-secondary">
                Request a Demo
              </a>
            </div>
          </div>

          <div className="ann-visual">
            <ProcessFlow />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcement;
