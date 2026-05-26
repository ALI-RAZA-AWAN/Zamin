import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// BuyerDashboard.jsx ke top par:
import PaymentReceipt from './PaymentReceipt';

function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');
  const [factories, setFactories] = useState([]);
  const [sentProposals, setSentProposals] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [orderToPay, setOrderToPay] = useState(null);

  // Card Expand Toggle state variable
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('zaminUser');
    if (!raw) { navigate('/login'); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);
    
    // Core structural real-time triggers initialization fetch routines
    fetchFactories();
    fetchSentProposals(parsed.id);
    fetchShortlist(parsed.id);
  }, []);

  const fetchFactories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/factories');
      const data = await res.json();
      if (data.success) setFactories(data.factories);
    } catch (e) { console.error(e); }
  };

  const fetchSentProposals = async (bid) => {
    if (!bid) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/buyer/${bid}`);
      const data = await res.json();
      if (data.success) setSentProposals(data.orders);
    } catch (e) { console.error(e); }
  };

  const fetchShortlist = async (bid) => {
    if (!bid) return;
    try {
      const res = await fetch(`http://localhost:5000/api/buyer/shortlist/${bid}`);
      const data = await res.json();
      if (data.success) setShortlist(data.shortlisted);
    } catch (e) { console.error(e); }
  };

  const toggleShortlist = async (fid) => {
    try {
      const res = await fetch('http://localhost:5000/api/buyer/shortlist-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user.id, factoryId: fid })
      });
      const data = await res.json();
      if (data.success) {
        fetchShortlist(user.id); // Live local component array structural reload
      }
    } catch (e) { console.error(e); }
  };
