const Goal = require('../models/Goal');
const User = require('../models/User');

// CREATE GOAL
exports.createGoal = async (req, res) => {
  try {
    const { title, description, category, deadline } = req.body;

    const goal = new Goal({
      creator: req.user.id,
      title,
      description,
      category,
      deadline: new Date(deadline),
      priceHistory: [{ price: 50 }]
    });

    await goal.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { goalsCreated: goal._id }
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET ALL GOALS
exports.getGoals = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const goals = await Goal.find(filter)
      .populate('creator', 'name avatar credibilityScore')
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET SINGLE GOAL
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('creator', 'name avatar credibilityScore');

    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET MY GOALS
exports.getMyGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ creator: req.user.id })
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE GOAL
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    // only creator can delete
    if (goal.creator.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await goal.deleteOne();

    res.json({ msg: 'Goal removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};