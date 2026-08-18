import {
  BookOpen, Layers, Zap, ShieldCheck, Clock, Activity, TrendingUp,
  HelpCircle, GitBranch, Lock, Workflow,
} from 'lucide-react';

/* =====================================================================
   FINANCE — page content that is not markup.

   The sections themselves live in FinanceHero.jsx (01) and
   FinanceStory.jsx (02–07). What is left here is the copy the shared
   blocks and the product bar are driven by: the FAQ, the contact form
   and the navigation, all of which follow the same eight-part
   information architecture as the page.
   ===================================================================== */

export const FINANCE_FAQ = [
  {
    q: 'Can we run Emvive Finance alongside our existing ERP?',
    a: 'Yes, and most groups do at first. Emvive reads your legacy ledger through a nightly or streaming connector and takes over entity by entity. Nothing forces a big-bang cutover.',
  },
  {
    q: 'How long does implementation actually take?',
    a: 'A single entity with a clean chart of accounts is typically live in six to eight weeks. A seven-entity group with intercompany and consolidation is usually a four to five month programme, with the first entity reporting from month two.',
  },
  {
    q: 'Is it compliant with ZATCA e-invoicing?',
    a: 'Yes — Phase 2 certified. Every invoice is signed, QR-stamped and cleared with the authority before it leaves, and the authority response is stored against the document for audit.',
    points: ['Phase 1 and Phase 2 clearance', 'Arabic and English invoice presentation', 'Authority response retained with the journal'],
  },
  {
    q: 'How do you handle multi-currency and IFRS?',
    a: 'Transaction, functional and presentation currency are held on every posting. Revaluation and translation run as scheduled processes, and statutory, management and IFRS views are produced from the same journals rather than maintained separately.',
  },
  {
    q: 'What happens to our audit?',
    a: 'Auditors get a scoped read-only login rather than an export. They can drill from any figure in the statements to the journal, the source document and the approval that released it, with user, timestamp and before/after values on every change.',
  },
  {
    q: 'Where does our data live?',
    a: 'Saudi Arabia, the UAE or India, pinned per workspace — including backups. Where shared infrastructure is ruled out entirely, Emvive is deployed into your own private cloud.',
  },
];

export const FINANCE_CONTACT = {
  eyebrow: '08 — Let’s talk',
  title: "Let's transform your",
  accent: 'finance operations.',
  lede:
    'Tell us where the month-end actually goes. Bring a recent trial balance to the call and we will show you how it posts, consolidates and reports on Emvive — with your own numbers, not a demo dataset.',
  cta: 'Talk to Finance Team',
  panel: {
    title: 'What to expect',
    note: 'A working session run by someone who has closed books, not a sales call.',
  },
  aside: [
    { icon: Clock, t: 'A working session, not a pitch', d: 'Ninety minutes with a finance architect who has closed books, not a slide deck.' },
    { icon: ShieldCheck, t: 'Your data stays yours', d: 'Sample data is used under NDA and destroyed after the session unless you ask otherwise.' },
    { icon: Activity, t: 'You leave with a close plan', d: 'A written view of which days come out of your close and what it would take.' },
  ],
  /* Four fields, two rows. Company size and the six challenge chips came
     out: a size band and a topic are things the call settles in its first
     sentence, and asking for them before anyone has spoken turned the
     form into a qualification exercise. Whatever they would have told us
     fits in the message box anyway. */
  fields: [
    { name: 'name', label: 'Name', required: true, placeholder: 'Rania Haddad', autoComplete: 'name' },
    { name: 'email', label: 'Work email', type: 'email', required: true, placeholder: 'you@company.com', autoComplete: 'email' },
    { name: 'company', label: 'Company', required: true, span: 2, placeholder: 'Horizon Holding', autoComplete: 'organization' },
    {
      name: 'message', label: 'Message', type: 'textarea', span: 2,
      placeholder: 'How many entities, which ERP you run today, and what the close looks like now.',
    },
  ],
};

/* ---------------------------------------------------------------
   Product navigation

   Same rule as Supply Chain and Platform: every section on the page
   has a row in one of the flyouts, in page order. The three flyouts
   are the three questions in sequence — what it is and does, how it
   runs, and whether it can be trusted and bought.
   --------------------------------------------------------------- */
export const FINANCE_NAV = {
  mark: { label: 'Finance', suffix: '& Controls' },
  menus: [
    {
      id: 'product', label: 'Product', icon: BookOpen, href: '#capabilities',
      blurb: 'What the product covers, and the five moves it puts a record through.',
      items: [
        { href: '#capabilities', icon: Layers, t: '02 · Product & capabilities', d: 'Eight modules writing to one ledger.' },
        { href: '#how', icon: Workflow, t: '03 · How it works', d: 'Capture, post, control, automate, close.' },
      ],
      feature: { t: 'From document to signed close', d: 'Five moves, and the real screen where each one happens.', href: '#how' },
    },
    {
      id: 'platform', label: 'Automation & integrations', icon: Zap, href: '#automation',
      blurb: 'What runs without a person, and what the ledger is wired to.',
      items: [
        { href: '#automation', icon: Zap, t: '04 · Automation', d: 'Rules that match, post and reconcile overnight.' },
        { href: '#integrations', icon: GitBranch, t: '05 · Integrations', d: 'Banks, ZATCA, BI, payroll and the legacy ERP.' },
      ],
      feature: { t: 'Touchless posting', d: '84% of journals posted with no human touch, each carrying its rule.', href: '#automation' },
    },
    {
      id: 'assurance', label: 'Assurance', icon: ShieldCheck, tone: 'ink', href: '#security',
      blurb: 'The controls, the evidence and what changes in the first year.',
      items: [
        { href: '#security', icon: Lock, t: '06 · Security & controls', d: 'Duty segregation, period locks, immutable trail.' },
        { href: '#impact', icon: TrendingUp, t: '07 · Why Emvive', d: 'Day nineteen to day three, and what it releases.' },
        { href: '#faq', icon: HelpCircle, t: '08 · FAQ', d: 'The six questions a controller raises.' },
      ],
      feature: { t: 'Cleared in under a second', d: 'ZATCA Phase 2 — signed, stamped and stored with the journal.', href: '#security' },
    },
  ],
  links: [],
  /* the bar rides the hero: transparent over it, fixed once past it */
  stickAfter: 'top',
  spy: ['top', 'capabilities', 'how', 'automation', 'integrations', 'security', 'impact', 'faq', 'start'],
  owner: {
    capabilities: 'product', how: 'product',
    automation: 'platform', integrations: 'platform',
    security: 'assurance', impact: 'assurance', faq: 'assurance',
  },
};
