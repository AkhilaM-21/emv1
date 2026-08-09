import React, { useMemo, useState } from 'react';
import {
  Database, Users, Wallet, Mail, MessageCircle, Cloud, CreditCard,
  BarChart3, Cpu, Boxes, Terminal, Webhook, Braces, KeyRound, Code2,
  ArrowRight, Zap, Workflow, PanelsTopLeft, ShieldCheck, GitBranch,
} from 'lucide-react';
import { motion, MaskText, Reveal, useLive, EASE } from '../shared/motion';
import { Kicker, Code, Marquee, useAutoStep, AnimatePresence } from './PlatformKit';
import './PlatformEco.css';

/* =====================================================================
   ECOSYSTEM + DEVELOPERS

   · INTEGRATIONS — paper. Not a logo wall. A live map: the platform in
     the middle, the systems it is joined to around it, and traffic
     actually moving on the wires. Hovering a system tells you what it
     reads and what it writes, which is the only thing anyone evaluating
     an integration story wants to know.

   · DEVELOPERS — night. Large type against a working request/response
     pair, then the four ways the same capability is reachable.
   ===================================================================== */

const SYSTEMS = [
  { id: 'erp', label: 'ERP', icon: Boxes, reads: 'items, vendors, GL', writes: 'orders, journals', tone: 'v' },
  { id: 'crm', label: 'CRM', icon: Users, reads: 'accounts, contacts', writes: 'opportunities', tone: 'cy' },
  { id: 'hr', label: 'HR & Payroll', icon: Users, reads: 'employees, grades', writes: 'claims, leave', tone: 'v' },
  { id: 'fin', label: 'Finance', icon: Wallet, reads: 'cost centres', writes: 'invoices, accruals', tone: 'run' },
  { id: 'mail', label: 'Email', icon: Mail, reads: 'inbound requests', writes: 'notifications', tone: 'amb' },
  { id: 'wa', label: 'WhatsApp', icon: MessageCircle, reads: 'replies', writes: 'approvals, alerts', tone: 'run' },
  { id: 'rest', label: 'REST & GraphQL', icon: Webhook, reads: 'anything exposed', writes: 'anything permitted', tone: 'cy' },
  { id: 'db', label: 'Databases', icon: Database, reads: 'legacy tables', writes: 'sync back', tone: 'v' },
  { id: 'cloud', label: 'Cloud storage', icon: Cloud, reads: 'documents', writes: 'signed PDFs', tone: 'amb' },
  { id: 'pay', label: 'Payments', icon: CreditCard, reads: 'settlements', writes: 'payment runs', tone: 'run' },
  { id: 'bi', label: 'BI & warehouse', icon: BarChart3, reads: 'models', writes: 'curated extracts', tone: 'cy' },
  { id: 'iot', label: 'Devices & IoT', icon: Cpu, reads: 'telemetry', writes: 'work orders', tone: 'amb' },
];

const FEED = [
  { t: 'invoice.posted', m: 'Finance · 24 ms', tone: 'run' },
  { t: 'employee.created', m: 'HR · 18 ms', tone: 'v' },
  { t: 'stock.moved', m: 'ERP · 31 ms', tone: 'v' },
  { t: 'approval.granted', m: 'WhatsApp · 402 ms', tone: 'run' },
  { t: 'document.signed', m: 'Cloud storage · 88 ms', tone: 'amb' },
  { t: 'lead.captured', m: 'CRM · 22 ms', tone: 'cy' },
  { t: 'sensor.threshold', m: 'IoT · 12 ms', tone: 'amb' },
];

