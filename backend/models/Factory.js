import mongoose from 'mongoose';

const FactorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // References the primary User identity document
    required: true 
  },
  name: { type: String, required: true },
  location: { type: String, required: true }, // e.g., "Lahore", "Faisalabad"
  capacity: { type: String }, // e.g., "50,000 units/month"
  category: [{ 
    type: String, 
    default: ['T-Shirts', 'Polo-shirts', 'Hoodies', 'Denim'] 
  }],
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Factory', FactorySchema);