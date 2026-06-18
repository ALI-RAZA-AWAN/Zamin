import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const executeLogin = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        // Login successful ho to user data aur token browser me save karte hain.
        localStorage.setItem('zaminUser', JSON.stringify({ ...data.user, token: data.token }));
        localStorage.setItem('zaminToken', data.token);
        if (data.user.role === 'buyer') navigate('/dashboard-buyer');
        else navigate('/dashboard-manufacturer');
      } else {
        setErr(data.message || "Invalid account credentials entered.");
      }
    } catch (err) { setErr("Cannot link to server gateway terminal."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#B8965F] tracking-tight text-center">ZAMIN PLATFORM</h1>
        <p className="text-xs text-gray-500 text-center mt-1 mb-6">B2B Textile Sourcing Network Marketplace</p>

        {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium">{err}</div>}

        <form onSubmit={executeLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Email Address</label>
            <input type="email" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Password</label>
            <input type="password" required className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-gray-700 hover:bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all">Secure Sign In</button>
        </form>
        <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col gap-2 text-center">
          <button onClick={() => navigate('/signup-buyer')} className="text-xs text-emerald-600 font-semibold hover:underline">Create Brand / Buyer Account</button>
          <button onClick={() => navigate('/signup-manufacturer')} className="text-xs text-emerald-600 font-semibold hover:underline">Register Industrial Mill Unit</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
