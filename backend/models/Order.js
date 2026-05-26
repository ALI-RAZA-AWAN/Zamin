import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyerArticleUrl: { type: String, required: true }, 
  specifications: { type: String },
  status: { 
    type: String, 
    enum: ['pending_quotation', 'pending_buyer_approval', 'accepted', 'rejected'], 
    default: 'pending_quotation' 
  },
  negotiatedPricePerUnit: { type: Number, default: null },
  currentProductionStage: { 
    type: String, 
    enum: ['Phase 0: Cutting', 'Phase 1: Stitching', 'Phase 2: Washing', 'Phase 3: Quality Check', 'Phase 4: Dispatched'],
    default: 'Phase 0: Cutting'
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);