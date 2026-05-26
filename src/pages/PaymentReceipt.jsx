import React from 'react';

const PaymentReceipt = ({ order, milestones }) => {
  // 1. Safety Guard: Agar order ya milestones missing ho toh error handle karein
  if (!order) return <p className="text-xs text-gray-400">Loading payment details...</p>;

  return (
    <div className="p-2">
      <h3 className="font-black text-lg mb-2 text-gray-900">Milestone Payment Tracker</h3>
      
      {/* 2. Safe access with optional chaining */}
      <p className="text-xs text-gray-500 mb-4 font-mono">
        Order Reference: #{order?._id?.slice(-6) || 'N/A'}
      </p>
      
      {/* 3. Milestones list logic */}
      {milestones && milestones.length > 0 ? (
        <div className="space-y-3">
          {milestones.map((m, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="font-bold text-sm text-gray-800">{m.description}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {m.percentage}% of contract value
                </p>
              </div>
              
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                m.status === 'paid_escrow' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {m.status === 'paid_escrow' ? 'Paid' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center border border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400 italic">No milestones defined for this contract yet.</p>
        </div>
      )}
      
      {/* 4. Footer Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-700 leading-relaxed font-medium">
        <strong>Important:</strong> Production at the mill floor will initiate automatically once the first milestone is verified by the administrator.
      </div>
    </div>
  );
};

export default PaymentReceipt;