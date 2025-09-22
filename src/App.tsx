import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CaesarPage } from './pages/CaesarPage';
import { TranspositionPage } from './pages/TranspositionPage';
import { VigenerePage } from './pages/VigenerePage';
import { SteganographyPage } from './pages/SteganographyPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/caesar" element={<CaesarPage />} />
          <Route path="/transposition" element={<TranspositionPage />} />
          <Route path="/vigenere" element={<VigenerePage />} />
          <Route path="/steganography" element={<SteganographyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;