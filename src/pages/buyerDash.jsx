import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BuyerDashboard() {
  // Navigation & Workspace States
  const [activeTab, setActiveTab] = useState("explore"); // Options: "explore", "batches", "proposals", "shortlist"
  const [factories, setFactories] = useState([]);
  const [activeBatches, setActiveBatches] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State for Direct Sourcing Proposal Execution
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTargetFactory, setSelectedTargetFactory] = useState(null);
  
  // Form fields mapping to the MongoDB Orders collection structure
  const [proposalForm, setProposalForm] = useState({
    productTitle: '',
    orderQuantity: 500,
    specifications: ''
  });

  // Target base URL for your local Node.js Express Server
  const BASE_URL = 'http://localhost:5000/api';
  
  // Read active session parameters populated during Login
  const savedUserString = localStorage.getItem('zamin_user');
  const loggedInUser = savedUserString ? JSON.parse(savedUserString) : null;
  const loggedInBuyerId = loggedInUser ? loggedInUser.id : null;

  // Protect path execution context and fetch documents on lifecycle load
  useEffect(() => {
    if (!loggedInBuyerId) {
      alert("Session expired or invalid. Please sign in to access the B2B terminal.");
      window.location.href = '/login';
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch all verified factories for the Directory Search Hub
      const factoryRes = await fetch(`${BASE_URL}/factories`);
      const factoryData = await factoryRes.json();
      if (factoryData.success) {
        setFactories(factoryData.factories);
      }

      // 2. Fetch all orders connected to this specific buyer from MongoDB
      const orderRes = await fetch(`${BASE_URL}/orders/buyer/${loggedInBuyerId}`);
      const orderData = await orderRes.json();
      if (orderData.success) {
        // Active orders are contracts approved by factory currently moving along floor stages
        setActiveBatches(orderData.orders.filter(o => o.status === 'active'));
        // Proposals are requests waiting for the factory to click accept
        setSentProposals(orderData.orders.filter(o => o.status === 'pending_approval'));
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to establish secure sync with Express Backend:", err);
      setLoading(false);
    }
  };

  // Open pop-up input context for the spec sheets
  const openProposalModal = (factory) => {
    setSelectedTargetFactory(factory);
    setIsModalOpen(true);
  };

  // Submit direct requirement sheet straight into your local MongoDB database
  const handleSendProposal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/orders/proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: loggedInBuyerId,
          factoryId: selectedTargetFactory._id, // References the 24-char hexadecimal MongoDB ObjectID
          productTitle: proposalForm.productTitle,
          orderQuantity: Number(proposalForm.orderQuantity),
          specifications: proposalForm.specifications
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Sourcing requirements successfully transmitted directly to ${selectedTargetFactory.name}!`);
        setIsModalOpen(false);
        setProposalForm({ productTitle: '', orderQuantity: 500, specifications: '' });
        fetchDashboardData(); // Refresh lists immediately from the database
      }
    } catch (err) {
      console.error("Error creating direct proposal order document:", err);
    }
  };

  // Tracking favorite items in local UI arrays
  const toggleFavorite = (e, factoryId) => {
    e.stopPropagation();
    if (favorites.includes(factoryId)) {
      setFavorites(favorites.filter((id) => id !== factoryId));
    } else {
      setFavorites([...favorites, factoryId]);
    }
  };

  // Filter processing matching city hub or installation names
  const filteredFactories = factories.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchItem.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchItem.toLowerCase());
    
    const itemCat = Array.isArray(item.category) ? item.category : [item.category];
    const matchesCategory = selectedCategory === "All" || 
      itemCat.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Grab documents that match the favorites array index
  const favoritedFactories = factories.filter(item => favorites.includes(item._id));
  const stageLabels = ["Pattern/Sample", "Cutting", "Stitching", "Quality Check", "Shipped"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-gray-500 bg-[#fcfbfa]">
        SYNCHRONIZING SECURE BUYER INTERFACE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION CONTROL TERMINAL */}
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
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="text-[11px] font-mono text-[#cea975] hover:text-white bg-transparent border border-[#cea975]/30 px-2 py-1 rounded cursor-pointer transition-colors"
          >
            Log Out
          </button>
        </div>

        <nav className="flex flex-row md:flex-col overflow-x-auto border-t border-b border-white/5 bg-black/20 md:bg-transparent md:px-3 md:py-6 gap-1 w-full scrollbar-none">
          <button 
            onClick={() => setActiveTab("explore")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "explore" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            🔍 Explore Mills
          </button>
          <button 
            onClick={() => setActiveTab("batches")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "batches" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📦 Active Batches ({activeBatches.length})
          </button>
          <button 
            onClick={() => setActiveTab("proposals")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "proposals" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📄 Sent Proposals ({sentProposals.length})
          </button>
          <button 
            onClick={() => setActiveTab("shortlist")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "shortlist" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            ❤️ Shortlist ({favorites.length})
          </button>
        </nav>

        <div className="hidden md:block p-5 text-[10px] font-mono text-gray-500 border-t border-white/5">
          NODE ENVIRONMENT ACTIVE // MONGODB
        </div>
      </aside>

      {/* DYNAMIC WORKSPACE PANEL LAYOUT */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">

        {/* TAB 1: LOCATION & CAPABILITY DIRECTORY EXPLORER */}
        {activeTab === "explore" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#1e252b] tracking-tight">Verified Production Clusters</h1>
              <p className="text-xs sm:text-sm text-[#5a656d] mt-1 font-light">Filter and target heavy-capacity text manufacturing mills across local trade sectors.</p>
            </div>

            <div className="space-y-4 max-w-3xl">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {["All", "T-Shirts", "Polo-shirts", "Hoodies", "Denim"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat ? "bg-[#1e252b] text-white shadow-sm" : "bg-white text-[#5a656d] border border border-[#dcd9d0] hover:border-[#cea975]"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input 
                type="text"
                placeholder="Filter by manufacturing hub city (e.g., Lahore, Faisalabad, Karachi)..."
                className="w-full px-4 py-3 rounded-xl border border-[#dcd9d0] bg-white text-sm focus:outline-none focus:border-[#cea975] transition-all"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFactories.map((item) => (
                <div key={item._id} className="bg-white border border-[#ece9e2] p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#cea975]/40 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f5f2eb] rounded-xl flex items-center justify-center text-lg font-black text-[#cea975] group-hover:bg-[#1e252b] group-hover:text-white shrink-0 transition-all">
                          {item.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#1e252b] tracking-tight">{item.name}</h3>
                            <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[8px] font-extrabold uppercase rounded border border-green-200">Verified</span>
                          </div>
                          <p className="text-xs text-[#7a858d] mt-0.5 font-light">📍 {item.location}</p>
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(e, item._id)} className="p-1.5 bg-[#fcfbfa] hover:bg-red-50 rounded-full border border-[#ece9e2] transition-colors shrink-0 cursor-pointer">
                        <span className="text-xs block">{favorites.includes(item._id) ? "❤️" : "🤍"}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-4">
                      {(Array.isArray(item.category) ? item.category : [item.category || "General"]).map(cat => (
                        <span key={cat} className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">{cat}</span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#f5f2eb] pt-3 mt-1 flex gap-4">
                    <button 
                      onClick={() => openProposalModal(item)}
                      className="w-full bg-[#1e252b] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#cea975] hover:text-[#1e252b] transition-all duration-200 cursor-pointer"
                    >
                      Initialize Direct Contract →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE RUNNING PRODUCTION LINES STEP TRACKER */}
        {activeTab === "batches" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Active Production Pipelines</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Monitor running floor stages of active batch investments synced live from manufacturer terminals.</p>
            </div>

            {activeBatches.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0] max-w-2xl">
                <p className="text-xs font-mono text-[#7a858d]">No approved manufacturing lines actively running in your workspace logs.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeBatches.map(batch => {
                  const currentStageIndex = batch.currentProductionStage || 0;
                  const percentComplete = ((currentStageIndex + 1) / stageLabels.length) * 100;

                  return (
                    <div key={batch._id} className="bg-white border border-[#ece9e2] rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-start border-b border-[#f5f2eb] pb-3">
                        <div>
                          <h3 className="text-base font-bold text-[#1e252b]">{batch.productTitle}</h3>
                          <p className="text-xs text-gray-500 font-light">Contracted Volume: <strong>{batch.orderQuantity} Pieces</strong></p>
                        </div>
                        <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                          Manufacturing Running
                        </span>
                      </div>

                      {/* Progress Progress Stepper */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>Current Stage: <strong className="text-[#cea975] uppercase">{stageLabels[currentStageIndex]}</strong></span>
                          <span>{Math.round(percentComplete)}% Processed</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#cea975] h-full transition-all duration-500" style={{ width: `${percentComplete}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SENT DIRECT ORDER PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Sent Sourcing Proposals</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Review parameters of active build sheets transmitted directly to local mill owners.</p>
            </div>

            {sentProposals.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0] max-w-2xl">
                <p className="text-xs font-mono text-[#7a858d]">Your outbound proposal inbox tracker is completely clean.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sentProposals.map(prop => (
                  <div key={prop._id} className="bg-white border border-[#ece9e2] p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Awaiting Manufacturer Acceptance
                      </span>
                      <h3 className="text-sm font-bold text-[#1e252b] mt-1">{prop.productTitle}</h3>
                      <p className="text-xs text-[#7a858d] font-light">Volume Call: {prop.orderQuantity} Units</p>
                    </div>
                    <div className="text-xs font-mono text-gray-400 bg-gray-50 border p-3 rounded-xl w-full sm:w-auto max-w-md">
                      "{prop.specifications || 'No technical notes pinned.'}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHORTLIST */}
        {activeTab === "shortlist" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Shortlisted Sourcing Sites</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Isolate pinned plant installations to launch quick contract negotiations.</p>
            </div>

            {favoritedFactories.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0] max-w-2xl">
                <p className="text-xs font-mono text-[#7a858d]">Your shortlisting storage array is empty. Save rows from "Explore Mills".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoritedFactories.map((item) => (
                  <div key={item._id} className="bg-white border border-[#cea975]/40 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1e252b] text-white rounded-xl flex items-center justify-center text-base font-black shrink-0">{item.name?.charAt(0)}</div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1e252b]">{item.name}</h3>
                          <p className="text-xs text-[#7a858d]">📍 {item.location}</p>
                        </div>
                      </div>
                      <button onClick={(e) => toggleFavorite(e, item._id)} className="text-xs p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer">❌ Remove</button>
                    </div>
                    <button onClick={() => openProposalModal(item)} className="w-full mt-4 bg-[#1e252b] hover:bg-[#cea975] text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer">
                      Initialize Direct Contract
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* SOURCING REQUIREMENT SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl border border-[#ece9e2] shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-black text-[#1e252b]">Transmit Contract Build Details</h2>
              <p className="text-xs text-gray-500 font-light mt-0.5">Target Installation: <strong className="text-[#cea975]">{selectedTargetFactory?.name}</strong></p>
            </div>
            
            <form onSubmit={handleSendProposal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5a656d] block mb-1">Batch Item Description</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#cea975]" 
                  placeholder="e.g., Brushed Fleece Pullover Hoodies" 
                  value={proposalForm.productTitle} 
                  onChange={e => setProposalForm({ ...proposalForm, productTitle: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-[#5a656d] block mb-1">Target Volume Production (Pcs)</label>
                <input 
                  type="number" 
                  required 
                  min="50"
                  className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#cea975]" 
                  value={proposalForm.orderQuantity} 
                  onChange={e => setProposalForm({ ...proposalForm, orderQuantity: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-[#5a656d] block mb-1">Technical Specs & Fabric Demands</label>
                <textarea 
                  rows="3" 
                  required
                  className="w-full p-2.5 border rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#cea975] font-light" 
                  placeholder="Specify yarn counts, GSM weights (e.g., 300 GSM), colorway hexes, pocket styles..." 
                  value={proposalForm.specifications} 
                  onChange={e => setProposalForm({ ...proposalForm, specifications: e.target.value })} 
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#1e252b] text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#1e252b] hover:bg-[#cea975] hover:text-[#1e252b] text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Transmit Spec Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default BuyerDashboard;