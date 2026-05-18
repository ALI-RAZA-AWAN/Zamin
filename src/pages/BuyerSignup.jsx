import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BuyerSignup = () => {
  const navigate = useNavigate();
  
  // State for simple inputs
  const [formData, setFormData] = useState({
    userName: '',
    brandName: '',
    email: '',
    password: ''
  });

  // State for checkboxes
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { id: 'tshirts', label: 'T-shirts' },
    { id: 'polo', label: 'Polo-shirts' },
    { id: 'hoodies', label: 'Hoodies' },
    { id: 'denim', label: 'Denim' }
  ];

  const handleCheckboxChange = (id) => {
    if (selectedNiches.includes(id)) {
      setSelectedNiches(selectedNiches.filter(item => item !== id));
    } else {
      setSelectedNiches([...selectedNiches, id]);
    }
  };

  // 🚀 UPDATED: Now asynchronously sends data to your live local Express API server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register-buyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.userName,      // Maps to backend/server.js schema parameters
          brandName: formData.brandName,
          email: formData.email,
          password: formData.password,
          niches: selectedNiches
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("Buyer registration successful! Account generated in MongoDB.");
        navigate('/login'); // Hand over control to your login terminal view
      } else {
        setErrorMessage(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Network interface error at signup:", err);
      setErrorMessage("Could not connect to the backend server. Make sure 'node server.js' is active!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex justify-center items-center p-5 font-sans text-[#4a4a4a]">
      <div className="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <div className="text-[2em] font-bold text-[#ddbd91] uppercase mb-5 text-center tracking-wider">
          Zamin
        </div>
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Brand Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#cea975]"
              required
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Brand Name</label>
            <input 
              type="text" 
              placeholder="Brand/Shop Name" 
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#cea975]"
              required
              onChange={(e) => setFormData({...formData, brandName: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Interested Categories</label>
            <div className="grid grid-cols-2 gap-3 mt-2 border border-[#eee] p-3 rounded">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center text-sm cursor-pointer hover:text-[#cea975] transition-colors">
                  <input 
                    type="checkbox" 
                    className="mr-2 accent-[#cea975]" 
                    onChange={() => handleCheckboxChange(cat.id)}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email</label>
            <input 
              type="email" 
              placeholder="buyer@example.com"
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#cea975]"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>
            <input 
              type="password" 
              placeholder="••••••"
              className="w-full p-3 border border-[#ddd] rounded focus:outline-none focus:border-[#cea975]"
              required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Conditional Rendering: Displays network connection warnings dynamically */}
          {errorMessage && (
            <div className="text-[#ff4d4d] text-sm text-center bg-red-50 border border-red-100 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="w-full p-4 bg-[#cea975] text-white rounded font-bold uppercase tracking-widest hover:bg-[#b89462] transition-all mt-4 cursor-pointer">
            Join as Buyer
          </button>
        </form>

        <div className="text-center mt-5 text-sm">
          Already have an account? <Link to="/login" className="text-[#c9ad86] font-bold hover:underline">Login instead</Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignup;