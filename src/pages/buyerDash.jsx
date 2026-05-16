import react, { useState } from 'react';
import { Link } from 'react-router-dom';
import { factories } from '../data/mockFactories';

function Factory() {

  const [activeTab, setActiveTab] = useState("explore"); 
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchItem, setSearchItem] = useState("");
  const [message, setMessage] = useState("Verified Production Clusters");

  // Core Sourcing Toggle Logic
  const toggleFavorite = (e, factoryName) => {
    e.stopPropagation();
    if (favorites.includes(factoryName)) {
      setFavorites(favorites.filter((name) => name !== factoryName));
    } else {
      setFavorites([...favorites, factoryName]);
    }
  };

  // Filter Pipeline Processing
  const filteredFactories = factories.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchItem.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchItem.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
      (Array.isArray(item.category) 
        ? item.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase().replace("-", "")) 
        : item.category.toLowerCase() === selectedCategory.toLowerCase().replace("-", ""));

    return matchesSearch && matchesCategory;
  });

  // Isolate favorited factories for the Shortlist tab view
  const favoritedFactories = factories.filter(item => favorites.includes(item.name));

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased flex flex-col md:flex-row">
      
      {/* 1. SIDEBAR DESKTOP CONTROLLER / BOTTOM MOBILE NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#1e252b] text-white flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-black z-40">
        <div className="p-5 flex flex-row md:flex-col justify-between items-center md:items-start gap-4 w-full">
          <div>
            <Link to="/" className="text-xl font-black tracking-tighter text-white no-underline block">
              ZAMIN<span className="text-[#cea975]">.</span>
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-[#9a9fa3] font-bold block mt-0.5">
              Enterprise Buyer Terminal
            </span>
          </div>
          <Link to="/" className="text-[11px] font-mono text-[#cea975] hover:text-white transition-colors no-underline border border-[#cea975]/30 px-2 py-1 rounded">
            Exit Portal
          </Link>
        </div>

        {/* Dynamic Tab Selector Items */}
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-t border-b md:border-b-0 border-white/5 bg-black/20 md:bg-transparent md:px-3 md:py-6 gap-1 w-full shrink-0 scrollbar-none">
          <button 
            onClick={() => setActiveTab("explore")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "explore" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            🔍 Explore Mills
          </button>
          <button 
            onClick={() => setActiveTab("batches")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "batches" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📦 Active Batches
          </button>
          <button 
            onClick={() => setActiveTab("rfq")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "rfq" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📄 RFQ Contracts
          </button>
          <button 
            onClick={() => setActiveTab("shortlist")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "shortlist" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            ❤️ Shortlist ({favorites.length})
          </button>
        </nav>

        <div className="hidden md:block p-5 text-[10px] font-mono text-gray-500 border-t border-white/5">
          SECURE B2B SESSION // ONLINE
        </div>
      </aside>

      {/* 2. DYNAMIC WORKSPACE COMPONENT PANEL */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">

        {/* TAB 1: FACTORY EXPLORER WORKSPACE */}
        {activeTab === "explore" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#1e252b] tracking-tight">{message}</h1>
              <p className="text-xs sm:text-sm text-[#5a656d] mt-1 font-light">Filter and shortlist heavy-capacity processing clusters across the garment sector.</p>
            </div>

            <div className="space-y-4 max-w-3xl">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {["All", "T-Shirts", "Denim", "Hoodies"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-[#1e252b] text-white shadow-sm" : "bg-white text-[#5a656d] border border-[#dcd9d0] hover:border-[#cea975]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input 
                type="text"
                placeholder="Filter by city hub or installation name..."
                className="w-full px-4 py-3 rounded-xl border border-[#dcd9d0] bg-white text-sm focus:outline-none focus:border-[#cea975] focus:ring-1 focus:ring-[#cea975] transition-all"
                onChange={(e) => setSearchItem(e.target.value)} 
              />

              {filteredFactories.length === 0 && (
                <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0]">
                  <p className="text-xs font-mono text-[#7a858d]">No verified installations match request: "{searchItem}"</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFactories.map((item) => (
                <div key={item.name} className="bg-white border border-[#ece9e2] p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#cea975]/40 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f5f2eb] rounded-xl flex items-center justify-center text-lg font-black text-[#cea975] group-hover:bg-[#1e252b] group-hover:text-white shrink-0 transition-all">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#1e252b] tracking-tight leading-tight">{item.name}</h3>
                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[8px] font-extrabold uppercase rounded border border-green-200 shrink-0">Verified</span>
                          </div>
                          <p className="text-xs text-[#7a858d] mt-0.5 font-light">📍 {item.location}</p>
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(e, item.name)} className="p-1.5 bg-[#fcfbfa] hover:bg-red-50 rounded-full border border-[#ece9e2] transition-colors shrink-0">
                        <span className="text-xs block active:scale-125 transition-transform">{favorites.includes(item.name) ? "❤️" : "🤍"}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-4">
                      {Array.isArray(item.category) ? (
                        item.category.map(cat => (
                          <span key={cat} className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">{cat}</span>
                        ))
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">{item.category}</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#f5f2eb] pt-3 mt-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] uppercase text-[#7a858d] font-bold tracking-widest">Threshold MOQ</p>
                      <p className="text-xs font-bold text-[#1e252b] mt-0.5">500 Pcs</p>
                    </div>
                    <div className="border-l border-[#f5f2eb] pl-4">
                      <p className="text-[9px] uppercase text-[#7a858d] font-bold tracking-widest">Cycle Period</p>
                      <p className="text-xs font-bold text-[#1e252b] mt-0.5">3-4 Weeks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE BATCHES TRACKER (Tracking the 5 industrial phases) */}
        {activeTab === "batches" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Active Production Pipelines</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Track running floor metrics and manufacturing stages of active batch investments.</p>
            </div>

            <div className="bg-white border border-[#ece9e2] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 border-b border-[#f5f2eb]">
                <div>
                  <span className="text-[10px] bg-[#cea975]/20 text-[#a48150] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Batch #ZM-9042</span>
                  <h3 className="text-base font-bold text-[#1e252b] mt-1">Premium Summer Fleece Hoodies</h3>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[9px] uppercase text-[#7a858d] font-bold tracking-widest">Assigned Mill</p>
                  <p className="text-xs font-bold text-[#1e252b]">Indus Knits Ltd, Lahore</p>
                </div>
              </div>

              {/* Responsive Industrial Pipeline Stage Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                {[
                  { name: "1. Sample", status: "complete" },
                  { name: "2. Weaving", status: "complete" },
                  { name: "3. Stitching", status: "active" },
                  { name: "4. Quality QA", status: "pending" },
                  { name: "5. Freight", status: "pending" }
                ].map((stage, idx) => (
                  <div key={idx} className="p-3 rounded-xl border flex flex-col justify-between h-20 relative overflow-hidden bg-[#fcfbfa]">
                    <span className="text-[10px] font-bold text-[#1e252b]">{stage.name}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${stage.status === "complete" ? "text-green-600" : stage.status === "active" ? "text-[#cea975] animate-pulse" : "text-gray-400"}`}>
                      {stage.status === "complete" ? "✓ Done" : stage.status === "active" ? "● In Floor" : "○ Queued"}
                    </span>
                    {stage.status === "active" && <div className="absolute bottom-0 left-0 h-1 w-full bg-[#cea975]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RFQ BID CONTRACT MANAGER */}
        {activeTab === "rfq" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">RFQ Contract Terminal</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Submit technical data sheets and evaluate direct incoming wholesale bids from factory owners.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-[#ece9e2] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1e252b]">Tech-Pack: Custom Cotton Polo Line</h3>
                  <p className="text-xs text-[#7a858d] mt-0.5">Specifications: 220 GSM Combed Cotton, Custom Collar Dye, 2,500 units request.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <span className="px-3 py-1 bg-[#f5f2eb] text-[#1e252b] text-xs font-bold rounded-lg border border-[#dcd9d0] flex items-center justify-center whitespace-nowrap">⏳ 3 Bids Pending</span>
                  <button className="bg-[#1e252b] text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-[#cea975] transition-colors w-full sm:w-auto">View Offers</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ISOLATED SHORTLIST COMPONENT */}
        {activeTab === "shortlist" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Your Shortlisted Facilities</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Isolate and compare saved factory cells to launch immediate RFQ negotiations.</p>
            </div>

            {favoritedFactories.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0] max-w-xl">
                <p className="text-xs font-mono text-[#7a858d]">Your shortlisting storage array is currently clean. Click headers inside "Explore Mills" to pin rows here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoritedFactories.map((item) => (
                  <div key={item.name} className="bg-white border border-[#cea975]/40 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1e252b] text-white rounded-xl flex items-center justify-center text-base font-black shrink-0">{item.name.charAt(0)}</div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1e252b]">{item.name}</h3>
                          <p className="text-xs text-[#7a858d]">📍 {item.location}</p>
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(e, item.name)} className="text-xs p-1 hover:bg-red-50 rounded">❌ Remove</button>
                    </div>
                    <button className="w-full mt-4 bg-[#1e252b] hover:bg-[#cea975] text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors">Initialize RFQ Direct Contract</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Factory;