const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },

  // Points & credibility
  totalPoints: { type: Number, default: 1000 }, // starting points to invest
  credibilityScore: { type: Number, default: 100 },

  // Category-wise scores
  categoryScores: {
    fitness: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    finance: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    career: { type: Number, default: 0 },
    personal: { type: Number, default: 0 }
  },

  goalsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  goalsInvested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);