import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['buyer', 'manufacturer'], // Segregates user types cleanly
    required: true 
  },
  brandName: { type: String }, // Optional: Used if user is a buyer
  niches: [{ type: String }]  // e.g., ['tshirts', 'hoodies']
}, { timestamps: true });

export default mongoose.model('User', UserSchema);