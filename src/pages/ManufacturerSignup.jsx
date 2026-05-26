import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManufacturerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [factoryName, setFactoryName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-manufacturer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, factoryName, location, capacity, email, password })
      });
      const data = await res.json();
      if (data.success) {
        alert("Industrial Unit profile live! Log in to deploy production floor access.");
        navigate('/login');
      } else { setErr(data.message || "Trace allocation runtime error."); }
    } catch (err) { setErr("Gateway network server error."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8">
        <button onClick={() => navigate('/login')} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block hover:underline">← Return To Login</button>
        <h2 className="text-xl font-black text-emerald-900">Register Factory Unit</h2>
        <p className="text-xs text-gray-500 mb-6">List manufacturing floor facility catalog to work direct with global buyer networks.</p>
        
        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">{err}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Owner Full Name</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Factory Entity Name</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Chenab Mills" value={factoryName} onChange={e => setFactoryName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Facility Location</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="Lahore, PK" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Monthly Capacity (Pcs)</label>
              <input type="number" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" placeholder="50000" value={capacity} onChange={e => setCapacity(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Corporate Email Address</label>
            <input type="email" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Secure Password Key</label>
            <input type="password" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider">Register Factory</button>
        </form>
      </div>
    </div>
  );
}

export default ManufacturerSignup;