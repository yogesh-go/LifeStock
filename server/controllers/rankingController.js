const User = require('../models/User');
const Ranking = require('../models/Ranking');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

// UPDATE RANKINGS (called after goal settlement)
exports.updateRankings = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      let ranking = await Ranking.findOne({ user: user._id });

      if (!ranking) {
        ranking = new Ranking({ user: user._id });
      }

      // Update global score from user's totalPoints
      ranking.globalScore = user.totalPoints;

      // Update category scores
      ranking.categoryRanks.fitness.score = user.categoryScores.fitness;
      ranking.categoryRanks.education.score = user.categoryScores.education;
      ranking.categoryRanks.finance.score = user.categoryScores.finance;
      ranking.categoryRanks.health.score = user.categoryScores.health;
      ranking.categoryRanks.career.score = user.categoryScores.career;
      ranking.categoryRanks.personal.score = user.categoryScores.personal;

      // Save rank history snapshot
      ranking.rankHistory.push({
        rank: ranking.globalRank,
        score: ranking.globalScore
      });

      await ranking.save();
    }

    // Update global ranks based on totalPoints
    const sortedUsers = await User.find().sort({ totalPoints: -1 });
    for (let i = 0; i < sortedUsers.length; i++) {
      await Ranking.findOneAndUpdate(
        { user: sortedUsers[i]._id },
        { globalRank: i + 1 }
      );
    }

    console.log('Rankings updated successfully');
  } catch (err) {
    console.error('Ranking update error:', err.message);
  }
};

// GET GLOBAL LEADERBOARD
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const rankings = await Ranking.find()
      .populate('user', 'name avatar totalPoints credibilityScore')
      .sort({ globalScore: -1 })
      .limit(50);

    res.json(rankings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET CATEGORY LEADERBOARD
exports.getCategoryLeaderboard = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ['fitness', 'education', 'finance', 'health', 'career', 'personal'];
    if (!validCategories.includes(category))
      return res.status(400).json({ msg: 'Invalid category' });

    const rankings = await Ranking.find()
      .populate('user', 'name avatar totalPoints')
      .sort({ [`categoryRanks.${category}.score`]: -1 })
      .limit(50);

    res.json(rankings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET MY RANKING
exports.getMyRanking = async (req, res) => {
  try {
    let ranking = await Ranking.findOne({ user: req.user.id })
      .populate('user', 'name avatar totalPoints credibilityScore');

    if (!ranking) {
      return res.status(404).json({ msg: 'Ranking not found, make some transactions first' });
    }

    res.json(ranking);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// SETTLE GOAL — distribute points after deadline
exports.settleGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });

    if (goal.status !== 'achieved' && goal.status !== 'failed')
      return res.status(400).json({ msg: 'Goal must be achieved or failed to settle' });

    // Get all transactions for this goal
    const transactions = await Transaction.find({ goal: goal._id });

    for (const transaction of transactions) {
      const user = await User.findById(transaction.user);
      if (!user) continue;

      let pointsEarned = 0;

      if (goal.status === 'achieved' && transaction.position === 'yes') {
        // YES holders win — earn 2x points
        pointsEarned = transaction.pointsSpent * 2;
      } else if (goal.status === 'failed' && transaction.position === 'no') {
        // NO holders win — earn 2x points
        pointsEarned = transaction.pointsSpent * 2;
      }

      if (pointsEarned > 0) {
        user.totalPoints += pointsEarned;

        // Update category score
        const category = goal.category;
        user.categoryScores[category] += pointsEarned;

        await user.save();
      }
    }

    // Update rankings after settlement
    const { updateRankings } = require('./rankingController');
    await updateRankings();

    res.json({ msg: `Goal settled successfully. Winners have been rewarded.` });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};