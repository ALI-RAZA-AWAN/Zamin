import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ManufacturerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inbound');
  const [orders, setOrders] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  
  // Catalog Form States
  const [articleName, setArticleName] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Isme Base64 string save hogi
  const [moq, setMoq] = useState('');
  const [description, setDescription] = useState('');
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const raw = localStorage.getItem('zaminUser');
    if (!raw) { navigate('/login'); return; }
    const parsed = JSON.parse(raw);
    setUser(parsed);
    fetchOrders(parsed.factoryId);
    fetchCatalogItems(parsed.factoryId);
  }, []);

  const fetchOrders = async (fid) => {
    if (!fid) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/manufacturer/${fid}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
  };

  const fetchCatalogItems = async (fid) => {
    if (!fid) return;
    try {
      const res = await fetch(`http://localhost:5000/api/factories/${fid}`);
      const data = await res.json();
      if (data.success) setCatalogItems(data.factory.uploadedArticles || []);
    } catch (e) { console.error(e); }
  };

  const resetCatalogForm = () => {
    setArticleName('');
    setImageUrl('');
    setMoq('');
    setDescription('');
  };

  const executeAction = async (oid, status, price = null) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${oid}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, price })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Order profile marked as ${status}`);
        fetchOrders(user.factoryId);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdatePhase = async (oid, nextStage) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${oid}/phase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStage })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Production line advanced to ${nextStage}`);
        fetchOrders(user.factoryId);
      }
    } catch (e) { console.error(e); }
  };

  // Device se image pick karke base64 text me convert karne ka function
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result); // Yeh image ko text string banayega
    };
    reader.readAsDataURL(file);
  };

  // ✅ FIXED: Native form reset crash completely isolated and handled manually via React lifecycle state control
  const handleUploadCatalogArticle = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a reference image first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/factories/${user.factoryId}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleName, imageUrl, moq, description })
      });
      const data = await res.json();
      if (data.success) {
        alert("New catalog item deployed live onto public directory profile.");
        
        // React State variables reset to blank sequence mapping
        resetCatalogForm();
        setShowCatalogForm(false);
        fetchCatalogItems(user.factoryId);
      } else {
        alert(data.message || "Failed to deploy article to system directory.");
      }
    } catch (e) { 
      console.error(e); 
      alert("Terminal gate error mapping file system profile.");
    }
  };

  const handleRemoveCatalogArticle = async (articleId) => {
    if (!window.confirm("Remove this catalog item from the public buyer showcase?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/factories/${user.factoryId}/articles/${articleId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCatalogItems(data.uploadedArticles || []);
      } else {
        alert(data.message || "Failed to remove catalog item.");
      }
    } catch (e) {
      console.error(e);
      alert("Could not remove catalog item.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zaminUser');
    localStorage.removeItem('zaminToken');
    navigate('/login');
  };

  const toggleCard = (id) => {
    if (expandedOrderId === id) setExpandedOrderId(null);
    else setExpandedOrderId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row text-gray-800">
      {/* Sidebar Layout */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-6">
            <h3 className="text-md font-black text-gray-900 tracking-tight">FACTORY MANAGEMENT</h3>
            <p className="text-[10px] text-gray-500 uppercase font-bold mt-0.5">Control Center Node</p>
          </div>
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-3 md:pb-0 border-b md:border-b-0 border-gray-100">
            <button onClick={() => setActiveTab('inbound')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'inbound' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Inbound Requests</button>
            <button onClick={() => setActiveTab('floor')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'floor' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Floor Overview</button>
            <button onClick={() => setActiveTab('history')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'history' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Order History</button>
            <button onClick={() => setActiveTab('catalog')} className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap text-left ${activeTab === 'catalog' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Product Catalog</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="mt-4 w-full px-3 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-center uppercase tracking-wider">Log Out Engine Account</button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-5xl">
        {activeTab === 'inbound' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Inbound Production Requests</h2>
            <p className="text-xs text-gray-500 mb-6">Review inbound client procurement line parameters and respond with action states.</p>
            
            <div className="space-y-4">
              {orders.filter(o => o.status === 'pending_quotation' || o.status === 'pending_buyer_approval').map(order => {
                const isExpanded = expandedOrderId === order._id;
                return (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div onClick={() => toggleCard(order._id)} className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{order.brandName} Procurement Inquiry</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-mono">Target Batch Quantity: {order.quantity} Pcs</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-black tracking-wider rounded-lg ${order.status === 'pending_quotation' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {order.status === 'pending_quotation' ? 'Awaiting Quote' : 'Quote Submitted'}
                        </span>
                        <span className="text-gray-400 text-xs font-bold">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4 bg-gray-50/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Buyer Custom Spec Sheet Design</p>
                            {order.buyerArticleUrl ? (
                              <div className="mt-1.5">
                                <img
                                  src={order.buyerArticleUrl}
                                  alt="Buyer custom spec"
                                  className="w-32 h-32 object-cover border border-gray-200 rounded-xl bg-white"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://placehold.co/150x150?text=No+Spec+Pic';
                                  }}
                                />
                                {!order.buyerArticleUrl.startsWith('data:image') && (
                                  <a
                                    href={order.buyerArticleUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-700 font-bold mt-2 inline-block hover:underline"
                                  >
                                    Open buyer image link
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div className="w-32 h-32 border border-dashed border-gray-200 rounded-xl mt-1.5 bg-gray-50 text-gray-400 text-xs flex items-center justify-center text-center px-2">
                                No sample image sent
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Additional Instructions</p>
                            <p className="text-xs text-gray-700 mt-1 bg-white border border-gray-200 p-2.5 rounded-xl h-24 overflow-y-auto">{order.specifications || "No specialized instruction overrides parsed."}</p>
                          </div>
                        </div>

                        {order.status === 'pending_quotation' && (
                          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 items-end">
                            <div className="w-full sm:w-auto flex-1">
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Set Factory Unit Price Per Unit (PKR)</label>
                              <input type="number" placeholder="e.g. 1200" className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500" value={prices[order._id] || ''} onChange={e => setPrices({...prices, [order._id]: e.target.value})} />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button onClick={() => executeAction(order._id, 'pending_buyer_approval', prices[order._id])} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-emerald-700">Submit Offer</button>
                              <button onClick={() => executeAction(order._id, 'rejected')} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-red-100">Reject</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {orders.filter(o => o.status === 'pending_quotation' || o.status === 'pending_buyer_approval').length === 0 && (
                <p className="text-xs text-gray-400 italic font-mono text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">No active inbound sourcing trajectories detected.</p>
              )}
            </div>
          </div>
        )}

      {activeTab === 'floor' && (
  <div>
    <h2 className="text-xl font-black text-gray-900 mb-1">Live Floor Production Overview</h2>
    <p className="text-xs text-gray-500 mb-6">Manage real-time production stages for accepted contracts.</p>
    
    <div className="space-y-4">
      {orders.filter(o => o.status === 'accepted').map(order => (
        <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900"> Batch for {order.buyerId?.brandName || 'Independent Retailer'}
</h4>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">Quantity: {order.quantity} Pcs</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-200">
              Current Stage: {order.currentProductionStage}
            </span>
          </div>

          {/* Phase Controller */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {['Phase 0: Cutting', 'Phase 1: Stitching', 'Phase 2: Washing', 'Phase 3: Quality Check', 'Phase 4: Dispatched'].map((stage) => (
              <button 
                key={stage}
                onClick={() => handleUpdatePhase(order._id, stage)}
                className={`text-[9px] font-bold py-2 px-3 rounded-lg uppercase transition-all ${
                  order.currentProductionStage === stage 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mark as {stage}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {orders.filter(o => o.status === 'accepted').length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">
          No active batches running on the factory floor.
        </p>
      )}
    </div>
  </div>
)}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Order History</h2>
            <p className="text-xs text-gray-500 mb-6">Review completed orders and orders that ended without approval.</p>

            <div className="space-y-4">
              {orders.filter(o => o.status === 'rejected' || o.currentProductionStage === 'Phase 4: Dispatched').map(order => {
                const completed = order.currentProductionStage === 'Phase 4: Dispatched';
                const total = Number(order.quantity || 0) * Number(order.negotiatedPricePerUnit || 0);

                return (
                  <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {order.brandName || order.buyerId?.brandName || 'Buyer'} Order
                        </h4>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Quantity: {order.quantity} Pcs</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Unit Price: PKR {order.negotiatedPricePerUnit || 'N/A'}</p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">Total: PKR {total || 0}</p>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border w-fit ${
                        completed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {completed ? 'Completed / Dispatched' : 'Ended Without Approval'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Specifications</p>
                        <p className="text-gray-700 mt-1">{order.specifications || 'No extra specifications provided.'}</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Final Stage</p>
                        <p className="text-gray-700 mt-1">{order.currentProductionStage}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {orders.filter(o => o.status === 'rejected' || o.currentProductionStage === 'Phase 4: Dispatched').length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-6 bg-white border border-dashed border-gray-300 rounded-2xl">
                  No completed or ended orders are available yet.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="relative">
            <h2 className="text-xl font-black text-gray-900 mb-1">Product Catalog Showcase</h2>
            <p className="text-xs text-gray-500 mb-6">Manage apparel articles visible to buyers in the exploration directory.</p>
            <button
              onClick={() => setShowCatalogForm(true)}
              className="absolute right-0 top-0 w-11 h-11 rounded-full bg-emerald-600 text-white text-2xl leading-none font-black shadow-sm hover:bg-emerald-700"
              title="Add catalog item"
            >
              +
            </button>

            {catalogItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {catalogItems.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.articleName}
                      className="w-full h-40 object-cover bg-gray-50"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/320x180?text=No+Pic';
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.articleName}</h4>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">MOQ: {item.moq} Pcs</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCatalogArticle(item._id)}
                          className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[10px] font-black uppercase hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-3 line-clamp-3">{item.description || "No fabric description provided."}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-12 px-5 text-center mb-6">
                <p className="text-sm font-bold text-gray-700">No catalog items uploaded yet.</p>
                <p className="text-xs text-gray-400 mt-1">Use the plus button to add your first public article.</p>
              </div>
            )}
            
            {showCatalogForm && (
            <form onSubmit={handleUploadCatalogArticle} className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Article Spec Item Name</label>
                  <input type="text" required placeholder="Premium Fleece Hoodie" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500" value={articleName} onChange={e => setArticleName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Minimum Order Quantity (MOQ)</label>
                  <input type="number" required placeholder="500" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500" value={moq} onChange={e => setMoq(e.target.value)} />
                </div>
              </div>
              
              {/* ✅ MODIFIED: File Input tracker synced with React clean lifecycle parameters to prevent layout failure */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Article Finished Product Reference Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  required={!imageUrl}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:border-emerald-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                  onChange={handleImageChange} 
                />
                {imageUrl && (
                  <div className="mt-2">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Image Preview:</p>
                    <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200 mt-1" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Fabric Specifications Details Description</label>
                <textarea rows="3" placeholder="GSM parameters, thread counts..." className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500" value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetCatalogForm();
                    setShowCatalogForm(false);
                  }}
                  className="py-3 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
                >
                  CANCEL
                </button>
                <button type="submit" className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                  PUBLISH
                </button>
              </div>
            </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManufacturerDashboard;
