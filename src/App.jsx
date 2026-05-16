import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import BuyerSignup from './pages/BuyerSignup';
import ManufacturerSignup from './pages/ManufacturerSignup';
import BuyerDashboard from './pages/buyerDash';
import ManufacturerDashboard from './pages/ManufacturerDashboard'; // <-- Yahan Import Karein
import Login from './pages/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup/buyer" element={<BuyerSignup />} />
        <Route path="/signup/factory" element={<ManufacturerSignup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        {/* 👇 Yeh naya route add karein 👇 */}
        <Route path="/dashboard/manufacturer" element={<ManufacturerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;