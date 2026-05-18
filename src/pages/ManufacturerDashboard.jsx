import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ManufacturerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [incomingProposals, setIncomingProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read active session parameters from localStorage populated during login
  const savedUserString = localStorage.getItem('zamin_user');
  const loggedInUser = savedUserString ? JSON.parse(savedUserString) : null;
  const currentFactoryId = loggedInUser ? loggedInUser.factoryId : null;
  
  const BASE_URL = 'http://localhost:5000/api';

  // Protect path execution context and fetch documents on lifecycle load
  useEffect(() => {
    if (!currentFactoryId) {
      alert("Session expired or invalid. Please sign in to access the Factory floor terminal.");
      window.location.href = '/login';
      return;
    }
    fetchOrdersFromBackend();
  }, []);

  const fetchOrdersFromBackend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/orders/manufacturer/${currentFactoryId}`);
      const data = await response.json();
      
      if (data.success) {
        // Segregate live operations lines from newly unverified proposal forms
        setOrders(data.orders.filter(o => o.status === 'active'));
        setIncomingProposals(data.orders.filter(o => o.status === 'pending_approval'));
      }
      setLoading(false);
    } catch (err) {
      console.error("Express API connection failure:", err);
      setLoading(false);
    }
  };

  // Action 1: Mutate inbound contract to Active status
  const handleAcceptProposal = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }) 
      });
      const data = await response.json();
      if (data.success) {
        alert("Proposal accepted! Batch moved onto production line floor.");
        fetchOrdersFromBackend(); 
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Action 2: Mutate status schema parameter to Rejected
  const handleDeclineProposal = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrdersFromBackend();
      }
    } catch (err) {
      console.error("Error declining proposal:", err);
    }
  };

  // Action 3: Multi-stage assembly stepper adjustment (+1 database increment)
  const handleAdvanceStage = async (orderId, currentStageIndex) => {
    if (currentStageIndex >= 4) return; // Cap reached at index 'Shipped'
    
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStage: currentStageIndex + 1 })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrdersFromBackend();
      }
    } catch (err) {
      console.error("Error advancing floor stage:", err);
    }
  };

  // Index maps explicitly to production stages tracked in MongoDB
  const stageLabels = ["Pattern/Sample", "Cutting", "Stitching", "Quality Check", "Shipped"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-[#9a9fa3] bg-[#1e252b]">
        CONNECTING TO ZAMIN NODE SERVER...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased flex flex-col md:flex-row">
      
      {/* SIDEBAR TERMINAL LAYOUT */}
      <aside className="w-full md:w-64 bg-[#1e252b] text-white flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-black z-40">
        <div className="p-5 flex flex-row md:flex-col justify-between items-center md:items-start gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tighter text-white m-0">
              ZAMIN<span className="text-[#cea975]">.</span>
            </h2>
            <span className="text-[9px] uppercase tracking-widest text-[#9a9fa3] font-bold block mt-0.5">
              Factory Node Terminal
            </span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="text-[11px] font-mono text-[#cea975] hover:text-white bg-transparent border border-[#cea975]/30 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            Log Out
          </button>
        </div>

        <nav className="flex flex-row md:flex-col overflow-x-auto border-t border-b border-white/5 bg-black/20 md:bg-transparent md:px-3 md:py-6 gap-1 w-full scrollbar-none">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "overview" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            🏭 Floor Overview
          </button>
          <button 
            onClick={() => setActiveTab("proposals")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeTab === "proposals" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📥 Inbound Proposals ({incomingProposals.length})
          </button>
        </nav>

        <div className="hidden md:block p-5 text-[10px] font-mono text-gray-500 border-t border-white/5">
          MONGODB INSTANCE CONNECTED // SECURE
        </div>
      </aside>

      {/* COMPONENT INTERACTION TRACKING SPACE */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">

        {/* WORKSPACE AREA 1: RUNNING FLUID CONTRACT ASSEMBLIES */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Active Floor Lines</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Monitor running jobs and update project tracking status indicators directly.</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0]">
                <p className="text-xs font-mono text-[#7a858d]">No active contracts running on the assembly lines right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => {
                  const currentStageIndex = order.currentProductionStage || 0;
                  const progressPercentage = ((currentStageIndex + 1) / stageLabels.length) * 100;

                  return (
                    <div key={order._id} className="bg-white border border-[#ece9e2] p-6 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active Batch</span>
                          <h3 className="text-base font-bold text-[#1e252b] mt-1">{order.productTitle}</h3>
                          <p className="text-xs text-[#7a858d] font-light">Target Output Quantity: {order.orderQuantity} Pcs</p>
                        </div>
                        
                        <button 
                          onClick={() => handleAdvanceStage(order._id, currentStageIndex)}
                          disabled={currentStageIndex >= 4}
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${currentStageIndex >= 4 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#1e252b] text-white hover:bg-[#cea975] hover:text-[#1e252b]"}`}
                        >
                          {currentStageIndex >= 4 ? "✓ Fully Dispatched" : `Move to: ${stageLabels[currentStageIndex + 1]} →`}
                        </button>
                      </div>

                      {/* Stepper Loader */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>Current Stage: <strong className="text-[#cea975] uppercase">{stageLabels[currentStageIndex]}</strong></span>
                          <span>{Math.round(progressPercentage)}% Assembly</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#cea975] to-[#1e252b] h-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* WORKSPACE AREA 2: INCOMING CLIENT BULK REQUIREMENT INQUIRIES */}
        {activeTab === "proposals" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Direct Client Proposals</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Evaluate tech spec requests sent by nearby retail buyers looking to occupy your floor space.</p>
            </div>

            {incomingProposals.length === 0 ? (
              <div className="p-12 text-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0]">
                <p className="text-xs font-mono text-[#7a858d]">No pending contract inquiries in your inbound inbox cluster.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {incomingProposals.map((prop) => (
                  <div key={prop._id} className="bg-white border border-[#ece9e2] p-5 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b border-[#f5f2eb] pb-3">
                      <div>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Inbound Request</span>
                        <h3 className="text-base font-bold text-[#1e252b] mt-1">{prop.productTitle}</h3>
                        <p className="text-xs text-[#7a858d] mt-0.5">Requested Volume Capacity: <strong>{prop.orderQuantity} Pcs</strong></p>
                      </div>
                    </div>

                    <div className="bg-[#fcfbfa] border rounded-xl p-3">
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Buyer Production Specifications:</h4>
                      <p className="text-xs text-[#5a656d] leading-relaxed font-light">"{prop.specifications || 'No structural text specifications provided.'}"</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => handleAcceptProposal(prop._id)}
                        className="flex-1 bg-[#1e252b] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        Accept & Start Production Line
                      </button>
                      <button 
                        onClick={() => handleDeclineProposal(prop._id)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default ManufacturerDashboard;