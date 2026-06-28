const mongoose = require('mongoose');

const proofSchema = new mongoose.Schema({
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  fileUrl: { type: String },
  fileType: { type: String, enum: ['image', 'video', 'document'] },
  description: { type: String, required: true },

  // AI verification
  aiVerificationScore: { type: Number, default: null }, // 0-100
  aiVerificationDetails: { type: String },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },

  flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  flagReason: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('Proof', proofSchema);