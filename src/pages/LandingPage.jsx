import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Mobile Hamburger Navbar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased selection:bg-[#cea975]/30 flex flex-col">
      
      {/* 1. DYNAMIC RESPONSIVE NAVIGATION */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#fcfbfa]/80 border-b border-[#ece9e2] px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Interface */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-[#1e252b] no-underline">
              ZAMIN<span className="text-[#cea975]">.</span>
            </Link>
            <span className="text-[9px] uppercase tracking-widest bg-[#1e252b] text-[#fcfbfa] px-1.5 py-0.5 rounded font-bold">
              B2B
            </span>
          </div>
          
          {/* Desktop Navigation Links (Hidden on small mobile screens, displays on md screens) */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-[#5a656d] hover:text-[#cea975] transition-colors no-underline">
              About
            </Link>
            <Link to="/dashboard/buyer" className="text-sm font-medium text-[#5a656d] hover:text-[#cea975] transition-colors no-underline">
              Explore
            </Link>
            <Link to="/login" className="text-sm font-semibold text-[#1e252b] hover:text-[#cea975] transition-colors no-underline">
              Sign In
            </Link>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1e252b] text-xl font-bold focus:outline-none p-1"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel Drawer (Stops links from dropping onto layout blocks awkwardly) */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#fcfbfa] border-b border-[#ece9e2] shadow-lg py-4 px-6 flex flex-col gap-3 md:hidden z-50 animate-fade-in">
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-[#1e252b] no-underline py-1 hover:text-[#cea975]"
            >
              About
            </Link>
            <Link 
              to="/dashboard/buyer" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-[#1e252b] no-underline py-1 hover:text-[#cea975]"
            >
              Explore
            </Link>
            <hr className="border-[#ece9e2] my-1" />
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-bold text-[#cea975] no-underline py-1 hover:text-[#1e252b]"
            >
              Sign In / Login
            </Link>
          </div>
        )}
      </nav>

      {/* 2. MODERN HERO SECTION */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f5f2eb] to-[#fcfbfa] pt-12 pb-8 px-4 md:pt-20 md:pb-12 md:px-8">
        {/* Decorative structural glow */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#cea975]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1e252b] mb-4 md:mb-6 leading-tight">
            Pakistan's Digital Gateway For <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cea975] to-[#a48150]">
              Bulk Industrial Sourcing
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#5a656d] mb-8 font-light leading-relaxed">
            Direct high-capacity matching between verified domestic manufacturing mills and corporate retail brands. Skip the middle agents. Pure wholesale execution.
          </p>

          {/* TWO ACTOR TERMINAL ROUTING CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left px-2 mb-10">
            
            {/* Actor A: Buyer Side */}
            <div className="bg-white p-5 rounded-2xl border border-[#ece9e2] shadow-sm hover:border-[#cea975]/50 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[9px] bg-[#cea975]/20 text-[#a48150] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Brands & Retailers</span>
                <h3 className="text-base font-bold text-[#1e252b] mt-1.5">I am a Buyer</h3>
                <p className="text-xs text-[#7a858d] mt-1 leading-relaxed">
                  Explore verified installations, check bulk MOQs, track production outputs, and build your shortlist.
                </p>
              </div>
              <Link to="/signup/buyer" className="w-full bg-[#1e252b] hover:bg-[#cea975] text-white text-xs font-bold py-2.5 rounded-xl transition-all mt-4 text-center no-underline block">
                Access Buyer Terminal →
              </Link>
            </div>

            {/* Actor B: Factory Side */}
            <div className="bg-white p-5 rounded-2xl border border-[#ece9e2] shadow-sm hover:border-[#1e252b]/30 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[9px] bg-[#1e252b]/10 text-[#1e252b] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Factory Installations</span>
                <h3 className="text-base font-bold text-[#1e252b] mt-1.5">I am a Factory Owner</h3>
                <p className="text-xs text-[#7a858d] mt-1 leading-relaxed">
                  List floor metrics, showcase automated machinery, accept direct quotes, and secure manufacturing contracts.
                </p>
              </div>
              <Link to="/signup/factory" className="w-full bg-white hover:bg-gray-50 text-[#1e252b] border border-[#dcd9d0] text-xs font-bold py-2.5 rounded-xl transition-all mt-4 text-center no-underline block">
                Register Factory Terminal →
              </Link>
            </div>

          </div>

          {/* EXACT PRODUCT CATEGORY LABELS */}
          <div className="flex gap-5 justify-center text-xs font-medium text-[#7a858d] tracking-wider uppercase">
            <span>• T-shirts</span>
            <span>• Polo-shirts</span>
            <span>• Hoodies</span>
          </div>
        </div>
      </header>

      {/* 3. WIDESCREEN INDUSTRIAL VIDEO CONTAINER (Points directly to public folder root) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24 w-full">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-[#ece9e2] bg-[#1e252b] aspect-video max-h-[480px] w-full mx-auto">
          <video 
            className="w-full h-full object-cover opacity-75"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/landing.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Glass Text Overlay overlaying the playing video stream */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-xs backdrop-blur-md bg-[#1e252b]/70 border border-white/10 p-4 rounded-xl text-white">
            <span className="text-[9px] bg-[#cea975] text-[#1e252b] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Floor Verification</span>
            <h3 className="text-sm font-bold mt-1">Automated Processing Lines</h3>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed hidden sm:block">
              Providing full operational transparency between industrial mills and client sourcing dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INDUSTRIAL PIPELINE INFRASTRUCTURE LOGS */}
      <section className="py-8 px-4 md:py-16 md:px-8 max-w-7xl mx-auto border-t border-[#ece9e2] w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border border-[#ece9e2]">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#f5f2eb] text-[#cea975] flex items-center justify-center font-bold text-xs">01</div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-[#1e252b]">Verified Capacities</h3>
              <p className="text-xs text-[#5a656d] mt-1 leading-relaxed">Factories transparently outline accurate daily output thresholds to completely bypass production bottlenecks.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border border-[#ece9e2]">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#f5f2eb] text-[#cea975] flex items-center justify-center font-bold text-xs">02</div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-[#1e252b]">Direct B2B Pricing</h3>
              <p className="text-xs text-[#5a656d] mt-1 leading-relaxed">No intermediary markups. Bulk volume estimates process clearly through raw data communication grids.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border border-[#ece9e2]">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#f5f2eb] text-[#cea975] flex items-center justify-center font-bold text-xs">03</div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-[#1e252b]">Secure Infrastructure</h3>
              <p className="text-xs text-[#5a656d] mt-1 leading-relaxed">Isolated portals protect active contract parameters, transaction values, and profile specifications securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#1e252b] text-[#9a9fa3] py-10 px-4 md:px-8 border-t border-black mt-auto w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono">
          <div className="text-center sm:text-left">
            <span className="text-white font-bold text-xs font-sans tracking-tight">ZAMIN B2B INFRASTRUCTURE</span>
            <p className="mt-1 text-[#9a9fa3]">
              &copy; {new Date().getFullYear()} Zamin Platform. Direct wholesale sourcing made simple for the garment industry.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-[#cea975]">PORT_STATUS: SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;