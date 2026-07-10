const Goal = require('../models/Goal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Calculate new stock price
const calculatePrice = (buyerCount, sellerCount) => {
  const total = buyerCount + sellerCount;
  if (total === 0) return 50;
  return Math.round((buyerCount / total) * 100);
};

// BUY SHARES
exports.buyShares = async (req, res) => {
  try {
    const { position, shares } = req.body;
    const goalId = req.params.id;

    // Get goal
    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.status !== 'active') return res.status(400).json({ msg: 'Goal is not active' });

    // Get user
    const user = await User.findById(req.user.id);

    // Calculate cost
    const cost = shares * goal.stockPrice;

    // Check if user has enough points
    if (user.totalPoints < cost)
      return res.status(400).json({ msg: 'Not enough points' });

    // Update buyer/seller count
    if (position === 'yes') {
      goal.buyerCount += shares;
    } else {
      goal.sellerCount += shares;
    }

    // Calculate new price
    const newPrice = calculatePrice(goal.buyerCount, goal.sellerCount);

    // Update price history
    goal.stockPrice = newPrice;
    goal.totalShares += shares;
    goal.priceHistory.push({ price: newPrice });

    await goal.save();

    // Deduct points from user
    user.totalPoints -= cost;
    if (!user.goalsInvested.includes(goalId)) {
      user.goalsInvested.push(goalId);
    }
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      goal: goalId,
      type: 'buy',
      position,
      shares,
      priceAtTransaction: goal.stockPrice,
      pointsSpent: cost
    });
    await transaction.save();

    // Emit real-time price update to all users watching this goal
    const io = req.app.get('io');
    io.to(goalId).emit('priceUpdate', {
      goalId,
      newPrice,
      buyerCount: goal.buyerCount,
      sellerCount: goal.sellerCount,
      totalShares: goal.totalShares
    });

    res.json({
      msg: 'Shares bought successfully',
      newPrice,
      pointsSpent: cost,
      remainingPoints: user.totalPoints,
      transaction
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET STOCK PRICE + HISTORY
exports.getStockData = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .select('title stockPrice buyerCount sellerCount totalShares priceHistory status');

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET MY TRANSACTIONS
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('goal', 'title stockPrice status category')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};