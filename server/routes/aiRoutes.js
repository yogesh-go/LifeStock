const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  categorizeGoal,
  verifyProof,
  generateGoalSuggestions
} = require('../controllers/aiController');

// @route   POST /api/ai/categorize
// @desc    Categorize a goal using AI
// @access  Private
router.post('/categorize', auth, categorizeGoal);

// @route   POST /api/ai/verify
// @desc    Verify a proof using AI
// @access  Private
router.post('/verify', auth, verifyProof);

// @route   POST /api/ai/suggestions
// @desc    Generate goal suggestions
// @access  Private
router.post('/suggestions', auth, generateGoalSuggestions);

module.exports = router;