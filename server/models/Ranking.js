const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Global rank
  globalRank: { type: Number, default: 0 },
  globalScore: { type: Number, default: 0 },

  // Category wise ranks
  categoryRanks: {
    fitness: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    education: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    finance: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    health: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    career: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    personal: { rank: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
  },

  // History
  rankHistory: [
    {
      rank: Number,
      score: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('Ranking', rankingSchema);