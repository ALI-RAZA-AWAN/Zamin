import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'manufacturer'], required: true },
  factoryId: { type: String, default: null },
  brandName: { type: String, default: 'N/A' } // ✅ Yeh line add karein
}, { timestamps: true });

export default mongoose.model('User', UserSchema);