import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased selection:bg-[#cea975]/30">
      
      {/* About page ka navbar main app pages tak access deta hai. */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#fcfbfa]/80 border-b border-[#ece9e2] px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-[#1e252b] no-underline">
              ZAMIN<span className="text-[#cea975]">.</span>
            </Link>
            <span className="text-[9px] uppercase tracking-widest bg-[#1e252b] text-[#fcfbfa] px-1.5 py-0.5 rounded font-bold">
              B2B Hub
            </span>
          </div>
          
          {/* Desktop links large screen par directly visible rehte hain. */}
          <div className="hidden md:flex items-center gap-4 md:gap-6">
            <Link to="/" className="text-xs md:text-sm font-medium text-[#5a656d] hover:text-[#cea975] transition-colors no-underline">
              Home
            </Link>
            <Link to="/dashboard/buyer" className="text-xs md:text-sm font-medium text-[#5a656d] hover:text-[#cea975] transition-colors no-underline">
              Explore
            </Link>
            <Link to="/login" className="text-xs md:text-sm font-semibold text-[#1e252b] hover:text-[#cea975] transition-colors no-underline">
              Sign In
            </Link>
          </div>

          {/* Mobile button menu ko open/close karta hai. */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1e252b] text-xl font-bold focus:outline-none"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown small screen par links ko clean rakhta hai. */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#fcfbfa] border-b border-[#ece9e2] shadow-md py-4 px-6 flex flex-col gap-3 md:hidden">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[#1e252b] no-underline py-1">
              Home
            </Link>
            <Link to="/dashboard/buyer" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-[#1e252b] no-underline py-1">
              Explore
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-[#cea975] no-underline py-1">
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* Hero section platform mission ko introduce karta hai. */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f5f2eb] to-[#fcfbfa] pt-16 pb-12 px-4 md:pt-24 md:pb-16 md:px-8">
        <div className="absolute top-10 left-1/3 w-72 h-72 bg-[#cea975]/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[10px] bg-[#cea975]/20 text-[#a48150] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Corporate Mandate
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1e252b] mt-4 mb-6 leading-tight">
            Our Sourcing Mission
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#5a656d] font-light leading-relaxed">
            Modernizing the bulk garment supply chain across Pakistan by connecting industrial brands directly with high-capacity manufacturers through programmatic transparency and absolute operational integrity.
          </p>
        </div>
      </header>

      {/* Ye section explain karta hai ke Zamin sourcing problem kaise solve karta hai. */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 border-t border-[#ece9e2]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Video frame industry context visually show karta hai. */}
          <div className="flex-1 max-w-[550px] w-full mx-auto lg:mx-0">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#ece9e2] bg-[#1e252b] aspect-[4/3] w-full">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-85"
              >
                <source src="/about.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-[#1e252b]/70 border border-white/10 p-4 rounded-xl text-white">
                <span className="text-[9px] text-[#cea975] font-bold uppercase tracking-widest">Industry Standard</span>
                <p className="text-[11px] text-gray-300 mt-0.5 leading-normal">On-site verification logs across spinning clusters.</p>
              </div>
            </div>
          </div>
          
          {/* Text area project ki value proposition detail me batata hai. */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-[#cea975] font-bold mb-1">Operational Breakthrough</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1e252b] tracking-tight">Why Zamin?</h3>
            </div>
            
            <p className="text-sm md:text-base text-[#5a656d] font-light leading-relaxed">
              We realized that matching with a reliable tier-1 manufacturing installation was structural friction for growing enterprise brands. Fragmented agent loops and opaque brokerage setups led to missed deadlines, over-allocated capacities, and hidden costs.
            </p>
            
            <p className="text-sm md:text-base text-[#5a656d] font-light leading-relaxed">
              <strong className="text-[#1e252b] font-semibold">Zamin</strong> bypasses secondary loops completely by introducing a direct high-capacity data terminal. We empower factory owners to display real-time floor metrics and help global merchants secure bulk volume commitments directly—from high-density knitting nodes to specialized denim wash basins.
            </p>
          </div>

        </div>
      </section>

      {/* Mission cards project ke core benefits ko break down karte hain. */}
      <section className="bg-[#f5f3ee]/50 border-t border-b border-[#ece9e2] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pehla card direct sourcing ko explain karta hai. */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ece9e2] shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-mono text-[#cea975] font-bold tracking-widest">01 / DISCOVERY</span>
              <h3 className="text-base font-bold text-[#1e252b] mt-3 mb-2 uppercase tracking-wide">Direct Sourcing</h3>
              <p className="text-xs text-[#5a656d] leading-relaxed">
                Bypass middleman loops entirely. Communicate parameters cleanly down to the operating plant operators to settle volume quotations.
              </p>
            </div>

            {/* Dusra card quality aur compliance focus ko explain karta hai. */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ece9e2] shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-mono text-[#cea975] font-bold tracking-widest">02 / COMPLIANCE</span>
              <h3 className="text-base font-bold text-[#1e252b] mt-3 mb-2 uppercase tracking-wide">Verified Quality</h3>
              <p className="text-xs text-[#5a656d] leading-relaxed">
                Audit precise machinery specifications, real time capacity ceilings, and compliance tags securely before allocating capitalization funds.
              </p>
            </div>

            {/* Teesra card industrial specialization ko explain karta hai. */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ece9e2] shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-mono text-[#cea975] font-bold tracking-widest">03 / SPECIALIZATION</span>
              <h3 className="text-base font-bold text-[#1e252b] mt-3 mb-2 uppercase tracking-wide">Industrial Focus</h3>
              <p className="text-xs text-[#5a656d] leading-relaxed">
                Specifically built for large-scale garment manufacturing infrastructure, handling everything from local spinning nodes to final ocean freight shipping.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer me platform ka closing system status show hota hai. */}
      <footer className="bg-[#1e252b] text-[#9a9fa3] py-10 px-4 md:px-8 border-t border-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono">
          <div className="text-center sm:text-left">
            <span className="text-white font-bold text-xs font-sans tracking-tight">ZAMIN B2B SYSTEM LOGS</span>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} Zamin Platform. Direct wholesale sourcing made simple for the garment industry.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-[#cea975]">PORT_STATUS: TERMINAL ON-LINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
