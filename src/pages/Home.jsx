import React from 'react';
import AgenticHero from '../components/AgenticHero';
import Products from '../components/Products';
import WhyEmvive from '../components/WhyEmvive';
import Features from '../components/Features';
import AppBuilder from '../components/AppBuilder';
import GlobeSection from '../components/GlobeSection';
import Clients from '../components/Clients';
import CTA from '../components/CTA';
import CustomerStory from '../components/CustomerStory';
import Resources from '../components/Resources';
import Announcement from '../components/Announcement';

const Home = () => {
  return (
    <>
      <AgenticHero />
      <Clients />
      <Products />
      <Features />
      {/* second pass of the same section, one accent colour per card —
          here so the client can compare both treatments side by side */}
      <Features variant="color" id="features-color" />
      <Announcement />
      <AppBuilder />
      <WhyEmvive />
      <GlobeSection />
      <GlobeSection variant="map" id="global-map" />
      <CustomerStory />
      <Resources />
      <CTA />
    </>
  );
};

export default Home;
