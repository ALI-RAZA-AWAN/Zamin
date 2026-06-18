import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FactoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factory, setFactory] = useState(null);
  const [buyer, setBuyer] = useState(null);

  // Buyer proposal ki basic fields yahan local state me rakhi gayi hain.
  const [quantity, setQuantity] = useState('');
  const [buyerArticleUrl, setBuyerArticleUrl] = useState('');
  const [buyerArticleFileName, setBuyerArticleFileName] = useState('');
  const [specifications, setSpecifications] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('zaminUser');
    if (!raw) { navigate('/login'); return; }
    setBuyer(JSON.parse(raw));

    fetchFactoryProfile();
  }, [id]);

 const fetchFactoryProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/factories/${id}`); 
      const data = await res.json();
      if (data.success) setFactory(data.factory);
    } catch (e) { console.error("Fetch Error:", e); }
  };

  const handleBuyerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBuyerArticleUrl(reader.result);
      setBuyerArticleFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleBuyerImageUrlChange = (e) => {
    setBuyerArticleUrl(e.target.value);
    setBuyerArticleFileName('');
  };

  const executeSubmitProposal = async (e) => {
    e.preventDefault();
    if (!buyerArticleUrl.trim()) {
      alert("Please upload a sample image or paste an image link before sending the proposal.");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/orders/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: buyer.id,
          factoryId: id,
          brandName: buyer.brandName || "Independent Retailer",
          quantity: Number(quantity),
          buyerArticleUrl: buyerArticleUrl.trim(),
          specifications
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Sourcing proposal pipeline post trace dispatched onto factory queue parameters.");
        navigate('/dashboard-buyer');
      }
    } catch (e) { console.error(e); }
  };

  if (!factory) return <div className="p-8 text-xs font-mono text-gray-500 text-center">Parsing target facility structural matrix profiles...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 md:p-8 max-w-4xl mx-auto text-gray-800">
      <button onClick={() => navigate('/dashboard-buyer')} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 block hover:underline">← Exit Infrastructure View</button>
      
      {/* Factory ki basic information buyer ko proposal se pehle dikhai jati hai. */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">{factory.name}</h1>
          <p className="text-xs text-gray-500 mt-0.5">📍 Terminal Location Base Point: {factory.location}</p>
        </div>
        <div className="text-left sm:text-right font-mono text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 shrink-0">
          <span className="text-gray-400 text-[9px] uppercase font-bold block">Capacity Index Boundary</span>
          {factory.capacity} Finished Pieces / Month Max
        </div>
      </div>

      {/* Factory ke uploaded catalog articles buyer ko reference ke liye milte hain. */}
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">Mill Sample Capabilities Inventory</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {factory.uploadedArticles?.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3.5 flex gap-3.5 items-center">
            <img src={item.imageUrl} alt={item.articleName} className="w-20 h-20 object-cover bg-gray-50 border border-gray-100 rounded-xl shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Pic'; }} />
            <div>
              <h5 className="text-xs font-bold text-gray-900">{item.articleName}</h5>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Minimum Batch (MOQ): {item.moq} Pcs</p>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{item.description || "No specific capability overrides detailed."}</p>
            </div>
          </div>
        ))}
        {(!factory.uploadedArticles || factory.uploadedArticles.length === 0) && (
          <p className="col-span-2 text-xs italic text-gray-400 font-mono py-4 text-center bg-white border border-dashed border-gray-200 rounded-2xl">This facility cluster has not published sample inventory templates onto catalog index nodes.</p>
        )}
      </div>

      {/* Buyer yahan quantity, image/link aur requirements ke sath proposal send karta hai. */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Issue Sourcing Batch Proposal Request</h3>
        <p className="text-xs text-gray-500 mb-4">Transmit custom production sheet inputs to target entity queue arrays.</p>
        
        <form onSubmit={executeSubmitProposal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Required Production Quantity (Pcs)</label>
              <input type="number" required placeholder="e.g. 1000" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Target Spec Design Sample Image Link</label>
              <input type="url" placeholder="https://images.com/my-design.png" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono" value={buyerArticleFileName ? '' : buyerArticleUrl} onChange={handleBuyerImageUrlChange} />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Upload Sample Image From Device</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleBuyerImageChange}
            />
            {buyerArticleUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img src={buyerArticleUrl} alt="Buyer sample preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200 bg-white" onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x120?text=Preview'; }} />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Sample Preview</p>
                  <p className="text-[11px] text-gray-600 font-mono break-all">{buyerArticleFileName || buyerArticleUrl}</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Specialized Fabrication & Custom Thread Requirements</label>
            <textarea rows="3" placeholder="Specify yarn ratios, custom tag positions, packing configurations instructions overrides..." className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs" value={specifications} onChange={e => setSpecifications(e.target.value)}></textarea>
          </div>
          <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all">Submit Production Proposal</button>
        </form>
      </div>
    </div>
  );
}

export default FactoryDetailsPage;
