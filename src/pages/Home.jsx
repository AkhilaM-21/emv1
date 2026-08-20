import React from 'react';
/* Hero is the infosys-style film with the copy over it. The previous
   hero is untouched in components/hero/AgenticHero.jsx — import it and
   swap the tag below to put it back. */
import HeroInfosys from '../components/hero/variants/HeroInfosys';
import Products from '../components/sections/Products';
import WhyEmvive from '../components/sections/WhyEmvive';
import Features from '../components/sections/Features';
import AppBuilder from '../components/sections/AppBuilder';
import GlobeSection from '../components/sections/GlobeSection';
import Clients from '../components/sections/Clients';
import CTA from '../components/sections/CTA';
import CustomerStory from '../components/sections/CustomerStory';
import Resources from '../components/sections/Resources';

const Home = () => {
  return (
    <>
      <HeroInfosys video="/images/network.mp4" />
      <Products />
      <Features variant="color" />
      {/* Hidden for now — the "Your Business Works Together" card with the
          procure-to-pay / order-to-cash flow. Component is untouched in
          components/sections/Announcement.jsx; drop <Announcement /> back
          here to restore it. */}
      <AppBuilder />
      <WhyEmvive />
      <GlobeSection variant="map" id="global-map" />
      {/* "Meet the platform" leads straight into the stories it points at —
          its own CTA is "View all customer stories". */}
      <Clients />
      <CustomerStory />
      <Resources />
      <CTA />
    </>
  );
};

export default Home;
