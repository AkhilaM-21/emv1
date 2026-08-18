import React from 'react';
import {
  Lightbulb, Blocks, Plug, Workflow, FlaskConical, Rocket, Check, ArrowRight,
  Puzzle, Clock, Unplug, Wrench, Layers, Database, PanelsTopLeft, ShieldCheck,
  GitBranch, RotateCcw, Globe, Gauge, Server, Users, Boxes, Timer, Activity,
  Code2, Building2, LayoutGrid, Sparkles, Zap, History, Webhook, HelpCircle, ChartPie,
} from 'lucide-react';
import { motion, Reveal, MaskText, EASE } from '../shared/motion';
import { Kicker, useAutoStep, AnimatePresence } from './PlatformKit';
import {
  SectionHead, FeatureGrid, AccordionShowcase, SplitFeature,
  FolderGrid, OfferingsCard, ImpactPanel,
} from '../shared/sections';
import './PlatformSections.css';

/* =====================================================================
   PLATFORM — the narrative sections. Namespace `pl-`.

   The page's spine is the sentence the product is:

     IDEA → BUILD → CONNECT → AUTOMATE → TEST → DEPLOY

   The overview section draws that spine once and the rest of the page
   fills it in: Studio is BUILD, data binding is CONNECT, Flow is
   AUTOMATE, the sandbox is TEST, and the deployment section is DEPLOY.
   ===================================================================== */

const SPINE = [
  {
    id: 'idea', k: 'Idea', icon: Lightbulb,
    t: 'Somebody in the business needs software.',
    d: 'A process that lives in a spreadsheet, an inbox and a filing cabinet. Written as a requirement, not a ticket in a two-year backlog.',
    meta: 'Day 0',
  },
  {
    id: 'build', k: 'Build', icon: Blocks,
    t: 'Studio turns it into real screens.',
    d: 'Data model, forms, tables, dashboards and permissions, assembled visually. What you place is what ships — there is no rebuild afterwards.',
    meta: 'Days 1–4',
  },
  {
    id: 'connect', k: 'Connect', icon: Plug,
    t: 'It binds to the records you already keep.',
    d: 'Objects from your ERP, your CRM and your legacy database, with row-level access inherited rather than re-granted.',
    meta: 'Day 4',
  },
  {
    id: 'automate', k: 'Automate', icon: Workflow,
    t: 'Flow puts the process behind the screen.',
    d: 'Triggers, conditions, human approvals, API calls and scheduled jobs on the same canvas as the application.',
    meta: 'Days 5–6',
  },
  {
    id: 'test', k: 'Test', icon: FlaskConical,
    t: 'It runs in a sandbox with real shapes of data.',
    d: 'Test runs replay against sample records, every step is traced, and nothing touches production until somebody signs it off.',
    meta: 'Day 7',
  },
  {
    id: 'deploy', k: 'Deploy', icon: Rocket,
    t: 'It ships, with a rollback that works.',
    d: 'Promotion through environments with approval, versioned releases, a URL, a mobile build and an API — from one definition.',
    meta: 'Day 8',
  },
];

/* ---------------------------------------------------------------
   03 · PLATFORM OVERVIEW
   --------------------------------------------------------------- */