const Integrations = () => {
  const [hover, setHover] = useState(null);

  /* nodes on two alternating radii, so the ring reads as a system map
     rather than a clock face */
  const nodes = useMemo(() => SYSTEMS.map((s, i) => {
    const a = (-90 + i * (360 / SYSTEMS.length)) * (Math.PI / 180);
    const r = i % 2 === 0 ? 40 : 31;
    return { ...s, x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
  }), []);

  const [live, liveRef] = useLive(
    { n: 0, events: [2, 1, 0], eps: 1840 },
    (s) => ({
      n: s.n + 1,
      events: [(s.events[0] + 1) % FEED.length, ...s.events.slice(0, 2)],
      eps: Math.round(1840 + Math.sin(s.n * 1.3) * 180),
    }),
    2600
  );

  return (
    <section className="pe" id="integrations" ref={liveRef}>
      <div className="pe-inner">
        <div className="pe-copy">
          <Reveal><Kicker>10 — Connected</Kicker></Reveal>
          <MaskText text="Everything you already run," accent="on the same wire." as="h2" className="pe-h2" />
          <Reveal delay={0.16} y={14}>
            <p>
              Applications built here are not islands. They read the ERP objects your
              finance team is posting to, call the systems you have had for a decade,
              and push events back out — over connectors your team configures rather
              than a project someone quotes for.
            </p>
          </Reveal>

          <Reveal delay={0.24} y={14}>
            <div className="pe-stats">
              {[['1,840', 'events / second'], ['38 ms', 'median round trip'], ['99.98%', 'delivery'], ['0', 'nightly batch jobs']].map(([n, l]) => (
                <div key={l}><b>{n}</b><span>{l}</span></div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.3} y={14}>
            <div className="pe-feed">
              <span className="pe-feed-h"><i />live event stream · {live.eps}/s</span>
              <AnimatePresence initial={false}>
                {live.events.map((idx, i) => (
                  <motion.span
                    className={`pe-feed-l ${FEED[idx].tone}`}
                    key={`${idx}-${live.n}-${i}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1 - i * 0.3, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <i />{FEED[idx].t}<em>{FEED[idx].m}</em>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* ---------------- the map ---------------- */}
        <div className="pe-map">
          <svg viewBox="0 0 100 100" className="pe-wires" aria-hidden="true">
            <circle cx="50" cy="50" r="40" className="pe-orbit" />
            <circle cx="50" cy="50" r="31" className="pe-orbit" />

            {nodes.map((n) => {
              const d = `M50,50 L${n.x},${n.y}`;
              return (
                <g key={n.id} className={`pe-wire ${n.tone} ${hover === n.id ? 'hot' : ''}`}>
                  <path d={d} className="pe-wire-t" vectorEffect="non-scaling-stroke" />
                  <path d={d} className="pe-wire-p" vectorEffect="non-scaling-stroke" />
                </g>
              );
            })}
          </svg>

          {/* the core */}
          <div className="pe-core">
            <span className="pe-core-ring" />
            <span className="pe-core-ring b" />
            <div className="pe-core-in">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M16 8L8 13V19L16 24L24 19V13L16 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.45" />
              </svg>
              <b>Emvive</b>
              <em>Platform</em>
            </div>
          </div>

          {nodes.map((n) => (
            <button
              type="button"
              key={n.id}
              className={`pe-node t-${n.tone} ${hover === n.id ? 'on' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
            >
              <span className="pe-node-ic"><n.icon size={15} strokeWidth={1.8} /></span>
              <span className="pe-node-l">{n.label}</span>

              <span className="pe-tip">
                <em>reads</em> {n.reads}
                <br />
                <em>writes</em> {n.writes}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* protocols, not logos — the honest version of a logo wall */}
      <div className="pe-proto">
        <Marquee speed={52}>
          {['REST', 'GraphQL', 'Webhooks', 'OData', 'SOAP', 'SFTP', 'EDI / AS2', 'SQL', 'OAuth 2.0', 'SAML 2.0', 'SCIM', 'OpenAPI 3', 'AMQP', 'S3', 'SMTP / IMAP', 'gRPC'].map((p) => (
            <span className="pe-proto-i" key={p}>{p}</span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

/* =====================================================================
   DEVELOPERS
   ===================================================================== */

const TABS = [
  {
    k: 'REST', icon: Terminal,
    code: `# create a record and start the flow it triggers
curl -X POST https://api.emvive.com/v1/objects/work_order \\
  -H "Authorization: Bearer $EMVIVE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "asset_id": "AST-0142",
    "site": "jubail-t4",
    "priority": "high"
  }'`,
    res: `{
  "id": "WO-4412",
  "created_at": "2026-08-09T09:41:02Z",
  "flow_run": 48219,
  "url": "https://app.emvive.com/wo/4412"
}`,
  },
  {
    k: 'SDK', icon: Code2,
    code: `import { Emvive } from '@emvive/sdk'

const emvive = new Emvive({ token: process.env.EMVIVE_TOKEN })

// typed against your own objects, generated from your workspace
const wo = await emvive.workOrder.create({
  assetId: 'AST-0142',
  site: 'jubail-t4',
  priority: 'high',
})

await emvive.flows.run('dispatch-engineer', { workOrder: wo.id })`,
    res: `{
  "run": 48220,
  "status": "queued",
  "steps": 5,
  "idempotency_key": "wo-4412-dispatch"
}`,
  },
  {
    k: 'Webhook', icon: Webhook,
    code: `// receive every state change, signed and replayable
export async function POST(request) {
  const event = await verify(request, process.env.EMVIVE_SIGNING_KEY)

  if (event.type === 'work_order.completed') {
    await billing.draftInvoice(event.data.id)
  }

  return new Response(null, { status: 204 })
}`,
    res: `{
  "type": "work_order.completed",
  "delivered_at": "2026-08-09T14:22:10Z",
  "attempt": 1,
  "signature": "t=1786...,v1=8f2c..."
}`,
  },
  {
    k: 'Custom code', icon: Braces,
    code: `// a code step inside a flow — same runtime, same permissions
export default async function ({ record, emvive, secrets }) {
  const rate = await fetch('https://fx.internal/sar', {
    headers: { 'x-api-key': secrets.FX_KEY },
  }).then((r) => r.json())

  return { amount_sar: record.amount * rate.usd_sar }
}`,
    res: `{
  "returned": { "amount_sar": 532400 },
  "duration_ms": 41,
  "sandbox": "isolated-v8"
}`,
  },
];

const LADDER = [
  { k: 'Code', icon: Braces, d: 'A function, a query, a custom component.' },
  { k: 'API', icon: Webhook, d: 'Exposed automatically, versioned and documented.' },
  { k: 'Flow', icon: Workflow, d: 'Called as a step by anyone building a process.' },
  { k: 'Application', icon: PanelsTopLeft, d: 'Used by people who will never see the code.' },
];

const Developers = () => {
  const { ref, index, pick, bind } = useAutoStep(TABS.length, 5200);
  const tab = TABS[index];

  return (
    <section className="pd" id="developers" ref={ref} {...bind}>
      <div className="pd-inner">
        <div className="pd-copy">
          <Reveal><Kicker tone="dark">11 — For developers</Kicker></Reveal>
          <h2 className="pd-h2">Build your <em>way.</em></h2>
          <Reveal delay={0.14} y={14}>
            <p>
              Low-code is the default, not the ceiling. Every object is an API the
              moment it exists, every flow can call your code, and your code can call
              every flow. Nothing you build by hand is second class.
            </p>
          </Reveal>

          <Reveal delay={0.22} y={14}>
            <ul className="pd-points">
              {[
                [KeyRound, 'Scoped tokens and service accounts, with the same row-level rules as the UI.'],
                [GitBranch, 'Workspaces are versioned. Promote dev → test → production with approval.'],
                [ShieldCheck, 'Custom code runs sandboxed, with secrets injected rather than stored in the step.'],
                [Zap, 'Idempotency keys, retries and replay on every endpoint and every webhook.'],
              ].map(([Ic, t]) => (
                <li key={t}><Ic size={14} strokeWidth={1.9} />{t}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3} y={14}>
            <a className="pd-link" href="#start">Read the API reference <ArrowRight size={15} /></a>
          </Reveal>
        </div>

        {/* ---------------- editor ---------------- */}
        <div className="pd-editor">
          <div className="pd-tabs" role="tablist">
            {TABS.map((t, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === i}
                key={t.k}
                className={index === i ? 'on' : ''}
                onClick={() => pick(i)}
              >
                <t.icon size={12} strokeWidth={2} />{t.k}
              </button>
            ))}
            <span className="pd-tabs-r">emvive.com/docs</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab.k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: EASE }}
            >
              <Code code={tab.code} className="pd-code" typed />

              <div className="pd-res">
                <span className="pd-res-h">
                  <i className="pd-ok" />200 OK
                  <em>response</em>
                </span>
                <Code code={tab.res} numbers={false} className="pd-res-code" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---------------- the ladder ---------------- */}
      <div className="pd-ladder">
        <div className="pd-ladder-in">
          {LADDER.map((l, i) => (
            <React.Fragment key={l.k}>
              {i > 0 && (
                <span className="pd-ladder-w" aria-hidden="true">
                  <i />
                </span>
              )}
              <div className="pd-rung">
                <span className="pd-rung-ic"><l.icon size={16} strokeWidth={1.8} /></span>
                <b>{l.k}</b>
                <em>{l.d}</em>
              </div>
            </React.Fragment>
          ))}
        </div>
        <p className="pd-ladder-note">
          One capability, four altitudes. The engineer writes it once; the business
          reaches it at whichever level suits them.
        </p>
      </div>
    </section>
  );
};

export { Developers };
export default Integrations;
