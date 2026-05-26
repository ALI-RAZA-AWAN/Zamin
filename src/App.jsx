import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BuyerSignup from './pages/BuyerSignup';
import ManufacturerSignup from './pages/ManufacturerSignup';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import FactoryDetailsPage from './pages/FactoryDetailsPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-buyer" element={<BuyerSignup />} />
        <Route path="/signup-manufacturer" element={<ManufacturerSignup />} />
        <Route path="/dashboard-manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/dashboard-buyer" element={<BuyerDashboard />} />
        <Route path="/factory/:id" element={<FactoryDetailsPage />} />
        
        {/* Agar koi ajeeb URL likhe toh backup redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}

export default App;