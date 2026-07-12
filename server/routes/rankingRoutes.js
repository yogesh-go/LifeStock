const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getMyRanking,
  settleGoal
} = require('../controllers/rankingController');

// @route   GET /api/ranking/global
// @desc    Get global leaderboard
// @access  Public
router.get('/global', getGlobalLeaderboard);

// @route   GET /api/ranking/category/:category
// @desc    Get category leaderboard
// @access  Public
router.get('/category/:category', getCategoryLeaderboard);

// @route   GET /api/ranking/me
// @desc    Get my ranking
// @access  Private
router.get('/me', auth, getMyRanking);

// @route   POST /api/ranking/settle/:id
// @desc    Settle a goal and distribute points
// @access  Private
router.post('/settle/:id', auth, settleGoal);

module.exports = router;