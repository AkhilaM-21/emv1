import React from 'react';
/* HashRouter, not BrowserRouter: the Render static site has no history
   fallback, so a direct hit on /home is answered by Render's own 404 before
   the app loads. Routing through the hash keeps every deep link working with
   no host config. Swap back to BrowserRouter once the Render rewrite rule
   (/*  ->  /index.html, action Rewrite) is in place. */
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import HeroShowcase from './pages/HeroShowcase';
import RetailInventory from './pages/RetailInventory';
import Finance from './pages/products/finance/Finance';
import SupplyChain from './pages/products/supply-chain/SupplyChain';
import Platform from './pages/products/platform/Platform';
import AdvancedReporting from './pages/AdvancedReporting';
import './index.css';

function Shell() {
  return (
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HeroShowcase />} />
            <Route path="/products/retail-inventory" element={<RetailInventory />} />
            <Route path="/products/finance" element={<Finance />} />
            <Route path="/products/supply-chain" element={<SupplyChain />} />
            <Route path="/products/platform" element={<Platform />} />
            <Route path="/products/advanced-reporting" element={<AdvancedReporting />} />
          </Routes>
        </main>

        <Footer />
      </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}

export default App;
