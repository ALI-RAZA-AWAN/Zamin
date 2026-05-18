import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  factoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Factory', 
    required: true 
  },
  productTitle: { type: String, required: true }, // e.g., "Premium Fleece Hoodies"
  orderQuantity: { type: Number, required: true, min: 1 },
  specifications: { type: String, required: true }, // Fabric demands, GSM weights, colors
  status: { 
    type: String, 
    enum: ['pending_approval', 'active', 'rejected', 'completed'], 
    default: 'pending_approval' 
  },
  currentProductionStage: { 
    type: Number, 
    min: 0, 
    max: 4, 
    default: 0 // Index maps to: 0=Sample, 1=Cutting, 2=Stitching, 3=QA, 4=Shipped
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);