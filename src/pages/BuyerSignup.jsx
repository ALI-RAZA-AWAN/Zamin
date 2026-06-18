import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BuyerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submitRegister = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brandName, email, password })
      });
      const data = await res.json();
      if (data.success) {
        // Account create hone ke baad login required hai, taake JWT fresh mile.
        alert("Account setup complete! Please log in.");
        navigate('/login');
      } else { setErr(data.message || "Registration trace error."); }
    } catch (err) { setErr("Server offline context detected."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8">
        <button onClick={() => navigate('/login')} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block hover:underline">Back To Login</button>
        <h2 className="text-xl font-black text-[#B8965F]">Register as Brand Buyer</h2>
        <p className="text-xs text-gray-500 mb-6">Source apparel volume operations securely directly from verified mills.</p>

        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">{err}</div>}

        <form onSubmit={submitRegister} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Your Full Name</label>
            <input type="text" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Company / Brand Name</label>
            <input type="text" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" placeholder="Alpha Apparel" value={brandName} onChange={e => setBrandName(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Corporate Email Address</label>
            <input type="email" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Secure Password</label>
            <input type="password" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-gray-700 hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all">Register as Buyer</button>
        </form>
      </div>
    </div>
  );
}

export default BuyerSignup;
