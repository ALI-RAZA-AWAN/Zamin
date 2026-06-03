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
  const [receiptLoadingId, setReceiptLoadingId] = useState(null);
  const [factorySearch, setFactorySearch] = useState('');

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

  useEffect(() => {
    if ((activeTab === 'proposals' || activeTab === 'proposalHistory' || activeTab === 'active') && user?.id) {
      fetchSentProposals(user.id);
    }
  }, [activeTab, user?.id]);

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
      if (data.success) {
        const sortedOrders = [...(data.orders || [])].sort((a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setSentProposals(sortedOrders);
      }
    } catch (e) { console.error(e); }
  };

  const fetchShortlist = async (bid) => {
    if (!bid) return;
    try {
      const res = await fetch(`http://localhost:5000/api/buyer/shortlist/${bid}`);
      const data = await res.json();
      if (data.success) setShortlist(data.shortlisted);
      else setShortlist([]);
    } catch (e) {
      console.error(e);
      setShortlist([]);
    }
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
      setActiveTab('active');
      fetchSentProposals(user.id);
    }
  } catch (e) { console.error(e); }
};

const viewReceipt = async (oid) => {
  try {
    setReceiptLoadingId(oid);
    const res = await fetch(`http://localhost:5000/api/payments/${oid}`);
    const data = await res.json();
    if (data.success && data.payment) {
      setOrderToPay(data.payment);
    } else {
      alert('Receipt not found for this order yet.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    setReceiptLoadingId(null);
  }
};
  const toggleCardState = (id) => {
    if (expandedCardId === id) setExpandedCardId(null);
    else setExpandedCardId(id);
  };

  const filteredFactories = factories.filter((factory) => {
    const query = factorySearch.trim().toLowerCase();
    if (!query) return true;

    const productText = (factory.uploadedArticles || [])
      .map(article => `${article.articleName || ''} ${article.description || ''}`)
      .join(' ')
      .toLowerCase();

    return (
      factory.name?.toLowerCase().includes(query) ||
      factory.location?.toLowerCase().includes(query) ||
      productText.includes(query)
    );
  });

  const activeProposalOrders = sentProposals.filter(order =>
    order.status === 'pending_quotation' || order.status === 'pending_buyer_approval'
  );
  const proposalHistoryOrders = sentProposals.filter(order =>
    order.status === 'accepted' || order.status === 'rejected'
  );
  const acceptedOrders = sentProposals.filter(order => order.status === 'accepted');

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
            <button onClick={() => setActiveTab('proposalHistory')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'proposalHistory' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>Proposal History</button>
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

            <div className="mb-5 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Search Factories</label>
              <input
                type="text"
                value={factorySearch}
                onChange={(e) => setFactorySearch(e.target.value)}
                placeholder="Search by factory name, location, or product"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFactories.map(f => {
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
              {filteredFactories.length === 0 && (
                <p className="col-span-full text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">No factory matched your search.</p>
              )}
            </div>
          </div>
        )}
{activeTab === 'proposals' && (
  <div>
    <h2 className="text-xl font-black text-gray-900 mb-1">Sourcing Proposals Ledger</h2>
    <p className="text-xs text-gray-500 mb-6">Track pricing evaluation statuses and authorize production.</p>
    
    <div className="space-y-4">
      {activeProposalOrders.map(order => {
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
                    Agree Order & Generate Receipt
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {activeProposalOrders.length === 0 && (
        <p className="text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">
          No active sent proposals right now.
        </p>
      )}
    </div>

  </div>
)}
        {activeTab === 'proposalHistory' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Proposal History</h2>
            <p className="text-xs text-gray-500 mb-6">Review accepted contracts, rejected proposals, and older sourcing records.</p>

            <div className="space-y-4">
              {proposalHistoryOrders.map(order => {
                const accepted = order.status === 'accepted';
                const total = Number(order.quantity || 0) * Number(order.negotiatedPricePerUnit || 0);

                return (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          Proposal to {order.factoryId?.name || 'Factory Unit'}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Location: {order.factoryId?.location || 'N/A'}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Quantity: {order.quantity} Pcs</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Unit Price: PKR {order.negotiatedPricePerUnit || 'N/A'}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Total: PKR {total || 0}</p>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border w-fit ${
                        accepted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {accepted ? 'Accepted Contract' : 'Rejected / Ended'}
                      </span>
                    </div>

                    <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Specifications</p>
                      <p className="text-gray-700 mt-1">{order.specifications || 'No extra specifications provided.'}</p>
                    </div>

                    {accepted && (
                      <button
                        onClick={() => viewReceipt(order._id)}
                        disabled={receiptLoadingId === order._id}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-700 disabled:opacity-60"
                      >
                        {receiptLoadingId === order._id ? 'Loading...' : 'View Contract'}
                      </button>
                    )}
                  </div>
                );
              })}

              {proposalHistoryOrders.length === 0 && (
                <p className="text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">
                  No proposal history available yet.
                </p>
              )}
            </div>
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
              {acceptedOrders.map(order => {
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
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Payment</p>
                            <p className="text-xs text-gray-700">Simple receipt generated after agreement.</p>
                          </div>
                          <button
                            onClick={() => viewReceipt(order._id)}
                            disabled={receiptLoadingId === order._id}
                            className="px-3 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-700 disabled:opacity-60"
                          >
                            {receiptLoadingId === order._id ? 'Loading...' : 'View Contract'}
                          </button>
                        </div>
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
              {acceptedOrders.length === 0 && (
                <p className="text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">No active manufacturing batches processing layout profiles currently.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {orderToPay && (
        <div className="contract-modal fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="contract-sheet bg-white rounded-2xl max-w-xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="contract-actions flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
              <p className="text-xs font-black uppercase text-gray-700">Contract Preview</p>
              <button
                onClick={() => setOrderToPay(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-black hover:bg-gray-200"
              >
                X
              </button>
            </div>

            <div className="contract-print-area overflow-y-auto px-5 py-4">
              <PaymentReceipt
                order={orderToPay}
                milestones={orderToPay.milestones || []}
              />
            </div>

            <div className="contract-actions grid grid-cols-2 gap-2 p-4 border-t border-gray-200 bg-white shrink-0">
              <button 
                onClick={() => setOrderToPay(null)} 
                className="py-3 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
              >
                CLOSE
              </button>
              <button
                onClick={() => window.print()}
                className="py-3 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                PRINT CONTRACT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;
