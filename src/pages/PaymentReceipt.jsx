import React from 'react';

const PaymentReceipt = ({ order, milestones }) => {
  if (!order) return <p className="text-xs text-gray-400">Loading contract...</p>;

  const formatMoney = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(Number(amount || 0));

  const generatedDate = order.generatedAt || order.createdAt;
  const contractDate = generatedDate ? new Date(generatedDate) : new Date();
  const contractRef = order.receiptNumber || `ZMN-${order?._id?.slice(-6) || 'N/A'}`;

  return (
    <div className="p-1 text-gray-900 print:p-8 print:text-black">
      <div className="border-b border-gray-200 pb-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-blue-700">Zamin B2B Platform</p>
        <h3 className="font-black text-xl mt-1">Manufacturing Contract</h3>
        <p className="text-xs text-gray-500 mt-1">
          Agreement generated after the buyer accepted the manufacturer's quoted price.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 py-4 text-xs">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Contract No</p>
          <p className="font-bold font-mono">{contractRef}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Contract Date</p>
          <p className="font-bold">{contractDate.toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Order Ref</p>
          <p className="font-bold font-mono">#{order.orderId?.slice?.(-6) || order?._id?.slice?.(-6) || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
          <p className="font-bold text-emerald-700">
            {order.paymentStatus === 'paid' ? 'Paid' : 'Receipt Generated'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex justify-between bg-gray-50 px-3 py-2 text-[10px] font-black uppercase text-gray-500">
          <span>Description</span>
          <span>Amount</span>
        </div>
        <div className="flex justify-between px-3 py-3 text-xs border-t border-gray-100">
          <span className="font-bold">Manufacturing order total</span>
          <span className="font-black">{formatMoney(order.totalAmount)}</span>
        </div>
      </div>

      {milestones && milestones.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-black uppercase mb-2">Payment Plan</h4>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 px-3 py-2 text-[10px] font-black uppercase text-gray-500">
              <span>Installment</span>
              <span>Due Date</span>
              <span>Share</span>
              <span className="text-right">Amount</span>
            </div>
          {milestones.map((m, index) => (
            <div key={m._id || index} className="grid grid-cols-4 gap-2 px-3 py-3 text-[11px] text-gray-700 border-t border-gray-100">
              <span className="font-bold">{m.description}</span>
              <span>{m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'Before delivery'}</span>
              <span>{m.percentage}%</span>
              <span className="font-bold text-right">{formatMoney(m.amount)}</span>
            </div>
          ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <h4 className="text-xs font-black uppercase mb-2">Rules and Regulations</h4>
        <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-gray-700 leading-relaxed">
          <li>The manufacturer will produce the agreed order according to the buyer's submitted specifications.</li>
          <li>The buyer will make payments according to the installment plan mentioned in this contract.</li>
          <li>Production work will begin after the first installment is confirmed by both parties.</li>
          <li>Any change in quantity, design, fabric, or delivery date must be discussed and approved before production continues.</li>
          <li>The final installment must be completed before dispatch of the finished goods.</li>
          <li>This contract is generated for academic project demonstration and does not process real online payments.</li>
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8 text-[11px]">
        <div className="border-t border-gray-300 pt-2">Buyer Signature</div>
        <div className="border-t border-gray-300 pt-2">Manufacturer Signature</div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
