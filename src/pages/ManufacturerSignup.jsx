import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ManufacturerSignup = () => {
  const navigate = useNavigate();

  // We group all inputs into one state object for cleaner code
  const [formData, setFormData] = useState({
    username: '',
    factoryName: '',
    email: '',
    capacity: '',
    location: '',
    password: ''
  });

  // Learning React: One function to handle ALL text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Manufacturer Data:", { ...formData, role: 'Manufacturer' });
    alert("Registration successful! Waiting for Admin verification.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex justify-center items-center p-5 font-sans text-[#444]">
      <div className="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <div className="text-[2em] font-bold text-[#ddbd91] uppercase mb-5 text-center tracking-wider">
          Zamin
        </div>
        <h2 className="mb-6 text-xl font-bold text-center text-[#333]">Manufacturer Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Username</label>
            <input 
              type="text" 
              name="username"
              placeholder="Choose a username" 
              className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          {/* Factory Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Factory Name</label>
            <input 
              type="text" 
              name="factoryName"
              placeholder="Enter factory name" 
              className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="email@example.com" 
              className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          {/* Capacity & Location in a grid for Laptop, stack for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Capacity (units/mo)</label>
              <input 
                type="number" 
                name="capacity"
                placeholder="e.g. 5000" 
                className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">Location</label>
              <input 
                type="text" 
                name="location"
                placeholder="City, Country" 
                className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input 
              type="password" 
              name="password"
              className="w-full p-3 border border-[#ddd] rounded focus:ring-2 focus:ring-[#ddbd91] focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full p-4 bg-[#4a4a4a] text-white rounded font-bold uppercase tracking-widest hover:bg-[#333] transition-all transform active:scale-95 mt-4">
            Create Account
          </button>
        </form>

        <div className="text-center mt-5 text-sm">
          Already have an account? <Link to="/login" className="text-[#c9ad86] font-bold hover:underline">Login instead</Link>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerSignup;