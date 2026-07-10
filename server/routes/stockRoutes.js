const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  buyShares,
  getStockData,
  getMyTransactions
} = require('../controllers/stockController');

// @route   POST /api/stock/:id/buy
// @desc    Buy shares in a goal
// @access  Private
router.post('/:id/buy', auth, buyShares);

// @route   GET /api/stock/:id
// @desc    Get stock price and history for a goal
// @access  Public
router.get('/:id', getStockData);

// @route   GET /api/stock/transactions/my
// @desc    Get my transactions
// @access  Private
router.get('/transactions/my', auth, getMyTransactions);

module.exports = router;