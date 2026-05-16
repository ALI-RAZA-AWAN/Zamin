import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. Learning React State: These variables hold your form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // 2. Navigation hook: This is how we switch pages in React
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(false);

    // Your logic: Redirect based on email content
    if (email.includes('factory')) {
      navigate('/dashboard/manufacturer'); // We will build this later
    } else if (email.includes('brand')) {
      navigate('/dashboard/buyer');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex justify-center items-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-[400px]">
        
        <div className="text-[2.5em] font-bold text-[#ddbd91] uppercase mb-2 text-center tracking-tighter">
          Zamin
        </div>
        <h2 className="mb-6 text-[1.2em] text-center color-[#888] tracking-[1px] font-semibold">
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
              onChange={(e) => setEmail(e.target.value)} // Learning React: Updating state
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

          <button type="submit" className="w-full p-4 bg-[#4a4a4a] text-white rounded font-bold hover:bg-[#333] transition-all">
            LOGIN
          </button>

          {/* Conditional Rendering: Only show error if error state is true */}
          {error && (
            <div className="text-[#ff4d4d] text-[0.85em] mt-2 text-center">
              Incorrect Email or Password
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