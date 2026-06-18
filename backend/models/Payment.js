import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
  receiptNumber: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['receipt_generated', 'paid'],
    default: 'receipt_generated'
  },
  generatedAt: { type: Date, default: Date.now },
  milestones: [
    {
      milestoneNumber: { type: Number, required: true }, // Installment ka sequence number.
      description: { type: String, required: true },     // Installment kis kaam ke liye hai.
      percentage: { type: Number, required: true },      // Total amount ka kitna percent pay hoga.
      amount: { type: Number, required: true },
      status: { type: String, enum: ['unpaid', 'paid_escrow', 'released_to_factory'], default: 'unpaid' },
      dueDate: { type: Date },
      paidAt: { type: Date }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
