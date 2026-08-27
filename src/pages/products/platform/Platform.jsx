import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProductPage } from '../shared/system';
import PlatformAuto from './PlatformAuto';
import CustomerStory from '../../../components/sections/CustomerStory';
import Resources from '../../../components/sections/Resources';
import CTA from '../../../components/sections/CTA';

/* =====================================================================
   EMVIVE PLATFORM

   The whole page is PlatformAuto.jsx — see its header for the section
   order and for what each section was built against.

   The closing beats are the site's shared sections, the same three
   Supply Chain ends on and in the same order: customer stories,
   resources, then the one CTA. The page's own "Ask more of your
   business system" block is gone — it was a second CTA sitting
   immediately above the real one.

   DEEP LINKING. The header sends a section id in navigation state when
   you pick a platform entry out of the menu — "App Builder" means the
   Build section, "Approvals" means Automate. ProductPage has always
   accepted that id and scrolled to it, but nothing was reading the
   state into the prop, so every entry landed at the top of the page.
   `useLocation` closes that gap here.

   The previous page's sections (capabilities, how it works,
   automation, security, why Emvive, FAQ) are no longer mounted.
   PlatformStory.jsx and PlatformSections.jsx still hold them, so
   nothing has been deleted.
   ===================================================================== */

const Platform = () => {
  const { state } = useLocation();

  return (
    <ProductPage
      accent="#e2601f"
      accent2="#d6461a"
      wash="rgba(226,96,31,0.09)"
      className="pb"
      section={state?.section}
    >
      <PlatformAuto />
      <div id="stories"><CustomerStory /></div>
      <div id="resources"><Resources /></div>
      <CTA />
    </ProductPage>
  );
};

export default Platform;