const acceptPriceOffer = async (oid) => {
  try {
    const res = await fetch(`http://localhost:5000/api/orders/${oid}/accept-price`, {
      method: 'PUT'
    });
    const data = await res.json();
    if (data.success) {
      // Backend ne ab payment document bhi bheja hai
      setOrderToPay(data.payment); 
      fetchSentProposals(user.id);
    }
  } catch (e) { console.error(e); }
};
  const toggleCardState = (id) => {
    if (expandedCardId === id) setExpandedCardId(null);
    else setExpandedCardId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('zaminUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row text-gray-800">
      {/* Universal Fluid Layout Navigation System */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-6">
            <h3 className="text-md font-black text-gray-900 tracking-tight">BUYER HUB</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold mt-0.5">{user?.brandName || "Brand Client Node"}</p>
          </div>
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-3 md:pb-0 border-b md:border-b-0 border-gray-100">
            <button onClick={() => setActiveTab('explore')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'explore' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Explore Mills</button>
            <button onClick={() => setActiveTab('proposals')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'proposals' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Sent Proposals</button>
            <button onClick={() => setActiveTab('shortlist')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'shortlist' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Shortlisted Mills</button>
            <button onClick={() => setActiveTab('active')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'active' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Active Batches Tracker</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-4 w-full px-3 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-center uppercase tracking-wider">Log Out Interface Profile</button>
      </div>

      {/* Main Stream Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-5xl">
        {activeTab === 'explore' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Verified Textile Manufacturing Directory</h2>
            <p className="text-xs text-gray-500 mb-6">Explore structural production lines and tap profiles to source volumes direct.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {factories.map(f => {
                const isShortlisted = shortlist.some(s => s._id === f._id);
                return (
                  <div key={f._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{f.name}</h4>
                        <button onClick={() => toggleShortlist(f._id)} className="text-xs focus:outline-none">{isShortlisted ? '⭐' : '☆'}</button>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium font-mono">📍 Location: {f.location}</p>
                      <p className="text-[11px] text-gray-500 font-medium font-mono mt-0.5">📊 Capacity: {f.capacity} Pcs/mo</p>
                    </div>
                    <button onClick={() => navigate(`/factory/${f._id}`)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all">Inspect Infrastructure Facility</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
{activeTab === 'proposals' && (
  <div>
    <h2 className="text-xl font-black text-gray-900 mb-1">Sourcing Proposals Ledger</h2>
    <p className="text-xs text-gray-500 mb-6">Track pricing evaluation statuses and authorize production.</p>
    
    <div className="space-y-4">
      {sentProposals.filter(o => o.status !== 'accepted').map(order => {
        const isExpanded = expandedCardId === order._id;
        return (
          <div key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div onClick={() => toggleCardState(order._id)} className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Proposal to {order.factoryId?.name || 'Factory Unit'}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 font-mono">Volume: {order.quantity} Pcs</p>
              </div>
              <span className={`px-2.5 py-1 text-[10px] uppercase font-black rounded-lg ${order.status === 'pending_buyer_approval' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                {order.status === 'pending_quotation' ? 'Reviewing' : order.status === 'pending_buyer_approval' ? 'Pending Approval' : 'Rejected'}
              </span>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4 bg-gray-50/20">
                <div className="text-xs font-mono text-gray-700 mb-4">
                  <p>Offered Rate: <span className="font-bold text-gray-900">PKR {order.negotiatedPricePerUnit}</span></p>
                </div>
                {order.status === 'pending_buyer_approval' && (
                  <button onClick={() => acceptPriceOffer(order._id)} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700">
                    Authorize Contract & Pay
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* PAYMENT MODAL OVERLAY */}
    {orderToPay && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
          <h2 className="text-xs font-black uppercase mb-4">Milestone Payment Tracker</h2>
          
          {/* orderToPay ab ek Payment document hai jismein milestones array hai */}
          <PaymentReceipt 
        order={orderToPay} 
        milestones={orderToPay.milestones || []} 
      />

          <button 
            onClick={() => setOrderToPay(null)} 
            className="mt-6 w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl"
          >
            ACKNOWLEDGE & CLOSE
          </button>
        </div>
      </div>
    )}
  </div>
)}
        {activeTab === 'shortlist' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Shortlisted Manufacturing Units</h2>
            <p className="text-xs text-gray-500 mb-6">Fast track operational access nodes saved for repeated deployment runs.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shortlist.map(f => (
                <div key={f._id} className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{f.name}</h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">📍 {f.location}</p>
                  </div>
                  <button onClick={() => navigate(`/factory/${f._id}`)} className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl uppercase hover:bg-blue-700">Open Profile</button>
                </div>
              ))}
              {shortlist.length === 0 && (
                <p className="col-span-2 text-xs text-gray-400 italic font-mono text-center py-6">Shortlist layout matrix is empty.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Live Active Production Tracking Floor</h2>
            <p className="text-xs text-gray-500 mb-6">Real-time terminal query monitoring structural pipeline stages directly from mill floors without manual sync recall.</p>
            
            <div className="space-y-4">
              {sentProposals.filter(o => o.status === 'accepted').map(order => {
                const isExpanded = expandedCardId === order._id;
                return (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div onClick={() => toggleCardState(order._id)} className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Contract Order to {order.factoryId?.name || 'Mill Facility'}</h4>
                        <p className="text-[11px] text-gray-600 font-semibold font-mono mt-0.5">Live Floor Stage: <span className="text-emerald-600 font-bold uppercase">{order.currentProductionStage}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4 bg-gray-50/10">
                        {/* Real-time Visual Phase Tracker Bar Layout Engine */}
                        <div className="mt-2 grid grid-cols-5 text-center gap-1">
                          {['Cutting', 'Stitching', 'Washing', 'Quality Check', 'Dispatched'].map((stage, idx) => {
                            const currentIdx = ['Phase 0: Cutting', 'Phase 1: Stitching', 'Phase 2: Washing', 'Phase 3: Quality Check', 'Phase 4: Dispatched'].indexOf(order.currentProductionStage);
                            const isActive = idx <= currentIdx;
                            return (
                              <div key={stage} className="space-y-1">
                                <div className={`h-1.5 w-full rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <span className={`text-[8px] sm:text-[10px] block font-bold uppercase tracking-tight ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>{stage}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {sentProposals.filter(o => o.status === 'accepted').length === 0 && (
                <p className="text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">No active manufacturing batches processing layout profiles currently.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerDashboard;