const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createGoal,
  getGoals,
  getGoalById,
  getMyGoals,
  deleteGoal
} = require('../controllers/goalController');

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, createGoal);

// @route   GET /api/goals
// @desc    Get all goals (with optional filters)
// @access  Public
router.get('/', getGoals);

// @route   GET /api/goals/my
// @desc    Get logged in user's goals
// @access  Private
router.get('/my', auth, getMyGoals);

// @route   GET /api/goals/:id
// @desc    Get single goal by ID
// @access  Public
router.get('/:id', getGoalById);

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, deleteGoal);

module.exports = router;