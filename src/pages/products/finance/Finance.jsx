import React from 'react';
import { ProductPage } from '../shared/system';
import {
  FinanceHeroBlade, Overview, Solutions, Products, Pricing,
  Platform,
} from './FinanceD365';
import CustomerStory from '../../../components/sections/CustomerStory';
import Resources from '../../../components/sections/Resources';
import CTA from '../../../components/sections/CTA';
import './FinanceApp.css';
import './Finance.css';

/* =====================================================================
   EMVIVE FINANCE

   Rebuilt to the section order and component shapes of the Dynamics 365
   Finance product page:

   Navigation is the anchor bar the hero renders beneath itself, as in
   the reference. The site's ProductNav is deliberately not mounted —
   two bars stacked was one more than the design has.

     01  Hero blade        FinanceHeroBlade  + anchor bar
     02  Overview          Overview          pill bar → accordion → shot
     03  Features          Features          six cards
     04  Pricing           Pricing           three plans
     05  Customer stories  CustomerStories   three-up
     06  Resources         Resources         three-up
     07  Platform          Platform          two statements
     08  CTA               CTA               home page cta

   Every section the reference's anchor bar lists is present, in its
   order. The one thing NOT carried over is a price: the plan cards say
   what each tier includes and send the number to a conversation,
   because inventing figures on a pricing page is worse than not
   showing one. The reference's News carousel is also absent — it is
   not in its own anchor list.

   The previous page's sections — How it works, Automation, Security,
   Why Emvive, FAQ — are no longer mounted here. FinanceStory.jsx still
   holds them, and still owns CAPS, which is the content this page
   reads from, so nothing has been deleted.
   ===================================================================== */

const Finance = () => (
  <ProductPage accent="#f0883e" accent2="#d6461a" wash="rgba(240, 136, 62, 0.09)" className="fn fd-page">
    <FinanceHeroBlade />
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

export default Finance;
