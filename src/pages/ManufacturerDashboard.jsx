import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ManufacturerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // --- NEW FEATURE: STATE FOR ORDERS TO MAKE THEM EDITABLE ---
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      name: 'Summer Denim Jacket',
      brand: 'Acme Fashion',
      qty: '5,000 units',
      due: '2026-06-15',
      stages: [
        { name: "Pattern", status: "complete" },
        { name: "Cutting", status: "complete" },
        { name: "Stitching", status: "active" },
        { name: "Quality Check", status: "pending" },
        { name: "Shipped", status: "pending" }
      ]
    },
    {
      id: 'ORD-002',
      name: 'Cotton T-Shirt',
      brand: 'Elite Apparel',
      qty: '8,000 units',
      due: '2026-06-20',
      opacityClass: 'opacity-75', // Keeping original style
      stages: [
        { name: "Pattern", status: "complete" },
        { name: "Cutting", status: "complete" },
        { name: "Stitching", status: "complete" },
        { name: "Quality Check", status: "complete" },
        { name: "Shipped", status: "active" }
      ]
    }
  ]);

  // --- NEW FEATURE: FUNCTION TO ADVANCE STAGE ---
  const handleUpdateStage = (orderId) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const newStages = [...order.stages];
        const activeIndex = newStages.findIndex(s => s.status === 'active');
        
        if (activeIndex !== -1) {
          newStages[activeIndex].status = 'complete'; // Current stage done
          if (activeIndex + 1 < newStages.length) {
            newStages[activeIndex + 1].status = 'active'; // Next stage active
          }
        }
        return { ...order, stages: newStages };
      }
      return order;
    }));
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#2c3539] font-sans antialiased flex flex-col md:flex-row">
      
      {/* 1. SIDEBAR (Original Design) */}
      <aside className="w-full md:w-64 bg-[#1e252b] text-white flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-black z-40">
        <div className="p-5 flex flex-row md:flex-col justify-between items-center md:items-start gap-4 w-full">
          <div>
            <Link to="/" className="text-xl font-black tracking-tighter text-white no-underline block">
              ZAMIN<span className="text-[#cea975]">.</span>
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-[#9a9fa3] font-bold block mt-0.5">
              Manufacturer Portal
            </span>
          </div>
          <Link to="/" className="text-[11px] font-mono text-[#cea975] hover:text-white transition-colors no-underline border border-[#cea975]/30 px-2 py-1 rounded">
            Exit Portal
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-t border-b md:border-b-0 border-white/5 bg-black/20 md:bg-transparent md:px-3 md:py-6 gap-1 w-full shrink-0 scrollbar-none">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "overview" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "orders" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            📦 Order Management
          </button>
          <button 
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "portfolio" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            🖼️ Portfolio Manager
          </button>
          <button 
            onClick={() => setActiveTab("messaging")}
            className={`flex-1 md:flex-none text-center md:text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "messaging" ? "bg-[#cea975] text-[#1e252b]" : "text-[#9a9fa3] hover:text-white"}`}
          >
            💬 Messaging
          </button>
        </nav>

        <div className="hidden md:flex p-5 border-t border-white/5 items-center gap-3">
            <div className="w-10 h-10 bg-[#333e48] rounded-full flex items-center justify-center text-sm font-bold text-white">LT</div>
            <div>
                <p className="text-xs font-bold text-white leading-tight">Luxe Textile Mfg.</p>
                <p className="text-[10px] text-[#cea975] font-mono mt-0.5">Verified Partner</p>
            </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">

        {/* TAB 1: DASHBOARD OVERVIEW (Restored to original) */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#1e252b] tracking-tight">Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-[#5a656d] mt-1 font-light">Monitor your live production metrics and recent facility activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#ece9e2] p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-[#7a858d] uppercase tracking-widest mb-2">Active Orders</h3>
                    <p className="text-4xl font-black text-[#1e252b]">3</p>
                    <p className="text-xs text-[#5a656d] mt-2">16,000 units in production</p>
                </div>
                <div className="bg-white border border-[#ece9e2] p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-[#7a858d] uppercase tracking-widest mb-2">Capacity Utilization</h3>
                    <p className="text-4xl font-black text-[#1e252b]">68%</p>
                    <p className="text-xs text-[#5a656d] mt-2">16,000 / 50,000 units</p>
                </div>
                <div className="bg-white border border-[#ece9e2] p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xs font-bold text-[#7a858d] uppercase tracking-widest mb-2">On-Time Delivery</h3>
                    <p className="text-4xl font-black text-[#1e252b]">94%</p>
                    <p className="text-xs text-[#5a656d] mt-2">Based on Last 30 days</p>
                </div>
            </div>

            <div className="bg-white border border-[#ece9e2] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#1e252b] mb-6 border-b border-[#f5f2eb] pb-3">Recent Activity Logs</h3>
                <div className="space-y-5">
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#1e252b]"></div>
                        <div>
                            <p className="text-sm font-semibold text-[#1e252b]">New order request from Acme Fashion</p>
                            <p className="text-xs text-[#7a858d] mt-0.5">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#cea975] animate-pulse"></div>
                        <div>
                            <p className="text-sm font-semibold text-[#1e252b]">Order ORD-002 moved to Quality Check</p>
                            <p className="text-xs text-[#7a858d] mt-0.5">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300"></div>
                        <div>
                            <p className="text-sm font-semibold text-[#1e252b]">Portfolio sample approved by Elite Apparel</p>
                            <p className="text-xs text-[#7a858d] mt-0.5">1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT (With New Advance Feature Added) */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Active Production Pipelines</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Manage and update the status of your running batches.</p>
            </div>

            {orders.map((order) => (
              <div key={order.id} className={`bg-white border border-[#ece9e2] rounded-2xl p-6 shadow-sm space-y-6 ${order.opacityClass || ''}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-[#f5f2eb]">
                  <div>
                    <h3 className="text-base font-bold text-[#1e252b]">{order.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-[#5a656d]">
                        <span><strong className="text-[#1e252b]">Order ID:</strong> {order.id}</span>
                        <span><strong className="text-[#1e252b]">Brand:</strong> {order.brand}</span>
                        <span><strong className="text-[#1e252b]">Qty:</strong> {order.qty}</span>
                    </div>
                  </div>
                  
                  {/* The exact new feature: Delivery Due + Edit Button */}
                  <div className="flex items-center gap-4 text-left sm:text-right">
                    <div>
                      <p className="text-[9px] uppercase text-[#7a858d] font-bold tracking-widest">Delivery Due</p>
                      <p className="text-xs font-bold text-[#cea975] mt-0.5">{order.due}</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateStage(order.id)}
                      disabled={!order.stages.some(s => s.status === 'active')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors border ${
                        order.stages.some(s => s.status === 'active') 
                        ? 'bg-[#1e252b] text-white hover:bg-[#cea975] hover:border-[#cea975] border-[#1e252b]' 
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Advance ➔
                    </button>
                  </div>
                </div>

                {/* Original Stepper Style mapping the state */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                  {order.stages.map((stage, idx) => (
                    <div key={idx} className="p-3 rounded-xl border flex flex-col justify-between h-20 relative overflow-hidden bg-[#fcfbfa]">
                      <span className="text-[10px] font-bold text-[#1e252b]">{stage.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${stage.status === "complete" ? "text-green-600" : stage.status === "active" ? "text-[#cea975] animate-pulse" : "text-gray-400"}`}>
                        {stage.status === "complete" ? "✓ Done" : stage.status === "active" ? "● In Progress" : "○ Queued"}
                      </span>
                      {stage.status === "active" && <div className="absolute bottom-0 left-0 h-1 w-full bg-[#cea975]" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        )}

        {/* TAB 3: PORTFOLIO MANAGER (Restored to original) */}
        {activeTab === "portfolio" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Portfolio Manager</h1>
                <p className="text-xs text-[#5a656d] mt-1 font-light">Showcase your best production samples to attract high-end brands.</p>
              </div>
              <button className="bg-[#1e252b] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-[#cea975] transition-colors flex items-center gap-2 shadow-md">
                <span>↑</span> Upload Sample
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-[#ece9e2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-48 bg-[#f5f2eb] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1584286595398-a59f2afddaca?auto=format&fit=crop&q=80&w=600" alt="Satin" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-sm text-[#1e252b] mb-2">Luxury Satin Evening Wear</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">Woven</span>
                </div>
              </div>
              
              <div className="bg-white border border-[#ece9e2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-48 bg-[#f5f2eb] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600" alt="Denim" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-sm text-[#1e252b] mb-2">Premium Denim Collection</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">Denim</span>
                </div>
              </div>

              <div className="bg-white border border-[#ece9e2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-48 bg-[#f5f2eb] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&q=80&w=600" alt="Workshop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-sm text-[#1e252b] mb-2">Workshop Production</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-[#fcfbfa] text-[#a48150] border border-[#f0ede6] rounded font-semibold uppercase tracking-wider">Manufacturing</span>
                </div>
              </div>

              <div className="bg-[#f5f3ee]/50 border-2 border-dashed border-[#dcd9d0] rounded-2xl h-full min-h-[260px] flex flex-col items-center justify-center cursor-pointer hover:border-[#cea975] hover:bg-white transition-all text-[#7a858d]">
                  <span className="text-3xl mb-2">↑</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Add New Item</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MESSAGING (Restored to original) */}
        {activeTab === "messaging" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-[#1e252b] tracking-tight">Direct Communications</h1>
              <p className="text-xs text-[#5a656d] mt-1 font-light">Securely negotiate with buyers and finalize bulk volume contracts.</p>
            </div>

            <div className="h-[60vh] flex items-center justify-center bg-[#f5f3ee]/50 rounded-2xl border border-dashed border-[#dcd9d0] max-w-4xl">
              <div className="text-center p-8">
                <span className="text-4xl block mb-4">💬</span>
                <p className="text-sm font-bold text-[#1e252b] uppercase tracking-wide">No Active Threads</p>
                <p className="text-xs font-mono text-[#7a858d] mt-2 max-w-xs mx-auto">Your messaging inbox is currently empty. New RFQ inquiries from buyers will appear here.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default ManufacturerDashboard;