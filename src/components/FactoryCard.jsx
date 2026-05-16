import React from 'react';

// 'factory' is the Prop (the data passed down from the parent)
const FactoryCard = ({ factory }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{factory.name}</h3>
          <p className="text-gray-500 text-sm">{factory.location}</p>
        </div>
        <span className="bg-[#fbf9f5] text-[#cea975] px-2 py-1 rounded text-xs font-bold">
          ★ {factory.rating}
        </span>
      </div>

      <div className="my-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">MOQ:</span>
          <span className="font-semibold">{factory.moq}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Rates:</span>
          <span className="font-semibold text-green-600">{factory.priceRange}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {factory.offers.map((item, index) => (
          <span key={index} className="text-[10px] bg-gray-100 px-2 py-1 rounded uppercase tracking-wider text-gray-600">
            {item}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="text-sm py-2 bg-[#4a4a4a] text-white rounded hover:bg-black transition-colors">
          Request
        </button>
        <button className="text-sm py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default FactoryCard;