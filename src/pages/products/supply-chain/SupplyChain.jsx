import React from 'react';
import { ProductPage } from '../shared/system';
import {
  SupplyHeroBlade, Overview, Solutions, Products, Pricing,
  Platform,
} from './SupplyD365';
import CustomerStory from '../../../components/sections/CustomerStory';
import Resources from '../../../components/sections/Resources';
import CTA from '../../../components/sections/CTA';
import './SupplyApp.css';
import './SupplyChain.css';

/* =====================================================================
   EMVIVE SUPPLY CHAIN

   The same page Finance is — same sections, same order, same component
   shapes, same stylesheet, same colours. Only the headings and the
   content change.

   Navigation is the anchor bar the hero renders beneath itself, as on
   Finance. The site's ProductNav is deliberately not mounted — two bars
   stacked was one more than the design has.

     01  Hero blade        SupplyHeroBlade   + anchor bar
     02  Overview          Overview          three cards
     03  Solutions         Solutions         accordion + swapping shot
     04  Products          Products          tab rail + copy/media pair
     05  Pricing           Pricing           three plans
     06  Platform          Platform          two statements
     07  Customer stories  CustomerStory     shared site section
     08  Resources         Resources         shared site section
     09  CTA               CTA               home page cta

   The previous page's sections — capabilities, how it works,
   automation, security, why Emvive, FAQ — are no longer mounted here.
   SupplyStory.jsx and SupplySections.jsx still hold them, so nothing
   has been deleted.
   ===================================================================== */

const SupplyChain = () => (
  <ProductPage accent="#f0883e" accent2="#d6461a" wash="rgba(240, 136, 62, 0.09)" className="sn fd-page">
    <SupplyHeroBlade />
    <Overview />
    <Solutions />
    <Products />
    <Pricing />
    <Platform />
    <div id="stories"><CustomerStory /></div>
    <div id="resources"><Resources /></div>
    <CTA />
  </ProductPage>
);

export default SupplyChain;
