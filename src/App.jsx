import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import HeroShowcase from './pages/HeroShowcase';
import RetailInventory from './pages/RetailInventory';
import './index.css';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
