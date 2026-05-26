import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  articleName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  moq: { type: Number, required: true },
  description: { type: String }
});

const FactorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String, default: 'Lahore' },
  capacity: { type: Number, required: true },
  uploadedArticles: [ArticleSchema]
}, { timestamps: true });

export default mongoose.model('Factory', FactorySchema);