import React from 'react';
/* HashRouter, not BrowserRouter: the Render static site has no history
   fallback, so a direct hit on /home is answered by Render's own 404 before
   the app loads. Routing through the hash keeps every deep link working with
   no host config. Swap back to BrowserRouter once the Render rewrite rule
   (/*  ->  /index.html, action Rewrite) is in place. */
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import HeroShowcase from './pages/HeroShowcase';
import RetailInventory from './pages/RetailInventory';
import './index.css';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HeroShowcase />} />
            <Route path="/products/retail-inventory" element={<RetailInventory />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
