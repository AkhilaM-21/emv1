import React from 'react';
import AgenticHero from '../components/AgenticHero';
import Products from '../components/Products';
import WhyEmvive from '../components/WhyEmvive';
import Features from '../components/Features';
import AppBuilder from '../components/AppBuilder';
import GlobeSection from '../components/GlobeSection';
import Clients from '../components/Clients';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <>
      <AgenticHero />
      <Clients />
      <Products />
      <WhyEmvive />
      <GlobeSection />
      <Features />
      <AppBuilder />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
