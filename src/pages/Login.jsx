import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // Holds your form inputs reactively
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error notices

    try {
      // 1. Make a real live network fetch call to your local Express API gateway
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 2. CRITICAL STEP: Save the active session configuration token directly into the browser storage
        localStorage.setItem('zamin_user', JSON.stringify(data.user));
        
        // 3. Dynamic absolute navigation routing based on verified database roles
        if (data.user.role === 'manufacturer') {
          window.location.href = '/dashboard/manufacturer';
        } else if (data.user.role === 'buyer') {
          window.location.href = '/dashboard/buyer';
        }
      } else {
        // Display precise failure warning messages returned by MongoDB
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Authentication handshake breakdown:", err);
      setErrorMessage("Could not connect to the backend server. Make sure node server.js is running!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex justify-center items-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-[400px]">
        
        <div className="text-[2.5em] font-bold text-[#ddbd91] uppercase mb-2 text-center tracking-tighter">
          Zamin
        </div>
        <h2 className="mb-6 text-[1.2em] text-center text-[#888] tracking-[1px] font-semibold">
          WELCOME BACK
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#c9ad86]"
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#c9ad86]"
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full p-4 bg-[#4a4a4a] text-white rounded font-bold hover:bg-[#333] transition-all cursor-pointer">
            LOGIN
          </button>

          {/* Conditional Rendering: Output runtime system error alerts */}
          {errorMessage && (
            <div className="text-[#ff4d4d] text-[0.85em] mt-2 text-center bg-red-50 border border-red-100 p-2 rounded">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="flex justify-between mt-5 text-[0.85em]">
          <a href="#" className="text-[#c9ad86] hover:underline">Forgot Password?</a>
          <Link to="/" className="text-[#c9ad86] hover:underline font-bold">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;