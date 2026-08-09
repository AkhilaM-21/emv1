import React from 'react';
import AgenticHero from '../components/hero/AgenticHero';
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
      <AgenticHero />
      <Products />
      <Features variant="color" />
      <Clients />
      {/* Hidden for now — the "Your Business Works Together" card with the
          procure-to-pay / order-to-cash flow. Component is untouched in
          components/sections/Announcement.jsx; drop <Announcement /> back
          here to restore it. */}
      <AppBuilder />
      <WhyEmvive />
      <GlobeSection variant="map" id="global-map" />
      <CustomerStory />
      <Resources />
      <CTA />
    </>
  );
};

export default Home;
