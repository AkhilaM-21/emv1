import React, { Suspense, lazy } from 'react';
import { ProductPage, Footer } from './system';
import PlatformNav from './PlatformNav';
import PlatformHero from './PlatformHero';
import PlatformIdea from './PlatformIdea';
import './Platform.css';

/* =====================================================================
   EMVIVE PLATFORM & BUILDER

   Fourteen movements, and no two of them share a layout. The page
   alternates between paper and night on purpose: the light bands are
   where you are being told something, the dark bands are where you are
   inside the product.

     hero          paper   a builder assembling itself
     idea → app    paper   a build line producing seven artifacts
     studio        night   floating panels around an artboard
     showcase      paper   five finished apps on a horizontal rail
     flow          night   a workflow editor, left to right
     execution     night   one run as a vertical trace, scroll-driven
     bridge        paper   a submission travelling app → data → action
     ai            night   a transcript and the app it produces
     build         paper   nine departments, nine applications
     templates     night   the marketplace as a product screen
     integrations  paper   a live system map
     developers    night   request and response
     walkthrough   paper   a chaptered player
     transformation paper  four scattered systems converging into one
     enterprise    night   the architecture stack
     start         ink     three ways in

   Everything below the fold is code-split. The hero carries the fold on
   its own; the rest arrives while the reader is still on it.
   ===================================================================== */

const Studio = lazy(() => import('./PlatformStudio'));
const Showcase = lazy(() => import('./PlatformStudio').then((m) => ({ default: m.StudioShowcase })));
const Flow = lazy(() => import('./PlatformFlow'));
const Run = lazy(() => import('./PlatformFlow').then((m) => ({ default: m.FlowRun })));
const Bridge = lazy(() => import('./PlatformFlow').then((m) => ({ default: m.Bridge })));
const AI = lazy(() => import('./PlatformAI'));
const Gallery = lazy(() => import('./PlatformLibrary'));
const Templates = lazy(() => import('./PlatformLibrary').then((m) => ({ default: m.Templates })));
const Integrations = lazy(() => import('./PlatformEco'));
const Developers = lazy(() => import('./PlatformEco').then((m) => ({ default: m.Developers })));
const Walkthrough = lazy(() => import('./PlatformProof'));
const Transformation = lazy(() => import('./PlatformProof').then((m) => ({ default: m.Transformation })));
const Enterprise = lazy(() => import('./PlatformProof').then((m) => ({ default: m.Enterprise })));
const Start = lazy(() => import('./PlatformProof').then((m) => ({ default: m.Start })));

/* A reserved block in the tone of the section that is arriving, so a
   chunk landing never shifts the page under someone mid-scroll. */
const Hold = ({ tone = 'paper', h = '46rem' }) => (
  <div className={`pb-hold ${tone}`} style={{ height: h }} aria-hidden="true" />
);

const Platform = () => (
  <ProductPage accent="#6c4cf1" accent2="#a78bfa" wash="rgba(108,76,241,0.12)" className="pb">
    <PlatformNav />

    <PlatformHero />
    <PlatformIdea />

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

    <Suspense fallback={<Hold tone="night" h="54rem" />}>
      <AI />
    </Suspense>

    <Suspense fallback={<Hold tone="paper-2" h="52rem" />}>
      <Gallery />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="52rem" />}>
      <Templates />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="52rem" />}>
      <Integrations />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="52rem" />}>
      <Developers />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="52rem" />}>
      <Walkthrough />
    </Suspense>

    <Suspense fallback={<Hold tone="paper-2" h="60rem" />}>
      <Transformation />
    </Suspense>

    <Suspense fallback={<Hold tone="night" h="56rem" />}>
      <Enterprise />
    </Suspense>

    <Suspense fallback={<Hold tone="paper" h="34rem" />}>
      <Start />
    </Suspense>

    <Footer />
  </ProductPage>
);

export default Platform;
