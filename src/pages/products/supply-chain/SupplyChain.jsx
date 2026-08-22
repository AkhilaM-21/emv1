import React from 'react';
import { ProductPage, Footer } from '../shared/system';
import ProductNav from '../shared/nav';
import { Faq, ContactSection } from '../shared/blocks';
import { SUPPLY_FAQ, SUPPLY_CONTACT, SUPPLY_NAV } from './SupplySections';
import {
  CapabilitiesGrid, Capabilities, HowItWorks, Automation, Integrations, Security, WhyEmvive,
  WhyEmviveWide,
} from './SupplyStory';
import SupplyHero from './SupplyHero';
import './SupplyApp.css';
import './SupplyChain.css';

/* =====================================================================
   EMVIVE FINANCE

   The page is eight sections and nothing else. Each one answers a
   single question, in the order a buyer actually asks it — and if a
   block does not answer the question at the top of its section, the
   block does not belong on the page.

     01  Hero                     what is it?                SupplyHero
         (the product bar follows the hero rather than preceding it)
     02  Product & capabilities   what can it do?            Capabilities
     03  How it works             how does it work?          HowItWorks
     04  Automation               what can it automate?      Automation
     05  Integrations             does it connect?           Integrations
     06  Security & controls      can we trust it?           Security
     07  Why Emvive               why should we choose it?   WhyEmvive
     08  FAQ + contact            let's talk.                Faq + Contact

   02 to 07 live in SupplyStory.jsx; 08 is the shared Faq/Contact pair
   every product page uses. No AI section on this page, by design.
   ===================================================================== */

const SupplyChain = () => (
  <ProductPage accent="#0891b2" accent2="#0e7490" wash="rgba(8,145,178,0.09)" className="sn">
    <SupplyHero />

    {/* the bar sits below the hero, not above it — it is `position: sticky`,
        so it rides down with the page and pins under the site header once
        the hero has scrolled past */}
    <ProductNav {...SUPPLY_NAV} />

    <Capabilities />
    <CapabilitiesGrid />
    <HowItWorks />
    <Automation />
    {/* <Integrations /> */}
    <Security />
    <WhyEmvive />
    {/* 07b — the same section as one long card, no photo, no quotes */}
    <WhyEmviveWide />

    <Faq
      eyebrow="08 — FAQ"
      title="Before you put"
      accent="your ledger on it."
      lede="The six things every controller and CFO raises in the first call, answered plainly."
      items={SUPPLY_FAQ}
      aside={(
        <>Something not answered here? Ask it in the form below — it goes to the same
        people who would run your implementation.</>
      )}
    />

    <ContactSection {...SUPPLY_CONTACT} variant="card" />

    <Footer />
  </ProductPage>
);

export default SupplyChain;
