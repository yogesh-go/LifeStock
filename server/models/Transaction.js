const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },

  type: { type: String, enum: ['buy', 'sell'], required: true },
  position: { type: String, enum: ['yes', 'no'], required: true }, // yes = goal will be achieved, no = goal will fail

  shares: { type: Number, required: true },
  priceAtTransaction: { type: Number, required: true },
  pointsSpent: { type: Number, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);