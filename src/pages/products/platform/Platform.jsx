import React, { Suspense, lazy } from 'react';
import { ProductPage, Footer } from '../shared/system';
import { TrustBand, Faq, ContactSection } from '../shared/blocks';
import ProductNav from '../shared/nav';
import PlatformHero from './PlatformHero';
import {
  PlatformOverview, WhyBuild, Deployment,
  PLATFORM_TRUST, PLATFORM_FAQ, PLATFORM_CONTACT, PLATFORM_NAV,
} from './PlatformSections';
import './Platform.css';

/* =====================================================================
   EMVIVE PLATFORM & BUILDER

   The story this page tells, in order:

     IDEA → BUILD → CONNECT → AUTOMATE → TEST → DEPLOY

   The locked information architecture:

     01 Hero                             PlatformHero
     02 Trusted by / enterprise trust    TrustBand
     03 Platform overview                PlatformOverview   (draws the spine)
     04 Why businesses build with us     WhyBuild
     05 Build with Studio                Studio             (the canvas)
     06 Studio product showcase          Showcase
     07 Build workflows with Flow        Flow               (the editor)
     08 Flow product showcase            Run                (live execution)
     09 Studio + Flow together           Bridge
     10 Build anything                   Gallery
     11 Integrations & APIs              Integrations + Developers
     12 Templates / app marketplace      Templates
     13 Enterprise security & governance Enterprise
     14 Deployment & scalability         Deployment
     15 Customer success                 Transformation
     16 FAQ                              Faq
     17 Contact / demo form              ContactSection
     18 Footer

   Deliberately NOT on this page: a generic AI section. Emvive AI is
   mentioned once, honestly, in the FAQ.

   Parked, not deleted — both are one line away if wanted back:
     · PlatformIdea    the idea → app build line, would slot at 04/05
     · Walkthrough     the chaptered product player (PlatformProof)
     · PlatformAI      the AI builder transcript
   ===================================================================== */

const Studio = lazy(() => import('./PlatformStudio'));
const Showcase = lazy(() => import('./PlatformStudio').then((m) => ({ default: m.StudioShowcase })));
const Flow = lazy(() => import('./PlatformFlow'));
const Run = lazy(() => import('./PlatformFlow').then((m) => ({ default: m.FlowRun })));
const Bridge = lazy(() => import('./PlatformFlow').then((m) => ({ default: m.Bridge })));
const Gallery = lazy(() => import('./PlatformLibrary'));
const Templates = lazy(() => import('./PlatformLibrary').then((m) => ({ default: m.Templates })));
const Integrations = lazy(() => import('./PlatformEco'));
const Developers = lazy(() => import('./PlatformEco').then((m) => ({ default: m.Developers })));
const Transformation = lazy(() => import('./PlatformProof').then((m) => ({ default: m.Transformation })));
const Enterprise = lazy(() => import('./PlatformProof').then((m) => ({ default: m.Enterprise })));

/* A reserved block in the tone of the section that is arriving, so a
   chunk landing never shifts the page under someone mid-scroll. */
const Hold = ({ tone = 'paper', h = '46rem' }) => (
  <div className={`pb-hold ${tone}`} style={{ height: h }} aria-hidden="true" />
);

const Platform = () => (
  <ProductPage accent="#6c4cf1" accent2="#a78bfa" wash="rgba(108,76,241,0.12)" className="pb">
    <ProductNav {...PLATFORM_NAV} />

    <PlatformHero />
    <TrustBand {...PLATFORM_TRUST} />
    <PlatformOverview />
    <WhyBuild />

    <Suspense fallback={<Hold tone="night" h="100vh" />}>
      <Studio />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="100vh" />}>
      <Showcase />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="52rem" />}>
      <Flow />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="100vh" />}>
      <Run />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="42rem" />}>
      <Bridge />
    </Suspense>

    <Suspense fallback={<Hold tone="paper-2" h="52rem" />}>
      <Gallery />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="52rem" />}>
      <Integrations />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="52rem" />}>
      <Developers />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="52rem" />}>
      <Templates />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="56rem" />}>
      <Enterprise />
    </Suspense>

    <Deployment />

    <Suspense fallback={<Hold tone="paper-2" h="60rem" />}>
      <Transformation />
    </Suspense>

    <Faq
      eyebrow="Questions before you build"
      title="What IT asks in the second meeting."
      lede="The six questions that decide whether a platform gets adopted or quietly avoided."
      items={PLATFORM_FAQ}
      aside={(
        <>Security review to run? Send it with the form below and we will answer it
        line by line rather than posting you a whitepaper.</>
      )}
    />

    <ContactSection {...PLATFORM_CONTACT} />

    <Footer />
  </ProductPage>
);

export default Platform;
