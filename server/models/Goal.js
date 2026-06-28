const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['fitness', 'education', 'finance', 'health', 'career', 'personal'],
    required: true
  },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'achieved', 'failed', 'under_review'],
    default: 'active'
  },

  // Stock market fields
  stockPrice: { type: Number, default: 50 },
  buyerCount: { type: Number, default: 0 },
  sellerCount: { type: Number, default: 0 },
  totalShares: { type: Number, default: 0 },
  priceHistory: [
    {
      price: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ],

  // AI fields
  aiCategory: { type: String },
  aiConfidenceScore: { type: Number },
  inputType: { type: String, enum: ['text', 'voice'], default: 'text' },
  rawVoiceUrl: { type: String },

  proofs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proof' }],

}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);