export const PlatformOverview = () => {
  const { ref, index, pick, bind } = useAutoStep(SPINE.length, 3000, { hold: 4600 });
  const s = SPINE[index];

  return (
    <section className="pl-over" id="overview" ref={ref} {...bind}>
      <div className="pl-inner">
        <SectionHead
          label="Platform overview"
          title="One platform for building"
          accent="business applications."
          lede="Studio builds the application. Flow builds the process behind it. Both sit on the data your company already runs on, and both ship through the same governed pipeline — so what a department builds on a Friday afternoon is still something IT is happy to own on Monday."
        />

        {/* the spine */}
        <div className="pl-spine">
          <div className="pl-spine-track" aria-hidden="true">
            <motion.i
              animate={{ scaleX: index / (SPINE.length - 1) }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </div>

          {SPINE.map((st, i) => (
            <button
              type="button"
              key={st.id}
              className={`pl-stage ${index === i ? 'on' : ''} ${index > i ? 'past' : ''}`}
              onClick={() => pick(i)}
              aria-current={index === i ? 'step' : undefined}
            >
              <span className="pl-stage-ic">
                {index > i ? <Check size={14} strokeWidth={3} /> : <st.icon size={16} strokeWidth={1.8} />}
              </span>
              <b>{st.k}</b>
              <em>{st.meta}</em>
            </button>
          ))}
        </div>

        <div className="pl-over-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: EASE }}
            >
              <span className="pl-over-n">{String(index + 1).padStart(2, '0')} / 06 · {s.k}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </motion.div>
          </AnimatePresence>

          <div className="pl-over-facts">
            {[
              [PanelsTopLeft, 'Studio', 'Screens, data, permissions'],
              [Workflow, 'Flow', 'Triggers, approvals, actions'],
              [Database, 'One object model', 'Shared with Finance and Supply Chain'],
              [ShieldCheck, 'One governance model', 'Identity, audit, residency'],
            ].map(([Ic, t, d]) => (
              <div key={t}>
                <Ic size={14} strokeWidth={1.8} />
                <b>{t}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------
   04 · WHY BUSINESSES BUILD WITH EMVIVE
   --------------------------------------------------------------- */
const WHY = [
  {
    icon: Puzzle, k: 'Fragmented tools',
    old: 'A form builder, a workflow tool, a BI licence and three spreadsheets — none of which know about each other.',
    now: 'One workspace where the screen, the process and the data are the same object.',
    stat: '4 tools retired on average',
  },
  {
    icon: Clock, k: 'Custom development time',
    old: 'An agency quote in months, a backlog in quarters, and a spec that is stale before it is signed.',
    now: 'The team that owns the process builds it, in days, and changes it the afternoon the rule changes.',
    stat: '9 days, brief to first live user',
  },
  {
    icon: Unplug, k: 'Disconnected workflows',
    old: 'The app writes to its own database, and an integration project later tries to reconcile it with the ERP.',
    now: 'Applications bind directly to the ERP objects finance and operations are already posting to.',
    stat: '0 nightly reconciliation jobs',
  },
  {
    icon: Wrench, k: 'Difficult maintenance',
    old: 'The person who built it has left, the framework is two majors behind, and nobody will touch it.',
    now: 'No framework to age. Versioned workspaces, environment promotion, and an audit trail of every change.',
    stat: '1-click rollback',
  },
];

export const WhyBuild = () => (
  <section className="pl-why" id="why">
    <div className="pl-inner">
      <SectionHead
        label="Why businesses build with Emvive"
        title="Four reasons internal software"
        accent="never ships."
        lede="Every company has a list of applications it needs and cannot justify building. These are the four things that keep them on the list."
      />

      {/* the today/instead pair reads as one line of prose in the shared
          card, with the number it moves as the note under it */}
      <FeatureGrid
        cols={4}
        items={WHY.map((w) => ({
          icon: w.icon, k: w.k, t: w.old, d: w.now, note: w.stat,
        }))}
      />
    </div>
  </section>
);

/* ---------------------------------------------------------------
   14 · DEPLOYMENT & SCALABILITY
   --------------------------------------------------------------- */
const PIPELINE = [
  { k: 'Develop', d: 'Your own workspace. Break anything.', icon: Code2, gate: null },
  { k: 'Test', d: 'Shaped sample data, full trace on every run.', icon: FlaskConical, gate: 'Automated checks' },
  { k: 'Stage', d: 'Production configuration, production integrations.', icon: Layers, gate: 'Owner sign-off' },
  { k: 'Production', d: 'Versioned release, instant rollback.', icon: Rocket, gate: 'Change approval' },
];

export const Deployment = () => (
  <section className="pl-deploy" id="deployment">
    <div className="pl-inner">
      <SectionHead
        label="Deployment & scalability"
        title="Shipped on Friday."
        accent="Still supportable on Monday."
        lede="Nothing built here reaches production by being copied into it. Every application moves through the same four environments as the rest of your estate, with the same approvals and the same way back."
      />

      <div className="pl-pipe">
        {PIPELINE.map((p, i) => (
          <React.Fragment key={p.k}>
            {i > 0 && (
              <div className="pl-gate" aria-hidden="true">
                <span className="pl-gate-line"><i /></span>
                <span className="pl-gate-tag">{p.gate}</span>
              </div>
            )}
            <Reveal className="pl-env" delay={i * 0.08}>
              <span className="pl-env-ic"><p.icon size={16} strokeWidth={1.8} /></span>
              <b>{p.k}</b>
              <em>{p.d}</em>
            </Reveal>
          </React.Fragment>
        ))}
      </div>

      <FeatureGrid
        cols={3}
        items={[
          { icon: GitBranch, t: 'Versioned workspaces', d: 'Every change is a version with an author, a diff and a reason. Compare any two releases.' },
          { icon: RotateCcw, t: 'Rollback in one click', d: 'Promote forward or fall back to the previous release without touching the data underneath.' },
          { icon: Globe, t: 'Regional residency', d: 'Pin a workspace to Saudi Arabia, the UAE or India — including its backups.' },
          { icon: Gauge, t: 'Autoscaling', d: 'A portal that goes from forty users to four thousand does not need a project to survive it.' },
          { icon: Server, t: 'Private cloud', d: 'Deployed into your own tenancy where shared infrastructure is ruled out.' },
          { icon: Timer, t: 'Zero-downtime releases', d: 'Users on the application when you publish stay on it.' },
        ]}
      />

      <Reveal className="pl-scale" delay={0.1}>
        {[
          ['99.98%', 'platform availability, last 12 months'],
          ['180 ms', 'p95 response across regions'],
          ['1,240+', 'applications in production'],
          ['0', 'scheduled maintenance windows'],
        ].map(([v, l]) => (
          <div key={l}><b>{v}</b><span>{l}</span></div>
        ))}
      </Reveal>
    </div>
  </section>
);

/* =====================================================================
   THE FINANCE SECTIONS, WITH PLATFORM CONTENT

   These replace the page's own signature blocks — Studio, Flow, the
   integrations ring, the galleries, the developer and AI sections.
   Every one is now the same component Finance runs, fed this page's
   content. The old components remain in the repo; the page simply
   stops importing them, so restoring any is one line in Platform.jsx.
   ===================================================================== */

/* ---------------------------------------------------------------
   THE PRODUCT — the three capability groups and what is inside each.

   This is the product's own structure, not a narrative: App Builder,
   Workflow & Automation, Reporting & Analysis. The accordion and the
   folder grid below are both driven from it, so the two sections can
   never list different things.
   --------------------------------------------------------------- */
const CAPS = [
  {
    k: 'App Builder', icon: Blocks, c: '#6c4cf1',
    img: '/images/capture_step.jpg',
    body: 'The screens, the data behind them and the documents they produce, assembled visually. What you place is what ships — there is no rebuild between the prototype and the application.',
    points: [
      'Form builder — drag and drop',
      'Object builder — tables and relationships',
      'Document sequence designer',
      'Navigation designer',
      'Functions designer — code where you want it',
    ],
  },
  {
    k: 'Workflow & Automation', icon: Workflow, c: '#2563eb',
    img: '/images/automate_step.jpg',
    body: 'The process that sits behind the screen: what happens on submit, who has to approve it, what runs overnight and what calls out to the systems you already have.',
    points: [
      'Workflow',
      'Flow designer',
      'Approvals with delegation',
      'Scheduled workflows',
      'APIs and webhooks',
    ],
  },
  {
    k: 'Reporting & Analysis', icon: ChartPie, c: '#0d9488',
    img: '/images/post_step.jpg',
    body: 'Reports and dashboards built on the same objects the applications write to, so a figure on a board pack and a figure on a screen are the same record.',
    points: [
      'Report builder on live objects',
      'Dashboards with drill-down',
      'Scheduled distribution',
      'Export to spreadsheet and PDF',
      'Row-level access inherited',
    ],
  },
];

export const PlatformStages = () => (
  <section className="pl-why" id="stages">
    <div className="pl-inner">
      <SectionHead
        label="What it covers"
        title="Three things to build with."
        accent="One object model underneath."
        lede="The application, the process behind it and the reporting on top of it — all writing to the same objects, so what one of them knows, all of them know."
      />

      <AccordionShowcase items={CAPS} />
    </div>
  </section>
);

export const PlatformJourney = () => (
  <section className="pl-deploy" id="journey">
    <div className="pl-inner">
      <SectionHead
        label="How it works"
        title="Built by the team that owns it,"
        accent="governed like everything else."
        lede="The people who own the process build the application, and it still reaches production through the same environments, approvals and rollback as the rest of your estate."
      />

      <SplitFeature
        image="/images/control_step.jpg"
        alt="Applications built on Emvive Platform"
        title="Nine days, brief to live"
        body="One workspace where the screen, the process and the data are the same object."
        cols={2}
        items={[
          { icon: PanelsTopLeft, k: 'Studio', t: 'Screens, data and permissions, assembled visually', d: 'What you place is what ships. There is no rebuild between the prototype and the application.' },
          { icon: Workflow, k: 'Flow', t: 'Triggers, approvals and actions on one canvas', d: 'The process lives beside the screen it belongs to rather than in a separate automation tool.' },
          { icon: Database, k: 'One object model', t: 'Bound to the records you already keep', d: 'Applications read the ERP objects finance and operations are already posting to, with access inherited rather than re-granted.' },
          { icon: ShieldCheck, k: 'One governance model', t: 'Identity, audit and residency, once', d: 'The same controls cover everything built here, so IT reviews the platform rather than every application on it.' },
        ]}
      />
    </div>
  </section>
);

/* 02b — the folder grid, Finance's second capabilities section */
/* the same three groups as the accordion above, laid out as folders so
   everything inside each one is readable at once rather than one at a
   time — both read from CAPS */
export const PlatformModules = () => (
  <section className="pl-why" id="modules">
    <div className="pl-inner">
      <SectionHead
        label="Product & capabilities"
        title="Everything in the builder,"
        accent="on one page."
        lede="Nothing here is a separate tool with its own database. The builder, the workflow engine and the reporting all read and write the same objects."
      />

      <FolderGrid items={CAPS} />
    </div>
  </section>
);

/* 04 — the offerings card, Finance's automation section */
export const PlatformAutomation = () => (
  <section className="pl-why" id="automation">
    <div className="pl-inner">
      <SectionHead
        label="Automation"
        title="The routine work stops"
        accent="reaching a person."
        lede="Flow runs against live records on a schedule or on an event. What lands in somebody's queue is the exception — never the whole population."
      />

      <OfferingsCard
        title="Our Offerings"
        note="We help enterprises pursue a path of smart transformation"
        image="/images/automation_abstract.png"
        tabs={[
          {
            label: 'Process automation',
            items: ['Approval routing by value', 'Scheduled record jobs', 'Webhook triggers', 'Escalation on no response'],
          },
          {
            label: 'Integration & data',
            items: ['ERP object sync', 'API calls out and back', 'Bulk import validation', 'Event push on change'],
          },
        ]}
      />
    </div>
  </section>
);

/* 07 — the impact panel, Finance's "what changes in the first year" */
export const PlatformImpact = () => (
  <section className="pl-deploy" id="impact">
    <div className="pl-inner">
      <SectionHead
        label="Why Emvive · business impact"
        title="What changes in"
        accent="the first year."
        lede="One real group — thirty-eight thousand users, twelve hundred applications — twelve months after go-live. Measured from brief to first live user."
      />

      <ImpactPanel
        bars={{
          k: 'BRIEF TO FIRST LIVE USER',
          sub: 'Working days from requirement to production',
          scale: 120,
          unit: ' days',
          rows: [
            { k: 'Custom development', note: 'A quote in months and a backlog in quarters', v: 96, tone: 'was' },
            { k: 'With Emvive', note: 'Built by the team that owns the process', v: 9, tone: 'now' },
          ],
          claim: { v: '−87 days', label: 'off every application, not just the first' },
        }}
        figures={[
          { icon: Timer, value: '9', suffix: ' days', label: 'Brief to live' },
          { icon: Boxes, value: '1,240', suffix: '+', label: 'Applications shipped' },
          { icon: Users, value: '38,000', suffix: '', label: 'People using them' },
          { icon: Activity, value: '99.98', suffix: '%', label: 'Platform availability' },
        ]}
        photo="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=900"
        alt="A team building on Emvive Platform"
        quotes={[
          'The team that owns the process builds it, and changes it the afternoon the rule changes.',
          'Applications bind directly to the ERP objects finance and operations are already posting to — no nightly reconciliation.',
          'Versioned workspaces, environment promotion and an audit trail of every change, so IT reviews the platform rather than every app on it.',
        ]}
      />
    </div>
  </section>
);

/* ---------------------------------------------------------------
   Content for the shared blocks
   --------------------------------------------------------------- */
export const PLATFORM_TRUST = {
  label: 'Teams building on Emvive Platform',
  logos: ['GULF CEMENT', 'NEXA COMPONENTS', 'AL FAISAL TRADING', 'MERIDIAN LABELS', 'ORBIT TEXTILES', 'RIYADH LOGISTICS'],
  proofs: [
    { icon: Boxes, value: '1,240+', label: 'applications shipped by customer teams' },
    { icon: Users, value: '38,000', label: 'people using something built in Studio' },
    { icon: Activity, value: '412 runs/hr', label: 'through Flow at median 0.81s' },
    { icon: Building2, value: '9 days', label: 'median from brief to first live user' },
  ],
  note: 'Not one of these was built by us. Every application on this page was built by the team that owns the process.',
};

export const PLATFORM_FAQ = [
  {
    q: 'Do we need developers to build on Emvive?',
    a: 'No, and you are not locked out of code either. Studio and Flow are visual, and a business analyst can ship a working application on their own. Where you do want code, every object is an API and every flow can call a sandboxed function.',
  },
  {
    q: 'What happens to applications when the person who built them leaves?',
    a: 'They stay ordinary Studio and Flow definitions — versioned, documented and editable by anyone with rights. There is no framework to age out and no repository only one person understood.',
    points: ['Versioned workspaces with author and diff', 'No custom framework or build toolchain', 'Environment promotion with approval'],
  },
  {
    q: 'Can applications read our existing ERP or database?',
    a: 'Yes. Emvive objects, your Finance and Supply Chain data, and external systems over REST, GraphQL, SQL or webhooks. Row-level access is inherited from the roles the user already has, not re-granted per application.',
  },
  {
    q: 'How do you stop departments building a mess?',
    a: 'Governance is a platform property. Administrators control who may build, which objects they may bind to, what needs review before production, and what leaves the region — and every change is on the audit trail regardless.',
  },
  {
    q: 'Is there an AI app builder?',
    a: 'There is AI assistance inside Studio for generating a first draft of a data model or a form, but it is not what the platform is. Everything it produces is ordinary Studio work you open and edit by hand. We would rather show you the builder than the wrapper.',
  },
  {
    q: 'How is it licensed?',
    a: 'Studio and Flow ship with the platform rather than being priced per application, so the tenth app costs the same to build as the first. Pricing is by platform users and run volume, quoted before you build anything.',
  },
];

export const PLATFORM_CONTACT = {
  eyebrow: 'Talk to the platform team',
  title: "Let's build your next",
  accent: 'business application.',
  lede:
    'Pick the process your teams complain about most. In a two-hour session we will model it, build the screens, wire the workflow and hand you the URL — and you keep whatever we build, whether you go ahead or not.',
  cta: 'Talk to Platform Team',
  panel: {
    title: 'What to expect',
    note: 'A two-hour build session, not a slide about low-code.',
  },
  aside: [
    { icon: Blocks, t: 'You watch it get built', d: 'Not a slide about low-code. A screen share of your process becoming an application.' },
    { icon: ShieldCheck, t: 'Bring your security review', d: 'We will answer it line by line on the call rather than promising a document.' },
    { icon: Rocket, t: 'You keep the workspace', d: 'The sandbox stays yours with everything built in it, whatever you decide.' },
  ],
  /* Four fields, matching Finance and Supply Chain. The Studio/Flow chips
     and the second textarea came out — one open question is enough, and
     which product it turns out to be is the call's job to work out. */
  fields: [
    { name: 'name', label: 'Name', required: true, placeholder: 'Faisal Al-Mutairi', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    { name: 'company', label: 'Company', required: true, span: 2, placeholder: 'Gulf Cement', autoComplete: 'organization' },
    {
      name: 'build', label: 'What do you want to build?', type: 'textarea', span: 2,
      placeholder: 'e.g. a site inspection app for 40 engineers, replacing a spreadsheet and a WhatsApp group.',
    },
  ],
};

/* ---------------------------------------------------------------
   Product navigation
   --------------------------------------------------------------- */
/* Same rule as Finance and Supply Chain: every section on the page has a
   row in one of the flyouts, in page order — overview, then Studio, then
   Flow, then the enterprise group. Hero is the mark, contact is the CTA. */
export const PLATFORM_NAV = {
  mark: { label: 'Platform', suffix: '& Builder' },
  menus: [
    {
      id: 'intro', label: 'Overview', icon: Layers, href: '#overview',
      blurb: 'What the platform is and why teams build on it rather than around it.',
      items: [
        { href: '#trust', icon: Building2, t: 'Trusted by', d: 'The teams already shipping on it.' },
        { href: '#overview', icon: Boxes, t: 'Platform overview', d: 'Screens, data and workflow as one object.' },
        { href: '#why', icon: Lightbulb, t: 'Why build on Emvive', d: 'What the alternative actually costs.' },
      ],
      feature: { t: 'Five applications, one platform', d: 'Real apps shipped by customer teams — open them side by side.', href: '#apps' },
    },
    {
      id: 'studio', label: 'Studio', icon: Blocks, href: '#studio',
      blurb: 'The visual application builder — screens, data, permissions.',
      items: [
        { href: '#studio', icon: PanelsTopLeft, t: 'The canvas', d: 'Components, inspector, live data binding.' },
        { href: '#apps', icon: LayoutGrid, t: 'Applications built', d: 'Five real apps shipped by customer teams.' },
        { href: '#build', icon: Boxes, t: 'Build anything', d: 'Nine departments, nine working applications.' },
        { href: '#templates', icon: Sparkles, t: 'Template library', d: 'CRM, HRMS, helpdesk, expenses and more.' },
      ],
      feature: { t: 'Template library', d: 'CRM, HRMS, helpdesk and expenses — fork one and change it.', href: '#templates' },
    },
    {
      id: 'flow', label: 'Flow', icon: Workflow, tone: 'run', href: '#flow',
      blurb: 'The workflow and automation builder — triggers to actions.',
      items: [
        { href: '#flow', icon: Workflow, t: 'Workflow canvas', d: 'Triggers, conditions, human steps, API calls.' },
        { href: '#run', icon: Zap, t: 'Live execution', d: 'One run, step by step, with payloads and retries.' },
        { href: '#bridge', icon: History, t: 'Studio × Flow', d: 'How a screen and a process become one object.' },
        { href: '#integrations', icon: Webhook, t: 'Integrations', d: 'ERP, CRM, email, WhatsApp, APIs, databases.' },
      ],
      feature: { t: '412 runs an hour, 0.81s median', d: 'Every run signed, timed and replayable.', href: '#run' },
    },
    {
      id: 'enterprise', label: 'Enterprise', icon: ShieldCheck, tone: 'ink', href: '#developers',
      blurb: 'What IT asks about: code, controls, where it runs, and who has done it.',
      items: [
        { href: '#developers', icon: Code2, t: 'Developers', d: 'Code where you want it, not everywhere.' },
        { href: '#enterprise', icon: ShieldCheck, t: 'Enterprise controls', d: 'SSO, roles, audit trail, environments.' },
        { href: '#deployment', icon: Server, t: 'Deployment', d: 'Cloud, private cloud or your own metal.' },
        { href: '#story', icon: Users, t: 'Customer story', d: 'From a spreadsheet to a shipped application.' },
        { href: '#faq', icon: HelpCircle, t: 'FAQ', d: 'The six questions IT raises in meeting two.' },
      ],
      feature: { t: 'Runs where you need it', d: 'Cloud, private cloud or your own infrastructure — same build.', href: '#deployment' },
    },
  ],
  links: [],
  watch: { href: '#apps', label: 'See it built' },
  cta: { href: '#start', label: 'Build with Emvive' },
  spy: [
    'top', 'trust', 'overview', 'why', 'studio', 'apps', 'flow', 'run', 'bridge',
    'build', 'integrations', 'developers', 'templates', 'enterprise', 'deployment',
    'story', 'faq', 'start',
  ],
  owner: {
    trust: 'intro', overview: 'intro', why: 'intro',
    studio: 'studio', apps: 'studio', build: 'studio', templates: 'studio',
    flow: 'flow', run: 'flow', bridge: 'flow', integrations: 'flow',
    developers: 'enterprise', enterprise: 'enterprise', deployment: 'enterprise',
    story: 'enterprise', faq: 'enterprise',
  },
};
